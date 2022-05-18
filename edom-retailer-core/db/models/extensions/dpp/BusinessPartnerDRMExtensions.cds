namespace sap.odm.businesspartner;

using {
  sap.odm.businesspartner.AddressData,
  sap.odm.businesspartner.AddressDataUsage,
  sap.odm.businesspartner.BankAccount,
  sap.odm.businesspartner.BusinessPartner,
  sap.odm.businesspartner.BusinessPartnerRole,
  sap.odm.businesspartner.Email,
  sap.odm.businesspartner.Fax,
  sap.odm.businesspartner.Identification,
  sap.odm.businesspartner.Industry,
  sap.odm.businesspartner.OrganizationAddress,
  sap.odm.businesspartner.OrganizationDetails,
  sap.odm.businesspartner.OrganizationName,
  sap.odm.businesspartner.PersonAddress,
  sap.odm.businesspartner.PersonDetails, 
  sap.odm.businesspartner.PersonName,
  sap.odm.businesspartner.Phone,
  sap.odm.businesspartner.ScriptedOrganizationAddress,
  sap.odm.businesspartner.ScriptedOrganizationName,
  sap.odm.businesspartner.ScriptedPersonAddress,
  sap.odm.businesspartner.ScriptedPersonName,
  sap.odm.businesspartner.TaxNumber,
  sap.odm.businesspartner.Website,
  sap.odm.sales.CustomerInformation,
  sap.odm.sales.s4.CustomerSalesArrangement,
  sap.odm.sales.s4.CustomerSalesArrangementFunction,
  sap.odm.sales.CustomerTaxClassificationCode,
  sap.odm.sales.CustomerTaxClassification,
  sap.odm.utilities.businesspartner.ServiceProviderMarketFunction
} from '@sap/odm/dist/businesspartner/BusinessPartner';

using { sap.beta.c4u.foundation.retailer.dpp } from '..';

/* --------------------------------------------------------------- */
/* Extensions                                                      */
/* --------------------------------------------------------------- */

extend BusinessPartner with dpp.DataRetentionManagerAspectWithoutIsBlocked;
extend AddressData with dpp.DataRetentionManagerAspectOnlyIsBlocked;
extend AddressDataUsage with dpp.DataRetentionManagerAspect;
extend BankAccount with dpp.DataRetentionManagerAspect;
extend BusinessPartnerRole with dpp.DataRetentionManagerAspect;
extend Email with dpp.DataRetentionManagerAspect;
extend Fax with dpp.DataRetentionManagerAspect;
extend Identification with dpp.DataRetentionManagerAspect;
extend Industry with dpp.DataRetentionManagerAspect;
extend OrganizationAddress with dpp.DataRetentionManagerAspect;
extend OrganizationDetails with dpp.DataRetentionManagerAspect;
extend OrganizationName with dpp.DataRetentionManagerAspect;
extend PersonDetails with dpp.DataRetentionManagerAspect; 
extend Phone with dpp.DataRetentionManagerAspect;
extend ScriptedOrganizationAddress with dpp.DataRetentionManagerAspect;
extend ScriptedOrganizationName with dpp.DataRetentionManagerAspect;
extend TaxNumber with dpp.DataRetentionManagerAspect;
extend Website with dpp.DataRetentionManagerAspect;
extend CustomerInformation with dpp.DataRetentionManagerAspect;
extend CustomerSalesArrangement with dpp.DataRetentionManagerAspect;
extend CustomerSalesArrangementFunction with dpp.DataRetentionManagerAspect;
extend CustomerTaxClassification with dpp.DataRetentionManagerAspect;
extend ServiceProviderMarketFunction with dpp.DataRetentionManagerAspect;
extend PersonName with dpp.DataRetentionManagerAspect;
extend PersonAddress with dpp.DataRetentionManagerAspect;