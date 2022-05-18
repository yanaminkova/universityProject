using {
  sap.odm.sales.CustomerOrder,
  sap.odm.sales.CustomerOrderItem,
  sap.odm.sales.CustomerOrderNote,
  sap.odm.sales.CustomerOrderPriceComponent,
  sap.odm.sales.CustomerOrderItemSalesAspect,
  sap.odm.sales.SalesOrderScheduleLine,
  sap.odm.sales.service.CustomerOrderItemServiceAspect,
  sap.odm.sales.service.ServiceOrderItemReferenceObject,
  sap.odm.sales.CustomerOrderPartner,
  sap.odm.sales.SalesDocumentAddress,
  sap.odm.sales.CustomerOrderSalesAspect,
  sap.odm.sales.service.CustomerOrderServiceAspect,
  sap.odm.sales.service.ServiceOrderReferenceObject
} from '../../../../common-model/odm/sales';

using {
    sap.odm.utilities.sales.CustomerOrderItemUtilitiesAspect,
    sap.odm.utilities.sales.CustomerOrderItemUtilitiesReferenceObjectAspect,
    sap.odm.utilities.sales.CustomerOrderItemUtilitiesSubsequentDocumentAspect,
    sap.odm.utilities.sales.CustomerOrderItemUtilitiesSubscriptionAspect
} from '..';

using {
  sap.odm.common.address.ScriptedPersonAddress,
  sap.odm.common.address.Street, 
  sap.odm.common.address.Town,
  sap.odm.common.address.District,
  sap.odm.common.address.TertiaryRegion,
  sap.odm.common.address.SecondaryRegion,
  sap.odm.common.address.AlternativeDeliveryAddress,
  sap.odm.common.GeoCoordinates
} from '../../../../common-model/odm/common';

/**
 * IDs can potentially identify a dataSubject or it can be a
 * link to personal data.
 */
annotate CustomerOrder with @PersonalData.EntitySemantics : 'Other' {
  id                  @PersonalData.FieldSemantics:'ContractRelatedID'; 
  customerReferenceId @PersonalData.IsPotentiallyPersonal;
}

annotate CustomerOrderItem with @PersonalData.EntitySemantics : 'Other' {
  alternativeId       @PersonalData.FieldSemantics:'ContractRelatedID'; 
  configurationId     @PersonalData.IsPotentiallyPersonal;
  customerReferenceId @PersonalData.IsPotentiallyPersonal;
  id                  @PersonalData.FieldSemantics:'ContractRelatedID'; 
  parentItemId        @PersonalData.FieldSemantics:'ContractRelatedID'; 
}

annotate CustomerOrderNote with @PersonalData.EntitySemantics : 'Other' {
  id                  @PersonalData.IsPotentiallyPersonal; 
  text                @PersonalData.IsPotentiallyPersonal;
}

annotate CustomerOrderItemUtilitiesReferenceObjectAspect with @PersonalData.EntitySemantics : 'Other' {
  meter               @PersonalData.IsPotentiallyPersonal;
}

annotate CustomerOrderItemUtilitiesSubsequentDocumentAspect with @PersonalData.EntitySemantics : 'Other' { 
  id          @PersonalData.IsPotentiallyPersonal;
  displayId   @PersonalData.IsPotentiallyPersonal;
}

annotate CustomerOrderPartner with @PersonalData.EntitySemantics : 'Other' {
  businessPartnerId      @PersonalData.FieldSemantics:'DataSubjectID'; 
  id                     @PersonalData.IsPotentiallyPersonal; 
  contractAccountId      @PersonalData.FieldSemantics:'ContractRelatedID';
}

annotate SalesDocumentAddress with @PersonalData.EntitySemantics : 'Other' { 
  phoneNumber            @PersonalData.IsPotentiallyPersonal; 
  faxNumber              @PersonalData.IsPotentiallyPersonal; 
  emailAddress           @PersonalData.IsPotentiallyPersonal; 
  streetPrefix1          @PersonalData.IsPotentiallyPersonal; 
  streetPrefix2          @PersonalData.IsPotentiallyPersonal; 
  streetSuffix1          @PersonalData.IsPotentiallyPersonal; 
  streetSuffix2          @PersonalData.IsPotentiallyPersonal; 
  houseNumber            @PersonalData.IsPotentiallyPersonal; 
  houseNumberSupplement  @PersonalData.IsPotentiallyPersonal; 
  floor                  @PersonalData.IsPotentiallyPersonal; 
  door                   @PersonalData.IsPotentiallyPersonal; 
  careOf                 @PersonalData.IsPotentiallyPersonal; 
  postCode               @PersonalData.IsPotentiallyPersonal; 
}

annotate Street with @PersonalData.EntitySemantics : 'Other' {
 name   @PersonalData.IsPotentiallyPersonal; 
}

annotate Town with @PersonalData.EntitySemantics : 'Other' {
  name   @PersonalData.IsPotentiallyPersonal; 
}

annotate District with @PersonalData.EntitySemantics : 'Other' {
  name   @PersonalData.IsPotentiallyPersonal; 
}

annotate TertiaryRegion with @PersonalData.EntitySemantics : 'Other' {
  name   @PersonalData.IsPotentiallyPersonal; 
}

annotate SecondaryRegion with @PersonalData.EntitySemantics : 'Other' {
  name   @PersonalData.IsPotentiallyPersonal;  
}

annotate AlternativeDeliveryAddress with @PersonalData.EntitySemantics : 'Other' {
  postCode                  @PersonalData.IsPotentiallyPersonal;  
  deliveryServiceType       @PersonalData.IsPotentiallyPersonal;  
  deliveryServiceQualifier  @PersonalData.IsPotentiallyPersonal;  
  deliveryServiceIdentifier @PersonalData.IsPotentiallyPersonal;  
}

annotate GeoCoordinates with @PersonalData.EntitySemantics : 'Other' {
  latitude      @PersonalData.IsPotentiallyPersonal;  
  longitude     @PersonalData.IsPotentiallyPersonal;  
  altitude      @PersonalData.IsPotentiallyPersonal;  
}

annotate ScriptedPersonAddress with @PersonalData.EntitySemantics : 'Other' {
  firstName                @PersonalData.IsPotentiallyPersonal;  
  middleName               @PersonalData.IsPotentiallyPersonal;  
  lastName                 @PersonalData.IsPotentiallyPersonal;  
  secondLastName           @PersonalData.IsPotentiallyPersonal;  
  initials                 @PersonalData.IsPotentiallyPersonal;  
  formattedPersonName      @PersonalData.IsPotentiallyPersonal;  
}

annotate CustomerOrderItemUtilitiesSubscriptionAspect with @PersonalData.EntitySemantics : 'Other' { 
  validFrom @PersonalData.IsPotentiallyPersonal;
  validTo   @PersonalData.IsPotentiallyPersonal;
}	