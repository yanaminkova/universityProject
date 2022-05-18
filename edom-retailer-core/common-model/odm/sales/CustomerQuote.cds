namespace sap.odm.sales;

using {
  sap.odm.common.cuid,
  sap.odm.common.LanguageCode,
  sap.odm.common.communication.EmailAddress,
} from '../common';
// EXCLUDED Dependency to Product
// using {sap.odm.product.Product} from '../product';
using {
  sap.odm.sales.CustomerQuoteTypeCode,
  sap.odm.sales.SalesCancellationReasonCode,
  sap.odm.sales.SalesPartnerRoleCode,
  sap.odm.sales.SalesTextTypeCode,
  sap.odm.sales.pricing.PricingProcedureCode,
} from '.';
using {
  sap.odm.sales.SalesAreaInDocument,
  sap.odm.sales.SalesDocument,
  sap.odm.sales.SalesDocumentItem
} from './common';
using {
  sap.odm.sales.Amount,
  // EXCLUDED Dependency to BusinessPartner
  // sap.odm.sales.Customer,
  sap.odm.sales.Quantity,
  sap.odm.sales.SalesDocumentAddress
} from './types';

/**
 * Legally-binding offer for the delivery of goods or services,
 * valid for a specific period of time, and according to fixed
 * terms. The customer quote contains conditions leading to the
 * customer order.
 */
@odm.doc.alternateTerms : [
'Quote',
'Quotation',
'Sales quote'
]
@ODM.root               : true
entity CustomerQuote : SalesDocument, SalesAreaInDocument {
  /**
   * Specifies the type of a customer quote.
   */
  type                     : CustomerQuoteTypeCode;
  /**
   * Date the fulfillment is requested by the customer.
   */
  requestedFulfillmentDate : DateTime;
  /**
   * ID used by the customer to uniquely identify a quote.
   */
  customerReferenceId      : String(40);
  /**
   * Items in a customer quote.
   */
  items                    : Composition of many CustomerQuoteItem;
  /**
   * Partners related to the customer quote.
   */
  partners                 : Composition of many CustomerQuotePartner;
  /**
   * Specifies the reason for canceling a customer quote, for
   * example, if the price given in a quote is too high.
   */
  cancellationReason       : SalesCancellationReasonCode;
  /**
   * Comments added to a customer quote.
   */
  comments                 : Composition of many CustomerQuoteComment;
  /**
   * Date the customer quote becomes effective.
   */
  effectiveDate            : DateTime;
  /**
   * Date the customer quote expires.
   */
  expirationDate           : DateTime;
  /**
   * Total amount of the customer quote.
   */
  totalAmount              : Amount;
  /**
   * Total discount of the customer quote.
   */
  totalDiscount            : Amount;
  /**
   * Header discount of the customer quote.
   */
  headerDiscount           : Amount;
  /**
   * Pricing procedure of the customer quote.
   */
  pricingProcedure         : PricingProcedureCode;
  /**
   * Promotions summary of the customer quote.
   */
  promotionsSummary        : String(5000);
}

/**
 * Item in a customer quote.
 */
aspect CustomerQuoteItem : SalesDocumentItem {
  /**
   * Number of the item in a customer quote.
   */
  key id          : String(6);
  /**
   * Configuration ID of the item in a customer quote.
   */
  configurationId : String(40);
  /**
   * Comments providing additional information for a customer
   * quote item.
   */
  comments        : Composition of many CustomerQuoteComment;
}

/**
 * Partner related to the customer quote.
 */
aspect CustomerQuotePartner {
  /**
   * ID of the customer quote partner.
   */
  key id   : String(40);
  /**
   * Role of the partner in the customer quote.
   */
  key role : SalesPartnerRoleCode;
  /**
   * Name of the customer quote partner.
   */
  name     : String(256);
  /**
   * Address of the partner in the customer quote.
   */
  address  : SalesDocumentAddress;
  /**
   * Reference to the partner in the customer quote.
   */
  // MODIFIED from managed association to unmanaged foreign key
  partner  : UUID; // Association to one Customer;
}

/**
 * Comment added to the customer quote.
 */
aspect CustomerQuoteComment : cuid {
  /**
   * Author of the customer quote comment.
   */
  author   : CommentAuthor;
  /**
   * Specifies the type of a customer quote comment.
   */
  type     : SalesTextTypeCode;
  /**
   * Text of the customer quote comment.
   */
  text     : String(5000);
  /**
   * Language of the customer quote comment.
   */
  language : LanguageCode;
}

/**
 * Author of the customer quote comment.
 */
type CommentAuthor : {
  /**
   * Name of the comment author.
   */
  name         : String(256);
  /**
   * Email address of the comment author.
   */
  emailAddress : EmailAddress;
  /**
   * Company of the comment author.
   */
  company      : String(256);
}
