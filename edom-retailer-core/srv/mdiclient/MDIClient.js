const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const mdiError = require('../lib/businesspartner/MDIClientErrorMessages');
const MDIRequest = require('./MDIRequest');
const mdiClientOutboundHelper = require('./MDIClientOutboundHelper');
const mdiClientInboundHelper = require('./MDIClientInboundHelper');
const {
    getEnabledFeatures,
    getBundle,
    cacheDestinations,
} = require('../lib/helper');
const { getNextLink } = require('./MDIClientHelper');
const MDIClientInbound = require('./MDIClientInbound');
const bpHelper = require('../lib/businesspartner/businessPartnerHelper');
const EventMeshMessage = require('../event/EventMeshMessage');
const {
    types: bpEmTypesHashMap,
    topics: bpEmTopicsHashMap,
} = require('../event/BusinessPartnerTypesTopics.json');

const i18nPath = '../../_i18n/i18n';

const bpSrv = 'BusinessPartnerService';
const bpBetaSrv = 'BusinessPartnerServiceBeta';
const bpIntSrv = 'BusinessPartnerServiceInternal';
const bpBetaEntity = `${bpBetaSrv}.BusinessPartner`;
const BUSPARTNER = 'BP';
const PRODUCT = 'PR';

const bpBetaFeatureFlag = 'business-partner-enhancements';
const c4ufLocalIdsFeatureFlag = 'c4uf-localids';
const bpMessagingFlag = 'business-partner-messaging';

async function setupBpTxConfig(isBpBeta = false) {
    const BusinessPartnerServiceExternal = await cds.connect.to(bpSrv);
    const BusinessPartnerServiceInternal = await cds.connect.to(bpIntSrv);
    const privilegedUser = new cds.User.Privileged();

    // switch between BP service and BP beta servic
    let bpServiceExternal = BusinessPartnerServiceExternal;
    if (isBpBeta) {
        const BusinessPartnerBetaServiceExternal = await cds.connect.to(
            bpBetaSrv
        );
        bpServiceExternal = BusinessPartnerBetaServiceExternal;
    }

    // this could be improved with latest CAP improvements (~5.5.x) on how to handle manual transactions
    return (req) => ({
        internal: {
            bpService: BusinessPartnerServiceInternal,
            tx: BusinessPartnerServiceInternal.transaction({
                uuid: cds.utils.uuid(),
                user: privilegedUser,
                tenant: req.tenant,
            }),
            bpEntity: BusinessPartnerServiceInternal.entities.BusinessPartner,
        },
        external: {
            bpService: bpServiceExternal,
            tx: bpServiceExternal.transaction({
                uuid: cds.utils.uuid(),
                user: privilegedUser,
                tenant: req.tenant,
            }),
            bpEntity: bpServiceExternal.entities.BusinessPartner,
        },
    });
}

function processBpInstances(
    value,
    req,
    bpTxConfig,
    helper,
    enabledFeatures,
    destinationConfig,
    emMessage
) {
    const { bpService } = bpTxConfig(req).external;

    // Group BusinessPartner instances into buckets based on event and changeToken
    const {
        confirmInstanceIds,
        createInstanceIds,
        updateInstanceIds,
        rejectInstanceChangeTokens,
    } = helper.extractLog(value, bpService);

    let mdiInboundStage = 'createBPs';
    helper
        .createBPs(
            createInstanceIds,
            req,
            bpTxConfig,
            destinationConfig,
            emMessage
        )
        .then(() => {
            mdiInboundStage = 'rejectBPs';
            return helper.rejectBPs(
                rejectInstanceChangeTokens,
                req,
                bpTxConfig
            );
        })
        .then(() => {
            mdiInboundStage = 'confirmBPs';
            return helper.confirmBPs(
                confirmInstanceIds,
                req,
                bpTxConfig,
                enabledFeatures,
                destinationConfig
            );
        })
        .then(() => {
            mdiInboundStage = 'updatedBPs';
            return helper.updateBPs(
                updateInstanceIds,
                req,
                bpTxConfig,
                destinationConfig,
                emMessage
            );
        })
        .then(() => {
            mdiInboundStage = 'sendPendingBPs';
            return helper.sendPendingBPs(req, bpTxConfig, enabledFeatures);
        })
        .then(() => {
            mdiInboundStage = 'sendLocalIds';
            return helper.sendLocalIds(req, bpTxConfig, destinationConfig);
        })
        .catch((e) => {
            logger.error(`[MDIClient][Read][${mdiInboundStage}]: ${e.message}`);
        });
}

module.exports = async (srv) => {
    const { DeltaTokenBookKeeping } = srv.entities(
        'sap.c4u.foundation.retailer.mdiclient'
    );
    /**
     * Retrieves the last stored delta token value
     * @param {Object} cds.Request - Request Object.
     * @param {enum} type - Type of DeltaTokenBookKeeping, e.g. 'BP', 'PR'.
     * @return {Promise<string>} - Delta Token value.
     */
    async function getlastDeltaToken(req, type) {
        const tx = srv.transaction(req);
        try {
            const lastDeltaToken = await tx.run(
                SELECT.one(['deltaToken'])
                    .from(DeltaTokenBookKeeping)
                    .where({ type })
                    .orderBy({ createdAt: 'desc' })
            );
            await tx.commit();

            return lastDeltaToken ? lastDeltaToken.deltaToken : null;
        } catch (error) {
            logger.error(
                `[MDIClient][getlastDeltaToken][Error]: ${error.message}`
            );
            await tx.rollback();
            return null;
        }
    }

    // Business Partner create listener
    srv.on('BPCreated', async (event) => {
        const { req } = event.data;
        const bpTxConfig = await setupBpTxConfig(req.entity === bpBetaEntity);

        const enabledFeatures = await getEnabledFeatures(req, [
            bpBetaFeatureFlag,
            c4ufLocalIdsFeatureFlag,
            bpMessagingFlag,
        ]);

        const { extractBpEntityId } = bpHelper(enabledFeatures);

        const { getBpBookkeeping, postBPToMDI } =
            mdiClientOutboundHelper(enabledFeatures);

        const bpId = extractBpEntityId(req);
        const bpWithBookkeeping = await getBpBookkeeping(req, bpId);
        const bookkeeping = bpWithBookkeeping?.mdiBookKeeping || {};

        // New BP Created. Send change request to MDI
        if (typeof bookkeeping.status === 'undefined') {
            if (enabledFeatures.includes(c4ufLocalIdsFeatureFlag)) {
                await postBPToMDI(req, bpTxConfig, 'create');
            } else {
                await postBPToMDI(req, bpTxConfig);
            }
        }
    });

    // Business Partner update listener
    srv.on('BPUpdated', async (event) => {
        const { req } = event.data;
        const bpTxConfig = await setupBpTxConfig(req.entity === bpBetaEntity);

        const enabledFeatures = await getEnabledFeatures(req, [
            bpBetaFeatureFlag,
            c4ufLocalIdsFeatureFlag,
            bpMessagingFlag,
        ]);

        const { extractBpEntityId } = bpHelper(enabledFeatures);
        const { getBpBookkeeping, updateBPtoMDI, setBookkeepingPendingStatus } =
            mdiClientOutboundHelper(enabledFeatures);

        const bpId = extractBpEntityId(req);
        const bpWithBookkeeping = await getBpBookkeeping(req, bpId);
        const bookkeeping = bpWithBookkeeping?.mdiBookKeeping || {};

        // Existing BP Updated. Send change request to MDI
        if (bookkeeping.status !== 'sent') {
            await updateBPtoMDI(req, bookkeeping, bpTxConfig);
        }
        // POST/PUT/PATCH/DELETE on 'sent' BP sub-entity. Set the pending flag to true in this case
        else {
            await setBookkeepingPendingStatus(req, bpTxConfig, true);
        }
    });

    /**
     * Performes MDI Products replication in C4UF.
     * Outcome: products from MDI are loaded into the database.
     * @param {Object} cds.Request - Request Object.
     */
    srv.on('replicateProducts', async (req) => {
        const { tenant } = req.user;
        const bundle = getBundle(req, i18nPath);
        const featureFlag = await cds.connect.to('featureFlags');
        const result = await featureFlag.evaluate(
            'mdi-product-integration',
            tenant
        );

        if (result === false) {
            req.reject({
                status: 404,
                message: `${bundle.getText('errorMsgMDIServiceNotFound')}`,
            });
        }

        try {
            const mdiDestService = await cds.connect.to('MdiDestination');
            const maxPageSize = req.data?.maxPageSize || 100;

            if (!mdiDestService) {
                throw new Error(
                    `${bundle.getText('errorMsgMDIDestinationNotConfigured')}`
                );
            }

            const mdiDest = await cacheDestinations(req, mdiDestService);

            if (!mdiDest) {
                throw new Error(
                    `${bundle.getText('errorMsgMDIDestinationNotConfigured')}`
                );
            }

            const { MDIProductLogAPI } =
                mdiDest.originalProperties.destinationConfiguration;

            if (!MDIProductLogAPI) {
                throw new Error(
                    `${bundle.getText('errorMsgMDIDestinationNotConfigured', [
                        'MDIProductLogAPI',
                    ])}`
                );
            }

            const logRequest = new MDIRequest(
                req,
                'GET',
                'events'
            ).buildProduct(mdiDest.url, MDIProductLogAPI);

            const token = await getlastDeltaToken(req, PRODUCT);

            const { API_EDOM_RETAILER } = cds.services;
            const { Product } = API_EDOM_RETAILER.entities;

            const mdiClientInbound = new MDIClientInbound(
                req,
                API_EDOM_RETAILER,
                Product,
                'sap.odm.product.Product',
                maxPageSize
            );

            const errorResponse = await mdiClientInbound.replicate(
                mdiDest,
                token,
                logRequest,
                PRODUCT
            );

            logger.info(
                `[MDIClient][replicateProducts]: 
                "Total amount of created products":  ${mdiClientInbound.status.created},
                "Total amount of updated products":  ${mdiClientInbound.status.updated},
                "Total amount of non-replicated products":  ${mdiClientInbound.status.failed}`
            );

            return {
                Created: mdiClientInbound.status.created,
                Updated: mdiClientInbound.status.updated,
                Failed: mdiClientInbound.status.failed,
                Errors: errorResponse,
            };
        } catch (err) {
            logger.error(
                `[MDIClient][replicateProducts][Error]: ${err.message}`
            );
            req.reject({
                code: 400,
                message: err.message,
            });
        }

        return {
            Created: 0,
            Updated: 0,
            Failed: 0,
        };
    });

    const bpMessagingService = await cds.connect.to('businessPartnerMessaging');
    const bpEmMessage = new EventMeshMessage(
        bpMessagingService,
        bpEmTypesHashMap,
        bpEmTopicsHashMap
    );

    let mdiInboundStage;
    // MDIClient read listener
    srv.on('READ', 'MDIClient', async (req, next) => {
        const bpTxConfig = await setupBpTxConfig();
        const enabledFeatures = await getEnabledFeatures(req, [
            'mdi-client-enhancements',
            c4ufLocalIdsFeatureFlag,
            bpMessagingFlag,
        ]);
        // helper would contain the version of helper functions with enabled feature flags
        const helper = mdiClientInboundHelper(enabledFeatures);

        const bundle = getBundle(req, i18nPath);
        const error = mdiError(enabledFeatures)(bundle);

        try {
            let moreData = true;
            mdiInboundStage = 'BusinessPartnerMDISelectDeltaTokenBookKeeping';
            let deltaToken = await getlastDeltaToken(req, BUSPARTNER);

            mdiInboundStage = 'BusinessPartnerMDIGetDestination';
            const mdiDestService = await cds.connect.to('MdiDestination');
            const mdiDest = await cacheDestinations(req, mdiDestService);

            const bpKeyMappingDestService = await cds.connect.to(
                'BusinessPartnerKeyMappingService'
            );
            const bpKeyMappingDest = await cacheDestinations(
                req,
                bpKeyMappingDestService
            );

            const { s4BusinessSystem, c4ufBusinessSystem } =
                bpKeyMappingDest.originalProperties.destinationConfiguration;

            mdiInboundStage = 'BusinessPartnerMDIBuildMDIRequest';
            const logRequest = new MDIRequest(req, 'GET', 'events').build({
                url: mdiDest.url,
                mdiBusPar: 'sap.odm.businesspartner.BusinessPartner',
            });
            const baseRequest = logRequest.query;

            const maxPageSize = req.data?.maxPageSize || 100;
            const { BusinessPartnerService } = cds.services;
            const { BusinessPartner } = BusinessPartnerService.entities;
            const mdiClientInbound = new MDIClientInbound(
                req,
                BusinessPartnerService,
                BusinessPartner,
                'sap.odm.businesspartner.BusinessPartner',
                maxPageSize
            );
            const accessToken = mdiDest.authTokens[0].value;

            while (moreData) {
                mdiInboundStage = 'BusinessPartnerMDIRunMDIRequest';
                /*
                 * Difference between Initial Load & Delta Load
                 * If deltaToken is false, we treat the request as an Initial Load
                 * If deltaToken has some value other than false, we treat the request as Delta Load
                 */
                const logRequestUrl = deltaToken
                    ? `${baseRequest}?$deltatoken=${deltaToken}`
                    : logRequest.query;
                /*
                 * Disabling ESLint for await-in-loop as we need the response of the call to decide on the next iteration
                 */
                /* eslint-disable no-await-in-loop */
                // eslint-disable-next-line no-underscore-dangle
                const response = await mdiClientInbound._retrieveInstances(
                    logRequestUrl,
                    accessToken
                );
                const { value } = response;
                const { nextLink, finalToken } = getNextLink(response);
                deltaToken = finalToken;
                /* eslint-enable no-await-in-loop */

                /* eslint-disable */
                if (value.length) {
                    mdiInboundStage = 'BusinessPartnerMDIProcessBpInstances';
                    processBpInstances(
                        value,
                        req,
                        bpTxConfig,
                        helper,
                        enabledFeatures,
                        {
                            s4BusinessSystem,
                            c4ufBusinessSystem,
                        },
                        bpEmMessage
                    );

                    mdiInboundStage =
                        'BusinessPartnerMDIInsertDeltaTokenBookKeeping';
                    await cds.transaction(req).run(
                        INSERT.into(DeltaTokenBookKeeping, {
                            deltaToken,
                            status: 'success',
                            type: 'BP',
                            createdAt: Date.now(),
                        })
                    );

                    if (nextLink === undefined) {
                        moreData = false;
                    }
                } else {
                    mdiInboundStage = 'BusinessPartnerMDIProcessBpInstances';
                    helper
                        .sendPendingBPs(req, bpTxConfig, enabledFeatures)
                        .catch((e) => {
                            logger.error(
                                `[MDIClient][Read][MDINoValue][sendPendingBPs]: ${e.message}`
                            );
                        });
                    moreData = false;
                }
            }
            /* eslint-enable */
            mdiInboundStage = 'BusinessPartnerMDIMdiNext';
            await next(req);
        } catch (err) {
            logger.error(
                `[MDIClient][Read][${mdiInboundStage}]: ${err.message}`
            );
            req.reject(
                error[mdiInboundStage].code,
                error[mdiInboundStage].message
            );
        }
    });
};
