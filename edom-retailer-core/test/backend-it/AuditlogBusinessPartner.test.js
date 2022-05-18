const cds = require('@sap/cds');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
const {
    expect,
    launchServer,
    pause,
    mockServerConf,
} = require('../lib/testkit');
const logger = require('cf-nodejs-logging-support');
const {
    commonSetupConfigCodes,
    bpSetupConfigCodes,
} = require('./payload/BusinessPartnerSetupRequiredCodes');
const bpMock = require('./payload/BusinessPartnerMockPayload');
const MDITestService = require('./external/MDITestService');

const {
    createConfigurationDataSet,
} = require('./payload/ConfigurationDataHelper');
const { BPODMVERSION } = require('../../srv/lib/config');

// traceability
const traceIssue1 = 'UTILITIESCLOUDSOLUTION-2916';
const traceIssue2 = 'UTILITIESCLOUDSOLUTION-3018';
const traceIssue3 = 'UTILITIESCLOUDSOLUTION-3012';

// Legend:
// [BETA] = need to update line/s below when moving (from beta) to release

// [BETA] - enable (beta) error messages
// const error = bpError(['business-partner-enhancements']);

// [BETA] - update endpoints below when changing versions
const businessPartnerApi = `/api/businessPartner/v1`;
const businessPartnerConfigApi = `/api/businessPartner/v1/config`;
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

const { GET, POST, PATCH, admin } = launchServer(config);

describe('AuditlogBusinessPartner it-test', () => {
    const businessPartner = `${businessPartnerApi}/BusinessPartner`;
    const mdiClient = `${MDIClientApi}/MDIClient`;

    // Mock the destinations
    const mdiDestName = 'C4UF-MDI';
    const mdiDestUrl = 'https://mdi-test.com';
    setTestDestination({
        name: mdiDestName,
        url: mdiDestUrl,
        authTokens: [{ value: 'test' }],
    });

    const keyMappingDestName = 'mdi-bp-keymap';
    const keyMappingDestUrl = 'https://mdi-bp-keymap-test.com';
    const keyMappingS4BusinessSystem = 'test-s4-system';
    const keyMappingC4UFBusinessSystem = 'test-c4uf-system';
    setTestDestination({
        name: keyMappingDestName,
        url: keyMappingDestUrl,
        destinationConfiguration: {
            s4BusinessSystem: keyMappingS4BusinessSystem,
            c4ufBusinessSystem: keyMappingC4UFBusinessSystem,
        },
    });

    async function delay(ms) {
        return await new Promise((resolve) => setTimeout(() => resolve(), ms));
    }

    const bpEntity = `${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner`;
    const changeUrl = `${mdiDestUrl}/${bpEntity}/requests`;
    const logUrl = `${mdiDestUrl}/${bpEntity}/events`;

    const mdiMockServer = setupServer();
    let mockMDI;

    let bpId;

    afterAll(() => {
        mdiMockServer.close();
    });

    beforeEach(() => {
        mockMDI = new MDITestService();
    });

    afterEach(() => {
        mdiMockServer.resetHandlers();
        jest.clearAllMocks();
    });

    beforeAll(async () => {
        const featureFlags = await cds.connect.to('featureFlags');
        // set feature flag here

        mdiMockServer.listen(mockServerConf);

        // mock MDI
        mdiMockServer.use(
            rest.post(changeUrl, (req, res, ctx) => {
                mockMDI.insert(
                    'createFromC4Uf',
                    req.body,
                    mockMDI.logResponse1
                );
                return res(ctx.status(202));
            })
        );

        const log = jest.fn();
        global.console.log = log;
        // setup BP config codes
        await commonSetupConfigCodes(POST, commonConfigApi, admin);
        await bpSetupConfigCodes(POST, businessPartnerConfigApi, admin);

        const businessPartnerDataPayload = { ...bpMock.completeBpPerson1 };

        // setup configuration data
        await createConfigurationDataSet(admin, POST);

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
        bpId = data.id;
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerService.BusinessPartner'
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

    /* --------------Create Audit Logging-------------- */

    // Test for creating BP

    it(`should log for Audit -> UPDATE BP ${traceIssue1}`, async () => {
        const log = jest.fn();
        global.console.log = log;

        const businessPartnerDataPayload = {
            lastName: 'updated-lastName',
        };

        expect(bpId).to.exist;

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
                    'BusinessPartnerService.BusinessPartnerPersonNameDetails'
        );

        expect(logMockCall.length).to.greaterThanOrEqual(1);
        const auditLogMessage = logMockCall[0][0];

        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerService.BusinessPartnerPersonNameDetails'
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

        await pause();

        expect(status).to.eql(200);
        expect(data).to.exist;
        const logMockCall = log.mock.calls.filter(
            (arr) =>
                arr[0].object &&
                arr[0].object.type === 'BusinessPartnerService.BusinessPartner'
        );

        expect(logMockCall.length).to.greaterThanOrEqual(1);
        const auditLogMessage = logMockCall[0][0];

        //Verify for all sensitive annotated fields
        expect(auditLogMessage.object.type).to.eql(
            'BusinessPartnerService.BusinessPartner'
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
});
