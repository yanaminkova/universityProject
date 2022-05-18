const cds = require('@sap/cds');
const cloudSDK = require('@sap-cloud-sdk/core');
const ExecuteHTTPRequest = require('../lib/cloudSDKHelper/executeHttpRequest');
const BusinessPartnerKeyMappingServiceBeta = require('./API_BP_KEY_MAPPINGBeta');

const { getBundle } = require('../lib/helper');

const i18nPath = '../../_i18n/i18n';

class SalesOrderAPI {
    /**
     * Get SDOrder Details
     * @param {*} docNum
     * @returns
     */
    // eslint-disable-next-line class-methods-use-this
    async getSalesOrderItems(sOrder, destination, docNum, jwt) {
        const sdOrdersDetails = await ExecuteHTTPRequest.get(
            {
                destinationName: sOrder.destination,
                jwt,
            },
            {
                url: `${destination.originalProperties.SDOrderAPI}/A_SalesOrder('${docNum}')/to_Item`,
            }
        );
        return sdOrdersDetails.data.d.results;
    }

    /**
     * Post SD Order
     * @param {*} sdPayload
     * @returns {}
     */
    async postSDOrder(req, sdPayload, partners) {
        let sdOrderItemDetails = [];
        let documentNumber = '';
        let destName;
        let bpUUID;
        const bpGUID = [];
        let bpS4DisplayId;
        let msg;
        const db = await cds.connect.to('db');
        const bundle = getBundle(req, i18nPath);
        try {
            const sOrder = await cds.connect.to('Sales_Distribution_Order');

            const jwt = req.headers.authorization.substr(
                7,
                req.headers.authorization.length
            );
            destName = sOrder.destination;
            const destination = await cloudSDK.useOrFetchDestination({
                destinationName: sOrder.destination,
                jwt,
            });

            if (destination == null) {
                msg = `${bundle.getText(
                    'errorMsgDistributionSDErrorFetchingDestination'
                )}`;
            } else if (!destination.originalProperties.BusinessSystem) {
                msg = `${bundle.getText(
                    'errorMsgDistributionSDBusinessSystemNotFound'
                )}`;
            } else {
                const businessSystem =
                    destination.originalProperties.BusinessSystem;
                const PartnerNumber = sdPayload ? sdPayload.SoldToParty : null;
                if (partners.businessPartner.id) {
                    bpGUID.id = partners.businessPartner.id;
                } else {
                    bpUUID = await db
                        .transaction(req)
                        .run(
                            SELECT.from(
                                `sap.odm.businesspartner.BusinessPartner`
                            )
                                .columns('id', 'displayId')
                                .where({ displayId: PartnerNumber })
                        );
                    bpGUID.id = bpUUID[0]?.id;
                }
                const arrBpUUID = [bpGUID.id];
                [bpS4DisplayId] =
                    await new BusinessPartnerKeyMappingServiceBeta().getBPKeyMappingByBpUUID(
                        req,
                        arrBpUUID,
                        businessSystem
                    );
                if (bpS4DisplayId?.length === 0 || !bpS4DisplayId) {
                    msg = `${bundle.getText(
                        'errorMsgDistributionSDBPKeyMappingNotFound'
                    )} ${sdPayload.SoldToParty}`;
                }
            }

            // If no error messages, then proceed with creating Sales Order
            if (!msg) {
                const paySd = sdPayload;
                paySd.SoldToParty = bpS4DisplayId[1]?.shift();

                const resp = await ExecuteHTTPRequest.post(
                    { destinationName: sOrder.destination, jwt },
                    {
                        headers: {
                            accept: 'application/json,text/plain',
                            'content-type': 'application/json',
                            client_id: destination.username,
                            client_secret: destination.password,
                        },
                        timeout: 60000,
                        url: `${destination.url}/A_SalesOrder`,
                        data: sdPayload,
                    },
                    { fetchCsrfToken: true }
                );

                documentNumber = resp.data.d.SalesOrder;
                if (documentNumber) {
                    sdOrderItemDetails = await this.getSalesOrderItems(
                        sOrder,
                        destination,
                        documentNumber,
                        jwt
                    );
                }
            }
        } catch (error) {
            return error;
        }

        return {
            destName,
            documentNumber,
            sdOrderItemDetails,
            msg,
        };
    }
}

module.exports = SalesOrderAPI;
