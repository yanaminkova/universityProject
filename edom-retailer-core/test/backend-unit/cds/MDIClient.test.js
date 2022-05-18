const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the exposed entity of MDIClientService
 */
describe('MDIClientService CDS test UTILITIESCLOUDSOLUTION-2916', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should contain all specified entities', () => {
        expect('MDIClientService').to.have.entities([
            'MDIClient',
            'DeltaTokenBookKeeping',
        ]);
    });

    it('should contain all defined attributes of MDIClient', () => {
        expect('MDIClientService.MDIClient').to.have.attributes(['deltaLoad']);
    });

    it('should contain all defined attributes of DeltaTokenBookKeeping', () => {
        expect('MDIClientService.DeltaTokenBookKeeping').to.have.attributes([
            'id',
            'deltaToken',
            'status',
            'type',
            'createdAt',
        ]);
    });
});
