const { launchServer, req } = require('../lib/testkit');
const logger = require('cf-nodejs-logging-support');
const { TextBundle } = require('@sap/textbundle');
const expect = require('expect');
const cds = require('@sap/cds');
const e = require('express');
const bundle = new TextBundle('../../_i18n/i18n', ' ');

describe('ConfigurationService ODATA Test UTILITIESCLOUDSOLUTION-2969', () => {
    let entities = [];

    const customer = {
        username: 'customer',
        password: 'customer',
    };

    let itemID;

    const { GET, PATCH, POST, PUT, admin, viewer } = launchServer({
        service: {
            paths: [
                'srv/api/ConfigurationService',
                'srv/api/API_EDOM_RETAILER',
            ],
        },
    });

    const systemWithNoStatusMapping = '/eu10/sap.mm.sb';

    const spyLoggerInfo = jest.spyOn(logger, 'info');
    const spyLoggerError = jest.spyOn(logger, 'error');

    before(async () => {
        db = await cds.connect.to('db');

        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('ConfigurationService')
        ).filter(
            (value) => !value['@cds.autoexposed'] && !value.elements['up_']
        );

        Array.from(serviceEntities).forEach((element) => {
            const { name } = element;
            entities.push(name.substring(name.indexOf('.') + 1, name.length));
        });

        const { status: SalesProcessingStatusCodes0 } = await POST(
            `/api/v1/SalesProcessingStatusCodes`,
            {
                code: '00',
                name: 'Initial',
            },
            { auth: admin }
        );

        expect(SalesProcessingStatusCodes0).toBe(201);

        const { status: SalesProcessingStatusCodes1 } = await POST(
            `/api/v1/SalesProcessingStatusCodes`,
            {
                code: '01',
                name: 'Open',
            },
            { auth: admin }
        );
        expect(SalesProcessingStatusCodes1).toBe(201);

        const { status: SalesProcessingStatusCodes3 } = await POST(
            `/api/v1/SalesProcessingStatusCodes`,
            {
                code: '03',
                name: 'Completed',
            },
            { auth: admin }
        );
        expect(SalesProcessingStatusCodes3).toBe(201);

        const { status: SalesProcessingStatusCodes4 } = await POST(
            `/api/v1/SalesProcessingStatusCodes`,
            {
                code: '04',
                name: 'Canceled',
            },
            { auth: admin }
        );

        expect(SalesProcessingStatusCodes4).toBe(201);

        const { status: SalesProcessingStatusCodes7 } = await POST(
            `/api/v1/SalesProcessingStatusCodes`,
            {
                code: '07',
                name: 'Active',
            },
            { auth: admin }
        );

        expect(SalesProcessingStatusCodes7).toBe(201);

        const { status: SalesProcessingStatusCodes9 } = await POST(
            `/api/v1/SalesProcessingStatusCodes`,
            {
                code: '09',
                name: 'In Termination',
            },
            { auth: admin }
        );

        expect(SalesProcessingStatusCodes9).toBe(201);

        const { status: SalesProcessingStatusCodes10 } = await POST(
            `/api/v1/SalesProcessingStatusCodes`,
            {
                code: '10',
                name: 'Terminated',
            },
            { auth: admin }
        );

        expect(SalesProcessingStatusCodes10).toBe(201);

        const { status: CustomerOrderUtilitiesStatusSourceSystems1 } =
            await POST(
                `/api/v1/config/CustomerOrderUtilitiesStatusSourceSystems`,
                {
                    sourceSystemId: '/eu10/sap.billing.sb',
                    destination:
                        'https://edom-retailer-dev.eu10cf.applicationstudio.cloud.sap/',
                    path: '/api/status',
                    statusPath: 'data/subscription/status',
                },
                { auth: admin }
            );

        expect(CustomerOrderUtilitiesStatusSourceSystems1).toBe(201);

        const { status: CustomerOrderUtilitiesStatusSourceSystems2 } =
            await POST(
                `/api/v1/config/CustomerOrderUtilitiesStatusSourceSystems`,
                {
                    sourceSystemId: systemWithNoStatusMapping,
                    destination:
                        'https://edom-retailer-dev.eu10cf.applicationstudio.cloud.sap/',
                    path: '/api/status',
                    statusPath: 'data/subscription/status',
                },
                { auth: admin }
            );

        expect(CustomerOrderUtilitiesStatusSourceSystems2).toBe(201);

        const { status: CustomerOrderUtilitiesStatusMappingTypeCodes } =
            await POST(
                `/api/v1/config/CustomerOrderUtilitiesStatusMappingTypeCodes`,
                {
                    code: '01',
                    name: 'EM',
                },
                { auth: admin }
            );

        expect(CustomerOrderUtilitiesStatusMappingTypeCodes).toBe(201);

        const { status: CustomerOrderUtilitiesStatusMapping1 } = await POST(
            `/api/v1/config/CustomerOrderUtilitiesStatusMapping`,
            {
                sourceSystem: { sourceSystemId: '/eu10/sap.billing.sb' },
                sourceSystemStatus: 'Canceled',
                processingStatus: { code: '09' },
                type: { code: '01' },
            },
            { auth: admin }
        );

        expect(CustomerOrderUtilitiesStatusMapping1).toBe(201);

        const { status: CustomerOrderUtilitiesStatusMapping2 } = await POST(
            `/api/v1/config/CustomerOrderUtilitiesStatusMapping`,
            {
                sourceSystem: { sourceSystemId: '/eu10/sap.billing.sb' },
                sourceSystemStatus: 'Active',
                processingStatus: { code: '07' },
                type: { code: '01' },
            },
            { auth: admin }
        );

        expect(CustomerOrderUtilitiesStatusMapping2).toBe(201);

        const { status: CustomerOrderUtilitiesStatusMapping3 } = await POST(
            `/api/v1/config/CustomerOrderUtilitiesStatusMapping`,
            {
                sourceSystem: { sourceSystemId: '/eu10/sap.billing.sb' },
                sourceSystemStatus: 'Expired',
                processingStatus: { code: '03' },
                type: { code: '01' },
            },
            { auth: admin }
        );

        expect(CustomerOrderUtilitiesStatusMapping3).toBe(201);

        const { status: statusCustomerOrderItemTypeCodes } = await POST(
            `/api/v1/CustomerOrderItemTypeCodes`,
            {
                code: 'UCM1',
                name: 'test',
            },
            { auth: admin }
        );

        expect(statusCustomerOrderItemTypeCodes).toBe(201);

        itemID = '10012';
        const { data, status: status_customerOrder } = await POST(
            `/api/v1/CustomerOrder`,
            {
                items: [
                    {
                        id: itemID,
                        type: { code: 'UCM1' },
                        processingStatus: { code: '00' },
                        utilitiesAspect: {
                            subsequentDocument: {
                                id: '97943B42-D2B7-469F-A150-6C7BE8CB9B10',
                                displayId: '30',
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
    });

    beforeEach(() => {
        spyLoggerInfo.mockReset();
        spyLoggerError.mockReset();
    });

    afterEach(() => {
        spyLoggerInfo.mockReset();
        spyLoggerError.mockReset();
    });

    async function readData(entity, user) {
        try {
            const { status, data } = await GET(`/api/v1/config/${entity}`, {
                auth: user,
            });
            return { status, data };
        } catch (error) {
            return error.message;
        }
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
            const error = await readData(entity, customer);
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

    it('should allow to update SalesProcessingStatusCodes for authorized user', async () => {
        const { status: SalesProcessingStatusCodes } = await PUT(
            `/api/v1/SalesProcessingStatusCodes('01')`,
            {
                name: 'Close',
                descr: 'Close ...',
            },
            { auth: admin }
        );

        expect(SalesProcessingStatusCodes).toBe(200);
    });

    it('should allow to update CustomerOrderUtilitiesStatusSourceSystems for authorized user', async () => {
        const { status: CustomerOrderUtilitiesStatusSourceSystems } = await PUT(
            `/api/v1/config/CustomerOrderUtilitiesStatusSourceSystems(sourceSystemId='us10.c4u.billing')`,
            {
                destination: '',
                path: '/api/status/',
                statusPath: 'data/items[*]/status/updated',
            },
            { auth: admin }
        );

        expect(CustomerOrderUtilitiesStatusSourceSystems).toBe(200);
    });

    it('should allow to update CustomerOrderUtilitiesStatusMappingTypeCodes for authorized user', async () => {
        const { status: CustomerOrderUtilitiesStatusMappingTypeCodes } =
            await PUT(
                `/api/v1/config/CustomerOrderUtilitiesStatusMappingTypeCodes('01')`,
                {
                    name: 'OData',
                },
                { auth: admin }
            );

        expect(CustomerOrderUtilitiesStatusMappingTypeCodes).toBe(200);
    });

    it('should not receive message with non-existing subscriptionId', async () => {
        const subscriptionBillingMessaging = await cds.connect.to(
            'subscriptionBillingMessaging'
        );

        const {
            event,
            data: baseData,
            headers,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_canceled_v1.json');

        const data = JSON.parse(JSON.stringify(baseData));

        data.subscriptionId = '0';

        const result = await subscriptionBillingMessaging
            .transaction(req)
            .emit(event, data, headers)
            .catch((e) => {
                expect(e.message).toContain(
                    `${bundle.getText(
                        'errorMsgConfigurationSRVCustomerOrderNotFound'
                    )}`
                );
                expect(spyLoggerError).toBeCalledTimes(1);
            });

        expect(result).toBeUndefined();
    });

    it('should recalculate overall status to "Open" when receive 2 "Cancel" event messages via EM', async () => {
        const subscriptionBillingMessaging = await cds.connect.to(
            'subscriptionBillingMessaging'
        );

        const itemID1 = '10012';
        const itemID2 = '10013';

        //Creation CO - with reference Billing account
        const { data: creation_co_data } = await POST(
            `/api/v1/CustomerOrder`,
            {
                processingStatus: { code: '07' },
                items: [
                    {
                        id: itemID1,
                        processingStatus: { code: '07' },
                        utilitiesAspect: {
                            subsequentDocument: {
                                id: '99999999-0000-0000-0000-000000000001',
                                displayId: 'SB1',
                            },
                        },
                    },
                    {
                        id: itemID2,
                        processingStatus: { code: '07' },
                        utilitiesAspect: {
                            subsequentDocument: {
                                id: '99999999-0000-0000-0000-000000000002',
                                displayId: 'SB2',
                            },
                        },
                    },
                    {
                        id: '10014',
                        processingStatus: { code: '01' },
                        utilitiesAspect: {
                            subsequentDocument: {
                                id: '99999999-0000-0000-0000-000000000003',
                                displayId: '9999-1',
                            },
                        },
                    },
                ],
            },
            { auth: admin }
        );

        expect(creation_co_data).toBeTruthy();

        const { id: creation_co_id } = creation_co_data;

        //Termination CO
        const { data: termination_co_data } = await POST(
            `/api/v1/CustomerOrder`,
            {
                processingStatus: { code: '09' },
                items: [
                    {
                        id: itemID1,
                        processingStatus: { code: '09' },
                        utilitiesAspect: {
                            subsequentDocument: {
                                id: '99999999-0000-0000-0000-000000000001',
                                displayId: 'SB1',
                            },
                        },
                    },
                    {
                        id: itemID2,
                        processingStatus: { code: '09' },
                        utilitiesAspect: {
                            subsequentDocument: {
                                id: '99999999-0000-0000-0000-000000000002',
                                displayId: 'SB2',
                            },
                        },
                    },
                ],
            },
            { auth: admin }
        );

        expect(termination_co_data).toBeTruthy();

        const {
            event: sb1_event,
            data: sb1_data,
            headers: sb1_headers,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_canceled_SB1.json');
        await subscriptionBillingMessaging
            .transaction(req)
            .emit(sb1_event, sb1_data, sb1_headers);

        let customerOrderItem = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder.items').where({
                up__id: creation_co_id,
                id: itemID1,
            })
        );

        expect(customerOrderItem['processingStatus_code']).toBe('09');

        let customerOrder = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder').where({
                id: creation_co_id,
            })
        );

        expect(customerOrder['processingStatus_code']).toBe('07');

        const {
            event: sb2_event,
            data: sb2_data,
            headers: sb2_headers,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_canceled_SB2.json');
        await subscriptionBillingMessaging
            .transaction(req)
            .emit(sb2_event, sb2_data, sb2_headers);

        customerOrderItem = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder.items').where({
                up__id: creation_co_id,
                id: itemID2,
            })
        );

        expect(customerOrderItem['processingStatus_code']).toBe('09');

        customerOrder = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder').where({
                id: creation_co_id,
            })
        );

        expect(customerOrder['processingStatus_code']).toBe('01');
    });

    it('should not receive message with non status in the message', async () => {
        const subscriptionBillingMessaging = await cds.connect.to(
            'subscriptionBillingMessaging'
        );

        const {
            event,
            data: baseData,
            headers,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_canceled_v1.json');

        const data = JSON.parse(JSON.stringify(baseData));

        delete data.subscription.status;

        const result = await subscriptionBillingMessaging
            .transaction(req)
            .emit(event, data, headers)
            .catch((e) => {
                expect(e.message).toContain(
                    `${bundle.getText(
                        'errorMsgConfigurationSRVMissingStatusConfig'
                    )}`
                );
                expect(spyLoggerError).toBeCalledTimes(1);
            });

        expect(result).toBeUndefined();
    });

    it('should not receive message with non-existing status mapping', async () => {
        const subscriptionBillingMessaging = await cds.connect.to(
            'subscriptionBillingMessaging'
        );

        const {
            event,
            data,
            headers: headersBase,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_canceled_v1.json');

        const headers = JSON.parse(JSON.stringify(headersBase));
        headers.source = systemWithNoStatusMapping;

        const result = await subscriptionBillingMessaging
            .transaction(req)
            .emit(event, data, headers)
            .catch((e) => {
                expect(e.message).toContain(
                    `${bundle.getText(
                        'errorMsgConfigurationSRVMissingStatusMapping'
                    )}`
                );
                expect(spyLoggerError).toBeCalledTimes(1);
            });

        expect(result).toBeUndefined();
    });

    it('should not receive message VIA EM due to the authorization issues', async () => {
        const subscriptionBillingMessaging = await cds.connect.to(
            'subscriptionBillingMessaging'
        );

        const {
            event,
            data,
            headers,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_canceled_v1.json');

        // no .transaction(req) here
        const result = await subscriptionBillingMessaging
            .emit(event, data, headers)
            .catch((e) => {
                expect(e.message).toContain('Not authorized');
                expect(spyLoggerError).toBeCalledTimes(1);
            });

        expect(result).toBeUndefined();
    });

    it('should receive "Cancel" event messages via EM and update status of CO and CO Item  to "In termination" and then to "Terminated" - UTILITIESCLOUDSOLUTION-3023', async () => {
        const subscriptionBillingMessaging = await cds.connect.to(
            'subscriptionBillingMessaging'
        );

        const {
            event,
            data,
            headers,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_canceled_v1.json');
        await subscriptionBillingMessaging
            .transaction(req)
            .emit(event, data, headers);

        let customerOrderitem = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder.items').where({
                up__id: customerOrderID,
                id: itemID,
            })
        );

        expect(customerOrderitem).toBeTruthy();
        expect(customerOrderitem['processingStatus_code']).toBe('09');

        const {
            event: event_expr,
            data: data_expr,
            headers: headers_expr,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_expired_v1.json');
        await subscriptionBillingMessaging
            .transaction(req)
            .emit(event_expr, data_expr, headers_expr);

        customerOrderitem = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder.items').where({
                up__id: customerOrderID,
                id: itemID,
            })
        );

        expect(customerOrderitem).toBeTruthy();
        expect(customerOrderitem['processingStatus_code']).toBe('10');
    });

    it('should set end of business to todays date when processingStatus code is set to terminated - UTILITIESCLOUDSOLUTION-3051', async () => {
        const subscriptionBillingMessaging = await cds.connect.to(
            'subscriptionBillingMessaging'
        );

        const {
            event,
            data,
            headers,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_canceled_v1.json');
        await subscriptionBillingMessaging
            .transaction(req)
            .emit(event, data, headers);

        let customerOrderitem = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder.items').where({
                up__id: customerOrderID,
                id: itemID,
            })
        );

        expect(customerOrderitem).toBeTruthy();
        expect(customerOrderitem['processingStatus_code']).toBe('09');

        const {
            event: event_expr,
            data: data_expr,
            headers: headers_expr,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_expired_v1.json');
        await subscriptionBillingMessaging
            .transaction(req)
            .emit(event_expr, data_expr, headers_expr);

        const customerOrder = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder').where({
                id: customerOrderID,
            })
        );

        expect(customerOrder).toBeTruthy();
        expect(customerOrder['processingStatus_code']).toBe('10');
        expect(customerOrder['endOfBusinessDate']).toBeTruthy();
    });

    it('should receive "Expired" event messages via EM and update status of CO and CO item to "Completed" - UTILITIESCLOUDSOLUTION-3023', async () => {
        itemID = '20002';
        const { data: data, status: status_customerOrder } = await POST(
            `/api/v1/CustomerOrder`,
            {
                items: [
                    {
                        id: itemID,
                        type: { code: 'UCM1' },
                        utilitiesAspect: {
                            subsequentDocument: {
                                id: '97943B42-D2B7-469F-A150-6C7BE8CB9B09',
                                displayId: '50',
                            },
                        },
                    },
                ],
            },
            { auth: admin }
        );
        customerOrderID = data.id;
        expect(status_customerOrder).toBe(201);

        const subscriptionBillingMessaging = await cds.connect.to(
            'subscriptionBillingMessaging'
        );

        const {
            event,
            data: dataEM,
            headers,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_expired_v1_2.json');
        await subscriptionBillingMessaging
            .transaction(req)
            .emit(event, dataEM, headers);

        const customerOrderItem_completed = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder.items').where({
                up__id: customerOrderID,
                id: itemID,
            })
        );
        expect(customerOrderItem_completed).toBeTruthy();
        expect(customerOrderItem_completed['processingStatus_code']).toBe('03');

        const customerOrder_completed = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder').where({
                id: customerOrderID,
            })
        );
        expect(customerOrder_completed).toBeTruthy();
        expect(customerOrder_completed['processingStatus_code']).toBe('03');
    });

    it('should receive event "expirationNotification" without SB status via EM and update status of CO and CO item to "Terminated" - UTILITIESCLOUDSOLUTION-3023', async () => {
        itemID = '20002';
        const { data: data, status: status_customerOrder } = await POST(
            `/api/v1/CustomerOrder`,
            {
                items: [
                    {
                        id: itemID,
                        type: { code: 'UCM1' },
                        utilitiesAspect: {
                            subsequentDocument: {
                                id: '97943B42-D2B7-469F-A150-6C7BE8CB9B09',
                                displayId: '50',
                            },
                        },
                        processingStatus: {
                            code: '10',
                        },
                    },
                ],
            },
            { auth: admin }
        );
        customerOrderID = data.id;
        expect(status_customerOrder).toBe(201);

        const subscriptionBillingMessaging = await cds.connect.to(
            'subscriptionBillingMessaging'
        );

        const {
            event: event_expr,
            data: data_expr,
            headers: headers_expr,
        } = require('./payload/EM_sap_billing_sb_ce_sap_billing_sb_subscription_expired_v1_3.json');
        await subscriptionBillingMessaging
            .transaction(req)
            .emit(event_expr, data_expr, headers_expr);

        customerOrderitem = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder.items').where({
                up__id: customerOrderID,
                id: itemID,
            })
        );

        expect(customerOrderitem).toBeTruthy();
        expect(customerOrderitem['processingStatus_code']).toBe('10');
    });

    it('should set end of business to todays date when processingStatus code is set to canceled - UTILITIESCLOUDSOLUTION-2995', async () => {
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
            },
            { auth: admin }
        );
        customerOrderID_dpp = data.id;
        expect(status_customerOrder).toBe(201);

        const { status: status_customerOrderItem_completed } = await PATCH(
            `/api/v1/CustomerOrder(${customerOrderID_dpp})/items(id='${itemID_dpp}')`,
            {
                processingStatus: { code: '04' },
            },
            { auth: admin }
        );

        expect(status_customerOrderItem_completed).toBe(200);

        const customerOrder_completed = await db.run(
            SELECT.one.from('sap.odm.sales.CustomerOrder').where({
                id: customerOrderID_dpp,
            })
        );
        expect(customerOrder_completed).toBeTruthy();
        expect(customerOrder_completed['processingStatus_code']).toBe('04');
        expect(customerOrder_completed['endOfBusinessDate']).toBeTruthy();
    });
});
