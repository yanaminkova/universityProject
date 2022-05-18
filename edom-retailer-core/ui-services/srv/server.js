const cds = require('@sap/cds');
const helmet = require('helmet');

// Middleware
cds.on('bootstrap', async (app) => {
    const HANA_ON_DEMAND = '*.hana.ondemand.com';
    const TEST_SUITE_QUNIT = 'testsuite.qunit.js';
    // helmet
    const production = process.env.NODE_ENV === 'production';
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'", TEST_SUITE_QUNIT, HANA_ON_DEMAND],
                styleSrc: [
                    "'self'",
                    TEST_SUITE_QUNIT,
                    HANA_ON_DEMAND,
                    production ? '' : "'unsafe-inline'",
                ],
                scriptSrc: [
                    "'self'", // "Refers to the origin from which the protected document is being served, including the same URL scheme and port number."
                    TEST_SUITE_QUNIT,
                    HANA_ON_DEMAND,
                    production ? '' : "'unsafe-inline'", // "Allows the use of inline resources, such as inline <script> elements, javascript:
                    // URLs, inline event handlers, and inline <style> elements."
                    production ? '' : "'unsafe-eval'", // Allows the use of eval() and similar methods for creating code from strings.
                    // Needed for the Fiori sandbox.
                ],
                imgSrc: ["'self'", 'data:', HANA_ON_DEMAND],
            },
        })
    );
    app.use(helmet.dnsPrefetchControl());
    app.use(helmet.expectCt());
    app.use(helmet.frameguard());
    app.use(helmet.hidePoweredBy());
    app.use(helmet.hsts());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.permittedCrossDomainPolicies());
    app.use(helmet.referrerPolicy());

    // quote from documentation: https://helmetjs.github.io/ -> helmet.xssFilter()
    // helmet.xssFilter disables browsers' buggy cross-site scripting filter by setting the X-XSS-Protection header to 0.
    // not used here by requirement https://zenhub.mo.sap.corp/app/workspaces/c4u-cn-edom-retailer-5f185289d149430efda211f6/issues/c4u/c4u-cn-edom-retailer/641
    app.use((_, res, next) => {
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Cache-Control', 'no-store, no-cache');
        next();
    });
});

module.exports = cds.server;
