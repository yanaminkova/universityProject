const { launchServer, mockServerConf } = require('../lib/testkit');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const expect = require('expect');

describe('ServiceProviderConfigService it-test UTILITIESCLOUDSOLUTION-2916', () => {
    const { POST, PUT, PATCH, admin } = launchServer({
        VCAP_SERVICES: {
            'feature-flags': [
                {
                    label: 'feature-flags',
                    provider: null,
                    plan: 'standard',
                    name: 'c4u-foundation-retailer-feature-flags',
                    tags: ['feature-flags'],
                    instance_guid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                    instance_name: 'c4u-foundation-retailer-feature-flags',
                    binding_guid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                    binding_name: null,
                    credentials: {
                        password: 'myClientSecret',
                        uri: 'https://feature-flags.cfapps.eu10.hana.ondemand.com',
                        username: 'myClientId',
                    },
                    syslog_drain_url: null,
                    volume_mounts: [],
                },
            ],
        },
        service: {
            paths: ['srv/api', 'srv/api/serviceprovider', 'srv/external'],
        },
    });

    const mockServer = setupServer();
    const ffUri = 'https://feature-flags.cfapps.eu10.hana.ondemand.com';

    mockServer.use(
        rest.get(
            `${ffUri}/api/v2/evaluate/service-provider?identifier=foundation-retailer`,
            (_, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({
                        type: 'BOOLEAN',
                        variation: 'true',
                    })
                );
            }
        )
    );

    beforeAll(() => {
        mockServer.listen(mockServerConf);
    });
    afterAll(() => {
        mockServer.close();
    });

    beforeAll(async () => {
        divisionPayload = {
            code: '01',
        };
        divisionPayload2 = {
            code: '02',
        };
        marketServicePayload = {
            code: 'AAA',
        };

        marketServicePayload2 = {
            code: 'BBB',
        };

        marketFunctionPayload = {
            code: 'SUP001',
        };

        marketFunctionPayload2 = {
            code: 'DSO001',
        };

        await POST(
            `/api/serviceProvider/v1/config/DivisionCodes`,
            divisionPayload,
            {
                auth: admin,
            }
        );

        await POST(
            `/api/serviceProvider/v1/config/DivisionCodes`,
            divisionPayload2,
            {
                auth: admin,
            }
        );

        await POST(
            `/api/serviceProvider/v1/config/MarketServiceCodes`,
            marketServicePayload,
            {
                auth: admin,
            }
        );
        await POST(
            `/api/serviceProvider/v1/config/MarketServiceCodes`,
            marketServicePayload2,
            {
                auth: admin,
            }
        );
        await POST(
            `/api/serviceProvider/v1/config/MarketFunctionCodes`,
            marketFunctionPayload,
            {
                auth: admin,
            }
        );
        await POST(
            `/api/serviceProvider/v1/config/MarketFunctionCodes`,
            marketFunctionPayload2,
            {
                auth: admin,
            }
        );
    });
    // Test for creating SP
    it('should create unique market function config', async () => {
        const serviceProviderPayload = {
            marketFunction: {
                code: 'SUP001',
            },
            division: {
                code: '01',
            },
            marketService: {
                code: 'DIS',
            },
        };
        let { status, data } = await POST(
            `/api/serviceProvider/v1/config/MarketFunctionConfiguration`,
            serviceProviderPayload,
            { auth: admin }
        );

        expect(data).toBeTruthy();
        expect(status).toBe(201);
    });

    it('should not create unique market function config', async () => {
        let data;
        const serviceProviderPayload = {
            marketFunction: {
                code: 'SUP001',
            },
            division: {
                code: '01',
            },
            marketService: {
                code: 'DIS',
            },
        };

        await expect(async () => {
            await POST(
                `/api/serviceProvider/v1/config/MarketFunctionConfiguration`,
                serviceProviderPayload,
                { auth: admin }
            );
        }).rejects.toThrowError(
            '400 - Market Service can only be allocated to one Market Function for this particular division'
        );
    });

    it('PUT - should update an existing market function', async () => {
        const distCode = 'DSO001';
        const serviceProviderPayload = {
            marketFunction: {
                code: distCode,
            },
        };

        const { status, data } = await PUT(
            `/api/serviceProvider/v1/config/MarketFunctionConfiguration(code='DIS',code_001='01')`,
            serviceProviderPayload,
            { auth: admin }
        );

        expect(data.marketFunction.code).toBe(distCode);
        expect(status).toBe(200);
    });

    it('PATCH - should update an existing market function', async () => {
        const suppCode = 'SUP001';
        const serviceProviderPayload = {
            marketFunction: {
                code: suppCode,
            },
        };

        const { status, data } = await PATCH(
            `/api/serviceProvider/v1/config/MarketFunctionConfiguration(code='DIS',code_001='01')`,
            serviceProviderPayload,
            { auth: admin }
        );

        expect(data.marketFunction.code).toBe(suppCode);
        expect(status).toBe(200);
    });
});
