const logger = require('cf-nodejs-logging-support');
const helper = require('../helper');

const bpTable = 'sap.odm.businesspartner.BusinessPartner';

const guidRegexPattern =
    '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';

const getExpandedBPQuery = (whereClause, bpEntity) =>
    /* eslint-disable */
    SELECT.one
        .from(bpEntity)
        .columns((bp) => {
            bp`.*`;
            bp.bankAccounts((a) => a`.*`);
            bp.taxNumbers((a) => a`.*`);
            bp.roles((a) => a`.*`);
            bp.serviceProviderInformation((a) => a`.*`);
            bp.person((a) => {
                a`.*`;
                a.nameDetails((b) => b`.*`);
            });
            bp.organization((a) => {
                a`.*`;
                a.nameDetails((b) => b`.*`);
            });
            bp.addressData((a) => {
                a`.*`;
                a.usages((b) => b`.*`);
                a.personPostalAddress((b) => b`.*`);
                a.organizationPostalAddress((b) => b`.*`);
                a.emailAddresses((b) => b`.*`);
                a.phoneNumbers((b) => b`.*`);
            });
            bp.customerInformation((a) => {
                a`.*`;
                a.salesArrangements((b) => {
                    b`.*`;
                    b.functions((c) => c`.*`);
                });
                a.taxClassifications((b) => b`.*`);
            });
        })
        .where(whereClause);
/* eslint-enable */

const getExpandedBpMdiBookKeepingQuery = (whereClause, bpEntity) =>
    /* eslint-disable */
    SELECT.one
        .from(bpEntity)
        .columns((bp) => {
            bp`.*`;
            bp.mdiBookKeeping((a) => {
                a`.*`;
            });
        })
        .where(whereClause);
/* eslint-enable */

const getExpandedBpAddressDataQuery = (whereClause, bpEntity) =>
    /* eslint-disable */
    SELECT.one
        .from(bpEntity)
        .columns((bp) => {
            bp`.*`;
            bp.addressData((a) => {
                a`.*`;
                a.personPostalAddress((b) => b`.*`);
                a.organizationPostalAddress((b) => b`.*`);
            });
        })
        .where(whereClause);
/* eslint-enable */

function extractBpEntityId(req) {
    const { query } = req;
    const entityAndKeysArr = helper.extractEntityAndKeys(query);
    return entityAndKeysArr.shift()?.keys?.id;
}

function trimData(obj) {
    const tempObj = obj;
    Object.keys(tempObj).forEach((key) => {
        if (
            tempObj[key] === null ||
            (Array.isArray(tempObj[key]) && !tempObj[key].length)
        ) {
            delete tempObj[key];
        } else if (tempObj[key] instanceof Object) {
            trimData(tempObj[key]);
        }
    });
    return tempObj;
}

/**
 * Get the expanded business partner data for the given business partner id.
 * @param id - The id of the business partner to retrieve.
 * @param [query] - The query to run against the database.
 * @returns The expanded BP data.
 */
async function getExpandedBP(id, query = getExpandedBPQuery) {
    let bpData = null;
    if (id) {
        const db = await cds.connect.to('db');
        try {
            bpData = await db.run(query({ id }, bpTable));
        } catch (err) {
            logger.error(
                `[BusinessPartnerService][getExpandedBP]: ${err.message}`
            );
        }
    }
    return bpData ? trimData(bpData) : bpData;
}

// Note: Used by Billing Account. Please update code then remove this function
// Takes in a url and returns the first id and entity on that url
//   eg.
//       "/addressData/<guid>"
//          => { id: <guid>, entity: "addressData" }
//       "/person"
//          => { id: undefined, entity: "person" }
//       "/BusinessPartner/<guid1>/addressData/<guid2>"
//          => { id: <guid1>, entity: "BusinessPartner" }
const getEntityAndId = (url) => {
    const trimmedUrl = url[0] === '/' ? url.substr(1) : url;
    const id = trimmedUrl.match(guidRegexPattern)?.[0];
    const entityMatchIndex = Math.min(
        trimmedUrl.match(/\//)?.index || trimmedUrl.length,
        trimmedUrl.match(/\(/)?.index || trimmedUrl.length
    );
    const entity = trimmedUrl.substr(0, entityMatchIndex);
    return { id, entity };
};

// Note: Used by Billing Account. Please update code then remove this function
// Splits the url into entities
//   eg.
//       "/BusinessPartner(<guid1>)/addressData/<guid2>/personPostalAddress"
//          => [
//               "/BusinessPartner(<guid1>)",
//               "/addressData/<guid2>",
//               "/personPostalAddress",
//             ]
const splitUrlIntoEntities = (url) => {
    const bpUrlRegex = new RegExp(
        `\\/\\w+(\\/${guidRegexPattern}|\\(${guidRegexPattern}\\))*`,
        'g'
    );
    return url.match(bpUrlRegex);
};

// Note: Used by Billing Account. Please update code then remove this function
const isGuid = (str) => {
    const guidRegex = `^${guidRegexPattern}$`;
    const regexResult = str.match(guidRegex);
    return regexResult !== null;
};

const constructBPForCreateSubEntity = (req, expandedBp) => {
    const { query, data } = req;
    const entityAndKeysArr = helper.extractEntityAndKeys(query);
    entityAndKeysArr.shift(); // removing root entity

    const constructedBP = helper.deepCopy(expandedBp);
    let subEntityPointer = constructedBP;

    entityAndKeysArr.forEach(({ entity: subEntity, keys, complexKeys }, i) => {
        const isChildOfToMany = !!keys;
        const isLastSubentity = i + 1 === entityAndKeysArr.length;

        // If it's the last level, attach/push the subentity data
        //   Otherwise set the pointer to the inner object
        if (isLastSubentity) {
            if (!isChildOfToMany) {
                subEntityPointer[subEntity] = subEntityPointer[subEntity] || [];
                subEntityPointer[subEntity].push(data);
            }
        } else if (isChildOfToMany) {
            // find the correct object based on the keys passed
            [subEntityPointer] = subEntityPointer[subEntity].filter(
                (obj) =>
                    helper.hasSubsetFields(obj, keys) ||
                    helper.hasSubsetFields(obj, complexKeys)
            );
        } else {
            subEntityPointer = subEntityPointer[subEntity];
        }
    });
    return constructedBP;
};

// Note: Used by Billing Account. Please update code then remove this function
const constructBPForUpdateSubEntityOld = (req) => {
    const entityUrls = splitUrlIntoEntities(req.req.url);
    const bpEntityUrl = entityUrls.shift();
    const { id: bpId } = getEntityAndId(bpEntityUrl);

    const constructedBP = { id: bpId };
    let subEntityPointer = constructedBP;

    for (let i = 0; i < entityUrls.length; i += 1) {
        const { id: subEntityId, entity: subEntity } = getEntityAndId(
            entityUrls[i]
        );
        const isComposition = !!subEntityId;

        // Clear the inner object and set the pointer to that object
        if (isComposition) {
            subEntityPointer[subEntity] = [{ id: subEntityId }];
            // eslint-disable-next-line prefer-destructuring
            subEntityPointer = subEntityPointer[subEntity][0];
        } else {
            subEntityPointer[subEntity] = {};
            // eslint-disable-next-line prefer-destructuring
            subEntityPointer = subEntityPointer[subEntity];
        }

        // if it's the last level, attach the subentity data
        if (i + 1 === entityUrls.length) {
            Object.assign(subEntityPointer, req.data);
        }
    }
    return constructedBP;
};

const constructBPForUpdateSubEntity = (req, expandedBp) => {
    const { query, data } = req;
    const entityAndKeysArr = helper.extractEntityAndKeys(query);
    entityAndKeysArr.shift(); // removing root entity

    const constructedBP = helper.deepCopy(expandedBp);
    let subEntityPointer = constructedBP;

    entityAndKeysArr.forEach(({ entity: subEntity, keys, complexKeys }, i) => {
        const isChildOfToMany = !!keys;
        const isLastSubentity = i + 1 === entityAndKeysArr.length;

        if (isLastSubentity) {
            if (isChildOfToMany) {
                [subEntityPointer] = subEntityPointer[subEntity].filter(
                    (obj) =>
                        helper.hasSubsetFields(obj, keys) ||
                        helper.hasSubsetFields(obj, complexKeys)
                );
            } else {
                subEntityPointer = subEntityPointer[subEntity];
            }
            Object.assign(subEntityPointer, data);
        } else if (isChildOfToMany) {
            // find the correct object based on the keys passed
            [subEntityPointer] = subEntityPointer[subEntity].filter(
                (obj) =>
                    helper.hasSubsetFields(obj, keys) ||
                    helper.hasSubsetFields(obj, complexKeys)
            );
        } else {
            subEntityPointer = subEntityPointer[subEntity];
        }
    });
    return constructedBP;
};

const constructBPForDeleteSubEntity = (req, expandedBp) => {
    const { query } = req;
    const entityAndKeysArr = helper.extractEntityAndKeys(query);
    entityAndKeysArr.shift(); // removing root entity

    const constructedBP = helper.deepCopy(expandedBp);
    let subEntityPointer = constructedBP;

    entityAndKeysArr.forEach(({ entity: subEntity, keys, complexKeys }, i) => {
        const isChildOfToMany = !!keys;
        const isLastSubentity = i + 1 === entityAndKeysArr.length;

        // If it's the last level, delete the subentity data
        //   Otherwise set the pointer to the inner object
        if (isLastSubentity) {
            if (isChildOfToMany) {
                subEntityPointer[subEntity] = subEntityPointer[
                    subEntity
                ].filter(
                    (obj) =>
                        !(
                            helper.hasSubsetFields(obj, keys) ||
                            helper.hasSubsetFields(obj, complexKeys)
                        )
                );
            } else {
                subEntityPointer[subEntity] = null;
            }
        } else if (isChildOfToMany) {
            // find the correct object based on the keys passed
            [subEntityPointer] = subEntityPointer[subEntity].filter(
                (obj) =>
                    helper.hasSubsetFields(obj, keys) ||
                    helper.hasSubsetFields(obj, complexKeys)
            );
        } else {
            subEntityPointer = subEntityPointer[subEntity];
        }
    });
    return constructedBP;
};

/* eslint-disable no-unused-vars */
module.exports = (enabledFeatures = []) => ({
    extractBpEntityId,
    getExpandedBPQuery,
    getExpandedBpMdiBookKeepingQuery,
    getExpandedBpAddressDataQuery,
    constructBPForCreateSubEntity,
    constructBPForUpdateSubEntity,
    constructBPForDeleteSubEntity,
    getExpandedBP,
    // Note: Used by Billing Account. Please update code then remove functions below
    isGuid,
    getEntityAndId,
    splitUrlIntoEntities,
    constructBPForUpdateSubEntityOld,
});
