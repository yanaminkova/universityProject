const expect = require('expect');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const { TextBundle } = require('@sap/textbundle');
const { launchServer, mockServerConf } = require('../lib/testkit');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
const bpValidationMock = require('./payload/BusinessPartnerValidationMockPayloads');
const {
    commonSetupConfigCodes,
    bpSetupConfigCodes,
} = require('./payload/BusinessPartnerSetupRequiredCodes');
const bpError = require('../../srv/lib/businesspartner/BusinessPartnerErrorMessages');
const bpMock = require('./payload/BusinessPartnerMockPayload');

const {
    createConfigurationDataSet,
} = require('./payload/ConfigurationDataHelper');
const { BPODMVERSION } = require('../../srv/lib/config');

// traceability
const traceIssue1 = 'UTILITIESCLOUDSOLUTION-2916';
const traceIssue2 = 'UTILITIESCLOUDSOLUTION-3018';
const traceIssue3 = 'UTILITIESCLOUDSOLUTION-3012';
const traceIssue4 = 'UTILITIESCLOUDSOLUTION-3059';

// Legend:
// [BETA] = need to update line/s below when moving (from beta) to release

// [BETA] - enable (beta) error messages
const bundle = new TextBundle('../../_i18n/i18n', ' ');
const error = bpError(['business-partner-enhancements'])(bundle);

// [BETA] - update endpoints below when changing versions
const businessPartnerApi = `/api/beta/businessPartner/v1`;
const businessPartnerConfigApi = `/api/businessPartner/v1/config`;
const commonConfigApi = `/api/config/v1`;

const servicePaths = [
    'srv/api/businesspartner',
    'srv/api/CommonConfigurationService',
    'srv/beta/businesspartner',
    'srv/beta/mdiclient',
    'srv/mdiclient',
    'srv/api/CommonConfigurationService',
];

// enabling mock feature flags
cds.env.requires.featureFlags = {
    impl: 'test/backend-it/external/FeatureFlagsTestService',
};

const { GET, POST, PUT, PATCH, DELETE, admin } = launchServer({
    service: {
        paths: servicePaths,
    },
});

const businessPartner = `${businessPartnerApi}/BusinessPartner`;

describe.skip('BusinessPartnerService service subentities beta it-test (BP Sub-entities)', () => {
    const bpPostPayload = bpValidationMock.bpPersonValid;
    const bpWithEmailPayload = {
        ...bpPostPayload,
        addressData: [
            {
                ...bpValidationMock.bpPersonValid.addressData[0],
                emailAddresses: [{ address: 'test0@test.com' }],
            },
        ],
    };
    let postBPResponse;
    let bpId;
    let addressDataId;
    let emailAddressId;

    // Mock the destination
    const destName = 'C4UF-MDI';
    const destUrl = 'https://mdi-test.com';
    setTestDestination({
        name: destName,
        url: destUrl,
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

    // Mocks the MDI Change API
    const eventsUrl = `${destUrl}/${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/events`;
    const requestsUrl = `${destUrl}/${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/requests`;
    const mockServer = setupServer(
        rest.get(eventsUrl, (req, res, ctx) => res(ctx.status(200))),
        rest.post(requestsUrl, (req, res, ctx) => res(ctx.status(202)))
    );

    async function delay(ms) {
        return await new Promise((resolve) => setTimeout(() => resolve(), ms));
    }

    beforeAll(async () => {
        // [BETA] - manually change feature flag return value
        const featureFlags = await cds.connect.to('featureFlags');
        featureFlags.set('business-partner-enhancements', true);

        // setup configuration data
        await createConfigurationDataSet(admin, POST);

        // setup BP config codes
        await commonSetupConfigCodes(POST, commonConfigApi, admin);
        await bpSetupConfigCodes(POST, businessPartnerConfigApi, admin);

        mockServer.listen(mockServerConf);
    });

    beforeEach(async () => {
        // make a BP with an email address for each test
        postBPResponse = await POST(businessPartner, bpWithEmailPayload, {
            auth: admin,
        });

        const addressData = postBPResponse.data.addressData[0];
        const emailAddress = addressData.emailAddresses[0];
        bpId = postBPResponse.data.id;
        addressDataId = addressData.id;
        emailAddressId = emailAddress.id;

        expect(postBPResponse.data).toBeTruthy();
        expect(postBPResponse.status).toBe(201);
        expect(bpId).toBeTruthy;
        expect(addressData.emailAddresses.length).toBe(1);
        expect(addressDataId).toBeTruthy;
        expect(emailAddressId).toBeTruthy;
    });

    afterAll(() => {
        mockServer.close();
    });

    afterEach(() => {
        mockServer.resetHandlers();
        jest.clearAllMocks();
    });

    it(`should succeed on making a PUT call on level 1 subentity to add, edit, and delete level 2 subentities with / and () syntax ${traceIssue2}`, async () => {
        // delete all emailAddresses via PUT addressData
        let putBPResponse = await PUT(
            `${businessPartner}/${bpId}/addressData(${addressDataId})`,
            {
                ...bpPostPayload.addressData[0],
            },
            { auth: admin }
        );
        expect(putBPResponse.data).toBeTruthy();
        expect(putBPResponse.status).toBe(200);

        let getBPResponse = await GET(
            `${businessPartner}/${bpId}?$expand=addressData($expand=emailAddresses)`,
            { auth: admin }
        );
        let emailAddresses = getBPResponse.data.addressData[0].emailAddresses;
        expect(emailAddresses?.length).toBeFalsy;

        // add 2 emailAddresses via PUT addressData
        putBPResponse = await PUT(
            `${businessPartner}(${bpId})/addressData(${addressDataId})`,
            {
                ...bpPostPayload.addressData[0],
                emailAddresses: [
                    { address: 'test1@test.com' },
                    { address: 'test2@test.com' },
                ],
            },
            { auth: admin }
        );
        expect(putBPResponse.data).toBeTruthy();
        expect(putBPResponse.status).toBe(200);

        getBPResponse = await GET(
            `${businessPartner}(${bpId})?$expand=addressData($expand=*)`,
            { auth: admin }
        );
        let addressData = getBPResponse.data.addressData[0];
        emailAddresses = addressData.emailAddresses;
        const emailArr = ['test1@test.com', 'test2@test.com'];
        expect(addressData.personPostalAddress.houseNumber).toBe('778');
        expect(addressData.personPostalAddress.postCode).toBe('99003');
        expect(emailAddresses.length).toBe(2);
        expect(emailArr.includes(emailAddresses[0].address)).toBeTruthy;
        expect(emailArr.includes(emailAddresses[1].address)).toBeTruthy;

        // replace all emailAddresses with a single email address via PUT addressData
        putBPResponse = await PUT(
            `${businessPartner}(${bpId})/addressData/${addressDataId}`,
            {
                ...bpPostPayload.addressData[0],
                emailAddresses: [{ address: 'test3@test.com' }],
            },
            { auth: admin }
        );
        expect(putBPResponse.data).toBeTruthy();
        expect(putBPResponse.status).toBe(200);

        getBPResponse = await GET(
            `${businessPartner}(${bpId})?$expand=addressData($expand=*)`,
            { auth: admin }
        );
        addressData = getBPResponse.data.addressData[0];
        emailAddresses = addressData.emailAddresses;
        expect(addressData.personPostalAddress.houseNumber).toBe('778');
        expect(addressData.personPostalAddress.postCode).toBe('99003');
        expect(emailAddresses.length).toBe(1);
        expect(emailAddresses[0].address).toBe('test3@test.com');
    });

    it(`should succeed on making a PUT call on level 2 subentity ${traceIssue2}`, async () => {
        // update email address
        let putBPResponse = await PUT(
            `${businessPartner}/${bpId}/addressData(${addressDataId})/emailAddresses/${emailAddressId}`,
            { address: 'test1@test.com', isBlocked: false },
            { auth: admin }
        );
        expect(putBPResponse.data).toBeTruthy();
        expect(putBPResponse.status).toBe(200);

        let getBPResponse = await GET(
            `${businessPartner}/${bpId}?$expand=addressData($expand=*)`,
            { auth: admin }
        );
        let addressData = getBPResponse.data.addressData[0];
        let emailAddresses = addressData.emailAddresses;
        expect(addressData.personPostalAddress.houseNumber).toBe('778');
        expect(addressData.personPostalAddress.postCode).toBe('99003');
        expect(emailAddresses.length).toBe(1);
        expect(emailAddresses[0].address).toBe('test1@test.com');

        // update nameDetails
        putBPResponse = await PUT(
            `${businessPartner}/${bpId}/person/nameDetails`,
            {
                firstName: 'newFirst',
                middleName: 'newMiddle',
                lastName: 'newLast',
            },
            { auth: admin }
        );
        expect(putBPResponse.data).toBeTruthy();
        expect(putBPResponse.status).toBe(200);

        getBPResponse = await GET(
            `${businessPartner}/${bpId}?$expand=person($expand=nameDetails)`,
            { auth: admin }
        );
        const nameDetails = getBPResponse.data.person.nameDetails;
        expect(nameDetails.firstName).toBe('newFirst');
        expect(nameDetails.middleName).toBe('newMiddle');
        expect(nameDetails.lastName).toBe('newLast');
    });

    it(`should succeed on making a POST call on level 1 and level 2 subentities ${traceIssue2}`, async () => {
        let postBPResponse = await POST(
            `${businessPartner}(${bpId})/addressData`,
            {
                ...bpPostPayload.addressData[0],
                personPostalAddress: {
                    ...bpPostPayload.addressData[0].personPostalAddress,
                    houseNumber: '777',
                },
                validTo: '9999-12-31',
            },
            { auth: admin }
        );
        const addressDataId = postBPResponse.data.id;
        expect(postBPResponse.data).toBeTruthy();
        expect(postBPResponse.status).toBe(201);

        let getBPResponse = await GET(
            `${businessPartner}/${bpId}?$expand=addressData($expand=*)`,
            { auth: admin }
        );
        let addressDataList = getBPResponse.data.addressData;
        let addressData = addressDataList.filter(
            (x) => x.id === addressDataId
        )[0];
        expect(addressData.validTo).toBe('9999-12-31');

        // create a new  email address
        postBPResponse = await POST(
            `${businessPartner}/${bpId}/addressData(${addressDataId})/emailAddresses`,
            { address: 'test4@test.com' },
            { auth: admin }
        );
        emailAddressId = postBPResponse.data.id;
        expect(postBPResponse.data).toBeTruthy();
        expect(postBPResponse.status).toBe(201);

        getBPResponse = await GET(
            `${businessPartner}/${bpId}?$expand=addressData($expand=emailAddresses)`,
            { auth: admin }
        );
        addressDataList = getBPResponse.data.addressData;
        addressData = addressDataList.filter((x) => x.id === addressDataId)[0];
        const emailAddresses = addressData.emailAddresses;
        emailAddress = emailAddresses.filter((x) => x.id === emailAddressId)[0];
        expect(emailAddress.id).toBe(emailAddressId);
        expect(emailAddress.address).toBe('test4@test.com');
    });

    it(`should succeed on making a PATCH call on level 1 subentity to add, edit, and delete level 2 subentities with / and () syntax ${traceIssue2}`, async () => {
        // delete all emailAddresses via PUT addressData
        let putBPResponse = await PATCH(
            `${businessPartner}/${bpId}/addressData(${addressDataId})`,
            {
                emailAddresses: [],
            },
            { auth: admin }
        );
        expect(putBPResponse.data).toBeTruthy();
        expect(putBPResponse.status).toBe(200);

        let getBPResponse = await GET(
            `${businessPartner}/${bpId}?$expand=addressData($expand=*)`,
            { auth: admin }
        );
        let addressData = getBPResponse.data.addressData[0];
        let emailAddresses = addressData.emailAddresses;
        expect(addressData.personPostalAddress.houseNumber).toBe('778');
        expect(addressData.personPostalAddress.postCode).toBe('99003');
        expect(emailAddresses?.length).toBeFalsy;

        // add 2 emailAddresses via PUT addressData
        putBPResponse = await PATCH(
            `${businessPartner}(${bpId})/addressData(${addressDataId})`,
            {
                emailAddresses: [
                    { address: 'test1@test.com' },
                    { address: 'test2@test.com' },
                ],
            },
            { auth: admin }
        );
        expect(putBPResponse.data).toBeTruthy();
        expect(putBPResponse.status).toBe(200);

        getBPResponse = await GET(
            `${businessPartner}(${bpId})?$expand=addressData($expand=*)`,
            { auth: admin }
        );
        addressData = getBPResponse.data.addressData[0];
        emailAddresses = addressData.emailAddresses;
        const emailArr = ['test1@test.com', 'test2@test.com'];
        expect(addressData.personPostalAddress.houseNumber).toBe('778');
        expect(addressData.personPostalAddress.postCode).toBe('99003');
        expect(emailAddresses.length).toBe(2);
        expect(emailArr.includes(emailAddresses[0].address)).toBeTruthy;
        expect(emailArr.includes(emailAddresses[1].address)).toBeTruthy;

        // replace all emailAddresses with a single email address via PUT addressData
        putBPResponse = await PATCH(
            `${businessPartner}(${bpId})/addressData/${addressDataId}`,
            {
                emailAddresses: [{ address: 'test3@test.com' }],
            },
            { auth: admin }
        );
        expect(putBPResponse.data).toBeTruthy();
        expect(putBPResponse.status).toBe(200);

        getBPResponse = await GET(
            `${businessPartner}(${bpId})?$expand=addressData($expand=*)`,
            { auth: admin }
        );

        addressData = getBPResponse.data.addressData[0];
        emailAddresses = addressData.emailAddresses;
        expect(addressData.personPostalAddress.houseNumber).toBe('778');
        expect(addressData.personPostalAddress.postCode).toBe('99003');
        expect(emailAddresses.length).toBe(1);
        expect(emailAddresses[0].address).toBe('test3@test.com');
    });

    it(`should succeed on making a PATCH call on level 2 subentity ${traceIssue2}`, async () => {
        // update email address
        let putBPResponse = await PATCH(
            `${businessPartner}/${bpId}/addressData(${addressDataId})/emailAddresses/${emailAddressId}`,
            { address: 'test1@test.com' },
            { auth: admin }
        );
        expect(putBPResponse.data).toBeTruthy();
        expect(putBPResponse.status).toBe(200);

        let getBPResponse = await GET(
            `${businessPartner}/${bpId}?$expand=addressData($expand=*)`,
            { auth: admin }
        );
        let addressData = getBPResponse.data.addressData[0];
        let emailAddresses = addressData.emailAddresses;
        expect(addressData.personPostalAddress.houseNumber).toBe('778');
        expect(addressData.personPostalAddress.postCode).toBe('99003');
        expect(emailAddresses[0].address).toBe('test1@test.com');

        // update nameDetails
        putBPResponse = await PATCH(
            `${businessPartner}/${bpId}/person/nameDetails`,
            {
                firstName: 'newFirst',
                middleName: 'newMiddle',
            },
            { auth: admin }
        );
        expect(putBPResponse.data).toBeTruthy();
        expect(putBPResponse.status).toBe(200);

        getBPResponse = await GET(
            `${businessPartner}/${bpId}?$expand=person($expand=nameDetails)`,
            { auth: admin }
        );
        const nameDetails = getBPResponse.data.person.nameDetails;
        expect(nameDetails.firstName).toBe('newFirst');
        expect(nameDetails.middleName).toBe('newMiddle');
        expect(nameDetails.lastName).toBe('Haynes');
    });

    it(`should fail on making a PUT call on subentites with missing fields ${traceIssue2}`, async () => {
        const bpPayload = bpValidationMock.bpPersonMissingPostalAddressFields;
        const addressDataPayload = bpPayload.addressData[1];
        await expect(async () => {
            await PUT(
                `${businessPartner}/${bpId}/addressData(${addressDataId})`,
                addressDataPayload,
                { auth: admin }
            );
        }).rejects.toThrowError(
            `${error.BusinessPartnerSRVMultipleErrorsOccured().code} - ${
                error.BusinessPartnerSRVMultipleErrorsOccured().message
            }`
        );

        await expect(async () => {
            await PUT(
                `${businessPartner}/${bpId}/person/nameDetails`,
                { firstName: 'Clark' },
                { auth: admin }
            );
        }).rejects.toThrowError(
            `${error.BusinessPartnerSRVValueRequired('lastName').code} - ${
                error.BusinessPartnerSRVValueRequired('lastName').message
            }`
        );
        await expect(async () => {
            await PUT(
                `${businessPartner}/${bpId}/addressData/${addressDataId}/personPostalAddress`,
                { houseNumber: '126' },
                { auth: admin }
            );
        }).rejects.toThrowError(
            `${error.BusinessPartnerSRVMultipleErrorsOccured().code} - ${
                error.BusinessPartnerSRVMultipleErrorsOccured().message
            }`
        );
    });

    it(`should fail on making a POST call on subentites with missing fields ${traceIssue2}`, async () => {
        const bpPayload = bpValidationMock.bpPersonMissingPostalAddressFields;
        const addressDataMissingPostalAddressFields = bpPayload.addressData[1];
        await expect(async () => {
            await POST(
                `${businessPartner}/${bpId}/addressData`,
                addressDataMissingPostalAddressFields,
                { auth: admin }
            );
        }).rejects.toThrowError(
            `${error.BusinessPartnerSRVMultipleErrorsOccured().code} - ${
                error.BusinessPartnerSRVMultipleErrorsOccured().message
            }`
        );

        // Note that we currently don't have validations for level 2 entities that are compositions of many
        //   so that scenario cannot be tested
    });

    it(`should fail on making a PATCH call on subentites with missing fields ${traceIssue2}`, async () => {
        postBPResponse = await POST(
            businessPartner,
            bpValidationMock.bpOrgValid,
            { auth: admin }
        );
        bpId = postBPResponse.data.id;
        expect(postBPResponse.data).toBeTruthy();
        expect(postBPResponse.status).toBe(201);
        expect(bpId).toBeTruthy;

        await expect(async () => {
            await PATCH(
                `${businessPartner}/${bpId}/organization`,
                { nameDetails: { formattedOrgNameLine1: null } },
                { auth: admin }
            );
        }).rejects.toThrowError(
            `${
                error.BusinessPartnerSRVValueRequired('formattedOrgNameLine1')
                    .code
            } - ${
                error.BusinessPartnerSRVValueRequired('formattedOrgNameLine1')
                    .message
            }`
        );
    });

    it(`should allow the deletion at tax at subentity level ${traceIssue4}`, async () => {
        const createPayload = { ...bpMock.completeBpPersonMix1 };

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });

        expect(postRes.data).toBeTruthy();
        expect(postRes.status).toBe(201);

        let taxCode = postRes.data.taxNumbers[0].taxNumberType.code;

        const { status: delStatus3 } = await DELETE(
            `${businessPartner}(${postRes.data.id})/taxNumbers('${taxCode}')`,
            { auth: admin }
        );
        expect(delStatus3).toBe(204);
    });

    it(`should allow the deletion at bankAccount at subentity level ${traceIssue4}`, async () => {
        const createPayload = { ...bpMock.completeBpPersonMix1 };

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });

        expect(postRes.data).toBeTruthy();
        expect(postRes.status).toBe(201);

        let bpBankId = postRes.data.bankAccounts[0].id;

        const { status: delStatus } = await DELETE(
            `${businessPartner}(${postRes.data.id})/bankAccounts(id='${bpBankId}')`,
            { auth: admin }
        );
        expect(delStatus).toBe(204);
    });

    it(`should allow the deletion at addressData at subentity level but not allow to delete all addressData ${traceIssue4}`, async () => {
        const usagesNotRequired =
            bpMock.completeBpPersonMix1.addressData[1].usages.filter(
                (usage) => usage.usage.code !== 'XXDEFAULT'
            );
        const createPayload = {
            ...bpMock.completeBpPersonMix1,
            addressData: [
                {
                    ...bpMock.completeBpPersonMix1.addressData[0],
                    usages: [...usagesNotRequired],
                },
                {
                    ...bpMock.completeBpPersonMix1.addressData[1],
                    usages: [...usagesNotRequired],
                },
            ],
        };

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });

        expect(postRes.data).toBeTruthy();
        expect(postRes.status).toBe(201);

        let bpAddressId1 = postRes.data.addressData[0].id;
        let bpAddressId2 = postRes.data.addressData[1].id;

        // Address data deletion, We have 2 address, So deletion should be allow 1st request and this entity is mandatory so should not allow for 2nd request
        const { status: delStatus2 } = await DELETE(
            `${businessPartner}(${postRes.data.id})/addressData(${bpAddressId1})`,
            { auth: admin }
        );
        expect(delStatus2).toBe(204);

        await expect(async () => {
            await DELETE(
                `${businessPartner}(${postRes.data.id})/addressData(${bpAddressId2})`,
                { auth: admin }
            );
        }).rejects.toThrowError(
            '400 - Enter a value for the parameter addressData'
        );
    });

    it(`should allow the deletion of Email address which is at next subEntity level under addressData ${traceIssue4}`, async () => {
        const createPayload = { ...bpMock.completeBpPersonMix1 };

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });

        expect(postRes.data).toBeTruthy();
        expect(postRes.status).toBe(201);

        let bpAddressId1 = postRes.data.addressData[0].id;
        let emailAddressId1 = postRes.data.addressData[0].emailAddresses[0].id;

        // Address data deletion, We have 2 address, So deletion should be allow 1st request and this entity is mandatory so should not allow for 2nd request
        const { status: delStatus } = await DELETE(
            `${businessPartner}(${postRes.data.id})/addressData(${bpAddressId1})/emailAddresses(${emailAddressId1})`,
            { auth: admin }
        );
        expect(delStatus).toBe(204);
    });

    it(`should allow the deletion of Phone Number which is at next subEntity level under addressData ${traceIssue4}`, async () => {
        const createPayload = { ...bpMock.completeBpPersonMix1 };

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });

        expect(postRes.data).toBeTruthy();
        expect(postRes.status).toBe(201);

        let bpAddressId1 = postRes.data.addressData[0].id;
        let phoneNumberId1 = postRes.data.addressData[0].phoneNumbers[0].id;

        // Address data deletion, We have 2 address, So deletion should be allow 1st request and this entity is mandatory so should not allow for 2nd request
        const { status: delStatus } = await DELETE(
            `${businessPartner}(${postRes.data.id})/addressData(${bpAddressId1})/phoneNumbers(${phoneNumberId1})`,
            { auth: admin }
        );
        expect(delStatus).toBe(204);
    });

    it(`should allow the deletion of sales arrangements which is at next subEntity level under customerInformation ${traceIssue4}`, async () => {
        const createPayload = { ...bpMock.completeBpPersonMix1 };

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });

        expect(postRes.data).toBeTruthy();
        expect(postRes.status).toBe(201);

        let salesOrgId =
            postRes.data.customerInformation.salesArrangements[0].salesAreaRef
                .salesOrganizationDisplayId;
        let distChnl =
            postRes.data.customerInformation.salesArrangements[0].salesAreaRef
                .distributionChannel;
        let div =
            postRes.data.customerInformation.salesArrangements[0].salesAreaRef
                .division;
        let funcName =
            postRes.data.customerInformation.salesArrangements[0].functions[0]
                .functionName;

        const { status: delStatus } = await DELETE(
            `${businessPartner}(${postRes.data.id})/customerInformation/salesArrangements(salesOrganizationDisplayId='${salesOrgId}',distributionChannel='${distChnl}',division='${div}')/functions(functionName='${funcName}')`,
            { auth: admin }
        );
        expect(delStatus).toBe(204);
    });
});
