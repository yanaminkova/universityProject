/**
 * @name upgradeTenants
 * @description A job for upgrading all tenants of the current environment. Launched as a hook or node run.
 * @example for the hooks https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/b9245ba90aa14681a416065df8e8c593.html
 * @example for the running configuration see .vscode/launch.json
 *
 * @namespace srv.hooks
 */

process.env.NODE_ENV = 'production';

const cds = require('@sap/cds');
const express = require('express');
const Tenant = require('@sap/cds-mtx/lib/tenant/index');
const logger = require('cf-nodejs-logging-support');

// bootstraping cds to get an access to cds.mtx.in function
cds.on('bootstrap', async () => {
    try {
        logger.info('[upgradeTenants] bootstrap event emitted');
        const db = await cds.connect.to('db');

        await cds.mtx.in(express());

        cds.model = await cds.load('*');

        // allows the task for each tenant to be long, the default value is only 300ms
        cds.env.requires.db.pool = { acquireTimeoutMillis: 300000 };

        // main command, returns object with the upgrade info for each tenant
        const statuses = await Tenant.updateBaseModelSync({}, ['all'], true);
        logger.info(`[upgradeTenants][statuses] ${JSON.stringify(statuses)}`);

        const tenantIds = Object.keys(statuses.tenants).reduce(
            (failedTenantIds, tenant) => {
                const statusObject = statuses.tenants[tenant];
                switch (statusObject.status) {
                    case 'SUCCESS':
                        logger.info(
                            `[upgradeTenants] DB migration for tenant ${tenant} is successfully done`
                        );
                        break;
                    case 'NON-EXISTENT':
                        logger.error(
                            `[upgradeTenants] DB migration for tenant ${tenant} failed. Tenant ${tenant} no longer exists.`
                        );
                        break;
                    default:
                        logger.error(
                            `[upgradeTenants] DB migration failed for tenant ${tenant}, message: ${statusObject.message}, buildLog: ${statusObject.buildLogs}`
                        );
                        failedTenantIds.push(tenant);
                        break;
                }
                return failedTenantIds;
            },
            []
        );

        // the process needs to be finished with some code, otherwise never ends
        if (tenantIds.length > 0) {
            logger.error(
                `[upgradeTenants] DB Migration failed to execute. Failed tenants: ${JSON.stringify(
                    tenantIds
                )}`
            );
            process.exit(1);
        }

        logger.info(
            `[upgradeTenants] DB Migration executed successfully. Starting the post-processing.`
        );

        await require('./upgradeTenantsPostProcessing')(
            db,
            Object.keys(statuses.tenants)
        );

        logger.info(
            `[upgradeTenants] Post processing is finished. Exiting the script with code 0.`
        );

        process.exit(0);
    } catch (e) {
        logger.error(`[upgradeTenants][InternalError] ${JSON.stringify(e)}`);
        process.exit(1);
    }
});

cds.emit('bootstrap');
