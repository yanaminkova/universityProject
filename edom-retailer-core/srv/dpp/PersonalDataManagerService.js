const logger = require('cf-nodejs-logging-support');

module.exports = async (srv) => {
    const db = await cds.connect.to('db');

    /**
     * Indicates the helper function for retrieving Customer Orders Partners.
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {Object} cds.Request - Request Object.
     * @param {String} dataSubjectID - Data Subject IDs.
     * @returns {Array} - List of Customer Order Partners.
     */
    async function getCustomerOrderPartners(req, dataSubjectID) {
        const customerOrderPartners = await db.transaction(req).run(
            SELECT.one(['businessPartnerId'])
                .from(`sap.odm.sales.CustomerOrder.partners`)
                .where({
                    businessPartnerId: dataSubjectID,
                })
        );

        logger.debug(
            `[PerosnalDataManagerService][customerOrderPartners]: ${JSON.stringify(
                customerOrderPartners
            )}`
        );

        return customerOrderPartners;
    }

    srv.on('READ', 'BusinessPartner', async (req) => {
        const loggerScope = '[DPP_PDM][READ][BusinessPartner]';
        logger.info(`${loggerScope}`);

        const { query } = req;
        logger.info(`${loggerScope}: query=${JSON.stringify(query)}`);

        // {"SELECT":{"from":{"ref":["sap.c4u.edom.retailer.dpp.DPP_PDM.BusinessPartner"]},
        // "columns":[{"ref":["BusinessPartner"]},{"ref":["Id"]}],
        // "where":["(",{"ref":["BusinessPartner"]},"=",{"val":"SEHO"},
        // "or",{"func":"lower","args":[{"ref":["BusinessPartner"]}]},"=",
        // {"val":"seho"},")"],"limit":{"rows":{"val":1000}},
        // "orderBy":[{"ref":["Id"],"sort":"asc"}]}}
        const ids = query.SELECT.where
            .filter((i) => typeof i === 'object' && i.val != null)
            .map((i) => i.val);

        return getCustomerOrderPartners(req, ids);
    });
};
