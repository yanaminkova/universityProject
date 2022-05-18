const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the exposed entity of DataRetentionManagerService
 */
describe('DataRetentionManagerService CDS Test', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should contain all specified entities', () => {
        expect('DataRetentionManagerService').to.have.entities([
            'DataController',
        ]);
    });

    it('should contain @description annotation for all attributes', async () => {
        const entities = await Object.entries(cds.model.definitions)
            .map((entry) => ({
                name: entry[0],
                ...entry[1],
            }))
            .filter((entity) =>
                entity.name.startsWith('DataRetentionManagerService.')
            );

        const labeled = entities.every((entity) => {
            if (entity.kind == 'entity') {
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
                expect(labeled).to.equal(true);
            }
        });
    });
});
