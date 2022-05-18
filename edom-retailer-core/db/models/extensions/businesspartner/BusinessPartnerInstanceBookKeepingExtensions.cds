namespace sap.odm.utilities.businesspartner;

using {
  sap.odm.businesspartner.BusinessPartner
} from '@sap/odm/dist/businesspartner/BusinessPartner';

using {
    sap.c4u.foundation.retailer.mdiclient.InstanceBookKeeping
} from '../../mdiclient';

extend BusinessPartner with {
  /**
   * Book keeping information for MDI Client.
   */
  mdiBookKeeping: Composition of one InstanceBookKeeping;
}