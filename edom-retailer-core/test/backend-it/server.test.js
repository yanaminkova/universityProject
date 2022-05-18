const cds = require('@sap/cds');
const { cds: cdsProperties } = require('../../package.json');
const axios = require('axios').default;
const expect = require('expect');
const { NOT_FOUND } = require('../../srv/lib/error').ERROR_STATUS_CODE;
const xssSanitizer = require('../../srv/lib/xssSanitizer');
const authenticator = require('passport/lib/authenticator');

const xssRow =
    '<strong mouseover="alert(/xss/)">strong hello world</strong><script>alert(/xss/)</script>';
const token = 'mockToken';

describe('checks general configuration of the app', () => {
    let devServer, devUrl, prodServer, prodUrl;

    beforeAll(async () => {
        const mockStrategy = jest.fn(() => 'success');
        authenticator.prototype._strategy = mockStrategy;

        const mockODataDispatcher = jest.fn(() => {
            const originalDispatcher = jest.requireActual(
                '@sap/cds/libx/_runtime/cds-services/adapter/odata-v4/Dispatcher'
            );

            class MockDispatcher extends originalDispatcher {
                dispatch(req, res) {
                    const cdsInst = require('@sap/cds');
                    req.user = new cdsInst.User.Privileged({});
                    return super.dispatch(req, res);
                }
            }

            return MockDispatcher;
        });
        jest.mock(
            '@sap/cds/libx/_runtime/cds-services/adapter/odata-v4/Dispatcher',
            () => mockODataDispatcher()
        );

        const xsuaa = {
            url: 'https://api.authentication.eu20.hana.ondemand.com',
            domain: 'api.authentication.eu20.hana.ondemand.com',
            clientid: 'myClientId',
            clientsecret: 'myClientSecret',
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

        devServer = await require('../../srv/server')({
            port: '0',
            in_memory: true,
        });
        devUrl = `http://localhost:${devServer.address().port}`;
    });

    beforeAll(async () => {
        process.env['NODE_ENV'] = 'production';
        cds.env.requires.db = cdsProperties.requires.db;

        prodServer = await require('../../srv/server')({
            in_memory: true,
            port: '0',
        });
        prodUrl = `http://localhost:${prodServer.address().port}`;
    });

    beforeEach(() => {
        process.env['NODE_ENV'] = 'development';
    });

    afterAll(async () => {
        if (devServer?.close) {
            devServer.close();
        }

        if (prodServer?.close) {
            prodServer.close();
        }
    });

    it('should include development configuration in app', async () => {
        const result = await axios.get(`${devUrl}/api/v1/$metadata`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { headers } = result;
        expect(headers['x-content-type-options']).toBe('nosniff');
        expect(headers['x-dns-prefetch-control']).toBe('off');
        expect(headers['expect-ct']).toBe('max-age=0');
        expect(headers['referrer-policy']).toBe('no-referrer');
        expect(headers['x-download-options']).toBe('noopen');
        expect(headers['x-frame-options']).toBe('SAMEORIGIN');
        expect(headers['x-permitted-cross-domain-policies']).toBe('none');
        expect(headers['x-xss-protection']).toBe('1; mode=block');
        expect(headers['content-security-policy']).toContain(
            "default-src 'self'"
        );
        expect(headers['content-security-policy']).toContain(
            "style-src 'self' testsuite.qunit.js *.hana.ondemand.com 'unsafe-inline'"
        );
        expect(headers['content-security-policy']).toContain(
            "script-src 'self' testsuite.qunit.js *.hana.ondemand.com 'unsafe-inline' 'unsafe-eval'"
        );
        expect(headers['content-security-policy']).toContain(
            "img-src 'self' data: *.hana.ondemand.com"
        );
        expect(headers['cache-control']).toContain('no-store, no-cache');
    });

    it('should include production configuration in app', async () => {
        const metadataResult = await axios.get(`${prodUrl}/api/v1/$metadata`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { headers } = metadataResult;
        expect(headers['x-content-type-options']).toBe('nosniff');
        expect(headers['x-dns-prefetch-control']).toBe('off');
        expect(headers['expect-ct']).toBe('max-age=0');
        expect(headers['referrer-policy']).toBe('no-referrer');
        expect(headers['x-download-options']).toBe('noopen');
        expect(headers['x-frame-options']).toBe('SAMEORIGIN');
        expect(headers['x-permitted-cross-domain-policies']).toBe('none');
        expect(headers['x-xss-protection']).toBe('1; mode=block');
        expect(headers['content-security-policy']).toContain(
            "default-src 'self'"
        );
        expect(headers['content-security-policy']).toContain(
            "style-src 'self' testsuite.qunit.js *.hana.ondemand.com"
        );
        expect(headers['content-security-policy']).toContain(
            "script-src 'self' testsuite.qunit.js *.hana.ondemand.com"
        );
        expect(headers['content-security-policy']).not.toContain(
            'unsafe-inline'
        );
        expect(headers['content-security-policy']).not.toContain('unsafe-eval');
        expect(headers['cache-control']).toContain('no-store, no-cache');

        try {
            const indexResult = await axios.get(prodUrl);
            expect(indexResult).toBeFalsy();
        } catch (e) {
            expect(e.response.status).toBe(NOT_FOUND);
        }
    });

    it('should test if XSS in request body is sanitized', async () => {
        const spySanitizeData = jest.spyOn(xssSanitizer, 'sanitizeData');
        try {
            await axios.post(
                `${devUrl}/api/v1/SalesProcessingStatusCodes`,
                {
                    code: '01',
                    name: 'Open',
                    descr: xssRow,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            expect(spySanitizeData.mock.results[4].value).toBe(
                '&lt;strong mouseover="alert(/xss/)"&gt;strong hello world&lt;/strong&gt;'
            );
        } finally {
            spySanitizeData.mockClear();
        }
    });

    it('should test if XSS in request query is blocked', async () => {
        const spySanitizeData = jest.spyOn(xssSanitizer, 'sanitizeData');
        try {
            await axios.post(
                `${devUrl}/api/v1/SalesProcessingStatusCodes?xssRow=${xssRow}`,
                {
                    code: '01',
                    name: 'Open',
                    descr: 'Open',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (e) {
        } finally {
            expect(spySanitizeData.mock.results[1].value).toBe(
                '&lt;strong mouseover="alert(/xss/)"&gt;strong hello world&lt;/strong&gt;'
            );

            spySanitizeData.mockClear();
        }
    });
});
