/**
 * CustomerOrderMock class
 */
class CustomerOrderMock {
    /**
     *
     * @param {*} cOrderParams
     * @returns
     */
    static getCOrder(cOrderParams) {
        const {
            displayCId,
            respTypeCode1,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            partnerId,
        } = cOrderParams;

        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCode1.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                        technicalResources: [
                            {
                                resourceId: '12343211',
                                resourceName: 'US_BASED_FEE_BY_MINUTES',
                            },
                        ],
                        headerCustomReferences: [
                            {
                                typeCode: 'PO',
                                customReferenceId: '4711',
                            },
                            {
                                typeCode: 'PO',
                                customReferenceId: '4712',
                            },
                        ],
                        itemCustomReferences: [
                            {
                                typeCode: 'PO',
                                customReferenceId: '4713',
                            },
                            {
                                typeCode: 'PO',
                                customReferenceId: '4714',
                            },
                        ],
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
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} cOrderWithRefObj_Params
     * @returns
     */
    static GetCorderwithRef(cOrderWithRefObj_Params) {
        const {
            displayCId,
            respTypeCodeUSB2,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        } = cOrderWithRefObj_Params;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCodeUSB2.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                        referenceObject: {
                            meter: 'test',
                            installation: 'DE0021794340100000000000001111212',
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }

    /**
     *
     * @param {*} cOrderWithRefObj_Params
     * @returns
     */
    static GetCorderwithUtilExtn(cOrderWithRefObj_Params) {
        const {
            displayCId,
            respTypeCodeUSB2,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            respBPUUID,
        } = cOrderWithRefObj_Params;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCodeUSB2.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                        referenceObject: {
                            meter: 'test',
                            installation: 'DE0021794340100000000000001111212',
                        },
                        budgetBillingType: {
                            code: 'SU01',
                        },
                        deviceTypePricing: {
                            code: '01',
                        },
                        supplyAddress: {
                            up_: {
                                id: respBPUUID.id,
                            },
                            id: respBPUUID.addressData[0].id,
                        },
                        podId: '123455',
                        gridPricing: '5555',
                        geographicalCode: 'H3H2J1',
                        referenceBillDate: '2021-12-05',
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: '10100023',
                    contractAccountId: '000000013044',
                    businessPartnerId: respBPUUID.displayId,
                    businessPartner: {
                        id: respBPUUID.id,
                    },
                    role: {
                        code: 'SH',
                    },
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }

    /**
     *
     * @param {*} cOrderWithRefObj_Params
     * @returns
     */
    static GetCorderwithRefInvalidInstallation(cOrderWithRefObj_Params) {
        const {
            displayCId,
            respTypeCodeUSB2,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            respBPUUID,
        } = cOrderWithRefObj_Params;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCodeUSB2.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                        referenceObject: {
                            meter: 'test',
                            installation: '2211723480',
                        },
                        budgetBillingType: {
                            code: 'SU01',
                        },
                        deviceTypePricing: {
                            code: '01',
                        },
                        supplyAddress: {
                            up_: {
                                id: respBPUUID.id,
                            },
                            id: respBPUUID.addressData[0].id,
                        },
                        podId: '123455',
                        gridPricing: '5555',
                        geographicalCode: 'H3H2J1',
                        referenceBillDate: '2021-12-05',
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} cOrderNoTech_Params
     * @returns
     */
    static GetCorderwithNoTech(cOrderNoTech_Params) {
        const {
            displayCId,
            respTypeCodeUSB2,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        } = cOrderNoTech_Params;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCodeUSB2.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                        referenceObject: {
                            meter: 'test',
                            installation: 'DE0021794340100000000000001111212',
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }

    static GetCorderwithoutRef(cOrderWithoutRefObj_Params) {
        const {
            displayCId,
            respTypeCodeUSB2,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        } = cOrderWithoutRefObj_Params;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCodeUSB2.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} SDOrder_Params
     * @returns
     */
    static getSDOrder(SDOrder_Params) {
        const {
            displayCId,
            respConditionTypeCodesPPR0,
            PCQuantityUnit,
            respConditionTypeCodesYK07,
            respTypeCodeUMT1,
            respDistChannel10,
            respDivisionCode00,
            salesOrgResp1010,
            respProductTG11,
            respIncoTermsClassification,
            respPaymentTerm,
        } = SDOrder_Params;
        return {
            displayId: `${displayCId}`,
            orderDate: '2021-05-01',
            pricingDate: '2021-04-26T15:51:04Z',
            items: [
                {
                    id: '000001',
                    parentItemId: '',
                    netAmount: '100.99',
                    priceComponents: [
                        {
                            conditionType: {
                                code: respConditionTypeCodesPPR0.data.code,
                            },
                            value: '26.9',
                            currency: {
                                code: 'EUR',
                            },
                            perQuantityUnit: {
                                code: PCQuantityUnit.data.code,
                            },
                        },
                        {
                            conditionType: {
                                code: respConditionTypeCodesYK07.data.code,
                            },
                            value: '55',
                            currency: {
                                code: 'EUR',
                            },
                            perQuantityUnit: {
                                code: PCQuantityUnit.data.code,
                            },
                        },
                    ],
                    partners: [
                        {
                            id: '10100001',
                        },
                    ],
                    type: {
                        code: respTypeCodeUMT1.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel10.data.code,
                        },
                        division: {
                            code: respDivisionCode00.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp1010.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                            periodUnit: null,
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'physicalOrder',
                    quantity: '1',
                    quantityUnit: {
                        code: PCQuantityUnit.data.code,
                    },
                    product: {
                        id: respProductTG11.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: '10100001',
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                    role: {
                        code: respIncoTermsClassification.data.code,
                    },
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    conditionType: {
                        code: 'DRN1',
                    },
                    value: '16.9',
                    currency: {
                        code: 'EUR',
                    },
                    perQuantityUnit: {
                        code: PCQuantityUnit.data.code,
                    },
                },
                {
                    conditionType: {
                        code: 'DRG1',
                    },
                    value: '49',
                    currency: {
                        code: 'EUR',
                    },
                    perQuantityUnit: {
                        code: PCQuantityUnit.data.code,
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: 'FH',
                },
                shippingCondition: {
                    code: '02',
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} SDOrderNoMatchSalesAreaError_Params
     * @returns
     */

    static getSDOrder_NoMatchSales_Area(SDOrderNoMatchSalesAreaError_Params) {
        const {
            displayCId,
            respConditionTypeCodesPPR0,
            PCQuantityUnit,
            respConditionTypeCodesYK07,
            respTypeCodeUMT1,
            respDistChannel30,
            respDivisionCode00,
            salesOrgResp1010,
            respProductTG11,
            respIncoTermsClassification,
            respPaymentTerm,
        } = SDOrderNoMatchSalesAreaError_Params;
        return {
            displayId: `${displayCId}`,
            orderDate: '2021-05-01',
            pricingDate: '2021-04-26T15:51:04Z',
            items: [
                {
                    id: '000001',
                    parentItemId: '',
                    netAmount: '100.99',
                    priceComponents: [
                        {
                            conditionType: {
                                code: respConditionTypeCodesPPR0.data.code,
                            },
                            value: '26.9',
                            currency: {
                                code: 'EUR',
                            },
                            perQuantityUnit: {
                                code: PCQuantityUnit.data.code,
                            },
                        },
                        {
                            conditionType: {
                                code: respConditionTypeCodesYK07.data.code,
                            },
                            value: '55',
                            currency: {
                                code: 'EUR',
                            },
                            perQuantityUnit: {
                                code: PCQuantityUnit.data.code,
                            },
                        },
                    ],
                    partners: [
                        {
                            id: '10100001',
                        },
                    ],
                    type: {
                        code: respTypeCodeUMT1.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel30.data.code,
                        },
                        division: {
                            code: respDivisionCode00.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp1010.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                            periodUnit: null,
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'physicalOrder',
                    quantity: '1',
                    quantityUnit: {
                        code: PCQuantityUnit.data.code,
                    },
                    product: {
                        id: respProductTG11.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: '10100001',
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                    role: {
                        code: respIncoTermsClassification.data.code,
                    },
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    conditionType: {
                        code: 'DRN1',
                    },
                    value: '16.9',
                    currency: {
                        code: 'EUR',
                    },
                    perQuantityUnit: {
                        code: PCQuantityUnit.data.code,
                    },
                },
                {
                    conditionType: {
                        code: 'DRG1',
                    },
                    value: '49',
                    currency: {
                        code: 'EUR',
                    },
                    perQuantityUnit: {
                        code: PCQuantityUnit.data.code,
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: 'FH',
                },
                shippingCondition: {
                    code: '02',
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }

    static getSDOrder_NoMatchMaterial(SDOrderNoMatchMaterialError_Params) {
        const {
            displayCId,
            respConditionTypeCodesPPR0,
            PCQuantityUnit,
            respConditionTypeCodesYK07,
            respTypeCodeUMT1,
            respDistChannel10,
            respDivisionCode00,
            salesOrgResp1010,
            respProductXYZ,
            respIncoTermsClassification,
            respPaymentTerm,
        } = SDOrderNoMatchMaterialError_Params;
        return {
            displayId: `${displayCId}`,
            orderDate: '2021-05-01',
            pricingDate: '2021-04-26T15:51:04Z',
            items: [
                {
                    id: '000001',
                    parentItemId: '',
                    netAmount: '100.99',
                    priceComponents: [
                        {
                            conditionType: {
                                code: respConditionTypeCodesPPR0.data.code,
                            },
                            value: '26.9',
                            currency: {
                                code: 'EUR',
                            },
                            perQuantityUnit: {
                                code: PCQuantityUnit.data.code,
                            },
                        },
                        {
                            conditionType: {
                                code: respConditionTypeCodesYK07.data.code,
                            },
                            value: '55',
                            currency: {
                                code: 'EUR',
                            },
                            perQuantityUnit: {
                                code: PCQuantityUnit.data.code,
                            },
                        },
                    ],
                    partners: [
                        {
                            id: '10100001',
                        },
                    ],
                    type: {
                        code: respTypeCodeUMT1.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel10.data.code,
                        },
                        division: {
                            code: respDivisionCode00.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp1010.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                            periodUnit: null,
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'physicalOrder',
                    quantity: '1',
                    quantityUnit: {
                        code: PCQuantityUnit.data.code,
                    },
                    product: {
                        id: respProductXYZ.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: '10100001',
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                    role: {
                        code: respIncoTermsClassification.data.code,
                    },
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    conditionType: {
                        code: 'DRN1',
                    },
                    value: '16.9',
                    currency: {
                        code: 'EUR',
                    },
                    perQuantityUnit: {
                        code: PCQuantityUnit.data.code,
                    },
                },
                {
                    conditionType: {
                        code: 'DRG1',
                    },
                    value: '49',
                    currency: {
                        code: 'EUR',
                    },
                    perQuantityUnit: {
                        code: PCQuantityUnit.data.code,
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: 'FH',
                },
                shippingCondition: {
                    code: '02',
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} cOrderError_Params
     * @returns
     */
    static getCOrder_Error(cOrderError_Params) {
        const {
            displayCId,
            respTypeCode1,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        } = cOrderError_Params;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    type: {
                        code: respTypeCode1.data.code,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} SBOrderNoSubscriptionAspect_Param
     * @returns
     */
    static getSBOrder_NoSubscriptionAspect(SBOrderNoSubscriptionAspect_Param) {
        const {
            displayCId,
            respTypeCode1,
            respDistChannel,
            respDivisionCode,
            salesOrgRespNoMarket,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        } = SBOrderNoSubscriptionAspect_Param;

        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCode1.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgRespNoMarket.data.id,
                        },
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} SBOrderNoUtilitiesAspect_param
     * @returns
     */
    static getSBOrder_NoUtilitiesAspect(SBOrderNoUtilitiesAspect_param) {
        const {
            displayCId,
            respTypeCode1,
            eachQauntityUnit,
            respProductEBike,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            partnerId,
        } = SBOrderNoUtilitiesAspect_param;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCode1.data.code,
                    },
                    utilitiesAspect: {},
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} SbOrderNoMarket_param
     * @returns
     */
    static getSbOrderNoMarket(SbOrderNoMarket_param) {
        const {
            displayCId,
            respTypeCode1,
            respDistChannel,
            respDivisionCode,
            salesOrgRespNoMarket,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        } = SbOrderNoMarket_param;

        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCode1.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgRespNoMarket.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} SbOrderNoContractTerm_Param
     * @returns
     */
    static getSbOrderNoContractTerm(SbOrderNoContractTerm_Param) {
        const {
            displayCId,
            respTypeCode1,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        } = SbOrderNoContractTerm_Param;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCode1.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                    },
                    subscriptionAspect: {
                        validFrom: '2021-04-01',
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} SbOrder_Type_Usb5_Param
     * @returns
     */
    static get_SbOrder_Type_Usb5(SbOrder_Type_Usb5_Param) {
        const {
            displayCId,
            respTypeCodeUSB5,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        } = SbOrder_Type_Usb5_Param;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCodeUSB5.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} sbSdOrder_Param
     * @returns
     */
    static getsbSdOrder(sbSdOrder_Param) {
        const {
            salesOrgResp1010,
            respProductTG11,
            respProductEBike,
            respBPUUID,
        } = sbSdOrder_Param;
        return {
            items: [
                {
                    id: '000001',
                    parentItemId: '',
                    netAmount: '100.99',
                    partners: [
                        {
                            id: '10100023',
                        },
                    ],
                    priceComponents: [
                        {
                            conditionType: {
                                code: 'PPR0',
                            },
                            value: '26.9',
                            currency: {
                                code: 'EUR',
                            },
                            perQuantityUnit: {
                                code: 'PC',
                            },
                        },
                        {
                            conditionType: {
                                code: 'YK07',
                            },
                            value: '55',
                            currency: {
                                code: 'EUR',
                            },
                            perQuantityUnit: {
                                code: 'PC',
                            },
                        },
                    ],
                    subscriptionAspect: {
                        contractTerm: {
                            period: null,
                            periodicity: 'null',
                        },
                        validFrom: '2021-04-01',
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: '10',
                        },
                        division: {
                            code: '00',
                        },
                        salesOrganization: {
                            id: salesOrgResp1010.data.id,
                        },
                    },
                    type: {
                        code: 'UMT1',
                    },
                    text: 'physical order',
                    quantity: '1',
                    quantityUnit: {
                        code: 'PC',
                    },
                    product: {
                        id: respProductTG11.data.id,
                    },
                },
                {
                    id: '000002',
                    type: {
                        code: 'USB1',
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: '10',
                        },
                        division: {
                            code: '00',
                        },
                        salesOrganization: {
                            id: salesOrgResp1010.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                    },
                    text: 'Bundle Subscription',
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            displayId: '1007020813',
            orderDate: '2021-05-01',
            pricingDate: '2021-04-26T15:51:04Z',
            partners: [
                {
                    id: '10100023',
                    contractAccountId: '000000013044',
                    businessPartnerId: respBPUUID.displayId,
                    businessPartner: {
                        id: respBPUUID.id,
                    },
                    role: {
                        code: 'SH',
                    },
                },
            ],
            priceComponents: [
                {
                    conditionType: {
                        code: 'DRN1',
                    },
                    value: '16.9',
                    currency: {
                        code: 'EUR',
                    },
                    perQuantityUnit: {
                        code: 'PC',
                    },
                },
                {
                    conditionType: {
                        code: 'DRG1',
                    },
                    value: '49',
                    currency: {
                        code: 'EUR',
                    },
                    perQuantityUnit: {
                        code: 'PC',
                    },
                },
            ],

            salesAspect: {
                incotermsClassification: {
                    code: 'FH',
                },
                shippingCondition: {
                    code: '02',
                },
                paymentTerms: {
                    code: '0001',
                },
            },
        };
    }
    /**
     *
     * @param {*} SbOrder_Type_Usb3_Param
     * @returns
     */
    static getSbOrder_Type_Usb3(SbOrder_Type_Usb3_Param) {
        const {
            displayCId,
            respTypeCodeUSB3,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            respCancellationReason,
        } = SbOrder_Type_Usb3_Param;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCodeUSB3.data.code,
                    },

                    cancellationReason: {
                        code: respCancellationReason.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                        validTo: '2022-07-01',
                        subscriptionReference: {
                            itemId: '1',
                            objectId: 'N4033',
                        },
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }

    /**
     *
     * @param {*} getSbOrder_Type_Usb3_Invalid
     * @returns
     */
    static getSbOrder_Type_Usb3_Invalid(SbOrder_Type_Usb3_Param) {
        const {
            displayCId,
            respTypeCodeUSB3,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            respCancellationReason,
        } = SbOrder_Type_Usb3_Param;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCodeUSB3.data.code,
                    },

                    cancellationReason: {
                        code: respCancellationReason.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                        validTo: '2022-07-01',
                        subscriptionReference: {
                            itemId: '1',
                            objectId: 'N4044',
                        },
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }

    static getSbOrder_Type_Usb3_NoCancelReason(SbOrder_Type_Usb3_Param) {
        const {
            displayCId,
            respTypeCodeUSB3,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            respCancellationReason,
        } = SbOrder_Type_Usb3_Param;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCodeUSB3.data.code,
                    },

                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                        validTo: '2022-07-01',
                        subscriptionReference: {
                            itemId: '1',
                            objectId: 'N4033',
                        },
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
    /**
     *
     * @param {*} getSbOrder_Type_Usb3_Invalid2
     * @returns
     */
    static getSbOrder_Type_Usb3_Invalid2(SbOrder_Type_Usb3_Param) {
        const {
            displayCId,
            respTypeCodeUSB3,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            respCancellationReason,
        } = SbOrder_Type_Usb3_Param;
        return {
            displayId: `${displayCId}`,
            isExternallyPriced: true,
            items: [
                {
                    configurationId: '',
                    id: '000002',
                    partners: [
                        {
                            id: '3234771241',
                        },
                    ],
                    type: {
                        code: respTypeCodeUSB3.data.code,
                    },

                    cancellationReason: {
                        code: respCancellationReason.data.code,
                    },
                    utilitiesAspect: {
                        distributionChannel: {
                            code: respDistChannel.data.code,
                        },
                        division: {
                            code: respDivisionCode.data.code,
                        },
                        salesOrganization: {
                            id: salesOrgResp.data.id,
                        },
                    },
                    subscriptionAspect: {
                        contractTerm: {
                            period: 12,
                            periodicity: 'calendar-monthly',
                        },
                        validFrom: '2021-04-01',
                        validTo: '2022-07-01',
                        subscriptionReference: {
                            itemId: '1',
                            objectId: 'N4045',
                        },
                    },
                    text: 'subscription',
                    quantity: '1',
                    quantityUnit: {
                        code: eachQauntityUnit.data.code,
                    },
                    product: {
                        id: respProductEBike.data.id,
                    },
                },
            ],
            partners: [
                {
                    id: `I${partnerId}`,
                    contractAccountId: '010000013102',
                    businessPartnerId: 'TEST',
                },
            ],
            paymentReferences: [
                {
                    token: '12345678',
                },
            ],
            priceComponents: [
                {
                    currency: {
                        code: 'EUR',
                    },
                },
            ],
            salesAspect: {
                incotermsClassification: {
                    code: respIncoTermsClassification.data.code,
                },
                shippingCondition: {
                    code: respShippingCondition.data.code,
                },
                paymentTerms: {
                    code: respPaymentTerm.data.code,
                },
            },
        };
    }
}
module.exports = CustomerOrderMock;
