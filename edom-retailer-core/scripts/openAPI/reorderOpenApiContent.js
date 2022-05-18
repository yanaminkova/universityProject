const OpenAPIFile = require('./openAPIFile.class');

const apiEdomReiailer = new OpenAPIFile(
    `${__dirname}/../../docs/content/API_EDOM_RETAILER.openapi3.json`
);

const configurationService = new OpenAPIFile(
    `${__dirname}/../../docs/content/ConfigurationService.openapi3.json`
);

apiEdomReiailer.mergeWith(configurationService);
apiEdomReiailer.prepareInitialProperties();
apiEdomReiailer.createGroupsByTags();
apiEdomReiailer.createKeyHashMap();
apiEdomReiailer.calculateUsedInByTags();
apiEdomReiailer.calculateDepth();
apiEdomReiailer.sortGroups();
apiEdomReiailer.extractGroups();
apiEdomReiailer.saveFile();
