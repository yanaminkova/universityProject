const cds = require('@sap/cds');
const expect = require('expect');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const { launchServer, mockServerConf } = require('../lib/testkit');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
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

// Legend:
// [BETA] = need to update line/s below when moving (from beta) to release

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

const { GET, POST, PUT, PATCH, admin } = launchServer({
    service: {
        paths: servicePaths,
    },
});

describe('MDIClientInbound it-test', () => {
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

        // setup BP config codes
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

    it(`should create (POST) BP C4Uf to MDI and set status to confirmed after reading MDIClient ${traceIssue1}`, async () => {
        // Scenario: Create > Confirmed
        // - Create BP on C4Uf (send to MDI, MDI creates the request, S4 sends an update to MDI)
        // - Read MDIClient (pending status conflicts with update from S4, set alert status)

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

        const createPayload = bpMock.completeBpPersonMix1;

        // post BP to MDIClient
        const { status: postStatus, data: postData } = await POST(
            businessPartner,
            createPayload,
            {
                auth: admin,
            }
        );
        expect(postStatus).toBe(201);

        const { id } = postData;

        // read MDIClient
        await GET(mdiClient, {
            auth: admin,
        });

        // check BP bookkeeping details
        const { status, data } = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
        expect(data.mdiBookKeeping.status).toBe('confirmed');
        expect(data.mdiBookKeeping.pending).toBeFalsy();
    });

    it(`should update (PATCH) BP C4Uf to MDI and set status to confirmed after reading MDIClient ${traceIssue1}`, async () => {
        // Scenario: Create > Confirmed > Update > Confirmed
        // - Create BP on C4Uf (send to MDI, MDI creates the request, S4 sends an update to MDI)
        // - Read MDIClient (confirm created BP)
        // - Update same BP in C4Uf (send to MDI, MDI creates the request, S4 sends an update to MDI)
        // - Read MDIClient (confirm updated BP)

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
        const updatePayload = { ...bpMock.nameDetails };

        const postRes = await POST(businessPartner, createPayload, {
            auth: admin,
        });
        id = postRes.data.id;
        expect(postRes.status).toBe(201);

        await delay(1000);
        expect(mockMDI.logResponse1.value).toHaveLength(2);

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
        const putRes1 = await PATCH(
            `${businessPartner}/${id}/person/nameDetails`,
            updatePayload,
            {
                auth: admin,
            }
        );
        expect(putRes1.status).toBe(200);

        await delay(1000);
        const getRes2 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes2.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes2.data.mdiBookKeeping.pending).toBeFalsy();

        await delay(1000);
        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        expect(mockMDI.logResponse2.value).toHaveLength(2);

        const getRes4 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes4.status).toBe(200);
        expect(getRes4.data.mdiBookKeeping.status).toBe('confirmed');
        expect(getRes4.data.mdiBookKeeping.pending).toBeFalsy();

        await delay(1000);
        const getRes5 = await GET(
            `${businessPartner}/${id}?$expand=person($expand=nameDetails)`,
            {
                auth: admin,
            }
        );
        expect(getRes5.data.person.nameDetails.lastName).toBe('updated-haynes');
    });

    it(`sends a consecutive create (POST) and update (PUT) BP from C4Uf to MDI, it should set bookkeeping status as alert after reading MDIClient ${traceIssue1}`, async () => {
        // Scenario: Create > Update (Pending) > Alert
        // - Create BP on C4Uf (send to MDI, MDI creates the request, S4 sends an update to MDI)
        // - Update same BP in C4Uf (pending, not sent to MDI)
        // - Read MDIClient (pending status conflicts with update from S4, set alert status)

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

        const instance = { ...mockMDI.logResponse1.value[0].instance };
        delete instance.displayId;
        expect(instance).toStrictEqual(createPayload);

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
        expect(getRes2.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes2.data.mdiBookKeeping.pending).toBeTruthy();

        await delay(1000);
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
        expect(getRes1.data.mdiBookKeeping.status).toBe('alert');
        expect(getRes1.data.mdiBookKeeping.pending).toBeFalsy();

        await delay(1000);
        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        expect(mockMDI.logResponse2.value).toHaveLength(0);
    });

    it(`sends a consecutive create (POST) and update (POST subentity) BP from C4Uf to MDI, it should set bookkeeping status as alert after reading MDIClient ${traceIssue1}`, async () => {
        // Scenario: Create > Update (Pending) > Alert
        // - Create BP on C4Uf (send to MDI, MDI creates the request, S4 sends an update to MDI)
        // - Update same BP in C4Uf (pending, not sent to MDI)
        // - Read MDIClient (pending status conflicts with update from S4, set alert status)

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

        const createPayload = { ...bpMock.completeBpPerson1 };
        const createSubentityPayload = {
            address: 'test.post.subentity@email.com',
        };

        const postRes1 = await POST(businessPartner, createPayload, {
            auth: admin,
        });
        id = postRes1.data.id;
        const addressDataId = postRes1.data.addressData[0].id;
        expect(postRes1.status).toBe(201);

        await delay(1000);
        expect(mockMDI.logResponse1.value).toHaveLength(2);

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
        const postRes2 = await POST(
            `${businessPartner}/${id}/addressData/${addressDataId}/emailAddresses`,
            createSubentityPayload,
            {
                auth: admin,
            }
        );
        expect(postRes2.status).toBe(201);

        await delay(1000);
        const getRes2 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes2.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes2.data.mdiBookKeeping.pending).toBeTruthy();

        await delay(1000);
        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        expect(mockMDI.logResponse2.value).toHaveLength(0);

        const getRes3 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes3.status).toBe(200);
        expect(getRes3.data.mdiBookKeeping.status).toBe('alert');
        expect(getRes3.data.mdiBookKeeping.pending).toBeFalsy();
    });

    it(`sends consecutive BP updates (PUT) from C4Uf to MDI, it should set bookkeeping status as alert after reading MDIClient ${traceIssue1}`, async () => {
        // Scenario: Create > Confirmed > Update > Update (Pending) > Alert
        // - Create BP on C4Uf (send to MDI, MDI creates the request, S4 sends an update to MDI)
        // - Read MDIClient (confirmed created BP)
        // - Update same BP in C4Uf (send to MDI, MDI creates the request, S4 sends an update to MDI)
        // - Update same BP in C4Uf (pending, not sent to MDI)
        // - Read MDIClient (pending status conflicts with update from S4, set alert status)

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

        const instance = { ...mockMDI.logResponse1.value[0].instance };
        delete instance.displayId;
        expect(instance).toStrictEqual(createPayload);

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
        expect(getRes2.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes2.data.mdiBookKeeping.pending).toBeFalsy();

        await delay(1000);
        const putRes2 = await PUT(`${businessPartner}/${id}`, updatePayload, {
            auth: admin,
        });
        expect(putRes2.status).toBe(200);

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

        await delay(1000);
        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        expect(mockMDI.logResponse2.value).toHaveLength(2);

        const getRes4 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes4.status).toBe(200);
        expect(getRes4.data.mdiBookKeeping.status).toBe('alert');
        expect(getRes4.data.mdiBookKeeping.pending).toBeFalsy();

        await delay(1000);
        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        expect(mockMDI.logResponse3.value).toHaveLength(0);
    });

    it.skip(`sends consecutive BP updates (PUT) from C4Uf to MDI, it should set bookkeeping status as sent after reading MDIClient ${traceIssue1}`, async () => {
        // Scenario: Create > Confirmed > Update > Update (Pending) > Sent or Confirmed
        // - Create BP on C4Uf (send to MDI, MDI creates the request, S4 sends an update to MDI)
        // - Read MDIClient (confirm created BP)
        // - Update same BP in C4Uf (send to MDI, MDI doesn't update BP)
        // - Update same BP in C4Uf (pending, not sent to MDI)
        // - Read MDIClient (confirm updated BP, send pending BPs)
        // - Read MDIClient (confirm updated BP)

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

        const instance = { ...mockMDI.logResponse1.value[0].instance };
        delete instance.displayId;
        expect(instance).toStrictEqual(createPayload);

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

        // mock MDI
        mdiMockServer.use(
            rest.post(changeUrl, (req, res, ctx) => {
                mockMDI.insert(
                    'updateFromC4Ufv2',
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

        await delay(1000);
        const getRes2 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes2.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes2.data.mdiBookKeeping.pending).toBeFalsy();

        await delay(1000);
        const putRes2 = await PUT(`${businessPartner}/${id}`, updatePayload, {
            auth: admin,
        });
        expect(putRes2.status).toBe(200);

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

        // mock MDI
        mdiMockServer.use(
            rest.post(changeUrl, (req, res, ctx) => {
                mockMDI.insert(
                    'updateFromC4Ufv2',
                    req.body,
                    mockMDI.logResponse3
                );
                return res(ctx.status(202));
            }),
            rest.get(logUrl, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(mockMDI.logResponse2));
            })
        );

        await delay(1000);
        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        expect(mockMDI.logResponse2.value).toHaveLength(1);

        const getRes4 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes4.status).toBe(200);
        expect(getRes4.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes4.data.mdiBookKeeping.pending).toBeFalsy();

        // mock MDI
        mdiMockServer.use(
            rest.get(logUrl, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(mockMDI.logResponse3));
            })
        );

        await delay(1000);
        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        expect(mockMDI.logResponse3.value).toHaveLength(1);

        const getRes5 = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getRes5.status).toBe(200);
        expect(getRes5.data.mdiBookKeeping.status).toBe('confirmed');
        expect(getRes5.data.mdiBookKeeping.pending).toBeFalsy();
    });

    it(`should replicate created BP on MDI to C4Uf and set status to confirmed after reading MDIClient ${traceIssue1}`, async () => {
        // Scenario: S4 Create > Replicate
        // - Read MDIClient (receives create BP event, replicate to C4Uf)

        // mock MDI
        mdiMockServer.use(
            rest.get(logUrl, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(mockMDI.logResponse1));
            })
        );
        const id = cds.utils.uuid();
        const createPayload = { id, ...bpMock.completeBpPersonMix1 };
        const mdiObj = {
            versionId: cds.utils.uuid(),
            instance: createPayload,
        };

        // create BP on MDI
        mockMDI.insert('createFromS4', mdiObj, mockMDI.logResponse1);

        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        const { status, data } = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
        expect(data.mdiBookKeeping.status).toBe('confirmed');
        expect(data.mdiBookKeeping.pending).toBeFalsy();
    });

    it(`should reject BP update and set bookkeeping status as alert with error message ${traceIssue1}`, async () => {
        // Scenario: S4 Create > Replicate > Update > Alert
        // - Read MDIClient (receives create BP event, replicate to C4Uf)
        // - **** S4 sends an update changing the latest version ID ****
        // - Update same BP in C4Uf (send to MDI, MDI rejects due to invalid previous version Id)
        // - Read MDIClient (rejects update on BP, set alert status)

        // mock MDI
        mdiMockServer.use(
            rest.get(logUrl, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(mockMDI.logResponse1));
            })
        );

        const createPayload = { ...bpMock.completeBpPersonMix1 };
        const updatePayload = { ...bpMock.completeBpPersonMix2 };

        const id = cds.utils.uuid();
        const mdiObj = {
            versionId: cds.utils.uuid(),
            instance: { id, ...createPayload },
        };

        // create BP on MDI
        mockMDI.insert('createFromS4', mdiObj, mockMDI.logResponse1);

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

        // mock MDI
        mdiMockServer.use(
            rest.post(changeUrl, (req, res, ctx) => {
                mockMDI.insert(
                    'invalidPrevVerId',
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
        expect(getRes2.data.mdiBookKeeping.status).toBe('sent');
        expect(getRes2.data.mdiBookKeeping.pending).toBeFalsy();
        const previousVersionId = getRes2.data.mdiBookKeeping.versionId;

        await delay(1000);
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
        expect(getRes3.data.mdiBookKeeping.status).toBe('alert');
        expect(getRes3.data.mdiBookKeeping.errorMessage).toBe(
            `Invalid previous version ID: ${previousVersionId}`
        );
        expect(getRes3.data.mdiBookKeeping.pending).toBeFalsy();
    });

    it(`should store the Business Partner keys in mdiBookKeeping field ${traceIssue1}`, async () => {
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

        const instance = { ...mockMDI.logResponse1.value[0].instance };
        delete instance.displayId;
        expect(instance).toStrictEqual(createPayload);

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

        ['bankAccounts', 'roles', 'taxNumbers', 'addressData'].forEach(
            (field) => {
                expect(
                    JSON.parse(getRes1.data.mdiBookKeeping.keys)
                ).toHaveProperty(field);
            }
        );

        const { bankAccounts, roles, taxNumbers, addressData } = JSON.parse(
            getRes1.data.mdiBookKeeping.keys
        );
        expect(bankAccounts).toHaveLength(2);
        expect(roles).toHaveLength(3);
        expect(taxNumbers).toHaveLength(2);
        expect(addressData).toHaveLength(2);

        ['usages', 'emailAddresses', 'phoneNumbers'].forEach((field) => {
            expect(addressData[0]).toHaveProperty(field);
        });
        expect(addressData[0].usages).toHaveLength(2);
        expect(addressData[0].emailAddresses).toHaveLength(2);
        expect(addressData[0].phoneNumbers).toHaveLength(2);

        expect(addressData[0].usages[0]).toHaveProperty('usage_code');
        expect(addressData[0].usages[0]).toHaveProperty('validTo');
    });
});

/*describe('MDIClientInbound it-test', () => {
    // enabling mock feature flags
    cds.env.requires.featureFlags = {
        impl: 'test/backend-it/external/FeatureFlagsTestService',
    };

    const { GET, POST, PUT, PATCH, admin } = launchServer({
        service: {
            paths: servicePaths,
        },
    });

    const businessPartner = `${businessPartnerApi}/BusinessPartner`;
    const businessPartnerBookkeeping = `${businessPartnerApi}/BusinessPartnerBookKeeping`;
    const mdiClient = `${mdiClientApi}/MDIClient`;

    const mdiDestUrl = 'https://mdi-test.com';

    async function delay(ms) {
        return await new Promise((resolve) => setTimeout(() => resolve(), ms));
    }

    const bpEntity = `${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner`;
    const changeUrl = `${mdiDestUrl}/${bpEntity}/requests`;
    const logUrl = `${mdiDestUrl}/${bpEntity}/events`;

    const mdiMockServer = setupServer();
    let mockMDI;

    beforeAll(async () => {
        // manually change feature flag return value
        const featureFlags = await cds.connect.to('featureFlags');
        featureFlags.set('mdi-client-enhancements', false);

        // setup BP config codes
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

    it(`should create BP C4Uf to MDI without displayId and update displayId with S4 local Id after reading MDIClient ${traceIssue3}`, async () => {
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

        const createPayload = bpMock.completeBpPersonMix1;

        // post BP to MDIClient
        const { status: postStatus, data: postData } = await POST(
            businessPartner,
            createPayload,
            {
                auth: admin,
            }
        );
        expect(postStatus).toBe(201);

        const { id } = postData;

        await delay(1000);
        // check BP bookkeeping details
        const { status: getStatus1, data: getData1 } = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getStatus1).toBe(200);
        expect(getData1.displayId).toBeFalsy();
        expect(getData1.mdiBookKeeping.displayIdStatus).toBe('notset');

        // read MDIClient
        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        // check BP bookkeeping details
        const { status: getStatus2, data: getData2 } = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getStatus2).toBe(200);
        expect(getData2.displayId).toBeTruthy();
        expect(getData2.mdiBookKeeping.displayIdStatus).toBe('set');
    });

    it(`should replicate created BP on MDI to C4Uf including local Id as displayId ${traceIssue3}`, async () => {
        mdiMockServer.use(
            rest.get(logUrl, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(mockMDI.logResponse1));
            })
        );

        const id = cds.utils.uuid();
        const createPayload = { id, ...bpMock.completeBpPersonMix1 };
        const mdiObj = {
            versionId: cds.utils.uuid(),
            instance: createPayload,
        };

        // create BP on MDI
        mockMDI.insert('createFromS4', mdiObj, mockMDI.logResponse1);

        await GET(mdiClient, {
            auth: admin,
        });

        const { status, data } = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
        expect(data.displayId).toBeTruthy();
        expect(data.mdiBookKeeping.displayIdStatus).toBe('set');
    });

    it(`should patch BP C4Uf to MDI but send the payload without the displayId ${traceIssue3}`, async () => {
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

        const createPayload = bpMock.completeBpPersonMix1;

        // post BP to MDIClient
        const { status: postStatus, data: postData } = await POST(
            businessPartner,
            createPayload,
            {
                auth: admin,
            }
        );
        expect(postStatus).toBe(201);

        const { id } = postData;

        await delay(1000);
        // check BP bookkeeping details
        const { status: getStatus1, data: getData1 } = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getStatus1).toBe(200);
        expect(getData1.displayId).toBeFalsy();
        expect(getData1.mdiBookKeeping.displayIdStatus).toBe('notset');

        // read MDIClient
        await GET(mdiClient, {
            auth: admin,
        });

        await delay(5000);
        // check BP bookkeeping details
        const { status: getStatus2, data: getData2 } = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(getStatus2).toBe(200);
        expect(getData2.displayId).toBeTruthy();
        expect(getData2.mdiBookKeeping.displayIdStatus).toBe('set');

        const { status: patchStatus, data: patchData } = await PATCH(
            `${businessPartner}/${id}`,
            {
                person: {
                    nameDetails: {
                        lastName: 'check displayId updated',
                    },
                },
            },
            {
                auth: admin,
            }
        );

        expect(patchStatus).toBe(200);
        await delay(3000);

        expect(
            mockMDI.logResponse1.value[mockMDI.logResponse1.value.length - 1]
                .instance.person.nameDetails.lastName
        ).toBe('check displayId updated');
        expect(
            mockMDI.logResponse1.value[mockMDI.logResponse1.value.length - 1]
                .instance.displayId
        ).toBeFalsy();
    });

    it(`should replicate created BP on MDI to C4Uf with displayId getting updated from S4 and not from the MDI payload ${traceIssue3}`, async () => {
        mdiMockServer.use(
            rest.get(logUrl, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(mockMDI.logResponse1));
            })
        );

        const id = cds.utils.uuid();
        const createPayload = {
            id,
            displayId: 'sampleId',
            ...bpMock.completeBpPersonMix1,
        };
        const mdiObj = {
            versionId: cds.utils.uuid(),
            instance: createPayload,
        };

        // create BP on MDI
        mockMDI.insert('createFromS4', mdiObj, mockMDI.logResponse1);

        await GET(mdiClient, {
            auth: admin,
        });

        const { status, data } = await GET(
            `${businessPartnerBookkeeping}/${id}?$expand=mdiBookKeeping`,
            {
                auth: admin,
            }
        );
        expect(status).toBe(200);
        expect(data.displayId).not.toBe('sampleId');
        expect(data.mdiBookKeeping.displayIdStatus).toBe('set');
    });
});*/
