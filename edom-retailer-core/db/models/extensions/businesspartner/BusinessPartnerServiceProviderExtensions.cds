namespace sap.odm.utilities.businesspartner;

using {
    sap.odm.common.cuid,
    sap.odm.common.Validity
} from '../../../../common-model/odm/common';

using {
  sap.odm.businesspartner.BusinessPartner
} from '@sap/odm/dist/businesspartner/BusinessPartner';

using {
  sap.c4u.foundation.retailer.serviceprovider.MarketFunctionCode,
} from '../../configuration/serviceprovider';

extend BusinessPartner with {
  /**
   * Service provider related information of the business partner.
   */
  serviceProviderInformation: Composition of many ServiceProviderMarketFunction;
}

/**
 * The validity of the service provider's market function.
 */
aspect ServiceProviderMarketFunction: cuid, Validity {
  /**
   * The unique code for the service provider market function.
   */
  marketFunction              : MarketFunctionCode;
  /**
   * A string code that represents the market function code number.
   */
  marketFunctionCodeNumber1                  : String(50);
  /**
   * A string code that represents the market function number source.
   */
  marketFunctionSource1                      : String(10);
  /**
   * A string code that represents the market function code number.
   */
  marketFunctionCodeNumber2                  : String(50);
  /**
   * A string code that represents the market function number source.
   */
  marketFunctionSource2                      : String(10);
}