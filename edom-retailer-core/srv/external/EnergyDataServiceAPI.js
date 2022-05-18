const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const cloudSDK = require('@sap-cloud-sdk/core');
const ExecuteHttpRequest = require('../lib/cloudSDKHelper/executeHttpRequest');
const { getBundle } = require('../lib/helper');

const i18nPath = '../../_i18n/i18n';

class EnergyDataServiceAPI {
    /**
     * Post technical master data
     * @param {*} req
     * @param {*} tmdPayload
     * @returns
     */
    static async postTMD(req, tmdPayload) {
        const bundle = getBundle(req, i18nPath);
        try {
            const c4eDest = await cds.connect.to('C4EDestination');

            const jwt = req.headers.authorization.substr(
                7,
                req.headers.authorization.length
            );

            const destination = await cloudSDK.useOrFetchDestination({
                destinationName: c4eDest.destination,
                jwt,
            });

            return await ExecuteHttpRequest.post(
                { destinationName: c4eDest.destination, jwt },
                {
                    headers: {
                        accept: '*/*',
                        'content-type': 'application/xml',
                        client_id: destination.clientId,
                        client_secret: destination.clientSecret,
                    },
                    timeout: 60000,
                    url: `${destination.url}/api/v1/core`,
                    data: tmdPayload,
                }
            );
        } catch (error) {
            logger.error(
                `${bundle.getText(
                    'errorMsgTechnicalMasterDataEDSErrorCreationTMD'
                )}`,
                error
            );
        }
        return null;
    }

    /**
     * get SLP profile data
     * @param {*} req
     * @returns
     */
    static async getSlpProfiles(req) {
        const bundle = getBundle(req, i18nPath);
        try {
            const c4eDest = await cds.connect.to('C4ESLPDestination');

            const jwt = req.headers.authorization.substr(
                7,
                req.headers.authorization.length
            );

            const destination = await cloudSDK.useOrFetchDestination({
                destinationName: c4eDest.destination,
                jwt,
            });

            return await ExecuteHttpRequest.get(
                { destinationName: c4eDest.destination, jwt },
                {
                    headers: {
                        accept: '*/*',
                        client_id: destination.clientId,
                        client_secret: destination.clientSecret,
                    },
                    timeout: 60000,
                    url: `${destination.url}/odata/v4/SlpProfileService/ProfileHeader`,
                }
            );
        } catch (error) {
            logger.error(
                `${bundle.getText(
                    'errorMsgTechnicalMasterDataEDSErrorFetchingSLP'
                )}`,
                error
            );
        }
        return null;
    }

    /**
     * get Meter Read data from C4E
     * @param {*} req
     * @param {*} bdsPayload
     * @returns
     */
    static async getMeterReads(req, BDSDestinationProperties, bdsPayload) {
        const bundle = getBundle(req, i18nPath);
        try {
            if (!BDSDestinationProperties) {
                const msg = bundle.getText(
                    'errorMsgTechnicalMasterDataEDSErrorFetchingBDSDestinationConfig'
                );
                logger.error(msg);
                return msg;
            }

            const jwt = req.headers.authorization.substr(
                7,
                req.headers.authorization.length
            );

            const meterReadResponse = await ExecuteHttpRequest.post(
                { destinationName: BDSDestinationProperties.Name, jwt },
                {
                    headers: {
                        accept: '*/*',
                        client_id: BDSDestinationProperties.clientId,
                        client_secret: BDSDestinationProperties.clientSecret,
                    },
                    timeout: 60000,
                    url: `${BDSDestinationProperties.URL}/api/v1/async/billingDeterminantResult`,
                    data: bdsPayload,
                }
            );
            return meterReadResponse;
        } catch (error) {
            logger.error(
                bundle.getText(
                    'errorMsgTechnicalMasterDataEDSErrorReadingMeterRead'
                ),
                error
            );
            return error;
        }
    }

    static async getMeterConfig(req, payload) {
        const bundle = getBundle(req, i18nPath);
        try {
            const c4eDest = await cds.connect.to('C4EDestination');

            const jwt = req.headers.authorization.substr(
                7,
                req.headers.authorization.length
            );
            const destination = await cloudSDK.useOrFetchDestination({
                destinationName: c4eDest.destination,
                jwt,
            });
            return await ExecuteHttpRequest.post(
                { destinationName: c4eDest.destination, jwt },
                {
                    headers: {
                        accept: '*/*',
                        'content-type': 'application/xml',
                        client_id: destination.clientId,
                        client_secret: destination.clientSecret,
                    },
                    timeout: 60000,
                    url: `${destination.url}/api/v1/core`,
                    data: payload,
                }
            );
        } catch (error) {
            logger.error(
                `${bundle.getText(
                    'errorMsgTechnicalMasterDataMeterConfigReadError'
                )}`,
                error
            );
            return error;
        }
    }
}

module.exports = EnergyDataServiceAPI;
