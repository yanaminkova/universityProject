// @Todo: Namespace change
namespace sap.c4u.foundation.retailer.mdiclient;
using {
  sap.odm.common.managed
  } from '../../../common-model/odm/common';

/**
 * Aspect to capture BookKeeping information of each BP Instance
 */
entity MDIErrorTable: managed {
  /**
   * Instance unique identifier 
   */
  id: UUID;
  /**
   * Human-readable identifier
   */
  displayId: String(40);
  /**
  * Capture error message, if any, throughout the lifecycle of the instance
  */
  errorMessage: String(200);
  /**
   * Delta token received from MDI
   */
  deltaToken: String(5000);

}

