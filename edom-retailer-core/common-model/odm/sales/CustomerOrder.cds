namespace sap.odm.sales;

using {
  sap.odm.common.cuid,
  sap.odm.common.CurrencyCode,
  sap.odm.common.LanguageCode,
  sap.odm.common.UnitOfMeasureCode,
  sap.odm.common.address.ScriptedPersonAddress,
} from '../common';

using {
  sap.odm.businesspartner.BusinessPartner,
} from '@sap/odm/dist/businesspartner/BusinessPartner';
// EXCLUDED Dependency to Plant
// using {
//   sap.odm.orgunit.Plant,
// } from '../orgunit';
using {
  sap.odm.sales.CustomerOrderItemSalesAspect,
  sap.odm.sales.CustomerOrderItemTypeCode,
  sap.odm.sales.CustomerOrderReasonCode,
  sap.odm.sales.CustomerOrderSalesAspect,
  sap.odm.sales.CustomerOrderTypeCode,
  sap.odm.sales.SalesCancellationReasonCode,
  sap.odm.sales.SalesCancellationStatusCode,
  sap.odm.sales.SalesPartnerRoleCode,
  sap.odm.sales.SalesProcessingStatusCode,
  sap.odm.sales.SalesTextTypeCode,
  sap.odm.sales.pricing.ConditionTypeCode,
  sap.odm.sales.service.CustomerOrderItemServiceAspect,
  sap.odm.sales.service.CustomerOrderServiceAspect,
} from '.';
using {
  sap.odm.sales.SalesBusinessArea,
  sap.odm.sales.SalesDocument,
  sap.odm.sales.SalesDocumentItem,
  sap.odm.sales.SalesDocumentPartnerName
} from './common';
using {
  sap.odm.sales.Amount,
  sap.odm.sales.Quantity,
  sap.odm.sales.SalesDocumentAddress
} from './types';

/**
 * An agreement between a vendor and a customer concerning the
 * sale and delivery of goods and services, as well as any
 * services that are associated with these processes, on a
 * specific date, for a specific quantity, and for a specific
 * price.
 */
@odm.doc.alternateTerms : ['Order']
@ODM.root               : true
@EDoM.v1
entity CustomerOrder : SalesDocument, SalesBusinessArea {
  /**
   * Type of the customer order.
   */
  type                     :      CustomerOrderTypeCode;
  /**
   * Indicates the reason for creating the customer order.
   */
  orderReason              :      CustomerOrderReasonCode;
  /**
   * Date the customer order becomes effective for sales
   * management purposes.
   */
  orderDate                :      Date;
  /**
   * Date the fulfillment is requested by the customer.
   */
  requestedFulfillmentDate :      DateTime;
  /**
   * ID used by the customer to uniquely identify a purchasing
   * document (e.g. an inquiry or a purchase order).
   */
  customerReferenceId      :      String(40);
  /**
   * Customer order items.
   */
  items                    :      Composition of many CustomerOrderItem;
  /**
   * Partners related to this order.
   */
  partners                 :      Composition of many CustomerOrderPartner;
  /**
   * Date when specific pricing conditions and exchange rates
   * apply to an order.
   */
  pricingDate              :      DateTime;
  /**
   * Net value of the customer order item in document currency.
   */
  netAmount                :      Amount;
  /**
   * Indicates whether external pricing was used.
   */
  isExternallyPriced       :      Boolean;
  /**
   * Price components of the customer order (on header level).
   */
  priceComponents          :      Composition of many CustomerOrderPriceComponent;
  /**
   * Payment references of the customer order.
   */
  paymentReferences        : many CustomerOrderPaymentReference;
  /**
   * Rejection status of the entire customer order.
   */
  cancellationStatus       :      SalesCancellationStatusCode;
  /**
   * Additional notes to the customer order.
   */
  notes                    :      Composition of many CustomerOrderNote;
  /**
   * Sales order attributes.
   */
  salesAspect              :      Composition of one CustomerOrderSalesAspect;
  /**
   * Service order attributes.
   */
  serviceAspect            :      Composition of one CustomerOrderServiceAspect;
}

/**
 * Item in a customer order.
 */
@EDoM.v1
aspect CustomerOrderItem : SalesDocumentItem {
  /**
   * ID of an item in a customer order.
   */
  key id              : CustomerOrderItemId;
  /**
   * ID of the higher-level item to which an item belongs in a
   * hierarchy.
   */
  parentItemId        : CustomerOrderItemId;
  /**
   * Optional alternative ID.
   */
  alternativeId       : String(40);
  /**
   * Identifier for the characteristics of an item; the item type
   * distinguishes between different item types such as free of
   * charge or text items [=documents] and determines how the
   * system processes the item.
   */
  type                : CustomerOrderItemTypeCode;
  /**
   * ID used by the customer to uniquely identify an item in a
   * purchasing document.
   */
  customerReferenceId : String(40);
  /**
   * Configuration ID.
   */
  configurationId     : String(40);
  /**
   * Partners related to an item in a customer order.
   */
  partners            : Composition of many CustomerOrderPartner;
  /**
   * Net value of an item in a customer order in document
   * currency.
   */
  netAmount           : Amount;
  /**
   * Price components of the order (on item level).
   */
  priceComponents     : Composition of many CustomerOrderPriceComponent;
  /**
   * Processing status of an item.
   */
  processingStatus    : SalesProcessingStatusCode;
  /**
   * Reason for canceling an item.
   */
  cancellationReason  : SalesCancellationReasonCode;
  /**
   * Additional notes to an item.
   */
  notes               : Composition of many CustomerOrderNote;
  /**
   * Sales order item attributes.
   */
  salesAspect         : Composition of one CustomerOrderItemSalesAspect;
  /**
   * Service order item attributes.
   */
  serviceAspect       : Composition of one CustomerOrderItemServiceAspect;
}

/**
 * ID of an item in a customer order.
 */
type CustomerOrderItemId : String(6);

/**
 * Customer order item reference.
 */
type CustomerOrderItemRef : {
  /**
   * Customer order header reference.
   */
  header : Association to one CustomerOrder;
  /**
   * ID of an item in a customer order.
   */
  itemId : CustomerOrderItemId;
}

/**
 * Customer order payment reference.
 */
type CustomerOrderPaymentReference {
  /**
   * Digital payment token.
   */
  token : String(40);
}

/**
 * Partner involved in the Customer Order.
 */
@EDoM.v1
 // QUESTION Paul: if this reflect S4 are integrating between SD and Contract Account.
aspect CustomerOrderPartner {
  /**
   * ID of the partner in context of the customer order.
   */
  key id   : String(40);
  /**
   * Role of the partner in the related customer order.
   * Role can be something like: Ship To, Sold To, but also Contact.
   * If the role is Contact we speak of a second order Customer Order Partner. In that case the Customer Partner must be related to a first order customer partner.
   * If the role is Ship To, Bill To, etc. we speak of a first order Customer Order Partner.
   */
  role : SalesPartnerRoleCode;
  /**
   * Is the customer order partner the main partner for this role.
   */
  main : Boolean;
  /**
   * Reference to a first order partner if this partner is a second order partner. Related To is optional, and the same second order partner can be the contact for multiple first order partner, therefore composition of many is used.
   */
  relatedTo : many CustomerOrderPartnerInternalRef;
  /**
   * The personal data, to be filled if the partner is a person.
   */
  personAddressDetails: ScriptedPersonAddress;
  /**
   * Address of the partner in the customer order.
   */
  address  : SalesDocumentAddress;
  /**
   * The business partner of the customer order partner, if the partner is indeed a business partner.
   */
  businessPartner : Association to one BusinessPartner;
  /**
   * Plant partner: if the partner is a plant.
   */
  // MODIFIED from managed association to unmanaged foreign key
  plantPartner : UUID; // Association to one Plant;
}

/**
 * A second order customer order partner (especially with the role Contact) refers to a first order customer order partner over this internal reference aspect.
 */
type CustomerOrderPartnerInternalRef {
  /**
   * The id of the first level Customer Order Partner id.
   */
  partnerId : String(40);
}

/**
 * Price component of a customer order, such as, raw material,
 * labor, overhead, and storage.
 */
aspect CustomerOrderPriceComponent : cuid {
  /**
   * Condition type applied to the price component.
   */
  conditionType   : ConditionTypeCode;
  /**
   * Value of the price component.
   */
  value           : Decimal(22, 6);
  /**
   * Currency of the price component value.
   */
  currency        : CurrencyCode;
  /**
   * Quantity for which the price component value is defined.
   */
  perQuantity     : Quantity;
  /**
   * Unit of measure for which the quantity of the price component is defined.
   */
  perQuantityUnit : UnitOfMeasureCode;
  /**
   * Minor level number.
   */
  minorLevel      : Integer;
  /**
   * Major level number.
   */
  majorLevel      : Integer;
  /**
   * Indicates whether the price component was manually
   * overwritten.
   */
  isManual        : Boolean;
  /**
   * Indicates whether the price component is inactive.
   */
  isInactive      : Boolean;
  /**
   * Indicates whether the price component is relevant for
   * printing.
   */
  isPrintRelevant : Boolean;
}

/**
 * Customer order note.
 */
aspect CustomerOrderNote : cuid {
  /**
   * Text type of the customer order note.
   */
  textType : SalesTextTypeCode;
  /**
   * Text of the customer order note.
   */
  text     : String(5000);
  /**
   * Language of the customer order note.
   */
  language : LanguageCode;
}
