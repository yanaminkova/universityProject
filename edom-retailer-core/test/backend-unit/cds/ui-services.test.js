const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verifies that the exposed entities of ui-services are annotated with @cds.persistence.exists
 */
describe('ui-services.test UTILITIESCLOUDSOLUTION-2842', () => {
    before('load cds model...', async () => {
        cds.serviceModel = await cds.load(
            path.join(__dirname, '../../../ui-services/srv')
        );
        cds.dbModel = await cds.load(
            path.join(__dirname, '../../../ui-services/db')
        );
    });

    it('should contain @cds.persistence.exists annotation for all autoexposed entities in db', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.dbModel).entities('sap.odm')
        );

        Array.from(serviceEntities).forEach((entity) => {
            expect(
                entity['@cds.persistence.exists'],
                `Expected ${entity.name} to have @cds.persistence.exists annotation defined`
            ).to.exist;
        });
        /**
         * Array.from(serviceEntities).filter((x) => !x['@cds.persistence.exists']).map(x => 'annotate ' + x.name + ' with @cds.persistence.exists;').join('\n')
         * To be used for outputting all missing annotations
         */
    });

    it('should contain @cds.persistence.exists annotation for all entities exposed in CustomerOrderUIService', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.serviceModel).entities('CustomerOrderUIService')
        );

        Array.from(serviceEntities).forEach((entity) => {
            expect(
                entity['@cds.persistence.exists'],
                `Expected ${entity.name} to have @cds.persistence.exists annotation defined`
            ).to.exist;
        });
    });
    it('should contain @restrict annotation for all entities', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.serviceModel).entities('CustomerOrderUIService')
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
            cds.reflect(cds.serviceModel).entities('CustomerOrderUIService')
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
});
