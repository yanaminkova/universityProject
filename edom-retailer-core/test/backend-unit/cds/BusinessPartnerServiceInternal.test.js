const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the exposed entity of BusinessPartnerServiceInternal according to the specification provided in #713
 */
describe('BusinessPartnerServiceInternal CDS test UTILITIESCLOUDSOLUTION-2916', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should contain all specified entities', () => {
        expect('BusinessPartnerServiceInternal').to.have.entities([
            'BusinessPartner',
            'LifecycleStatusCodes',
            'TaxNumberTypeCodes',
            'IndustrySectorCodes',
            'IndustrySystemTypeCodes',
            'CompanyLegalFormCodes',
            'AddressDataUsageCodes',
            'BusinessPartnerRoleCodes',
            'CommunicationMethodCodes',
            'GenderCodes',
            'LanguageCodes',
            'CountryCodes',
            'CurrencyCodes',
            'TimeZoneCodes',
            'IncotermsClassificationCodes',
            'FormOfAddressCodes',
            'AcademicTitleCodes',
            'FamilyNamePrefixCodes',
            'FamilyNameSuffixCodes',
            'CountrySubdivisionCodes',
            'StreetCodes',
            'TownCodes',
            'TaxCategoryCodes',
            'PaymentCardTypeCodes',
            'PaymentCardCategoryCodes',
            'CheckVoidReasonCodes',
            'CustomerClassificationCodes',
            'CustomerAccountGroupCodes',
            'NielsenRegionCodes',
            'DataMediumExchangeIndicatorCodes',
            'DataExchangeInstructionCodes',
            'CustomerConditionGroupCodes',
            'CfopCategoryCodes',
            'IndustryCodes',
            'AccountTaxTypeCodes',
            'CustomerOrderBlockingReasonCodes',
            'CustomerDeliveryBlockingReasonCodes',
            'CustomerBillingBlockingReasonCodes',
            'SalesPartnerRoleCodes',
            'CustomerTaxClassificationCodes',
            'CustomerSalesArrangementGroupCodes',
            'CustomerSalesArrangementPriceGroupCodes',
            'DivisionCodes',
            'DeliveryPriorityCodes',
            'MarketFunctionCodes',
        ]);
    });

    it('should contain @restrict and @Capabilities annotations for all entities', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('BusinessPartnerServiceInternal')
        ).filter((value) => !value['@cds.autoexposed']);
        Array.from(serviceEntities).forEach((entity) => {
            expect(
                entity['@restrict'],
                `Expected ${entity.name} to have @restrict annotation defined`
            ).to.exist;
            expect(
                entity['@restrict'].length,
                `Expected ${entity.name} to have 2 granted scopes of @restrict annotation`
            ).to.eql(2);
            expect(entity['@Capabilities.DeleteRestrictions.Deletable']).to.be
                .false;
        });
    });

    it('should contain all defined attributes of BusinessPartner', () => {
        expect(
            'BusinessPartnerServiceInternal.BusinessPartner'
        ).to.have.attributes([
            'id',
            'purposes',
            'displayId',
            'businessPartnerType',
            'person',
            'organization',
            'businessPartnerGroup',
            'lifecycleStatus',
            'isBlocked',
            'identifications',
            'bankAccounts',
            'taxNumbers',
            'addressData',
            'roles',
            'customerInformation',
            'supplierInformation',
            'serviceProviderInformation',
            'mdiBookKeeping',
        ]);
    });

    it('should contain all defined attributes of LifecycleStatusCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.LifecycleStatusCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of TaxNumberTypeCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.TaxNumberTypeCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of IndustrySectorCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.IndustrySectorCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of IndustrySystemTypeCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.IndustrySystemTypeCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CompanyLegalFormCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CompanyLegalFormCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of AddressDataUsageCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.AddressDataUsageCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of BusinessPartnerRoleCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.BusinessPartnerRoleCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CommunicationMethodCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CommunicationMethodCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of GenderCodes', () => {
        expect('BusinessPartnerServiceInternal.GenderCodes').to.have.attributes(
            ['name', 'descr', 'code', 'texts', 'localized']
        );
    });

    it('should contain all defined attributes of LanguageCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.LanguageCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CountryCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CountryCodes'
        ).to.have.attributes([
            'name',
            'descr',
            'changeType',
            'code',
            'currency',
            'texts',
            'localized',
        ]);
    });

    it('should contain all defined attributes of CurrencyCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CurrencyCodes'
        ).to.have.attributes([
            'name',
            'descr',
            'changeType',
            'code',
            'minorUnit',
            'texts',
            'localized',
        ]);
    });

    it('should contain all defined attributes of TimeZoneCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.TimeZoneCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of IncotermsClassificationCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.IncotermsClassificationCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of FormOfAddressCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.FormOfAddressCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of AcademicTitleCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.AcademicTitleCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of FamilyNamePrefixCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.FamilyNamePrefixCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of FamilyNameSuffixCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.FamilyNameSuffixCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CountrySubdivisionCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CountrySubdivisionCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of StreetCodes', () => {
        expect('BusinessPartnerServiceInternal.StreetCodes').to.have.attributes(
            ['name', 'descr', 'code', 'texts', 'localized']
        );
    });

    it('should contain all defined attributes of TownCodes', () => {
        expect('BusinessPartnerServiceInternal.TownCodes').to.have.attributes([
            'name',
            'descr',
            'code',
            'texts',
            'localized',
        ]);
    });

    it('should contain all defined attributes of TaxCategoryCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.TaxCategoryCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of PaymentCardTypeCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.PaymentCardTypeCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of PaymentCardCategoryCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.PaymentCardCategoryCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CheckVoidReasonCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CheckVoidReasonCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CustomerClassificationCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CustomerClassificationCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CustomerAccountGroupCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CustomerAccountGroupCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of NielsenRegionCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.NielsenRegionCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of DataMediumExchangeIndicatorCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.DataMediumExchangeIndicatorCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of DataExchangeInstructionCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.DataExchangeInstructionCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CustomerConditionGroupCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CustomerConditionGroupCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CfopCategoryCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CfopCategoryCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of IndustryCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.IndustryCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of AccountTaxTypeCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.AccountTaxTypeCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CustomerOrderBlockingReasonCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CustomerOrderBlockingReasonCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CustomerDeliveryBlockingReasonCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CustomerDeliveryBlockingReasonCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CustomerBillingBlockingReasonCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CustomerBillingBlockingReasonCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of SalesPartnerRoleCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.SalesPartnerRoleCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CustomerTaxClassificationCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CustomerTaxClassificationCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CustomerSalesArrangementGroupCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CustomerSalesArrangementGroupCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of CustomerSalesArrangementPriceGroupCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.CustomerSalesArrangementPriceGroupCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of DivisionCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.DivisionCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of DeliveryPriorityCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.DeliveryPriorityCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });

    it('should contain all defined attributes of MarketFunctionCodes', () => {
        expect(
            'BusinessPartnerServiceInternal.MarketFunctionCodes'
        ).to.have.attributes(['name', 'descr', 'code', 'texts', 'localized']);
    });
});
