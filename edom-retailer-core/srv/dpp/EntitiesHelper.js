const cds = require('@sap/cds');

class EntitiesHelper {
    /**
     * @param {String} entityName: Name of the entity
     * @returns {String|Boolean} - first key name or false if not found
     */
    static getKeyAttributeName(entityName) {
        const key = EntitiesHelper.getEntityElements(entityName).find(
            (entry) => entry.key
        );

        if (!key) {
            return false;
        }

        if (key.keys) {
            return key.name.concat('_', key.keys[0].ref[0]);
        }

        return key.name || false;
    }

    /**
     * @param {String} entityName: Name of the entity
     * @param {Object} cds - non-default cds fassade if needed
     * @returns {Array<String>} - all keys names
     */
    static getKeyAttributesNames(entityName) {
        return EntitiesHelper.getEntityElements(entityName)
            .filter((element) => element.key)
            .map((element) => element.name);
    }

    /**
     *
     * @param {String} entityName
     * @param {String|Array<String>|Object.<name, value>|Array<Object.<name, value>>} annotations
     * @param {Boolean} onlyFirst
     */
    static getAttributesWithAnnotations(
        entityName,
        annotations,
        onlyFirst = false,
        isOrLogic = true
    ) {
        const elements = EntitiesHelper.getEntityElements(entityName);
        const searchAnnotations = Array.isArray(annotations)
            ? annotations
            : [annotations];

        const filteredAttributes = elements
            .filter((element) => {
                const matchFunction = (annotation) => {
                    if (typeof annotation === 'string') {
                        return element[annotation];
                    }
                    return element[annotation.name] === annotation.value;
                };

                const annotationMatch = isOrLogic
                    ? searchAnnotations.some(matchFunction)
                    : searchAnnotations.every(matchFunction);

                return annotationMatch;
            })
            .map((element) => {
                if (element?.keys?.[0]?.ref?.[0]) {
                    return `${element.name}_${element.keys[0].ref[0]}`;
                }
                return element.name;
            });

        return onlyFirst ? filteredAttributes[0] ?? false : filteredAttributes;
    }

    /**
     * Indicates the private method for getting data subject value
     * from nested entity
     *
     * @param {String} entityName
     * @param {String} keyAttribute
     * @param {String|Number} keyValue
     * @param {String} dataSubjectAttribute - Attribute annotated as DataSubjectID.
     * @param {cds.Request} req - request to take a transaction context from
     * @returns {Object} - data for retrieving a data subject.
     */
    static async getDataFromEntity(
        entityName,
        keyAttribute,
        keyValue,
        dataSubjectAttribute,
        req
    ) {
        if (!entityName || !keyAttribute || !keyValue) {
            return null;
        }

        const key = `${keyAttribute} =`;
        const selectFields = dataSubjectAttribute
            ? [dataSubjectAttribute]
            : '*';

        const targetName = EntitiesHelper.getEntityTargetName(entityName);

        if (!targetName) {
            return null;
        }

        const db = await cds.connect.to('db');

        const data = await db
            .transaction(req)
            .run(
                SELECT.one(selectFields).from(targetName).where(key, keyValue)
            );
        return data ? data[0] || data : null;
    }

    /**
     * @param {String} entityName - Enitity name.
     * @returns {Object} - List of entity elements.
     */
    static getEntityElements(entityName) {
        if (cds?.model?.definitions?.[entityName]) {
            const cdsEntity = cds?.model?.definitions?.[entityName];
            return Object.entries(cdsEntity.elements).map((entry) => ({
                name: entry[0],
                ...entry[1],
            }));
        }

        return false;
    }

    /**
     * @param {String} entityName - Enitity name.
     * @returns {String|Boolean} - Target entity name or false if not found
     */
    static getEntityTargetName(entityName) {
        /* eslint-disable no-underscore-dangle */
        return (
            cds.model?.definitions?.[entityName]?.query?._target?.name ?? false
        );
        /* eslint-enable no-underscore-dangle */
    }

    /**
     * @param {String} entityName: Name of the entity
     * @param {Object} cds - non-default cds fassade if needed
     * @returns {String|Boolean} - Parent entity name or false if not found
     */
    static getParentEntityName(entityName) {
        return (
            EntitiesHelper.getEntityElements(entityName)
                .filter((element) => element.name === 'up_' && element.target)
                .map((element) => element.target)
                .find(() => true) || false
        );
    }

    /**
     * @param {String} path: path to extract an entity name
     * @returns {String|Boolean} - Parent entity name or false if not found
     */
    static getParentEntityNameByPath(path) {
        return path?.length ? path.split('/')[0] : false;
    }
}

module.exports = EntitiesHelper;
