/* eslint-disable no-underscore-dangle */
const xsenv = require('@sap/xsenv');
const auditLogging = require('@sap/audit-logging');
const logger = require('cf-nodejs-logging-support');
const EntitiesHelper = require('./EntitiesHelper');
const DataSubjectBuilder = require('./DataSubjectBuilder');

const {
    AUDIT_LOG_DEFAULT,
    POTENTIALLY_SENSITIVE,
    POTENTIALLY_PERSONAL,
    FIELD_SEMANTICS,
} = require('./DataPrivacyAndProtectionConstants');

const update = 'update';
const read = 'read';

const auditLogCredentials =
    xsenv.filterServices({ tag: 'auditlog' }).length > 0
        ? xsenv.serviceCredentials({ tag: 'auditlog' })
        : null;

let auditLogDefaultClient;
if (auditLogCredentials) {
    auditLogCredentials.requestAgentOptions = {
        keepAlive: true,
        maxSocket: 4,
        timeout: 5000,
    };
    auditLogging.v2(auditLogCredentials, (err, client) => {
        if (err) {
            /* istanbul ignore next */
            logger.error('[auditLog]: Error occurred instantiating audit log');
        } else {
            auditLogDefaultClient = client;
        }
    });
} else {
    logger.warn('[auditLog]: No audit log configuration available');
}

class AuditLogBuilder {
    /**
     * @param {Object} params
     * @param {cds.Request} params.req - required
     */
    constructor(params) {
        this._req = params.req;
        this._auditLogClient = params.auditLogClient || auditLogDefaultClient;
        this._default = params.DEFAULT || AUDIT_LOG_DEFAULT;
        this._logger = params.logger || logger;
        this._dataSubjectAttribute = this.default;
        this._deleteLogging = params.deleteLogging
            ? params.deleteLogging
            : false;

        if (!this._req) {
            throw new Error('[AuditLogBuilder] params.req is required');
        }

        if (!this._req.entity) {
            throw new Error('[AuditLogBuilder] No entity name provided');
        }

        if (!this._auditLogClient) {
            throw new Error('[AuditLogBuilder] No audit log client provided');
        }
    }

    /**
     * Indicates the public method for adding attributes to audit log message
     * @param {Object} data - Request data.
     * @param {Object} oldData - Data before this request.
     * @param {String} entityName - Entity name.
     * @param {String} prefix - Prefix value.
     * @returns {Object} - Audit log message.
     */
    addAttributes(
        data,
        oldData,
        entityName = null,
        prefix = '',
        sensitive = false
    ) {
        if (!this.auditLog || !data) {
            return this;
        }
        this.sensitive = sensitive;

        let old = oldData;
        if (old && old._old) {
            old = Object.assign(old, old._old);
        }

        const elements = EntitiesHelper.getEntityElements(
            entityName || this.entityName
        );
        const dot = prefix === '' ? '' : '.';

        const personalAttributes = this._getPersonalAttributes(elements);

        this._getPersonalAttributesToAuditLog(
            personalAttributes,
            data,
            old,
            prefix,
            dot
        );

        const targetAttributes = elements.filter((element) => element.target);

        this._getTargetAttributesToAuditLog(
            targetAttributes,
            data,
            old,
            prefix,
            dot
        );

        return this;
    }

    /**
     * Indicates the public method for adding data subject to audit log message
     * @param {Object} data - Request data.
     * @returns {Object} - Audit log message.
     */
    addDataSubject(data) {
        this._dataSubjectPromise = new Promise((resolve, reject) => {
            const dataSubjectBuilder = new DataSubjectBuilder({
                req: this.req,
                entityName: this.entityName,
                sourceData: data,
            });

            dataSubjectBuilder
                .findDataSubjectEntity()
                .findDataSubject()
                .then(() => {
                    try {
                        this._dataSubjectAttribute =
                            dataSubjectBuilder.dataSubjectAttribute;
                        this.dataSubjectId =
                            dataSubjectBuilder.dataSubjectAttrValue;

                        if (!this.auditLog) {
                            resolve();
                        }

                        if (!this._dataSubjectAttribute) {
                            this.logger.warn(
                                '[AuditLogBuilder] No dataSubjectAttribute provided'
                            );
                        }

                        if (!this.dataSubjectId) {
                            this.logger.warn(
                                '[AuditLogBuilder] No dataSubjectId provided'
                            );
                        }

                        this.auditLog.dataSubject({
                            type: 'BusinessPartner',
                            id: {
                                value: this.dataSubjectId || this.default,
                            },
                        });
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                });
        });

        return this;
    }

    /**
     * Indicates the public method for buidling audit log message
     *
     * @returns {Object} - audit log message.
     */
    async build() {
        await this.dataSubjectPromise;

        // eslint-disable-next-line no-underscore-dangle
        if (this.auditLog._content.attributes.length === 0) {
            throw new Error(
                '[AuditLogBuilder] No personal attributes provided'
            );
        }

        return this.auditLog;
    }

    /**
     * Indicates the public method for reading audit log message by adding audit client
     * @param {Object} data - Request data.
     * @returns {Object} - Audit log message.
     */
    read(data) {
        const keyAttributes = EntitiesHelper.getKeyAttributesNames(
            this.entityName
        );
        const keys = keyAttributes.map((attr) =>
            data && data[attr] ? data[attr] : this.default
        );
        if (keys.length === 0 || keys[0] === this.default) {
            this.logger.warn('[AuditLogBuilder] No keys provided');
        }

        this.auditLog = this.auditLogClient[read]({
            type: this.entityName,
            id: {
                key: keys.length > 0 ? keys.join() : this.default,
            },
        })
            .tenant(this.tenant || this.default)
            .by(this.userId || this.default);

        return this;
    }

    /**
     * Indicates the public method for updating audit log message by adding audit client
     * @param {Object} data - Request data.
     * @returns {Object} - Audit log message.
     */
    update(data) {
        const keyAttributes = EntitiesHelper.getKeyAttributesNames(
            this.entityName
        );
        const keys = keyAttributes.map((attr) =>
            data && data[attr] ? data[attr] : this.default
        );
        if (keys.length === 0 || keys[0] === this.default) {
            this.logger.warn('[AuditLogBuilder] No keys provided');
        }

        this.auditLog = this.auditLogClient[update]({
            type: this.entityName,
            id: {
                key: keys.length > 0 ? keys.join() : this.default,
            },
        })
            .tenant(this.tenant || this.default)
            .by(this.userId || this.default);

        return this;
    }

    /**
     * Indicates the private method for getting attributes marked as personal
     * @param {Object} elements - Entity elements.
     * @returns {Array} -List of personal attributes.
     */
    _getPersonalAttributes(elements) {
        return elements
            .filter((element) => {
                if (this.sensitive) {
                    return element[POTENTIALLY_SENSITIVE];
                }

                return (
                    element[FIELD_SEMANTICS] ||
                    element[POTENTIALLY_PERSONAL] ||
                    element[POTENTIALLY_SENSITIVE]
                );
            })
            .map((entry) => entry.name);
    }

    /**
     * Indicates the private method for getting old attributes if they are of type object
     * @param {Object} old - Data before this request.
     * @returns {Array} -String of value in old data.
     */
    _getOld(old, attribute) {
        return typeof old[attribute] === 'object'
            ? JSON.stringify(old[attribute]) || this.default
            : old[attribute] || this.default;
    }

    /**
     * Indicates the private method for adding personal attributes to audit log message
     * @param {Array} personalAttributes - List of personal attributes.
     * @param {Object} data - Request data.
     * @param {Object} oldData - Data before this request.
     * @param {String} entityName - Entity name.
     * @param {String} prefix - Prefix value.
     */
    _getPersonalAttributesToAuditLog(
        personalAttributes,
        data,
        old,
        prefix,
        dot
    ) {
        personalAttributes
            .filter((attribute) => data[attribute] || (old && old[attribute]))
            .forEach((attribute) => {
                const newValue =
                    typeof data[attribute] === 'object'
                        ? JSON.stringify(data[attribute]) || this.default
                        : data[attribute] || this.default;

                if (this._deleteLogging) {
                    this.auditLog.attribute({
                        name: `${prefix}${dot}${attribute}`,
                        new: this.default,
                        old: newValue,
                    });
                } else {
                    this.auditLog.attribute({
                        name: `${prefix}${dot}${attribute}`,
                        new: newValue,
                        old: old
                            ? this._getOld(old, attribute) || this.default
                            : this.default,
                    });
                }
            });
    }

    /**
     * Indicates the private method for adding target attributes to audit log message
     * @param {Array} targetAttributes - List of target attributes.
     * @param {Object} data - Request data.
     * @param {Object} oldData - Data before this request.
     * @param {String} entityName - Entity name.
     * @param {String} prefix - Prefix value.
     */
    _getTargetAttributesToAuditLog(targetAttributes, data, old, prefix, dot) {
        targetAttributes.forEach((attribute) => {
            const { target } = attribute;
            let attributesToAdd;

            if (data[attribute.name]) {
                attributesToAdd = data[attribute.name];
            } else if (old && old[attribute]) {
                attributesToAdd = old[attribute.name];
            }

            if (attributesToAdd) {
                let isPreffixAddition = true;
                if (!Array.isArray(attributesToAdd)) {
                    attributesToAdd = [attributesToAdd];
                    isPreffixAddition = false;
                }

                attributesToAdd.forEach((entry, idx) => {
                    const preffixAddition = isPreffixAddition ? `[${idx}]` : '';
                    this.addAttributes(
                        entry,
                        old ? old[attribute] : null,
                        target,
                        `${prefix}${dot}${attribute.name}${preffixAddition}`,
                        this.sensitive
                    );
                });
            }
        });
    }

    get auditLogClient() {
        return this._auditLogClient;
    }

    get dataSubjectPromise() {
        return this._dataSubjectPromise;
    }

    get default() {
        return this._default;
    }

    get entityName() {
        return this.req.entity;
    }

    get logger() {
        return this._logger;
    }

    get req() {
        return this._req;
    }

    get reqParams() {
        return this._req.params;
    }

    get tenant() {
        return this._req.user.tenant;
    }

    get userId() {
        if (!this._req.user.id) {
            throw new Error('[AuditLogBuilder] No user id provided');
        }
        return this._req.user.id;
    }
}

module.exports = AuditLogBuilder;
