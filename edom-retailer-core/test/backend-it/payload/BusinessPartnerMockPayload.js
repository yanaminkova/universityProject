// mock payloads
const basePerson = {
    // displayId: 'sampleId1', // displayId is a readonly field
    businessPartnerType: 'person',
    isBlocked: false,
};

const baseOrg = {
    // displayId: 'sampleId1', // displayId is a readonly field
    businessPartnerType: 'organization',
    isBlocked: false,
};

const baseBpGroup = {
    // displayId: 'sampleId1', // displayId is a readonly field
    businessPartnerType: 'businessPartnerGroup',
    isBlocked: false,
};

const person1 = {
    nameDetails: null,
    gender: { code: '0' }, // ODM & S4 valid code
    language: { code: 'en' }, // ODM & S4 valid code
    correspondenceLanguage: { code: 'en' }, // ODM & S4 valid code
    birthDate: '1990-12-31',
    nationality: { code: 'US' }, // ODM & S4 valid code
};

const person2 = {
    nameDetails: null,
    gender: { code: '2' }, // ODM & S4 valid code
    language: { code: 'de' }, // ODM & S4 valid code
    correspondenceLanguage: { code: 'de' }, // ODM & S4 valid code
    birthDate: '1980-01-01',
    nationality: { code: 'DE' }, // ODM & S4 valid code
};

const person3 = {
    nameDetails: null,
    gender: { code: '1' }, // ODM & S4 valid code
    language: { code: 'fr' }, // ODM & S4 valid code
    correspondenceLanguage: { code: 'fr' }, // ODM & S4 valid code
    birthDate: '1970-06-06',
    nationality: { code: 'CA' }, // ODM & S4 valid code
};

const requiredPersonNameDetails1 = {
    firstName: 'Zack',
    lastName: 'Haynes',
    academicTitle: {
        code: '0004',
    },
};

const requiredPersonNameDetails2 = {
    firstName: 'Katrina',
    lastName: 'Claybourne',
    academicTitle: {
        code: '0005',
    },
};

const requiredPersonNameDetails3 = {
    firstName: 'Patrick',
    lastName: 'Angélil',
    academicTitle: {
        code: '0002',
    },
};

// Work in progress
const completePersonNameDetails1 = {
    ...requiredPersonNameDetails1,
    // other fields
};

const completePersonNameDetails2 = {
    ...requiredPersonNameDetails2,
    // other fields
};

const completePersonNameDetails3 = {
    ...requiredPersonNameDetails3,
    // other fields
};

const requiredPerson1 = {
    nameDetails: {
        ...requiredPersonNameDetails1,
    },
};

const requiredPerson2 = {
    nameDetails: {
        ...requiredPersonNameDetails2,
    },
};

const requiredPerson3 = {
    nameDetails: {
        ...requiredPersonNameDetails3,
    },
};

const completePerson1 = {
    ...person1,
    nameDetails: {
        ...completePersonNameDetails1,
    },
};

const completePerson2 = {
    ...person2,
    nameDetails: {
        ...completePersonNameDetails2,
    },
};

const completePerson3 = {
    ...person3,
    nameDetails: {
        ...completePersonNameDetails3,
    },
};

// Work in progress
const organization1 = {
    nameDetails: null,
    // other fields
};

const organization2 = {
    nameDetails: null,
    // other fields
};

const organization3 = {
    nameDetails: null,
    // other fields
};

const requiredOrgNameDetails1 = {
    formattedOrgNameLine1: 'orgNameLine1 v1',
    formattedOrgNameLine2: 'orgNameLine2 v1',
    formattedOrgNameLine3: 'orgNameLine3 v1',
    formattedOrgNameLine4: 'orgNameLine4 v1',
};

const requiredOrgNameDetails2 = {
    formattedOrgNameLine1: 'orgNameLine1 v2',
    formattedOrgNameLine2: 'orgNameLine2 v2',
    formattedOrgNameLine3: 'orgNameLine3 v2',
    formattedOrgNameLine4: 'orgNameLine4 v2',
};

const requiredOrgNameDetails3 = {
    formattedOrgNameLine1: 'orgNameLine1 v3',
    formattedOrgNameLine2: 'orgNameLine2 v3',
    formattedOrgNameLine3: 'orgNameLine3 v3',
    formattedOrgNameLine4: 'orgNameLine4 v3',
};

const completeOrgNameDetails1 = {
    ...requiredOrgNameDetails1,
    // other fields
    // formattedOrgName: null,
};

const completeOrgNameDetails2 = {
    ...requiredOrgNameDetails2,
    // other fields
    // formattedOrgName: null,
};

const completeOrgNameDetails3 = {
    ...requiredOrgNameDetails3,
    // other fields
    // formattedOrgName: null,
};

const requiredOrg1 = {
    nameDetails: {
        ...requiredOrgNameDetails1,
    },
};

const requiredOrg2 = {
    nameDetails: {
        ...requiredOrgNameDetails2,
    },
};

const requiredOrg3 = {
    nameDetails: {
        ...requiredOrgNameDetails3,
    },
};

const completeOrg1 = {
    ...organization1,
    nameDetails: {
        ...completeOrgNameDetails1,
    },
};

const completeOrg2 = {
    ...organization2,
    nameDetails: {
        ...completeOrgNameDetails2,
    },
};

const completeOrg3 = {
    ...organization3,
    nameDetails: {
        ...completeOrgNameDetails3,
    },
};

// note: complete EXPOSED fields
const completeBankAccount1 = {
    id: '0001',
    bankAccountName: 'bankAccountName1',
    bankControlKey: '01',
    validFrom: '2020-01-01',
    validTo: '2020-12-31',
    bankAccountHolderName: 'bankAccountHolderName1',
    IBAN: 'IBAN1',
    bankAccount: 'bankAccountNumber1',
    bankNumber: '21112018', // S4 existing bank number (e.g. 21112018)
    bankAccountReference: 'bankAccRef1',
    bankCountry: { code: 'CA' }, // ODM & S4 valid code
};

// note: complete EXPOSED fields
const completeBankAccount2 = {
    id: '0002',
    bankAccountName: 'bankAccountName2',
    bankControlKey: '02',
    validFrom: '2021-01-01',
    validTo: '2021-12-31',
    bankAccountHolderName: 'bankAccountHolderName2',
    IBAN: 'IBAN2',
    bankAccount: 'bankAccountNumber2',
    bankNumber: '21112018', // S4 existing bank number (e.g. 21112018)
    bankAccountReference: 'bankAccRef2',
    bankCountry: { code: 'CA' }, // ODM & S4 valid code
};

const completeBankAccount3 = {
    id: '0003',
    bankAccountName: 'bankAccountName3',
    bankControlKey: '03',
    validFrom: '2020-01-01',
    validTo: '2021-12-31',
    bankAccountHolderName: 'bankAccountHolderName3',
    IBAN: 'IBAN3',
    bankAccount: 'bankAccountNumber3',
    bankNumber: '12345678',
    bankAccountReference: 'bankAccRef3',
    bankCountry: { code: 'CA' }, // ODM & S4 valid code
};

const completeTaxNumber1 = {
    taxNumberType: { code: 'US01' }, // S4 valid code
    taxNumber: '123456789',
};

const completeTaxNumber2 = {
    taxNumberType: { code: 'DE0' }, // S4 valid code
    taxNumber: '987654321',
};

const completeTaxNumber3 = {
    taxNumberType: { code: 'CA0' }, // S4 valid code - need to confirm
    taxNumber: '678954321',
};

const completeRole1 = {
    role: { code: 'MKK' }, // ODM & S4 valid code
    validFrom: '2020-01-01',
    validTo: '2020-12-31',
};

const completeRole2 = {
    role: { code: 'UKM000' }, // ODM & S4 valid code
    validFrom: '2021-01-01',
    validTo: '2021-12-31',
};

const completeRole3 = {
    role: { code: 'FLCU00' }, // ODM & S4 valid code
    validFrom: '2020-01-01',
    validTo: '2021-12-31',
};

const customerRole = {
    role: { code: 'FLCU01' },
    validFrom: '2021-01-01',
    validTo: '2021-12-31',
};

const usages1 = {
    isStandard: false,
    usage: { code: 'XXDEFAULT' }, // ODM & S4 valid code
    validFrom: '2020-12-31',
    validTo: '9999-12-31',
};

const usages2 = {
    isStandard: false,
    usage: { code: 'BILLING' }, // ODM & S4 valid code
    validFrom: '2021-12-31',
    validTo: '9999-12-31',
};

const usages3 = {
    isStandard: false,
    usage: { code: 'SHIPPING' }, // ODM & S4 valid code
    validFrom: '2021-12-31',
    validTo: '9999-12-31',
};

const emailAddress1 = {
    address: 'zack.haynes@email.com',
    isDefault: false,
};

const emailAddress2 = {
    address: 'katrina.claybourne@email.com',
    isDefault: false,
};

const emailAddress3 = {
    address: 'patrick.angelil@email.com',
    isDefault: false,
};

const phoneNumber1 = {
    isMobile: true,
    country: {
        code: 'US',
    },
    number: '1234567890',
    numberExtension: '123',
    isDefault: false,
};

const phoneNumber2 = {
    isMobile: true,
    country: {
        code: 'DE',
    },
    number: '9876543210',
    numberExtension: '321',
    isDefault: false,
};

const phoneNumber3 = {
    isMobile: true,
    country: {
        code: 'CA',
    },
    number: '6789543210',
    numberExtension: '132',
    isDefault: false,
};

const addressData1 = {
    communicationPreferences: {
        nonVerbalCommunicationLanguage: {
            code: 'en',
        },
    },
    usages: [
        {
            ...usages1,
        },
    ],
    emailAddresses: [
        {
            ...emailAddress1,
        },
    ],
    phoneNumbers: [
        {
            ...phoneNumber1,
        },
    ],
    validFrom: '2020-12-31',
    validTo: '9999-12-31',
    // postalAddressType: null,
    // personPostalAddress: null,
    // organizationPostalAddress: null,
};

const addressData2 = {
    communicationPreferences: {
        nonVerbalCommunicationLanguage: {
            code: 'en',
        },
    },
    usages: [
        {
            ...usages2,
        },
    ],
    emailAddresses: [
        {
            ...emailAddress2,
        },
    ],
    phoneNumbers: [
        {
            ...phoneNumber2,
        },
    ],
    validFrom: '2021-01-01',
    validTo: '9999-12-31',
    // postalAddressType: null,
    // personPostalAddress: null,
    // organizationPostalAddress: null,
};

const addressData3 = {
    communicationPreferences: {
        nonVerbalCommunicationLanguage: {
            code: 'fr',
        },
    },
    usages: [
        {
            ...usages3,
        },
    ],
    emailAddresses: [
        {
            ...emailAddress3,
        },
    ],
    phoneNumbers: [
        {
            ...phoneNumber3,
        },
    ],
    validFrom: '2020-12-31',
    validTo: '9999-12-31',
    // postalAddressType: null,
    // personPostalAddress: null,
    // organizationPostalAddress: null,
};

const addressDataMix1 = {
    communicationPreferences: {
        nonVerbalCommunicationLanguage: {
            code: 'en',
        },
    },
    usages: [
        {
            ...usages2,
        },
        {
            ...usages1,
        },
    ],
    emailAddresses: [
        {
            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
            ...emailAddress1,
        },
        {
            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
            ...emailAddress2,
        },
    ],
    phoneNumbers: [
        {
            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
            ...phoneNumber1,
        },
        {
            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
            ...phoneNumber2,
        },
    ],
    validFrom: '2020-12-31',
    validTo: '9999-12-31',
    // postalAddressType: null,
    // personPostalAddress: null,
    // organizationPostalAddress: null,
};

const addressDataMix2 = {
    communicationPreferences: {
        nonVerbalCommunicationLanguage: {
            code: 'de',
        },
    },
    usages: [
        {
            ...usages2,
        },
        {
            ...usages3,
        },
    ],
    emailAddresses: [
        {
            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
            ...emailAddress2,
        },
        {
            id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
            ...emailAddress3,
        },
    ],
    phoneNumbers: [
        {
            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
            ...phoneNumber2,
        },
        {
            id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
            ...phoneNumber3,
        },
    ],
    validFrom: '2020-12-31',
    validTo: '9999-12-31',
    // postalAddressType: null,
    // personPostalAddress: null,
    // organizationPostalAddress: null,
};

const requiredPostalAddress1 = {
    street: {
        name: 'Dane Street',
    },
    houseNumber: '778',
    primaryRegion: {
        code: 'WA', // S4 valid code. ODM equivalent is 'US-WA'
    },
    country: {
        code: 'US', // ODM & S4 valid code
    },
    town: {
        name: 'Green Bluff',
    },
    postCode: '99003',
};

const requiredPostalAddress2 = {
    street: {
        name: 'Genslerstrabe',
    },
    houseNumber: '84',
    primaryRegion: {
        code: 'BE', // S4 valid code. ODM equivalent is 'DE-11'
    },
    country: {
        code: 'DE', // ODM & S4 valid code
    },
    town: {
        name: 'Berlin Wedding',
    },
    postCode: '13359',
};

const requiredPostalAddress3 = {
    street: {
        name: 'Scotchmere Dr',
    },
    houseNumber: '4336',
    primaryRegion: {
        code: 'ON', // S4 valid code. ODM equivalent is 'CA-ON'
    },
    country: {
        code: 'CA', // ODM & S4 valid code
    },
    town: {
        name: 'Sarnia',
    },
    postCode: 'N7S 3Y2',
};

// note: complete EXPOSED fields
const completePostalAddress1 = {
    ...requiredPostalAddress1,
    streetSuffix1: 'suffix1 v1',
    streetSuffix2: 'suffix2 v1',
    companyPostalCode: '99003',
};

// note: complete EXPOSED fields
const completePostalAddress2 = {
    ...requiredPostalAddress2,
    streetSuffix1: 'suffix1 v2',
    streetSuffix2: 'suffix2 v2',
    companyPostalCode: '13359',
};

// note: complete EXPOSED fields
const completePostalAddress3 = {
    ...requiredPostalAddress2,
    streetSuffix1: 'suffix1 v3',
    streetSuffix2: 'suffix2 v3',
    companyPostalCode: 'N7S 3Y2',
};

const requiredPersonAddressData1 = {
    communicationPreferences: {
        nonVerbalCommunicationLanguage: {
            code: 'en',
        },
    },
    postalAddressType: 'personPostalAddress',
    personPostalAddress: {
        ...requiredPostalAddress1,
    },
};

const requiredPersonAddressData2 = {
    communicationPreferences: {
        nonVerbalCommunicationLanguage: {
            code: 'de',
        },
    },
    postalAddressType: 'personPostalAddress',
    personPostalAddress: {
        ...requiredPostalAddress2,
    },
};

const requiredPersonAddressData3 = {
    communicationPreferences: {
        nonVerbalCommunicationLanguage: {
            code: 'fr',
        },
    },
    postalAddressType: 'personPostalAddress',
    personPostalAddress: {
        ...requiredPostalAddress3,
    },
};

const requiredOrgAddressData1 = {
    communicationPreferences: {
        nonVerbalCommunicationLanguage: {
            code: 'en',
        },
    },
    postalAddressType: 'organizationPostalAddress',
    organizationPostalAddress: {
        ...requiredPostalAddress1,
    },
};

const requiredOrgAddressData2 = {
    communicationPreferences: {
        nonVerbalCommunicationLanguage: {
            code: 'de',
        },
    },
    postalAddressType: 'organizationPostalAddress',
    organizationPostalAddress: {
        ...requiredPostalAddress2,
    },
};

const requiredOrgAddressData3 = {
    communicationPreferences: {
        nonVerbalCommunicationLanguage: {
            code: 'fr',
        },
    },
    postalAddressType: 'organizationPostalAddress',
    organizationPostalAddress: {
        ...requiredPostalAddress3,
    },
};

// note: complete EXPOSED fields
const completePersonAddressData1 = {
    ...addressData1,
    postalAddressType: 'personPostalAddress',
    personPostalAddress: {
        ...completePostalAddress1,
    },
};

// note: complete EXPOSED fields
const completePersonAddressData2 = {
    ...addressData2,
    postalAddressType: 'personPostalAddress',
    personPostalAddress: {
        ...completePostalAddress2,
    },
};

// note: complete EXPOSED fields
const completePersonAddressData3 = {
    ...addressData3,
    postalAddressType: 'personPostalAddress',
    personPostalAddress: {
        ...completePostalAddress3,
    },
};

// note: complete EXPOSED fields
const completePersonAddressDataMix1 = {
    ...addressDataMix1,
    postalAddressType: 'personPostalAddress',
    personPostalAddress: {
        ...completePostalAddress1,
    },
};

// note: complete EXPOSED fields
const completePersonAddressDataMix2 = {
    ...addressDataMix2,
    postalAddressType: 'personPostalAddress',
    personPostalAddress: {
        ...completePostalAddress2,
    },
};

// note: complete EXPOSED fields
const completeOrgAddressData1 = {
    ...addressData1,
    postalAddressType: 'organizationPostalAddress',
    organizationPostalAddress: {
        ...completePostalAddress1,
    },
};

// note: complete EXPOSED fields
const completeOrgAddressData2 = {
    ...addressData2,
    postalAddressType: 'organizationPostalAddress',
    organizationPostalAddress: {
        ...completePostalAddress2,
    },
};

// note: complete EXPOSED fields
const completeOrgAddressData3 = {
    ...addressData3,
    postalAddressType: 'organizationPostalAddress',
    organizationPostalAddress: {
        ...completePostalAddress3,
    },
};

// note: complete EXPOSED fields
const completeOrgAddressDataMix1 = {
    ...addressDataMix1,
    postalAddressType: 'organizationPostalAddress',
    organizationPostalAddress: {
        ...completePostalAddress1,
    },
};

// note: complete EXPOSED fields
const completeOrgAddressDataMix2 = {
    ...addressDataMix2,
    postalAddressType: 'organizationPostalAddress',
    organizationPostalAddress: {
        ...completePostalAddress2,
    },
};

const completeCustomerInfoSalesArrFunctionSoldTo = {
    functionName: 'Sold-to Party',
    functionCode: {
        code: 'AG', // S4 valid code. ODM equivalent is '0000001100'
    },
    functionPartnerType: 'functionPartnerCustomer',
    // partnerNumber: '2281450', // S4 existing local ID. Leaving it blank would default to own local ID
};

const completeCustomerInfoSalesArrFunctionBillTo = {
    functionName: 'Bill-to Party',
    functionCode: {
        code: 'RE', // S4 valid code. ODM equivalent is '0000001400'
    },
    functionPartnerType: 'functionPartnerCustomer',
    // partnerNumber: '2281450', // S4 existing local ID. Leaving it blank would default to own local ID
};

const completeCustomerInfoSalesArrFunctionShipTo = {
    functionName: 'Ship-to Party',
    functionCode: {
        code: 'WE', // S4 valid code. ODM equivalent is '0000001300'
    },
    functionPartnerType: 'functionPartnerCustomer',
    // partnerNumber: '2281450', // S4 existing local ID. Leaving it blank would default to own local ID
};

const completeCustomerInfoSalesArrFunctionPayer = {
    functionName: 'Payer',
    functionCode: {
        code: 'RG', // S4 valid code. ODM equivalent is '0000001110'
    },
    functionPartnerType: 'functionPartnerCustomer',
    // partnerNumber: '2281450', // S4 existing local ID. Leaving it blank would default to own local ID
};

const completeCustomerInfoSalesArrangement1 = {
    salesAreaRef: {
        salesOrganizationDisplayId: '1010',
        distributionChannel: '10',
        division: '00',
    },
    deliveryPriority: {
        code: '01', // S4 valid code. ODM codes not available
    },
    currency: {
        code: 'USD', // ODM & S4 valid code
    },
    salesArrangementGroup: {
        code: '03', // S4 valid code. ODM codes not available
    },
    salesArrangementPriceGroup: {
        code: 'C1', // S4 valid code. ODM codes not available
    },
    functions: [
        {
            ...completeCustomerInfoSalesArrFunctionBillTo,
        },
        {
            ...completeCustomerInfoSalesArrFunctionPayer,
        },
        {
            ...completeCustomerInfoSalesArrFunctionShipTo,
        },
        {
            ...completeCustomerInfoSalesArrFunctionSoldTo,
        },
    ],
    incotermsClassification: {
        code: 'EXW', // ODM & S4 valid code
    },
    incotermsTransferLocationName: 'transferLocationName',
};

const completeCustomerInfoSalesArrangement2 = {
    salesAreaRef: {
        salesOrganizationDisplayId: '2020',
        distributionChannel: '20',
        division: '00',
    },
    deliveryPriority: {
        code: '01', // S4 valid code. ODM codes not available
    },
    currency: {
        code: 'EUR', // ODM & S4 valid code
    },
    salesArrangementGroup: {
        code: '03', // S4 valid code. ODM codes not available
    },
    salesArrangementPriceGroup: {
        code: 'C1', // S4 valid code. ODM codes not available
    },
    functions: [
        {
            ...completeCustomerInfoSalesArrFunctionBillTo,
        },
        {
            ...completeCustomerInfoSalesArrFunctionPayer,
        },
        {
            ...completeCustomerInfoSalesArrFunctionShipTo,
        },
        {
            ...completeCustomerInfoSalesArrFunctionSoldTo,
        },
    ],
    incotermsClassification: {
        code: 'EXW', // ODM & S4 valid code
    },
    incotermsTransferLocationName: 'transferLocationName',
};

const completeCustomerInfoSalesArrangement3 = {
    salesAreaRef: {
        salesOrganizationDisplayId: '3030',
        distributionChannel: '30',
        division: '00',
    },
    deliveryPriority: {
        code: '01', // S4 valid code. ODM codes not available
    },
    currency: {
        code: 'CAD', // ODM & S4 valid code
    },
    salesArrangementGroup: {
        code: '03', // S4 valid code. ODM codes not available
    },
    salesArrangementPriceGroup: {
        code: 'C1', // S4 valid code. ODM codes not available
    },
    functions: [
        {
            ...completeCustomerInfoSalesArrFunctionBillTo,
        },
        {
            ...completeCustomerInfoSalesArrFunctionPayer,
        },
        {
            ...completeCustomerInfoSalesArrFunctionShipTo,
        },
        {
            ...completeCustomerInfoSalesArrFunctionSoldTo,
        },
    ],
    incotermsClassification: {
        code: 'EXW', // ODM & S4 valid code
    },
    incotermsTransferLocationName: 'transferLocationName',
};

const completeCustomerInfoTaxClassification1 = {
    country: {
        code: 'US', // ODM & S4 valid code
    },
    taxCategory: {
        code: 'TTX1', // S4 valid code. ODM codes not available
    },
    taxClassification: {
        code: '1', // S4 valid code. ODM codes not available
    },
};

const completeCustomerInfoTaxClassification2 = {
    country: {
        code: 'DE', // ODM & S4 valid code
    },
    taxCategory: {
        code: 'TTX1', // S4 valid code. ODM codes not available
    },
    taxClassification: {
        code: '1', // S4 valid code. ODM codes not available
    },
};

const completeCustomerInfoTaxClassification3 = {
    country: {
        code: 'CA', // ODM & S4 valid code
    },
    taxCategory: {
        code: 'TTX1', // S4 valid code. ODM codes not available
    },
    taxClassification: {
        code: '1', // S4 valid code. ODM codes not available
    },
};

// note: complete EXPOSED fields
const completeCustomerInformation1 = {
    salesArrangements: [
        {
            ...completeCustomerInfoSalesArrangement1,
        },
    ],
    taxClassifications: [
        {
            ...completeCustomerInfoTaxClassification1,
        },
    ],
    customerAccountGroup: {
        code: 'CUST', // S4 valid code. ODM codes not available
    },
    vatLiability: true,
};

// note: complete EXPOSED fields
const completeCustomerInformation2 = {
    salesArrangements: [
        {
            ...completeCustomerInfoSalesArrangement2,
        },
    ],
    taxClassifications: [
        {
            ...completeCustomerInfoTaxClassification2,
        },
    ],
    customerAccountGroup: {
        code: 'CUST', // S4 valid code. ODM codes not available
    },
    vatLiability: false,
};

// note: complete EXPOSED fields
const completeCustomerInformation3 = {
    salesArrangements: [
        {
            ...completeCustomerInfoSalesArrangement3,
        },
    ],
    taxClassifications: [
        {
            ...completeCustomerInfoTaxClassification3,
        },
    ],
    customerAccountGroup: {
        code: 'CUST', // S4 valid code. ODM codes not available
    },
    vatLiability: false,
};

// note: complete EXPOSED fields
const completeCustomerInformationMix1 = {
    salesArrangements: [
        {
            ...completeCustomerInfoSalesArrangement1,
        },
        {
            ...completeCustomerInfoSalesArrangement2,
        },
    ],
    taxClassifications: [
        {
            ...completeCustomerInfoTaxClassification2,
        },
        {
            ...completeCustomerInfoTaxClassification1,
        },
    ],
    customerAccountGroup: {
        code: 'CUST', // S4 valid code. ODM codes not available
    },
    vatLiability: true,
};

// note: complete EXPOSED fields
const completeCustomerInformationMix2 = {
    salesArrangements: [
        {
            ...completeCustomerInfoSalesArrangement2,
        },
        {
            ...completeCustomerInfoSalesArrangement3,
        },
    ],
    taxClassifications: [
        {
            ...completeCustomerInfoTaxClassification3,
        },
        {
            ...completeCustomerInfoTaxClassification2,
        },
    ],
    customerAccountGroup: {
        code: 'CUST', // S4 valid code. ODM codes not available
    },
    vatLiability: true,
};

const completeServiceProviderMarketFunction1 = {
    marketFunction: {
        code: 'SUP001', // C4Uf valid code
    },
    marketFunctionCodeNumber1: '9903692000001',
    marketFunctionSource1: 'ABCD',
    marketFunctionCodeNumber2: '9903692000006',
    marketFunctionSource2: 'DCBA',
    validFrom: '2020-01-01',
    validTo: '2020-12-31',
};

const completeServiceProviderMarketFunction2 = {
    marketFunction: {
        code: 'DSO001', // C4Uf valid code
    },
    marketFunctionCodeNumber1: '9903692000002',
    marketFunctionSource1: 'EFGH',
    marketFunctionCodeNumber2: '9903692000007',
    marketFunctionSource2: 'HGFE',
    validFrom: '2021-01-01',
    validTo: '2021-12-31',
};

const completeServiceProviderMarketFunction3 = {
    marketFunction: {
        code: 'MRO001', // C4Uf valid code
    },
    marketFunctionCodeNumber1: '9903692000003',
    marketFunctionSource1: 'IJKL',
    marketFunctionCodeNumber2: '9903692000008',
    marketFunctionSource2: 'LKJI',
    validFrom: '2020-01-01',
    validTo: '2021-12-31',
};

const completeServiceProviderMarketFunction4 = {
    marketFunction: {
        code: 'SUP001', // C4Uf valid code
    },
    marketFunctionCodeNumber1: '9903692000004',
    marketFunctionSource1: 'abcd',
    marketFunctionCodeNumber2: '9903692000009',
    marketFunctionSource2: 'dcba',
    validFrom: '2020-01-01',
    validTo: '2021-12-31',
};

const completeServiceProviderMarketFunction5 = {
    marketFunction: {
        code: 'DSO001', // C4Uf valid code
    },
    marketFunctionCodeNumber1: '9903692000005',
    marketFunctionSource1: 'abcd',
    marketFunctionCodeNumber2: '9903692000000',
    marketFunctionSource2: 'dcba',
    validFrom: '2020-01-01',
    validTo: '2021-12-31',
};

// note: complete EXPOSED fields
const completeBpPerson1 = {
    ...basePerson,
    person: {
        ...completePerson1,
    },
    bankAccounts: [
        {
            ...completeBankAccount1,
        },
    ],
    taxNumbers: [
        {
            ...completeTaxNumber1,
        },
    ],
    roles: [
        {
            ...completeRole1,
        },
        {
            ...customerRole,
        },
    ],
    addressData: [
        {
            ...completePersonAddressData1,
        },
        {
            ...completePersonAddressData1,
        },
    ],
    customerInformation: {
        ...completeCustomerInformation1,
    },
};

// note: complete EXPOSED fields
const completeBpPerson2 = {
    ...basePerson,
    person: {
        ...completePerson2,
    },
    bankAccounts: [
        {
            ...completeBankAccount2,
        },
    ],
    taxNumbers: [
        {
            ...completeTaxNumber2,
        },
    ],
    roles: [
        {
            ...completeRole2,
        },
        {
            ...customerRole,
        },
    ],
    addressData: [
        {
            ...completePersonAddressData2,
        },
        {
            ...completePersonAddressData2,
        },
    ],
    customerInformation: {
        ...completeCustomerInformation2,
    },
};

const completeBpPersonMix1 = {
    ...basePerson,
    person: {
        ...completePerson1,
    },
    bankAccounts: [
        {
            ...completeBankAccount1,
        },
        {
            ...completeBankAccount2,
        },
    ],
    taxNumbers: [
        {
            ...completeTaxNumber2,
        },
        {
            ...completeTaxNumber1,
        },
    ],
    roles: [
        {
            ...completeRole1,
        },
        {
            ...completeRole2,
        },
        {
            ...customerRole,
        },
    ],
    addressData: [
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
            ...completePersonAddressDataMix1,
        },
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8e',
            ...completePersonAddressDataMix2,
        },
    ],
    customerInformation: {
        ...completeCustomerInformationMix1,
    },
};

const completeBpPersonMix2 = {
    ...basePerson,
    person: {
        ...completePerson2,
    },
    bankAccounts: [
        {
            ...completeBankAccount2,
        },
        {
            ...completeBankAccount3,
        },
    ],
    taxNumbers: [
        {
            ...completeTaxNumber3,
        },
        {
            ...completeTaxNumber2,
        },
    ],
    roles: [
        {
            ...completeRole3,
        },
        {
            ...customerRole,
        },
        {
            ...completeRole2,
        },
    ],
    addressData: [
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
            ...completePersonAddressDataMix2,
        },
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8e',
            ...completePersonAddressDataMix1,
        },
    ],
    customerInformation: {
        ...completeCustomerInformationMix2,
    },
};

// note: complete EXPOSED fields
const completeBpOrg1 = {
    ...baseOrg,
    organization: {
        ...completeOrg1,
    },
    bankAccounts: [
        {
            ...completeBankAccount1,
        },
    ],
    taxNumbers: [
        {
            ...completeTaxNumber1,
        },
    ],
    roles: [
        {
            ...completeRole1,
        },
        {
            ...customerRole,
        },
    ],
    addressData: [
        {
            ...completeOrgAddressData1,
        },
    ],
    customerInformation: {
        ...completeCustomerInformation1,
    },
    serviceProviderInformation: [
        {
            ...completeServiceProviderMarketFunction1,
        },
    ],
};

// note: complete EXPOSED fields
const completeBpOrg2 = {
    ...baseOrg,
    organization: {
        ...completeOrg2,
    },
    bankAccounts: [
        {
            ...completeBankAccount2,
        },
    ],
    taxNumbers: [
        {
            ...completeTaxNumber2,
        },
    ],
    roles: [
        {
            ...completeRole2,
        },
        {
            ...customerRole,
        },
    ],
    addressData: [
        {
            ...completeOrgAddressData2,
        },
    ],
    customerInformation: {
        ...completeCustomerInformation2,
    },
    serviceProviderInformation: [
        {
            ...completeServiceProviderMarketFunction2,
        },
    ],
};

const completeBpOrgMix1 = {
    ...baseOrg,
    organization: {
        ...completeOrg1,
    },
    bankAccounts: [
        {
            ...completeBankAccount1,
        },
        {
            ...completeBankAccount2,
        },
    ],
    taxNumbers: [
        {
            ...completeTaxNumber1,
        },
        {
            ...completeTaxNumber2,
        },
    ],
    roles: [
        {
            ...completeRole1,
        },
        {
            ...completeRole2,
        },
        {
            ...customerRole,
        },
    ],
    addressData: [
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
            ...completeOrgAddressDataMix1,
        },
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8e',
            ...completeOrgAddressDataMix2,
        },
    ],
    customerInformation: {
        ...completeCustomerInformationMix1,
    },
    serviceProviderInformation: [
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8a',
            ...completeServiceProviderMarketFunction2,
        },
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8b',
            ...completeServiceProviderMarketFunction3,
        },
    ],
};

const completeBpOrgMix2 = {
    ...baseOrg,
    organization: {
        ...completeOrg2,
    },
    bankAccounts: [
        {
            ...completeBankAccount2,
        },
        {
            ...completeBankAccount3,
        },
    ],
    taxNumbers: [
        {
            ...completeTaxNumber2,
        },
        {
            ...completeTaxNumber3,
        },
    ],
    roles: [
        {
            ...completeRole2,
        },
        {
            ...completeRole3,
        },
        {
            ...customerRole,
        },
    ],
    addressData: [
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
            ...completeOrgAddressDataMix2,
        },
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8e',
            ...completeOrgAddressDataMix1,
        },
    ],
    customerInformation: {
        ...completeCustomerInformationMix2,
    },
    serviceProviderInformation: [
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8a',
            ...completeServiceProviderMarketFunction4,
        },
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8b',
            ...completeServiceProviderMarketFunction5,
        },
    ],
};

const nameDetails = {
    lastName: 'updated-haynes',
};

module.exports = {
    basePerson,
    baseOrg,
    baseBpGroup,
    requiredPerson1,
    requiredOrg1,
    requiredPersonAddressData1,
    requiredOrgAddressData1,
    completePerson1,
    completeOrg1,
    completeBankAccount1,
    completeTaxNumber1,
    completeRole1,
    completePersonAddressData1,
    completeOrgAddressData1,
    completeCustomerInformation1,
    completeCustomerInfoSalesArrangement1,
    completeCustomerInfoSalesArrFunctionSoldTo,
    completeCustomerInfoSalesArrFunctionBillTo,
    completeCustomerInfoSalesArrFunctionShipTo,
    completeCustomerInfoSalesArrFunctionPayer,
    completeCustomerInfoTaxClassification1,
    completeServiceProviderMarketFunction1,
    completeServiceProviderMarketFunction2,
    completeServiceProviderMarketFunction3,
    completeServiceProviderMarketFunction4,
    completeServiceProviderMarketFunction5,
    completeBpPerson1,
    completeBpOrg1,
    requiredPerson2,
    requiredOrg2,
    requiredPersonAddressData2,
    requiredOrgAddressData2,
    completePerson2,
    completeOrg2,
    completeBankAccount2,
    completeTaxNumber2,
    completeRole2,
    completePersonAddressData2,
    completeOrgAddressData2,
    completeServiceProviderMarketFunction2,
    completeBpPerson2,
    completeBpOrg2,
    nameDetails,
    completeBpPersonMix1,
    completeBpPersonMix2,
    completeBpOrgMix1,
    completeBpOrgMix2,
};
