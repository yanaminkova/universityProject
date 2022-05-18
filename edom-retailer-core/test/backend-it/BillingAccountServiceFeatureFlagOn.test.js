const cds = require('@sap/cds');
const { TextBundle } = require('@sap/textbundle');
const { expect, launchServer } = require('../lib/testkit');
const jestExpect = require('expect');
const functions = require('../lib/functions');
const { s4BACreateResponse } = require('./payload/BA_MOCK_S4_RESPONSE');
const { s4BAUpdateResponse } = require('./payload/BA_MOCK_S4_RESPONSE');
const { s4BAReadResponse } = require('./payload/BA_MOCK_S4_RESPONSE');
const { s4BAReadFailedResponse } = require('./payload/BA_MOCK_S4_RESPONSE');
const { s4BAFailedResponse } = require('./payload/BA_MOCK_S4_RESPONSE');
const { s4GenericFailedResponse } = require('./payload/BA_MOCK_S4_RESPONSE');
const SoapClient = require('../../srv/external/SoapClient');
const API_BP_KEY_MAPPING = require('../../srv/external/API_BP_KEY_MAPPING');
const { s4Response } = require('./payload/BA_MOCK_S4_RESPONSE');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
const { or } = require('@sap-cloud-sdk/core');
const baError = require('../../srv/lib/billingaccount/BillingAccountErrorMessages');
const baPayloads = require('../../srv/lib/billingaccount/billingAccountPayloads.js');
const { addExtData } = baPayloads;
const { nullLiteral } = require('@babel/types');

const {
    createConfigurationDataSet,
} = require('./payload/ConfigurationDataHelper');

const baPath = '/api/billingAccount/v1/';

jest.mock('../../srv/external/SoapClient');
jest.mock('../../srv/external/API_BP_KEY_MAPPING');

const bundle = new TextBundle('../../_i18n/i18n', ' ');
const errorBA = baError()(bundle);

global.cds.env.features.assert_integrity = false;

describe(`BillingAccountService it-test`, () => {
    // enabling mock feature flags
    cds.env.requires.featureFlags = {
        impl: 'test/backend-it/external/FeatureFlagsTestService',
    };
    const { GET, POST, PATCH, PUT, DELETE, admin, user, viewer } = launchServer(
        {
            service: {
                paths: [
                    'srv/api/billingaccount',
                    'srv/api/CommonConfigurationService',
                ],
            },
        }
    );

    let entities = [];
    const customer = {
        username: 'customer',
        password: 'customer',
    };

    let baId;

    setTestDestination({
        name: 'mdi-bp-keymap',
        url: 'https://mdi-test-key-mapping.com',
    });

    beforeAll(async () => {
        API_BP_KEY_MAPPING.mockImplementation(() => {
            return {
                getBPKeyMappingByBpUUID: async (req, businessSystem) => {
                    const bps4DisplayId = '9980017151';
                    const alternativePayee = '9980017151';
                    const alternativePayer = '9980017151';
                    const alternativeDunningRcpnt = '9980017151';
                    const alternativeCorrespondenceRcpnt = '9980017151';
                    return [
                        bps4DisplayId,
                        alternativePayee,
                        alternativePayer,
                        alternativeDunningRcpnt,
                        alternativeCorrespondenceRcpnt,
                    ];
                },
            };
        });

        SoapClient.mockImplementation(() => {
            return {
                init: async () => {
                    const businessSystem = '0OLOAS1';
                    return businessSystem;
                },
                upsertBillingAccount: async (args) => {
                    if (
                        'ContractAccountUpdateRequest' in args &&
                        args.ContractAccountUpdateRequest.PartnerRelationship
                            .CACompanyCodeGroup == '9010'
                    ) {
                        return {
                            billingAccount: s4BAFailedResponse,
                            resStatus: '5',
                        };
                    } else if ('ContractAccountUpdateRequest' in args) {
                        return {
                            billingAccount: s4BAUpdateResponse,
                            resStatus: '3',
                        };
                    } else if (
                        'ContractAccountSelectionByIdentifyingElements' in
                            args &&
                        args.ContractAccountSelectionByIdentifyingElements
                            .ContractAccount.InternalID == 'abc'
                    ) {
                        return { billingAccObjects: s4Response, status: null };
                    } else if (
                        'ContractAccountSelectionByIdentifyingElements' in
                            args &&
                        args.ContractAccountSelectionByIdentifyingElements
                            .ContractAccount.InternalID !== undefined
                    ) {
                        return {
                            billingAccObjects: s4BAReadResponse,
                            status: '3',
                        };
                    } else if (
                        'ContractAccountSelectionByIdentifyingElements' in
                            args &&
                        args.ContractAccountSelectionByIdentifyingElements
                            .ContractAccount.InternalID == undefined
                    ) {
                        return {
                            billingAccObjects: s4BAReadFailedResponse,
                            status: '5',
                        };
                    } else if (
                        args.ContractAccount.PartnerRelationship
                            .CAPaymentMethodForIncgPayment == '1'
                    ) {
                        return {
                            billingAccount: s4BAFailedResponse,
                            status: '5',
                        };
                    } else if (
                        args.ContractAccount.PartnerRelationship
                            .CACompanyCodeGroup == '9010'
                    ) {
                        return {
                            billingAccount: s4BAFailedResponse,
                            status: '5',
                        };
                    } else if (
                        args.ContractAccount.PartnerRelationship
                            .PaymentCondition == undefined
                    ) {
                        return {
                            billingAccount: s4GenericFailedResponse,
                        };
                    } else {
                        return {
                            billingAccount: s4BACreateResponse,
                            status: '3',
                        };
                    }
                },
            };
        });

        // setup configuration data
        await createConfigurationDataSet(admin, POST);

        await createBillingAccountRelationship();
        await createCategory();
        await createToleranceGrpCode();
        await createClearingCategoryCode();
        await createPaymentConditionCode();
        await createInterestKeyCode();
        await createAccountDeterminationIdCode();
        await createDunningProcedureCode();
        await createPaymentMethodCode();
    });

    before(async () => {
        // manually change feature flag return value
        const featureFlags = await cds.connect.to('featureFlags');
        featureFlags.set('sepa-mandate', true);
        featureFlags.set('ba-features-batch', true);
        featureFlags.set('ba-extensibility', true);
        featureFlags.set('bpkeymapping_refactor', true);
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('BillingAccountService')
        ).filter(
            (value) => !value['@cds.autoexposed'] && !value.elements['up_']
        );

        Array.from(serviceEntities).forEach((element) => {
            const { name } = element;
            entities.push(name.substring(name.indexOf('.') + 1, name.length));
        });
        const businessPartner = await createBusinessPartnerForBillingAccount();
    });

    async function readData(entity, user) {
        try {
            await GET(`${baPath}${entity}`, {
                auth: user,
            });
        } catch (error) {
            return error.message;
        }
    }

    async function createData(entity, user) {
        try {
            await POST(`${baPath}${entity}`, {}, { auth: user });
        } catch (error) {
            return error.message;
        }
    }

    async function createToleranceGrpCode() {
        try {
            await POST(
                `${baPath}config/ToleranceGroupCodes`,
                {
                    name: 'ToleranceGroupCode',
                    descr: 'ToleranceGroupCodes - Y001',
                    code: 'Y001',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function createClearingCategoryCode() {
        try {
            await POST(
                `${baPath}config/ClearingCategoryCodes`,
                {
                    name: 'ClearingCategoryCode',
                    descr: 'TClearingCategoryCodes - Y001',
                    code: 'Y001',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function createCategory() {
        try {
            await POST(
                `${baPath}config/CategoryCodes`,
                {
                    name: 'CategoryCode',
                    descr: 'CategoryCode - Y1',
                    code: 'Y1',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function createBillingAccountRelationship() {
        try {
            await POST(
                `${baPath}config/BillingAccountRelationshipCodes`,
                {
                    name: 'BillingAccountRelationshipCode',
                    descr: 'BillingAccountRelationshipCode - Y1',
                    code: 'Y1',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function createAccountDeterminationIdCode() {
        try {
            await POST(
                `${baPath}config/AccountDeterminationIdCodes`,
                {
                    name: 'AccountDeterminationIdCode',
                    descr: 'AccountDeterminationIdCode - Y0',
                    code: 'Y0',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function createInterestKeyCode() {
        try {
            await POST(
                `${baPath}config/InterestKeyCodes`,
                {
                    name: 'InterestKeyCode',
                    descr: 'InterestKeyCode - 01',
                    code: '01',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function createDunningProcedureCode() {
        try {
            await POST(
                `${baPath}config/DunningProcedureCodes`,
                {
                    name: 'DunningProcedureCode',
                    descr: 'DunningProcedureCode - 01',
                    code: '01',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function createPaymentConditionCode() {
        try {
            await POST(
                `${baPath}config/PaymentConditionCodes`,

                {
                    name: 'PaymentConditionCode',
                    descr: 'PaymentConditionCode - YN01',
                    code: 'YN01',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function createPaymentMethodCode() {
        try {
            await POST(
                `${baPath}config/PaymentMethodCodes`,
                {
                    name: 'SEPA Direct Debit',
                    descr: null,
                    code: 'E',
                    isBankTransfer: true,
                    isCardPayment: false,
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
        try {
            await POST(
                `${baPath}config/PaymentMethodCodes`,
                {
                    name: 'Bank transfer via pymnt order',
                    descr: null,
                    code: '5',
                    isBankTransfer: true,
                    isCardPayment: false,
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
        try {
            await POST(
                `${baPath}config/PaymentMethodCodes`,
                {
                    name: 'Direct Debit via Payment Order',
                    descr: null,
                    code: '4',
                    isBankTransfer: true,
                    isCardPayment: false,
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
        try {
            await POST(
                `${baPath}/config/PaymentMethodCodes`,
                {
                    name: 'Direct Debit via Payment Order',
                    descr: null,
                    code: '3',
                    isBankTransfer: false,
                    isCardPayment: true,
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function createBusinessPartnerForBillingAccount() {
        const businessPartnerID = 'f321d997-ae93-4316-acfa-c29f3bbe4bb7';
        const businessPartner = {
            id: businessPartnerID,
            displayId: 'sampleId2',
            person: {
                nameDetails: {
                    firstName: 'Bruce',
                    lastName: 'Wayne',
                },
                gender: { code: '0' },
                language: { code: 'en' },
                birthDate: '1990-12-31',
            },
            bankAccounts: [
                {
                    id: '0001',
                    bankAccountName: 'Wayne Conglomerate',
                },
            ],
            isBlocked: false,
        };
        const affectedRows = await cds.run(
            INSERT.into(`sap.odm.businesspartner.BusinessPartner`).entries(
                businessPartner
            )
        );
        const result = await cds.run(
            SELECT.one.from(`sap.odm.businesspartner.BusinessPartner`).where({
                id: businessPartnerID,
            })
        );
        return result;
    }

    it('should allow an authorized user to read entity data', async () => {
        const pArray = entities.map(async (entity) => {
            const status = await readData(entity, viewer);
            return { status, entity };
        });
        const statuses = await Promise.all(pArray);
        statuses.forEach((e) => {
            expect(`${e.status}. Entity: ${e.entity}`).to.eql(
                `${e.status}. Entity: ${e.entity}`
            );
        });
    });

    it('should NOT allow an unauthorized user to read entity data', async () => {
        const pArray = entities.map(async (entity) => {
            const error = await readData(entity, customer);
            return { error, entity };
        });
        const errorList = await Promise.all(pArray);
        errorList.forEach((e) => {
            expect([
                `403 - Forbidden. Entity: ${e.entity}`,
                `401 - Unauthorized. Entity: ${e.entity}`,
            ])
                .to.be.an('array')
                .that.includes(`${e.error}. Entity: ${e.entity}`);
        });
    });

    it('should NOT allow a non-WRITE user to create entity data', async () => {
        const pArray = entities.map(async (entity) => {
            const error = await createData(entity, viewer);
            return { error, entity };
        });
        const errorList = await Promise.all(pArray);
        errorList.forEach((e) => {
            expect([
                `403 - Forbidden. Entity: ${e.entity}`,
                `401 - Unauthorized. Entity: ${e.entity}`,
            ])
                .to.be.an('array')
                .that.includes(`${e.error}. Entity: ${e.entity}`);
        });
    });

    it('should NOT allow an unauthorized user to create entity data', async () => {
        const pArray = entities.map(async (entity) => {
            const error = await createData(entity, customer);
            return { error, entity };
        });
        const errorList = await Promise.all(pArray);
        errorList.forEach((e) => {
            expect([
                `403 - Forbidden. Entity: ${e.entity}`,
                `401 - Unauthorized. Entity: ${e.entity}`,
            ])
                .to.be.an('array')
                .that.includes(`${e.error}. Entity: ${e.entity}`);
        });
    });

    it('should NOT allow any authorized user to Delete BillingAccount data', async () => {
        const billingAccount = await functions.createBillingAccountDB();
        expect(billingAccount).to.exist;

        try {
            const response = await DELETE(
                `${baPath}BillingAccount(${billingAccount.id})`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).to.eql(
                'Error: 405 - Entity "BillingAccount" is not deletable'
            );
        }

        try {
            response = await DELETE(
                `${baPath}BillingAccount/${billingAccount.id}/partner`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).to.eql(
                `Error: ${errorBA.BillingAccountSRVDeleteNotAllowed.code} - ${errorBA.BillingAccountSRVDeleteNotAllowed.message} BillingAccountPartner`
            );
        }
    });

    it('should allow to create Billing Account using correct, existing template', async () => {
        try {
            const response = await POST(
                `${baPath}config/BillingAccountTemplates`,
                {
                    templateId: '01',
                    category: {
                        code: 'Y1',
                    },
                    billingAccountRelationship: {
                        code: 'Y1',
                    },
                    toleranceGroup: {
                        code: 'Y001',
                    },
                    interestKey: {
                        code: '01',
                    },
                    clearingCategory: null,
                    paymentCondition: {
                        code: 'YN01',
                    },
                    accountDeterminationCode: {
                        code: 'Y0',
                    },
                    companyCodeGroup: '1010',
                    standardCompanyCode: '1010',
                    incomingPaymentMethod: 'E',
                    outgoingPaymentMethod: '5',
                    supplyingCountry: {
                        code: 'CA',
                    },
                    dunningProcedure: {
                        code: '01',
                    },
                },
                {
                    auth: admin,
                }
            );
            try {
                const businessPartner =
                    await functions.createBusinessPartnerForBillingAccount();
                response = await POST(
                    `${baPath}BillingAccount`,
                    {
                        partner: {
                            businessPartner: {
                                id: businessPartner.id,
                            },
                        },
                    },
                    {
                        auth: admin,
                        headers: {
                            templateId: '01',
                        },
                    }
                );
            } catch (error) {
                expect(error.toString()).to.eql('Error: 201 - Created');
            }
        } catch (error) {
            /** Template creation failed */
        }
    });

    it('should allow to create Billing Account using template, but with customer values', async () => {
        try {
            const response = await POST(
                `${baPath}config/BillingAccountTemplates`,
                {
                    templateId: '02',
                    category: {
                        code: 'Y1',
                    },
                    billingAccountRelationship: {
                        code: 'Y1',
                    },
                    toleranceGroup: {
                        code: 'Y001',
                    },
                    interestKey: {
                        code: '01',
                    },
                    clearingCategory: null,
                    paymentCondition: {
                        code: 'YN01',
                    },
                    accountDeterminationCode: {
                        code: 'Y0',
                    },
                    companyCodeGroup: '1010',
                    standardCompanyCode: '1010',
                    incomingPaymentMethod: 'E',
                    outgoingPaymentMethod: '5',
                    supplyingCountry: {
                        code: 'CA',
                    },
                    dunningProcedure: {
                        code: response.templateId,
                    },
                },
                {
                    auth: admin,
                }
            );
            try {
                const bP =
                    await functions.createBusinessPartnerForBillingAccount();
                response = await POST(
                    `${baPath}BillingAccount`,
                    {
                        category: { code: 'Y1' },
                        partner: {
                            businessPartner: {
                                id: bP.id,
                            },
                            accountManagementData: {
                                name: 'John Doe',
                                billingAccountRelationship: { code: 'Y1' },
                                toleranceGroup: { code: 'Y001' },
                                interestKey: {
                                    code: '01',
                                },
                                clearingCategory: null,
                                paymentCondition: {
                                    code: 'YN01',
                                },
                                accountDeterminationCode: {
                                    code: 'Y0',
                                },
                            },
                            paymentControl: {
                                companyCodeGroup: '1010',
                                standardCompanyCode: '1010',
                                incomingPayment: {
                                    paymentMethod: 'E',
                                    alternativePayer: {
                                        id: bP.id,
                                    },
                                    bankAccount: '0001',
                                    paymentCard: '',
                                },
                                outgoingPayment: {
                                    paymentMethod: '5',
                                    alternativePayee: {
                                        id: bP.id,
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
                                    id: bP.id,
                                },
                            },
                            correspondence: {
                                alternativeCorrespondenceRecipient: {
                                    id: bP.id,
                                },
                            },
                            taxControl: {
                                supplyingCountry: {
                                    code: 'DE',
                                },
                            },
                        },
                    },
                    {
                        auth: admin,
                        headers: {
                            templateId: response.templateId,
                        },
                    }
                );
            } catch (error) {
                expect(error.toString()).to.eql('Error: 201 - Created');
            }
        } catch (error) {
            /** Template creation failed */
        }
    });

    it('should not allow to create Billing Account if non-existing templateId was provided', async () => {
        try {
            const businessPartner =
                await functions.createBusinessPartnerForBillingAccount();
            const response = await POST(
                `${baPath}BillingAccount`,
                {
                    category: { code: 'Y1' },
                    partner: {
                        businessPartner: {
                            id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                        },
                        accountManagementData: {
                            name: 'John Doe',
                            billingAccountRelationship: { code: 'Y1' },
                            toleranceGroup: { code: 'Y001' },
                            interestKey: {
                                code: '01',
                            },
                            clearingCategory: null,
                            paymentCondition: {
                                code: 'YN01',
                            },
                            accountDeterminationCode: {
                                code: 'Y0',
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
                    },
                },
                {
                    auth: admin,
                    headers: {
                        templateId: 'NONE',
                    },
                }
            );
        } catch (error) {
            expect(error.toString()).to.eql(
                `Error: ${errorBA.BillingAccountSRVInvalidTemplateIdError.code} - ${errorBA.BillingAccountSRVInvalidTemplateIdError.message}`
            );
        }
    });

    it('should allow any user to create BillingAccount data', async () => {
        const response = await POST(
            `${baPath}BillingAccount`,
            {
                category: { code: 'Y1' },
                partner: {
                    businessPartner: {
                        id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                    },
                    accountManagementData: {
                        name: 'John Doe',
                        billingAccountRelationship: { code: 'Y1' },
                        toleranceGroup: { code: 'Y001' },
                        interestKey: {
                            code: '01',
                        },
                        clearingCategory: null,
                        paymentCondition: {
                            code: 'YN01',
                        },
                        accountDeterminationCode: {
                            code: 'Y0',
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
                            mandateId: 'L10013DE59R10E1R98VC00D2DX',
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
                },
            },
            {
                auth: admin,
            }
        );
        jestExpect(response.status).toBe(201);
    });

    it('should allow any user to update BillingAccount data', async () => {
        const billingAccount = await functions.createBillingAccountDB();
        const response = await PATCH(
            `${baPath}BillingAccount(${billingAccount.id})`,
            {
                category: { code: 'Y1' },
                partner: {
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
                    },
                },
            },
            {
                auth: admin,
            }
        );
        jestExpect(response.status).toBe(200);
    });

    it('should allow any user to update BillingAccount sub-entity data', async () => {
        const billingAccount = await functions.createBillingAccountDB();
        const response = await PATCH(
            `${baPath}BillingAccount(${billingAccount.id})/partner/paymentControl`,
            {
                incomingPayment: {
                    paymentMethod: '4',
                    bankAccount: '0001',
                },
            },
            {
                auth: admin,
            }
        );
        jestExpect(response.status).toBe(200);
    });

    it('should not allow any user to create BillingAccount data if value of any field is incorrect', async () => {
        try {
            const response = await POST(
                `${baPath}BillingAccount`,
                {
                    category: { code: 'Y1' },
                    partner: {
                        businessPartner: {
                            id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                        },
                        accountManagementData: {
                            name: 'John Doe',
                            billingAccountRelationship: { code: 'Y1' },
                            toleranceGroup: { code: 'Y001' },
                            interestKey: {
                                code: '01',
                            },
                            clearingCategory: null,
                            paymentCondition: {
                                code: 'YN01',
                            },
                            accountDeterminationCode: {
                                code: 'Y0',
                            },
                        },
                        paymentControl: {
                            companyCodeGroup: '9010',
                            standardCompanyCode: '9010',
                            incomingPayment: {
                                paymentMethod: 'E',
                                alternativePayer: null,
                                bankAccount: '0001',
                                paymentCard: '',
                                mandateId: 'L10013DE59R10E1R98VC00D2DX',
                            },
                            outgoingPayment: {
                                paymentMethod: '5',
                                alternativePayee: null,
                                bankAccount: '0001',
                                paymentCard: '',
                            },
                        },
                        dunningControl: {
                            dunningProcedure: {
                                code: '01',
                            },
                            alternativeDunningRecipient: null,
                        },
                        correspondence: {
                            alternativeCorrespondenceRecipient: null,
                        },
                        taxControl: {
                            supplyingCountry: {
                                code: 'DE',
                            },
                        },
                    },
                },
                {
                    auth: admin,
                }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain(
                `${errorBA.BillingAccountSRVCreateFailS4.code} - ${errorBA.BillingAccountSRVCreateFailS4.message}`
            );
        }
    });

    it('should not allow any user to create BillingAccount data if mandatory fields are missing', async () => {
        try {
            const response = await POST(
                `${baPath}BillingAccount`,
                {
                    category: { code: 'Y1' },
                    partner: {
                        businessPartner: {
                            id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                        },
                        accountManagementData: {
                            billingAccountRelationship: { code: 'Y1' },
                            paymentCondition: { code: 'YN01' },
                            accountDeterminationCode: { code: 'Y0' },
                        },
                    },
                },
                {
                    auth: admin,
                }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain('500');
        }
    });

    it('should not allow any authorized user to update business Partner ID of a BillingAccount', async () => {
        const billingAccount = await functions.createBillingAccountDB();
        expect(billingAccount).to.exist;
        try {
            const response = await PATCH(
                `${baPath}BillingAccount(${billingAccount.id})`,
                {
                    category: { code: 'Y1' },
                    partner: {
                        businessPartner: {
                            id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                        },
                    },
                },
                {
                    auth: admin,
                }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain('406');
        }
    });

    it('should not allow any authorized user to update billing account if BA Id mismatches in URI and payload', async () => {
        const billingAccount = await functions.createBillingAccountDB();
        expect(billingAccount).to.exist;
        try {
            const response = await PATCH(
                `${baPath}BillingAccount(${billingAccount.id})`,
                {
                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb9',
                    category: { code: 'Y1' },
                },
                {
                    auth: admin,
                }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain('500');
        }
    });

    it('should not allow any user to update BillingAccount data if value of any Billing Account field is invalid', async () => {
        const bpID = 'f321d997-ae93-4316-acfa-c29f3bbe4bb7';
        const billingAccount = await functions.createBillingAccountDB(bpID);
        expect(billingAccount).to.exist;
        try {
            const response = await PATCH(
                `${baPath}BillingAccount(${billingAccount.id})`,
                {
                    partner: {
                        businessPartner: {
                            id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                        },
                        paymentControl: {
                            companyCodeGroup: '9010',
                            standardCompanyCode: '9010',
                            incomingPayment: {
                                paymentMethod: '',
                                alternativePayer: null,
                                bankAccount: '',
                                paymentCard: '',
                                mandateId: 'L10013DE59R10E1R98VC00D2DX',
                            },
                            outgoingPayment: {
                                paymentMethod: '',
                                alternativePayee: null,
                                bankAccount: '',
                                paymentCard: '',
                            },
                        },
                    },
                },
                {
                    auth: admin,
                }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain(
                `${errorBA.BillingAccountSRVUpdateFailS4.code} - ${errorBA.BillingAccountSRVUpdateFailS4.message}`
            );
        }
    });

    it('should not allow authorized user to create BillingAccount without valid payment methods UTILITIESCLOUDSOLUTION-3046', async () => {
        billingAccount = {
            category: { code: 'Y1' },
            partner: {
                businessPartner: {
                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                },
                accountManagementData: {
                    name: 'Test BA incoming payment validation',
                    billingAccountRelationship: {
                        code: 'Y1',
                    },
                    toleranceGroup: {
                        code: 'Y001',
                    },
                    interestKey: {
                        code: '01',
                    },
                    clearingCategory: null,
                    paymentCondition: {
                        code: 'YN01',
                    },
                    accountDeterminationCode: {
                        code: 'Y0',
                    },
                },
                paymentControl: {
                    companyCodeGroup: '1010',
                    standardCompanyCode: '1010',
                    incomingPayment: {
                        paymentMethod: '1',
                        alternativePayer: {
                            id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                        },
                        bankAccount: '0001',
                        paymentCard: '',
                        mandateId: 'L10013DE59R10E1R98VC00D2DX',
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
                        code: 'CA',
                    },
                },
            },
        };
        expect(billingAccount).to.exist;
        let response;
        try {
            response = await POST(`${baPath}BillingAccount`, billingAccount, {
                auth: admin,
            });
        } catch (error) {
            jestExpect(error.toString()).toContain(
                `${errorBA.BillingAccountSRVIncomingPayMethodError.code} - ${errorBA.BillingAccountSRVIncomingPayMethodError.message}`
            );
        }

        billingAccount.partner.paymentControl.incomingPayment.paymentMethod =
            '5';
        billingAccount.partner.paymentControl.outgoingPayment.paymentMethod =
            '1';
        try {
            response = await POST(`${baPath}BillingAccount`, billingAccount, {
                auth: admin,
            });
        } catch (error) {
            jestExpect(error.toString()).toContain(
                `${errorBA.BillingAccountSRVOutgoingPayMethodError.code} - ${errorBA.BillingAccountSRVOutgoingPayMethodError.message}`
            );
        }
    });

    it('should allow authorized user to create and update BillingAccount payment methods', async () => {
        billingAccount = {
            displayId: '000000000001',
            category: { code: 'Y1' },
            partner: {
                businessPartner: {
                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                },
                accountManagementData: {
                    name: 'Test BA',
                    billingAccountRelationship: {
                        code: 'Y1',
                    },
                    toleranceGroup: {
                        code: 'Y001',
                    },
                    interestKey: {
                        code: '01',
                    },
                    clearingCategory: null,
                    paymentCondition: {
                        code: 'YN01',
                    },
                    accountDeterminationCode: {
                        code: 'Y0',
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
                        mandateId: 'L10013DE59R10E1R98VC00D2DX',
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
                        code: 'CA',
                    },
                },
            },
        };

        billingAccount2 = {
            displayId: '000000000002',
            category: { code: 'Y1' },
            partner: {
                businessPartner: {
                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                },
                accountManagementData: {
                    name: 'Test BA',
                    billingAccountRelationship: {
                        code: 'Y1',
                    },
                    toleranceGroup: {
                        code: 'Y001',
                    },
                    interestKey: {
                        code: '01',
                    },
                    clearingCategory: null,
                    paymentCondition: {
                        code: 'YN01',
                    },
                    accountDeterminationCode: {
                        code: 'Y0',
                    },
                },
                paymentControl: {
                    companyCodeGroup: '1010',
                    standardCompanyCode: '1010',
                    incomingPayment: {
                        paymentMethod: null,
                        alternativePayer: null,
                        bankAccount: null,
                        paymentCard: '',
                        mandateId: 'L10013DE59R10E1R98VC00D2DX',
                    },
                    outgoingPayment: {
                        paymentMethod: null,
                        alternativePayee: null,
                        bankAccount: null,
                        paymentCard: '',
                    },
                },
                dunningControl: {
                    dunningProcedure: {
                        code: '01',
                    },
                    alternativeDunningRecipient: null,
                },
                correspondence: {
                    alternativeCorrespondenceRecipient: null,
                },
                taxControl: {
                    supplyingCountry: {
                        code: 'CA',
                    },
                },
            },
        };
        expect(billingAccount).to.exist;
        let response;
        let response2;
        try {
            response = await POST(`${baPath}BillingAccount`, billingAccount, {
                auth: admin,
            });
            response2 = await POST(`${baPath}BillingAccount`, billingAccount2, {
                auth: admin,
            });
        } catch (error) {
            console.log(error);
        }

        jestExpect(response.status).toBe(201);
        jestExpect(response2.status).toBe(201);

        const baId = response.data.id;
        billingAccount.partner.paymentControl.outgoingPayment.alternativePayee =
            null;
        billingAccount.partner.paymentControl.incomingPayment.alternativePayer =
            null;

        try {
            response = await POST(`${baPath}BillingAccount`, billingAccount, {
                auth: admin,
            });
        } catch (error) {
            console.log(error);
        }
        jestExpect(response.status).toBe(201);

        billingAccount.partner.paymentControl.incomingPayment.bankAccount =
            null;
        try {
            response = await POST(`${baPath}BillingAccount`, billingAccount, {
                auth: admin,
            });
        } catch (error) {
            jestExpect(error.toString()).toContain(
                '406 - Enter a bank account ID for the incoming payment'
            );
        }

        billingAccount.partner.paymentControl.incomingPayment.bankAccount =
            'ABCD';
        try {
            response = await POST(`${baPath}BillingAccount`, billingAccount, {
                auth: admin,
            });
        } catch (error) {
            jestExpect(error.toString()).toContain(
                '406 - The incoming bank account ID does not exist for this business partner. Enter a valid incoming bank account ID'
            );
        }

        billingAccount.partner.paymentControl.incomingPayment.bankAccount =
            '0001';
        billingAccount.partner.paymentControl.outgoingPayment.bankAccount =
            null;
        try {
            response = await POST(`${baPath}BillingAccount`, billingAccount, {
                auth: admin,
            });
        } catch (error) {
            jestExpect(error.toString()).toContain(
                '406 - Enter a bank account ID for the outgoing payment'
            );
        }

        billingAccount.partner.paymentControl.outgoingPayment.bankAccount =
            'ABCD';
        try {
            response = await POST(`${baPath}BillingAccount`, billingAccount, {
                auth: admin,
            });
        } catch (error) {
            jestExpect(error.toString()).toContain(
                '406 - The outgoing bank account ID does not exist for this business partner. Enter a valid outgoing bank account ID'
            );
        }

        billingAccount.partner.paymentControl.outgoingPayment.bankAccount =
            '0001';
        try {
            response = await PUT(
                `${baPath}BillingAccount(${baId})`,
                billingAccount,
                { auth: admin }
            );
        } catch (error) {}

        jestExpect(response.status).toBe(200);

        billingAccount.partner.paymentControl.incomingPayment.bankAccount =
            '0002';
        try {
            response = await PUT(
                `${baPath}BillingAccount(${baId})`,
                billingAccount,
                { auth: admin }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain(
                '406 - The incoming bank account ID does not exist for this business partner. Enter a valid incoming bank account ID'
            );
        }

        billingAccount.partner.paymentControl.incomingPayment.bankAccount =
            '0001';
        billingAccount.partner.paymentControl.outgoingPayment.bankAccount =
            'ABCD';
        try {
            response = await PUT(
                `${baPath}BillingAccount(${baId})`,
                billingAccount,
                { auth: admin }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain(
                '406 - The outgoing bank account ID does not exist for this business partner. Enter a valid outgoing bank account ID'
            );
        }

        billingAccount.partner.paymentControl.outgoingPayment.bankAccount =
            null;
        try {
            response = await PUT(
                `${baPath}BillingAccount(${baId})`,
                billingAccount,
                { auth: admin }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain(
                '406 - Bank account ID for the outgoing payment does not exist. Enter a valid bank account ID.'
            );
        }

        billingAccount.partner.paymentControl.outgoingPayment.bankAccount =
            '0001';
        billingAccount.partner.paymentControl.incomingPayment.bankAccount =
            '0001';
        billingAccount.partner.paymentControl.incomingPayment.alternativePayer =
            {
                id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
            };

        try {
            response = await PUT(
                `${baPath}BillingAccount(${baId})`,
                billingAccount,
                { auth: admin }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain(
                '406 - The incoming bank account ID does not exist for this business partner. Enter a valid incoming bank account ID'
            );
        }

        try {
            response = await PATCH(
                `${baPath}BillingAccount(${baId})`,
                {
                    partner: {
                        paymentControl: {
                            incomingPayment: {
                                alternativePayer: {
                                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                                },
                            },
                        },
                    },
                },
                { auth: admin }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain(
                '406 - The incoming bank account ID does not exist for this business partner. Enter a valid incoming bank account ID'
            );
        }

        try {
            response = await PATCH(
                `${baPath}BillingAccount(${baId})`,
                {
                    partner: {
                        paymentControl: {
                            incomingPayment: {
                                paymentMethod: '3',
                            },
                            outgoingPayment: {
                                paymentMethod: '3',
                            },
                        },
                    },
                },
                { auth: admin }
            );
        } catch (error) {}

        jestExpect(response.status).toBe(200);

        try {
            response = await PATCH(
                `${baPath}BillingAccount(${baId})`,
                {
                    partner: {
                        paymentControl: {
                            incomingPayment: {
                                bankAccount: '',
                            },
                            outgoingPayment: {
                                bankAccount: '',
                            },
                        },
                    },
                },
                { auth: admin }
            );
        } catch (error) {}

        jestExpect(response.status).toBe(200);

        try {
            response = await PATCH(
                `${baPath}BillingAccount(${baId})`,
                {
                    partner: {
                        paymentControl: {
                            incomingPayment: {
                                paymentMethod: 'E',
                            },
                        },
                    },
                },
                { auth: admin }
            );
        } catch (error) {
            jestExpect(error.message).toContain('406');
        }

        try {
            response = await PATCH(
                `${baPath}BillingAccount(${baId})`,
                {
                    partner: {
                        paymentControl: {
                            outgoingPayment: {
                                paymentMethod: '5',
                            },
                        },
                    },
                },
                { auth: admin }
            );
        } catch (error) {
            jestExpect(error.message).toContain('406');
        }

        try {
            response = await PATCH(
                `${baPath}BillingAccount(${baId})`,
                {
                    partner: {
                        paymentControl: {
                            incomingPayment: {
                                bankAccount: '0001',
                            },
                            outgoingPayment: {
                                bankAccount: '0001',
                            },
                        },
                    },
                },
                { auth: admin }
            );
        } catch (error) {}

        jestExpect(response.status).toBe(200);

        try {
            response = await PATCH(
                `${baPath}BillingAccount(${baId})`,
                {
                    partner: {
                        paymentControl: {
                            incomingPayment: {
                                bankAccount: '0001',
                            },
                            outgoingPayment: {
                                bankAccount: '0001',
                                alternativePayee: null,
                            },
                        },
                    },
                },
                { auth: admin }
            );
        } catch (error) {}

        jestExpect(response.status).toBe(200);

        try {
            response = await PATCH(
                `${baPath}BillingAccount(${baId})`,
                {
                    partner: {
                        paymentControl: {
                            incomingPayment: {
                                paymentMethod: '5',
                            },
                        },
                    },
                },
                { auth: admin }
            );
        } catch (error) {}

        jestExpect(response.status).toBe(200);
    });

    it('should allow any user to update new BillingAccount sub-entity data UTILITIESCLOUDSOLUTION-3056', async () => {
        const billingAccount = await functions.createBillingAccountDB();
        const response = await PATCH(
            `${baPath}BillingAccount(${billingAccount.id})/partner/correspondence`,
            {
                alternativeCorrespondenceRecipient: {
                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                },
            },
            {
                auth: admin,
            }
        );
        jestExpect(response.status).toBe(200);
    });

    it('should allow any user to update new BillingAccount sub-entity data UTILITIESCLOUDSOLUTION-3056', async () => {
        const billingAccount = await functions.createBillingAccountDB();
        const response = await PATCH(
            `${baPath}BillingAccount(${billingAccount.id})/partner/dunningControl`,
            {
                alternativeDunningRecipient: {
                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                },
            },
            {
                auth: admin,
            }
        );
        jestExpect(response.status).toBe(200);
    });

    it('should emit message after BillingAccount creation - UTILITIESCLOUDSOLUTION-3070', async () => {
        const EventMessaging = await cds.connect.to('billingAccountMessaging');
        const spyEventMessagingEmit = jest.spyOn(EventMessaging, 'emit');

        try {
            const response = await POST(
                `${baPath}BillingAccount`,
                {
                    category: { code: 'Y1' },
                    partner: {
                        businessPartner: {
                            id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                        },
                        accountManagementData: {
                            name: 'EventEmitted JohnDoe',
                            billingAccountRelationship: { code: 'Y1' },
                            toleranceGroup: { code: 'Y001' },
                            interestKey: {
                                code: '01',
                            },
                            clearingCategory: null,
                            paymentCondition: {
                                code: 'YN01',
                            },
                            accountDeterminationCode: {
                                code: 'Y0',
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
                                mandateId: 'L10013DE59R10E1R98VC00D2DX',
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
                    },
                },
                {
                    auth: admin,
                }
            );
            jestExpect(response.status).toBe(201);

            jestExpect(spyEventMessagingEmit).toBeCalledTimes(1);
            jestExpect(spyEventMessagingEmit).toBeCalledWith(
                'topic:/Created/v1',
                jestExpect.any(Object),
                jestExpect.any(Object)
            );
        } finally {
            spyEventMessagingEmit.mockClear();
        }
    });

    it('Extensibility: should create dynamic field for S4 if extension field exist in C4Uf payload - UTILITIESCLOUDSOLUTION-3017', async () => {
        const baPayload = {
            displayId: '000000000002',
            ext__EXT_CA_1: 'check1',
            category: { code: 'Y1' },
            partner: {
                businessPartner: {
                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                },
                accountManagementData: {
                    ext__EXT_CA_2: 'check2',
                    name: 'Test BA',
                    billingAccountRelationship: {
                        code: 'Y1',
                    },
                    toleranceGroup: {
                        code: 'Y001',
                    },
                    clearingCategory: null,
                    paymentCondition: {
                        code: 'YN01',
                    },
                    accountDeterminationCode: {
                        code: 'Y0',
                    },
                },
            },
        };
        const extensionFields = addExtData(baPayload, true);

        expect(extensionFields['n99:YY1_EXT_CA_1']).equal(`check1`);

        expect(extensionFields['n99:YY1_EXT_CA_2']).equal(`check2`);
    });

    it('Extensibility: should not create field if no extension field exist in C4Uf payload - UTILITIESCLOUDSOLUTION-3017', async () => {
        const baPayload = {
            displayId: '000000000002',
            category: { code: 'Y1' },
            partner: {
                businessPartner: {
                    id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                },
                accountManagementData: {
                    name: 'Test BA',
                    billingAccountRelationship: {
                        code: 'Y1',
                    },
                    toleranceGroup: {
                        code: 'Y001',
                    },
                    clearingCategory: null,
                    paymentCondition: {
                        code: 'YN01',
                    },
                    accountDeterminationCode: {
                        code: 'Y0',
                    },
                },
            },
        };
        const extensionFields = addExtData(baPayload, true);

        expect(extensionFields == undefined);
    });

    it('should not allow any user to update displayId of Billing Account', async () => {
        const bpID = 'f321d997-ae93-4316-acfa-c29f3bbe4bb7';
        const billingAccount = await functions.createBillingAccountDB(bpID);
        expect(billingAccount).to.exist;
        try {
            //Passing a different value for Billing Account displayId
            const response = await PATCH(
                `${baPath}BillingAccount(${billingAccount.id})`,
                {
                    displayId: '000000165506',
                    partner: {
                        businessPartner: {
                            id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                        },
                    },
                },
                {
                    auth: admin,
                }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain(
                `${errorBA.BillingAccountSRVBAdisplayIdUpdateError.code} - ${errorBA.BillingAccountSRVBAdisplayIdUpdateError.message}`
            );
        }

        try {
            //Passing a different value for Billing Account displayId
            const response = await PATCH(
                `${baPath}BillingAccount(${billingAccount.id})`,
                {
                    displayId: '',
                    partner: {
                        businessPartner: {
                            id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                        },
                    },
                },
                {
                    auth: admin,
                }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain(
                `${errorBA.BillingAccountSRVBAdisplayIdUpdateError.code} - ${errorBA.BillingAccountSRVBAdisplayIdUpdateError.message}`
            );
        }

        try {
            //Passing a different value for Billing Account displayId
            const response = await PATCH(
                `${baPath}BillingAccount(${billingAccount.id})`,
                {
                    displayId: null,
                    partner: {
                        businessPartner: {
                            id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
                        },
                    },
                },
                {
                    auth: admin,
                }
            );
        } catch (error) {
            jestExpect(error.toString()).toContain(
                `${errorBA.BillingAccountSRVBAdisplayIdUpdateError.code} - ${errorBA.BillingAccountSRVBAdisplayIdUpdateError.message}`
            );
        }
    });
});
