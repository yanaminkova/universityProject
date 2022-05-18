const expect = require('expect');
const axios = require('axios').default;

describe('AuditlogSecurity.test', () => {
    const log = jest.fn();

    const viewer = {
        username: 'viewer',
        password: 'viewer',
    };

    global.console.log = log;

    let devServer, devUrl;

    const xsuaa = {
        apiurl: 'https://api.authentication.eu20.hana.ondemand.com',
        clientid: 'myClientId',
        clientsecret: 'myClientSecret',
        'credential-type': 'instance-secret',
        identityzone: 'edom-retailer',
    };

    const originalXsenvModule = jest.requireActual('@sap/xsenv');

    const mockxsenv = jest.fn(() => {
        //Mock the 'getServices' function
        return {
            __esModule: true,
            ...originalXsenvModule,
            getServices: jest.fn((args) => {
                return args.xsuaa
                    ? { xsuaa }
                    : originalXsenvModule.getServices(args);
            }),
            filterServices: jest.fn((filter) => {
                if (filter?.tag === 'auditlog') {
                    return [{}];
                }

                return originalXsenvModule.filterServices(filter);
            }),
            serviceCredentials: jest.fn((filter) => {
                if (filter?.tag === 'auditlog') {
                    return xsuaa;
                }

                return originalXsenvModule.serviceCredentials(filter);
            }),
        };
    });

    beforeAll(async () => {
        jest.mock('@sap/xsenv', () => {
            return mockxsenv();
        });

        devServer = await require('../../srv/server')({
            port: '0',
        });
        devUrl = `http://localhost:${devServer.address().port}`;
    });

    beforeEach(() => {
        process.env['NODE_ENV'] = 'development';
        log.mockReset();
    });

    afterAll(async () => {
        if (devServer?.close) {
            devServer.close();
        }
        log.mockClear();
    });

    it('should log for Audit -> Authorization failure status: 403 UTILITIESCLOUDSOLUTION-3042', async () => {
        mockxsenv.mockImplementationOnce(() => {
            return {
                __esModule: true,
                ...originalXsenvModule,
            };
        });

        const customerOrderDataPayload = {
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130004',
            isExternallyPriced: null,
        };

        try {
            await axios.post(
                `${devUrl}/api/v1/CustomerOrder`,
                customerOrderDataPayload,
                {
                    auth: viewer,
                }
            );
        } catch (e) {}

        const auditLogMessage = log.mock.calls[1][0];
        expect(auditLogMessage.data).toBe(
            'action: "POST /api/v1/CustomerOrder", data: {"errorCode":403,"msg":"Forbidden"}'
        );
    });

    it('should log for Audit -> Authentication failure status: 401 - no authentication header UTILITIESCLOUDSOLUTION-3042', async () => {
        try {
            await axios.get(`${devUrl}/api/v1/CustomerOrder`);
        } catch (e) {}
        const auditLogMessage = log.mock.calls[0][0];
        expect(auditLogMessage.data).toBe(
            'action: "GET /api/v1/CustomerOrder", data: {"errorCode":401,"msg":"Unauthorized access"}'
        );
    });

    it('should log for Audit -> Authentication failure status: 401 - invalid user credentials UTILITIESCLOUDSOLUTION-3042', async () => {
        try {
            await axios.get(`${devUrl}/api/v1/CustomerOrder`, {
                auth: {
                    username: '-',
                    password: '-',
                },
            });
        } catch (e) {}
        const auditLogMessage = log.mock.calls[0][0];
        expect(auditLogMessage.data).toBe(
            'action: "GET /api/v1/CustomerOrder", data: {"errorCode":401,"msg":"Unauthorized access"}'
        );
    });
});
