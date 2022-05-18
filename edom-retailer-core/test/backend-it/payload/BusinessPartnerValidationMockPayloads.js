const {
    basePerson,
    baseOrg,
    baseBpGroup,
    requiredPerson1,
    requiredOrg1,
    requiredPersonAddressData1,
    requiredOrgAddressData1,
    completeServiceProviderMarketFunction1,
} = require('./BusinessPartnerMockPayload');

const bpOrgValid = {
    ...baseOrg,
    organization: {
        ...requiredOrg1,
    },
    addressData: [
        {
            ...requiredOrgAddressData1,
        },
        {
            ...requiredOrgAddressData1,
        },
    ],
};

const bpOrgMissingPostalAddressFields = {
    ...baseOrg,
    organization: {
        ...requiredOrg1,
    },
    addressData: [
        {
            ...requiredOrgAddressData1,
        },
        {
            postalAddressType: 'organizationPostalAddress',
            organizationPostalAddress: {
                houseNumber: 'houseNumber',
            },
        },
    ],
};

const bpOrgMissingPostalAddress = {
    ...baseOrg,
    organization: {
        ...requiredOrg1,
    },
    addressData: [
        {
            ...requiredOrgAddressData1,
        },
        {
            postalAddressType: 'organizationPostalAddress',
        },
    ],
};

const bpOrgEmptyAddressData = {
    ...baseOrg,
    organization: {
        ...requiredOrg1,
    },
    addressData: [],
};

const bpOrgMissingAddressData = {
    ...baseOrg,
    organization: {
        ...requiredOrg1,
    },
};

const bpOrgMissingNameDetailsFields = {
    ...baseOrg,
    organization: {
        nameDetails: {
            formattedOrgNameLine2: 'orgNameLine2',
        },
    },
    addressData: [
        {
            ...requiredOrgAddressData1,
        },
        {
            ...requiredOrgAddressData1,
        },
    ],
};

const bpOrgMissingNameDetails = {
    ...baseOrg,
    organization: null,
    addressData: [
        {
            ...requiredOrgAddressData1,
        },
        {
            ...requiredOrgAddressData1,
        },
    ],
};

const bpOrgMissingOrganization = {
    ...baseOrg,
    addressData: [
        {
            ...requiredOrgAddressData1,
        },
        {
            ...requiredOrgAddressData1,
        },
    ],
};

const bpPersonValid = {
    ...basePerson,
    person: {
        ...requiredPerson1,
    },
    addressData: [
        {
            ...requiredPersonAddressData1,
        },
        {
            ...requiredPersonAddressData1,
        },
    ],
};

const bpPersonMissingBPType = {
    displayId: 'sampleId',
    isBlocked: false,
    person: {
        ...requiredPerson1,
    },
    addressData: [
        {
            ...requiredPersonAddressData1,
        },
        {
            ...requiredPersonAddressData1,
        },
    ],
};

const bpPersonMissingPostalAddressFields = {
    ...basePerson,
    person: {
        ...requiredPerson1,
    },
    addressData: [
        {
            ...requiredPersonAddressData1,
        },
        {
            postalAddressType: 'personPostalAddress',
            personPostalAddress: {
                houseNumber: 'houseNumber',
            },
        },
    ],
};

const bpPersonMissingPostalAddress = {
    ...basePerson,
    person: {
        ...requiredPerson1,
    },
    addressData: [
        {
            ...requiredPersonAddressData1,
        },
        {
            postalAddressType: 'personPostalAddress',
        },
    ],
};

const bpPersonEmptyAddressData = {
    ...basePerson,
    person: {
        ...requiredPerson1,
    },
    addressData: [],
};

const bpPersonMissingAddressData = {
    ...basePerson,
    person: {
        ...requiredPerson1,
    },
};

const bpPersonMissingNameDetailsFields = {
    ...basePerson,
    person: {
        nameDetails: {
            middleName: 'middleName',
        },
    },
    addressData: [
        {
            ...requiredPersonAddressData1,
        },
        {
            ...requiredPersonAddressData1,
        },
    ],
};

const bpPersonMissingNameDetails = {
    ...basePerson,
    person: {
        birthDate: '1980-01-01',
    },
    addressData: [
        {
            ...requiredPersonAddressData1,
        },
        {
            ...requiredPersonAddressData1,
        },
    ],
};

const bpPersonMissingPerson = {
    ...basePerson,
    addressData: [
        {
            ...requiredPersonAddressData1,
        },
        {
            ...requiredPersonAddressData1,
        },
    ],
};

const bpBpGroupInvalid = {
    ...baseBpGroup,
};

const bpPersonServiceProvider = {
    ...basePerson,
    person: {
        ...requiredPerson1,
    },
    addressData: [
        {
            ...requiredPersonAddressData1,
        },
        {
            ...requiredPersonAddressData1,
        },
    ],
    serviceProviderInformation: [
        {
            ...completeServiceProviderMarketFunction1,
        },
    ],
};

const bpOrgServiceProvider = {
    ...baseOrg,
    organization: {
        ...requiredOrg1,
    },
    addressData: [
        {
            ...requiredOrgAddressData1,
        },
        {
            ...requiredOrgAddressData1,
        },
    ],
    serviceProviderInformation: [
        {
            ...completeServiceProviderMarketFunction1,
        },
    ],
};

module.exports = {
    bpPersonValid,
    bpPersonMissingBPType,
    bpPersonMissingPostalAddressFields,
    bpPersonMissingPostalAddress,
    bpPersonEmptyAddressData,
    bpPersonMissingAddressData,
    bpPersonMissingNameDetailsFields,
    bpPersonMissingNameDetails,
    bpPersonMissingPerson,
    bpOrgValid,
    bpOrgMissingPostalAddressFields,
    bpOrgMissingPostalAddress,
    bpOrgEmptyAddressData,
    bpOrgMissingAddressData,
    bpOrgMissingNameDetailsFields,
    bpOrgMissingNameDetails,
    bpOrgMissingOrganization,
    bpBpGroupInvalid,
    bpPersonServiceProvider,
    bpOrgServiceProvider,
};
