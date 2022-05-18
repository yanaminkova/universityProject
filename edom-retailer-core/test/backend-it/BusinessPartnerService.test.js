const expect = require('expect');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const { launchServer, mockServerConf } = require('../lib/testkit');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
const { createBusinessPartnerDB } = require('../lib/functions');
const bpMock = require('./payload/BusinessPartnerMockPayload');
const bpValidationMock = require('./payload/BusinessPartnerValidationMockPayloads');
const {
    commonSetupConfigCodes,
    bpSetupConfigCodes,
} = require('./payload/BusinessPartnerSetupRequiredCodes');
const bpError = require('../../srv/lib/businesspartner/BusinessPartnerErrorMessages');

const {
    createConfigurationDataSet,
} = require('./payload/ConfigurationDataHelper');

const { TextBundle } = require('@sap/textbundle');
const { BPODMVERSION } = require('../../srv/lib/config');
const bundle = new TextBundle('../../_i18n/i18n', ' ');

// traceability
const traceIssue1 = 'UTILITIESCLOUDSOLUTION-2916';
const traceIssue2 = 'UTILITIESCLOUDSOLUTION-3018';
const traceIssue3 = 'UTILITIESCLOUDSOLUTION-3012';

// Legend:
// [BETA] = need to update line/s below when moving (from beta) to release

// [BETA] - enable (beta) error messages
const error = bpError()(bundle);

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

const { POST, PUT, PATCH, admin } = launchServer({
    service: {
        paths: servicePaths,
    },
});

describe('BusinessPartnerService it-test', () => {
    const businessPartner = `${businessPartnerApi}/BusinessPartner`;

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

    let bpOrgId,
        bpPersonId,
        bpOrgSpId,
        bpPersonAddressId,
        bpOrgAddressId,
        bpOrgSpAddressId,
        others;
    let {
        BusinessPartnerSRVMultipleErrorsOccured,
        BusinessPartnerSRVValueRequired,
        BusinessPartnerSRVBpTypeChangeNotSupported,
        BusinessPartnerSRVBpGroupNotSupported,
        BusinessPartnerSRVSpMustBeTypeOrg,
        BusinessPartnerSRVMissingMdiBookkeeping,
        BusinessPartnerSRVMarketFunctionCodeNumberInUse,
    } = error;

    const { code: codeTypeChNotSupp, message: msgTypeChNotSupp } =
        BusinessPartnerSRVBpTypeChangeNotSupported;
    const { code: codeBpGrpNotSupp, message: msgBpGrpNotSupp } =
        BusinessPartnerSRVBpGroupNotSupported;
    const { code: codeSpTypeOrg, message: msgSpTypeOrg } =
        BusinessPartnerSRVSpMustBeTypeOrg;
    const { code: codeMissMdiBook, message: msgMissMdiBook } =
        BusinessPartnerSRVMissingMdiBookkeeping;
    const { code: codeMrktFuncInUse, message: msgMrktFuncInUse } =
        BusinessPartnerSRVMarketFunctionCodeNumberInUse;
    const { code: codeMulti, message: msgMulti } =
        BusinessPartnerSRVMultipleErrorsOccured();
    const { code: codePerson, message: msgPerson } =
        BusinessPartnerSRVValueRequired('person');
    const { code: codeOrg, message: msgOrg } =
        BusinessPartnerSRVValueRequired('organization');
    const { code: codeNameDet, message: msgNameDet } =
        BusinessPartnerSRVValueRequired('nameDetails');
    const { code: codeFirsNam, message: msgFirsNam } =
        BusinessPartnerSRVValueRequired('firstName');
    const { code: codeLastNam, message: msgLastNam } =
        BusinessPartnerSRVValueRequired('lastName');
    const { code: codeOrgLin1, message: msgOrgLin1 } =
        BusinessPartnerSRVValueRequired('formattedOrgNameLine1');
    const { code: codeAddrDat, message: msgAddrDat } =
        BusinessPartnerSRVValueRequired('addressData');
    const { code: codePersPos, message: msgPersPos } =
        BusinessPartnerSRVValueRequired('personPostalAddress');
    const { code: codeOrgaPos, message: msgOrgaPos } =
        BusinessPartnerSRVValueRequired('organizationPostalAddress');
    const { code: codeCountry, message: msgCountry } =
        BusinessPartnerSRVValueRequired('country_code');
    const { code: codeTown, message: msgTown } =
        BusinessPartnerSRVValueRequired('town');
    const { code: codePrimReg, message: msgPrimReg } =
        BusinessPartnerSRVValueRequired('primaryRegion_code');
    const { code: codePostCod, message: msgPostCod } =
        BusinessPartnerSRVValueRequired('postCode');

    beforeAll(async () => {
        // [BETA] - manually change feature flag return value
        const featureFlags = await cds.connect.to('featureFlags');
        featureFlags.set('business-partner-enhancements', false);

        // setup BP config codes
        await commonSetupConfigCodes(POST, commonConfigApi, admin);
        await bpSetupConfigCodes(POST, businessPartnerConfigApi, admin);

        await createConfigurationDataSet(admin, POST);

        ({
            data: {
                id: bpOrgSpId,
                addressData: [bpOrgSpAddressId, ...others],
            },
        } = await POST(businessPartner, bpMock.completeBpOrgMix1, {
            auth: admin,
        }));

        mockServer.listen(mockServerConf);
    });

    beforeEach(async () => {
        // CAP issue should be raised - inserting to DB causes an Assertion Error to country_code
        // ({ id: bpPersonId } = await createBusinessPartnerDB(bpValidationMock.bpPersonValid))
        // ({ id: bpOrgId } = await createBusinessPartnerDB(bpValidationMock.bpOrgValid))
        // ({ id: bpOrgSpId } = await createBusinessPartnerDB(bpMock.completeBpOrgMix1))

        // workaround
        ({
            data: {
                id: bpPersonId,
                addressData: [{ id: bpPersonAddressId }, ...others],
            },
        } = await POST(businessPartner, bpValidationMock.bpPersonValid, {
            auth: admin,
        }));
        ({
            data: {
                id: bpOrgId,
                addressData: [bpOrgAddressId, ...others],
            },
        } = await POST(businessPartner, bpValidationMock.bpOrgValid, {
            auth: admin,
        }));
    });

    afterAll(() => {
        mockServer.close();
    });

    afterEach(() => {
        mockServer.resetHandlers();
        jest.clearAllMocks();
    });

    // Test for creating BP
    it(`should create organization type BP ${traceIssue1}`, async () => {
        const bpPayload = bpValidationMock.bpOrgValid;

        let { data, status } = await POST(businessPartner, bpPayload, {
            auth: admin,
        });

        expect(data).toBeTruthy();
        expect(status).toBe(201);

        // bpOrgId = data.id;
    });

    it(`should create and update organization type BP (complex payload) ${traceIssue1}`, async () => {
        const createPayload = { ...bpMock.completeBpOrgMix1 };
        delete createPayload.serviceProviderInformation;
        const updatePayload = { ...bpMock.completeBpOrgMix2 };
        delete updatePayload.serviceProviderInformation;

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });

        expect(postRes.data).toBeTruthy();
        expect(postRes.status).toBe(201);

        const putRes = await PUT(
            `${businessPartner}/${postRes.data.id}`,
            updatePayload,
            {
                auth: admin,
            }
        );

        expect(putRes.data).toBeTruthy();
        expect(putRes.status).toBe(200);
    });

    it(`should create person type BP (simple payload) ${traceIssue1}`, async () => {
        const bpPayload = bpValidationMock.bpPersonValid;

        let { data, status } = await POST(businessPartner, bpPayload, {
            auth: admin,
        });

        expect(data).toBeTruthy();
        expect(status).toBe(201);

        // bpPersonId = data.id;
    });

    it(`should create and update person type BP (complex payload) ${traceIssue1}`, async () => {
        const createPayload = { ...bpMock.completeBpPersonMix1 };
        const updatePayload = { ...bpMock.completeBpPersonMix2 };

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });

        expect(postRes.data).toBeTruthy();
        expect(postRes.status).toBe(201);

        const putRes = await PUT(
            `${businessPartner}/${postRes.data.id}`,
            updatePayload,
            {
                auth: admin,
            }
        );

        expect(putRes.data).toBeTruthy();
        expect(putRes.status).toBe(200);
    });

    it(`should create organization type SP ${traceIssue1}`, async () => {
        const bpPayload = bpValidationMock.bpOrgServiceProvider;

        let { data, status } = await POST(businessPartner, bpPayload, {
            auth: admin,
        });

        expect(data).toBeTruthy();
        expect(status).toBe(201);
    });

    it(`should create and update organization type SP (complex payload) ${traceIssue1}`, async () => {
        const createPayload = { ...bpMock.completeBpOrgMix1 };
        createPayload.serviceProviderInformation[0].marketFunctionCodeNumber1 =
            '0000';
        createPayload.serviceProviderInformation[0].marketFunctionCodeNumber2 =
            '0001';
        createPayload.serviceProviderInformation[1].marketFunctionCodeNumber1 =
            '0002';
        createPayload.serviceProviderInformation[1].marketFunctionCodeNumber2 =
            '0003';
        const updatePayload1 = { ...bpMock.completeBpOrgMix2 };
        updatePayload1.serviceProviderInformation[0].marketFunctionCodeNumber1 =
            '0010';
        updatePayload1.serviceProviderInformation[0].marketFunctionCodeNumber2 =
            '0011';
        updatePayload1.serviceProviderInformation[1].marketFunctionCodeNumber1 =
            '0012';
        updatePayload1.serviceProviderInformation[1].marketFunctionCodeNumber2 =
            '0013';
        const updatePayload2 = { ...bpMock.completeBpOrgMix2 };
        delete updatePayload2.serviceProviderInformation;

        const { data: postData, status: postStatus } = await POST(
            businessPartner,
            createPayload,
            {
                auth: admin,
            }
        );

        expect(postData).toBeTruthy();
        expect(postStatus).toBe(201);

        // bpOrgSpId = postData.id;

        const { data: putData1, status: putStatus1 } = await PUT(
            `${businessPartner}/${postData.id}`,
            updatePayload1,
            {
                auth: admin,
            }
        );

        expect(putData1).toBeTruthy();
        expect(putStatus1).toBe(200);

        const { data: putData2, status: putStatus2 } = await PATCH(
            `${businessPartner}/${postData.id}`,
            updatePayload2,
            {
                auth: admin,
            }
        );

        expect(putData2).toBeTruthy();
        expect(putStatus2).toBe(200);
    });

    // POST tests

    it(`should fail to create person type BP due to missing BP type ${traceIssue2}`, async () => {
        let bpPayload = bpValidationMock.bpPersonMissingBPType;

        await expect(async () => {
            await POST(businessPartner, bpPayload, { auth: admin });
        }).rejects.toThrowError('400 - Value is required');
    });

    it(`should fail to create (POST) person type BP due to missing person ${traceIssue2}`, async () => {
        const bpPayload = bpValidationMock.bpPersonMissingPerson;

        try {
            const { status } = await POST(businessPartner, bpPayload, {
                auth: admin,
            });
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePerson} - ${msgPerson}`);
        }
    });

    it(`should fail to create (POST) person type BP due to missing nameDetails in person ${traceIssue2}`, async () => {
        const bpPayload = bpValidationMock.bpPersonMissingNameDetails;

        try {
            const { status } = await POST(businessPartner, bpPayload, {
                auth: admin,
            });
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeNameDet} - ${msgNameDet}`);
        }
    });

    it(`should fail to create (POST) person type BP due to missing nameDetails fields in person ${traceIssue2}`, async () => {
        const bpPayload = bpValidationMock.bpPersonMissingNameDetailsFields;

        try {
            const { status } = await POST(businessPartner, bpPayload, {
                auth: admin,
            });
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeFirsNam} - ${msgFirsNam}`,
                `${codeLastNam} - ${msgLastNam}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to create (POST) person type BP due to missing addressData ${traceIssue2}`, async () => {
        let bpPayload = bpValidationMock.bpPersonMissingAddressData;

        try {
            const { status } = await POST(businessPartner, bpPayload, {
                auth: admin,
            });
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddrDat} - ${msgAddrDat}`);
        }

        bpPayload = bpValidationMock.bpPersonEmptyAddressData;
        try {
            const { status } = await POST(businessPartner, bpPayload, {
                auth: admin,
            });
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddrDat} - ${msgAddrDat}`);
        }
    });

    it(`should fail to create (POST) person type BP due to missing personPostalAddress in addressData ${traceIssue2}`, async () => {
        let bpPayload = bpValidationMock.bpPersonMissingPostalAddress;

        try {
            const { status } = await POST(businessPartner, bpPayload, {
                auth: admin,
            });
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePersPos} - ${msgPersPos}`);
        }
    });

    it(`should fail to create (POST) person type BP due to missing personPostalAddress fields in addressData ${traceIssue2}`, async () => {
        const bpPayload = bpValidationMock.bpPersonMissingPostalAddressFields;

        try {
            const { status } = await POST(businessPartner, bpPayload, {
                auth: admin,
            });
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(5);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeCountry} - ${msgCountry}`,
                `${codeTown} - ${msgTown}`,
                `${codePrimReg} - ${msgPrimReg}`,
                `${codePostCod} - ${msgPostCod}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to create (POST) person type BP due to missing person and addressData ${traceIssue2}`, async () => {
        let bpPayload = bpMock.basePerson;

        try {
            const { status } = await POST(businessPartner, bpPayload, {
                auth: admin,
            });
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codePerson} - ${msgPerson}`,
                `${codeAddrDat} - ${msgAddrDat}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }

        try {
            bpPayload = { ...bpMock.basePerson, addressData: [] };
            const { status } = await POST(businessPartner, bpPayload, {
                auth: admin,
            });
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codePerson} - ${msgPerson}`,
                `${codeAddrDat} - ${msgAddrDat}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to create (POST) person type BP due to missing nameDetails in person and addressData fields ${traceIssue2}`, async () => {
        const { person } = bpValidationMock.bpPersonMissingNameDetails;
        const { addressData } = bpValidationMock.bpPersonMissingPostalAddress;
        const bpPayload = { ...bpMock.basePerson, person, addressData };

        try {
            const { status } = await POST(businessPartner, bpPayload, {
                auth: admin,
            });
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeNameDet} - ${msgNameDet}`,
                `${codePersPos} - ${msgPersPos}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to create (POST) person type BP due to missing nameDetails fields in person and missing personPostalAddress fields ${traceIssue2}`, async () => {
        const { person } = bpValidationMock.bpPersonMissingNameDetailsFields;
        const { addressData } =
            bpValidationMock.bpPersonMissingPostalAddressFields;
        const bpPayload = { ...bpMock.basePerson, person, addressData };

        try {
            const { status } = await POST(businessPartner, bpPayload, {
                auth: admin,
            });
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(7);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeFirsNam} - ${msgFirsNam}`,
                `${codeLastNam} - ${msgLastNam}`,
                `${codeCountry} - ${msgCountry}`,
                `${codeTown} - ${msgTown}`,
                `${codePrimReg} - ${msgPrimReg}`,
                `${codePostCod} - ${msgPostCod}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    // PUT tests
    it(`should fail to update (PUT) BP type ${traceIssue2}`, async () => {
        let bpPUTPayload = { ...bpValidationMock.bpPersonMissingBPType };
        await expect(async () => {
            await PUT(`${businessPartner}/${bpPersonId}`, bpPUTPayload, {
                auth: admin,
            });
        }).rejects.toThrowError(`${codeTypeChNotSupp} - ${msgTypeChNotSupp}`);

        bpPUTPayload.businessPartnerType = 'organization';
        await expect(async () => {
            await PUT(`${businessPartner}/${bpPersonId}`, bpPUTPayload, {
                auth: admin,
            });
        }).rejects.toThrowError(`${codeTypeChNotSupp} - ${msgTypeChNotSupp}`);
    });

    // requires the user story ### to be merged
    it(`should update (PUT) person type BP even with missing person and addressData ${traceIssue2}`, async () => {
        // missing person
        const bpPayload = bpMock.basePerson;
        const { status } = await PUT(
            `${businessPartner}/${bpPersonId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PUT) person type BP due to null person (with addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing person
        try {
            bpPayload = {
                ...bpValidationMock.bpPersonMissingPerson,
                person: null,
            };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePerson} - ${msgPerson}`);
        }
    });

    it(`should fail to update (PUT) person type BP due to null person (without addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing person
        // payload doesn't include addressData but it should not throw an error with missing addressData
        try {
            bpPayload = {
                ...bpValidationMock.bpPersonMissingPerson,
                person: null,
            };
            delete bpPayload.addressData;
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePerson} - ${msgPerson}`);
        }
    });

    it(`should update (PUT) person type BP due to missing nameDetails in person ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing nameDetails in person
        bpPayload = bpValidationMock.bpPersonMissingNameDetails;
        const { status } = await PUT(
            `${businessPartner}/${bpPersonId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PUT) person type BP due to null nameDetails in person (with addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null nameDetails in person
        try {
            const { person } = bpValidationMock.bpPersonMissingNameDetails;
            bpPayload = {
                ...bpValidationMock.bpPersonMissingNameDetails,
                person: { ...person, nameDetails: null },
            };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeNameDet} - ${msgNameDet}`);
        }
    });

    it(`should fail to update (PUT) person type BP due to null nameDetails in person (without addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null nameDetails in person
        // payload doesn't include addressData but it should not throw an error with missing addressData
        try {
            const { person } = bpValidationMock.bpPersonMissingNameDetails;
            bpPayload = {
                ...bpValidationMock.bpPersonMissingNameDetails,
                person: { ...person, nameDetails: null },
            };
            delete bpPayload.addressData;
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeNameDet} - ${msgNameDet}`);
        }
    });

    it(`should update (PUT) person type BP even with missing nameDetails in person (via subentity) ${traceIssue2}`, async () => {
        // missing nameDetails in person (via subentity)
        const { person } = bpValidationMock.bpPersonMissingNameDetails;
        const bpPayload = { ...person };
        const { status } = await PUT(
            `${businessPartner}(${bpPersonId})/person`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PUT) person type BP due to null nameDetails in person (via subentity) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing nameDetails in person (via subentity)
        try {
            const { person } = bpValidationMock.bpPersonMissingNameDetails;
            bpPayload = { ...person, nameDetails: null };
            const { status } = await PUT(
                `${businessPartner}(${bpPersonId})/person`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeNameDet} - ${msgNameDet}`);
        }
    });

    it(`should fail to update (PUT) person type BP due to missing nameDetails fields in person (with addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing nameDetails fields in person
        try {
            bpPayload = bpValidationMock.bpPersonMissingNameDetailsFields;
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeFirsNam} - ${msgFirsNam}`,
                `${codeLastNam} - ${msgLastNam}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PUT) person type BP due to missing nameDetails fields in person (without addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing nameDetails fields in person
        // payload doesn't include addressData but it should not throw an error with missing addressData
        try {
            bpPayload = {
                ...bpValidationMock.bpPersonMissingNameDetailsFields,
            };
            delete bpPayload.addressData;
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeFirsNam} - ${msgFirsNam}`,
                `${codeLastNam} - ${msgLastNam}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PUT) person type BP due to missing nameDetails fields in person (via subentity) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing nameDetails fields in person
        try {
            const {
                person: { nameDetails },
            } = bpValidationMock.bpPersonMissingNameDetailsFields;
            bpPayload = nameDetails;
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}/person/nameDetails`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeFirsNam} - ${msgFirsNam}`,
                `${codeLastNam} - ${msgLastNam}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PUT) person type BP due to empty addressData (with person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // empty addressData
        try {
            bpPayload = bpValidationMock.bpPersonEmptyAddressData;
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddrDat} - ${msgAddrDat}`);
        }
    });

    it(`should fail to update (PUT) person type BP due to empty addressData (without person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // empty addressData
        // payload doesn't include person but it should not throw an error with missing person
        try {
            bpPayload = {
                ...bpValidationMock.bpPersonEmptyAddressData,
            };
            delete bpPayload.person;
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddrDat} - ${msgAddrDat}`);
        }
    });

    it(`should fail to update (PUT) person type BP due to missing personPostalAddress in addressData (with person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing personPostalAddress in addressData
        try {
            bpPayload = bpValidationMock.bpPersonMissingPostalAddress;
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePersPos} - ${msgPersPos}`);
        }
    });

    it(`should fail to update (PUT) person type BP due to missing personPostalAddress in addressData (without person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing personPostalAddress in addressData
        // payload doesn't include person but it should not throw an error with missing person
        try {
            bpPayload = { ...bpValidationMock.bpPersonMissingPostalAddress };
            delete bpPayload.person;
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePersPos} - ${msgPersPos}`);
        }
    });

    it(`should update (PUT) person type BP even with missing personPostalAddress in addressData (via subentity) ${traceIssue2}`, async () => {
        // missing personPostalAddress in addressData (via subentity)
        const {
            addressData: [_, address2],
        } = bpValidationMock.bpPersonMissingPostalAddress;
        const bpPayload = address2;
        const { status } = await PUT(
            `${businessPartner}/${bpPersonId}/addressData/${bpPersonAddressId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PUT) person type BP due to null personPostalAddress in addressData (via subentity) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null personPostalAddress in addressData (via subentity)
        try {
            const {
                addressData: [_, address2],
            } = bpValidationMock.bpPersonMissingPostalAddress;
            bpPayload = { ...address2, personPostalAddress: null };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}/addressData/${bpPersonAddressId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePersPos} - ${msgPersPos}`);
        }
    });

    it(`should fail to update (PUT) person type BP due to missing personPostalAddress fields in addressData (with person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing personPostalAddress fields in addressData
        try {
            bpPayload = bpValidationMock.bpPersonMissingPostalAddressFields;
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(5);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeCountry} - ${msgCountry}`,
                `${codeTown} - ${msgTown}`,
                `${codePrimReg} - ${msgPrimReg}`,
                `${codePostCod} - ${msgPostCod}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PUT) person type BP due to missing personPostalAddress fields in addressData (without person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing personPostalAddress fields in addressData
        // payload doesn't include person but it should not throw an error with missing person
        try {
            bpPayload = {
                ...bpValidationMock.bpPersonMissingPostalAddressFields,
            };
            delete bpPayload.person;
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(5);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeCountry} - ${msgCountry}`,
                `${codeTown} - ${msgTown}`,
                `${codePrimReg} - ${msgPrimReg}`,
                `${codePostCod} - ${msgPostCod}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PUT) person type BP due to missing personPostalAddress fields in addressData (via subentity) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing personPostalAddress fields in addressData (via subentity)
        try {
            const {
                addressData: [_, { personPostalAddress }],
            } = bpValidationMock.bpPersonMissingPostalAddressFields;
            bpPayload = { ...personPostalAddress, town: null };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}/addressData/${bpPersonAddressId}/personPostalAddress`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(5);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeCountry} - ${msgCountry}`,
                `${codeTown} - ${msgTown}`,
                `${codePrimReg} - ${msgPrimReg}`,
                `${codePostCod} - ${msgPostCod}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PUT) person type BP due to null person and addressData ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null person and addressData
        try {
            bpPayload = {
                ...bpMock.basePerson,
                person: null,
                addressData: null,
            };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codePerson} - ${msgPerson}`,
                `${codeAddrDat} - ${msgAddrDat}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }

        // null person and empty addressData
        try {
            bpPayload = { ...bpMock.basePerson, person: null, addressData: [] };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codePerson} - ${msgPerson}`,
                `${codeAddrDat} - ${msgAddrDat}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PUT) person type BP due to missing person and null addressData ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing person and null addressData
        // payload doesn't include person but it should not throw an error with missing person
        try {
            bpPayload = { ...bpMock.basePerson, addressData: null };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddrDat} - ${msgAddrDat}`);
        }

        // missing person and empty addressData
        // payload doesn't include person but it should not throw an error with missing person
        try {
            bpPayload = { ...bpMock.basePerson, addressData: [] };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddrDat} - ${msgAddrDat}`);
        }
    });

    it(`should fail to update (PUT) person type BP due to missing nameDetails in person and missing personPostalAddress ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing nameDetails in person and missing personPostalAddress
        // payload doesn't include person namedetails but it should not throw an error with missing person namedetails
        try {
            const { person } = bpValidationMock.bpPersonMissingNameDetails;
            const { addressData } =
                bpValidationMock.bpPersonMissingPostalAddress;
            bpPayload = { ...bpMock.basePerson, person, addressData };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePersPos} - ${msgPersPos}`);
        }
    });

    it(`should fail to update (PUT) person type BP due to missing nameDetails fields in person and missing personPostalAddress fields ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing nameDetails fields in person and missing personPostalAddress fields
        try {
            const { person } =
                bpValidationMock.bpPersonMissingNameDetailsFields;
            const { addressData } =
                bpValidationMock.bpPersonMissingPostalAddressFields;
            bpPayload = {
                ...bpMock.basePerson,
                person,
                addressData,
            };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(7);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeFirsNam} - ${msgFirsNam}`,
                `${codeLastNam} - ${msgLastNam}`,
                `${codeCountry} - ${msgCountry}`,
                `${codeTown} - ${msgTown}`,
                `${codePrimReg} - ${msgPrimReg}`,
                `${codePostCod} - ${msgPostCod}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    // PATCH tests

    it(`should fail to update (PATCH) BP Type ${traceIssue2}`, async () => {
        let bpPatchPayload = { businessPartnerType: null };
        await expect(async () => {
            await PATCH(`${businessPartner}/${bpPersonId}`, bpPatchPayload, {
                auth: admin,
            });
        }).rejects.toThrowError('400 - Value is required');

        bpPatchPayload = { businessPartnerType: 'organization' };
        await expect(async () => {
            await PATCH(`${businessPartner}/${bpPersonId}`, bpPatchPayload, {
                auth: admin,
            });
        }).rejects.toThrowError(`${codeTypeChNotSupp} - ${msgTypeChNotSupp}`);
    });

    it(`should update (PATCH) person type BP even with missing person and addressData ${traceIssue2}`, async () => {
        // missing person
        const bpPayload = bpMock.basePerson;
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PATCH) person type BP due to null person (with addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing person
        try {
            bpPayload = {
                ...bpValidationMock.bpPersonMissingPerson,
                person: null,
            };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePerson} - ${msgPerson}`);
        }
    });

    it(`should fail to update (PATCH) person type BP due to null person (without addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing person
        // payload doesn't include addressData but it should not throw an error with missing addressData
        try {
            bpPayload = {
                ...bpValidationMock.bpPersonMissingPerson,
                person: null,
            };
            delete bpPayload.addressData;
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePerson} - ${msgPerson}`);
        }
    });

    it(`should update (PATCH) person type BP due to missing nameDetails in person ${traceIssue2}`, async () => {
        // missing nameDetails in person
        const bpPayload = bpValidationMock.bpPersonMissingNameDetails;
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PATCH) person type BP due to null nameDetails in person (with addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null nameDetails in person
        try {
            const { person } = bpValidationMock.bpPersonMissingNameDetails;
            bpPayload = {
                ...bpValidationMock.bpPersonMissingNameDetails,
                person: { ...person, nameDetails: null },
            };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeNameDet} - ${msgNameDet}`);
        }
    });

    it(`should fail to update (PATCH) person type BP due to null nameDetails in person (without addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null nameDetails in person
        // payload doesn't include addressData but it should not throw an error with missing addressData
        try {
            const { person } = bpValidationMock.bpPersonMissingNameDetails;
            bpPayload = {
                ...bpValidationMock.bpPersonMissingNameDetails,
                person: { ...person, nameDetails: null },
            };
            delete bpPayload.addressData;
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeNameDet} - ${msgNameDet}`);
        }
    });

    it(`should update (PATCH) person type BP even with missing nameDetails in person (via subentity) ${traceIssue2}`, async () => {
        // missing nameDetails in person (via subentity)
        const { person } = bpValidationMock.bpPersonMissingNameDetails;
        const bpPayload = { ...person };
        const { status } = await PATCH(
            `${businessPartner}(${bpPersonId})/person`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PATCH) person type BP due to null nameDetails in person (via subentity) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing nameDetails in person (via subentity)
        try {
            const { person } = bpValidationMock.bpPersonMissingNameDetails;
            bpPayload = { ...person, nameDetails: null };
            const { status } = await PATCH(
                `${businessPartner}(${bpPersonId})/person`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeNameDet} - ${msgNameDet}`);
        }
    });

    it(`should update (PATCH) person type BP even with missing nameDetails fields in person (with addressData) ${traceIssue2}`, async () => {
        // missing nameDetails fields in person
        const bpPayload = bpValidationMock.bpPersonMissingNameDetailsFields;
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    // requires the user story ### to be merged
    it(`should update (PATCH) person type BP even with missing nameDetails fields in person (without addressData) ${traceIssue2}`, async () => {
        // missing nameDetails fields in person
        // payload doesn't include addressData but it should not throw an error with missing addressData
        const bpPayload = {
            ...bpValidationMock.bpPersonMissingNameDetailsFields,
        };
        delete bpPayload.addressData;
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should update (PATCH) person type BP even with missing nameDetails fields in person (via subentity) ${traceIssue2}`, async () => {
        // missing nameDetails fields in person
        const {
            person: { nameDetails },
        } = bpValidationMock.bpPersonMissingNameDetailsFields;
        const bpPayload = nameDetails;
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonId}/person/nameDetails`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should not update (PATCH) person type BP due to null nameDetails fields in person (with addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null nameDetails fields in person
        try {
            const { person } =
                bpValidationMock.bpPersonMissingNameDetailsFields;
            bpPayload = {
                ...bpValidationMock.bpPersonMissingNameDetailsFields,
                person: {
                    ...person,
                    nameDetails: {
                        ...person.nameDetails,
                        firstName: null,
                        lastName: null,
                    },
                },
            };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeFirsNam} - ${msgFirsNam}`,
                `${codeLastNam} - ${msgLastNam}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    // requires the user story ### to be merged
    it(`should not update (PATCH) person type BP due to null nameDetails fields in person (without addressData) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null nameDetails fields in person
        // payload doesn't include addressData but it should not throw an error with missing addressData
        try {
            const { person } =
                bpValidationMock.bpPersonMissingNameDetailsFields;
            bpPayload = {
                ...bpValidationMock.bpPersonMissingNameDetailsFields,
                person: {
                    ...person,
                    nameDetails: {
                        ...person.nameDetails,
                        firstName: null,
                        lastName: null,
                    },
                },
            };
            delete bpPayload.addressData;
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeFirsNam} - ${msgFirsNam}`,
                `${codeLastNam} - ${msgLastNam}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PATCH) person type BP due to null nameDetails fields in person (via subentity) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null nameDetails fields in person
        try {
            const {
                person: { nameDetails },
            } = bpValidationMock.bpPersonMissingNameDetailsFields;
            bpPayload = { ...nameDetails, firstName: null, lastName: null };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}/person/nameDetails`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeFirsNam} - ${msgFirsNam}`,
                `${codeLastNam} - ${msgLastNam}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PATCH) person type BP due to empty addressData (with person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // empty addressData
        try {
            bpPayload = bpValidationMock.bpPersonEmptyAddressData;
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddrDat} - ${msgAddrDat}`);
        }
    });

    it(`should fail to update (PATCH) person type BP due to empty addressData (without person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // empty addressData
        // payload doesn't include person but it should not throw an error with missing person
        try {
            bpPayload = {
                ...bpValidationMock.bpPersonEmptyAddressData,
            };
            delete bpPayload.person;
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddrDat} - ${msgAddrDat}`);
        }
    });

    it(`should fail to update (PATCH) person type BP due to missing personPostalAddress in addressData (with person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing personPostalAddress in addressData
        try {
            bpPayload = bpValidationMock.bpPersonMissingPostalAddress;
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePersPos} - ${msgPersPos}`);
        }
    });

    it(`should fail to update (PATCH) person type BP due to missing personPostalAddress in addressData (without person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing personPostalAddress in addressData
        // payload doesn't include person but it should not throw an error with missing person
        try {
            bpPayload = { ...bpValidationMock.bpPersonMissingPostalAddress };
            delete bpPayload.person;
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePersPos} - ${msgPersPos}`);
        }
    });

    it(`should update (PATCH) person type BP even with missing personPostalAddress in addressData (via subentity) ${traceIssue2}`, async () => {
        // missing personPostalAddress in addressData (via subentity)
        const {
            addressData: [_, address2],
        } = bpValidationMock.bpPersonMissingPostalAddress;
        const bpPayload = { ...address2 };
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonId}/addressData/${bpPersonAddressId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PATCH) person type BP due to null personPostalAddress in addressData (via subentity) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null personPostalAddress in addressData (via subentity)
        try {
            const {
                addressData: [_, address2],
            } = bpValidationMock.bpPersonMissingPostalAddress;
            bpPayload = { ...address2, personPostalAddress: null };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}/addressData/${bpPersonAddressId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePersPos} - ${msgPersPos}`);
        }
    });

    it(`should fail to update (PATCH) person type BP due to null personPostalAddress fields in addressData (with person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null personPostalAddress fields in addressData
        try {
            bpPayload = bpValidationMock.bpPersonMissingPostalAddressFields;
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(5);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeCountry} - ${msgCountry}`,
                `${codeTown} - ${msgTown}`,
                `${codePrimReg} - ${msgPrimReg}`,
                `${codePostCod} - ${msgPostCod}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PATCH) person type BP due to missing personPostalAddress fields in addressData (without person) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing personPostalAddress fields in addressData
        // payload doesn't include person but it should not throw an error with missing person
        try {
            bpPayload = {
                ...bpValidationMock.bpPersonMissingPostalAddressFields,
            };
            delete bpPayload.person;
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(5);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeCountry} - ${msgCountry}`,
                `${codeTown} - ${msgTown}`,
                `${codePrimReg} - ${msgPrimReg}`,
                `${codePostCod} - ${msgPostCod}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should update (PATCH) person type BP even with missing personPostalAddress fields in addressData (via subentity) ${traceIssue2}`, async () => {
        // missing personPostalAddress fields in addressData (via subentity)
        const {
            addressData: [_, { personPostalAddress }],
        } = bpValidationMock.bpPersonMissingPostalAddressFields;
        const bpPayload = { ...personPostalAddress };
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonId}/addressData/${bpPersonAddressId}/personPostalAddress`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PATCH) person type BP due to null personPostalAddress fields in addressData (via subentity) ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null personPostalAddress fields in addressData (via subentity)
        try {
            const {
                addressData: [_, { personPostalAddress }],
            } = bpValidationMock.bpPersonMissingPostalAddressFields;
            bpPayload = {
                ...personPostalAddress,
                country: null,
                town: null,
                primaryRegion: null,
                postCode: null,
            };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}/addressData/${bpPersonAddressId}/personPostalAddress`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(5);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeCountry} - ${msgCountry}`,
                `${codeTown} - ${msgTown}`,
                `${codePrimReg} - ${msgPrimReg}`,
                `${codePostCod} - ${msgPostCod}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PATCH) person type BP due to null person and addressData ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null person and addressData
        try {
            bpPayload = {
                ...bpMock.basePerson,
                person: null,
                addressData: null,
            };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codePerson} - ${msgPerson}`,
                `${codeAddrDat} - ${msgAddrDat}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }

        // null person and empty addressData
        try {
            bpPayload = { ...bpMock.basePerson, person: null, addressData: [] };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codePerson} - ${msgPerson}`,
                `${codeAddrDat} - ${msgAddrDat}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PATCH) person type BP due to missing nameDetails in person and missing personPostalAddress ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing nameDetails in person and missing personPostalAddress
        try {
            const { person } = bpValidationMock.bpPersonMissingNameDetails;
            const { addressData } =
                bpValidationMock.bpPersonMissingPostalAddress;
            bpPayload = { ...bpMock.basePerson, person, addressData };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codePersPos} - ${msgPersPos}`);
        }
    });

    it(`should fail to update (PATCH) person type BP due to null nameDetails in person and missing personPostalAddress - 2 ${traceIssue2}`, async () => {
        let bpPayload = {};

        // null nameDetails in person and missing personPostalAddress
        try {
            const { person } = bpValidationMock.bpPersonMissingNameDetails;
            const { addressData } =
                bpValidationMock.bpPersonMissingPostalAddress;
            bpPayload = {
                ...bpMock.basePerson,
                person: { ...person, nameDetails: null },
                addressData,
            };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(3);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeNameDet} - ${msgNameDet}`,
                `${codePersPos} - ${msgPersPos}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PATCH) person type BP due to missing nameDetails fields in person and missing personPostalAddress fields ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing nameDetails fields in person and missing personPostalAddress fields
        try {
            const { person } =
                bpValidationMock.bpPersonMissingNameDetailsFields;
            const { addressData } =
                bpValidationMock.bpPersonMissingPostalAddressFields;
            bpPayload = { ...bpMock.basePerson, person, addressData };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(5);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeCountry} - ${msgCountry}`,
                `${codeTown} - ${msgTown}`,
                `${codePrimReg} - ${msgPrimReg}`,
                `${codePostCod} - ${msgPostCod}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to update (PATCH) person type BP due to null nameDetails fields in person and missing personPostalAddress fields ${traceIssue2}`, async () => {
        let bpPayload = {};

        // missing nameDetails fields in person and missing personPostalAddress fields
        try {
            const {
                person: { nameDetails },
            } = bpValidationMock.bpPersonMissingNameDetailsFields;
            const { addressData } =
                bpValidationMock.bpPersonMissingPostalAddressFields;
            bpPayload = {
                ...bpMock.basePerson,
                person: {
                    nameDetails: {
                        ...nameDetails,
                        firstName: null,
                        lastName: null,
                    },
                },
                addressData,
            };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(7);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeFirsNam} - ${msgFirsNam}`,
                `${codeLastNam} - ${msgLastNam}`,
                `${codeCountry} - ${msgCountry}`,
                `${codeTown} - ${msgTown}`,
                `${codePrimReg} - ${msgPrimReg}`,
                `${codePostCod} - ${msgPostCod}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should fail to create businessPartnerGroup type BP ${traceIssue1}`, async () => {
        const bpPayload = bpValidationMock.bpBpGroupInvalid;

        await expect(async () => {
            await POST(businessPartner, bpPayload, { auth: admin });
        }).rejects.toThrowError(`${codeBpGrpNotSupp} - ${msgBpGrpNotSupp}`);
    });

    it(`should fail to create non-organization type SP-BP ${traceIssue1}`, async () => {
        const bpPayload = bpValidationMock.bpPersonServiceProvider;

        await expect(async () => {
            await POST(businessPartner, bpPayload, { auth: admin });
        }).rejects.toThrowError(`${codeSpTypeOrg} - ${msgSpTypeOrg}`);
    });

    it(`should fail to create SP-BP with non-unique Market function code number (same BP, same market function) ${traceIssue1}`, async () => {
        const bpPayload = { ...bpMock.completeBpOrgMix1 };

        bpPayload.serviceProviderInformation[0].marketFunctionCodeNumber2 =
            bpPayload.serviceProviderInformation[0].marketFunctionCodeNumber1;

        // expect to fail the BP as the marketFunctionCode is already in use
        await expect(async () => {
            await POST(businessPartner, bpPayload, { auth: admin });
        }).rejects.toThrowError(`${codeMrktFuncInUse} - ${msgMrktFuncInUse}`);
    });

    it(`should fail to create SP-BP with non-unique Market function code number (same BP, different market function) ${traceIssue1}`, async () => {
        const bpPayload = { ...bpMock.completeBpOrgMix1 };

        bpPayload.serviceProviderInformation[1].marketFunctionCodeNumber2 =
            bpPayload.serviceProviderInformation[0].marketFunctionCodeNumber1;

        // expect to fail the BP as the marketFunctionCode is already in use
        await expect(async () => {
            await POST(businessPartner, bpPayload, { auth: admin });
        }).rejects.toThrowError(`${codeMrktFuncInUse} - ${msgMrktFuncInUse}`);
    });

    it(`should fail to create or update SP-BP with non-unique Market function code number (different BP) ${traceIssue1}`, async () => {
        const bpPayload = { ...bpMock.completeBpOrgMix1 };
        const bpPayload2 = { ...bpMock.completeBpOrgMix2 };

        bpPayload.serviceProviderInformation[1].marketFunctionCodeNumber2 =
            bpPayload2.serviceProviderInformation[0].marketFunctionCodeNumber1;

        // expect to fail the third BP as the marketFunctionCode is already in use
        await expect(async () => {
            await POST(businessPartner, bpPayload, { auth: admin });
        }).rejects.toThrowError(`${codeMrktFuncInUse} - ${msgMrktFuncInUse}`);

        // expect to fail the update to second BP as the marketFunctionCodeNumber is already in use
        await expect(async () => {
            await PUT(`${businessPartner}/${bpOrgSpId}`, bpPayload, {
                auth: admin,
            });
        }).rejects.toThrowError(`${codeMrktFuncInUse} - ${msgMrktFuncInUse}`);

        // expect to fail the update to second BP as the marketFunctionCodeNumber is already in use
        const { serviceProviderInformation } = bpPayload;
        await expect(async () => {
            await PATCH(
                `${businessPartner}/${bpOrgSpId}`,
                { serviceProviderInformation },
                { auth: admin }
            );
        }).rejects.toThrowError(`${codeMrktFuncInUse} - ${msgMrktFuncInUse}`);
    });

    it(`should fail to update BP with missing bookkeeping status ${traceIssue1}`, async () => {
        const bpPutPayload = bpValidationMock.bpPersonValid;
        const { id } = await createBusinessPartnerDB({
            displayId: 'test',
            businessPartnerType: 'person',
            isBlocked: false,
        });

        await expect(async () => {
            await PUT(`${businessPartner}/${id}`, bpPutPayload, {
                auth: admin,
            });
        }).rejects.toThrowError(`${codeMissMdiBook} - ${msgMissMdiBook}`);
    });

    it(`should update BP with existing bookkeeping status ${traceIssue1}`, async () => {
        const bpPutPayload = bpValidationMock.bpPersonValid;
        const { id } = await createBusinessPartnerDB({
            displayId: 'test',
            businessPartnerType: 'person',
            mdiBookKeeping: { status: 'sent' },
            isBlocked: false,
        });

        const { data, status } = await PUT(
            `${businessPartner}/${id}`,
            bpPutPayload,
            {
                auth: admin,
            }
        );

        expect(status).toBe(200);
        expect(data).toBeTruthy();
    });
});

/*describe('BusinessPartnerService it-test', () => {
    const { POST, admin } = launchServer({
        service: {
            paths: servicePaths,
        },
    });

    const businessPartner = `${businessPartnerApi}/BusinessPartner`;
    const destUrl = 'https://mdi-test.com';

    // Mocks the MDI Change API
    const eventsUrl = `${destUrl}/${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/events`;
    const requestsUrl = `${destUrl}/${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/requests`;
    const mockServer = setupServer(
        rest.get(eventsUrl, (req, res, ctx) => res(ctx.status(200))),
        rest.post(requestsUrl, (req, res, ctx) => res(ctx.status(202)))
    );

    beforeAll(async () => {
        await commonSetupConfigCodes(POST, commonConfigApi, admin);
        await bpSetupConfigCodes(POST, businessPartnerConfigApi, admin);
        mockServer.listen(mockServerConf);
    });

    afterAll(() => {
        mockServer.close();
    });

    afterEach(() => {
        mockServer.resetHandlers();
        jest.clearAllMocks();
    });

    it(`should create BP, but displayID should be null ${traceIssue3}`, async () => {
        const bpPayload = { ...bpValidationMock.bpOrgValid, displayId: 'test' };
        let { data, status } = await POST(businessPartner, bpPayload, {
            auth: admin,
        });

        expect(status).toBe(201);
        expect(data.displayId).toBeNull();
    });

    it(`should create BP with internal service and displayID should not be null ${traceIssue3}`, async () => {
        const bpPayload = { ...bpValidationMock.bpOrgValid, displayId: 'test' };
        let { data, status } = await POST(
            `/api/beta/bpinternal/BusinessPartner`,
            bpPayload,
            {
                auth: admin,
            }
        );

        expect(status).toBe(201);
        expect(data.displayId).not.toBeNull();
    });
});*/
