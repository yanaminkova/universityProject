const cds = require('@sap/cds');
const { expect, launchServer, pause } = require('../lib/testkit');
const logger = require('cf-nodejs-logging-support');
const bpMock = require('./payload/BusinessPartnerMockPayload');

const {
    createConfigurationDataSet,
} = require('./payload/ConfigurationDataHelper');

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
        paths: ['srv'],
    },
};

const { GET, POST, PATCH, admin } = launchServer(config);

describe('AuditlogBusinessPartnerInternal it-test UTILITIESCLOUDSOLUTION-2916', () => {
    let bpId;

    beforeAll(async () => {
        await POST(
            `/api/businessPartner/v1/config/TaxNumberTypeCodes`,
            {
                code: '0001',
            },
            {
                auth: admin,
            }
        );
        await POST(
            `/api/businessPartner/v1/config/MarketFunctionCodes`,
            {
                code: 'SUP001',
            },
            {
                auth: admin,
            }
        );

        // setup configuration data
        await createConfigurationDataSet(admin, POST);
    });

    it('should log for Audit -> CREATE BP ', async () => {
        const log = jest.fn();
        global.console.log = log;

        const createPayload = {
            displayId: 'sampleId1',
            person: {
                nameDetails: {
                    firstName: 'firstName',
                    middleName: 'middleName',
                    lastName: 'lastName',
                },
                gender: { code: '0' },
                language: { code: 'en' },
                birthDate: '1990-12-31',
            },
            bankAccounts: [
                {
                    id: 'XYZ',
                    bankAccountName: 'RBCACCOUNTOFXYZ',
                },
            ],
            taxNumbers: [
                {
                    taxNumberType: {
                        code: '0001',
                    },
                    taxNumber: '123456789',
                },
            ],
            serviceProviderInformation: [
                {
                    marketFunction: {
                        code: 'SUP001',
                    },
                    marketFunctionCodeNumber1: '9903692000001',
                    marketFunctionSource1: 'ABCD',
                    validFrom: '2021-01-01',
                    validTo: '2021-12-31',
                },
            ],
            isBlocked: false,
        };
        try {
            var { data } = await POST(
                `/api/beta/bpinternal/BusinessPartner`,
                createPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(data).to.exist;
        bpId = data.id;
        const auditLogMessage = log.mock.calls[1][0];
        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceInternal.BusinessPartner'
        );

        expect(auditLogMessage.attributes.length).to.eql(10);

        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].new).to.eql(bpId);

        expect(auditLogMessage.attributes[1].name).to.eql('displayId');
        expect(auditLogMessage.attributes[1].new).to.eql('sampleId1');

        expect(auditLogMessage.attributes[2].name).to.eql('person.gender_code');
        expect(auditLogMessage.attributes[2].new).to.eql('0');

        expect(auditLogMessage.attributes[3].name).to.eql('person.birthDate');
        expect(auditLogMessage.attributes[3].new).to.eql('1990-12-31');

        expect(auditLogMessage.attributes[4].name).to.eql(
            'person.nameDetails.firstName'
        );
        expect(auditLogMessage.attributes[4].new).to.eql('firstName');

        expect(auditLogMessage.attributes[5].name).to.eql(
            'person.nameDetails.middleName'
        );
        expect(auditLogMessage.attributes[5].new).to.eql('middleName');

        expect(auditLogMessage.attributes[6].name).to.eql(
            'person.nameDetails.lastName'
        );
        expect(auditLogMessage.attributes[6].new).to.eql('lastName');

        expect(auditLogMessage.attributes[7].name).to.eql('bankAccounts[0].id');
        expect(auditLogMessage.attributes[7].new).to.eql('XYZ');

        expect(auditLogMessage.attributes[8].name).to.eql(
            'bankAccounts[0].bankAccountName'
        );
        expect(auditLogMessage.attributes[8].new).to.eql('RBCACCOUNTOFXYZ');

        expect(auditLogMessage.attributes[9].name).to.eql(
            'taxNumbers[0].taxNumber'
        );
        expect(auditLogMessage.attributes[9].new).to.eql('123456789');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql(bpId);

        expect(auditLogMessage.object.id.key).to.exist;
    });

    it('should log for Audit for Person details-> UPDATE BP ', async () => {
        const log = jest.fn();
        global.console.log = log;

        const businessPartnerDataPayload1 = {
            lastName: 'updated-lastName',
        };

        expect(bpId).to.exist;
        try {
            var { status: businessPartnerStatus, data } = await PATCH(
                `/api/beta/bpinternal/BusinessPartner(${bpId})/person/nameDetails`,
                businessPartnerDataPayload1,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(businessPartnerStatus).to.eql(200);
        expect(data).to.exist;
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceInternal.BusinessPartner.person.nameDetails'
        );
        expect(auditLogMessage.attributes.length).to.eql(1);

        expect(auditLogMessage.attributes[0].name).to.eql('lastName');
        expect(auditLogMessage.attributes[0].new).to.eql('updated-lastName');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql(bpId);

        expect(auditLogMessage.object.id.key).to.exist;
    });

    it('should log for Audit with all attributes -> UPDATE BP ', async () => {
        const log = jest.fn();
        global.console.log = log;

        const businessPartnerDataPayload2 = {
            displayId: 'sampleId3',
            person: {
                nameDetails: {
                    firstName: 'firstName',
                    middleName: 'middleName',
                    lastName: 'lastName',
                },
                gender: { code: '0' },
                language: { code: 'en' },
                birthDate: '1990-12-31',
            },
            bankAccounts: [
                {
                    id: 'ABC',
                    bankAccountName: 'RBCACCOUNTOFABC',
                },
            ],
            taxNumbers: [
                {
                    taxNumberType: {
                        code: '0001',
                    },
                    taxNumber: '123456788',
                },
            ],
        };

        expect(bpId).to.exist;
        try {
            var { status: businessPartnerStatus, data } = await PATCH(
                `/api/beta/bpinternal/BusinessPartner(${bpId})`,
                businessPartnerDataPayload2,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(businessPartnerStatus).to.eql(200);
        expect(data).to.exist;
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceInternal.BusinessPartner'
        );

        expect(auditLogMessage.attributes.length).to.eql(10);

        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].new).to.eql(bpId);

        expect(auditLogMessage.attributes[1].name).to.eql('displayId');
        expect(auditLogMessage.attributes[1].new).to.eql('sampleId3');

        expect(auditLogMessage.attributes[2].name).to.eql('person.gender_code');
        expect(auditLogMessage.attributes[2].new).to.eql('0');

        expect(auditLogMessage.attributes[3].name).to.eql('person.birthDate');
        expect(auditLogMessage.attributes[3].new).to.eql('1990-12-31');

        expect(auditLogMessage.attributes[4].name).to.eql(
            'person.nameDetails.firstName'
        );
        expect(auditLogMessage.attributes[4].new).to.eql('firstName');

        expect(auditLogMessage.attributes[5].name).to.eql(
            'person.nameDetails.middleName'
        );
        expect(auditLogMessage.attributes[5].new).to.eql('middleName');

        expect(auditLogMessage.attributes[6].name).to.eql(
            'person.nameDetails.lastName'
        );
        expect(auditLogMessage.attributes[6].new).to.eql('lastName');

        expect(auditLogMessage.attributes[7].name).to.eql('bankAccounts[0].id');
        expect(auditLogMessage.attributes[7].new).to.eql('ABC');

        expect(auditLogMessage.attributes[8].name).to.eql(
            'bankAccounts[0].bankAccountName'
        );
        expect(auditLogMessage.attributes[8].new).to.eql('RBCACCOUNTOFABC');

        expect(auditLogMessage.attributes[9].name).to.eql(
            'taxNumbers[0].taxNumber'
        );
        expect(auditLogMessage.attributes[9].new).to.eql('123456788');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql(bpId);

        expect(auditLogMessage.object.id.key).to.exist;
    });
});
