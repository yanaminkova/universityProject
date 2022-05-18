const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
const { serializeEntityNonCustomFields } = require('@sap-cloud-sdk/core');
/**
 * Test goal: This test verify that the PersonalDataManagerService is exposing all personal data annotated entities and attributes
 */
describe('BillingAccountPDMService CDS test UTILITIESCLOUDSOLUTION-2920', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should expose all annotated entities in PersonalDataService for BA', () => {
        const definitions = cds.model.definitions;
        const entities = [];
        for (var prop in definitions) {
            if (!prop.startsWith('BillingAccountService')) continue;
            const definition = definitions[prop];
            if (!definition['@PersonalData.EntitySemantics']) continue;

            if (definition.kind !== 'entity') continue;

            entities.push(prop);
        }

        expect(
            definitions[`BillingAccountPDMService.BillingAccount`],
            `Expected PersonalDataManagerService for BA to expose BillingAccount`
        ).to.exist;
    });

    it('should expose all annotated attributes in PersonalDataService for BA', () => {
        const definitions = cds.model.definitions;
        const entities = {};
        for (var prop in definitions) {
            if (!prop.startsWith('BillingAccountService')) continue;
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

        const entityName = 'BillingAccount';
        const personalAttributes =
            entities['BillingAccountService.BillingAccount'];

        const exposedAttributes =
            definitions[`BillingAccountPDMService.${entityName}`].elements;
        personalAttributes.forEach((attributeName) => {
            expect(
                exposedAttributes[attributeName],
                `BillingAccountPDMService.${entityName} expected to have attribute ${attributeName}`
            ).to.exist;
        });
    });

    it('should expose all annotated types in PersonalDataService for BA', () => {
        const definitions = cds.model.definitions;
        const entities = {};
        for (var prop in definitions) {
            if (!prop.startsWith('BillingAccountService')) continue;
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
                definitions[`BillingAccountPDMService.${entityName}`].elements;
            personalTypes.forEach((attributeName) => {
                expect(
                    exposedTypes[attributeName],
                    `BillingAccountPDMService.${entityName} expected to have attribute ${attributeName}`
                ).to.exist;
            });
        }
    });
});
