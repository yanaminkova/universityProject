const expect = require('expect');
const { BPODMVERSION } = require('../../../srv/lib/config');
const MDIRequest = require('../../../srv/mdiclient/MDIRequest');

describe('MDIRequest.test unit-test', () => {
    it('should remove `up__` fields and convert `_code` to an object', () => {
        const payload = {
            displayId: 'test',
            businessPartnerType: 'person',
            isBlocked: false,
            id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
            addressData: [
                {
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                    usages: [
                        {
                            up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                            up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                            id: '4db24ea3-5aae-49f3-b594-aa988e0a7a6f',
                            usage_code: 'billing',
                            validTo: '2021-12-31',
                            validFrom: '2021-01-01',
                        },
                    ],
                    postalAddressType: 'personPostalAddress',
                    personPostalAddress: {
                        up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                        up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                        street: {
                            name: 'streetName',
                        },
                        houseNumber: 'houseNumber',
                    },
                },
            ],
        };
        const result = {
            displayId: 'test',
            businessPartnerType: 'person',
            isBlocked: false,
            id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
            addressData: [
                {
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                    usages: [
                        {
                            id: '4db24ea3-5aae-49f3-b594-aa988e0a7a6f',
                            usage: {
                                code: 'billing',
                            },
                            validTo: '2021-12-31',
                            validFrom: '2021-01-01',
                        },
                    ],
                    postalAddressType: 'personPostalAddress',
                    personPostalAddress: {
                        street: {
                            name: 'streetName',
                        },
                        houseNumber: 'houseNumber',
                    },
                },
            ],
        };

        const mdiTestReq = new MDIRequest();
        mdiTestReq.reformatObject2(payload, false, [
            'purposes',
            'paymentCard',
            'serviceProviderInformation',
            'mdiBookKeeping',
        ]);
        expect(payload).toStrictEqual(result);
    });

    it('should keep null values on the patch payload but remove null values in objects with _operation: create', () => {
        const payload = {
            person: {
                nameDetails: {
                    firstName: 'firstName',
                    middleName: 'middleName',
                    lastName: 'l2',
                    secondLastName: null,
                    initials: null,
                    formattedPersonName: null,
                    maxDeletionDate: null,
                    endOfBusinessDate: null,
                    formOfAddress_code: null,
                    academicTitle_code: null,
                    additionalAcademicTitle_code: null,
                    namePrefix_code: null,
                    additionalNamePrefix_code: null,
                    nameSuffix_code: null,
                },
                birthDate: '1990-12-31',
                gender_code: '0',
                language_code: 'en',
                correspondenceLanguage_code: 'en',
                nationality_code: 'DE',
            },
            organization: null,
            addressData: [
                {
                    personPostalAddress: {
                        firstName: null,
                        middleName: null,
                        lastName: null,
                        secondLastName: null,
                        initials: null,
                        formattedPersonName: null,
                        maxDeletionDate: null,
                        endOfBusinessDate: null,
                        streetPrefix1: null,
                        streetPrefix2: null,
                        streetSuffix1: null,
                        streetSuffix2: null,
                        houseNumber: 'houseNumber',
                        houseNumberSupplement: null,
                        floor: null,
                        door: null,
                        careOf: null,
                        postCode: 'postCode',
                        postBoxIsWithoutNumber: null,
                        companyPostalCode: 'postCode',
                        deliveryServiceNumber: null,
                        additionalCityName: null,
                        street: { name: 'yes', ref_code: null },
                        secondaryRegion: null,
                        tertiaryRegion: null,
                        town: { name: 'town', ref_code: null },
                        district: null,
                        alternative: null,
                        coordinates: null,
                        formOfAddress_code: null,
                        academicTitle_code: null,
                        additionalAcademicTitle_code: null,
                        namePrefix_code: null,
                        additionalNamePrefix_code: null,
                        nameSuffix_code: null,
                        primaryRegion_code: 'DE-11',
                        country_code: 'DE',
                        timeZone_code: null,
                    },
                    organizationPostalAddress: null,
                    id: 'b309f242-1160-4541-8dcb-de35a3fc9f6d',
                    validFrom: null,
                    validTo: null,
                    isIndependent: null,
                    postalAddressType: null,
                    communicationPreferences: null,
                },
                {
                    _operation: 'patch',
                    personPostalAddress: {
                        firstName: null,
                        middleName: null,
                        lastName: null,
                        secondLastName: null,
                        initials: null,
                        formattedPersonName: null,
                        maxDeletionDate: null,
                        endOfBusinessDate: null,
                        streetPrefix1: null,
                        streetPrefix2: null,
                        streetSuffix1: null,
                        streetSuffix2: null,
                        houseNumber: 'houseNumber',
                        houseNumberSupplement: null,
                        floor: null,
                        door: null,
                        careOf: null,
                        postCode: 'postCode',
                        postBoxIsWithoutNumber: null,
                        companyPostalCode: 'postCode',
                        deliveryServiceNumber: null,
                        additionalCityName: null,
                        street: { name: 'yes', ref_code: null },
                        secondaryRegion: null,
                        tertiaryRegion: null,
                        town: { name: 'town', ref_code: null },
                        district: null,
                        alternative: null,
                        coordinates: null,
                        formOfAddress_code: null,
                        academicTitle_code: null,
                        additionalAcademicTitle_code: null,
                        namePrefix_code: null,
                        additionalNamePrefix_code: null,
                        nameSuffix_code: null,
                        primaryRegion_code: 'DE-11',
                        country_code: 'DE',
                        timeZone_code: null,
                    },
                    organizationPostalAddress: null,
                    id: 'b309f242-1160-4541-8dcb-de35a3fc9f7e',
                    validFrom: null,
                    validTo: null,
                    isIndependent: null,
                    postalAddressType: null,
                    communicationPreferences: null,
                },
            ],
            bankAccounts: null,
            customerInformation: null,
            supplierInformation: null,
            id: '9b46a28e-7a61-47a6-a705-df467170586e',
            displayId: 'peon1143',
            businessPartnerType: 'person',
            isBlocked: false,
            lifecycleStatus_code: null,
        };
        const result = {
            person: {
                nameDetails: {
                    firstName: 'firstName',
                    middleName: 'middleName',
                    lastName: 'l2',
                    secondLastName: null,
                    initials: null,
                    formattedPersonName: null,
                    maxDeletionDate: null,
                    endOfBusinessDate: null,
                    formOfAddress: null,
                    academicTitle: null,
                    additionalAcademicTitle: null,
                    namePrefix: null,
                    additionalNamePrefix: null,
                    nameSuffix: null,
                },
                birthDate: '1990-12-31',
                gender: { code: '0' },
                language: { code: 'en' },
                correspondenceLanguage: { code: 'en' },
                nationality: { code: 'DE' },
            },
            organization: null,
            addressData_delta: [
                {
                    _operation: 'create',
                    personPostalAddress: {
                        houseNumber: 'houseNumber',

                        postCode: 'postCode',

                        companyPostalCode: 'postCode',
                        street: { name: 'yes' },
                        town: { name: 'town' },
                        primaryRegion: {
                            code: 'DE-11',
                        },
                        country: {
                            code: 'DE',
                        },
                    },
                    id: 'b309f242-1160-4541-8dcb-de35a3fc9f6d',
                },
                {
                    _operation: 'patch',
                    personPostalAddress: {
                        firstName: null,
                        middleName: null,
                        lastName: null,
                        secondLastName: null,
                        initials: null,
                        formattedPersonName: null,
                        maxDeletionDate: null,
                        endOfBusinessDate: null,
                        streetPrefix1: null,
                        streetPrefix2: null,
                        streetSuffix1: null,
                        streetSuffix2: null,
                        houseNumber: 'houseNumber',
                        houseNumberSupplement: null,
                        floor: null,
                        door: null,
                        careOf: null,
                        postCode: 'postCode',
                        postBoxIsWithoutNumber: null,
                        companyPostalCode: 'postCode',
                        deliveryServiceNumber: null,
                        additionalCityName: null,
                        street: { name: 'yes', ref: null },
                        secondaryRegion: null,
                        tertiaryRegion: null,
                        town: { name: 'town', ref: null },
                        district: null,
                        alternative: null,
                        coordinates: null,
                        formOfAddress: null,
                        academicTitle: null,
                        additionalAcademicTitle: null,
                        namePrefix: null,
                        additionalNamePrefix: null,
                        nameSuffix: null,
                        primaryRegion: {
                            code: 'DE-11',
                        },
                        country: {
                            code: 'DE',
                        },
                        timeZone: null,
                    },
                    organizationPostalAddress: null,
                    id: 'b309f242-1160-4541-8dcb-de35a3fc9f7e',
                    validFrom: null,
                    validTo: null,
                    isIndependent: null,
                    postalAddressType: null,
                    communicationPreferences: null,
                },
            ],
            bankAccounts: null,
            customerInformation: null,
            supplierInformation: null,
            id: '9b46a28e-7a61-47a6-a705-df467170586e',
            displayId: 'peon1143',
            businessPartnerType: 'person',
            isBlocked: false,
            lifecycleStatus: null,
        };
        const mdiTestReq = new MDIRequest();
        mdiTestReq.reformatObject2(payload, true, [
            'purposes',
            'paymentCard',
            'serviceProviderInformation',
            'mdiBookKeeping',
        ]);
        expect(payload).toStrictEqual(result);
    });

    it('should remove duplicate up__up__ keys, add _operation fields to composition of many objects, and append _delta to the field names', () => {
        const payload = {
            displayId: 'test',
            businessPartnerType: 'person',
            isBlocked: false,
            id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
            bankAccounts: [
                {
                    id: '0001',
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    bankAccountName: 'bankAccountName1',
                    bankControlKey: '01',
                },
                {
                    id: '0003',
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    bankAccountName: 'bankAccountName2',
                    bankControlKey: '02',
                },
            ],
            roles: [
                {
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    role_code: 'FLCU01',
                    validTo: '2021-12-31',
                    validFrom: '2021-01-01',
                },
            ],
            taxNumbers: [
                {
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    taxNumberType_code: 'DE0',
                    taxNumber: 'DE204797706',
                },
                {
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    taxNumberType_code: 'US0',
                    taxNumber: 'US204797123',
                },
            ],
            addressData: [
                {
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    usages: [
                        {
                            up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                            up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                            usage_code: 'billing',
                            validTo: '2021-12-31',
                            validFrom: '2021-01-01',
                        },
                    ],
                    emailAddresses: [
                        {
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                            up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                            up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                            address: 'test1@email.com',
                        },
                        {
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
                            up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                            up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                            address: 'test4@email.com',
                        },
                        {
                            id: 'c16e4279-834f-4077-ace9-c591fb3428be',
                            up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                            up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                            address: 'test5@email.com',
                        },
                    ],
                    postalAddressType: 'personPostalAddress',
                    personPostalAddress: {
                        up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                        up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                        street: {
                            name: 'streetName',
                        },
                        houseNumber: 'houseNumber',
                    },
                },
                {
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    usages: [
                        {
                            up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
                            up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                            usage_code: 'shipping',
                            validTo: '2022-12-31',
                            validFrom: '2021-01-01',
                        },
                    ],
                    postalAddressType: 'personPostalAddress',
                    personPostalAddress: {
                        up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
                        up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                        street: {
                            name: 'streetName2',
                        },
                        houseNumber: 'houseNumber2',
                    },
                    phoneNumbers: [],
                },
            ],
            customerInformation: {
                up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                salesArrangements: [
                    {
                        up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '2020',
                            distributionChannel: '20',
                            division: '00',
                        },
                        incotermsTransferLocationName: 'FH',
                        deliveryPriority_code: '01',
                        currency_code: 'USD',
                        functions: [
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '2020',
                                up__salesAreaRef_distributionChannel: '20',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc1',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'AG',
                            },
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '2020',
                                up__salesAreaRef_distributionChannel: '20',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc2',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'RE',
                            },
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '2020',
                                up__salesAreaRef_distributionChannel: '20',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc5',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'WE',
                            },
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '2020',
                                up__salesAreaRef_distributionChannel: '20',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc6',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'RG',
                            },
                        ],
                    },
                    {
                        up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '3030',
                            distributionChannel: '30',
                            division: '00',
                        },
                        incotermsTransferLocationName: 'FH',
                        deliveryPriority_code: '02',
                        currency_code: 'EUR',
                        functions: [
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '3030',
                                up__salesAreaRef_distributionChannel: '30',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc2',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'AG',
                            },
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '3030',
                                up__salesAreaRef_distributionChannel: '30',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc3',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'RE',
                            },
                        ],
                    },
                    {
                        up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '4040',
                            distributionChannel: '40',
                            division: '00',
                        },
                        incotermsTransferLocationName: 'FH',
                        deliveryPriority_code: '03',
                        currency_code: 'EUR',
                        functions: [
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '4040',
                                up__salesAreaRef_distributionChannel: '40',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc9',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'AG',
                            },
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '4040',
                                up__salesAreaRef_distributionChannel: '40',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc10',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'RE',
                            },
                        ],
                    },
                ],
                // need to add taxClassifications
            },
        };
        const oldBpKeys = {
            id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
            bankAccounts: [
                {
                    id: '0002',
                    _keys: ['id'],
                },
                {
                    id: '0003',
                    _keys: ['id'],
                },
            ],
            roles: [
                {
                    role_code: 'FLCU01',
                    _keys: ['role_code'],
                },
                {
                    role_code: 'FLCU00',
                    _keys: ['role_code'],
                },
                {
                    role_code: 'MKK',
                    _keys: ['role_code'],
                },
            ],
            taxNumbers: [
                {
                    taxNumberType_code: 'CA0',
                    _keys: ['taxNumberType_code'],
                },
                {
                    taxNumberType_code: 'US0',
                    _keys: ['taxNumberType_code'],
                },
            ],
            addressData: [
                {
                    _keys: ['id'],
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                    usages: [
                        {
                            _keys: ['usage_code', 'validTo'],
                            usage_code: 'billing',
                            validTo: '2021-12-31',
                        },
                        {
                            _keys: ['usage_code', 'validTo'],
                            usage_code: 'shipping',
                            validTo: '2021-12-31',
                        },
                    ],
                    emailAddresses: [
                        {
                            _keys: ['id'],
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                        },
                        {
                            _keys: ['id'],
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                        },
                        {
                            _keys: ['id'],
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
                        },
                        {
                            _keys: ['id'],
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bd',
                        },
                    ],
                    phoneNumbers: [
                        {
                            _keys: ['id'],
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                        },
                        {
                            _keys: ['id'],
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                        },
                    ],
                },
                {
                    _keys: ['id'],
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8e',
                    usages: [
                        {
                            _keys: ['usage_code', 'validTo'],
                            usage_code: 'billing',
                            validTo: '2021-01-01',
                        },
                    ],
                },
                {
                    _keys: ['id'],
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
                    usages: [
                        {
                            _keys: ['usage_code', 'validTo'],
                            usage_code: 'shipping',
                            validTo: '2022-12-31',
                        },
                    ],
                    phoneNumbers: [
                        {
                            _keys: ['id'],
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                        },
                        {
                            _keys: ['id'],
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                        },
                    ],
                },
            ],
            customerInformation: {
                salesArrangements: [
                    {
                        _keys: ['salesAreaRef'],
                        salesAreaRef: {
                            salesOrganizationDisplayId: '1010',
                            distributionChannel: '10',
                            division: '00',
                        },
                    },
                    {
                        _keys: ['salesAreaRef'],
                        salesAreaRef: {
                            salesOrganizationDisplayId: '2020',
                            distributionChannel: '20',
                            division: '00',
                        },
                        functions: [
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc1',
                            },
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc2',
                            },
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc3',
                            },
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc4',
                            },
                        ],
                    },
                    {
                        _keys: ['salesAreaRef'],
                        salesAreaRef: {
                            salesOrganizationDisplayId: '3030',
                            distributionChannel: '30',
                            division: '00',
                        },
                        functions: [
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc2',
                            },
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc3',
                            },
                        ],
                    },
                ],
            },
        };
        const newBpKeys = {
            id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
            bankAccounts: [
                {
                    _keys: ['id'],
                    id: '0001',
                },
                {
                    _keys: ['id'],
                    id: '0003',
                },
            ],
            roles: [
                {
                    _keys: ['role_code'],
                    role_code: 'FLCU01',
                },
            ],
            taxNumbers: [
                {
                    _keys: ['taxNumberType_code'],
                    taxNumberType_code: 'DE0',
                },
                {
                    _keys: ['taxNumberType_code'],
                    taxNumberType_code: 'US0',
                },
            ],
            addressData: [
                {
                    _keys: ['id'],
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                    usages: [
                        {
                            _keys: ['usage_code', 'validTo'],
                            usage_code: 'billing',
                            validTo: '2021-12-31',
                        },
                    ],
                    emailAddresses: [
                        {
                            _keys: ['id'],
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                        },
                        {
                            _keys: ['id'],
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
                        },
                        {
                            _keys: ['id'],
                            id: 'c16e4279-834f-4077-ace9-c591fb3428be',
                        },
                    ],
                },
                {
                    _keys: ['id'],
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
                    usages: [
                        {
                            _keys: ['usage_code', 'validTo'],
                            usage_code: 'shipping',
                            validTo: '2022-12-31',
                        },
                    ],
                    phoneNumbers: [],
                },
            ],
            customerInformation: {
                salesArrangements: [
                    {
                        _keys: ['salesAreaRef'],
                        salesAreaRef: {
                            salesOrganizationDisplayId: '2020',
                            distributionChannel: '20',
                            division: '00',
                        },
                        functions: [
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc1',
                            },
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc2',
                            },
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc5',
                            },
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc6',
                            },
                        ],
                    },
                    {
                        _keys: ['salesAreaRef'],
                        salesAreaRef: {
                            salesOrganizationDisplayId: '3030',
                            distributionChannel: '30',
                            division: '00',
                        },
                        functions: [
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc2',
                            },
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc3',
                            },
                        ],
                    },
                    {
                        _keys: ['salesAreaRef'],
                        salesAreaRef: {
                            salesOrganizationDisplayId: '4040',
                            distributionChannel: '40',
                            division: '00',
                        },
                        functions: [
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc9',
                            },
                            {
                                _keys: ['functionName'],
                                functionName: 'partnerFunc10',
                            },
                        ],
                    },
                ],
            },
        };
        const result1 = {
            displayId: 'test',
            businessPartnerType: 'person',
            isBlocked: false,
            id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
            bankAccounts: [
                {
                    id: '0001',
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    bankAccountName: 'bankAccountName1',
                    bankControlKey: '01',
                },
                {
                    _operation: 'patch',
                    id: '0003',
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    bankAccountName: 'bankAccountName2',
                    bankControlKey: '02',
                },
                {
                    _operation: 'forceDelete',
                    id: '0002',
                },
            ],
            roles: [
                {
                    _operation: 'patch',
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    role_code: 'FLCU01',
                    validTo: '2021-12-31',
                    validFrom: '2021-01-01',
                },
                {
                    _operation: 'forceDelete',

                    role_code: 'FLCU00',
                },
                {
                    _operation: 'forceDelete',

                    role_code: 'MKK',
                },
            ],
            taxNumbers: [
                {
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    taxNumberType_code: 'DE0',
                    taxNumber: 'DE204797706',
                },
                {
                    _operation: 'patch',
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    taxNumberType_code: 'US0',
                    taxNumber: 'US204797123',
                },
                {
                    _operation: 'forceDelete',
                    taxNumberType_code: 'CA0',
                },
            ],
            addressData: [
                {
                    _operation: 'patch',
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    usages: [
                        {
                            _operation: 'patch',
                            up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                            up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                            usage_code: 'billing',
                            validTo: '2021-12-31',
                            validFrom: '2021-01-01',
                        },
                        {
                            _operation: 'forceDelete',
                            usage_code: 'shipping',
                            validTo: '2021-12-31',
                        },
                    ],
                    emailAddresses: [
                        {
                            _operation: 'patch',
                            up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                            up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                            address: 'test1@email.com',
                        },
                        {
                            _operation: 'patch',
                            up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                            up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
                            address: 'test4@email.com',
                        },
                        {
                            up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                            up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428be',
                            address: 'test5@email.com',
                        },
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                        },
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bd',
                        },
                    ],
                    phoneNumbers: [
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                        },
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                        },
                    ],
                    postalAddressType: 'personPostalAddress',
                    personPostalAddress: {
                        up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                        up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                        street: {
                            name: 'streetName',
                        },
                        houseNumber: 'houseNumber',
                    },
                },
                {
                    _operation: 'patch',
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
                    up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                    usages: [
                        {
                            _operation: 'patch',
                            up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
                            up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                            usage_code: 'shipping',
                            validTo: '2022-12-31',
                            validFrom: '2021-01-01',
                        },
                    ],
                    phoneNumbers: [
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                        },
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                        },
                    ],
                    postalAddressType: 'personPostalAddress',
                    personPostalAddress: {
                        up__id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
                        up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                        street: {
                            name: 'streetName2',
                        },
                        houseNumber: 'houseNumber2',
                    },
                },
                {
                    _operation: 'forceDelete',
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8e',
                },
            ],
            customerInformation: {
                up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                salesArrangements: [
                    {
                        _operation: 'patch',
                        up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '2020',
                            distributionChannel: '20',
                            division: '00',
                        },
                        incotermsTransferLocationName: 'FH',
                        deliveryPriority_code: '01',
                        currency_code: 'USD',
                        functions: [
                            {
                                _operation: 'patch',
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '2020',
                                up__salesAreaRef_distributionChannel: '20',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc1',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'AG',
                            },
                            {
                                _operation: 'patch',
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '2020',
                                up__salesAreaRef_distributionChannel: '20',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc2',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'RE',
                            },
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '2020',
                                up__salesAreaRef_distributionChannel: '20',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc5',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'WE',
                            },
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '2020',
                                up__salesAreaRef_distributionChannel: '20',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc6',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'RG',
                            },
                            {
                                _operation: 'forceDelete',
                                functionName: 'partnerFunc3',
                            },
                            {
                                _operation: 'forceDelete',
                                functionName: 'partnerFunc4',
                            },
                        ],
                    },
                    {
                        _operation: 'patch',
                        up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '3030',
                            distributionChannel: '30',
                            division: '00',
                        },
                        incotermsTransferLocationName: 'FH',
                        deliveryPriority_code: '02',
                        currency_code: 'EUR',
                        functions: [
                            {
                                _operation: 'patch',
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '3030',
                                up__salesAreaRef_distributionChannel: '30',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc2',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'AG',
                            },
                            {
                                _operation: 'patch',
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '3030',
                                up__salesAreaRef_distributionChannel: '30',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc3',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'RE',
                            },
                        ],
                    },
                    {
                        up__up__id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '4040',
                            distributionChannel: '40',
                            division: '00',
                        },
                        incotermsTransferLocationName: 'FH',
                        deliveryPriority_code: '03',
                        currency_code: 'EUR',
                        functions: [
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '4040',
                                up__salesAreaRef_distributionChannel: '40',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc9',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'AG',
                            },
                            {
                                up__up__up__id:
                                    '730d9e4b-3c9b-45b3-a91c-4e967e527270',
                                up__salesAreaRef_salesOrganizationDisplayId:
                                    '4040',
                                up__salesAreaRef_distributionChannel: '40',
                                up__salesAreaRef_division: '00',
                                functionName: 'partnerFunc10',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode_code: 'RE',
                            },
                        ],
                    },
                    {
                        _operation: 'forceDelete',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '1010',
                            distributionChannel: '10',
                            division: '00',
                        },
                    },
                ],
            },
        };
        const result2 = {
            displayId: 'test',
            businessPartnerType: 'person',
            isBlocked: false,
            id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
            bankAccounts_delta: [
                {
                    _operation: 'create',
                    id: '0001',
                    bankAccountName: 'bankAccountName1',
                    bankControlKey: '01',
                },
                {
                    _operation: 'patch',
                    id: '0003',
                    bankAccountName: 'bankAccountName2',
                    bankControlKey: '02',
                },
                {
                    _operation: 'forceDelete',
                    id: '0002',
                },
            ],
            roles_delta: [
                {
                    _operation: 'patch',
                    role: {
                        code: 'FLCU01',
                    },
                    validTo: '2021-12-31',
                    validFrom: '2021-01-01',
                },
                {
                    _operation: 'forceDelete',
                    role: {
                        code: 'FLCU00',
                    },
                },
                {
                    _operation: 'forceDelete',
                    role: {
                        code: 'MKK',
                    },
                },
            ],
            taxNumbers_delta: [
                {
                    _operation: 'create',
                    taxNumberType: {
                        code: 'DE0',
                    },
                    taxNumber: 'DE204797706',
                },
                {
                    _operation: 'patch',
                    taxNumberType: {
                        code: 'US0',
                    },
                    taxNumber: 'US204797123',
                },
                {
                    _operation: 'forceDelete',
                    taxNumberType: {
                        code: 'CA0',
                    },
                },
            ],
            addressData_delta: [
                {
                    _operation: 'patch',
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
                    usages_delta: [
                        {
                            _operation: 'patch',
                            usage: {
                                code: 'billing',
                            },
                            validTo: '2021-12-31',
                            validFrom: '2021-01-01',
                        },
                        {
                            _operation: 'forceDelete',
                            usage: {
                                code: 'shipping',
                            },
                            validTo: '2021-12-31',
                        },
                    ],
                    emailAddresses_delta: [
                        {
                            _operation: 'patch',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                            address: 'test1@email.com',
                        },
                        {
                            _operation: 'patch',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
                            address: 'test4@email.com',
                        },
                        {
                            _operation: 'create',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428be',
                            address: 'test5@email.com',
                        },
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                        },
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bd',
                        },
                    ],
                    phoneNumbers_delta: [
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                        },
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                        },
                    ],
                    postalAddressType: 'personPostalAddress',
                    personPostalAddress: {
                        street: {
                            name: 'streetName',
                        },
                        houseNumber: 'houseNumber',
                    },
                },
                {
                    _operation: 'patch',
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
                    usages_delta: [
                        {
                            _operation: 'patch',
                            usage: {
                                code: 'shipping',
                            },
                            validTo: '2022-12-31',
                            validFrom: '2021-01-01',
                        },
                    ],
                    phoneNumbers_delta: [
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                        },
                        {
                            _operation: 'forceDelete',
                            id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                        },
                    ],
                    postalAddressType: 'personPostalAddress',
                    personPostalAddress: {
                        street: {
                            name: 'streetName2',
                        },
                        houseNumber: 'houseNumber2',
                    },
                },
                {
                    _operation: 'forceDelete',
                    id: 'd80b9521-2f45-4302-bc30-c6456f794d8e',
                },
            ],
            customerInformation: {
                salesArrangements_delta: [
                    {
                        _operation: 'patch',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '2020',
                            distributionChannel: '20',
                            division: '00',
                        },
                        incotermsTransferLocationName: 'FH',
                        deliveryPriority: {
                            code: '01',
                        },
                        currency: {
                            code: 'USD',
                        },
                        functions_delta: [
                            {
                                _operation: 'patch',
                                functionName: 'partnerFunc1',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode: {
                                    code: 'AG',
                                },
                            },
                            {
                                _operation: 'patch',
                                functionName: 'partnerFunc2',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode: {
                                    code: 'RE',
                                },
                            },
                            {
                                _operation: 'create',
                                functionName: 'partnerFunc5',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode: {
                                    code: 'WE',
                                },
                            },
                            {
                                _operation: 'create',
                                functionName: 'partnerFunc6',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode: {
                                    code: 'RG',
                                },
                            },
                            {
                                _operation: 'forceDelete',
                                functionName: 'partnerFunc3',
                            },
                            {
                                _operation: 'forceDelete',
                                functionName: 'partnerFunc4',
                            },
                        ],
                    },
                    {
                        _operation: 'patch',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '3030',
                            distributionChannel: '30',
                            division: '00',
                        },
                        incotermsTransferLocationName: 'FH',
                        deliveryPriority: {
                            code: '02',
                        },
                        currency: {
                            code: 'EUR',
                        },
                        functions_delta: [
                            {
                                _operation: 'patch',
                                functionName: 'partnerFunc2',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode: {
                                    code: 'AG',
                                },
                            },
                            {
                                _operation: 'patch',
                                functionName: 'partnerFunc3',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode: {
                                    code: 'RE',
                                },
                            },
                        ],
                    },
                    {
                        _operation: 'create',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '4040',
                            distributionChannel: '40',
                            division: '00',
                        },
                        incotermsTransferLocationName: 'FH',
                        deliveryPriority: {
                            code: '03',
                        },
                        currency: {
                            code: 'EUR',
                        },
                        functions: [
                            {
                                functionName: 'partnerFunc9',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode: {
                                    code: 'AG',
                                },
                            },
                            {
                                functionName: 'partnerFunc10',
                                functionPartnerType: 'functionPartnerCustomer',
                                functionCode: {
                                    code: 'RE',
                                },
                            },
                        ],
                    },
                    {
                        _operation: 'forceDelete',
                        salesAreaRef: {
                            salesOrganizationDisplayId: '1010',
                            distributionChannel: '10',
                            division: '00',
                        },
                    },
                ],
            },
        };
        const mdiTestReq = new MDIRequest();
        mdiTestReq.reformatObject1(payload, oldBpKeys, newBpKeys);
        expect(payload).toStrictEqual(result1);
        mdiTestReq.reformatObject2(payload, true, [
            'purposes',
            'paymentCard',
            'serviceProviderInformation',
            'mdiBookKeeping',
        ]);
        expect(payload).toStrictEqual(result2);
    });

    it('should create a valid MDI payload', () => {
        const mdiTestReq = new MDIRequest();
        const payload = {
            id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
        };
        const guidPattern =
            /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/;
        const result = mdiTestReq.createMDIPayload(payload, [
            'purposes',
            'paymentCard',
            'serviceProviderInformation',
            'mdiBookKeeping',
        ]);
        expect(result.changeToken).toMatch(guidPattern);
        expect(result.operation).toBe('create');
        expect(result.instance).toStrictEqual(payload);
    });

    it('should create the GET log MDI request', () => {
        const mdiTestReq = new MDIRequest({}, 'GET', 'events');
        const request = mdiTestReq.build();
        expect(request.query).toBe(
            `GET ${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/events`
        );
        expect(request.data).toStrictEqual({});
    });

    it('should create the POST requests MDI request', () => {
        const req = {
            data: {
                displayId: 'test',
                businessPartnerType: 'person',
                isBlocked: false,
                id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
            },
        };

        const mdiTestReq = new MDIRequest(req, 'POST', 'requests');

        const request = mdiTestReq.build({
            excludeFields: [
                'purposes',
                'paymentCard',
                'serviceProviderInformation',
                'mdiBookKeeping',
                'displayId',
            ],
        });
        expect(request.query).toBe(
            `POST ${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/requests`
        );
        expect(request.data.operation).toBe('create');
        expect(request.data.instance).toStrictEqual({
            businessPartnerType: 'person',
            isBlocked: false,
            id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
        });
    });

    it('should create the GET log MDI Product request - UTILITIESCLOUDSOLUTION-3079', () => {
        const mdiTestReq = new MDIRequest({}, 'GET', 'events');
        const url = 'https://one-mds.cfapps.eu10.hana.ondemand.com';
        const request = mdiTestReq.buildProduct(url, 'sap.odm.product.Product');
        expect(request.query).toBe(
            'https://one-mds.cfapps.eu10.hana.ondemand.com/v1/odm/2.3.0/sap.odm.product.Product/events'
        );
    });
});
