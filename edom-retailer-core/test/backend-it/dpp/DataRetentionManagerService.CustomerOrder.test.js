const cds = require('@sap/cds');
const { expect, launchServer } = require('../../lib/testkit');
const functions = require('../../lib/functions');
const { TextBundle } = require('@sap/textbundle');
const bundle = new TextBundle('../../../_i18n/i18n');

global.cds.env.features.assert_integrity = false;

describe('DataRetentionManagerService.CustomerOrder', () => {
    const { GET, POST, drmUser, admin, user } = launchServer({
        service: {
            paths: [
                ['srv/dpp', 'srv/beta/dpp'],
                ['srv/api', 'srv/beta/api'],
            ],
        },
    });

    const currDate = new Date();
    const endOfBusinessDate = new Date(
        currDate.getFullYear(),
        currDate.getMonth() - 1,
        currDate.getDate()
    ).toISOString();

    const bpId_drm3 = 'DRM3';

    async function readData(entity, user) {
        try {
            const { status, data } = await GET(`${entity}`, {
                auth: user,
            });
            return { status, data };
        } catch (error) {
            return error.message;
        }
    }

    before(async () => {
        const drm = await cds.connect.to('DataRetentionManagerService');
        drm.registerLegalGround(
            'CustomerOrder',
            require('../../../srv/dpp/legalGrounds/CustomerOrderLegalGround')
        );
        drm.registerDataSubject(
            'BusinessPartner',
            require('../../../srv/dpp/dataSubjects/BusinessPartnerDataSubject')
        );

        const { status: status_dataController } = await POST(
            `/api/v1/dpp/drm/DataController`,
            {
                id: 'a05b4483-77d3-42fd-abf8-a9277f7cf433',
                name: 'Leading Cloud ERP company',
                displayId: 'SAP SE',
            },
            {
                auth: admin,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        expect(status_dataController).to.eql(201);
    });

    it('should not be possible to create additional DataControllers if one already exists', async () => {
        try {
            const { data } = await POST(
                `/api/v1/dpp/drm/DataController`,
                {
                    name: 'Leading Cloud ERP company',
                    displayId: 'SAP SE',
                },
                {
                    auth: admin,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            expect(data.success.length).to.not.exist;
        } catch (error) {
            expect(error).to.exist;
            expect(error.message).to.eql(
                '400 - ' +
                    `${bundle.getText('errorMsgDRMDatacontrollerExists')}`
            );
        }
    });

    it('should serve /api/v1/dpp/legalEntities/BusinessPartner', async () => {
        const { data } = await GET(
            `/api/v1/dpp/legalEntities/BusinessPartner()`,
            {
                auth: drmUser,
            }
        );

        expect(data[0].value).to.eql('SAP SE');
        expect(data[0].valueDesc).to.eql('Leading Cloud ERP company');
    });

    it('should return the dataSubjectsEndofResidence: the endpoint should be return error: Expect legal entities to be of length 1 but got...', async () => {
        try {
            const { data } = await POST(
                `/api/v1/dpp/drm/dataSubjectsEndofResidence`,
                {
                    dataSubjectRole: 'BusinessPartner',
                    legalGround: 'CustomerOrder',
                    startTime: 'endOfBusinessDate',
                    legalEntitiesResidenceRules: [
                        {
                            legalEntity: 'SAP SE',
                        },
                    ],
                },
                {
                    auth: drmUser,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            expect(data.success.length).to.not.exist;
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it('should return the dataSubjectsEndofResidence: the endpoint should be return error: Provided no residenceRules for legal entity...', async () => {
        try {
            const { data } = await POST(
                `/api/v1/dpp/drm/dataSubjectsEndofResidence`,
                {
                    dataSubjectRole: 'BusinessPartner',
                    legalGround: 'CustomerOrder',
                    startTime: 'endOfBusinessDate',
                    legalEntitiesResidenceRules: [
                        {
                            legalEntity: 'SAP SE',
                            residenceRules: [
                                {
                                    residenceDate: new Date().toISOString(),
                                    conditionSet: [
                                        {
                                            conditionFieldName: 'type_code',
                                            conditionFieldValue: '1003',
                                        },
                                    ],
                                },
                                {
                                    residenceDate: new Date().toISOString(),
                                    conditionSet: [
                                        {
                                            conditionFieldName: 'type_code',
                                            conditionFieldValue: '1003',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            legalEntity: 'SAP SE',
                            residenceRules: [
                                {
                                    residenceDate: new Date().toISOString(),
                                    conditionSet: [
                                        {
                                            conditionFieldName: 'type_code',
                                            conditionFieldValue: '1003',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    auth: drmUser,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            expect(data.success.length).to.not.exist;
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it('should return the dataSubjectsEndofResidence: It should have dataSubjectID in success', async () => {
        // - Customer Order with business partner in displayId
        const type_code = '1003';
        const customerOrder1 = await functions.createCustomerOrderDB(
            type_code,
            endOfBusinessDate
        );
        expect(customerOrder1).to.exist;
        const partner1 = await functions.createCustomerOrderPartnerDB(
            bpId_drm3,
            customerOrder1.id
        );
        expect(partner1).to.exist;

        // - Customer Order with business partner in UUID
        ({ id: bpUUID } = await functions.createBusinessPartnerDB({
            displayId: 'User1',
            addressData: [{}],
        }));

        expect(bpUUID).to.exist;

        const customerOrder2 = await functions.createCustomerOrderDB(
            type_code,
            endOfBusinessDate
        );
        expect(customerOrder2).to.exist;
        const partner2 = await functions.createCustomerOrderPartnerDB(
            null,
            customerOrder2.id,
            bpUUID
        );
        expect(partner2).to.exist;

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectsEndofResidence`,
            {
                dataSubjectRole: 'BusinessPartner',
                legalGround: 'CustomerOrder',
                startTime: 'endOfBusinessDate',
                legalEntitiesResidenceRules: [
                    {
                        legalEntity: 'SAP SE',
                        residenceRules: [
                            {
                                residenceDate: new Date().toISOString(),
                                conditionSet: [
                                    {
                                        conditionFieldName: 'type_code',
                                        conditionFieldValue: type_code,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(data.success.length).to.equal(2);
        expect(data.nonConfirmCondition.length).to.equal(0);
    });

    it('should return the dataSubjectsEndofResidenceConfirmation for CustomerOrder', async () => {
        const bpUUID2 = null;
        const bpId1 = null;
        const bpId2 = '1000501601';
        const type_code = '1006';
        const type_code2 = '1007';
        const customerOrder1 = await functions.createCustomerOrderDB(
            type_code,
            endOfBusinessDate
        );
        expect(customerOrder1).to.exist;

        ({ id: bpUUID1 } = await functions.createBusinessPartnerDB({
            displayId: 'User1',
            addressData: [{}],
        }));

        expect(bpUUID1).to.exist;

        const partner1 = await functions.createCustomerOrderPartnerDB(
            bpId1,
            customerOrder1.id,
            bpUUID1
        );
        expect(partner1).to.exist;

        const customerOrder2 = await functions.createCustomerOrderDB(
            type_code2
        );
        expect(customerOrder2).to.exist;
        const partner2 = await functions.createCustomerOrderPartnerDB(
            bpId2,
            customerOrder2.id,
            bpUUID2
        );
        expect(partner2).to.exist;

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectsEndofResidenceConfirmation`,
            {
                dataSubjectRole: 'BusinessPartner',
                legalGround: 'CustomerOrder',
                startTime: 'endOfBusinessDate',
                legalEntitiesResidenceRules: [
                    {
                        legalEntity: 'SAP SE',
                        residenceRules: [
                            {
                                residenceDate: new Date().toISOString(),
                            },
                        ],
                    },
                ],
                dataSubjects: [
                    { dataSubjectID: bpUUID1 },
                    { dataSubjectID: bpId2 },
                ],
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        expect(data.length).to.eql(1);
        expect(data[0].dataSubjectID).to.eql(bpUUID1);
    });

    it('should return the dataSubjectsEndofResidenceConfirmation: should return data subject in displayId for legal grounds other than CustomerOrder', async () => {
        const bpId = '2000501601';
        const type_code = '1207';

        const customerOrder = await functions.createCustomerOrderDB(
            type_code,
            endOfBusinessDate
        );
        expect(customerOrder).to.exist;
        const partner = await functions.createCustomerOrderPartnerDB(
            bpId,
            customerOrder.id
        );
        expect(partner).to.exist;

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectsEndofResidenceConfirmation`,
            {
                dataSubjectRole: 'BusinessPartner',
                legalGround: 'BillingAccount',
                startTime: 'endOfBusinessDate',
                legalEntitiesResidenceRules: [
                    {
                        legalEntity: 'SAP SE',
                        residenceRules: [
                            {
                                residenceDate: new Date().toISOString(),
                            },
                        ],
                    },
                ],
                dataSubjects: [{ dataSubjectID: bpId }],
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        expect(data.length).to.eql(1);
        expect(data[0].dataSubjectID).to.eql(bpId);
    });

    it('should return the dataSubjectEndofBusiness: All CustomerOrder have not reached end of business', async () => {
        const bpId = 'DRM1';
        const type_code = '1004';

        const customerOrder1 = await functions.createCustomerOrderDB(type_code);
        expect(customerOrder1).to.exist;
        const partner1 = await functions.createCustomerOrderPartnerDB(
            bpId,
            customerOrder1.id
        );
        expect(partner1).to.exist;

        legalGround = 'CustomerOrder';
        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectEndofBusiness`,
            {
                dataSubjectID: bpId,
                dataSubjectRole: 'BusinessPartner',
                legalGround: legalGround,
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(data.dataSubjectExpired).to.equal(false);
        expect(data.dataSubjectNotExpiredReason).to.equal(
            `${bundle.getText('errorMsgDRMEndOfBusiness')}`
        );
    });

    it('should return an empty dataSubjectEndofBusiness: A Business Partner has no Legal Ground', async () => {
        const { id: bpId } = await functions.createBusinessPartnerDB({
            displayId: 'test',
        });
        legalGround = 'CustomerOrder';
        const { data, status } = await POST(
            `/api/v1/dpp/drm/dataSubjectEndofBusiness`,
            {
                dataSubjectID: bpId,
                dataSubjectRole: 'BusinessPartner',
                legalGround: legalGround,
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(data).to.equal('');
        expect(status).to.equal(204);
    });

    it('should return the dataSubjectEndofBusiness: should return all data subjects in displayId format for legal grounds other than CustomerOrder ', async () => {
        const bpId = 'DRM_FIX';
        const type_code = '1024';

        const customerOrder1 = await functions.createCustomerOrderDB(
            type_code,
            endOfBusinessDate
        );
        expect(customerOrder1).to.exist;
        const partner1 = await functions.createCustomerOrderPartnerDB(
            bpId,
            customerOrder1.id
        );
        expect(partner1).to.exist;

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectEndofBusiness`,
            {
                dataSubjectID: bpId,
                dataSubjectRole: 'BusinessPartner',
                legalGround: 'BillingAccount',
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(data.dataSubjectExpired).to.equal(true);
        expect(data.dataSubjectNotExpiredReason).to.not.exist;
    });

    it('should return the dataSubjectEndofBusiness: All CustomerOrder have reached end of business', async () => {
        const bpId = 'DRM2';
        const type_code = '1005';
        const customerOrder2 = await functions.createCustomerOrderDB(
            type_code,
            endOfBusinessDate
        );
        expect(customerOrder2).to.exist;
        const partner1 = await functions.createCustomerOrderPartnerDB(
            bpId,
            customerOrder2.id
        );
        expect(partner1).to.exist;

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectEndofBusiness`,
            {
                dataSubjectID: bpId,
                dataSubjectRole: 'BusinessPartner',
                legalGround: 'CustomerOrder',
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(data.dataSubjectExpired).to.equal(true);
        expect(data.dataSubjectNotExpiredReason).to.not.exist;
    });

    it('should return the dataSubjectLastRetentionStartDates with one condition set', async () => {
        const type_code = '1003';

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectLastRetentionStartDates`,
            {
                legalGround: 'CustomerOrder',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: bpId_drm3,
                legalEntity: 'SAP SE',
                startTime: 'endOfBusinessDate',
                rulesConditionSet: [
                    {
                        retentionID: '1',
                        conditionSet: [
                            {
                                conditionFieldName: 'type_code',
                                conditionFieldValue: type_code,
                            },
                        ],
                    },
                ],
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        expect(data[0].retentionID).to.equal('1');
        expect(data[0].retentionStartDate.substring(0, 10)).to.equal(
            endOfBusinessDate.substring(0, 10)
        );
    });

    it('should return the dataSubjectLastRetentionStartDates, if data subject is displayId for all legal grounds other than CustomerOrder', async () => {
        const type_code = '1003';

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectLastRetentionStartDates`,
            {
                legalGround: 'BillingAccount',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: bpId_drm3,
                legalEntity: 'SAP SE',
                startTime: 'endOfBusinessDate',
                rulesConditionSet: [
                    {
                        retentionID: '1',
                        conditionSet: [
                            {
                                conditionFieldName: 'type_code',
                                conditionFieldValue: type_code,
                            },
                        ],
                    },
                ],
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        expect(data[0].retentionID).to.equal('1');
        expect(data[0].retentionStartDate.substring(0, 10)).to.equal(
            endOfBusinessDate.substring(0, 10)
        );
    });

    it('should return the dataSubjectLegalEntities', async () => {
        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectLegalEntities`,
            {
                legalGround: 'CustomerOrder',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: '',
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        expect(data[0].legalEntity).to.equal('SAP SE');
    });

    it('dataSubjectLegalGroundDeletion: should hide blocked CustomerOrder', async () => {
        const maxDeletionDate = new Date(
            currDate.getFullYear(),
            currDate.getMonth() + 1,
            currDate.getDate()
        ).toISOString();

        const bpId = 'DRM5';
        const type_code = '1005';
        const incotermsClass = 'ZZ';
        const itemId = '111128';

        const customerOrderTypeCodes = {
            name: '',
            descr: null,
            code: type_code,
        };

        const { status: status_typeCode } = await POST(
            `/api/v1/CustomerOrderItemTypeCodes`,
            customerOrderTypeCodes,
            { auth: admin }
        );
        expect(status_typeCode).to.eql(201);

        const incotermClassCodes = {
            name: '',
            descr: null,
            code: incotermsClass,
        };

        const { status: status_incotermClass } = await POST(
            `/api/v1/IncotermsClassificationCodes`,
            incotermClassCodes,
            { auth: admin }
        );
        expect(status_incotermClass).to.eql(201);

        const customerOrder = {
            items: [
                {
                    id: itemId,
                    type: { code: type_code },
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

        const { status, data: customerOrder_before } = await POST(
            `/api/v1/CustomerOrder`,
            customerOrder,
            { auth: user }
        );
        expect(status).to.eql(201);

        const { status: status_co } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})`,
            user
        );
        expect(status_co).to.eql(200);

        const { status: status_coItem } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')`,
            user
        );
        expect(status_coItem).to.eql(200);

        const { status: status_coNote } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/notes(id=${customerOrder_before.notes[0].id})`,
            user
        );
        expect(status_coNote).to.eql(200);

        const { status: status_coPartner } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/partners(id='${customerOrder_before.partners[0].id}')`,
            user
        );
        expect(status_coPartner).to.eql(200);

        const { status: status_coPriceComp } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/priceComponents(id=${customerOrder_before.priceComponents[0].id})`,
            user
        );
        expect(status_coPriceComp).to.eql(200);

        const { status: status_coServiceAspect, data: data_coServiceAspect } =
            await readData(
                `/api/v1/CustomerOrder(${customerOrder_before.id})/serviceAspect`,
                user
            );
        expect(status_coServiceAspect).to.eql(200);
        expect(data_coServiceAspect).to.not.eql('');

        const { status: status_coServiceAspectRefObject } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/serviceAspect/referenceObjects`,
            user
        );
        expect(status_coServiceAspectRefObject).to.eql(200);

        const { status: status_coItemNote } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/notes(id=${customerOrder_before.items[0].notes[0].id})`,
            user
        );
        expect(status_coItemNote).to.eql(200);

        const { status: status_coItemPartner } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/partners(id='${customerOrder_before.items[0].partners[0].id}')`,
            user
        );
        expect(status_coItemPartner).to.eql(200);

        const { status: status_coItemPriceComp } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/priceComponents(id=${customerOrder_before.items[0].priceComponents[0].id})`,
            user
        );
        expect(status_coItemPriceComp).to.eql(200);

        const {
            status: status_coItemUtilitiesRefObject,
            data: data_coItemUtilitiesRefObject,
        } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/utilitiesAspect/referenceObject`,
            user
        );
        expect(status_coItemUtilitiesRefObject).to.eql(200);
        expect(data_coItemUtilitiesRefObject).to.not.eql('');

        const { status: status_coItemUtilitiesSubseqDoc } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/utilitiesAspect/subsequentDocument`,
            user
        );
        expect(status_coItemUtilitiesSubseqDoc).to.eql(200);

        const { status: status_coItemSalesAspect } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/salesAspect`,
            user
        );
        expect(status_coItemSalesAspect).to.eql(200);

        const {
            status: status_coItemSalesAspectScheduleLines,
            data: data_coItemSalesAspectScheduleLines,
        } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/salesAspect/scheduleLines`,
            user
        );
        expect(status_coItemSalesAspectScheduleLines).to.eql(200);
        expect(data_coItemSalesAspectScheduleLines.value).to.not.eql([]);

        const { status: status_coItemServiceAspect } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/serviceAspect`,
            user
        );
        expect(status_coItemServiceAspect).to.eql(200);

        const { status: status_coItemServiceAspectRefObject } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/serviceAspect/referenceObjects`,
            user
        );
        expect(status_coItemServiceAspectRefObject).to.eql(200);

        const { status: status_coItemSubscriptionAspect } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/subscriptionAspect`,
            user
        );
        expect(status_coItemSubscriptionAspect).to.eql(200);

        const { status: status_close } = await POST(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/API_EDOM_RETAILER.close`,
            {},
            { auth: user }
        );
        expect(status_close).to.eql(204);

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectLegalGroundDeletion`,
            {
                dataSubjectID: bpId,
                dataSubjectRole: 'BusinessPartner',
                startTime: 'endOfBusinessDate',
                maxDeletionDate: maxDeletionDate,
                legalGround: 'CustomerOrder',
                retentionRules: [
                    {
                        legalEntity: 'SAP SE',
                        retentionPeriod: '1',
                        retentionUnit: 'DAY',
                        conditionSet: [],
                    },
                ],
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(data).to.equal('');

        const status_co_after = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})`,
            user
        );
        expect(status_co_after).to.eql('404 - Not Found');

        // Admin should be able to see to see blocked data
        const { status: status_co_after_drm } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})`,
            admin
        );
        expect(status_co_after_drm).to.eql(200);

        const status_coItem_after = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')`,
            user
        );
        expect(status_coItem_after).to.eql('404 - Not Found');

        // Admin should be able to see to see blocked data
        const { status: status_coItem_after_drm } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')`,
            admin
        );
        expect(status_coItem_after_drm).to.eql(200);

        const status_coNote_after = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/notes(id=${customerOrder_before.notes[0].id})`,
            user
        );
        expect(status_coNote_after).to.eql('404 - Not Found');

        // Admin should be able to see to see blocked data
        const { status: status_coNote_after_drm } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/notes(id=${customerOrder_before.notes[0].id})`,
            admin
        );
        expect(status_coNote_after_drm).to.eql(200);

        const status_coPartner_after = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/partners(id='${customerOrder_before.partners[0].id}')`,
            user
        );
        expect(status_coPartner_after).to.eql('404 - Not Found');

        // Admin should be able to see to see blocked data
        const { status: status_coPartner_after_drm } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/partners(id='${customerOrder_before.partners[0].id}')`,
            admin
        );
        expect(status_coPartner_after_drm).to.eql(200);

        const status_coPriceComp_after = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/priceComponents(id=${customerOrder_before.priceComponents[0].id})`,
            user
        );
        expect(status_coPriceComp_after).to.eql('404 - Not Found');

        // Admin should be able to see to see blocked data
        const { status: status_coPriceComp_after_drm } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/priceComponents(id=${customerOrder_before.priceComponents[0].id})`,
            admin
        );
        expect(status_coPriceComp_after_drm).to.eql(200);

        const { data: data_coServiceAspect_after } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/serviceAspect`,
            user
        );
        expect(data_coServiceAspect_after).to.eql('');

        // Admin should be able to see to see blocked data
        const { data: data_coServiceAspect_after_drm } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/serviceAspect`,
            admin
        );
        expect(data_coServiceAspect_after_drm).to.not.eql('');

        const status_coItemNote_after = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/notes(id=${customerOrder_before.items[0].notes[0].id})`,
            user
        );
        expect(status_coItemNote_after).to.eql('404 - Not Found');

        // Admin should be able to see to see blocked data
        const { status: status_coItemNote_after_drm } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/notes(id=${customerOrder_before.items[0].notes[0].id})`,
            admin
        );
        expect(status_coItemNote_after_drm).to.eql(200);

        const status_coItemPartner_after = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/partners(id='${customerOrder_before.items[0].partners[0].id}')`,
            user
        );
        expect(status_coItemPartner_after).to.eql('404 - Not Found');

        // Admin should be able to see to see blocked data
        const { status: status_coItemPartner_after_drm } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/partners(id='${customerOrder_before.items[0].partners[0].id}')`,
            admin
        );
        expect(status_coItemPartner_after_drm).to.eql(200);

        const status_coItemPriceComp_after = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/priceComponents(id=${customerOrder_before.items[0].priceComponents[0].id})`,
            user
        );
        expect(status_coItemPriceComp_after).to.eql('404 - Not Found');

        // Admin should be able to see to see blocked data
        const { status: status_coItemPriceComp_after_drm } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/priceComponents(id=${customerOrder_before.items[0].priceComponents[0].id})`,
            admin
        );
        expect(status_coItemPriceComp_after_drm).to.eql(200);

        const {
            data: data_coItemUtilitiesRefObject_after,
            status: status_coItemUtilitiesRefObject_after,
        } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/utilitiesAspect/referenceObject`,
            user
        );
        expect(data_coItemUtilitiesRefObject_after).to.eql('');

        // Admin should be able to see to see blocked data
        const { data: data_coItemUtilitiesRefObject_after_drm } =
            await readData(
                `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/utilitiesAspect/referenceObject`,
                admin
            );
        expect(data_coItemUtilitiesRefObject_after_drm.length).to.not.eql(0);

        const { data: data_coItemUtilitiesSubseqDoc_after } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/utilitiesAspect/subsequentDocument`,
            user
        );
        expect(data_coItemUtilitiesSubseqDoc_after).to.eql('');

        // Admin should be able to see to see blocked data
        const { data: data_coItemUtilitiesSubseqDoc_after_drm } =
            await readData(
                `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/utilitiesAspect/subsequentDocument`,
                admin
            );
        expect(data_coItemUtilitiesSubseqDoc_after_drm).to.not.eql('');

        const { data: data_coItemSalesAspect_after } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/salesAspect`,
            user
        );
        expect(data_coItemSalesAspect_after.length).to.eql(0);

        // Admin should be able to see to see blocked data
        const { data: data_coItemSalesAspect_after_drm } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/salesAspect`,
            admin
        );
        expect(data_coItemSalesAspect_after_drm.length).to.not.eql(0);

        const {
            status: status_coItemSalesAspectScheduleLines_after,
            data: data_coItemSalesAspectScheduleLines_after,
        } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/salesAspect/scheduleLines`,
            user
        );
        expect(status_coItemSalesAspectScheduleLines_after).to.eql(200);
        expect(data_coItemSalesAspectScheduleLines_after.value).to.eql([]);

        // Admin should be able to see to see blocked data
        const {
            status: status_coItemSalesAspectScheduleLines_after_drm,
            data: data_coItemSalesAspectScheduleLines_after_drm,
        } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/salesAspect/scheduleLines`,
            admin
        );
        expect(status_coItemSalesAspectScheduleLines_after_drm).to.eql(200);
        expect(data_coItemSalesAspectScheduleLines_after_drm.value).to.not.eql(
            []
        );

        const { data: data_coItemServiceAspect_after } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/serviceAspect`,
            user
        );
        expect(data_coItemServiceAspect_after.length).to.eql(0);

        // Admin should be able to see to see blocked data
        const { data: data_coItemServiceAspect_after_drm } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/serviceAspect`,
            admin
        );
        expect(data_coItemServiceAspect_after_drm.length).to.not.eql(0);

        const { data: data_coItemServiceAspectRefObject_after } =
            await readData(
                `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/serviceAspect/referenceObjects`,
                user
            );
        expect(data_coItemServiceAspectRefObject_after.value).to.eql([]);
        // Admin should be able to see to see blocked data
        const { data: data_coItemServiceAspectRefObject_after_drm } =
            await readData(
                `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/serviceAspect/referenceObjects`,
                admin
            );
        expect(data_coItemServiceAspectRefObject_after_drm.value).to.not.eql(
            []
        );

        const { data: data_coItemSubscriptionAspect_after } = await readData(
            `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/subscriptionAspect`,
            user
        );
        expect(data_coItemSubscriptionAspect_after.length).to.eql(0);

        // Admin should be able to see to see blocked data
        const { data: data_coItemSubscriptionAspect_after_drm } =
            await readData(
                `/api/v1/CustomerOrder(${customerOrder_before.id})/items(id='${customerOrder_before.items[0].id}')/subscriptionAspect`,
                admin
            );
        expect(data_coItemSubscriptionAspect_after_drm.length).to.not.eql(0);
    });
    it('dataSubjectLegalGroundDeletion: block relevant CustomerOrder (retention unit ANN)', async () => {
        const maxDeletionDate = new Date(
            currDate.getFullYear(),
            currDate.getMonth() + 1,
            currDate.getDate()
        ).toISOString();

        const bpId = 'DRM5';
        const type_code = '1008';
        const customerOrder1 = await functions.createCustomerOrderDB(
            type_code,
            endOfBusinessDate
        );
        expect(customerOrder1).to.exist;
        const partner1 = await functions.createCustomerOrderPartnerDB(
            bpId,
            customerOrder1.id
        );
        expect(partner1).to.exist;

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectLegalGroundDeletion`,
            {
                legalGround: 'CustomerOrder',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: bpId,
                startTime: 'endOfBusinessDate',
                maxDeletionDate,
                retentionRules: [
                    {
                        legalEntity: 'SAP SE',
                        retentionPeriod: '1',
                        retentionUnit: 'ANN',
                        conditionSet: [
                            {
                                conditionFieldName: 'type_code',
                                conditionFieldValue: type_code,
                            },
                        ],
                    },
                ],
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(data).to.equal('');

        const db = await cds.connect.to('db');
        const customerOrder1_res =
            (await db
                .run(
                    SELECT.one
                        .from(`sap.odm.sales.CustomerOrder`)
                        .where({ id: customerOrder1.id })
                )
                .catch(() => {})) || undefined;

        expect(customerOrder1_res.isBlocked).to.eql(true);
        expect(
            new Date(customerOrder1_res.maxDeletionDate).toISOString()
        ).to.eql(maxDeletionDate);
    });

    it('dataSubjectLegalGroundDeletion: block relevant CustomerOrder (retention unit MON)', async () => {
        const maxDeletionDate = new Date(
            currDate.getFullYear(),
            currDate.getMonth() + 2,
            currDate.getDate()
        ).toISOString();

        const bpId = 'DRM5';
        const type_code = '1108';
        const customerOrder1 = await functions.createCustomerOrderDB(
            type_code,
            endOfBusinessDate
        );
        expect(customerOrder1).to.exist;
        const partner1 = await functions.createCustomerOrderPartnerDB(
            bpId,
            customerOrder1.id
        );
        expect(partner1).to.exist;

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectLegalGroundDeletion`,
            {
                legalGround: 'CustomerOrder',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: bpId,
                startTime: 'endOfBusinessDate',
                maxDeletionDate,
                retentionRules: [
                    {
                        legalEntity: 'SAP SE',
                        retentionPeriod: '1',
                        retentionUnit: 'MON',
                        conditionSet: [
                            {
                                conditionFieldName: 'type_code',
                                conditionFieldValue: type_code,
                            },
                        ],
                    },
                ],
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(data).to.equal('');

        const db = await cds.connect.to('db');
        const customerOrder1_res =
            (await db
                .run(
                    SELECT.one
                        .from(`sap.odm.sales.CustomerOrder`)
                        .where({ id: customerOrder1.id })
                )
                .catch(() => {})) || undefined;

        expect(customerOrder1_res.isBlocked).to.eql(true);
        expect(
            new Date(customerOrder1_res.maxDeletionDate).toISOString()
        ).to.eql(maxDeletionDate);
    });

    it('dataSubjectLegalGroundDeletion: mark relevant CustomerOrder for deletion (retention unit DAY)', async () => {
        const maxDeletionDate = new Date(
            currDate.getFullYear(),
            currDate.getMonth() + 1,
            currDate.getDate()
        ).toISOString();

        const bpId = 'DRM5';
        const type_code = '1011';
        const customerOrder1 = await functions.createCustomerOrderDB(
            type_code,
            endOfBusinessDate
        );
        expect(customerOrder1).to.exist;
        const partner1 = await functions.createCustomerOrderPartnerDB(
            bpId,
            customerOrder1.id
        );
        expect(partner1).to.exist;

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectLegalGroundDeletion`,
            {
                legalGround: 'CustomerOrder',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: bpId,
                startTime: 'endOfBusinessDate',
                maxDeletionDate,
                retentionRules: [
                    {
                        legalEntity: 'SAP SE',
                        retentionPeriod: '1',
                        retentionUnit: 'DAY',
                        conditionSet: [
                            {
                                conditionFieldName: 'type_code',
                                conditionFieldValue: type_code,
                            },
                        ],
                    },
                ],
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(data).to.equal('');

        const db = await cds.connect.to('db');
        const customerOrder1_res =
            (await db
                .run(
                    SELECT.one
                        .from(`sap.odm.sales.CustomerOrder`)
                        .where({ id: customerOrder1.id })
                )
                .catch((error) => {
                    console.log(error);
                })) || undefined;

        expect(customerOrder1_res.isBlocked).to.eql(true);
        expect(
            new Date(customerOrder1_res.maxDeletionDate).toISOString()
        ).to.eql(maxDeletionDate);
    });

    it('dataSubjectsLegalGroundDestroying: delete Contract account blocked/markedForDeletion', async () => {
        const db = await cds.connect.to('db');

        const customerOrderID = cds.utils.uuid();
        const itemID = cds.utils.uuid();
        const customerOrder = {
            id: customerOrderID,
            items: [
                {
                    id: itemID,
                    type: { code: '1011' },
                },
            ],
        };

        const { affectedRows } = await cds.run(
            INSERT.into(`sap.odm.sales.CustomerOrder`).entries(customerOrder)
        );

        expect(affectedRows).to.eql(1);

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
                    id: customerOrderID,
                })
        );

        expect(updatedRows).to.eql(1);

        const { status } = await POST(
            `/api/v1/dpp/drm/dataSubjectsLegalGroundDestroying`,
            {
                legalGround: 'CustomerOrder',
                dataSubjectRole: 'BusinessPartner',
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const customerOrder_after =
            (await db
                .run(
                    SELECT.one
                        .from(`sap.odm.sales.CustomerOrder`)
                        .where({ id: customerOrderID })
                )
                .catch(() => {})) || undefined;

        expect(customerOrder_after).to.not.exist;

        // const item_after =
        //     (await cds
        //         .run(
        //             SELECT.one
        //                 .from(`sap.odm.sales.CustomerOrder.items`)
        //                 .where({ id: itemID })
        //         )
        //         .catch(() => {})) || undefined;

        // expect(item_after).to.not.exist;
    });

    it('dataSubjectDeletion: block all related legal ground entites', async () => {
        const maxDeletionDate = new Date(
            currDate.getFullYear(),
            currDate.getMonth() + 1,
            currDate.getDate()
        ).toISOString();

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectDeletion`,
            {
                applicationGroupName: 'EDoM',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: 'DRM',
                maxDeletionDate,
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        expect(data).to.eql('');
    });

    it('should return DataController api/v1/dpp/drm/DataController', async () => {
        const { data } = await GET(`/api/v1/dpp/drm/DataController`, {
            auth: admin,
        });

        expect(data[0].name).to.eql('Leading Cloud ERP company');
        expect(data[0].displayId).to.eql('SAP SE');
    });

    it('dataSubjectsDestroying: should destroy using  all blocked legal grounds', async () => {
        const db = await cds.connect.to('db');

        const customerOrderID = cds.utils.uuid();
        const itemID = cds.utils.uuid();
        const customerOrder = {
            id: customerOrderID,
            items: [
                {
                    id: itemID,
                    type: { code: '1011' },
                },
            ],
        };

        const { affectedRows } = await cds.run(
            INSERT.into(`sap.odm.sales.CustomerOrder`).entries(customerOrder)
        );

        expect(affectedRows).to.eql(1);

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
                    id: customerOrderID,
                })
        );

        expect(updatedRows).to.eql(1);

        const { status } = await POST(
            `/api/v1/dpp/drm/dataSubjectsDestroying`,
            {
                applicationGroupName: 'EDoM',
                dataSubjectRole: 'BusinessPartner',
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const customerOrder_after =
            (await db
                .run(
                    SELECT.one
                        .from(`sap.odm.sales.CustomerOrder`)
                        .where({ id: customerOrderID })
                )
                .catch(() => {})) || undefined;

        expect(customerOrder_after).to.not.exist;

        // const item_after =
        //     (await cds
        //         .run(
        //             SELECT.one
        //                 .from(`sap.odm.sales.CustomerOrder.items`)
        //                 .where({ id: itemID })
        //         )
        //         .catch(() => {})) || undefined;

        // expect(item_after).to.not.exist;
    });

    it('should return the orphan BP when _getDataSubjectsWithoutGivenLegalGround is called', async () => {
        async function postDataSubjectsEndofResidence() {
            const response = await POST(
                `/api/v1/dpp/drm/dataSubjectsEndofResidence`,
                {
                    dataSubjectRole: 'BusinessPartner',
                    legalGround: 'CustomerOrder',
                    startTime: 'endOfBusinessDate',
                    legalEntitiesResidenceRules: [
                        {
                            legalEntity: 'SAP SE',
                            residenceRules: [
                                {
                                    residenceDate: new Date().toISOString(),
                                    conditionSet: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    auth: drmUser,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data;
        }
        const type_code = '1003';

        await functions.deleteAllDB('sap.odm.sales.CustomerOrder');
        await functions.deleteAllDB('sap.odm.businesspartner.BusinessPartner');

        // empty guids, empty displayId  pass of _getDataSubjectsWithoutGivenLegalGround
        let data = await postDataSubjectsEndofResidence();
        let successArray = data.success.map((x) => x.dataSubjectID);
        expect(successArray).to.be.an('array').that.is.empty;

        // Create business partner and create customer order associated to it via displayId
        const { id: bpId1, displayId: bpDisplayId1 } =
            await functions.createBusinessPartnerDB({
                displayId: 'display1',
            });
        const customerOrder1 = await functions.createCustomerOrderDB(
            type_code,
            null
        );
        expect(customerOrder1).to.exist;
        const partner1 = await functions.createCustomerOrderPartnerDB(
            bpDisplayId1,
            customerOrder1.id
        );
        expect(partner1).to.exist;

        // empty guids, non-empty displayIds pass of _getDataSubjectsWithoutGivenLegalGround
        data = await postDataSubjectsEndofResidence();
        successArray = data.success.map((x) => x.dataSubjectID);
        expect(successArray).to.be.an('array').that.is.empty;

        // Create business partner and create customer order associated to it via guid
        const { id: bpId2, displayId: bpDisplayId2 } =
            await functions.createBusinessPartnerDB({
                displayId: 'display2',
            });
        const customerOrder2 = await functions.createCustomerOrderDB(
            type_code,
            null
        );
        expect(customerOrder2).to.exist;
        const partner2 = await functions.createCustomerOrderPartnerDB(
            null,
            customerOrder2.id,
            bpId2
        );
        expect(partner2).to.exist;

        // Create business partner and create customer order associated to it via displayId and guid
        const { id: bpId3, displayId: bpDisplayId3 } =
            await functions.createBusinessPartnerDB({
                displayId: 'display3',
            });
        const customerOrder3 = await functions.createCustomerOrderDB(
            type_code,
            null
        );
        expect(customerOrder3).to.exist;
        const partner3 = await functions.createCustomerOrderPartnerDB(
            bpDisplayId3,
            customerOrder3.id,
            bpId3
        );
        expect(partner3).to.exist;

        // Create orphan business partner 1
        const { id: orphanBPId1 } = await functions.createBusinessPartnerDB({
            displayId: 'orphan1',
        });

        // Create orphan business partner 2
        const { id: orphanBPId2 } = await functions.createBusinessPartnerDB({
            displayId: 'orphan2',
        });

        // Create a customer order with no association to a bp
        const customerOrder4 = await functions.createCustomerOrderDB(
            type_code,
            null
        );

        // non-empty guids, non-empty displayIds pass of _getDataSubjectsWithoutGivenLegalGround
        data = await postDataSubjectsEndofResidence();
        successArray = data.success.map((x) => x.dataSubjectID);
        expect(successArray).to.include(orphanBPId1);
        expect(successArray).to.include(orphanBPId2);
        expect(successArray).to.not.include(bpId1);
        expect(successArray).to.not.include(bpId2);
        expect(successArray).to.not.include(bpId3);

        await functions.deleteCustomerOrderDB(customerOrder3.id);
        await functions.deleteCustomerOrderDB(customerOrder1.id);

        // non-empty guids, empty displayIds pass of _getDataSubjectsWithoutGivenLegalGround
        data = await postDataSubjectsEndofResidence();
        successArray = data.success.map((x) => x.dataSubjectID);
        expect(successArray).to.include(orphanBPId1);
        expect(successArray).to.include(orphanBPId2);
    });
});
