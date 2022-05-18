/* eslint-disable no-underscore-dangle */
const path = require('path');
const log = require('cf-nodejs-logging-support');
const cds = require('@sap/cds');
const helmet = require('helmet');
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const express = require('express');
const { JWTStrategy } = require('@sap/xssec');
const config = require('./lib/config');
const SoapServiceInitializer = require('./utils/SoapServiceInitializer');
const BillableItemsConfService = require('./api/billableItems/BillableItemsConfService');

const { unfold_csn: cdsLocalized } = cds.compile._localized;
const { Logger, cfLoggerSinkFunction } = require('./utils/logger');
const { sanitizerHandler } = require('./lib/xssSanitizer');
const { getXSUAAService } = require('./lib/helper');
const { createSecurityLog } = require('./dpp/AuditLogService');
const MonitoringService = require('./monitoring/MonitoringService');

const billableItemsConfSoapPath = '/billableItems/confirm';

// the same logic of storing prepared loggers implemented in CAP
const preparedLoggersHashMap = {};
cds.log.Logger = (module, level, prefix) => {
    if (!preparedLoggersHashMap[module]) {
        const logger = new Logger(module, prefix, level);
        preparedLoggersHashMap[module] = logger;
    }

    return preparedLoggersHashMap[module];
};

// Middleware
cds.on('bootstrap', async (app) => {
    const HANA_ON_DEMAND = '*.hana.ondemand.com';
    const TEST_SUITE_QUNIT = 'testsuite.qunit.js';

    // cf-nodejs-logging-support
    app.use(log.logNetwork);
    log.setLoggingLevel('debug');
    log.setSinkFunction(cfLoggerSinkFunction);
    log.info('CF logging bound to application');

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

    app.get('/monitoring/health', async (_req, res) => {
        res.status(200).send(await MonitoringService.getHealth());
    });

    const xsuaaService = getXSUAAService(xsenv, log);
    /* istanbul ignore if */
    if (xsuaaService) {
        passport.use(new JWTStrategy(xsuaaService.xsuaa));
        app.use(passport.initialize());
        app.use(
            passport.authenticate('JWT', {
                failWithError: true,
            })
        );
    }

    // quote from documentation: https://helmetjs.github.io/ -> helmet.xssFilter()
    // helmet.xssFilter disables browsers' buggy cross-site scripting filter by setting the X-XSS-Protection header to 0.
    // not used here by requirement https://zenhub.mo.sap.corp/app/workspaces/c4u-cn-edom-retailer-5f185289d149430efda211f6/issues/c4u/c4u-cn-edom-retailer/641
    app.use(async (err, req, res, next) => {
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Cache-Control', 'no-store, no-cache');
        if (req.tokenInfo && err.status === 401) {
            await createSecurityLog({
                action: `${req.method} ${req.originalUrl}`,
                errorCode: 401,
                msg: config.ERROR_UNAUTHORIZED,
            });
        }
        next();
    });
});

cds.on('serving', sanitizerHandler);
cds.on('connect', sanitizerHandler);

/* eslint-disable-next-line consistent-return */
function cors(req, res, next) {
    const { origin } = req.headers;
    /* istanbul ignore if */
    if (origin) {
        res.set('access-control-allow-origin', origin);
    }
    /* istanbul ignore if */
    if (origin && req.method === 'OPTIONS') {
        return res
            .set(
                'access-control-allow-methods',
                'GET,HEAD,PUT,PATCH,POST,DELETE'
            )
            .end();
    }
    next();
}

function correlate(req, res, next) {
    const correlationId = 'x-correlation-id';
    // derive correlation id from req
    const id =
        req.headers[correlationId] ||
        req.headers['x-correlationid'] ||
        req.headers['x-request-id'] ||
        req.headers['x-vcap-request-id'] ||
        cds.utils.uuid();
    // new intermediate cds.context, if necessary
    /* istanbul ignore if */
    if (!cds.context) {
        cds.context = { id };
    }
    // guarantee x-correlation-id going forward and set on res
    req.headers[correlationId] = id;
    res.set(correlationId, id);
    // guaranteed access to cds.context._.req -> REVISIT
    /* istanbul ignore if */
    if (!cds.context._) {
        cds.context._ = {};
    }
    /* istanbul ignore if */
    if (!cds.context._.req) {
        cds.context._.req = req;
    }
    next();
}

// register graphql router on served event
function serveGraphql(app) {
    cds.on('served', (services) => {
        /* eslint-disable-next-line */
        const GraphQLAdapter = require('@sap/cds/libx/gql/GraphQLAdapter');
        app.use(new GraphQLAdapter(services, { graphiql: true }));
        cds.log()(
            "serving GraphQL endpoint for all services { at: '/graphql' }"
        );
    });
}
class CoreServer {
    /*
     * PUBLIC METHODS
     */

    // -------------------------------------------------------------------------
    // Default handlers, which can be overidden by options passed to the server
    //
    static get defaults() {
        return {
            cors,
            correlate,

            get static() {
                return cds.env.folders.app;
            }, // > defaults to ./app

            // default generic index.html page
            get index() {
                const index = require('@sap/cds/app/index');
                return (_, res) => res.send(index.html);
            },

            // default favicon
            get favicon() {
                const favicon = require.resolve('@sap/cds/app/favicon.ico');
                return express.static(favicon, { maxAge: '14d' });
            },

            // default request logger
            get logger() {
                const LOG = cds.log();
                const DEBUG = cds.debug('server');
                /* istanbul ignore next */
                return (req, _, next) => {
                    /* eslint-disable-next-line no-unused-expressions */
                    LOG && LOG(req.method, decodeURI(req.url));
                    /* istanbul ignore if */
                    if (/\$batch/.test(req.url)) {
                        req.on('dispatch', (dispatchedReq) => {
                            /* eslint-disable-next-line no-unused-expressions */
                            LOG &&
                                LOG(
                                    '>',
                                    dispatchedReq.event,
                                    decodeURI(dispatchedReq._path),
                                    dispatchedReq._query || ''
                                );
                            if (DEBUG && dispatchedReq.query) {
                                DEBUG(dispatchedReq.query);
                            }
                        });
                    }
                    next();
                };
            },

            // feature toggler
            get toggler() {
                return require('@sap/cds/libx/_runtime/common/toggles/alpha')(
                    cds
                );
            },
        };
    }

    // Helpers to delegate to imported UIs

    static appServe(endpoint) {
        /* istanbul ignore next */
        return {
            from: (pkg, folder) => {
                const staticFolder = !folder
                    ? pkg
                    : path.resolve(
                          require.resolve(`${pkg}/package.json`),
                          `../${folder}`
                      );
                this.use(endpoint, express.static(staticFolder));
                /* istanbul ignore if */
                if (!endpoint.endsWith('/webapp')) {
                    (this._app_links || (this._app_links = [])).push(endpoint);
                }
            },
        };
    }

    static initSoapServices(app) {
        // initialize soap BI conf service
        const billableItemsConfServiceInstance =
            BillableItemsConfService.getInstance();
        const billableItemsConfServiceInitializer = new SoapServiceInitializer(
            billableItemsConfSoapPath,
            path.join(__dirname, './api/lib/BitsCreateConfirmation.wsdl'),
            billableItemsConfServiceInstance,
            `[BillableItemsCreateConfirmService]`
        );

        const xsuaaService = getXSUAAService(xsenv, log);
        /* istanbul ignore if */
        if (xsuaaService) {
            /* istanbul ignore next */
            billableItemsConfServiceInitializer.initService(app);
        }
    }

    /**
     * Standard express.js bootstrapping, constructing an express `application`
     * and launching a corresponding http server using `app.listen()`.
     * Project-specific `./server.js` can overload this and react to these
     * events:
     *
     * - cds.on('bootstrap',(app)) - emitted before any middleware is added
     * - cds.on('loaded',(model)) - emitted when a model was loaded
     * - cds.on('connect',(srv)) - emitted when a service was connected
     * - cds.on('serving',(srv)) - emitted when a service was served
     * - cds.on('listening',({server,url})) - emitted when the server is listening
     *
     * @param {object} options - canonicalized options from `cds serve` cli
     * @param {boolean} options.in_memory - true if we need to bootstrap an in-memory database
     * @param {string} options.service - name of service to be served; default: 'all'
     * @param {string} options.from - filenames of models to load; default: '*'
     * @param {express.Application} options.app - filenames of models to load; default: '*'
     * @param {express.Handler} options.index - custom handler for /
     * @param {express.Handler} options.favicon - custom handler for /favicon.ico
     * @param {express.Handler} options.logger - custom request logger middleware
     * @returns Promise resolving to a Node.js http server as returned by express' `app.listen()`.
     */
    static async init(
        options,
        o = { ...options, __proto__: CoreServer.defaults }
    ) {
        cds.app = o.app || express();
        const { app } = cds;
        app.serve = CoreServer.appServe;
        cds.emit('bootstrap', app);

        // mount static resources and logger middleware
        await CoreServer._mountResources(o, app);

        /* istanbul ignore if */
        if (cds.requires.extensibility) {
            /* eslint-disable-next-line */
            await require('@sap/cds/libx/_runtime/fiori/uiflex')();
        }

        // load specified models or all in project
        const csn = await cds.load(o.from || '*', o).then(cds.minify);
        /* eslint-disable-next-line no-param-reassign */
        o.from = cdsLocalized(cds.linked(cds.compile.for.odata(csn)));
        cds.model = o.from;

        // connect to essential framework services if required
        const init = o.in_memory && ((db) => cds.deploy(csn).to(db, o));
        /* istanbul ignore if */
        if (cds.requires.db) {
            cds.db = await cds.connect.to('db').then(init);
        }
        /* istanbul ignore if */
        if (cds.requires.messaging) {
            await cds.connect.to('messaging');
        }
        /* istanbul ignore if */
        if (cds.requires.multitenancy) {
            await cds.mtx.in(app).then(async () => {
                const provisioning = await cds.connect.to(
                    'ProvisioningService'
                );
                provisioning.impl(require('./provisioning'));
            });
        }

        // serve graphql
        if (cds.env.features.graphql) {
            serveGraphql(app);
        }

        // serve all services declared in models
        await CoreServer._serve(app);
        cds.emit('served', cds.services);

        // start http server
        const port = o.port !== undefined ? o.port : process.env.PORT || 4004;

        return app.listen(port, () => {
            CoreServer.initSoapServices(app);
        });
    }

    /*
     * PRIVATE METHODS
     */

    static async _mountResources(o, app) {
        const production = process.env.NODE_ENV === 'production';

        /* istanbul ignore if */
        if (o.cors) {
            /* eslint-disable-next-line no-unused-expressions */
            !production && app.use(o.cors);
        }
        /* istanbul ignore if */
        if (o.static) {
            app.use(express.static(o.static));
        }
        /* istanbul ignore if */
        if (o.favicon) {
            app.use('/favicon.ico', o.favicon);
        }
        /* istanbul ignore if */
        if (!production && o.index) {
            app.get('/', o.index);
        }
        /* istanbul ignore if */
        if (o.correlate) {
            app.use(o.correlate);
        }
        /* istanbul ignore if */
        if (o.logger) {
            app.use(o.logger);
        }
        /* istanbul ignore if */
        if (o.toggler) {
            app.use(o.toggler);
        }
    }

    static async _serve(app) {
        // api/v1/dpp
        await cds.serve('PersonalDataManagerService').in(app);
        await cds.serve('BusinessPartnerPDMService').in(app);
        const drm = await cds.serve('DataRetentionManagerService').in(app);
        drm.registerLegalGround(
            'CustomerOrder',
            require('./dpp/legalGrounds/CustomerOrderLegalGround')
        );
        drm.registerDataSubject(
            'BusinessPartner',
            require('./dpp/dataSubjects/BusinessPartnerDataSubject')
        );
        await cds.serve('LegalEntitiesService').in(app);

        // api/v1/config
        await cds.serve('ConfigurationService').in(app);

        // api/v1
        await cds.serve('API_EDOM_RETAILER').in(app);

        // api/internal/distribution
        await cds.serve('DistributionService').in(app);

        // /api/distribution/v1/config
        await cds.serve('DistributionConfigurationService').in(app);

        // /api/businessPartner/v1/config
        await cds.serve('BusinessPartnerConfigService').in(app);

        // /api/businessPartner/v1
        await cds.serve('BusinessPartnerService').in(app);

        // /api/beta/bpinternal
        await cds.serve('BusinessPartnerServiceInternal').in(app);

        // /api/serviceProvider/v1/config
        await cds.serve('ServiceProviderConfigService').in(app);

        // /api/config/v1
        await cds.serve('CommonConfigurationService').in(app);

        // api/billingAccount/v1/pdm
        await cds.serve('BillingAccountPDMService').in(app);

        // api/billingAccount/v1/config
        await cds.serve('BillingAccountConfigService').in(app);

        // api/billingAccount/v1
        await cds.serve('BillingAccountService').in(app);

        // api/internal/billingAccount/v1
        await cds.serve('BillingAccountServiceInternal').in(app);

        // api/internal/technicalmasterdata
        await cds.serve('TechnicalMasterDataService').in(app);
        // api/v1/billableItems
        await cds.serve('BillableItemsService').in(app);

        /* istanbul ignore if */
        if (cds.env.features.beta) {
            await Promise.all(
                cds.model.services
                    .filter((s) => s['@version'] === 'beta')
                    .map((s) => cds.serve(s.name).in(app))
            );
        }

        /* istanbul ignore if */
        if (cds.env.features.alpha) {
            await Promise.all(
                cds.model.services
                    .filter((s) => s['@version'] === 'alpha')
                    .map((s) => cds.serve(s.name).in(app))
            );
        }
        // /api/jobscheduler/v1
        await cds.serve('JobSchedulerService').in(app);
        // /api/mdiClient/v1
        await cds.serve('MDIClientService').in(app);

        await cds.serve('sepaMandateConfigServiceBeta').in(app);
        await cds.serve('sepaMandateServiceBeta').in(app);
        // api/beta/SalesCompound/v1/SalesCompound
        await cds.serve('CompoundServiceBeta').in(app);
    }
}

module.exports = CoreServer.init;
