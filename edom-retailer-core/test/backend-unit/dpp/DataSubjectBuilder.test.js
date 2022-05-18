const path = require('path');
const cds = require('@sap/cds');
const expect = require('expect');
const EntitiesHelper = require('../../../srv/dpp/EntitiesHelper');

process.env.VCAP_SERVICES = JSON.stringify({
    auditlog: [
        {
            label: 'auditlog',
            name: 'edom-retailer-audit',
            tags: ['auditlog'],
            instance_name: 'edom-retailer-audit',
            credentials: {
                logToConsole: true,
            },
        },
    ],
});

const DataSubjectBuilder = require('../../../srv/dpp/DataSubjectBuilder');

describe('AuditLogBuilder', () => {
    const mockEntitiesHelperGetDataFromEntity = jest
        .fn()
        .mockImplementation(() => {
            return Promise.resolve();
        });
    EntitiesHelper.getDataFromEntity = mockEntitiesHelperGetDataFromEntity;

    const req = {
        user: {
            id: 'user',
            tenant: 'edom-retailer',
        },
        entity: 'API_EDOM_RETAILER.CustomerOrder',
        query: {
            _target: {
                name: 'API_EDOM_RETAILER.CustomerOrder',
            },
        },
    };

    const reqBP = {
        user: {
            id: 'user',
            tenant: 'edom-retailer',
        },
        entity: 'BusinessPartnerService.BusinessPartner',
    };

    const reqBA = {
        user: {
            id: 'user',
            tenant: 'edom-retailer',
        },
        entity: 'BillingAccountService.BillingAccount',
    };

    beforeAll(async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should return data subject id from composition entity', async () => {
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
        };

        const dataSubjectBuilder = new DataSubjectBuilder({
            req,
            entityName: req.entity,
            sourceData: data,
        });
        mockEntitiesHelperGetDataFromEntity.mockResolvedValueOnce({
            businessPartnerId: 'PEPE',
        });
        await dataSubjectBuilder.findDataSubjectEntity().findDataSubject();

        expect(dataSubjectBuilder.dataSubjectAttrValue).toBe('PEPE');
    });

    it('should return data subject id from request data', async () => {
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
        };

        const dataSubjectBuilder = new DataSubjectBuilder({
            req: reqBP,
            entityName: reqBP.entity,
            sourceData: data,
        });

        await dataSubjectBuilder.findDataSubjectEntity().findDataSubject();

        expect(dataSubjectBuilder.dataSubjectAttrValue).toBe(
            '8e713d9d-9dff-40ad-bc14-a50da4552034'
        );
    });

    it.skip('should return data subject id from request data where data subject attribute is exposed as an object', async () => {
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
            partner: {
                businessPartner: {
                    id: '5a713d9d-9dff-40ad-bc14-a50da4552025',
                },
            },
        };

        const dataSubjectBuilder = new DataSubjectBuilder({
            req: reqBA,
            entityName: reqBA.entity,
            sourceData: data,
        });

        await dataSubjectBuilder.findDataSubjectEntity().findDataSubject();

        expect(dataSubjectBuilder.dataSubjectAttrValue).toBe(
            data.businessPartner.id
        );
    });

    it('should return data subject id from request parameters', async () => {
        const reqBPWithPath = {
            user: {
                id: 'user',
                tenant: 'edom-retailer',
            },
            entity: 'BusinessPartnerService.BusinessPartner',
            path: `BusinessPartnerService.BusinessPartner`,
            params: [{ id: '8e713d9d-9dff-40ad-bc14-a50da4552034' }],
        };

        const dataSubjectBuilder = new DataSubjectBuilder({
            req: reqBPWithPath,
            entityName: reqBPWithPath.entity,
            sourceData: {},
        });

        await dataSubjectBuilder.findDataSubjectEntity().findDataSubject();

        expect(dataSubjectBuilder._dataSubjectAttrValue).toBe(
            '8e713d9d-9dff-40ad-bc14-a50da4552034'
        );
    });

    it('should return entity that contains data subject attribute', async () => {
        const dataSubjectBuilderReq = new DataSubjectBuilder({
            req,
            sourceData: {},
            entityName: req.entity,
        });

        dataSubjectBuilderReq.findDataSubjectEntity();
        expect(dataSubjectBuilderReq.dataSubjectEntity).toBe(
            'API_EDOM_RETAILER.CustomerOrderPartners'
        );

        const dataSubjectBuilderReqBP = new DataSubjectBuilder({
            req: reqBP,
            entityName: reqBP.entity,
            sourceData: {},
        });
        dataSubjectBuilderReqBP.findDataSubjectEntity();
        expect(dataSubjectBuilderReqBP.dataSubjectEntity).toBe(reqBP.entity);
    });
});
