const expect = require('expect');
const cds = require('@sap/cds');
const xsenv = require('@sap/xsenv');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const { pause, mockServerConf } = require('../../lib/testkit');

describe('FeatureFlagService unit tests UTILITIESCLOUDSOLUTION-2950', () => {
    process.env.NODE_ENV = 'production';

    const ffUri = 'https://feature-flags.cfapps.eu10.hana.ondemand.com';

    const mockFilterServices = jest.fn().mockImplementation(() => [{}]);
    const mockServiceCredentials = jest.fn().mockImplementation(() => {
        return {
            uri: ffUri,
            password: 'myClientSecret',
            username: 'myClientId',
        };
    });

    xsenv.filterServices = mockFilterServices;
    xsenv.serviceCredentials = mockServiceCredentials;

    const mockServer = setupServer();

    beforeAll(() => {
        mockServer.listen(mockServerConf);
    });

    afterAll(() => {
        mockServer.close();
    });

    afterEach(() => {
        mockServer.resetHandlers();
        mockDisconnect.mockClear();
    });

    const mockDisconnect = jest
        .fn()
        .mockImplementation((callback) => callback(null, true));

    const featureFlagId = 'business-partner';
    const tenant = 'foundation-retailer';
    const featureFlagId1 = 'business-partner';
    const featureFlagId3 = 'extensibility';

    it('should evaluate feature flag as false when response is false', async () => {
        mockServer.use(
            rest.get(
                `${ffUri}/api/v2/evaluate/${featureFlagId}?identifier=${tenant}`,
                (_, res, ctx) => {
                    return res(
                        ctx.status(200),
                        ctx.json({
                            type: 'BOOLEAN',
                            variation: 'false',
                        })
                    );
                }
            )
        );

        const featureFlag = await cds.connect.to('featureFlags');
        const result = await featureFlag.evaluate(featureFlagId, tenant);
        expect(result).toBe(false);
    });

    it('should evaluate feature flag as true', async () => {
        mockServer.use(
            rest.get(
                `${ffUri}/api/v2/evaluate/${featureFlagId}?identifier=${tenant}`,
                (_, res, ctx) => {
                    return res(
                        ctx.status(200),
                        ctx.json({
                            type: 'BOOLEAN',
                            variation: 'true',
                        })
                    );
                }
            )
        );

        const featureFlag = await cds.connect.to('featureFlags');
        const result = await featureFlag.evaluate(featureFlagId, tenant);
        expect(result).toBe(true);
    });

    it('should evaluate feature flag as false when error returned', async () => {
        mockServer.use(
            rest.get(
                `${ffUri}/api/v2/evaluate/${featureFlagId}?identifier=${tenant}`,
                (_, res, ctx) => {
                    return res(ctx.status(404));
                }
            )
        );

        const featureFlag = await cds.connect.to('featureFlags');
        const result = await featureFlag.evaluate(featureFlagId, tenant);
        expect(result).toBe(false);
    });

    it('should return cached value on 2nd request', async () => {
        mockServer.use(
            rest.get(
                `${ffUri}/api/v2/evaluate/${featureFlagId}?identifier=${tenant}`,
                (_, res, ctx) => {
                    return res(
                        ctx.status(200),
                        ctx.json({
                            type: 'BOOLEAN',
                            variation: 'true',
                        })
                    );
                }
            )
        );

        const featureFlag = await cds.connect.to('featureFlags');
        const result1 = await featureFlag.evaluate(
            featureFlagId,
            tenant,
            false
        );
        expect(result1).toBe(true);

        mockServer.use(
            rest.get(
                `${ffUri}/api/v2/evaluate/${featureFlagId}?identifier=${tenant}`,
                (_, res, ctx) => {
                    return res(ctx.status(404));
                }
            )
        );

        const result2 = await featureFlag.evaluate(featureFlagId, tenant, true);
        expect(result2).toBe(true);
    });

    it('should not return expired cached value on 2nd request', async () => {
        mockServer.use(
            rest.get(
                `${ffUri}/api/v2/evaluate/${featureFlagId}?identifier=${tenant}`,
                (_, res, ctx) => {
                    return res(
                        ctx.status(200),
                        ctx.json({
                            type: 'BOOLEAN',
                            variation: 'true',
                        })
                    );
                }
            )
        );

        const oneSecondLater = new Date(new Date().getTime() + 1000);

        const featureFlag = await cds.connect.to('featureFlags');
        const result1 = await featureFlag.evaluate(
            featureFlagId,
            tenant,
            false,
            oneSecondLater
        );
        expect(result1).toBe(true);

        await pause();

        mockServer.use(
            rest.get(
                `${ffUri}/api/v2/evaluate/${featureFlagId}?identifier=${tenant}`,
                (_, res, ctx) => {
                    return res(ctx.status(404));
                }
            )
        );

        const result2 = await featureFlag.evaluate(featureFlagId, tenant, true);
        expect(result2).toBe(false);
    });

    it('should evaluate set of feature flag values as true or false per respective FF status', async () => {
        mockServer.use(
            rest.get(
                `${ffUri}/api/v2/evaluateset?${featureFlagId1}&${featureFlagId3}&identifier=${tenant}`,
                (_, res, ctx) => {
                    return res(
                        ctx.status(200),
                        ctx.json(
                            JSON.parse(`{
                            "${featureFlagId1}": {
                                "${tenant}" : {
                                    "type": "BOOLEAN",
                                    "variation": "false"
                                }
                            },
                            "${featureFlagId3}": {
                                "${tenant}" : {
                                    "type": "BOOLEAN",
                                    "variation": "false"
                                }
                            }
                        }`)
                        )
                    );
                }
            )
        );

        const featureFlag = await cds.connect.to('featureFlags');
        const result = await featureFlag.evaluateSet(
            [featureFlagId1, featureFlagId3],
            tenant
        );
        expect(result[0][1]).toBe(false); // FF status for featureFlagId1
        expect(result[1][1]).toBe(false); // FF status for featureFlagId3
    });

    it('should evaluate set of feature flags as empty array when error returned', async () => {
        mockServer.use(
            rest.get(
                `${ffUri}/api/v2/evaluateset?${featureFlagId1}&${featureFlagId3}&identifier=${tenant}`,
                (_, res, ctx) => {
                    return res(ctx.status(404));
                }
            )
        );

        const featureFlag = await cds.connect.to('featureFlags');
        const result = await featureFlag.evaluateSet(
            [featureFlagId1, featureFlagId3],
            tenant
        );
        expect(result.length).toBe(0);
    });
});
