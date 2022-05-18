const expect = require('expect');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const { launchServer, mockServerConf } = require('../lib/testkit');
const {
    commonSetupConfigCodes,
    bpSetupConfigCodes,
} = require('./payload/BusinessPartnerSetupRequiredCodes');
const bpError = require('../../srv/lib/businesspartner/BusinessPartnerErrorMessages');
const bpMock = require('./payload/BusinessPartnerMockPayload');

const {
    createConfigurationDataSet,
} = require('./payload/ConfigurationDataHelper');

const { extractEntityAndKeys } = require('../../srv/lib/helper');
const {
    extractBpEntityId,
    getExpandedBP,
    constructBPForCreateSubEntity,
    constructBPForUpdateSubEntity,
    constructBPForDeleteSubEntity,
} = require('../../srv/lib/businesspartner/businessPartnerHelper')();

jest.mock('../../srv/api/businesspartner/BusinessPartnerService');
const bpService = require('../../srv/api/businesspartner/BusinessPartnerService');
const { BPODMVERSION } = require('../../srv/lib/config');

// traceability
const traceIssue1 = 'UTILITIESCLOUDSOLUTION-2916';
const traceIssue2 = 'UTILITIESCLOUDSOLUTION-3018';
const traceIssue3 = 'UTILITIESCLOUDSOLUTION-3012';

// Legend:
// [BETA] = need to update line/s below when moving (from beta) to release

// [BETA] - enable (beta) error messages
const error = bpError();

// [BETA] - update endpoints below when changing versions
const businessPartnerApi = `/api/businessPartner/v1`;
const businessPartnerConfigApi = `/api/businessPartner/v1/config`;
const commonConfigApi = `/api/config/v1`;

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

const { GET, POST, PUT, PATCH, DELETE, admin } = launchServer({
    service: {
        paths: servicePaths,
    },
});

describe('BusinessPartnerService service request it-test (CAP request object)', () => {
    let testEntityAndKeys;
    let testConstructedBp;
    let bpObj;

    bpService.mockImplementation(async (srv) => {
        srv.before('CREATE', '*', async (req) => {
            if (
                req.path.startsWith(`BusinessPartnerService.BusinessPartner/`)
            ) {
                testEntityAndKeys = extractEntityAndKeys(req.query);
                const bpId = extractBpEntityId(req);
                const expandedBp = await getExpandedBP(bpId);
                testConstructedBp = constructBPForCreateSubEntity(
                    req,
                    expandedBp
                );
            }
        });
        srv.before('UPDATE', '*', async (req) => {
            testEntityAndKeys = extractEntityAndKeys(req.query);
            const bpId = extractBpEntityId(req);
            const expandedBp = await getExpandedBP(bpId);
            testConstructedBp = constructBPForUpdateSubEntity(req, expandedBp);
        });
        srv.before('DELETE', '*', async (req) => {
            testEntityAndKeys = extractEntityAndKeys(req.query);
            const bpId = extractBpEntityId(req);
            const expandedBp = await getExpandedBP(bpId);
            testConstructedBp = constructBPForDeleteSubEntity(req, expandedBp);
        });
    });

    const businessPartner = `${businessPartnerApi}/BusinessPartner`;
    const expandQuery = `$expand=person($expand=nameDetails),organization($expand=nameDetails),roles,bankAccounts,taxNumbers,addressData($expand=usages,emailAddresses,phoneNumbers,personPostalAddress,organizationPostalAddress),customerInformation($expand=salesArrangements($expand=functions),taxClassifications($expand=taxClassification))`;

    const bpPostPayload = bpMock.completeBpPersonMix1;

    let postBPResponse;
    let bpId;
    let addressDataId;
    let emailAddressId;
    let roleCode;
    let usageCode;
    let usageValidTo;
    let salesOrgDisplayId;
    let distChannel;
    let div;
    let countryCode;
    let taxCategoryCode;
    let funcName;

    // Mock the destination
    const destName = 'C4UF-MDI';
    const destUrl = 'https://mdi-test.com';

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

    function reformatObject(obj, exclude = []) {
        const objTemp = obj;

        const isKeyNotNeeded = (key) =>
            exclude.includes(key) ||
            key.includes('up__') ||
            objTemp[key] === null;

        const isKeyAnAssociation = (key) =>
            !key.startsWith('_') && key.split('_').length > 1;

        const keys = Object.keys(objTemp);
        keys.forEach((key) => {
            if (isKeyNotNeeded(key)) {
                delete objTemp[key];
            } else if (isKeyAnAssociation(key)) {
                objTemp[key.split(/_(.+)/)[0]] = objTemp[key]
                    ? {
                          [key.split(/_(.+)/)[1]]: objTemp[key],
                      }
                    : objTemp[key];
                delete objTemp[key];
            } else if (objTemp[key] instanceof Object) {
                const exclude2 = [...exclude, 'isBlocked', 'isDefault'];
                reformatObject(objTemp[key], exclude2);
            }
        });
    }

    beforeAll(async () => {
        // [BETA] - manually change feature flag return value
        const featureFlags = await cds.connect.to('featureFlags');
        featureFlags.set('business-partner-enhancements', false);

        // setup BP config codes
        await commonSetupConfigCodes(POST, commonConfigApi, admin);
        await bpSetupConfigCodes(POST, businessPartnerConfigApi, admin);

        // setup configuration data
        await createConfigurationDataSet(admin, POST);

        mockServer.listen(mockServerConf);
    });

    beforeEach(async () => {
        // make a BP with an email address for each test
        postBPResponse = await POST(businessPartner, bpPostPayload, {
            auth: admin,
        });

        const addressData = postBPResponse.data.addressData[0];
        const role = postBPResponse.data.roles[0];
        const salesArrangement =
            postBPResponse.data.customerInformation.salesArrangements[0];
        const partnerFunction =
            postBPResponse.data.customerInformation.salesArrangements[0]
                .functions[0];
        const taxClassification =
            postBPResponse.data.customerInformation.taxClassifications[0];
        const emailAddress = addressData.emailAddresses[0];
        const usage = addressData.usages[0];

        bpId = postBPResponse.data.id;
        addressDataId = addressData.id;
        emailAddressId = emailAddress.id;
        roleCode = role.role.code;
        usageCode = usage.usage.code;
        usageValidTo = usage.validTo;
        salesOrgDisplayId =
            salesArrangement.salesAreaRef.salesOrganizationDisplayId;
        distChannel = salesArrangement.salesAreaRef.distributionChannel;
        div = salesArrangement.salesAreaRef.division;
        funcName = partnerFunction.functionName;
        countryCode = taxClassification.country.code;
        taxCatCode = taxClassification.taxCategory.code;

        expect(postBPResponse.data).toBeTruthy();
        expect(postBPResponse.status).toBe(201);
        expect(bpId).toBeTruthy;
        expect(addressDataId).toBeTruthy;
        expect(emailAddressId).toBeTruthy;
        expect(roleCode).toBeTruthy;
        expect(usageCode).toBeTruthy;
        expect(usageValidTo).toBeTruthy;
        expect(salesOrgDisplayId).toBeTruthy;
        expect(distChannel).toBeTruthy;
        expect(div).toBeTruthy;
        expect(funcName).toBeTruthy;
        expect(countryCode).toBeTruthy;
        expect(taxCatCode).toBeTruthy;
    });

    afterAll(() => {
        mockServer.close();
    });

    afterEach(() => {
        mockServer.resetHandlers();
        jest.clearAllMocks();
    });

    it(`should extract entity and keys and construct proper object for POST ${traceIssue2}`, async () => {
        let payload;

        // POST addressData
        payload = { ...bpMock.completeBpPersonMix2.addressData[0] };
        delete payload.id;
        await POST(`${businessPartner}/${bpId}/addressData`, payload, {
            auth: admin,
        });
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(2);
        expect(testEntityAndKeys[1].entity).toBe('addressData');
        expect(testEntityAndKeys[1].keys).toBeUndefined();

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        bpObj.addressData.forEach((address) => {
            expect(testConstructedBp.addressData).toContainEqual(address);
        });

        // POST addressData/usages
        payload = { ...bpMock.completeBpPersonMix2.addressData[0].usages[1] };
        await POST(
            `${businessPartner}/${bpId}/addressData/${addressDataId}/usages`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[2].entity).toBe('usages');
        expect(testEntityAndKeys[2].keys).toBeUndefined();

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        const addressData = testConstructedBp.addressData.filter(
            (address) => address.id === addressDataId
        )[0];
        bpObj.addressData
            .filter((address) => address.id === addressDataId)[0]
            .usages.forEach((usage) => {
                expect(addressData.usages).toContainEqual(usage);
            });

        // POST customerInformation/salesArrangements/functions
        payload = {
            ...bpMock.completeBpPersonMix2.customerInformation
                .salesArrangements[0].functions[0],
            functionName: 'test-functionName',
        };
        await POST(
            `${businessPartner}/${bpId}/customerInformation/salesArrangements(salesOrganizationDisplayId='${salesOrgDisplayId}',distributionChannel='${distChannel}',division='${div}')/functions`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(4);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('salesArrangements');
        expect(testEntityAndKeys[3].entity).toBe('functions');
        expect(testEntityAndKeys[3].keys).toBeUndefined();

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        const salesArrangement =
            testConstructedBp.customerInformation.salesArrangements.filter(
                (sA) =>
                    sA.salesAreaRef.salesOrganizationDisplayId ===
                        salesOrgDisplayId &&
                    sA.salesAreaRef.distributionChannel === distChannel &&
                    sA.salesAreaRef.division === div
            )[0];
        bpObj.customerInformation.salesArrangements
            .filter(
                (sA) =>
                    sA.salesAreaRef.salesOrganizationDisplayId ===
                        salesOrgDisplayId &&
                    sA.salesAreaRef.distributionChannel === distChannel &&
                    sA.salesAreaRef.division === div
            )[0]
            .functions.forEach((func) => {
                expect(salesArrangement.functions).toContainEqual(func);
            });

        // POST customerInformation/salesArrangements
        payload = {
            ...bpMock.completeBpPersonMix2.customerInformation
                .salesArrangements[0],
            salesAreaRef: {
                salesOrganizationDisplayId: '1010',
                distributionChannel: '20',
                division: '00',
            },
        };
        await POST(
            `${businessPartner}/${bpId}/customerInformation/salesArrangements`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('salesArrangements');
        expect(testEntityAndKeys[2].keys).toBeUndefined();

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        const custInfo1 = testConstructedBp.customerInformation;
        bpObj.customerInformation.salesArrangements.forEach((sA) => {
            expect(custInfo1.salesArrangements).toContainEqual(sA);
        });

        // POST customerInformation/taxClassifications
        payload = {
            ...bpMock.completeBpPersonMix2.customerInformation
                .taxClassifications[1],
            country: {
                code: 'CA',
            },
        };
        await POST(
            `${businessPartner}/${bpId}/customerInformation/taxClassifications`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('taxClassifications');
        expect(testEntityAndKeys[2].keys).toBeUndefined();

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        const custInfo2 = testConstructedBp.customerInformation;
        bpObj.customerInformation.taxClassifications.forEach((tC) => {
            expect(custInfo2.taxClassifications).toContainEqual(tC);
        });
    });

    it(`should extract entity and keys and construct proper object for PUT ${traceIssue2}`, async () => {
        // PUT
        await PUT(`${businessPartner}/${bpId}`, bpPostPayload, { auth: admin });
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(1);
        expect(testEntityAndKeys[0].entity).toBe('BusinessPartner');
        expect(testEntityAndKeys[0].keys).toHaveProperty('id');
        expect(testEntityAndKeys[0].keys.id).toBe(bpId);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // PUT addressData
        payload = { ...bpMock.completeBpPersonMix2.addressData[0] };
        await PUT(
            `${businessPartner}/${bpId}/addressData(${addressDataId})`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(2);
        expect(testEntityAndKeys[1].entity).toBe('addressData');
        expect(testEntityAndKeys[1].keys).toHaveProperty('id');
        expect(testEntityAndKeys[1].keys.id).toBe(addressDataId);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // PUT addressData/usages
        payload = { ...bpMock.completeBpPersonMix2.addressData[0].usages[0] };
        await PUT(
            `${businessPartner}/${bpId}/addressData/${addressDataId}/usages(code='${usageCode}',validTo=${usageValidTo})`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[2].entity).toBe('usages');
        expect(testEntityAndKeys[2].keys).toHaveProperty('usage_code');
        expect(testEntityAndKeys[2].keys).toHaveProperty('validTo');
        expect(testEntityAndKeys[2].keys.usage_code).toBe(usageCode);
        expect(testEntityAndKeys[2].keys.validTo).toBe(usageValidTo);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // PUT customerInformation/salesArrangements/functions
        payload = {
            ...bpMock.completeBpPersonMix2.customerInformation
                .salesArrangements[0].functions[0],
        };
        await PUT(
            `${businessPartner}/${bpId}/customerInformation/salesArrangements(salesOrganizationDisplayId='${salesOrgDisplayId}',distributionChannel='${distChannel}',division='${div}')/functions(functionName='${funcName}')`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(4);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('salesArrangements');
        expect(testEntityAndKeys[3].entity).toBe('functions');
        expect(testEntityAndKeys[3].keys).toHaveProperty('functionName');
        expect(testEntityAndKeys[3].keys.functionName).toBe(funcName);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // PUT customerInformation/salesArrangements
        await PUT(
            `${businessPartner}/${bpId}/customerInformation/salesArrangements(salesOrganizationDisplayId='${salesOrgDisplayId}',distributionChannel='${distChannel}',division='${div}')`,
            {},
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('salesArrangements');
        expect(testEntityAndKeys[2].keys).toHaveProperty(
            'salesAreaRef_salesOrganizationDisplayId'
        );
        expect(testEntityAndKeys[2].keys).toHaveProperty(
            'salesAreaRef_distributionChannel'
        );
        expect(testEntityAndKeys[2].keys).toHaveProperty(
            'salesAreaRef_division'
        );
        expect(
            testEntityAndKeys[2].keys.salesAreaRef_salesOrganizationDisplayId
        ).toBe(salesOrgDisplayId);
        expect(testEntityAndKeys[2].keys.salesAreaRef_distributionChannel).toBe(
            distChannel
        );
        expect(testEntityAndKeys[2].keys.salesAreaRef_division).toBe(div);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // PUT customerInformation/taxClassifications
        payload = {
            ...bpMock.completeBpPersonMix2.customerInformation
                .taxClassifications[0],
        };
        await PUT(
            `${businessPartner}/${bpId}/customerInformation/taxClassifications(code='${countryCode}',code_001='${taxCatCode}')`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('taxClassifications');
        expect(testEntityAndKeys[2].keys).toHaveProperty('country_code');
        expect(testEntityAndKeys[2].keys).toHaveProperty('taxCategory_code');
        expect(testEntityAndKeys[2].keys.country_code).toBe(countryCode);
        expect(testEntityAndKeys[2].keys.taxCategory_code).toBe(taxCatCode);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);
    });

    it(`should extract entity and keys and construct proper object for PATCH ${traceIssue2}`, async () => {
        // PATCH
        await PATCH(`${businessPartner}/${bpId}`, bpPostPayload, {
            auth: admin,
        });
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(1);
        expect(testEntityAndKeys[0].entity).toBe('BusinessPartner');
        expect(testEntityAndKeys[0].keys).toHaveProperty('id');
        expect(testEntityAndKeys[0].keys.id).toBe(bpId);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // PATCH addressData
        payload = { ...bpMock.completeBpPersonMix2.addressData[0] };
        await PATCH(
            `${businessPartner}/${bpId}/addressData(${addressDataId})`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(2);
        expect(testEntityAndKeys[1].entity).toBe('addressData');
        expect(testEntityAndKeys[1].keys).toHaveProperty('id');
        expect(testEntityAndKeys[1].keys.id).toBe(addressDataId);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // PATCH addressData/usages
        payload = { ...bpMock.completeBpPersonMix2.addressData[0].usages[0] };
        await PATCH(
            `${businessPartner}/${bpId}/addressData/${addressDataId}/usages(code='${usageCode}',validTo=${usageValidTo})`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[2].entity).toBe('usages');
        expect(testEntityAndKeys[2].keys).toHaveProperty('usage_code');
        expect(testEntityAndKeys[2].keys).toHaveProperty('validTo');
        expect(testEntityAndKeys[2].keys.usage_code).toBe(usageCode);
        expect(testEntityAndKeys[2].keys.validTo).toBe(usageValidTo);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // PATCH customerInformation/salesArrangements/functions
        payload = {
            ...bpMock.completeBpPersonMix2.customerInformation
                .salesArrangements[0].functions[0],
        };
        await PATCH(
            `${businessPartner}/${bpId}/customerInformation/salesArrangements(salesOrganizationDisplayId='${salesOrgDisplayId}',distributionChannel='${distChannel}',division='${div}')/functions(functionName='${funcName}')`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(4);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('salesArrangements');
        expect(testEntityAndKeys[3].entity).toBe('functions');
        expect(testEntityAndKeys[3].keys).toHaveProperty('functionName');
        expect(testEntityAndKeys[3].keys.functionName).toBe(funcName);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // PATCH customerInformation/salesArrangements
        await PATCH(
            `${businessPartner}/${bpId}/customerInformation/salesArrangements(salesOrganizationDisplayId='${salesOrgDisplayId}',distributionChannel='${distChannel}',division='${div}')`,
            {},
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('salesArrangements');
        expect(testEntityAndKeys[2].keys).toHaveProperty(
            'salesAreaRef_salesOrganizationDisplayId'
        );
        expect(testEntityAndKeys[2].keys).toHaveProperty(
            'salesAreaRef_distributionChannel'
        );
        expect(testEntityAndKeys[2].keys).toHaveProperty(
            'salesAreaRef_division'
        );
        expect(
            testEntityAndKeys[2].keys.salesAreaRef_salesOrganizationDisplayId
        ).toBe(salesOrgDisplayId);
        expect(testEntityAndKeys[2].keys.salesAreaRef_distributionChannel).toBe(
            distChannel
        );
        expect(testEntityAndKeys[2].keys.salesAreaRef_division).toBe(div);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // PATCH customerInformation/taxClassifications
        payload = {
            ...bpMock.completeBpPersonMix2.customerInformation
                .taxClassifications[0],
        };
        await PATCH(
            `${businessPartner}/${bpId}/customerInformation/taxClassifications(code='${countryCode}',code_001='${taxCatCode}')`,
            payload,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('taxClassifications');
        expect(testEntityAndKeys[2].keys).toHaveProperty('country_code');
        expect(testEntityAndKeys[2].keys).toHaveProperty('taxCategory_code');
        expect(testEntityAndKeys[2].keys.country_code).toBe(countryCode);
        expect(testEntityAndKeys[2].keys.taxCategory_code).toBe(taxCatCode);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);
    });

    it(`should extract entity and keys and construct proper object for DELETE ${traceIssue2}`, async () => {
        // DELETE addressData/usages
        await DELETE(
            `${businessPartner}/${bpId}/addressData/${addressDataId}/usages(code='${usageCode}',validTo=${usageValidTo})`,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[2].entity).toBe('usages');
        expect(testEntityAndKeys[2].keys).toHaveProperty('usage_code');
        expect(testEntityAndKeys[2].keys).toHaveProperty('validTo');
        expect(testEntityAndKeys[2].keys.usage_code).toBe(usageCode);
        expect(testEntityAndKeys[2].keys.validTo).toBe(usageValidTo);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // DELETE addressData
        await DELETE(
            `${businessPartner}/${bpId}/addressData(${addressDataId})`,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(2);
        expect(testEntityAndKeys[1].entity).toBe('addressData');
        expect(testEntityAndKeys[1].keys).toHaveProperty('id');
        expect(testEntityAndKeys[1].keys.id).toBe(addressDataId);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // DELETE customerInformation/salesArrangements/functions
        await DELETE(
            `${businessPartner}/${bpId}/customerInformation/salesArrangements(salesOrganizationDisplayId='${salesOrgDisplayId}',distributionChannel='${distChannel}',division='${div}')/functions(functionName='${funcName}')`,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(4);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('salesArrangements');
        expect(testEntityAndKeys[3].entity).toBe('functions');
        expect(testEntityAndKeys[3].keys).toHaveProperty('functionName');
        expect(testEntityAndKeys[3].keys.functionName).toBe(funcName);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // DELETE customerInformation/salesArrangements
        await DELETE(
            `${businessPartner}/${bpId}/customerInformation/salesArrangements(salesOrganizationDisplayId='${salesOrgDisplayId}',distributionChannel='${distChannel}',division='${div}')`,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('salesArrangements');
        expect(testEntityAndKeys[2].keys).toHaveProperty(
            'salesAreaRef_salesOrganizationDisplayId'
        );
        expect(testEntityAndKeys[2].keys).toHaveProperty(
            'salesAreaRef_distributionChannel'
        );
        expect(testEntityAndKeys[2].keys).toHaveProperty(
            'salesAreaRef_division'
        );
        expect(
            testEntityAndKeys[2].keys.salesAreaRef_salesOrganizationDisplayId
        ).toBe(salesOrgDisplayId);
        expect(testEntityAndKeys[2].keys.salesAreaRef_distributionChannel).toBe(
            distChannel
        );
        expect(testEntityAndKeys[2].keys.salesAreaRef_division).toBe(div);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);

        // DELETE customerInformation/taxClassifications
        await DELETE(
            `${businessPartner}/${bpId}/customerInformation/taxClassifications(code='${countryCode}',code_001='${taxCatCode}')`,
            { auth: admin }
        );
        // check if helper function extracts properly
        expect(testEntityAndKeys).toHaveLength(3);
        expect(testEntityAndKeys[1].entity).toBe('customerInformation');
        expect(testEntityAndKeys[2].entity).toBe('taxClassifications');
        expect(testEntityAndKeys[2].keys).toHaveProperty('country_code');
        expect(testEntityAndKeys[2].keys).toHaveProperty('taxCategory_code');
        expect(testEntityAndKeys[2].keys.country_code).toBe(countryCode);
        expect(testEntityAndKeys[2].keys.taxCategory_code).toBe(taxCatCode);

        // check constructed BP
        ({ data: bpObj } = await GET(
            `${businessPartner}/${bpId}?${expandQuery}`,
            {
                auth: admin,
            }
        ));
        reformatObject(testConstructedBp);
        reformatObject(bpObj, ['@odata.context']);
        expect(testConstructedBp).toStrictEqual(bpObj);
    });
});
