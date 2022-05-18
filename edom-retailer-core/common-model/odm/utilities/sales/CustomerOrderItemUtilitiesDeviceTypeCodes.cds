namespace sap.odm.utilities.sales;

using {sap.odm.common.codeList} from '../../common';

/**
 * Specifies the type of a Pricing (for meter and metering cost).
 */

@odm.doc.SAPDelivered : true
@odm.doc.extensible   : true
entity CustomerOrderItemUtilitiesDeviceTypeCodes : codeList {
        /**
         * Specifies the type of a Pricing (for meter and metering cost).
         */
    key code : String(4);
}

/**
 * Specifies the type of a Pricing (for meter and metering cost).
 */
type CustomerOrderItemUtilitiesDeviceTypeCode : Association to one CustomerOrderItemUtilitiesDeviceTypeCodes;