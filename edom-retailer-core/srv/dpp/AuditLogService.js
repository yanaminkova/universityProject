/* eslint-disable no-underscore-dangle */
const cds = require('@sap/cds');
const xsenv = require('@sap/xsenv');
const logger = require('cf-nodejs-logging-support');
const AuditLogBuilder = require('./AuditLogBuilder');
const { reformatObject } = require('../mdiclient/MDIRequest').prototype;
const { getEnabledFeatures } = require('../lib/helper');
const config = require('../lib/config');

const OPERATION_INSERT = '@AuditLog.Operation.Insert';
const OPERATION_UPDATE = '@AuditLog.Operation.Update';
const OPERATION_DELETE = '@AuditLog.Operation.Delete';
const OPERATION_READ = '@AuditLog.Operation.Read';
const auditLogCredentials =
    xsenv.filterServices({ tag: 'auditlog' }).length > 0
        ? xsenv.serviceCredentials({ tag: 'auditlog' })
        : null;
const { tenantid: providerTenantId } =
    xsenv.filterServices({ tag: 'xsuaa' }).length > 0
        ? xsenv.serviceCredentials({ tag: 'xsuaa' })
        : {};
const bpBetaFeatureFlag = 'business-partner-enhancements';

/**
 * Retrieves an array of entities within the given service that requires audit logging.
 *
 * @param  {} serviceName: Defines the name of the CDS service to be audit logged
 * @param  {} operation: Defines the audit log operation
 */
function getAuditLogEntities(serviceName, operation) {
    const { definitions } = cds.model;
    return Object.entries(definitions)
        .filter(
            (entry) =>
                entry[0].startsWith(serviceName) &&
                entry[1].kind === 'entity' &&
                entry[1][operation]
        )
        .map((entry) => entry[0]);
}
/**
 * Check if audit logging is required given data
 *
 * @param  {} entityName
 * @param  {} data
 */
function requiresAuditLogging(entityName, data, sensitive = false) {
    const { definitions } = cds.model;
    const entity = definitions[entityName];
    let requires = Object.entries(entity.elements)
        .filter((entry) =>
            sensitive
                ? entry[1]['@PersonalData.IsPotentiallySensitive']
                : entry[1]['@PersonalData.FieldSemantics'] ||
                  entry[1]['@PersonalData.IsPotentiallyPersonal'] ||
                  entry[1]['@PersonalData.IsPotentiallySensitive']
        )
        .map((entry) => entry[0])
        .some((attribute) => data[attribute] != null);
    if (requires) {
        return true;
    }

    // Recursively evaluate associations/compositions
    requires = Object.entries(entity.elements)
        .filter((entry) => entry[1].target)
        .map((entry) => entry[0])
        .some((attribute) => {
            if (data[attribute]) {
                const { target } = entity.elements[attribute];
                return Array.isArray(data[attribute])
                    ? data[attribute].some((entry) =>
                          requiresAuditLogging(target, entry, sensitive)
                      )
                    : requiresAuditLogging(target, data[attribute], sensitive);
            }
            return false;
        });

    return requires;
}

/**
 *
 * Error logging
 *
 * @param  {Object} err: Defines the Error details
 */
function logError(err) {
    if (err) {
        logger.error(`[AuditLogService]: Audit log failed: ${err.message}`);
    } else {
        logger.info(`[AuditLogService]: Audit log successful`);
    }
}

/**
 *
 * Prepare Audit Logging message
 *
 * @param  {} message: Defines the Audit log message
 */
function prepareAuditLogMessage(message, read) {
    if (read) {
        message.log((err) => {
            logError(err);
        });
    } else {
        message.logPrepare(() => {
            message.logSuccess((err) => {
                logError(err);
            });
        });
    }
}

/**
 *
 * Create Audit Logging entry for READ operation
 * @param  {Object} data: Request Data
 * @param  {Object} req: Request Object
 */
async function createReadAuditLogEntry(reqData, req) {
    let data = reqData;

    if (!reqData) {
        throw new Error(
            '[AuditLogService][createReadAuditLogEntry] data is undefined'
        );
    }

    data = data.value ? data.value : data;
    data = Array.isArray(data) ? data : [data];

    data.forEach(async (singleData) => {
        if (requiresAuditLogging(req.entity, singleData, true)) {
            const auditLogBuilder = new AuditLogBuilder({ req });
            const message = await auditLogBuilder
                .read(singleData)
                .addAttributes(singleData, null, null, '', true)
                .addDataSubject(singleData)
                .build();
            prepareAuditLogMessage(message, true);
        }
    });
}

async function createDeleteAuditLogEntry(req) {
    const enabledFeatures = await getEnabledFeatures(req, [bpBetaFeatureFlag]);
    if (enabledFeatures.includes(bpBetaFeatureFlag)) {
        let data = req._.auditlogDiff;

        data = data.value ? data.value : data;
        data = Array.isArray(data) ? data : [data];

        data.forEach(async (singleData) => {
            if (requiresAuditLogging(req.entity, singleData)) {
                const auditLogBuilder = new AuditLogBuilder({
                    req,
                    deleteLogging: true,
                });
                const message = await auditLogBuilder
                    .update(singleData)
                    .addAttributes(singleData, null, null, '')
                    .addDataSubject(singleData)
                    .build();
                prepareAuditLogMessage(message);
            }
        });
    }
}

/**
 *
 * Create Audit Logging entry for CREATE/UPDATE operation
 * @param  {Object} data: Request Data
 * @param  {Object} req: Request Object
 */
async function createUpdateAuditLogEntry(requestData, req) {
    let data = requestData;
    let messages = [];
    if (typeof data !== 'undefined' && req.loggedData.includes(data)) {
        // if the data was already logged
        return {};
    }

    const diff = req._.auditlogDiff;
    if (typeof data === 'undefined') {
        const reqData = Array.isArray(req.data) ? req.data[0] : req.data;
        data = reformatObject(reqData);

        const auditLogBuilder = new AuditLogBuilder({ req });
        const message = await auditLogBuilder
            .update(req, data)
            .addAttributes(data, diff ? diff._old : null)
            .addDataSubject(data)
            .build();
        messages.push(message);
        return messages;
    }

    data = data.value ? data.value : data;
    data = Array.isArray(data) ? data : [data];

    const messagePromises = data.map(async (singleData) => {
        const auditLogBuilder = new AuditLogBuilder({ req });
        return auditLogBuilder
            .update(singleData)
            .addAttributes(singleData, diff ? diff._old : null)
            .addDataSubject(singleData)
            .build();
    });
    messages = await Promise.all(messagePromises);

    req.loggedData.push(JSON.stringify(data));
    return messages;
}

/**
 *
 * Set a req element that will presave data already logged to avoid duplicate audit logging messages
 * @param  {Object} req: Request Object
 */
function setLoggedData(req) {
    if (!req.loggedData) {
        req.loggedData = [];
    }
}

/**
 *
 * move ._old attributes recursively from a json payload to its root level and return the root level object
 * @param {Object} diff: json object with _old attribute
 */
function removeOlds(diff) {
    const res = { ...diff };
    Object.keys(res).forEach((key) => {
        if (Array.isArray(res[key])) {
            const tempArr = [];
            res[key].forEach((element) => {
                tempArr.push(removeOlds(element));
            });
            res[key] = tempArr;
        } else if (typeof res[key] === 'object' && key !== '_old') {
            res[key] = removeOlds(res[key]);
        } else if (key === '_old') {
            Object.assign(res, res[key]);
            delete res[key];
        }
    });
    return res;
}

async function saveAuditLogDiff(req) {
    const enabledFeatures = await getEnabledFeatures(req, [bpBetaFeatureFlag]);
    if (enabledFeatures.includes(bpBetaFeatureFlag)) {
        let diff = await req.diff();
        diff = removeOlds(diff);
        delete diff._old;
        req._.auditlogDiff = diff;

        if (requiresAuditLogging(req.entity, diff)) {
            setLoggedData(req);
        }
    }
}

class AuditLogService {
    /**
     *
     * Register audit log handler for cds service
     *
     * @param  {} srv: Defines the cds service
     */
    static registerHandler(srv) {
        if (!auditLogCredentials) {
            logger.warn(
                `[AuditLogService][registerHandler]: Could not register auditlog for service ${srv.name}`
            );
            return;
        }

        const beforeHandler = async (req) => {
            if (requiresAuditLogging(req.entity, req.data)) {
                const diff = await req.diff();
                req._.auditlogDiff = diff;
                setLoggedData(req);
            }
        };

        const beforeDeleteHandler = async (req) => {
            await saveAuditLogDiff(req);
        };

        const afterHandler = async (data, req) => {
            try {
                const messages = await createUpdateAuditLogEntry(data, req);
                req.on('succeeded', () => {
                    if (data) {
                        messages.forEach((message) =>
                            prepareAuditLogMessage(message)
                        );
                    }
                });
            } catch (err) {
                logger.error(`[AuditLogService]: ${err.message}`);
            }
        };

        const afterReadHandler = async (_, req) => {
            req.on('succeeded', async (data) => {
                try {
                    await createReadAuditLogEntry(data, req);
                } catch (err) {
                    logger.error(
                        `[AuditLogService][afterReadHandler]: ${JSON.stringify(
                            err
                        )}`
                    );
                }
            });
        };

        const afterDeleteHandler = async (_, req) => {
            try {
                req.on('succeeded', async () => {
                    await createDeleteAuditLogEntry(req);
                });
            } catch (err) {
                logger.error(
                    `[AuditLogService][afterDeleteHandler]: ${JSON.stringify(
                        err
                    )}`
                );
            }
        };

        const afterFailedRequestHandler = async (err, req) => {
            const errorCode = parseInt(err.code, 10);
            if (errorCode === 403) {
                await AuditLogService.createSecurityLog({
                    action: `${req.req.method} ${req.req.originalUrl}`,
                    errorCode: 403,
                    msg: config.ERROR_FORBIDDEN,
                });
            }
        };

        srv.before(
            'CREATE',
            getAuditLogEntities(srv.name, OPERATION_INSERT),
            beforeHandler
        );
        srv.before(
            'UPDATE',
            getAuditLogEntities(srv.name, OPERATION_UPDATE),
            beforeHandler
        );
        srv.before(
            'DELETE',
            getAuditLogEntities(srv.name, OPERATION_DELETE),
            beforeDeleteHandler
        );

        srv.after(
            'CREATE',
            getAuditLogEntities(srv.name, OPERATION_INSERT),
            afterHandler
        );
        srv.after(
            'UPDATE',
            getAuditLogEntities(srv.name, OPERATION_UPDATE),
            afterHandler
        );
        srv.after(
            'DELETE',
            getAuditLogEntities(srv.name, OPERATION_DELETE),
            afterDeleteHandler
        );
        srv.after(
            'READ',
            getAuditLogEntities(srv.name, OPERATION_READ),
            afterReadHandler
        );
        srv.on('error', afterFailedRequestHandler);
    }

    /**
     * Create Audit Logging entry for HIGH severity monitoring use-case - 401/403 errors
     *
     * @static
     * @param {*} data: SecurityLogData { action, type, msg  }
     * @memberof AuditLogService
     */
    static async createSecurityLog(data) {
        const auditLogService = await cds.connect.to('audit-log');

        await auditLogService.send('securityLog', {
            // eslint-disable-next-line no-useless-escape
            action: `\"${data.action}\"`,
            data: JSON.stringify({
                errorCode: data.errorCode,
                tenant: providerTenantId,
                msg: data.msg,
            }),
        });
    }
}
module.exports = AuditLogService;
