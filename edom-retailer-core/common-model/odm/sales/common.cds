namespace sap.odm.sales;

using {
  sap.odm.common.cuid,
  sap.odm.common.CurrencyCode,
  sap.odm.common.IncotermsClassificationCode,
  sap.odm.common.UnitOfMeasureCode,
} from '../common';
using {sap.odm.product.Product} from '@sap/odm/dist/product/Product';
using {
  sap.odm.sales.SalesProcessingStatusCode,
  sap.odm.sales.orgunit.DistributionChannelCode,
  sap.odm.sales.orgunit.DivisionCode,
  sap.odm.sales.orgunit.SalesGroup,
  sap.odm.sales.orgunit.SalesOffice,
  sap.odm.sales.orgunit.SalesOrganization,
} from '.';
using {sap.odm.sales.Quantity} from './types';

// This aspects groups together sales organization, distribution channel and division. This is not the same as `sap.odm.orgstructure.SalesArea` as it does not have its own identity.
@EDoM.v1
aspect SalesAreaInDocument {
  /**
   * An organizational unit responsible for the sale of certain
   * products or services.
   */
  salesOrganization   : Association to one SalesOrganization;
  /**
   * A channel through which products or services reach
   * customers.
   */
  distributionChannel : DistributionChannelCode;
  /**
   * A way of grouping materials, products, or services.
   */
  division            : DivisionCode;
}

@EDoM.v1
aspect SalesBusinessArea : SalesAreaInDocument {
  /**
   * An organizational unit in a geographical area of a sales
   * organization. A sales office establishes contact between the
   * company and the regional market.
   */
  salesOffice : Association to one SalesOffice;
  /**
   * An organizational unit that performs and is responsible for
   * sales transactions.
   */
  salesGroup  : Association to one SalesGroup;
}

aspect SalesDocument : cuid {
  /**
   * Number of the sales document.
   */
  displayId        : String(40);
  /**
   * Short description of the sales document.
   */
  text             : String(40);
  /**
   * Currency that applies to the sales document.
   */
  currency         : CurrencyCode;
  /**
   * Specifies the processing status of the sales document.
   */
  processingStatus : SalesProcessingStatusCode;
}

aspect SalesDocumentItem {
  /**
   * Short description of the sales document item.
   */
  text         : String(40);
  /**
   * Product of the item.
   */
  product      : Association to one Product;
  /**
   * Quantity of the item product.
   */
  quantity     : Quantity;
  /**
   * Unit of measure of the item quantity.
   */
  quantityUnit : UnitOfMeasureCode;
}

aspect SalesDocumentPartnerName {
  /**
   * Name 1 of a sales document partner.
   */
  name1 : String(40);
  /**
   * Name 2 of a sales document partner.
   */
  name2 : String(40);
  /**
   * Name 3 of a sales document partner.
   */
  name3 : String(40);
  /**
   * Name 4 of a sales document partner.
   */
  name4 : String(40);
}
