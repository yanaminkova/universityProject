using {sap.odm.dpp.DataController} from '@sap/odm/dist/dpp/DataController';

annotate DataRetentionManagerService with @Core.Description: '{i18n>descriptionDataRetentionManagerService}';
annotate DataRetentionManagerService with @Core.LongDescription: '{i18n>longDescriptionDataRetentionManagerService}';

annotate DataController with {
    @description: '{i18n>descriptionDataControllerId}'
    id;

    @description: '{i18n>descriptionDataControllerName}'
    name;

    @description: '{i18n>descriptionDataControllerDisplayId}'
    displayId;
}

