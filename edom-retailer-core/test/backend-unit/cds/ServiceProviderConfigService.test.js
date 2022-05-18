const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the exposed entity of ServiceProviderConfigService according to the specification provided in #713
 */
describe('ServiceProviderConfigService CDS test UTILITIESCLOUDSOLUTION-2916', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should contain all specified entities', () => {
        expect('ServiceProviderConfigService').to.have.entities([
            'MarketFunctionConfiguration',
            'MarketFunctionCodes',
            'MarketServiceCodes',
            'DivisionCodes',
        ]);
    });

    it('should contain @restrict and @Capabilities annotations for all entities', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('ServiceProviderConfigService')
        ).filter((value) => !value['@cds.autoexposed']);
        Array.from(serviceEntities).forEach((entity) => {
            expect(
                entity['@restrict'],
                `Expected ${entity.name} to have @restrict annotation defined`
            ).to.exist;
            expect(
                entity['@restrict'].length,
                `Expected ${entity.name} to have 2 granted scopes of @restrict annotation`
            ).to.eql(2);
            expect(entity['@Capabilities.DeleteRestrictions.Deletable']).to.be
                .false;
        });
    });

    it('should contain all defined attributes of MarketFunctionConfiguration', () => {
        expect(
            'ServiceProviderConfigService.MarketFunctionConfiguration'
        ).to.have.attributes([
            'marketFunction',
            'division',
            'marketService', // composition of many MarketServiceInformation
        ]);
    });

    it('should contain all defined attributes of MarketFunctionCodes', () => {
        expect(
            'ServiceProviderConfigService.MarketFunctionCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of MarketServiceCodes', () => {
        expect(
            'ServiceProviderConfigService.MarketServiceCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });

    it('should contain all defined attributes of DivisionCodes', () => {
        expect('ServiceProviderConfigService.DivisionCodes').to.have.attributes(
            ['code', 'name', 'descr']
        );
    });
});
