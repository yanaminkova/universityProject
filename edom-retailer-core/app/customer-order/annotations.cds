using CustomerOrderUIService as service from '../../ui-services/srv';

annotate CustomerOrderUIService.CustomerOrder with {
    
    orderDate @Common.Label : '{i18n>labelCustomerOrderDate}';
    displayId @Common.Label : '{i18n>labelCustomerOrderDisplayID}';
    

    netAmount @( Common : { Label : '{i18n>labelCustomerOrderNetAmount} (EUR)' });  
    
    distributionChannel @UI.Hidden : true; 
    cancellationStatus @UI.Hidden : true;

    processingStatus @(
        Common: {
            Label : '{i18n>labelCustomerOrderProcessingStatus}',
            Text            : processingStatus.name,
            TextArrangement : #TextOnly,
            ValueListWithFixedValues: true,
            ValueList : {
                $Type : 'Common.ValueListType',
                
                CollectionPath : 'SalesProcessingStatusCodes',
                Parameters: [
                        { $Type: 'Common.ValueListParameterOut', LocalDataProperty: processingStatus_code, ValueListProperty: 'code',  },
                        { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
                    ]
            }
        }
    );

    salesOrganization @(
        Common: {
            Label : '{i18n>labelSalesOrganization}',
            Text            : salesOrganization.name,
            TextArrangement : #TextOnly,
            ValueList : {
                $Type : 'Common.ValueListType',
                CollectionPath : 'SalesOrganization',
                SearchSupported: true,
                Parameters: [
                        { $Type: 'Common.ValueListParameterOut', LocalDataProperty: salesOrganization_id, ValueListProperty: 'id',  },
                        { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'displayId' },
                        { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
                    ]
            }
        }
    );

    division @( 
        Common: {
            Label : '{i18n>labelCustomerOrderDivision}',
            Text            : division.name,
            TextArrangement : #TextOnly,
            ValueListWithFixedValues: true,
            ValueList : {
                $Type : 'Common.ValueListType',
                CollectionPath : 'DivisionCodes',
                Parameters: [
                        { $Type: 'Common.ValueListParameterOut', LocalDataProperty: division_code, ValueListProperty: 'code',  },
                        { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' },
                        { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'descr' }
                    ]
            }
        }    
    );
    
};

annotate CustomerOrderUIService.CustomerOrder with @
(UI: 
    {
        SelectionFields: [ displayId, processingStatus_code, orderDate, salesOrganization_id, division_code ],

        Identification: [{Value:displayId}],

        LineItem: [
            {
                Value: displayId,
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            },
            {
                Value: processingStatus_code,  
                Label: '{i18n>labelCustomerOrderProcessingStatus}',
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            },
            {
                Value: orderDate,
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }             
            },
            {
                Value:	salesOrganization_id, 
                Label: '{i18n>labelSalesOrganization}',
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            },
            {
                Value: division_code,
                Label: '{i18n>labelCustomerOrderDivision}',
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            },
            {
                $Type : 'UI.DataFieldForAnnotation', 
                Target: '@UI.DataPoint#netamount',
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            }
        ],
		
        HeaderInfo: {
			TypeName: '{i18n>typeNameCustomerOrder}', 
            TypeNamePlural: '{i18n>typeNamePluralCustomerOrder}',

            Title: 
            { 
				Value: displayId
            }
		},

	    HeaderFacets: [
		    {
                $Type: 'UI.ReferenceFacet',               
                Target: '@UI.DataPoint#status' 
            },
            {
                $Type: 'UI.ReferenceFacet',
                Label:  '{i18n>labelNetAmount} (EUR)',               
                Target: '@UI.DataPoint#netamount' 
            }
		],

        Facets: [
            {
                $Type: 'UI.ReferenceFacet', 
                Label: '{i18n>labelGeneralInformation}',   
                Target: '@UI.FieldGroup#generalInformation' 
            },
			{
                $Type: 'UI.ReferenceFacet', 
                Label: '{i18n>labelItems}',                
                Target: 'items/@UI.LineItem' 
            }
		],

        DataPoint# status : {
            Title: '{i18n>labelStatus}',
            Value : processingStatus.name
        },

        DataPoint# netamount: {
            Value: netAmount,
            Title: '{i18n>labelCustomerOrderNetAmount} (EUR)',
            ValueFormat: { 
                $Type: 'UI.NumberFormat',
                ScaleFactor: 1000,
                NumberOfFractionalDigits: 2
            }
		},

        FieldGroup #generalInformation : {
            $Type : 'UI.FieldGroupType',
            Data : [
                {
                    $Type : 'UI.DataField',
                    Value : orderDate 
                },
                {
                    $Type : 'UI.DataField',
                    Label : '{i18n>labelSalesOrgSalesArea}',
                    Value : salesOrganization.displayId
                },
                {
                    $Type : 'UI.DataField',
                    Label : '{i18n>labelSalesOrgDistributionChannel}',
                    Value : distributionChannel.name
                },
                {
                    $Type : 'UI.DataField',
                    Label : '{i18n>labelSalesOrgDivision}',
                    Value : division.name
                },
                {
                    $Type: 'UI.DataField',
                    Label: '{i18n>labelStatusCancellationStatus}',
                    Value: cancellationStatus.name
                }
            ]
        }
    }
);

annotate CustomerOrderUIService.CustomerOrderItems with {
    alternativeId @UI.Hidden : true;
    cancellationReason @UI.Hidden : true;
    product @UI.Hidden : true; 
    processingStatus @UI.Hidden : true;
    quantityUnit @UI.Hidden : true;
    type @UI.Hidden : true;

    quantity @Measures : { Unit : quantityUnit_code };

    quantityUnit @Common.IsUnit; 

    netAmount @( Common : { Label : '{i18n>labelCustomerOrderItemNetAmount} (EUR)' });       
};

annotate CustomerOrderUIService.CustomerOrderItems with @
(UI: {       
        LineItem: [
            {
                Value: id,
                Label: '{i18n>labelCustomerOrderItemID}',
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            },
            {
                Value: product.name,           
                Label: '{i18n>labelCustomerOrderItemProduct}',
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            },
            {
                Value: quantity,
                Label : '{i18n>labelCustomerOrderItemQuantity}',
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            },
            {
                $Type : 'UI.DataFieldForAnnotation', 
                Target: '@UI.DataPoint#netamount',
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }       
            },
            {
                Value: processingStatus.name,  
                Label: '{i18n>labelCustomerOrderItemProcessingStatus}',
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            },
            {
                Value: type.name,  
                Label: '{i18n>labelCustomerOrderItemTypeName}',
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            }
        ],

        HeaderInfo: {
            TypeName: '{i18n>typeNameCustomerOrderItem}', 
            TypeNamePlural: '{i18n>typeNamePluralCustomerOrderItem}',
            Title: 
            {
                Label: '{i18n>labelCustomerOrderItem}', 
                Value: id
            },

            Description: 
            {
                Value: product.name
            },
        },

        HeaderFacets: [
        {
            $Type: 'UI.ReferenceFacet',  
            Target: '@UI.DataPoint#status' 
        },
        {
            $Type: 'UI.ReferenceFacet',  
            Target: '@UI.DataPoint#itemType' 
        }],

        Facets: [
            { 
                $Type: 'UI.ReferenceFacet',  
                Label: '{i18n>labelGeneralInformation}',   
                Target: '@UI.FieldGroup#generalInformation' 
            },
            {
                $Type: 'UI.ReferenceFacet', 
                Label: '{i18n>labelSubsequentDocument}', 
                Target: '@UI.FieldGroup#subsequentdoc' 
            },
            { 
                $Type: 'UI.ReferenceFacet', 
                Label: '{i18n>labelNotes}',     
                Target: 'notes/@UI.LineItem' 
            }
        ],

        FieldGroup# generalInformation: {
            Data: [
                {    
                    Label: '{i18n>labelProductID}',    
                    Value: product.displayId
                },
                {
                    Label: '{i18n>labelProductName}',
                    Value: product.name
                },
                {
                    Label: '{i18n>labelQuantity}',
                    Value: quantity,
                },
                { 
                    $Type : 'UI.DataFieldForAnnotation', 
                    Target: '@UI.DataPoint#netamount',
                    Label : '{i18n>labelCustomerOrderItemNetAmount} (EUR)'
                },
                {
                    $Type: 'UI.DataField',
                    Label: '{i18n>labelStatusCancellationReason}',
                    Value: cancellationReason.name
                }
            ]
        },

        FieldGroup# subsequentdoc : {
            $Type : 'UI.FieldGroupType',
            Data : [
                {
                    $Type : 'UI.DataFieldWithUrl',
                    Label : '{i18n>labelSubsequentDocumentID}',
                    Value : utilitiesAspect.subsequentDocument.displayId,
                    Url: utilitiesAspect.subsequentDocument.type.url
                },
                {
                    $Type : 'UI.DataField',
                    Label : '{i18n>labelSubsequentDocumentType}',
                    Value : utilitiesAspect.subsequentDocument.type.name
                }
            ]
        },

        DataPoint# netamount: {
            Value: netAmount,
            Title: '{i18n>labelCustomerOrderNetAmount} (EUR)',
            ValueFormat: { 
                $Type: 'UI.NumberFormat',
                ScaleFactor: 1000,
                NumberOfFractionalDigits: 2
            }
		},

        DataPoint# status : {
            Title: '{i18n>labelStatus}',
            Value : processingStatus.name
        },

        DataPoint# itemType : {
            $Type : 'UI.DataPointType',
            Title : '{i18n>labelCustomerOrderItemTypeName}',
            Value : type.name
        }
    }
);

annotate CustomerOrderUIService.CustomerOrderItemNotes with {
    id @UI.Hidden : true;
    textType @UI.Hidden : true;
};

annotate CustomerOrderUIService.CustomerOrderItemNotes with @
(UI: 
    { 
        LineItem:[
            {
                $Type : 'UI.DataField',
                Label : '{i18n>labelNotesType}',
                Value : textType.name,
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>labelNotesText}',
                Value : text,
                ![@HTML5.CssDefaults]: {
                    width: 'auto'
                }
            }
        ]
    }
);

annotate CustomerOrderUIService.SalesProcessingStatusCodes with {   
    code @UI.Hidden : true @Common.Text : name;
    name @Common.Label : '{i18n>labelCustomerOrderProcessingStatus}';
};

annotate CustomerOrderUIService.SalesOrganization with {
    id @UI.Hidden : true @Common.Text : name;
    name @Common.Label : '{i18n>labelSalesOrganization}';

    displayId @Common.Label : '{i18n>labelSalesOrganizationDisplayID}';
};

annotate CustomerOrderUIService.DivisionCodes with {
    code @UI.Hidden : true @Common.Text : name;
    name @Common.Label : '{i18n>labelCustomerOrderDivision}';
};