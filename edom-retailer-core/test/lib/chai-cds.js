/*
 * expect(namespaceA).to.have.association(namespaceB).with.min(1).max(2)
 * expect(namespaceA).to.have.composition(namespaceB)
 * expect(namespaceA).to.have.attributes([...])
 * expect(namespaceA).to.have.entities([...])
 */
const cds = require('@sap/cds');

module.exports = (chai, utils) => {
    const Assertion = chai.Assertion;

    Assertion.addMethod('mandatoryFields', function (attributes) {
        const currNS = this._obj;
        new Assertion(currNS).to.be.a('string');
        const currentEntity = cds.model.definitions[currNS];

        let association;

        new Assertion(attributes).to.exist;
        new Assertion(attributes).to.be.an('array');

        attributes.forEach((attribute) => {
            for (const key in currentEntity.elements) {
                if (key == attribute) {
                    const element = currentEntity.elements[key];
                    new Assertion(
                        element['@mandatory'],
                        `Attribute ${attribute} is not mandatory field`
                    ).to.eql(true);
                    break;
                }
            }
        });
    });

    Assertion.addMethod('immutableFields', function (attributes) {
        const currNS = this._obj;
        new Assertion(currNS).to.be.a('string');
        const currentEntity = cds.model.definitions[currNS];

        let association;

        new Assertion(attributes).to.exist;
        new Assertion(attributes).to.be.an('array');

        attributes.forEach((attribute) => {
            for (const key in currentEntity.elements) {
                if (key == attribute) {
                    const element = currentEntity.elements[key];
                    new Assertion(
                        element['@Core.Immutable'],
                        `Attribute ${attribute} is not immutable field`
                    ).to.eql(true);
                    break;
                }
            }
        });
    });

    Assertion.addMethod('readonlyFields', function (attributes) {
        const currNS = this._obj;
        new Assertion(currNS).to.be.a('string');
        const currentEntity = cds.model.definitions[currNS];

        let association;

        new Assertion(attributes).to.exist;
        new Assertion(attributes).to.be.an('array');

        attributes.forEach((attribute) => {
            for (const key in currentEntity.elements) {
                if (key == attribute) {
                    const element = currentEntity.elements[key];
                    new Assertion(
                        element['@readonly'],
                        `Attribute ${attribute} is not readonly field`
                    ).to.eql(true);
                    break;
                }
            }
        });
    });

    Assertion.addMethod('association', function (otherNS) {
        const currNS = this._obj;

        new Assertion(currNS).to.be.a('string');
        new Assertion(otherNS).to.be.a('string');

        const currentEntity = cds.model.definitions[currNS];
        const otherEntity = cds.model.definitions[otherNS];

        new Assertion(currentEntity).to.exist;
        new Assertion(otherEntity).to.exist;

        let association;

        for (const key in currentEntity.elements) {
            const element = currentEntity.elements[key];

            if (element.target == otherNS) {
                association = element;
                break;
            }
        }

        new Assertion(association).to.exist;
        new Assertion(association.type).to.eql('cds.Association');
        new Assertion(association.target).to.eql(otherNS);

        utils.flag(this, 'element', association);
    });

    Assertion.addMethod('typeAssociation', function (otherNS) {
        const currNS = this._obj;

        new Assertion(currNS).to.be.a('string');
        new Assertion(otherNS).to.be.a('string');

        const currentEntity = cds.model.definitions[currNS];
        const otherEntity = cds.model.definitions[otherNS];

        new Assertion(currentEntity).to.exist;
        new Assertion(otherEntity).to.exist;

        new Assertion(currentEntity.type).to.eql('cds.Association');
        new Assertion(currentEntity.target).to.eql(otherNS);

        utils.flag(this, 'element', currentEntity);
    });

    Assertion.addMethod('composition', function (otherNS) {
        const currNS = this._obj;

        new Assertion(currNS).to.be.a('string');
        new Assertion(otherNS).to.be.a('string');

        const currentEntity = cds.model.definitions[currNS];
        const otherEntity = cds.model.definitions[otherNS];

        new Assertion(currentEntity).to.exist;
        new Assertion(otherEntity).to.exist;

        let composition;

        for (const key in currentEntity.elements) {
            const element = currentEntity.elements[key];

            if (element.target == otherNS) {
                composition = element;
                break;
            }
        }

        new Assertion(composition).to.exist;
        new Assertion(composition.type).to.eql('cds.Composition');
        new Assertion(composition.target).to.eql(otherNS);

        utils.flag(this, 'element', composition);
    });

    // Assertion.addMethod('min', function(cardinality) {
    //     const element = utils.flag(this, 'element');
    //     new Assertion(element).to.exist;

    //     new Assertion(element.cardinality.min).to.eql(cardinality);
    // });

    Assertion.addMethod('max', function (cardinality) {
        const element = utils.flag(this, 'element');
        new Assertion(element).to.exist;

        new Assertion(element.cardinality.max).to.eql(cardinality);
    });

    Assertion.addMethod('attributes', function (attributes) {
        const currNS = this._obj;

        new Assertion(currNS).to.be.a('string');

        const currentEntity = cds.model.definitions[currNS];

        new Assertion(attributes).to.exist;
        new Assertion(attributes).to.be.an('array');

        attributes.forEach((attribute) => {
            new Assertion(
                currentEntity.elements[attribute],
                `Attribute ${attribute} does not exist`
            ).to.exist;
        });
    });

    Assertion.addMethod('attribute', function (attribute) {
        const currNS = this._obj;

        new Assertion(currNS).to.be.a('string');

        const currentEntity = cds.model.definitions[currNS];

        new Assertion(currentEntity.elements[attribute]).to.exist;

        utils.flag(this, 'attribute', currentEntity.elements[attribute]);
    });

    Assertion.addMethod('type', function (type) {
        const attribute = utils.flag(this, 'attribute');
        new Assertion(attribute.type).to.be.eql(type);
    });

    Assertion.addMethod('entities', function (entities) {
        const currNS = this._obj;

        new Assertion(currNS).to.be.a('string');

        const reflectedModel = cds.reflect(cds.model);
        let currentEntities = reflectedModel.entities(currNS);

        new Assertion(entities).to.exist;
        new Assertion(entities).to.be.an('array');

        entities.forEach((entity) => {
            new Assertion(
                currentEntities[entity],
                `Entity ${entity} does not exist`
            ).to.exist;
        });
    });
};
