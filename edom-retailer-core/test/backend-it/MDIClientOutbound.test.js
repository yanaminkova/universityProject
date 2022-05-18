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

// traceability
const traceIssue1 = 'UTILITIESCLOUDSOLUTION-2916';
const traceIssue2 = 'UTILITIESCLOUDSOLUTION-3018';
const traceIssue3 = 'UTILITIESCLOUDSOLUTION-3012';

// update endpoints below when changing versions
const businessPartnerApi = `/api/businessPartner/v1`;
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

describe('MDIClientOutbound it-test', () => {
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
        featureFlags.set('mdi-client-enhancements', false);

        await commonSetupConfigCodes(POST, commonConfigApi, admin);
        await bpSetupConfigCodes(POST, businessPartnerConfigApi, admin);
        mdiMockServer.listen(mockServerConf);
    });

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

    it(`should send BP update if bookkeeping status is not sent (confirmed, alert, failed) ${traceIssue1}`, async () => {
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
            bpMock.completeBpPerson1,
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
            bpMock.completeBpPerson1,
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

        const { data: data3, status: status3 } = await PUT(
            `${businessPartner}/${id3}`,
            bpMock.completeBpPerson1,
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

    it(`should set status to sent after BP creation, set pending to true when (multiple) BP updates (PUT and PATCH) are sent ${traceIssue1}`, async () => {
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

        const createPayload = { ...bpMock.completeBpPersonMix1 };
        const updatePayload = { ...bpMock.completeBpPersonMix2 };

        const patchPayload = { displayId: 'test' };

        // create BP
        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });
        id = postRes.data.id;
        expect(postRes.status).toBe(201);

        await delay(1000);
        const getRes1 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes1.status).toBe(200);
        expect(getRes1.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes1.data.mdiBookKeeping.pending).toBeFalsy();

        await delay(1000);
        const putRes1 = await PUT(`${businessPartner}/${id}`, updatePayload, {
            auth: admin,
        });
        expect(putRes1.status).toBe(200);

        await delay(1000);
        const getRes2 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes2.status).toBe(200);
        expect(getRes2.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes2.data.mdiBookKeeping.pending).toBeTruthy();

        await delay(1000);
        const patchRes = await PATCH(`${businessPartner}/${id}`, patchPayload, {
            auth: admin,
        });
        expect(patchRes.status).toBe(200);

        await delay(1000);
        const getRes3 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes3.status).toBe(200);
        expect(getRes3.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes3.data.mdiBookKeeping.pending).toBeTruthy();
    });

    it(`should set status to sent after BP creation, set pending to true when multiple BP PATCHes are sent ${traceIssue1}`, async () => {
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

        const createPayload = { ...bpMock.completeBpPersonMix1 };
        const updatePayload = { ...bpMock.completeBpPersonMix2 };

        const {
            displayId,
            person,
            bankAccounts,
            taxNumbers,
            roles,
            addressData,
            customerInformation,
        } = updatePayload;

        // create BP
        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });
        id = postRes.data.id;
        expect(postRes.status).toBe(201);

        await delay(1000);
        const getRes1 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes1.status).toBe(200);
        expect(getRes1.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes1.data.mdiBookKeeping.pending).toBeFalsy();

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

        await delay(1000);
        const patchRes1 = await PATCH(
            `${businessPartner}/${id}`,
            { displayId },
            {
                auth: admin,
            }
        );
        expect(patchRes1.status).toBe(200);

        await delay(1000);
        const patchRes2 = await PATCH(
            `${businessPartner}/${id}`,
            { person },
            {
                auth: admin,
            }
        );
        expect(patchRes2.status).toBe(200);

        await delay(1000);
        const patchRes3 = await PATCH(
            `${businessPartner}/${id}`,
            { bankAccounts },
            {
                auth: admin,
            }
        );
        expect(patchRes3.status).toBe(200);

        await delay(1000);
        const patchRes4 = await PATCH(
            `${businessPartner}/${id}`,
            { taxNumbers },
            {
                auth: admin,
            }
        );
        expect(patchRes4.status).toBe(200);

        await delay(1000);
        const patchRes5 = await PATCH(
            `${businessPartner}/${id}`,
            { roles },
            {
                auth: admin,
            }
        );
        expect(patchRes5.status).toBe(200);

        await delay(1000);
        const patchRes6 = await PATCH(
            `${businessPartner}/${id}`,
            { addressData },
            {
                auth: admin,
            }
        );
        expect(patchRes6.status).toBe(200);

        await delay(1000);
        const patchRes7 = await PATCH(
            `${businessPartner}/${id}`,
            { customerInformation },
            {
                auth: admin,
            }
        );
        expect(patchRes7.status).toBe(200);

        await delay(1000);
        const getRes2 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes2.status).toBe(200);
        expect(getRes2.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes2.data.mdiBookKeeping.pending).toBeTruthy();
    });

    it(`should set status to failed after BP creation, set status to sent after a BP update ${traceIssue1}`, async () => {
        // mock MDI
        mdiMockServer.use(
            rest.post(changeUrl, (req, res, ctx) => {
                return res(ctx.status(500));
            })
        );

        const createPayload = { ...bpMock.completeBpPersonMix1 };
        const updatePayload = { ...bpMock.completeBpPersonMix2 };

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });
        id = postRes.data.id;
        expect(postRes.status).toBe(201);

        await delay(1000);
        const getRes1 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes1.status).toBe(200);
        expect(getRes1.data.mdiBookKeeping.status).toBe('alert');
        expect(getRes1.data.mdiBookKeeping.pending).toBeFalsy();

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

        await delay(1000);
        const putRes1 = await PUT(`${businessPartner}/${id}`, updatePayload, {
            auth: admin,
        });
        expect(putRes1.status).toBe(200);

        await delay(1000);
        const getRes2 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes2.status).toBe(200);
        expect(getRes2.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes2.data.mdiBookKeeping.pending).toBeFalsy();
    });

    it(`should set status to failed after BP creation, set status to failed again after a BP update ${traceIssue1}`, async () => {
        // mock MDI
        mdiMockServer.use(
            rest.post(changeUrl, (req, res, ctx) => {
                return res(ctx.status(500));
            })
        );

        const createPayload = { ...bpMock.completeBpPersonMix1 };
        const updatePayload = { ...bpMock.completeBpPersonMix2 };

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });
        id = postRes.data.id;
        expect(postRes.status).toBe(201);

        await delay(1000);
        const getRes1 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes1.status).toBe(200);
        expect(getRes1.data.mdiBookKeeping.status).toBe('alert');
        expect(getRes1.data.mdiBookKeeping.pending).toBeFalsy();

        await delay(1000);
        const putRes1 = await PUT(`${businessPartner}/${id}`, updatePayload, {
            auth: admin,
        });
        expect(putRes1.status).toBe(200);

        await delay(1000);
        const getRes2 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes2.status).toBe(200);
        expect(getRes2.data.mdiBookKeeping.status).toBe('alert');
        expect(getRes2.data.mdiBookKeeping.pending).toBeFalsy();
    });

    it(`should match the BP payloads sent and the BP instances received by MDI (PUT) ${traceIssue1}`, async () => {
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
        const updatePayload = { ...bpMock.completeBpPersonMix2 };

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
        const putRes1 = await PUT(`${businessPartner}/${id}`, updatePayload, {
            auth: admin,
        });
        expect(putRes1.status).toBe(200);
        updatePayload.id = id;

        await delay(1000);
        expect(mockMDI.logResponse2.value).toHaveLength(2);

        const instance = { ...mockMDI.logResponse2.value[0].instance };
        delete instance.displayId;
        expect(instance).toStrictEqual(updatePayload);
    });

    it(`should match the BP payloads sent and the BP instances received by MDI  (PATCH) ${traceIssue1}`, async () => {
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
        const updatePayload = { ...bpMock.completeBpPersonMix2 };
        const {
            person,
            bankAccounts,
            taxNumbers,
            roles,
            addressData,
            customerInformation,
        } = updatePayload;

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
            }),
            rest.get(logUrl, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(mockMDI.logResponse2));
            })
        );

        await delay(1000);
        const patchRes1 = await PATCH(
            `${businessPartner}/${id}`,
            { bankAccounts, roles, person },
            {
                auth: admin,
            }
        );
        expect(patchRes1.status).toBe(200);

        await delay(1000);
        expect(mockMDI.logResponse2.value).toHaveLength(2);

        const instance2 = { ...mockMDI.logResponse2.value[0].instance };
        delete instance2.displayId;
        expect(instance2).toStrictEqual({
            id,
            ...createPayload,
            bankAccounts,
            roles,
            person,
        });

        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        const getRes2 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes2.status).toBe(200);
        expect(getRes2.data.mdiBookKeeping.status).toBe('confirmed');
        expect(getRes2.data.mdiBookKeeping.pending).toBeFalsy();
        expect(getRes2.data.mdiBookKeeping.keys).toBeTruthy();

        // mock MDI
        mdiMockServer.use(
            rest.post(changeUrl, (req, res, ctx) => {
                mockMDI.insert(
                    'updateFromC4Uf',
                    req.body,
                    mockMDI.logResponse3
                );
                return res(ctx.status(202));
            }),
            rest.get(logUrl, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(mockMDI.logResponse3));
            })
        );

        await delay(1000);
        const patchRes3 = await PATCH(
            `${businessPartner}/${id}`,
            { taxNumbers, addressData, customerInformation },
            {
                auth: admin,
            }
        );
        expect(patchRes3.status).toBe(200);
        updatePayload.id = id;

        await delay(1000);
        expect(mockMDI.logResponse3.value).toHaveLength(2);

        const instance3 = { ...mockMDI.logResponse3.value[0].instance };
        delete instance3.displayId;
        expect(instance3).toStrictEqual(updatePayload);

        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        const getRes3 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes3.status).toBe(200);
        expect(getRes3.data.mdiBookKeeping.status).toBe('confirmed');
        expect(getRes3.data.mdiBookKeeping.pending).toBeFalsy();
        expect(getRes3.data.mdiBookKeeping.keys).toBeTruthy();
    });
});
