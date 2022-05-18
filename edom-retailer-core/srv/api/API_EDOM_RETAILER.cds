using {
    sap.odm.sales as sales,
    sap.odm.common as common,
    sap.odm.finance as finance,
    sap.odm.orgunit as orgunit,
} from '../../common-model/odm';

using {
    sap.odm.businesspartner as businessPartner
} from '@sap/odm/dist/businesspartner/BusinessPartner'; 

using {
    sap.odm.product as product,
} from '@sap/odm/dist/product/Product';

using {
    sap.odm.utilities as utilities
} from '../../db/models/extensions';

@(restrict: [
    { grant: ['WRITE'], to: 'API.Write'},
    { grant: ['READ'], to: 'API.Read'},
])
entity techApiEdomRetailerCompanyCodeOrig as projection on orgunit.CompanyCode {
    id,
    displayId,
    name,
    company,
    isMainForCompany,
    country,
    language,
    currency,
    vatRegistrationId
}

service API_EDOM_RETAILER @(path: '/api/v1', requires: 'authenticated-user') { 
    @(restrict: [
        { grant: ['WRITE'], to: ['API.Write', 'emcallback'], where: 'isBlocked = false'},
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])    
    entity CustomerOrder as projection on sales.CustomerOrder {
        id,
        cancellationStatus,
        customerReferenceId,
        isExternallyPriced,
        partners, // aspect composition (CustomerOrderPartners)
        items, // aspect composition  (CustomerOrderItems)
        netAmount,
        notes, // aspect composition (CustomerOrderNotes)
        orderDate,
        orderReason,        
        paymentReferences,
        priceComponents, // aspect composition (CustomerOrderPriceComponents)
        pricingDate,
        requestedFulfillmentDate,
        salesAspect, // aspect composition (CustomerOrderSalesAspect)
        serviceAspect, // aspect composition (CustomerOrderServiceAspect)
        type,
        // SalesAreaInDocument
        distributionChannel,
        division,
        salesOrganization,  
        displayId,
        processingStatus,
        // drm
        @readonly
        isBlocked,
    } actions {
        @(restrict: [{ to: 'API.Write' }],
            Core : {
                Description: 'Closes a customer order.',
                LongDescription: 'Closes a single customer order with a specific identifier. This request will update the end of business date of the order, that is, the closed date or the date of payment. This date is considered as the reference date from which the residence and retention period is calculated for Data Retention Manager.'
            }
        )
        action close ();
    };

    @(restrict: [
        { grant: ['WRITE'], to: ['API.Write', 'emcallback'], where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])    
    entity CustomerOrderItems as projection on sales.CustomerOrder.items {
        up_,	
        id,	
        alternativeId,	
        cancellationReason,	
        configurationId,	
        customerReferenceId,	
        netAmount,	
        notes, // aspect composition (CustomerOrderItemNotes)	
        parentItemId,	
        partners, // aspect composition	
        priceComponents, // aspect composition (CustomerOrderItemPriceComponents)	
        processingStatus,	
        salesAspect, // aspect composition (CustomerOrderItemSalesAspect)	
        serviceAspect, // aspect composition (CustomerOrderItemServiceAspect)	
        type,	
        // utilities	
        utilitiesAspect, // aspect composition (CustomerOrderItemUtilitiesAspect)	
        subscriptionAspect, // aspect composition (CustomerOrderItemSubscriptionAspect)	
        // SalesDocumentItem	
        text,	
        quantity,	
        quantityUnit,	
        product,	
        // drm
        @readonly
        isBlocked
    };

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderPartners as projection on sales.CustomerOrder.partners {	
        up_,
        id,	
        address, // TODO: To be clarified with Andre/Paul. Can address be used from MDI-BP	
        businessPartner,   
        businessPartnerId,
        main,
        personAddressDetails, // TODO: To be clarified with Andre/Paul. Can address be used from MDI-BP	
        plantPartner, // TODO: To be clarified with Andre/Paul	
        role,	
        // utilities	
        contractAccountId,	
        // drm
        @readonly
        isBlocked
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderNotes as projection on sales.CustomerOrder.notes {	
        up_,	
        id,	
        textType,	
        text,	
        language,	
        // drm
        @readonly
        isBlocked
    };

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderPriceComponents as projection on sales.CustomerOrder.priceComponents {	
        up_,	
        id,	
        conditionType,	
        value,	
        currency,	
        perQuantity,	
        perQuantityUnit,	
        minorLevel,	
        majorLevel,	
        isManual,	
        isInactive,	
        isPrintRelevant,
        // drm
        @readonly
        isBlocked		
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderSalesAspect as projection on sales.CustomerOrder.salesAspect {
        up_,	
        shippingCondition,	
        paymentTerms,	
        incotermsClassification,	
        // drm
        @readonly
        isBlocked
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderServiceAspect as projection on sales.CustomerOrder.serviceAspect {	
        up_,
        serviceOrganization,	
        priority,	
        requestedServiceStartAt,	
        requestedServiceEndAt,	
        referenceObjects, // aspect composition (ServiceOrderReferenceObject)	
        // drm
        @readonly
        isBlocked	
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity ServiceOrderReferenceObject as projection on sales.CustomerOrder.serviceAspect.referenceObjects {	
        up_,
        equipment,	
        // drm
        @readonly
        isBlocked
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderItemPartners as projection on sales.CustomerOrder.items.partners {			
        up_,
        address,	
        id,	
        role,	
        // drm
        @readonly
        isBlocked
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderItemNotes as projection on sales.CustomerOrder.items.notes {	
        up_,
        id,	
        textType,	
        text,	
        language,
        // drm
        @readonly
        isBlocked	
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderItemPriceComponents as projection on sales.CustomerOrder.items.priceComponents {
        up_,
        id,	
        conditionType,	
        value,	
        currency,	
        perQuantity,	
        perQuantityUnit,	
        minorLevel,	
        majorLevel,	
        isManual,	
        isInactive,	
        isPrintRelevant,
        // drm
        @readonly
        isBlocked	
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderItemSalesAspect as projection on sales.CustomerOrder.items.salesAspect {	
        up_,
        plant,	
        shippingPoint,	
        deliveryPriority,	
        scheduleLines, // aspect composition (SalesOrderScheduleLine)	
        paymentTerms,	
        // drm
        @readonly
        isBlocked
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])	
    entity SalesOrderScheduleLine as projection on sales.CustomerOrder.items.salesAspect.scheduleLines {
        up_,		
        id,	
        quantity,	
        deliveryDate,	
        // drm
        @readonly
        isBlocked
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderItemServiceAspect as projection on sales.CustomerOrder.items.serviceAspect {	
        up_,
        plannedServiceStartAt,	
        plannedServiceEndAt,	
        referenceObjects, // aspect composition (ServiceOrderItemReferenceObject)	
        // drm
        @readonly
        isBlocked
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity ServiceOrderItemReferenceObject as projection on sales.CustomerOrder.items.serviceAspect.referenceObjects {
        up_,	
        equipment,
        // drm
        @readonly
        isBlocked
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])	
    entity CustomerOrderItemUtilitiesAspect as projection on sales.CustomerOrder.items.utilitiesAspect {
        up_,
        formerServiceProvider,	
        referenceObject, // aspect composition	
        /**	
         * Subsequent documents	
         */  	
        subsequentDocument, // aspect composition (subsequentDocument)	
        distributionChannel,	
        division,	
        salesOrganization,	
        /*
         *
         */
        @(sap.c4u.feature: 'UTILITIESCLOUDSOLUTION-2925')
        podId,
        @(sap.c4u.feature: 'UTILITIESCLOUDSOLUTION-2925')
        supplyAddress,
        @(sap.c4u.feature: 'UTILITIESCLOUDSOLUTION-2925')
        gridPricing,
        @(sap.c4u.feature: 'UTILITIESCLOUDSOLUTION-2925')
        deviceTypePricing,
        @(sap.c4u.feature: 'UTILITIESCLOUDSOLUTION-2925')
        geographicalCode,
        @(sap.c4u.feature: 'UTILITIESCLOUDSOLUTION-2925')
        budgetBillingType,
        @(sap.c4u.feature: 'UTILITIESCLOUDSOLUTION-2925')
        referenceBillDate,

        // drm
        @readonly
        isBlocked
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderItemUtilitiesReferenceObject as projection on sales.CustomerOrder.items.utilitiesAspect.referenceObject {	
        up_,
        meter,	
        installation,	
        // drm
        @readonly
        isBlocked
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderItemUtilitiesSubsequentDocument as projection on sales.CustomerOrder.items.utilitiesAspect.subsequentDocument {		
        up_,
        id,	
        displayId,	
        type,	
        // drm
        @readonly
        isBlocked
    };	

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity CustomerOrderItemSubscriptionAspect as projection on sales.CustomerOrder.items.subscriptionAspect {	
        up_,
        contractTerm,	
        subscriptionReference,	
        validFrom,	
        validTo,
        technicalResources,
        headerCustomReferences,
        itemCustomReferences,
        itemSubscriptionParameters,
        // drm
        @readonly
        isBlocked
    };

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity BusinessPartner as projection on businessPartner.BusinessPartner {
        id
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ], sap.c4u.feature: 'UTILITIESCLOUDSOLUTION-2925')	
    entity BusinessPartnerAddressData as projection on businessPartner.BusinessPartner.addressData
    {
        up_,
        id
    };

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity SubscriptionTechnicalResourceAspect as projection on sales.CustomerOrder.items.subscriptionAspect.technicalResources {
        up_,
        id,
        resourceId,
        resourceName,
        // drm
        @readonly
        isBlocked
    }
    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity SubscriptionHeaderCustomReferences as projection on sales.CustomerOrder.items.subscriptionAspect.headerCustomReferences {
        up_,
        id,
        typeCode,
        customReferenceId,
        // drm
        @readonly
        isBlocked
    }
    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity SubscriptionItemCustomReferences as projection on sales.CustomerOrder.items.subscriptionAspect.itemCustomReferences {
        up_,
        id,
        typeCode,
        customReferenceId,
        // drm
        @readonly
        isBlocked
    }
    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
    ])
    entity SubscriptionItemSubscriptionParameters as projection on sales.CustomerOrder.items.subscriptionAspect.itemSubscriptionParameters {
        up_,
        id,
        code,
        value,
        // drm
        @readonly
        isBlocked
    }

    /*
     * Entities
     */
    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity SalesOrganization as projection on sales.orgunit.SalesOrganization {
        id,
        displayId,
        name,
        companyCode,
        currency
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity ServiceOrganization as projection on sales.service.ServiceOrganization {
        id,
        serviceOrganization,
        serviceTeam
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity CompanyCode as projection on techApiEdomRetailerCompanyCodeOrig {
        id,
        displayId,
        name.name as name,
        company,
        isMainForCompany,
        country,
        language,
        currency,
        vatRegistrationId
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity Product as projection on product.Product {
        id,
        displayId,
        name,
        description,
        type,
        salesAspect,
        texts
        // other attributes has been excluded
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity ProductSalesAspect as projection on product.Product.salesAspect {
        up_,
        division
    }

    /*
     * Type codes
     */
    
    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity CustomerOrderTypeCodes as projection on sales.CustomerOrderTypeCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity CustomerOrderReasonCodes as projection on sales.CustomerOrderReasonCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity CustomerOrderItemTypeCodes as projection on sales.CustomerOrderItemTypeCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ], sap.c4u.feature: 'UTILITIESCLOUDSOLUTION-2925')
    entity CustomerOrderItemUtilitiesBudgetBillingTypeCodes as projection on utilities.sales.CustomerOrderItemUtilitiesBudgetBillingTypeCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ], sap.c4u.feature: 'UTILITIESCLOUDSOLUTION-2925')
    entity CustomerOrderItemUtilitiesDeviceTypeCodes as projection on utilities.sales.CustomerOrderItemUtilitiesDeviceTypeCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity CustomerOrderItemUtilitiesSubsequentDocumentCodes as projection on utilities.sales.CustomerOrderItemUtilitiesSubsequentDocumentCodes {
        code,
        name,
        descr,
        urlPattern
    };

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity SalesCancellationStatusCodes as projection on sales.SalesCancellationStatusCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity SalesCancellationReasonCodes as projection on sales.SalesCancellationReasonCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity SalesProcessingStatusCodes as projection on sales.SalesProcessingStatusCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity SalesPartnerRoleCodes as projection on sales.SalesPartnerRoleCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity SalesTextTypeCodes as projection on sales.SalesTextTypeCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity DistributionChannelCodes as projection on sales.orgunit.DistributionChannelCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity ConditionTypeCodes as projection on sales.pricing.ConditionTypeCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity DivisionCodes as projection on sales.orgunit.DivisionCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity ServiceOrderPriorityCodes as projection on sales.service.ServiceOrderPriorityCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity ShippingConditionCodes as projection on sales.shipping.ShippingConditionCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity DeliveryPriorityCodes as projection on sales.shipping.DeliveryPriorityCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity UnitOfMeasuresCodes as projection on common.UnitOfMeasureCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity CurrencyCodes as projection on common.CurrencyCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity PaymentTermCodes as projection on finance.accounting.PaymentTermsCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity PaymentCardTypeCodes as projection on finance.payment.PaymentCardTypeCodes;

    @(restrict: [
        { grant: ['READ','WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity LanguageCodes as projection on common.LanguageCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity CountryCodes as projection on common.CountryCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity IncotermsClassificationCodes as projection on common.IncotermsClassificationCodes;

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity ProductTypeCodes as projection on product.ProductTypeCodes;
    
    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write'},
        { grant: ['READ'], to: 'API.Read'},
    ])
    entity ProductTypeGroupCodes as projection on product.ProductTypeGroupCodes;

}