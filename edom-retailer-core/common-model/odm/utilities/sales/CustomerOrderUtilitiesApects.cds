namespace sap.odm.utilities.sales;

using {
    sap.odm.common.cuid,
    sap.odm.common.codeList,
    sap.odm.common.UnitOfMeasureCode,
} from '../../common';

using {sap.odm.businesspartner.BusinessPartner} from '@sap/odm/dist/businesspartner/BusinessPartner';
using {sap.odm.finance.payment.PaymentCardTypeCode} from '../../finance';

using {
    sap.odm.sales.CustomerOrder,
    sap.odm.sales.CustomerOrderItem,
    sap.odm.sales.CustomerOrderPartner,
    sap.odm.sales.CustomerOrderPaymentReference,
    sap.odm.sales.SalesBusinessArea

} from '../../sales/CustomerOrder';

using {sap.odm.sales.SalesProcessingStatusCodes} from '../../sales/SalesProcessingStatusCodes';
using {sap.odm.utilities.sales.CustomerOrderItemUtilitiesSubsequentDocumentCode} from './CustomerOrderItemUtilitiesSubsequentDocumentCodes';
using {sap.odm.utilities.sales.CustomerOrderItemUtilitiesDeviceTypeCode} from './CustomerOrderItemUtilitiesDeviceTypeCodes';
using {sap.odm.utilities.sales.CustomerOrderItemUtilitiesBudgetBillingTypeCode} from './CustomerOrderItemUtilitiesBudgetBillingTypeCodes';

/* --------------------------------------------------------------- */
/* Entities                                                        */
/* --------------------------------------------------------------- */


/* --------------------------------------------------------------- */
/* Extensions                                                      */
/* --------------------------------------------------------------- */
/**
 * Specifies the extension of Customer Order Item
 */
extend CustomerOrderItem with {
    /**
     * Subscription customer order attributes.
     */
    subscriptionAspect : Composition of one CustomerOrderItemUtilitiesSubscriptionAspect;
    /**
     * Utilities customer order attributes.
     */
    utilitiesAspect    : Composition of one CustomerOrderItemUtilitiesAspect;
}

/**
 * Specifies the extension of Customer Order Partner
 */
extend CustomerOrderPartner with {
    /**
     * ID of contract account.
     */
    contractAccountId : String(40);
    /**
     * ID of business partner.
     */
    businessPartnerId : String(10);
}

/**
 * Specifies the extension of Customer Order Payment Reference
 */
extend CustomerOrderPaymentReference with CustomerOrderUtilitiesPaymentReferenceAspect;

/**
 * Specifies the extension of Sales Processing Status
 */
extend SalesProcessingStatusCodes with {
    /**
     * Default value for the status
     */
    isDefault : Boolean default false;
};


/* --------------------------------------------------------------- */
/* Aspects                                                         */
/* --------------------------------------------------------------- */
/**
 * Aspect to extend Customer Order Payment Reference
 */
aspect CustomerOrderUtilitiesPaymentReferenceAspect {
    /**
     * Indicate a credit card type e.g. Visa, Mastercard to
     * process/create a Payment method. TO-DO: This field needs to
     * be re-evaluated for upcoming releases.
     */
    utilitiesCardType : PaymentCardTypeCode;
}

/**
 * Aspect to extend Customer Order Item Utilities
 */
aspect CustomerOrderItemUtilitiesAspect : SalesBusinessArea {
    /**
     * Former service provider.
     */
    formerServiceProvider : String(40);
    /**
     * Reference object attributes.
     */
    referenceObject       : Composition of one CustomerOrderItemUtilitiesReferenceObjectAspect;
    /**
     * Subsequent Document attributes.
     */
    subsequentDocument    : Composition of one CustomerOrderItemUtilitiesSubsequentDocumentAspect;
    /*
     * The unique identifier of the point of delivery.
     */
    podId                 : String(33);
    /*
     * Location identifier of the supply address.
     */
    supplyAddress         : Association to BusinessPartner.addressData;
    /*
     * Code of the grid.
     */
    gridPricing           : String(33);
    /*
     * Type of the device, for example, discrete or smart meter.
     */
    deviceTypePricing     : CustomerOrderItemUtilitiesDeviceTypeCode;
    /*
     * Country-/region-specific code. For example, urban district code in Germany, INSEE/SIRT in France, jurisdiction code in the US, and so on.
     */
    geographicalCode      : String(15);
    /*
     * Type of the utilities budget billing plan.
     */
    budgetBillingType     : CustomerOrderItemUtilitiesBudgetBillingTypeCode;
    /*
     * Reference billing date.
     */
    referenceBillDate     : Date;
}

/**
 * Aspect to extend Customer Order Item Utilities Reference
 * Object
 */
aspect CustomerOrderItemUtilitiesReferenceObjectAspect {
    /**
     * Referenced equipment in a utilities order. #768: Added
     * length for String type
     */
    key meter    : String(40);
    /**
     * An installation address on the item level for Commodity
     * item. #799: Installation is identified by the address &
     * serial number #768: Added length for String type
     */
    installation : String(40);
}

/**
 * Aspect to extend Customer Order Item Utilities Subscription
 */
aspect CustomerOrderItemUtilitiesSubscriptionAspect {
    /**
     * Contract Term attributes.
     */
    contractTerm          : SubscriptionContractTerm;
    /**
     * Subscription Reference attributes.
     */
    subscriptionReference : SubscriptionReference;
    /**
     * Timestamp of validity.
     */
    validFrom             : Date;
    /**
     * Timestamp of validity.
     */
    validTo               : Date;   
}

/**
 * Aspect to extend Customer Order Item Subsequent Document
 * attributes
 */
aspect CustomerOrderItemUtilitiesSubsequentDocumentAspect : cuid {

    /**
     * Human-readable identifier of the data controller.
     */
    displayId : String(40);
    /**
     * Type of the customer order item utilities subsequent
     * document.
     */
    type      : CustomerOrderItemUtilitiesSubsequentDocumentCode
}

/* --------------------------------------------------------------- */
/* Types                                                           */
/* --------------------------------------------------------------- */
/**
 * Specifies the type of a contract terms of customer order
 * itme utilities subscription
 */
type SubscriptionContractTerm {
    /**
     * Period of subscription.
     */
    period      : Integer;
    /**
     * Periodicity of subscription.
     */
    periodicity : String(20);
    /**
     * Unit of subscription period.
     */
    periodUnit  : UnitOfMeasureCode;
}

/**
 * Specifies the type of a subscription reference of customer
 * order item utilities subsequet document.
 */
type SubscriptionReference {
    /**
     * ID of an item in a customer order.
     */
    itemId   : String(40);
    /**
     * ID of a subscription reference object.
     */
    objectId : String(40);
}

/**
 * Specifies the type of a customer order item utilities
 * subsequet document.
 */
view CustomerOrderItemWithSubscriptionReference as
    select from CustomerOrder {
        id,
        items.id                                    as itemID,
        items.processingStatus                      as itemProcessingStatus,
        items.utilitiesAspect.subsequentDocument.id as subscriptionReferenceObjectId
    };
