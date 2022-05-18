const emptyPayload = {
    '@odata.context': '$metadata#Logs',
    value: [],
    '@odata.deltaLink':
        '/v1/odm/2.3.0/sap.odm.product.Product/events?$deltatoken=F3uAu5u2.3.0u3u274u1u0u62u126u15u505u126u422u402u209u317u202u777u204u321u207u391u226u224',
};

const initialPayload = {
    '@odata.context': '$metadata#Logs',
    value: [
        {
            instance: {
                baseUnitOfMeasure: {
                    code: 'PCE',
                },
                unitOfMeasureConversions: [
                    {
                        measurementUnit1: {
                            code: 'PCE',
                        },
                        measurementUnit2: {
                            code: 'PCE',
                        },
                        quantityDenominator: '1.0',
                        quantityNumerator: '1.0',
                    },
                ],
                name: [
                    {
                        lang: 'en',
                        content: 'Basic text.',
                    },
                ],
                servicePartsManagementAspect: {
                    overcapacityTolerance: '0.0',
                    hasVariableTareWeight: false,
                    maximumCapacity: '0.000',
                },
                document: {
                    isCreatedByCAD: false,
                    pageCount: '000',
                },
                unitOfMeasures: [
                    {
                        measurementUnit: {
                            code: 'PCE',
                        },
                    },
                ],
                productionAspect: {
                    totalShelfLifeStoragePercent: 0,
                    totalShelfLife: 0,
                },
                qualityInspectionAspect: {
                    isActive: false,
                },
                salesAspect: {
                    stackingFactor: 0,
                    excessVolumeTolerance: '0.0',
                    isClosedPackagingProduct: false,
                    excessWeightTolerance: '0.0',
                },
                isProductLocked: false,
                isRelevantForHazardousSubstances: false,
                displayId: '4062',
                isBatchManagementRequired: false,
                isMarkedForDeletion: false,
                isConfigurable: false,
                isInBulkTransport: false,
                isApprovedBatchRecordRequired: false,
                isProductEnvironmentallyRelevant: false,
                areProductEffectiveParameterValuesAssigned: false,
                isProductHighlyViscous: false,
                type: {
                    code: 'HAWA',
                },
                id: '26ae3fe2-3a46-44b2-bf62-6003c7e838b6',
            },
            localIds: [
                {
                    context: {
                        application: 'MDI',
                        tenant: 'S4MDIPRDCT',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.20',
                    },
                    status: 'active',
                    localId: '4062',
                },
                {
                    context: {
                        application: 'MDI',
                        tenant: 'S4MDIPRDCT',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.929',
                    },
                    status: 'active',
                    localId: '26ae3fe2-3a46-44b2-bf62-6003c7e838b6',
                },
                {
                    context: {
                        application: 's4',
                        tenant: '0LOALS1',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.20',
                    },
                    status: 'active',
                    localId: '4062',
                },
            ],
            event: 'created',
            versionId: '3261f5eb-5388-4030-afef-21eed5b6c781',
        },
        {
            instance: {
                baseUnitOfMeasure: {
                    code: 'PCE',
                },
                unitOfMeasureConversions: [
                    {
                        measurementUnit1: {
                            code: 'PCE',
                        },
                        measurementUnit2: {
                            code: 'PCE',
                        },
                        quantityDenominator: '1.0',
                        quantityNumerator: '1.0',
                    },
                ],
                name: [
                    {
                        lang: 'en',
                        content: 'VS Test product for C4U',
                    },
                ],
                servicePartsManagementAspect: {
                    overcapacityTolerance: '0.0',
                    hasVariableTareWeight: false,
                    maximumCapacity: '0.000',
                },
                document: {
                    isCreatedByCAD: false,
                    pageCount: '000',
                },
                unitOfMeasures: [
                    {
                        measurementUnit: {
                            code: 'PCE',
                        },
                    },
                ],
                productionAspect: {
                    totalShelfLifeStoragePercent: 0,
                    totalShelfLife: 0,
                },
                qualityInspectionAspect: {
                    isActive: false,
                },
                salesAspect: {
                    transportationGroup: {
                        code: '0001',
                    },
                    stackingFactor: 0,
                    excessVolumeTolerance: '0.0',
                    isClosedPackagingProduct: false,
                    division: {
                        code: '00',
                    },
                    excessWeightTolerance: '0.0',
                    salesTaxes: [
                        {
                            country: {
                                code: 'DE',
                            },
                            taxRateType: {
                                code: '1',
                            },
                            taxType: {
                                code: 'TTX1',
                            },
                        },
                    ],
                    salesDistributionChains: [
                        {
                            minimumOrderQuantity: '0.0',
                            cashDiscountIndicator: false,
                            itemCategoryGroup: {
                                code: 'NORM',
                            },
                            deliveryQuantityUnit: {
                                code: 'PCE',
                            },
                            deliveryNoteMinimumDeliveryQuantity: '0.0',
                            deliveryQuantity: '0.0',
                            productHasAttributeId10: false,
                            id: '1010',
                            distributionChannel: {
                                code: '10',
                            },
                            productHasAttributeId06: false,
                            productHasAttributeId07: false,
                            productHasAttributeId04: false,
                            productHasAttributeId05: false,
                            productHasAttributeId08: false,
                            productHasAttributeId09: false,
                            minimumMakeToOrderQuantity: '0.0',
                            isMarkedForDeletion: false,
                            productHasAttributeId02: false,
                            productHasAttributeId03: false,
                            variableSalesUnitIsNotAllowed: false,
                            productHasAttributeId01: false,
                        },
                    ],
                },
                isProductLocked: false,
                isRelevantForHazardousSubstances: false,
                displayId: '3883',
                isBatchManagementRequired: false,
                isMarkedForDeletion: false,
                isConfigurable: false,
                isInBulkTransport: false,
                isApprovedBatchRecordRequired: false,
                isProductEnvironmentallyRelevant: false,
                areProductEffectiveParameterValuesAssigned: false,
                isProductHighlyViscous: false,
                type: {
                    code: 'HAWA',
                },
                productGroupLocalIdS4: 'L001',
                id: '1a60dc79-9baa-489a-8c4b-4f457db7dffd',
            },
            localIds: [
                {
                    context: {
                        application: 'MDI',
                        tenant: 'S4MDIPRDCT',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.20',
                    },
                    status: 'active',
                    localId: '3883',
                },
                {
                    context: {
                        application: 'MDI',
                        tenant: 'S4MDIPRDCT',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.929',
                    },
                    status: 'active',
                    localId: '1a60dc79-9baa-489a-8c4b-4f457db7dffd',
                },
                {
                    context: {
                        application: 's4',
                        tenant: '0LOALS1',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.20',
                    },
                    status: 'active',
                    localId: '3883',
                },
            ],
            event: 'created',
            versionId: '418e8700-451a-4779-a403-7ac93ff198f4',
        },
        {
            instance: {
                type: {
                    code: 'HAWA',
                },
                isProductHighlyViscous: false,
                areProductEffectiveParameterValuesAssigned: false,
                isProductEnvironmentallyRelevant: false,
                isApprovedBatchRecordRequired: false,
                isInBulkTransport: false,
                isConfigurable: false,
                isMarkedForDeletion: false,
                isBatchManagementRequired: false,
                displayId: '4082',
                isRelevantForHazardousSubstances: false,
                isProductLocked: false,
                salesAspect: {
                    stackingFactor: 0,
                    excessVolumeTolerance: '0.0',
                    isClosedPackagingProduct: false,
                    excessWeightTolerance: '0.0',
                },
                qualityInspectionAspect: {
                    isActive: false,
                },
                description: [
                    {
                        lang: 'en',
                        content: 'Basic text.',
                    },
                ],
                productionAspect: {
                    totalShelfLifeStoragePercent: 0,
                    totalShelfLife: 0,
                },
                unitOfMeasures: [
                    {
                        measurementUnit: {
                            code: 'PCE',
                        },
                    },
                ],
                document: {
                    pageCount: '000',
                    isCreatedByCAD: false,
                },
                servicePartsManagementAspect: {
                    overcapacityTolerance: '0.0',
                    hasVariableTareWeight: false,
                    maximumCapacity: '0.000',
                },
                name: [
                    {
                        lang: 'en',
                        content: 'Test product initial name',
                    },
                ],
                unitOfMeasureConversions: [
                    {
                        quantityDenominator: '1.0',
                        measurementUnit2: {
                            code: 'PCE',
                        },
                        quantityNumerator: '1.0',
                        measurementUnit1: {
                            code: 'PCE',
                        },
                    },
                ],
                id: 'e301494f-80f3-44c3-9c92-e47f4530ec84',
                baseUnitOfMeasure: {
                    code: 'PCE',
                },
                internalComment: [
                    {
                        lang: 'en',
                        content: 'Internal note.',
                    },
                ],
            },
            localIds: [
                {
                    context: {
                        application: 'MDI',
                        tenant: 'S4MDIPRDCT',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.20',
                    },
                    status: 'active',
                    localId: '4082',
                },
                {
                    context: {
                        application: 'MDI',
                        tenant: 'S4MDIPRDCT',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.929',
                    },
                    status: 'active',
                    localId: 'e301494f-80f3-44c3-9c92-e47f4530ec84',
                },
                {
                    context: {
                        application: 's4',
                        tenant: '0LOALS1',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.20',
                    },
                    status: 'active',
                    localId: '4082',
                },
            ],
            event: 'created',
            versionId: '444c03c3-71fc-4052-9718-f03e6192415d',
        },
    ],
    '@odata.deltaLink':
        '/v1/odm/2.3.0/sap.odm.product.Product/events?$deltatoken=F3uAu5u2.3.0u3u274u1u0u62u126u15u505u126u422u402u209u317u202u776u204u321u207u391u226u223',
};

const updatePayload = {
    '@odata.context': '$metadata#Logs',
    value: [
        {
            localIds: [
                {
                    context: {
                        application: 'MDI',
                        tenant: 'S4MDIPRDCT',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.20',
                    },
                    status: 'active',
                    localId: '4082',
                },
                {
                    context: {
                        application: 'MDI',
                        tenant: 'S4MDIPRDCT',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.929',
                    },
                    status: 'active',
                    localId: 'e301494f-80f3-44c3-9c92-e47f4530ec84',
                },
                {
                    context: {
                        application: 's4',
                        tenant: '0LOALS1',
                        type: 'sap.odm.product.Product',
                        additionalContext: 'sap.oitc.20',
                    },
                    status: 'active',
                    localId: '4082',
                },
            ],
            instance: {
                type: {
                    code: 'HAWA',
                },
                isProductHighlyViscous: false,
                areProductEffectiveParameterValuesAssigned: false,
                isProductEnvironmentallyRelevant: false,
                isApprovedBatchRecordRequired: false,
                isInBulkTransport: false,
                isConfigurable: false,
                isMarkedForDeletion: false,
                isBatchManagementRequired: false,
                displayId: '4082',
                isRelevantForHazardousSubstances: false,
                isProductLocked: false,
                salesAspect: {
                    stackingFactor: 0,
                    excessVolumeTolerance: '0.0',
                    isClosedPackagingProduct: false,
                    excessWeightTolerance: '0.0',
                },
                qualityInspectionAspect: {
                    isActive: false,
                },
                description: [
                    {
                        lang: 'en',
                        content: 'Basic text.',
                    },
                ],
                productionAspect: {
                    totalShelfLifeStoragePercent: 0,
                    totalShelfLife: 0,
                },
                unitOfMeasures: [
                    {
                        measurementUnit: {
                            code: 'PCE',
                        },
                    },
                ],
                document: {
                    pageCount: '000',
                    isCreatedByCAD: false,
                },
                servicePartsManagementAspect: {
                    overcapacityTolerance: '0.0',
                    hasVariableTareWeight: false,
                    maximumCapacity: '0.000',
                },
                name: [
                    {
                        lang: 'en',
                        content: 'Test product changed name',
                    },
                ],
                unitOfMeasureConversions: [
                    {
                        quantityDenominator: '1.0',
                        measurementUnit2: {
                            code: 'PCE',
                        },
                        quantityNumerator: '1.0',
                        measurementUnit1: {
                            code: 'PCE',
                        },
                    },
                ],
                id: 'e301494f-80f3-44c3-9c92-e47f4530ec84',
                baseUnitOfMeasure: {
                    code: 'PCE',
                },
                internalComment: [
                    {
                        lang: 'en',
                        content: 'Internal note.',
                    },
                ],
            },
            event: 'updated',
            versionId: '444c03c3-71fc-4052-9718-f03e6192415d',
        },
    ],
    '@odata.deltaLink':
        '/v1/odm/2.3.0/sap.odm.product.Product/events?$deltatoken=F3uAu5u2.3.0u3u274u1u0u62u126u15u505u126u422u402u209u317u202u776u204u321u207u391u226u224',
};

module.exports = {
    emptyPayload,
    initialPayload,
    updatePayload,
};
