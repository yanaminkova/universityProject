namespace sap.c4u.edom.retailer.services;

/*
 * v1 APIs
 */

// api/v1/dpp
using from './dpp/PersonalDataManagerService';
using from './dpp/DataRetentionManagerService';
using from './dpp/BusinessPartnerPDMService';
using from './dpp/LegalEntitiesService';
using from './lib/annotations/DataRetentionManagerServiceAnnotations';
// api/v1/config
using from './api/ConfigurationService';
using from './lib/annotations/ConfigurationServiceAnnotations';
// api/v1
using from './api/API_EDOM_RETAILER';
using from './lib/annotations/API_EDOM_RETAILERAnnotations';
//distribution
using from './api/distribution/distribution-service';
//distributionConfiguration
using from './api/distribution/distributionConfigurationService';
//BillableItemsService
using from './api/billableItems/BillableItemsService';
// // BP APIs
// using from './external/API_BP_KEY_MAPPING';

/*
 * Alpha/Beta APIs
 */
using from './api/CommonConfigurationService';
// Service APIs
using from './api/serviceprovider/ServiceProviderConfigService';
using from './api/businesspartner/BusinessPartnerConfigService';
using from './api/businesspartner/BusinessPartnerService';
using from './api/businesspartner/BusinessPartnerServiceInternal';
using from './jobscheduler/JobSchedulerService';
using from './mdiclient/MDIClient';
using from './beta/businesspartner/BusinessPartnerConfigServiceBeta';
using from './beta/businesspartner/BusinessPartnerServiceBeta';
using from './beta/mdiclient/MDIClientBeta';
using from './api/billingaccount/BillingAccountConfigService';
using from './api/billingaccount/BillingAccountService';
using from './api/billingaccount/BillingAccountServiceInternal';
using from './dpp/BillingAccountPDMService';
using from './beta/sepamandate/SEPAMandateConfigServiceBeta';
using from './beta/sepamandate/SEPAMandateServiceBeta';
using from './beta/compound/CompoundServiceBeta';
// External
using from './alpha/external/ExternalLinksService';
// BillableItemsService
using from './api/technicalmasterdata/TechnicalMasterDataService';
/*
 * Non-served UI APIs (used to deploy to tenants)
 */
using from '../ui-services/srv/api/customerOrder/CustomerOrderUIService';