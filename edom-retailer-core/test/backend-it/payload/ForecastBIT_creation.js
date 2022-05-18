const Subscription = [
    {
        metaData: {
            version: 1,
        },
        subscriptionDocumentId: 'SB0A6603',
        subscriptionId: '513D292C-8883-45B8-880C-267545C5F716',
        subscriptionProfile: {
            id: 'commodity',
            numberPrefix: 'SB0A',
            replicateSubscriptionsToProviderContract: true,
            requireContractAccount: true,
            forecastTypeId: 'default',
            activateUtilitiesExtension: true,
        },
        status: 'Active',
        customer: {
            id: '2291620',
        },
        payer: {
            id: '2291620',
        },
        shipTo: {
            id: '2291620',
        },
        billTo: {
            id: '2291620',
        },
        market: {
            id: 'non_commodity',
            timeZone: 'Europe/Berlin',
            currency: 'EUR',
            salesArea: {
                salesOrganization: '1010',
                distributionChannel: '10',
                division: '00',
            },
        },
        subscriptionTimeZone: 'Europe/Berlin',
        validFrom: '2021-05-31T22:00:00.000Z',
        billingCycle: 'anniversary-yearly',
        nextScheduledBillingDate: '2023-02-02T23:00:00.000Z',
        billingCycleReferenceDate: '2021-02-02T23:00:00.000Z',
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
        billSplitElement: '222312533',
        withReferenceToPricingScheme: true,
        customReferences: [],
        revenueAccountingReference: {
            type: 'SUB',
            id: 'SB0A6603',
        },
        externalObjectReferences: [],
        notificationSettings: [],
        utilitiesExtension: {
            budgetBillingType: 'SU01',
        },
        isPending: false,
        createdAt: '2022-02-03T12:53:50.762Z',
        changedAt: '2022-02-03T12:53:50.762Z',
        documentNumber: 6603,
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
                                id: '222312536',
                                type: 'CONSUMPTION_ELEC',
                            },
                        ],
                        subscriptionType: 'Commercial',
                        createRating: true,
                        createBill: true,
                        createInvoice: true,
                        ratePlan: {
                            id: '4ce00b87-0521-4c11-bac5-a228ef48813f',
                            source: 'product',
                        },
                        pricing: {
                            pricingParameters: [],
                            overridableFields: [],
                        },
                        customReferences: [],
                        externalObjectReferences: [],
                        contractAccount: '19722',
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
                                id: '{{envUtilExtSupplyAddressId}}',
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
                createdAt: '2022-02-03T12:53:50.762Z',
            },
        ],
    },
];

const ExpiredSubscription = [
    {
        metaData: {
            version: 1,
        },
        subscriptionDocumentId: 'SB0A7386',
        subscriptionId: '48E2F573-2BC4-4217-86BD-55B088A036E2',
        subscriptionProfile: {
            id: 'commodity',
            activateUtilitiesExtension: true,
        },
        status: 'Expired',
        customer: {
            id: '2291620',
            mdiId: 'fa163e8f-4692-1edc-9cf2-76e360f0c223',
        },
        validFrom: '2021-05-31T22:00:00.000Z',
        validUntil: '2022-02-21T23:00:00.000Z',
        billingCycle: 'anniversary-yearly',
        billingCycleReferenceDate: '2021-03-31T22:00:00.000Z',
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
        cancellationReason: 'Not Paid',
        requestedCancellationDate: '2022-02-21T23:00:00.000Z',
        cancellationNoticeDate: '2022-02-21T23:00:00.000Z',
        canceledAt: '2022-02-23T07:05:52.431Z',
        canceledWithOverruledTerms: true,
        utilitiesExtension: {
            budgetBillingType: 'SU01',
        },
        isPending: false,
        createdAt: '2022-02-23T07:05:51.031Z',
        changedAt: '2022-02-23T07:05:52.431Z',
        documentNumber: 7386,
    },
];

const NonCommoditySB = [
    {
        metaData: {
            version: 1,
        },
        subscriptionDocumentId: 'N7533',
        subscriptionId: '7E40D955-6DA4-4FA0-B5E2-09391EB251D4',
        subscriptionProfile: {
            id: 'non_commodity',
            numberPrefix: 'N',
            replicateSubscriptionsToProviderContract: true,
            requireContractAccount: true,
            activateUtilitiesExtension: false,
        },
        status: 'Active',
        customer: {
            id: '2290122',
            mdiId: '6f2603b1-4914-49e3-95e8-69eafa1165e7',
        },
        market: {
            id: 'non_commodity',
            timeZone: 'Europe/Berlin',
            currency: 'EUR',
            salesArea: {
                salesOrganization: '1010',
                distributionChannel: '10',
                division: '00',
            },
        },
        subscriptionTimeZone: 'Europe/Berlin',
        validFrom: '2021-06-30T22:00:00.000Z',
        billingCycle: 'calendar-monthly',
        nextScheduledBillingDate: '2022-02-28T23:00:00.000Z',
        billingCycleReferenceDate: '2021-06-30T22:00:00.000Z',
        contractTerm: {
            startDate: '2021-06-30T22:00:00.000Z',
            period: 24,
            endDate: '2023-06-30T22:00:00.000Z',
        },
        renewalTerm: {
            period: 12,
            endDate: '2023-06-30T22:00:00.000Z',
        },
        expectedTerm: {
            period: 36,
            endDate: '2024-06-30T22:00:00.000Z',
        },
        notificationSettings: [],
        isPending: false,
        createdAt: '2022-02-25T00:20:03.763Z',
        changedAt: '2022-02-25T00:20:03.763Z',
        documentNumber: 7533,
    },
];

const BillingForecast = {
    tenantId: '7dd7eebf-04fe-4886-bbb0-b8b5c2276f1b',
    customerId: '2291620',
    payerId: '2291620',
    subscriptionId: '513d292c-8883-45b8-880c-267545c5f716',
    subscriptionDocumentId: 'SB0A6603',
    subscriptionValidFrom: '2021-05-31T22:00:00Z',
    subscriptionExpectedTermEndDate: '2022-05-31T22:00:00Z',
    subscriptionCreatedAt: '2022-02-03T12:53:50.762Z',
    subscriptionChangedAt: '2022-02-03T12:53:50.762Z',
    subscriptionVersion: 1,
    subscriptionTimeZone: 'Europe/Berlin',
    billingCycle: 'anniversary-yearly',
    billingCycleReferenceDate: '2021-02-02T23:00:00Z',
    market: {
        id: 'non_commodity',
        timeZone: 'Europe/Berlin',
        currency: 'EUR',
        priceType: 'Net',
        salesArea: {
            salesOrganization: '1010',
            distributionChannel: '10',
            division: '00',
        },
    },
    forecasts: [
        {
            forecastId: '42124d0d-d561-43e7-98a2-bf87420b357d',
            subscriptionItemId: '10',
            forecastTypeId: 'default',
            horizon: 1,
            horizonEndDate: '2023-02-02T23:00:00Z',
            forecastEndDate: '2023-02-02T23:00:00Z',
            obsolete: false,
            items: [
                {
                    itemId: 'e798a258-1de0-4e54-b6a1-945f4a352f49',
                    metricId: 'BASEPRICE',
                    ratePlanId: '4ce00b87-0521-4c11-bac5-a228ef48813f',
                    contractAccount: '19722',
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
                    dueAt: '2023-02-02T23:00:00Z',
                    ratingPeriod: {
                        start: '2022-02-02T23:00:00Z',
                        end: '2023-02-02T23:00:00Z',
                    },
                    paused: false,
                    pricingElements: [
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
                    ],
                },
                {
                    itemId: 'a3b0a54e-e855-45d8-a095-944c121645bc',
                    metricId: 'CONSUMPTION_ELEC',
                    ratePlanId: '4ce00b87-0521-4c11-bac5-a228ef48813f',
                    contractAccount: '19722',
                    providerContractItemId: '000001',
                    ratingType: 'usage',
                    billingType: 'CHARGE',
                    monetaryAmount: {
                        amount: 1430.868,
                        currency: 'EUR',
                        taxIncluded: false,
                    },
                    quantity: {
                        value: 2980.974,
                        unit: 'KWH',
                    },
                    dueAt: '2023-02-02T23:00:00Z',
                    ratingPeriod: {
                        start: '2022-02-02T23:00:00Z',
                        end: '2023-02-02T23:00:00Z',
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
                                amount: 715.434,
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
                                amount: 715.434,
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
                                amount: 715.434,
                                currency: 'EUR',
                            },
                        },
                    ],
                },
            ],
        },
    ],
};

const BillableItemsResponse = [
    null,
    '',
    'undefined',
    '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xmlns:n1="http://sap.com/xi/FI-CA-INV/Utilities/Global2" xmlns:n2="http://sap.com/xi/SAPGlobal20/Global" xmlns:n3="http://sap.com/xi/FI-CAC/Global2" xmlns:tns="http://sap.com/xi/FI-CA-INV" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:sidl="http://www.sap.com/2007/03/sidl" xmlns:wsrmp="http://docs.oasis-open.org/ws-rx/wsrmp/200702" xmlns:sp="http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702" xmlns:sapsp="http://www.sap.com/webas/630/soap/features/security/policy" xmlns:wst="http://docs.oasis-open.org/ws-sx/ws-trust/200512" xmlns:sapcentraladmin="http://www.sap.com/webas/700/soap/features/CentralAdministration/" xmlns:saptrhnw05="http://www.sap.com/NW05/soap/features/transaction/" xmlns:sapcomhnd="http://www.sap.com/NW05/soap/features/commit/" xmlns:sapblock="http://www.sap.com/NW05/soap/features/blocking/" xmlns:saprmnw05="http://www.sap.com/NW05/soap/features/wsrm/" xmlns:ccts="urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0" xmlns:xi0="http://sap.com/xi/FI-CA-INV/Utilities/Global2" xmlns:xi1="http://sap.com/xi/SAPGlobal20/Global" xmlns:xi2="http://sap.com/xi/FI-CAC/Global2" xmlns:sapdoc="urn:sap:esi:documentation"><soap:Header><wsa:Action xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://sap.com/xi/FI-CA-INV/BillableItemsCreateRequest_In/BillableItemsCreateRequest_InRequest</wsa:Action><wsa:MessageID xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">uuid:c6b0cd47-7f79-4d03-98cf-729f660cafc6</wsa:MessageID></soap:Header><soap:Body><n2:BillableItemsCreateRequest xmlns:n2="http://sap.com/xi/SAPGlobal20/Global"><MessageHeader><CreationDateTime></CreationDateTime><SenderBusinessSystemID>c4uconsumerdevaws</SenderBusinessSystemID><RecipientBusinessSystemID>0LOALS1</RecipientBusinessSystemID></MessageHeader><Parameters><CAIsSimulated>false</CAIsSimulated><CAReturnLogIsRequested>true</CAReturnLogIsRequested></Parameters><BillableItemsCreate><BillableItemsBasicCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000001-100</CABllbleItmSourceTransItmID><CABllbleItmClass>0SAP</CABllbleItmClass><CABillgSubprocess>SU03</CABillgSubprocess><CABllbleItmType>SU02</CABllbleItmType><BusinessPartner><InternalID>2291620</InternalID></BusinessPartner><ContractAccount><InternalID>19722</InternalID></ContractAccount><CAContract>SB0A6603</CAContract><CAProviderContractItemNumber>000002</CAProviderContractItemNumber><CASubApplication>P</CASubApplication><CABllbleItmDate>2022-02-02</CABllbleItmDate><CABllbleItmStartDate>2022-02-02</CABllbleItmStartDate><CABllbleItmEndDate>2023-02-02</CABllbleItmEndDate><CABillgFirstDate>2021-05-31</CABillgFirstDate><CABllbleItmAmount currencyCode="EUR">132.6</CABllbleItmAmount><CABllbleItemQty unit="DAY">1</CABllbleItemQty><CAInvcgIsItemPostingRelevant>false</CAInvcgIsItemPostingRelevant><CAInvcgIsItemPrintingRelevant>true</CAInvcgIsItemPrintingRelevant><CABllbleItmGroupingTextData>1</CABllbleItmGroupingTextData><CABllbleItmControlOfUnit>6</CABllbleItmControlOfUnit><CABllbleItmSimlnSts>1</CABllbleItmSimlnSts></BillableItemsBasicCreate><BillableItemsBasicCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000002-110</CABllbleItmSourceTransItmID><CABllbleItmClass>0SAP</CABllbleItmClass><CABillgSubprocess>SU03</CABillgSubprocess><CABllbleItmType>SU15</CABllbleItmType><BusinessPartner><InternalID>2291620</InternalID></BusinessPartner><ContractAccount><InternalID>19722</InternalID></ContractAccount><CAContract>SB0A6603</CAContract><CAProviderContractItemNumber>000002</CAProviderContractItemNumber><CASubApplication>P</CASubApplication><CABllbleItmDate>2022-02-02</CABllbleItmDate><CABllbleItmStartDate>2022-02-02</CABllbleItmStartDate><CABllbleItmEndDate>2023-02-02</CABllbleItmEndDate><CABillgFirstDate>2021-05-31</CABillgFirstDate><CABllbleItmAmount currencyCode="EUR">132.6</CABllbleItmAmount><CABllbleItemQty unit="DAY">1</CABllbleItemQty><CAInvcgIsItemPostingRelevant>false</CAInvcgIsItemPostingRelevant><CAInvcgIsItemPrintingRelevant>true</CAInvcgIsItemPrintingRelevant><CABllbleItmGroupingTextData>2</CABllbleItmGroupingTextData><CABllbleItmControlOfUnit>6</CABllbleItmControlOfUnit><CABllbleItmSimlnSts>1</CABllbleItmSimlnSts></BillableItemsBasicCreate><BillableItemsBasicCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000003-210</CABllbleItmSourceTransItmID><CABllbleItmClass>0SAP</CABllbleItmClass><CABillgSubprocess>SU03</CABillgSubprocess><CABllbleItmType>SU03</CABllbleItmType><BusinessPartner><InternalID>2291620</InternalID></BusinessPartner><ContractAccount><InternalID>19722</InternalID></ContractAccount><CAContract>SB0A6603</CAContract><CAProviderContractItemNumber>000001</CAProviderContractItemNumber><CASubApplication>P</CASubApplication><CABllbleItmDate>2022-02-02</CABllbleItmDate><CABllbleItmStartDate>2022-02-02</CABllbleItmStartDate><CABllbleItmEndDate>2023-02-02</CABllbleItmEndDate><CABillgFirstDate>2021-05-31</CABillgFirstDate><CABllbleItmAmount currencyCode="EUR">715.434</CABllbleItmAmount><CABllbleItemQty unit="KWH">2980.974</CABllbleItemQty><CAInvcgIsItemPostingRelevant>false</CAInvcgIsItemPostingRelevant><CAInvcgIsItemPrintingRelevant>true</CAInvcgIsItemPrintingRelevant><CABllbleItmGroupingTextData>3</CABllbleItmGroupingTextData><CABllbleItmControlOfUnit>6</CABllbleItmControlOfUnit><CABllbleItmSimlnSts>1</CABllbleItmSimlnSts></BillableItemsBasicCreate><BillableItemsBasicCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000004-200</CABllbleItmSourceTransItmID><CABllbleItmClass>0SAP</CABllbleItmClass><CABillgSubprocess>SU03</CABillgSubprocess><CABllbleItmType>SU01</CABllbleItmType><BusinessPartner><InternalID>2291620</InternalID></BusinessPartner><ContractAccount><InternalID>19722</InternalID></ContractAccount><CAContract>SB0A6603</CAContract><CAProviderContractItemNumber>000001</CAProviderContractItemNumber><CASubApplication>P</CASubApplication><CABllbleItmDate>2022-02-02</CABllbleItmDate><CABllbleItmStartDate>2022-02-02</CABllbleItmStartDate><CABllbleItmEndDate>2023-02-02</CABllbleItmEndDate><CABillgFirstDate>2021-05-31</CABillgFirstDate><CABllbleItmAmount currencyCode="EUR">715.434</CABllbleItmAmount><CABllbleItemQty unit="KWH">2980.974</CABllbleItemQty><CAInvcgIsItemPostingRelevant>false</CAInvcgIsItemPostingRelevant><CAInvcgIsItemPrintingRelevant>true</CAInvcgIsItemPrintingRelevant><CABllbleItmGroupingTextData>4</CABllbleItmGroupingTextData><CABllbleItmControlOfUnit>6</CABllbleItmControlOfUnit><CABllbleItmSimlnSts>1</CABllbleItmSimlnSts></BillableItemsBasicCreate><BillableItemsBasicCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000005-220</CABllbleItmSourceTransItmID><CABllbleItmClass>0SAP</CABllbleItmClass><CABillgSubprocess>SU03</CABillgSubprocess><CABllbleItmType></CABllbleItmType><BusinessPartner><InternalID>2291620</InternalID></BusinessPartner><ContractAccount><InternalID>19722</InternalID></ContractAccount><CAContract>SB0A6603</CAContract><CAProviderContractItemNumber>000001</CAProviderContractItemNumber><CASubApplication>P</CASubApplication><CABllbleItmDate>2022-02-02</CABllbleItmDate><CABllbleItmStartDate>2022-02-02</CABllbleItmStartDate><CABllbleItmEndDate>2023-02-02</CABllbleItmEndDate><CABillgFirstDate>2021-05-31</CABillgFirstDate><CABllbleItmAmount currencyCode="EUR">715.434</CABllbleItmAmount><CABllbleItemQty unit="KWH">2980.974</CABllbleItemQty><CAInvcgIsItemPostingRelevant>true</CAInvcgIsItemPostingRelevant><CAInvcgIsItemPrintingRelevant>true</CAInvcgIsItemPrintingRelevant><CABllbleItmGroupingTextData>5</CABllbleItmGroupingTextData><CABllbleItmControlOfUnit>6</CABllbleItmControlOfUnit><CABllbleItmSimlnSts>1</CABllbleItmSimlnSts></BillableItemsBasicCreate><BillableItemsPostingCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000001-100</CABllbleItmSourceTransItmID><Division>00</Division></BillableItemsPostingCreate><BillableItemsPostingCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000002-110</CABllbleItmSourceTransItmID><Division>00</Division></BillableItemsPostingCreate><BillableItemsPostingCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000003-210</CABllbleItmSourceTransItmID><Division>00</Division></BillableItemsPostingCreate><BillableItemsPostingCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000004-200</CABllbleItmSourceTransItmID><Division>00</Division></BillableItemsPostingCreate><BillableItemsPostingCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000005-220</CABllbleItmSourceTransItmID><Division>00</Division></BillableItemsPostingCreate><BillableItemsTextCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000001-100</CABllbleItmSourceTransItmID><CABllbleItmGroupingTextData>1</CABllbleItmGroupingTextData><TechnicalExtension><CABllbleItmExtnType>UTPR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000001-100</CABllbleItmExtnID></TechnicalExtension></BillableItemsTextCreate><BillableItemsTextCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000002-110</CABllbleItmSourceTransItmID><CABllbleItmGroupingTextData>2</CABllbleItmGroupingTextData><TechnicalExtension><CABllbleItmExtnType>UTPR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000002-110</CABllbleItmExtnID></TechnicalExtension></BillableItemsTextCreate><BillableItemsTextCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000003-210</CABllbleItmSourceTransItmID><CABllbleItmGroupingTextData>3</CABllbleItmGroupingTextData><TechnicalExtension><CABllbleItmExtnType>UTPR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000003-210</CABllbleItmExtnID></TechnicalExtension></BillableItemsTextCreate><BillableItemsTextCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000003-210</CABllbleItmSourceTransItmID><CABllbleItmGroupingTextData>3</CABllbleItmGroupingTextData><TechnicalExtension><CABllbleItmExtnType>UTMR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000003-210</CABllbleItmExtnID><CABllbleItmExtnItmID>3</CABllbleItmExtnItmID></TechnicalExtension></BillableItemsTextCreate><BillableItemsTextCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000004-200</CABllbleItmSourceTransItmID><CABllbleItmGroupingTextData>4</CABllbleItmGroupingTextData><TechnicalExtension><CABllbleItmExtnType>UTPR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000004-200</CABllbleItmExtnID></TechnicalExtension></BillableItemsTextCreate><BillableItemsTextCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000004-200</CABllbleItmSourceTransItmID><CABllbleItmGroupingTextData>4</CABllbleItmGroupingTextData><TechnicalExtension><CABllbleItmExtnType>UTMR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000004-200</CABllbleItmExtnID><CABllbleItmExtnItmID>4</CABllbleItmExtnItmID></TechnicalExtension></BillableItemsTextCreate><BillableItemsTextCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000005-220</CABllbleItmSourceTransItmID><CABllbleItmGroupingTextData>5</CABllbleItmGroupingTextData><TechnicalExtension><CABllbleItmExtnType>UTPR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000005-220</CABllbleItmExtnID></TechnicalExtension></BillableItemsTextCreate><BillableItemsTextCreate><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000005-220</CABllbleItmSourceTransItmID><CABllbleItmGroupingTextData>5</CABllbleItmGroupingTextData><TechnicalExtension><CABllbleItmExtnType>UTMR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000005-220</CABllbleItmExtnID><CABllbleItmExtnItmID>5</CABllbleItmExtnItmID></TechnicalExtension></BillableItemsTextCreate><n1:UtilitiesBillableItemsExtension><MeterReadingInfo><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000003-210</CABllbleItmSourceTransItmID><ValidFromDate>2022-02-02</ValidFromDate><ValidToDate>2023-02-02</ValidToDate><UtilitiesDeviceID>222312536</UtilitiesDeviceID><UtilitiesObjectIdnSystemCode>1-1:1.8.0</UtilitiesObjectIdnSystemCode><MeterReadingCategoryCode>03</MeterReadingCategoryCode><Quantity unitCode="KWH">2980.974</Quantity><UtilitiesMeterID>0f31501a-774d-465f-8d9c-9013edf33756</UtilitiesMeterID><UtilitiesMeteringLocation>222312536</UtilitiesMeteringLocation><TechnicalExtension><CABllbleItmExtnType>UTMR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000003-210</CABllbleItmExtnID><CABllbleItmExtnItmID>3</CABllbleItmExtnItmID></TechnicalExtension></MeterReadingInfo><MeterReadingInfo><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000004-200</CABllbleItmSourceTransItmID><ValidFromDate>2022-02-02</ValidFromDate><ValidToDate>2023-02-02</ValidToDate><UtilitiesDeviceID>222312536</UtilitiesDeviceID><UtilitiesObjectIdnSystemCode>1-1:1.8.0</UtilitiesObjectIdnSystemCode><MeterReadingCategoryCode>03</MeterReadingCategoryCode><Quantity unitCode="KWH">2980.974</Quantity><UtilitiesMeterID>0f31501a-774d-465f-8d9c-9013edf33756</UtilitiesMeterID><UtilitiesMeteringLocation>222312536</UtilitiesMeteringLocation><TechnicalExtension><CABllbleItmExtnType>UTMR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000004-200</CABllbleItmExtnID><CABllbleItmExtnItmID>4</CABllbleItmExtnItmID></TechnicalExtension></MeterReadingInfo><MeterReadingInfo><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000005-220</CABllbleItmSourceTransItmID><ValidFromDate>2022-02-02</ValidFromDate><ValidToDate>2023-02-02</ValidToDate><UtilitiesDeviceID>222312536</UtilitiesDeviceID><UtilitiesObjectIdnSystemCode>1-1:1.8.0</UtilitiesObjectIdnSystemCode><MeterReadingCategoryCode>03</MeterReadingCategoryCode><Quantity unitCode="KWH">2980.974</Quantity><UtilitiesMeterID>0f31501a-774d-465f-8d9c-9013edf33756</UtilitiesMeterID><UtilitiesMeteringLocation>222312536</UtilitiesMeteringLocation><TechnicalExtension><CABllbleItmExtnType>UTMR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000005-220</CABllbleItmExtnID><CABllbleItmExtnItmID>5</CABllbleItmExtnItmID></TechnicalExtension></MeterReadingInfo><Price><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000001-100</CABllbleItmSourceTransItmID><Price><Amount currencyCode="EUR">0.36</Amount><BaseQuantity unitCode="DAY">1</BaseQuantity></Price><TechnicalExtension><CABllbleItmExtnType>UTPR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000001-100</CABllbleItmExtnID></TechnicalExtension></Price><Price><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000002-110</CABllbleItmSourceTransItmID><Price><Amount currencyCode="EUR">0.36</Amount><BaseQuantity unitCode="DAY">1</BaseQuantity></Price><TechnicalExtension><CABllbleItmExtnType>UTPR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000002-110</CABllbleItmExtnID></TechnicalExtension></Price><Price><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000003-210</CABllbleItmSourceTransItmID><Price><Amount currencyCode="EUR">0.24</Amount><BaseQuantity unitCode="KWH">1</BaseQuantity></Price><TechnicalExtension><CABllbleItmExtnType>UTPR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000003-210</CABllbleItmExtnID></TechnicalExtension></Price><Price><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000004-200</CABllbleItmSourceTransItmID><Price><Amount currencyCode="EUR">0.24</Amount><BaseQuantity unitCode="KWH">1</BaseQuantity></Price><TechnicalExtension><CABllbleItmExtnType>UTPR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000004-200</CABllbleItmExtnID></TechnicalExtension></Price><Price><CABllbleItmSourceTransType>REVCL</CABllbleItmSourceTransType><CABllbleItmSourceTransId>SB0A6603</CABllbleItmSourceTransId><CABllbleItmSourceTransItmID>000005-220</CABllbleItmSourceTransItmID><Price><Amount currencyCode="EUR">0.24</Amount><BaseQuantity unitCode="KWH">1</BaseQuantity></Price><TechnicalExtension><CABllbleItmExtnType>UTPR</CABllbleItmExtnType><CABllbleItmExtnID>SB0A6603-000005-220</CABllbleItmExtnID></TechnicalExtension></Price></n1:UtilitiesBillableItemsExtension></BillableItemsCreate></n2:BillableItemsCreateRequest></soap:Body></soap:Envelope>',
    'undefined',
];

const TechnicalResources = {
    id: 'e4c00fd9-71e3-4847-a384-6daa9adfa851',
    code: 'PCS_E_T_S_Y_01',
    name: 'PCS Electricity transparent single register yearly 01',
    description: '',
    soldElectronically: true,
    published: true,
    productType: 'subscriptionProduct',
    version: 6,
    metadata: {
        changedAt: '2022-02-10T16:51:57.816Z',
        createdAt: '2022-01-12T17:02:54.383Z',
    },
    markets: [
        {
            marketId: 'non_commodity',
            active: true,
        },
    ],
    customReferences: [],
    mixins: {
        subscriptionProduct: {
            externalReference: '',
            subscriptionType: 'Commercial',
            ratePlanManagedExternally: false,
            marketAttributesList: [
                {
                    marketId: 'non_commodity',
                    ratePlanId: '4ce00b87-0521-4c11-bac5-a228ef48813f',
                    ratePlanDescription:
                        'PCS Electricity transparent single register yearly product 01 market non',
                },
            ],
            allowMidBillCycleExpiration: false,
            createPendingSubscriptions: false,
            technicalResources: [
                {
                    type: 'CONSUMPTION_ELEC',
                    idType: 'PoD',
                },
            ],
            subscriptionParameters: [],
            allowances: [],
            notificationSettings: [
                {
                    type: 'expiration',
                    offsetType: 'after',
                    offset: 0,
                    tags: ['Expired'],
                },
            ],
            expectedTerm: 12,
            withReferenceToPricingScheme: true,
        },
    },
    names: [],
    descriptions: [],
};

const MeterReadResponse = `<?xml version="1.0" encoding="UTF-8"?>
<msg:ResponseMessage
	xmlns:msg="http://iec.ch/TC57/2011/schema/message"
	xmlns:m="http://iec.ch/TC57/CIM-c4e#">
	<msg:Header>
		<msg:Verb>reply</msg:Verb>
		<msg:Noun>MeterConfig</msg:Noun>
		<msg:Timestamp>2022-02-14T08:21:36.608Z</msg:Timestamp>
		<msg:MessageID>95538e79-cd5b-467b-a1bf-3efaa0006ed5</msg:MessageID>
	</msg:Header>
	<msg:Reply>
		<msg:Result>OK</msg:Result>
		<msg:ReplyTypeExtResultInfo>
			<msg:totalCount>1</msg:totalCount>
			<msg:pageSize>25</msg:pageSize>
			<msg:pageNumber>0</msg:pageNumber>
		</msg:ReplyTypeExtResultInfo>
	</msg:Reply>
	<msg:Payload>
		<m:MeterConfig>
			<m:Meter>
				<m:mRID>0f31501a-774d-465f-8d9c-9013edf33756</m:mRID>
				<m:Names>
					<m:name>1222312536</m:name>
					<m:NameType>
						<m:name>MeteringLocation</m:name>
						<m:NameTypeAuthority>
							<m:name>SAP</m:name>
						</m:NameTypeAuthority>
					</m:NameType>
				</m:Names>
				<m:amrSystem>METER_AMR_SYSTEM</m:amrSystem>
				<m:isVirtual>false</m:isVirtual>
				<m:serialNumber>222312536</m:serialNumber>
				<m:timeZone>Europe/Berlin</m:timeZone>
				<m:timeZoneOffset>120</m:timeZoneOffset>
				<m:ConfigurationEvents>
					<m:effectiveDateTime>2021-05-31T22:00:00Z</m:effectiveDateTime>
				</m:ConfigurationEvents>
				<m:SimpleEndDeviceFunction ref="ff79e37c-84bf-4521-8c8b-39b58f293139"/>
				<m:EndDeviceInfo>
					<m:AssetModel>
						<m:modelNumber>Model - DC_AMI_LL</m:modelNumber>
						<m:Manufacturer>
							<m:name>o3 - Telefonica.ff79e37c-84bf-4521-8c8b-39b58f293139</m:name>
						</m:Manufacturer>
					</m:AssetModel>
				</m:EndDeviceInfo>
				<m:lifecycle>
					<m:installationDate>2021-06-01</m:installationDate>
				</m:lifecycle>
			</m:Meter>
			<m:ReadingType>
				<m:Names>
					<m:name>0.26.0.1.1.1.12.0.0.0.0.0.0.0.224.3.72.0</m:name>
					<m:NameType>
						<m:name>NameType</m:name>
						<m:NameTypeAuthority>
							<m:name>NameTypeAuthority</m:name>
						</m:NameTypeAuthority>
					</m:NameType>
				</m:Names>
			</m:ReadingType>
			<m:ReadingType>
				<m:Names>
					<m:name>32.0.0.9.1.1.12.0.0.0.0.0.0.0.0.3.72.0</m:name>
					<m:NameType>
						<m:name>NameType</m:name>
						<m:NameTypeAuthority>
							<m:name>NameTypeAuthority</m:name>
						</m:NameTypeAuthority>
					</m:NameType>
				</m:Names>
			</m:ReadingType>
			<m:SimpleEndDeviceFunction>
				<m:mRID>ff79e37c-84bf-4521-8c8b-39b58f293139</m:mRID>
				<m:enabled>true</m:enabled>
				<m:Registers>
					<m:mRID>01ac48a0-1d74-472f-8f56-f9a32fbd1c08</m:mRID>
					<m:isVirtual>false</m:isVirtual>
					<m:leftDigitCount>9</m:leftDigitCount>
					<m:rightDigitCount>3</m:rightDigitCount>
					<m:Channels>
						<m:mRID>4ad65a8c-a7da-4cba-8e85-f9486b03438d</m:mRID>
						<m:identificationSystemCode>1-1:1.8.0</m:identificationSystemCode>
						<m:measurementTask>measurementTask</m:measurementTask>
						<m:slpProfileID>fac9335f-2e36-47b2-80d0-8168eca2689c</m:slpProfileID>
						<m:veeCode>1004</m:veeCode>
						<m:ReadingType ref="0.26.0.1.1.1.12.0.0.0.0.0.0.0.224.3.72.0"/>
					</m:Channels>
					<m:RegisterMultiplier>
						<m:mRID>ed30a9a7-c6a1-40d1-addc-44764182038a</m:mRID>
						<m:kind>kH</m:kind>
						<m:value>1</m:value>
					</m:RegisterMultiplier>
				</m:Registers>
				<m:Registers>
					<m:mRID>bfa52a41-1c0c-4540-ade6-ffc542df3253</m:mRID>
					<m:isVirtual>true</m:isVirtual>
					<m:leftDigitCount>9</m:leftDigitCount>
					<m:rightDigitCount>3</m:rightDigitCount>
					<m:Channels>
						<m:mRID>cc4f945d-cbcd-4df5-890c-270897fda4c2</m:mRID>
						<m:identificationSystemCode>1-1:1.9.0</m:identificationSystemCode>
						<m:measurementTask>measurementTask</m:measurementTask>
						<m:slpProfileID>fac9335f-2e36-47b2-80d0-8168eca2689c</m:slpProfileID>
						<m:veeCode>1004</m:veeCode>
						<m:ReadingType ref="32.0.0.9.1.1.12.0.0.0.0.0.0.0.0.3.72.0"/>
					</m:Channels>
					<m:RegisterMultiplier>
						<m:mRID>c9cbaba5-9d02-4519-92c4-ef82b19a3183</m:mRID>
						<m:kind>kH</m:kind>
						<m:value>1</m:value>
					</m:RegisterMultiplier>
				</m:Registers>
			</m:SimpleEndDeviceFunction>
		</m:MeterConfig>
	</msg:Payload>
</msg:ResponseMessage>`;

module.exports = {
    Subscription,
    ExpiredSubscription,
    NonCommoditySB,
    BillingForecast,
    BillableItemsResponse,
    TechnicalResources,
    MeterReadResponse,
};
