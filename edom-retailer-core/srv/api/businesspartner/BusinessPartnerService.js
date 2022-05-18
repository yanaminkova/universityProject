const logger = require('cf-nodejs-logging-support');
const bpError = require('../../lib/businesspartner/BusinessPartnerErrorMessages');
const AuditLogService = require('../../dpp/AuditLogService');
const bpValidHelper = require('../../lib/businesspartner/businessPartnerValidationHelper');
const bpHelper = require('../../lib/businesspartner/businessPartnerHelper');
const {
    getEnabledFeaturesSet,
    getBundle,
    groupAnnotatedServiceEntities,
} = require('../../lib/helper');
const EventMeshMessage = require('../../event/EventMeshMessage');
const {
    types: bpEmTypesHashMap,
    topics: bpEmTopicsHashMap,
} = require('../../event/BusinessPartnerTypesTopics.json');

const i18nPath = '../../_i18n/i18n';

const bpTable = 'sap.odm.businesspartner.BusinessPartner';
const bpSrv = 'BusinessPartnerService';
const bpBetaSrv = 'BusinessPartnerServiceBeta';
const bpEntity = `${bpSrv}.BusinessPartner`;
const bpBetaEntity = `${bpBetaSrv}.BusinessPartner`;

const bpBetaFeatureFlag = 'business-partner-enhancements';
const c4ufLocalIdsFeatureFlag = 'c4uf-localids';
const bpMessagingFlag = 'business-partner-messaging';

// Legend:
// [BETA] = need to update line/s below when moving (from beta) to release

const requestToBpEntity = (path) => path === bpEntity || path === bpBetaEntity;

const requestToBpSubentity = (path) =>
    path.startsWith(`${bpEntity}/`) || path.startsWith(`${bpBetaEntity}/`);

async function beforeCreateHandler(req, srv, enabledFeatures) {
    // helper would contain the version of helper functions with enabled feature flags
    const helper = {
        ...bpValidHelper(enabledFeatures),
        ...bpHelper(enabledFeatures),
    };

    const isFromSubEntity = requestToBpSubentity(req.path);

    // For validation, calls on Business Partner subentities will create a
    //   constructedBP that will have the new subentity attached. The
    //   validations will use this constructedBP
    if (isFromSubEntity) {
        const bpId = helper.extractBpEntityId(req);

        const bpWithBookkeeping = await helper.getExpandedBP(
            bpId,
            helper.getExpandedBpMdiBookKeepingQuery
        );
        // if bpWithBookkeeping is null, it means BP is not found. Do not throw an error
        // if mdiBookKeeping field is null, throw an error right away
        if (bpWithBookkeeping && !bpWithBookkeeping.mdiBookKeeping) {
            // error would contain the updated error messages if feature flags are enabled
            const bundle = getBundle(req, i18nPath);
            const error = bpError(enabledFeatures)(bundle);

            req.reject(
                error.BusinessPartnerSRVMissingMdiBookkeeping.code,
                error.BusinessPartnerSRVMissingMdiBookkeeping.message
            );
        }

        const expandedBp = await helper.getExpandedBP(bpId);
        if (expandedBp) {
            const constructedBP = helper.constructBPForCreateSubEntity(
                req,
                expandedBp
            );
            helper.fieldValidations(req, constructedBP);
            await helper.checkUniqueMarketFunctionCodeNumbers(
                req,
                constructedBP,
                srv
            );
        }
    } else {
        const { data } = req;
        helper.fieldValidations(req, data);
        await helper.checkUniqueMarketFunctionCodeNumbers(req, data, srv);
    }
}

async function beforeUpdateHandler(
    req,
    srv,
    enabledFeatures,
    customAnnotations
) {
    // helper would contain the version of helper functions with enabled feature flags
    const helper = {
        ...bpValidHelper(enabledFeatures),
        ...bpHelper(enabledFeatures),
    };
    const isFromSubEntity = requestToBpSubentity(req.path);
    const originalData = req.data;
    const originalEntity = req.entity;
    const originalMethod = req.method;

    const bpId = helper.extractBpEntityId(req);

    const bpWithBookkeeping = await helper.getExpandedBP(
        bpId,
        helper.getExpandedBpMdiBookKeepingQuery
    );
    // if bpWithBookkeeping is null, it means BP is not found. Do not throw an error
    // if mdiBookKeeping field is null, throw an error right away
    if (bpWithBookkeeping && !bpWithBookkeeping.mdiBookKeeping) {
        // error would contain the updated error messages if feature flags are enabled
        const bundle = getBundle(req, i18nPath);
        const error = bpError(enabledFeatures)(bundle);

        req.reject(
            error.BusinessPartnerSRVMissingMdiBookkeeping.code,
            error.BusinessPartnerSRVMissingMdiBookkeeping.message
        );
    }

    const expandedBp = await helper.getExpandedBP(bpId);
    if (expandedBp) {
        // For validation, calls on Business Partner subentities are converted
        //   to a PATCH call on the root Business Partner by making a
        //   constructedBP from expandedBP.
        //   The req object will temporarily be changed and will be reverted
        //   right before handler function ends
        let constructedBP;
        if (isFromSubEntity) {
            // [BETA]
            constructedBP = helper.constructBPForUpdateSubEntity(
                req,
                expandedBp
            );
            req.data = constructedBP;
            req.entity = bpEntity;
            req.method = 'PATCH';
        }
        await helper.updateValidations(
            req,
            srv,
            customAnnotations,
            expandedBp,
            isFromSubEntity
        );

        if (isFromSubEntity) {
            req.data = originalData;
            req.entity = originalEntity;
            req.method = originalMethod;
        }
    }
}

async function beforeDeleteHandler(req) {
    const enabledFeatures = await getEnabledFeaturesSet(req, [
        bpBetaFeatureFlag,
        c4ufLocalIdsFeatureFlag,
    ]);
    const bundle = getBundle(req, i18nPath);
    const error = bpError(enabledFeatures)(bundle);

    req.reject({
        status: error.BusinessPartnerSRVDeleteNotAllowed.code,
        message: `${error.BusinessPartnerSRVDeleteNotAllowed.message} ${
            req.entity.split('.')[1]
        }`,
    });
}

async function beforeDeleteHandlerBeta(
    req,
    srv,
    enabledFeatures,
    customAnnotations
) {
    // helper would contain the version of helper functions with enabled feature flags
    const helper = {
        ...bpValidHelper(enabledFeatures),
        ...bpHelper(enabledFeatures),
    };

    const bpId = helper.extractBpEntityId(req);

    const bpWithBookkeeping = await helper.getExpandedBP(
        bpId,
        helper.getExpandedBpMdiBookKeepingQuery
    );
    // if bpWithBookkeeping is null, it means BP is not found. Do not throw an error
    // if mdiBookKeeping field is null, throw an error right away
    if (bpWithBookkeeping && !bpWithBookkeeping.mdiBookKeeping) {
        // error would contain the updated error messages if feature flags are enabled
        const bundle = getBundle(req, i18nPath);
        const error = bpError(enabledFeatures)(bundle);

        req.reject(
            error.BusinessPartnerSRVMissingMdiBookkeeping.code,
            error.BusinessPartnerSRVMissingMdiBookkeeping.message
        );
    }

    const expandedBp = await helper.getExpandedBP(bpId);
    const constructedBP = await helper.constructBPForDeleteSubEntity(
        req,
        expandedBp
    );
    // get entities with delete restriction
    const restrictDeleteEntities = customAnnotations?.block?.DELETE;
    if (restrictDeleteEntities) {
        helper.restrictDeleteValidation(
            req,
            srv,
            restrictDeleteEntities,
            expandedBp,
            constructedBP
        );
    }
    helper.fieldValidations(req, constructedBP);
    await helper.checkUniqueMarketFunctionCodeNumbers(req, constructedBP, srv);
}

async function triggerMDIClient(event, data) {
    const { req } = data;
    if (requestToBpEntity(req.path) || requestToBpSubentity(req.path)) {
        const mdiClient = await cds.connect.to('MDIClientService');
        mdiClient.emit(event, data);
    }
}

module.exports = async (srv) => {
    const bpMessagingService = await cds.connect.to('businessPartnerMessaging');
    const bpEmMessage = new EventMeshMessage(
        bpMessagingService,
        bpEmTypesHashMap,
        bpEmTopicsHashMap
    );
    const customAnnotations = groupAnnotatedServiceEntities(srv);

    srv.before('CREATE', '*', async (req) => {
        const enabledFeatures = await getEnabledFeaturesSet(req, [
            bpBetaFeatureFlag,
            c4ufLocalIdsFeatureFlag,
            bpMessagingFlag,
        ]);

        if (requestToBpEntity(req.path) || requestToBpSubentity(req.path)) {
            await beforeCreateHandler(req, srv, enabledFeatures);
        }
    });

    srv.before('UPDATE', '*', async (req) => {
        const enabledFeatures = await getEnabledFeaturesSet(req, [
            bpBetaFeatureFlag,
            c4ufLocalIdsFeatureFlag,
            bpMessagingFlag,
        ]);

        if (requestToBpEntity(req.path) || requestToBpSubentity(req.path)) {
            await beforeUpdateHandler(
                req,
                srv,
                enabledFeatures,
                customAnnotations
            );
        }
    });

    srv.before('DELETE', '*', async (req) => {
        const enabledFeatures = await getEnabledFeaturesSet(req, [
            bpBetaFeatureFlag,
            c4ufLocalIdsFeatureFlag,
        ]);

        if (requestToBpSubentity(req.path)) {
            if (enabledFeatures.includes(bpBetaFeatureFlag)) {
                await beforeDeleteHandlerBeta(
                    req,
                    srv,
                    enabledFeatures,
                    customAnnotations
                );
            } else {
                await beforeDeleteHandler(req);
            }
        }
    });

    srv.after('CREATE', '*', async (data, req) => {
        req.on('succeeded', async () => {
            const enabledFeatures = await getEnabledFeaturesSet(req, [
                bpBetaFeatureFlag,
                c4ufLocalIdsFeatureFlag,
                bpMessagingFlag,
            ]);

            // local event emit
            if (requestToBpEntity(req.path)) {
                triggerMDIClient('BPCreated', {
                    req,
                });
            } else if (requestToBpSubentity(req.path)) {
                triggerMDIClient('BPUpdated', {
                    req,
                });
            }

            // EventMesh event emit
            if (enabledFeatures.includes(bpMessagingFlag)) {
                const { extractBpEntityId } = bpHelper(enabledFeatures);
                const bpId = extractBpEntityId(req) || data.id;

                if (requestToBpEntity(req.path)) {
                    await bpEmMessage.emit(req, 'created', bpId, { id: bpId });
                } else if (requestToBpSubentity(req.path)) {
                    await bpEmMessage.emit(req, 'updated', bpId, { id: bpId });
                }
            }
        });
    });

    srv.after('UPDATE', '*', async (data, req) => {
        req.on('succeeded', async () => {
            const enabledFeatures = await getEnabledFeaturesSet(req, [
                bpBetaFeatureFlag,
                c4ufLocalIdsFeatureFlag,
                bpMessagingFlag,
            ]);

            // local event emit
            triggerMDIClient('BPUpdated', {
                req,
            });

            // EventMesh event emit
            if (enabledFeatures.includes(bpMessagingFlag)) {
                const { extractBpEntityId } = bpHelper(enabledFeatures);
                const bpId = extractBpEntityId(req) || data.id;

                await bpEmMessage.emit(req, 'updated', bpId, { id: bpId });
            }
        });
    });

    srv.after('DELETE', '*', async (data, req) => {
        req.on('succeeded', async () => {
            const enabledFeatures = await getEnabledFeaturesSet(req, [
                bpBetaFeatureFlag,
                c4ufLocalIdsFeatureFlag,
                bpMessagingFlag,
            ]);

            if (enabledFeatures.includes(bpBetaFeatureFlag)) {
                // local event emit
                if (requestToBpSubentity(req.path)) {
                    triggerMDIClient('BPUpdated', {
                        req,
                    });
                }

                // EventMesh event emit
                if (enabledFeatures.includes(bpMessagingFlag)) {
                    const { extractBpEntityId } = bpHelper(enabledFeatures);
                    const bpId = extractBpEntityId(req) || data.id;

                    await bpEmMessage.emit(req, 'updated', bpId, { id: bpId });
                }
            }
        });
    });

    /**
     * CLOSE
     * Indicates the endpoint for closing Business Partner
     * @param {Object} cds.Request - Request Object.
     */
    srv.on('close', 'BusinessPartner', async (req) => {
        const endOfBusinessDate = new Date().toISOString();

        const db = await cds.connect.to('db');
        try {
            const affectedRows = await db.transaction(req).run(
                UPDATE(bpTable)
                    .set({
                        endOfBusinessDate,
                    })
                    .where({
                        id: req.params[0].id,
                    })
            );

            logger.info(
                `[BusinessPartnerService.js][Number of items closed]: ${affectedRows}`
            );
        } catch (err) {
            logger.error(`[BusinessPartnerService.js][Close action]: ${err}`);
            req.error({
                status: 500,
                message: err.message,
            });
        }
        return null;
    });

    AuditLogService.registerHandler(srv);
};
