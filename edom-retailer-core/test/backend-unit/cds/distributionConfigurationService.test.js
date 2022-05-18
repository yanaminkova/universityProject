const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the exposed entity of API_EDOM_RETAILER according to the specification provided in #713
 */
describe('DistributionConfigurationService UT-test UTILITIESCLOUDSOLUTION-2848', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });
    it('should contain all specified entities', () => {
        expect('DistributionConfigurationService').to.have.entities(
            ['UtilitiesBusinessScenarios'],
            ['BusinessActionTypeCodes']
        );
    });
    it('should contain @restrict annotation for all entities', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('DistributionConfigurationService')
        ).filter((value) => !value['@cds.autoexposed']);

        Array.from(serviceEntities).forEach((entity) => {
            expect(
                entity['@restrict'],
                `Expected ${entity.name} to have @restrict annotation defined`
            ).to.exist;
        });
    });

    it('should contain all defined attributes of BusinessScenarios', () => {
        expect(
            'DistributionConfigurationService.UtilitiesBusinessScenarios'
        ).to.have.attributes([
            'customerOrderType',
            'customerOrderItemType',
            'externalDocumentType',
            'businessAction',
            'externalDocumentHeaderType',
            'externalDocumentItemType',
            'subscriptionProfile',
            'sapProvided',
        ]);
    });
});
