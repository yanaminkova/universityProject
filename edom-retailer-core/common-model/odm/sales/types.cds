namespace sap.odm.sales;

using {
  sap.odm.common.communication.EmailAddress,
  sap.odm.common.address.PostalAddress,
  sap.odm.common.communication.PhoneNumber
} from '../common';

/**
 * Amount.
 */
type Amount : Decimal(22, 6);
/**
 * Quantity.
 */
type Quantity : Decimal(22, 6);
/**
 * Price values.
 */
type PriceValue : Decimal(22, 6);

/**
 * Local address in a sales document.
 */
type SalesDocumentAddress : PostalAddress {
  /**
   * Phone number in the address.
   */
  phoneNumber  : PhoneNumber;
  /**
   * Fax number in the address.
   */
  faxNumber    : PhoneNumber;
  /**
   * Email address in the address.
   */
  emailAddress : EmailAddress;
}
