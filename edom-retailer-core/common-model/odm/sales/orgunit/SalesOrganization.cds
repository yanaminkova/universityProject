namespace sap.odm.sales.orgunit;

using {
  sap.odm.common.CurrencyCode,
  sap.odm.common.cuid,
  sap.odm.common.address.ScriptedOrganizationAddressType,
} from '../../common';
using {sap.odm.orgunit.CompanyCode} from '../../orgunit';
using {sap.odm.sales.orgunit.Plant2DistributionChain} from './.';



/**
 * A sales organization is responsible for the sale and
 * distribution of goods and services in one particular
 * country.
 */
@odm.doc.alternateTerms : ['Verkaufsorganisation']
@ODM.root               : true
entity SalesOrganization : cuid {
  /**
   * Human-readable identifier of the sales organization.
   */
  displayId            : String(4);
  /**
   * Name of the sales organization.
   */
  name                 : localized String(20);
  /**
   * Company code of the sales organization.
   */
  companyCode          : Association to one CompanyCode;
  /**
   * Statistics currency used in the sales organization.
   */
  currency             : CurrencyCode;
  /**
   * This sales organization is responsible for sales for these
   * plants.
   */
  responsibleForPlants : Association to many Plant2DistributionChain
                           on responsibleForPlants.salesOrganization = $self;
//TODO: Business Partner, Supplier and Customer havent been merged yet, so the association to Customer needs to be added
}
