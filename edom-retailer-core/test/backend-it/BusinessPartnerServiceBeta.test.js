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
const traceIssue4 = 'UTILITIESCLOUDSOLUTION-3059';
const traceIssue3061 = 'UTILITIESCLOUDSOLUTION-3061';

// Legend:
// [BETA] = need to update line/s below when moving (from beta) to release

// [BETA] - enable (beta) error messages
const error = bpError(['business-partner-enhancements'])(bundle);

let {
    BusinessPartnerSRVMultipleErrorsOccured,
    BusinessPartnerSRVValueRequired,
    BusinessPartnerSRVBpTypeChangeNotSupported,
    BusinessPartnerSRVBpGroupNotSupported,
    BusinessPartnerSRVSpMustBeTypeOrg,
    BusinessPartnerSRVMissingMdiBookkeeping,
    BusinessPartnerSRVMarketFunctionCodeNumberInUse,
    BusinessPartnerSRVDeleteRestricted,
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

const { code: codeRolesDel1, message: msgRolesDel1 } =
    BusinessPartnerSRVDeleteRestricted('roles');
const { code: codeRolesDel2, message: msgRolesDel2 } =
    BusinessPartnerSRVDeleteRestricted('roles');
const { code: codeSalArrDel1, message: msgSalArrDel1 } =
    BusinessPartnerSRVDeleteRestricted('salesArrangements');
const { code: codeSalArrDel2, message: msgSalArrDel2 } =
    BusinessPartnerSRVDeleteRestricted('salesArrangements');
const { code: codeAddDatDel1, message: msgAddDatDel1 } =
    BusinessPartnerSRVDeleteRestricted('addressData', [
        {
            containsKey: 'usage_code',
            containsValue: 'XXDEFAULT',
        },
    ]);
const { code: codeAddDatDel2, message: msgAddDatDel2 } =
    BusinessPartnerSRVDeleteRestricted('addressData', [
        {
            containsKey: 'usage_code',
            containsValue: 'XXDEFAULT',
        },
    ]);

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
];

// enabling mock feature flags
cds.env.requires.featureFlags = {
    impl: 'test/backend-it/external/FeatureFlagsTestService',
};

const { POST, PUT, PATCH, DELETE, admin } = launchServer({
    service: {
        paths: servicePaths,
    },
});

describe.skip('BusinessPartnerService beta it-test', () => {
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

    let spyEventMessagingEmit;

    beforeAll(async () => {
        const EventMessaging = await cds.connect.to('businessPartnerMessaging');
        spyEventMessagingEmit = jest.spyOn(EventMessaging, 'emit');

        // [BETA] - manually change feature flag return value
        const featureFlags = await cds.connect.to('featureFlags');
        featureFlags.set('business-partner-enhancements', true);
        featureFlags.set('business-partner-messaging', true);

        // setup configuration data
        await createConfigurationDataSet(admin, POST);

        // setup BP config codes
        await commonSetupConfigCodes(POST, commonConfigApi, admin);
        await bpSetupConfigCodes(POST, businessPartnerConfigApi, admin);

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
        ({
            data: {
                id: bpPersonCompleteId,
                addressData: [bpPersonCompleteAddress, ...others],
                roles: [bpPersonCompleteRole, ...others],
                customerInformation: {
                    salesArrangements: [
                        bpPersonCompleteSalesArrangement,
                        ...others
                    ],
                },
            },
        } = await POST(businessPartner, bpMock.completeBpPersonMix1, {
            auth: admin,
        }));

        spyEventMessagingEmit.mockClear();
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
        const updatePayload = { ...bpMock.completeBpOrgMix1 };
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
        const updatePayload = { ...bpMock.completeBpPersonMix1 };

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
        const updatePayload1 = { ...bpMock.completeBpOrgMix1 };
        updatePayload1.serviceProviderInformation[0].marketFunctionCodeNumber1 =
            '0010';
        updatePayload1.serviceProviderInformation[0].marketFunctionCodeNumber2 =
            '0011';
        updatePayload1.serviceProviderInformation[1].marketFunctionCodeNumber1 =
            '0012';
        updatePayload1.serviceProviderInformation[1].marketFunctionCodeNumber2 =
            '0013';
        const updatePayload2 = { ...bpMock.completeBpOrgMix1 };
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

    /**
     * Restrict Deletion tests
     */

    it(`should update (PUT) roles if no roles are removed (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // kept the same roles
        bpPayload = {
            ...bpMock.basePerson,
            roles: [...bpMock.completeBpPersonMix1.roles],
        };
        const { status } = await PUT(
            `${businessPartner}/${bpPersonCompleteId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PUT) roles due to removal of a role (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // removed a role from roles
        try {
            bpPayload = {
                ...bpMock.basePerson,
                roles: [...bpMock.completeBpPersonMix1.roles],
            };
            bpPayload.roles.pop();
            const { status } = await PUT(
                `${businessPartner}/${bpPersonCompleteId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeRolesDel1} - ${msgRolesDel1}`);
        }
    });

    it(`should update (PATCH) roles if no roles are removed (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // kept the same roles
        bpPayload = {
            roles: [...bpMock.completeBpPersonMix1.roles],
        };
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonCompleteId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PATCH) roles due to removal of a role (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // removed a role from roles
        try {
            bpPayload = {
                roles: [...bpMock.completeBpPersonMix1.roles],
            };
            bpPayload.roles.pop();
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonCompleteId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeRolesDel1} - ${msgRolesDel1}`);
        }
    });

    it(`should fail to update (DELETE) roles due to removal of a role (via subentity) ${traceIssue4}`, async () => {
        // removed a role from roles
        try {
            const { status } = await DELETE(
                `${businessPartner}/${bpPersonCompleteId}/roles('${bpPersonCompleteRole.role.code}')`,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeRolesDel2} - ${msgRolesDel2}`);
        }
    });

    it(`should update (PUT) addressData if required usage_code is not removed (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // kept required usage_code from usages of addressData
        const usagesRequired = bpPersonCompleteAddress.usages.filter(
            ({ usage }) => usage.code === 'XXDEFAULT'
        );
        bpPayload = {
            ...bpMock.basePerson,
            addressData: [
                {
                    ...bpPersonCompleteAddress,
                    usages: [...usagesRequired],
                },
            ],
        };
        const { status } = await PUT(
            `${businessPartner}/${bpPersonCompleteId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PUT) addressData due to removal of an address with required usage_code (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // removed a required usage_code from usages of addressData
        try {
            const usagesNotRequired = bpPersonCompleteAddress.usages.filter(
                ({ usage }) => usage.code !== 'XXDEFAULT'
            );
            bpPayload = {
                ...bpMock.basePerson,
                addressData: [
                    {
                        ...bpPersonCompleteAddress,
                        usages: [...usagesNotRequired],
                    },
                ],
            };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonCompleteId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddDatDel1} - ${msgAddDatDel1}`);
        }
    });

    it(`should update (PATCH) addressData if required usage_code is not removed (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // kept required usage_code from usages of addressData
        const usagesRequired = bpPersonCompleteAddress.usages.filter(
            ({ usage }) => usage.code === 'XXDEFAULT'
        );
        bpPayload = {
            ...bpMock.basePerson,
            addressData: [
                {
                    ...bpPersonCompleteAddress,
                    usages: [...usagesRequired],
                },
            ],
        };
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonCompleteId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PATCH) addressData due to removal of an address with required usage_code (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // removed a required usage_code from usages of addressData
        try {
            const usagesNotRequired = bpPersonCompleteAddress.usages.filter(
                ({ usage }) => usage.code !== 'XXDEFAULT'
            );
            bpPayload = {
                ...bpMock.basePerson,
                addressData: [
                    {
                        ...bpPersonCompleteAddress,
                        usages: [...usagesNotRequired],
                    },
                ],
            };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonCompleteId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddDatDel1} - ${msgAddDatDel1}`);
        }
    });

    it(`should fail to update (DELETE) addressData due to removal of an address with required usage_code (via subentity) ${traceIssue4}`, async () => {
        // removed a required usage_code from usages of addressData
        try {
            const { status } = await DELETE(
                `${businessPartner}/${bpPersonCompleteId}/addressData/${bpPersonCompleteAddress.id}`,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddDatDel2} - ${msgAddDatDel2}`);
        }
    });

    it(`should update (PUT) addressData usages if required usage_code is not removed (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // kept required usage_code from usages
        const usagesRequired = bpPersonCompleteAddress.usages.filter(
            ({ usage }) => usage.code === 'XXDEFAULT'
        );
        bpPayload = {
            ...bpMock.basePerson,
            addressData: [
                {
                    ...bpMock.completeBpPersonMix1.addressData[0],
                    usages: usagesRequired,
                },
                bpMock.completeBpPersonMix1.addressData[1],
            ],
        };
        const { status } = await PUT(
            `${businessPartner}/${bpPersonCompleteId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PUT) addressData usages due to removal of a required usage_code (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // removed a required usage_code from usages
        try {
            const usagesNotRequired = bpPersonCompleteAddress.usages.filter(
                ({ usage }) => usage.code !== 'XXDEFAULT'
            );
            bpPayload = {
                ...bpMock.basePerson,
                addressData: [
                    {
                        ...bpMock.completeBpPersonMix1.addressData[0],
                        usages: usagesNotRequired,
                    },
                    bpMock.completeBpPersonMix1.addressData[1],
                ],
            };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonCompleteId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddDatDel1} - ${msgAddDatDel1}`);
        }
    });

    it(`should fail to update (PUT) addressData usages due to removal of a required usage_code (via root entity) - 2 ${traceIssue4}`, async () => {
        let bpPayload = {};

        // removed a required usage_code from usages BUT added a required usage_code on other address
        try {
            const usagesNotRequired = bpPersonCompleteAddress.usages.filter(
                ({ usage }) => usage.code !== 'XXDEFAULT'
            );
            const usagesRequired = bpPersonCompleteAddress.usages.filter(
                ({ usage }) => usage.code === 'XXDEFAULT'
            );
            bpPayload = {
                ...bpMock.basePerson,
                addressData: [
                    {
                        ...bpMock.completeBpPersonMix1.addressData[0],
                        usages: usagesNotRequired,
                    },
                    {
                        ...bpMock.completeBpPersonMix1.addressData[1],
                        usages: usagesRequired,
                    },
                ],
            };
            const { status } = await PUT(
                `${businessPartner}/${bpPersonCompleteId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddDatDel1} - ${msgAddDatDel1}`);
        }
    });

    it(`should update (PATCH) addressData usages if required usage_code is not removed (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // kept required usage_code from usages
        const usagesRequired = bpPersonCompleteAddress.usages.filter(
            ({ usage }) => usage.code === 'XXDEFAULT'
        );
        bpPayload = {
            ...bpMock.basePerson,
            addressData: [
                {
                    ...bpMock.completeBpPersonMix1.addressData[0],
                    usages: usagesRequired,
                },
                bpMock.completeBpPersonMix1.addressData[1],
            ],
        };
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonCompleteId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PATCH) addressData usages due to removal of a required usage_code (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // removed a required usage_code from usages
        try {
            const usagesNotRequired = bpPersonCompleteAddress.usages.filter(
                ({ usage }) => usage.code !== 'XXDEFAULT'
            );
            bpPayload = {
                ...bpMock.basePerson,
                addressData: [
                    {
                        ...bpMock.completeBpPersonMix1.addressData[0],
                        usages: usagesNotRequired,
                    },
                    bpMock.completeBpPersonMix1.addressData[1],
                ],
            };
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonCompleteId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddDatDel1} - ${msgAddDatDel1}`);
        }
    });

    it(`should fail to update (DELETE) addressData usages due to removal of a required usage_code (via subentity) ${traceIssue4}`, async () => {
        // removed a required usage_code from usages
        try {
            const [usageRequired] = bpPersonCompleteAddress.usages.filter(
                ({ usage }) => usage.code === 'XXDEFAULT'
            );
            const { status } = await DELETE(
                `${businessPartner}/${bpPersonCompleteId}/addressData/${bpPersonCompleteAddress.id}/usages(code='${usageRequired.usage.code}',validTo=${usageRequired.validTo})`,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeAddDatDel2} - ${msgAddDatDel2}`);
        }
    });

    it(`should update (PUT) salesArrangements if no salesArrangement are removed (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // kept the same salesArrangements
        bpPayload = {
            ...bpMock.basePerson,
            customerInformation: {
                salesArrangements: [
                    ...bpMock.completeBpPersonMix1.customerInformation
                        .salesArrangements,
                ],
            },
        };
        const { status } = await PUT(
            `${businessPartner}/${bpPersonCompleteId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PUT) salesArrangements due to removal of a salesArrangement (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // removed a salesArrangement from salesArrangements
        try {
            bpPayload = {
                ...bpMock.basePerson,
                customerInformation: {
                    salesArrangements: [
                        ...bpMock.completeBpPersonMix1.customerInformation
                            .salesArrangements,
                    ],
                },
            };
            bpPayload.customerInformation.salesArrangements.pop();
            const { status } = await PUT(
                `${businessPartner}/${bpPersonCompleteId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeSalArrDel1} - ${msgSalArrDel1}`);
        }
    });

    it(`should update (PATCH) salesArrangements if no salesArrangement are removed (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // kept the same salesArrangements
        bpPayload = {
            ...bpMock.basePerson,
            customerInformation: {
                salesArrangements: [
                    ...bpMock.completeBpPersonMix1.customerInformation
                        .salesArrangements,
                ],
            },
        };
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonCompleteId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PATCH) salesArrangements due to removal of a salesArrangement (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // removed a salesArrangement from salesArrangements
        try {
            bpPayload = {
                ...bpMock.basePerson,
                customerInformation: {
                    salesArrangements: [
                        ...bpMock.completeBpPersonMix1.customerInformation
                            .salesArrangements,
                    ],
                },
            };
            bpPayload.customerInformation.salesArrangements.pop();
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonCompleteId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeSalArrDel1} - ${msgSalArrDel1}`);
        }
    });

    it(`should fail to update (DELETE) salesArrangements due to removal of a salesArrangement (via subentity) ${traceIssue4}`, async () => {
        // removed a salesArrangement from salesArrangements
        try {
            const {
                salesAreaRef: {
                    salesOrganizationDisplayId,
                    distributionChannel,
                    division,
                },
            } = bpPersonCompleteSalesArrangement;
            const { status } = await DELETE(
                `${businessPartner}/${bpPersonCompleteId}/customerInformation/salesArrangements(salesOrganizationDisplayId='${salesOrganizationDisplayId}',distributionChannel='${distributionChannel}',division='${division}')`,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            expect(e.message).toBe(`${codeSalArrDel2} - ${msgSalArrDel2}`);
        }
    });

    it(`should update (PUT) BusinessPartner if no role, addressData, salesArrangement are removed (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // kept the same roles, addressData, salesArrangements
        const usagesRequired = bpPersonCompleteAddress.usages.filter(
            ({ usage }) => usage.code === 'XXDEFAULT'
        );
        bpPayload = {
            ...bpMock.basePerson,
            roles: [...bpMock.completeBpPersonMix1.roles],
            addressData: [
                {
                    ...bpMock.completeBpPersonMix1.addressData[0],
                    usages: usagesRequired,
                },
                bpMock.completeBpPersonMix1.addressData[1],
            ],
            customerInformation: {
                salesArrangements: [
                    ...bpMock.completeBpPersonMix1.customerInformation
                        .salesArrangements,
                ],
            },
        };
        const { status } = await PUT(
            `${businessPartner}/${bpPersonCompleteId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PUT) BusinessPartner due to removal of a role, addressData, and salesArrangement (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // removed a role, addressData, and a salesArrangement
        try {
            const usagesNotRequired = bpPersonCompleteAddress.usages.filter(
                ({ usage }) => usage.code !== 'XXDEFAULT'
            );
            bpPayload = {
                ...bpMock.basePerson,
                roles: [...bpMock.completeBpPersonMix1.roles],
                addressData: [
                    {
                        ...bpPersonCompleteAddress,
                        usages: [...usagesNotRequired],
                    },
                ],
                customerInformation: {
                    salesArrangements: [
                        ...bpMock.completeBpPersonMix1.customerInformation
                            .salesArrangements,
                    ],
                },
            };
            bpPayload.roles.pop();
            bpPayload.customerInformation.salesArrangements.pop();
            const { status } = await PUT(
                `${businessPartner}/${bpPersonCompleteId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(4);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeRolesDel1} - ${msgRolesDel1}`,
                `${codeAddDatDel1} - ${msgAddDatDel1}`,
                `${codeSalArrDel1} - ${msgSalArrDel1}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
    });

    it(`should update (PATCH) BusinessPartner if no role, addressData, salesArrangement are removed (via root entity) ${traceIssue4}`, async () => {
        let bpPayload = {};

        // kept the same roles, addressData, salesArrangements
        const usagesRequired = bpPersonCompleteAddress.usages.filter(
            ({ usage }) => usage.code === 'XXDEFAULT'
        );
        bpPayload = {
            ...bpMock.basePerson,
            roles: [...bpMock.completeBpPersonMix1.roles],
            addressData: [
                {
                    ...bpMock.completeBpPersonMix1.addressData[0],
                    usages: usagesRequired,
                },
                bpMock.completeBpPersonMix1.addressData[1],
            ],
            customerInformation: {
                salesArrangements: [
                    ...bpMock.completeBpPersonMix1.customerInformation
                        .salesArrangements,
                ],
            },
        };
        const { status } = await PATCH(
            `${businessPartner}/${bpPersonCompleteId}`,
            bpPayload,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
    });

    it(`should fail to update (PATCH) BusinessPartner due to removal of a role, addressData, and salesArrangement ${traceIssue4}`, async () => {
        let bpPayload = {};

        // removed a role, addressData, and a salesArrangement
        try {
            const usagesNotRequired = bpPersonCompleteAddress.usages.filter(
                ({ usage }) => usage.code !== 'XXDEFAULT'
            );
            bpPayload = {
                ...bpMock.basePerson,
                roles: [...bpMock.completeBpPersonMix1.roles],
                addressData: [
                    {
                        ...bpPersonCompleteAddress,
                        usages: [...usagesNotRequired],
                    },
                ],
                customerInformation: {
                    salesArrangements: [
                        ...bpMock.completeBpPersonMix1.customerInformation
                            .salesArrangements,
                    ],
                },
            };
            bpPayload.roles.pop();
            bpPayload.customerInformation.salesArrangements.pop();
            const { status } = await PATCH(
                `${businessPartner}/${bpPersonCompleteId}`,
                bpPayload,
                {
                    auth: admin,
                }
            );
            expect(status).toBe(400);
        } catch (e) {
            const errorDetails = e.message.split('\n');
            expect(errorDetails).toHaveLength(4);
            [
                `${codeMulti} - ${msgMulti}`,
                `${codeRolesDel1} - ${msgRolesDel1}`,
                `${codeAddDatDel1} - ${msgAddDatDel1}`,
                `${codeSalArrDel1} - ${msgSalArrDel1}`,
            ].forEach((errorMessage) => {
                expect(errorDetails).toContain(errorMessage);
            });
        }
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

    it(`should fail to create or update SP-BP with non-unique Market function code number (different BP)  ${traceIssue1}`, async () => {
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

    it(`should fail to update (via POST) BP with missing bookkeeping status ${traceIssue1}`, async () => {
        const { completeRole1, completeRole2 } = bpMock;
        const { id } = await createBusinessPartnerDB({
            displayId: 'test',
            businessPartnerType: 'person',
            isBlocked: false,
            roles: [{ ...completeRole1 }],
        });

        await expect(async () => {
            await POST(`${businessPartner}/${id}/roles`, completeRole2, {
                auth: admin,
            });
        }).rejects.toThrowError(`${codeMissMdiBook} - ${msgMissMdiBook}`);
    });

    it(`should fail to update (via PUT) BP with missing bookkeeping status ${traceIssue1}`, async () => {
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

    it(`should fail to update (via DELETE) BP with missing bookkeeping status ${traceIssue1}`, async () => {
        const { completeRole1 } = bpMock;
        const { id } = await createBusinessPartnerDB({
            displayId: 'test',
            businessPartnerType: 'person',
            isBlocked: false,
            roles: [{ ...completeRole1 }],
        });

        await expect(async () => {
            await DELETE(
                `${businessPartner}/${id}/roles/${completeRole1.role.code}`,
                {
                    auth: admin,
                }
            );
        }).rejects.toThrowError(`${codeMissMdiBook} - ${msgMissMdiBook}`);
    });

    it(`should update (via POST) BP with existing bookkeeping status ${traceIssue1}`, async () => {
        const bpPayload = bpValidationMock.bpPersonValid;
        const { completeRole1, completeRole2 } = bpMock;
        const {
            data: { id },
        } = await POST(
            businessPartner,
            {
                ...bpPayload,
                roles: [{ ...completeRole1 }],
            },
            {
                auth: admin,
            }
        );

        const { data, status } = await POST(
            `${businessPartner}/${id}/roles`,
            completeRole2,
            {
                auth: admin,
            }
        );

        expect(status).toBe(201);
        expect(data).toBeTruthy();
    });

    it(`should update (via PUT) BP with existing bookkeeping status ${traceIssue1}`, async () => {
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

    it(`should update (via DELETE) BP with existing bookkeeping status ${traceIssue1}`, async () => {
        const bpPayload = bpValidationMock.bpPersonValid;
        const { completeTaxNumber1 } = bpMock;
        const {
            data: { id },
        } = await POST(
            businessPartner,
            {
                ...bpPayload,
                taxNumbers: [{ ...completeTaxNumber1 }],
            },
            {
                auth: admin,
            }
        );

        const { data, status } = await DELETE(
            `${businessPartner}/${id}/taxNumbers/${completeTaxNumber1.taxNumberType.code}`,
            {
                auth: admin,
            }
        );

        expect(status).toBe(204);
    });

    it(`should emit message after BusinessPartner create ${traceIssue3061}`, async () => {
        const bpPayload = bpValidationMock.bpPersonValid;

        const { data } = await POST(businessPartner, bpPayload, {
            auth: admin,
        });
        expect(data).toBeTruthy();

        expect(spyEventMessagingEmit).toBeCalledTimes(1);
        expect(spyEventMessagingEmit).toBeCalledWith(
            'topic:/Created/v1',
            expect.any(Object),
            expect.any(Object)
        );
    });

    it(`should emit message after BusinessPartner update (PUT) ${traceIssue3061}`, async () => {
        const bpPayload = bpValidationMock.bpPersonValid;

        const { data } = await PUT(
            `${businessPartner}/${bpPersonId}`,
            bpPayload,
            { auth: admin }
        );
        expect(data).toBeTruthy();

        expect(spyEventMessagingEmit).toBeCalledTimes(1);
        expect(spyEventMessagingEmit).toBeCalledWith(
            'topic:/Updated/v1',
            expect.any(Object),
            expect.any(Object)
        );
    });

    it(`should emit message after BusinessPartner update (POST) ${traceIssue3061}`, async () => {
        const bpBankAccPayload = bpMock.completeBankAccount1;

        const { data } = await POST(
            `${businessPartner}/${bpPersonId}/bankAccounts`,
            bpBankAccPayload,
            { auth: admin }
        );
        expect(data).toBeTruthy();

        expect(spyEventMessagingEmit).toBeCalledTimes(1);
        expect(spyEventMessagingEmit).toBeCalledWith(
            'topic:/Updated/v1',
            expect.any(Object),
            expect.any(Object)
        );
    });

    it(`should emit message after BusinessPartner update (DELETE) ${traceIssue3061}`, async () => {
        const bpPayload = bpMock.completeBpPerson1;

        const { data } = await POST(`${businessPartner}`, bpPayload, {
            auth: admin,
        });
        expect(data).toBeTruthy();
        const id = data.id;

        const { status } = await DELETE(
            `${businessPartner}/${id}/bankAccounts(id='0001')`,
            { auth: admin }
        );
        expect(status).toBe(204);

        expect(spyEventMessagingEmit).toBeCalledTimes(2);
        expect(spyEventMessagingEmit).toBeCalledWith(
            'topic:/Created/v1',
            expect.any(Object),
            expect.any(Object)
        );
        expect(spyEventMessagingEmit).toBeCalledWith(
            'topic:/Updated/v1',
            expect.any(Object),
            expect.any(Object)
        );
    });

    it(`should fail to update (via POST) non-existent BP ${traceIssue1}`, async () => {
        const bpBankAccount = bpMock.completeBankAccount1;
        const bpId = '3b76bdc6-e801-4aeb-867c-4a8f91c84ca7';

        await expect(async () => {
            await POST(
                `${businessPartner}/${bpId}/bankAccounts`,
                bpBankAccount,
                {
                    auth: admin,
                }
            );
        }).rejects.toThrowError('404 - Not Found');
    });

    it(`should fail to update (via PUT) non-existent BP ${traceIssue1}`, async () => {
        const bpBankAccount = bpMock.completeBankAccount1;
        const bpId = '3b76bdc6-e801-4aeb-867c-4a8f91c84ca7';

        await expect(async () => {
            await PUT(
                `${businessPartner}/${bpId}/bankAccounts/${bpBankAccount.id}`,
                bpBankAccount,
                {
                    auth: admin,
                }
            );
        }).rejects.toThrowError('404 - Not Found');
    });

    it(`should fail to update (via PATCH) non-existent BP ${traceIssue1}`, async () => {
        const bpBankAccount = bpMock.completeBankAccount1;
        const bpId = '3b76bdc6-e801-4aeb-867c-4a8f91c84ca7';

        await expect(async () => {
            await PATCH(
                `${businessPartner}/${bpId}/bankAccounts/${bpBankAccount.id}`,
                bpBankAccount,
                {
                    auth: admin,
                }
            );
        }).rejects.toThrowError('404 - Not Found');
    });

    it(`should fail to update (via DELETE) non-existent BP ${traceIssue1}`, async () => {
        const bpBankAccount = bpMock.completeBankAccount1;
        const bpId = '3b76bdc6-e801-4aeb-867c-4a8f91c84ca7';

        await expect(async () => {
            await DELETE(
                `${businessPartner}/${bpId}/bankAccounts/${bpBankAccount.id}`,
                {
                    auth: admin,
                }
            );
        }).rejects.toThrowError('404 - Not Found');
    });
});

/*describe('BusinessPartnerService beta it-test', () => {
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
