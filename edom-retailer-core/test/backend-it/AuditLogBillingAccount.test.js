const cds = require('@sap/cds');
const { expect, launchServer, pause } = require('../lib/testkit');
const jestExpect = require('expect');
const logger = require('cf-nodejs-logging-support');
const SoapClient = require('../../srv/external/SoapClient');
const API_BP_KEY_MAPPING = require('../../srv/external/API_BP_KEY_MAPPING');
const { s4BACreateResponse } = require('./payload/BA_MOCK_S4_RESPONSE');
const { s4BAUpdateResponse } = require('./payload/BA_MOCK_S4_RESPONSE');
const { s4Response } = require('./payload/BA_MOCK_S4_RESPONSE');
const functions = require('../lib/functions');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
const baPath = '/api/billingAccount/v1/';

jest.mock('../../srv/external/SoapClient');
jest.mock('../../srv/external/API_BP_KEY_MAPPING');
// enabling mock feature flags
cds.env.requires.featureFlags = {
    impl: 'test/backend-it/external/FeatureFlagsTestService',
};
const config = {
    VCAP_SERVICES: {
        auditlog: [
            {
                name: 'edom-retailer-audit',
                instance_name: 'edom-retailer-audit',
                label: 'auditlog',
                tags: ['auditlog'],
                credentials: {
                    logToConsole: true,
                },
            },
        ],
    },
    service: {
        paths: ['srv/api', 'srv/api/billingaccount', 'srv/api/businesspartner'],
    },
};
const { POST, GET, PUT, PATCH, admin } = launchServer(config);

global.cds.env.features.assert_integrity = false;

describe('AuditlogBillingAccount it-test', () => {
    let baId;
    let bpId;

    setTestDestination({
        name: 'mdi-bp-keymap',
        url: 'https://mdi-test-key-mapping.com',
    });
    let entities = [];
    beforeAll(async () => {
        // manually change feature flag return value
        const featureFlags = await cds.connect.to('featureFlags');
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('BillingAccountService')
        ).filter(
            (value) => !value['@cds.autoexposed'] && !value.elements['up_']
        );

        Array.from(serviceEntities).forEach((element) => {
            const { name } = element;
            entities.push(name.substring(name.indexOf('.') + 1, name.length));
        });
        API_BP_KEY_MAPPING.mockImplementation(() => {
            return {
                getBPKeyMappingByBpUUIDBeta: async (req, businessSystem) => {
                    const bps4DisplayId = '9980017151';
                    const alternativePayee = '9980017151';
                    const alternativePayer = '9980017151';
                    const alternativeDunningRecipient = '9980017151';
                    const alternativeCorrespondenceRecipient = '9980017151';
                    return [
                        bps4DisplayId,
                        alternativePayee,
                        alternativePayer,
                        alternativeDunningRecipient,
                        alternativeCorrespondenceRecipient,
                    ];
                },
                getBPKeyMappingByBpUUID: async (req, businessSystem) => {
                    const bps4DisplayId = '9980017151';
                    const alternativePayee = '9980017151';
                    const alternativePayer = '9980017151';
                    const alternativeDunningRecipient = '9980017151';
                    const alternativeCorrespondenceRecipient = '9980017151';
                    return [
                        bps4DisplayId,
                        alternativePayee,
                        alternativePayer,
                        alternativeDunningRecipient,
                        alternativeCorrespondenceRecipient,
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
                    if ('ContractAccountUpdateRequest' in args) {
                        return {
                            billingAccount: s4BAUpdateResponse,
                            resStatus: '3',
                        };
                    } else if (
                        'ContractAccountSelectionByIdentifyingElements' in args
                    ) {
                        return { billingAccObjects: s4Response, status: '3' };
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
    });

    async function createToleranceGrpCode() {
        try {
            await POST(
                `${baPath}config/ToleranceGroupCodes`,
                {
                    name: 'ToleranceGroupCode',
                    descr: 'ToleranceGroupCodes -1',
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
                    descr: 'CategoryCode -1',
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
                    descr: 'BillingAccountRelationshipCode -1',
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
                    descr: 'AccountDeterminationIdCode -1',
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
    }

    async function createCountryCode() {
        try {
            await POST(
                `/api/v1/CountryCodes`,
                {
                    name: 'Germany',
                    descr: 'Germany',
                    code: 'DE',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    beforeAll(async () => {
        let lv_displayId;
        let lv_incomingPaymentBankAccountId;
        let lv_outgoingPaymentBankAccountId;
        let lv_incomingPaymentPaymentCard;
        let lv_outgoingPaymentPaymentCard;
        let lv_name;

        const businessPartnerDataPayload =
            await createBusinessPartnerForBillingAccount();
        bpId = 'f321d997-ae93-4316-acfa-c29f3bbe4bb7'; //data.id;

        const categoryCodes = {
            name: 'New Category Code',
            descr: 'Test',
            code: '01',
        };

        try {
            var { status } = await POST(
                `${baPath}config/CategoryCodes`,
                categoryCodes,
                { auth: admin }
            );
        } catch (error) {
            logger.error(`[AuditlogTest] ${error.message}`);
        }

        expect(status).to.eql(201, 400); // Created or already existing

        await createToleranceGrpCode();
        await createCategory();
        await createBillingAccountRelationship();
        await createAccountDeterminationIdCode();
        await createInterestKeyCode();
        await createDunningProcedureCode();
        await createPaymentConditionCode();
        await createPaymentMethodCode();
        await createCountryCode();
    });

    /* --------------Create Audit Logging-------------- */

    /* --------------Create Billing Account------------ */

    it('should log for Audit -> CREATE BillingAccount ', async () => {
        const log = jest.fn();
        global.console.log = log;
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
            },
            {
                auth: admin,
            }
        );

        jestExpect(response.status).toBe(201);

        expect(response).to.exist;
        baId = response.data.id;

        logger.error(log.mock.calls[1][0]);
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.object.type).to.eql(
            'BillingAccountService.BillingAccount'
        );

        expect(auditLogMessage.attributes.length).to.eql(10);

        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].new).to.eql(baId);

        expect(auditLogMessage.attributes[1].name).to.eql('displayId');
        expect(auditLogMessage.attributes[1].new).to.eql('000000000001');

        expect(auditLogMessage.attributes[2].name).to.eql(
            'partner.businessPartner_id'
        );
        expect(auditLogMessage.attributes[2].new).to.eql(
            'f321d997-ae93-4316-acfa-c29f3bbe4bb7'
        );

        expect(auditLogMessage.attributes[5].name).to.eql(
            'partner.paymentControl.incomingPayment.mandateId'
        );
        expect(auditLogMessage.attributes[5].new).to.eql(
            'L10013DE59R10E1R98VC00D2DX'
        );

        expect(auditLogMessage.attributes[8].name).to.eql(
            'partner.dunningControl.alternativeDunningRecipient_id'
        );
        expect(auditLogMessage.attributes[8].new).to.eql(
            'f321d997-ae93-4316-acfa-c29f3bbe4bb7'
        );

        expect(auditLogMessage.attributes[9].name).to.eql(
            'partner.correspondence.alternativeCorrespondenceRecipient_id'
        );
        expect(auditLogMessage.attributes[9].new).to.eql(
            'f321d997-ae93-4316-acfa-c29f3bbe4bb7'
        );
    });

    it('should log for Audit -> UPDATE BillingAccount ', async () => {
        const log = jest.fn();
        global.console.log = log;

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
                        interestKey: {
                            code: '01',
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
                },
            },
            {
                auth: admin,
            }
        );
        jestExpect(response.status).toBe(200);
        logger.error(log.mock.calls[1][0]);
        const auditLogMessage = log.mock.calls[1][0];

        expect(auditLogMessage.attributes[0].name).to.eql('id');
        expect(auditLogMessage.attributes[0].new).to.eql(response.data.id);

        expect(auditLogMessage.attributes[1].name).to.eql(
            'partner.accountManagementData.name'
        );
        expect(auditLogMessage.attributes[1].new).to.eql('John Doe');

        expect(auditLogMessage.attributes[2].name).to.eql(
            'partner.dunningControl.alternativeDunningRecipient_id'
        );
        expect(auditLogMessage.attributes[2].new).to.eql(
            'f321d997-ae93-4316-acfa-c29f3bbe4bb7'
        );

        expect(auditLogMessage.attributes[3].name).to.eql(
            'partner.correspondence.alternativeCorrespondenceRecipient_id'
        );
        expect(auditLogMessage.attributes[3].new).to.eql(
            'f321d997-ae93-4316-acfa-c29f3bbe4bb7'
        );
    });
});
