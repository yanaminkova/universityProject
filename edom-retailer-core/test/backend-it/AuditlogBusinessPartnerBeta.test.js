const cds = require('@sap/cds');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
const { expect, launchServer, pause } = require('../lib/testkit');
const logger = require('cf-nodejs-logging-support');
const {
    commonSetupConfigCodes,
    bpSetupConfigCodes,
} = require('./payload/BusinessPartnerSetupRequiredCodes');
const bpMock = require('./payload/BusinessPartnerMockPayload');
const { BPODMVERSION } = require('../../srv/lib/config');

// traceability
const traceIssue1 = 'UTILITIESCLOUDSOLUTION-2916';
const traceIssue2 = 'UTILITIESCLOUDSOLUTION-3059';

// Legend:
// [BETA] = need to update line/s below when moving (from beta) to release

// [BETA] - enable (beta) error messages
// const error = bpError(['business-partner-enhancements']);

// [BETA] - update endpoints below when changing versions
const businessPartnerApi = `/api/beta/businesspartner/v1`;
const businessPartnerConfigApi = `/api/beta/businesspartner/v1/config`;
const commonConfigApi = `/api/config/v1`;
const MDIClientApi = `api/mdiClient/v1`;

const servicePaths = [
    'srv/api/businesspartner',
    'srv/api/CommonConfigurationService',
    'srv/beta/businesspartner',
    'srv/beta/mdiclient',
    'srv/mdiclient',
];

// enabling mock feature flags
cds.env.requires.featureFlags = {
    impl: 'test/backend-it/external/FeatureFlagsTestService',
};

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
        paths: servicePaths,
    },
};
const { POST, GET, PATCH, DELETE, admin } = launchServer(config);

describe.skip('AuditlogBusinessPartnerBeta it-test', () => {
    let postRes, bpId;

    const businessPartner = `${businessPartnerApi}/BusinessPartner`;

    // Mock the destination
    const destName = 'C4UF-MDI';
    const destUrl = 'https://mdi-test.com';
    setTestDestination({
        name: destName,
        url: destUrl,
        authTokens: [{ value: 'test' }],
    });

    // Mocks the MDI Change API
    const eventsUrl = `${destUrl}/${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/events`;
    const requestsUrl = `${destUrl}/${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/requests`;
    const mockServer = setupServer(
        rest.get(eventsUrl, (req, res, ctx) => {
            res(ctx.status(200));
        }),
        rest.post(requestsUrl, (req, res, ctx) => {
            res(ctx.status(202));
        })
    );

    async function delay(ms) {
        return await new Promise((resolve) => setTimeout(() => resolve(), ms));
    }

    beforeAll(async () => {
        try {
            // [BETA] - manually change feature flag return value
            const featureFlags = await cds.connect.to('featureFlags');
            featureFlags.set('business-partner-enhancements', true);

            // setup BP config codes
            await commonSetupConfigCodes(POST, commonConfigApi, admin);
            await bpSetupConfigCodes(POST, businessPartnerConfigApi, admin);

            mockServer.listen();
        } catch (e) {
            console.dir(e);
        }
    });

    beforeEach(async () => {
        const businessPartnerDataPayload = { ...bpMock.completeBpPerson1 };
        businessPartnerDataPayload.addressData[1].usages[0].usage.code =
            'BILLING';
        try {
            var { data } = await POST(
                businessPartner,
                businessPartnerDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(data).to.exist;
        postRes = { ...data };
        bpId = data.id;
    });

    afterAll(() => {
        mockServer.close();
    });

    afterEach(() => {
        mockServer.resetHandlers();
        jest.clearAllMocks();
    });

    /* --------------Create Audit Logging-------------- */

    // Test for creating BP

    it(`should log for Audit -> CREATE BP ${traceIssue1}`, async () => {
        const log = jest.fn();
        global.console.log = log;

        const businessPartnerDataPayload = { ...bpMock.completeBpPerson1 };
        businessPartnerDataPayload.addressData[1].usages[0].usage.code =
            'BILLING';
        try {
            var { data } = await POST(
                businessPartner,
                businessPartnerDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        await delay(1000);
        expect(data).to.exist;
        const logMockCall = log.mock.calls.filter(
            (arr) =>
                arr[0].object &&
                arr[0].object.type ===
                    'BusinessPartnerServiceBeta.BusinessPartner'
        );
        const auditLogMessage = logMockCall[0][0];

        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceBeta.BusinessPartner'
        );
        expect(auditLogMessage.attributes.length).to.eql(46);

        expect(auditLogMessage.attributes[0].name).to.eql('id');

        expect(auditLogMessage.attributes[1].name).to.eql('person.gender_code');
        expect(auditLogMessage.attributes[1].new).to.eql('0');

        expect(auditLogMessage.attributes[2].name).to.eql('person.birthDate');
        expect(auditLogMessage.attributes[2].new).to.eql('1990-12-31');

        expect(auditLogMessage.attributes[4].name).to.eql(
            'person.nameDetails.firstName'
        );
        expect(auditLogMessage.attributes[4].new).to.eql('Zack');

        // expect(auditLogMessage.attributes[5].name).to.eql(
        //     'person.nameDetails.middleName'
        // );
        // expect(auditLogMessage.attributes[5].new).to.eql('middleName');

        expect(auditLogMessage.attributes[5].name).to.eql(
            'person.nameDetails.lastName'
        );
        expect(auditLogMessage.attributes[5].new).to.eql('Haynes');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql(data.id);

        expect(auditLogMessage.object.id.key).to.exist;
    });

    it(`should log for Audit -> UPDATE BP ${traceIssue1}`, async () => {
        const log = jest.fn();
        global.console.log = log;

        const businessPartnerDataPayload = {
            lastName: 'updated-lastName',
        };

        expect(bpId).to.exist;
        await delay(1000);
        // await GET(mdiClient, {
        //     auth: admin,
        // });
        // await delay(1000);
        try {
            var { status: businessPartnerStatus, data } = await PATCH(
                `${businessPartner}(${bpId})/person/nameDetails`,
                businessPartnerDataPayload,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }
        await delay(1000);
        expect(businessPartnerStatus).to.eql(200);
        expect(data).to.exist;

        const logMockCall = log.mock.calls.filter(
            (arr) =>
                arr[0].object &&
                arr[0].object.type ===
                    'BusinessPartnerServiceBeta.BusinessPartnerPersonNameDetails'
        );

        expect(logMockCall.length).to.greaterThanOrEqual(1);
        const auditLogMessage = logMockCall[0][0];

        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceBeta.BusinessPartnerPersonNameDetails'
        );
        expect(auditLogMessage.attributes.length).to.eql(1);

        expect(auditLogMessage.attributes[0].name).to.eql('lastName');
        expect(auditLogMessage.attributes[0].new).to.eql('updated-lastName');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql(bpId);

        expect(auditLogMessage.object.id.key).to.exist;
    });

    it(`should log for Audit -> READ BP ${traceIssue1}`, async () => {
        const log = jest.fn();
        global.console.log = log;
        expect(bpId).to.exist;
        try {
            var { status, data } = await GET(
                `${businessPartner}(${bpId})?$expand=bankAccounts,person`,
                {
                    auth: admin,
                }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        await pause(5000);

        expect(status).to.eql(200);
        expect(data).to.exist;
        const logMockCall = log.mock.calls.filter(
            (arr) =>
                arr[0].object &&
                arr[0].object.type ===
                    'BusinessPartnerServiceBeta.BusinessPartner'
        );

        expect(logMockCall.length).to.greaterThanOrEqual(1);
        const auditLogMessage = logMockCall[0][0];

        //Verify for all sensitive annotated fields
        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceBeta.BusinessPartner'
        );
        expect(auditLogMessage.attributes.length).to.eql(11);

        expect(auditLogMessage.attributes[0].name).to.eql('person.gender');
        expect(auditLogMessage.attributes[0].new).to.eql('{"code":"0"}');

        expect(auditLogMessage.attributes[1].name).to.eql(
            'bankAccounts[0].bankAccountName'
        );
        expect(auditLogMessage.attributes[1].new).to.eql('bankAccountName1');
        expect(auditLogMessage.attributes[2].name).to.eql(
            'bankAccounts[0].bankControlKey'
        );
        expect(auditLogMessage.attributes[2].new).to.eql('01');
        expect(auditLogMessage.attributes[3].name).to.eql(
            'bankAccounts[0].validFrom'
        );
        expect(auditLogMessage.attributes[3].new).to.eql('2020-01-01');
        expect(auditLogMessage.attributes[4].name).to.eql(
            'bankAccounts[0].validTo'
        );
        expect(auditLogMessage.attributes[4].new).to.eql('2020-12-31');
        expect(auditLogMessage.attributes[5].name).to.eql(
            'bankAccounts[0].bankCountry'
        );
        expect(auditLogMessage.attributes[5].new).to.eql('{"code":"CA"}');
        expect(auditLogMessage.attributes[6].name).to.eql(
            'bankAccounts[0].bankAccountHolderName'
        );
        expect(auditLogMessage.attributes[6].new).to.eql(
            'bankAccountHolderName1'
        );
        expect(auditLogMessage.attributes[7].name).to.eql(
            'bankAccounts[0].IBAN'
        );
        expect(auditLogMessage.attributes[7].new).to.eql('IBAN1');
        expect(auditLogMessage.attributes[8].name).to.eql(
            'bankAccounts[0].bankAccount'
        );
        expect(auditLogMessage.attributes[8].new).to.eql('bankAccountNumber1');
        expect(auditLogMessage.attributes[9].name).to.eql(
            'bankAccounts[0].bankNumber'
        );
        expect(auditLogMessage.attributes[9].new).to.eql('21112018');
        expect(auditLogMessage.attributes[10].name).to.eql(
            'bankAccounts[0].bankAccountReference'
        );
        expect(auditLogMessage.attributes[10].new).to.eql('bankAccRef1');

        expect(auditLogMessage.data_subject).to.exist;
        expect(auditLogMessage.data_subject.type).to.eql('BusinessPartner');
        expect(auditLogMessage.data_subject.id.value).to.eql(bpId);

        expect(auditLogMessage.object.id.key).to.exist;
    });

    it(`should log for Audit -> Delete BP taxNumbers via sub entity ${traceIssue2}`, async () => {
        const log = jest.fn();
        global.console.log = log;
        expect(bpId).to.exist;

        const taxCode = postRes.taxNumbers[0].taxNumberType.code;

        try {
            var { status, data } = await DELETE(
                `${businessPartner}(${postRes.id})/taxNumbers('${taxCode}')`,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        await pause(5000);

        expect(status).to.eql(204);
        expect(data).to.exist;
        const logMockCall = log.mock.calls.filter(
            (arr) =>
                arr[0].object &&
                arr[0].object.type ===
                    'BusinessPartnerServiceBeta.BusinessPartnerTaxNumbers'
        );

        expect(logMockCall.length).to.greaterThanOrEqual(1);
        const auditLogMessage = logMockCall[0][0];

        //Verify for all annotated fields
        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceBeta.BusinessPartnerTaxNumbers'
        );
        expect(auditLogMessage.attributes.length).to.eql(1);

        expect(auditLogMessage.attributes[0].name).to.eql('taxNumber');
        expect(auditLogMessage.attributes[0].new).to.eql('-');
    });

    it(`should log for Audit -> Delete BP bankAccount via sub entity ${traceIssue2}`, async () => {
        const log = jest.fn();
        global.console.log = log;
        expect(bpId).to.exist;

        const bpBankId = postRes.bankAccounts[0].id;

        try {
            var { status, data } = await DELETE(
                `${businessPartner}(${postRes.id})/bankAccounts(id='${bpBankId}')`,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        await pause(5000);

        expect(status).to.eql(204);
        expect(data).to.exist;
        const logMockCall = log.mock.calls.filter(
            (arr) =>
                arr[0].object &&
                arr[0].object.type ===
                    'BusinessPartnerServiceBeta.BusinessPartnerBankAccounts'
        );

        expect(logMockCall.length).to.greaterThanOrEqual(1);
        const auditLogMessage = logMockCall[0][0];

        //Verify for all annotated fields
        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceBeta.BusinessPartnerBankAccounts'
        );
        expect(auditLogMessage.attributes.length).to.eql(11);

        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].new).to.eql('-');
        expect(auditLogMessage.attributes[0].old).to.eql(bpBankId);
        expect(auditLogMessage.attributes[1].name).to.eql('bankAccountName');
        expect(auditLogMessage.attributes[1].new).to.eql('-');
        expect(auditLogMessage.attributes[2].name).to.eql('bankControlKey');
        expect(auditLogMessage.attributes[2].new).to.eql('-');
        expect(auditLogMessage.attributes[3].name).to.eql('validFrom');
        expect(auditLogMessage.attributes[3].new).to.eql('-');
        expect(auditLogMessage.attributes[4].name).to.eql('validTo');
        expect(auditLogMessage.attributes[4].new).to.eql('-');
        expect(auditLogMessage.attributes[5].name).to.eql('bankCountry_code');
        expect(auditLogMessage.attributes[5].new).to.eql('-');
        expect(auditLogMessage.attributes[6].name).to.eql(
            'bankAccountHolderName'
        );
        expect(auditLogMessage.attributes[6].new).to.eql('-');
        expect(auditLogMessage.attributes[7].name).to.eql('IBAN');
        expect(auditLogMessage.attributes[7].new).to.eql('-');
        expect(auditLogMessage.attributes[8].name).to.eql('bankAccount');
        expect(auditLogMessage.attributes[8].new).to.eql('-');
        expect(auditLogMessage.attributes[9].name).to.eql('bankNumber');
        expect(auditLogMessage.attributes[9].new).to.eql('-');
        expect(auditLogMessage.attributes[10].name).to.eql(
            'bankAccountReference'
        );
        expect(auditLogMessage.attributes[10].new).to.eql('-');
    });

    it(`should log for Audit -> Delete BP addressData sub entity ${traceIssue2}`, async () => {
        const log = jest.fn();
        global.console.log = log;
        expect(bpId).to.exist;
        let bpAddressId1;

        if (postRes.addressData[0].usages[0].usage.code !== 'XXDEFAULT') {
            bpAddressId1 = postRes.addressData[0].id;
        } else {
            bpAddressId1 = postRes.addressData[1].id;
        }

        try {
            var { status, data } = await DELETE(
                `${businessPartner}(${postRes.id})/addressData(${bpAddressId1})`,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        await pause(5000);

        expect(status).to.eql(204);
        expect(data).to.exist;
        const logMockCall = log.mock.calls.filter(
            (arr) =>
                arr[0].object &&
                arr[0].object.type ===
                    'BusinessPartnerServiceBeta.BusinessPartnerAddressData'
        );

        expect(logMockCall.length).to.greaterThanOrEqual(1);
        const auditLogMessage = logMockCall[0][0];

        //Verify for all annotated fields
        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceBeta.BusinessPartnerAddressData'
        );
        expect(auditLogMessage.attributes.length).to.eql(12);

        expect(auditLogMessage.attributes[0].name).to.eql(
            'personPostalAddress.street'
        );
        expect(auditLogMessage.attributes[0].new).to.eql('-');

        expect(auditLogMessage.attributes[1].name).to.eql(
            'personPostalAddress.streetSuffix1'
        );
        expect(auditLogMessage.attributes[1].new).to.eql('-');

        expect(auditLogMessage.attributes[2].name).to.eql(
            'personPostalAddress.streetSuffix2'
        );
        expect(auditLogMessage.attributes[2].new).to.eql('-');

        expect(auditLogMessage.attributes[3].name).to.eql(
            'personPostalAddress.houseNumber'
        );
        expect(auditLogMessage.attributes[3].new).to.eql('-');

        expect(auditLogMessage.attributes[4].name).to.eql(
            'personPostalAddress.town'
        );
        expect(auditLogMessage.attributes[4].new).to.eql('-');
        expect(auditLogMessage.attributes[5].name).to.eql(
            'personPostalAddress.primaryRegion_code'
        );
        expect(auditLogMessage.attributes[5].new).to.eql('-');
        expect(auditLogMessage.attributes[6].name).to.eql(
            'personPostalAddress.country_code'
        );
        expect(auditLogMessage.attributes[6].new).to.eql('-');
        expect(auditLogMessage.attributes[7].name).to.eql(
            'personPostalAddress.postCode'
        );
        expect(auditLogMessage.attributes[7].new).to.eql('-');

        expect(auditLogMessage.attributes[8].name).to.eql(
            'emailAddresses[0].address'
        );
        expect(auditLogMessage.attributes[8].new).to.eql('-');

        expect(auditLogMessage.attributes[9].name).to.eql(
            'phoneNumbers[0].country_code'
        );
        expect(auditLogMessage.attributes[9].new).to.eql('-');

        expect(auditLogMessage.attributes[10].name).to.eql(
            'phoneNumbers[0].number'
        );
        expect(auditLogMessage.attributes[10].new).to.eql('-');

        expect(auditLogMessage.attributes[11].name).to.eql(
            'phoneNumbers[0].numberExtension'
        );
        expect(auditLogMessage.attributes[11].new).to.eql('-');
    });

    it(`should log for Audit -> Delete EmailAddress from BP addressData sub entity ${traceIssue2}`, async () => {
        const log = jest.fn();
        global.console.log = log;
        expect(bpId).to.exist;

        const bpAddressId1 = postRes.addressData[0].id;
        const emailAddressId1 = postRes.addressData[0].emailAddresses[0].id;
        const emailAddress = postRes.addressData[0].emailAddresses[0].address;

        try {
            var { status, data } = await DELETE(
                `${businessPartner}(${postRes.id})/addressData(${bpAddressId1})/emailAddresses(${emailAddressId1})`,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        await pause(5000);

        expect(status).to.eql(204);
        expect(data).to.exist;
        const logMockCall = log.mock.calls.filter(
            (arr) =>
                arr[0].object &&
                arr[0].object.type ===
                    'BusinessPartnerServiceBeta.BusinessPartnerAddressDataEmailAddresses'
        );

        expect(logMockCall.length).to.greaterThanOrEqual(1);
        const auditLogMessage = logMockCall[0][0];

        //Verify for all annotated fields
        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceBeta.BusinessPartnerAddressDataEmailAddresses'
        );
        expect(auditLogMessage.attributes.length).to.eql(1);

        expect(auditLogMessage.attributes[0].name).to.eql('address');
        expect(auditLogMessage.attributes[0].old).to.eql(emailAddress);
        expect(auditLogMessage.attributes[0].new).to.eql('-');

        expect(auditLogMessage.object.id.key).to.exist;
    });

    it(`should log for Audit -> Delete Phone from BP addressData sub entity ${traceIssue2}`, async () => {
        const log = jest.fn();
        global.console.log = log;
        expect(bpId).to.exist;

        const bpAddressId1 = postRes.addressData[0].id;
        const phoneNumId1 = postRes.addressData[0].phoneNumbers[0].id;
        const phoneNum = postRes.addressData[0].phoneNumbers[0].number;
        const phoneNumContCd =
            postRes.addressData[0].phoneNumbers[0].country.code;
        const phoneNumPhExt =
            postRes.addressData[0].phoneNumbers[0].numberExtension;

        try {
            var { status, data } = await DELETE(
                `${businessPartner}(${postRes.id})/addressData(${bpAddressId1})/phoneNumbers(${phoneNumId1})`,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        await pause(5000);

        expect(status).to.eql(204);
        expect(data).to.exist;
        const logMockCall = log.mock.calls.filter(
            (arr) =>
                arr[0].object &&
                arr[0].object.type ===
                    'BusinessPartnerServiceBeta.BusinessPartnerAddressDataPhoneNumbers'
        );

        expect(logMockCall.length).to.greaterThanOrEqual(1);
        const auditLogMessage = logMockCall[0][0];

        //Verify for all annotated fields
        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceBeta.BusinessPartnerAddressDataPhoneNumbers'
        );
        expect(auditLogMessage.attributes.length).to.eql(3);

        expect(auditLogMessage.attributes[0].name).to.eql('country_code');
        expect(auditLogMessage.attributes[0].old).to.eql(phoneNumContCd);
        expect(auditLogMessage.attributes[0].new).to.eql('-');

        expect(auditLogMessage.attributes[1].name).to.eql('number');
        expect(auditLogMessage.attributes[1].old).to.eql(phoneNum);
        expect(auditLogMessage.attributes[1].new).to.eql('-');

        expect(auditLogMessage.attributes[2].name).to.eql('numberExtension');
        expect(auditLogMessage.attributes[2].old).to.eql(phoneNumPhExt);
        expect(auditLogMessage.attributes[2].new).to.eql('-');

        expect(auditLogMessage.object.id.key).to.exist;
    });

    it(`should log for Audit -> Delete CustomerInformation sub entity ${traceIssue2}`, async () => {
        const log = jest.fn();
        global.console.log = log;
        expect(bpId).to.exist;

        const taxContCd =
            postRes.customerInformation.taxClassifications[0].country.code;
        const taxCatCd =
            postRes.customerInformation.taxClassifications[0].taxCategory.code;
        const taxClasCd =
            postRes.customerInformation.taxClassifications[0].taxClassification
                .code;

        try {
            var { status, data } = await DELETE(
                `${businessPartner}(${postRes.id})/customerInformation`,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        await pause(5000);

        expect(status).to.eql(204);
        expect(data).to.exist;
        const logMockCall = log.mock.calls.filter(
            (arr) =>
                arr[0].object &&
                arr[0].object.type ===
                    'BusinessPartnerServiceBeta.BusinessPartnerCustomerInformation'
        );

        expect(logMockCall.length).to.greaterThanOrEqual(1);
        const auditLogMessage = logMockCall[0][0];

        //Verify for all annotated fields
        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceBeta.BusinessPartnerCustomerInformation'
        );

        expect(auditLogMessage.attributes.length).to.eql(3);

        expect(auditLogMessage.attributes[0].name).to.eql(
            'taxClassifications[0].country_code'
        );
        expect(auditLogMessage.attributes[0].old).to.eql(taxContCd);
        expect(auditLogMessage.attributes[0].new).to.eql('-');

        expect(auditLogMessage.attributes[1].name).to.eql(
            'taxClassifications[0].taxCategory_code'
        );
        expect(auditLogMessage.attributes[1].old).to.eql(taxCatCd);
        expect(auditLogMessage.attributes[1].new).to.eql('-');

        expect(auditLogMessage.attributes[2].name).to.eql(
            'taxClassifications[0].taxClassification_code'
        );
        expect(auditLogMessage.attributes[2].old).to.eql(taxClasCd);
        expect(auditLogMessage.attributes[2].new).to.eql('-');

        expect(auditLogMessage.object.id.key).to.exist;
    });

    it(`should log for Audit -> Delete TaxClassification sub entity ${traceIssue2}`, async () => {
        const log = jest.fn();
        global.console.log = log;
        expect(bpId).to.exist;

        const taxContCd =
            postRes.customerInformation.taxClassifications[0].country.code;
        const taxCatCd =
            postRes.customerInformation.taxClassifications[0].taxCategory.code;
        const taxClasCd =
            postRes.customerInformation.taxClassifications[0].taxClassification
                .code;

        const url = `${businessPartner}(${postRes.id})/customerInformation/taxClassifications(code='${taxContCd}',code_001='${taxCatCd}')`;
        try {
            var { status, data } = await DELETE(url, { auth: admin });
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        await pause(5000);

        expect(status).to.eql(204);
        expect(data).to.exist;
        const logMockCall = log.mock.calls.filter(
            (arr) =>
                arr[0].object &&
                arr[0].object.type ===
                    'BusinessPartnerServiceBeta.BusinessPartnerCustomerInformationTaxClassifications'
        );

        expect(logMockCall.length).to.greaterThanOrEqual(1);
        const auditLogMessage = logMockCall[0][0];

        //Verify for all annotated fields
        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerServiceBeta.BusinessPartnerCustomerInformationTaxClassifications'
        );
        expect(auditLogMessage.attributes.length).to.eql(3);

        expect(auditLogMessage.attributes[0].name).to.eql('country_code');
        expect(auditLogMessage.attributes[0].old).to.eql(taxContCd);
        expect(auditLogMessage.attributes[0].new).to.eql('-');

        expect(auditLogMessage.attributes[1].name).to.eql('taxCategory_code');
        expect(auditLogMessage.attributes[1].old).to.eql(taxCatCd);
        expect(auditLogMessage.attributes[1].new).to.eql('-');

        expect(auditLogMessage.attributes[2].name).to.eql(
            'taxClassification_code'
        );
        expect(auditLogMessage.attributes[2].old).to.eql(taxClasCd);
        expect(auditLogMessage.attributes[2].new).to.eql('-');

        expect(auditLogMessage.object.id.key).to.exist;
    });
});
