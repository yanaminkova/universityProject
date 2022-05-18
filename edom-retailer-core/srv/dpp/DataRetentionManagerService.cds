using {LegalEntitiesResidenceRules,
       RuleCondition,
       DataSubjectRole,
       StartTime,
       LegalGround, 
       LegalEntity,
       RetentionRule, 
       DataSubjects,
       DataSubjectsEndofResidenceRespose,
       DataSubjectEndofBusinessResponse,
       DataSubjectLastRetentionStartDatesResponse,
       DataSubjectInformationReponse } from './DataRetentionManagerTypes';

using {sap.odm.dpp as dpp} from '@sap/odm/dist/dpp/DataController';

service DataRetentionManagerService  @(requires: 'authenticated-user', path: '/api/v1/dpp/drm', protocol: 'rest') {
  
    /**
    * Returns Data Subject which have Expired its Residence
    * Indicates the endpoint for getting all the data subjects which have reached end of purpose
    * @namespace sap.c4u.edom.retailer.dpp
    * @param {string} dataSubjectRole - Data Subject Role.
    * @param {string} legalGround - LegalGround Name.
    * @param {string} startTime - Start Time Type.
    * @param {Array} legalEntitiesResidenceRules - Legal Entities Residence Rules.
    * @returns {Array} - Data Subject which have Expired its Residence
    */
    @(restrict: [{to: 'DataRetentionManagerUser'}],
        Core : {
            Description : 'Returns data subjects which have expired their residence.', 
            LongDescription : 'Indicates the endpoint for returning all the data subjects which have reached their end of purpose.'
        }
    )
    action dataSubjectsEndofResidence(dataSubjectRole: DataSubjectRole, legalGround: LegalGround, startTime: StartTime, legalEntitiesResidenceRules: many LegalEntitiesResidenceRules) returns DataSubjectsEndofResidenceRespose;

    /**
    * Data Subject’s Residence Expired Confirmation
    * Indicates the endpoint for validating whether input data subjects have reached end of purpose or not.
    * If application group contains more than one legal ground with its residence end points, then application needs to define this end point 
    * to verify whether data subjects return by a legal grounds is also expired from other legal grounds perspective or not. If only legal ground exist then this end point is ignored.
    * @namespace sap.c4u.edom.retailer.dpp
    * @param {string} dataSubjectRole - Data Subject Role.
    * @param {string} legalGround - LegalGround Name.
    * @param {string} startTime - Start Time Type.
    * @param {Array} legalEntitiesResidenceRules - Optional parameter, provisioning the data protection officer to define legal entities rules at a granular level.
    * @returns {Array} - Data Subject which have Expired its Residence
    */
    @(restrict: [{to: 'DataRetentionManagerUser'}], 
        Core : {
            Description : 'Confirms the expiration of the data subject’s residence.', 
            LongDescription : 'Indicates the endpoint for validating whether input data subjects have reached their end of purpose or not. If application group contains more than one legal ground with its residence endpoints, then application needs to define this endpoint to verify whether data subjects return by a legal grounds is also expired from other legal grounds perspective or not. If only legal ground exist then this endpoint is ignored.'
        }
    )
    action dataSubjectsEndofResidenceConfirmation(dataSubjectRole: DataSubjectRole, legalGround: LegalGround, startTime: StartTime, legalEntitiesResidenceRules: many LegalEntitiesResidenceRules, dataSubjects: many DataSubjects) returns many DataSubjects;

    /**
    * Data Subject End of Business has Reached. 
    * Indicates the endpoint for checking whether a data subject has reached the end of business
    * @namespace sap.c4u.edom.retailer.dpp
    * @param {string} dataSubjectRole - Data Subject Role.
    * @param {string} dataSubjectID - Data Subject ID.
    * @param {string} legalGround - LegalGround Name.
    * @returns {Object} - checks whether Data subject expired (returns true/false) and the reason if not expired.
    */
    @(restrict: [{to: 'DataRetentionManagerUser'}], 
        Core : {
            Description : 'Data Subject has reached end of business.', 
            LongDescription : 'Indicates the endpoint for checking whether a data subject has reached the end of business.'
        }
    )
    action dataSubjectEndofBusiness(dataSubjectRole: DataSubjectRole, dataSubjectID: String, legalGround: LegalGround) returns DataSubjectEndofBusinessResponse;

    /**
    * Legal Entities 
    * Indicates the endpoint for getting Legal Entities from the system
    * @param {string} legalGround - LegalGround Name.
    * @param {string} dataSubjectRole - Data Subject Role.
    * @param {string} dataSubjectID - Data Subject ID.
    * @returns {Array} - List of Legal Entities
    */
    @(restrict: [{ to: 'DataRetentionManagerUser' }, { to: 'DataPrivacyIntegrationUser' }],
        Core : {
            Description : 'Returns legal entities.', 
            LongDescription : 'Indicates the endpoint for returning legal entities from the system.'
        }
    )
    action dataSubjectLegalEntities(legalGround : LegalGround, dataSubjectRole: DataSubjectRole, dataSubjectID: String) returns many LegalEntity;

    /**
    * Data Subject Legal Ground Retention Start Date
    * Indicates the endpoint for getting the latest EOB date or dates for a data subject based on the data protection officer, 
    * selected reference start time, and retention rule condition, if one exists.
    * @namespace sap.c4u.edom.retailer.dpp
    * @param {string} legalGround - LegalGround Name.
    * @param {string} dataSubjectRole - Data Subject Role.
    * @param {string} dataSubjectID - Data Subject ID.
    * @param {string} legalEntity - Legal Entity Name.
    * @param {string} startTime - Start Time Type.
    * @param {Array} rulesConditionSet - Optional parameter, provisioning the data protection officer to define legal ground rules at a granular level.
    * @returns {Array} - latest retention start (reference) date or dates
    */
    @(restrict: [{ to: 'DataRetentionManagerUser' }],
        Core : {
            Description : 'Returns the legal ground retention start date of a data subject.', 
            LongDescription : 'Indicates the endpoint for returning the latest EOB date or dates for a data subject based on the data protection officer, selected reference start time, and retention rule condition, if one exists.'
        }
    )
    action dataSubjectLastRetentionStartDates(legalGround: LegalGround, dataSubjectRole: DataSubjectRole, dataSubjectID: String, legalEntity: String, startTime: StartTime, rulesConditionSet: many RuleCondition) returns many DataSubjectLastRetentionStartDatesResponse;

    /**
    * Data Subject Information
    * Indicates the endpoint for getting infromation of a data subject.
    * @namespace sap.c4u.edom.retailer.dpp
    * @param {string} applicationGroupName - Application Group Name.
    * @param {string} dataSubjectRole - Data Subject Role.
    * @param {string} dataSubjectID - Data Subject ID.
    */
    @(restrict: [{ to: 'DataRetentionManagerUser' }],
        Core : {
            Description : 'Returns data subject information.', 
            LongDescription : 'Indicates the endpoint for returning information of a data subject.'
        }
    )
    action dataSubjectInformation(applicationGroupName: String, dataSubjectRole: DataSubjectRole, dataSubjectIds: many String) returns many DataSubjectInformationReponse;
    /**
    * Data Subject Legal Ground Deletion
    * Indicates the endpoint for blocking a data subject legal ground instances once data subject itself can be blocked in the system.
    * @namespace sap.c4u.edom.retailer.dpp
    * @param {string} legalGround - LegalGround Name.
    * @param {string} dataSubjectRole - Data Subject Role.
    * @param {string} dataSubjectID - Data Subject ID.
    * @param {string} legalEntity - Legal Entity Name.
    * @param {string} startTime - Start Time Type.
    * @param {string} maxDeletionDate - Date when retention period of data subject expires.
    * @param {Array}  retentionRules - Optional parameter, provisioning the data protection officer to define retention rules at a granular level.
    */
    @(restrict: [{ to: 'DataRetentionManagerUser' }, { to: 'DataPrivacyIntegrationUser' }],
        Core : {
            Description : 'Data subject legal ground deletion.', 
            LongDescription : 'Indicates the endpoint for blocking a data subject legal ground instances once the data subject itself can be blocked in the system.'
        }
    )
    action dataSubjectLegalGroundDeletion(legalGround: LegalGround, dataSubjectRole: DataSubjectRole, dataSubjectID: String, startTime: StartTime, maxDeletionDate: String, retentionRules: many RetentionRule);

    /**
    * Data Subject Legal Ground Destroying
    * Indicates the endpoint for deletion a data subject legal ground instances once data subject itself can be deleted from the system.
    * @namespace sap.c4u.edom.retailer.dpp
    * @param {string} legalGround - LegalGround Name.
    * @param {string} dataSubjectRole - Data Subject Role.
    */
    @(restrict: [{ to: 'DataRetentionManagerUser' }, { to: 'DataPrivacyIntegrationUser' }],
        Core : {
            Description : 'Data subject legal ground destroying.', 
            LongDescription : 'Indicates the endpoint for deleting a data subject legal ground instance once data subject itself can be deleted from the system.'
        }
    )
    action dataSubjectsLegalGroundDestroying(legalGround: LegalGround, dataSubjectRole: DataSubjectRole);

    /**
    * Data Subject Deletion
    * Indicates the endpoint that needs to be called to trigger the blocking of a data subject instances when it is no longer needed in the system.
    * @namespace sap.c4u.edom.retailer.dpp
    * @param {string} applicationGroupName- Application Group Name.
    * @param {string} dataSubjectRole - Data Subject Role.
    * @param {string} dataSubjectID - Data Subject ID.
    */
    @(restrict: [{ to: 'DataRetentionManagerUser' }, { to: 'DataPrivacyIntegrationUser' }],
        Core : {
            Description : 'Data subject deletion.', 
            LongDescription : 'Indicates the endpoint that needs to be called to trigger the blocking of a data subject instances when it is no longer needed in the system.'
        }
    )
    action dataSubjectDeletion(applicationGroupName: String, dataSubjectRole: DataSubjectRole, dataSubjectID: String, maxDeletionDate: String);

    /**
    * Data Subject Destroying
    * Indicates the endpoint for deletion a data subject instances once data subject itself can be deleted from the system.
    * @namespace sap.c4u.edom.retailer.dpp
    * @param {string} applicationGroupName- Application Group Name.
    * @param {string} dataSubjectRole - Data Subject Role.
    */
    @(restrict: [{ to: 'DataRetentionManagerUser' }, { to: 'DataPrivacyIntegrationUser' }],
        Core : {
            Description : 'Data subject destroying.', 
            LongDescription : 'Indicates the endpoint for deleting a data subject instance once data subject itself can be deleted from the system.'
        }
    )
    action dataSubjectsDestroying(applicationGroupName: String, dataSubjectRole: DataSubjectRole);

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity DataController as projection on dpp.DataController {
        key id,
        name,
        displayId
    };
}
