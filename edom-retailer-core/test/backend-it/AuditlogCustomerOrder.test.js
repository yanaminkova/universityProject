const cds = require('@sap/cds');
const { expect, launchServer } = require('../lib/testkit');
const logger = require('cf-nodejs-logging-support');

describe('AuditlogCustomerOrder.test', () => {
    const config = {
        VCAP_SERVICES: {
            auditlog: [
                {
                    name: 'edom-retailer-audit',
                    instance_name: 'edom-retailer-audit',
                    label: 'auditlog',
                    tags: ['auditlog'],
                    credentials: {
                        logToConsole: true,
                    },
                },
            ],
        },
        service: {
            paths: ['srv/api', 'srv/api/businesspartner'],
        },
    };

    const { POST, PUT, PATCH, DELETE, admin } = launchServer(config);
    let productId1 = '8d8fa53f-1a96-4794-a9d7-7165a22455d1';
    let productId2 = '9412ad92-40f7-42d5-8973-10624b8f33e2';
    let customerOrderId;
    let itemId;

    const log = jest.fn();

    global.console.log = log;

    beforeAll(async () => {
        const subsequentDocumentTypePayload = {
            name: 'Subsequent document',
            descr: 'Subsequent document type for test',
            code: '1002',
        };

        try {
            var { status } = await POST(
                `/api/v1/CustomerOrderItemUtilitiesSubsequentDocumentCodes`,
                subsequentDocumentTypePayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(status).to.eql(201); // Created

        const { status: status_typeCode } = await POST(
            `/api/v1/CustomerOrderItemTypeCodes`,
            {
                code: '1001',
                name: 'test',
            },
            { auth: admin }
        );

        expect(status_typeCode).to.eql(201);

        const productPayload = {
            id: productId1,
            displayId: '1001',
            name: 'Green Stream Bundle',
        };

        const { status: status_product, data: product } = await POST(
            `/api/v1/Product`,
            productPayload,
            { auth: admin }
        );
        expect(status_product).to.eql(201);
        expect(product).to.exist;
        expect(product.id).to.eql(productId1);

        const productPayload2 = {
            id: productId2,
            displayId: '1001',
            name: 'Green Stream Bundle',
        };

        const { status: status_product_second, data: productSecond } =
            await POST(`/api/v1/Product`, productPayload2, { auth: admin });
        expect(status_product_second).to.eql(201);
        expect(productSecond).to.exist;
        expect(productSecond.id).to.eql(productId2);
    });

    beforeEach(async () => {
        log.mockReset();
    });

    afterAll(() => {
        log.mockClear();
    });

    /* --------------Create Audit Logging-------------- */

    // Test for creating CustomerOrder only

    it('should log for Audit -> CREATE flat CustomerOrder', async () => {
        const customerOrderDataPayload = {
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130004',
            isExternallyPriced: null,
            partners: [
                {
                    id: '59db97ff-79d0-4fa5-8fed-7c042288e47d',
                    businessPartnerId: 'PEPE',
                },
            ],
        };
        try {
            var { data } = await POST(
                `/api/v1/CustomerOrder`,
                customerOrderDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(data).to.exist;
        customerOrderId = data.id;
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'API_EDOM_RETAILER.CustomerOrder'
        );
        expect(auditLogMessage.attributes.length).to.eql(4);

        expect(auditLogMessage.attributes[0].name).to.eql('id');

        expect(auditLogMessage.attributes[1].name).to.eql(
            'customerReferenceId'
        );
        expect(auditLogMessage.attributes[1].new).to.eql(
            '8e5e535a-dd32-11ea-87d0-0242ac130004'
        );

        expect(auditLogMessage.attributes[2].name).to.eql('partners[0].id');
        expect(auditLogMessage.attributes[2].new).to.eql(
            '59db97ff-79d0-4fa5-8fed-7c042288e47d'
        );

        expect(auditLogMessage.attributes[3].name).to.eql(
            'partners[0].businessPartnerId'
        );
        expect(auditLogMessage.attributes[3].new).to.eql('PEPE');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql('PEPE');

        expect(auditLogMessage.object.id.key).to.exist;
    });

    // Test for creating CustomerOrder with Items

    it('should log for Audit -> CREATE CustomerOrder with Items ', async () => {
        const customerOrderDataPayload = {
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130004',
            isExternallyPriced: null,
            items: [
                {
                    id: '100001',
                    type: {
                        code: '1001',
                    },
                    utilitiesAspect: {
                        formerServiceProvider: 'formerServiceProvider',
                    },
                },
            ],
            partners: [
                {
                    id: '59db97ff-79d0-4fa5-8fed-7c042288e47d',
                    businessPartnerId: 'SEHO',
                },
            ],
        };
        try {
            var { data } = await POST(
                `/api/v1/CustomerOrder`,
                customerOrderDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }
        itemId = data.items[0].id;
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'API_EDOM_RETAILER.CustomerOrder'
        );
        expect(auditLogMessage.attributes.length).to.eql(5);

        expect(auditLogMessage.attributes[0].name).to.eql('id');

        expect(auditLogMessage.attributes[1].name).to.eql(
            'customerReferenceId'
        );
        expect(auditLogMessage.attributes[1].new).to.eql(
            '8e5e535a-dd32-11ea-87d0-0242ac130004'
        );

        expect(auditLogMessage.attributes[4].name).to.eql('items[0].id');
        expect(auditLogMessage.attributes[4].new).to.eql('100001');

        expect(auditLogMessage.attributes[2].name).to.eql('partners[0].id');
        expect(auditLogMessage.attributes[2].new).to.eql(
            '59db97ff-79d0-4fa5-8fed-7c042288e47d'
        );

        expect(auditLogMessage.attributes[3].name).to.eql(
            'partners[0].businessPartnerId'
        );
        expect(auditLogMessage.attributes[3].new).to.eql('SEHO');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql('SEHO');

        expect(auditLogMessage.object.id.key).to.exist;
    });

    // Test for creating CustomerOrder with Products

    it('should log for Audit -> CREATE CustomerOrder with Products', async () => {
        const customerOrderDataPayload = {
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130004',
            isExternallyPriced: null,
            items: [
                {
                    id: '100001',
                    type: {
                        code: '1001',
                    },
                    product: { id: productId1 },
                },
                {
                    id: '100002',
                    parentItemId: '100001',
                    type: {
                        code: '1001',
                    },
                    product: { id: productId2 },
                },
            ],
            partners: [
                {
                    id: '59db97ff-79d0-4fa5-8fed-7c042288e47d',
                    businessPartnerId: 'SEHO',
                },
            ],
        };

        try {
            var { data } = await POST(
                `/api/v1/CustomerOrder`,
                customerOrderDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'API_EDOM_RETAILER.CustomerOrder'
        );
        expect(auditLogMessage.attributes.length).to.eql(7);

        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].new).to.eql(data.id);

        expect(auditLogMessage.attributes[1].name).to.eql(
            'customerReferenceId'
        );
        expect(auditLogMessage.attributes[1].new).to.eql(
            '8e5e535a-dd32-11ea-87d0-0242ac130004'
        );

        expect(auditLogMessage.attributes[4].name).to.eql('items[0].id');
        expect(auditLogMessage.attributes[4].new).to.eql('100001');

        expect(auditLogMessage.attributes[5].name).to.eql('items[1].id');
        expect(auditLogMessage.attributes[5].new).to.eql('100002');
        expect(auditLogMessage.attributes[6].name).to.eql(
            'items[1].parentItemId'
        );
        expect(auditLogMessage.attributes[6].new).to.eql('100001');

        expect(auditLogMessage.attributes[2].name).to.eql('partners[0].id');
        expect(auditLogMessage.attributes[2].new).to.eql(
            '59db97ff-79d0-4fa5-8fed-7c042288e47d'
        );

        expect(auditLogMessage.attributes[3].name).to.eql(
            'partners[0].businessPartnerId'
        );
        expect(auditLogMessage.attributes[3].new).to.eql('SEHO');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql('SEHO');

        expect(auditLogMessage.object.id.key).to.exist;
    });

    // Test for creating CustomerOrder with Subsequent Document Codes
    it('should log for Audit -> CREATE CustomerOrder with Subsequent Document Codes', async () => {
        const customerOrderDataPayload = {
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130004',
            isExternallyPriced: null,
            items: [
                {
                    id: '100001',
                    type: {
                        code: '1001',
                    },
                    utilitiesAspect: {
                        formerServiceProvider: 'formerServiceProvider',
                        subsequentDocument: {
                            id: '1e5e535a-dd32-11ea-87d0-0242ac130005',
                            displayId: '1001',
                            type: {
                                code: '1002',
                            },
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
        };

        try {
            var { data } = await POST(
                `/api/v1/CustomerOrder`,
                customerOrderDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'API_EDOM_RETAILER.CustomerOrder'
        );
        expect(auditLogMessage.attributes.length).to.eql(7);

        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].new).to.eql(data.id);
        expect(auditLogMessage.attributes[1].name).to.eql(
            'customerReferenceId'
        );
        expect(auditLogMessage.attributes[1].new).to.eql(
            '8e5e535a-dd32-11ea-87d0-0242ac130004'
        );

        expect(auditLogMessage.attributes[4].name).to.eql('items[0].id');
        expect(auditLogMessage.attributes[4].new).to.eql('100001');

        expect(auditLogMessage.attributes[5].name).to.eql(
            'items[0].utilitiesAspect.subsequentDocument.id'
        );
        expect(auditLogMessage.attributes[6].name).to.eql(
            'items[0].utilitiesAspect.subsequentDocument.displayId'
        );
        expect(auditLogMessage.attributes[6].new).to.eql('1001');

        expect(auditLogMessage.attributes[2].name).to.eql('partners[0].id');
        expect(auditLogMessage.attributes[2].new).to.eql(
            '59db97ff-79d0-4fa5-8fed-7c042288e47d'
        );

        expect(auditLogMessage.attributes[3].name).to.eql(
            'partners[0].businessPartnerId'
        );
        expect(auditLogMessage.attributes[3].new).to.eql('SEHO');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql('SEHO');

        expect(auditLogMessage.object.id.key).to.exist;
    });

    /* --------------Update Audit Logging-------------- */

    // Test for updating CustomerOrder only

    it('should log for Audit -> UPDATE CustomerOrder PUT ', async () => {
        const customerOrderDataPayload = {
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-9242ac130999',
        };
        expect(customerOrderId).to.exist;
        try {
            var { status: CustomerOrderUtilitiesStatus, data } = await PUT(
                `/api/v1/CustomerOrder(${customerOrderId})`,
                customerOrderDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(CustomerOrderUtilitiesStatus).to.eql(200);
        expect(data).to.exist;
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'API_EDOM_RETAILER.CustomerOrder'
        );
        expect(auditLogMessage.attributes.length).to.eql(2);

        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].new).to.eql(data.id);

        expect(auditLogMessage.attributes[1].name).to.eql(
            'customerReferenceId'
        );
        expect(auditLogMessage.attributes[1].new).to.eql(
            '8e5e535a-dd32-11ea-87d0-9242ac130999'
        );
        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql('PEPE');
    });

    it('should log for Audit -> UPDATE CustomerOrder PATCH ', async () => {
        const customerOrderDataPayload = {
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130944',
        };

        try {
            var { status: CustomerOrderUtilitiesStatus, data } = await PATCH(
                `/api/v1/CustomerOrder(${customerOrderId})`,
                customerOrderDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(CustomerOrderUtilitiesStatus).to.eql(200);
        expect(data).to.exist;
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'API_EDOM_RETAILER.CustomerOrder'
        );
        expect(auditLogMessage.attributes.length).to.eql(2);

        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].new).to.eql(data.id);

        expect(auditLogMessage.attributes[1].name).to.eql(
            'customerReferenceId'
        );
        expect(auditLogMessage.attributes[1].new).to.eql(
            '8e5e535a-dd32-11ea-87d0-0242ac130944'
        );
        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql('PEPE');
    });

    // Test for updating CustomerOrder only

    it('should log for Audit -> UPDATE CustomerOrder with Items PUT ', async () => {
        const customerOrderItemsDataPayload = {
            id: '100002',
        };
        expect(customerOrderId).to.exist;
        expect(itemId).to.exist;

        try {
            var { status: CustomerOrderUtilitiesStatus, data } = await PUT(
                `/api/v1/CustomerOrder(${customerOrderId})/items(id='${itemId}')`,
                customerOrderItemsDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        // expect(CustomerOrderUtilitiesStatus).to.eql(200);
        expect(data).to.exist;
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'API_EDOM_RETAILER.CustomerOrderItems'
        );
        expect(auditLogMessage.attributes.length).to.eql(1);

        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].new).to.eql('100001');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql('PEPE');
    });

    it('should log for Audit -> UPDATE CustomerOrder with Items PATCH ', async () => {
        const customerOrderItemsDataPayload = {
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130999',
        };

        try {
            var { status: CustomerOrderUtilitiesStatus, data } = await PATCH(
                `/api/v1/CustomerOrder(${customerOrderId})/items(id='${itemId}')`,
                customerOrderItemsDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(CustomerOrderUtilitiesStatus).to.eql(200);
        expect(data).to.exist;
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'API_EDOM_RETAILER.CustomerOrderItems'
        );
        expect(auditLogMessage.attributes.length).to.eql(2);
        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].new).to.eql(data.id);

        expect(auditLogMessage.attributes[1].name).to.eql(
            'customerReferenceId'
        );
        expect(auditLogMessage.attributes[1].new).to.eql(
            '8e5e535a-dd32-11ea-87d0-0242ac130999'
        );

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql('PEPE');
    });

    it('should log for Audit Patch request-> UPDATE CustomerOrder with displayId (PATCH)', async () => {
        const customerOrderDataPayload = {
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130004',
            isExternallyPriced: null,
            partners: [
                {
                    id: '59db97ff-79d0-4fa5-8fed-7c042288e47d',
                    businessPartnerId: 'PEPE',
                },
            ],
            items: [
                {
                    id: '100001',
                    type: {
                        code: '1001',
                    },
                    utilitiesAspect: {
                        formerServiceProvider: 'formerServiceProvider',
                        subsequentDocument: {
                            id: '1e5e535a-dd32-11ea-87d0-0242ac130005',
                            displayId: '1001',
                            type: {
                                code: '1002',
                            },
                        },
                    },
                },
            ],
        };

        try {
            var { data } = await POST(
                `/api/v1/CustomerOrder`,
                customerOrderDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        // update displayId
        const subsequentDocumentIdPayload = {
            displayId: '1005',
        };

        try {
            var { status } = await PATCH(
                `/api/v1/CustomerOrder(${data.id})/items(id='${data.items[0].id}')/utilitiesAspect/subsequentDocument`,
                subsequentDocumentIdPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(status).to.eql(200); //updated

        const auditLogMessage = log.mock.calls[3][0];

        expect(auditLogMessage.object.type).to.eql(
            'API_EDOM_RETAILER.CustomerOrderItemUtilitiesSubsequentDocument'
        );
        expect(auditLogMessage.attributes[0].name).to.eql('displayId');
        expect(auditLogMessage.attributes[0].new).to.eql('1005');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql('PEPE');
    });

    it('should log for Audit PUT Request -> UPDATE CustomerOrder with displayId (PUT)', async () => {
        const customerOrderDataPayload = {
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130004',
            isExternallyPriced: null,
            partners: [
                {
                    id: '59db97ff-79d0-4fa5-8fed-7c042288e47d',
                    businessPartnerId: 'PEPE',
                },
            ],
            items: [
                {
                    id: '100001',
                    type: {
                        code: '1001',
                    },
                    utilitiesAspect: {
                        formerServiceProvider: 'formerServiceProvider',
                        subsequentDocument: {
                            id: '1e5e535a-dd32-11ea-87d0-0242ac130005',
                            displayId: '1001',
                            type: {
                                code: '1002',
                            },
                        },
                    },
                },
            ],
        };

        try {
            var { data } = await POST(
                `/api/v1/CustomerOrder`,
                customerOrderDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        // update displayId
        const subsequentDocumentIdPayload = {
            displayId: '1005',
        };

        try {
            var { status } = await PUT(
                `/api/v1/CustomerOrder(${data.id})/items(id='${data.items[0].id}')/utilitiesAspect/subsequentDocument`,
                subsequentDocumentIdPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(status).to.eql(200); //updated

        const auditLogMessage = log.mock.calls[3][0];
        expect(auditLogMessage.attributes[0].name).to.eql('displayId');
        expect(auditLogMessage.attributes[0].new).to.eql('1005');
        expect(auditLogMessage.attributes[0].old).to.eql('-');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql('PEPE');
    });

    it.skip('should log for Audit -> DELETE CustomerOrder ', async () => {
        const { status: status_create, data: data_create } = await POST(
            `/api/v1/CustomerOrder`,
            {
                customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130004',
                partners: [
                    {
                        id: '59db97ff-79d0-4fa5-8fed-7c042288e47d',
                        businessPartnerId: 'PEPE',
                    },
                ],
                items: [
                    {
                        id: '100001',
                        type: {
                            code: '1001',
                        },
                        utilitiesAspect: {
                            formerServiceProvider: 'formerServiceProvider',
                            subsequentDocument: {
                                id: '1e5e535a-dd32-11ea-87d0-0242ac130005',
                                displayId: '1001',
                                type: {
                                    code: '1002',
                                },
                            },
                        },
                    },
                ],
            },
            { auth: admin }
        );

        expect(status_create).to.eql(201);

        const { status: status_delete } = await DELETE(
            `/api/v1/CustomerOrder(${data_create.id})`,
            {
                auth: admin,
            }
        );

        expect(status_delete).to.eql(204);

        const auditLogMessage = log.mock.calls[2][0];

        expect(auditLogMessage.object.type).to.eql(
            'API_EDOM_RETAILER.CustomerOrder'
        );

        expect(auditLogMessage.attributes.length).to.eql(7);

        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].old).to.eql(data_create.id);

        expect(auditLogMessage.attributes[1].name).to.eql(
            'customerReferenceId'
        );
        expect(auditLogMessage.attributes[1].old).to.eql(
            data_create.customerReferenceId
        );

        expect(auditLogMessage.attributes[2].name).to.eql('items[0].id');
        expect(auditLogMessage.attributes[2].old).to.eql(
            data_create.items[0].id
        );

        expect(auditLogMessage.attributes[3].name).to.eql(
            'items[0].utilitiesAspect.subsequentDocument.id'
        );
        expect(auditLogMessage.attributes[3].old).to.eql(
            data_create.items[0].utilitiesAspect.subsequentDocument.id
        );

        expect(auditLogMessage.attributes[4].name).to.eql(
            'items[0].utilitiesAspect.subsequentDocument.displayId'
        );
        expect(auditLogMessage.attributes[4].old).to.eql(
            data_create.items[0].utilitiesAspect.subsequentDocument.displayId
        );

        expect(auditLogMessage.attributes[5].name).to.eql('partners[0].id');
        expect(auditLogMessage.attributes[5].old).to.eql(
            data_create.partners[0].id
        );

        expect(auditLogMessage.attributes[6].name).to.eql(
            'partners[0].businessPartnerId'
        );
        expect(auditLogMessage.attributes[6].old).to.eql(
            data_create.partners[0].businessPartnerId
        );

        expect(auditLogMessage.attributes[6].old).to.eql(
            data_create.partners[0].businessPartnerId
        );

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        // The audit log cannot identify the data subject for the delete event handler
        // because the data has already been deleted from the database.
        expect(auditLogMessage.data_subject.id.value).to.eql('-');
    });
});
