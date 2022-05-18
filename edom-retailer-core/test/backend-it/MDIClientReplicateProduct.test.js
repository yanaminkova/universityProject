const cds = require('@sap/cds');

cds.env.log.levels = { app: 'trace', db: 'trace' };

const expect = require('expect');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const { launchServer, pause, mockServerConf } = require('../lib/testkit');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
const { TextBundle } = require('@sap/textbundle');
const i18nPath = '../../_i18n/i18n';
const productCreatedMockResponse = require('./payload/mdiProductAPI/MDIProductCreatedMockPayload.json');
const productMockResponse = require('./payload/mdiProductAPI/MDIProductMockPayload.json');
const productUpdatedMockResponse = require('./payload/mdiProductAPI/MDIProductUpdatedMockPayload.json');
const { ODMVERSION } = require('../../srv/lib/config');

describe('MDIClientReplicateProduct it-test', () => {
    // enabling mock feature flags
    cds.env.requires.featureFlags = {
        impl: 'test/backend-it/external/FeatureFlagsTestService',
    };

    const servicePaths = ['db', 'srv'];

    const { POST, admin } = launchServer({
        service: {
            paths: servicePaths,
        },
    });

    // Mock the destinations
    const mdiDestName = 'C4UF-MDI';
    const mdiDestUrl = 'https://mdi-test.com';
    const mdiProductLogAPI = `sap.odm.product.Product`;
    setTestDestination({
        name: mdiDestName,
        url: mdiDestUrl,
        authTokens: [{ value: 'test' }],
        destinationConfiguration: {
            MDIProductLogAPI: mdiProductLogAPI,
        },
    });

    const logUrl = `${mdiDestUrl}${ODMVERSION}${mdiProductLogAPI}/events`;

    const mdiMockServer = setupServer();

    async function delay(ms) {
        return await new Promise((resolve) => setTimeout(() => resolve(), ms));
    }

    const bundle = new TextBundle(i18nPath, ' ');

    beforeAll(async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;

        const { status: statusProductTypeGroupCodes } = await POST(
            `/api/v1/ProductTypeGroupCodes`,
            {
                code: 'Z',
                name: 'ZZ',
                descr: 'Test group ZZ',
            },
            { auth: admin }
        );
        expect(statusProductTypeGroupCodes).toBe(201);

        const { status: statusProductTypeHAWA } = await POST(
            `/api/v1/ProductTypeCodes`,
            {
                code: 'HAWA',
                name: 'HAWA',
                descr: 'Trading Goods',
                typeGroup: { code: 'Z' },
            },
            { auth: admin }
        );
        expect(statusProductTypeHAWA).toBe(201);

        const { status: statusProductTypeKMAT } = await POST(
            `/api/v1/ProductTypeCodes`,
            {
                code: 'KMAT',
                name: 'KMAT',
                descr: 'Configurable materials',
                typeGroup: { code: 'Z' },
            },
            { auth: admin }
        );
        expect(statusProductTypeKMAT).toBe(201);

        const { status: statusDevisionCode00 } = await POST(
            `/api/v1/DivisionCodes`,
            {
                code: '00',
                name: 'Default',
                descr: null,
            },
            { auth: admin }
        );
        expect(statusDevisionCode00).toBe(201);

        mdiMockServer.listen(mockServerConf);
    });

    afterAll(() => {
        mdiMockServer.close();
    });

    afterEach(async () => {
        mdiMockServer.resetHandlers();
        jest.clearAllMocks();
        await pause();
    });

    const replicateProducts = async () => {
        return POST(
            `/api/mdiClient/v1/replicateProducts`,
            {},
            {
                auth: admin,
            }
        );
    };

    const getLastDeltaToken = async (db) => {
        return db.run(
            SELECT.one(
                `sap.c4u.foundation.retailer.mdiclient.DeltaTokenBookKeeping`,
                ['deltaToken']
            )
                .where({ type: 'PR' })
                .orderBy({ createdAt: 'desc' })
        );
    };

    const getProductByDisplayId = async (db, displayId) => {
        return db.run(
            SELECT.one.from('sap.odm.product.Product').where({
                displayId: displayId,
            })
        );
    };

    it(`should NOT replicate products due to no instances in MDI - UTILITIESCLOUDSOLUTION-3079 `, async () => {
        mdiMockServer.use(
            rest.get(logUrl, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json({ value: [] }));
            })
        );
        // read MDIClient
        await replicateProducts();

        const db = await cds.connect.to('db');
        const products = await db.run(SELECT.from('sap.odm.product.Product'));
        expect(products.length).toBe(0);
    });
    it(`should replicate created products from MDI  to C4UF - UTILITIESCLOUDSOLUTION-3079`, async () => {
        function createProductSwarm(mockResponse) {
            const stringResponse = JSON.stringify(mockResponse.value[0]);
            mockResponse.value = [mockResponse.value[0]].concat(
                Array.from({ length: 999 }, () => {
                    const result = JSON.parse(stringResponse);
                    result.instance.id = cds.utils.uuid();
                    return result;
                })
            );
            return mockResponse;
        }

        mdiMockServer.use(
            rest.get(logUrl, (req, res, ctx) => {
                const deltaToken = req.url.searchParams.get('$deltatoken');
                const index =
                    productCreatedMockResponse.findIndex(
                        (line) =>
                            line['@odata.nextLink']?.split('=')?.[1] ===
                            deltaToken
                    ) + 1;

                const mockResponse =
                    index >= productCreatedMockResponse.length - 1
                        ? productCreatedMockResponse[index]
                        : createProductSwarm(productCreatedMockResponse[index]);

                return res(ctx.status(200), ctx.json(mockResponse));
            })
        );
        // read MDIClient
        const response = await replicateProducts();
        await delay(5000);
        expect(response.data.Created).toBe(5002);
        expect(response.data.Updated).toBe(0);
        expect(response.data.Failed).toBe(0);

        const db = await cds.connect.to('db');

        const products = await db.run(SELECT.from('sap.odm.product.Product'));

        expect(products.length).toBe(5002);

        const product1 = await db.run(
            SELECT.one
                .from('sap.odm.product.Product')
                .where({ id: 'ca3aac87-bd9b-4cce-adb1-8443dbd2b61d' })
        );
        expect(product1).toBeTruthy();
        expect(product1.id).toBe('ca3aac87-bd9b-4cce-adb1-8443dbd2b61d');
        expect(product1.displayId).toBe('4063');
        expect(product1.name).toBe('name in english');
        expect(product1.type_code).toBe('HAWA');

        const productSalesAspects = await db.run(
            SELECT.from('sap.odm.product.Product.salesAspect')
        );

        expect(productSalesAspects.length).toBe(5000);

        const productTexts = await db.run(
            SELECT.from('sap.odm.product.Product.texts')
        );

        expect(productTexts.length).toBe(9002);
        const oneProductId = 'ca3aac87-bd9b-4cce-adb1-8443dbd2b61d';
        const oneProductLocales = productTexts.filter(
            (l) => l.id === oneProductId
        );
        expect(oneProductLocales).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ locale: 'en' }),
                expect.objectContaining({ locale: 'ru' }),
                expect.not.objectContaining({ name: null }),
                expect.not.objectContaining({ description: null }),
            ])
        );

        const deltatoken = await getLastDeltaToken(db);
        expect(deltatoken).toBeTruthy();
    });

    it.skip(`should return number or created/failed products and list of errror occurred during insert/update products- UTILITIESCLOUDSOLUTION-3079`, async () => {
        mdiMockServer.use(
            rest.get(logUrl, (req, res, ctx) => {
                const mockResponse = productMockResponse;
                return res(ctx.status(200), ctx.json(mockResponse));
            })
        );

        const response = await replicateProducts();
        await delay(5000);
        expect(response.data.Created).toBe(2);
        expect(response.data.Updated).toBe(0);
        expect(response.data.Failed).toBe(2);
        expect(response.data.Errors.length).toBe(3);

        expect(response.data.Errors[0].id).toBe(
            'aa3aac87-bd9b-4cce-adb1-8443dbd2b61d'
        );
        expect(response.data.Errors[0].displayId).toBe(null);

        const errorMessage = `${bundle.getText(
            'errorMsgMdiAssertReferenceIntegraty',
            ['sap.odm.product.ProductTypeCodes']
        )}`;

        const errorMessage2 = `${bundle.getText(
            'errorMsgMdiAssertReferenceIntegraty',
            ['sap.odm.sales.orgunit.DivisionCodes']
        )}`;
        expect(response.data.Errors[0].errorMessage.toString()).toBe(
            errorMessage
        );
        expect(response.data.Errors[0].deltaToken).toBeTruthy;

        expect(response.data.Errors[1].id).toBe(
            'aa3aac87-bd9b-4cce-adb1-8443dbd2b61d'
        );
        expect(response.data.Errors[1].displayId).toBe(null);
        expect(response.data.Errors[1].errorMessage.toString()).toBe(
            errorMessage2
        );
        expect(response.data.Errors[1].deltaToken).toBeTruthy;

        expect(response.data.Errors[2].id).toBe(
            '75e6f698-22b0-45a0-a76d-a4fc231045eb'
        );
        expect(response.data.Errors[2].displayId).toBe(null);
        expect(response.data.Errors[2].errorMessage.toString()).toBe(
            errorMessage
        );
        expect(response.data.Errors[2].deltaToken).toBeTruthy;

        const db = await cds.connect.to('db');

        // -------- Check whether errors has been successfully saved

        const errors = await db.run(
            SELECT.from('sap.c4u.foundation.retailer.mdiclient.MDIErrorTable')
        );

        expect(errors[0].id).toBe('aa3aac87-bd9b-4cce-adb1-8443dbd2b61d');
        expect(errors[0].displayId).toBe(null);

        expect(errors[0].errorMessage.toString()).toBe(errorMessage);
        expect(errors[0].deltaToken).toBeTruthy;

        expect(errors[1].id).toBe('aa3aac87-bd9b-4cce-adb1-8443dbd2b61d');
        expect(errors[1].displayId).toBe(null);
        expect(errors[1].errorMessage.toString()).toBe(errorMessage2);
        expect(errors[1].deltaToken).toBeTruthy;

        expect(errors[2].id).toBe('75e6f698-22b0-45a0-a76d-a4fc231045eb');
        expect(errors[2].displayId).toBe(null);
        expect(errors[2].errorMessage.toString()).toBe(errorMessage);
        expect(errors[2].deltaToken).toBeTruthy;

        // -------- Check whether the product has been successfully inserted

        const product1 = await db.run(
            SELECT.one
                .from('sap.odm.product.Product')
                .where({ id: '13021be0-8427-11ec-a8a3-0242ac120002' })
        );
        expect(product1).toBeTruthy();
        expect(product1.id).toBe('13021be0-8427-11ec-a8a3-0242ac120002');
        expect(product1.displayId).toBe('4063');
        expect(product1.name).toBe('name in english Updated');
        expect(product1.type_code).toBe('HAWA');

        const deltatoken = await getLastDeltaToken(db);
        expect(deltatoken).toBeTruthy();
    });

    it(`should replicate updated products from MDI to C4UF - UTILITIESCLOUDSOLUTION-3079`, async () => {
        mdiMockServer.use(
            rest.get(logUrl, (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(productUpdatedMockResponse)
                );
            })
        );

        const db = await cds.connect.to('db');

        const response = await replicateProducts();
        await delay(5000);
        expect(response.data.Created).toBe(0);
        expect(response.data.Updated).toBe(1);
        expect(response.data.Failed).toBe(0);
        const product = await getProductByDisplayId(db, '4021');

        expect(product).toBeTruthy();
        expect(product.name).toBe('Name has changed');
    });

    it('should replicate and load delta from MDI to C4UF - UTILITIESCLOUDSOLUTION-3079', async () => {
        const {
            initialPayload,
            updatePayload,
            emptyPayload,
        } = require('./payload/mdiProductAPI/deltaLoad');

        const initialDeltaToken =
            initialPayload['@odata.deltaLink'].split('=')[1];
        const updateDeltaToken =
            updatePayload['@odata.deltaLink'].split('=')[1];

        const targetDisplayId = '4082';

        const db = await cds.connect.to('db');

        mdiMockServer.use(
            rest.get(logUrl, (req, res, ctx) => {
                const deltatoken = req.url.searchParams.get('$deltatoken');
                if (deltatoken === updateDeltaToken) {
                    return res(ctx.status(200), ctx.json(emptyPayload));
                }

                if (deltatoken === initialDeltaToken) {
                    return res(ctx.status(200), ctx.json(updatePayload));
                }

                return res(ctx.status(200), ctx.json(initialPayload));
            })
        );

        const response = await replicateProducts();
        expect(response.data.Created).toBe(3);
        expect(response.data.Updated).toBe(0);
        expect(response.data.Failed).toBe(0);

        const productInitial = await getProductByDisplayId(db, targetDisplayId);
        expect(productInitial.name).toBe('Test product initial name');

        await pause();
        const { deltaToken: deltaTokenInitial } = await getLastDeltaToken(db);
        expect(deltaTokenInitial).toBe(initialDeltaToken);

        await replicateProducts();
        const productUpdated = await getProductByDisplayId(db, targetDisplayId);
        expect(productUpdated.name).toBe('Test product changed name');

        await pause();
        const { deltaToken: deltaTokenUpdated } = await getLastDeltaToken(db);
        expect(deltaTokenUpdated).toBe(updateDeltaToken);
    });

    it('should throw error when MDI destination not properly configured - UTILITIESCLOUDSOLUTION-3079', async () => {
        try {
            const response = await replicateProducts();
            expect(response).toBe(null);
        } catch (error) {
            expect(error.message).toBe(
                '400 - Inbound processing replication for products could not be completed. There was an error while connecting to the destination service. Refer to the Administration Guide to properly configure your SAP Master Data Integration service instance and C4UF-MDI destination point, and retry sending the request. If the error persists, report the incident to the UTL-C4U-EDO-RTL component'
            );
        }
    });
});
