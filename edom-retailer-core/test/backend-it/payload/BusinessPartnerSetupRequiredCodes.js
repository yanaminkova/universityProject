async function commonSetupConfigCodes(POST, commonConfigApi, admin) {
    // An array of array containing the url and the code to be POSTed
    const codeArray = [
        [`${commonConfigApi}/CountrySubdivisionCodes`, 'WA'],
        [`${commonConfigApi}/CountrySubdivisionCodes`, 'BE'],
        [`${commonConfigApi}/CountrySubdivisionCodes`, 'ON'],
    ];
    await Promise.all(
        codeArray.map(async (codeArr) => {
            try {
                const url = codeArr[0];
                const code = codeArr[1];
                await POST(url, { code }, { auth: admin });
            } catch (error) {
                if (error.message !== '400 - Entity already exists')
                    throw new Error(error.stack);
            }
        })
    );
}

async function bpSetupConfigCodes(POST, businessPartnerConfigApi, admin) {
    // An array of array containing the url and the code to be POSTed
    const codeArray = [
        [`${businessPartnerConfigApi}/CustomerAccountGroupCodes`, 'CUST'],
        [`${businessPartnerConfigApi}/DeliveryPriorityCodes`, '00'],
        [`${businessPartnerConfigApi}/DeliveryPriorityCodes`, '01'],
        [`${businessPartnerConfigApi}/DeliveryPriorityCodes`, '02'],
        [`${businessPartnerConfigApi}/DeliveryPriorityCodes`, '03'],
        [`${businessPartnerConfigApi}/SalesPartnerRoleCodes`, 'AG'],
        [`${businessPartnerConfigApi}/SalesPartnerRoleCodes`, 'RG'],
        [`${businessPartnerConfigApi}/SalesPartnerRoleCodes`, 'WE'],
        [`${businessPartnerConfigApi}/SalesPartnerRoleCodes`, 'WG'],
        [`${businessPartnerConfigApi}/SalesPartnerRoleCodes`, 'RE'],
        [`${businessPartnerConfigApi}/MarketFunctionCodes`, 'SUP001'],
        [`${businessPartnerConfigApi}/MarketFunctionCodes`, 'DSO001'],
        [`${businessPartnerConfigApi}/MarketFunctionCodes`, 'MRO001'],
        [
            `${businessPartnerConfigApi}/CustomerSalesArrangementGroupCodes`,
            '03',
        ],
        [
            `${businessPartnerConfigApi}/CustomerSalesArrangementPriceGroupCodes`,
            'C1',
        ],
        [`${businessPartnerConfigApi}/TaxCategoryCodes`, 'TTX1'],
        [`${businessPartnerConfigApi}/TaxCategoryCodes`, 'TTX2'],
        [`${businessPartnerConfigApi}/CustomerTaxClassificationCodes`, '1'],
        [`${businessPartnerConfigApi}/TaxNumberTypeCodes`, 'US01'],
        [`${businessPartnerConfigApi}/TaxNumberTypeCodes`, 'CA0'],
        [`${businessPartnerConfigApi}/TaxNumberTypeCodes`, 'DE0'],
        [`${businessPartnerConfigApi}/BusinessPartnerRoleCodes`, 'MKK'],
        [`${businessPartnerConfigApi}/BusinessPartnerRoleCodes`, 'FLCU01'],
        [`${businessPartnerConfigApi}/BusinessPartnerRoleCodes`, 'FLCU00'],
        [`${businessPartnerConfigApi}/AddressDataUsageCodes`, 'XXDEFAULT'],
        [`${businessPartnerConfigApi}/AddressDataUsageCodes`, 'billing'],
        [`${businessPartnerConfigApi}/AddressDataUsageCodes`, 'shipping'],
        [`${businessPartnerConfigApi}/AddressDataUsageCodes`, 'BILLING'],
        [`${businessPartnerConfigApi}/AddressDataUsageCodes`, 'SHIPPING'],
    ];
    await Promise.all(
        codeArray.map(async (codeArr) => {
            try {
                const url = codeArr[0];
                const code = codeArr[1];
                await POST(url, { code }, { auth: admin });
            } catch (error) {
                if (error.message !== '400 - Entity already exists')
                    throw new Error(error.stack);
            }
        })
    );
}

module.exports = {
    commonSetupConfigCodes,
    bpSetupConfigCodes,
};
