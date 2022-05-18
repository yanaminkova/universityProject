const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the exposed entity of BusinessPartnerService according to the specification provided in #713
 */
describe('BusinessPartnerService CDS test UTILITIESCLOUDSOLUTION-2916', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should contain all specified entities', () => {
        expect('BusinessPartnerService').to.have.entities([
            'BusinessPartner',
            'BusinessPartnerSearch',
            'BusinessPartnerBookKeeping',
            'BusinessPartnerPerson',
            'BusinessPartnerPersonNameDetails',
            'BusinessPartnerOrganization',
            'BusinessPartnerOrganizationNameDetails',
            'BusinessPartnerBankAccounts',
            'BusinessPartnerTaxNumbers',
            'BusinessPartnerAddressData',
            'BusinessPartnerAddressDataUsages',
            'BusinessPartnerAddressDataPersonPostalAddress',
            'BusinessPartnerAddressDataOrganizationPostalAddress',
            'BusinessPartnerAddressDataEmailAddresses',
            'BusinessPartnerAddressDataPhoneNumbers',
            'BusinessPartnerRoles',
            'BusinessPartnerCustomerInformation',
            'BusinessPartnerCustomerInformationSalesArrangements',
            'BusinessPartnerCustomerInformationSalesArrangementsFunctions',
            'BusinessPartnerCustomerInformationTaxClassifications',
            'BusinessPartnerServiceProviderInformation',
        ]);
    });

    it('should contain @restrict and @Capabilities annotations for all entities (except BusinessPartnerSearch and BusinessPartnerBookKeeping)', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('BusinessPartnerService')
        ).filter(
            (value) =>
                !value['@cds.autoexposed'] &&
                !value.name ===
                    'BusinessPartnerService.BusinessPartnerSearch' &&
                !value.name ===
                    'BusinessPartnerService.BusinessPartnerBookKeeping'
        );

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

    it('should contain @restrict and @readonly annotations for BusinessPartnerSearch', () => {
        const [BusinessPartnerSearch] = Object.values(
            cds.reflect(cds.model).entities('BusinessPartnerService')
        ).filter(
            (value) =>
                value.name === 'BusinessPartnerService.BusinessPartnerSearch'
        );
        expect(
            BusinessPartnerSearch['@restrict'],
            `Expected BusinessPartnerSearch to have @restrict annotation defined`
        ).to.exist;
        expect(
            BusinessPartnerSearch['@restrict'].length,
            `Expected BusinessPartnerSearch to have 1 granted scope of @restrict annotation`
        ).to.eql(2);
        expect(BusinessPartnerSearch['@readonly']).to.be.true;
    });

    it('should contain @restrict and @readonly annotations for BusinessPartnerBookKeeping', () => {
        const [BusinessPartnerBookKeeping] = Object.values(
            cds.reflect(cds.model).entities('BusinessPartnerService')
        ).filter(
            (value) =>
                value.name ===
                'BusinessPartnerService.BusinessPartnerBookKeeping'
        );
        expect(
            BusinessPartnerBookKeeping['@restrict'],
            `Expected BusinessPartnerBookKeeping to have @restrict annotation defined`
        ).to.exist;
        expect(
            BusinessPartnerBookKeeping['@restrict'].length,
            `Expected BusinessPartnerBookKeeping to have 1 granted scope of @restrict annotation`
        ).to.eql(2);
        expect(BusinessPartnerBookKeeping['@readonly']).to.be.true;
    });

    it('should contain all defined attributes of BusinessPartner', () => {
        expect('BusinessPartnerService.BusinessPartner').to.have.attributes([
            'id',
            'displayId',
            'businessPartnerType',
            'person', // composition of one PersonDetails
            'organization', // composition of one OrganizationDetails
            'isBlocked',
            'bankAccounts', // composition of many BankAccount
            'taxNumbers',
            'addressData', // composition of many AddressData
            'roles', // composition of many BusinessPartnerRole
            'serviceProviderInformation', // composition of one ServiceProviderDetails
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerBookKeeping', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerBookKeeping'
        ).to.have.attributes([
            'id',
            'displayId',
            'isBlocked',
            'mdiBookKeeping',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerSearch', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerSearch'
        ).to.have.attributes([
            'id',
            'displayId',
            'isBlocked',
            'firstName',
            'lastName',
            'emailAddress',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerPerson', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerPerson'
        ).to.have.attributes([
            'up_', // BusinessPartner
            'nameDetails', // composition of one PersonName
            'gender',
            'language',
            'correspondenceLanguage',
            'birthDate',
            'nationality',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerPersonNameDetails', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerPersonNameDetails'
        ).to.have.attributes([
            'up_', // BusinessPartnerPerson
            'firstName',
            'middleName',
            'lastName',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerOrganization', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerOrganization'
        ).to.have.attributes([
            'up_', // BusinessPartner
            'nameDetails', // composition of OrganizationName
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerOrganizationNameDetails', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerOrganizationNameDetails'
        ).to.have.attributes([
            'up_', // BusinessPartnerOrganization
            'formattedOrgNameLine1',
            'formattedOrgNameLine2',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerBankAccounts', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerBankAccounts'
        ).to.have.attributes([
            'up_', // BusinessPartner
            'id',
            'bankAccountName',
            'bankControlKey',
            'validFrom',
            'validTo',
            'bankCountry',
            'bankAccountHolderName',
            'IBAN',
            'bankAccount',
            'bankNumber',
            'bankAccountReference',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerTaxNumbers', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerTaxNumbers'
        ).to.have.attributes([
            'up_', // BusinessPartner
            'taxNumberType',
            'taxNumber',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerAddressData', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerAddressData'
        ).to.have.attributes([
            'up_', // BusinessPartner
            'id',
            'usages', // composition of many AddressDataUsage
            'postalAddressType',
            'personPostalAddress', // composition of one PersonAddress
            'organizationPostalAddress', // composition of one OrganizationAddress
            'emailAddresses', // composition of many Email
            'validFrom',
            'validTo',
            'communicationPreferences',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerAddressDataUsages', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerAddressDataUsages'
        ).to.have.attributes([
            'up_', // BusinessPartnerAddressData
            'usage',
            'validTo',
            'validFrom',
            'isStandard',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerAddressDataPersonPostalAddress', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerAddressDataPersonPostalAddress'
        ).to.have.attributes([
            'up_', // BusinessPartnerAddressData
            'street', // type Street
            'streetSuffix1',
            'streetSuffix2',
            'houseNumber',
            'town', // type Town
            'primaryRegion',
            'country',
            'postCode',
            'companyPostalCode',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerAddressDataOrganizationPostalAddress', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerAddressDataOrganizationPostalAddress'
        ).to.have.attributes([
            'up_', // BusinessPartnerAddressData
            'street', // type Street
            'streetSuffix1',
            'streetSuffix2',
            'houseNumber',
            'town', // type Town
            'primaryRegion',
            'country',
            'postCode',
            'companyPostalCode',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerAddressDataEmailAddresses', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerAddressDataEmailAddresses'
        ).to.have.attributes([
            'up_', // BusinessPartnerAddressData
            'id',
            'address',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerAddressDataPhoneNumbers', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerAddressDataPhoneNumbers'
        ).to.have.attributes([
            'up_', // BusinessPartnerAddressData
            'id',
            'isMobile',
            'country',
            'number',
            'numberExtension',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerRoles', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerRoles'
        ).to.have.attributes([
            'up_', // BusinessPartner
            'role',
            'validFrom',
            'validTo',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerCustomerInformation', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerCustomerInformation'
        ).to.have.attributes([
            'up_', // BusinessPartner
            'salesArrangements',
            'taxClassifications',
            'customerAccountGroup',
            'vatLiability',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerCustomerInformationSalesArrangements', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerCustomerInformationSalesArrangements'
        ).to.have.attributes([
            'up_',
            'salesAreaRef',
            'deliveryPriority',
            'currency',
            'salesArrangementGroup',
            'salesArrangementPriceGroup',
            'functions',
            'incotermsClassification',
            'incotermsTransferLocationName',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerCustomerInformationSalesArrangementsFunctions', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerCustomerInformationSalesArrangementsFunctions'
        ).to.have.attributes([
            'up_',
            'functionName',
            'functionCode',
            'functionPartnerType',
            'partnerNumber',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerCustomerInformationTaxClassifications', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerCustomerInformationTaxClassifications'
        ).to.have.attributes([
            'up_',
            'country',
            'taxCategory',
            'taxClassification',
        ]);
    });

    it('should contain all defined attributes of BusinessPartnerServiceProviderInformation', () => {
        expect(
            'BusinessPartnerService.BusinessPartnerServiceProviderInformation'
        ).to.have.attributes([
            'up_', // ServiceProviderDetails
            'id',
            'marketFunction',
            'marketFunctionCodeNumber1',
            'marketFunctionSource1',
            'marketFunctionCodeNumber2',
            'marketFunctionSource2',
            'validFrom',
            'validTo',
        ]);
    });

    it('should contain all defined attributes of TaxNumberTypeCodes', () => {
        expect(
            'BusinessPartnerConfigService.TaxNumberTypeCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of AddressDataUsageCodes', () => {
        expect(
            'BusinessPartnerConfigService.AddressDataUsageCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of BusinessPartnerRoleCodes', () => {
        expect(
            'BusinessPartnerConfigService.BusinessPartnerRoleCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of GenderCodes', () => {
        expect('CommonConfigurationService.GenderCodes').to.have.attributes([
            'code',
            'name',
            'descr',
        ]);
    });

    it('should contain all defined attributes of LanguageCodes', () => {
        expect('CommonConfigurationService.LanguageCodes').to.have.attributes([
            'code',
            'name',
            'descr',
        ]);
    });

    it('should contain all defined attributes of CountryCodes', () => {
        expect('CommonConfigurationService.CountryCodes').to.have.attributes([
            'code',
            'name',
            'descr',
        ]);
    });

    it('should contain all defined attributes of CurrencyCodes', () => {
        expect('CommonConfigurationService.CurrencyCodes').to.have.attributes([
            'code',
            'name',
            'descr',
        ]);
    });

    it('should contain all defined attributes of IncotermsClassificationCodes', () => {
        expect(
            'CommonConfigurationService.IncotermsClassificationCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of AcademicTitleCodes', () => {
        expect(
            'CommonConfigurationService.AcademicTitleCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of CountrySubdivisionCodes', () => {
        expect(
            'CommonConfigurationService.CountrySubdivisionCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of StreetCodes', () => {
        expect('CommonConfigurationService.StreetCodes').to.have.attributes([
            'code',
            'name',
            'descr',
        ]);
    });

    it('should contain all defined attributes of TownCodes', () => {
        expect('CommonConfigurationService.TownCodes').to.have.attributes([
            'code',
            'name',
            'descr',
        ]);
    });

    it('should contain all defined attributes of TaxCategoryCodes', () => {
        expect(
            'BusinessPartnerConfigService.TaxCategoryCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of CustomerAccountGroupCodes', () => {
        expect(
            'BusinessPartnerConfigService.CustomerAccountGroupCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of SalesPartnerRoleCodes', () => {
        expect(
            'BusinessPartnerConfigService.SalesPartnerRoleCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of CustomerTaxClassificationCodes', () => {
        expect(
            'BusinessPartnerConfigService.CustomerTaxClassificationCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of CustomerSalesArrangementGroupCodes', () => {
        expect(
            'BusinessPartnerConfigService.CustomerSalesArrangementGroupCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of CustomerSalesArrangementPriceGroupCodes', () => {
        expect(
            'BusinessPartnerConfigService.CustomerSalesArrangementPriceGroupCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of DeliveryPriorityCodes', () => {
        expect(
            'BusinessPartnerConfigService.DeliveryPriorityCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of MarketFunctionCodes', () => {
        expect(
            'BusinessPartnerConfigService.MarketFunctionCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });
});

/*describe('BusinessPartnerServiceBeta CDS test UTILITIESCLOUDSOLUTION-3012', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should contain @readonly annotations for displayId', () => {
        const displayIdReadOnly = cds
            .reflect(cds.model)
            .entities('BusinessPartnerServiceBeta').BusinessPartner.elements
            .displayId['@readonly'];
        expect(displayIdReadOnly).to.be.true;
    });
});*/
