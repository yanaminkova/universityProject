const cds = require('@sap/cds');
const { expect, launchServer } = require('../lib/testkit');

const {
    createConfigurationDataSet,
} = require('./payload/ConfigurationDataHelper');

const baConfigPath = '/api/billingAccount/v1/config/';

describe('BillingAccountConfigService it-test UTILITIESCLOUDSOLUTION-2920', () => {
    const { GET, POST, PUT, DELETE, admin, user, viewer } = launchServer({
        service: {
            paths: [
                'srv/api/billingaccount',
                'srv/api/CommonConfigurationService',
            ],
        },
    });

    let entities = [];

    const customer = {
        username: 'customer',
        password: 'customer',
    };

    before(async () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('BillingAccountConfigService')
        ).filter((value) => !value['@cds.autoexposed']);

        // setup configuration data
        await createConfigurationDataSet(admin, POST);

        Array.from(serviceEntities).forEach((element) => {
            const { name } = element;
            entities.push(name.substring(name.indexOf('.') + 1, name.length));
        });
    });

    async function readData(entity, user) {
        try {
            await GET(`${baConfigPath}${entity}`, {
                auth: user,
            });
        } catch (error) {
            return error.message;
        }
    }

    async function createData(entity, user) {
        try {
            await POST(`${baConfigPath}${entity}`, {}, { auth: user });
        } catch (error) {
            return error.message;
        }
    }

    async function createToleranceGrpCode() {
        try {
            await POST(
                `${baConfigPath}ToleranceGroupCodes`,
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
                `${baConfigPath}ClearingCategoryCodes`,
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
                `${baConfigPath}CategoryCodes`,
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

    async function createInterestKey() {
        try {
            await POST(
                `${baConfigPath}InterestKeyCodes`,
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

    async function createBillingAccountRelationship() {
        try {
            await POST(
                `${baConfigPath}BillingAccountRelationshipCodes`,
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
                `${baConfigPath}AccountDeterminationIdCodes`,
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

    async function createDunningProcedureCode() {
        try {
            await POST(
                `${baConfigPath}DunningProcedureCodes`,
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
                `${baConfigPath}PaymentConditionCodes`,

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

    it(`should allow authorized user to create entry for Template`, async () => {
        await createBillingAccountRelationship();
        await createToleranceGrpCode();
        await createClearingCategoryCode();
        await createCategory();
        await createInterestKey();
        await createPaymentConditionCode();
        await createAccountDeterminationIdCode();
        await createDunningProcedureCode();
        try {
            const response = await POST(
                `${baConfigPath}BillingAccountTemplates`,
                {
                    templateId: 'T108',
                    category: {
                        code: 'Y1',
                    },
                    billingAccountRelationship: {
                        code: 'Y1',
                    },
                    toleranceGroup: {
                        code: 'Y001',
                    },
                    clearingCategory: {
                        code: 'Y001',
                    },
                    interestKey: {
                        code: '01',
                    },
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
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).to.eql('Error: 201 - Created');
        }
    });

    it(`should allow authorized user to read entry for Template`, async () => {
        try {
            const response = await GET(
                `${baConfigPath}BillingAccountTemplates('T108')`,
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).to.eql('Error: 200 - OK');
        }
    });

    it(`should allow authorized user to update entry for Template`, async () => {
        await createBillingAccountRelationship();
        await createToleranceGrpCode();
        await createClearingCategoryCode();
        await createCategory();
        await createInterestKey();
        await createPaymentConditionCode();
        await createAccountDeterminationIdCode();
        await createDunningProcedureCode();
        try {
            const response = await PUT(
                `${baConfigPath}BillingAccountTemplates('T108')`,
                {
                    templateId: 'T108',
                    category: {
                        code: 'Y1',
                    },
                    billingAccountRelationship: {
                        code: 'Y1',
                    },
                    toleranceGroup: {
                        code: 'Y001',
                    },
                    clearingCategory: {
                        code: 'Y001',
                    },
                    interestKey: {
                        code: '01',
                    },
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
                        code: 'DE',
                    },
                    dunningProcedure: {
                        code: '01',
                    },
                },
                { auth: admin }
            );
        } catch (error) {
            expect(error.toString()).to.eql('Error: 200 - OK');
        }
    });

    it(`should NOT allow unauthorized user to delete entry for Template`, async () => {
        try {
            const response = await DELETE(
                `${baConfigPath}BillingAccountTemplates('T108')`,
                { auth: viewer }
            );
        } catch (error) {
            expect(error.toString()).to.contain('403');
        }
    });
});
