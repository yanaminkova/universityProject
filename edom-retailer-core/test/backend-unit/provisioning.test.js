const cds = require('@sap/cds');
const path = require('path');
const { launchServer } = require('../lib/testkit');
const expect = require('expect');

const TENANT_SEPERATOR = '.';
const URL = 'retailer.utilities.industry.cloud.sap';
const SUBDOMAIN = 'retailer-consumer';
const XSAPPNAME = 'test-dependency-xsappname';
process.env.CDS_MULTITENANCY_APPUI_TENANTSEPARATOR = TENANT_SEPERATOR;
process.env.CDS_MULTITENANCY_APPUI_URL = URL;
process.env.CDS_MULTITENANCY_DEPS = JSON.stringify([
    'test-dependency',
    'empty-dependency',
    'empty-credentials',
    'empty-xsappname-credentials',
]);
process.env.VCAP_SERVICES = JSON.stringify({
    test: [
        {
            name: 'test-dependency',
            credentials: { xsappname: XSAPPNAME },
        },
        {
            name: 'empty-dependency',
        },
        {
            name: 'empty-credentials',
            credentials: {},
        },
        {
            name: 'empty-xsappname-credentials',
            credentials: {
                xsappname: null,
                uaa: {
                    xsappname: XSAPPNAME,
                },
            },
        },
    ],
});

describe('Provisioning', () => {
    let provisioning;

    beforeAll(async () => {
        // REVISIT: fragile!
        try {
            cds.model = await cds.load(
                path.join(
                    __dirname,
                    '../../node_modules/@sap/cds-mtx/lib/api/provisioning/index'
                )
            );
        } catch (e) {
            cds.model = await cds.load(
                path.join(cds.home, '../cds-mtx/lib/api/provisioning/index')
            );
        }
        provisioning = await cds
            .serve('ProvisioningService')
            .with(path.join(__dirname, '../../srv/provisioning'));
    });

    it('should return a url on UPDATE tenant', async () => {
        const { handler } = provisioning._handlers.on.find((handler) =>
            handler.for({
                event: 'UPDATE',
                path: 'ProvisioningService.tenant',
            })
        );
        const result = await handler(
            {
                data: {
                    subscribedSubdomain: SUBDOMAIN,
                },
            },
            () => {
                /* empty next call */
            }
        );
        expect(result).toBe(`https://${SUBDOMAIN}${TENANT_SEPERATOR}${URL}`);
    });

    it('should delete tenant', async () => {
        const { handler } = provisioning._handlers.on.find((handler) =>
            handler.for({
                event: 'DELETE',
                path: 'ProvisioningService.tenant',
            })
        );

        await handler(
            {
                data: {
                    subscribedSubdomain: SUBDOMAIN,
                },
            },
            () => {
                /* empty next call */
            }
        );
    });

    it('should throw an error if subscribedSubdomain is not provided on UPDATE tenant', async () => {
        return new Promise((resolve) => {
            const { handler } = provisioning._handlers.on.find((handler) =>
                handler.for({
                    event: 'UPDATE',
                    path: 'ProvisioningService.tenant',
                })
            );

            handler({
                data: {},
                reject: (error) => {
                    expect(error).toBeDefined();
                    resolve();
                },
            });
        });
    });

    it('should throw an error if subscribedSubdomain is not provided on DELETE tenant', async () => {
        return new Promise((resolve) => {
            const { handler } = provisioning._handlers.on.find((handler) =>
                handler.for({
                    event: 'DELETE',
                    path: 'ProvisioningService.tenant',
                })
            );

            handler(
                {
                    data: {},
                    reject: (error) => {
                        expect(error).toBeDefined();
                        resolve();
                    },
                } /* empty next call */
            );
        });
    });

    it('should dependencies', async () => {
        const result = await provisioning.dependencies();
        expect(result.length).toBe(2);
        expect(result[0].xsappname).toBe(XSAPPNAME);
        expect(result[1].xsappname).toBe(XSAPPNAME);
    });
});
