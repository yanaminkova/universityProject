const { expect, launchServer } = require('../lib/testkit');
const { setupServer } = require('msw/node');
const { rest } = require('msw');
const {
    setTestDestination,
    unmockTestDestination,
} = require('@sap-cloud-sdk/test-util');
const ForecastBIT_creation = require('./payload/ForecastBIT_creation');
const Subscription = ForecastBIT_creation.Subscription;
const BillingForecast = ForecastBIT_creation.BillingForecast;
const BillableItemsResponse = ForecastBIT_creation.BillableItemsResponse;
const TechnicalResources = ForecastBIT_creation.TechnicalResources;
const MeterReadResponse = ForecastBIT_creation.MeterReadResponse;
const NonCommoditySB = ForecastBIT_creation.NonCommoditySB;
const ExpiredSubscription = ForecastBIT_creation.ExpiredSubscription;

const SubscriptionBillingAPI = require('../../srv/external/SubscriptionBillingAPI');
const TMDHelper = require('../../srv/api/utils/TMDHelper');
const SoapClient = require('../../srv/external/BITSSoapClient');
jest.mock('../../srv/external/BITSSoapClient');

describe('ForecastBIT it-test UTILITIESCLOUDSOLUTION-2979, UTILITIESCLOUDSOLUTION-3066', () => {
    const { POST, admin } = launchServer({
        service: {
            paths: ['srv/api/billableItems', 'srv/api'],
        },
    });

    beforeAll(() => {
        mockServer.listen();
    });

    afterAll(() => {
        mockServer.close();
    });

    afterEach(() => {
        mockServer.resetHandlers();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    let mockServer = setupServer(
        rest.get(
            `https://c4u-prod.eu10.revenue.cloud.sap/api/subscription/v1/subscriptions*`,
            (req, res, ctx) => {
                if (req.url.search === '?subscriptionDocumentId=SB0A6603') {
                    return res(ctx.status(200), ctx.json(Subscription));
                } else if (
                    req.url.search === '?subscriptionDocumentId=SB0A7386'
                ) {
                    return res(ctx.status(200), ctx.json(ExpiredSubscription));
                } else if (req.url.search === '?subscriptionDocumentId=N7533') {
                    return res(ctx.status(200), ctx.json(NonCommoditySB));
                } else {
                    return res(ctx.json([]));
                }
            }
        ),

        rest.get(
            `https://c4u-prod.eu10.revenue.cloud.sap/api/billing-forecast/v1/forecasts/*`,
            (req, res, ctx) => {
                if (
                    req.url.pathname ===
                    '/api/billing-forecast/v1/forecasts/513D292C-8883-45B8-880C-267545C5F716'
                ) {
                    return res(ctx.status(200), ctx.json(BillingForecast));
                }
            }
        ),

        rest.post(
            `https://eds.cloudforenergy-rc.cfapps.eu20.hana.ondemand.com/api/v1/core`,
            (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(MeterReadResponse));
            }
        ),

        rest.get(
            `https://c4u-prod.eu10.revenue.cloud.sap/api/product-service/v1/products/code/*`,
            (req, res, ctx) => {
                if (
                    req.url.pathname ===
                    '/api/product-service/v1/products/code/PCS_E_T_S_Y_01'
                )
                    return res(ctx.json(TechnicalResources));
            }
        )
    );

    setTestDestination({
        name: 'SB-DESTINATION',
        url: 'https://c4u-prod.eu10.revenue.cloud.sap',
        originalProperties: {
            owner: {
                SubaccountId: '7dd7eebf-04fe-4886-bbb0-b8b5c2276f1b',
                InstanceId: null,
            },
            destinationConfiguration: {
                Name: 'SB-DESTINATION',
                Type: 'HTTP',
                URL: 'https://eu10.revenue.cloud.sap',
                Authentication: 'OAuth2ClientCredentials',
                ProxyType: 'Internet',
                S4BusinessSystem: '0LOALS1',
                clientId: 'client',
                Description: 'set token for SB Destination',
                BITClass: '0SAP',
                CACategory: 'Y1',
                BillingProcess: 'Y001',
                tokenServiceURL:
                    'https://c4uconsumerdevaws.authentication.eu10.hana.ondemand.com/oauth/token',
                SubscriptionBillingAPI: '/api/subscription/v1/subscriptions',
                BillingSubProcess: 'Y001',
                MarketBusinessConfigAPI:
                    '/api/business-config/v1/config/Global/Market/v1',
                clientSecret: 'secret',
                ConditionType: 'PMP1-YONE/PMP2-YREC/PMP3-Y001',
                SBBusinessSystem: 'C4U-SB',
                CommodityConditionType:
                    'PMP1-SU01/PMP2-SU02/PMP3-SU03/PMP4-SU04/PMP5-SU05/PMP6-SU06',
            },
        },
    });

    setTestDestination({
        name: 'c4e-dest',
        url: 'https://eds.cloudforenergy-rc.cfapps.eu20.hana.ondemand.com',
        clientId: 'client',
        clientSecret: 'secret',
    });

    setTestDestination({
        name: 'S4H_SOAP_BILLABLE_ITEMS',
        url: 'https://c4u-prod.eu10.revenue.cloud.sap',
        BusinessSystem: '0LOALS1',
        originalProperties: {
            Name: 'S4H_SOAP_BILLABLE_ITEMS',
            BusinessSystem: '0LOALS1',
            User: 'user',
            Password: 'password',
            url: 'https://c4u-prod.sap',
        },
    });

    setTestDestination({
        name: 'S4-DESTINATION',
        url: 'https://c4u-prod.eu10.revenue.cloud.sap',
        BusinessSystem: '0LOALS1',
        originalProperties: {
            Name: 'S4-DESTINATION',
            BusinessSystem: '0LOALS1',
            User: 'C4UF_INBOUND_USER',
            Password: 'pass',
            url: 'https://c4u-prod.sap',
        },
    });

    it('should return status 204', async () => {
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'SB0A6603',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(204);
    });

    it('should return status 204 when mocking soap client', async () => {
        SoapClient.mockImplementation(() => {
            return {
                POSTBillableItems: async () => {
                    return BillableItemsResponse;
                },
            };
        });
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'SB0A6603',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(204);
    });

    it('should return status 204 when subscriptionDocumentId is wrong', async () => {
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'SB0A6',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(204);
    });

    it('should return status 204 when billingforecasts returns undefined', async () => {
        jest.spyOn(
            SubscriptionBillingAPI,
            'getBillingForecasts'
        ).mockImplementation(() => {
            return undefined;
        });

        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'SB0A6603',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(204);
    });

    it('should return status 204 when technical resources are empty', async () => {
        jest.spyOn(
            SubscriptionBillingAPI,
            'getTechnicalResources'
        ).mockImplementation(() => {
            return '';
        });

        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'SB0A6603',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(204);
    });

    it('should return status 204 when metereadResponse is null', async () => {
        jest.spyOn(TMDHelper, 'readMeterDetails').mockImplementation(() => {
            return null;
        });

        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'SB0A6603',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(204);
    });

    it('should return status 204 when metereadResponse data is not found', async () => {
        jest.spyOn(TMDHelper, 'readMeterDetails').mockImplementation(() => {
            return {};
        });

        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'SB0A6603',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(204);
    });

    it('should return status 204 when metereadResponse doesnot contain meterConfig', async () => {
        jest.spyOn(TMDHelper, 'readMeterDetails').mockImplementation(() => {
            return {
                data: `<?xml version=\"1.0\" encoding=\"UTF-8\"?><msg:ResponseMessage><msg:Payload></msg:Payload></msg:ResponseMessage>`,
            };
        });

        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'SB0A6603',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(204);
    });

    it('should return fail response for non-commodity subscription', async () => {
        let resp = '';
        try {
            resp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'N7533',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(resp.status).to.equal(204);
    });

    it('should return status 204 for SB destination errors', async () => {
        unmockTestDestination('SB-DESTINATION');
        setTestDestination({
            name: 'SB-DESTINATION',
            url: 'https://c4u-prod.eu10.revenue.cloud.sap',
        });

        let resp = '';
        try {
            resp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'SB0A6603',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(resp.status).to.equal(204);
    });

    it('should return status 204 for c4e destination errors', async () => {
        unmockTestDestination('c4e-dest');

        let resp = '';
        try {
            resp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'SB0A6603',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(resp.status).to.equal(204);
    });

    it('should return status 204 for S4H destination errors', async () => {
        unmockTestDestination('S4-DESTINATION');
        setTestDestination({
            name: 'S4-DESTINATION',
            url: 'https://c4u-prod.eu10.revenue.cloud.sap',
        });

        let resp = '';
        try {
            resp = await POST(
                '/api/billing/v1/billableItems/forecastsTransfer',
                {
                    CAProviderContract: 'SB0A6603',
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(resp.status).to.equal(204);
    });
});
