/* eslint-disable no-param-reassign */
const xss = require('xss');
const logger = require('cf-nodejs-logging-support');

const servicesWithSanitizeReqHandler = new Set();

class XssSanitizer {
    static sanitizeData(inputData) {
        if (!inputData) {
            return inputData;
        }

        const xssParams = {
            whiteList: {},
            stripIgnoreTag: false,
            stripIgnoreTagBody: ['script'],
        };

        const type = typeof inputData;
        switch (type) {
            case 'object':
                Object.keys(inputData).forEach((key) => {
                    if (
                        typeof inputData[key] !== 'object' ||
                        !inputData[key]?.constructor
                    ) {
                        inputData[key] = XssSanitizer.sanitizeData(
                            inputData[key]
                        );
                    }
                });
                return inputData;
            case 'string':
                return xss(inputData, xssParams);
            default:
                return inputData;
        }
    }

    /**
     * @description should be added as before handler for CAP services.
     * It checks if request data contains scripts and raises error 400 in case of any occurence
     * @param {cds.Request} req
     */
    static sanitizeReq(req) {
        try {
            if (req.req?.query) {
                req.req.query = XssSanitizer.sanitizeData(req.req.query);
            }

            if (req.data) {
                req.data = XssSanitizer.sanitizeData(req.data);
            }

            // next lines are ignored because there's now yet a single express route with params
            // https://expressjs.com/en/guide/routing.html
            /* istanbul ignore next */
            // eslint-disable-next-line no-underscore-dangle
            req._params = XssSanitizer.sanitizeData(req.params);
        } catch (e) {
            logger.error(`[XssSanitizer] ${JSON.stringify(e)}`);
            logger.debug(
                `[XssSanitizer][req.req.query] ${JSON.stringify(
                    req.req?.query
                )}`
            );
            logger.debug(
                `[XssSanitizer][req.data] ${JSON.stringify(req.data)}`
            );
            logger.debug(
                `[XssSanitizer][req.params] ${JSON.stringify(req.params)}`
            );
        }
    }

    static sanitizerHandler(service) {
        if (!servicesWithSanitizeReqHandler.has(service.name)) {
            service.before('*', XssSanitizer.sanitizeReq);
            servicesWithSanitizeReqHandler.add(service.name);
        }
    }
}

module.exports = XssSanitizer;
