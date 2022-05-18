const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const EnergyDataServiceAPI = require('../../external/EnergyDataServiceAPI');
const MeasurementConceptAPI = require('../../external/MeasurementConceptAPI');
const TMDHelper = require('../utils/TMDHelper');
const { getBundle } = require('../../lib/helper');

const i18nPath = '../../_i18n/i18n';
const loggerScope = `[TechnicalMasterDataService]`;

logger.info(`${loggerScope}`);

module.exports = async (srv) => {
    async function createTMD(req) {
        const mcmInstance = req.data.id;
        const { data } = req;
        logger.debug(`${loggerScope} ${JSON.stringify(data)}`);
        const bundle = getBundle(req, i18nPath);

        let TMDPayload = {};
        let payload = {};
        let xmlTMD = '';
        let isSuccess;
        let msgInfo;
        let meteringLocationId;

        // Read MCM Instance details
        const mciDetails = await MeasurementConceptAPI.getMCIDetails(req);

        if (mciDetails?.id) {
            try {
                meteringLocationId =
                    mciDetails.meteringLocations[0]?.meteringLocationId;
                // Prepare TMD payload with operations
                TMDPayload = await TMDHelper.prepareTMDPayload(mciDetails, req);
                // Add xml namespaces and attributes
                payload = TMDHelper.updateTMDObjectKeys(TMDPayload);
                // Convert JSON payload to XML payload
                xmlTMD = TMDHelper.convertJsonToXML(payload);

                const resp = await EnergyDataServiceAPI.postTMD(req, xmlTMD);

                // validate if xml response contains errors
                const TMDErrors = await TMDHelper.isValidTMDResponse(resp);

                if (TMDErrors.errors) {
                    throw new Error(TMDErrors.message);
                }

                isSuccess = 'true';
                msgInfo = `${bundle.getText(
                    'successMsgTechnicalMasterDataSRVTMDCreationSuccess'
                )} ${meteringLocationId}`;

                return {
                    mcmInstance,
                    isSuccess,
                    msgInfo,
                };
            } catch (error) {
                isSuccess = false;
                msgInfo = `${bundle.getText(
                    'errorMsgTechnicalMasterDataSRVTMDCreationFailed'
                )} [${meteringLocationId}], ${bundle.getText(
                    'errorMsgTechnicalMasterDataSRVError'
                )} ${error.message}`;
                logger.error(msgInfo);
                return {
                    mcmInstance,
                    isSuccess,
                    msgInfo,
                };
            }
        } else {
            isSuccess = false;
            msgInfo = `${bundle.getText(
                'errorMsgTechnicalMasterDataSRVErrorReadingMCI'
            )} ${mciDetails?.message}`;
            logger.error(msgInfo);
            return {
                mcmInstance,
                isSuccess,
                msgInfo,
            };
        }
    }

    /**
     * Action createTechnicalMasterData
     * Indicates the endpoint for creating Technical Master Data
     * Return is needed since createTechnicalMasterData will be triggered by action
     * @param {Object} req - Request Object.
     */
    srv.on('generate', async (req) => {
        const bundle = getBundle(req, i18nPath);
        try {
            const { mcmInstance, isSuccess, msgInfo } = await createTMD(req);

            return {
                mcmInstance,
                isSuccess,
                message: msgInfo,
            };
        } catch (error) {
            logger.error(
                `${bundle.getText(
                    'errorMsgTechnicalMasterDataSRVTMDCreationError'
                )} ${error?.message}`,
                error
            );
        }
        return null;
    });

    const technicalMasterDataMessaging = await cds.connect.to(
        'technicalMasterDataMessaging'
    );
    /**
     * Enterprise Messaging
     * Consume messages from Event Mesh and trigger Technical Master Data creation
     * @param {Object} msg - Event Message.
     */
    technicalMasterDataMessaging.on(
        [
            'default/sap.c4u.mcm/-/ce/sap/c4u/mcm/MCMInstance/ExternalMasterDataReady/v1',
            'default/sap.c4u.mcm/-/ce/sap/c4u/mcm/MCMInstance/MasterDataCreated/v1',
        ],
        async (msg) => {
            const message = msg;
            const token = msg.context._.req.authInfo.getAppToken();
            message.headers.authorization = 'Bearer '.concat(token);

            return new Promise((resolve, reject) => {
                (async () => {
                    const { mcmInstance, isSuccess, msgInfo } = await createTMD(
                        message
                    );

                    if (!isSuccess) {
                        reject(msgInfo);
                    } else {
                        resolve({
                            mcmInstance,
                            isSuccess,
                            message: msgInfo,
                        });
                    }
                })();
            });
        }
    );
};
