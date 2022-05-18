const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the exposed entity of OrderStatusMapping
 */
describe('ConfigurationService CDS Test UTILITIESCLOUDSOLUTION-2969', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should contain all specified entities', () => {
        expect('ConfigurationService').to.have.entities(
            ['CustomerOrderUtilitiesStatusMapping'],
            ['CustomerOrderUtilitiesStatusSourceSystems'],
            ['CustomerOrderUtilitiesStatusMappingTypeCodes']
        );
    });

    it('should contain @description annotation for all attributes', async () => {
        const entities = await Object.entries(cds.model.definitions)
            .map((entry) => ({
                name: entry[0],
                ...entry[1],
            }))
            .filter((entity) =>
                entity.name.startsWith('ConfigurationService.')
            );

        const labeled = entities.every((entity) => {
            return Object.entries(entity.elements)
                .map((entry) => ({
                    name: entry[0],
                    ...entry[1],
                }))
                .every((field) => {
                    if (field['@description'] || field.name == 'up_') {
                        return true;
                    } else {
                        throw new Error(
                            `Non-labeled field ${JSON.stringify(
                                field.name
                            )} of entity ${JSON.stringify(entity.name)}`
                        );
                    }
                });
        });
        expect(labeled).to.equal(true);
    });

    it('should contain @restrict annotation for all entities', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('ConfigurationService')
        ).filter((value) => !value['@cds.autoexposed']);

        Array.from(serviceEntities).forEach((entity) => {
            expect(
                entity['@restrict'],
                `Expected ${entity.name} to have @restrict annotation defined`
            ).to.exist;
        });
    });

    it('should contain @readonly annotation for isBlocked attribute', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('API_EDOM_RETAILER')
        ).filter((value) => !value['@cds.autoexposed']);

        Array.from(serviceEntities).forEach((entity) => {
            if (entity.elements.isBlocked) {
                expect(
                    entity.elements.isBlocked['@readonly'],
                    `Expected ${entity.name} to have @readonly annotation for isBlocked attribute defined`
                ).to.exist;
            }
        });
    });

    it('should contain all defined attributes of CustomerOrderUtilitiesStatusMapping', () => {
        expect(
            'ConfigurationService.CustomerOrderUtilitiesStatusMapping'
        ).to.have.attributes([
            'sourceSystem',
            'sourceSystemStatus',
            'processingStatus',
            'type',
        ]);
    });

    it('should contain all defined attributes of CustomerOrderUtilitiesStatusSourceSystems', () => {
        expect(
            'ConfigurationService.CustomerOrderUtilitiesStatusSourceSystems'
        ).to.have.attributes([
            'sourceSystemId',
            'destination',
            'path',
            'statusPath',
        ]);
    });

    it('should contain all defined attributes of CustomerOrderUtilitiesStatusMappingTypeCodes', () => {
        expect(
            'ConfigurationService.CustomerOrderUtilitiesStatusMappingTypeCodes'
        ).to.have.attributes(['code', 'name', 'descr']);
    });
});
