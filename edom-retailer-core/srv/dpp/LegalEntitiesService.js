const logger = require('cf-nodejs-logging-support');
const config = require('../lib/config');

module.exports = async (srv) => {
    /**
     * Legal Entities
     * Indicates the endpoint for getting Legal Entities from the system
     * @returns {Array} - List of Legal Entities
     */
    srv.on('BusinessPartner', async (req) => {
        const { data } = req;
        logger.info(
            `[DataRetentionManagerService][legalEntities]: ${JSON.stringify(
                data
            )}`
        );

        try {
            const db = await cds.connect.to('db');
            const legalEntity = await db
                .transaction(req)
                .run(SELECT.from(`sap.odm.dpp.DataController`));

            const value =
                legalEntity.length > 1
                    ? legalEntity.find(
                          (entity) => entity.name === config.LEGAL_ENTITY_NAME
                      ).displayId
                    : legalEntity[0].displayId;

            const valueDesc =
                legalEntity.length > 1
                    ? legalEntity.find(
                          (entity) =>
                              entity.name === config.LEGAL_ENTITY_DESC_NAME
                      ).displayId
                    : legalEntity[0].name;

            return [
                {
                    value,
                    valueDesc,
                },
            ];
        } catch (error) {
            logger.error(
                `[DataRetentionManagerService][legalEntities]: ${error}`
            );
            req.error(error.message);
        }
        return [];
    });
};
