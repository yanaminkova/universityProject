/**
 *  Libraries Required
 */
const logger = require('cf-nodejs-logging-support');
const cds = require('@sap/cds');
const path = require('path');
const SoapClient = require('../../external/SoapClient');
const billingAccountHelper = require('../../lib/billingaccount/billingAccountHelper');
const AuditLogService = require('../../dpp/AuditLogService');

/**
 * Const declaration for literals
 */
const wsdlPath = 'lib/billingaccount/wsdlCA.wsdl';
const wsdl = path.join(__dirname, '../../', wsdlPath);
const S4HDestination = 'S4H_SOAP_ContractAccount';

module.exports = async (srv) => {
    const contractAccountMessaging = await cds.connect.to(
        'contractAccountMessaging'
    );
    /**
     * Enterprise Messaging
     * Consume messages from Event Mesh and trigger Creation / Update of Billing Account in C4Uf
     * @param {Object} msg - Event Message.
     */
    contractAccountMessaging.on(
        [
            '+/+/+/ce/sap/s4/beh/contractaccount/v1/ContractAccount/Changed/v1',
            '+/+/+/ce/sap/s4/beh/contractaccount/v1/ContractAccount/Created/v1',
        ],
        async (msg, next) => {
            const message = msg;
            const token = msg.context._.req.authInfo.getAppToken();
            message.headers.authorization = 'Bearer '.concat(token);
            try {
                await billingAccountHelper.baOnDemandRead(
                    message,
                    next,
                    SoapClient,
                    S4HDestination,
                    wsdl,
                    message.data.ContractAccount
                );
            } catch (error) {
                logger.error('Error while updating billing Account: ', error);
            }
        }
    );
    AuditLogService.registerHandler(srv);
};
