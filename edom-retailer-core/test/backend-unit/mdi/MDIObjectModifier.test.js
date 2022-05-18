const cds = require('@sap/cds');
const path = require('path');
const expect = require('expect');
const MDIObjectModifier = require('../../../srv/mdiclient/MDIObjectModifier');
const BusinessPartnerMockPayload = require('../../backend-it/payload/BusinessPartnerMockPayload');
const ProductCreatedMockPayload = require('../../backend-it/payload/mdiProductAPI/MDIProductCreatedMockPayload');
const AuditLogService = require('../../../srv/dpp/AuditLogService');

describe('MDIObjectModifier.test unit-test', () => {
    let srv;

    AuditLogService.registerHandler = jest.fn();

    beforeAll(async () => {
        await cds
            .serve('API_EDOM_RETAILER')
            .from(path.join(__dirname, '../../../srv'));
        await cds
            .serve('BusinessPartnerService')
            .from(path.join(__dirname, '../../../srv'));
    });

    it('should test MDIObjectModifier against business partner - UTILITIESCLOUDSOLUTION-3079', () => {
        const { BusinessPartnerService } = cds.services;
        const { completeBpPersonMix1: payload } = BusinessPartnerMockPayload;
        const MDIObjectModifierInst = new MDIObjectModifier(
            payload
        ).fitToEntity(BusinessPartnerService, 'BusinessPartner');
        const result = MDIObjectModifierInst.getModifiedObject();

        const expectedResult = {
            businessPartnerType: 'person',
            person: {
                nameDetails: {
                    firstName: 'Zack',
                    lastName: 'Haynes',
                    academicTitle_code: '0004',
                },
                gender_code: '0',
                language_code: 'en',
                correspondenceLanguage_code: 'en',
                birthDate: '1990-12-31',
                nationality_code: 'US',
            },
            bankAccounts: [
                {
                    validFrom: '2020-01-01',
                    validTo: '2020-12-31',
                    bankCountry_code: 'CA',
                    bankAccountHolderName: 'bankAccountHolderName1',
                    IBAN: 'IBAN1',
                    bankAccount: 'bankAccountNumber1',
                    bankNumber: '21112018',
                    bankAccountReference: 'bankAccRef1',
                    id: '0001',
                    bankAccountName: 'bankAccountName1',
                    bankControlKey: '01',
                },
                {
                    validFrom: '2021-01-01',
                    validTo: '2021-12-31',
                    bankCountry_code: 'CA',
                    bankAccountHolderName: 'bankAccountHolderName2',
                    IBAN: 'IBAN2',
                    bankAccount: 'bankAccountNumber2',
                    bankNumber: '21112018',
                    bankAccountReference: 'bankAccRef2',
                    id: '0002',
                    bankAccountName: 'bankAccountName2',
                    bankControlKey: '02',
                },
            ],
            taxNumbers: [
                {
                    taxNumberType_code: 'DE0',
                    taxNumber: '987654321',
                },
                {
                    taxNumberType_code: 'US01',
                    taxNumber: '123456789',
                },
            ],
            addressData: [
                {
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                    validFrom: '2020-12-31',
                    validTo: '9999-12-31',
                    usages: [
                        {
                            usage_code: 'BILLING',
                            validTo: '9999-12-31',
                            validFrom: '2021-12-31',
                        },
                        {
                            usage_code: 'XXDEFAULT',
                            validTo: '9999-12-31',
                            validFrom: '2020-12-31',
                        },
                    ],
                    communicationPreferences: {
                        nonVerbalCommunicationLanguage: {
                            code: 'en',
                        },
                    },
                    postalAddressType: 'personPostalAddress',
                    personPostalAddress: {
                        street: {
                            name: 'Dane Street',
                        },
                        streetSuffix1: 'suffix1 v1',
                        streetSuffix2: 'suffix2 v1',
                        houseNumber: '778',
                        primaryRegion_code: 'WA',
                        town: {
                            name: 'Green Bluff',
                        },
                        country_code: 'US',
                        postCode: '99003',
                        companyPostalCode: '99003',
                    },
                    emailAddresses: [
                        {
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                            address: 'zack.haynes@email.com',
                        },
                        {
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                            address: 'katrina.claybourne@email.com',
                        },
                    ],
                    phoneNumbers: [
                        {
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                            country_code: 'US',
                            number: '1234567890',
                            numberExtension: '123',
                            isMobile: true,
                        },
                        {
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                            country_code: 'DE',
                            number: '9876543210',
                            numberExtension: '321',
                            isMobile: true,
                        },
                    ],
                },
                {
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8e',
                    validFrom: '2020-12-31',
                    validTo: '9999-12-31',
                    usages: [
                        {
                            usage_code: 'BILLING',
                            validTo: '9999-12-31',
                            validFrom: '2021-12-31',
                        },
                        {
                            usage_code: 'SHIPPING',
                            validTo: '9999-12-31',
                            validFrom: '2021-12-31',
                        },
                    ],
                    communicationPreferences: {
                        nonVerbalCommunicationLanguage: {
                            code: 'de',
                        },
                    },
                    postalAddressType: 'personPostalAddress',
                    personPostalAddress: {
                        street: {
                            name: 'Genslerstrabe',
                        },
                        streetSuffix1: 'suffix1 v2',
                        streetSuffix2: 'suffix2 v2',
                        houseNumber: '84',
                        primaryRegion_code: 'BE',
                        town: {
                            name: 'Berlin Wedding',
                        },
                        country_code: 'DE',
                        postCode: '13359',
                        companyPostalCode: '13359',
                    },
                    emailAddresses: [
                        {
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                            address: 'katrina.claybourne@email.com',
                        },
                        {
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
                            address: 'patrick.angelil@email.com',
                        },
                    ],
                    phoneNumbers: [
                        {
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                            country_code: 'DE',
                            number: '9876543210',
                            numberExtension: '321',
                            isMobile: true,
                        },
                        {
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
                            country_code: 'CA',
                            number: '6789543210',
                            numberExtension: '132',
                            isMobile: true,
                        },
                    ],
                },
            ],
            roles: [
                {
                    validFrom: '2020-01-01',
                    validTo: '2020-12-31',
                    role_code: 'MKK',
                },
                {
                    validFrom: '2021-01-01',
                    validTo: '2021-12-31',
                    role_code: 'UKM000',
                },
                {
                    validFrom: '2021-01-01',
                    validTo: '2021-12-31',
                    role_code: 'FLCU01',
                },
            ],
            customerInformation: {
                customerAccountGroup_code: 'CUST',
                vatLiability: true,
                salesArrangements: [
                    {
                        incotermsClassification_code: 'EXW',
                        incotermsTransferLocationName: 'transferLocationName',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '1010',
                            distributionChannel: '10',
                            division: '00',
                        },
                        deliveryPriority_code: '01',
                        currency_code: 'USD',
                        salesArrangementGroup_code: '03',
                        salesArrangementPriceGroup_code: 'C1',
                        functions: [
                            {
                                functionName: 'Bill-to Party',
                                functionCode_code: 'RE',
                                functionPartnerType: 'functionPartnerCustomer',
                            },
                            {
                                functionName: 'Payer',
                                functionCode_code: 'RG',
                                functionPartnerType: 'functionPartnerCustomer',
                            },
                            {
                                functionName: 'Ship-to Party',
                                functionCode_code: 'WE',
                                functionPartnerType: 'functionPartnerCustomer',
                            },
                            {
                                functionName: 'Sold-to Party',
                                functionCode_code: 'AG',
                                functionPartnerType: 'functionPartnerCustomer',
                            },
                        ],
                    },
                    {
                        incotermsClassification_code: 'EXW',
                        incotermsTransferLocationName: 'transferLocationName',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '2020',
                            distributionChannel: '20',
                            division: '00',
                        },
                        deliveryPriority_code: '01',
                        currency_code: 'EUR',
                        salesArrangementGroup_code: '03',
                        salesArrangementPriceGroup_code: 'C1',
                        functions: [
                            {
                                functionName: 'Bill-to Party',
                                functionCode_code: 'RE',
                                functionPartnerType: 'functionPartnerCustomer',
                            },
                            {
                                functionName: 'Payer',
                                functionCode_code: 'RG',
                                functionPartnerType: 'functionPartnerCustomer',
                            },
                            {
                                functionName: 'Ship-to Party',
                                functionCode_code: 'WE',
                                functionPartnerType: 'functionPartnerCustomer',
                            },
                            {
                                functionName: 'Sold-to Party',
                                functionCode_code: 'AG',
                                functionPartnerType: 'functionPartnerCustomer',
                            },
                        ],
                    },
                ],
                taxClassifications: [
                    {
                        country_code: 'DE',
                        taxCategory_code: 'TTX1',
                        taxClassification_code: '1',
                    },
                    {
                        country_code: 'US',
                        taxCategory_code: 'TTX1',
                        taxClassification_code: '1',
                    },
                ],
            },
        };

        expect(result).toMatchObject(expectedResult);
    });

    it('should test MDIObjectModifier against product - UTILITIESCLOUDSOLUTION-3079', () => {
        const { API_EDOM_RETAILER } = cds.services;
        const { instance: payload } = ProductCreatedMockPayload[0].value[0];
        const MDIObjectModifierInst = new MDIObjectModifier(
            payload
        ).fitToEntity(API_EDOM_RETAILER, 'Product');
        const result = MDIObjectModifierInst.getModifiedObject();

        const expectedResult = {
            id: 'ca3aac87-bd9b-4cce-adb1-8443dbd2b61d',
            displayId: '4063',
            name: 'name in english',
            salesAspect: { division_code: '00' },
            texts: [
                { locale: 'en', name: 'name in english', description: 'Text.' },
                {
                    locale: 'ru',
                    name: 'name in russian',
                    description: 'Text in russian.',
                },
            ],
            description: 'Text.',
            type_code: 'HAWA',
        };
        expect(result).toMatchObject(expectedResult);
    });

    it('should ignore salesAspect of product as it has no valid fields - UTILITIESCLOUDSOLUTION-3079', () => {
        const { API_EDOM_RETAILER } = cds.services;
        const { instance: payload } = ProductCreatedMockPayload[0].value[1];
        const MDIObjectModifierInst = new MDIObjectModifier(
            payload
        ).fitToEntity(API_EDOM_RETAILER, 'Product');
        const result = MDIObjectModifierInst.getModifiedObject();

        const expectedResult = {
            id: 'ba3aac87-bd9b-4cce-adb1-8443dbd2b61d',
            displayId: '4062',
            name: 'name in english',
            texts: [
                {
                    locale: 'en',
                    name: 'name in english',
                    description: 'Basic text.',
                },
                {
                    locale: 'ru',
                    name: 'name in russian',
                    description: 'Basic text in russian.',
                },
            ],
            description: 'Basic text.',
            type_code: 'HAWA',
        };
        expect(result).toStrictEqual(expectedResult);
    });

    it('should test MDIObjectModifier serving non-existent entity - UTILITIESCLOUDSOLUTION-3079', () => {
        const { BusinessPartnerService } = cds.services;
        const { completeBpPersonMix1: payload } = BusinessPartnerMockPayload;
        try {
            const MDIObjectModifierInst = new MDIObjectModifier(
                payload
            ).fitToEntity(BusinessPartnerService, 'Dummy');
            expect(MDIObjectModifierInst).toBeFalsy();
        } catch (error) {
            expect(error.message).toBe(
                '[MDIObjectModifier][fitToEntity] non-existing entity name "Dummy" passed'
            );
        }
    });
});
