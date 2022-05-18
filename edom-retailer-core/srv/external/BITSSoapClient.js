/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
const logger = require('cf-nodejs-logging-support');
const soap = require('soap');
const cds = require('@sap/cds');

const loggerScope = `[BillableItemsService]`;
const { getBundle } = require('../lib/helper');

const i18nPath = '../../_i18n/i18n';

class BITSSoapClient {
    /**
     * connection to Convergent Invoicing system and posting BillabelItems
     * @param {*} wsdl
     * @param {*} destName
     * @param {*} req
     * @param {*} reqPayload
     * @returns
     */
    async POSTBillableItems(
        wsdl,
        dest,
        reqPayload,
        billId,
        req,
        providerContract
    ) {
        let soapClient;
        const bundle = getBundle(req, i18nPath);

        try {
            soapClient = await soap.createClientAsync(wsdl);
            soapClient.setSecurity(
                new soap.BasicAuthSecurity(
                    dest.originalProperties.User,
                    dest.originalProperties.Password
                )
            );

            soapClient.setEndpoint(
                dest.originalProperties.BillableItemsCreateUrl
            );
            // adding SOAP Headers with namespace
            soapClient.addSoapHeader(
                {
                    Action: 'http://sap.com/xi/FI-CA-INV/BillableItemsCreateRequest_In/BillableItemsCreateRequest_InRequest',
                    MessageID: `uuid:${cds.utils.uuid()}`,
                },
                '',
                'wsa',
                'http://schemas.xmlsoap.org/ws/2004/08/addressing'
            );

            soapClient.setSOAPAction(
                'http://sap.com/xi/FI-CA-INV/BillableItemsCreateRequest_In/BillableItemsCreateRequest_InRequest'
            );
            // calling the service
            const resp =
                soapClient.BillableItemsCreateRequest_InAsync(reqPayload);
            return resp;
        } catch (error) {
            if (providerContract !== null || providerContract !== undefined) {
                logger.error(
                    `${loggerScope}[ProviderContract #${providerContract}] ${bundle.getText(
                        'errorMsgBillableItemsBITSSoapPostBitsFail'
                    )}`
                );
            } else {
                logger.error(
                    `${loggerScope}[BillId #${billId}] ${bundle.getText(
                        'errorMsgBillableItemsBITSSoapPostBitsFail'
                    )}`
                );
            }
            return Promise.reject(error.message);
        }
    }
}

module.exports = BITSSoapClient;
