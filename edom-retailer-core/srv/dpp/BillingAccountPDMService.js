const logger = require('cf-nodejs-logging-support');

module.exports = async (srv) => {
    const db = await cds.connect.to('db');

    /**
     * Indicates the helper function for retrieving Customer Orders Partners.
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {Object} cds.Request - Request Object.
     * @param {String} dataSubjectID - Data Subject IDs.
     * @returns {Array} - List of Buinness Partners.
     */

    async function getBillingAccountPartners(req, dataSubjectID) {
        const baPartners = await db.transaction(req).run(
            SELECT.one(['id'])
                .from(`sap.odm.businesspartner.BusinessPartner`)
                .where({
                    id: dataSubjectID,
                })
        );

        return baPartners;
    }

    srv.on('READ', 'BusinessPartner', async (req) => {
        const loggerScope = '[DPP_PDM][READ][BusinessPartner]';
        logger.info(`${loggerScope}`);

        const { query } = req;
        logger.info(`${loggerScope}: query=${JSON.stringify(query)}`);

        const ids = query.SELECT.where
            .filter((i) => typeof i === 'object' && i.val != null)
            .map((i) => i.val);

        return getBillingAccountPartners(req, ids);
    });
};
