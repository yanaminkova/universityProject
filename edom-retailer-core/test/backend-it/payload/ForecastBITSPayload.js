const destinationProperties = {
    Name: 'SB-DESTINATION',
    Type: 'HTTP',
    URL: 'https://eu10.revenue.cloud.sap',
    Authentication: 'OAuth2ClientCredentials',
    ProxyType: 'Internet',
    tokenServiceURLType: 'Dedicated',
    clientId: 'sb-sap-subscription-billing!b85281|revenue-cloud!b1532',
    Description: 'set token for SB Destination',
    BITClass: '0SAP',
    CACategory: 'Y1',
    BillingProcess: 'Y001',
    tokenServiceURL:
        'https://c4uconsumerdevaws.authentication.eu10.hana.ondemand.com/oauth/token',
    SubscriptionBillingAPI: '/api/subscription/v1/subscriptions',
    BillingSubProcess: 'Y001',
    CommodityConditionType:
        'PMP1-Y001/PMP2-SU02/PMP3-SU03/PMP4-SU04/PMP5-SU05/PMP6-SU06',
    SBBusinessSystem: 'c4uconsumerdevaws',
    MarketBusinessConfigAPI: '/api/business-config/v1/config/Global/Market/v1',
    clientSecret:
        'f593ed44-2f67-4cce-ba84-ca91d57b2dfa$oLxx0oQrXKH6MzBK29daSk65tKLrKeZQj_SB0bO_dpQ=',
    S4BusinessSystem: '0LOALS1',
    ConditionType: 'PMP1-Y001/PMP2-Y001/PMP3-Y001',
    CommodityBillingSubProcess: 'SU01',
    ForecastInitSubprocess: 'SU03',
    ForecastAdjSubprocess: 'SU04',
};
const billingForecasts = {
    tenantId: '7dd7eebf-04fe-4886-bbb0-b8b5c2276f1b',
    customerId: '2324332',
    payerId: '2324332',
    customerMdiId: '3465270e-6be1-4c7f-bd2e-edcbb9e181af',
    payerMdiId: '3465270e-6be1-4c7f-bd2e-edcbb9e181af',
    subscriptionId: 'f026efa7-b124-4706-a999-31c208b004a7',
    subscriptionDocumentId: 'C7694',
    subscriptionValidFrom: '2021-05-31T22:00:00Z',
    subscriptionExpectedTermEndDate: '2022-05-31T22:00:00Z',
    subscriptionCreatedAt: '2022-03-02T12:31:00.440Z',
    subscriptionChangedAt: '2022-03-02T12:31:00.440Z',
    subscriptionVersion: 1,
    subscriptionTimeZone: 'Europe/Berlin',
    billingCycle: 'anniversary-yearly',
    billingCycleReferenceDate: '2021-02-28T23:00:00Z',
    market: {
        id: 'electricity',
        timeZone: 'Europe/Berlin',
        currency: 'EUR',
        priceType: 'Net',
        salesArea: {
            salesOrganization: '1010',
            distributionChannel: '10',
            division: '01',
        },
    },
    forecasts: [
        {
            forecastId: 'c63bc8a9-049c-48ae-a462-b76f1983599d',
            subscriptionItemId: '10',
            forecastTypeId: 'default',
            horizon: 1,
            horizonEndDate: '2023-02-28T23:00:00Z',
            forecastEndDate: '2023-02-28T23:00:00Z',
            obsolete: false,
            items: [
                {
                    itemId: '7097c926-2c28-43ee-9a1e-94616828f8f5',
                    metricId: 'BASEPRICE',
                    ratePlanId: 'a2c7c1b5-2739-4051-a6f4-d833b37f17f2',
                    contractAccount: '44985',
                    providerContractItemId: '000002',
                    ratingType: 'recurring',
                    billingType: 'CHARGE',
                    monetaryAmount: {
                        amount: 265.2,
                        currency: 'EUR',
                        taxIncluded: false,
                    },
                    quantity: {
                        value: 1.0,
                        unit: 'EA',
                    },
                    dueAt: '2023-02-28T23:00:00Z',
                    ratingPeriod: {
                        start: '2022-02-28T23:00:00Z',
                        end: '2023-02-28T23:00:00Z',
                    },
                    paused: false,
                    pricingElements: [
                        {
                            step: 110,
                            priceElementSpecificationCode: 'RecurringPriceRef',
                            name: 'Recurring Price Reference',
                            statistical: false,
                            conditionType: 'SU15',
                            conditionValue: {
                                amount: 132.6,
                                currency: 'EUR',
                            },
                        },
                        {
                            step: 100,
                            priceElementSpecificationCode: 'RecurringPrice',
                            name: 'Recurring Price',
                            statistical: false,
                            conditionType: 'SU02',
                            conditionValue: {
                                amount: 132.6,
                                currency: 'EUR',
                            },
                        },
                    ],
                },
                {
                    itemId: '4fcab421-6cd5-4e5c-812a-c4ed7e51a8e3',
                    metricId: 'CONSUMPTION_ELEC',
                    ratePlanId: 'a2c7c1b5-2739-4051-a6f4-d833b37f17f2',
                    contractAccount: '44985',
                    providerContractItemId: '000001',
                    ratingType: 'usage',
                    billingType: 'CHARGE',
                    monetaryAmount: {
                        amount: 1306.606,
                        currency: 'EUR',
                        taxIncluded: false,
                    },
                    quantity: {
                        value: 2722.094,
                        unit: 'KWH',
                    },
                    dueAt: '2023-02-28T23:00:00Z',
                    ratingPeriod: {
                        start: '2022-02-28T23:00:00Z',
                        end: '2023-02-28T23:00:00Z',
                    },
                    paused: false,
                    pricingElements: [
                        {
                            step: 210,
                            priceElementSpecificationCode:
                                'UsagePriceReference',
                            name: 'Usage-Based Price Reference',
                            statistical: false,
                            conditionType: 'SU03',
                            conditionValue: {
                                amount: 653.303,
                                currency: 'EUR',
                            },
                        },
                        {
                            step: 200,
                            priceElementSpecificationCode: 'UsagePrice',
                            name: 'Usage-Based Price',
                            statistical: false,
                            conditionType: 'SU01',
                            conditionValue: {
                                amount: 653.303,
                                currency: 'EUR',
                            },
                        },
                        {
                            step: 220,
                            priceElementSpecificationCode: 'UsagePriceRef',
                            name: 'Usage-Based Price Reference (2)',
                            statistical: true,
                            conditionType: '',
                            conditionValue: {
                                amount: 653.303,
                                currency: 'EUR',
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
const bill = {
    id: '383821B4-AFC0-4CFF-8840-899EF4C65DDA',
    documentNumber: 11133,
    metaData: {
        createdAt: '2022-03-02T12:31:05.455Z',
    },
    billingType: 'CHARGE',
    billStatus: 'CLOSED',
    closing: {
        method: 'MANUAL',
    },
    transferStatus: 'NOT_TRANSFERRED',
    dueDate: '2022-03-01',
    billingDate: '2022-03-02',
    splitElement: '2232122731',
    createInvoice: true,
    market: {
        id: 'electricity',
        timeZone: 'Europe/Berlin',
        currency: 'EUR',
        priceType: 'Net',
    },
    timeZone: 'Europe/Berlin',
    customer: {
        id: '2324332',
        type: 'INDIVIDUAL',
        country: 'DE',
    },
    payer: {
        id: '2324332',
        country: 'DE',
        type: 'INDIVIDUAL',
    },
    billTo: {
        id: '2324332',
        country: 'DE',
        type: 'INDIVIDUAL',
    },
    contractAccount: '44985',
    netAmount: {
        currency: 'EUR',
        amount: 1158.356,
    },
    customReferences: [],
    billItems: [
        {
            lineNumber: 1,
            type: 'SUBSCRIPTION',
            subscription: {
                id: 'F026EFA7-B124-4706-A999-31C208B004A7',
                documentNumber: 7694,
                itemId: '10',
                subscriptionDocumentId: 'C7694',
            },
            product: {
                id: 'e4c00fd9-71e3-4847-a384-6daa9adfa851',
                code: 'PCS_E_T_S_Y_01',
                name: 'PCS Electricity transparent single register yearly 01',
            },
            ratePlan: {
                id: 'a2c7c1b5-2739-4051-a6f4-d833b37f17f2',
            },
            netAmount: {
                currency: 'EUR',
                amount: 1158.356,
            },
            shipTo: {
                id: '2324332',
                country: 'DE',
                type: 'INDIVIDUAL',
            },
            customReferences: [],
            externalObjectReferences: [],
            charges: [
                {
                    lineNumber: 1,
                    metricId: 'BASEPRICE',
                    ratingType: 'recurring',
                    ratingPeriod: {
                        start: '2021-05-31T22:00:00Z',
                        end: '2022-02-28T23:00:00Z',
                    },
                    consumedQuantity: {
                        unit: 'EA',
                        value: 1,
                    },
                    chargedQuantity: {
                        unit: 'EA',
                        value: 1,
                    },
                    includedQuantity: {
                        unit: 'EA',
                        value: 0,
                    },
                    netAmount: {
                        currency: 'EUR',
                        amount: 198.356,
                    },
                    withReferenceToPricingScheme: true,
                    pricingElements: [
                        {
                            step: 100,
                            priceElementSpecificationCode: 'RecurringPrice',
                            name: 'Recurring Price',
                            statistical: false,
                            conditionType: 'SU02',
                            conditionValue: {
                                currency: 'EUR',
                                amount: 99.178,
                            },
                        },
                        {
                            step: 110,
                            priceElementSpecificationCode: 'RecurringPriceRef',
                            name: 'Recurring Price Reference',
                            statistical: false,
                            conditionType: 'SU15',
                            conditionValue: {
                                currency: 'EUR',
                                amount: 99.178,
                            },
                        },
                    ],
                    reversal: false,
                    usageRecords: [],
                    externalObjectReferences: [
                        {
                            externalId: '000002',
                            externalIdTypeCode:
                                'sap.s4.provider-contract.item.id',
                        },
                    ],
                },
                {
                    lineNumber: 2,
                    metricId: 'CONSUMPTION_ELEC',
                    subMetricId: 'TotalConsumption',
                    ratingType: 'usage',
                    ratingPeriod: {
                        start: '2021-05-31T22:00:00Z',
                        end: '2022-02-28T23:00:00Z',
                    },
                    consumedQuantity: {
                        unit: 'KWH',
                        value: 2000,
                    },
                    chargedQuantity: {
                        unit: 'KWH',
                        value: 2000,
                    },
                    includedQuantity: {
                        unit: 'KWH',
                        value: 0,
                    },
                    netAmount: {
                        currency: 'EUR',
                        amount: 960,
                    },
                    withReferenceToPricingScheme: true,
                    pricingElements: [
                        {
                            step: 200,
                            priceElementSpecificationCode: 'UsagePrice',
                            name: 'Usage-Based Price',
                            statistical: false,
                            conditionType: 'SU01',
                            conditionValue: {
                                currency: 'EUR',
                                amount: 480,
                            },
                        },
                        {
                            step: 210,
                            priceElementSpecificationCode:
                                'UsagePriceReference',
                            name: 'Usage-Based Price Reference',
                            statistical: false,
                            conditionType: 'SU03',
                            conditionValue: {
                                currency: 'EUR',
                                amount: 480,
                            },
                        },
                        {
                            step: 220,
                            priceElementSpecificationCode: 'UsagePriceRef',
                            name: 'Usage-Based Price Reference (2)',
                            statistical: true,
                            conditionType: '',
                            conditionValue: {
                                currency: 'EUR',
                                amount: 480,
                            },
                        },
                    ],
                    reversal: false,
                    usageRecords: [
                        {
                            id: 'fe4b25f6-64ec-4cee-9802-72b5492eb017',
                            category: 'MEASURED',
                            startedAt: '2021-05-31T22:00:00.000Z',
                            endedAt: '2022-02-28T23:00:00.000Z',
                            metricId: 'CONSUMPTION_ELEC',
                            quantity: 2000,
                            userTechnicalId: '2232122735',
                            createdAt: '2022-03-02T12:31:15.568Z',
                            subMetricId: 'TotalConsumption',
                            subscriptionNumber: 7694,
                            subscriptionDocumentId: 'C7694',
                            externalId:
                                'bb18fdec-5bf3-472d-95a7-7beb7df1f3ca:2e59c026-172d-4d09-8173-ad75fc05a7a4:CONSUMPTION_ELEC',
                            isAssigned: true,
                            customReferences: [],
                        },
                    ],
                    technicalResourceIds: ['2232122735'],
                    externalObjectReferences: [
                        {
                            externalId: '000001',
                            externalIdTypeCode:
                                'sap.s4.provider-contract.item.id',
                        },
                    ],
                    measurementSpecification: {
                        measurementMethodId: 'TOTAL_CON',
                    },
                },
            ],
            markedForDeletion: false,
            credits: [],
        },
    ],
    containsDeletableBillItems: false,
};
const meterConfig = {
    Meter: [
        {
            mRID: ['b7f84488-9bef-448c-b011-8f637ce7dd6f'],
            Names: [
                {
                    name: ['12232122735'],
                    NameType: [
                        {
                            name: ['MeteringLocation'],
                            NameTypeAuthority: [
                                {
                                    name: ['SAP'],
                                },
                            ],
                        },
                    ],
                },
            ],
            amrSystem: ['METER_AMR_SYSTEM'],
            isVirtual: ['false'],
            serialNumber: ['2232122735'],
            timeZone: ['Europe/Berlin'],
            timeZoneOffset: ['120'],
            ConfigurationEvents: [
                {
                    effectiveDateTime: ['2021-05-31T22:00:00Z'],
                },
            ],
            SimpleEndDeviceFunction: [
                {
                    $: {
                        ref: 'f5f3a116-e0e8-4c85-9cee-4df1b28fe0a1',
                    },
                },
            ],
            EndDeviceInfo: [
                {
                    AssetModel: [
                        {
                            modelNumber: ['Model - DC_AMI_LL'],
                            Manufacturer: [
                                {
                                    name: [
                                        'o3 - Telefonica.f5f3a116-e0e8-4c85-9cee-4df1b28fe0a1',
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            lifecycle: [
                {
                    installationDate: ['2021-06-01'],
                },
            ],
        },
    ],
    ReadingType: [
        {
            Names: [
                {
                    name: ['0.26.0.1.1.1.12.0.0.0.0.0.0.0.224.3.72.0'],
                    NameType: [
                        {
                            name: ['NameType'],
                            NameTypeAuthority: [
                                {
                                    name: ['NameTypeAuthority'],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            Names: [
                {
                    name: ['32.0.0.9.1.1.12.0.0.0.0.0.0.0.0.3.72.0'],
                    NameType: [
                        {
                            name: ['NameType'],
                            NameTypeAuthority: [
                                {
                                    name: ['NameTypeAuthority'],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    SimpleEndDeviceFunction: [
        {
            mRID: ['f5f3a116-e0e8-4c85-9cee-4df1b28fe0a1'],
            enabled: ['true'],
            Registers: [
                {
                    mRID: ['5551dd80-24e5-48ad-b2fe-f21c5a9aa9d7'],
                    isVirtual: ['false'],
                    leftDigitCount: ['9'],
                    rightDigitCount: ['3'],
                    Channels: [
                        {
                            mRID: ['05207b6d-d371-4257-a2af-708cb4b8b489'],
                            identificationSystemCode: ['1-1:1.8.0'],
                            measurementTask: ['measurementTask'],
                            slpProfileID: [
                                'fac9335f-2e36-47b2-80d0-8168eca2689c',
                            ],
                            veeCode: ['1004'],
                            ReadingType: [
                                {
                                    $: {
                                        ref: '0.26.0.1.1.1.12.0.0.0.0.0.0.0.224.3.72.0',
                                    },
                                },
                            ],
                        },
                    ],
                    RegisterMultiplier: [
                        {
                            mRID: ['8cc90d5e-838e-4d14-82bf-721ff21ad4d9'],
                            kind: ['kH'],
                            value: ['1'],
                        },
                    ],
                },
                {
                    mRID: ['5c7b7e5a-f149-47fe-8175-1a11babaeb5e'],
                    isVirtual: ['true'],
                    leftDigitCount: ['9'],
                    rightDigitCount: ['3'],
                    Channels: [
                        {
                            mRID: ['e6999471-c557-4f28-a880-7f641052c5d3'],
                            identificationSystemCode: ['1-1:1.9.0'],
                            measurementTask: ['measurementTask'],
                            slpProfileID: [
                                'fac9335f-2e36-47b2-80d0-8168eca2689c',
                            ],
                            veeCode: ['1004'],
                            ReadingType: [
                                {
                                    $: {
                                        ref: '32.0.0.9.1.1.12.0.0.0.0.0.0.0.0.3.72.0',
                                    },
                                },
                            ],
                        },
                    ],
                    RegisterMultiplier: [
                        {
                            mRID: ['e0460700-64b3-4d46-bec5-3d8740217d76'],
                            kind: ['kH'],
                            value: ['1'],
                        },
                    ],
                },
            ],
        },
    ],
};
const billableItemsBasicCreate = [
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000001-110',
        CABllbleItmClass: '0SAP',
        CABillgSubprocess: 'SU03',
        CABllbleItmType: 'SU15',
        BusinessPartner: {
            InternalID: '2324332',
        },
        ContractAccount: {
            InternalID: '44985',
        },
        CAContract: 'C7694',
        CAProviderContractItemNumber: '000002',
        CASubApplication: 'P',
        CABllbleItmDate: '2022-03-01',
        CABllbleItmStartDate: '2022-03-01',
        CABllbleItmEndDate: '2023-03-01',
        CABllbleItmTime: '23:59:59',
        CABllbleItmStartTime: '23:59:59',
        CABllbleItmEndTime: '23:59:59',
        CABillgFirstDate: '2021-06-01',
        CABllbleItmAmount: {
            attributes: {
                currencyCode: 'EUR',
            },
            $value: 132.6,
        },
        CABllbleItemQty: {
            attributes: {
                unit: 'DAY',
            },
            $value: 1,
        },
        CAInvcgIsItemPostingRelevant: 'true',
        CAInvcgIsItemPrintingRelevant: 'true',
        CABllbleItmControlOfUnit: 6,
        CABllbleItmSimlnSts: 1,
        CABllbleItmGroupingTextData: 1,
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000002-100',
        CABllbleItmClass: '0SAP',
        CABillgSubprocess: 'SU03',
        CABllbleItmType: 'SU02',
        BusinessPartner: {
            InternalID: '2324332',
        },
        ContractAccount: {
            InternalID: '44985',
        },
        CAContract: 'C7694',
        CAProviderContractItemNumber: '000002',
        CASubApplication: 'P',
        CABllbleItmDate: '2022-03-01',
        CABllbleItmStartDate: '2022-03-01',
        CABllbleItmEndDate: '2023-03-01',
        CABllbleItmTime: '23:59:59',
        CABllbleItmStartTime: '23:59:59',
        CABllbleItmEndTime: '23:59:59',
        CABillgFirstDate: '2021-06-01',
        CABllbleItmAmount: {
            attributes: {
                currencyCode: 'EUR',
            },
            $value: 132.6,
        },
        CABllbleItemQty: {
            attributes: {
                unit: 'DAY',
            },
            $value: 1,
        },
        CAInvcgIsItemPostingRelevant: 'true',
        CAInvcgIsItemPrintingRelevant: 'true',
        CABllbleItmControlOfUnit: 6,
        CABllbleItmSimlnSts: 1,
        CABllbleItmGroupingTextData: 2,
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000003-210',
        CABllbleItmClass: '0SAP',
        CABillgSubprocess: 'SU03',
        CABllbleItmType: 'SU03',
        BusinessPartner: {
            InternalID: '2324332',
        },
        ContractAccount: {
            InternalID: '44985',
        },
        CAContract: 'C7694',
        CAProviderContractItemNumber: '000001',
        CASubApplication: 'P',
        CABllbleItmDate: '2022-03-01',
        CABllbleItmStartDate: '2022-03-01',
        CABllbleItmEndDate: '2023-03-01',
        CABllbleItmTime: '23:59:59',
        CABllbleItmStartTime: '23:59:59',
        CABllbleItmEndTime: '23:59:59',
        CABillgFirstDate: '2021-06-01',
        CABllbleItmAmount: {
            attributes: {
                currencyCode: 'EUR',
            },
            $value: 653.303,
        },
        CABllbleItemQty: {
            attributes: {
                unit: 'KWH',
            },
            $value: 2722.094,
        },
        CAInvcgIsItemPostingRelevant: 'true',
        CAInvcgIsItemPrintingRelevant: 'true',
        CABllbleItmControlOfUnit: 6,
        CABllbleItmSimlnSts: 1,
        CABllbleItmGroupingTextData: 3,
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000004-200',
        CABllbleItmClass: '0SAP',
        CABillgSubprocess: 'SU03',
        CABllbleItmType: 'SU01',
        BusinessPartner: {
            InternalID: '2324332',
        },
        ContractAccount: {
            InternalID: '44985',
        },
        CAContract: 'C7694',
        CAProviderContractItemNumber: '000001',
        CASubApplication: 'P',
        CABllbleItmDate: '2022-03-01',
        CABllbleItmStartDate: '2022-03-01',
        CABllbleItmEndDate: '2023-03-01',
        CABllbleItmTime: '23:59:59',
        CABllbleItmStartTime: '23:59:59',
        CABllbleItmEndTime: '23:59:59',
        CABillgFirstDate: '2021-06-01',
        CABllbleItmAmount: {
            attributes: {
                currencyCode: 'EUR',
            },
            $value: 653.303,
        },
        CABllbleItemQty: {
            attributes: {
                unit: 'KWH',
            },
            $value: 2722.094,
        },
        CAInvcgIsItemPostingRelevant: 'true',
        CAInvcgIsItemPrintingRelevant: 'true',
        CABllbleItmControlOfUnit: 6,
        CABllbleItmSimlnSts: 1,
        CABllbleItmGroupingTextData: 4,
    },
];
const billableItemsBasicCreateWithBill = [
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 11133,
        CABllbleItmSourceTransItmID: '000001-110',
        CABllbleItmClass: '0SAP',
        CABillgSubprocess: 'SU04',
        CABllbleItmType: 'SU15',
        BusinessPartner: {
            InternalID: '2324332',
        },
        ContractAccount: {
            InternalID: '44985',
        },
        CAContract: 'C7694',
        CAProviderContractItemNumber: '000002',
        CASubApplication: 'P',
        CABllbleItmDate: '2022-03-01',
        CABllbleItmStartDate: '2022-03-01',
        CABllbleItmEndDate: '2023-03-01',
        CABllbleItmTime: '23:59:59',
        CABllbleItmStartTime: '23:59:59',
        CABllbleItmEndTime: '23:59:59',
        CABillgFirstDate: '2022-03-02',
        CABllbleItmAmount: {
            attributes: {
                currencyCode: 'EUR',
            },
            $value: 132.6,
        },
        CABllbleItemQty: {
            attributes: {
                unit: 'DAY',
            },
            $value: 1,
        },
        CAInvcgIsItemPostingRelevant: 'true',
        CAInvcgIsItemPrintingRelevant: 'true',
        CABllbleItmControlOfUnit: 6,
        CABllbleItmSimlnSts: 1,
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 11133,
        CABllbleItmSourceTransItmID: '000002-100',
        CABllbleItmClass: '0SAP',
        CABillgSubprocess: 'SU04',
        CABllbleItmType: 'SU02',
        BusinessPartner: {
            InternalID: '2324332',
        },
        ContractAccount: {
            InternalID: '44985',
        },
        CAContract: 'C7694',
        CAProviderContractItemNumber: '000002',
        CASubApplication: 'P',
        CABllbleItmDate: '2022-03-01',
        CABllbleItmStartDate: '2022-03-01',
        CABllbleItmEndDate: '2023-03-01',
        CABllbleItmTime: '23:59:59',
        CABllbleItmStartTime: '23:59:59',
        CABllbleItmEndTime: '23:59:59',
        CABillgFirstDate: '2022-03-02',
        CABllbleItmAmount: {
            attributes: {
                currencyCode: 'EUR',
            },
            $value: 132.6,
        },
        CABllbleItemQty: {
            attributes: {
                unit: 'DAY',
            },
            $value: 1,
        },
        CAInvcgIsItemPostingRelevant: 'true',
        CAInvcgIsItemPrintingRelevant: 'true',
        CABllbleItmControlOfUnit: 6,
        CABllbleItmSimlnSts: 1,
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 11133,
        CABllbleItmSourceTransItmID: '000003-210',
        CABllbleItmClass: '0SAP',
        CABillgSubprocess: 'SU04',
        CABllbleItmType: 'SU03',
        BusinessPartner: {
            InternalID: '2324332',
        },
        ContractAccount: {
            InternalID: '44985',
        },
        CAContract: 'C7694',
        CAProviderContractItemNumber: '000001',
        CASubApplication: 'P',
        CABllbleItmDate: '2022-03-01',
        CABllbleItmStartDate: '2022-03-01',
        CABllbleItmEndDate: '2023-03-01',
        CABllbleItmTime: '23:59:59',
        CABllbleItmStartTime: '23:59:59',
        CABllbleItmEndTime: '23:59:59',
        CABillgFirstDate: '2022-03-02',
        CABllbleItmAmount: {
            attributes: {
                currencyCode: 'EUR',
            },
            $value: 653.303,
        },
        CABllbleItemQty: {
            attributes: {
                unit: 'KWH',
            },
            $value: 2722.094,
        },
        CAInvcgIsItemPostingRelevant: 'true',
        CAInvcgIsItemPrintingRelevant: 'true',
        CABllbleItmControlOfUnit: 6,
        CABllbleItmSimlnSts: 1,
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 11133,
        CABllbleItmSourceTransItmID: '000004-200',
        CABllbleItmClass: '0SAP',
        CABillgSubprocess: 'SU04',
        CABllbleItmType: 'SU01',
        BusinessPartner: {
            InternalID: '2324332',
        },
        ContractAccount: {
            InternalID: '44985',
        },
        CAContract: 'C7694',
        CAProviderContractItemNumber: '000001',
        CASubApplication: 'P',
        CABllbleItmDate: '2022-03-01',
        CABllbleItmStartDate: '2022-03-01',
        CABllbleItmEndDate: '2023-03-01',
        CABllbleItmTime: '23:59:59',
        CABllbleItmStartTime: '23:59:59',
        CABllbleItmEndTime: '23:59:59',
        CABillgFirstDate: '2022-03-02',
        CABllbleItmAmount: {
            attributes: {
                currencyCode: 'EUR',
            },
            $value: 653.303,
        },
        CABllbleItemQty: {
            attributes: {
                unit: 'KWH',
            },
            $value: 2722.094,
        },
        CAInvcgIsItemPostingRelevant: 'true',
        CAInvcgIsItemPrintingRelevant: 'true',
        CABllbleItmControlOfUnit: 6,
        CABllbleItmSimlnSts: 1,
    },
];
const billableItemPostingCreate = [
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000001-110',
        Division: '01',
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000002-100',
        Division: '01',
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000003-210',
        Division: '01',
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000004-200',
        Division: '01',
    },
];
const billableItemPostingCreateWithBill = [
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 11133,
        CABllbleItmSourceTransItmID: '000001-110',
        Division: '01',
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 11133,
        CABllbleItmSourceTransItmID: '000002-100',
        Division: '01',
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 11133,
        CABllbleItmSourceTransItmID: '000003-210',
        Division: '01',
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 11133,
        CABllbleItmSourceTransItmID: '000004-200',
        Division: '01',
    },
];
const billableItemsTextCreate = [
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000001-110',
        CABllbleItmGroupingTextData: 1,
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTPR',
            CABllbleItmExtnID: 'C7694-000001-110',
        },
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000002-100',
        CABllbleItmGroupingTextData: 2,
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTPR',
            CABllbleItmExtnID: 'C7694-000002-100',
        },
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000003-210',
        CABllbleItmGroupingTextData: 3,
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTPR',
            CABllbleItmExtnID: 'C7694-000003-210',
        },
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000003-210',
        CABllbleItmGroupingTextData: 3,
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTMR',
            CABllbleItmExtnID: 'C7694-000003-210',
            CABllbleItmExtnItmID: 3,
        },
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000004-200',
        CABllbleItmGroupingTextData: 4,
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTPR',
            CABllbleItmExtnID: 'C7694-000004-200',
        },
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000004-200',
        CABllbleItmGroupingTextData: 4,
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTMR',
            CABllbleItmExtnID: 'C7694-000004-200',
            CABllbleItmExtnItmID: 4,
        },
    },
];
const billableItemsMeterInfoCreate = [
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000003-210',
        ValidFromDate: '2022-03-01',
        ValidToDate: '2023-03-01',
        UtilitiesDeviceID: '2232122735',
        UtilitiesObjectIdnSystemCode: '1-1:1.8.0',
        MeterReadingCategoryCode: '03',
        Quantity: {
            attributes: {
                unitCode: 'KWH',
            },
            $value: 2722.094,
        },
        UtilitiesMeterID: 'b7f84488-9bef-448c-b011-8f637ce7dd6f',
        UtilitiesMeteringLocation: '2232122735',
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTMR',
            CABllbleItmExtnID: 'C7694-000003-210',
            CABllbleItmExtnItmID: 3,
        },
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000004-200',
        ValidFromDate: '2022-03-01',
        ValidToDate: '2023-03-01',
        UtilitiesDeviceID: '2232122735',
        UtilitiesObjectIdnSystemCode: '1-1:1.8.0',
        MeterReadingCategoryCode: '03',
        Quantity: {
            attributes: {
                unitCode: 'KWH',
            },
            $value: 2722.094,
        },
        UtilitiesMeterID: 'b7f84488-9bef-448c-b011-8f637ce7dd6f',
        UtilitiesMeteringLocation: '2232122735',
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTMR',
            CABllbleItmExtnID: 'C7694-000004-200',
            CABllbleItmExtnItmID: 4,
        },
    },
];

const billableItemsPriceCreate = [
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000001-110',
        Price: {
            Amount: {
                attributes: {
                    currencyCode: 'EUR',
                },
                $value: '0.36',
            },
            BaseQuantity: {
                attributes: {
                    unitCode: 'DAY',
                },
                $value: 1,
            },
        },
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTPR',
            CABllbleItmExtnID: 'C7694-000001-110',
        },
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000002-100',
        Price: {
            Amount: {
                attributes: {
                    currencyCode: 'EUR',
                },
                $value: '0.36',
            },
            BaseQuantity: {
                attributes: {
                    unitCode: 'DAY',
                },
                $value: 1,
            },
        },
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTPR',
            CABllbleItmExtnID: 'C7694-000002-100',
        },
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000003-210',
        Price: {
            Amount: {
                attributes: {
                    currencyCode: 'EUR',
                },
                $value: '0.24',
            },
            BaseQuantity: {
                attributes: {
                    unitCode: 'KWH',
                },
                $value: 1,
            },
        },
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTPR',
            CABllbleItmExtnID: 'C7694-000003-210',
        },
    },
    {
        CABllbleItmSourceTransType: 'REVCL',
        CABllbleItmSourceTransId: 'C7694',
        CABllbleItmSourceTransItmID: '000004-200',
        Price: {
            Amount: {
                attributes: {
                    currencyCode: 'EUR',
                },
                $value: '0.24',
            },
            BaseQuantity: {
                attributes: {
                    unitCode: 'KWH',
                },
                $value: 1,
            },
        },
        TechnicalExtension: {
            CABllbleItmExtnType: 'UTPR',
            CABllbleItmExtnID: 'C7694-000004-200',
        },
    },
];

const billableItemsPayload = {
    MessageHeader: {
        CreationDateTime: '',
        SenderBusinessSystemID: 'c4uconsumerdevaws',
        RecipientBusinessSystemID: '0LOALS1',
    },
    Parameters: {
        CAIsSimulated: false,
        CAReturnLogIsRequested: true,
    },
    BillableItemsCreate: {
        BillableItemsBasicCreate: [
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000001-110',
                CABllbleItmClass: '0SAP',
                CABillgSubprocess: 'SU03',
                CABllbleItmType: 'SU15',
                BusinessPartner: {
                    InternalID: '2324332',
                },
                ContractAccount: {
                    InternalID: '44985',
                },
                CAContract: 'C7694',
                CAProviderContractItemNumber: '000002',
                CASubApplication: 'P',
                CABllbleItmDate: '2022-03-01',
                CABllbleItmStartDate: '2022-03-01',
                CABllbleItmEndDate: '2023-03-01',
                CABllbleItmTime: '23:59:59',
                CABllbleItmStartTime: '23:59:59',
                CABllbleItmEndTime: '23:59:59',
                CABillgFirstDate: '2021-06-01',
                CABllbleItmAmount: {
                    attributes: {
                        currencyCode: 'EUR',
                    },
                    $value: 132.6,
                },
                CABllbleItemQty: {
                    attributes: {
                        unit: 'DAY',
                    },
                    $value: 1,
                },
                CAInvcgIsItemPostingRelevant: 'true',
                CAInvcgIsItemPrintingRelevant: 'true',
                CABllbleItmControlOfUnit: 6,
                CABllbleItmSimlnSts: 1,
                CABllbleItmGroupingTextData: 1,
            },
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000002-100',
                CABllbleItmClass: '0SAP',
                CABillgSubprocess: 'SU03',
                CABllbleItmType: 'SU02',
                BusinessPartner: {
                    InternalID: '2324332',
                },
                ContractAccount: {
                    InternalID: '44985',
                },
                CAContract: 'C7694',
                CAProviderContractItemNumber: '000002',
                CASubApplication: 'P',
                CABllbleItmDate: '2022-03-01',
                CABllbleItmStartDate: '2022-03-01',
                CABllbleItmEndDate: '2023-03-01',
                CABllbleItmTime: '23:59:59',
                CABllbleItmStartTime: '23:59:59',
                CABllbleItmEndTime: '23:59:59',
                CABillgFirstDate: '2021-06-01',
                CABllbleItmAmount: {
                    attributes: {
                        currencyCode: 'EUR',
                    },
                    $value: 132.6,
                },
                CABllbleItemQty: {
                    attributes: {
                        unit: 'DAY',
                    },
                    $value: 1,
                },
                CAInvcgIsItemPostingRelevant: 'true',
                CAInvcgIsItemPrintingRelevant: 'true',
                CABllbleItmControlOfUnit: 6,
                CABllbleItmSimlnSts: 1,
                CABllbleItmGroupingTextData: 2,
            },
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000003-210',
                CABllbleItmClass: '0SAP',
                CABillgSubprocess: 'SU03',
                CABllbleItmType: 'SU03',
                BusinessPartner: {
                    InternalID: '2324332',
                },
                ContractAccount: {
                    InternalID: '44985',
                },
                CAContract: 'C7694',
                CAProviderContractItemNumber: '000001',
                CASubApplication: 'P',
                CABllbleItmDate: '2022-03-01',
                CABllbleItmStartDate: '2022-03-01',
                CABllbleItmEndDate: '2023-03-01',
                CABllbleItmTime: '23:59:59',
                CABllbleItmStartTime: '23:59:59',
                CABllbleItmEndTime: '23:59:59',
                CABillgFirstDate: '2021-06-01',
                CABllbleItmAmount: {
                    attributes: {
                        currencyCode: 'EUR',
                    },
                    $value: 653.303,
                },
                CABllbleItemQty: {
                    attributes: {
                        unit: 'KWH',
                    },
                    $value: 2722.094,
                },
                CAInvcgIsItemPostingRelevant: 'true',
                CAInvcgIsItemPrintingRelevant: 'true',
                CABllbleItmControlOfUnit: 6,
                CABllbleItmSimlnSts: 1,
                CABllbleItmGroupingTextData: 3,
            },
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000004-200',
                CABllbleItmClass: '0SAP',
                CABillgSubprocess: 'SU03',
                CABllbleItmType: 'SU01',
                BusinessPartner: {
                    InternalID: '2324332',
                },
                ContractAccount: {
                    InternalID: '44985',
                },
                CAContract: 'C7694',
                CAProviderContractItemNumber: '000001',
                CASubApplication: 'P',
                CABllbleItmDate: '2022-03-01',
                CABllbleItmStartDate: '2022-03-01',
                CABllbleItmEndDate: '2023-03-01',
                CABllbleItmTime: '23:59:59',
                CABllbleItmStartTime: '23:59:59',
                CABllbleItmEndTime: '23:59:59',
                CABillgFirstDate: '2021-06-01',
                CABllbleItmAmount: {
                    attributes: {
                        currencyCode: 'EUR',
                    },
                    $value: 653.303,
                },
                CABllbleItemQty: {
                    attributes: {
                        unit: 'KWH',
                    },
                    $value: 2722.094,
                },
                CAInvcgIsItemPostingRelevant: 'true',
                CAInvcgIsItemPrintingRelevant: 'true',
                CABllbleItmControlOfUnit: 6,
                CABllbleItmSimlnSts: 1,
                CABllbleItmGroupingTextData: 4,
            },
        ],
        BillableItemsPostingCreate: [
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000001-110',
                Division: '01',
            },
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000002-100',
                Division: '01',
            },
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000003-210',
                Division: '01',
            },
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000004-200',
                Division: '01',
            },
        ],
        BillableItemsTextCreate: [
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000001-110',
                CABllbleItmGroupingTextData: 1,
                TechnicalExtension: {
                    CABllbleItmExtnType: 'UTPR',
                    CABllbleItmExtnID: 'C7694-000001-110',
                },
            },
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000002-100',
                CABllbleItmGroupingTextData: 2,
                TechnicalExtension: {
                    CABllbleItmExtnType: 'UTPR',
                    CABllbleItmExtnID: 'C7694-000002-100',
                },
            },
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000003-210',
                CABllbleItmGroupingTextData: 3,
                TechnicalExtension: {
                    CABllbleItmExtnType: 'UTPR',
                    CABllbleItmExtnID: 'C7694-000003-210',
                },
            },
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000003-210',
                CABllbleItmGroupingTextData: 3,
                TechnicalExtension: {
                    CABllbleItmExtnType: 'UTMR',
                    CABllbleItmExtnID: 'C7694-000003-210',
                    CABllbleItmExtnItmID: 3,
                },
            },
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000004-200',
                CABllbleItmGroupingTextData: 4,
                TechnicalExtension: {
                    CABllbleItmExtnType: 'UTPR',
                    CABllbleItmExtnID: 'C7694-000004-200',
                },
            },
            {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: 'C7694',
                CABllbleItmSourceTransItmID: '000004-200',
                CABllbleItmGroupingTextData: 4,
                TechnicalExtension: {
                    CABllbleItmExtnType: 'UTMR',
                    CABllbleItmExtnID: 'C7694-000004-200',
                    CABllbleItmExtnItmID: 4,
                },
            },
        ],
        'n1:UtilitiesBillableItemsExtension': {
            MeterReadingInfo: [
                {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: 'C7694',
                    CABllbleItmSourceTransItmID: '000003-210',
                    ValidFromDate: '2022-03-01',
                    ValidToDate: '2023-03-01',
                    UtilitiesDeviceID: '2232122735',
                    UtilitiesObjectIdnSystemCode: '1-1:1.8.0',
                    MeterReadingCategoryCode: '03',
                    Quantity: {
                        attributes: {
                            unitCode: 'KWH',
                        },
                        $value: 2722.094,
                    },
                    UtilitiesMeterID: 'b7f84488-9bef-448c-b011-8f637ce7dd6f',
                    UtilitiesMeteringLocation: '2232122735',
                    TechnicalExtension: {
                        CABllbleItmExtnType: 'UTMR',
                        CABllbleItmExtnID: 'C7694-000003-210',
                        CABllbleItmExtnItmID: 3,
                    },
                },
                {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: 'C7694',
                    CABllbleItmSourceTransItmID: '000004-200',
                    ValidFromDate: '2022-03-01',
                    ValidToDate: '2023-03-01',
                    UtilitiesDeviceID: '2232122735',
                    UtilitiesObjectIdnSystemCode: '1-1:1.8.0',
                    MeterReadingCategoryCode: '03',
                    Quantity: {
                        attributes: {
                            unitCode: 'KWH',
                        },
                        $value: 2722.094,
                    },
                    UtilitiesMeterID: 'b7f84488-9bef-448c-b011-8f637ce7dd6f',
                    UtilitiesMeteringLocation: '2232122735',
                    TechnicalExtension: {
                        CABllbleItmExtnType: 'UTMR',
                        CABllbleItmExtnID: 'C7694-000004-200',
                        CABllbleItmExtnItmID: 4,
                    },
                },
            ],
            Price: [
                {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: 'C7694',
                    CABllbleItmSourceTransItmID: '000001-110',
                    Price: {
                        Amount: {
                            attributes: {
                                currencyCode: 'EUR',
                            },
                            $value: '0.36',
                        },
                        BaseQuantity: {
                            attributes: {
                                unitCode: 'DAY',
                            },
                            $value: 1,
                        },
                    },
                    TechnicalExtension: {
                        CABllbleItmExtnType: 'UTPR',
                        CABllbleItmExtnID: 'C7694-000001-110',
                    },
                },
                {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: 'C7694',
                    CABllbleItmSourceTransItmID: '000002-100',
                    Price: {
                        Amount: {
                            attributes: {
                                currencyCode: 'EUR',
                            },
                            $value: '0.36',
                        },
                        BaseQuantity: {
                            attributes: {
                                unitCode: 'DAY',
                            },
                            $value: 1,
                        },
                    },
                    TechnicalExtension: {
                        CABllbleItmExtnType: 'UTPR',
                        CABllbleItmExtnID: 'C7694-000002-100',
                    },
                },
                {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: 'C7694',
                    CABllbleItmSourceTransItmID: '000003-210',
                    Price: {
                        Amount: {
                            attributes: {
                                currencyCode: 'EUR',
                            },
                            $value: '0.24',
                        },
                        BaseQuantity: {
                            attributes: {
                                unitCode: 'KWH',
                            },
                            $value: 1,
                        },
                    },
                    TechnicalExtension: {
                        CABllbleItmExtnType: 'UTPR',
                        CABllbleItmExtnID: 'C7694-000003-210',
                    },
                },
                {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: 'C7694',
                    CABllbleItmSourceTransItmID: '000004-200',
                    Price: {
                        Amount: {
                            attributes: {
                                currencyCode: 'EUR',
                            },
                            $value: '0.24',
                        },
                        BaseQuantity: {
                            attributes: {
                                unitCode: 'KWH',
                            },
                            $value: 1,
                        },
                    },
                    TechnicalExtension: {
                        CABllbleItmExtnType: 'UTPR',
                        CABllbleItmExtnID: 'C7694-000004-200',
                    },
                },
            ],
        },
    },
};

module.exports = {
    destinationProperties,
    billingForecasts,
    bill,
    meterConfig,
    billableItemsBasicCreate,
    billableItemsBasicCreateWithBill,
    billableItemPostingCreate,
    billableItemPostingCreateWithBill,
    billableItemsTextCreate,
    billableItemsMeterInfoCreate,
    billableItemsPriceCreate,
    billableItemsPayload,
};
