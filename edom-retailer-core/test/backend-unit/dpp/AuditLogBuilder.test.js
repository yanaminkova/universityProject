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

const AuditLogBuilder = require('../../../srv/dpp/AuditLogBuilder');

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

    beforeAll(async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should build a audit log message with user', async () => {
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
        };
        const auditLogBuilder = new AuditLogBuilder({ req });
        const message = await auditLogBuilder
            .update(data)
            .addAttributes(data)
            .build();

        expect(message._content.user).toBe('user');
    });

    it('should build a audit log message with tenant', async () => {
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
        };
        const auditLogBuilder = new AuditLogBuilder({ req });
        const message = await auditLogBuilder
            .update(data)
            .addAttributes(data)
            .build();

        expect(message._content.tenant).toBe('edom-retailer');
    });

    it('should build a audit log message with object', async () => {
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
        };
        const auditLogBuilder = new AuditLogBuilder({ req });
        const message = await auditLogBuilder
            .update(data)
            .addAttributes(data)
            .build();

        expect(message._content.object.type).toBe(
            'API_EDOM_RETAILER.CustomerOrder'
        );
        expect(message._content.object.id.key).toBe(data.id);
    });

    it('should build a audit log message for nested fields', async () => {
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034', // Personal
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130004', // Personal
            isExternallyPriced: null,
            items: [
                {
                    id: '100001', // Personal
                    type: {
                        code: 'UCM1',
                    },
                    utilitiesAspect: {
                        formerServiceProvider: 'formerServiceProvider',
                        subsequentDocument: {
                            id: '1e5e535a-dd32-11ea-87d0-0242ac130005', // Personal
                            displayId: '1001', // Personal
                        },
                    },
                },
            ],
        };

        const auditLogBuilder = new AuditLogBuilder({ req });
        const message = await auditLogBuilder
            .update(data)
            .addAttributes(data)
            .build();

        expect(message._content.attributes.length).toBe(5);
        expect(message._content.attributes[0].name).toBe('id');
        expect(message._content.attributes[0].new).toBe(data.id);

        expect(message._content.attributes[1].name).toBe('customerReferenceId');
        expect(message._content.attributes[1].new).toBe(
            data.customerReferenceId
        );

        expect(message._content.attributes[2].name).toBe('items[0].id');
        expect(message._content.attributes[2].new).toBe(data.items[0].id);
    });

    it('should build a audit log message with data subject', async () => {
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
            customerReferenceId: '8e5e535a-dd32-11ea-87d0-0242ac130004',
            partners: [
                {
                    id: '59db97ff-79d0-4fa5-8fed-7c042288e47d',
                    businessPartnerId: 'PEPE',
                },
            ],
            businessPartnerId: 'PEPE',
        };

        const auditLogBuilder = new AuditLogBuilder({ req });
        mockEntitiesHelperGetDataFromEntity.mockResolvedValueOnce({
            businessPartnerId: 'PEPE',
        });
        const message = await auditLogBuilder
            .update(data)
            .addAttributes(data)
            .addDataSubject(data)
            .build();

        expect(message._content.data_subject).toBeTruthy();
        expect(message._content.data_subject.type).toBe('BusinessPartner');
        expect(message._content.data_subject.id.value).toBe(
            data.businessPartnerId
        );
    });

    it('should build a read audit log message with only sensitive data', async () => {
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
            bankAccounts: {
                bankAccount: 'abd21',
                bankNumber: '212121',
            },
        };
        const auditLogBuilder = new AuditLogBuilder({ req: reqBP });
        const message = await auditLogBuilder
            .read(data)
            .addAttributes(data, null, null, '', true)
            .build();

        expect(message._endpoint).toBe('data-accesses');
        expect(message._content.attributes[0].name).toBe(
            'bankAccounts.bankAccount'
        );
        expect(message._content.attributes[0].new).toBe('abd21');
        expect(message._content.attributes[1].name).toBe(
            'bankAccounts.bankNumber'
        );
        expect(message._content.attributes[1].new).toBe('212121');
    });

    it('should build a audit log message with no data subject', async () => {
        const auditLogBuilder = new AuditLogBuilder({ req });

        let message = await auditLogBuilder
            .update()
            .addAttributes({
                id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
            })
            .addDataSubject({})
            .build();
        expect(message._content.data_subject).toBeTruthy();
        expect(message._content.data_subject.type).toBe('BusinessPartner');
        expect(message._content.data_subject.id.value).toBe('-');
    });

    it('should build a read audit log message with codelist data', async () => {
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
            person: {
                gender: { code: '0' },
            },
        };
        const auditLogBuilder = new AuditLogBuilder({ req: reqBP });
        const message = await auditLogBuilder
            .update(data)
            .addAttributes(data)
            .build();

        expect(message._content.attributes[1].name).toBe('person.gender');
        expect(message._content.attributes[1].new).toBe('{"code":"0"}');
    });

    it('should throw an error with no user', () => {
        const reqNoUser = Object.assign({}, req, { user: '' });
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
        };
        const auditLogBuilder = new AuditLogBuilder({ req: reqNoUser });
        expect(async () => {
            await auditLogBuilder
                .update(
                    {
                        user: {
                            tenant: 'edom-retailer',
                        },
                        entity: 'API_EDOM_RETAILER.CustomerOrder',
                    },
                    data
                )
                .build();
        }).rejects.toThrowError('[AuditLogBuilder] No user id provided');
    });

    it('should throw an error with no entity', () => {
        const reqNoEntity = {
            user: {
                id: 'user',
                tenant: 'edom-retailer',
            },
            entity: '',
        };

        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
        };
        expect(() => {
            const auditLogBuilder = new AuditLogBuilder({ req: reqNoEntity });
            auditLogBuilder.update(
                {
                    user: {
                        id: 'user',
                        tenant: 'edom-retailer',
                    },
                },
                data
            );
        }).toThrowError('[AuditLogBuilder] No entity name provided');
    });

    it('should build a audit log message with no key', async () => {
        const auditLogBuilder = new AuditLogBuilder({ req });
        const message = await auditLogBuilder
            .update()
            .addAttributes({
                customerReferenceId: '8e713d9d-9dff-40ad-bc14-a50da4552034',
            })
            .build();

        expect(message._content.object.id.key).toBe('-');
    });

    it('should throw an error with empty attributes', () => {
        const auditLogBuilder = new AuditLogBuilder({ req });

        expect(
            async () =>
                await auditLogBuilder.update().addAttributes(null).build()
        ).rejects.toThrowError(
            '[AuditLogBuilder] No personal attributes provided'
        );
        expect(
            async () => await auditLogBuilder.update().addAttributes({}).build()
        ).rejects.toThrowError(
            '[AuditLogBuilder] No personal attributes provided'
        );
    });

    it('should throw an error with non personal attributes', async () => {
        const auditLogBuilder = new AuditLogBuilder({ req });

        expect(
            async () =>
                await auditLogBuilder
                    .update()
                    .addAttributes({ isExternallyPriced: true })
                    .build()
        ).rejects.toThrowError(
            '[AuditLogBuilder] No personal attributes provided'
        );
    });

    it('should build a read audit log message with data subject ID for BA', async () => {
        const data = {
            id: '8e713d9d-9dff-40ad-bc14-a50da4552034',
            businessPartner: {
                id: '6a666723-37a1-4cb6-81b1-c368579d7695',
            },
            name: 'ABC',
        };
        const auditLogBuilder = new AuditLogBuilder({ req: reqBP });
        const message = await auditLogBuilder
            .update(data)
            .addAttributes(data)
            .addDataSubject(data)
            .build();

        expect(message._content.data_subject.type).toBe('BusinessPartner');
        expect(message._content.data_subject.id.value).toBe(data.id);

        expect(message._content.attributes[0].name).toBe('id');
        expect(message._content.attributes[0].new).toBe(
            '8e713d9d-9dff-40ad-bc14-a50da4552034'
        );
    });
});
