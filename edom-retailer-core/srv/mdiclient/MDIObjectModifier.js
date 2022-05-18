/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const logger = require('cf-nodejs-logging-support');
const MDIClientHelper = require('./MDIClientHelper');

class MDIObjectModifier {
    constructor(object) {
        this.object = object;
        this.newObject = {};
        this.newObjectFields = {};
    }

    fitComposition2one(args) {
        const { childService, childEntity, obj, res, resFields, field } = args;

        res[field.name] = {};
        resFields[field.name] = {};
        this.fitToEntity(
            childService,
            childEntity,
            obj[field.name],
            res[field.name],
            resFields[field.name]
        );
    }

    fitComposition2many(args) {
        const { childService, childEntity, obj, res, resFields, field } = args;

        res[field.name] = obj[field.name].map(() => ({}));
        resFields[field.name] = obj[field.name].map(() => ({}));

        obj[field.name]?.forEach((object, index) => {
            this.fitToEntity(
                childService,
                childEntity,
                object,
                res[field.name][index],
                resFields[field.name][index]
            );
        });
    }

    static fitAssociation2one(args) {
        const { obj, res, resFields, actualKeys, field } = args;
        res[`${field.name}_code`] = obj[field.name].code;
        MDIClientHelper.storeIfKey(
            field.key,
            resFields,
            obj[field.name].code,
            `${field.name}_code`,
            actualKeys
        );
    }

    static fitRegularField(args) {
        const { obj, res, resFields, actualKeys, field } = args;
        if (Array.isArray(obj[field.name])) {
            res.texts = res.texts || [];
            obj[field.name].forEach((localeObj) => {
                let resTextsLocaleObjIndex = res.texts.findIndex(
                    (l) => l.locale === localeObj.lang
                );
                if (resTextsLocaleObjIndex < 0) {
                    res.texts.push({
                        locale: localeObj.lang,
                    });
                    resTextsLocaleObjIndex = res.texts.length - 1;
                }

                res.texts[resTextsLocaleObjIndex][field.name] =
                    localeObj.content;
                if (localeObj.lang === 'en') {
                    res[field.name] = localeObj.content;
                }
            });
        } else {
            res[field.name] = obj[field.name];
        }
        MDIClientHelper.storeIfKey(
            field.key,
            resFields,
            obj[field.name],
            field.name,
            actualKeys
        );
    }

    static getChildEntity(service, field) {
        return {
            childService: service,
            childEntity: field?.target?.split('.').pop(),
        };
    }

    fitToEntity(service, passEntity, passObj, passNewObj, passNewObjFields) {
        const obj = passObj || this.object;
        const res = passNewObj || this.newObject;
        const resFields = passNewObjFields || this.newObjectFields;
        const actualKeys = [];

        const slicedEntityName = passEntity.slice(
            passEntity.lastIndexOf('.') + 1
        );
        const entityDefinition = service?.entities?.[slicedEntityName];

        if (!entityDefinition) {
            const msg = `[MDIObjectModifier][fitToEntity] non-existing entity name "${passEntity}" passed`;
            logger.error(msg);
            throw new Error(msg);
        }

        const { elements } = entityDefinition;

        const filteredFields = Object.keys(elements).filter(
            (fieldName) => obj[fieldName]
        );

        const hasNestedCompositionOfMany = filteredFields.some((field) =>
            MDIClientHelper.isField(field, 'Composition', 'is2many')
        );

        filteredFields.forEach((fieldName) => {
            const field = elements[fieldName];
            const { childService, childEntity } =
                MDIObjectModifier.getChildEntity(service, field);
            const args = {
                childService,
                childEntity,
                obj,
                res,
                resFields,
                actualKeys,
                field,
                hasNestedCompositionOfMany,
            };
            if (MDIClientHelper.isField(field, 'Composition', 'is2one')) {
                this.fitComposition2one(args);
            } else if (
                MDIClientHelper.isField(field, 'Composition', 'is2many')
            ) {
                this.fitComposition2many(args);
            } else if (
                MDIClientHelper.isField(field, 'Association', 'is2one') &&
                obj[fieldName].code
            ) {
                MDIObjectModifier.fitAssociation2one(args);
            } else {
                MDIObjectModifier.fitRegularField(args);
            }

            if (
                typeof res[fieldName] === 'object' &&
                !Object.keys(res[fieldName]).length
            ) {
                delete res[fieldName];
                delete resFields[fieldName];
            }
        });

        if (actualKeys.length > 0) {
            resFields._keys = actualKeys;
        }

        return this;
    }

    getModifiedObject() {
        // prevention of potential memory leak, any deep copy function can be used instead
        return JSON.parse(JSON.stringify(this.newObject));
    }

    getModifiedObjectFields() {
        // prevention of potential memory leak, any deep copy function can be used instead
        return JSON.parse(JSON.stringify(this.newObjectFields));
    }
}

module.exports = MDIObjectModifier;
