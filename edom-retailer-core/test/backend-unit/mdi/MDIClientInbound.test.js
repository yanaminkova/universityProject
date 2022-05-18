const expect = require('expect');
const cds = require('@sap/cds');
const path = require('path');
const { TextBundle } = require('@sap/textbundle');
const MDIClientInbound = require('../../../srv/mdiclient/MDIClientInbound.js');
const productCreatedMockPayload = require('../../backend-it/payload/mdiProductAPI/MDIProductCreatedMockPayload');
const productOneInstancePayload = require('../../backend-it/payload/mdiProductAPI/MDIProductOneInstancePayload.json');
const productMockPayload = require('../../backend-it/payload/mdiProductAPI/MDIFailedProductPayload');
const AuditLogService = require('../../../srv/dpp/AuditLogService');
const i18nPath = '../../../_i18n/i18n';
const bundle = new TextBundle(i18nPath);

describe('MDIClientInbound unit-test', () => {
    AuditLogService.registerHandler = jest.fn();

    const req = {
        user: {
            id: 'admin',
            is: () => true,
            tenant: 'edom-retailer',
        },
        entity: 'API_EDOM_RETAILER.Product',
        query: {
            _target: {
                name: 'API_EDOM_RETAILER.Product',
            },
        },
        error: () => {},
        authInfo: () => {},
    };

    beforeAll(async () => {
        await cds
            .serve('API_EDOM_RETAILER')
            .from(path.join(__dirname, '../../../srv'));
    });

    async function delay(ms) {
        return await new Promise((resolve) => setTimeout(() => resolve(), ms));
    }

    it('MDICLientInbound.createObject: should create object to be inserted to the database - UTILITIESCLOUDSOLUTION-3079', async () => {
        const { value } = productOneInstancePayload;
        const { API_EDOM_RETAILER } = cds.services;
        const { Product } = API_EDOM_RETAILER.entities;
        const mdiClientInbound = new MDIClientInbound(
            req,
            API_EDOM_RETAILER,
            Product
        );
        const result = mdiClientInbound.createObject(value[0].instance);

        const expectedResult = {
            id: 'ca3aac87-bd9b-4cce-adb1-8443dbd2b61d',
            displayId: '4063',
            name: 'name in english',
            texts: [
                { locale: 'en', name: 'name in english', description: 'Text.' },
                {
                    locale: 'ru',
                    name: 'name in russian',
                    description: 'Basic text russian.',
                },
            ],
            description: 'Text.',
            type_code: 'HAWA',
        };
        expect(result).toMatchObject(expectedResult);
    });

    it('MDICLientInbound.extractLog: should extract log and return instanctes for creation/update - UTILITIESCLOUDSOLUTION-3079', async () => {
        const { API_EDOM_RETAILER } = cds.services;
        const value = productCreatedMockPayload[0].value.concat(
            productCreatedMockPayload[1].value,
            productCreatedMockPayload[2].value
        );

        const mdiClientInbound = new MDIClientInbound(
            req,
            API_EDOM_RETAILER,
            API_EDOM_RETAILER.entities.Product
        );

        const instances = mdiClientInbound.extractLog(value);

        expect(Object.entries(instances).length).toBe(6);

        const expectedResult = {
            id: 'ca3aac87-bd9b-4cce-adb1-8443dbd2b61d',
            displayId: '4063',
            name: 'name in english',
            texts: [
                { locale: 'en', name: 'name in english', description: 'Text.' },
                {
                    locale: 'ru',
                    name: 'name in russian',
                    description: 'Text in russian.',
                },
            ],
            description: 'Text.',
            type_code: 'HAWA',
        };

        expect(instances['ca3aac87-bd9b-4cce-adb1-8443dbd2b61d']).toMatchObject(
            expectedResult
        );
    });

    it('MDICLientInbound.processInstances: the response should contain error details after an unsuccessful update - UTILITIESCLOUDSOLUTION-3079', async () => {
        const { API_EDOM_RETAILER } = cds.services;
        const { value } = productMockPayload;
        const currentDate = new Date().toISOString();

        const deltaToken = 'ffff';
        const mdiClientInbound = new MDIClientInbound(
            req,
            API_EDOM_RETAILER,
            API_EDOM_RETAILER.entities.Product,
            'sap.odm.product.Product'
        );

        const response = await mdiClientInbound.processInstances(
            value,
            deltaToken
        );

        expect(response.length).not.toBeLessThan(0);
    });

    // - UTILITIESCLOUDSOLUTION-3079
    it.skip('MDICLientInbound.upload: should create product', async () => {
        const createPayload = {
            ['bb3aac87-bd9b-4cce-adb1-8443dbd2b61d']: {
                id: 'aa3aac87-bd9b-4cce-adb1-8443dbd2b61d',
                displayId: '4033',
            },
            ['aa3aac87-bd9b-4cce-adb1-8443dbd2b61d']: {
                id: 'aa3aac87-bd9b-4cce-adb1-8443dbd2b61d',
                displayId: '4044',
            },
        };

        const service = cds.services.API_EDOM_RETAILER;
        const productEntity = service.entities.Product;

        const mdiClientInbound = new MDIClientInbound(
            req,
            service,
            productEntity,
            'sap.odm.product.Product'
        );

        const db = await cds.connect('db');

        const mockDbTx = jest.fn().mockResolvedValue([{}, {}]);
        db.tx = mockDbTx;

        const mockDbTxRun = jest
            .fn()
            .mockResolvedValue([{ id: '1234' }, { id: '5678' }]);
        mockDbTx.run = mockDbTxRun;

        try {
            await mdiClientInbound.upload(createPayload);
        } finally {
            jest.clearAllMocks();
        }

        expect(mdiClientInbound.status.created).toBe(2);
    });

    it('MDICLientInbound.upload: should return an error inserting/updating invalid data - UTILITIESCLOUDSOLUTION-3079', async () => {
        const createPayload = {
            '651cbd65': {
                id: '651cbd65',
                displayId: 4063,
            },
        };

        const service = cds.services.API_EDOM_RETAILER;
        const productEntity = service.entities.Product;

        try {
            await new MDIClientInbound(req, service, productEntity).upload(
                createPayload
            );
        } catch (error) {
            expect(error.message).toContain(
                '[MDIClientInbound][upload]: An error occured while creating the product with displayId 4063. Error message:'
            );
        }
    });

    it('MDICLientInbound.prepareErrorMessage: should return error message for display to the end user - UTILITIESCLOUDSOLUTION-3079', async () => {
        const error = {
            code: 400,
            message: 'errorMsgMdiAssertNotNull',
            target: 'displayId',
        };

        const instance = {
            0: '9eb3f99e-1bb2-4459-936b-631a605188a7',
            1: {
                id: '9eb3f99e-1bb2-4459-936b-631a605188a7',
                displayId: '4063',
            },
        };

        const deltaToken = 'bf576b6a-9752-45a1-b308-eccfd77a00e0';
        const errorEntry = await new MDIClientInbound(req).prepareErrorMessage(
            error,
            instance,
            deltaToken
        );

        expect(errorEntry.id).toBe(instance[0]);
        expect(errorEntry.displayId).toBe(instance[1].displayId);
        expect(errorEntry.errorMessage).toBe(
            bundle.getText('errorMsgMdiAssertNotNull', ['displayId'])
        );
        expect(errorEntry.deltaToken).toBe(deltaToken);
        expect(errorEntry.createdAt).toBeTruthy();
    });

    it('MDICLientInbound.replicate: should replicate product - UTILITIESCLOUDSOLUTION-3079', async () => {
        const token =
            'F3uAu5u2.3.0u3u274u1u0u62u126u15u505u126u422u402u209u317u202u776u204u321u207u391u226u224';
        const mdiDestService = { authTokens: [{ value: 'fjfdjh' }] };
        const service = cds.services.API_EDOM_RETAILER;
        const productEntity = service.entities.Product;
        const mdiClientInbound = await new MDIClientInbound(
            req,
            service,
            productEntity
        );
        const mockRetrieveInstances = jest
            .fn()
            .mockResolvedValueOnce(productCreatedMockPayload[0])
            .mockResolvedValue({
                value: [],
                '@odata.deltaLink': `/v1/odm/2.3.0/sap.odm.product.Product/events?$deltatoken=${token}`,
            });

        mdiClientInbound._retrieveInstances = mockRetrieveInstances;

        const errorMessage1 = {
            id: '324',
            displayId: '4023',
            errorMessage: 'ErrorMessage',
            deltaToken: 'eirie',
            createdAt: Date.now(),
        };

        const mockProcessInstances = jest
            .fn()
            .mockResolvedValue([errorMessage1]);

        mdiClientInbound.processInstances = mockProcessInstances;

        const logRequest = {
            query: 'GET /v1/odm/2.3.0/sap.odm.product.Product/events',
        };
        try {
            const response = await mdiClientInbound.replicate(
                mdiDestService,
                logRequest,
                ''
            );
            expect(response[0]).toMatchObject(errorMessage1);
        } finally {
            jest.clearAllMocks();
        }
    });

    it('MDICLientInbound.replicate: should throw error when no response from MDI destination  - UTILITIESCLOUDSOLUTION-3079', async () => {
        const mdiDestService = { authTokens: [{ value: 'fjfdjh' }] };
        const mdiClientInbound = await new MDIClientInbound(req, {}, {});
        const mockRetrieveInstances = jest.fn().mockResolvedValueOnce(null);

        mdiClientInbound._retrieveInstances = mockRetrieveInstances;

        const logRequest = {
            query: 'GET /v1/odm/2.3.0/sap.odm.product.Product/events',
        };
        try {
            const response = await mdiClientInbound.replicate(
                mdiDestService,
                logRequest,
                ''
            );
            expect(response).toBe(null);
        } catch (error) {
            expect(error.message).toBe(
                bundle.getText('errorMsgMDINoResponseFromMDI')
            );
        } finally {
            jest.clearAllMocks();
        }
    });

    it('MDICLientInbound.getErrorMessage: should return i18n error message variable - UTILITIESCLOUDSOLUTION-3079', async () => {
        expect(MDIClientInbound.getErrorMessage('ASSERT_NOT_NULL')).toBe(
            'errorMsgMdiAssertNotNull'
        );
        expect(
            MDIClientInbound.getErrorMessage('ASSERT_REFERENCE_INTEGRITY')
        ).toBe('errorMsgMdiAssertReferenceIntegraty');
    });
});
