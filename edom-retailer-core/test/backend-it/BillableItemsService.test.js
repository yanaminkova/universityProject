const cds = require('@sap/cds');
const { expect, launchServer, mockServerConf } = require('../lib/testkit');
const jestExpect = require('expect');
const { rest } = require('msw');
const {
    setTestDestination,
    unmockTestDestination,
} = require('@sap-cloud-sdk/test-util');
const { setupServer } = require('msw/node');
const SoapClient = require('../../srv/external/BITSSoapClient');

const GetSampleBills = [
    '1A11111B-A873-49F9-ABE1-556F3534E6DC',
    '376D30EA-7284-44B2-B112-5C450D20A588',
    '8AB22222-E60B-47B9-A512-3025F1E63FD3',
];
const TransfBillDetailResponse = require('./payload/TransferableBillDetails.json');
const commodityDetails = require('./payload/CommodityBillDetails');
const TransfBillDetailResponseCommodity = commodityDetails.commodityBill;
const customerDetails = commodityDetails.customerDetails;
const TransfBillDetailChargesResponse = require('./payload/TransferableBillDetails_Charges.json');
const meterReadResponse =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><msg:ResponseMessage xmlns:msg="http://iec.ch/TC57/2011/schema/message" xmlns:m="http://iec.ch/TC57/CIM-c4e#"><msg:Header><msg:Verb>reply</msg:Verb><msg:Noun>BillingDeterminants</msg:Noun><msg:Timestamp>2021-10-12T21:10:56.817Z</msg:Timestamp><msg:MessageID>52602769-f7d9-44db-8fde-89f1e105b462</msg:MessageID></msg:Header><msg:Reply><msg:Result>OK</msg:Result></msg:Reply><msg:Payload><m:BillingDeterminants><m:headerID>ca13afe6-92d5-47ff-b9e0-ffa926cbf964</m:headerID><m:timeZone>Europe/Berlin</m:timeZone><m:MeterDetails><m:mRID>55e9326f-1608-41e8-8978-58bbd5f28237</m:mRID><m:Names><m:name>121101221544</m:name><m:NameType><m:name>MeteringLocation</m:name><m:NameTypeAuthority><m:name>SAP</m:name></m:NameTypeAuthority></m:NameType></m:Names><m:serialNumber>21101221544</m:serialNumber></m:MeterDetails><m:BillingDeterminant><m:itemID>5525dbf7-e25e-4673-86a5-a80befc24ac2:ELECTRICITY_CONSUMPTION_2108</m:itemID><m:Result><m:itemResultID>1</m:itemResultID><m:description>The total consumption of the aggregated non-equidistant consumption data</m:description><m:value>212.314326951397</m:value><m:unitMultiplier>k</m:unitMultiplier><m:unit>Wh</m:unit><m:readingType>32.0.0.9.1.1.12.0.0.0.0.0.0.0.0.3.72.0</m:readingType></m:Result><m:BillingDeterminantReadings><m:ConsumptionData><m:registerMultiplierValue>1</m:registerMultiplierValue><m:identificationSystemCode>1-1:1.9.0</m:identificationSystemCode><m:Reading><m:timeStamp>2021-10-11T22:00:00Z</m:timeStamp><m:value>212.314326951397</m:value><m:ReadingType ref="32.0.0.9.1.1.12.0.0.0.0.0.0.0.0.3.72.0"/><m:timePeriod><m:end>2021-10-11T22:00:00Z</m:end><m:start>2021-09-11T22:00:00Z</m:start></m:timePeriod><m:estimationTypeCode>1</m:estimationTypeCode></m:Reading></m:ConsumptionData><m:MeterReadings><m:registerMultiplierValue>1</m:registerMultiplierValue><m:identificationSystemCode>1-1:1.8.0</m:identificationSystemCode><m:Reading><m:timeStamp>2021-09-11T22:00:00Z</m:timeStamp><m:value>1287.148</m:value><m:ReadingType ref="0.26.0.1.1.1.12.0.0.0.0.0.0.0.224.3.72.0"/><m:estimationTypeCode>1</m:estimationTypeCode></m:Reading><m:Reading><m:timeStamp>2021-10-11T22:00:00Z</m:timeStamp><m:value>1499.463</m:value><m:ReadingType ref="0.26.0.1.1.1.12.0.0.0.0.0.0.0.224.3.72.0"/><m:estimationTypeCode>1</m:estimationTypeCode></m:Reading></m:MeterReadings></m:BillingDeterminantReadings></m:BillingDeterminant></m:BillingDeterminants></msg:Payload></msg:ResponseMessage>"';
const meterReadResponseError =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><msg:ResponseMessage xmlns:msg="http://iec.ch/TC57/2011/schema/message" xmlns:m="http://iec.ch/TC57/CIM-c4e#"><msg:Header><msg:Verb>reply</msg:Verb><msg:Noun>BillingDeterminants</msg:Noun><msg:Timestamp>2021-10-19T15:11:38.067Z</msg:Timestamp><msg:MessageID>a4b8e3ec-ccb0-4ae5-8e6f-4f616ee7b045</msg:MessageID></msg:Header><msg:Reply><msg:Result>FAILED</msg:Result><msg:Error><msg:level>CATASTROPHIC</msg:level><msg:reason>Validation Failure</msg:reason><msg:details>Could not find a record pertaining to that ID.</msg:details></msg:Error></msg:Reply><msg:Payload/></msg:ResponseMessage>';

jest.mock('../../srv/external/API_BP_KEY_MAPPINGBeta');

const API_BP_KEY_MAPPINGBeta = require('../../srv/external/API_BP_KEY_MAPPINGBeta');

const ForecastBIT_creation = require('./payload/ForecastBIT_creation');
const BillingForecast = ForecastBIT_creation.BillingForecast;

const SubscriptionBillingAPI = require('../../srv/external/SubscriptionBillingAPI');
const ForecastBITSHelper = require('../../srv/api/utils/ForecastBITSHelper');

describe('BillableItemService it-test UTILITIESCLOUDSOLUTION-2983, it-test UTILITIESCLOUDSOLUTION-3066', () => {
    const { POST, admin } = launchServer({
        service: {
            paths: ['srv/api/billableItems', 'srv/api'],
        },
    });

    let entities = [];

    let mockServer = setupServer(
        rest.get(
            `https://c4u-prod.eu10.revenue.cloud.sap/*`,
            (req, res, ctx) => {
                if (req.url.pathname === '/api/bill/v2/bills/transferable')
                    return res(ctx.json(GetSampleBills));
                else return res(ctx.json(TransfBillDetailResponse));
            }
        ),
        rest.post(
            `https://c4u-prod.eu10.revenue.cloud.sap/*`,
            (req, res, ctx) => {
                if (
                    req.url.pathname.includes(
                        'successorDocuments/failedAttempts'
                    )
                ) {
                    return res(
                        ctx.json({
                            status: 'ok',
                        })
                    );
                } else {
                    return res(ctx.status(200), ctx.json());
                }
            }
        ),
        rest.post(
            `https://bi-bds-async.cloudforenergy-rc.cfapps.eu20.hana.ondemand.com/api/v1/async/billingDeterminantResult`,
            (req, res, ctx) => {
                console.log('Test Search', req.body.search('FAILED'));
                if (req.body.search('FAILED') > 1) {
                    return res(
                        ctx.status(200),
                        ctx.json(meterReadResponseError)
                    );
                } else {
                    return res(ctx.status(200), ctx.json(meterReadResponse));
                }
            }
        )
    );

    beforeEach(() => {
        // Mock BPKeyMapping
        API_BP_KEY_MAPPINGBeta.mockImplementation(() => {
            return {
                getBPKeyMappingByBpDisplayId: async (req, customerNumber) => {
                    const customerId = [
                        ['9980017150'],
                        ['W73-FGUJ47UDFJ0-4UFDJK'],
                    ];
                    return [customerId];
                },
                getBPKeyMappingByBpUUID: async (req, businessSystem) => {
                    const bps4DisplayId = [
                        ['W73-FGUJ47UDFJ0-4UFDJK'],
                        ['9980017151'],
                    ];
                    return [bps4DisplayId];
                },
            };
        });
    });
    beforeAll(() => {
        mockServer.listen(mockServerConf);
    });
    afterAll(() => {
        mockServer.close();
    });
    afterEach(() => {
        mockServer.resetHandlers();
        jest.clearAllMocks();
    });

    before(async () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('API_EDOM_RETAILER')
        ).filter((value) => !value['@cds.autoexposed']);

        Array.from(serviceEntities).forEach((element) => {
            const { name } = element;
            entities.push(name.substring(name.indexOf('.') + 1, name.length));
        });
    });
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
                clientId:
                    'sb-sap-subscription-billing!abcdefg|revenue-cloud!12345',
                Description: 'set token for SB Destination',
                BITClass: '0SAP',
                CACategory: 'Y1',
                BillingProcess: 'Y001',
                tokenServiceURL:
                    'https://c4uconsumerdevaws.authentication.eu10.hana.ondemand.com/oauth/token',
                SubscriptionBillingAPI: '/api/subscription/v1/subscriptions',
                BillingSubProcess: 'Y001',
                CommodityBillingSubProcess: 'SU01',
                CommodityBillingSubProcessExpired: 'SU05',
                MarketBusinessConfigAPI:
                    '/api/business-config/v1/config/Global/Market/v1',
                clientSecret: 'secret',
                ConditionType: 'PMP1-YONE/PMP2-YREC/PMP3-Y001',
                SBBusinessSystem: 'C4U-SB',
                CommodityConditionType:
                    'PMP1-Y001/PMP2-SU02/PMP3-SU03/PMP4-SU04/PMP5-SU05/PMP6-SU06/SU0003-SU03',
                //'PMP1-SU01/PMP2-SU02/PMP3-SU03/PMP4-SU04/PMP5-SU05/PMP6-SU06',
            },
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
            BillableItemsCreateUrl: 'https://c4u-prod.eu10.revenue.cloud.sap',
        },
    });

    setTestDestination({
        name: 'mdi-bp-keymap',
        url: 'https://one-mds.cfapps.eu10.hana.ondemand.com/businesspartner/v0/odata/API_BP_KEY_MAPPINGBeta',
    });

    setTestDestination({
        name: 'c4e-bds-dest',
        url: 'https://bi-bds-async.cloudforenergy-rc.cfapps.eu20.hana.ondemand.com',
        originalProperties: {
            destinationConfiguration: {
                Name: 'c4e-bds-dest',
                Type: 'HTTP',
                URL: 'https://bi-bds-async.cloudforenergy-rc.cfapps.eu20.hana.ondemand.com',
                Authentication: 'OAuth2ClientCredentials',
                ProxyType: 'Internet',
                clientId:
                    'sb-5c4dd4ad-577d-4554-a45c-98129001bb6b!b3529|c4e-api!b691',
                clientSecret: 'secret',
            },
        },
    });

    it('should return status 200 and response object', async () => {
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(200);
        expect(authResp.data.status.billsSentForTransfer).to.equal(3);
    });

    it('should return status 500', async () => {
        mockServer.use(
            rest.get(
                `https://c4u-prod.eu10.revenue.cloud.sap/*`,
                (_, res, ctx) => {
                    return res(
                        ctx.status(502),
                        ctx.json({ message: 'TEST ERROR' })
                    );
                }
            )
        );
        let errorMsg = '';
        try {
            await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            errorMsg = error.message;
        }
        expect(errorMsg).to.contain('500');
    });

    it('should return status 406 when no Bills is transferrable', async () => {
        let errorMsg = '';
        mockServer.use(
            rest.get(
                `https://c4u-prod.eu10.revenue.cloud.sap/*`,
                (req, res, ctx) => {
                    if (req.url.pathname === '/api/bill/v2/bills/transferable')
                        return res(ctx.json([]));
                }
            )
        );
        try {
            await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            errorMsg = error.message;
        }
        expect(errorMsg).to.contain(
            '406 - Could not fetch bills to transfer to SAP S/4HANA.'
        );
    });

    it('should return status 200 for charged Bill Type', async () => {
        mockServer.use(
            rest.get(
                `https://c4u-prod.eu10.revenue.cloud.sap/*`,
                (req, res, ctx) => {
                    if (req.url.pathname === '/api/bill/v2/bills/transferable')
                        return res(ctx.json(GetSampleBills));
                    else return res(ctx.json(TransfBillDetailChargesResponse));
                }
            )
        );
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(200);
        expect(authResp.data.status.billsSentForTransfer).to.equal(3);
    });

    it('should still return status 200 for BP key mapping error', async () => {
        API_BP_KEY_MAPPINGBeta.mockImplementation(() => {
            return {
                getBPKeyMappingByBpDisplayId: async (req, customerNumber) => {
                    return {};
                },
            };
        });
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
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
        expect(authResp.status).to.equal(200);
        expect(authResp.data.status.billsNotSentForTransfer).to.equal(3);
    });

    it('should return status 200 for Commodity Bill Type', async () => {
        mockServer.use(
            rest.get(
                `https://c4u-prod.eu10.revenue.cloud.sap/*`,
                (req, res, ctx) => {
                    if (
                        req.url.pathname.includes(
                            '/api/subscription/v1/subscriptions'
                        )
                    )
                        return res(
                            ctx.json(commodityDetails.subscriptionDetailsActive)
                        );
                    if (req.url.pathname === '/api/bill/v2/bills/transferable')
                        return res(ctx.json(GetSampleBills));
                    else if (
                        req.url.pathname.includes(
                            '/api/business-partner/v3/customers/'
                        )
                    )
                        return res(ctx.json(customerDetails));
                    else if (
                        req.url.pathname.includes(
                            '/api/billing-forecast/v1/forecasts/'
                        )
                    )
                        return res(ctx.json(BillingForecast));
                    else
                        return res(ctx.json(TransfBillDetailResponseCommodity));
                }
            )
        );
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(200);
        expect(authResp.data.status.billsSentForTransfer).to.equal(3);
    });

    it('should return status 200 and transfer expired Commodity Bill', async () => {
        mockServer.use(
            rest.get(
                `https://c4u-prod.eu10.revenue.cloud.sap/*`,
                (req, res, ctx) => {
                    if (
                        req.url.pathname.includes(
                            '/api/subscription/v1/subscriptions'
                        )
                    )
                        return res(
                            ctx.json(commodityDetails.subscriptionDetails)
                        );
                    else if (
                        req.url.pathname === '/api/bill/v2/bills/transferable'
                    )
                        return res(ctx.json(GetSampleBills));
                    else if (
                        req.url.pathname.includes(
                            '/api/business-partner/v3/customers/'
                        )
                    )
                        return res(ctx.json(customerDetails));
                    else
                        return res(ctx.json(TransfBillDetailResponseCommodity));
                }
            )
        );
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(200);
        expect(authResp.data.status.billsSentForTransfer).to.equal(3);
    });

    it('should return 200 for commodity item with subscription containing error', async () => {
        mockServer.use(
            rest.get(
                `https://c4u-prod.eu10.revenue.cloud.sap/*`,
                (req, res, ctx) => {
                    if (req.url.pathname === '/api/bill/v2/bills/transferable')
                        return res(ctx.json(GetSampleBills));
                    else if (
                        req.url.pathname.includes(
                            '/api/business-partner/v3/customers/'
                        )
                    )
                        return res(ctx.json(customerDetails));
                    else
                        return res(ctx.json(TransfBillDetailResponseCommodity));
                }
            )
        );
        jest.spyOn(
            SubscriptionBillingAPI,
            'getSubscription'
        ).mockImplementation(() => {
            return {
                message: 'Error',
            };
        });
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(200);
    });

    it('should return 200 for commodity item with billing forecasts containing errors', async () => {
        mockServer.use(
            rest.get(
                `https://c4u-prod.eu10.revenue.cloud.sap/*`,
                (req, res, ctx) => {
                    if (
                        req.url.pathname.includes(
                            '/api/subscription/v1/subscriptions'
                        )
                    )
                        return res(
                            ctx.json(commodityDetails.subscriptionDetailsActive)
                        );
                    else if (
                        req.url.pathname === '/api/bill/v2/bills/transferable'
                    )
                        return res(ctx.json(GetSampleBills));
                    else if (
                        req.url.pathname.includes(
                            '/api/business-partner/v3/customers/'
                        )
                    )
                        return res(ctx.json(customerDetails));
                    else
                        return res(ctx.json(TransfBillDetailResponseCommodity));
                }
            )
        );
        jest.spyOn(
            SubscriptionBillingAPI,
            'getBillingForecasts'
        ).mockImplementation(() => {
            return {
                message: 'Error',
            };
        });
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(200);
    });

    it('should return 200 for commodity item with invalid billing forecasts', async () => {
        mockServer.use(
            rest.get(
                `https://c4u-prod.eu10.revenue.cloud.sap/*`,
                (req, res, ctx) => {
                    if (
                        req.url.pathname.includes(
                            '/api/subscription/v1/subscriptions'
                        )
                    )
                        return res(
                            ctx.json(commodityDetails.subscriptionDetailsActive)
                        );
                    else if (
                        req.url.pathname.includes(
                            '/api/billing-forecast/v1/forecasts/'
                        )
                    )
                        return res(ctx.json(BillingForecast));
                    else if (
                        req.url.pathname === '/api/bill/v2/bills/transferable'
                    )
                        return res(ctx.json(GetSampleBills));
                    else if (
                        req.url.pathname.includes(
                            '/api/business-partner/v3/customers/'
                        )
                    )
                        return res(ctx.json(customerDetails));
                    else
                        return res(ctx.json(TransfBillDetailResponseCommodity));
                }
            )
        );
        jest.spyOn(
            ForecastBITSHelper,
            'checkBillingForecasts'
        ).mockImplementation(() => {
            return false;
        });
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(200);
    });

    it('should return 200 for commodity item without billing forecasts', async () => {
        jest.spyOn(
            ForecastBITSHelper,
            'getPeriodicBillingForecasts'
        ).mockImplementation(() => {
            return undefined;
        });

        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(200);
    });

    it('should return status 200 when mocking soap client ', async () => {
        mockServer.use(
            rest.post(
                `https://c4u-prod.eu10.revenue.cloud.sap/*`,
                (req, res, ctx) => {
                    return res(ctx.status(200), ctx.json());
                }
            )
        );
        let authResp = '';
        try {
            authResp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(authResp.status).to.equal(200);
        expect(authResp.data.status.billsSentForTransfer).to.equal(3);
    });

    it('should return status 401-unauthorized', async () => {
        let errorMsg = '';
        try {
            await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: '',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            errorMsg = error.message;
        }
        expect(errorMsg).to.contain('401 - Unauthorized');
    });

    // ****PLEASE READ BELOW CAREFULLY ******
    // NOTE: BELOW TEST CASES CHANGE DESTINATION MOCKING, SO PLEASE ADD YOUR SUCCESSFUL TEST CASES BEFORE THESE CASES

    it('should return status 200 when unmocking bds client ', async () => {
        mockServer.use(
            rest.get(
                `https://c4u-prod.eu10.revenue.cloud.sap/*`,
                (req, res, ctx) => {
                    if (req.url.pathname === '/api/bill/v2/bills/transferable')
                        return res(ctx.json(GetSampleBills));
                    else if (
                        req.url.pathname.includes(
                            '/api/business-partner/v3/customers/'
                        )
                    )
                        return res(ctx.json(customerDetails));
                    else
                        return res(ctx.json(TransfBillDetailResponseCommodity));
                }
            )
        );

        unmockTestDestination('c4e-bds-dest');

        let unmockBds = '';
        let errorMsg;
        try {
            unmockBds = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            errorMsg = error.message;
        }
        expect(unmockBds.status).to.equal(200);
        expect(unmockBds.data.status.billsSentForTransfer).to.equal(0);
    });

    it('should return status 406 for SB destination errors', async () => {
        unmockTestDestination('SB-DESTINATION');
        setTestDestination({
            name: 'SB-DESTINATION',
            url: 'https://c4u-prod.eu10.revenue.cloud.sap',
        });

        let resp = '';
        let errorMsg = '';
        try {
            resp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            errorMsg = error.message;
        }
        expect(errorMsg).to.contain(
            '406 - Could not fetch destination or destination configuration for SAP Subscription Billing.'
        );
    });

    it('should return status 406 for SB destination config property not existed errors', async () => {
        unmockTestDestination('SB-DESTINATION');
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
                },
            },
        });

        let resp = '';
        let errorMsg = '';
        try {
            resp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            errorMsg = error.message;
        }
        expect(errorMsg).to.contain(
            '406 - One of the destination configuration properties is missing: S4BusinessSystem,SBBusinessSystem,BillingSubProcess,BITClass,ConditionType'
        );
    });

    it('should return status 406 for S4H destination errors', async () => {
        unmockTestDestination('S4-DESTINATION');
        setTestDestination({
            name: 'S4-DESTINATION',
            url: 'https://c4u-prod.eu10.revenue.cloud.sap',
        });

        let resp = '';
        let errorMsg = '';
        try {
            resp = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
        } catch (error) {
            errorMsg = error.message;
        }
        expect(errorMsg).to.contain(
            '406 - Convergent Invoicing Business System could not be determined. Please maintain it as property `BusinessSystem` for the SAP BTP destination.'
        );
    });

    it('should check for feature flag', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return false;
        });

        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;

        try {
            const { status } = await POST(
                '/api/billing/v1/billableItems/transfer',
                {},
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    params: {
                        customerId: '',
                    },
                }
            );
            expect(status).to.eql(503);
        } catch (error) {
            expect(error.message).to.eql('503 - Service Unavailable.');
        }
    });

    it('should receive message VIA EM', async () => {
        const providerContractMessaging = await cds.connect.to(
            'providerContractMessaging'
        );

        const {
            event,
            data: baseData,
            headers,
            msg,
        } = require('./payload/EM_sap_c4u_ce_sap_retail_provider_contract_created_v1.json');

        const data = JSON.parse(JSON.stringify(baseData));

        msg.req.authInfo.getAppToken = () => {
            return '123456789';
        };
        msg.req.user = {
            id: admin,
            is: () => true,
        };
        msg.req.error = () => {};

        let tx = providerContractMessaging.transaction(msg);
        const spyPCMessaging = jest.spyOn(tx, 'emit');
        await tx.emit(event, data, headers);

        jestExpect(spyPCMessaging).toBeCalledTimes(1);
    });
});
