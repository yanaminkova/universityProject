const logger = require('cf-nodejs-logging-support');
const xsenv = require('@sap/xsenv');

module.exports = (service) => {
    const appUrl = process.env.CDS_MULTITENANCY_APPUI_URL;
    const separator = process.env.CDS_MULTITENANCY_APPUI_TENANTSEPARATOR;
    const dependencies = process.env.CDS_MULTITENANCY_DEPS
        ? JSON.parse(process.env.CDS_MULTITENANCY_DEPS)
        : [];

    /**
     *  Event handler for returning the tenant specific application URL as a response to an onboarding request
     *
     * @param  {} 'UPDATE'
     * @param  {} 'tenant'
     * @param  {} async(req
     * @param  {} next
     */
    service.on('UPDATE', 'tenant', async (req, next) => {
        logger.info(req.data);

        try {
            const tenantEntryAppURL = `https://${req.data.subscribedSubdomain}${separator}${appUrl}`;

            await next();
            logger.info(
                `[ON_UPDATE_TENANT]: Subscription of tenant ${req.data.subscribedSubdomain} successful: ${tenantEntryAppURL}`
            );
            return tenantEntryAppURL;
        } catch (err) {
            logger.error(
                `[ON_UPDATE_TENANT]: Subscription of tenant [${req.data.subscribedSubdomain}] has failed: ${err.message}`
            );
            const e = new Error('InternalServerError');
            e.statusCode = 500;
            req.reject(e);

            return null;
        }
    });

    /**
     * Event handler for processing an offboarding request
     *
     * @param  {} 'DELETE'
     * @param  {} 'tenant'
     * @param  {} async(req
     * @param  {} next
     */
    service.on('DELETE', 'tenant', async (req, next) => {
        try {
            logger.info(
                `[ON_DELETE_TENANT]: Unsubscription of tenant ${req.data.subscribedSubdomain} successful`
            );
            await next();
        } catch (err) {
            logger.error(
                `[ON_DELETE_TENANT]: Unsubscription of tenant [${req.data.subscribedSubdomain}] has failed: ${err.message}`
            );
            const e = new Error('InternalServerError');
            e.statusCode = 500;
            req.reject(e);
        }
    });

    /**
     *  event handler for returning application dependencies, is done before an onboarding request
     *
     * @param  {} 'dependencies'
     * @param  {} async(
     */
    service.on('dependencies', async () => {
        const deps = [];

        dependencies.forEach((d) => {
            const credentials =
                xsenv.filterServices({ name: d }).length > 0
                    ? xsenv.serviceCredentials({ name: d })
                    : null;
            const xsappname =
                credentials?.xsappname || credentials?.uaa?.xsappname;
            if (xsappname) {
                deps.push({
                    xsappname,
                });
            }
        });

        logger.info(
            `[ON_GET_DEPENDENCIES]: Dependent applications/services: `,
            JSON.stringify(deps)
        );

        return deps;
    });
};
