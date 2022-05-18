const path = require('path');
const expect = require('expect');
const cds = require('@sap/cds');
const { serializeEntityNonCustomFields } = require('@sap-cloud-sdk/core');
/**
 * Test goal: This test verify that the PersonalDataManagerService is exposing all personal data annotated entities and attributes
 */
describe('PersonalDataManagerService UTILITIESCLOUDSOLUTION-2259', () => {
    beforeAll(async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should have labels for each entity and field of the service', async () => {
        const entities = await Object.entries(cds.model.definitions)
            .map((entry) => ({
                name: entry[0],
                ...entry[1],
            }))
            .filter((entity) =>
                entity.name.startsWith('PersonalDataManagerService.')
            );

        const labeled = entities.every((entity) => {
            if (entity['@Common.Label']) {
                return Object.entries(entity.elements)
                    .map((entry) => ({
                        name: entry[0],
                        ...entry[1],
                    }))
                    .every((field) => {
                        if (field['@Common.Label']) {
                            return true;
                        } else {
                            throw new Error(
                                `Non-labeled field ${JSON.stringify(
                                    field
                                )} of entity ${JSON.stringify(entity)}`
                            );
                        }
                    });
            }

            throw new Error(`Non-labeled entity ${JSON.stringify(entity)}`);
        });

        expect(labeled).toBeTruthy();
    });

    it.skip('should expose all annotated entities in PersonalDataService', () => {
        const definitions = cds.model.definitions;
        const entities = [];
        for (var prop in definitions) {
            if (!prop.startsWith('API_EDOM_RETAILER')) continue;
            const definition = definitions[prop];
            if (!definition['@PersonalData.EntitySemantics']) continue;

            if (definition.kind !== 'entity') continue;

            entities.push(prop);
        }

        entities.forEach((entity) => {
            const entityName = entity.substring(entity.lastIndexOf('.') + 1);
            expect(
                definitions[`PersonalDataManagerService.${entityName}`],
                `Expected PersonalDataManagerService to expose ${entityName}`
            ).to.exist;
        });
    });

    it.skip('should expose all annotated attributes in PersonalDataService', () => {
        const definitions = cds.model.definitions;
        const entities = {};
        for (var prop in definitions) {
            if (!prop.startsWith('API_EDOM_RETAILER')) continue;
            const definition = definitions[prop];

            if (definition.kind !== 'entity') continue;

            const personalAttributes = [];
            for (var elementName in definition.elements) {
                if (
                    !definition.elements[elementName][
                        '@PersonalData.IsPotentiallyPersonal'
                    ] &&
                    !definition.elements[elementName][
                        '@PersonalData.FieldSemantics'
                    ]
                )
                    continue;

                personalAttributes.push(elementName);
            }

            if (personalAttributes.length > 0)
                entities[prop] = personalAttributes;
        }

        for (var entity in entities) {
            const entityName = entity.substring(entity.lastIndexOf('.') + 1);
            const personalAttributes = entities[entity];

            const exposedAttributes =
                definitions[`PersonalDataManagerService.${entityName}`]
                    .elements;
            personalAttributes.forEach((attributeName) => {
                expect(
                    exposedAttributes[attributeName],
                    `PersonalDataManagerService.${entityName} expected to have attribute ${attributeName}`
                ).to.exist;
            });
        }
    });

    it.skip('should expose all annotated types in PersonalDataService', () => {
        const definitions = cds.model.definitions;
        const entities = {};
        for (var prop in definitions) {
            if (!prop.startsWith('API_EDOM_RETAILER')) continue;
            const definition = definitions[prop];
            if (definition.kind !== 'entity') continue;

            const typesWithPersonalAttributes = [];
            for (var elementName in definition.elements) {
                if (
                    !definition.elements[elementName]['type'] ||
                    !definition.elements[elementName]['type'].startsWith(
                        'sap.odm'
                    )
                )
                    continue;
                const type = definition.elements[elementName]['type'];
                const typeDefinition = definitions[type];
                let hasPersonalAttributes = false;
                for (var typeElementName in typeDefinition.elements) {
                    if (
                        typeDefinition.elements[typeElementName][
                            '@PersonalData.IsPotentiallyPersonal'
                        ] ||
                        typeDefinition.elements[typeElementName][
                            '@PersonalData.FieldSemantics'
                        ]
                    ) {
                        hasPersonalAttributes = true;
                        break;
                    }
                }

                if (hasPersonalAttributes) {
                    typesWithPersonalAttributes.push(elementName);
                }
            }

            if (typesWithPersonalAttributes.length > 0)
                entities[prop] = typesWithPersonalAttributes;
        }

        for (var entity in entities) {
            const entityName = entity.substring(entity.lastIndexOf('.') + 1);
            const personalTypes = entities[entity];

            const exposedTypes =
                definitions[`PersonalDataManagerService.${entityName}`]
                    .elements;
            personalTypes.forEach((attributeName) => {
                expect(
                    exposedTypes[attributeName],
                    `PersonalDataManagerService.${entityName} expected to have attribute ${attributeName}`
                ).to.exist;
            });
        }
    });
});
