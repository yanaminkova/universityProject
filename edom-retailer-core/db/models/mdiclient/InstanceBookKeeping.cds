// @Todo: Namespace change
namespace sap.c4u.foundation.retailer.mdiclient;

using { sap.odm.businesspartner.BusinessPartner } from '@sap/odm/dist/businesspartner/BusinessPartner';

/**
 * Aspect to capture BookKeeping information of each BP Instance
 */
aspect InstanceBookKeeping {
  /**
   * Version Id coming back from the MDI
   */
  versionId: UUID;
  /**
   * ChangeToken used when sending the payload to the MDI
   */
  changeToken: UUID;
  /**
   * Capture status of the BP through the complete cycle
   */
  status: InstanceBookKeepingStatus;
  /**
   * Capture error message, if any, throughout the lifecycle of the BP
   */
  errorMessage: String(200);
  /**
   * Stores status of BP confirmation to be used for holding any meanwhile update query
   */
  pending: Boolean;
  /**
   * Stores if displayId of BP has been stored or not
   */
  displayIdStatus: String(10) default 'notset';
  /**
   * Capture image of Business Partner keys from MDI
   */
  keys: String
}

/**
 * Indicates the status of InstanceBookKeeping
 */
type InstanceBookKeepingStatus: String(16) enum {
  sent = 'sent';
  failed = 'failed';
  alert = 'alert';
  confirmed = 'confirmed';
};
