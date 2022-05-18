using {
    sap.odm.utilities.billingaccount.BillingAccount,
    sap.odm.utilities.billingaccount.BillingAccountPartner,
    sap.odm.utilities.billingaccount.AccountManagementData,
    sap.odm.utilities.billingaccount.PaymentControl,
    sap.odm.utilities.billingaccount.OutgoingPayment,
    sap.odm.utilities.billingaccount.IncomingPayment,
    sap.odm.utilities.billingaccount.TaxControl,
    sap.odm.utilities.billingaccount.DunningControl,
    sap.odm.utilities.billingaccount.CorrespondenceToOtherPartners,
} from '../../odm/billingaccount';

annotate BillingAccount with @PersonalData.EntitySemantics : 'Other';

annotate BillingAccount with {
    id              @PersonalData.FieldSemantics : 'ContractRelatedID';
    displayId       @PersonalData.IsPotentiallyPersonal;
}

annotate BillingAccountPartner with @PersonalData.EntitySemantics : 'Other';

annotate BillingAccountPartner with {
    businessPartner       @PersonalData.FieldSemantics : 'DataSubjectID';
    address               @PersonalData.IsPotentiallyPersonal;
}

annotate AccountManagementData with @PersonalData.EntitySemantics : 'Other';

annotate AccountManagementData with {
    name                  @PersonalData.IsPotentiallyPersonal;
};

annotate IncomingPayment with @PersonalData.EntitySemantics : 'Other';

annotate IncomingPayment with {
    alternativePayer    @PersonalData.IsPotentiallyPersonal;
    mandateId           @PersonalData.IsPotentiallyPersonal;
}

annotate OutgoingPayment with @PersonalData.EntitySemantics : 'Other';

annotate OutgoingPayment with {
    alternativePayee @PersonalData.IsPotentiallyPersonal;

}

annotate TaxControl with @PersonalData.EntitySemantics : 'Other';

annotate TaxControl with {
    supplyingCountry @PersonalData.IsPotentiallyPersonal;
}

annotate DunningControl with @PersonalData.EntitySemantics : 'Other';

annotate DunningControl with {
    alternativeDunningRecipient @PersonalData.IsPotentiallyPersonal;
}

annotate CorrespondenceToOtherPartners with @PersonalData.EntitySemantics : 'Other';

annotate CorrespondenceToOtherPartners with {
    alternativeCorrespondenceRecipient @PersonalData.IsPotentiallyPersonal;
}