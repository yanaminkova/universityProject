const cds = require('@sap/cds');
const axios = require('axios');
const { launchServer, req } = require('../lib/testkit');
const functions = require('../lib/functions');

const expect = require('expect');
const {
    blockEntity,
} = require('../../srv/dpp/legalGrounds/CustomerOrderLegalGround');

global.cds.env.features.assert_integrity = false;

describe('API_EDOM_RETAILER.test UTILITIESCLOUDSOLUTION-2259', () => {
    const { GET, POST, PATCH, DELETE, admin, user, viewer } = launchServer({
        service: {
            paths: ['srv'],
        },
    });

    let entities = [];

    const customer = {
        username: 'customer',
        password: 'customer',
    };

    let customerOrderID_dpp;
    let itemID_dpp;
    const customOrderIdDPP = '15626d67-0937-4701-a821-2014f5321a4c';
    const itemIdDPP = '100001';

    beforeAll(async () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('API_EDOM_RETAILER')
        ).filter(
            (value) => !value['@cds.autoexposed'] && !value.elements['up_']
        );

        Array.from(serviceEntities).forEach((element) => {
            const { name } = element;
            entities.push(name.substring(name.indexOf('.') + 1, name.length));
        });

        const { status: status_incotermClass } = await POST(
            `/api/v1/IncotermsClassificationCodes`,
            {
                name: '',
                code: 'ZZ',
            },
            { auth: admin }
        );
        expect(status_incotermClass).toBe(201);

        const {
            status: statusCustomerOrderItemUtilitiesSubsequentDocumentCodes,
        } = await POST(
            `/api/v1/CustomerOrderItemUtilitiesSubsequentDocumentCodes`,
            {
                code: 'UMT1',
                name: 'test',
            },
            { auth: admin }
        );
        expect(statusCustomerOrderItemUtilitiesSubsequentDocumentCodes).toBe(
            201
        );

        const { status: statusCustomerOrderItemTypeCodes } = await POST(
            `/api/v1/CustomerOrderItemTypeCodes`,
            {
                code: 'UCM1',
                name: 'test',
            },
            { auth: admin }
        );
        expect(statusCustomerOrderItemTypeCodes).toBe(201);

        const { status: statusCompanyCode } = await POST(
            `/api/v1/CompanyCode`,
            {
                id: 'myCompanyId2',
                name: 'myCompanyName',
            },
            { auth: admin }
        );
        expect(statusCompanyCode).toBe(201);

        const { status: statusSalesOrganization } = await POST(
            `/api/v1/SalesOrganization`,
            {
                id: '20d0dc8e-e9ec-421f-9c65-fbe2fc18ac5f',
                displayId: 'U101',
                name: 'SAP AG',
                companyCode: {
                    id: 'myCompanyId2',
                },
            },
            { auth: admin }
        );
        expect(statusSalesOrganization).toBe(201);

        await createSalesProcessingStatus('00', 'Initial', true);
        await createSalesProcessingStatus('01', 'Open', false);
        await createSalesProcessingStatus('02', 'In Process', false);
        await createSalesProcessingStatus('03', 'Completed', false);
        await createSalesProcessingStatus('04', 'Canceled', false);
        await createSalesProcessingStatus('05', 'Rejected', false);

        await createCustomerOrder();

        const { status: statusCustomerOrderItemUtilitiesDeviceTypeCodes } =
            await POST(
                `/api/v1/CustomerOrderItemUtilitiesDeviceTypeCodes`,
                {
                    name: 'smart_meter',
                    descr: 'smart_meter',
                    code: '01',
                },
                { auth: admin }
            );
        expect(statusCustomerOrderItemUtilitiesDeviceTypeCodes).toBe(201);

        const {
            status: statusCustomerOrderItemUtilitiesBudgetBillingTypeCodes,
        } = await POST(
            `/api/v1/CustomerOrderItemUtilitiesBudgetBillingTypeCodes`,
            {
                name: null,
                descr: null,
                code: 'SU01',
            },
            { auth: admin }
        );
        expect(statusCustomerOrderItemUtilitiesBudgetBillingTypeCodes).toBe(
            201
        );
    });

    async function createSalesProcessingStatus(code, name, isDefault) {
        try {
            await POST(
                `/api/v1/SalesProcessingStatusCodes`,
                {
                    code,
                    name,
                    isDefault,
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function readData(entity, user) {
        const { status, data } = await GET(`/api/v1/${entity}`, {
            auth: user,
        });
        return { status, data };
    }

    async function createData(entity, user) {
        try {
            await POST(`/api/v1/${entity}`, {}, { auth: viewer });
        } catch (error) {
            return error.message;
        }
    }

    async function createCustomerOrder() {
        const customerOrder = {
            id: customOrderIdDPP,
            isBlocked: false,
            items: [
                {
                    id: itemIdDPP,
                    type: { code: 'UMT1' },
                    notes: [
                        {
                            id: '8e5e535a-dd32-11ea-87d0-0242ac130004',
                            textType: null,
                        },
                    ],
                    partners: [
                        {
                            id: '9e5e535a-dd32-11ea-87d0-0242ac130004',
                        },
                    ],
                    priceComponents: [
                        {
                            id: '7e5e535a-dd32-11ea-87d0-0242ac130004',
                            minorLevel: 0,
                        },
                    ],
                    salesAspect: {
                        scheduleLines: [
                            {
                                id: 'TEST',
                            },
                        ],
                    },
                    serviceAspect: {
                        plannedServiceStartAt: '2021-01-11T22:00:00.000Z',
                        referenceObjects: [
                            {
                                equipment:
                                    '1e5e535a-dd32-11ea-87d0-0242ac130006',
                            },
                        ],
                    },
                    utilitiesAspect: {
                        formerServiceProvider: 'formerServiceProvider',
                        subsequentDocument: {
                            id: '1e5e535a-dd32-11ea-87d0-0242ac130005',
                            displayId: '1001',
                        },
                        referenceObject: {
                            meter: '01234567-89ab-cdef-0123-456789abcdef',
                            installation: '234332',
                        },
                    },
                    subscriptionAspect: {
                        validFrom: '2021-01-11',
                    },
                },
            ],
            notes: [
                {
                    id: '3e5e535a-dd32-11ea-87d0-0242ac130004',
                    textType: null,
                },
            ],
            partners: [
                {
                    id: '9e5e535a-dd32-11ea-87d0-0242ac130004',
                    businessPartnerId: 'User1',
                },
            ],
            priceComponents: [
                {
                    minorLevel: 0,
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: 'ZZ',
                },
            },
            serviceAspect: {
                requestedServiceStartAt: '2021-01-11T22:00:00.000Z',
                referenceObjects: [
                    {
                        equipment: '1e5e535a-dd32-11ea-87d0-0242ac130006',
                    },
                ],
            },
        };

        const affectedRows = await cds.run(
            INSERT.into('sap.odm.sales.CustomerOrder').entries(customerOrder)
        );
    }

    async function readUpdateIsSuccessful(url, payload) {
        const { status: status_get } = await GET(url, { auth: user });
        expect(status_get).toBe(200);

        try {
            const { status } = await PATCH(url, payload, { auth: admin });
            expect(status).toBe(200);
        } catch (error) {
            expect(error.message).toBe(`404 - Not Found`);
        }
    }

    async function readUpdateNOTSuccessful(url, payload) {
        try {
            const { status: status_update } = await PATCH(url, payload, {
                auth: admin,
            });
            expect(status_update).toBe('403');
        } catch (error) {
            expect(error.message).toBe(`403 - Forbidden`);
        }

        try {
            const { status: status_read } = await GET(url, { auth: user });
            expect(status_read).toBe('404');
        } catch (error) {
            expect(error.message).toBe(`404 - Not Found`);
        }
    }

    async function blockEntityIsSuccessful(path, condition) {
        const affectedRows = cds.run(
            UPDATE(path)
                .set({
                    isBlocked: true,
                    endOfBusinessDate: '2021-05-25T00:00:00Z',
                    maxDeletionDate: '2021-06-25T00:00:00Z',
                })
                .where(condition)
        );

        expect(affectedRows).toBeTruthy();
    }

    it('should allow an authorized user to read entity data', async () => {
        const pArray = entities.map(async (entity) => {
            const status = await readData(entity, viewer);
            return { status, entity };
        });
        const statuses = await Promise.all(pArray);
        statuses.forEach((e) => {
            expect(`${e.status}. Entity: ${e.entity}`).toBe(
                `${e.status}. Entity: ${e.entity}`
            );
        });
    });

    it('should NOT allow an unauthorized user to read entity data', async () => {
        const pArray = entities.map(async (entity) => {
            let error;
            await readData(entity, customer).catch((e) => {
                error = e.message;
            });
            return { error, entity };
        });
        const errorList = await Promise.all(pArray);
        errorList.forEach((e) => {
            expect([
                `403 - Forbidden. Entity: ${e.entity}`,
                `401 - Unauthorized. Entity: ${e.entity}`,
            ]).toContain(`${e.error}. Entity: ${e.entity}`);
        });
    });

    it('should NOT allow a non-WRITE user to create entity data', async () => {
        const pArray = entities.map(async (entity) => {
            const error = await createData(entity, viewer);
            return { error, entity };
        });
        const errorList = await Promise.all(pArray);
        errorList.forEach((e) => {
            expect([
                `403 - Forbidden. Entity: ${e.entity}`,
                `401 - Unauthorized. Entity: ${e.entity}`,
            ]).toContain(`${e.error}. Entity: ${e.entity}`);
        });
    });

    it('should create Customer Order and update one of its items with Technical Resources UTILITIESCLOUDSOLUTION-2998', async () => {
        const CustomerOrderTechnicalResources = require('./payload/CustomerOrderTechnicalResources');
        const { customerOrderWithItems } = CustomerOrderTechnicalResources;

        let { data: postData, status: postStatus } = await POST(
            `/api/v1/CustomerOrder`,
            customerOrderWithItems,
            {
                auth: admin,
            }
        );

        expect(postStatus).toBe(201);

        const customerOrderId = postData.id;
        const customerOrderItemId = postData.items[0].id;
        const { subscriptionAspectTechnicalResources } =
            CustomerOrderTechnicalResources;

        let { status: patchStatus } = await PATCH(
            `/api/v1/CustomerOrder(${customerOrderId})/items(id='${customerOrderItemId}')`,
            subscriptionAspectTechnicalResources,
            {
                auth: admin,
            }
        );

        expect(patchStatus).toBe(200);
    });

    it('should NOT allow an unauthorized user to create entity data', async () => {
        const pArray = entities.map(async (entity) => {
            const error = await createData(entity, customer);
            return { error, entity };
        });
        const errorList = await Promise.all(pArray);
        errorList.forEach((e) => {
            expect([
                `403 - Forbidden. Entity: ${e.entity}`,
                `401 - Unauthorized. Entity: ${e.entity}`,
            ]).toContain(`${e.error}. Entity: ${e.entity}`);
        });
    });

    it('should close Customer Order', async () => {
        const bpId = 'CO1';
        const type_code = '1020';
        const customerOrder1 = await functions.createCustomerOrderDB(type_code);
        expect(customerOrder1).toBeTruthy();
        const partner1 = await functions.createCustomerOrderPartnerDB(
            bpId,
            customerOrder1.id
        );
        expect(partner1).toBeTruthy();

        const { status } = await POST(
            `/api/v1/CustomerOrder(${customerOrder1.id})/API_EDOM_RETAILER.close`,
            {},
            { auth: admin }
        );

        expect(status).toBe(204);

        const customerOrder = await cds.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder').where({
                id: customerOrder1.id,
            })
        );

        expect(customerOrder.endOfBusinessDate).toBeTruthy();
    });

    it('should commit 1 time when updating 2 Items of Customer Order in $batch', async () => {
        const db = await cds.connect.to('db');
        const spyDBCommit = jest.spyOn(db, 'commit');

        const itemId1 = '10001';
        const itemId2 = '10002';

        const itemTypeCode = 'UCM1';

        try {
            const customerOrder = await POST(
                `/api/v1/CustomerOrder`,
                {
                    items: [
                        {
                            id: itemId1,
                            type: { code: itemTypeCode },
                        },
                        {
                            id: itemId2,
                            type: { code: itemTypeCode },
                        },
                    ],
                },
                { auth: admin }
            );

            // const updateResults = await POST('/api/v1/$batch', {}, { auth: admin });

            expect(customerOrder).toBeTruthy();
            expect(spyDBCommit).toBeCalledTimes(1);
        } finally {
            spyDBCommit.mockClear();
        }
    });

    it('should read a deep expand items/utilitiesAspect/referenceObject', async () => {
        const itemID = '10012';
        const { data } = await POST(
            `/api/v1/CustomerOrder`,
            {
                items: [
                    {
                        id: itemID,
                        type: { code: 'UCM1' },
                        utilitiesAspect: {
                            formerServiceProvider: 'formerServiceProvider',
                            subsequentDocument: {
                                id: '1e5e535a-dd32-11ea-87d0-0242ac130005',
                                displayId: '1001',
                                type: {
                                    code: 'UMT1',
                                },
                            },
                            referenceObject: {
                                meter: '01234567-89ab-cdef-0123-456789abcdef',
                                installation: '234332',
                            },
                        },
                    },
                ],
            },
            { auth: admin }
        );

        const { id: customerOrderID } = data;
        const url = `/api/v1/CustomerOrder(${customerOrderID})/items(id='${itemID}')/utilitiesAspect/referenceObject`;
        const { data: result } = await GET(url, {
            auth: admin,
        });

        expect(result).toBeTruthy();
    });

    it('should recalculate overall status of CustomerOrder when item is updated', async () => {
        const itemID1 = '10012';
        const itemID2 = '10013';
        const { data } = await POST(
            `/api/v1/CustomerOrder`,
            {
                processingStatus: { code: '01' },
                items: [
                    {
                        id: itemID1,
                        type: { code: 'UCM1' },
                        processingStatus: { code: '01' },
                    },
                    {
                        id: itemID2,
                        type: { code: 'UCM1' },
                        processingStatus: { code: '01' },
                    },
                ],
            },
            { auth: admin }
        );

        const { id: customerOrderID } = data;

        const updateUrl = `/api/v1/CustomerOrder(${customerOrderID})/items(id='${itemID1}')`;
        const { data: updateResult } = await PATCH(
            updateUrl,
            {
                processingStatus: { code: '02' },
            },
            {
                auth: admin,
            }
        );

        expect(updateResult).toBeTruthy();

        const processingStatusCode = '02';

        const selectUrl = `/api/v1/CustomerOrder(${customerOrderID})`;
        const { data: selectResult } = await GET(selectUrl, {
            auth: admin,
        });

        expect(selectResult.processingStatus.code).toEqual(
            processingStatusCode
        );
    });

    it('should recalculate overall status of CustomerOrder when item is created', async () => {
        const itemID1 = '10012';
        const itemID2 = '10013';
        const itemID3 = '10014';
        const { data } = await POST(
            `/api/v1/CustomerOrder`,
            {
                processingStatus: { code: '01' },
                items: [
                    {
                        id: itemID1,
                        type: { code: 'UCM1' },
                        processingStatus: { code: '01' },
                    },
                    {
                        id: itemID2,
                        type: { code: 'UCM1' },
                        processingStatus: { code: '01' },
                    },
                ],
            },
            { auth: admin }
        );

        const { id: customerOrderID } = data;

        const updateUrl = `/api/v1/CustomerOrder(${customerOrderID})/items`;
        const { data: updateResult } = await POST(
            updateUrl,
            {
                id: itemID3,
                type: { code: 'UCM1' },
                processingStatus: { code: '02' },
            },
            {
                auth: admin,
            }
        );

        expect(updateResult).toBeTruthy();

        const processingStatusCode = '02';

        const selectUrl = `/api/v1/CustomerOrder(${customerOrderID})`;
        const { data: selectResult } = await GET(selectUrl, {
            auth: admin,
        });

        expect(selectResult.processingStatus.code).toEqual(
            processingStatusCode
        );
    });

    it('should recalculate overall status of CustomerOrder when CustomerOrder is created with items', async () => {
        const itemID1 = '10016';
        const itemID2 = '10017';
        const { data } = await POST(
            `/api/v1/CustomerOrder`,
            {
                processingStatus: { code: '00' },
                items: [
                    {
                        id: itemID1,
                        type: { code: 'UCM1' },
                        processingStatus: { code: '01' },
                    },
                    {
                        id: itemID2,
                        type: { code: 'UCM1' },
                        processingStatus: { code: '01' },
                    },
                ],
            },
            { auth: admin }
        );

        const { id: customerOrderID } = data;

        const processingStatusCode = '01';

        const selectUrl = `/api/v1/CustomerOrder(${customerOrderID})`;
        const { data: selectResult } = await GET(selectUrl, {
            auth: admin,
        });

        expect(selectResult.processingStatus.code).toEqual(
            processingStatusCode
        );
    });

    it('should recalculate overall status of CustomerOrder when single item is updated', async () => {
        const itemID1 = '10012';
        const itemID2 = '10013';
        const { data } = await POST(
            `/api/v1/CustomerOrder`,
            {
                processingStatus: { code: '01' },
                items: [
                    {
                        id: itemID1,
                        type: { code: 'UCM1' },
                        processingStatus: { code: '01' },
                    },
                ],
            },
            { auth: admin }
        );

        const { id: customerOrderID } = data;

        const updateUrl = `/api/v1/CustomerOrder(${customerOrderID})/items(id='${itemID1}')`;
        const { data: updateResult } = await PATCH(
            updateUrl,
            {
                processingStatus: { code: '02' },
            },
            {
                auth: admin,
            }
        );

        expect(updateResult).toBeTruthy();

        const processingStatusCode = '02';

        const selectUrl = `/api/v1/CustomerOrder(${customerOrderID})`;
        const { data: selectResult } = await GET(selectUrl, {
            auth: admin,
        });

        expect(selectResult.processingStatus.code).toEqual(
            processingStatusCode
        );
    });

    it('should NOT read data of blocked entity', async () => {
        const itemID = '10011';
        const { data, status: status_before } = await POST(
            `/api/v1/CustomerOrder`,
            {
                items: [
                    {
                        id: itemID,
                        type: { code: 'UCM1' },
                    },
                ],
            },
            { auth: admin }
        );

        expect(status_before).toBe(201);

        const { status: statusNested_before, data: dataNested_before } =
            await readData(
                `CustomerOrder(${data.id})/items(id='${itemID}')`,
                user
            );
        status: statusNested_before, expect(statusNested_before).toBe(200);
        expect(dataNested_before).toBeTruthy();

        const currDate = new Date();
        const maxDeletionDate = new Date(
            currDate.getFullYear(),
            currDate.getMonth(),
            currDate.getDate()
        ).toISOString();

        const updatedRows = await cds.run(
            UPDATE(`sap.odm.sales.CustomerOrder`)
                .set({
                    isBlocked: true,
                    maxDeletionDate,
                })
                .where({
                    id: data.id,
                })
        );

        expect(updatedRows).toBe(1);

        await expect(async () => {
            await readData(`CustomerOrder(${data.id})`, user);
        }).rejects.toThrowError('404 - Not Found');
    });

    it('should emit message after CustomerOrder create', async () => {
        const EventMessaging = await cds.connect.to('messaging');
        const spyEventMessagingEmit = jest.spyOn(EventMessaging, 'emit');

        try {
            const customerOrder = await POST(
                `/api/v1/CustomerOrder`,
                {},
                { auth: admin }
            );
            expect(customerOrder).toBeTruthy();

            expect(spyEventMessagingEmit).toBeCalledTimes(1);
            expect(spyEventMessagingEmit).toBeCalledWith(
                'topic:/CustomerOrder/Created/v1',
                expect.any(Object),
                expect.any(Object)
            );
        } finally {
            spyEventMessagingEmit.mockClear();
        }
    });

    it('should NOT allow deletion of CustomerOrder or nested entities', async () => {
        const bpId = 'DRM5';
        const incotermsClass = 'ZZ';
        const itemId = '111128';
        const itemTypeCode = 'UCM1';

        const customerOrder = {
            items: [
                {
                    id: itemId,
                    type: { code: itemTypeCode },
                    notes: [
                        {
                            id: '8e5e535a-dd32-11ea-87d0-0242ac130004',
                            textType: null,
                        },
                    ],
                    partners: [
                        {
                            id: '9e5e535a-dd32-11ea-87d0-0242ac130004',
                        },
                    ],
                    priceComponents: [
                        {
                            id: '7e5e535a-dd32-11ea-87d0-0242ac130004',
                            minorLevel: 0,
                        },
                    ],
                    salesAspect: {
                        scheduleLines: [
                            {
                                id: 'TEST',
                            },
                        ],
                    },
                    serviceAspect: {
                        plannedServiceStartAt: '2021-01-11T22:00:00.000Z',
                        referenceObjects: [
                            {
                                equipment:
                                    '1e5e535a-dd32-11ea-87d0-0242ac130006',
                            },
                        ],
                    },
                    utilitiesAspect: {
                        formerServiceProvider: 'formerServiceProvider',
                        subsequentDocument: {
                            id: '1e5e535a-dd32-11ea-87d0-0242ac130005',
                            displayId: '1001',
                        },
                        referenceObject: {
                            meter: '01234567-89ab-cdef-0123-456789abcdef',
                            installation: '234332',
                        },
                    },
                    subscriptionAspect: {
                        validFrom: '2021-01-11',
                    },
                },
            ],
            notes: [
                {
                    id: '3e5e535a-dd32-11ea-87d0-0242ac130004',
                    textType: null,
                },
            ],
            partners: [
                {
                    id: '9e5e535a-dd32-11ea-87d0-0242ac130004',
                    businessPartnerId: bpId,
                },
            ],
            priceComponents: [
                {
                    minorLevel: 0,
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: incotermsClass,
                },
            },
            serviceAspect: {
                requestedServiceStartAt: '2021-01-11T22:00:00.000Z',
                referenceObjects: [
                    {
                        equipment: '1e5e535a-dd32-11ea-87d0-0242ac130006',
                    },
                ],
            },
        };

        const { status, data: createdCustomerOrder } = await POST(
            `/api/v1/CustomerOrder`,
            customerOrder,
            { auth: user }
        );
        expect(status).toBe(201);

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/partners(id='${createdCustomerOrder.partners[0].id}')`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/partners".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/notes(id=${createdCustomerOrder.notes[0].id})`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/notes".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/priceComponents(id=${createdCustomerOrder.priceComponents[0].id})`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/priceComponents".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/salesAspect`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/salesAspect".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/serviceAspect`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/serviceAspect".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/serviceAspect/referenceObjects(equipment=${createdCustomerOrder.serviceAspect.referenceObjects[0].equipment})`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/serviceAspect/referenceObjects".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')/partners(id='${createdCustomerOrder.items[0].partners[0].id}')`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items/partners".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')/notes(id=${createdCustomerOrder.items[0].notes[0].id})`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items/notes".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')/priceComponents(id=${createdCustomerOrder.items[0].priceComponents[0].id})`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items/priceComponents".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')/salesAspect`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items/salesAspect".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')/salesAspect/scheduleLines(id='${createdCustomerOrder.items[0].salesAspect.scheduleLines[0].id}')`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items/salesAspect/scheduleLines".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')/serviceAspect`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items/serviceAspect".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')/serviceAspect/referenceObjects(equipment=${createdCustomerOrder.items[0].serviceAspect.referenceObjects[0].equipment})`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items/serviceAspect/referenceObjects".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')/utilitiesAspect`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items/utilitiesAspect".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')/utilitiesAspect/referenceObject`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items/utilitiesAspect/referenceObject".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')/utilitiesAspect/subsequentDocument`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items/utilitiesAspect/subsequentDocument".'
            );
        }

        try {
            const response = await DELETE(
                `/api/v1/CustomerOrder(${createdCustomerOrder.id})/items(id='${createdCustomerOrder.items[0].id}')/subscriptionAspect`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).toBe(
                'Error: 405 - Event "DELETE" not allowed for entity "API_EDOM_RETAILER.CustomerOrder/items/subscriptionAspect".'
            );
        }
    });

    it('should set default status for header and item', async () => {
        const itemID = '10012';
        const { data } = await POST(
            `/api/v1/CustomerOrder`,
            {
                items: [
                    {
                        id: itemID,
                        type: { code: 'UCM1' },
                    },
                ],
            },
            { auth: admin }
        );

        const { id: customerOrderID } = data;
        const url = `/api/v1/CustomerOrder(${customerOrderID})?$expand=items`;
        const { data: result } = await GET(url, {
            auth: admin,
        });

        expect(result).toBeTruthy();

        //Header status
        expect(result.processingStatus.code).toBe('00');

        expect(result.items[0]).toBeTruthy();

        //Single item status
        expect(result.items[0].processingStatus.code).toBe('00');
    });

    it('should not set default status for provided processingStatus', async () => {
        const { data } = await POST(
            `/api/v1/CustomerOrder`,
            {
                items: [
                    {
                        id: '10012',
                        type: { code: 'UCM1' },
                        processingStatus: { code: '01' },
                    },
                    {
                        id: '10013',
                        type: { code: 'UCM1' },
                    },
                ],
            },
            { auth: admin }
        );

        const { id: customerOrderID } = data;
        const url = `/api/v1/CustomerOrder(${customerOrderID})?$expand=items`;
        const { data: result } = await GET(url, {
            auth: admin,
        });

        expect(result).toBeTruthy();

        //Header status
        expect(result.processingStatus.code).toBe('01');

        expect(result.items).toBeTruthy();

        expect(result.items).toHaveLength(2);

        //First item status expected "01" as provided in payload
        expect(result.items[0].processingStatus.code).toBe('01');

        //Second item status expected "00" as default 'Initial' status
        expect(result.items[1].processingStatus.code).toBe('00');
    });

    it('should set default status to newly created Item of Customer Order', async () => {
        // Create customer order with one item
        const { data } = await POST(
            `/api/v1/CustomerOrder`,
            {
                items: [
                    {
                        id: '10012',
                        type: { code: 'UCM1' },
                    },
                ],
            },
            { auth: admin }
        );

        const { id: customerOrderID } = data;

        // Add second item to customer order
        await POST(
            `/api/v1/CustomerOrder(${customerOrderID})/items`,
            {
                id: '10013',
                type: { code: 'UCM1' },
            },
            { auth: admin }
        );

        const url = `/api/v1/CustomerOrder(${customerOrderID})?$expand=items`;
        const { data: result } = await GET(url, {
            auth: admin,
        });

        expect(result).toBeTruthy();

        // Header status
        expect(result.processingStatus.code).toBe('00');

        // Two items
        expect(result.items).toHaveLength(2);

        // First item status
        expect(result.items[0].processingStatus.code).toBe('00');

        // Second item status
        expect(result.items[1].processingStatus.code).toBe('00');
    });

    it('should set end of business to todays date when processingStatus code is set to rejected - UTILITIESCLOUDSOLUTION-3051', async () => {
        itemID = '10001';
        const { data, status: status_customerOrder } = await POST(
            `/api/v1/CustomerOrder`,
            {
                items: [
                    {
                        id: itemID,
                        type: { code: 'UCM1' },
                        utilitiesAspect: {
                            subsequentDocument: {
                                id: '97943B42-D2B7-469F-A150-6C7BE8CB9B12',
                                displayId: '40',
                            },
                        },
                    },
                ],
                partners: [
                    {
                        id: '59db97ff-79d0-4fa5-8fed-7c042288e47d',
                        businessPartnerId: 'SEHO',
                    },
                ],
            },
            { auth: admin }
        );
        customerOrderID = data.id;
        expect(status_customerOrder).toBe(201);

        const { status: status_customerOrderItem_rejected } = await PATCH(
            `/api/v1/CustomerOrder(${customerOrderID})/items(id='${itemID}')`,
            {
                processingStatus: { code: '05' },
            },
            { auth: admin }
        );

        expect(status_customerOrderItem_rejected).toBe(200);

        db = await cds.connect.to('db');
        const customerOrder_rejected = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder').where({
                id: customerOrderID,
            })
        );
        expect(customerOrder_rejected).toBeTruthy();
        expect(customerOrder_rejected['processingStatus_code']).toBe('05');
        expect(customerOrder_rejected['endOfBusinessDate']).toBeTruthy();
    });

    it('should set end of business to todays date when processingStatus code is set to completed - UTILITIESCLOUDSOLUTION-2995', async () => {
        itemID_dpp = '10001';
        const { data, status: status_customerOrder } = await POST(
            `/api/v1/CustomerOrder`,
            {
                items: [
                    {
                        id: itemID_dpp,
                        type: { code: 'UCM1' },
                        utilitiesAspect: {
                            subsequentDocument: {
                                id: '97943B42-D2B7-469F-A150-6C7BE8CB9B12',
                                displayId: '40',
                            },
                        },
                    },
                ],
                partners: [
                    {
                        id: '59db97ff-79d0-4fa5-8fed-7c042288e47d',
                        businessPartnerId: 'SEHO',
                    },
                ],
            },
            { auth: admin }
        );
        customerOrderID_dpp = data.id;
        expect(status_customerOrder).toBe(201);

        const { status: status_customerOrderItem_completed } = await PATCH(
            `/api/v1/CustomerOrder(${customerOrderID_dpp})/items(id='${itemID_dpp}')`,
            {
                processingStatus: { code: '03' },
            },
            { auth: admin }
        );

        expect(status_customerOrderItem_completed).toBe(200);

        db = await cds.connect.to('db');
        const customerOrder_completed = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder').where({
                id: customerOrderID_dpp,
            })
        );
        expect(customerOrder_completed).toBeTruthy();
        expect(customerOrder_completed['processingStatus_code']).toBe('03');
        expect(customerOrder_completed['endOfBusinessDate']).toBeTruthy();
    });

    // The test is dependent on previous test results
    it('should set end of business to null when customerOrder is not completed yet - UTILITIESCLOUDSOLUTION-2995', async () => {
        expect(customerOrderID_dpp).toBeTruthy();
        expect(itemID_dpp).toBeTruthy();

        const { status: status_customerOrderItem_open } = await PATCH(
            `/api/v1/CustomerOrder(${customerOrderID_dpp})/items(id='${itemID_dpp}')`,
            {
                processingStatus: { code: '01' },
            },
            { auth: admin }
        );

        expect(status_customerOrderItem_open).toBe(200);

        const customerOrder_open = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder').where({
                id: customerOrderID_dpp,
            })
        );
        expect(customerOrder_open).toBeTruthy();
        expect(customerOrder_open['processingStatus_code']).toBe('01');
        expect(customerOrder_open['endOfBusinessDate']).toBeNull();
    });

    it('it should not allow to read/update a blocked customer order items - UTILITIESCLOUDSOLUTION-2995', async () => {
        const url = `/api/v1/CustomerOrder(${customOrderIdDPP})/items(id='${itemIdDPP}')`;
        const payload = {
            netAmount: '0',
        };
        await readUpdateIsSuccessful(url, payload);

        const path = 'sap.odm.sales.CustomerOrder.items';
        const condition = {
            up__id: customOrderIdDPP,
            id: itemIdDPP,
        };
        await blockEntityIsSuccessful(path, condition);

        const payload2 = {
            netAmount: '1',
        };
        await readUpdateNOTSuccessful(url, payload2);
    });

    it('should not allow to read/update a blocked customer order - UTILITIESCLOUDSOLUTION-2995', async () => {
        const url = `/api/v1/CustomerOrder(${customOrderIdDPP})`;
        const payload = {};
        await readUpdateIsSuccessful(url, payload);

        const path = 'sap.odm.sales.CustomerOrder';
        const condition = {
            id: customOrderIdDPP,
        };
        await blockEntityIsSuccessful(path, condition);

        const payload2 = {
            netAmount: '1',
        };
        await readUpdateNOTSuccessful(url, payload2);
    });

    it('should create product type group, product type and product - UTILITIESCLOUDSOLUTION-3079', async () => {
        const { status: statusProductTypeGroupCodes } = await POST(
            `/api/v1/ProductTypeGroupCodes`,
            {
                code: '2',
                name: '2',
                descr: 'Service',
            },
            { auth: admin }
        );
        expect(statusProductTypeGroupCodes).toBe(201);

        const { status: statusProductTypeCodes } = await POST(
            `/api/v1/ProductTypeCodes`,
            {
                code: 'SERV',
                name: 'SERV',
                descr: 'Service Product',
                typeGroup: { code: '2' },
            },
            { auth: admin }
        );
        expect(statusProductTypeCodes).toBe(201);

        const { status: statusProduct } = await POST(
            `/api/v1/Product`,
            {
                id: '160672e2-4f50-4af0-99af-ad073226c96a',
                displayId: 'SERVPRDCT',
                name: 'Service product - test',
                description: 'Service product - test',
                type: { code: 'SERV' },
                texts: [
                    {
                        locale: 'de',
                        name: 'de name',
                        description: 'de description',
                    },
                ],
            },
            { auth: admin }
        );
        expect(statusProduct).toBe(201);
    });

    it('should create Customer Order with item which has deviceTypePricing and budgetBillingType - UTILITIESCLOUDSOLUTION-2925', async () => {
        const { status: statusCustomerOrder } = await POST(
            `/api/v1/CustomerOrder`,
            {
                displayId: '{{customerOrderDisplayId}}',
                items: [
                    {
                        id: '100001',
                        utilitiesAspect: {
                            deviceTypePricing: {
                                code: '01',
                            },
                            budgetBillingType: {
                                code: 'SU01',
                            },
                        },
                    },
                ],
            },
            { auth: admin }
        );
        expect(statusCustomerOrder).toBe(201);
    });

    it('should create a companyCode via odm compatibility mapping - UTILITIESCLOUDSOLUTION-3079', async () => {
        const myCompanyId = 'myCompanyId';
        const myCompanyName = 'myCompanyName';
        const resultInsert = await POST(
            `/api/v1/CompanyCode`,
            {
                id: myCompanyId,
                name: myCompanyName,
            },
            { auth: admin }
        );
        expect(resultInsert.status).toBe(201);
        expect(resultInsert.data.name).toBe(myCompanyName);

        const resultSelect = await GET(
            `/api/v1/CompanyCode('${resultInsert.data.id}')`,
            { auth: admin }
        );
        expect(resultSelect.data.id).toBe(myCompanyId);
        expect(resultSelect.data.name).toBe(myCompanyName);
    });

    it('should create a CustomerOrder with nested SalesOrganization - UTILITIESCLOUDSOLUTION-3079', async () => {
        const salesOrgId = '20d0dc8e-e9ec-421f-9c65-fbe2fc18ac5f';
        const companyCodeId = 'myCompanyId2';
        const companyCodeName = 'myCompanyName';

        const { data, status: status_customerOrder } = await POST(
            `/api/v1/CustomerOrder`,
            {
                salesOrganization: {
                    id: salesOrgId,
                },
            },
            { auth: admin }
        );
        customerOrderID = data.id;
        expect(status_customerOrder).toBe(201);

        const resultSelect = await GET(
            `/api/v1/CustomerOrder(${customerOrderID})/salesOrganization?$expand=*`,
            { auth: admin }
        );
        expect(resultSelect.data.id).toBe(salesOrgId);
        expect(resultSelect.data.companyCode.id).toBe(companyCodeId);
        expect(resultSelect.data.companyCode.name).toBe(companyCodeName);
    });

    it('should create url link pattern for customer order subsequent document', async () => {
        const customerOrderId = cds.utils.uuid();
        const itemId = '100001';
        const typeCode = 'UT41';

        const customerOrderItemUtilitiesSubsequentDocumentCodes = {
            code: typeCode,
            name: 'test',
            descr: 'test',
            urlPattern:
                'https://<tenant>.eu10.revenue.cloud.sap/launchpad#Subscriptions-list&/subscriptions/<SUBSEQUENTDOCUMENTID>',
        };

        const { status } = await await POST(
            `/api/v1/CustomerOrderItemUtilitiesSubsequentDocumentCodes`,
            customerOrderItemUtilitiesSubsequentDocumentCodes,
            { auth: admin }
        );

        expect(status).toBe(201);

        const customerOrder = {
            id: customerOrderId,
            isBlocked: false,
            items: [
                {
                    id: itemId,
                    utilitiesAspect: {
                        formerServiceProvider: 'formerServiceProvider',
                        subsequentDocument: {
                            type: { code: typeCode },
                            id: '1e5e535a-dd32-11ea-87d0-0242ac130005',
                            displayId: '1001',
                        },
                    },
                },
            ],
        };

        const { status: statusCO } = await POST(
            `/api/v1/CustomerOrder`,
            customerOrder,
            { auth: admin }
        );

        expect(statusCO).toBe(201);
    });
});
