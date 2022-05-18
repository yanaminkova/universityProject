const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');

const handleError = async (err) => {
    /* istanbul ignore next */
    logger.error(`[TEST][handleError][err.message]: ${err.message}`);
};

async function createCustomerOrderPartnerDB(
    businessPartnerId,
    customerOrderID,
    businessPartnerUUID
) {
    const db = await cds.connect.to('db');
    const partnerID = cds.utils.uuid();
    const partner = {
        id: partnerID,
        businessPartnerId: businessPartnerId,
        businessPartner: { id: businessPartnerUUID },
        up__id: customerOrderID,
    };

    const affectedRows = await db
        .run(
            INSERT.into(`sap.odm.sales.CustomerOrder.partners`).entries(partner)
        )
        .catch((e) => handleError(e));

    const result = await cds.run(
        SELECT.one.from(`sap.odm.sales.CustomerOrder.partners`).where({
            id: partnerID,
        })
    );

    return result;
}

async function createBillingAccountDB2(displayId, endOfBusinessDate) {
    const billingAccountID = cds.utils.uuid();
    const bpID = cds.utils.uuid();

    await cds.db.run(
        INSERT.into('sap.odm.businesspartner.BusinessPartner').entries({
            id: bpID,
            displayId: 'sampleId1',
            businessPartnerType: 'organization',
        })
    );

    await cds.db.run(
        INSERT.into('sap.odm.utilities.billingaccount.BillingAccount').entries({
            id: billingAccountID,
            businessPartner: {
                id: bpID,
            },
            displayId: displayId,
            isBlocked: false,
            endOfBusinessDate,
        })
    );

    const result = await cds.run(
        SELECT.one
            .from(`sap.odm.utilities.billingaccount.BillingAccount`)
            .where({
                id: billingAccountID,
            })
    );

    return result;
}

async function createCustomerOrderDB(type_code, endOfBusinessDate) {
    const customerOrderID = cds.utils.uuid();
    const customerOrder = {
        id: customerOrderID,
        type: { code: type_code },
        endOfBusinessDate,
    };

    const affectedRows = await cds
        .run(INSERT.into(`sap.odm.sales.CustomerOrder`).entries(customerOrder))
        .catch((e) => handleError(e));

    const result = await cds.run(
        SELECT.one.from(`sap.odm.sales.CustomerOrder`).where({
            id: customerOrderID,
        })
    );

    return result;
}

async function deleteCustomerOrderDB(id) {
    try {
        const affectedRows = await cds
            .run(DELETE.from(`sap.odm.sales.CustomerOrder`).where({ id }))
            .catch((e) => handleError(e));
        return true;
    } catch (err) {
        return false;
    }
}

async function blockCustomerOrder(id) {
    const affectedRows = await cds.run(
        UPDATE(`${salesNamespace}.CustomerOrder`)
            .set({
                isBlocked: true,
            })
            .where({
                id,
            })
    );

    logger.info(`[DPP_DRM][Number of items blocked]: ${affectedRows}`);
}

async function createBusinessPartnerForBillingAccount() {
    const businessPartnerID = cds.utils.uuid();
    const businessPartner = {
        id: businessPartnerID,
        addressData: [
            {
                postalAddressType: 'organizationPostalAddress',
                personPostalAddress: {
                    street: {
                        name: 'streetName',
                    },
                    houseNumber: 'houseNumber',
                    primaryRegion: {
                        code: 'DE-11',
                    },
                    country: {
                        code: 'DE',
                    },
                    town: {
                        name: 'town',
                    },
                    postCode: 'postCode',
                    companyPostalCode: 'postCode',
                },
            },
        ],
        bankAccounts: [
            {
                id: '0001',
                bankAccountName: 'bankAccountName',
                bankControlKey: '00',
                validFrom: '2021-01-01',
                validTo: '2021-12-31',
                bankAccountHolderName: 'bankAccountHolderName',
                IBAN: 'IBAN',
                bankAccount: 'bankAccountNumber',
                bankNumber: '21112018',
                bankAccountReference: 'bankAccRef',
                bankCountry: {
                    code: 'DE',
                },
            },
        ],
    };
    const affectedRows = await cds
        .run(
            INSERT.into(`sap.odm.businesspartner.BusinessPartner`).entries(
                businessPartner
            )
        )
        .catch((e) => handleError(e));
    const result = await cds.run(
        SELECT.one.from(`sap.odm.businesspartner.BusinessPartner`).where({
            id: businessPartnerID,
        })
    );

    return result;
}

async function createBillingAccountDB(bpId) {
    const businessPartner = bpId
        ? { id: bpId }
        : await createBusinessPartnerForBillingAccount();
    const billingAccountID = cds.utils.uuid();
    const billingAccount = {
        id: billingAccountID,
        displayId: '000000165505',
        category: { code: 'Y1' },
        partner: {
            businessPartner_id: businessPartner.id,
            accountManagementData: {
                name: 'John Doe',
                billingAccountRelationship: { code: 'Y1' },
                toleranceGroup: { code: 'Y001' },
                clearingCategory: null,
                paymentCondition: {
                    code: 'YN01',
                },
                accountDeterminationCode: {
                    code: 'Y0',
                },
                interestKey: {
                    code: '01',
                },
            },
            paymentControl: {
                companyCodeGroup: '1010',
                standardCompanyCode: '1010',
                incomingPayment: {
                    paymentMethod: 'E',
                    alternativePayer: {
                        id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                    },
                    bankAccount: '0001',
                    paymentCard: '',
                },
                outgoingPayment: {
                    paymentMethod: '5',
                    alternativePayee: {
                        id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                    },
                    bankAccount: '0001',
                    paymentCard: '',
                },
            },
            dunningControl: {
                dunningProcedure: {
                    code: '01',
                },
                alternativeDunningRecipient: {
                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                },
            },
            correspondence: {
                alternativeCorrespondenceRecipient: {
                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                },
            },
            taxControl: {
                supplyingCountry: {
                    code: 'DE',
                },
            },
            correspondence: {
                alternativeCorrespondenceRecipient: {
                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                },
            },
        },
    };

    const affectedRows = await cds
        .run(
            INSERT.into(
                `sap.odm.utilities.billingaccount.BillingAccount`
            ).entries(billingAccount)
        )
        .catch((e) => handleError(e));

    const result = await cds.run(
        SELECT.one
            .from(`sap.odm.utilities.billingaccount.BillingAccount`)
            .where({
                id: billingAccountID,
            })
    );

    return result;
}

async function createDB(tableName, data) {
    const db = await cds.connect.to('db');
    const affectedRows = await cds
        .run(INSERT.into(tableName).entries(data))
        .catch((e) => handleError(e));

    const result = await cds.run(SELECT.one.from(tableName).where(data));
    return result;
}

async function deleteAllDB(tableName) {
    try {
        const affectedRows = await cds
            .run(DELETE.from(tableName))
            .catch((e) => handleError(e));
        return true;
    } catch (err) {
        return false;
    }
}

async function blockDB(tableName, id) {
    const affectedRows = await cds.run(
        UPDATE(tableName).set({ isBlocked: true }).where({ id })
    );

    logger.info(`[DPP_DRM][Number of items blocked]: ${affectedRows}`);
}

async function businessPartnerData() {
    const displayId = 'sampleId';
    const businessPartnerId = cds.utils.uuid();
    const result = {
        id: businessPartnerId,
        displayId,
        isBlocked: false,
    };
    return result;
}

async function createBusinessPartnerDB(data) {
    const businessPartnerID = cds.utils.uuid();
    const businessPartner = {
        id: businessPartnerID,
        ...data,
    };
    const affectedRows = await cds
        .run(
            INSERT.into(`sap.odm.businesspartner.BusinessPartner`).entries(
                businessPartner
            )
        )
        .catch((e) => handleError(e));
    const result = await cds.run(
        SELECT.one.from(`sap.odm.businesspartner.BusinessPartner`).where({
            id: businessPartner.id,
        })
    );

    return result;
}

module.exports = {
    createCustomerOrderPartnerDB,
    createCustomerOrderDB,
    blockCustomerOrder,
    createBillingAccountDB,
    createBillingAccountDB2,
    createDB,
    blockDB,
    createBusinessPartnerForBillingAccount,
    businessPartnerData,
    createBusinessPartnerDB,
    deleteCustomerOrderDB,
    deleteAllDB,
};
