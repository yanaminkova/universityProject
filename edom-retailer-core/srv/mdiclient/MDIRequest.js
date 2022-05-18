/* eslint-disable no-underscore-dangle */
const cds = require('@sap/cds');

const { ODMVERSION, BPODMVERSION } = require('../lib/config');

function setKeysAsNonEnumerable(obj) {
    Object.defineProperty(obj, '_keys', {
        enumerable: false,
    });
}

function getActualKeys(obj) {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        if (obj._keys.includes(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
}

class MDIRequest {
    /**
     * @param {Object} req original BP OData request
     * @param {String} method e.g. GET, POST, PUT, PATCH
     * @param {String} type MDI (v1) API (events, requests)
     */
    constructor(req, method, type, data) {
        this.request = {};
        this.req = req;
        this.method = method;
        this.type = type;
        this.data = data;
    }

    /**
     * Removes all field included in exclude array
     * Modifies passed object by removing 'up__id' properties
     * Reformat properties from 'property_code' to 'property: { code: ...}'
     * Adds _operation: 'create' to new objects and appends '_delta' to Composition of many field names
     * @param {Object} obj modified request body / data / payload
     * @param {Boolean} isPatch flag for patch requests
     * @param {Object} exclude fields to remove from obj
     */
    reformatObject2(obj, isPatch = false, exclude = []) {
        const objTemp = obj;

        const isKeyNotNeeded = (key) =>
            exclude.includes(key) ||
            key.includes('up__') ||
            (!isPatch && objTemp[key] === null);

        const isKeyAnAssociation = (key) =>
            !key.startsWith('_') && key.split('_').length > 1;

        const keys = Object.keys(objTemp);
        keys.forEach((key) => {
            if (isKeyNotNeeded(key)) {
                delete objTemp[key];
            } else if (isKeyAnAssociation(key)) {
                objTemp[key.split(/_(.+)/)[0]] = objTemp[key]
                    ? {
                          [key.split(/_(.+)/)[1]]: objTemp[key],
                      }
                    : objTemp[key];
                delete objTemp[key];
            } else if (objTemp[key] instanceof Object) {
                const exclude2 = [...exclude, 'isBlocked'];
                if (Array.isArray(objTemp[key]) && isPatch) {
                    objTemp[key].forEach((entry) => {
                        const entryTemp = entry;
                        if (entry?._operation) {
                            this.reformatObject2(entry, true, exclude2);
                        } else {
                            this.reformatObject2(entry, false, exclude2);
                            entryTemp._operation = 'create';
                        }
                    });
                    objTemp[`${key}_delta`] = objTemp[key];
                    delete objTemp[key];
                } else {
                    this.reformatObject2(objTemp[key], isPatch, exclude2);
                }
            }
        });
    }

    /**
     * Adds missing keys in newKeys that is available in oldKeys with _operation: 'delete'
     * Adds _operation: 'patch' to objects that exists on both newKeys and oldKeys
     * @param {Object} obj modified request body / data / payload
     * @param {Object} oldKeys old object keys
     * @param {Object} newKeys current (new) object keys
     */
    reformatObject1(obj, oldKeys, newKeys) {
        const objTemp = obj;
        const oldKeysTemp = oldKeys;
        const newKeysTemp = newKeys;

        const keys = Object.keys(oldKeys);
        keys.forEach((key) => {
            if (oldKeys[key] instanceof Object) {
                if (Array.isArray(oldKeys[key])) {
                    objTemp[key] = objTemp[key] || [];
                    const oldKeysArray = oldKeys[key] || [];
                    const newKeysArray = newKeys[key] || [];

                    const newKeysStringifiedArray = newKeysArray.map(
                        (newKey) => {
                            setKeysAsNonEnumerable(newKey);
                            return JSON.stringify(getActualKeys(newKey));
                        }
                    );

                    oldKeysArray.forEach((oldKey, oldKeyIndex) => {
                        setKeysAsNonEnumerable(oldKey);
                        const oldKeyObj = getActualKeys(oldKey);
                        const newKeyIndex = newKeysStringifiedArray.findIndex(
                            (newKeyStr) =>
                                newKeyStr === JSON.stringify(oldKeyObj)
                        );
                        if (newKeyIndex < 0) {
                            objTemp[key].push({
                                _operation: 'forceDelete',
                                ...oldKeyObj,
                            });
                        } else {
                            this.reformatObject1(
                                objTemp[key][newKeyIndex],
                                oldKeysArray[oldKeyIndex],
                                newKeysArray[newKeyIndex]
                            );
                            objTemp[key][newKeyIndex]._operation = 'patch';
                        }
                    });
                } else {
                    objTemp[key] = obj[key] || {};
                    oldKeysTemp[key] = oldKeys[key] || {};
                    newKeysTemp[key] = newKeys[key] || {};

                    this.reformatObject1(
                        objTemp[key],
                        oldKeysTemp[key],
                        newKeysTemp[key]
                    );
                }
            }
        });
    }

    /**
     * Prepares the payload for MDI (v1) Change API
     * (i.e., object with the following properties: changeToken, operation, instance)
     * @param {Object} payload original request body / data / payload
     * @param {Object} exclude fields to remove from payload
     * @returns {Object} MDI request body / data / payload
     */
    createMDIPayload(payload, exclude) {
        const mdiPayload = {};
        if (payload?.mdiBookKeeping?.versionId) {
            const { keys, currentKeys, versionId } = payload.mdiBookKeeping;
            const oldKeys = JSON.parse(keys || '{}');
            const newKeys = { ...currentKeys } || {};
            setKeysAsNonEnumerable(oldKeys);
            setKeysAsNonEnumerable(newKeys);
            this.reformatObject1(payload, oldKeys, newKeys);
            this.reformatObject2(payload, true, exclude);

            mdiPayload.operation = 'patch';
            mdiPayload.previousVersionId = versionId;
        } else {
            this.reformatObject2(payload, false, exclude);
            mdiPayload.operation = 'create';
        }
        mdiPayload.changeToken = cds.utils.uuid();
        mdiPayload.instance = payload;

        return mdiPayload;
    }

    /**
     * Creates the MDI request configuration
     * @param {Object} addConfig additional configuration (e.g. fields to exclude)
     * @returns MDI request
     */
    build(addConfig = {}) {
        const { url, mdiBusPar, excludeFields, event, c4ufBusinessSystem } =
            addConfig;
        this.request = new cds.Request();
        if (url && mdiBusPar) {
            this.request.query = `${url}/${BPODMVERSION}/${mdiBusPar}/${this.type}`;
        } else {
            this.request.query = `${this.method} ${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/${this.type}`;
        }

        if (this.type === 'requests') {
            this.request.data = this.createMDIPayload(
                this.data || this.req.data,
                excludeFields
            );
        }

        if (event === 'create') {
            this.request.data.localIds = [
                MDIRequest.addLocalIds(
                    this.request.data.instance.id,
                    c4ufBusinessSystem,
                    'sap.oitc.889'
                ),
            ];
        }

        return this.request;
    }

    /**
     * Creates the MDI Product request configuration
     * @param {String} MDIProductLogAPI - MDI Product Log API
     * @returns {Object} MDI request
     */
    buildProduct(url, MDIProductLogAPI) {
        this.request.query = `${url}${ODMVERSION}${MDIProductLogAPI}/${this.type}`;

        return this.request;
    }

    static addLocalIds(id, c4ufBusinessSystem, additionalContext) {
        return {
            context: {
                application: 's4',
                tenant: c4ufBusinessSystem,
                type: 'sap.odm.businesspartner.BusinessPartner',
                additionalContext,
            },
            status: 'active',
            localId: id,
        };
    }
}

module.exports = MDIRequest;
