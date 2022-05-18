/* eslint-disable no-param-reassign */
const cds = require('@sap/cds');
const cloudSDK = require('@sap-cloud-sdk/core');
const { TextBundle } = require('@sap/textbundle');
const configConstants = require('./config');

const logger = cds.log.Logger('c4u-foundation-retailer-srv', 'info');

function recursivePopulateProperties(deepObject, properties) {
    if (typeof deepObject === 'object' && deepObject !== null) {
        Object.keys(deepObject).forEach((objProperty) => {
            Object.keys(properties).forEach((property2assign) => {
                if (Array.isArray(deepObject[objProperty])) {
                    deepObject[objProperty].forEach((element) => {
                        recursivePopulateProperties(element, properties);
                    });
                } else if (
                    typeof deepObject[objProperty] === 'object' &&
                    deepObject[objProperty] !== null
                ) {
                    recursivePopulateProperties(
                        deepObject[objProperty],
                        properties
                    );
                } else if (property2assign === objProperty) {
                    // eslint-disable-next-line no-param-reassign
                    deepObject[objProperty] = properties[property2assign];
                }
            });
        });
    }
}

function extractPathFromJson(json, path, delimiter = '/') {
    const pathParts = path.split(delimiter);

    let result = json;
    pathParts.forEach((part) => {
        result = result && result[part] ? result[part] : false;
    });

    return result;
}

function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    const deepCopyObj = Array.isArray(obj) ? [] : {};

    Object.keys(obj).forEach((key) => {
        deepCopyObj[key] = deepCopy(obj[key]);
    });

    return deepCopyObj;
}

async function getEnabledFeatures(req, featureFlagNames = []) {
    const { tenant } = req.user;

    const featureFlag = await cds.connect.to('featureFlags');
    const featureFlagValues = await Promise.all(
        featureFlagNames.map(async (ffName) =>
            featureFlag.evaluate(ffName, tenant)
        )
    );

    return featureFlagValues
        .map((val, i) => [featureFlagNames[i], val])
        .filter((ff) => ff[1])
        .map((ff) => ff[0]);
}

async function getEnabledFeaturesSet(req, featureFlagNamesSet = []) {
    const { tenant } = req.user;

    const featureFlag = await cds.connect.to('featureFlags');

    let featureFlagValues = [];
    try {
        featureFlagValues = await featureFlag.evaluateSet(
            featureFlagNamesSet,
            tenant
        );
    } catch (error) {
        // error in retrieving feature flag
    }

    return featureFlagValues.filter((ff) => ff[1]).map((ff) => ff[0]);
}

const hasSubsetObject = (arr1, arr2, subFieldsFunc) =>
    // will result to true if ALL objects in arr2 is included in arr1
    arr1 && arr2.length
        ? arr2
              .map((subObj2) =>
                  // will result to true if subObj2 is included in arr1
                  arr1
                      .map((subObj1) => subFieldsFunc(subObj1, subObj2))
                      .reduce((acc, val) => acc || val, false)
              )
              .reduce((acc, val) => acc && val, true)
        : false;

/**
 * Checks if `obj2` properties and values are exactly the same as `obj1`.
 * For fields that are array, checks if `obj2` array field objects are all included in `obj1` array field
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns true if `obj2` is a subset of `obj1`
 */
const hasSubsetFields = (obj1, obj2) => {
    const obj2Keys = Object.keys(obj2);
    return obj1 && obj2Keys.length
        ? obj2Keys
              .map((keyName) => {
                  if (Array.isArray(obj2[keyName])) {
                      return hasSubsetObject(
                          obj1[keyName],
                          obj2[keyName],
                          hasSubsetFields
                      );
                  }
                  if (typeof obj2[keyName] === 'object') {
                      return hasSubsetFields(obj1[keyName], obj2[keyName]);
                  }
                  return obj2[keyName] === obj1[keyName];
              })
              .reduce((acc, val) => acc && val, true)
        : false;
};

/**
 * Converts an array with the following pattern:
 * [{ ref: [ 'c', 'd' ]}, '=', { val: '123' }, 'AND', { ref: [ 'c', 'e' ]}, '=', { val: '456' }]
 * to
 * { c_d: '123', c_e: '456' }
 * @param {Array} whereClause
 * @returns a new reformatted array
 */
function reformatCqnWhereClause(whereClause) {
    const formattedWhereClause = {};
    let keyName;
    whereClause.forEach((obj) => {
        if (obj.ref) {
            keyName = obj.ref.join('_');
        } else if (obj.val) {
            formattedWhereClause[keyName] = obj.val;
        }
    });
    return formattedWhereClause;
}

// Helper functions below are dpendent on CDS service and request

/**
 * Converts an object with the following pattern:
 * from:
 * ```
 * { c_d: '123', c_e: '456' }
 * ```
 * to:
 * ```
 * { c: { d: '123', e: '456'} }
 * ```
 * @param {Object} keys
 * @returns a new reformatted object
 */
function reformatKeysForComplexKeys(keys) {
    const complexKeys = {};
    Object.keys(keys).forEach((key) => {
        const [parent, child] = key.split('_');
        if (child) {
            if (!complexKeys[parent]) {
                complexKeys[parent] = {};
            }
            complexKeys[parent][child] = keys[key];
        }
    });
    return complexKeys;
}

/**
 * Converts an array with the following pattern:
 * from:
 * ```
 * [{ id: 'A.x', where: [{ ref: [ 'c', 'd' ]}, '=', { val: '123' }, 'AND', { ref: [ 'c', 'e' ]}, '=', { val: '456' }] }]
 * ```
 * to:
 * ```
 * [{entity: 'x', keys: { c_d: '123', c_e: '456' }, complexKeys: { c: { d: '123', e: '456'} } }]
 * ```
 * @param {Array} cqnEntityRef
 * @returns a new reformatted array
 */
function reformatCqnEntityRef(cqnEntityRef) {
    return cqnEntityRef.map((obj) => {
        const formattedObj = {};
        if (obj.id && obj.where) {
            // if entity name (obj.id) includes a dot ('.')
            // the string before dot pertains to the service name
            formattedObj.entity = obj.id.split('.').pop();
            formattedObj.keys = reformatCqnWhereClause(obj.where);
            formattedObj.complexKeys = reformatKeysForComplexKeys(
                formattedObj.keys
            );
        } else {
            // if entity name (obj) includes a dot ('.')
            // the string before dot pertains to the service name
            formattedObj.entity = obj.split('.').pop();
        }
        return formattedObj;
    });
}

function extractEntityAndKeys(reqQuery) {
    let ref;

    if (reqQuery.INSERT) {
        // INSERT.into can include 'ref' or not
        // it depends if the request is an INSERT to a subentity or root entity
        ref = reqQuery.INSERT.into.ref || [reqQuery.INSERT.into];
    } else if (reqQuery.UPDATE?.entity?.ref) {
        ({ ref } = reqQuery.UPDATE.entity);
    } else if (reqQuery.DELETE?.from?.ref) {
        ({ ref } = reqQuery.DELETE.from);
    }

    return reformatCqnEntityRef(ref);
}

function addFieldToObj(typeOfFieldToAdd, parentObj, fieldName, valueToAdd) {
    if (typeOfFieldToAdd === 'array') {
        if (!parentObj[fieldName]) {
            parentObj[fieldName] = [];
        }
        if (valueToAdd) {
            parentObj[fieldName].push(valueToAdd);
        }
    } else if (typeOfFieldToAdd === 'object' && !parentObj[fieldName]) {
        parentObj[fieldName] = {};
    } else if (typeOfFieldToAdd === 'number' && valueToAdd) {
        parentObj[fieldName] = +valueToAdd;
    }
}

/**
 * Arranges service entities based on their custom annotations and group each entity correspondingly
 *
 * Important Note: multiple `where` and `contains` field is currently NOT supported
 * ```
 * from:
 * {
 *    BP_srv_entity_1: { @customAnnotations.restrict: [ { block: ['DELETE', 'UPDATE'], where: 'field_1', contains: 'field_1_code = ABC' } ]}
 *    BP_srv_entity_2: { @customAnnotations.restrict: [ { block: ['DELETE'], where: 'field_2 = CDE' } ]}
 * }
 * ```
 * to:
 * ```
 * {
 *    block: {
 *       DELETE: {
 *          BP_srv_entity_1: { where: ['field_1'], contains: ['field_1_code = ABC'] },
 *          BP_srv_entity_2: { where: ['field_2 = CDE'] }
 *       },
 *       UPDATE: {
 *          BP_srv_entity_1: { where: ['field_1'], contains: ['field_1_code = ABC'] }
 *       }
 *    }
 * }
 * ```
 * @param {cds.Service} srv CDS Service
 * @returns an object with re-arranged service entities based on its custom annotation restriction
 */
function groupAnnotatedServiceEntities(srv) {
    const { entities } = srv;
    const customAnnotations = {};
    // loop through all entities
    Object.keys(entities).forEach((entityName) => {
        const entityData = entities[entityName];
        const customRestrict = entityData['@customAnnotations.restrict'];
        // check if current entity contains custom annotations
        if (customRestrict && Array.isArray(customRestrict)) {
            customRestrict.forEach((restriction) => {
                Object.keys(restriction).forEach((restrictProp) => {
                    if (
                        restrictProp === 'block' ||
                        (restrictProp === 'limit' &&
                            Array.isArray(restriction[restrictProp]))
                    ) {
                        addFieldToObj(
                            'object',
                            customAnnotations,
                            restrictProp
                        );

                        restriction[restrictProp].forEach((blockOp) => {
                            // add empty 'DELETE' if not included
                            addFieldToObj(
                                'object',
                                customAnnotations[restrictProp],
                                blockOp
                            );

                            // add empty 'BusinessPartnerAddressData' if not included
                            addFieldToObj(
                                'object',
                                customAnnotations[restrictProp][blockOp],
                                entityName
                            );

                            // Note: Improvement needed. Should change type to support nested conditions
                            // add a 'where' array if not included, else push value in array
                            addFieldToObj(
                                'array',
                                customAnnotations[restrictProp][blockOp][
                                    entityName
                                ],
                                'where',
                                restriction.where
                            );

                            // Note: Improvement needed. Should go under each instance in 'where' array
                            // add a 'contains' array, else push value in array
                            addFieldToObj(
                                'array',
                                customAnnotations[restrictProp][blockOp][
                                    entityName
                                ],
                                'contains',
                                restriction.contains
                            );

                            // add a 'min' field
                            addFieldToObj(
                                'number',
                                customAnnotations[restrictProp][blockOp][
                                    entityName
                                ],
                                'min',
                                restriction.min
                            );
                        });
                    }
                });
            });
        }
    });
    return customAnnotations;
}

/**
 * Retrieves a list of property names of `entity` that has a `key` property set as `true`
 * and is not a parent key (property prefixed with `up_`)
 * @param {Object} srv CDS service
 * @param {String} entity CDS service entity
 * @returns list of key property names of `entity`
 */
function getServiceEntityKeys(srv, entity) {
    const { elements } = srv.entities[entity];
    return Object.keys(elements).filter(
        (elem) => elements[elem].key && !elem.startsWith('up_')
    );
}

function getBundle(req, i18nPath) {
    const { locale } = req.user;
    return new TextBundle(i18nPath, locale);
}

async function cacheDestinations(req, service) {
    const config = {
        useCache: true,
    };
    const authToken = req.headers.authorization;
    if (authToken && authToken.includes('Bearer')) {
        const [, userJwt] = authToken.split(' ');
        config.userJwt = userJwt;
    }
    return cloudSDK.getDestination(service.destination, config);
}

function getXSUAAService(xsenv, log) {
    let xsuaaService;
    try {
        xsuaaService = xsenv.getServices({ xsuaa: { tag: 'xsuaa' } });
    } catch {
        log.warn('[server][init] no xsuaa service found');
    }

    return xsuaaService;
}

async function getMappedProcessingStatusCode(msg, dbTx) {
    const { source: sourceSystemId } = msg.headers;
    const bundle = new TextBundle('../../_i18n/i18n', msg.user.locale);

    const sourceSystem = await dbTx.run(
        SELECT.one(['statusPath'])
            .from(
                'sap.c4u.foundation.retailer.configuration.CustomerOrderUtilitiesStatusSourceSystems'
            )
            .where({ sourceSystemId })
    );

    let sourceSystemStatus = extractPathFromJson(msg, sourceSystem.statusPath);

    const expirationNotificationTag = (tag) =>
        tag.toLowerCase() ===
        configConstants.PROCESSING_STATUS_EXPIRED.toLowerCase();

    if (
        msg?.data?.eventType === configConstants.EXPIRATION_NOTIFICATION &&
        msg?.data?.tags?.some(expirationNotificationTag)
    ) {
        sourceSystemStatus = configConstants.PROCESSING_STATUS_EXPIRED;
    }

    if (!sourceSystemStatus) {
        logger.error(
            `[ConfigurationService][${msg.event}]: No status found in the message by path ${sourceSystem.statusPath}`
        );
        throw new Error(
            `${bundle.getText('errorMsgConfigurationSRVMissingStatusConfig')}`
        );
    }

    const statusMappedRecord = await dbTx.run(
        SELECT.one(['processingStatus_code'])
            .from(
                'sap.c4u.foundation.retailer.configuration.CustomerOrderUtilitiesStatusMapping'
            )
            .where({
                'sourceSystem.sourceSystemId': sourceSystemId,
                sourceSystemStatus,
            })
    );

    if (!statusMappedRecord) {
        logger.error(
            `[ConfigurationService][${msg.event}]: No status mapping found for sourceSystemStatus ${sourceSystemStatus} of the system ${sourceSystemId}`
        );
        throw new Error(
            `${bundle.getText('errorMsgConfigurationSRVMissingStatusMapping')}`
        );
    }

    logger.info(
        `[ConfigurationService][${msg.event}]: CustomerOrderUtilitiesStatusMapping found for sourceSystemStatus ${sourceSystemStatus} of the system ${sourceSystemId}`
    );

    return statusMappedRecord?.processingStatus_code;
}

async function getCustomerOrderItemsWithSubscription(msg, dbTx) {
    const { subscriptionId } = msg.data;
    const customerOrderItemsWithSubscription = await dbTx.run(
        SELECT(['id', 'itemID', 'itemProcessingStatus_code'])
            .from(
                'sap.odm.utilities.sales.CustomerOrderItemWithSubscriptionReference'
            )
            .where({
                subscriptionReferenceObjectId: subscriptionId,
            })
    );

    const bundle = new TextBundle('../../_i18n/i18n', msg.user.locale);

    if (!customerOrderItemsWithSubscription.length) {
        logger.error(
            `[ConfigurationService][${msg.event}]: Customer Order is not found by subscriptionId ${subscriptionId}`
        );
        throw new Error(
            `${bundle.getText('errorMsgConfigurationSRVCustomerOrderNotFound')}`
        );
    }

    logger.info(
        `[ConfigurationService][${msg.event}]: CustomerOrder found by subscriptionId ${subscriptionId}`
    );

    return customerOrderItemsWithSubscription;
}

async function getUpdateRequests(
    srvTx,
    msg,
    processingStatusCode,
    customerOrderItemsWithSubscription
) {
    const { API_EDOM_RETAILER } = cds.services;
    const { CustomerOrderItems } = API_EDOM_RETAILER.entities;

    return customerOrderItemsWithSubscription.map(async (item) => {
        try {
            const entry = {
                processingStatus_code: processingStatusCode,
            };

            // #2593 Implement additional status for termination.
            // Customer order item status set to "terminated" when "expired" event is raised by SB and state was previously in "in termination"
            // Customer order item status set to "completed" when "expired" event is raised by SB and no termination took place

            if (
                processingStatusCode ===
                    configConstants.PROCESSING_STATUS_CODE_COMPLETED &&
                (item.itemProcessingStatus_code ===
                    configConstants.PROCESSING_STATUS_CODE_IN_TERMINATION ||
                    item.itemProcessingStatus_code ===
                        configConstants.PROCESSING_STATUS_CODE_TERMINATED)
            ) {
                entry.processingStatus_code =
                    configConstants.PROCESSING_STATUS_CODE_TERMINATED;
            }

            await srvTx.run(
                UPDATE(CustomerOrderItems).set(entry).where({
                    id: item.itemID,
                    up__id: item.id,
                })
            );
        } catch (e) {
            logger.error(
                `[ConfigurationService][${msg.event}][item] ${JSON.stringify(
                    e
                )}`
            );
        }
    });
}

module.exports = {
    recursivePopulateProperties,
    extractPathFromJson,
    deepCopy,
    getEnabledFeatures,
    getEnabledFeaturesSet,
    extractEntityAndKeys,
    hasSubsetFields,
    getServiceEntityKeys,
    groupAnnotatedServiceEntities,
    getBundle,
    cacheDestinations,
    getXSUAAService,
    getMappedProcessingStatusCode,
    getCustomerOrderItemsWithSubscription,
    getUpdateRequests,
};
