const soap = require('soap');
const passport = require('passport');
const logger = require('cf-nodejs-logging-support');

class SoapServiceInitializer {
    constructor(soapPath, wsdlPath, impl, loggerScope) {
        this.soapPath = soapPath;
        this.wsdlPath = wsdlPath;
        this.impl = impl;
        this.loggerScope = loggerScope;
    }

    initService(app) {
        try {
            // Add JWT authentication for this soap path
            app.use(
                this.soapPath,
                passport.authenticate('JWT', { session: false })
            );

            const xml = require('fs').readFileSync(this.wsdlPath, 'utf8');
            const server = soap.listen(
                app,
                this.soapPath,
                this.impl,
                xml,
                () => {
                    logger.info(
                        `${this.loggerScope}[SoapServiceInitializer] Serving BillableItemsCreateConfirmService`
                    );
                }
            );
            server.on('request', (request, methodName) => {
                // Log;
                logger.debug(
                    `${this.loggerScope}[request] ${this.soapPath}`,
                    JSON.stringify(request),
                    JSON.stringify(methodName)
                );
            });
        } catch (e) {
            /* istanbul ignore next */
            logger.error(
                `${this.loggerScope}[SoapServiceInitializer] ${JSON.stringify(
                    e
                )}`
            );
            /* istanbul ignore next */
            throw new Error(e);
        }
    }
}

module.exports = SoapServiceInitializer;
