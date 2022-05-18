/* eslint-disable no-underscore-dangle */
const logger = require('cf-nodejs-logging-support');
const EntitiesHelper = require('./EntitiesHelper');
const { FIELD_SEMANTICS } = require('./DataPrivacyAndProtectionConstants');

class DataSubjectBuilder {
    /**
     * @param {Object} params
     * @param {cds.Request} params.req - request (required)
     * @param {String} params.entityName - name of entity we're looking a data subject for (required)
     * @param {Object} params.cds - non-default cds fassade if needed
     */
    constructor(params) {
        this._dataSubjectAttribute = null;
        this._dataSubjectEntity = null;
        this._dataSubjectKeyField = null;
        this._dataSubjectKeyValue = null;
        this._dataSubjectAttrValue = null;
        this._findDataSubjectPromise = null;

        this._logger = params?.logger || logger;

        if (!params?.req) {
            throw new Error('[DataSubjectBuilder] no params.req provided');
        }
        this._req = params.req;

        if (!params?.sourceData) {
            throw new Error(
                '[DataSubjectBuilder] no params.sourceData provided'
            );
        }
        this._sourceData = params.sourceData;

        if (!params?.entityName) {
            throw new Error(
                '[DataSubjectBuilder] no params.entityName provided'
            );
        }

        const parentEntityName = this.reqParams?.length
            ? EntitiesHelper.getParentEntityNameByPath(this.req.path)
            : EntitiesHelper.getParentEntityName(params.entityName);

        this._sourceEntity = parentEntityName || params.entityName;
        this._sourceEntityKey = EntitiesHelper.getKeyAttributeName(
            this.sourceEntity
        );

        this._dataSubjectKeyValue = this.reqParams?.[0]
            ? this.reqParams[0].id
            : this.sourceData[this.sourceEntityKey];

        if (!this.sourceEntityKey) {
            this.logger.warn('[DataSubjectBuilder] No keys provided');
        }
    }

    /**
     * @description should find and fill this._dataSubjectAttrValue, should be launched after findDataSubjectEntity
     * @returns {DataSubjectBuilder} this to allow chaining
     */
    findDataSubject() {
        return new Promise((resolve) => {
            if (this.dataSubjectEntity === this.req.entity) {
                this._extractDataSubjectAttrValueFromReq();
            }

            if (this.dataSubjectAttrValue) {
                resolve();
            } else {
                EntitiesHelper.getDataFromEntity(
                    this.dataSubjectEntity,
                    this.dataSubjectKeyField,
                    this.dataSubjectKeyValue,
                    this.dataSubjectAttribute,
                    this.req
                ).then((response) => {
                    this._dataSubjectAttrValue = response?.[
                        this.dataSubjectAttribute
                    ]
                        ? response[this.dataSubjectAttribute]
                        : null;
                    resolve();
                });
            }
        });
    }

    /**
     * @description should find and fill this._dataSubjectEntity, this._dataSubjectKeyField and this._dataSubjectAttribute
     * @returns {DataSubjectBuilder} this to allow chaining
     */
    findDataSubjectEntity() {
        let dataSubjectEntity = this.sourceEntity;
        let dataSubjectAttribute = EntitiesHelper.getAttributesWithAnnotations(
            this.sourceEntity,
            DataSubjectBuilder.getDataSubjectAnnotationConf(),
            true,
            false
        );

        if (!dataSubjectAttribute) {
            dataSubjectEntity = this._findEntityWithDataSubject(
                this.sourceEntity
            );

            dataSubjectAttribute = EntitiesHelper.getAttributesWithAnnotations(
                dataSubjectEntity,
                DataSubjectBuilder.getDataSubjectAnnotationConf(),
                true,
                false
            );
        }

        if (dataSubjectAttribute) {
            this._dataSubjectEntity = dataSubjectEntity;
            this._dataSubjectKeyField =
                EntitiesHelper.getKeyAttributeName(dataSubjectEntity);
            this._dataSubjectAttribute = dataSubjectAttribute;
        }

        return this;
    }

    /**
     *
     * @returns {Object.<name<String>, value<String>}
     */
    static getDataSubjectAnnotationConf() {
        return {
            name: FIELD_SEMANTICS,
            value: 'DataSubjectID',
        };
    }

    /**
     * @description should assign this._dataSubjectAttrValue in case if it's in req
     * @example
     */
    _extractDataSubjectAttrValueFromReq() {
        this._dataSubjectAttrValue =
            this.sourceData?.[this.dataSubjectAttribute] ??
            this.req.params?.[0]?.[this.dataSubjectAttribute] ??
            this.dataSubjectAttrValue;

        const splitAttrName = this.dataSubjectAttribute.split('_');
        if (!this.dataSubjectAttrValue && splitAttrName.length === 2) {
            this._dataSubjectAttrValue =
                this.sourceData?.[splitAttrName[0]]?.[splitAttrName[1]] ??
                this.dataSubjectAttrValue;
        }
    }

    /**
     *
     * @param {String} entityName
     * @param {Array<String>} skipEntities
     * @returns {String|Boolean}
     */
    _findEntityWithDataSubject(entityName, skipEntities = []) {
        const compositions = EntitiesHelper.getEntityElements(entityName)
            .filter((element) => element.target)
            .map((element) => element.target);

        const entityFound = compositions
            .filter((composition) => !skipEntities.includes(composition))
            .find((composition) => {
                let dataSubjectAttribute =
                    EntitiesHelper.getAttributesWithAnnotations(
                        composition,
                        DataSubjectBuilder.getDataSubjectAnnotationConf(),
                        true,
                        false
                    );
                if (!dataSubjectAttribute) {
                    if (!skipEntities.includes(entityName)) {
                        skipEntities.push(entityName);
                    }
                    dataSubjectAttribute = this._findEntityWithDataSubject(
                        composition,
                        skipEntities
                    );
                }

                return dataSubjectAttribute;
            });

        return entityFound || null;
    }

    /**
     * @returns {Object} cds fassade
     */
    get cds() {
        return this._cds;
    }

    /**
     * @returns {Object} logger
     */
    get logger() {
        return this._logger;
    }

    /**
     * @returns {String|null}
     */
    get dataSubjectAttribute() {
        return this._dataSubjectAttribute;
    }

    /**
     * @returns {String|null}
     */
    get dataSubjectKeyField() {
        return this._dataSubjectKeyField;
    }

    /**
     * @returns {String|null}
     */
    get dataSubjectKeyValue() {
        return this._dataSubjectKeyValue;
    }

    /**
     * @returns {String|null}
     */
    get dataSubjectEntity() {
        return this._dataSubjectEntity;
    }

    /**
     * @returns {String|null}
     */
    get dataSubjectAttrValue() {
        return this._dataSubjectAttrValue;
    }

    /**
     * @returns {Array<String>}
     */
    get reqParams() {
        return this._req.params ?? [];
    }

    /**
     * @returns {cds.Request}
     */
    get req() {
        return this._req;
    }

    get sourceData() {
        return this._sourceData;
    }

    /**
     * @returns {String}
     */
    get sourceEntity() {
        return this._sourceEntity;
    }

    /**
     * @returns {String}
     */
    get sourceEntityKey() {
        return this._sourceEntityKey;
    }
}

module.exports = DataSubjectBuilder;
