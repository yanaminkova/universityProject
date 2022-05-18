using {
    sap.odm.sales as sales,
    sap.odm.common as common,
    sap.odm.product as product
} from '../../../../common-model/odm';

using {
    sap.odm.utilities as utilities
} from '../../../../db/models/extensions';

/*
 * Do not set a version as this is only served within ui-services
 */
service CustomerOrderUIService @(path: '/api/v1/ui', requires: 'authenticated-user') {
    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse', where: 'isBlocked = false' }
    ])   
    @Capabilities : { 
        DeleteRestrictions : { Deletable : false },
        SearchRestrictions : { Searchable: false },

        FilterRestrictions : {FilterExpressionRestrictions : [
            {
                Property : 'orderDate',
                AllowedExpressions : 'SingleValue'
            }
        ]},
    }
    entity CustomerOrder as projection on sales.CustomerOrder {
        id @( UI: { Hidden : true }),
        items, // aspect composition  (CustomerOrderItems)
        netAmount,
        orderDate,
        distributionChannel,
        division,
        salesOrganization,  
        displayId,
        processingStatus,
        cancellationStatus,
        // drm
        @readonly
        isBlocked @( UI: { Hidden : true })
    }

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse', where: 'isBlocked = false' }
    ])            
    @Capabilities : { 
        DeleteRestrictions : { Deletable : false }
    } 
    entity CustomerOrderItems as projection on sales.CustomerOrder.items {
        up_ @( UI: { Hidden : true }),	
        id,
        alternativeId,	
        product,
        quantity,
        quantityUnit,
        netAmount,
        type,
        processingStatus,			
        cancellationReason,	
        utilitiesAspect,    // aspect composition (CustomerOrderItemUtilitiesAspect)
        notes, // aspect composition (CustomerOrderItemNotes)		
        // drm
        @readonly
        isBlocked @( UI: { Hidden : true })
    };

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse', where: 'isBlocked = false' }
    ])  
    @Capabilities : { 
        DeleteRestrictions : { Deletable : false }
    } 
    entity CustomerOrderItemNotes as projection on sales.CustomerOrder.items.notes {	
        up_ @( UI: { Hidden : true }),
        id,
        textType,	
        text,
        // drm
        @readonly
        isBlocked @( UI: { Hidden : true })		
    };	

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse', where: 'isBlocked = false' }
    ]) 
    entity CustomerOrderItemUtilitiesAspect as projection on sales.CustomerOrder.items.utilitiesAspect {
        up_ @( UI: { Hidden : true }),
        formerServiceProvider,	
        referenceObject, // aspect composition	
        /**	
         * Subsequent documents	
         */  	
        subsequentDocument, // aspect composition (subsequentDocument)	
        // drm
        @readonly
        isBlocked @( UI: { Hidden : true })
    };	

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ])  
     entity Product as projection on product.Product {
        id,
        displayId,
        name
    }

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ]) 
    entity CustomerOrderTypeCodes as projection on sales.CustomerOrderTypeCodes {
        code,
        name,
        descr
    }

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ]) 
    entity CustomerOrderItemTypeCodes as projection on sales.CustomerOrderItemTypeCodes {
        code,
        name,
        descr
    }

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ])
    entity SalesProcessingStatusCodes as projection on sales.SalesProcessingStatusCodes {
        code,
        name,
        descr
    };

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ]) 
    entity SalesOrganization as projection on sales.orgunit.SalesOrganization {
        id,
        displayId,
        name
    }
    
    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ]) 
    entity DivisionCodes as projection on sales.orgunit.DivisionCodes {
        code,
        name,
        descr
    };

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ]) 
    entity DistributionChannelCodes as projection on sales.orgunit.DistributionChannelCodes {
        code,
        name,
        descr
    };

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ]) 
    entity SalesCancellationReasonCodes as projection on sales.SalesCancellationReasonCodes {
        code,
        name,
        descr
    };

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ])
    entity UnitOfMeasureCodes as projection on common.UnitOfMeasureCodes {
        code,
        name,
        descr
    };

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ])
    entity SalesCancellationStatusCodes as projection on sales.SalesCancellationStatusCodes {
        code,
        name,
        descr   
    };

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ])
    entity SalesTextTypeCodes as projection on sales.SalesTextTypeCodes {
        code,
        name,
        descr
    };

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ])
    entity CustomerOrderItemUtilitiesSubsequentDocument as projection on sales.CustomerOrder.items.utilitiesAspect.subsequentDocument {		
        up_ @( UI: { Hidden : true }),
        id,	
        displayId,	
        type,	
        // drm
        @readonly
        isBlocked @( UI: { Hidden : true })
    };

    @(restrict: [
        { grant: ['READ'], to: 'UI.Browse' }
    ])
    entity CustomerOrderItemUtilitiesSubsequentDocumentCodes as projection on utilities.sales.CustomerOrderItemUtilitiesSubsequentDocumentCodes {
        code,
        name,
        descr,
        @cds.api.ignore
        urlPattern,
        null as url: String(2048)
    };
}