/* eslint-disable no-underscore-dangle */
const pLimit = require('p-limit');
const os = require('os');

const { stdout } = process;

const cdsLogSingleton = cds.log;
const logLevels = cdsLogSingleton.levels;
const defaultLogger = cdsLogSingleton.Logger;
const limit = pLimit(1);

async function getLogLevel(req) {
    const featureFlag = await cds.connect.to('featureFlags');
    const result = await featureFlag.evaluate('log_level', req?.tenant, true);
    return result;
}

function isLogRequired(flagLevel, level) {
    return (
        typeof flagLevel === 'boolean' ||
        logLevels[level.toUpperCase()] <= logLevels[flagLevel.toUpperCase()]
    );
}

function Logger(module, prefix) {
    this._defaultLogger = defaultLogger(module, 'TRACE', prefix);
    this.level = 'TRACE';
    this._trace = true;
    this._debug = true;
    this._info = true;
    this._warn = true;
    this._error = true;

    this.isLogRequired = isLogRequired;

    this.writeLog = async (level, ...args) => {
        const req = args?.[args.length - 1]?.tenant;

        const flagLevel = (await this.getLogLevel(req)) || 'INFO';
        if (this.isLogRequired(flagLevel, level)) {
            /* istanbul ignore if */
            if (args?.[0]?.level) {
                // eslint-disable-next-line no-param-reassign
                delete args[0].level;
            }
            /* istanbul ignore if */
            if (typeof args?.[0] === 'object' && !args?.[0].stack) {
                /* istanbul ignore next */
                // eslint-disable-next-line no-param-reassign
                args[0].stack = Error().stack;
            }

            this._defaultLogger[level](...args);
        }
    };

    this.enqueue = async (level, ...args) => {
        limit(() => this.writeLog(level, ...args));
    };

    this.getLogLevel = getLogLevel;

    this.trace = async (...args) => {
        this.enqueue('trace', ...args);
    };

    this.debug = async (...args) => {
        this.enqueue('debug', ...args);
    };

    this.log = async (message, req) => {
        this.enqueue('info', message, req);
    };

    this.info = async (...args) => {
        this.enqueue('info', ...args);
    };

    this.warn = async (...args) => {
        this.enqueue('warn', ...args);
    };

    this.error = async (...args) => {
        this.enqueue('error', ...args);
    };
}

async function cfLoggerFunction(level, output) {
    let tenant;

    try {
        const parseOutput = JSON.parse(output);
        tenant = parseOutput.tenant_id !== '-' ? parseOutput.tenant_id : tenant;
    } finally {
        const flagLevel = await getLogLevel({ tenant });
        if (isLogRequired(flagLevel, level)) {
            stdout.write(output + os.EOL);
        }
    }
}

async function cfLoggerSinkFunction(level, output) {
    limit(() => cfLoggerFunction(level, output));
}

module.exports = { Logger, cfLoggerSinkFunction };
