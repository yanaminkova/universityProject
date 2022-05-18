/**
 * if needed to execute the full process - please
 * 'npm run openapi',
 * then 'npm run edmx',
 * then 'npm run openAPIContentReorder'
 * and finally 'npm run openAPItranslate'
 */
const OpenAPIFile = require('./openAPIFile.class');
const EdmxAPIFile = require('./edmxAPIFile.class');

const customProperties = {
    'x-sap-shortText': '{i18n>shortTextCustomerOrder}',
    'x-sap-api-type': 'ODATAV4',
    servers: [
        {
            url: 'https://sandbox.api.sap.com:443/sapcloudforutilities/api/v1',
            description: 'Sandbox URL',
        },
        {
            url: 'https://{subaccount}.cfapps.{region}.hana.ondemand.com/api/v1',
            description: 'Customer Order API endpoint',
            variables: {
                subaccount: {
                    default: 'c4u-foundation-retailer-service',
                },
                region: {
                    default: 'eu10',
                },
            },
        },
    ],
    security: [
        {
            OAuth2: [],
        },
    ],
};

const customComponents = {
    securitySchemes: {
        OAuth2: {
            type: 'oauth2',
            flows: {
                clientCredentials: {
                    tokenUrl:
                        'https://{subaccount}.authentication.{region}.hana.ondemand.com/oauth/token',
                    scopes: {},
                },
            },
        },
    },
};

const apiEdomRetailer = new OpenAPIFile(
    `${__dirname}/../../docs/content/openapi/API_EDOM_RETAILER.openapi3.json`,
    customProperties,
    customComponents
);

const configurationService = new OpenAPIFile(
    `${__dirname}/../../docs/content/openapi/ConfigurationService.openapi3.json`
);

// because all paths must go under the 'Customizing and Configuration' tag
configurationService.file.tags.forEach((tag) => {
    // eslint-disable-next-line no-param-reassign
    tag.name += 'Codes';
});

Object.keys(configurationService.file.paths).forEach((path) => {
    const methods = Object.keys(configurationService.file.paths[path]);
    methods.forEach((method) => {
        if (configurationService.file.paths[path][method].tags) {
            configurationService.file.paths[path][method].tags.forEach(
                (tag, index) => {
                    // eslint-disable-next-line
                    if (!path.endsWith('/$batch')) {
                        configurationService.file.paths[path][method].tags[
                            index
                        ] = `${tag}Codes`;
                    }
                }
            );
        }
    });
});
// end

// because all paths must have /config preffix
Object.keys(configurationService.file.paths).forEach((path) => {
    const newPath = `/config${path}`;
    configurationService.file.paths[newPath] =
        configurationService.file.paths[path];
    delete configurationService.file.paths[path];
});

configurationService.cleanUnneededPaths();
configurationService.fixObjectObjectPaths();

const dppService = new OpenAPIFile(
    `${__dirname}/../../docs/content/openapi/DataRetentionManagerService.openapi3.json`
);

// because all paths must go under the 'Customizing and Configuration' tag
dppService.file.tags.forEach((tag) => {
    // eslint-disable-next-line no-param-reassign
    tag.name += 'Codes';
});

Object.keys(dppService.file.paths).forEach((path) => {
    const methods = Object.keys(dppService.file.paths[path]);
    methods.forEach((method) => {
        if (dppService.file.paths[path][method].tags) {
            dppService.file.paths[path][method].tags.forEach((tag, index) => {
                if (!path.endsWith('/$batch')) {
                    // eslint-disable-next-line
                    dppService.file.paths[path][method].tags[
                        index
                    ] = `${tag}Codes`;
                }
            });
        }
    });
});
// end

// because all paths must have /dpp/drm preffix
Object.keys(dppService.file.paths).forEach((path) => {
    const newPath = `/dpp/drm${path}`;
    dppService.file.paths[newPath] = dppService.file.paths[path];
    delete dppService.file.paths[path];
});

dppService.cleanUnneededPaths();
dppService.fixObjectObjectPaths();

/**
 * order of the operation is mostly strict and cannot be changed
 * see the description for each step in the class
 */
apiEdomRetailer.mergeWith(configurationService);
apiEdomRetailer.mergeWith(dppService);
apiEdomRetailer.cleanUnneededPaths();
apiEdomRetailer.fixObjectObjectPaths();
apiEdomRetailer.prepareInitialProperties();
apiEdomRetailer.createGroupsByTags();
apiEdomRetailer.createKeyHashMap();
apiEdomRetailer.cleanUnneededTags();
apiEdomRetailer.calculateSortationCriteria();
apiEdomRetailer.sortGroups();
apiEdomRetailer.extractGroups();
apiEdomRetailer.sortTags();
apiEdomRetailer.renameAllTags();

const newFPath = `${__dirname}/../../docs/api/openapi/CustomerOrderServiceAPI.json`;
apiEdomRetailer.saveFile(newFPath);

const fAPIEdomRetailerPathEdmx = `${__dirname}/../../docs/content/edmx/API_EDOM_RETAILER.xml`;
const xmlAPIEdomRetailerEdmx = new EdmxAPIFile(fAPIEdomRetailerPathEdmx);

const fConfigurationPathEdmx = `${__dirname}/../../docs/content/edmx/ConfigurationService.xml`;
const xmlConfigurationEdmx = new EdmxAPIFile(fConfigurationPathEdmx);

const fDppEdmx = `${__dirname}/../../docs/content/edmx/DataRetentionManagerService.xml`;
const xmlDppEdmx = new EdmxAPIFile(fDppEdmx);

xmlAPIEdomRetailerEdmx.mergeWith(xmlConfigurationEdmx);
xmlAPIEdomRetailerEdmx.mergeWith(xmlDppEdmx);

const fNewPathEdmx = `${__dirname}/../../docs/api/edmx/CustomerOrderServiceAPI.edmx`;
xmlAPIEdomRetailerEdmx.saveFile(fNewPathEdmx);
