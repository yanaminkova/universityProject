const commodityBill = {
    id: '376D30EA-7284-44B2-B112-5C450D20A588',
    documentNumber: 1196,
    metaData: {
        createdAt: '2021-10-12T21:10:47.413Z',
    },
    billingType: 'CHARGE',
    billStatus: 'CLOSED',
    closing: {
        method: 'AUTO',
    },
    transferStatus: 'NOT_TRANSFERRED',
    dueDate: '2021-10-12',
    billingDate: '2021-10-14',
    splitElement: '16',
    createInvoice: true,
    market: {
        id: 'electricity',
        timeZone: 'Europe/Berlin',
        currency: 'EUR',
        priceType: 'Net',
    },
    timeZone: 'Europe/Berlin',
    customer: {
        id: '442435927',
        type: 'INDIVIDUAL',
        country: 'US',
    },
    payment: {
        method: 'Invoice',
        paymentStatus: 'UNKNOWN',
    },
    netAmount: {
        currency: 'EUR',
        amount: 93.9,
    },
    customReferences: [],
    billItems: [
        {
            lineNumber: 1,
            type: 'SUBSCRIPTION',
            subscription: {
                id: '018DDE20-CEEE-49B8-BD44-9939494FF7A3',
                documentNumber: 4071,
                itemId: '822c9c08-21ec-4028-983e-bd049addf9a2',
                subscriptionDocumentId: 'C4071',
            },
            product: {
                id: '77809aa8-4f43-49ed-bdd5-2dc0d88373b5',
                code: 'C4U_2108_Electricity_Single_Rate_Product',
                name: 'C4U 2108 Electricity Single Rate Product',
            },
            ratePlan: {
                id: '115e6c0e-33e3-4160-94d6-3415bd3c54a4',
            },
            netAmount: {
                currency: 'EUR',
                amount: 93.9,
            },
            customReferences: [],
            externalObjectReferences: [],
            charges: [
                {
                    lineNumber: 1,
                    metricId: 'BASEPRICE',
                    ratingType: 'recurring',
                    ratingPeriod: {
                        start: '2021-09-11T22:00:00Z',
                        end: '2021-10-11T22:00:00Z',
                    },
                    consumedQuantity: {
                        unit: 'EB',
                        value: 1,
                    },
                    chargedQuantity: {
                        unit: 'EB',
                        value: 1,
                    },
                    includedQuantity: {
                        unit: 'EB',
                        value: 0,
                    },
                    netAmount: {
                        currency: 'EUR',
                        amount: 30,
                    },
                    pricingElements: [
                        {
                            conditionType: 'PMP2',
                            conditionValue: {
                                currency: 'EUR',
                                amount: 30,
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
                    metricId: 'ELECTRICITY_CONSUMPTION_2108',
                    subMetricId: 'TotalConsumption',
                    ratingType: 'usage',
                    ratingPeriod: {
                        start: '2021-09-11T22:00:00Z',
                        end: '2021-10-11T22:00:00Z',
                    },
                    consumedQuantity: {
                        unit: 'kWh',
                        value: 212.314,
                    },
                    chargedQuantity: {
                        unit: 'kWh',
                        value: 212.314,
                    },
                    includedQuantity: {
                        unit: 'kWh',
                        value: 0,
                    },
                    netAmount: {
                        currency: 'EUR',
                        amount: 63.9,
                    },
                    pricingElements: [
                        {
                            conditionType: 'SU03',
                            conditionValue: {
                                currency: 'EUR',
                                amount: 63.9,
                            },
                            step: 1,
                        },
                    ],
                    reversal: false,
                    usageRecords: [
                        {
                            id: '91827f87-4b30-4bb3-b076-d12a1be719ea',
                            category: 'MEASURED',
                            startedAt: '2021-09-11T22:00:00.000Z',
                            endedAt: '2021-10-11T22:00:00.000Z',
                            metricId: 'ELECTRICITY_CONSUMPTION_2108',
                            quantity: 212.314,
                            userTechnicalId:
                                '55e9326f-1608-41e8-8978-58bbd5f28237',
                            createdAt: '2021-10-12T21:10:57.864Z',
                            subMetricId: 'TotalConsumption',
                            subscriptionNumber: 4071,
                            subscriptionDocumentId: 'C4071',
                            externalId:
                                'ca13afe6-92d5-47ff-b9e0-ffa926cbf964:5525dbf7-e25e-4673-86a5-a80befc24ac2:ELECTRICITY_CONSUMPTION_2108',
                            isAssigned: true,
                            customReferences: [],
                        },
                    ],
                    technicalResourceIds: [
                        '55e9326f-1608-41e8-8978-58bbd5f28237',
                    ],
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
            credits: [],
            markedForDeletion: false,
        },
    ],
    containsDeletableBillItems: false,
};
const customerDetails = {
    customerNumber: '5135507660',
    personalInfo: {
        firstName: 'C4UF Retailer',
        lastName: 'Test',
    },
    corporateInfo: {},
    customerType: 'INDIVIDUAL',
    createdBy: 'jelena.rassohina@sap.com',
    changedBy: 'jelena.rassohina@sap.com',
    createdAt: '2021-06-10T07:31:15.282Z',
    changedAt: '2021-07-12T10:15:22.945Z',
    markets: [
        {
            marketId: 'non_commodity',
            currency: 'EUR',
            country: 'DE',
            salesArea: {
                salesOrganization: '1010',
                distributionChannel: '10',
                division: '00',
            },
            active: true,
            priceType: 'Net',
        },
        {
            marketId: 'DE',
            currency: 'EUR',
            country: 'DE',
            salesArea: {
                salesOrganization: 'U100',
                distributionChannel: 'U1',
                division: '01',
            },
            active: false,
            priceType: 'Net',
        },
        {
            marketId: 'electricity',
            currency: 'EUR',
            country: 'DE',
            salesArea: {
                salesOrganization: '1010',
                distributionChannel: '10',
                division: '01',
            },
            active: true,
            priceType: 'Net',
        },
    ],
    externalObjectReferences: [],
};
const subscriptionDetails = [
    {
        metaData: {
            version: 2,
        },
        subscriptionDocumentId: 'C7773',
        subscriptionId: 'A0C6F873-C2D2-43AE-8492-4B793A7271A9',
        subscriptionProfile: {
            id: 'commodity',
            numberPrefix: 'C',
            replicateSubscriptionsToProviderContract: true,
            requireContractAccount: true,
            forecastTypeId: 'default',
            activateUtilitiesExtension: true,
        },
        status: 'Expired',
        customer: {
            id: '2306999',
            mdiId: 'c837223e-579e-4994-bc5e-870fab4a8e8c',
        },
        payer: {
            id: '2306999',
            mdiId: 'c837223e-579e-4994-bc5e-870fab4a8e8c',
        },
        shipTo: {
            id: '2306999',
            mdiId: 'c837223e-579e-4994-bc5e-870fab4a8e8c',
        },
        billTo: {
            id: '2306999',
            mdiId: 'c837223e-579e-4994-bc5e-870fab4a8e8c',
        },
        market: {
            id: 'electricity',
            timeZone: 'Europe/Berlin',
            currency: 'EUR',
            salesArea: {
                salesOrganization: '1010',
                distributionChannel: '10',
                division: '01',
            },
        },
        subscriptionTimeZone: 'Europe/Berlin',
        validFrom: '2021-12-03T23:00:00.000Z',
        validUntil: '2022-04-03T22:00:00.000Z',
        billingCycle: 'anniversary-monthly',
        nextScheduledBillingDate: '2022-04-03T22:00:00.000Z',
        billingCycleReferenceDate: '2021-12-03T23:00:00.000Z',
        expectedTerm: {
            period: 12,
            endDate: '2022-12-03T23:00:00.000Z',
        },
        cancellationPolicy: {
            allowMidBillCycleExpiration: false,
        },
        requestedCancellationDate: '2022-03-03T23:00:00.000Z',
        canceledAt: '2022-03-04T17:34:44.159Z',
        canceledWithOverruledTerms: false,
        pauseSchedule: [],
        billSplitElement: '1008303510000001',
        withReferenceToPricingScheme: true,
        customReferences: [],
        revenueAccountingReference: {
            type: 'SUB',
            id: 'C7773',
        },
        externalObjectReferences: [
            {
                externalSystemId: 'anyCommerce',
                externalId: '1008303510',
                externalIdTypeCode:
                    'sap.edom.retailer-customer-order.displayId',
            },
        ],
        notificationSettings: [
            {
                type: 'expiration',
                source: 'product',
                offsetType: 'after',
                offset: 0,
                tags: ['Expired'],
            },
        ],
        utilitiesExtension: {
            budgetBillingType: 'SU01',
        },
        isPending: false,
        createdAt: '2022-03-04T17:22:06.809Z',
        changedAt: '2022-03-04T17:34:44.159Z',
        changedBy: 'rutuja.bandawar@sap.com',
        documentNumber: 7773,
        snapshots: [
            {
                effectiveDate: '2021-12-03T23:00:00.000Z',
                items: [
                    {
                        itemId: '000001',
                        lineNumber: '000001',
                        product: {
                            id: '87257b3c-ee52-4cd8-a8fc-b2d1018e0c1a',
                            code: 'PCS_E_T_S_M_01',
                            name: 'PCS Electricity transparent single register monthly 01',
                        },
                        subscriptionParameters: [],
                        technicalResources: [
                            {
                                id: '2234172038',
                                type: 'CONSUMPTION_ELEC',
                            },
                        ],
                        subscriptionType: 'Commercial',
                        createRating: true,
                        createBill: true,
                        createInvoice: true,
                        ratePlan: {
                            id: '6c1db4d7-3042-4e43-9dd2-b14f327c4f26',
                            source: 'product',
                        },
                        pricing: {
                            pricingParameters: [],
                            overridableFields: [],
                        },
                        customReferences: [],
                        externalObjectReferences: [
                            {
                                externalSystemId: 'anyCommerce',
                                externalId: '000001',
                                externalIdTypeCode:
                                    'sap.edom.retailer-customer-order.itemId',
                            },
                        ],
                        contractAccount: '000000027024',
                        providerContractItems: [
                            {
                                id: '000001',
                                productId: 'CONSUMPTION_ELEC',
                                ratingType: 'usage',
                            },
                            {
                                id: '000002',
                                productId: 'BASEPRICE',
                                ratingType: 'recurring',
                            },
                        ],
                        utilitiesExtension: {
                            supplyAddress: {
                                id: 'f67d3b81-ed46-48c3-aa23-5fac6f97f292',
                                postalCode: '55257',
                            },
                            distributionSystemOperator: {
                                id: '2301170',
                                code: '9903692562385',
                            },
                            meterOperator: {
                                id: '2301168',
                                code: '9903692607804',
                            },
                            location: '123455',
                            grid: '5555',
                            deviceType: 'smart_meter',
                            geographicalCode: 'H3H2J1',
                        },
                    },
                ],
                createdAt: '2022-03-04T17:22:06.809Z',
            },
        ],
    },
];
const subscriptionDetailsActive = [
    {
        metaData: {
            version: 1,
        },
        subscriptionDocumentId: 'SB0A7808',
        subscriptionId: 'AE423FEA-A57F-417F-8011-633CAF64EAC1',
        subscriptionProfile: {
            id: 'Utilities',
            numberPrefix: 'SB0A',
            replicateSubscriptionsToProviderContract: true,
            requireContractAccount: true,
            forecastTypeId: 'default',
            activateUtilitiesExtension: true,
        },
        status: 'Active',
        customer: {
            id: '2324332',
            mdiId: '3465270e-6be1-4c7f-bd2e-edcbb9e181af',
        },
        payer: {
            id: '2324332',
            mdiId: '3465270e-6be1-4c7f-bd2e-edcbb9e181af',
        },
        shipTo: {
            id: '2324332',
            mdiId: '3465270e-6be1-4c7f-bd2e-edcbb9e181af',
        },
        billTo: {
            id: '2324332',
            mdiId: '3465270e-6be1-4c7f-bd2e-edcbb9e181af',
        },
        market: {
            id: 'electricity',
            timeZone: 'Europe/Berlin',
            currency: 'EUR',
            salesArea: {
                salesOrganization: '1010',
                distributionChannel: '10',
                division: '01',
            },
        },
        subscriptionTimeZone: 'Europe/Berlin',
        validFrom: '2021-05-31T22:00:00.000Z',
        billingCycle: 'anniversary-yearly',
        nextScheduledBillingDate: '2023-03-05T23:00:00.000Z',
        billingCycleReferenceDate: '2021-03-05T23:00:00.000Z',
        contractTerm: {
            startDate: '2021-05-31T22:00:00.000Z',
            period: 12,
            endDate: '2022-05-31T22:00:00.000Z',
        },
        renewalTerm: {
            period: 12,
            endDate: '2022-05-31T22:00:00.000Z',
        },
        expectedTerm: {
            period: 12,
            endDate: '2022-05-31T22:00:00.000Z',
        },
        cancellationPolicy: {
            allowMidBillCycleExpiration: true,
            termOfNotice: 30,
            withdrawalPeriod: 14,
            withdrawalPeriodEndDate: '2021-06-14T22:00:00.000Z',
        },
        canceledWithOverruledTerms: false,
        pauseSchedule: [],
        billSplitElement: '2237124517',
        withReferenceToPricingScheme: true,
        customReferences: [],
        revenueAccountingReference: {
            type: 'SUB',
            id: 'SB0A7808',
        },
        externalObjectReferences: [],
        notificationSettings: [
            {
                type: 'expiration',
                source: 'product',
                offsetType: 'after',
                offset: 0,
                tags: ['Expired'],
            },
        ],
        utilitiesExtension: {
            budgetBillingType: 'SU01',
        },
        isPending: false,
        createdAt: '2022-03-07T12:48:48.098Z',
        changedAt: '2022-03-07T12:48:48.098Z',
        documentNumber: 7808,
        snapshots: [
            {
                effectiveDate: '2021-05-31T22:00:00.000Z',
                items: [
                    {
                        itemId: '10',
                        lineNumber: '1',
                        product: {
                            id: 'e4c00fd9-71e3-4847-a384-6daa9adfa851',
                            code: 'PCS_E_T_S_Y_01',
                            name: 'PCS Electricity transparent single register yearly 01',
                        },
                        subscriptionParameters: [],
                        technicalResources: [
                            {
                                id: '2237124521',
                                type: 'CONSUMPTION_ELEC',
                            },
                        ],
                        subscriptionType: 'Commercial',
                        createRating: true,
                        createBill: true,
                        createInvoice: true,
                        ratePlan: {
                            id: 'a2c7c1b5-2739-4051-a6f4-d833b37f17f2',
                            source: 'product',
                        },
                        pricing: {
                            pricingParameters: [],
                            overridableFields: [],
                        },
                        customReferences: [],
                        externalObjectReferences: [],
                        contractAccount: '44985',
                        providerContractItems: [
                            {
                                id: '000001',
                                productId: 'CONSUMPTION_ELEC',
                                ratingType: 'usage',
                            },
                            {
                                id: '000002',
                                productId: 'BASEPRICE',
                                ratingType: 'recurring',
                            },
                        ],
                        utilitiesExtension: {
                            supplyAddress: {
                                id: '1e621812-66d7-48a7-a900-64efd5c8eb04',
                                postalCode: '66386',
                            },
                            distributionSystemOperator: {
                                id: 'DSO_STING',
                                code: '9900566000000',
                            },
                            meterOperator: {
                                id: 'MOS_STING',
                                code: '9906955000007',
                            },
                            location: 'market-DE',
                            grid: '66386001',
                            deviceType: 'Classic_Single_Reg',
                            geographicalCode: 'Geo-code12345',
                        },
                    },
                ],
                createdAt: '2022-03-07T12:48:48.098Z',
            },
        ],
    },
];

const finalCommodityBill = {
    id: '376D30EA-7284-44B2-B112-5C450D20A588',
    documentNumber: 1196,
    metaData: {
        createdAt: '2021-10-12T21:10:47.413Z',
    },
    billingType: 'CHARGE',
    billStatus: 'CLOSED',
    closing: {
        method: 'AUTO',
    },
    transferStatus: 'NOT_TRANSFERRED',
    dueDate: '2021-10-12',
    billingDate: '2021-10-14',
    splitElement: '16',
    createInvoice: true,
    market: {
        id: 'electricity',
        timeZone: 'Europe/Berlin',
        currency: 'EUR',
        priceType: 'Net',
    },
    timeZone: 'Europe/Berlin',
    customer: {
        id: '442435927',
        type: 'INDIVIDUAL',
        country: 'US',
    },
    payment: {
        method: 'Invoice',
        paymentStatus: 'UNKNOWN',
    },
    netAmount: {
        currency: 'EUR',
        amount: 93.9,
    },
    customReferences: [],
    billItems: [
        {
            lineNumber: 1,
            type: 'SUBSCRIPTION',
            subscription: {
                id: '48E2F573-2BC4-4217-86BD-55B088A036E2',
                documentNumber: 7386,
                itemId: '822c9c08-21ec-4028-983e-bd049addf9a2',
                subscriptionDocumentId: 'SB0A7386',
            },
            product: {
                id: '77809aa8-4f43-49ed-bdd5-2dc0d88373b5',
                code: 'C4U_2108_Electricity_Single_Rate_Product',
                name: 'C4U 2108 Electricity Single Rate Product',
            },
            ratePlan: {
                id: '115e6c0e-33e3-4160-94d6-3415bd3c54a4',
            },
            netAmount: {
                currency: 'EUR',
                amount: 93.9,
            },
            customReferences: [],
            externalObjectReferences: [],
            charges: [
                {
                    lineNumber: 1,
                    metricId: 'BASEPRICE',
                    ratingType: 'recurring',
                    ratingPeriod: {
                        start: '2021-09-11T22:00:00Z',
                        end: '2021-10-11T22:00:00Z',
                    },
                    consumedQuantity: {
                        unit: 'EB',
                        value: 1,
                    },
                    chargedQuantity: {
                        unit: 'EB',
                        value: 1,
                    },
                    includedQuantity: {
                        unit: 'EB',
                        value: 0,
                    },
                    netAmount: {
                        currency: 'EUR',
                        amount: 30,
                    },
                    pricingElements: [
                        {
                            conditionType: 'PMP2',
                            conditionValue: {
                                currency: 'EUR',
                                amount: 30,
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
                    measurementSpecification: {
                        measurementMethodId: 'TOTAL_CON',
                    },
                },
                {
                    lineNumber: 2,
                    metricId: 'ELECTRICITY_CONSUMPTION_2108',
                    subMetricId: 'TotalConsumption',
                    ratingType: 'usage',
                    ratingPeriod: {
                        start: '2021-09-11T22:00:00Z',
                        end: '2021-10-11T22:00:00Z',
                    },
                    consumedQuantity: {
                        unit: 'kWh',
                        value: 212.314,
                    },
                    chargedQuantity: {
                        unit: 'kWh',
                        value: 212.314,
                    },
                    includedQuantity: {
                        unit: 'kWh',
                        value: 0,
                    },
                    netAmount: {
                        currency: 'EUR',
                        amount: 63.9,
                    },
                    pricingElements: [
                        {
                            conditionType: 'SU03',
                            conditionValue: {
                                currency: 'EUR',
                                amount: 63.9,
                            },
                            step: 1,
                        },
                    ],
                    reversal: false,
                    usageRecords: [
                        {
                            id: '91827f87-4b30-4bb3-b076-d12a1be719ea',
                            category: 'MEASURED',
                            startedAt: '2021-09-11T22:00:00.000Z',
                            endedAt: '2021-10-11T22:00:00.000Z',
                            metricId: 'ELECTRICITY_CONSUMPTION_2108',
                            quantity: 212.314,
                            userTechnicalId:
                                '55e9326f-1608-41e8-8978-58bbd5f28237',
                            createdAt: '2021-10-12T21:10:57.864Z',
                            subMetricId: 'TotalConsumption',
                            subscriptionNumber: 4071,
                            subscriptionDocumentId: 'C4071',
                            externalId:
                                'ca13afe6-92d5-47ff-b9e0-ffa926cbf964:5525dbf7-e25e-4673-86a5-a80befc24ac2:ELECTRICITY_CONSUMPTION_2108',
                            isAssigned: true,
                            customReferences: [],
                        },
                    ],
                    technicalResourceIds: [
                        '55e9326f-1608-41e8-8978-58bbd5f28237',
                    ],
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
            credits: [],
            markedForDeletion: false,
        },
    ],
    containsDeletableBillItems: false,
};

module.exports = {
    commodityBill,
    customerDetails,
    subscriptionDetails,
    subscriptionDetailsActive,
};
