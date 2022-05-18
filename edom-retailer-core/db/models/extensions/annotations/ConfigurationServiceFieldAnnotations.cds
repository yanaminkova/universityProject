using {sap.c4u.foundation.retailer.configuration as configuration} from '../../configuration/index';

annotate ConfigurationService with @Core.Description: '{i18n>descriptionConfigurationService}';
annotate ConfigurationService with @Core.LongDescription: '{i18n>longDescriptionConfigurationService}';

annotate configuration.CustomerOrderUtilitiesStatusMapping with {  
    @description: '{i18n>descriptionCustomerOrderUtilitiesStatusMappingSourceSystem}'
    sourceSystem;

    @description: '{i18n>descriptionCustomerOrderUtilitiesStatusMappingSourceSystemStatus}'
    sourceSystemStatus;

    @description: '{i18n>descriptionCustomerOrderUtilitiesStatusMappingProcessingStatus}'
    processingStatus;

    @description: '{i18n>descriptionCustomerOrderUtilitiesStatusMappingType}'
    type;
}

annotate configuration.CustomerOrderUtilitiesStatusSourceSystems with {
    @description: '{i18n>descriptionCustomerOrderUtilitiesStatusSourceSystemsSourceSystemId}'
    sourceSystemId;

    @description: '{i18n>descriptionCustomerOrderUtilitiesStatusSourceSystemsDestination}'
    destination;

    @description: '{i18n>descriptionCustomerOrderUtilitiesStatusSourceSystemsPath}'
    path;

    @description: '{i18n>descriptionCustomerOrderUtilitiesStatusSourceSystemsStatusPath}'
    statusPath;
}

annotate configuration.CustomerOrderUtilitiesStatusMappingTypeCodes with {
    @description: '{i18n>descriptionCustomerOrderUtilitiesStatusMappingTypeCodesCode}'
    code;

    @description: '{i18n>descriptionCustomerOrderUtilitiesStatusMappingTypeCodesName}'
    name;

    @description: '{i18n>descriptionCustomerOrderUtilitiesStatusMappingTypeCodesDescr}'
    descr;
}

annotate SalesProcessingStatusCodes with {
    @description: '{i18n>descriptionSalesProcessingStatusCodesCode}'
    code;
}
