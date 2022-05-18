const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
const { serializeEntityNonCustomFields } = require('@sap-cloud-sdk/core');
/**
 * Test goal: This test verify that the BusinessPartnerPDMService is exposing all personal data annotated entities and attributes
 */
describe('BusinessPartnerPDMService CDS test UTILITIESCLOUDSOLUTION-2916 ', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should expose all annotated entities in BusinessPartnerPDMService', () => {
        const definitions = cds.model.definitions;
        const entities = [];
        for (var prop in definitions) {
            if (!prop.startsWith('BusinessPartnerService')) continue;
            const definition = definitions[prop];
            if (!definition['@PersonalData.EntitySemantics']) continue;

            if (definition.kind !== 'entity') continue;

            entities.push(prop);
        }

        expect(
            definitions[`BusinessPartnerPDMService.BusinessPartner`],
            `Expected BusinessPartnerPDMService to expose BusinessPartner`
        ).to.exist;
    });

    it('should expose all annotated attributes in BusinessPartnerPDMService', () => {
        const definitions = cds.model.definitions;
        const entities = {};
        for (var prop in definitions) {
            if (!prop.startsWith('BusinessPartnerPDMService')) continue;
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
                definitions[`BusinessPartnerPDMService.${entityName}`].elements;
            personalAttributes.forEach((attributeName) => {
                expect(
                    exposedAttributes[attributeName],
                    `BusinessPartnerServiceInternal.${entityName} expected to have attribute ${attributeName}`
                ).to.exist;
            });
        }
    });

    it('should expose all annotated types in BusinessPartnerPDMService', () => {
        const definitions = cds.model.definitions;
        const entities = {};
        for (var prop in definitions) {
            if (!prop.startsWith('BusinessPartnerPDMService')) continue;
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
                definitions[`BusinessPartnerPDMService.${entityName}`].elements;
            personalTypes.forEach((attributeName) => {
                expect(
                    exposedTypes[attributeName],
                    `BusinessPartnerServiceInternal.${entityName} expected to have attribute ${attributeName}`
                ).to.exist;
            });
        }
    });
});
