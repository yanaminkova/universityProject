using {
    sap.odm.utilities.billingaccount as ba
    } from '../../db/models/odm/billingaccount';

using API_BUSINESS_PARTNER as bp from '../external/API_BUSINESS_PARTNER';

/*
 * Expose entities and attributes that have been defined as IsPotentiallyPersonal. Entity naming must match naming of BillingAccountServices
 */

service BillingAccountPDMService @(path:'/api/billingAccount/v1/pdm', requires:'authenticated-user'){
    @PersonalData.EntitySemantics: 'DataSubject'
    @(restrict: [{ grant: ['READ'], to: 'PersonalDataManagerUser' }])
    @readonly entity BusinessPartner as select from ba.BillingAccount {
         @PersonalData.FieldSemantics:'DataSubjectID'
         @Common.Label: '{i18n>labelBusinessPartnerId}'
         key partner.businessPartner.id
        };
    
     @Common.Label: '{i18n>labelBillingAccount}'
     @(restrict: [{ grant: ['READ'], to: 'PersonalDataManagerUser' }])
     @readonly entity BillingAccount as select from ba.BillingAccount {
        key id,
        displayId,
        @PersonalData.FieldSemantics:'DataSubjectID'
        @Common.Label: '{i18n>labelBusinessPartnerId}'
        partner.businessPartner.id as businessPartner_id,
        @Common.Label: '{i18n>labelCountry}'
        partner.taxControl.supplyingCountry.name as supplyingCountry_name,
        @Common.Label: '{i18n>labelBillingAccountName}'
        partner.accountManagementData.name as accountManagementData_name,
        @Common.Label: '{i18n>labelAlternativePayer}'
        partner.paymentControl.incomingPayment.alternativePayer.id as alternativePayer_id,
        @Common.Label: '{i18n>labelAlternativePayee}'
        partner.paymentControl.outgoingPayment.alternativePayee.id as alternativePayee_id,
        @Common.Label: '{i18n>labelMandateId}'
        partner.paymentControl.incomingPayment.mandateId as mandateId,
        @Common.Label: '{i18n>labelAlternativeDunningRecipient}'
        partner.dunningControl.alternativeDunningRecipient.id as alternativeDunningRecipient_id,
        @Common.Label: '{i18n>labelAlternativeCorrespondenceRecipient}'
        partner.correspondence.alternativeCorrespondenceRecipient.id as alternativeCorrespondenceRecipient_id
    };
};