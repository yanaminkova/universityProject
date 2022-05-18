/* eslint-disable no-unused-vars */
const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const cloudSDK = require('@sap-cloud-sdk/core');
const path = require('path');
const { response } = require('express'); // forecast not needed
const { constants } = require('fs'); // forecast not needed check
const { handleError } = require('../../lib/error');
const SubscriptionBillingAPI = require('../../external/SubscriptionBillingAPI');

const BITSHelper = require('../utils/BITSHelper');

const BITSCommodityHelper = require('../utils/BITSCommodityHelper');

const { getEnabledFeatures, getBundle } = require('../../lib/helper');

const i18nPath = '../../_i18n/i18n';

const loggerScope = `[BillableItemsService]`;
const BITSSoapClient = require('../../external/BITSSoapClient');

const S4HDestination = 'S4Destination';
const TMDHelper = require('../utils/TMDHelper');
const ForecastBITSHelper = require('../utils/ForecastBITSHelper');

/**
 *
 * @param {*} destination
 * @returns {Array} mPropertyList
 */
function getMissingPropertyList(destination) {
    const mPropretyList = [];

    if (
        !destination.originalProperties.destinationConfiguration
            .S4BusinessSystem
    ) {
        mPropretyList.push('S4BusinessSystem');
    }
    if (
        !destination.originalProperties.destinationConfiguration
            .SBBusinessSystem
    ) {
        mPropretyList.push('SBBusinessSystem');
    }
    if (
        !destination.originalProperties.destinationConfiguration
            .BillingSubProcess
    ) {
        mPropretyList.push('BillingSubProcess');
    }
    if (!destination.originalProperties.destinationConfiguration.BITClass) {
        mPropretyList.push('BITClass');
    }
    if (
        !destination.originalProperties.destinationConfiguration.ConditionType
    ) {
        mPropretyList.push('ConditionType');
    }
    if (
        destination.originalProperties.destinationConfiguration.ConditionType &&
        !destination.originalProperties.destinationConfiguration.ConditionType.includes(
            '/'
        )
    ) {
        mPropretyList.push('ConditionTypeValueOrSyntax');
    }
    return mPropretyList;
}
/**
 * Connect to SubscriptionBilling destination and check if any of required destination properties are missing.
 * @param {*} req
 * @returns {Promise<Object>} { SBDest, destinationProperties }
 */
async function getSBDestination(req) {
    const { data } = req;
    const bundle = getBundle(req, i18nPath);
    let SBDest;
    let destinationProperties;
    try {
        // Connect to SBDestination
        SBDest = await cds.connect.to('SBDestination');
        const jwt = req.headers.authorization.substr(
            7,
            req.headers.authorization.length
        );
        const destination = await cloudSDK.useOrFetchDestination({
            destinationName: SBDest.destination,
            jwt,
        });
        if (!destination?.originalProperties?.destinationConfiguration) {
            return handleError(
                `${bundle.getText(
                    'errorMsgBillableItemsSRVErrorFetchingSBDestination'
                )}`,
                req,
                406,
                loggerScope,
                data
            );
        }

        // set missing property list
        const missingPropertyList = getMissingPropertyList(destination);

        if (missingPropertyList.length > 0) {
            return handleError(
                `${bundle.getText(
                    'errorMsgBillableItemsSRVMissingDestinationConfig'
                )} ${missingPropertyList}`,
                req,
                406,
                loggerScope,
                data
            );
        }
        destinationProperties =
            destination.originalProperties.destinationConfiguration;
    } catch (err) {
        return handleError(err.message, req, 500, loggerScope, data);
    }
    return Promise.resolve({ SBDest, destinationProperties });
}

/**
 * Connect to SubscriptionBilling destination and check if any of required destination properties are missing.
 * @param {*} req
 * @returns {Promise<Object>} destinationProperties
 */
async function getBDSDestination(req) {
    const bundle = getBundle(req, i18nPath);
    let destinationProperties;
    try {
        // Connect to SBDestination
        const BDSDest = await cds.connect.to('C4EBDSDestination');
        const jwt = req.headers.authorization.substr(
            7,
            req.headers.authorization.length
        );
        const destination = await cloudSDK.useOrFetchDestination({
            destinationName: BDSDest.destination,
            jwt,
        });

        destinationProperties =
            destination?.originalProperties?.destinationConfiguration;
    } catch (err) {
        logger.error(
            `${loggerScope} ${bundle.getText(
                'errorMsgBillableItemsSRVErrorFetchingBDSDestination'
            )} ${err.message}`
        );
    }
    return Promise.resolve(destinationProperties);
}

/**
 * Connect to S4H destination for BillableItemsCreate in S4CI.
 * @param {*} req
 * @returns {Promise<Object>} s4Dest
 */
async function getS4HDestination(req) {
    const { data } = req;
    const bundle = getBundle(req, i18nPath);
    let S4Dest;
    let destination;

    let jwt;
    try {
        S4Dest = await cds.connect.to(S4HDestination);

        if (req.headers.authorization) {
            jwt = req.headers.authorization.substr(
                7,
                req.headers.authorization.length
            );
            // fetch destination
            destination = await cloudSDK.useOrFetchDestination({
                destinationName: S4Dest.destination,
                jwt,
            });
        }
        if (destination == null) {
            return handleError(
                `${bundle.getText(
                    'errorMsgBillableItemsSRVErrorFetchingConvergentInvoicingDestination'
                )}`,
                req,
                406,
                loggerScope,
                data
            );
        }
        if (!destination?.originalProperties?.BusinessSystem) {
            return handleError(
                `${bundle.getText(
                    'errorMsgBillableItemsSRVErrorFetchingConvergentInvoicingBusinessSystem'
                )}`,
                req,
                406,
                loggerScope,
                data
            );
        }
    } catch (err) {
        return handleError(err.message, req, 500, loggerScope, data);
    }
    return Promise.resolve({ s4Dest: destination });
}

/**
 * Invoke postSuccessorDocuments function from SubscriptionBillingAPI to update SB with failed bill transfer attempts
 * @param {*} req
 * @param {String} billId
 * @param {Object} S4BusinessSystem
 * @param {String} errorMessage
 */
function invokeFailedAttemptsAPI(req, billId, S4BusinessSystem, errorMessage) {
    const jwt =
        req.authInfo?.getAppToken() || req.headers?.authorization?.substring(7);
    const bundle = getBundle(req, i18nPath);
    const billingDocText = bundle.getText(
        'displayMsgBillableItemsConfirmSRVBillingDocumentType'
    );

    try {
        const errorBody = {
            successorDocumentSystem: S4BusinessSystem,
            successorDocumentType: billingDocText,
            messages: [errorMessage],
        };
        SubscriptionBillingAPI.postSuccessorDocuments(
            billId,
            errorBody,
            jwt,
            true,
            bundle,
            loggerScope
        );
    } catch (error) {
        logger.debug(
            `${loggerScope} ${bundle.getText(
                'debugMsgBillableItemsFailedAttemptsAPIFailure'
            )}`,
            error
        );
    }
}

/**
 * Fetch subscription and billing forecasts from SAP Subscription Billing
 * @param {*} req
 * @param {String} providerContract
 * @returns {Promise<Object>} {
        sbDestinationDetails,
        subscriptionDetails,
        billingForecastsDetails
    }
 */
async function getBillingForecastsDetails(req, providerContract) {
    const bundle = getBundle(req, i18nPath);
    const sbDestinationDetails = await getSBDestination(req);

    // Error fetching sb destination occurred
    if (sbDestinationDetails === undefined) {
        return undefined;
    }

    // Fetch subscription details using provider contract
    const subscriptionDetails = await SubscriptionBillingAPI.getSubscription(
        sbDestinationDetails.SBDest,
        providerContract,
        req
    );

    // Error fetching subscription occurred
    if (subscriptionDetails?.message || subscriptionDetails.length === 0) {
        logger.error(
            `${loggerScope} ${bundle.getText(
                'errorMsgForecastBillableItemsSubscriptionError'
            )} ${
                subscriptionDetails?.message !== undefined
                    ? subscriptionDetails?.message
                    : bundle.getText(
                          'errorMsgForecastBillableItemsSubscriptionNotFound'
                      )
            } [${providerContract}]`
        );
        return undefined;
    }

    let billingForecastsDetails;
    // Business relevant checks for subscription and billing forecasts that are not logged
    if (
        subscriptionDetails[0].subscriptionProfile.activateUtilitiesExtension &&
        ForecastBITSHelper.checkBudgetBillingType(subscriptionDetails[0])
    ) {
        const nextScheduledBillingDate = new Date(
            subscriptionDetails[0].nextScheduledBillingDate
        ).toISOString();

        // Fetch billing forecasts using subscription id
        billingForecastsDetails =
            await SubscriptionBillingAPI.getBillingForecasts(
                sbDestinationDetails.SBDest,
                subscriptionDetails[0].subscriptionId,
                null,
                nextScheduledBillingDate,
                req
            );

        // Error fetching billing forecasts occurred
        if (billingForecastsDetails?.message || !billingForecastsDetails) {
            logger.error(
                `${loggerScope} ${bundle.getText(
                    'errorMsgForecastBillableItemsBillingForecastsError'
                )} [${subscriptionDetails[0].subscriptionId}] ${
                    billingForecastsDetails?.message !== undefined
                        ? billingForecastsDetails?.message
                        : bundle.getText(
                              'errorMsgForecastBillableItemsBillingForecastsNotFound'
                          )
                }`
            );
            return undefined;
        }
    }
    return Promise.resolve({
        sbDestinationDetails,
        subscriptionDetails,
        billingForecastsDetails,
    });
}

/**
 * Fetch technical resources fro SAP Subscription Billing
 * @param {*} req
 * @param {Array} subscriptionDetails
 * @returns {Promise<Object>} technicalResource
 */
async function getTechnicalResources(req, subscriptionDetails) {
    // get subscription items using product id
    let item;
    let technicalResources;
    let technicalResource;
    subscriptionDetails[0].snapshots[0].items.forEach((items) => {
        item = items;
    });
    // get technical resources using subscription items
    if (item && item !== undefined) {
        technicalResources = await SubscriptionBillingAPI.getTechnicalResources(
            req,
            item.product.code
        );
        if (technicalResources === '') {
            return undefined;
        }
        technicalResource = item.technicalResources.filter(
            (technical) => technical.type === technicalResources[0].type
        );
    }
    return Promise.resolve(technicalResource);
}

/**
 * Prepare forecast billable items create request payload
 * @param {Object} sbDestinationDetails
 * @param {Object} billingForecastsDetails
 * @param {Object} meterDetails
 * @param {String} providerContract
 * @param {Object} bundle
 * @returns {Promise<Object>} billableItemsPayload
 */
async function prepareForecastBillableItemsPayload(
    sbDestinationDetails,
    billingForecastsDetails,
    meterDetails,
    providerContract,
    bundle
) {
    let billableItemsPayload;
    if (
        meterDetails &&
        Array.isArray(meterDetails.ResponseMessage.Payload[0].MeterConfig)
    ) {
        try {
            // Prepare billable items create request payload
            billableItemsPayload =
                ForecastBITSHelper.prepareForecastBillableItemsCreateRequestPayload(
                    sbDestinationDetails.destinationProperties,
                    billingForecastsDetails,
                    meterDetails.ResponseMessage.Payload[0].MeterConfig[0]
                );
        } catch (error) {
            // Error during mapping occurred
            logger.error(
                `${loggerScope}[ProviderContract #${providerContract}] ${bundle.getText(
                    'errorMsgBillableItemsBITsHelperMappingError'
                )}`
            );
            return undefined;
        }
    } else {
        // Meter details not found
        logger.error(
            `${loggerScope}[ProviderContract #${providerContract}] ${bundle.getText(
                'errorMsgForecastBillableItemsMeterConfigNotFound'
            )}`
        );
        return undefined;
    }
    return Promise.resolve(billableItemsPayload);
}

/**
 * Post forecast billable items to Convergent Invoicing
 * @param {*} req
 * @param {Object} billableItemsPayload
 * @param {String} providerContract
 * @param {Object} bundle
 * @returns {Promise<Object>} billableItemsResponse
 */
async function postForecastBillableItems(
    req,
    billableItemsPayload,
    providerContract,
    bundle
) {
    const soapClient = new BITSSoapClient();
    const wsdl = path.join(__dirname, '../', 'lib/wsdlNonComBITS.wsdl');
    let billableItemsResponse;
    try {
        // Post forecast billable items
        const s4DestinationResponse = await getS4HDestination(req);
        billableItemsResponse = await soapClient.POSTBillableItems(
            wsdl,
            s4DestinationResponse.s4Dest,
            billableItemsPayload,
            null,
            req,
            providerContract
        );
        if (billableItemsResponse) {
            // Forecast billable items successfully transferred
            logger.info(
                `${loggerScope}[ProviderContract #${providerContract}] ${bundle.getText(
                    'successMsgForecastBillableItemsTransferSuccess'
                )}`
            );
        }
    } catch (error) {
        // Forecast billable items not transferred
        logger.error(
            `${loggerScope}[ProviderContract #${providerContract}] ${bundle.getText(
                'errorMsgForecastBillableItemsTransferError'
            )} ${error}`
        );
        return undefined;
    }
    return Promise.resolve(billableItemsResponse);
}

/**
 * Fetch meter details from SAP Cloud for Energy
 * @param {*} req
 * @param {Object} subscriptionDetails
 * @param {String} providerContract
 * @param {Object} bundle
 * @returns {Promise<Object>} meterDetails
 */
async function getMeterDetails(
    req,
    subscriptionDetails,
    providerContract,
    bundle
) {
    const technicalResourceDetails = await getTechnicalResources(
        req,
        subscriptionDetails
    );

    if (
        technicalResourceDetails === undefined ||
        technicalResourceDetails?.message ||
        technicalResourceDetails.length === 0
    ) {
        // Error fetching technical resources occurred
        logger.error(
            `${loggerScope}[ProviderContract #${providerContract}] ${bundle.getText(
                'errorMsgForecastBillableItemsTechnicalResourcesError'
            )} ${
                technicalResourceDetails?.message !== undefined
                    ? technicalResourceDetails?.message
                    : bundle.getText(
                          'errorMsgForecastBillableItemsTechnicalResourcesNotFound'
                      )
            }`
        );
        return undefined;
    }

    // get serial number from technical resources
    let meterReadResponse;
    let technicalResource;
    technicalResourceDetails.forEach((technical) => {
        technicalResource = technical;
    });
    if (technicalResource) {
        // get meter config
        meterReadResponse = await TMDHelper.readMeterDetails(
            req,
            technicalResource
        );
    }
    if (meterReadResponse === null || meterReadResponse?.message) {
        logger.error(
            `${loggerScope} ${bundle.getText(
                'errorMsgForecastBillableItemsMeterConfigError'
            )} [Serial Number #${technicalResource.id}] ${
                meterReadResponse?.message
            }`
        );
        return undefined;
    }
    let meterDetails;
    if (meterReadResponse.data) {
        meterDetails = TMDHelper.convertXMLToJson(meterReadResponse.data);
    } else {
        logger.error(
            `${loggerScope} ${bundle.getText(
                'errorMsgForecastBillableItemsMeterConfigNotFound'
            )} [Serial Number #${technicalResource.id}] ${
                meterReadResponse?.message
            }`
        );
        return undefined;
    }
    return Promise.resolve(meterDetails);
}

/**
 * Wrapper function to execute creation of forecast billable items
 * @param {*} req
 * @returns {}
 */
async function executeCreateForecastBillableItems(req) {
    const { data } = req;
    logger.debug(`${loggerScope} ${JSON.stringify(data)}`);
    const providerContract = req.data.CAProviderContract;
    const bundle = getBundle(req, i18nPath);

    // Fetch data for provider contract
    const billingForecasts = await getBillingForecastsDetails(
        req,
        providerContract
    );

    // Error fetching data occurred
    if (billingForecasts === undefined) {
        return;
    }

    const {
        sbDestinationDetails,
        subscriptionDetails,
        billingForecastsDetails,
    } = billingForecasts;

    // Business relevant checks for subscription and billing forecasts that are not logged
    if (
        !subscriptionDetails[0].subscriptionProfile
            .activateUtilitiesExtension ||
        billingForecastsDetails === undefined
    ) {
        return;
    }

    // Business relevant checks for billing forecasts that are logged
    if (
        ForecastBITSHelper.checkSubscriptionValidUntil(
            subscriptionDetails[0]
        ) &&
        ForecastBITSHelper.checkBillingForecasts(billingForecastsDetails)
    ) {
        // Fetch meter details
        const meterDetails = await getMeterDetails(
            req,
            subscriptionDetails,
            providerContract,
            bundle
        );

        // Error fetching meter details occurred
        if (meterDetails === undefined) {
            return;
        }

        // Prepare forecast billable items payload
        const billableItemsPayload = await prepareForecastBillableItemsPayload(
            sbDestinationDetails,
            billingForecastsDetails,
            meterDetails,
            providerContract,
            bundle
        );

        // Error during mapping occurred
        if (billableItemsPayload === undefined) {
            return;
        }

        // Post forecast billable items during contract provisioning process (for initial BBP & welcome letter)
        await postForecastBillableItems(
            req,
            billableItemsPayload,
            providerContract,
            bundle
        );
    } else {
        // Invalid billing forecasts
        logger.error(
            `${loggerScope}[ProviderContract #${providerContract}] ${bundle.getText(
                'errorMsgForecastBillableItemsBillingForecastsInvalidError'
            )}`
        );
    }
}

/**
 * Complete flow of creating BITS, from getting bill detail to getting customer info, to mapping, to sending to S4CI,
 * for concurrent execution.
 * @param {*} req
 * @param {String} billId
 * @param {Destination} sbDest
 * @param {List} sbDestinationProperties
 * @param {Destination} s4Dest
 * @param {Object} BDSDestinationProperties
 * @param {Array} transferErrorList List of all bill transfer failure reasons
 * @returns {Promise<Array>} List of all bill transfer process results
 */
async function createBillableItems(
    req,
    billId,
    sbDest,
    sbDestinationProperties,
    s4Dest,
    BDSDestinationProperties,
    transferErrorList
) {
    return new Promise((resolve, reject) => {
        let billDetail;
        let documentId;
        let customerInfo;
        let finalResponse = '';

        // First get bill detail
        SubscriptionBillingAPI.getBill(req, billId, sbDest)
            .then((detail) => {
                // Get customer info and S4BP ID for customer of the bill
                billDetail = detail;
                documentId = billDetail.documentNumber;
                return SubscriptionBillingAPI.getCustomers(
                    req,
                    detail.customer?.id,
                    sbDestinationProperties.S4BusinessSystem,
                    sbDest
                );
            })
            .then((data) => {
                // Get commodity data if it's commodity bill
                customerInfo = data;
                return BITSCommodityHelper.getCommodityData(
                    req,
                    billDetail,
                    BDSDestinationProperties,
                    customerInfo.markets,
                    sbDestinationProperties,
                    sbDest
                );
            })
            .then((commodityData) => {
                // Then map bill detail and customer info to S4CI request payload

                // Mapping for Commodity bills
                if (commodityData.isCommodity) {
                    return BITSCommodityHelper.prepareCommodityBillableItemsCrReqPayload(
                        billDetail,
                        customerInfo,
                        sbDestinationProperties,
                        commodityData,
                        req
                    );
                }
                // Mapping for non-commodity bills
                return BITSHelper.prepareBillableItemsCreateRequestPayload(
                    billDetail,
                    customerInfo,
                    sbDestinationProperties,
                    req
                );
            })
            .then((s4CiRequest) => {
                // Finally send request to S4H
                const soapClient = new BITSSoapClient();
                const wsdl = path.join(
                    __dirname,
                    '../',
                    'lib/wsdlNonComBITS.wsdl'
                );

                finalResponse = soapClient.POSTBillableItems(
                    wsdl,
                    s4Dest,
                    s4CiRequest,
                    documentId,
                    req
                );
                return resolve(finalResponse);
            })
            .catch((error) => {
                // Deal with errors and add to response error message list
                transferErrorList.push({
                    billNumber: documentId,
                    errorMessage: error.message,
                });
                logger.error(
                    `${loggerScope}[BillId #${documentId}] ${error.message}`
                );

                // Call SB Failed Attempts API to update failed transfer attempt
                invokeFailedAttemptsAPI(
                    req,
                    billId,
                    sbDestinationProperties.S4BusinessSystem,
                    error.message
                );
                return reject(error);
            });
    });
}

async function executeCreateBillableItems(req) {
    const { data } = req;
    let totalBillCount = 0;
    let successCount = 0;
    const createBITSPromiseList = [];
    const transferErrorList = [];
    const bundle = getBundle(req, i18nPath);
    try {
        const sbDestinationResponse = await getSBDestination(req);
        const bdsDestinationResponse = await getBDSDestination(req);
        const s4DestinationResponse = await getS4HDestination(req);
        if (sbDestinationResponse && s4DestinationResponse) {
            // Only proceed after destinations validated
            const transfBills =
                await SubscriptionBillingAPI.getTransferableBills(
                    req,
                    sbDestinationResponse.SBDest
                );
            totalBillCount = transfBills.length;

            if (totalBillCount === 0) {
                // Return error if no bills fetched
                return handleError(
                    bundle.getText('errorMsgBillableItemsSRVFetchBillsFail'),
                    req,
                    406,
                    loggerScope,
                    data
                );
            }

            if (Array.isArray(transfBills) && totalBillCount > 0) {
                // Concurrently call processes for each bill
                transfBills.forEach((billId) => {
                    createBITSPromiseList.push(
                        createBillableItems(
                            req,
                            billId,
                            sbDestinationResponse.SBDest,
                            sbDestinationResponse.destinationProperties,
                            s4DestinationResponse.s4Dest,
                            bdsDestinationResponse,
                            transferErrorList
                        )
                    );
                });

                await Promise.allSettled(createBITSPromiseList)
                    .then((res) => {
                        // Calculate how many bills got sent successfully
                        successCount = BITSHelper.countSuccessBITSCreation(res);
                        logger.info(
                            `${loggerScope} ${successCount} ${bundle.getText(
                                'successMsgBillableItemsSRVBITsTransferSuccess'
                            )} ${totalBillCount}`
                        );
                    })
                    .catch((error) => {
                        req.reject({
                            status: 406,
                            message: `${bundle.getText(
                                'errorMsgBillableItemsSRVBITsTransferFail'
                            )}`,
                        });
                        return handleError(
                            error.message,
                            req,
                            500,
                            loggerScope,
                            data
                        );
                    });
            } else if (
                transfBills?.statusCode?.toString().includes('50') &&
                transfBills?.message
            ) {
                // Handle connection error or service error when calling Bills API
                return handleError(
                    transfBills.message,
                    req,
                    500,
                    loggerScope,
                    data
                );
            }
        }
    } catch (error) {
        req.reject({
            status: 406,
            message: `${bundle.getText(
                'errorMsgBillableItemsSRVBITsTransferFail'
            )}`,
        });
        return handleError(error.message, req, 500, loggerScope, data);
    }
    return {
        status: {
            billsTotal: totalBillCount,
            billsSentForTransfer: successCount,
            billsNotSentForTransfer: totalBillCount - successCount,
        },
        billsTransferErrors: transferErrorList,
    };
}

module.exports = async (srv) => {
    async function createForecastBillableItems(req) {
        executeCreateForecastBillableItems(req);
    }

    /**
     * Feature Flag
     */
    srv.before('*', async (req) => {
        const { tenant } = req.user;
        const bundle = getBundle(req, i18nPath);
        const featureFlag = await cds.connect.to('featureFlags');
        const result = await featureFlag.evaluate(
            'billable-items-service',
            tenant
        );

        if (result === false) {
            req.reject({
                status: 503,
                message: `${bundle.getText(
                    'errorMsgBillableItemsSRVServiceUnavailable'
                )}`,
            });
        }
    });

    /**
     * Posting Billable Items to Convergent Invoicing system
     */
    srv.on('transfer', async (req) => executeCreateBillableItems(req));

    // Create forecast billable items
    srv.on('forecastsTransfer', async (req) => {
        const { data } = req;
        const bundle = getBundle(req, i18nPath);
        // feature flag protected
        const extensionFeature = 'create-forecastbit-transfer';
        const enabledFeatures = await getEnabledFeatures(req, [
            extensionFeature,
        ]);
        if (enabledFeatures.includes(extensionFeature)) {
            try {
                return await createForecastBillableItems(req);
            } catch (error) {
                req.reject({
                    status: 406,
                    message: `${bundle.getText(
                        'errorMsgForecastBillableItemsServiceError'
                    )}`,
                });
                return handleError(error.message, req, 500, loggerScope, data);
            }
        }
        return null;
    });

    // Handle provider contract created event
    const providerContractMessaging = await cds.connect.to(
        'providerContractMessaging'
    );
    /**
     * Enterprise Messaging
     * Consume messages from Event Mesh and trigger forecast billable items creation
     * @param {Object} msg - Event message
     */
    providerContractMessaging.on(
        [
            '+/+/+/ce/sap/s4/beh/contracctgprovidercontract/v1/ContrAcctgProviderContract/Created/*',
            '+/+/+/ce/sap/s4/beh/contracctgprovidercontract/v1/ContrAcctgProviderContract/Created/v1',
        ],
        async (msg) => {
            const bundle = getBundle(msg, i18nPath);
            const message = msg;
            const token = msg.context._.req.authInfo.getAppToken();
            message.headers.authorization = 'Bearer '.concat(token);
            // feature flag protected
            const extensionFeature = 'create-forecastbit-transfer';
            const enabledFeatures = await getEnabledFeatures(msg, [
                extensionFeature,
            ]);
            if (enabledFeatures.includes(extensionFeature)) {
                try {
                    await createForecastBillableItems(message);
                } catch (error) {
                    logger.error(
                        `${bundle.getText(
                            'errorMsgForecastBillableItemsServiceError'
                        )} ${error.message}`
                    );
                }
            }
        }
    );
};
