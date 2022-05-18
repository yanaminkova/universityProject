const { rest } = require('msw');
const { setupServer } = require('msw/node');
const expect = require('expect');
const xsenv = require('@sap/xsenv');
const { mockServerConf } = require('../../lib/testkit');

const HanaHealthCheck = require('../../../srv/monitoring/healthchecks/HanaHealthCheck');

describe('HanaHealthCheck unit tests UTILITIESCLOUDSOLUTION-2273', () => {
    const authUrl =
        'https://edom-retailer-dev.authentication.eu10.hana.ondemand.com';
    const smUrl =
        'https://service-manager.cfapps.eu10.hana.ondemand.com/v1/service_bindings';

    const mockServer = setupServer(
        rest.post(`${authUrl}/oauth/token`, (_, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json({ access_token: 'mockToken' })
            );
        }),
        rest.get(smUrl, (_, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json({
                    items: [
                        {
                            credentials: {
                                port: 0,
                            },
                        },
                    ],
                })
            );
        })
    );

    beforeAll(() => {
        mockServer.listen(mockServerConf);
    });

    afterAll(() => {
        mockServer.close();
    });

    afterEach(() => {
        mockServer.resetHandlers();
        mockDisconnect.mockClear();
    });

    const mockDisconnect = jest
        .fn()
        .mockImplementation((callback) => callback(null, true));

    const mockConnect = jest
        .fn()
        .mockImplementation((callback) => callback(false));

    const mockCreateClient = jest.fn(() => {
        return {
            connect: mockConnect,
            disconnect: mockDisconnect,
        };
    });

    jest.mock('hdb', () => {
        return {
            createClient: mockCreateClient,
        };
    });

    const mockFilterServices = jest.fn().mockImplementation(() => [{}]);
    const mockServiceCredentials = jest.fn().mockImplementation(() => {
        return {
            sm_url: 'https://service-manager.cfapps.eu10.hana.ondemand.com',
            url: authUrl,
            clientid: 'myClientId',
            clientsecret: 'myClientSecret',
            xsappname: 'myXSAppName',
        };
    });

    xsenv.filterServices = mockFilterServices;
    xsenv.serviceCredentials = mockServiceCredentials;

    it('should return null if service manager credentials are not provided', async () => {
        mockServiceCredentials.mockImplementationOnce(() => null);

        const hanaHealthCheck = new HanaHealthCheck();
        expect(await hanaHealthCheck.isReachable()).toBeFalsy();
    });

    it('should return null if service manager access token is not provided', async () => {
        mockServiceCredentials.mockImplementationOnce(() => null);

        const hanaHealthCheck = new HanaHealthCheck();
        const status = await hanaHealthCheck.isReachable();
        expect(status).toBe(false);
    });

    it('should return error calling server token url', async () => {
        mockServer.use(
            rest.post(`${authUrl}/oauth/token`, (_, res, ctx) => {
                return res(
                    ctx.status(404, 'Error'),
                    ctx.json({ access_token: 'mockToken' })
                );
            })
        );

        const hanaHealthCheck = new HanaHealthCheck();
        const status = await hanaHealthCheck.isReachable();
        expect(status).toBe(false);
    });

    it('should return error calling service manager service binding url ', async () => {
        mockServer.use(
            rest.get(smUrl, (_, res, ctx) => {
                return res(
                    ctx.status(404, 'Error'),
                    ctx.json({
                        items: [
                            {
                                credentials: {},
                            },
                        ],
                    })
                );
            })
        );

        const hanaHealthCheck = new HanaHealthCheck();

        expect(await hanaHealthCheck._retrieveInstanceConfig()).toBeNull();
    });

    it('should not retrieve service manager instance configurations', async () => {
        mockServer.use(
            rest.get(smUrl, (_, res, ctx) => {
                return res(ctx.status(200), ctx.json());
            })
        );

        const hanaHealthCheck = new HanaHealthCheck();

        const status = await hanaHealthCheck.isReachable();
        expect(status).toBe(false);
    });

    it('should return hdb connection error', async () => {
        const hanaHealthCheck = new HanaHealthCheck();

        const status = await hanaHealthCheck.isReachable();
        expect(status).toBe(false);
    });
});
