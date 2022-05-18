const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const cloudSDK = require('@sap-cloud-sdk/core');
const ExecuteHTTPRequest = require('../lib/cloudSDKHelper/executeHttpRequest');
// const BusinessPartnerKeyMappingService = require('./API_BP_KEY_MAPPING');
const BusinessPartnerKeyMappingServiceBeta = require('./API_BP_KEY_MAPPINGBeta');
const { getBundle } = require('../lib/helper');

const i18nPath = '../../_i18n/i18n';

class SubscriptionBillingAPI {
    /**
     * Create a Subscription on Subscription Billing
     * @param {*} {subscription}
     */
    static async postSubscription(subscription, req) {
        const headers = { 'billing-sb-dates-in-subscription-timezone': 'true' };
        const data = subscription;
        try {
            const SBDest = await cds.connect.to('SBDestination');
            const postSubscriptionResponse = await SBDest.tx(req).send({
                method: 'POST',
                path: '/api/subscription/v1/subscriptions',
                data,
                headers,
            });
            return postSubscriptionResponse;
        } catch (error) {
            return error;
        }
    }

    static async getSBDest() {
        try {
            const SBDest = await cds.connect.to('SBDestination');
            return SBDest;
        } catch (error) {
            return error;
        }
    }

    static async getSubscription(dest, subscriptionDocumentId, req) {
        const query = `GET /api/subscription/v1/subscriptions?subscriptionDocumentId=${subscriptionDocumentId}`;
        try {
            const getSubscriptionResponse = await dest.tx(req).run(query);
            return getSubscriptionResponse;
        } catch (error) {
            return error;
        }
    }

    static async postSubscriptionCancellation(
        dest,
        cancellationPayload,
        subscriptionDocumentId,
        req
    ) {
        const query = `POST /api/subscription/v1/subscriptions/${subscriptionDocumentId}/cancellation`;
        try {
            const postSubscriptionResponse = await dest
                .tx(req)
                .run(query, cancellationPayload);
            return postSubscriptionResponse;
        } catch (error) {
            return error;
        }
    }

    /**
     * Get the list of markets from Subscription Billing
     * @returns [markets]
     */
    static async getMarkets(req) {
        const query = 'GET /api/business-config/v1/config/Global/Market/v1';
        try {
            const SBDest = await cds.connect.to('SBDestination');
            const businessConfigResponse = await SBDest.tx(req).run(query);
            return {
                businessConfigResponse,
                SBDest,
            };
        } catch (error) {
            return error;
        }
    }

    /**
     * Get technical resources by product displayID
     * @param {*} req
     * @param {*} productId
     * @returns
     */
    static async getTechnicalResources(req, productId) {
        const SBDest = await cds.connect.to('SBDestination');
        const query = `GET /api/product-service/v1/products/code/${productId}`;
        let technicalResourcesResources = '';

        try {
            const resp = await SBDest.tx(req).run(query);
            if (resp) {
                technicalResourcesResources =
                    resp.mixins?.subscriptionProduct?.technicalResources;
            }
            return technicalResourcesResources;
        } catch (error) {
            return error;
        }
    }

    /**
     * Get bills
     * @param {*} req
     * @returns
     */
    static async getBill(req, billId, SBDest) {
        const query = `GET /api/bill/v2/bills/${billId}?expand=customReferences,pricingElements,usageRecords`;
        try {
            const resp = SBDest.tx(req).run(query);
            return Promise.resolve(resp);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Get transferable bills
     * @param {*} req
     * @returns
     */
    static async getTransferableBills(req, SBDest) {
        let query;
        /* eslint no-underscore-dangle: 0 */
        if (req._query?.customerId) {
            query = `GET /api/bill/v2/bills/transferable?customer.id=${req._query.customerId}`;
        } else {
            query = `GET /api/bill/v2/bills/transferable`;
        }

        try {
            const resp = await SBDest.tx(req).run(query);
            return resp;
        } catch (error) {
            return error;
        }
    }

    /**
     * @param {req,CustomerNumber,response}
     * @returns {}
     */
    // eslint-disable-next-line class-methods-use-this
    static async getCustomers(req, CustomerNumber, S4BusinessSystem, SBDest) {
        const loggerScope = `[BillableItemsService]`;
        const bundle = getBundle(req, i18nPath);
        let CustomerUUID;
        let S4BPNumber;
        let s4bp = '';
        let resp = '';
        let markets = [];

        try {
            const query = `GET /api/business-partner/v3/customers/${CustomerNumber}?expand=markets`;
            resp = await SBDest.tx(req).run(query);
            if (resp) {
                markets = resp.markets;
            } else {
                return Promise.reject(
                    new Error(
                        `${bundle.getText(
                            'errorMsgBillableItemsSBFetchMarketsFail'
                        )} ${CustomerNumber}`
                    )
                );
            }
            const arrCustNum = [CustomerNumber];
            [CustomerUUID] =
                await new BusinessPartnerKeyMappingServiceBeta().getBPKeyMappingByBpDisplayId(
                    req,
                    arrCustNum,
                    S4BusinessSystem
                );

            if (CustomerUUID[1]?.length > 0) {
                const arrCustUUID = [CustomerUUID[1]?.[0]];
                [S4BPNumber] =
                    await new BusinessPartnerKeyMappingServiceBeta().getBPKeyMappingByBpUUID(
                        req,
                        arrCustUUID,
                        S4BusinessSystem
                    );
                if (S4BPNumber[1]) {
                    // eslint-disable-next-line prefer-destructuring
                    s4bp = S4BPNumber[1]?.[0];
                }
            } else {
                return Promise.reject(
                    new Error(
                        `${bundle.getText(
                            'errorMsgBillableItemsSBBPKeyMappingNotFound'
                        )} ${CustomerNumber}`
                    )
                );
            }
        } catch (error) {
            logger.error(`${loggerScope} Get S4BP ID error: ${error}`);
            return Promise.reject(error);
        }
        return { s4bp, markets };
    }

    /**
     * Manages both successor documents and failed transfer attempts of a bill
     * @param {String} billId the ID or document number of the bill
     * @param {Object} data request body to be sent with request
     * @param {String} jwt
     * @param {Boolean} failedAttempts boolean to indicate if posting failed attempts
     * @param {Object} bundle bundle object for i18n translation
     * @param {String} loggerScope indicating logger scope i.e. which service is using this function
     * @returns {}
     */
    static async postSuccessorDocuments(
        billId,
        data,
        jwt,
        failedAttempts,
        bundle,
        loggerScope
    ) {
        const path = failedAttempts
            ? `/api/bill/v2/bills/${billId}/successorDocuments/failedAttempts`
            : `/api/bill/v2/bills/${billId}/successorDocuments`;

        try {
            if (!jwt || jwt.length === 0) {
                throw new Error(
                    `${bundle.getText(
                        'errorMsgBillableItemsSBJWTTokenNotFound'
                    )}`
                );
            } else {
                const SBDest = await cds.connect.to('SBDestination');
                const destination = await cloudSDK.useOrFetchDestination({
                    destinationName: SBDest.destination,
                    jwt,
                });

                const resp = await ExecuteHTTPRequest.post(
                    {
                        destinationName: SBDest.destination,
                        jwt,
                    },
                    {
                        headers: {
                            accept: 'application/json,text/plain',
                            'content-type': 'application/json',
                            client_id: destination.clientId,
                            client_secret: destination.clientSecret,
                        },
                        timeout: 60000,
                        url: `${destination.url}${path}`,
                        data,
                    }
                );

                // Handle Result
                logger.debug(
                    `${loggerScope} ${bundle.getText(
                        'successMsgPostSuccessorDocumentsSucceeded'
                    )}`,
                    resp
                );
                return resp;
            }
        } catch (e) {
            // Handle Error
            logger.error(
                `${loggerScope} ${bundle.getText(
                    'errorMsgPostSuccessorDocumentsFailed'
                )}`,
                e
            );
            throw e;
        }
    }

    static async getBillingForecasts(dest, subscriptionId, start, end, req) {
        let query = `GET /api/billing-forecast/v1/forecasts/${subscriptionId}`;
        if (start != null && end != null) {
            query = query.concat(`?start=${start}&end=${end}`);
        } else if (start != null) {
            if (end == null) {
                query = query.concat(`?start=${start}`);
            }
        } else if (end != null) {
            if (start == null) {
                query = query.concat(`?end=${end}`);
            }
        }
        try {
            const billingForecastsResponse = await dest.tx(req).run(query);
            return billingForecastsResponse;
        } catch (error) {
            return error;
        }
    }
}
module.exports = SubscriptionBillingAPI;
