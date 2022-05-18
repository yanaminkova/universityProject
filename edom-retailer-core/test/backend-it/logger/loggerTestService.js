const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');

module.exports = async (srv) => {
    /**
     * The function raises an exception when selecting from a non-existent table
     * @returns {String} - 'ok' or 'error'
     */
    srv.on('WrongSQLQuery', async (req) => {
        logger.info(req.params);
        const tx = cds.transaction(req);
        const result = await tx.run(SELECT.from('WrongTableName'));
        return result ? 'ok' : 'error';
    });
};
