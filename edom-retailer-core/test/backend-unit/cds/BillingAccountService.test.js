const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the exposed entity of BillingAccountService according to the specification provided in #713
 */

describe('BillingAccountService CDS test UTILITIESCLOUDSOLUTION-2920', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should contain all specified entities', () => {
        expect('BillingAccountService').to.have.entities(['BillingAccount']);
    });

    it('should contain @restrict annotation for all entities', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('BillingAccountService')
        ).filter((value) => !value['@cds.autoexposed']);

        Array.from(serviceEntities).forEach((entity) => {
            expect(
                entity['@restrict'],
                `Expected ${entity.name} to have @restrict annotation defined`
            ).to.exist;
        });
    });

    it('should contain all defined attributes of BillingAccount', () => {
        expect('BillingAccountService.BillingAccount').to.have.attributes([
            'displayId',
            'category',
            'partner',
            'isBlocked',
        ]);
    });

    it('should contain all defined attributes of BillingAccountPartner', () => {
        expect(
            'BillingAccountService.BillingAccountPartner'
        ).to.have.attributes([
            'businessPartner',
            'accountManagementData',
            'paymentControl',
            'taxControl',
            'dunningControl',
            'correspondence',
            'isBlocked',
        ]);
    });

    it('should contain all defined attributes of AccountManagementData UTILITIESCLOUDSOLUTION-3055', () => {
        expect(
            'BillingAccountService.AccountManagementData'
        ).to.have.attributes([
            'billingAccountRelationship',
            'toleranceGroup',
            'clearingCategory',
            'paymentCondition',
            'accountDeterminationCode',
            'interestKey',
            'isBlocked',
        ]);
    });

    it('should contain all defined attributes of PaymentControl', () => {
        expect('BillingAccountService.PaymentControl').to.have.attributes([
            'companyCodeGroup',
            'standardCompanyCode',
            'incomingPayment',
            'outgoingPayment',
            'isBlocked',
        ]);
    });

    it('should contain all defined attributes of TaxControl', () => {
        expect('BillingAccountService.TaxControl').to.have.attributes([
            'supplyingCountry',
            'isBlocked',
        ]);
    });

    it('should contain all defined attributes of IncomingPayment', () => {
        expect('BillingAccountService.IncomingPayment').to.have.attributes([
            'paymentMethod',
            'alternativePayer',
            'bankAccount',
            'paymentCard',
            'isBlocked',
        ]);
    });

    it('should contain all defined attributes of OutgoingPayment', () => {
        expect('BillingAccountService.OutgoingPayment').to.have.attributes([
            'paymentMethod',
            'alternativePayee',
            'bankAccount',
            'paymentCard',
            'isBlocked',
        ]);
    });

    it('should contain all defined attributes of DunningControl', () => {
        expect('BillingAccountService.DunningControl').to.have.attributes([
            'dunningProcedure',
            'alternativeDunningRecipient',
            'isBlocked',
        ]);
    });

    it('should contain all defined attributes of CorrespondenceToOtherPartners', () => {
        expect(
            'BillingAccountService.CorrespondenceToOtherPartners'
        ).to.have.attributes([
            'alternativeCorrespondenceRecipient',
            'isBlocked',
        ]);
    });
});
