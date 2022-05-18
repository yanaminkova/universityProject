namespace sap.odm.utilities.sales;

using {sap.odm.common.codeList} from '../../common';

/**
 * Specifies the type of a Budget Billing.
 */

@odm.doc.SAPDelivered : true
@odm.doc.extensible   : true
 
entity CustomerOrderItemUtilitiesBudgetBillingTypeCodes : codeList {
    /**
     * Specifies the type of a Budget Billing.
     */
    key code : String(4);
}

/**
 * Specifies the type of a Budget Billing.
 */
type CustomerOrderItemUtilitiesBudgetBillingTypeCode : Association to one CustomerOrderItemUtilitiesBudgetBillingTypeCodes;