using {
  sap.odm.businesspartner.AddressData,
  sap.odm.businesspartner.AddressDataUsage,
  sap.odm.businesspartner.BankAccount,
  sap.odm.businesspartner.BusinessPartner,
  sap.odm.businesspartner.BusinessPartnerRole,
  sap.odm.businesspartner.Email,
  sap.odm.businesspartner.Fax,
  // sap.odm.businesspartner.Identification,
  sap.odm.businesspartner.Industry,
  sap.odm.businesspartner.OrganizationAddress,
  sap.odm.businesspartner.OrganizationDetails,
  sap.odm.businesspartner.OrganizationName,
  sap.odm.businesspartner.PersonAddress,
  sap.odm.businesspartner.PersonDetails, 
  sap.odm.businesspartner.PersonName,
  sap.odm.businesspartner.Phone,
  sap.odm.businesspartner.TaxNumber,
  sap.odm.businesspartner.Website,
  sap.odm.sales.CustomerInformation,
  sap.odm.sales.CustomerTaxClassification
  
} from '@sap/odm/dist/businesspartner/BusinessPartner';

annotate BusinessPartner with @AuditLog.Operation: {Read: true, Insert: true, Update: true};
annotate PersonName with @AuditLog.Operation: {Read: true, Insert: true, Update: true, Delete: true};
annotate PersonDetails with @AuditLog.Operation: {Read: true, Insert: true, Update: true, Delete: true};
annotate BankAccount with @AuditLog.Operation: {Read: true, Insert: true, Update: true, Delete: true};
annotate OrganizationName with @AuditLog.Operation: { Insert: true, Update: true, Delete: true};
annotate TaxNumber with @AuditLog.Operation: { Read: true, Insert: true, Update: true, Delete: true};
annotate AddressData with @AuditLog.Operation: { Read: true, Insert: true, Update: true, Delete: true};
annotate PersonAddress with @AuditLog.Operation: { Read: true, Insert: true, Update: true, Delete: true};
annotate OrganizationAddress with @AuditLog.Operation: { Read: true, Insert: true, Update: true, Delete: true};

annotate CustomerInformation with @AuditLog.Operation: { Read: true, Insert: true, Update: true, Delete: true};
annotate CustomerTaxClassification with @AuditLog.Operation: { Read: true, Insert: true, Update: true, Delete: true};

annotate Phone with @AuditLog.Operation: { Read: true, Insert: true, Update: true, Delete: true};
annotate Email with @AuditLog.Operation: { Read: true, Insert: true, Update: true, Delete: true};

annotate BankAccount with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate BankAccount with {
  id                         @PersonalData.IsPotentiallyPersonal;
  bankAccountName            @PersonalData.IsPotentiallySensitive;
  bankControlKey             @PersonalData.IsPotentiallySensitive;
  validFrom                  @PersonalData.IsPotentiallySensitive;
  validTo                    @PersonalData.IsPotentiallySensitive;
  bankCountry                @PersonalData.IsPotentiallySensitive;
  bankAccountHolderName      @PersonalData.IsPotentiallySensitive;
  IBAN                       @PersonalData.IsPotentiallySensitive;
  bankAccount                @PersonalData.IsPotentiallySensitive;
  bankNumber                 @PersonalData.IsPotentiallySensitive;
  bankAccountReference       @PersonalData.IsPotentiallySensitive;
  bankAccountCurrency        @PersonalData.IsPotentiallySensitive;
  additionalPaymentReference @PersonalData.IsPotentiallySensitive;
  alternatePaymentAccount    @PersonalData.IsPotentiallySensitive;
}


annotate BusinessPartner with @PersonalData.EntitySemantics : 'DataSubject';

annotate BusinessPartner with {
  id        @PersonalData.FieldSemantics : 'DataSubjectID';
  displayId @PersonalData.FieldSemantics : 'DataSubjectID';
}

annotate PersonDetails with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate PersonDetails with {
  gender      @PersonalData.IsPotentiallySensitive;
  birthDate   @PersonalData.IsPotentiallyPersonal;
  nationality @PersonalData.IsPotentiallyPersonal;
}

annotate PersonName with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate PersonName with {
  firstName               @PersonalData.IsPotentiallyPersonal;
  middleName              @PersonalData.IsPotentiallyPersonal;
  lastName                @PersonalData.IsPotentiallyPersonal;
  secondLastName          @PersonalData.IsPotentiallyPersonal;
  initials                @PersonalData.IsPotentiallyPersonal;
  formOfAddress           @PersonalData.IsPotentiallyPersonal;
  academicTitle           @PersonalData.IsPotentiallyPersonal;
  additionalAcademicTitle @PersonalData.IsPotentiallyPersonal;
  namePrefix              @PersonalData.IsPotentiallyPersonal;
  additionalNamePrefix    @PersonalData.IsPotentiallyPersonal;
  nameSuffix              @PersonalData.IsPotentiallyPersonal;
  formattedPersonName     @PersonalData.IsPotentiallyPersonal;
}

annotate OrganizationDetails with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate OrganizationName with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate OrganizationName with {
  formattedOrgNameLine1 @PersonalData.IsPotentiallyPersonal;
  formattedOrgNameLine2 @PersonalData.IsPotentiallyPersonal;
  formattedOrgNameLine3 @PersonalData.IsPotentiallyPersonal;
  formattedOrgNameLine4 @PersonalData.IsPotentiallyPersonal;
  formattedOrgName      @PersonalData.IsPotentiallyPersonal;
}

annotate Industry with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate TaxNumber with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate TaxNumber with {
  taxNumber                @PersonalData.IsPotentiallySensitive;
}

annotate BusinessPartnerRole with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate AddressData with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate AddressDataUsage with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate PersonAddress with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate PersonAddress with {
  firstName               @PersonalData.IsPotentiallyPersonal;
  middleName              @PersonalData.IsPotentiallyPersonal;
  lastName                @PersonalData.IsPotentiallyPersonal;
  secondLastName          @PersonalData.IsPotentiallyPersonal;
  initials                @PersonalData.IsPotentiallyPersonal;
  formOfAddress           @PersonalData.IsPotentiallyPersonal;
  academicTitle           @PersonalData.IsPotentiallyPersonal;
  additionalAcademicTitle @PersonalData.IsPotentiallyPersonal;
  namePrefix              @PersonalData.IsPotentiallyPersonal;
  additionalNamePrefix    @PersonalData.IsPotentiallyPersonal;
  nameSuffix              @PersonalData.IsPotentiallyPersonal;
  formattedPersonName     @PersonalData.IsPotentiallyPersonal;
  streetPrefix1           @PersonalData.IsPotentiallyPersonal;
  streetPrefix2           @PersonalData.IsPotentiallyPersonal;
  street                  @PersonalData.IsPotentiallyPersonal;
  streetSuffix1           @PersonalData.IsPotentiallyPersonal;
  streetSuffix2           @PersonalData.IsPotentiallyPersonal;
  houseNumber             @PersonalData.IsPotentiallyPersonal;
  houseNumberSupplement   @PersonalData.IsPotentiallyPersonal;
  floor                   @PersonalData.IsPotentiallyPersonal;
  door                    @PersonalData.IsPotentiallyPersonal;
  careOf                  @PersonalData.IsPotentiallyPersonal;
  town                    @PersonalData.IsPotentiallyPersonal;
  district                @PersonalData.IsPotentiallyPersonal;
  primaryRegion           @PersonalData.IsPotentiallyPersonal;
  secondaryRegion         @PersonalData.IsPotentiallyPersonal;
  tertiaryRegion          @PersonalData.IsPotentiallyPersonal;
  country                 @PersonalData.IsPotentiallyPersonal;
  postCode                @PersonalData.IsPotentiallyPersonal;
  alternative             @PersonalData.IsPotentiallyPersonal;
  coordinates             @PersonalData.IsPotentiallyPersonal;
  timeZone                @PersonalData.IsPotentiallyPersonal;
}

annotate OrganizationAddress with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate OrganizationAddress with {
  formattedOrgNameLine1 @PersonalData.IsPotentiallyPersonal;
  formattedOrgNameLine2 @PersonalData.IsPotentiallyPersonal;
  formattedOrgNameLine3 @PersonalData.IsPotentiallyPersonal;
  formattedOrgNameLine4 @PersonalData.IsPotentiallyPersonal;
  formattedOrgName      @PersonalData.IsPotentiallyPersonal;
  streetPrefix1         @PersonalData.IsPotentiallyPersonal;
  streetPrefix2         @PersonalData.IsPotentiallyPersonal;
  street                @PersonalData.IsPotentiallyPersonal;
  streetSuffix1         @PersonalData.IsPotentiallyPersonal;
  streetSuffix2         @PersonalData.IsPotentiallyPersonal;
  houseNumber           @PersonalData.IsPotentiallyPersonal;
  houseNumberSupplement @PersonalData.IsPotentiallyPersonal;
  floor                 @PersonalData.IsPotentiallyPersonal;
  door                  @PersonalData.IsPotentiallyPersonal;
  careOf                @PersonalData.IsPotentiallyPersonal;
  town                  @PersonalData.IsPotentiallyPersonal;
  district              @PersonalData.IsPotentiallyPersonal;
  primaryRegion         @PersonalData.IsPotentiallyPersonal;
  secondaryRegion       @PersonalData.IsPotentiallyPersonal;
  tertiaryRegion        @PersonalData.IsPotentiallyPersonal;
  country               @PersonalData.IsPotentiallyPersonal;
  postCode              @PersonalData.IsPotentiallyPersonal;
  alternative           @PersonalData.IsPotentiallyPersonal;
  coordinates           @PersonalData.IsPotentiallyPersonal;
  timeZone              @PersonalData.IsPotentiallyPersonal;
}

annotate Email with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate Email with {
  address @PersonalData.IsPotentiallyPersonal;
}
  
annotate Phone with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate Phone with {
  country         @PersonalData.IsPotentiallyPersonal;
  number          @PersonalData.IsPotentiallyPersonal;
  numberExtension @PersonalData.IsPotentiallyPersonal;
}

annotate Fax with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate Fax with {
  country         @PersonalData.IsPotentiallyPersonal;
  number          @PersonalData.IsPotentiallyPersonal;
  numberExtension @PersonalData.IsPotentiallyPersonal;
}

annotate Website with @PersonalData.EntitySemantics : 'DataSubjectDetails';

annotate Website with {
  url @PersonalData.IsPotentiallyPersonal;
}
