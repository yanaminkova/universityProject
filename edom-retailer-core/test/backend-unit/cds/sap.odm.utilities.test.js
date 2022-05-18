const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the customer order extensions provided for the utilities domain
 */
describe('sap.odm.utilities', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../db'));
    });

    it('should contain all defined attributes extensions for CustomerOrderItem', () => {
        expect('sap.odm.sales.CustomerOrder.items').to.have.attributes([
            'subscriptionAspect',
            'utilitiesAspect',
        ]);
    });

    it('should contain all defined attributes extensions for CustomerOrderPartner', () => {
        expect('sap.odm.sales.CustomerOrder.partners').to.have.attributes([
            'contractAccountId',
            'businessPartnerId',
        ]);
    });

    it('should contain all defined attributes for CustomerOrderItemUtilitiesAspect', () => {
        expect(
            'sap.odm.sales.CustomerOrder.items.utilitiesAspect'
        ).to.have.attributes([
            'formerServiceProvider',
            'referenceObject',
            'subsequentDocument',
        ]);
    });

    it('should contain all defined attributes for CustomerOrderItemUtilitiesReferenceObject', () => {
        expect(
            'sap.odm.sales.CustomerOrder.items.utilitiesAspect.referenceObject'
        ).to.have.attributes(['meter', 'installation']);
    });

    it('should contain all defined attributes for CustomerOrderItemUtilitiesSubsequentDocument', () => {
        expect(
            'sap.odm.sales.CustomerOrder.items.utilitiesAspect.subsequentDocument'
        ).to.have.attributes(['id', 'displayId', 'type']);
    });

    it('should contain all defined attributes for CustomerOrderItemUtilitiesSubsequentDocumentCodes', () => {
        expect(
            'sap.odm.utilities.sales.CustomerOrderItemUtilitiesSubsequentDocumentCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes for CustomerOrderItemUtilitiesSubscriptionAspect', () => {
        expect(
            'sap.odm.sales.CustomerOrder.items.subscriptionAspect'
        ).to.have.attributes([
            'contractTerm',
            'subscriptionReference',
            'validFrom',
            'validTo',
        ]);
    });

    it('should contain all defined attributes for CustomerOrderPaymentReference', () => {
        expect(
            'sap.odm.sales.CustomerOrderPaymentReference'
        ).to.have.attributes(['token', 'utilitiesCardType']);
    });
});
