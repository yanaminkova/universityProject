const { expect, launchServer } = require('../lib/testkit');
const functions = require('../lib/functions');

const {
    createConfigurationDataSet,
} = require('./payload/ConfigurationDataHelper');

const { GET, POST, pdmUser, admin } = launchServer({
    service: {
        paths: ['srv/dpp', 'srv/api/CommonConfigurationService'],
    },
});

global.cds.env.features.assert_integrity = false;

describe('DPP_PersonalDataManager it-test UTILITIESCLOUDSOLUTION-2916', () => {
    let businessPartner = null;

    beforeAll(async () => {
        // setup configuration data
        await createConfigurationDataSet(admin, POST);
    });

    it('should serve `/api/businessPartner/v1/pdm/$metadata`', async () => {
        const { headers, status, data } = await GET(
            `/api/businessPartner/v1/pdm/$metadata`,
            {
                auth: pdmUser,
            }
        );
        expect(status).to.equal(200);
        expect(headers).to.contain({
            'content-type': 'application/xml',
            'odata-version': '4.0',
        });
        expect(data).to.contain(
            '<EntitySet Name="BusinessPartner" EntityType="BusinessPartnerPDMService.BusinessPartner"/>'
        );
        /*
        expect(data).to.contain(
            '<EntitySet Name="BusinessPartnerPerson" EntityType="BusinessPartnerPDMService.BusinessPartnerPerson"/>'
        );
        */
        expect(data).to.contain(
            '<Annotations Target="BusinessPartnerPDMService.EntityContainer/BusinessPartner">'
        );
    });

    it('should serve `/api/businessPartner/v1/pdm/BusinessPartner` for pdmUser', async () => {
        const displayId = 'sampleId';
        const businessPartnerId = cds.utils.uuid();
        const businessPartnerDB = {
            id: businessPartnerId,
            displayId,
            isBlocked: false,
        };
        businessPartner = await functions.createDB(
            `sap.odm.businesspartner.BusinessPartner`,
            businessPartnerDB
        );
        expect(businessPartner).to.exist;

        const birthDate = '2020-01-01';
        const genderCode = '1';
        const DBData = {
            birthDate,
            gender_code: genderCode,
            up__id: businessPartnerId,
        };
        const businessPartnerPerson = await functions.createDB(
            `sap.odm.businesspartner.BusinessPartner.person`,
            DBData
        );
        expect(businessPartnerPerson).to.exist;

        const { status, data } = await GET(
            `/api/businessPartner/v1/pdm/BusinessPartnerPerson?$filter=businessPartnerId eq ${businessPartner.id}`,
            {
                auth: pdmUser,
            }
        );

        expect(status).to.equal(200);
        expect(data.value[0].businessPartnerId).to.eql(businessPartner.id);
        expect(data.value[0].birthDate).to.eql(birthDate);
    });

    it('should serve `/api/businessPartner/v1/pdm/BusinessPartnerBankAccounts` for pdmUser', async () => {
        const bankAccountId = cds.utils.uuid();
        const DBData = {
            id: bankAccountId,
            bankAccountName: 'Bank Account Name',
            up__id: businessPartner.id,
        };
        const businessPartnerBankAccount = await functions.createDB(
            `sap.odm.businesspartner.BusinessPartner.bankAccounts`,
            DBData
        );
        expect(businessPartnerBankAccount).to.exist;

        const { status, data } = await GET(
            `/api/businessPartner/v1/pdm/BusinessPartnerBankAccounts?$filter=businessPartnerId eq ${businessPartner.id}`,
            {
                auth: pdmUser,
            }
        );

        expect(status).to.equal(200);
        expect(data.value[0].businessPartnerId).to.eql(businessPartner.id);
    });

    it('should serve `/api/businessPartner/v1/pdm/BusinessPartnerOrganization` for pdmUser', async () => {
        const formattedOrgNameLine1 = 'Some Organization Name';
        const DBData = {
            formattedOrgNameLine1,
            formattedOrgNameLine2: null,
            formattedOrgNameLine3: null,
            formattedOrgNameLine4: null,
            formattedOrgName: null,
            up__up__id: businessPartner.id,
        };
        const businessPartnerOrganizationNameDetails = await functions.createDB(
            `sap.odm.businesspartner.BusinessPartner.organization.nameDetails`,
            DBData
        );
        expect(businessPartnerOrganizationNameDetails).to.exist;

        const { status, data } = await GET(
            `/api/businessPartner/v1/pdm/BusinessPartnerOrganizationNameDetails?$filter=businessPartnerId eq ${businessPartner.id}`,
            {
                auth: pdmUser,
            }
        );

        expect(status).to.equal(200);
        expect(data.value[0].businessPartnerId).to.eql(businessPartner.id);
        expect(data.value[0].formattedOrgNameLine1).to.eql(
            formattedOrgNameLine1
        );
    });

    it('should serve `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataPersonPostalAddress` for pdmUser', async () => {
        const businessPartnerAddressId = cds.utils.uuid();
        const firstName = 'First Name';
        const DBData = {
            up__id: businessPartnerAddressId,
            firstName,
            up__up__id: businessPartner.id,
        };
        const PersonAddressDB = await functions.createDB(
            `sap.odm.businesspartner.BusinessPartner.addressData.personPostalAddress`,
            DBData
        );

        expect(PersonAddressDB).to.exist;

        const { status, data } = await GET(
            `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataPersonPostalAddress?$filter=businessPartnerId eq ${businessPartner.id}`,
            {
                auth: pdmUser,
            }
        );

        expect(status).to.equal(200);
        expect(data.value[0].businessPartnerId).to.eql(businessPartner.id);
        expect(data.value[0].firstName).to.eql(firstName);
    });

    it('should serve `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataEmailAddresses` for pdmUser', async () => {
        const businessPartnerAddressId = cds.utils.uuid();
        const emailAddress = 'email@address.com';
        const addressId = '001';
        const DBData = {
            id: addressId,
            up__id: businessPartnerAddressId,
            up__up__id: businessPartner.id,
            address: emailAddress,
        };
        const EmailAddressDB = await functions.createDB(
            `sap.odm.businesspartner.BusinessPartner.addressData.emailAddresses`,
            DBData
        );

        expect(EmailAddressDB).to.exist;

        const { status, data } = await GET(
            `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataEmailAddresses?$filter=businessPartnerId eq ${businessPartner.id}`,
            {
                auth: pdmUser,
            }
        );

        expect(status).to.equal(200);
        expect(data.value[0].businessPartnerId).to.eql(businessPartner.id);
        expect(data.value[0].address).to.eql(emailAddress);
        expect(data.value[0].id).to.eql(addressId);
    });

    it('should serve `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataPhoneNumbers` for pdmUser', async () => {
        const businessPartnerAddressId = cds.utils.uuid();
        const number = '123-456-7890';
        const addressId = '001';
        const PhoneNumberData = {
            id: addressId,
            up__id: businessPartnerAddressId,
            up__up__id: businessPartner.id,
            number,
        };
        const PhoneNumbersDB = await functions.createDB(
            `sap.odm.businesspartner.BusinessPartner.addressData.phoneNumbers`,
            PhoneNumberData
        );

        expect(PhoneNumbersDB).to.exist;

        const { status, data } = await GET(
            `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataPhoneNumbers?$filter=businessPartnerId eq ${businessPartner.id}`,
            {
                auth: pdmUser,
            }
        );

        expect(status).to.equal(200);
        expect(data.value[0].businessPartnerId).to.eql(businessPartner.id);
        expect(data.value[0].number).to.eql(number);
        expect(data.value[0].id).to.eql(addressId);
    });

    it('should serve `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataFaxNumbers` for pdmUser', async () => {
        const businessPartnerAddressId = cds.utils.uuid();
        const number = '123-456-7890';
        const addressId = '001';
        const FaxNumberData = {
            id: addressId,
            up__id: businessPartnerAddressId,
            up__up__id: businessPartner.id,
            number,
        };
        const FaxNumberDB = await functions.createDB(
            `sap.odm.businesspartner.BusinessPartner.addressData.faxNumbers`,
            FaxNumberData
        );

        expect(FaxNumberDB).to.exist;

        const { status, data } = await GET(
            `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataFaxNumbers?$filter=businessPartnerId eq ${businessPartner.id}`,
            {
                auth: pdmUser,
            }
        );

        expect(status).to.equal(200);
        expect(data.value[0].businessPartnerId).to.eql(businessPartner.id);
        expect(data.value[0].number).to.eql(number);
        expect(data.value[0].id).to.eql(addressId);
    });

    it('should serve `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataWebsites` for pdmUser', async () => {
        const businessPartnerAddressId = cds.utils.uuid();
        const url = 'www.google.ca';
        const addressId = '001';
        const WebsiteData = {
            id: addressId,
            up__id: businessPartnerAddressId,
            up__up__id: businessPartner.id,
            url,
        };
        const WebsiteAddressDB = await functions.createDB(
            `sap.odm.businesspartner.BusinessPartner.addressData.websites`,
            WebsiteData
        );

        expect(WebsiteAddressDB).to.exist;

        const { status, data } = await GET(
            `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataWebsites?$filter=businessPartnerId eq ${businessPartner.id}`,
            {
                auth: pdmUser,
            }
        );

        expect(status).to.equal(200);
        expect(data.value[0].businessPartnerId).to.eql(businessPartner.id);
        expect(data.value[0].url).to.eql(url);
        expect(data.value[0].id).to.eql(addressId);
    });

    it('should serve `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataOrganizationPostalAddress` for pdmUser', async () => {
        const businessPartnerAddressId = cds.utils.uuid();
        const formattedOrgNameLine1 = 'Formatted org name line 1';

        const DBData = {
            up__id: businessPartnerAddressId,
            formattedOrgNameLine1,
            up__up__id: businessPartner.id,
        };

        const BusinessPartnerOrganizationAddressDB = await functions.createDB(
            `sap.odm.businesspartner.BusinessPartner.addressData.organizationPostalAddress`,
            DBData
        );
        expect(BusinessPartnerOrganizationAddressDB).to.exist;

        const { status, data } = await GET(
            `/api/businessPartner/v1/pdm/BusinessPartnerAddressDataOrganizationPostalAddress?$filter=businessPartnerId eq ${businessPartner.id}`,
            {
                auth: pdmUser,
            }
        );

        expect(status).to.equal(200);
        expect(data.value[0].businessPartnerId).to.eql(businessPartner.id);
        expect(data.value[0].formattedOrgNameLine1).to.eql(
            formattedOrgNameLine1
        );
    });

    it('should serve `/api/businessPartner/v1/pdm/BusinessPartnerCustomerInformationTaxClassifications` for pdmUser', async () => {
        const taxCategory = '0001';
        const country = 'DE';
        const DBData = {
            taxCategory_code: taxCategory,
            country_code: country,
            up__up__id: businessPartner.id,
        };

        const BusinessPartnerCustomerInformationTaxClassificationDB =
            await functions.createDB(
                `sap.odm.businesspartner.BusinessPartner.customerInformation.taxClassifications`,
                DBData
            );

        expect(BusinessPartnerCustomerInformationTaxClassificationDB).to.exist;

        const { status, data } = await GET(
            `/api/businessPartner/v1/pdm/BusinessPartnerCustomerInformationTaxClassifications?$filter=businessPartnerId eq ${businessPartner.id}`,
            {
                auth: pdmUser,
            }
        );

        expect(status).to.equal(200);
        expect(data.value[0].businessPartnerId).to.eql(businessPartner.id);
        expect(data.value[0].country_name).to.eql('Germany');
    });
});
