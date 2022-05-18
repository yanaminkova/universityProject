/* eslint-disable no-underscore-dangle */
const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const MDIRequest = require('./MDIRequest');
const { isField, storeIfKey } = require('./MDIClientHelper');
const bpHelper = require('../lib/businesspartner/businessPartnerHelper');
const { cacheDestinations } = require('../lib/helper');
const { BPODMVERSION } = require('../lib/config');

const bpTable = 'sap.odm.businesspartner.BusinessPartner';
const MDITable = 'sap.odm.businesspartner.BusinessPartner.mdiBookKeeping';

function getCompositionOfManyKeys(obj, service, parentEntity) {
    const currentObjKeys = {};
    const actualKeys = [];
    let hasNestedCompositionOfMany = false;

    const { elements } = service.entities[parentEntity];

    const objKeys = Object.keys(obj);
    objKeys.forEach((key) => {
        if (obj[key] !== null) {
            if (isField(elements[key], 'Composition', 'is2one')) {
                const childEntity = elements[key].target.split('.').pop();
                const result = getCompositionOfManyKeys(
                    obj[key],
                    service,
                    childEntity
                );
                if (result.hasNestedCompositionOfMany) {
                    currentObjKeys[key] = result.currentObjKeys;
                }
            } else if (isField(elements[key], 'Composition', 'is2many')) {
                const childEntity = elements[key].target.split('.').pop();
                const arrayObjKeys = [];

                obj[key]?.forEach((object) => {
                    const result = getCompositionOfManyKeys(
                        object,
                        service,
                        childEntity
                    );
                    arrayObjKeys.push(result.currentObjKeys);
                });

                currentObjKeys[key] = arrayObjKeys;
                hasNestedCompositionOfMany = true;
            } else if (
                isField(elements[key], 'Association', 'is2one') &&
                obj[key].code
            ) {
                storeIfKey(
                    elements[key].key,
                    currentObjKeys,
                    obj[key].code,
                    `${key}_code`,
                    actualKeys
                );
            } else {
                storeIfKey(
                    elements[key].key,
                    currentObjKeys,
                    obj[key],
                    key,
                    actualKeys
                );
            }
        }
    });
    if (actualKeys.length > 0) {
        currentObjKeys._keys = actualKeys;
    }
    return { currentObjKeys, hasNestedCompositionOfMany };
}

async function postBPToMDI(req, bpTxConfig, event, data) {
    const { tx, bpEntity } = bpTxConfig(req).internal;
    const bookKeepingObj = {};
    try {
        let c4ufBusinessSystem = '';
        if (event === 'create') {
            const bpKeyMappingDestService = await cds.connect.to(
                'BusinessPartnerKeyMappingService'
            );
            const bpKeyMappingDest = await cacheDestinations(
                req,
                bpKeyMappingDestService
            );

            c4ufBusinessSystem =
                bpKeyMappingDest.originalProperties.destinationConfiguration
                    .c4ufBusinessSystem;
        }

        const mdiDest = await cds.connect.to('MdiDestination');
        let changeRequest;
        if (data) {
            changeRequest = new MDIRequest(req, 'POST', 'requests', data).build(
                {
                    excludeFields: [
                        'serviceProviderInformation',
                        'mdiBookKeeping',
                        'displayId',
                    ],
                    event,
                    c4ufBusinessSystem,
                }
            );
        } else {
            changeRequest = new MDIRequest(req, 'POST', 'requests').build({
                excludeFields: [
                    'serviceProviderInformation',
                    'mdiBookKeeping',
                    'displayId',
                ],
                event,
                c4ufBusinessSystem,
            });
        }

        bookKeepingObj.changeToken = changeRequest.data.changeToken;
        bookKeepingObj.Id = changeRequest.data.instance.id;

        await mdiDest.tx(req).run(changeRequest.query, changeRequest.data);

        bookKeepingObj.status = 'sent';
        bookKeepingObj.errorMessage = null;
    } catch (err) {
        bookKeepingObj.status = 'alert';
        bookKeepingObj.errorMessage = err.message;
        logger.error(
            `[MDIClient][postBPToMDI][${bookKeepingObj.status}]: ${err.message}`
        );
    } finally {
        try {
            const query = UPDATE(bpEntity)
                .set({
                    mdiBookKeeping: {
                        changeToken: bookKeepingObj.changeToken,
                        status: bookKeepingObj.status,
                        errorMessage: bookKeepingObj.errorMessage,
                        up__id: bookKeepingObj.Id,
                        pending: false,
                    },
                })
                .where({
                    id: bookKeepingObj.Id,
                });

            await tx.run(query);
            await tx.commit();
        } catch (err) {
            await tx.rollback();
            logger.error(
                `[MDIClient][postBPToMDI][${bookKeepingObj.status}]: ${err.message}`
            );
        }
    }
}

async function postBatchLocalIdsToMDI(
    req,
    createdBps,
    bpTxConfig,
    destinationConfig
) {
    try {
        const { tx } = bpTxConfig(req).internal;
        const data = {
            '@odata.context': '#$delta',
            value: [],
        };
        const bpMDIObj = {};
        /* eslint-disable */
        for (const key in createdBps) {
            const changeToken = cds.utils.uuid();
            bpMDIObj[createdBps[key].id] = {
                status: 'sent',
                changeToken,
            };
            const obj = {
                operation: 'patch',
                changeToken,
                previousVersionId: createdBps[key].versionId,
                instance: {
                    id: createdBps[key].id,
                },
                localIds: [
                    MDIRequest.addLocalIds(
                        createdBps[key].id,
                        destinationConfig.c4ufBusinessSystem,
                        'sap.oitc.889'
                    ),
                ],
            };

            if (
                typeof createdBps[key].displayId !== undefined &&
                createdBps[key].displayId !== null
            ) {
                obj.localIds.push(
                    MDIRequest.addLocalIds(
                        createdBps[key].displayId,
                        destinationConfig.c4ufBusinessSystem,
                        'sap.oitc.888'
                    )
                );
            }

            data.value.push(obj);
        }

        if (data.value.length) {
            const mdiDest = await cds.connect.to('MdiDestination');
            await mdiDest
                .tx(req)
                .run(
                    `PATCH ${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/requests`,
                    data
                );
            for (const key in bpMDIObj) {
                try {
                    const query = UPDATE(MDITable)
                        .set(bpMDIObj[key])
                        .where({ up__id: key });

                    await tx.run(query);
                    await tx.commit();
                } catch (err) {
                    await tx.rollback();
                    logger.error(
                        `[MDIClient][postBatchLocalIdsToMDI]: ${err.message}`
                    );
                }
            }
        }
        /* eslint-enable */
    } catch (err) {
        logger.error(`[MDIClient][postBatchLocalIdsToMDI]: ${err.message}`);
    }
}

module.exports = (enabledFeatures = []) => {
    const helper = bpHelper(enabledFeatures);

    async function getExpandedBP(req, bpTxConfig, isPending, data) {
        const { tx, bpEntity } = bpTxConfig(req).external;
        const id = !isPending
            ? helper.extractBpEntityId(req)
            : data.id || req.data.id;
        let res;
        try {
            res = await tx.run(helper.getExpandedBPQuery({ id }, bpEntity));
            await tx.commit();
        } catch (err) {
            await tx.rollback();
            logger.error(`[MDIClient][getExpandedBP]: ${err.message}`);
        }
        return res;
    }

    async function getBpBookkeeping(req, id) {
        let bpData = null;
        if (id) {
            const db = await cds.connect.to('db');
            const tx = db.tx(req);

            try {
                bpData = await tx.run(
                    helper.getExpandedBpMdiBookKeepingQuery({ id }, bpTable)
                );
                await tx.commit();
            } catch (err) {
                await tx.rollback();
                logger.error(
                    `[MDIClient][getExpandedBPMdiBookKeeping]: ${err.message}`
                );
            }
        }

        return bpData;
    }

    async function updateBPtoMDI(
        req,
        bookkeeping,
        bpTxConfig,
        data,
        isPending = false
    ) {
        const { bpService } = bpTxConfig(req).external;
        const expandedBp = await getExpandedBP(
            req,
            bpTxConfig,
            isPending,
            data
        );
        const { currentObjKeys } = getCompositionOfManyKeys(
            expandedBp,
            bpService,
            'BusinessPartner'
        );
        expandedBp.mdiBookKeeping = bookkeeping;
        expandedBp.mdiBookKeeping.currentKeys = currentObjKeys;
        // send change request to MDI
        if (data) {
            await postBPToMDI(req, bpTxConfig, 'update', expandedBp);
        } else {
            req.data = expandedBp;
            await postBPToMDI(req, bpTxConfig, 'update');
        }
    }

    async function setBookkeepingPendingStatus(req, bpTxConfig, pendingFlag) {
        const { tx } = bpTxConfig(req).internal;
        try {
            const id = helper.extractBpEntityId(req);
            const query = UPDATE(MDITable)
                .set({ pending: pendingFlag })
                .where({ up__id: id });

            await tx.run(query);
            await tx.commit();
        } catch (err) {
            await tx.rollback();
            logger.error(
                `[MDIClient][setBookkeepingPendingFlag]: ${err.message}`
            );
        }
    }

    return {
        setBookkeepingPendingStatus,
        postBPToMDI,
        updateBPtoMDI,
        postBatchLocalIdsToMDI,
        getBpBookkeeping,
    };
};
