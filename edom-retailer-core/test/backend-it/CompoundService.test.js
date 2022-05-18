const expect = require('expect');
const { launchServer } = require('../lib/testkit');
const { createBusinessPartnerDB } = require('../lib/functions');
const {
    commonSetupConfigCodes,
    bpSetupConfigCodes,
} = require('./payload/BusinessPartnerSetupRequiredCodes');
const {
    createConfigurationDataSet,
} = require('./payload/ConfigurationDataHelper');

const billingAccountSrv = require('../../srv/api/billingaccount/BillingAccountService');
const sepaMandateSrv = require('../../srv/beta/sepamandate/SEPAMandateServiceBeta');
jest.mock('../../srv/api/billingaccount/BillingAccountService');
jest.mock('../../srv/beta/sepamandate/SEPAMandateServiceBeta');

const compoundServiceApi = `/api/beta/SalesCompound/v1`;
const businessPartnerConfigApi = `/api/businessPartner/v1/config`;
const commonConfigApi = `/api/config/v1`;
const baPath = '/api/billingAccount/v1/';

const bpId = 'f321d997-ae93-4316-acfa-c29f3bbe4bb7';
const bpIdInvalid = 'f321d997-ae93-4316-acfa-c29f3bbe4cc8';

const sampleBpPayload = {
    id: bpId,
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
const sampleBaPayload = {
    category: {
        code: 'Y1',
    },
    partner: {
        businessPartner: bpId,
        accountManagementData: {
            name: 'Contract Account Test-123',
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
                paymentCard: null,
                mandateId: null,
            },
            outgoingPayment: {
                paymentMethod: null,
                alternativePayee: null,
                bankAccount: null,
                paymentCard: null,
            },
        },
        taxControl: {
            supplyingCountry: {
                code: 'DE',
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
    },
};

const sampleBaUpdPayload = {
    partner: {
        accountManagementData: {
            name: 'UPDATED NAME',
        },
    },
};

const sampleBaUpdInvalidPayload = {
    partner: {
        accountManagementData: {
            name: 'UPDATED NAME',
        },
        dunningControl: {
            dunningProcedure: {
                code: '09',
            },
            alternativeDunningRecipient: null,
        },
    },
};

const sampleSepaPayload = {
    sepaMandate: {
        mandateId: '000000000013',
        companyCode: '1010',
    },
    paymentOccurenceType: {
        code: '1',
    },
    businessPartner: {
        Id: bpId,
    },
    IBAN: 'DE46230300000001990033',
    signatureDate: '2022-01-04',
    status: {
        code: '1',
    },
};

const sampleBaPayloadInvalid = {
    category: {
        code: 'Y1',
    },
    partner: {
        businessPartner: bpIdInvalid,
        accountManagementData: {
            name: 'Contract Account Test-123',
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
                paymentCard: null,
                mandateId: null,
            },
            outgoingPayment: {
                paymentMethod: null,
                alternativePayee: null,
                bankAccount: null,
                paymentCard: null,
            },
        },
        taxControl: {
            supplyingCountry: {
                code: 'DE',
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
    },
};

const sampleSepaPayloadInvalid = {
    sepaMandate: {
        mandateId: '000000000013',
        companyCode: '1010',
    },
    paymentOccurenceType: {
        code: '1',
    },
    businessPartner: {
        Id: bpIdInvalid,
    },
    IBAN: 'DE46230300000001990033',
    signatureDate: '2022-01-04',
    status: {
        code: '1',
    },
};

const sampleCompPayload = {
    billingAccount: {
        ...sampleBaPayload,
        sepaMandate: {
            ...sampleSepaPayload,
        },
    },
};

const sampleCompPayloadInvalid = {
    billingAccount: {
        ...sampleBaPayloadInvalid,
        sepaMandate: {
            ...sampleSepaPayloadInvalid,
        },
    },
};

const sampleCompPayloadOnlyBA = {
    billingAccount: {
        ...sampleBaPayload,
    },
};

const sampleCompPayloadUpdBACreateSEPA = {
    billingAccount: {
        ...sampleBaUpdPayload,
        sepaMandate: {
            ...sampleSepaPayload,
        },
    },
};

describe('CompoundService it-test', () => {
    const { GET, POST, PATCH, DELETE, admin, user, viewer } = launchServer({
        service: {
            paths: ['srv'],
        },
    });

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
        // common config codes
        await createConfigurationDataSet(admin, POST);

        // setup BP config codes
        await commonSetupConfigCodes(POST, commonConfigApi, admin);
        await bpSetupConfigCodes(POST, businessPartnerConfigApi, admin);

        // setup BA config codes
        await createBillingAccountRelationship();
        await createCategory();
        await createToleranceGrpCode();
        await createClearingCategoryCode();
        await createPaymentConditionCode();
        await createInterestKeyCode();
        await createAccountDeterminationIdCode();
        await createDunningProcedureCode();
        await createPaymentMethodCode();
        await createCountryCode();

        const bpCreated = await createBusinessPartnerDB(sampleBpPayload);
    });
    billingAccountSrv.mockImplementation(async (srv) => {});
    sepaMandateSrv.mockImplementation(async (srv) => {
        srv.on('CREATE', 'SEPAMandate', async (req) => {
            const bpId = req.data.businessPartner.Id_id;
            const tx = cds.tx(req);
            try {
                const result = await tx.run(
                    SELECT.one
                        .from(`sap.odm.businesspartner.BusinessPartner`)
                        .where({
                            id: bpId,
                        })
                );
                tx.commit();
                if (result) {
                    return req.data;
                }
            } catch (err) {
                tx.rollback();
                return req.reject(400, err.message);
            }
            return null;
        });
    });
    beforeEach(() => {});
    afterAll(() => {});
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should CREATE billing account and sepa mandate and update billing account with sepa mandate id', async () => {
        const { status, data } = await POST(
            `${compoundServiceApi}/SalesCompound`,
            sampleCompPayload,
            {
                auth: admin,
            }
        );

        const baId = data?.billingAccount?.id;
        const baMandateId =
            data?.billingAccount?.partner?.paymentControl?.incomingPayment
                ?.mandateId;
        const sepaMandateId =
            data?.billingAccount?.sepaMandate?.sepaMandate?.mandateId;
        const sepaCompanyCode =
            data?.billingAccount?.sepaMandate?.sepaMandate?.companyCode;

        expect(status).toBe(201);
        expect(baId).toBeTruthy();
        expect(sepaMandateId).toBeTruthy();
        expect(sepaCompanyCode).toBeTruthy();
        expect(baMandateId).toBe(sepaMandateId);
    });

    it.todo(
        'should CREATE billing account and sepa mandate and fail to update billing account with sepa mandate id'
    );

    it('should CREATE billing account and fail to CREATE sepa mandate', async () => {
        const { status, data } = await POST(
            `${compoundServiceApi}/SalesCompound`,
            {
                billingAccount: {
                    ...sampleBaPayload,
                    sepaMandate: {
                        ...sampleSepaPayloadInvalid,
                    },
                },
            },
            {
                auth: admin,
            }
        );

        const baId = data?.billingAccount?.id;
        const baMandateId =
            data?.billingAccount?.partner?.paymentControl?.incomingPayment
                ?.mandateId;
        const sepaMandateId =
            data?.billingAccount?.sepaMandate?.sepaMandate?.mandateId;
        const sepaCompanyCode =
            data?.billingAccount?.sepaMandate?.sepaMandate?.companyCode;

        expect(status).toBe(201);
        expect(baId).toBeTruthy();
        expect(sepaMandateId).toBeFalsy();
        expect(sepaCompanyCode).toBeFalsy();
        expect(data.message).toMatch(
            `Billing Account was successfully created but SEPA failed`
        );
    });

    it('should fail to CREATE billing account', async () => {
        await expect(async () => {
            await POST(
                `${compoundServiceApi}/SalesCompound`,
                sampleCompPayloadInvalid,
                {
                    auth: admin,
                }
            );
        }).rejects.toThrowError('406 - Processing failed. Please retry.');
    });

    it('should CREATE sepa, also UPDATE fields of existing billing account', async () => {
        const { status, data } = await POST(
            `${compoundServiceApi}/SalesCompound`,
            sampleCompPayloadOnlyBA,
            {
                auth: admin,
            }
        );

        const baId = data?.billingAccount?.id;
        expect(status).toBe(201);
        expect(baId).toBeTruthy();

        const response = await POST(
            `${compoundServiceApi}/SalesCompound`,
            {
                billingAccount: {
                    ...sampleBaUpdPayload,
                    id: baId,
                    sepaMandate: {
                        ...sampleSepaPayload,
                    },
                },
            },
            {
                auth: admin,
            }
        );
        const statusUpd = response.status;
        const dataUpd = response.data;
        const baIdUpd = dataUpd?.billingAccount?.id;
        expect(statusUpd).toBe(201);
        expect(baIdUpd).toBeTruthy();
        const baMandateId =
            dataUpd?.billingAccount?.partner?.paymentControl?.incomingPayment
                ?.mandateId;
        const sepaMandateId =
            dataUpd?.billingAccount?.sepaMandate?.sepaMandate?.mandateId;
        const sepaCompanyCode =
            dataUpd?.billingAccount?.sepaMandate?.sepaMandate?.companyCode;

        expect(sepaMandateId).toBeTruthy();
        expect(sepaCompanyCode).toBeTruthy();
        expect(baMandateId).toBe(sepaMandateId);
    });

    it('should CREATE sepa, but fail UPDATE of existing billing account', async () => {
        const { status, data } = await POST(
            `${compoundServiceApi}/SalesCompound`,
            sampleCompPayloadOnlyBA,
            {
                auth: admin,
            }
        );

        const baId = data?.billingAccount?.id;
        expect(status).toBe(201);
        expect(baId).toBeTruthy();

        const response = await POST(
            `${compoundServiceApi}/SalesCompound`,
            {
                billingAccount: {
                    ...sampleBaUpdInvalidPayload,
                    id: baId,
                    sepaMandate: {
                        ...sampleSepaPayload,
                    },
                },
            },
            {
                auth: admin,
            }
        );
        const statusUpd = response.status;
        const dataUpd = response.data;
        const baIdUpd = dataUpd?.billingAccount?.id;
        expect(statusUpd).toBe(201);
        expect(baIdUpd).toBeTruthy();
        const baMandateId =
            dataUpd?.billingAccount?.partner?.paymentControl?.incomingPayment
                ?.mandateId;
        const sepaMandateId =
            dataUpd?.billingAccount?.sepaMandate?.sepaMandate?.mandateId;
        const sepaCompanyCode =
            dataUpd?.billingAccount?.sepaMandate?.sepaMandate?.companyCode;

        expect(sepaMandateId).toBeTruthy();
        expect(sepaCompanyCode).toBeTruthy();
        expect(baMandateId).toBe(null);
    });
});
