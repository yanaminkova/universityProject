using {
    sap.odm.common as common,
    sap.odm.finance as finance,
    sap.odm.sales as sales,
    sap.c4u.foundation.retailer.serviceprovider as serviceprovider,
    sap.odm.businesspartner as businesspartner,
} from '../../../db';

service BusinessPartnerServiceBeta @(
    path: '/api/beta/businesspartner/v1', 
    requires: 'authenticated-user', 
    version: 'beta', 
    impl: 'srv/api/businesspartner/BusinessPartnerService'
) { 
    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false'},
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }
        ],
        Capabilities: { DeleteRestrictions.Deletable: false })
    entity BusinessPartner as projection on businesspartner.BusinessPartner {
        id,
        @readonly displayId,
        businessPartnerType @mandatory @(assert.range: true),
        person,                         // composition of one PersonDetails
        organization,                   // composition of one OrganizationDetails
        isBlocked,
        bankAccounts,                   // composition of many BankAccount
        taxNumbers,
        addressData,                    // composition of many AddressData
        roles,                          // composition of many BusinessPartnerRole
        customerInformation,
        serviceProviderInformation
    } actions {
        @(restrict: [{ to: 'API.Write' }])
        action close ();
    };

    @(restrict: [
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
        ],
        cds.redirection.target: false )
    @readonly entity BusinessPartnerBookKeeping as projection on businesspartner.BusinessPartner {
        id,
        displayId,
        mdiBookKeeping,
        isBlocked 
    }


    @(restrict: [
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }
        ],
        cds.redirection.target: false )
    @readonly entity BusinessPartnerSearch as projection on businesspartner.BusinessPartner {
        id,
        displayId,
        isBlocked,
        person.nameDetails.firstName as firstName,
        person.nameDetails.lastName as lastName,
        addressData.emailAddresses.address as emailAddress
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerPerson as projection on businesspartner.BusinessPartner.person {
        up_,
        nameDetails,            // composition of one PersonName
        gender,                 
        language,
        correspondenceLanguage,
        birthDate,
        nationality,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerPersonNameDetails as projection on businesspartner.BusinessPartner.person.nameDetails {
        up_,
        firstName,
        middleName,
        lastName,
        academicTitle,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerOrganization as projection on businesspartner.BusinessPartner.organization {
        up_,                    // BusinessPartner
        nameDetails,             // composition of OrganizationName
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerOrganizationNameDetails as projection on businesspartner.BusinessPartner.organization.nameDetails {
        up_,                    // BusinessPartnerOrganization
        formattedOrgNameLine1,
        formattedOrgNameLine2,
        formattedOrgNameLine3,
        formattedOrgNameLine4,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerBankAccounts as projection on businesspartner.BusinessPartner.bankAccounts {
        up_,                    // BusinessPartner
        id,
        bankAccountName,
        bankControlKey,
        validFrom,
        validTo,
        bankCountry,
        bankAccountHolderName,
        IBAN,
        bankAccount,
        bankNumber,
        bankAccountReference,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerTaxNumbers as projection on businesspartner.BusinessPartner.taxNumbers {
        up_,                     // BusinessPartner
        taxNumberType,
        taxNumber,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        // custom annotation, check service for usage
        customAnnotations: { 
            restrict: [
                { block: ['DELETE'], where: 'usages', contains: 'usage_code = XXDEFAULT'},
                // { limit: ['CREATE', 'UPDATE'], min: '1', where: 'usages', contains: 'usage_code = XXDEFAULT'}
            ] 
        }
        )
    entity BusinessPartnerAddressData as projection on businesspartner.BusinessPartner.addressData {
        up_,                        // BusinessPartner
        id,
        usages,                     // composition of many AddressDataUsage
        postalAddressType,
        personPostalAddress,        // composition of one PersonAddress
        organizationPostalAddress,  // composition of one OrganizationAddress
        emailAddresses,             // composition of many Email
        phoneNumbers,               // composition of many PhoneNumber
        validFrom,
        validTo,
        communicationPreferences,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerAddressDataUsages as projection on businesspartner.BusinessPartner.addressData.usages {
        up_,                        // BusinessPartnerAddressData
        usage,
        validTo,
        validFrom,
        isStandard,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerAddressDataPersonPostalAddress as projection on businesspartner.BusinessPartner.addressData.personPostalAddress {
        up_,                            // BusinessPartnerAddressData
        street,                         // type Street
        streetSuffix1,
        streetSuffix2,
        houseNumber,
        town,                           // type Town
        primaryRegion,
        country,
        postCode,
        companyPostalCode,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerAddressDataOrganizationPostalAddress as projection on businesspartner.BusinessPartner.addressData.organizationPostalAddress {
        up_,                            // BusinessPartnerAddressData
        street,                         // type Street
        streetSuffix1,
        streetSuffix2,
        houseNumber,
        town,                           // type Town
        primaryRegion,
        country,
        postCode,
        companyPostalCode,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        // Capabilities: { DeleteRestrictions.Deletable: false }
        )
    entity BusinessPartnerAddressDataEmailAddresses as projection on businesspartner.BusinessPartner.addressData.emailAddresses {
        up_,                        // BusinessPartnerAddressData
        id,
        address,
        isDefault,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerAddressDataPhoneNumbers as projection on businesspartner.BusinessPartner.addressData.phoneNumbers {
        up_,                        // BusinessPartnerAddressData
        id,
        isMobile,
        country,
        number,
        numberExtension,
        isDefault,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        // custom annotation, check service for usage
        customAnnotations: { 
            restrict: [
                { block: ['DELETE'] }] 
        }
        )
    entity BusinessPartnerRoles as projection on businesspartner.BusinessPartner.roles {
        up_,            // BusinessPartner
        role,
        validFrom,
        validTo,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerCustomerInformation as projection on businesspartner.BusinessPartner.customerInformation {
        up_,
        salesArrangements,
        taxClassifications,
        customerAccountGroup,
        vatLiability,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        // custom annotation, check service for usage
        customAnnotations: { 
            restrict: [
                { block: ['DELETE'] }] 
        }
        )
    entity BusinessPartnerCustomerInformationSalesArrangements as projection on businesspartner.BusinessPartner.customerInformation.salesArrangements {
        up_,
        salesAreaRef,
        deliveryPriority,
        currency,
        salesArrangementGroup,
        salesArrangementPriceGroup,
        functions,
        incotermsClassification,
        incotermsTransferLocationName,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerCustomerInformationSalesArrangementsFunctions as projection on businesspartner.BusinessPartner.customerInformation.salesArrangements.functions {
        up_,
        functionName,
        functionCode,
        functionPartnerType,
        partnerNumber,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }],
        )
    entity BusinessPartnerCustomerInformationTaxClassifications as projection on businesspartner.BusinessPartner.customerInformation.taxClassifications {
        up_,
        country,
        taxCategory,
        taxClassification,
        isBlocked
    }

    @(  restrict: [
            { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
            { grant: ['READ'], to: 'DPPBlocked.Read' }], 
        )
    entity BusinessPartnerServiceProviderInformation as projection on businesspartner.BusinessPartner.serviceProviderInformation {
        up_,
        id,
        marketFunction,
        marketFunctionCodeNumber1,
        marketFunctionSource1,
        marketFunctionCodeNumber2,
        marketFunctionSource2,
        validFrom,
        validTo,
        isBlocked
    }
}
