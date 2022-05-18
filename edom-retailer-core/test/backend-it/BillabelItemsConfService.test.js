const { expect, launchServer, mockServerConf } = require('../lib/testkit');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
const { setupServer } = require('msw/node');
const { rest } = require('msw');
const soap = require('soap');
const path = require('path');
const { JWTStrategy } = require('@sap/xssec');

const wsdlPath = path.join(
    __dirname,
    '../../srv/api/lib/BitsCreateConfirmation.wsdl'
);
const SOAP_PATH = '/billableItems/confirm';

const successfulJsonBITSConfRequest = require('./payload/BillableItemsCreateConfirmation.json');
const unsuccessfulJsonBITSConfRequest = require('./payload/BillableItemsCreateConfirmationFailure.json');
const SubscriptionBillingAPI = require('../../srv/external/SubscriptionBillingAPI');

const successorDocumentsResponse = '';

const spyJWTStrategyAuthenticate = jest.spyOn(
    JWTStrategy.prototype,
    'authenticate'
);

describe('BillabelItemsConfService it-test UTILITIESCLOUDSOLUTION-2983', () => {
    let server;
    let soapClient;
    let url;

    const mockServer = setupServer(
        rest.post(
            `https://c4u-prod.eu10.revenue.cloud.sap/api/bill/v2/bills/*`,
            (req, res, ctx) => {
                if (req.url.href.substring('successorDocuments')) {
                    return res(
                        ctx.status(200),
                        ctx.json(successorDocumentsResponse)
                    );
                }
            }
        )
    );

    beforeAll(async () => {
        mockServer.listen(mockServerConf);
        server = await require('../../srv/server')();
        const xsuaa = {
            apiurl: 'https://api.authentication.eu20.hana.ondemand.com',
            clientid: 'sb-c4u-!b58520',
            clientsecret: '6DWq5DNc=',
            'credential-type': 'instance-secret',
            identityzone: 'edom-retailer',
        };

        jest.mock('@sap/xsenv', () => {
            const originalXsenvModule = jest.requireActual('@sap/xsenv');

            //Mock the 'getServices' function
            return {
                __esModule: true,
                ...originalXsenvModule,
                getServices: jest.fn((args) => {
                    return args.xsuaa
                        ? { xsuaa }
                        : originalXsenvModule.getServices(args);
                }),
            };
        });

        url = `http://localhost:${server.address().port}`;

        soapClient = await soap.createClientAsync(wsdlPath);
        soapClient.setEndpoint(`${url}${SOAP_PATH}`);
        soapClient.setSOAPAction('BillableItemsCreateConfirmation_Out');
    });

    afterAll(() => {
        mockServer.close();
        server.close();
    });

    afterEach(() => {
        mockServer.resetHandlers();
        jest.clearAllMocks();
    });

    setTestDestination({
        name: 'SB-DESTINATION',
        url: 'https://c4u-prod.eu10.revenue.cloud.sap',
        destinationConfiguration: {
            Name: 'SB-DESTINATION',
            Type: 'HTTP',
            URL: 'https://eu10.revenue.cloud.sap',
            Authentication: 'OAuth2ClientCredentials',
            ProxyType: 'Internet',
            tokenServiceURLType: 'Dedicated',
            clientId: 'sb-sap-subscription-billing!b85281|revenue-cloud!b1532',
            Description: 'set token for SB Destination',
            BITClass: '0SAP',
            CACategory: 'Y1',
            BillingProcess: 'Y001',
            tokenServiceURL:
                'https://c4uconsumerdevaws.authentication.eu10.hana.ondemand.com/oauth/token',
            SubscriptionBillingAPI: '/api/subscription/v1/subscriptions',
            BillingSubProcess: 'Y001',
            SBBusinessSystem: 'C4U-SB',
            MarketBusinessConfigAPI:
                '/api/business-config/v1/config/Global/Market/v1',
            S4BusinessSystem: '0LOALS1',
            clientSecret: 'ssss',
            ConditionType: 'PMP1-YONE/PMP2-YREC/PMP3-Y001',
        },
    });

    it('should return status 401-unauthorized', async () => {
        let errorMsg = '';
        let errObj;
        let resp = '';
        try {
            resp = await soapClient.BillableItemsCreateConfirmation_OutAsync(
                successfulJsonBITSConfRequest
            );
        } catch (error) {
            errObj = error;
            errorMsg = error.body;
        }

        expect(errorMsg).to.contain('Unauthorized');
        expect(errObj.response.status).to.eql(401);
    });

    it('should return successful response through non-error flow', async () => {
        let resp = '';
        spyJWTStrategyAuthenticate.mockImplementation((req) => {
            req.user = {
                id: 'sb-a632a622|c4u-retailer!b5',
                _roles: {
                    any: true,
                    'identified-user': true,
                    'authenticated-user': true,
                    'system-user': true,
                },
                attr: {},
                tenant: '7dd7eebf-04fe-4886',
                locale: ' ',
            };
            req.headers.authorization = '123456789';
            req.next();
        });

        try {
            resp = await soapClient.BillableItemsCreateConfirmation_OutAsync(
                successfulJsonBITSConfRequest
            );
        } catch (error) {
            errObj = error;
            errorMsg = error.body;
        }

        // contains xml response
        expect(resp[1]).to.contain(`<?xml`);
        expect(resp[0]['status']).to.eql('SUCCESS');
        expect(resp[0]['CABllbleItmSourceTransId']).to.eql(
            '0000000000000000003061'
        );
        spyJWTStrategyAuthenticate.mockReset();
    });

    it('should fail to authenticate as the JWT is missing', async () => {
        let resp = '';
        let errObj = '';
        spyJWTStrategyAuthenticate.mockImplementation((req) => {
            req.user = {
                id: 'sb-a632a622|c4u-retailer!b5',
                _roles: {
                    any: true,
                    'identified-user': true,
                    'authenticated-user': true,
                    'system-user': true,
                },
                attr: {},
                tenant: '7dd7eebf-04fe-4886',
                locale: ' ',
            };
            req.next();
        });

        try {
            resp = await soapClient.BillableItemsCreateConfirmation_OutAsync(
                successfulJsonBITSConfRequest
            );
        } catch (error) {
            errObj = error;
            errorMsg = error.body;
        }

        // contains error
        expect(errObj.body).to.contain('JSON Web Token (JWT) not found');
        spyJWTStrategyAuthenticate.mockReset();
    });

    it('should return successful response through failedAttempts flow', async () => {
        let resp = '';
        spyJWTStrategyAuthenticate.mockImplementation((req) => {
            req.user = {
                id: 'sb-a632a622|c4u-retailer!b5',
                _roles: {
                    any: true,
                    'identified-user': true,
                    'authenticated-user': true,
                    'system-user': true,
                },
                attr: {},
                tenant: '7dd7eebf-04fe-4886',
                locale: ' ',
            };
            req.next();
        });

        jest.spyOn(
            SubscriptionBillingAPI,
            'postSuccessorDocuments'
        ).mockImplementation(() => {
            return;
        });

        try {
            resp = await soapClient.BillableItemsCreateConfirmation_OutAsync(
                unsuccessfulJsonBITSConfRequest
            );
        } catch (error) {
            errObj = error;
            errorMsg = error.body;
        }

        // contains xml response
        expect(resp[1]).to.contain(`<?xml`);
        expect(resp[0]['status']).to.eql('SUCCESS');
        expect(resp[0]['CABllbleItmSourceTransId']).to.eql(
            '0000000000000000002432'
        );
        spyJWTStrategyAuthenticate.mockReset();
    });

    it('should fail to find bill document and throw an exception with 404 error response', async () => {
        spyJWTStrategyAuthenticate.mockImplementation((req) => {
            req.user = {
                id: 'sb-a632a622|c4u-retailer!b5',
                _roles: {
                    any: true,
                    'identified-user': true,
                    'authenticated-user': true,
                    'system-user': true,
                },
                attr: {},
                tenant: '7dd7eebf-04fe-4886',
                locale: ' ',
            };
            req.next();
        });

        jest.spyOn(
            SubscriptionBillingAPI,
            'postSuccessorDocuments'
        ).mockImplementation(() => {
            throw {
                response: {
                    status: '404',
                    statusText: 'Not Found',
                },
                stack: 'Mocked error stack',
            };
        });

        let resp = '';

        try {
            resp = await soapClient.BillableItemsCreateConfirmation_OutAsync(
                successfulJsonBITSConfRequest
            );
        } catch (e) {
            resp = e.response;
        }

        // contains xml response
        expect(resp['data']).to.contain(`<?xml`);
        expect(resp['data']).to.contain(`404 Not Found`);
        expect(resp['status']).to.eql(500);
        expect(resp['statusText']).to.contain('Internal Server Error');
        spyJWTStrategyAuthenticate.mockReset();
    });

    it('should fail to authenticate with destination and throw an exception with 500 error response', async () => {
        spyJWTStrategyAuthenticate.mockImplementation((req) => {
            req.user = {
                id: 'sb-a632a622|c4u-retailer!b5',
                _roles: {
                    any: true,
                    'identified-user': true,
                    'authenticated-user': true,
                    'system-user': true,
                },
                attr: {},
                tenant: '7dd7eebf-04fe-4886',
            };
            req.next();
        });

        jest.spyOn(
            SubscriptionBillingAPI,
            'postSuccessorDocuments'
        ).mockImplementation(() => {
            throw {
                cause: {
                    message: 'Request failed with status code 401',
                },
                stack: 'Mocked error stack',
            };
        });

        let resp = '';

        try {
            resp = await soapClient.BillableItemsCreateConfirmation_OutAsync(
                unsuccessfulJsonBITSConfRequest
            );
        } catch (e) {
            resp = e.response;
        }

        // contains xml response
        expect(resp['data']).to.contain(`<?xml`);
        expect(resp['status']).to.eql(500);
        expect(resp['statusText']).to.contain('Internal Server Error');
        spyJWTStrategyAuthenticate.mockReset();
    });
});
