process.env.NODE_ENV = 'production';

const cds = require('@sap/cds');
const express = require('express');
const logger = require('cf-nodejs-logging-support');

cds.on('bootstrap', async () => {
    try {
        const app = express();

        await cds.connect.to('db');
        await cds.mtx.in(app);

        cds.model = await cds.load('*');

        /*
         * Released Services
         */
        await cds.serve('ConfigurationService').in(app);
        await cds.serve('DistributionService').in(app);
        await cds.serve('DistributionConfigurationService').in(app);
        await cds.serve('BillingAccountServiceInternal').in(app);
        await cds.serve('TechnicalMasterDataService').in(app);

        /*
         * Beta Services
         */
        if (cds.env.features.beta) {
            await cds.serve('BillableItemsService').in(app);
        }

        const messageServices = Object.values(cds.services).filter(
            (value) => value.kind === 'enterprise-messaging'
        );
        if (!messageServices.length) {
            process.exit(0);
        }

        // connect to message clients here
        const provisioning = await cds.connect.to('ProvisioningService');

        const user = new cds.User.Privileged();
        const tx = provisioning.transaction({
            user,
        });
        const tenants = await tx.read('tenant');
        if (tenants === null || !tenants.length) {
            process.exit(0);
        }

        const tenantInfo = tenants.map((o) => ({
            subdomain: o.subscribedSubdomain,
            tenant: o.subscribedTenantId,
        }));

        await Promise.all(
            tenantInfo.map(async (info) => {
                try {
                    await Promise.all(
                        messageServices.map(async (m) => {
                            const management = await m
                                .getManagement(info.subdomain)
                                .waitUntilReady();

                            return management.deploy();
                        })
                    );

                    logger.info(
                        `[upgradeEM] EM queue and subscription for tenant ${info.tenant}, subdomain: ${info.subdomain} is successfully done`
                    );
                } catch (error) {
                    logger.error(
                        `[upgradeEM] EM queue and subscription for tenant ${info.tenant}, subdomain: ${info.subdomain}, message: ${error.message}`
                    );
                }
            })
        );
    } catch (error) {
        logger.error(`[upgradeEM] ${error.message}`);
    }

    process.exit(0);
});

cds.emit('bootstrap');
