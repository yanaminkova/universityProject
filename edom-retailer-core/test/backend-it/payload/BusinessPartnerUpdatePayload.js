const {
    requiredPerson1,
    requiredOrg1,
    requiredPersonAddressData1,
    requiredOrgAddressData1,
    completeServiceProviderMarketFunction1,
} = require('./BusinessPartnerMockPayload');

const createPayload = {
    displayId: 'test',
    businessPartnerType: 'person',
    person: {
        nameDetails: {
            firstName: 'firstName',
            lastName: 'lastName',
        },
    },
    isBlocked: false,
    id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
    bankAccounts: [
        {
            id: '0002',
            bankAccountName: 'bankAccountName2',
            bankControlKey: '02',
        },
        {
            id: '0003',
            bankAccountName: 'bankAccountName3',
            bankControlKey: '03',
        },
    ],
    roles: [
        {
            role: {
                code: 'FLCU01',
            },
            validTo: '2021-12-31',
            validFrom: '2021-01-01',
        },
        {
            role: {
                code: 'MKK',
            },
            validTo: '2021-12-31',
            validFrom: '2021-01-01',
        },
    ],
    taxNumbers: [
        {
            taxNumberType: {
                code: 'CA0',
            },
            taxNumber: 'CA204797706',
        },
        {
            taxNumberType: {
                code: 'US01',
            },
            taxNumber: 'US204797123',
        },
    ],
    addressData: [
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
            communicationPreferences: {
                nonVerbalCommunicationLanguage: {
                    code: 'en',
                },
            },
            usages: [
                {
                    isStandard: false,
                    usage: {
                        code: 'billing',
                    },
                    validTo: '2021-12-31',
                    validFrom: '2021-01-01',
                },
                {
                    isStandard: false,
                    usage: {
                        code: 'shipping',
                    },
                    validTo: '2021-12-31',
                    validFrom: '2021-01-01',
                },
            ],
            emailAddresses: [
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                    address: 'test1@email.com',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                    address: 'test2@email.com',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
                    address: 'test3@email.com',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bd',
                    address: 'test4@email.com',
                },
            ],
            phoneNumbers: [],
            postalAddressType: 'personPostalAddress',
            personPostalAddress: {
                street: {
                    name: 'streetName',
                },
                primaryRegion: {
                    code: 'WA',
                },
                country: {
                    code: 'US',
                },
                town: {
                    name: 'Green Bluff',
                },
                postCode: '99003',
                houseNumber: 'houseNumber',
            },
        },
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8e',
            communicationPreferences: {
                nonVerbalCommunicationLanguage: {
                    code: 'en',
                },
            },
            usages: [
                {
                    isStandard: false,
                    usage: {
                        code: 'billing',
                    },
                    validTo: '2021-01-01',
                },
            ],
            emailAddresses: [],
            phoneNumbers: [],
            postalAddressType: 'personPostalAddress',
            personPostalAddress: {
                street: {
                    name: 'streetName3',
                },
                primaryRegion: {
                    code: 'WA',
                },
                country: {
                    code: 'US',
                },
                town: {
                    name: 'Green Bluff',
                },
                postCode: '99003',
                houseNumber: 'houseNumber3',
            },
        },
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
            communicationPreferences: {
                nonVerbalCommunicationLanguage: {
                    code: 'en',
                },
            },
            usages: [
                {
                    isStandard: false,
                    usage: {
                        code: 'shipping',
                    },
                    validTo: '2022-12-31',
                    validFrom: '2021-01-01',
                },
            ],
            emailAddresses: [],
            phoneNumbers: [
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                    isMobile: true,
                    country: {
                        code: 'US',
                    },
                    number: '1234567890',
                    numberExtension: '123',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                    isMobile: true,
                    country: {
                        code: 'DE',
                    },
                    number: '0987654321',
                    numberExtension: '321',
                },
            ],
            postalAddressType: 'personPostalAddress',
            personPostalAddress: {
                street: {
                    name: 'streetName2',
                },
                primaryRegion: {
                    code: 'WA',
                },
                country: {
                    code: 'US',
                },
                town: {
                    name: 'Green Bluff',
                },
                postCode: '99003',
                houseNumber: 'houseNumber2',
            },
        },
    ],
    customerInformation: {
        salesArrangements: [
            {
                salesAreaRef: {
                    salesOrganizationDisplayId: '1010',
                    distributionChannel: '10',
                    division: '00',
                },
                incotermsTransferLocationName: 'FH',
                deliveryPriority: {
                    code: '01',
                },
                currency: {
                    code: 'EUR',
                },
                functions: [
                    {
                        functionName: 'partnerFunc1',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'AG',
                        },
                    },
                    {
                        functionName: 'partnerFunc2',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'RE',
                        },
                    },
                ],
            },
            {
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
                functions: [
                    {
                        functionName: 'partnerFunc1',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'AG',
                        },
                    },
                    {
                        functionName: 'partnerFunc2',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'RE',
                        },
                    },
                    {
                        functionName: 'partnerFunc5',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'WE',
                        },
                    },
                    {
                        functionName: 'partnerFunc6',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'RG',
                        },
                    },
                ],
            },
            {
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
                functions: [
                    {
                        functionName: 'partnerFunc2',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'AG',
                        },
                    },
                    {
                        functionName: 'partnerFunc3',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'RE',
                        },
                    },
                ],
            },
        ],
        taxClassifications: [
            {
                country: {
                    code: 'DE',
                },
                taxCategory: {
                    code: 'TTX1',
                },
                taxClassification: {
                    code: '1',
                },
            },
            {
                country: {
                    code: 'DE',
                },
                taxCategory: {
                    code: 'TTX2',
                },
                taxClassification: {
                    code: '1',
                },
            },
        ],
    },
};

const updatePayload = {
    displayId: 'test',
    businessPartnerType: 'person',
    person: {
        nameDetails: {
            firstName: 'firstName',
            lastName: 'lastName',
        },
    },
    isBlocked: false,
    id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
    bankAccounts: [
        {
            id: '0001',
            bankAccountName: 'bankAccountName1',
            bankControlKey: '01',
        },
        {
            id: '0003',
            bankAccountName: 'bankAccountName4',
            bankControlKey: '04',
        },
    ],
    roles: [
        {
            role: {
                code: 'FLCU00',
            },
            validTo: '2021-12-31',
            validFrom: '2021-01-01',
        },
        {
            role: {
                code: 'MKK',
            },
            validTo: '2021-12-31',
            validFrom: '2021-01-01',
        },
    ],
    taxNumbers: [
        {
            taxNumberType: {
                code: 'DE0',
            },
            taxNumber: 'DE204797706',
        },
        {
            taxNumberType: {
                code: 'US01',
            },
            taxNumber: 'US204797123',
        },
    ],
    addressData: [
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8a',
            communicationPreferences: {
                nonVerbalCommunicationLanguage: { code: 'en' },
            },
            usages: [
                {
                    isStandard: false,
                    usage: {
                        code: 'billing',
                    },
                    validTo: '2022-12-31',
                    validFrom: '2021-01-01',
                },
            ],
            emailAddresses: [
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                    address: 'test1@email.com',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                    address: 'test2@email.com',
                },
            ],
            phoneNumbers: [
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                    isMobile: true,
                    country: {
                        code: 'US',
                    },
                    number: '1234567890',
                    numberExtension: '123',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                    isMobile: true,
                    country: {
                        code: 'DE',
                    },
                    number: '0987654321',
                    numberExtension: '321',
                },
            ],
            postalAddressType: 'personPostalAddress',
            personPostalAddress: {
                street: {
                    name: 'streetName4',
                },
                primaryRegion: {
                    code: 'WA',
                },
                country: {
                    code: 'US',
                },
                town: {
                    name: 'Green Bluff',
                },
                postCode: '99003',
                houseNumber: 'houseNumber4',
            },
        },
        {
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
            communicationPreferences: {
                nonVerbalCommunicationLanguage: {
                    code: 'en',
                },
            },
            usages: [
                {
                    isStandard: false,
                    usage: {
                        code: 'billing',
                    },
                    validTo: '2021-12-31',
                    validFrom: '2021-01-01',
                },
            ],
            emailAddresses: [
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                    address: 'test1@email.com',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
                    address: 'test4@email.com',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428be',
                    address: 'test5@email.com',
                },
            ],
            phoneNumbers: [
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                    isMobile: true,
                    country: {
                        code: 'US',
                    },
                    number: '1234567890',
                    numberExtension: '123',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                    isMobile: true,
                    country: {
                        code: 'DE',
                    },
                    number: '0987654321',
                    numberExtension: '321',
                },
            ],
            postalAddressType: 'personPostalAddress',
            personPostalAddress: {
                street: {
                    name: 'streetName',
                },
                primaryRegion: {
                    code: 'WA',
                },
                country: {
                    code: 'US',
                },
                town: {
                    name: 'Green Bluff',
                },
                postCode: '99003',
                houseNumber: 'houseNumber',
            },
        },
        {
            communicationPreferences: {
                nonVerbalCommunicationLanguage: {
                    code: 'en',
                },
            },
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
            postalAddressType: 'personPostalAddress',
            personPostalAddress: {
                street: {
                    name: 'streetName2',
                },
                primaryRegion: {
                    code: 'WA',
                },
                country: {
                    code: 'US',
                },
                town: {
                    name: 'Green Bluff',
                },
                postCode: '99003',
                houseNumber: 'houseNumber2',
            },
            emailAddresses: [],
            phoneNumbers: [],
            usages: [
                {
                    isStandard: false,
                    usage: {
                        code: 'shipping',
                    },
                    validTo: '2022-12-31',
                    validFrom: '2021-01-01',
                },
            ],
        },
    ],
    customerInformation: {
        salesArrangements: [
            {
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
                functions: [
                    {
                        functionName: 'partnerFunc1',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'AG',
                        },
                    },
                    {
                        functionName: 'partnerFunc2',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'RE',
                        },
                    },
                    {
                        functionName: 'partnerFunc5',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'WE',
                        },
                    },
                    {
                        functionName: 'partnerFunc6',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'RG',
                        },
                    },
                ],
            },
            {
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
                functions: [
                    {
                        functionName: 'partnerFunc2',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'AG',
                        },
                    },
                    {
                        functionName: 'partnerFunc3',
                        functionPartnerType: 'functionPartnerCustomer',
                        functionCode: {
                            code: 'RE',
                        },
                    },
                ],
            },
            {
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
        ],
        taxClassifications: [
            {
                country: {
                    code: 'DE',
                },
                taxCategory: {
                    code: 'TTX1',
                },
                taxClassification: {
                    code: '1',
                },
            },
            {
                country: {
                    code: 'DE',
                },
                taxCategory: {
                    code: 'TTX2',
                },
                taxClassification: {
                    code: '1',
                },
            },
        ],
    },
};

const mdiPatchPayloadInstance = {
    person: { nameDetails: { firstName: 'firstName', lastName: 'lastName' } },
    // id: '730d9e4b-3c9b-45b3-a91c-4e967e527270',
    displayId: 'test',
    businessPartnerType: 'person',
    isBlocked: false,
    bankAccounts_delta: [
        {
            id: '0001',
            bankAccountName: 'bankAccountName1',
            bankControlKey: '01',
            _operation: 'create',
        },
        {
            id: '0003',
            bankAccountName: 'bankAccountName4',
            bankControlKey: '04',
            _operation: 'patch',
        },
        { _operation: 'delete', id: '0002' },
    ],
    taxNumbers_delta: [
        {
            taxNumber: 'DE204797706',
            _operation: 'patch',
            taxNumberType: { code: 'DE0' },
        },
        {
            taxNumber: 'US204797123',
            _operation: 'patch',
            taxNumberType: { code: 'US01' },
        },
        { _operation: 'delete', taxNumberType: { code: 'CA0' } },
    ],
    roles_delta: [
        {
            validFrom: '2021-01-01',
            validTo: '2021-12-31',
            _operation: 'patch',
            role: { code: 'FLCU01' },
        },
        { _operation: 'delete', role: { code: 'FLCU00' } },
        { _operation: 'delete', role: { code: 'MKK' } },
    ],
    addressData_delta: [
        {
            usages: [
                {
                    validTo: '2022-12-31',
                    validFrom: '2021-01-01',
                    isStandard: false,
                    usage: { code: 'billing' },
                },
            ],
            personPostalAddress: {
                houseNumber: 'houseNumber4',
                postCode: '99003',
                street: { name: 'streetName4' },
                town: { name: 'Green Bluff' },
                primaryRegion: { code: 'WA' },
                country: { code: 'US' },
            },
            emailAddresses: [
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                    address: 'test1@email.com',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                    address: 'test2@email.com',
                },
            ],
            phoneNumbers: [
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                    isMobile: true,
                    number: '1234567890',
                    numberExtension: '123',
                    country: { code: 'US' },
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                    isMobile: true,
                    number: '0987654321',
                    numberExtension: '321',
                    country: { code: 'DE' },
                },
            ],
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8a',
            postalAddressType: 'personPostalAddress',
            communicationPreferences: {
                nonVerbalCommunicationLanguage: { code: 'en' },
            },
            _operation: 'create',
        },
        {
            personPostalAddress: {
                houseNumber: 'houseNumber',
                postCode: '99003',
                street: { name: 'streetName' },
                town: { name: 'Green Bluff' },
                primaryRegion: { code: 'WA' },
                country: { code: 'US' },
            },
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8d',
            postalAddressType: 'personPostalAddress',
            communicationPreferences: {
                nonVerbalCommunicationLanguage: { code: 'en' },
            },
            _operation: 'patch',
            usages_delta: [
                {
                    validTo: '2021-12-31',
                    validFrom: '2021-01-01',
                    isStandard: false,
                    _operation: 'patch',
                    usage: { code: 'billing' },
                },
                {
                    _operation: 'delete',
                    validTo: '2021-12-31',
                    usage: { code: 'shipping' },
                },
            ],
            emailAddresses_delta: [
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                    address: 'test1@email.com',
                    _operation: 'patch',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bc',
                    address: 'test4@email.com',
                    _operation: 'patch',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428be',
                    address: 'test5@email.com',
                    _operation: 'create',
                },
                {
                    _operation: 'delete',
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                },
                {
                    _operation: 'delete',
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bd',
                },
            ],
            phoneNumbers_delta: [
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                    isMobile: true,
                    number: '1234567890',
                    numberExtension: '123',
                    country: { code: 'US' },
                    _operation: 'create',
                },
                {
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                    isMobile: true,
                    number: '0987654321',
                    numberExtension: '321',
                    country: { code: 'DE' },
                    _operation: 'create',
                },
            ],
        },
        {
            personPostalAddress: {
                houseNumber: 'houseNumber2',
                postCode: '99003',
                street: { name: 'streetName2' },
                town: { name: 'Green Bluff' },
                primaryRegion: { code: 'WA' },
                country: { code: 'US' },
            },
            id: 'd80b9521-2f45-4302-bc30-c6456f794d8f',
            postalAddressType: 'personPostalAddress',
            communicationPreferences: {
                nonVerbalCommunicationLanguage: { code: 'en' },
            },
            _operation: 'patch',
            usages_delta: [
                {
                    validTo: '2022-12-31',
                    validFrom: '2021-01-01',
                    isStandard: false,
                    _operation: 'patch',
                    usage: { code: 'shipping' },
                },
            ],
            emailAddresses_delta: [],
            phoneNumbers_delta: [
                {
                    _operation: 'delete',
                    id: 'c16e4279-834f-4077-ace9-c591fb3428ba',
                },
                {
                    _operation: 'delete',
                    id: 'c16e4279-834f-4077-ace9-c591fb3428bb',
                },
            ],
        },
        { _operation: 'delete', id: 'd80b9521-2f45-4302-bc30-c6456f794d8e' },
    ],
};

module.exports = {
    createPayload,
    updatePayload,
    mdiPatchPayloadInstance,
};
