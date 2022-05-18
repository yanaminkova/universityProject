namespace sap.odm.sales.orgunit;

using {
  sap.odm.common.cuid,
  sap.odm.common.address.ScriptedOrganizationAddressType,
} from '../../common';
// EXCLUDED Dependency to DPP
// using {sap.odm.dpp.DataController, } from '../../dpp';
using {
  sap.odm.sales.orgunit.SalesArea2SalesOffice,
  sap.odm.sales.orgunit.SalesGroup,
} from './.';

/**
 * A sales office is an organizational unit in a geographical
 * area of a sales organization. A sales office establishes
 * contact between the company and the regional market.
 */
@odm.doc.alternateTerms : ['Verkaufsbüro']
@odm.doc.relatedGDT     : 'SlsOffice'
@ODM.root               : true
@EDoM.v1
entity SalesOffice : cuid {
  /**
   * Human-readable identifier of the sales office.
   */
  displayId      : String(4);
  /**
   * Name of the sales office.
   */
  name           : localized String(20);
  /**
   * Data controller for the sales office.
   */
  // MODIFIED from managed association to unmanaged foreign key
  dataController : UUID; // Association to one DataController;
  /**
   * Postal address of the sales office.
   */
  address        : ScriptedOrganizationAddressType;
  //TODO: update address type depending on the outcome of "localized vs scripted" discussion
  /**
   * Sales areas assigned to the sales office. This is a n:m
   * relationship.
   */
  salesAreas     : Association to many SalesArea2SalesOffice
                     on salesAreas.salesOffice = $self;
  /**
   * Sales groups assigned to the sales office.
   */
  salesGroups    : Association to many SalesGroup
                     on salesGroups.salesOffice = $self;
}
