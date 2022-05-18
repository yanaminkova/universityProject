using {
    sap.odm.sales as sales,
    sap.odm.common as common,
    sap.odm.finance as finance,
    sap.odm.orgunit as orgunit,
    sap.odm.product as product,
    sap.odm.businesspartner.BusinessPartner as BusinessPartner
} from '../../../../common-model/odm';

using {
    sap.odm.utilities as utilities
} from '../../../../db/models/extensions';

annotate common.codelist {
    /**
    * User-facing name of a code list entry.
    */
    name;
    /**
    * Description of a code list entry.
    */
    descr;
}

annotate API_EDOM_RETAILER with @Core.Description: '{i18n>descriptionApiEdomRetailer}';
annotate API_EDOM_RETAILER with @Core.LongDescription: '{i18n>longDescriptionApiEdomRetailer}';

annotate sales.CustomerOrder with {  
    @description: '{i18n>descriptionCustomerOrderId}'
    id;

    @description: '{i18n>descriptionCustomerOrderType}'
    type;

    @description: '{i18n>descriptionCustomerOrderOrderDate}'
    orderDate;

    @description: '{i18n>descriptionCustomerOrderCancellationStatus}'
    cancellationStatus;

    @description: '{i18n>descriptionCustomerOrderIsExternallyPriced}'
    isExternallyPriced;

    @description: '{i18n>descriptionCustomerOrderItems}'
    items;

    @description: '{i18n>descriptionCustomerOrderNetAmount}'
    netAmount;

    @description: '{i18n>descriptionCustomerOrderPaymentReferences}'
    paymentReferences;

    @description: '{i18n>descriptionCustomerOrderPriceComponents}'
    priceComponents;

    @description: '{i18n>descriptionCustomerOrderPricingDate}'
    pricingDate;

    @description: '{i18n>descriptionCustomerOrderSalesAspect}'
    salesAspect;

    @description: '{i18n>descriptionCustomerOrderServiceAspect}'
    serviceAspect;

    @description: '{i18n>descriptionCustomerOrderDistributionChannel}'
    distributionChannel;

    @description: '{i18n>descriptionCustomerOrderDivision}'
    division;

    @description: '{i18n>descriptionCustomerOrderSalesOrganization}'
    salesOrganization;

    @description: '{i18n>descriptionCustomerOrderDisplayId}'
    displayId;

    @description: '{i18n>descriptionCustomerOrderProcessingStatus}'
    processingStatus;

    @description: '{i18n>descriptionCustomerOrderOrderReason}'
    orderReason;

    @description: '{i18n>descriptionCustomerOrderRequestedFulfillmentDate}'
    requestedFulfillmentDate;

    @description: '{i18n>descriptionCustomerOrderCustomerReferenceId}'
    customerReferenceId;

    @description: '{i18n>descriptionCustomerOrderPartners}'
    partners;

    @description: '{i18n>descriptionCustomerOrderNotes}'
    notes;

    @description: '{i18n>descriptionCustomerOrderIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items with {
    @description: '{i18n>descriptionCustomerOrderItemsAlternativeId}'
    alternativeId;

    @description: '{i18n>descriptionCustomerOrderItemsCancellationReason}'
    cancellationReason;

    @description: '{i18n>descriptionCustomerOrderItemsConfigurationId}'
    configurationId;

    @description: '{i18n>descriptionCustomerOrderItemsNetAmount}'
    netAmount;

    @description: '{i18n>descriptionCustomerOrderItemsPriceComponents}'
    priceComponents;

    @description: '{i18n>descriptionCustomerOrderItemsUtilitiesAspect}'
    utilitiesAspect;

    @description: '{i18n>descriptionCustomerOrderItemsQuantity}'
    quantity;

    @description: '{i18n>descriptionCustomerOrderItemsId}'
    id;

    @description: '{i18n>descriptionCustomerOrderItemsText}'
    text;

    @description: '{i18n>descriptionCustomerOrderItemsProduct}'
    product;

    @description: '{i18n>descriptionCustomerOrderItemsQuantityUnit}'
    quantityUnit;

    @description: '{i18n>descriptionCustomerOrderItemsParentItemId}'
    parentItemId;

    @description: '{i18n>descriptionCustomerOrderItemsType}'
    type;

    @description: '{i18n>descriptionCustomerOrderItemsCustomerReferenceId}'
    customerReferenceId;

    @description: '{i18n>descriptionCustomerOrderItemsPartners}'
    partners;

    @description: '{i18n>descriptionCustomerOrderItemsProcessingStatus}'
    processingStatus;

    @description: '{i18n>descriptionCustomerOrderItemsNotes}'
    notes;

    @description: '{i18n>descriptionCustomerOrderItemsSalesAspect}'
    salesAspect;

    @description: '{i18n>descriptionCustomerOrderItemsServiceAspect}'
    serviceAspect;

    @description: '{i18n>descriptionCustomerOrderItemsSubscriptionAspect}'
    subscriptionAspect;

    @description: '{i18n>descriptionCustomerOrderItemsIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.partners with {
    @description: '{i18n>descriptionCustomerOrderPartnersId}'
    id;

    @description: '{i18n>descriptionCustomerOrderPartnersAddress}'
    address;	

    @description: '{i18n>descriptionCustomerOrderPartnersBusinessPartner}'
    businessPartner;

    @description: '{i18n>descriptionCustomerOrderPartnersBusinessPartnerId}'
    businessPartnerId;

    @description: '{i18n>descriptionCustomerOrderPartnersMain}'
    main;

    @description: '{i18n>descriptionCustomerOrderPartnersPersonAddressDetails}'
    personAddressDetails;	

    @description: '{i18n>descriptionCustomerOrderPartnersPlantPartner}'
    plantPartner;	

    @description: '{i18n>descriptionCustomerOrderPartnersRole}'
    role;

    @description: '{i18n>descriptionCustomerOrderPartnersContractAccountId}'
    contractAccountId;

    @description: '{i18n>descriptionCustomerOrderPartnersIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.notes with {
    @description: '{i18n>descriptionCustomerOrderNotesId}'
    id;

    @description: '{i18n>descriptionCustomerOrderNotesTextType}'
    textType;

    @description: '{i18n>descriptionCustomerOrderNotesText}'
    text;

    @description: '{i18n>descriptionCustomerOrderNotesLanguage}'
    language;

    @description: '{i18n>descriptionCustomerOrderNotesIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.priceComponents with {
    @description: '{i18n>descriptionCustomerOrderPriceComponentsId}'
    id;

    @description: '{i18n>descriptionCustomerOrderPriceComponentsConditionType}'
    conditionType;

    @description: '{i18n>descriptionCustomerOrderPriceComponentsValue}'
    value;

    @description: '{i18n>descriptionCustomerOrderPriceComponentsCurrency}'
    currency;

    @description: '{i18n>descriptionCustomerOrderPriceComponentsPerQuantity}'
    perQuantity;

    @description: '{i18n>descriptionCustomerOrderPriceComponentsPerQuantityUnit}'
    perQuantityUnit;

    @description: '{i18n>descriptionCustomerOrderPriceComponentsMinorLevel}'
    minorLevel;

    @description: '{i18n>descriptionCustomerOrderPriceComponentsMajorLevel}'
    majorLevel;	

    @description: '{i18n>descriptionCustomerOrderPriceComponentsIsManual}'
    isManual;

    @description: '{i18n>descriptionCustomerOrderPriceComponentsIsInactive}'
    isInactive;

    @description: '{i18n>descriptionCustomerOrderPriceComponentsIsPrintRelevant}'
    isPrintRelevant;

    @description: '{i18n>descriptionCustomerOrderPriceComponentsIsBlocked}'
    isBlocked;
}


annotate sales.CustomerOrder.salesAspect with {
    @description: '{i18n>descriptionCustomerOrderSalesAspectShippingCondition}'
    shippingCondition;

    @description: '{i18n>descriptionCustomerOrderSalesAspectPaymentTerms}'
    paymentTerms;

    @description: '{i18n>descriptionCustomerOrderSalesAspectIncotermsClassification}'
    incotermsClassification;

    @description: '{i18n>descriptionCustomerOrderSalesAspectIsBlocked}'
    isBlocked;
}

annotate sales.service.CustomerOrderServiceAspect with {
    @description: '{i18n>descriptionCustomerOrderServiceAspectServiceOrganization}'
    serviceOrganization;	

    @description: '{i18n>descriptionCustomerOrderServiceAspectPriority}'
    priority;

    @description: '{i18n>descriptionCustomerOrderServiceAspectRequestedServiceStartAt}'
    requestedServiceStartAt;

    @description: '{i18n>descriptionCustomerOrderServiceAspectRequestedServiceEndAt}'
    requestedServiceEndAt;

    @description: '{i18n>descriptionCustomerOrderServiceAspectReferenceObjects}'
    referenceObjects;

    @description: '{i18n>descriptionCustomerOrderServiceAspectIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.serviceAspect.referenceObjects with {
    @description: '{i18n>descriptionServiceOrderReferenceObjectEquipment}'
    equipment;

    @description: '{i18n>descriptionServiceOrderReferenceObjectIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items.partners with {
    @description: '{i18n>descriptionCustomerOrderItemPartnersAddress}'
    address;

    @description: '{i18n>descriptionCustomerOrderItemPartnersId}'
    id;

    @description: '{i18n>descriptionCustomerOrderItemPartnersRole}'
    role;

    @description: '{i18n>descriptionCustomerOrderItemPartnersIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items.notes with {
    @description: '{i18n>descriptionCustomerOrderItemNotesId}'
    id;

    @description: '{i18n>descriptionCustomerOrderItemNotesTextType}'
    textType;

    @description: '{i18n>descriptionCustomerOrderItemNotesText}'
    text;

    @description: '{i18n>descriptionCustomerOrderItemNotesLanguage}'
    language;

    @description: '{i18n>descriptionCustomerOrderItemNotesIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items.priceComponents with {
    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsId}'
    id;	

    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsConditionType}'
    conditionType;

    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsValue}'
    value;

    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsCurrency}'
    currency;

    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsPerQuantity}'
    perQuantity;

    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsPerQuantityUnit}'
    perQuantityUnit;

    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsMinorLevel}'
    minorLevel;

    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsMajorLevel}'
    majorLevel;

    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsIsManual}'
    isManual;

    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsIsInactive}'
    isInactive;

    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsIsPrintRelevant}'
    isPrintRelevant;

    @description: '{i18n>descriptionCustomerOrderItemPriceComponentsIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items.salesAspect with {
    @description: '{i18n>descriptionCustomerOrderItemSalesAspectPlant}'
    plant;

    @description: '{i18n>descriptionCustomerOrderItemSalesAspectShippingPoint}'
    shippingPoint;

    @description: '{i18n>descriptionCustomerOrderItemSalesAspectDeliveryPriority}'
    deliveryPriority;

    @description: '{i18n>descriptionCustomerOrderItemSalesAspectScheduleLines}'
    scheduleLines;	

    @description: '{i18n>descriptionCustomerOrderItemSalesAspectPaymentTerms}'
    paymentTerms;

    @description: '{i18n>descriptionCustomerOrderItemSalesAspectIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items.salesAspect.scheduleLines with {
    @description: '{i18n>descriptionSalesOrderScheduleLineId}'
    id;

    @description: '{i18n>descriptionSalesOrderScheduleLineQuantity}'
    quantity;

    @description: '{i18n>descriptionSalesOrderScheduleLineDeliveryDate}'
    deliveryDate;

    @description: '{i18n>descriptionSalesOrderScheduleLineIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items.serviceAspect with {
    @description: '{i18n>descriptionCustomerOrderItemServiceAspectPlannedServiceStartAt}'
    plannedServiceStartAt;

    @description: '{i18n>descriptionCustomerOrderItemServiceAspectPlannedServiceEndAt}'
    plannedServiceEndAt;

    @description: '{i18n>descriptionCustomerOrderItemServiceAspectReferenceObjects}'
    referenceObjects;

    @description: '{i18n>descriptionCustomerOrderItemServiceAspectIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items.serviceAspect.referenceObjects with {
    @description: '{i18n>descriptionServiceOrderItemReferenceObjectEquipment}'
    equipment;

    @description: '{i18n>descriptionServiceOrderItemReferenceObjectIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items.utilitiesAspect with {
    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectFormerServiceProvider}'
    formerServiceProvider;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectReferenceObject}'
    referenceObject;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectSubsequentDocument}'
    subsequentDocument;	

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectDistributionChannel}'
    distributionChannel;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectDivision}'
    division;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectSalesOrganization}'
    salesOrganization;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectPodId}'
    podId;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectSupplyAddressId}'
    supplyAddress;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectGridPricing}'
    gridPricing;	

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectDeviceTypePricing}'
    deviceTypePricing;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectGeographicalCode}'
    geographicalCode;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectBudgetBillingType}'
    budgetBillingType;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectReferenceBillDate}'
    referenceBillDate;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesAspectIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items.utilitiesAspect.referenceObject with {
    @description: '{i18n>descriptionCustomerOrderItemUtilitiesReferenceObjectMeter}'
    meter;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesReferenceObjectInstallation}'
    installation;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesReferenceObjectIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items.utilitiesAspect.subsequentDocument with {
    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentId}'
    id;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentDisplayId}'
    displayId;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentType}'
    type;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrder.items.subscriptionAspect with {
    @description: '{i18n>descriptionCustomerOrderItemSubscriptionAspectContractTerm}'
    contractTerm;

    @description: '{i18n>descriptionCustomerOrderItemSubscriptionAspectSubscriptionReference}'
    subscriptionReference;

    @description: '{i18n>descriptionCustomerOrderItemSubscriptionAspectValidFrom}'
    validFrom;

    @description: '{i18n>descriptionCustomerOrderItemSubscriptionAspectValidTo}'
    validTo;

    @description: '{i18n>descriptionCustomerOrderItemSubscriptionAspectIsBlocked}'
    isBlocked;

    @description: '{i18n>descriptionCustomerOrderItemsSubscriptionAspectTechnicalResources}'
    technicalResources;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubscriptionAspectHeaderCustomReferences}'
    headerCustomReferences;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubscriptionAspectItemCustomReferences}'
    itemCustomReferences;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubscriptionAspectItemSubscriptionParameters}'
    itemSubscriptionParameters;
}

annotate sales.orgunit.SalesOrganization with {
    @description: '{i18n>descriptionSalesOrganizationId}'
    id;

    @description: '{i18n>descriptionSalesOrganizationDisplayId}'
    displayId;

    @description: '{i18n>descriptionSalesOrganizationName}'
    name;

    @description: '{i18n>descriptionSalesOrganizationCompanyCode}'
    companyCode;

    @description: '{i18n>descriptionSalesOrganizationCurrency}'
    currency;
}

annotate sales.service.CustomerOrder.serviceAspect.serviceOrganization with {
    @description: '{i18n>descriptionServiceOrganizationId}'
    id;

    @description: '{i18n>descriptionServiceOrganizationServiceOrganization}'
    serviceOrganization;

    @description: '{i18n>descriptionServiceOrganizationServiceTeam}'
    serviceTeam;
}

annotate sales.service.ServiceOrganization with {
    @description: '{i18n>descriptionServiceOrganizationId}'
    id;

    @description: '{i18n>descriptionServiceOrganizationServiceOrganization}'
    serviceOrganization;

    @description: '{i18n>descriptionServiceOrganizationServiceTeam}'
    serviceTeam;
}

annotate orgunit.CompanyCodeName with {
    @description: '{i18n>descriptionCompanyCodeName}'
    name;
}

annotate orgunit.CompanyCode with {
    @description: '{i18n>descriptionCompanyCodeId}'
    id;

    @description: '{i18n>descriptionCompanyCodeDisplayId}'
    displayId;

    @description: '{i18n>descriptionCompanyCodeName}'
    name;

    @description: '{i18n>descriptionCompanyCodecCompany}'
    company;

    @description: '{i18n>descriptionCompanyCodeIsMainForCompany}'
    isMainForCompany;

    @description: '{i18n>descriptionCompanyCodeCountry}'
    country;

    @description: '{i18n>descriptionCompanyCodeLanguage}'
    language;

    @description: '{i18n>descriptionCompanyCodeCurrency}'
    currency;

    @description: '{i18n>descriptionCompanyCodeVatRegistrationId}'
    vatRegistrationId;
}

annotate product.Product with {
    @description: '{i18n>descriptionProductId}'
    id;

    @description: '{i18n>descriptionProductDisplayId}'
    displayId;

    @description: '{i18n>descriptionProductName}'
    name;

    @description: '{i18n>descriptionProductDescription}'
    description;

    @description: '{i18n>descriptionProductType}'
    type;

    @description: '{i18n>descriptionProductSalesAspect}'
    salesAspect;

    @description: '{i18n>descriptionProductTexts}'
    texts;
}

annotate product.ProductTypeCodes with {
    @description: '{i18n>descriptionProductTypeCodesCode}'
    code;

    @description: '{i18n>descriptionProductTypeCodesName}'
    name;

    @description: '{i18n>descriptionProductTypeCodesDescr}'
    descr;

    @description: '{i18n>descriptionProductTypeCodesTexts}'
    texts;

    @description: '{i18n>descriptionProductTypeGroup}'
    typeGroup;

    @description: '{i18n>descriptionProductTypeCodesLocalized}'
    localized;
}

annotate product.ProductTypeGroupCodes with {
    @description: '{i18n>descriptionProductTypeGroupCodesCode}'
    code;
    
    @description: '{i18n>descriptionProductTypeGroupCodesName}'
    name;

    @description: '{i18n>descriptionProductTypeGroupCodesDescr}'
    descr;

    @description: '{i18n>descriptionProductTypeGroupCodesTexts}'
    texts;

    @description: '{i18n>descriptionProductTypeGroupCodesLocalized}'
    localized;
}

annotate product.Product.texts with {
    @description: '{i18n>descriptionProductTextsLocale}'
    locale;

    @description: '{i18n>descriptionProductTextsName}'
    name;

    @description: '{i18n>descriptionProductTextsDescr}'
    descr;

    @description: '{i18n>descriptionInternalComment}'
    internalComment;
}

annotate product.ProductTypeGroupCodes.texts with {
    @description: '{i18n>descriptionProductTypeGroupCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionProductTypeGroupCodesTextsName}'
    name;

    @description: '{i18n>descriptionProductTypeGroupCodesTextsDescr}'
    descr;
}

annotate product.ProductTypeCodes.texts with {
    @description: '{i18n>descriptionProductTypeCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionProductTypeCodesTextsName}'
    name;

    @description: '{i18n>descriptionProductTypeCodesTextsDescr}'
    descr;
}

annotate product.Product.salesAspect with {
    @description: '{i18n>descriptionProductSalesAspectDivision}'
    division;
}

annotate sales.CustomerOrderTypeCodes with {
    @description: '{i18n>descriptionCustomerOrderTypeCodesName}'
    name;

    @description: '{i18n>descriptionCustomerOrderTypeCodesDescr}'
    descr;

    @description: '{i18n>descriptionCustomerOrderTypeCodesCode}'
    code;

    @description: '{i18n>descriptionCustomerOrderTypeCodesTexts}'
    texts;

    @description: '{i18n>descriptionCustomerOrderTypeCodesLocalized}'
    localized;
}

annotate sales.CustomerOrderTypeCodes.texts with {
    @description: '{i18n>descriptionCustomerOrderTypeCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionCustomerOrderTypeCodesTextsName}'
    name;

    @description: '{i18n>descriptionCustomerOrderTypeCodesTextsDescr}'
    descr;
}

annotate sales.CustomerOrderReasonCodes with {
    @description: '{i18n>descriptionCustomerOrderReasonCodesName}'
    name;

    @description: '{i18n>descriptionCustomerOrderReasonCodesDescr}'
    descr;

    @description: '{i18n>descriptionCustomerOrderReasonCodesCode}'
    code;

    @description: '{i18n>descriptionCustomerOrderReasonCodesTexts}'
    texts;

    @description: '{i18n>descriptionCustomerOrderReasonCodesLocalized}'
    localized;
}

annotate sales.CustomerOrderReasonCodes.texts with {
    @description: '{i18n>descriptionCustomerOrderReasonCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionCustomerOrderReasonCodesTextsName}'
    name;

    @description: '{i18n>descriptionCustomerOrderReasonCodesTextsDescr}'
    descr;
}

annotate sales.CustomerOrderItemTypeCodes with {
    @description: '{i18n>descriptionCustomerOrderItemTypeCodesName}'
    name;

    @description: '{i18n>descriptionCustomerOrderItemTypeCodesDescr}'
    descr;

    @description: '{i18n>descriptionCustomerOrderItemTypeCodesCode}'
    code;

    @description: '{i18n>descriptionCustomerOrderItemTypeCodesTexts}'
    texts;

    @description: '{i18n>descriptionCustomerOrderItemTypeCodesLocalized}'
    localized;
}

annotate sales.CustomerOrderItemTypeCodes.texts with {
    @description: '{i18n>descriptionCustomerOrderItemTypeCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionCustomerOrderItemTypeCodesTextsName}'
    name;

    @description: '{i18n>descriptionCustomerOrderItemTypeCodesTextsDescr}'
    descr;
}

annotate utilities.sales.CustomerOrderItemUtilitiesBudgetBillingTypeCodes{
    @description: '{i18n>descriptionCustomerOrderItemUtilitiesBudgetBillingTypeCodesName}'
    name;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesBudgetBillingTypeCodesDescr}'
    descr;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesBudgetBillingTypeCodesCode}'
    code;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesBudgetBillingTypeCodesTexts}'
    texts;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesBudgetBillingTypeCodesLocalized}'
    localized;
}

annotate utilities.sales.CustomerOrderItemUtilitiesBudgetBillingTypeCodes.texts with {
    @description: '{i18n>descriptionCustomerOrderItemUtilitiesBudgetBillingTypeCodesLocale}'
    locale;
}

annotate utilities.sales.CustomerOrderItemUtilitiesDeviceTypeCodes with {
    @description: '{i18n>descriptionCustomerOrderItemUtilitiesDeviceTypeCodesName}'
    name;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesDeviceTypeCodesDescr}'
    descr;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesDeviceTypeCodesCode}'
    code;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesDeviceTypeCodesTexts}'
    texts;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesDeviceTypeCodesLocalized}'
    localized;
}

annotate utilities.sales.CustomerOrderItemUtilitiesDeviceTypeCodes.texts with {
    @description: '{i18n>descriptionCustomerOrderItemUtilitiesDeviceTypeCodesCodeLocale}'
    locale;
}

annotate utilities.sales.CustomerOrderItemUtilitiesSubsequentDocumentCodes with {
    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentCodesName}'
    name;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentCodesDescr}'
    descr;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentCodesCode}'
    code;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentCodesUrlPattern}'
    urlPattern;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentCodesTexts}'
    texts;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentCodesLocalized}'
    localized;
}

annotate utilities.sales.CustomerOrderItemUtilitiesSubsequentDocumentCodes.texts with {
    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentCodesTextsName}'
    name;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubsequentDocumentCodesTextsDescr}'
    descr;
}

annotate sales.SalesCancellationStatusCodes with {
    @description: '{i18n>descriptionSalesCancellationStatusCodesName}'
    name;

    @description: '{i18n>descriptionSalesCancellationStatusCodesDescr}'
    descr;

    @description: '{i18n>descriptionSalesCancellationStatusCodesCode}'
    code;

    @description: '{i18n>descriptionSalesCancellationStatusCodesTexts}'
    texts;

    @description: '{i18n>descriptionSalesCancellationStatusCodesLocalized}'
    localized;
}

annotate sales.SalesCancellationStatusCodes.texts with {
    @description: '{i18n>descriptionSalesCancellationStatusCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionSalesCancellationStatusCodesTextsName}'
    name;

    @description: '{i18n>descriptionSalesCancellationStatusCodesTextsDescr}'
    descr;
}

annotate sales.SalesCancellationReasonCodes with {
    @description: '{i18n>descriptionSalesCancellationReasonCodesName}'
    name;

    @description: '{i18n>descriptionSalesCancellationReasonCodesDescr}'
    descr;

    @description: '{i18n>descriptionSalesCancellationReasonCodesCode}'
    code;

    @description: '{i18n>descriptionSalesCancellationReasonCodesTexts}'
    texts;

    @description: '{i18n>descriptionSalesCancellationReasonCodesLocalized}'
    localized;
}

annotate sales.SalesCancellationReasonCodes.texts with {
    @description: '{i18n>descriptionSalesCancellationReasonCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionSalesCancellationReasonCodesTextsName}'
    name;

    @description: '{i18n>descriptionSalesCancellationReasonCodesTextsDescr}'
    descr;
}

annotate sales.SalesProcessingStatusCodes with {
    @description: '{i18n>descriptionSalesProcessingStatusCodesName}'
    name;

    @description: '{i18n>descriptionSalesProcessingStatusCodesDescr}'
    descr;

    @description: '{i18n>descriptionSalesProcessingStatusCodesCode}'
    code;

    @description: '{i18n>descriptionSalesProcessingStatusCodesIsDefault}'
    isDefault;

    @description: '{i18n>descriptionSalesProcessingStatusCodesTexts}'
    texts;

    @description: '{i18n>descriptionSalesProcessingStatusCodesLocalized}'
    localized;
}

annotate sales.SalesProcessingStatusCodes.texts with {
    @description: '{i18n>descriptionSalesProcessingStatusCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionSalesProcessingStatusCodesTextsName}'
    name;

    @description: '{i18n>descriptionSalesProcessingStatusCodesTextsDescr}'
    descr;
}

annotate sales.SalesPartnerRoleCodes with {
    @description: '{i18n>descriptionSalesPartnerRoleCodesName}'
    name;

    @description: '{i18n>descriptionSalesPartnerRoleCodesDescr}'
    descr;

    @description: '{i18n>descriptionSalesPartnerRoleCodesCode}'
    code;

    @description: '{i18n>descriptionSalesPartnerRoleCodesTexts}'
    texts;

    @description: '{i18n>descriptionSalesPartnerRoleCodesLocalized}'
    localized;
}

annotate sales.SalesPartnerRoleCodes.texts with {
    @description: '{i18n>descriptionSalesPartnerRoleCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionSalesPartnerRoleCodesTextsName}'
    name;

    @description: '{i18n>descriptionSalesPartnerRoleCodesTextsDescr}'
    descr;
}

annotate sales.SalesTextTypeCodes with {
    @description: '{i18n>descriptionSalesTextTypeCodesName}'
    name;

    @description: '{i18n>descriptionSalesTextTypeCodesDescr}'
    descr;

    @description: '{i18n>descriptionSalesTextTypeCodesCode}'
    code;

    @description: '{i18n>descriptionSalesTextTypeCodesTexts}'
    texts;

    @description: '{i18n>descriptionSalesTextTypeCodesLocalized}'
    localized;
}

annotate sales.SalesTextTypeCodes.texts with {
    @description: '{i18n>descriptionSalesTextTypeCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionSalesTextTypeCodesTextsName}'
    name;

    @description: '{i18n>descriptionSalesTextTypeCodesTextsDescr}'
    descr;
}

annotate sales.orgunit.DistributionChannelCodes with {
    @description: '{i18n>descriptionDistributionChannelCodesName}'
    name;

    @description: '{i18n>descriptionDistributionChannelCodesDescr}'
    descr;

    @description: '{i18n>descriptionDistributionChannelCodesCode}'
    code;

    @description: '{i18n>descriptionDistributionChannelCodesTexts}'
    texts;

    @description: '{i18n>descriptionDistributionChannelCodesLocalized}'
    localized;
}

annotate sales.orgunit.DistributionChannelCodes.texts with {
    @description: '{i18n>descriptionDistributionChannelCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionDistributionChannelCodesTextsName}'
    name;

    @description: '{i18n>descriptionDistributionChannelCodesTextsDescr}'
    descr;
}

annotate sales.pricing.ConditionTypeCodes with {
    @description: '{i18n>descriptionConditionTypeCodesName}'
    name;

    @description: '{i18n>descriptionConditionTypeCodesDescr}'
    descr;

    @description: '{i18n>descriptionConditionTypeCodesCode}'
    code;

    @description: '{i18n>descriptionConditionTypeCodesTexts}'
    texts;

    @description: '{i18n>descriptionConditionTypeCodesLocalized}'
    localized;
}

annotate sales.pricing.ConditionTypeCodes.texts with {
    @description: '{i18n>descriptionConditionTypeCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionConditionTypeCodesTextsName}'
    name;

    @description: '{i18n>descriptionConditionTypeCodesTextsDescr}'
    descr;
}

annotate sales.orgunit.DivisionCodes with {
    @description: '{i18n>descriptionDivisionCodesName}'
    name;

    @description: '{i18n>descriptionDivisionCodesDescr}'
    descr;

    @description: '{i18n>descriptionDivisionCodesCode}'
    code;

    @description: '{i18n>descriptionDivisionCodesTexts}'
    texts;

    @description: '{i18n>descriptionDivisionCodesLocalized}'
    localized;
}

annotate sales.orgunit.DivisionCodes.texts with {
    @description: '{i18n>descriptionDivisionCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionDivisionCodesTextsName}'
    name;

    @description: '{i18n>descriptionDivisionCodesTextsDescr}'
    descr;
}

annotate sales.service.ServiceOrderPriorityCodes with {
    @description: '{i18n>descriptionServiceOrderPriorityCodesName}'
    name;

    @description: '{i18n>descriptionServiceOrderPriorityCodesDescr}'
    descr;

    @description: '{i18n>descriptionServiceOrderPriorityCodesCode}'
    code;

    @description: '{i18n>descriptionServiceOrderPriorityCodesTexts}'
    texts;

    @description: '{i18n>descriptionServiceOrderPriorityCodesLocalized}'
    localized;
}

annotate sales.service.ServiceOrderPriorityCodes.texts with {
    @description: '{i18n>descriptionServiceOrderPriorityCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionServiceOrderPriorityCodesTextsName}'
    name;

    @description: '{i18n>descriptionServiceOrderPriorityCodesTextsDescr}'
    descr;
}

annotate sales.shipping.ShippingConditionCodes with {
    @description: '{i18n>descriptionShippingConditionCodesName}'
    name;

    @description: '{i18n>descriptionShippingConditionCodesDescr}'
    descr;

    @description: '{i18n>descriptionShippingConditionCodesCode}'
    code;

    @description: '{i18n>descriptionShippingConditionCodesTexts}'
    texts;

    @description: '{i18n>descriptionShippingConditionCodesLocalized}'
    localized;
}

annotate sales.shipping.ShippingConditionCodes.texts with {
    @description: '{i18n>descriptionShippingConditionCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionShippingConditionCodesTextsName}'
    name;

    @description: '{i18n>descriptionShippingConditionCodesTextsDescr}'
    descr;
}

annotate sales.shipping.DeliveryPriorityCodes with {
    @description: '{i18n>descriptionDeliveryPriorityCodesName}'
    name;

    @description: '{i18n>descriptionDeliveryPriorityCodesDescr}'
    descr;

    @description: '{i18n>descriptionDeliveryPriorityCodesCode}'
    code;

    @description: '{i18n>descriptionDeliveryPriorityCodesTexts}'
    texts;

    @description: '{i18n>descriptionDeliveryPriorityCodesLocalized}'
    localized;
}

annotate sales.shipping.DeliveryPriorityCodes.texts with {
    @description: '{i18n>descriptionDeliveryPriorityCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionDeliveryPriorityCodesTextsName}'
    name;

    @description: '{i18n>descriptionDeliveryPriorityCodesTextsDescr}'
    descr;
}

annotate common.UnitOfMeasureCodes with {
    @description: '{i18n>descriptionUnitOfMeasuresCodesName}'
    name;

    @description: '{i18n>descriptionUnitOfMeasuresCodesDescr}'
    descr;

    @description: '{i18n>descriptionUnitOfMeasuresCodesCode}'
    code;

    @description: '{i18n>descriptionUnitOfMeasuresCodesTexts}'
    texts;

    @description: '{i18n>descriptionUnitOfMeasuresCodesLocalized}'
    localized;

    @description: '{i18n>descriptionUnitOfMeasuresCodesNumberOfDecimals}'
    numberOfDecimals
}

annotate common.UnitOfMeasureCodes.texts with {
    @description: '{i18n>descriptionUnitOfMeasuresCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionUnitOfMeasuresCodesTextsName}'
    name;

    @description: '{i18n>descriptionUnitOfMeasuresCodesTextsDescr}'
    descr;
}

annotate common.CurrencyCodes with {
    @description: '{i18n>descriptionCurrencyCodesName}'
    name;

    @description: '{i18n>descriptionCurrencyCodesDescr}'
    descr;

    @description: '{i18n>descriptionCurrencyCodesChangeType}'
    changeType;

    @description: '{i18n>descriptionCurrencyCodesCode}'
    code;

    @description: '{i18n>descriptionCurrencyCodesMinorUnit}'
    minorUnit;

    @description: '{i18n>descriptionCurrencyCodesTexts}'
    texts;

    @description: '{i18n>descriptionCurrencyCodesLocalized}'
    localized;
}

annotate common.CurrencyCodes.texts with {
    @description: '{i18n>descriptionCurrencyCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionCurrencyCodesTextsName}'
    name;

    @description: '{i18n>descriptionCurrencyCodesTextsDescr}'
    descr;
}

annotate finance.accounting.PaymentTermsCodes with {
    @description: '{i18n>descriptionPaymentTermsCodesName}'
    name;

    @description: '{i18n>descriptionPaymentTermsCodesDescr}'
    descr;

    @description: '{i18n>descriptionPaymentTermsCodesCode}'
    code;

    @description: '{i18n>descriptionPaymentTermsCodesTexts}'
    texts;

    @description: '{i18n>descriptionPaymentTermsCodesLocalized}'
    localized;
}

annotate finance.accounting.PaymentTermsCodes.texts with {
    @description: '{i18n>descriptionPaymentTermsCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionPaymentTermsCodesTextsName}'
    name;

    @description: '{i18n>descriptionPaymentTermsCodesTextsDescr}'
    descr;
}

annotate finance.payment.PaymentCardTypeCodes with {
    @description: '{i18n>descriptionPaymentCardTypeCodesName}'
    name;

    @description: '{i18n>descriptionPaymentCardTypeCodesDescr}'
    descr;

    @description: '{i18n>descriptionPaymentCardTypeCodesCode}'
    code;

    @description: '{i18n>descriptionPaymentCardTypeCodesTexts}'
    texts;

    @description: '{i18n>descriptionPaymentCardTypeCodesLocalized}'
    localized;
}

annotate finance.payment.PaymentCardTypeCodes.texts with {
    @description: '{i18n>descriptionPaymentCardTypeCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionPaymentCardTypeCodesTextsName}'
    name;

    @description: '{i18n>descriptionPaymentCardTypeCodesTextsDescr}'
    descr;
}

annotate common.LanguageCodes with {
    @description: '{i18n>descriptionLanguageCodesName}'
    name;

    @description: '{i18n>descriptionLanguageCodesDescr}'
    descr;

    @description: '{i18n>descriptionLanguageCodesCode}'
    code;

    @description: '{i18n>descriptionLanguageCodesTexts}'
    texts;

    @description: '{i18n>descriptionLanguageCodesLocalized}'
    localized;
}

annotate common.LanguageCodes.texts with {
    @description: '{i18n>descriptionLanguageCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionLanguageCodesTextsName}'
    name;

    @description: '{i18n>descriptionLanguageCodesTextsDescr}'
    descr;
}

annotate common.CountryCodes with {
    @description: '{i18n>descriptionCountryCodesName}'
    name;

    @description: '{i18n>descriptionCountryCodesDescr}'
    descr;

    @description: '{i18n>descriptionCountryCodesChangeType}'
    changeType;

    @description: '{i18n>descriptionCountryCodesCode}'
    code;

    @description: '{i18n>descriptionCountryCodesCurrency}'
    currency;

    @description: '{i18n>descriptionCountryCodesTexts}'
    texts;

    @description: '{i18n>descriptionCountryCodesLocalized}'
    localized;
}

annotate common.CountryCodes.texts with {
    @description: '{i18n>descriptionCountryCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionCountryCodesTextsName}'
    name;

    @description: '{i18n>descriptionCountryCodesTextsDescr}'
    descr;
}

annotate common.IncotermsClassificationCodes with {
    @description: '{i18n>descriptionIncotermsClassificationCodesName}'
    name;

    @description: '{i18n>descriptionIncotermsClassificationCodesDescr}'
    descr;

    @description: '{i18n>descriptionIncotermsClassificationCodesCode}'
    code;

    @description: '{i18n>descriptionIncotermsClassificationCodesTexts}'
    texts;

    @description: '{i18n>descriptionIncotermsClassificationCodesLocalized}'
    localized;
}

annotate common.IncotermsClassificationCodes.texts with {
    @description: '{i18n>descriptionIncotermsClassificationCodesTextsLocale}'
    locale;

    @description: '{i18n>descriptionIncotermsClassificationCodesTextsName}'
    name;

    @description: '{i18n>descriptionIncotermsClassificationCodesTextsDescr}'
    descr;
}

annotate common.TimeZoneCodes with {
    @description: '{i18n>descriptionTimeZoneCodesCode}'
    code;
}

annotate common.GeoCoordinates with {
    @description: '{i18n>descriptionGeoCoordinatesLatitude}'
    latitude;

    @description: '{i18n>descriptionGeoCoordinatesLongitude}'
    longitude;

    @description: '{i18n>descriptionGeoCoordinatesAltitude}'
    altitude;
}

annotate common.address.CountrySubdivisionCodes with {
    @description: '{i18n>descriptionCountrySubdivisionCodesCode}'
    code;
}

annotate common.address.StreetCodes with {
    @description: '{i18n>descriptionStreetCodesCode}'
    code;
}

annotate common.address.SecondaryRegionCodes with {
    @description: '{i18n>descriptionSecondaryRegionCodesCode}'
    code;
}

annotate common.address.TertiaryRegionCodes with {
    @description: '{i18n>descriptionTertiaryRegionCodesCode}'
    code;
}

annotate common.address.TownCodes with {
    @description: '{i18n>descriptionTownCodesCode}'
    code;
}

annotate common.address.DistrictCodes with {
    @description: '{i18n>descriptionDistrictCodesCode}'
    code;
}

annotate common.address.DeliveryTypeCodes with {
    @description: '{i18n>descriptionDeliveryTypeCodesCode}'
    code;
}

annotate common.address.FormOfAddressCodes with {
    @description: '{i18n>descriptionFormOfAddressCodesCode}'
    code;
}

annotate common.address.AcademicTitleCodes with {
    @description: '{i18n>descriptionAcademicTitleCodesCode}'
    code;
}

annotate common.address.FamilyNamePrefixCodes with {
    @description: '{i18n>descriptionFamilyNamePrefixCodesCode}'
    code;
}

annotate common.address.FamilyNameSuffixCodes with {
    @description: '{i18n>descriptionFamilyNameSuffixCodesCode}'
    code;
}

annotate common.address.Street with {
    @description: '{i18n>descriptionStreetName}'
    name;

    @description: '{i18n>descriptionStreetRef}'
    ref;
}

annotate common.address.SecondaryRegion with {
    @description: '{i18n>descriptionSecondaryRegionName}'
    name;

    @description: '{i18n>descriptionSecondaryRegionRef}'
    ref;
}

annotate common.address.TertiaryRegion with {
    @description: '{i18n>descriptionTertiaryRegionName}'
    name;

    @description: '{i18n>descriptionTertiaryRegionRef}'
    ref;
}

annotate common.address.Town with {
    @description: '{i18n>descriptionTownName}'
    name;

    @description: '{i18n>descriptionTownRef}'
    ref;
}

annotate common.address.District with {
    @description: '{i18n>descriptionDistrictName}'
    name;

    @description: '{i18n>descriptionDistrictRef}'
    ref;
}

annotate common.address.AlternativeDeliveryAddress with {
    @description: '{i18n>descriptionAlternativeDeliveryAddressCountry}'
    country;

    @description: '{i18n>descriptionAlternativeDeliveryAddressPostCode}'
    postCode;

    @description: '{i18n>descriptionAlternativeDeliveryAddressPrimaryRegion}'
    primaryRegion;

    @description: '{i18n>descriptionAlternativeDeliveryAddressSecondaryRegion}'
    secondaryRegion;

    @description: '{i18n>descriptionAlternativeDeliveryAddressTertiaryRegion}'
    tertiaryRegion;

    @description: '{i18n>descriptionAlternativeDeliveryAddressTown}'
    town;

    @description: '{i18n>descriptionAlternativeDeliveryAddressDistrict}'
    district;

    @description: '{i18n>descriptionAlternativeDeliveryAddressDeliveryType}'
    deliveryType;

    @description: '{i18n>descriptionAlternativeDeliveryAddressDeliveryServiceType}'
    deliveryServiceType;

    @description: '{i18n>descriptionAlternativeDeliveryAddressDeliveryServiceQualifier}'
    deliveryServiceQualifier;

    @description: '{i18n>descriptionAlternativeDeliveryAddressDeliveryServiceIdentifier}'
    deliveryServiceIdentifier;
}

annotate common.address.PersonAddressDetails with {
    @description: '{i18n>descriptionPersonAddressDetailsFirstName}'
    firstName;

    @description: '{i18n>descriptionPersonAddressDetailsMiddleName}'
    middleName;

    @description: '{i18n>descriptionPersonAddressDetailsLastName}'
    lastName;

    @description: '{i18n>descriptionPersonAddressDetailsSecondLastName}'
    secondLastName;

    @description: '{i18n>descriptionPersonAddressDetailsInitials}'
    initials;

    @description: '{i18n>descriptionPersonAddressDetailsFormOfAddress}'
    formOfAddress;

    @description: '{i18n>descriptionPersonAddressDetailsAcademicTitle}'
    academicTitle;

    @description: '{i18n>descriptionPersonAddressDetailsAdditionalAcademicTitle}'
    additionalAcademicTitle;

    @description: '{i18n>descriptionPersonAddressDetailsNamePrefix}'
    namePrefix;

    @description: '{i18n>descriptionPersonAddressDetailsAdditionalNamePrefix}'
    additionalNamePrefix;

    @description: '{i18n>descriptionPersonAddressDetailsNameSuffix}'
    nameSuffix;

    @description: '{i18n>descriptionPersonAddressDetailsFormattedPersonName}'
    formattedPersonName;

    @description: '{i18n>descriptionPersonAddressDetailsEndOfBusinessDate}'
    endOfBusinessDate;

    @description: '{i18n>descriptionPersonAddressDetailsMaxDeletionDate}'
    maxDeletionDate;

    @description: '{i18n>descriptionPersonAddressDetailsIsBlocked}'
    isBlocked;
}

annotate sales.CustomerOrderPaymentReference with {
    @description: '{i18n>descriptionCustomerOrderPaymentReferenceToken}'
    token;

    @description: '{i18n>descriptionCustomerOrderPaymentReferenceUtilitiesCardType}'
    utilitiesCardType;
}

annotate sales.SalesDocumentAddress with {
    @description: '{i18n>descriptionSalesDocumentAddressStreetPrefix1}'
    streetPrefix1;

    @description: '{i18n>descriptionSalesDocumentAddressStreetPrefix2}'
    streetPrefix2;

    @description: '{i18n>descriptionSalesDocumentAddressStreet}'
    street;

    @description: '{i18n>descriptionSalesDocumentAddressStreetSuffix1}'
    streetSuffix1;

    @description: '{i18n>descriptionSalesDocumentAddressStreetSuffix2}'
    streetSuffix2;

    @description: '{i18n>descriptionSalesDocumentAddressHouseNumber}'
    houseNumber;

    @description: '{i18n>descriptionSalesDocumentAddressHouseNumberSupplement}'
    houseNumberSupplement;

    @description: '{i18n>descriptionSalesDocumentAddressFloor}'
    floor;

    @description: '{i18n>descriptionSalesDocumentAddressDoor}'
    door;

    @description: '{i18n>descriptionSalesDocumentAddressCareOf}'
    careOf;

    @description: '{i18n>descriptionSalesDocumentAddressPrimaryRegion}'
    primaryRegion;

    @description: '{i18n>descriptionSalesDocumentAddressSecondaryRegion}'
    secondaryRegion;

    @description: '{i18n>descriptionSalesDocumentAddressTertiaryRegion}'
    tertiaryRegion;

    @description: '{i18n>descriptionSalesDocumentAddressTown}'
    town;

    @description: '{i18n>descriptionSalesDocumentAddressDistrict}'
    district;

    @description: '{i18n>descriptionSalesDocumentAddressCountry}'
    country;

    @description: '{i18n>descriptionSalesDocumentAddressPostCode}'
    postCode;

    @description: '{i18n>descriptionSalesDocumentAddressPostBoxIsWithoutNumber}'
    postBoxIsWithoutNumber;

    @description: '{i18n>descriptionSalesDocumentAddressCompanyPostalCode}'
    companyPostalCode;

    @description: '{i18n>descriptionSalesDocumentAddressDeliveryServiceNumber}'
    deliveryServiceNumber;

    @description: '{i18n>descriptionSalesDocumentAddressAdditionalCityName}'
    additionalCityName;

    @description: '{i18n>descriptionSalesDocumentAddressAlternative}'
    alternative;

    @description: '{i18n>descriptionSalesDocumentAddressCoordinates}'
    coordinates;

    @description: '{i18n>descriptionSalesDocumentAddressTimeZone}'
    timeZone;

    @description: '{i18n>descriptionSalesDocumentAddressPhoneNumber}'
    phoneNumber;

    @description: '{i18n>descriptionSalesDocumentAddressFaxNumber}'
    faxNumber;

    @description: '{i18n>descriptionSalesDocumentAddressEmailAddress}'
    emailAddress;

    @description: '{i18n>descriptionSalesDocumentAddressEndOfBusinessDate}'
    endOfBusinessDate;

    @description: '{i18n>descriptionSalesDocumentAddressMaxDeletionDate}'
    maxDeletionDate;

    @description: '{i18n>descriptionSalesDocumentAddressIsBlocked}'
    isBlocked;
}

annotate utilities.sales.SubscriptionContractTerm with {
    @description: '{i18n>descriptionSubscriptionContractTermPeriod}'
    period;

    @description: '{i18n>descriptionSubscriptionContractTermPeriodicity}'
    periodicity;

    @description: '{i18n>descriptionSubscriptionContractTermPeriodUnit}'
    periodUnit;
}

annotate utilities.sales.SubscriptionReference with {
    @description: '{i18n>descriptionSubscriptionReferenceItemId}'
    itemId;

    @description: '{i18n>descriptionSubscriptionReferenceObjectId}'
    objectId;
}

annotate sales.SalesBusinessArea with {
    @description: '{i18n>descriptionSalesBusinessAreaSalesOffice}'
    salesOffice;

    @description: '{i18n>descriptionSalesBusinessAreaSalesGroup}'
    salesGroup;
}

annotate sales.SalesAreaInDocument with {
    @description: '{i18n>descriptionSalesAreaInDocumentSalesOrganization}'
    salesOrganization;

    @description: '{i18n>descriptionSalesAreaInDocumentDistributionChannel}'
    distributionChannel;

    @description: '{i18n>descriptionSalesAreaInDocumentDivision}'
    division;
}

annotate sales.Incoterms with {
    @description: '{i18n>descriptionIncotermsIncotermsClassification}'
    incotermsClassification;

    @description: '{i18n>descriptionIncotermsIncotermsTransferLocationName}'
    incotermsTransferLocationName;
}

annotate sales.SalesDocument with {
    @description: '{i18n>descriptionSalesDocumentDisplayId}'
    displayId;

    @description: '{i18n>descriptionSalesDocumentText}'
    text;

    @description: '{i18n>descriptionSalesDocumentCurrency}'
    currency;

    @description: '{i18n>descriptionSalesDocumentProcessingStatus}'
    processingStatus;
}

annotate sales.SalesDocumentItem with {
    @description: '{i18n>descriptionSalesDocumentItemText}'
    text;

    @description: '{i18n>descriptionSalesDocumentItemProduct}'
    product;

    @description: '{i18n>descriptionSalesDocumentItemQuantity}'
    quantity;

    @description: '{i18n>descriptionSalesDocumentItemQuantityUnit}'
    quantityUnit;
}

annotate sales.Partner with {
    @description: '{i18n>descriptionPartnerRole}'
    role;

    @description: '{i18n>descriptionPartnerMain}'
    main;

    @description: '{i18n>descriptionPartnerPartnerBusinessPartner}'
    partnerBusinessPartner;

    @description: '{i18n>descriptionPartnerAddress}'
    address;

    @description: '{i18n>descriptionPartnerCommunication}'
    communication;
}

annotate sales.CustomerOrderAddress with {
    @description: '{i18n>descriptionCustomerOrderAddressPostalAddressType}'
    postalAddressType;

    @description: '{i18n>descriptionCustomerOrderAddressPersonPostalAddress}'
    personPostalAddress;

    @description: '{i18n>descriptionCustomerOrderAddressOrganizationPostalAddress}'
    organizationPostalAddress;
}

annotate sales.CustomerOrderCommunicationData with {
    @description: '{i18n>descriptionCustomerOrderCommunicationDataPhoneNumber}'
    phoneNumber;

    @description: '{i18n>descriptionCustomerOrderCommunicationDataFaxNumber}'
    faxNumber;

    @description: '{i18n>descriptionCustomerOrderCommunicationDataMobileNumber}'
    mobileNumber;

    @description: '{i18n>descriptionCustomerOrderCommunicationDataEmailAddress}'    
    emailAddress;
}

annotate sales.Note with {
    @description: '{i18n>descriptionNoteTextObject}'
    textObject;

    @description: '{i18n>descriptionNoteTextType}'
    textType;

    @description: '{i18n>descriptionNoteText}'
    text;

    @description: '{i18n>descriptionNoteLanguage}'
    language;

    @description: '{i18n>descriptionNoteMimeType}'
    mimeType;
}

annotate sales.CustomerOrder.items.subscriptionAspect.technicalResources with {
    @description: '{i18n>descriptionCustomerOrderItemsSubscriptionAspectTechnicalResourcesID}'
    id;

    @description: '{i18n>descriptionCustomerOrderItemsSubscriptionAspectTechnicalResourcesDisplayID}'
    resourceId;

    @description: '{i18n>descriptionCustomerOrderItemsSubscriptionAspectTechnicalResourcesName}'
    resourceName;

    @description: '{i18n>descriptionCustomerOrderItemsSubscriptionAspectTechnicalResourcesIsBlocked}'
    isBlocked;
}

annotate utilities.sales.SubscriptionParameterAspect with {
    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubscriptionAspectSubscriptionParameterAspectID}'
    id;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubscriptionAspectSubscriptionParameterAspectCode}'
    code;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubscriptionAspectSubscriptionParameterAspectValue}'
    value;

    @description: '{i18n>descriptionCustomerOrderItemsSubscriptionAspectSubscriptionParameterIsBlocked}'
    isBlocked;
}

annotate utilities.sales.CustomReferenceAspect with {
    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubscriptionAspectCustomReferenceAspectID}'
    id;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubscriptionAspectCustomReferenceAspectTypeCode}'
    typeCode;

    @description: '{i18n>descriptionCustomerOrderItemUtilitiesSubscriptionAspectCustomReferenceAspectCustomReferenceID}'
    customReferenceId;

    @description: '{i18n>descriptionCustomerOrderItemsSubscriptionAspectCustomReferenceIsBlocked}'
    isBlocked;
}
annotate BusinessPartner {
    @description: '{i18n>descriptionBusinessPartnerId}'
    id;
}

annotate BusinessPartner.addressData {
    @description: '{i18n>descriptionBusinessPartnerAddressDataId}'
    id;
}