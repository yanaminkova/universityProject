/*
 * @Definition: DMA-aligned CDS-based model of master data addresses (person address, organization address, workplace address)
 * ------------------------------------------------------------------
 *
 * @Owning Area: S4 MDM
 * @Alignment: SAP S/4HANA, SAP SuccessFactors, SAP MDG, SAP DMA
 * @External standard: The domain language is (mostly) consistent with ISO 19160-4:2017
 *
*/
namespace sap.odm.common.address;

using {sap.odm.common.ScriptedObject} from './..';

using {
  sap.odm.common.address.PersonAddressType,
  sap.odm.common.address.OrganizationAddressType,
} from '@sap/odm/dist/common/address/AddressTypes';

using {sap.odm.common.address.ScriptedOrganizationAddress} from '@sap/odm/dist/common/address/AddressAspects';

/**
 * Scripted address of organization. A scripted representation
 * after a subset of ISO 15924 (e.g. for Japan: kana, kanji,
 * latin). Text fields of PostalAddress and
 * OrganizationAddressDetails should be encoded using the
 * selected unicode script.
 */
type ScriptedOrganizationAddressType : ScriptedOrganizationAddress {}

/**
 * Scripted address of a person. A scripted representation
 * after a subset of ISO 15924 (e.g. for Japan: kana, kanji,
 * latin). Text fields of PostalAddress and
 * PersonAddressDetails should be encoded using the selected
 * unicode script.
 */
type ScriptedPersonAddress : ScriptedObject, PersonAddressType {}
