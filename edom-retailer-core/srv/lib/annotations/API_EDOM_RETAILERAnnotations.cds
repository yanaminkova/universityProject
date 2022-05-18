using {
  API_EDOM_RETAILER.CustomerOrder,
  API_EDOM_RETAILER.Product,
  API_EDOM_RETAILER.ProductTypeCodes,
  API_EDOM_RETAILER.ProductTypeGroupCodes,
  API_EDOM_RETAILER.SalesOrganization,
  API_EDOM_RETAILER.ServiceOrganization,
  API_EDOM_RETAILER.CompanyCode,
  API_EDOM_RETAILER.CustomerOrderTypeCodes,
  API_EDOM_RETAILER.CustomerOrderReasonCodes,
  API_EDOM_RETAILER.CustomerOrderItemTypeCodes,
  API_EDOM_RETAILER.CustomerOrderItemUtilitiesBudgetBillingTypeCodes,
  API_EDOM_RETAILER.CustomerOrderItemUtilitiesDeviceTypeCodes,
  API_EDOM_RETAILER.CustomerOrderItemUtilitiesSubsequentDocumentCodes,
  API_EDOM_RETAILER.SalesCancellationStatusCodes,
  API_EDOM_RETAILER.SalesCancellationReasonCodes,
  API_EDOM_RETAILER.SalesProcessingStatusCodes,
  API_EDOM_RETAILER.SalesPartnerRoleCodes,
  API_EDOM_RETAILER.SalesTextTypeCodes,
  API_EDOM_RETAILER.DistributionChannelCodes,
  API_EDOM_RETAILER.ConditionTypeCodes,
  API_EDOM_RETAILER.DivisionCodes,
  API_EDOM_RETAILER.ServiceOrderPriorityCodes,
  API_EDOM_RETAILER.ShippingConditionCodes,
  API_EDOM_RETAILER.DeliveryPriorityCodes,
  API_EDOM_RETAILER.UnitOfMeasuresCodes,
  API_EDOM_RETAILER.CurrencyCodes,
  API_EDOM_RETAILER.PaymentTermCodes,
  API_EDOM_RETAILER.PaymentCardTypeCodes,
  API_EDOM_RETAILER.LanguageCodes,
  API_EDOM_RETAILER.CountryCodes,
  API_EDOM_RETAILER.IncotermsClassificationCodes  
} from './../../api/API_EDOM_RETAILER';

annotate CustomerOrder with @Capabilities: {
    ReadRestrictions : {    
        Description: 'Retrieves customer orders.', 
        LongDescription: 'Retrieves a list of all customer orders.',     
        ReadByKeyRestrictions: {  
            Description: 'Retrieves a customer order.', 
            LongDescription: 'Retrieves a single customer order with a specific identifier.'           
        }
    },
    InsertRestrictions: { 
        Description: 'Creates a customer order.', 
        LongDescription: 'Creates a customer order. If you don’t provide a value for the processing status attribute, a configured initial status value will be assigned.'              
    },
    UpdateRestrictions : {    
        Description: 'Updates a customer order.', 
        LongDescription: 'Updates a single customer order with a specific identifier.' 
    },
    DeleteRestrictions: {
        Deletable : false
    },
    NavigationRestrictions: {
        RestrictedProperties : [
        {
            NavigationProperty : type,
            ReadRestrictions : {       
                Description: 'Retrieves type of a customer order.', 
                LongDescription: 'Retrieves type of a single customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : distributionChannel,
            ReadRestrictions : {       
                Description: 'Retrieves distribution channel of a customer order.', 
                LongDescription: 'Retrieves distribution channel of a single customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : division,
            ReadRestrictions : {       
                Description: 'Retrieves division of a customer order.', 
                LongDescription: 'Retrieves division of a single customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : salesOrganization,
            ReadRestrictions : {       
                Description: 'Retrieves sales organization of a customer order.', 
                LongDescription: 'Retrieves sales organization of a single customer order with a specific identifier.'          
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : processingStatus,
            ReadRestrictions : {       
                Description: 'Retrieves processing status of a customer order.', 
                LongDescription: 'Retrieves processing status of a single customer order with a specific identifier.'           
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : cancellationStatus,
            ReadRestrictions : {     
                Description: 'Retrieves cancellation status of a customer order.', 
                LongDescription: 'Retrieves cancellation status of a single customer order with a specific identifier.'            
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items,
            ReadRestrictions : {                
                Description: 'Retrieves customer order items.', 
                LongDescription: 'Retrieves a list of all items for a customer order with a specific identifier.', 
                ReadByKeyRestrictions: {                    
                    Description: 'Retrieves a customer order item.', 
                    LongDescription: 'Retrieves a single customer order item with a specific identifier.' 
                }
            },
            InsertRestrictions: {
                Description: 'Creates a customer order item.', 
                LongDescription: 'Creates an item for a customer order with a specific identifier. If you don’t provide a value for the processing status attribute, a configured initial status value will be assigned. The value of the customer order item’s processing status impacts the header order’s processing status.'                    
            },
            UpdateRestrictions : {
                Description: 'Updates a customer order item.', 
                LongDescription: 'Updates a single customer order item with a specific identifier. If you don’t provide a value for the processing status attribute, a configured initial status value will be assigned. Changing the value of customer order item’s processing status impacts the header order’s processing status.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.type,
            ReadRestrictions : {  
                Description: 'Retrieves type of a customer order item.', 
                LongDescription: 'Retrieves type of a single customer order item with a specific identifier.'               
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.cancellationReason,
            ReadRestrictions : {    
                Description: 'Retrieves cancellation reason of a customer order item.',
                LongDescription: 'Retrieves cancellation reason of a single customer order item with a specific identifier.'             
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.quantityUnit,
            ReadRestrictions : {    
                Description: 'Retrieves quantity unit of a customer order item.', 
                LongDescription: 'Retrieves quantity unit of a single customer order item with a specific identifier.'             
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.up_,
            ReadRestrictions : {
                Readable : false
            },
            UpdateRestrictions : {
                Updatable : false
            }
        },{
            NavigationProperty : items.notes,
            ReadRestrictions : {    
                Description: 'Retrieves customer order item notes.', 
                LongDescription: 'Retrieves a list of all notes for a single customer order item with a specific identifier.' ,    
                ReadByKeyRestrictions: {   
                    Description: 'Retrieves a customer order item note.', 
                    LongDescription: 'Retrieves a single customer order item note with a specific identifier.'          
                }
            },
            InsertRestrictions: {    
                Description: 'Creates a customer order item note.',
                LongDescription: 'Creates a note for a single customer order item with a specific identifier.'   
            },
            UpdateRestrictions : {  
                Description: 'Updates a customer order item note.',
                LongDescription: 'Updates a single customer order item note with a specific identifier.'   
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.notes.textType,
            ReadRestrictions : {  
                Description: 'Retrieves text type of a customer order item note.',
                LongDescription: 'Retrieves text type of a single customer order item note with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.notes.language,
            ReadRestrictions : {   
                Description: 'Retrieves language of a customer order item note.', 
                LongDescription: 'Retrieves language of a single customer order item note with a specific identifier.'     
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.notes.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.partners,
            ReadRestrictions : {     
                Description: 'Retrieves customer order item partners.', 
                LongDescription: 'Retrieves a list of all partners for a single customer order item with a specific identifier.',    
                ReadByKeyRestrictions: {   
                    Description: 'Retrieves a customer order item partner.', 
                    LongDescription: 'Retrieves a single customer order item partner with a specific identifier.'          
                }
            },
            InsertRestrictions: {   
                Description: 'Creates a customer order item partner.', 
                LongDescription: 'Creates a partner for a single customer order item with a specific identifier.'    
            },
            UpdateRestrictions : {   
                Description: 'Updates a single customer order item partner.', 
                LongDescription: 'Updates a single customer order item partner with a specific identifier.'  
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.street.ref,
            ReadRestrictions : {   
                Description: 'Retrieves street of customer order item partner.', 
                LongDescription: 'Retrieves the street of a single customer order item partner with a specific identifier.'     
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.primaryRegion,
            ReadRestrictions : {  
                Description: 'Retrieves primary region of customer order item partner.', 
                LongDescription: 'Retrieves primary region of a single customer order item partner with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.secondaryRegion.ref,
            ReadRestrictions : {  
                Description: 'Retrieves secondary region of customer order item partner.', 
                LongDescription: 'Retrieves secondary region of a single customer order item partner with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.tertiaryRegion.ref,
            ReadRestrictions : {   
                Description: 'Retrieves tertiary region of customer order item partner.',
                LongDescription: 'Retrieves tertiary region of a single customer order item partner with a specific identifier.'     
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.town.ref,
            ReadRestrictions : {  
                Description: 'Retrieves town of customer order item partner.', 
                LongDescription: 'Retrieves town of a single customer order item partner with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.district.ref,
            ReadRestrictions : {  
                Description: 'Retrieves district of customer order item partner.',
                LongDescription: 'Retrieves district of a single customer order item partner with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.country,
            ReadRestrictions : {   
                Description: 'Retrieves country/region of customer order item partner.', 
                LongDescription: 'Retrieves country/region of a single customer order item partner with a specific identifier.'     
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.alternative.country,
            ReadRestrictions : {  
                Description: 'Retrieves alternative country/region of customer order item partner.', 
                LongDescription: 'Retrieves alternative country/region of a single customer order item partner with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.alternative.primaryRegion,
            ReadRestrictions : {   
                Description: 'Retrieves alternative primary region of customer order item partner.', 
                LongDescription: 'Retrieves alternative primary region of a single customer order item partner with a specific identifier.'     
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.alternative.secondaryRegion.ref,
            ReadRestrictions : { 
                Description: 'Retrieves alternative secondary region of customer order item partner.', 
                LongDescription: 'Retrieves alternative secondary region of a single customer order item partner with a specific identifier.'       
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.alternative.tertiaryRegion.ref,
            ReadRestrictions : {  
                Description: 'Retrieves alternative tertiary region of customer order item partner.', 
                LongDescription: 'Retrieves alternative tertiary region of a single customer order item partner with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.alternative.town.ref,
            ReadRestrictions : {      
                Description: 'Retrieves alternative town of customer order item partner.', 
                LongDescription: 'Retrieves alternative town of a single customer order item partner with a specific identifier.'  
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.alternative.district.ref,
            ReadRestrictions : {  
                Description: 'Retrieves alternative district of customer order item partner.', 
                LongDescription: 'Retrieves alternative district of a single customer order item partner with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.alternative.deliveryType,
            ReadRestrictions : {  
                Description: 'Retrieves alternative delivery type for customer order item partner.', 
                LongDescription: 'Retrieves alternative delivery type for a single customer order item partner with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.address.timeZone,
            ReadRestrictions : {   
                Description: 'Retrieves time zone of customer order item partner.', 
                LongDescription: 'Retrieves time zone of a single customer order item partner with a specific identifier.'     
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.role,
            ReadRestrictions : {
                Description: 'Retrieves role of customer order item partner.', 
                LongDescription: 'Retrieves role of a single customer order item partner with a specific identifier.'        
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.partners.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.priceComponents,
            ReadRestrictions : {        
                Description: 'Retrieves customer order item price components.', 
                LongDescription: 'Retrieves a list of all price components for a single customer order item with a specific identifier.', 
                ReadByKeyRestrictions: {   
                    Description: 'Retrieves a customer order item price component.', 
                    LongDescription: 'Retrieves a single customer order item price component with a specific identifier.'          
                }
            },
            InsertRestrictions: {   
                Description: 'Creates a customer order item price component.', 
                LongDescription: 'Creates a price component for a single customer order item with a specific identifier.'   
            },
            UpdateRestrictions : { 
                Description: 'Updates a customer order item price component.', 
                LongDescription: 'Updates a single customer order item price component with a specific identifier.'    
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.priceComponents.conditionType,
            ReadRestrictions : {   
                Description: 'Retrieves condition type of a customer order item price component.', 
                LongDescription: 'Retrieves condition type of a single customer order item price component with a specific identifier.'       
            },            
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.priceComponents.currency,
            ReadRestrictions : {  
                Description: 'Retrieves currency of a customer order item price component.', 
                LongDescription: 'Retrieves currency of a single customer order item price component with a specific identifier.'        
            },            
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.priceComponents.perQuantityUnit,
            ReadRestrictions : {  
                Description: 'Retrieves quantity unit of a customer order item price component.', 
                LongDescription: 'Retrieves quantity unit of a single customer order item price component with a specific identifier.'        
            },            
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.priceComponents.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.processingStatus,
            ReadRestrictions : {    
                Description: 'Retrieves processing status of a customer order item.', 
                LongDescription: 'Retrieves processing status of a single customer order item with a specific identifier.'      
            },            
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.salesAspect,
            ReadRestrictions : {
                Description: 'Retrieves customer order item sales aspect.',     
                LongDescription: 'Retrieves sales aspect of a single customer order item with a specific identifier.' 
            },
            UpdateRestrictions: {
                Description: 'Updates customer order item sales aspect.',
                LongDescription: 'Updates sales aspect of a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.salesAspect.deliveryPriority,
            ReadRestrictions : {
                Description: 'Retrieves delivery priority of a customer order item.', 
                LongDescription: 'Retrieves delivery priority of a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.salesAspect.paymentTerms,
            ReadRestrictions : {
                Description: 'Retrieves payment terms of a customer order item.', 
                LongDescription: 'Retrieves payment terms of a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.salesAspect.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.salesAspect.scheduleLines,
            ReadRestrictions : {
                Description: 'Retrieves customer order item schedule lines.',
                LongDescription: 'Retrieves a list of all schedule lines for a single customer order item with a specific identifier.', 
                ReadByKeyRestrictions : {
                    Description: 'Retrieves a customer order item schedule line.', 
                    LongDescription: 'Retrieves a single customer order item schedule line with a specific identifier.' 
                }
            },
            InsertRestrictions : {
                Description: 'Creates a customer order item schedule line.', 
                LongDescription: 'Creates a schedule line for a single customer order item with a specific identifier.' 
            },
            UpdateRestrictions : {
                Description: 'Updates a customer order item schedule line.', 
                LongDescription: 'Updates a single customer order item schedule line with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.salesAspect.scheduleLines.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.serviceAspect,
            ReadRestrictions : {
                Description: 'Retrieves customer order item service aspect.', 
                LongDescription: 'Retrieves service aspect of a single customer order item with a specific identifier.' 
            },
            UpdateRestrictions : {
                Description: 'Updates customer order item service aspect.', 
                LongDescription: 'Updates service aspect of a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.serviceAspect.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.serviceAspect.referenceObjects,
            ReadRestrictions : {
                Description: 'Retrieves customer order item service reference objects.',
                LongDescription: 'Retrieves a list of all service reference objects for a single customer order item with a specific identifier.',
                ReadByKeyRestrictions : {
                    Description: 'Retrieves a customer order item service reference object.', 
                    LongDescription: 'Retrieves a single customer order item service reference object with a specific equipment identifier.' 
                } 
            },
            InsertRestrictions : {
                Description: 'Creates a customer order item service reference object.', 
                LongDescription: 'Creates a service reference object for a single customer order item with a specific identifier.' 
            },
            UpdateRestrictions : {
                Description: 'Updates a customer order item service reference object.', 
                LongDescription: 'Updates a single customer order item service reference object with a specific equipment identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.serviceAspect.referenceObjects.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.utilitiesAspect,
            ReadRestrictions : {
                Description: 'Retrieves customer order item utilities aspect.', 
                LongDescription: 'Retrieves utilities aspect of a single customer order item with a specific identifier.' 
            },
            UpdateRestrictions : {
                Description: 'Updates customer order item utilities aspect.', 
                LongDescription: 'Updates utilities aspect of a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.utilitiesAspect.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.utilitiesAspect.referenceObject,
            ReadRestrictions: {
                Description: 'Retrieves customer order item utilities reference object.', 
                LongDescription: 'Retrieves utilities reference object of a single customer order item with a specific identifier.' 
            },
            UpdateRestrictions : {
                Description: 'Updates customer order item utilities reference object.', 
                LongDescription: 'Updates utilities reference object of a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.utilitiesAspect.referenceObject.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.utilitiesAspect.distributionChannel,
            ReadRestrictions : {
                Description: 'Retrieves distribution channel of a customer order item.', 
                LongDescription: 'Retrieves distribution channel of a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.utilitiesAspect.division,
            ReadRestrictions : {
                Description: 'Retrieves division of a customer order item.', 
                LongDescription: 'Retrieves division of a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.utilitiesAspect.salesOrganization,
            ReadRestrictions : {
                Description: 'Retrieves sales organization of a customer order item.', 
                LongDescription: 'Retrieves sales organization of a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.utilitiesAspect.subsequentDocument,
            ReadRestrictions : {
                Description: 'Retrieves subsequent document of a customer order item.', 
                LongDescription: 'Retrieves subsequent document of a single customer order item with a specific identifier. This entity stores the document number from the fulfillment system after order distribution.' 
            },
            UpdateRestrictions : {
                Description: 'Updates subsequent document of a customer order item.', 
                LongDescription: 'Updates subsequent document of a single customer order item with a specific identifier. This entity stores the document number from the fulfillment system after order distribution. It also stores the subsequent document type. The subsequent document can be a subscription or a sales and distribution order.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.utilitiesAspect.subsequentDocument.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.utilitiesAspect.subsequentDocument.type,
            ReadRestrictions: {
                Description: 'Retrieves type of subsequent document for a customer order item.', 
                LongDescription: 'Retrieves type of subsequent document for a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.subscriptionAspect,
            ReadRestrictions : {
                Description: 'Retrieves customer order item subscription aspect.',
                LongDescription: 'Retrieves subscription aspect of a single customer order item with a specific identifier.' 
            },
            UpdateRestrictions : {
                Description: 'Updates customer order item subscription aspect.', 
                LongDescription: 'Updates subscription aspect of a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.subscriptionAspect.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.subscriptionAspect.contractTerm.periodUnit,
            ReadRestrictions : {
                Description: 'Retrieves period unit of contract term for a customer order item.', 
                LongDescription: 'Retrieves period unit of contract term for a single customer order item with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.subscriptionAspect.technicalResources,
            ReadRestrictions: {
                Description: 'Retrieves the technical resources of the customer order item.',
                LongDescription: 'Retrieves a list of all technical resources for a single customer order item with a specific identifier. The technical resource identifies the subscribed service. Technical resources are needed when you bill your customers based on the usage of your service.',
                ReadByKeyRestrictions : {
                    Description: 'Retrieves a technical resource of a customer order item.',
                    LongDescription: 'Retrieves a technical resource of a single customer order item with a specific identifier. The technical resource identifies the subscribed service. Technical resources are needed when you bill your customers based on the usage of your service.'
                }
            },
            InsertRestrictions : {
                Description: 'Creates a technical resource for the customer order item.',
                LongDescription: 'Creates a technical resource for a single customer order item with a specific identifier. The technical resource identifies the subscribed service. Technical resources are needed when you bill your customers based on the usage of your service.'
            },
            UpdateRestrictions : {
                Description: 'Updates a technical resource of a customer order item.',
                LongDescription: 'Updates a technical resource of a single customer order item with a specific identifier The technical resource identifies the subscribed service. Technical resources are needed when you bill your customers based on the usage of your service.'
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.subscriptionAspect.technicalResources.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.subscriptionAspect.headerCustomReferences,
            ReadRestrictions: {
                Description: 'Retrieves the custom references on header level for the customer order item.',
                LongDescription: 'Retrieves a list of all custom references on header level for a single customer order item with a specific identifier. You can use the custom reference to define a commodity item. Custom references can be, for example, pricing parameters in a commodity subscription. The custom references are mapped to a subscription in SAP Subscription Billing',
                ReadByKeyRestrictions : {
                    Description: 'Retrieves a custom reference on header level for a single customer order item.',
                    LongDescription: 'Retrieves a custom reference on header level for a single customer order item with a specific identifier. You can use the custom reference to define a commodity item. Custom references can be, for example, pricing parameters in a commodity subscription. The custom references are mapped to a subscription in SAP Subscription Billing.'
                }
            },
            InsertRestrictions : {
                Description: 'Creates a custom reference on header level for the customer order item.',
                LongDescription: '"Creates a custom reference on header level for a single customer order item with a specific identifier. You can use the custom reference to define a commodity item. Custom references can be, for example, pricing parameters in a commodity subscription. The custom references are mapped to a subscription in SAP Subscription Billing.'
            },
            UpdateRestrictions : {
                Updatable : false
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.subscriptionAspect.headerCustomReferences.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.subscriptionAspect.itemCustomReferences,
            ReadRestrictions: {
                Description: 'Retrieves the custom references on item level for the customer order item.',
                LongDescription: 'Retrieves a list of all custom references on item level for a single customer order item with a specific identifier. You can use the custom reference to define a commodity item. Custom references can be, for example, pricing parameters in a commodity subscription. The custom references are mapped to a subscription in SAP Subscription Billing.',
                ReadByKeyRestrictions : {
                    Description: 'Retrieves a custom reference for a single customer order item.',
                    LongDescription: 'Retrieves a custom reference for a single customer order item with a specific identifier Custom references can be, for example, pricing parameters in a commodity subscription. The custom references are mapped to a subscription in SAP Subscription Billing.'
                }
            },
            InsertRestrictions : {
                Description: 'Creates a custom reference for the customer order item.',
                LongDescription: 'Creates a custom reference for a single customer order item with a specific identifier. You can use the custom reference to define a commodity item. Custom references can be, for example, pricing parameters in a commodity subscription. The custom references are mapped to a subscription in SAP Subscription Billing.'
            },
            UpdateRestrictions : {
                Updatable : false
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.subscriptionAspect.itemCustomReferences.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.subscriptionAspect.itemSubscriptionParameters,
            ReadRestrictions: {
                Description: 'Retrieves the subscription parameters on item level for the customer order item.',
                LongDescription: 'Retrieves a list of all subscription parameters on item level for a single customer order item with a specific identifier. You can use the subscription parameters to define a commodity item. Subscription parameters are mapped to a subscription in SAP Subscription Billing.',
                ReadByKeyRestrictions : {
                    Description: 'Retrieves a subscription parameter for a single customer order item.',
                    LongDescription: 'Retrieves a subscription parameter for a single customer order item with a specific identifier. You can use the subscription parameters to define a commodity item. Subscription parameters are mapped to a subscription in SAP Subscription Billing.'
                }
            },
            InsertRestrictions : {
                Description: 'Creates a subscription parameter for the customer order item.',
                LongDescription: 'Creates a subscription parameter for a single customer order item with a specific identifier. You can use the subscription parameters to define a commodity item. Subscription parameters are mapped to a subscription in SAP Subscription Billing.'
            },
            UpdateRestrictions : {
                Updatable : false
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : items.subscriptionAspect.itemSubscriptionParameters.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : items.product,
            ReadRestrictions : {     
                Description: 'Retrieves product of a customer order item.',
                LongDescription: 'Retrieves product of a single customer order item with a specific identifier.'            
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : notes,
            ReadRestrictions : {
                Description: 'Retrieves customer order notes.', 
                LongDescription: 'Retrieves a list of all notes for a single customer order with a specific identifier.', 
                ReadByKeyRestrictions : {
                    Description: 'Retrieves a customer order note.', 
                    LongDescription: 'Retrieves a single customer order note with a specific identifier.' 
                }
            },
            InsertRestrictions : {
                Description: 'Creates a customer order note.', 
                LongDescription: 'Creates a note for a single customer order with a specific identifier.' 
            },
            UpdateRestrictions : {
                Description: 'Updates a customer order note.',
                LongDescription: 'Updates a single customer order note with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : notes.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : notes.textType,
            ReadRestrictions : {  
                Description: 'Retrieves text type of a customer order note.', 
                LongDescription: 'Retrieves text type of a single customer order note with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : notes.language,
            ReadRestrictions : {     
                Description: 'Retrieves language of a customer order note.', 
                LongDescription: 'Retrieves language of a single customer order note with a specific identifier.'   
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : orderReason,
            ReadRestrictions : {   
                Description: 'Retrieves order reason of a customer order.', 
                LongDescription: 'Retrieves order reason of a single customer order with a specific identifier.'     
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners,
            ReadRestrictions : {
                Description: 'Retrieves customer order partners.', 
                LongDescription: 'Retrieves a list of all partners for a single customer order with a specific identifier.',
                ReadByKeyRestrictions : {
                    Description: 'Retrieves a customer order partner.', 
                    LongDescription: 'Retrieves a single customer order partner with a specific identifier.' 
                }
            },
            InsertRestrictions : { 
                Description: 'Creates a customer order partner.', 
                LongDescription: 'Creates a partner for a single customer order with a specific identifier.' 
            },
            UpdateRestrictions : {
                Description: 'Updates a customer order partner.', 
                LongDescription: 'Updates a single customer order partner with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : partners.address.street.ref,
            ReadRestrictions : {   
                Description: 'Retrieves street of customer order partner.', 
                LongDescription: 'Retrieves street of a single customer order partner with a specific identifier.'     
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.primaryRegion,
            ReadRestrictions : {    
                Description: 'Retrieves primary region of customer order partner.',
                LongDescription: 'Retrieves primary region of a single customer order partner with a specific identifier.'    
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.secondaryRegion.ref,
            ReadRestrictions : {  
                Description: 'Retrieves secondary region of customer order partner.', 
                LongDescription: 'Retrieves secondary region of a single customer order partner with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.tertiaryRegion.ref,
            ReadRestrictions : {  
                Description: 'Retrieves tertiary region of customer order partner.', 
                LongDescription: 'Retrieves tertiary region of a single customer order partner with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.town.ref,
            ReadRestrictions : {       
                Description: 'Retrieves town of customer order partner.', 
                LongDescription: 'Retrieves town of a single customer order partner with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.district.ref,
            ReadRestrictions : {   
                Description: 'Retrieves district of customer order partner.', 
                LongDescription: 'Retrieves district of a single customer order partner with a specific identifier.'     
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.country,
            ReadRestrictions : {      
                Description: 'Retrieves country/region of customer order partner.', 
                LongDescription: 'Retrieves country/region of a single customer order partner with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.alternative.country,
            ReadRestrictions : {       
                Description: 'Retrieves alternative country/region of customer order partner.', 
                LongDescription: 'Retrieves alternative country/region of a single customer order partner with a specific identifier.'  
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.alternative.primaryRegion,
            ReadRestrictions : {       
                Description: 'Retrieves alternative primary region of customer order partner.', 
                LongDescription: 'Retrieves alternative primary region of a single customer order partner with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.alternative.secondaryRegion.ref,
            ReadRestrictions : { 
                Description: 'Retrieves alternative secondary region of customer order partner.', 
                LongDescription: 'Retrieves alternative secondary region of a single customer order partner with a specific identifier.'       
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.alternative.tertiaryRegion.ref,
            ReadRestrictions : {       
                Description: 'Retrieves alternative tertiary region of customer order partner.', 
                LongDescription: 'Retrieves alternative tertiary region of a single customer order partner with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.alternative.town.ref,
            ReadRestrictions : {       
                Description: 'Retrieves alternative town of customer order partner.', 
                LongDescription: 'Retrieves alternative town of a single customer order partner with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.alternative.district.ref,
            ReadRestrictions : {      
                Description: 'Retrieves alternative district of customer order partner.', 
                LongDescription: 'Retrieves alternative district of a single customer order partner with a specific identifier.'  
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.alternative.deliveryType,
            ReadRestrictions : {   
                Description: 'Retrieves alternative delivery type for customer order partner.', 
                LongDescription: 'Retrieves alternative delivery type for a single customer order partner with a specific identifier.'     
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.address.timeZone,
            ReadRestrictions : {     
                Description: 'Retrieves time zone for customer order partner.', 
                LongDescription: 'Retrieves time zone for a single customer order partner with a specific identifier.'   
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.personAddressDetails.formOfAddress,
            ReadRestrictions : {      
                Description: 'Retrieves form of address for customer order partner.', 
                LongDescription: 'Retrieves form of address for a single customer order partner with a specific identifier.'  
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.personAddressDetails.academicTitle,
            ReadRestrictions : {   
                Description: 'Retrieves academic title of customer order partner.', 
                LongDescription: 'Retrieves academic title of a single customer order partner with a specific identifier.'     
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.personAddressDetails.additionalAcademicTitle,
            ReadRestrictions : {     
                Description: 'Retrieves additional academic title of customer order partner.', 
                LongDescription: 'Retrieves additional academic title of a single customer order partner with a specific identifier.'   
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.personAddressDetails.namePrefix,
            ReadRestrictions : {     
                Description: 'Retrieves name prefix of customer order partner.', 
                LongDescription: 'Retrieves name prefix of  a single customer order partner with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.personAddressDetails.additionalNamePrefix,
            ReadRestrictions : {       
                Description: 'Retrieves additional name prefix of customer order partner.', 
                LongDescription: 'Retrieves additional name prefix of a single customer order partner with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.personAddressDetails.nameSuffix,
            ReadRestrictions : {   
                Description: 'Retrieves name suffix of customer order partner.', 
                LongDescription: 'Retrieves name suffix of a single customer order partner with a specific identifier.'      
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : partners.role,
            ReadRestrictions : { 
                Description: 'Retrieves role of customer order partner.', 
                LongDescription: 'Retrieves role of a single customer order partner with a specific identifier.'  
            }, 
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : priceComponents,
            ReadRestrictions : { 
                Description: 'Retrieves customer order price components.', 
                LongDescription: 'Retrieves a list of all price components of a single customer order with a specific identifier.',
                ReadByKeyRestrictions: {  
                    Description: 'Retrieve price component of a customer order.', 
                    LongDescription: 'Retrieve a single price component of a customer order with a specific identifier..'            
                }
            }, 
            InsertRestrictions : {
                Description: 'Creates a customer order price component.', 
                LongDescription: 'Creates a price component for a single customer order with a specific identifier.'
            }, 
            UpdateRestrictions: {
                Description: 'Updates price component of a customer order.', 
                LongDescription: 'Updates a single price component of a customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : priceComponents.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : priceComponents.conditionType,
            ReadRestrictions : { 
                Description: 'Retrieves condition type of a customer order price component.', 
                LongDescription: 'Retrieves condition type of a single customer order price component with a specific identifier.'         
            },  
            UpdateRestrictions : {
                Description: 'Updates a customer order price component.', 
                LongDescription: 'Updates a single customer order price component with a specific identifier.' 
            },          
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : priceComponents.currency,
            ReadRestrictions : {     
                Description: 'Retrieves currency of a customer order price component.', 
                LongDescription: 'Retrieves currency of a single customer order price component with a specific identifier.' 
            },            
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : priceComponents.perQuantityUnit,
            ReadRestrictions : { 
                Description: 'Retrieves quantity unit of a customer order price component.', 
                LongDescription: 'Retrieves quantity unit of a single customer order price component with a specific identifier.'         
            },            
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : salesAspect,
            ReadRestrictions : {    
                Description: 'Retrieves customer order sales aspect.', 
                LongDescription: 'Retrieves sales aspect of a single customer order with a specific identifier.' 
            },
            UpdateRestrictions: {
                Description: 'Updates customer order sales aspect.', 
                LongDescription: 'Updates sales aspect of a single customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : salesAspect.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : salesAspect.shippingCondition,
            ReadRestrictions : {    
                Description: 'Retrieves shipping condition of a customer order.', 
                LongDescription: 'Retrieves shipping condition of a single customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : salesAspect.paymentTerms,
            ReadRestrictions : {    
                Description: 'Retrieves payment terms of a customer order.', 
                LongDescription: 'Retrieves payment terms of a single customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : salesAspect.incotermsClassification,
            ReadRestrictions : {    
                Description: 'Retrieves incoterms classification of a customer order.', 
                LongDescription: 'Retrieves incoterms classification of a single customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : serviceAspect,
            ReadRestrictions : {    
                Description: 'Retrieves customer order service aspect.', 
                LongDescription: 'Retrieves service aspect of a single customer order with a specific identifier.' 
            },
            UpdateRestrictions: {
                Description: 'Updates customer order service aspect.', 
                LongDescription: 'Updates service aspect of a single customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : serviceAspect.up_,
            ReadRestrictions : {
                Readable : false
            }
        },{
            NavigationProperty : serviceAspect.serviceOrganization,
            ReadRestrictions : {    
                Description: 'Retrieves service organization of a customer order.', 
                LongDescription: 'Retrieves service organization of a single customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : serviceAspect.priority,
            ReadRestrictions : {    
                Description: 'Retrieves priority of a customer order.', 
                LongDescription: 'Retrieves priority of a single customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : serviceAspect.referenceObjects,
            ReadRestrictions : {    
                Description: 'Retrieves customer order service reference objects.', 
                LongDescription: 'Retrieves a list of all service reference objects for a single customer order with a specific identifier.',   
                ReadByKeyRestrictions: {  
                    Description: 'Retrieves a customer order service reference object.', 
                    LongDescription: 'Retrieves a single customer order service reference object with a specific equipment identifier.'            
                }
            },
            UpdateRestrictions: {
                Description: 'Updates a customer order service reference object.', 
                LongDescription: 'Updates a single customer order service reference object with a specific equipment identifier.' 
            },
            InsertRestrictions: {
                Description: 'Creates a customer order service reference object.', 
                LongDescription: 'Creates a service reference object for a single customer order with a specific identifier.' 
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },{
            NavigationProperty : serviceAspect.referenceObjects.up_,
            ReadRestrictions : {
                Readable : false
            }
        }
    ]}
};

annotate Product with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves products.',
        LongDescription: 'Retrieves a list of products.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves a product.',
            LongDescription: 'Retrieves a single product using the ID.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates a product.',
        LongDescription: 'Updates a single product using the product ID.'
    },
    InsertRestrictions: {
        Description: 'Creates a product.',
        LongDescription: 'Creates a single product which can be either tangible, such as physical goods such as materials or articles, or intangible such as services and digital goods that are part of the business activity of a company.'
    },
    DeleteRestrictions: {
        Deletable : false
    },

    NavigationRestrictions: {
        RestrictedProperties : [
        {
            NavigationProperty : salesAspect,
            ReadRestrictions: {
                Description: 'Retrieves sales aspect of a product.',
                LongDescription: 'Retrieves sales aspect for a specific product using the product ID.'
            },
            UpdateRestrictions: {
                Description: 'Updates sales aspect of a product.',
                LongDescription: 'Updates sales aspect for a specific product using the product ID which is a sales attribute that describes a product.'
            },
            DeleteRestrictions : {
                Deletable : false
            }
        },
        {
            NavigationProperty : salesAspect.division,
            ReadRestrictions: {
                Description: 'Retrieves division of a product.',
                LongDescription: 'Retrieves division of a product using the product ID.'
            }
        },
        {
            NavigationProperty : salesAspect.up_,
            ReadRestrictions: {
                Description: 'Retrieve up_ of a product.',
                LongDescription: 'Retrieve up_ of a product using the ID.'
            }
        }
    ]}
};

annotate ProductTypeCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves product types.',
        LongDescription: 'Retrieves a list of product types.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves a product types.',
            LongDescription: 'Retrieves a single product type using the code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates a product type.',
        LongDescription: 'Updates a single product type using the product type code.'
    },
    InsertRestrictions: {
        Description: 'Creates a product type.',
        LongDescription: 'Creates a single product type.'
    },
    DeleteRestrictions: {
        Deletable : false
    },

    NavigationRestrictions: {
        RestrictedProperties : [
        {
            NavigationProperty : typeGroup,
            ReadRestrictions: {
                Description: 'Retrieves products type group.',
                LongDescription: 'Retrieves products type group for a specific product type using the products type code.'
            },
            UpdateRestrictions: {
                Description: 'Updates products type group.',
                LongDescription: 'Updates products type group for a specific product type using the products type code.'
            },
            DeleteRestrictions : {
                Deletable : false
            }
        }
    ]}
};

annotate ProductTypeGroupCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves product type groups.',
        LongDescription: 'Retrieves a list of product type groups.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves a product type group.',
            LongDescription: 'Retrieves a single product type group using the code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates a product type group.',
        LongDescription: 'Updates a single product type group using the product type group code.'
    },
    InsertRestrictions: {
        Description: 'Creates a product type group.',
        LongDescription: 'Creates a single product type group.'
    },
    DeleteRestrictions: {
        Deletable : false
    }
};

annotate SalesOrganization with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves sales organizations.',
        LongDescription: 'Retrieves a list of sales organizations.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves sales organization.',
            LongDescription: 'Retrieves a single sales organization using the ID.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates sales organization.',
        LongDescription: 'Updates a single sales organization using the ID.'
    },
    InsertRestrictions: {
        Description: 'Creates sales organization.',
        LongDescription: 'Creates a single sales organization where a sales organization is responsible for the sale and distribution of goods and services in one particular country/region.'
    },
    DeleteRestrictions: {
        Deletable : false
    },

    NavigationRestrictions: {
        RestrictedProperties : [
        {
            NavigationProperty : companyCode,
            ReadRestrictions: {
                Description: 'Retrieves company code of a sales organization.',
                LongDescription: 'Retrieves company code of a sales organization using the ID.'
            }
        },
        {
            NavigationProperty : currency,
            ReadRestrictions: {
                Description: 'Retrieves currency of a sales organization.',
                LongDescription: 'Retrieves currency of a sales organization using the ID.'
            }
        }
    ]}
};

annotate ServiceOrganization with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves service organizations.',
        LongDescription: 'Retrieves a list of service organization.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves service organization.',
            LongDescription: 'Retrieves a single service organization using the ID.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates service organization.',
        LongDescription: 'Updates a single service organization using the ID.'
    },
    InsertRestrictions: {
        Description: 'Creates service organization.',
        LongDescription: 'Creates a single service organization which is an organizational unit where services are prepared and planned.'
    },
    DeleteRestrictions: {
        Deletable : false
    }
};

annotate CompanyCode with @Capabilities: { 
    ReadRestrictions: {
        Description: 'Retrieves company codes.',
        LongDescription: 'Retrieves a list of company codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves company code.',
            LongDescription: 'Retrieves a single company code using the ID.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates company code.',
        LongDescription: 'Updates a single company code using the ID.'
    },
    InsertRestrictions: {
        Description: 'Creates company code.',
        LongDescription: 'Creates a single company code which is a smallest organizational unit in financial accounting for which individual financial statements for external reporting are drawn, such as balance sheets, profit and loss accounts.'
    },
    DeleteRestrictions: {
        Description: 'Deletes company code.',
        LongDescription: 'Deletes a single company code using the ID.'
    },
    
    NavigationRestrictions: {
        RestrictedProperties : [
        {
            NavigationProperty : country,
            ReadRestrictions: {
                Description: 'Retrieves country/region of a company code.',
                LongDescription: 'Retrieves country/region of a company code using the ID.'
            }
        },
        {
            NavigationProperty : language,
            ReadRestrictions: {
                Description: 'Retrieves language of a company code.',
                LongDescription: 'Retrieves language of a company code using the ID.'
            }
        },
        {
            NavigationProperty : currency,
            ReadRestrictions: {
                Description: 'Retrieves currency of a company code.',
                LongDescription: 'Retrieves currency of a company code using the ID.'
            }
        }
    ]}
};

annotate CustomerOrderTypeCodes with @Capabilities: { 
    ReadRestrictions: {
        Description: 'Retrieves customer order type codes.',
        LongDescription: 'Retrieves a list of customer order type codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves customer order type code.',
            LongDescription: 'Retrieves a single customer order type for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates customer order type code.',
        LongDescription: 'Updates a single customer order type for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates customer order type code.',
        LongDescription: 'Creates a single customer order type code which specifies the type of a customer order.'
    },
    DeleteRestrictions: {
        Description: 'Deletes customer order type code.',
        LongDescription: 'Deletes a single customer order type for the given code.'
    }
};

annotate CustomerOrderReasonCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves customer order reason codes.',
        LongDescription: 'Retrieves a list of customer order reason codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves customer order reason code.',
            LongDescription: 'Retrieves a single customer order reason for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates customer order type code.',
        LongDescription: 'Updates a single customer order type for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates customer order reason code.',
        LongDescription: 'Creates a single customer order reason code which specifies a reason why the specific customer order is entered into the system.'
    },
    DeleteRestrictions: {
        Description: 'Deletes customer order reason code.',
        LongDescription: 'Deletes a single customer order reason for the given code.'
    }
};

annotate CustomerOrderItemTypeCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves customer order item type codes.',
        LongDescription: 'Retrieves a list of customer order item type codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves customer order item type code.',
            LongDescription: 'Retrieves a single customer order item type for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates customer order item type code.',
        LongDescription: 'Updates a single customer order item type for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates customer order item type code.',
        LongDescription: 'Creates a single customer order item type code which is an identifier for the characteristics of customer order items. The item type distinguishes between different item categories such as free of charge or text items (i.e. documents) and determines how the system processes the item.'
    },
    DeleteRestrictions: {
        Description: 'Deletes customer order item type code.',
        LongDescription: 'Deletes a single customer order item type for the given code.'
    }
};

annotate CustomerOrderItemUtilitiesBudgetBillingTypeCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves budget billing type codes.', 
        LongDescription: 'Retrieves a list of budget billing type codes.', 
        ReadByKeyRestrictions: {
            Description: 'Retrieves budget billing type code.',
            LongDescription: 'Retrieves a single budget billing type for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates budget billing type code.',
        LongDescription: 'Updates a single budget billing type for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates budget billing type code.',
        LongDescription: 'Creates a single budget billing type code. This code specifies the type of billing plan.'
    },
    DeleteRestrictions: {
        Description: 'Deletes budget billing type code.',
        LongDescription: 'Deletes a single budget billing type for the given code.'
    }
};

annotate CustomerOrderItemUtilitiesDeviceTypeCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves device type codes.', 
        LongDescription: 'Retrieves a list of device type codes.', 
        ReadByKeyRestrictions: {
            Description: 'Retrieves device type code.',
            LongDescription: 'Retrieves a single device type for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates device type code.',
        LongDescription: 'Updates a single device type for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates device type code.',
        LongDescription: 'Creates a single device type code. This code represents the type of device.'
    },
    DeleteRestrictions: {
        Description: 'Deletes device type code.',
        LongDescription: 'Deletes a single device type for the given code.'
    }
};


annotate CustomerOrderItemUtilitiesSubsequentDocumentCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves customer order item utilities subsequent document codes.',
        LongDescription: 'Retrieves a list of customer order item utilities subsequent document codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves customer order item utilities subsequent document code.',
            LongDescription: 'Retrieve a single customer order item utilities subsequent document for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates customer order item utilities subsequent document code.',
        LongDescription: 'Updates a single customer order item utilities subsequent document for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates customer order item utilities subsequent document code.',
        LongDescription: 'Creates a single customer order item utilities subsequent document code. This entity stores the document number from the fulfillment system after order distribution. It also stores the subsequent document type. The subsequent document can be a subscription or a sales and distribution order.'
    },
    DeleteRestrictions: {
        Description: 'Deletes customer order item utilities subsequent document code.',
        LongDescription: 'Deletes a single customer order item utilities subsequent document for the given code.'
    }
};

annotate SalesCancellationStatusCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves sales cancellation status codes.',
        LongDescription: 'Retrieves a list of sales cancellation status codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves sales cancellation status code.',
            LongDescription: 'Retrieves a single sales cancellation status for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates sales cancellation status code.',
        LongDescription: 'Updates a single sales cancellation status for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates sales cancellation status code.',
        LongDescription: 'Creates a single sales cancellation status code which specifies the statuses of the cancellation. The overall cancellation status is derived from the cancellation status of the individual items of the sales document.'
    },
    DeleteRestrictions: {
        Description: 'Deletes sales cancellation status code.',
        LongDescription: 'Deletes a single sales cancellation status for the given code.'
    }
};

annotate SalesCancellationReasonCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves sales cancellation reason codes.',
        LongDescription: 'Retrieves a list of sales cancellation reason codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves sales cancellation reason code.',
            LongDescription: 'Retrieves a single sales cancellation reason for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates sales cancellation reason code.',
        LongDescription: 'Updates a single sales cancellation reason for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates sales cancellation reason code.',
        LongDescription: 'Creates a single sales cancellation reason code which specifies the reasons for canceling a document such as a sales quote or sales order. The cancellation can be done either from your organization, for example to reject a customer request for a credit memo, or from the customer, for example if the price given in a quote is too high.'
    },
    DeleteRestrictions: {
        Description: 'Deletes sales cancellation reason code.',
        LongDescription: 'Deletes a single sales cancellation reason for the given code.'
    }
};

annotate SalesProcessingStatusCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves sales processing status codes.',
        LongDescription: 'Retrieves a list of sales processing status codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves sales processing status code.',
            LongDescription: 'Retrieves a single sales processing status for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates sales processing status code.',
        LongDescription: 'Updates a single sales processing status for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates sales processing status code.',
        LongDescription: 'Creates a single sales processing status code which specifies the processing statuses of a sales document.'
    },
    DeleteRestrictions: {
        Description: 'Deletes sales processing status code.',
        LongDescription: 'Deletes a single sales processing status for the given code.'
    }
};

annotate SalesPartnerRoleCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves sales partner role codes.',
        LongDescription: 'Retrieves a list of sales partner role codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves sales partner role code.',
            LongDescription: 'Retrieves a single sales partner role for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates sales partner role code.',
        LongDescription: 'Updates a single sales partner role for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates sales partner role code.',
        LongDescription: 'Creates a single sales partner role code which specifies the roles of a sales partner.'
    },
    DeleteRestrictions: {
        Description: 'Deletes sales partner role code.',
        LongDescription: 'Deletes a single sales partner role for the given code.'
    }
};

annotate SalesTextTypeCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves sales text type codes.',
        LongDescription: 'Retrieves a list of sales text type codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves sales text type code.',
            LongDescription: 'Retrieves a single sales text type for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates sales text type code.',
        LongDescription: 'Updates a single sales text type for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates sales text type code.',
        LongDescription: 'Creates a single sales text type code which identifies the sales text types.'
    },
    DeleteRestrictions: {
        Description: 'Deletes sales text type code.',
        LongDescription: 'Deletes a single sales text type for the given code.'
    }
};

annotate DistributionChannelCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves distribution channel codes.',
        LongDescription: 'Retrieves a list of distribution channel codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves distribution channel code.',
            LongDescription: 'Retrieves a single distribution channel for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates distribution channel code.',
        LongDescription: 'Updates a single distribution channel for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates distribution channel code.',
        LongDescription: 'Creates a single distribution channel code which is a channel through which products or services reach customers. Typical examples of distribution channels are wholesale, retail, or direct sales.'
    },
    DeleteRestrictions: {
        Description: 'Deletes distribution channel code.',
        LongDescription: 'Deletes a single distribution channel for the given code.'
    }
};

annotate ConditionTypeCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves condition type codes.',
        LongDescription: 'Retrieves a list of condition type codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves condition type code.',
            LongDescription: 'Retrieves a single condition type for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates condition type code.',
        LongDescription: 'Updates a single condition type for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates condition type code.',
        LongDescription: 'Creates a single condition type code which specifies the condition type, such as free-goods, sales-based rebate, or gross price discount.'
    },
    DeleteRestrictions: {
        Description: 'Deletes condition type code.',
        LongDescription: 'Deletes a single condition type for the given code.'
    }
};

annotate DivisionCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves division codes.',
        LongDescription: 'Retrieves a list of division codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves division code.',
            LongDescription: 'Retrieves a single division for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates division code.',
        LongDescription: 'Updates a single division for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates division code.',
        LongDescription: 'Creates a single division code which is a way of grouping materials, products, or services.'
    },
    DeleteRestrictions: {
        Description: 'Deletes division code.',
        LongDescription: 'Deletes a single division for the given code.'
    }
};

annotate ServiceOrderPriorityCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves service order priority codes.',
        LongDescription: 'Retrieves a list of service order priority codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves service order priority code.',
            LongDescription: 'Retrieves a single service order priority for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates service order priority code.',
        LongDescription: 'Updates a single service order priority for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates service order priority code.',
        LongDescription: 'Creates a single service order priority code which specifies the priority of a service order, such as high or low.'
    },
    DeleteRestrictions: {
        Description: 'Deletes service order priority code.',
        LongDescription: 'Deletes a single service order priority for the given code.'
    }
};

annotate ShippingConditionCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves shipping condition codes.',
        LongDescription: 'Retrieves a list of shipping condition codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves shipping condition code.',
            LongDescription: 'Retrieves a single shipping condition for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates shipping condition code.',
        LongDescription: 'Updates a single shipping condition for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates shipping condition code.',
        LongDescription: 'Creates a single shipping condition code which specifies the shipping strategy for a delivery. The strategy can define, for example, that the goods must reach the customer as soon as possible, the system proposes the fastest shipping point and route.'
    },
    DeleteRestrictions: {
        Description: 'Deletes shipping condition code.',
        LongDescription: 'Deletes a single shipping condition for the given code.'
    }
};

annotate DeliveryPriorityCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves delivery priority codes.',
        LongDescription: 'Retrieves a list of delivery priority codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves delivery priority code.',
            LongDescription: 'Retrieves a single delivery priority for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates delivery priority code.',
        LongDescription: 'Updates a single delivery priority for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates delivery priority code.',
        LongDescription: 'Creates a single delivery priority code which specifies the priority of a delivery.'
    },
    DeleteRestrictions: {
        Description: 'Deletes delivery priority code.',
        LongDescription: 'Deletes a single delivery priority for the given code.'
    }
};

annotate UnitOfMeasuresCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves unit of measure codes.',
        LongDescription: 'Retrieves a list of unit of measure codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves unit of measure code.',
            LongDescription: 'Retrieves a single unit of measure for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates unit of measure code.',
        LongDescription: 'Updates a single unit of measure for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates unit of measure code.',
        LongDescription: 'Creates a single unit of measure code which is a coded representation of a non-monetary unit of measurement. Unit of measurement is a quantity that is either defined by a standard or established by conventions as a particular type of unit. This unit quantity is the standard of comparison for determining and specifying other quantities of the same type.'
    },
    DeleteRestrictions: {
        Description: 'Deletes unit of measures code.',
        LongDescription: 'Deletes a single unit of measure for the given code.'
    }
};

annotate CurrencyCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves currency codes.',
        LongDescription: 'Retrieves a list of currency codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves currency code.',
            LongDescription: 'Retrieves a single currency for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates currency code.',
        LongDescription: 'Updates a single currency for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates currency code.',
        LongDescription: 'Creates a single currency code. Currency Codes following ISO 4217.'
    },
    DeleteRestrictions: {
        Description: 'Deletes currency code.',
        LongDescription: 'Deletes a single currency for the given code.'
    }
};

annotate PaymentTermCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves payment term codes.',
        LongDescription: 'Retrieves a list of payment term codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves payment term code.',
            LongDescription: 'Retrieves a single payment term for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates payment term code.',
        LongDescription: 'Updates a single payment term for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates payment term code.',
        LongDescription: 'Creates a single payment term code. Payment terms are composed of cash discount percentages and payment periods. It is used in customers orders, purchase orders, and invoices. Terms of payment provide information for: Cash management, Dunning procedures, Payment transactions.'
    },
    DeleteRestrictions: {
        Description: 'Deletes payment term code.',
        LongDescription: 'Deletes a single payment term for the given code.'
    }
};

annotate PaymentCardTypeCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves payment card type codes.',
        LongDescription: 'Retrieves a list of payment card type codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves payment card type code.',
            LongDescription: 'Retrieves a single payment card type for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates payment card type code.',
        LongDescription: 'Updates a single payment card type for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates payment card type code.',
        LongDescription: 'Creates a single payment card type code which specifies a possible payment card type.'
    },
    DeleteRestrictions: {
        Description: 'Deletes payment card type code.',
        LongDescription: 'Deletes a single payment card type code for the given code.'
    }
};

annotate LanguageCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves language codes.',
        LongDescription: 'Retrieves a list of language codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves language code.',
            LongDescription: 'Retrieves a single language for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates language code.',
        LongDescription: 'Updates a single language for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates language code.',
        LongDescription: 'Creates a single language code. The language code identifys human languages - follows IETF BCP 47 language tag (RFC 5646).'
    },
    DeleteRestrictions: {
        Description: 'Deletes language code.',
        LongDescription: 'Deletes a single language for the given code.'
    }
};

annotate CountryCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves country/region codes.',
        LongDescription: 'Retrieves a list of country/region codes.',
        ReadByKeyRestrictions: {
            Description: 'Retrieves country/region code.',
            LongDescription: 'Retrieves a single country/region for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates country/region code.',
        LongDescription: 'Updates a single country/region for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates country/region code.',
        LongDescription: 'Creates a single country/region code. Country codes following IES ISO-3166 ALPHA-2.'
    },
    DeleteRestrictions: {
        Description: 'Deletes country/region code.',
        LongDescription: 'Deletes a single country/region for the given code.'
    },

    NavigationRestrictions: {
        RestrictedProperties : [
        {
            NavigationProperty : currency,
            ReadRestrictions: {
                Description: 'Retrieves currency of a country/region code.',
                LongDescription: 'Retrieves currency of a country/region for the given code.'
            }
        }
    ]}
};

annotate IncotermsClassificationCodes with @Capabilities: {
    ReadRestrictions: {
        Description: 'Retrieves incoterms classification codes.', 
        LongDescription: 'Retrieves a list of incoterms classification codes.', 
        ReadByKeyRestrictions: {
            Description: 'Retrieves incoterms classification code.',
            LongDescription: 'Retrieves a single incoterms classification for the given code.'
        }
    },
    UpdateRestrictions: {
        Description: 'Updates incoterms classification code.',
        LongDescription: 'Updates a single incoterms classification for the given code.'
    },
    InsertRestrictions: {
        Description: 'Creates incoterms classification code.',
        LongDescription: 'Creates a single incoterms classification code which specifies internationally recognized procedures that the shipper and the receiving party must follow for the shipping transaction to be completed successfully.'
    },
    DeleteRestrictions: {
        Description: 'Deletes incoterms classification code.',
        LongDescription: 'Deletes a single incoterms classification for the given code.'
    }
};

