namespace sap.odm.utilities.sales;

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
    sap.odm.sales.CustomerOrderPartnerInternalRef,
    sap.odm.sales.CustomerOrderSalesAspect,
    sap.odm.sales.service.CustomerOrderServiceAspect,
    sap.odm.sales.service.ServiceOrderReferenceObject
} from '../../../../common-model/odm/sales';

using {
    sap.odm.utilities.sales.CustomerOrderItemUtilitiesAspect,
    sap.odm.utilities.sales.CustomerOrderItemUtilitiesReferenceObjectAspect,
    sap.odm.utilities.sales.CustomerOrderItemUtilitiesSubsequentDocumentAspect,
    sap.odm.utilities.sales.CustomerOrderItemUtilitiesSubscriptionAspect,
    sap.odm.utilities.sales.SubscriptionTechnicalResourceAspect,
    sap.odm.utilities.sales.CustomReferenceAspect,
    sap.odm.utilities.sales.SubscriptionParameterAspect
} from '..';

using {sap.odm.common.address.ScriptedPersonAddress} from '../../../../common-model/odm/common';
using {sap.c4u.foundation.retailer.dpp.DataRetentionManagerAspect} from '../../dpp';

/* --------------------------------------------------------------- */
/* Extensions                                                      */
/* --------------------------------------------------------------- */

extend CustomerOrder with DataRetentionManagerAspect;
extend CustomerOrderItem with DataRetentionManagerAspect;
extend CustomerOrderNote with DataRetentionManagerAspect;
extend CustomerOrderPriceComponent with DataRetentionManagerAspect;
extend CustomerOrderItemSalesAspect with DataRetentionManagerAspect;
extend SalesOrderScheduleLine with DataRetentionManagerAspect;
extend CustomerOrderItemServiceAspect with DataRetentionManagerAspect;
extend ServiceOrderItemReferenceObject with DataRetentionManagerAspect;
extend CustomerOrderPartner with DataRetentionManagerAspect;
extend SalesDocumentAddress with DataRetentionManagerAspect;
extend CustomerOrderPartnerInternalRef with DataRetentionManagerAspect;
extend CustomerOrderSalesAspect with DataRetentionManagerAspect;
extend CustomerOrderServiceAspect with DataRetentionManagerAspect;
extend ServiceOrderReferenceObject with DataRetentionManagerAspect;
extend CustomerOrderItemUtilitiesAspect with DataRetentionManagerAspect;
extend CustomerOrderItemUtilitiesReferenceObjectAspect with DataRetentionManagerAspect;
extend CustomerOrderItemUtilitiesSubsequentDocumentAspect with DataRetentionManagerAspect;
extend CustomerOrderItemUtilitiesSubscriptionAspect with DataRetentionManagerAspect;
extend SubscriptionTechnicalResourceAspect with DataRetentionManagerAspect;
extend ScriptedPersonAddress with DataRetentionManagerAspect;
extend CustomReferenceAspect with DataRetentionManagerAspect;
extend SubscriptionParameterAspect with DataRetentionManagerAspect;

/* --------------------------------------------------------------- */
/* Views                                                           */
/* --------------------------------------------------------------- */

/**
 * View to extend CustomerOrder with businessPartnerId required
 * by the DataRetentionManagerService
 */
view CustomerOrderUtilitiesDRM as
    select from CustomerOrder {
        id,
        cancellationStatus,
        customerReferenceId,
        isExternallyPriced,
        items,
        netAmount,
        notes, 
        orderDate,
        orderReason,
        partners, 
        paymentReferences,
        priceComponents, 
        pricingDate,
        requestedFulfillmentDate,
        salesAspect, 
        serviceAspect,
        type,
        distributionChannel,
        division,
        salesOrganization,  
        displayId,
        processingStatus,
        endOfBusinessDate,
        maxDeletionDate,
        isBlocked,
        /**
        * An identifier that helps manage data protection and privacy policies 
        * and identify data subjects that can be blocked or removed from the system.
        */
        partners.businessPartnerId as dataSubjectId,
        partners.businessPartner.id as dataSubjectUUID
    };
