const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the exposed entity of API_EDOM_RETAILER according to the specification provided in #713
 */
describe('Security', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should contain @requires annotation for all services', () => {
        const services = Object.values(cds.model.definitions).filter(
            (value) => value.kind == 'service' && value['@path']
        );

        const except = ['/monitoring'];

        Array.from(services)
            .filter((service) => !except.includes(service['@path']))
            .forEach((service) => {
                expect(
                    service['@requires'],
                    `Expected ${service.name} to have @requires annotation defined`
                ).to.exist;
                expect(
                    service['@requires'],
                    `Expected ${service.name} to have authenticated-user for @requires annotation`
                ).to.eql('authenticated-user');
            });
    });

    it('should contain @restrict annotation for each entitity/action/function of all services', () => {
        const serviceNames = Object.values(cds.reflect(cds.model).definitions)
            .filter(
                (value) =>
                    value.kind == 'service' &&
                    !value.name.includes('API_BUSINESS_PARTNER')
            )
            .map((value) => value.name);

        const definitions = Object.values(
            cds.reflect(cds.model).definitions
        ).filter(
            (value) =>
                value.kind != 'service' &&
                value.kind != 'type' &&
                !value['@cds.persistence.skip'] &&
                !value['@cds.autoexposed'] &&
                !value['@cds.autoexpose']
        );

        const serviceElements = definitions.reduce(
            (accumulator, definition) => {
                if (definition.name.includes('localized')) return accumulator;

                const matchService = serviceNames.find((serviceName) =>
                    definition.name.includes(serviceName)
                );
                if (matchService) accumulator.push(definition);
                return accumulator;
            },
            []
        );

        const excludedElements = ['MonitoringService.health'];

        for (var i in Array.from(serviceElements)) {
            let element = serviceElements[i];

            if (excludedElements.includes(element.name)) continue;

            expect(
                element['@restrict'],
                `Expected ${element.name} to have @restrict annotation defined `
            ).to.exist;
            expect(
                element['@restrict'].length,
                `Expected ${element.name} to have a security scope defined in @restrict annotation`
            ).to.not.eql(0);
        }
    });
});
