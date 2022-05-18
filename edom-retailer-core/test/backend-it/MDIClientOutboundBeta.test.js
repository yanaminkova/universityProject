const cds = require('@sap/cds');
const expect = require('expect');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const { launchServer, mockServerConf } = require('../lib/testkit');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
const { createBusinessPartnerDB } = require('../lib/functions');
const bpMock = require('./payload/BusinessPartnerMockPayload');
const {
    commonSetupConfigCodes,
    bpSetupConfigCodes,
} = require('./payload/BusinessPartnerSetupRequiredCodes');
const MDITestService = require('./external/MDITestService');
const {
    createConfigurationDataSet,
} = require('./payload/ConfigurationDataHelper');
const { BPODMVERSION } = require('../../srv/lib/config');

// update endpoints below when changing versions
const businessPartnerApi = `/api/beta/businessPartner/v1`;
const mdiClientApi = `/api/mdiClient/v1`;
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

describe.skip('MDIClientOutboundBeta it-test UTILITIESCLOUDSOLUTION-3018', () => {
    // traceability
    const traceIssue1 = 'UTILITIESCLOUDSOLUTION-3018';
    const traceIssue2 = 'UTILITIESCLOUDSOLUTION-3069';

    const businessPartner = `${businessPartnerApi}/BusinessPartner`;
    const businessPartnerBookkeeping = `${businessPartnerApi}/BusinessPartnerBookKeeping`;
    const mdiClient = `${mdiClientApi}/MDIClient`;

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

    before(async () => {
        await createConfigurationDataSet(admin, POST);
    });

    beforeAll(async () => {
        // manually change feature flag return value
        const featureFlags = await cds.connect.to('featureFlags');
        featureFlags.set('mdi-client-enhancements', true);
        featureFlags.set('business-partner-enhancements', true);
        featureFlags.set('c4uf-localids', true);

        await commonSetupConfigCodes(POST, commonConfigApi, admin);
        await bpSetupConfigCodes(POST, businessPartnerConfigApi, admin);
        mdiMockServer.listen(mockServerConf);
    });

    afterAll(() => {
        mdiMockServer.close();
    });

    beforeEach(() => {
        mockMDI = new MDITestService(['c4uf-localids']);
    });

    afterEach(() => {
        mdiMockServer.resetHandlers();
        jest.clearAllMocks();
    });

    it(`should create BP with localIds ${traceIssue2}`, async () => {
        // Mock MDI
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

        const createPayload = { ...bpMock.completeBpPersonMix1 };

        // create BP
        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });
        id = postRes.data.id;
        expect(postRes.status).toBe(201);
        expect(mockMDI.logResponse1.value).toHaveLength(2);
        expect(mockMDI.logResponse1.value[0]).toHaveProperty('localIds');
        expect(mockMDI.logResponse1.value[0].localIds[0]).toHaveProperty(
            'localId',
            id
        );
    });

    it(`should show results for outbound MDI call E2E ${traceIssue2}`, async () => {
        // Mock MDI
        mdiMockServer.use(
            rest.post(changeUrl, (req, res, ctx) => {
                mockMDI.insert(
                    'createFromC4Uf',
                    req.body,
                    mockMDI.logResponse1
                );
                return res(ctx.status(202));
            }),
            rest.get(logUrl, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(mockMDI.logResponse1));
            })
        );

        const createPayload = {
            id: cds.utils.uuid(),
            ...bpMock.completeBpPersonMix1,
        };

        // create BP
        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });
        id = postRes.data.id;
        expect(postRes.status).toBe(201);
        expect(mockMDI.logResponse1.value).toHaveLength(2);
        expect(mockMDI.logResponse1.value[0]).toHaveProperty('localIds');
        expect(mockMDI.logResponse1.value[0].localIds[0]).toHaveProperty(
            'localId',
            id
        );

        await delay(1000);
        const getRes1 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );

        expect(getRes1.status).toBe(200);
        expect(getRes1.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes1.data.mdiBookKeeping.displayIdStatus).toBe('notset');

        await delay(3000);
        await GET(mdiClient, {
            auth: admin,
        });

        await delay(3000);
        const getRes2 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );

        expect(getRes2.status).toBe(200);
        expect(getRes2.data.mdiBookKeeping.status).toBe('confirmed');
        expect(getRes2.data.mdiBookKeeping.displayIdStatus).toBe('setInC4UF');

        mockMDI.insert(
            'updateViaC4UF',
            {
                versionId: cds.utils.uuid(),
                changeToken: cds.utils.uuid(),
                instance: createPayload,
            },
            mockMDI.logResponse1
        );
        mockMDI.logResponse1.value.shift();
        mockMDI.logResponse1.value.shift();

        await delay(3000);
        await GET(mdiClient, {
            auth: admin,
        });

        await delay(3000);
        const getRes3 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );

        expect(getRes3.status).toBe(200);
        expect(getRes3.data.mdiBookKeeping.status).toBe('confirmed');
        expect(getRes3.data.mdiBookKeeping.displayIdStatus).toBe('set');
    });

    it(`should send BP update if bookkeeping status is not sent and should turn to pending after if deleted ${traceIssue1}`, async () => {
        // mock MDI
        mdiMockServer.use(
            rest.post(changeUrl, (req, res, ctx) => {
                mockMDI.insert(
                    'updateFromC4Uf',
                    req.body,
                    mockMDI.logResponse1
                );
                return res(ctx.status(202));
            })
        );

        const { id: id1 } = await createBusinessPartnerDB({
            displayId: 'test',
            businessPartnerType: 'person',
            mdiBookKeeping: { status: 'confirmed' },
            isBlocked: false,
        });

        const { id: id2 } = await createBusinessPartnerDB({
            displayId: 'test',
            businessPartnerType: 'person',
            mdiBookKeeping: { status: 'alert' },
            isBlocked: false,
        });

        const { id: id3 } = await createBusinessPartnerDB({
            displayId: 'test',
            businessPartnerType: 'person',
            mdiBookKeeping: { status: 'failed' },
            isBlocked: false,
        });

        const { status: status1 } = await PUT(
            `${businessPartner}/${id1}`,
            bpMock.completeBpPersonMix1,
            { auth: admin }
        );
        expect(status1).toBe(200);

        await delay(1000);
        const { data: getData1, status: getStatus1 } = await GET(
            `${businessPartnerBookkeeping}/${id1}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getStatus1).toBe(200);
        expect(getData1.mdiBookKeeping.status).toBe('sent');
        expect(getData1.mdiBookKeeping.pending).toBeFalsy();

        const { status: status2 } = await PUT(
            `${businessPartner}/${id2}`,
            bpMock.completeBpPersonMix1,
            { auth: admin }
        );
        expect(status2).toBe(200);

        await delay(1000);
        const { data: getData2, status: getStatus2 } = await GET(
            `${businessPartnerBookkeeping}/${id2}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getStatus2).toBe(200);
        expect(getData2.mdiBookKeeping.status).toBe('sent');
        expect(getData2.mdiBookKeeping.pending).toBeFalsy();

        const { data: getBPData2, status: getBPStatus2 } = await GET(
            `${businessPartnerApi}/BusinessPartner/${id1}?$expand=addressData($expand=usages,personPostalAddress,organizationPostalAddress,emailAddresses,phoneNumbers)`,
            {
                auth: admin,
            }
        );
        expect(getBPStatus2).toBe(200);

        // restriction on deletion
        const [validToDeleteAddress] = getBPData2.addressData.filter(
            (addr) =>
                addr.usages.filter((usag) => usag.usage.code !== 'XXDEFAULT')
                    .length === addr.usages.length
        );
        const { status: statusDEL } = await DELETE(
            `${businessPartner}(${id1})/addressData(${validToDeleteAddress.id})`,
            { auth: admin }
        );
        expect(statusDEL).toBe(204);

        await delay(1000);
        const { data: getDataDEL, status: getStatusDEL } = await GET(
            `${businessPartnerBookkeeping}/${id1}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );

        expect(getStatusDEL).toBe(200);
        expect(getDataDEL.mdiBookKeeping.status).toBe('sent');
        expect(getDataDEL.mdiBookKeeping.pending).toBeTruthy();

        const { data: data3, status: status3 } = await PUT(
            `${businessPartner}/${id3}`,
            bpMock.completeBpPersonMix1,
            { auth: admin }
        );
        expect(status3).toBe(200);

        await delay(1000);
        const { data: getData3, status: getStatus3 } = await GET(
            `${businessPartnerBookkeeping}/${id3}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getStatus3).toBe(200);
        expect(getData3.mdiBookKeeping.status).toBe('sent');
        expect(getData3.mdiBookKeeping.pending).toBeFalsy();
    });

    it(`should match the deleted BP addresss sent and the BP instances received by MDI should match (DELETE) ${traceIssue1}`, async () => {
        // mock MDI
        mdiMockServer.use(
            rest.post(changeUrl, (req, res, ctx) => {
                mockMDI.insert(
                    'createFromC4Uf',
                    req.body,
                    mockMDI.logResponse1
                );
                return res(ctx.status(202));
            }),
            rest.get(logUrl, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(mockMDI.logResponse1));
            })
        );

        const createPayload = { ...bpMock.completeBpPersonMix1 };

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });
        id = postRes.data.id;
        expect(postRes.status).toBe(201);
        createPayload.id = id;

        await delay(1000);
        expect(mockMDI.logResponse1.value).toHaveLength(2);
        expect(mockMDI.logResponse1.value[0].instance).toStrictEqual(
            createPayload
        );

        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        const getRes1 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes1.status).toBe(200);
        expect(getRes1.data.mdiBookKeeping.status).toBe('confirmed');
        expect(getRes1.data.mdiBookKeeping.pending).toBeFalsy();
        expect(getRes1.data.mdiBookKeeping.keys).toBeTruthy();

        // mock MDI
        mdiMockServer.use(
            rest.post(changeUrl, (req, res, ctx) => {
                mockMDI.insert(
                    'updateFromC4Uf',
                    req.body,
                    mockMDI.logResponse2
                );
                return res(ctx.status(202));
            })
        );

        await delay(1000);
        const { data: getBPData2, status: getBPStatus2 } = await GET(
            `${businessPartnerApi}/BusinessPartner/${id}?$expand=addressData($expand=usages,personPostalAddress,organizationPostalAddress,emailAddresses,phoneNumbers)`,
            {
                auth: admin,
            }
        );
        expect(getBPStatus2).toBe(200);

        // restriction on deletion
        const [validToDeleteAddress] = getBPData2.addressData.filter(
            (addr) =>
                addr.usages.filter((usag) => usag.usage.code !== 'XXDEFAULT')
                    .length === addr.usages.length
        );
        const { status: statusDEL } = await DELETE(
            `${businessPartner}(${id})/addressData(${validToDeleteAddress.id})`,
            { auth: admin }
        );
        expect(statusDEL).toBe(204);

        await delay(5000);
        expect(mockMDI.logResponse2.value).toHaveLength(2);

        const instance = { ...mockMDI.logResponse2.value[0].instance };
        expect(instance.addressData.length).toEqual(1);
    });
});
