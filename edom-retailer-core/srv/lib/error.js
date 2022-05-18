const logger = require('cf-nodejs-logging-support');

const extractAxiosStatusCode = (error, code) => {
    if (error.response) {
        return code >= 400 && code < 600 ? error.response.status : code;
    }

    return code;
};

const extractAxiosDebugPayload = (error, code) => {
    if (error.response) {
        return error.response.data;
    }

    return code;
};

const extractAxiosError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return error.response.data.message;
    }

    if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        return error.request;
    }
    // Something happened in setting up the request that triggered an Error
    return error.message;
};

const handleError = (error, req, code = 500, scope = null, debug = null) => {
    let statusCode = code;
    let message = error.message || error;
    let debugPayload = debug || null;
    const loggerScope = scope ? `${scope}: ` : '';

    if (error.isAxiosError) {
        statusCode = extractAxiosStatusCode(error, statusCode);
        debugPayload = extractAxiosDebugPayload(error, debugPayload);
        message = extractAxiosError(error);
    }

    message = typeof message === 'object' ? JSON.stringify(message) : message;

    logger.error(`${loggerScope}${message}`);
    if (debugPayload) {
        if (debugPayload.message) {
            delete debugPayload.message;
        }
        const debugMessage = JSON.stringify(debugPayload);
        logger.debug(`${loggerScope}${debugMessage}`);
    }

    if (code >= 400 && code < 600) {
        if (req && req.error) {
            req.error(statusCode, message);
        } else {
            throw new Error(message);
        }
    }
};

module.exports = {
    ERROR_STATUS_CODE: {
        INTERNAL_SERVER_ERROR: 500,
        NOT_FOUND: 404,
    },

    ERROR_TYPE: {},

    ERROR_MESSAGE: {},

    SOURCE_SYSTEM: {
        TUA_COMMERCE: 'tuacommerce',
        MACO: 'MaCo',
    },
    handleError,
};
