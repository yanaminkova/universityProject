/* eslint-disable no-underscore-dangle */
const logger = require('cf-nodejs-logging-support');
const pLimit = require('p-limit');
const axios = require('axios');
const MDIObjectModifier = require('./MDIObjectModifier');
const { getBundle } = require('../lib/helper');
const { translateProductLog } = require('./MDIClientHelper');
const { getNextLink } = require('./MDIClientHelper');

const i18nPath = '../../_i18n/i18n';

const defaultMaxPageSize = 100;
const defaultConcurrency = 5;

class MDIClientInbound {
    /**
     * @param {Object} cds.Request - Request Object.
     * @param {Object} log - Log received from MDI.
     * @param {Object} service - Service object.
     * @param {String} entity - Entity name.
     * @param {Integer} maxPageSize - Maximum Page Size of MDI request.
     */
    constructor(req, service, entity, dbTableName, maxpagesize) {
        this._req = req;
        this._service = service;
        this._entity = entity;
        this._dbTableName = dbTableName;

        this._status = {
            created: 0,
            updated: 0,
            failed: 0,
        };

        this._maxPageSize = maxpagesize || defaultMaxPageSize;
        this._limit = pLimit(defaultConcurrency);
        this._bundle = getBundle(this._req, i18nPath);
    }

    get status() {
        return this._status;
    }

    static getErrorMessage(errorCode) {
        switch (errorCode) {
            case 'ASSERT_NOT_NULL':
                return 'errorMsgMdiAssertNotNull';
            case 'ASSERT_REFERENCE_INTEGRITY':
                return 'errorMsgMdiAssertReferenceIntegraty';
            default:
                return errorCode;
        }
    }

    /**
     * Filters the exposed fields and creates an object ready for insert/update to database
     *  @param {Object} instance - An instance to be replicated to the database.
     *  @return {Object} - A new object with a list of elements.
     */
    createObject(instance) {
        return new MDIObjectModifier(instance)
            .fitToEntity(this._service, this._entity.name)
            .getModifiedObject();
    }

    /**
     * Extract the log received from MDI
     * @param {Object} instances - List of instances to be replicated to the database.
     * @return {Object} createInstanceIds - List of instances to be inserted/updated to the database.
     */
    extractLog(instances) {
        const createInstanceIds = {};

        instances.forEach((item) => {
            const { instance, event } = item;

            const action = translateProductLog(
                event,
                instance,
                createInstanceIds
            );

            if (action === 'create' || action === 'update') {
                createInstanceIds[item.instance.id] = this.createObject(
                    item.instance
                );
            }
        });
        return createInstanceIds;
    }

    /**
     * Processes the instances received from MDI
     * @param {Object} instances - List of instances to be replicated to the database.
     * @return {Promise<Array>} errorList - List of errors occured during create/updated
     */
    async processInstances(instances, deltaToken) {
        const instancesFromMDI = this.extractLog(instances);
        return this.upload(instancesFromMDI, deltaToken);
    }

    /**
     * Stores an error message to the db
     * @param {Object} errorEntry - Error details displayed to the end user
     */
    static async storeErrorMessage(errors) {
        const db = await cds.connect.to('db');
        const tx = db.tx();
        try {
            await tx.run(
                INSERT.into(
                    'sap.c4u.foundation.retailer.mdiclient.MDIErrorTable',
                    errors
                )
            );
            await tx.commit();
        } catch (e) {
            await tx.rollback();
            logger.error(
                `[MDIClientInbound][storeErrorMessage]: An error occured while saving error message. 
                Error message: ${e.code} ${e.message} ${e.target}`
            );
        }
    }

    /**
     * Prepares an error message for display to the end user
     * @param {Object} error - Error details obtained from a database query
     * @param {Array} instances - Instance failed during create/update
     * @param {String} deltaToken - Current delta token
     * @return {Object} errorEntry - Error details displayed to the end user
     */
    prepareErrorMessage(error, instance, deltaToken) {
        const message = MDIClientInbound.getErrorMessage(error?.message);
        const errorMessage = error?.target
            ? `${this._bundle.getText(message, [error.target])}`
            : `${this._bundle.getText(message)}`;

        logger.error(
            `[MDIClientInbound][prepareErrorMessage]: An error occured while updating the product with displayId ${instance[1].displayId}. 
            Error message: ${errorMessage}`
        );

        return {
            id: instance[0],
            displayId: instance[1].displayId,
            errorMessage,
            deltaToken,
            createdAt: Date.now(),
        };
    }

    /**
     * Uploads entries to database
     * @param {Array} instances - List of entries to be created/updated
     * @return {Array} errorList - List of errors occured during create/update
     */
    async upload(instances, deltaToken) {
        const errorList = [];
        const db = await cds.connect.to('db');

        await Promise.all(
            Object.entries(instances).map(async (instance) =>
                this._limit(async () => {
                    const tx = db.tx();
                    try {
                        const entryExist = await tx.run(
                            SELECT.one
                                .from(this._dbTableName)
                                .where({ id: instance[0] })
                        );

                        if (entryExist) {
                            const updateQuery = UPDATE(this._dbTableName)
                                .data(instance[1])
                                .where({ id: instance[0] });
                            const updatedRows = await tx.run(updateQuery);
                            await tx.commit();
                            this._status.updated += updatedRows;
                        } else {
                            await tx.run(
                                INSERT.into(this._dbTableName, instance[1])
                            );
                            await tx.commit();
                            this._status.created += 1;
                        }
                    } catch (error) {
                        await tx.rollback();
                        this._status.failed += 1;

                        const errorArray =
                            error?.details && error?.details.length > 0
                                ? error.details
                                : [error];
                        const errors = errorArray.map((e) =>
                            this.prepareErrorMessage(e, instance, deltaToken)
                        );

                        await MDIClientInbound.storeErrorMessage(errors);
                        errorList.push(...errors);
                    }
                })
            )
        );

        logger.info(
            `[MDIClientInboud][upload]: 
            "Created products":  ${this._status.created},
            "Updated products":  ${this._status.updated},
            "Non-replicated products":  ${this._status.failed}`
        );
        return errorList;
    }

    /**
     * Stores the value of the last processed delta token
     * @param {String} deltaToken - Delta Token value.
     * @param {enum} status - Status of DeltaTokenBookKeeping.
     * @param {enum} type - Type of DeltaTokenBookKeeping (e.g. 'BP, PR').
     */
    static async storeDeltaToken(deltaToken, status, type) {
        const db = await cds.connect.to('db');
        const tx = db.tx();
        try {
            await tx.run(
                INSERT.into(
                    'sap.c4u.foundation.retailer.mdiclient.DeltaTokenBookKeeping',
                    {
                        deltaToken,
                        status,
                        type,
                        createdAt: Date.now(),
                    }
                )
            );
            await tx.commit();
        } catch (error) {
            await tx.rollback();
            logger.info(
                `[MDIClientInbound][storeDeltaToken] Error message: ${error.message}`
            );
        }
    }

    /**
     * Retrieves the list of instances from MDI
     * @param {string} accessToken  http request access toke
     * @returns {Promise<Object>} service manager instance configuration
     */
    async _retrieveInstances(request, accessToken) {
        try {
            const results = await axios.get(`${request}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Prefer: `odata.maxpagesize=${this._maxPageSize}`,
                },
                proxy: false,
                xsrfCookieName: 'XSRF-TOKEN',
                xsrfHeaderName: 'X-XSRF-TOKEN',
            });
            return results ? results.data : null;
        } catch (error) {
            logger.info(
                `[MDIClientInbound][retrieveInstances]: Error message ${error.message}`
            );
            return null;
        }
    }

    /**
     * Replicates instances in C4U received from MDI
     * @param {String} mdiDestService - Destination service of Master Data Integration.
     * @param {String} token - Delta token value.
     * @param {Object} request - CDS request.
     * @param {enum} type - Type of DeltaTokenBookKeeping (e.g. 'BP, PR').
     * @return {Object<Array>} errorResponse - List of errors to display to the end user
     */
    async replicate(mdiDestService, token, request, type) {
        let deltaToken = token;
        const logRequest = request;
        const baseRequest = logRequest.query;
        const accessToken = mdiDestService.authTokens[0].value;

        const errorResponse = [];
        let moreData = true;
        while (moreData) {
            // eslint-disable-next-line no-await-in-loop
            const logRequestUrl = deltaToken
                ? `${baseRequest}?$deltatoken=${deltaToken}`
                : logRequest.query;

            /*
             * Disabling ESLint for await-in-loop as we need the response of the call to decide on the next iteration
             */
            /* eslint-disable no-await-in-loop */
            const response = await this._retrieveInstances(
                logRequestUrl,
                accessToken
            );

            if (!response) {
                throw new Error(
                    `${this._bundle.getText('errorMsgMDINoResponseFromMDI')}`
                );
            }

            const { value } = response;

            logger.info(`[MDIClientInbound][replicate]:
                    "Number of instances fetched from destination C4UF-MDI":  ${value.length},
                    "Maximum page size":  ${this._maxPageSize},
                    "Concurrency limit":  ${defaultConcurrency},
                    "Processed delta token":  ${deltaToken}`);

            const { nextLink, finalToken } = getNextLink(response);

            if (value.length) {
                const errorList = await this.processInstances(
                    value,
                    deltaToken
                );
                if (errorList) {
                    errorResponse.push(...errorList);
                }

                deltaToken = finalToken;
                moreData = nextLink !== undefined;

                if (deltaToken) {
                    await MDIClientInbound.storeDeltaToken(
                        deltaToken,
                        'success',
                        type
                    );
                }
            } else {
                logger.info(`[MDIClientInbound][replicate][MDINoValue]:
                    "Total amount of created products":  ${this._status.created},
                    "Total amount of updated products":  ${this._status.updated},
                    "Total amount of non-replicated products":  ${this._status.failed}`);

                moreData = false;
            }
        }
        return errorResponse;
    }
}
module.exports = MDIClientInbound;
