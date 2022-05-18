const logger = require('cf-nodejs-logging-support');
const bpError = require('./BusinessPartnerErrorMessages');
const { isField } = require('../../mdiclient/MDIClientHelper');
const {
    getServiceEntityKeys,
    hasSubsetFields,
    getBundle,
} = require('../helper');

const i18nPath = '../../_i18n/i18n';

// Legend:
// [BETA] = need to update line/s below when moving (from beta) to release

const mandatoryFieldsPerson = {
    person: {
        nameDetails: {
            firstName: true,
            lastName: true,
        },
    },
    addressData: [
        {
            personPostalAddress: {
                country_code: true,
                town: {
                    name: true,
                },
                primaryRegion_code: true,
                postCode: true,
            },
        },
    ],
};
const mandatoryFieldsOrg = {
    organization: {
        nameDetails: {
            formattedOrgNameLine1: true,
        },
    },
    addressData: [
        {
            organizationPostalAddress: {
                country_code: true,
                town: {
                    name: true,
                },
                primaryRegion_code: true,
                postCode: true,
            },
        },
    ],
};

function collectMissingFields(
    minimumObj,
    requestObj,
    errorList,
    errorObject,
    path = []
) {
    Object.keys(minimumObj).forEach((key) => {
        if (
            !requestObj[key] ||
            (Array.isArray(minimumObj[key]) && !requestObj[key].length)
        ) {
            errorList.push(errorObject(key, path));
        } else if (Array.isArray(minimumObj[key])) {
            requestObj[key].forEach((obj) => {
                collectMissingFields(
                    minimumObj[key][0],
                    obj,
                    errorList,
                    errorObject,
                    [...path, key]
                );
            });
        } else if (minimumObj[key] instanceof Object) {
            collectMissingFields(
                minimumObj[key],
                requestObj[key],
                errorList,
                errorObject,
                [...path, key]
            );
        }
    });
}

/**
 * Check business partner fields if it includes defined required fields and throws corresponding error messages
 * @param {Object} req request object
 * @param {Object} bp business partner (root) object
 */
function fieldValidations(req, bp) {
    const bundle = getBundle(req, i18nPath);
    const error = bpError()(bundle);

    const errorList = [];

    switch (bp.businessPartnerType) {
        case 'person':
            collectMissingFields(
                mandatoryFieldsPerson,
                bp,
                errorList,
                error.BusinessPartnerSRVValueRequired
            );
            break;
        case 'organization':
            collectMissingFields(
                mandatoryFieldsOrg,
                bp,
                errorList,
                error.BusinessPartnerSRVValueRequired
            );
            break;
        case 'businessPartnerGroup':
            errorList.push(error.BusinessPartnerSRVBpGroupNotSupported);
            break;
        default:
            // handled by CAP annotation - @(assert.range: true)
            break;
    }

    if (errorList.length > 1) {
        logger.error(
            `[businessPartnerService][Create or Update BusinessPartner status]: 400`
        );
        req.reject(error.BusinessPartnerSRVMultipleErrorsOccured(errorList));
    } else if (errorList.length === 1) {
        req.reject(errorList[0]);
    }

    if (
        bp.serviceProviderInformation &&
        bp.businessPartnerType !== 'organization'
    ) {
        req.reject(
            error.BusinessPartnerSRVSpMustBeTypeOrg.code,
            error.BusinessPartnerSRVSpMustBeTypeOrg.message
        );
    }
}

function checkDuplicatedMarketFunctionCodeNumber(
    req,
    marketFunctionCodeNumber,
    marketFunctionCodeNumbers,
    error
) {
    if (marketFunctionCodeNumber) {
        if (marketFunctionCodeNumbers.includes(marketFunctionCodeNumber)) {
            req.reject(
                error.BusinessPartnerSRVMarketFunctionCodeNumberInUse.code,
                error.BusinessPartnerSRVMarketFunctionCodeNumberInUse.message
            );
        } else {
            marketFunctionCodeNumbers.push(marketFunctionCodeNumber);
        }
    }
}

async function checkUniqueMarketFunctionCodeNumbers(req, bp, srv) {
    const bundle = getBundle(req, i18nPath);
    const error = bpError()(bundle);

    if (bp.serviceProviderInformation) {
        const marketFunctionCodeNumbers = [];
        // collect all marketFunctionCodeNumbers and throw an error if there is a duplicate
        bp.serviceProviderInformation.forEach((obj) => {
            checkDuplicatedMarketFunctionCodeNumber(
                req,
                obj.marketFunctionCodeNumber1,
                marketFunctionCodeNumbers,
                error
            );
            checkDuplicatedMarketFunctionCodeNumber(
                req,
                obj.marketFunctionCodeNumber2,
                marketFunctionCodeNumbers,
                error
            );
        });
        // check other business partners if there are no duplicate on the service provider information instances
        const res = await srv.tx(req).run(
            SELECT.from(
                'sap.odm.businesspartner.BusinessPartner.serviceProviderInformation'
            ).where({
                marketFunctionCodeNumber1: marketFunctionCodeNumbers,
                or: {
                    marketFunctionCodeNumber2: marketFunctionCodeNumbers,
                },
            })
        );
        if (res.length) {
            // throw an error if there is at least one other business partner that is using the same code number
            const codeNumUsedByOtherBps = res.filter(
                (spInfo) => bp.id !== spInfo.up__id
            ).length;
            if (codeNumUsedByOtherBps) {
                req.reject(
                    error.BusinessPartnerSRVMarketFunctionCodeNumberInUse.code,
                    error.BusinessPartnerSRVMarketFunctionCodeNumberInUse
                        .message
                );
            }
        }
    }
}

function parseCustomAnnotationConditions(restrictDelEntity) {
    const fieldsToCheck = {};
    if (restrictDelEntity?.where?.length > 0) {
        restrictDelEntity.where.forEach((whereClause) => {
            const whereSplit = whereClause.trim().split(' ');
            const simpleWhere = whereSplit.length === 3;
            const whereKey = whereSplit[0];
            const complexWhere = restrictDelEntity?.contains?.length > 0;
            // check if deletion condition is a simple value of a field
            if (simpleWhere && !complexWhere) {
                const whereValue = whereSplit[2];
                fieldsToCheck[whereKey] = whereValue;
                // or the deletion condition is a value of a nested field
            } else if (!simpleWhere && complexWhere) {
                restrictDelEntity.contains.forEach((containsClause) => {
                    const containsSplit = containsClause.trim().split(' ');
                    const containsKey = containsSplit[0];
                    const containsValue = containsSplit[2];
                    fieldsToCheck[whereKey] = [
                        { [containsKey]: containsValue },
                    ];
                });
            }
        });
    }
    return fieldsToCheck;
}

function errorMsgForCustomAnnotationConditions(restrictDelEntity) {
    const errorMessage = [];
    if (restrictDelEntity?.where?.length > 0) {
        restrictDelEntity.where.forEach((whereClause) => {
            const whereSplit = whereClause.trim().split(' ');
            const simpleWhere = whereSplit.length === 3;
            const whereKey = whereSplit[0];
            const complexWhere = restrictDelEntity?.contains?.length > 0;
            // check if deletion condition is a simple value of a field
            if (simpleWhere && !complexWhere) {
                const whereValue = whereSplit[2];
                errorMessage.push({ whereKey, whereValue });
                // or the deletion condition is a value of a nested field
            } else if (!simpleWhere && complexWhere) {
                restrictDelEntity.contains.forEach((containsClause) => {
                    const containsSplit = containsClause.trim().split(' ');
                    const containsKey = containsSplit[0];
                    const containsValue = containsSplit[2];
                    errorMessage.push({ containsKey, containsValue });
                });
            }
        });
    }
    return errorMessage;
}

const getBpField = (bpField, fieldsToCheck = {}) =>
    Object.keys(fieldsToCheck).length > 0
        ? bpField.filter((bpObjKeyObj) =>
              hasSubsetFields(bpObjKeyObj, fieldsToCheck)
          )
        : bpField;

const extractBpFieldKeys = (bpField, entityKeys = []) =>
    bpField.map((obj) => {
        const objKeysOnly = {};
        entityKeys.forEach((k) => {
            objKeysOnly[k] = obj[k];
        });
        return objKeysOnly;
    });

function collectRestrictDeleteFields(
    oldObjField,
    newObjField,
    fieldsToCheck,
    entityKeys,
    errorObject,
    errorList
) {
    // if the delete restriction has no conditions AND the updated field is shorter than the original field
    // push an error right away
    if (
        Object.keys(fieldsToCheck).length === 0 &&
        newObjField.length < oldObjField.length
    ) {
        errorList.push(errorObject);
    } else {
        // if the delete restriction has some conditions AND the updated field has the same length as the original field
        // if the delete restriction has some conditions AND the updated field has shorter length than the original field
        // if the delete restriction has no   conditions AND the updated field has the same length as the original field

        // Step 1: If there are conditions for the restriction of delete
        // filter all the objects that passes the same conditions

        // Step 2: Reformat the list of objects by keeping each object's keys
        // This is to properly identify if two objects are the same object or not
        // Note: obj1 and obj2 are the same object if their keys are the same
        const oldObjFieldKeysOnly = extractBpFieldKeys(
            getBpField(oldObjField, fieldsToCheck),
            entityKeys
        );
        const newObjFieldKeysOnly = extractBpFieldKeys(
            getBpField(newObjField, fieldsToCheck),
            entityKeys
        );

        // Step 3: Get the objects that both exists between the updated object and original object
        const commonObjBetweenOldNew = oldObjFieldKeysOnly.filter((obj) =>
            JSON.stringify(newObjFieldKeysOnly).includes(JSON.stringify(obj))
        );

        // Step 4: If the common objects between the updated and original object is less than the old object
        if (commonObjBetweenOldNew.length < oldObjFieldKeysOnly.length) {
            errorList.push(errorObject);
        }
    }
}

/**
 * Traverses the old object by checking each field and checks if the field has a corresponding custom restriction
 * @param {*} srv CDS Service
 * @param {Array} errorList Array to collect error messages
 * @param {Function} errorObject error function that creates the error object
 * @param {Object} restrictEntities Object that contains a list of entities
 * @param {String} parentEntity root entity (e.g. BusinessPartner)
 * @param {Object} oldObj Object before update
 * @param {Object} newObj Object after update
 */
function collectRestrictFields(
    srv,
    errorList,
    errorObject,
    restrictEntities,
    parentEntity,
    oldObj,
    newObj
) {
    const { elements } = srv.entities[parentEntity];

    const objKeys = Object.keys(oldObj);
    objKeys.forEach((key) => {
        if (isField(elements[key], 'Composition', 'is2one') && newObj[key]) {
            if (newObj[key]) {
                const childEntity = elements[key].target.split('.').pop();
                collectRestrictFields(
                    srv,
                    errorList,
                    errorObject,
                    restrictEntities,
                    childEntity,
                    oldObj[key],
                    newObj[key]
                );
            }
        } else if (
            isField(elements[key], 'Composition', 'is2many') &&
            newObj[key]
        ) {
            const childEntity = elements[key].target.split('.').pop();
            const entityKeys = getServiceEntityKeys(srv, childEntity);

            // NOTE: custom DELETE restriction is the only supported restriction
            if (restrictEntities[childEntity]) {
                // check if restriction contains conditions
                const fieldsToCheck = parseCustomAnnotationConditions(
                    restrictEntities[childEntity]
                );
                const errorMsgConditions =
                    errorMsgForCustomAnnotationConditions(
                        restrictEntities[childEntity]
                    );

                // Restrict DELETE
                collectRestrictDeleteFields(
                    oldObj[key],
                    newObj[key],
                    fieldsToCheck,
                    entityKeys,
                    errorObject(key, errorMsgConditions),
                    errorList
                );
            }

            // before recursing, make sure that the old and new objects are the same instance
            // by checking if they have the same keys
            oldObj[key]?.forEach((obj1) => {
                const obj1KeysOnly = {};
                entityKeys.forEach((k) => {
                    obj1KeysOnly[k] = obj1[k];
                });
                newObj[key]?.forEach((obj2) => {
                    const obj2KeysOnly = {};
                    entityKeys.forEach((k) => {
                        obj2KeysOnly[k] = obj2[k];
                    });
                    if (
                        JSON.stringify(obj1KeysOnly) ===
                        JSON.stringify(obj2KeysOnly)
                    ) {
                        collectRestrictFields(
                            srv,
                            errorList,
                            errorObject,
                            restrictEntities,
                            childEntity,
                            oldObj,
                            newObj
                        );
                    }
                });
            });
        }
    });
}

module.exports = (enabledFeatures = []) => {
    // remove primitive fields from the result,
    // when it is not present in the update payload(inBP)
    function removePrimitiveFields(exBP, inBP, result) {
        const exBPKeys = Object.keys(exBP);
        const inBPKeys = Object.keys(inBP);
        const exBPKeysDiff = exBPKeys.filter((x) => !inBPKeys.includes(x));
        if (exBPKeysDiff.length) {
            exBPKeysDiff.forEach((key) => {
                if (
                    !Array.isArray(exBP[key]) &&
                    !(exBP[key] instanceof Object)
                ) {
                    // eslint-disable-next-line no-param-reassign
                    delete result[key];
                }
            });
        }
        return result;
    }

    function patchBpObj(exBP, inBP, method, isFromSubEntity = false) {
        let result = JSON.parse(JSON.stringify(exBP));
        const exBPKeys = Object.keys(exBP);
        const inBPKeys = Object.keys(inBP);
        inBPKeys.forEach((key) => {
            if (!exBPKeys.includes(key)) {
                // if key doesn't exist in exBP, add it
                result[key] = inBP[key];
            } else if (
                inBP[key] === null ||
                (Array.isArray(inBP[key]) && !inBP[key].length)
            ) {
                // if inBP has an field or array null, delete the key
                delete result[key];
            } else if (Array.isArray(inBP[key]) && inBP[key].length) {
                // if inBP array is not empty, replace the exBP array
                result[key] = isFromSubEntity
                    ? patchBpObj(exBP[key], inBP[key], method, true)
                    : inBP[key];
            } else if (inBP[key] instanceof Object) {
                // if key is a nested object, recurse deeper
                result[key] = patchBpObj(exBP[key], inBP[key], method);
            } else if (exBP[key] === inBP[key]) {
                result[key] = exBP[key];
            } else {
                result[key] = inBP[key];
            }
        });

        if (method === 'PUT') {
            result = removePrimitiveFields(exBP, inBP, result);
        }

        return result;
    }

    function restrictDeleteValidation(
        req,
        srv,
        restrictDelEntities,
        oldBp,
        newBp
    ) {
        const bundle = getBundle(req, i18nPath);
        const error = bpError(enabledFeatures)(bundle);
        const errorList = [];
        const rootEntity = 'BusinessPartner';

        // collect error
        collectRestrictFields(
            srv,
            errorList,
            error.BusinessPartnerSRVDeleteRestricted,
            restrictDelEntities,
            rootEntity,
            oldBp,
            newBp
        );

        // throw error
        if (errorList.length > 1) {
            logger.error(
                `[businessPartnerService][restrictDeleteValidation]: 400`
            );
            req.reject(
                error.BusinessPartnerSRVMultipleErrorsOccured(errorList)
            );
        } else if (errorList.length === 1) {
            req.reject(errorList[0]);
        }
    }

    async function updateValidations(
        req,
        srv,
        customAnnotations,
        expandedBp,
        isFromSubEntity = false
    ) {
        const bundle = getBundle(req, i18nPath);
        const error = bpError(enabledFeatures)(bundle);

        const { method, data } = req;
        const updatedBP = patchBpObj(expandedBp, data, method, isFromSubEntity);

        if (expandedBp.businessPartnerType !== updatedBP.businessPartnerType) {
            req.reject(
                error.BusinessPartnerSRVBpTypeChangeNotSupported.code,
                error.BusinessPartnerSRVBpTypeChangeNotSupported.message
            );
        }
        if (enabledFeatures.includes('business-partner-enhancements')) {
            // get entities with delete restriction
            const restrictDeleteEntities = customAnnotations?.block?.DELETE;
            if (restrictDeleteEntities) {
                restrictDeleteValidation(
                    req,
                    srv,
                    restrictDeleteEntities,
                    expandedBp,
                    updatedBP
                );
            }
        }
        fieldValidations(req, updatedBP);
        await checkUniqueMarketFunctionCodeNumbers(req, updatedBP, srv);
    }

    return {
        updateValidations,
        fieldValidations,
        checkUniqueMarketFunctionCodeNumbers,
        patchBpObj,
        restrictDeleteValidation,
    };
};
