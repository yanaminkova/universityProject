const API_Item_Type = `/api/v1/CustomerOrderItemTypeCodes`;
const Electric_Bike_Product = {
    id: '8fa373ad-273a-498b-b38b-e42f42d4ca76',
    displayId: 'new_electricity_product',
    name: 'new_electricity_product',
};

const type_code_USB1 = {
    name: 'Subscription',
    descr: null,
    code: 'USB1',
};
const type_code_USB2 = {
    name: 'Subscription',
    descr: null,
    code: 'USB2',
};
const type_code_USB3 = {
    name: 'Subscription',
    descr: null,
    code: 'USB3',
};
const type_code_USB5 = {
    name: 'Subscription',
    descr: null,
    code: 'USB5',
};
const Each_Quantity_Unit = {
    name: 'Each',
    descr: null,
    code: 'EA',
};
const Piece_Quantity_Unit = {
    name: 'Piece',
    descr: null,
    code: 'PC',
};
const market = {
    configSetId: 'Global',
    key: 'Market',
    version: 'v1',
    value: {
        markets: [
            {
                externalReference: '',
                billFrom: {
                    country: 'DE',
                    city: '',
                    street: '',
                    companyName: 'cloud for utilities',
                    postalCode: '',
                    houseNumber: '',
                    additionalAddressInfo: '',
                    state: 'BW',
                },
                usageOfTax: {
                    taxActivation: false,
                },
                salesArea: {
                    division: '01',
                    distributionChannel: 'U3',
                    salesOrganization: 'U100',
                },
                name: 'utilitiesspa',
                priceType: 'Net',
                timeZone: 'Europe/Berlin',
                currency: 'EUR',
                language: 'en',
                id: 'utilitiesspa',
            },
            {
                externalReference: '',
                billFrom: {
                    country: 'DE',
                    city: '',
                    street: '',
                    companyName: 'cloud for utilities',
                    postalCode: '',
                    houseNumber: '',
                    additionalAddressInfo: '',
                    state: 'BW',
                },
                usageOfTax: {
                    taxActivation: false,
                },
                salesArea: {
                    division: '00',
                    distributionChannel: '10',
                    salesOrganization: '1010',
                },
                name: 'utilitiesspa',
                priceType: 'Net',
                timeZone: 'Europe/Berlin',
                currency: 'EUR',
                language: 'en',
                id: 'utilitiesspa',
            },
            {
                externalReference: '',
                billFrom: {
                    country: 'CA',
                    city: '',
                    street: '',
                    companyName: 'SAP',
                    postalCode: '',
                    houseNumber: '',
                    additionalAddressInfo: '',
                    state: 'QC',
                },
                usageOfTax: {
                    taxActivation: false,
                },
                salesArea: {
                    division: '01',
                    distributionChannel: 'U2',
                    salesOrganization: 'U100',
                },
                name: 'A1',
                priceType: 'Net',
                timeZone: 'UTC',
                currency: 'CAD',
                language: 'en',
                id: 'A1',
            },
            {
                externalReference: '',
                billFrom: {
                    country: 'DE',
                    city: 'Walldorf',
                    street: 'Hasso-Plattner-Ring',
                    companyName: 'utilities',
                    postalCode: '69190',
                    houseNumber: '7',
                    additionalAddressInfo: '',
                    state: 'BW',
                },
                usageOfTax: {
                    taxActivation: false,
                },
                salesArea: {
                    division: '01',
                    distributionChannel: 'U1',
                    salesOrganization: 'U100',
                },
                name: 'utilities',
                priceType: 'Net',
                timeZone: 'Europe/Berlin',
                currency: 'EUR',
                language: 'en',
                id: 'utilities',
            },
        ],
        defaultMarket: 'utilities',
    },
};
const subscription_response = {
    subscriptionDocumentId: 815,
    subscriptionId: '589DAA78-D280-41D3-B51B-5B4B80E3F46B',
    status: 'Active',
};
const technical_resource = {
    mixins: {
        subscriptionProduct: {
            technicalResources: [
                {
                    type: 'ELECTRICITY_CONSUMPTION',
                    idType: 'Meter MRID',
                },
            ],
        },
    },
};
const SalesOrg_U100 = {
    displayId: 'U100',
    name: 'SAP AG',
};
const SalesOrg_U101 = {
    displayId: 'U101',
    name: 'SAP AG',
};
const PaymentTermCodes_001 = {
    name: 'End Of Month',
    descr: null,
    code: '0001',
};
const Division_01 = {
    name: 'Electricity',
    descr: null,
    code: '01',
};
const DistributionChannel_U1 = {
    name: 'Channel U1',
    descr: null,
    code: 'U1',
};
const Subs_Code_USB1 = {
    name: 'USB1',
    descr: null,
    code: 'USB1',
};

const Subs_Code_USB2 = {
    name: 'USB2',
    descr: null,
    code: 'USB2',
};
const Subs_Code_USB3 = {
    name: 'USB3',
    descr: null,
    code: 'USB3',
};
const Subs_Code_UMT1 = {
    name: 'UMT1',
    descr: null,
    code: 'UMT1',
};
const SalesDistribution_UMT1 = {
    name: 'SalesDistribution',
    descr: 'SalesDistribution',
    code: 'UMT1',
};
const salesOrg_1010 = {
    displayId: '1010',
    name: 'SAP AG',
};
const Division_00 = {
    name: 'Division 00',
    descr: null,
    code: '00',
};
const DistChannel_10 = {
    name: 'Channel 10',
    descr: null,
    code: '10',
};
const DistChannel_30 = {
    name: 'Channel 30',
    descr: null,
    code: '30',
};
const ProductTG11 = {
    id: '51a44728-3a45-49c9-8864-94c2b8ce7842',
    displayId: 'TG11',
    name: 'TG11',
};
const ProductXYZ = {
    id: '044addef-02d1-467a-bb8c-cd2edd93f29f',
    displayId: 'XYZ',
    name: 'XYZ',
};
const ConditionType_YK07 = {
    name: 'YK07',
    descr: null,
    code: 'YK07',
};
const ConditionType_DRN1 = {
    name: 'DRN1',
    descr: null,
    code: 'DRN1',
};
const ConditionType_DRG1 = {
    name: 'DRG1',
    descr: null,
    code: 'DRG1',
};
const ConditionType_PPR0 = {
    name: 'PPR0',
    descr: null,
    code: 'PPR0',
};

const CancellationReason_01 = {
    name: 'Other Reason',
    descr: 'Other Reason',
    code: '01',
};

const CancellationReason_90 = {
    name: 'Overwrite',
    descr: 'Overwrite',
    code: '90',
};

const SBResponse = [
    {
        metaData: {
            version: '21',
        },
        subscriptionDocumentId: 'N4033',
    },
];

const InvalidSBResponse = [
    {
        metaData: {
            version: '21',
        },
        subscriptionDocumentId: 'N4044',
    },
];

const SBCanclResponse = {
    status: 'Canceled',
    subscriptionDocumentId: 'N4033',
    subscriptionId: '79F6EA48-F958-4792-97BF-56386BCE2187',
};

const headerCustomReference = {
    headerCustomReferences: [
        {
            typeCode: 'PO',
            id: '4711',
        },
        {
            typeCode: 'PO',
            id: '4712',
        },
    ],
};

const itemCustomReference = {
    itemCustomReferences: [
        {
            typeCode: 'PO',
            id: '4713',
        },
        {
            typeCode: 'PO',
            id: '4714',
        },
    ],
};

const itemSubscription = {
    itemSubscriptionParameters: [
        {
            code: 'SEATS',
            value: '10',
        },
        {
            code: 'HOLES',
            value: '5',
        },
    ],
};

const ShippingCondition_01 = { name: 'standard', descr: null, code: '01' };
const ShippingCondition_02 = { name: 'standard', descr: null, code: '02' };
const IncoTerms_SH = { name: 'SH', descr: null, code: 'SH' };

const salesOrderItems = {
    d: {
        results: [
            {
                SalesOrder: '12345',
                SalesOrderItem: '10',
                Material: 'TG11',
            },
        ],
    },
};

const sdResponse = {
    d: {
        SalesOrder: '12345',
    },
};

const sdResponseInvalidSalesArea = {
    d: {
        SalesOrder: '',
    },
};
const displayCIdInvalidMaterial = '1098765432';

const MCMInstance = {
    '@context':
        '$metadata#MeteringLocations(id,meteringLocationId,measurementConceptInstance(id,idText,orderer,orderer(),changeProcesses(id,processData(id,meteringLocationsPD(id,meteringLocation_id,meterOperator)))))',
    '@metadataEtag':
        'W/"0c67d38bbfb2459aa366c74cb64eb093bc5e0cf7a608a0f037609150c1fab519"',
    value: [
        {
            '@id': 'MeteringLocations(5e804b3f-bf8d-4e3c-8486-031d92f29839)',
            id: '5e804b3f-bf8d-4e3c-8486-031d92f29839',
            meteringLocationId: 'DE0021794340100000000000001111212',
            measurementConceptInstance: {
                id: 'e5481ab4-9a91-4cf2-9538-fa8278659d0e',
                idText: 'INST-3765',
                leadingGrid_code: 'SNE956610053427',
                orderer_code: '9903692562385',
                meteringLocations: [
                    {
                        id: '5e804b3f-bf8d-4e3c-8486-031d92f29839',
                        measurementConceptInstance_id:
                            'e5481ab4-9a91-4cf2-9538-fa8278659d0e',
                        idText: 'Z1',
                        type_code: 'GRIDMES',
                        position: 1,
                        modelMeteringLocation_id:
                            'eea50001-5555-5555-5555-501000000001',
                        meteringLocationId: 'DE0021794340100000000000001111212',
                        grid_code: null,
                        gridLevel_code: 'MV',
                        address_id: '7d8cef92-fe8a-40a2-b3e2-d37db827a28a',
                        lossTransformer: 0,
                        lossLine: 0,
                        lossFactor: null,
                        meteringLocationPurpose_code: null,
                        disconnectable: false,
                        transformerRequired: false,
                        deviceSerialId: 'DE0021794340100000000000001111212',
                    },
                ],
                changeProcesses: [
                    {
                        id: 'bbf9aa8c-f8ed-48a8-a315-4ca2b066bd70',
                        processData: {
                            id: '9d7c59c7-9a5c-48b5-afd2-0b41ce84aa78',
                            meteringLocationsPD: [
                                {
                                    id: '3d87c76e-8c64-4a7e-a0a5-d40dc96640dc',
                                    meteringLocation_id:
                                        '5e804b3f-bf8d-4e3c-8486-031d92f29839',
                                    meterOperator: '9903692607804',
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
};
const MeterOperatorCode = {
    up__id: 'ed5eb03d-3c78-4675-9a9a-7b95d5c90d7c',
    id: 'd07e2c29-6b13-4ba5-84ea-1c046511fece',
    validFrom: '2021-01-01',
    validTo: '2021-12-31',
    marketFunction_code: '661234',
    marketFunctionCodeNumber1: '9903692607804',
    marketFunctionSource1: 'Meter_op1',
    marketFunctionCodeNumber2: '4650614665537',
    marketFunctionSource2: 'Meter_op2',
};
const DsoCode = {
    up__id: 'ee332c45-1f7e-4ef0-b63c-2d64ce5f0364',
    id: '110a1935-75b3-4b28-b981-e9c416a0771e',
    validFrom: '2021-01-01',
    validTo: '2021-12-31',
    marketFunction_code: 'SP_DIST',
    marketFunctionCodeNumber1: '9903692562385',
    marketFunctionSource1: 'SP_Test',
    marketFunctionCodeNumber2: '5287126870177',
    marketFunctionSource2: 'SP_TEST2',
};

const DistributorBP = {
    id: 'ee332c45-1f7e-4ef0-b63c-2d64ce5f0364',
    purposes: null,
    keyWordsText: null,
    additionalKeyWordsText: null,
    kind_code: null,
    authorizationGroup_code: null,
    isNaturalPersonUnderTaxLaw: null,
    displayId: '2301170',
    businessPartnerType: 'organization',
    grouping_code: null,
    searchTerms_searchTerm1: null,
    searchTerms_searchTerm2: null,
    specialPrintMode_code: null,
    lifecycleStatus_code: null,
    isBlocked: false,
    isReleased: null,
    endOfBusinessDate: null,
    maxDeletionDate: null,
};

const MeterOperatorBP = {
    id: 'ed5eb03d-3c78-4675-9a9a-7b95d5c90d7c',
    purposes: null,
    keyWordsText: null,
    additionalKeyWordsText: null,
    kind_code: null,
    authorizationGroup_code: null,
    isNaturalPersonUnderTaxLaw: null,
    displayId: '2301168',
    businessPartnerType: 'organization',
    grouping_code: null,
    searchTerms_searchTerm1: null,
    searchTerms_searchTerm2: null,
    specialPrintMode_code: null,
    lifecycleStatus_code: null,
    isBlocked: false,
    isReleased: null,
    endOfBusinessDate: null,
    maxDeletionDate: null,
};

const partnerId = Math.floor(100000 + Math.random() * 900000);
const displayCId = Math.floor(Math.floor(1000000000 + Math.random() * 9000000));
const displaySId = displayCId + 1;

module.exports = {
    Electric_Bike_Product,
    type_code_USB1,
    type_code_USB2,
    type_code_USB3,
    type_code_USB5,
    partnerId,
    displayCId,
    displaySId,
    Each_Quantity_Unit,
    Piece_Quantity_Unit,
    market,
    subscription_response,
    technical_resource,
    SalesOrg_U100,
    SalesOrg_U101,
    PaymentTermCodes_001,
    Division_01,
    DistributionChannel_U1,
    ShippingCondition_01,
    ShippingCondition_02,
    IncoTerms_SH,
    Subs_Code_USB1,
    Subs_Code_USB2,
    Subs_Code_USB3,
    Subs_Code_UMT1,
    SalesDistribution_UMT1,
    salesOrg_1010,
    Division_00,
    DistChannel_10,
    DistChannel_30,
    ProductTG11,
    ConditionType_YK07,
    ConditionType_DRN1,
    ConditionType_DRG1,
    ConditionType_PPR0,
    salesOrderItems,
    sdResponse,
    sdResponseInvalidSalesArea,
    ProductXYZ,
    CancellationReason_01,
    CancellationReason_90,
    SBResponse,
    InvalidSBResponse,
    SBCanclResponse,
    MCMInstance,
    MeterOperatorCode,
    DsoCode,
    headerCustomReference,
    itemCustomReference,
    itemSubscription,
    DistributorBP,
    MeterOperatorBP,
};
