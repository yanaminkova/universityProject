const logger = require('cf-nodejs-logging-support');
const jwt = require('jsonwebtoken');
const ExecuteHttpRequest = require('../cloudSDKHelper/executeHttpRequest');

function decodeToken(req) {
    return jwt.decode(req.headers.authorization.split('Bearer ')[1])?.ext_attr
        .zdn;
}

async function sendRequest(url, reqConfig) {
    let response;
    switch (reqConfig.method) {
        case 'get':
            response = await ExecuteHttpRequest.get({ url }, reqConfig);
            break;
        case 'post':
            response = await ExecuteHttpRequest.post({ url }, reqConfig);
            break;
        case 'delete':
            response = await ExecuteHttpRequest.delete({ url }, reqConfig);
            break;
        default:
            logger.error(
                `[JobSchedulerHelper][sendRequest] `,
                `No valid method was provided: ${reqConfig.method}`
            );
            throw new Error('Internal Server Error');
    }
    return response;
}

module.exports = {
    decodeToken,
    sendRequest,
};
