const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');

/**
 * Test goal: This test verify the exposed entity of salesProcessingStatusCodes
 */
describe('salesProcessingStatusCodes UTILITIESCLOUDSOLUTION-2971', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('service should contain entity salesProcessingStatusCodes', () => {
        expect('API_EDOM_RETAILER').to.have.entities([
            'SalesProcessingStatusCodes',
        ]);
    });

    it('entity should contain property "isDefault"', () => {
        expect(
            'API_EDOM_RETAILER.SalesProcessingStatusCodes'
        ).to.have.attributes(['isDefault']);
    });
});
