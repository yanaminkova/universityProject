/* eslint-disable no-underscore-dangle */
const logger = require('cf-nodejs-logging-support');
const mdiClientOutboundHelper = require('./MDIClientOutboundHelper');
const {
    isField,
    storeIfKey,
    getNextLink,
    translateLog,
} = require('./MDIClientHelper');

const MDITable = 'sap.odm.businesspartner.BusinessPartner.mdiBookKeeping';

const c4ufLocalIdsFeatureFlag = 'c4uf-localids';
const bpMessagingFlag = 'business-partner-messaging';

function filterExposedFields(obj, service, parentEntity) {
    const newObj = {};
    const newObjKeys = {};
    const actualKeys = [];
    let hasNestedCompositionOfMany = false;

    const { elements } = service.entities[parentEntity];

    const currentObjKeys = Object.keys(obj);
    const exposedKeys = Object.keys(elements);
    exposedKeys.forEach((key) => {
        if (currentObjKeys.includes(key) && obj[key] !== null) {
            if (isField(elements[key], 'Composition', 'is2one')) {
                const childEntity = elements[key].target.split('.').pop();
                const result = filterExposedFields(
                    obj[key],
                    service,
                    childEntity
                );
                newObj[key] = result.newObj;
                if (result.hasNestedCompositionOfMany) {
                    newObjKeys[key] = result.newObjKeys;
                }
            } else if (isField(elements[key], 'Composition', 'is2many')) {
                const childEntity = elements[key].target.split('.').pop();
                const arrayObj = [];
                const arrayObjKeys = [];

                obj[key]?.forEach((object) => {
                    const result = filterExposedFields(
                        object,
                        service,
                        childEntity
                    );
                    arrayObj.push(result.newObj);
                    arrayObjKeys.push(result.newObjKeys);
                });

                newObj[key] = arrayObj;
                newObjKeys[key] = arrayObjKeys;
                hasNestedCompositionOfMany = true;
            } else if (
                isField(elements[key], 'Association', 'is2one') &&
                obj[key].code
            ) {
                newObj[`${key}_code`] = obj[key].code;
                storeIfKey(
                    elements[key].key,
                    newObjKeys,
                    obj[key].code,
                    `${key}_code`,
                    actualKeys
                );
            } else {
                newObj[key] = obj[key];
                storeIfKey(
                    elements[key].key,
                    newObjKeys,
                    obj[key],
                    key,
                    actualKeys
                );
            }
        }
    });
    if (actualKeys.length > 0) {
        newObjKeys._keys = actualKeys;
    }
    return { newObj, newObjKeys, hasNestedCompositionOfMany };
}

function createBPObj(obj, statusParam, versionIdParam, service, localIds = []) {
    const { newObj, newObjKeys } = filterExposedFields(
        obj,
        service,
        'BusinessPartner'
    );

    delete newObj.displayId;

    return {
        ...newObj,
        isBlocked: false,
        mdiBookKeeping: {
            status: statusParam,
            versionId: versionIdParam,
            errorMessage: null,
            keys: JSON.stringify(newObjKeys),
        },
        localIds,
    };
}

function extractLog(log, service) {
    const confirmInstanceIds = {};
    const rejectInstanceChangeTokens = {};
    const createInstanceIds = {};
    const updateInstanceIds = {};

    log.forEach((logItem) => {
        const { instance, versionId, changeToken, event, localIds } = logItem;
        const action = translateLog(
            event,
            changeToken,
            instance,
            createInstanceIds
        );
        switch (action) {
            case 'confirm': {
                confirmInstanceIds[instance.id] = createBPObj(
                    instance,
                    'confirmed',
                    versionId,
                    service,
                    localIds
                );
                break;
            }
            case 'create': {
                createInstanceIds[instance.id] = createBPObj(
                    instance,
                    'confirmed',
                    versionId,
                    service,
                    localIds
                );

                break;
            }
            case 'update': {
                updateInstanceIds[instance.id] = createBPObj(
                    instance,
                    'confirmed',
                    versionId,
                    service,
                    localIds
                );

                break;
            }
            case 'reject': {
                rejectInstanceChangeTokens[changeToken] = {
                    errorMessage: logItem.reason.error.message,
                    changeToken,
                };
                break;
            }
            default:
                break;
        }
    });

    return {
        confirmInstanceIds,
        rejectInstanceChangeTokens,
        createInstanceIds,
        updateInstanceIds,
    };
}

async function confirmBPs(
    confirmInstanceIds,
    req,
    bpTxConfig,
    enabledFeatures,
    destinationConfig
) {
    /* eslint-disable */
    for (const key in confirmInstanceIds) {
        const { id, mdiBookKeeping, localIds } = confirmInstanceIds[key];
        const { tx, bpEntity } = bpTxConfig(req).internal;

        if (
            enabledFeatures.includes(c4ufLocalIdsFeatureFlag) &&
            localIds !== undefined
        ) {
            const bpLocalId = localIds.find(
                (item) =>
                    item.status === 'active' &&
                    item.context.tenant ===
                        destinationConfig.c4ufBusinessSystem &&
                    item.context.additionalContext === 'sap.oitc.888'
            );

            if (bpLocalId !== undefined) {
                mdiBookKeeping.displayIdStatus = 'set';
            }
        }

        try {
            const query = UPDATE(bpEntity)
                .set({
                    mdiBookKeeping,
                })
                .where({
                    id,
                });

            await tx.run(query);
            await tx.commit();
        } catch (e) {
            await tx.rollback();
            logger.error(
                `[MDIClient][extractLog][nonRejectedEvent][mdiBookKeepingUpdateError]: ${e.message}`
            );
        }
    }
    /* eslint-enable */
}

async function rejectBPs(rejectInstanceChangeTokens, req, bpTxConfig) {
    /* eslint-disable */
    for (const changeToken in rejectInstanceChangeTokens) {
        const { errorMessage } = rejectInstanceChangeTokens[changeToken];
        const { tx } = bpTxConfig(req).internal;

        try {
            logger.error(
                `[MDIClient][extractLog][rejectedEventEncountered]: changeToken: ${changeToken} Error: ${errorMessage}`
            );
            const query = UPDATE(MDITable)
                .set({
                    status: 'alert',
                    errorMessage,
                })
                .where({ changeToken });
            await tx.run(query);
            await tx.commit();
        } catch (e) {
            await tx.rollback();
            logger.error(
                `[MDIClient][extractLog][rejectedEvent][mdiBookKeepingUpdateError]: ${e.message}`
            );
        }
    }
    /* eslint-enable */
}

async function sendPendingBPs(req, bpTxConfig, enabledFeatures) {
    const { tx } = bpTxConfig(req).internal;
    const helper = mdiClientOutboundHelper(enabledFeatures);
    let pendingBPbookkeeping = [];
    try {
        pendingBPbookkeeping = await tx.run(
            SELECT.from(MDITable).where({
                status: 'confirmed',
                pending: true,
            })
        );
        await tx.commit();
    } catch (err) {
        await tx.rollback();
        logger.error(`[MDIClient][sendPendingBPs]: ${err.message}`);
    }

    /* eslint-disable */
    for (const bookkeeping of pendingBPbookkeeping) {
        const bpData = { id: bookkeeping.up__id };
        await helper.updateBPtoMDI(req, bookkeeping, bpTxConfig, bpData, true);
    }
    /* eslint-enable */
}

function createFailedBPs(req, id, error, bpTxConfig) {
    const { tx, bpEntity } = bpTxConfig(req).internal;

    tx.run(
        INSERT.into(bpEntity, {
            id,
            mdiBookKeeping: {
                status: 'alert',
                errorMessage: error.message,
            },
            isBlocked: false,
        })
    ).then(
        () => {
            tx.commit();
        },
        () => {
            tx.rollback();
        }
    );
}

function updateFailedBPs(req, id, error, bpTxConfig) {
    const { tx, bpEntity } = bpTxConfig(req).internal;

    tx.run(
        UPDATE(bpEntity)
            .set({
                mdiBookKeeping: {
                    up__id: id,
                    status: 'alert',
                    errorMessage: error.message,
                },
            })
            .where({ id })
    ).then(
        () => {
            tx.commit();
        },
        () => {
            tx.rollback();
        }
    );
}

function setLocalId(
    bpInstance,
    s4BusinessSystem,
    enabledFeatures,
    event,
    bpInstanceBookkeeping
) {
    /* eslint-disable no-param-reassign */
    let displayIdWasSet = false;
    if (
        (event === 'update' &&
            bpInstanceBookkeeping &&
            bpInstanceBookkeeping.displayIdStatus === 'notset') ||
        event === 'create'
    ) {
        if (bpInstance.localIds !== undefined) {
            const s4LocalId = bpInstance.localIds.find(
                (item) =>
                    item.status === 'active' &&
                    item.context.tenant === s4BusinessSystem &&
                    item.context.additionalContext === 'sap.oitc.888'
            );

            if (s4LocalId !== undefined) {
                bpInstance.displayId = s4LocalId.localId;
                if (enabledFeatures.includes(c4ufLocalIdsFeatureFlag)) {
                    bpInstance.mdiBookKeeping.displayIdStatus = 'setInC4UF';
                    displayIdWasSet = true;
                } else {
                    bpInstance.mdiBookKeeping.displayIdStatus = 'set';
                    displayIdWasSet = true;
                }
            }
        }
    }
    delete bpInstance.localIds;
    return displayIdWasSet;
}
/* eslint-enable no-param-reassign */

module.exports = (enabledFeatures = []) => {
    const helper = mdiClientOutboundHelper(enabledFeatures);

    async function createBPs(
        createInstanceIds,
        req,
        bpTxConfig,
        destinationConfig,
        emMessage
    ) {
        /* eslint-disable */
        const createdBps = [];
        for (const key in createInstanceIds) {
            const { tx, bpEntity } = bpTxConfig(req).internal;
            setLocalId(
                createInstanceIds[key],
                destinationConfig.s4BusinessSystem,
                enabledFeatures,
                'create'
            );
            try {
                await tx.run(INSERT.into(bpEntity, createInstanceIds[key]));
                await tx.commit();

                createdBps.push({
                    id: createInstanceIds[key].id,
                    displayId: createInstanceIds[key].displayId,
                    versionId: createInstanceIds[key].mdiBookKeeping.versionId,
                });

                if (enabledFeatures.includes(bpMessagingFlag)) {
                    await emMessage.emit(
                        req,
                        'created',
                        createInstanceIds[key].id,
                        { id: createInstanceIds[key].id }
                    );
                }
            } catch (error) {
                await tx.rollback();
                createFailedBPs(
                    req,
                    createInstanceIds[key].id,
                    error,
                    bpTxConfig
                );
            }
        }

        if (
            enabledFeatures.includes(c4ufLocalIdsFeatureFlag) &&
            createdBps.length
        ) {
            await helper.postBatchLocalIdsToMDI(
                req,
                createdBps,
                bpTxConfig,
                destinationConfig
            );
        }
        /* eslint-enable */
    }

    async function updateBPs(
        updateInstanceIds,
        req,
        bpTxConfig,
        destinationConfig,
        emMessage
    ) {
        /* eslint-disable */
        for (const id in updateInstanceIds) {
            const { tx, bpEntity } = bpTxConfig(req).internal;

            const bpBookkeepingQuery = SELECT.one(MDITable).where({
                up__id: id,
            });

            try {
                const bpBookkeeping = await tx.run(bpBookkeepingQuery);
                if (bpBookkeeping) {
                    if (bpBookkeeping.pending) {
                        updateInstanceIds[id].mdiBookKeeping.status = 'alert';
                        updateInstanceIds[id].mdiBookKeeping.pending = false;
                        updateInstanceIds[id].mdiBookKeeping.errorMessage =
                            'Newer VersionID pulled from MDI';
                    }

                    setLocalId(
                        updateInstanceIds[id],
                        destinationConfig.s4BusinessSystem,
                        enabledFeatures,
                        'update',
                        bpBookkeeping
                    );

                    try {
                        const updateQuery = UPDATE(bpEntity)
                            .data(updateInstanceIds[id])
                            .where({ id });
                        await tx.run(updateQuery);
                        await tx.commit();

                        if (enabledFeatures.includes(bpMessagingFlag)) {
                            await emMessage.emit(
                                req,
                                'updated',
                                updateInstanceIds[id].id,
                                { id: updateInstanceIds[id].id }
                            );
                        }
                    } catch (error) {
                        await tx.rollback();
                        logger.error(
                            `[MDIClient][updateBPs][pending:false][updateBPError]: ${error.message}`
                        );
                        updateFailedBPs(req, id, error, bpTxConfig);
                    }
                } else {
                    await tx.commit();
                    logger.error(
                        `[MDIClient][updateBPs][DiscardedBPUpdate]: BP: ${id}`
                    );
                }
            } catch (e) {
                await tx.rollback();
                logger.error(`[MDIClient][updateBPs]: ${e.message}}`);
            }
        }
        /* eslint-enable */
    }

    async function sendLocalIds(req, bpTxConfig, destinationConfig) {
        try {
            if (enabledFeatures.includes(c4ufLocalIdsFeatureFlag)) {
                const { tx } = bpTxConfig(req).internal;
                let bpsToBeSent = [];
                try {
                    const query = SELECT.from(
                        `sap.odm.businesspartner.BusinessPartner`
                    )
                        .columns('id', 'displayId', 'mdiBookKeeping.versionId')
                        .where({
                            'mdiBookKeeping.displayIdStatus': 'setInC4UF',
                            and: {
                                'mdiBookKeeping.status': 'confirmed',
                                or: {
                                    'mdiBookKeeping.status': 'alert',
                                },
                            },
                        });
                    bpsToBeSent = await tx.run(query);
                    await tx.commit();
                } catch (err) {
                    await tx.rollback();
                    logger.error(
                        `[MDIClientInboundHelper][sendLocalIds][queryError]: ${err.message}`
                    );
                }

                if (bpsToBeSent.length) {
                    await helper.postBatchLocalIdsToMDI(
                        req,
                        bpsToBeSent,
                        bpTxConfig,
                        destinationConfig
                    );
                }
            }
        } catch (err) {
            logger.error(
                `[MDIClientInboundHelper][sendLocalIds][catch]: ${err.message}`
            );
        }
    }

    return {
        extractLog,
        confirmBPs,
        rejectBPs,
        createBPs,
        updateBPs,
        sendPendingBPs,
        sendLocalIds,
        getNextLink,
    };
};
