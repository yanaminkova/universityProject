/* eslint-disable no-underscore-dangle */
const logger = require('cf-nodejs-logging-support');
const { TextBundle } = require('@sap/textbundle');
const { handleError } = require('../lib/error');
const config = require('../lib/config');

const i18nPath = '../../_i18n/i18n';

/*
 * Generic implementation of DataRetentionManager
 */
class DataRetentionManagerService extends cds.ApplicationService {
    /*
     * CONSTRUCTOR
     */

    constructor(name, csn, options) {
        super(name, csn, options);

        this._legalGrounds = {};
        this._dataSubjects = {};
    }

    /*
     * GETTER/SETTER
     */

    get legalGrounds() {
        return this._legalGrounds;
    }

    get dataSubjects() {
        return this._dataSubjects;
    }

    /*
     * PUBLIC METHODS
     */

    async init() {
        await super.init();
        const db = await cds.connect.to('db');

        /*
         * DRM handler
         */

        this.on('dataSubjectsEndofResidence', this._dataSubjectsEndofResidence);
        this.on(
            'dataSubjectsEndofResidenceConfirmation',
            this._dataSubjectsEndofResidenceConfirmation
        );
        this.on('dataSubjectEndofBusiness', this._dataSubjectEndofBusiness);
        this.on('dataSubjectLegalEntities', this._dataSubjectLegalEntities);
        this.on(
            'dataSubjectLastRetentionStartDates',
            this._dataSubjectLastRetentionStartDate
        );
        this.on('dataSubjectInformation', this._dataSubjectInformation);
        this.on(
            'dataSubjectLegalGroundDeletion',
            this._dataSubjectLegalGroundDeletion
        );
        this.on(
            'dataSubjectsLegalGroundDestroying',
            this._dataSubjectsLegalGroundDestroying
        );
        this.on('dataSubjectDeletion', this._dataSubjectDeletion);
        this.on('dataSubjectsDestroying', this._dataSubjectsDestroying);

        this.before('CREATE', 'DataController', async (req) => {
            const { data } = req;
            const { locale } = req.user;
            const bundle = new TextBundle(i18nPath, locale);
            logger.info(
                `[DataRetentionManagerService][legalEntities]: ${JSON.stringify(
                    data
                )}`
            );
            const legalEntity = await db
                .transaction(req)
                .run(SELECT.one.from(`sap.odm.dpp.DataController`));
            if (legalEntity) {
                req.reject({
                    status: 400,
                    message: `${bundle.getText(
                        'errorMsgDRMDatacontrollerExists'
                    )}`,
                });
            }
        });
    }

    /**
     *
     * Register a LegalGround implementation
     *
     * @param  {} legalGround
     * @param  {} legalGroundImpl
     */
    registerLegalGround(legalGround, legalGroundImpl) {
        if (!legalGround || !legalGroundImpl) {
            return;
        }
        this.legalGrounds[legalGround] = legalGroundImpl;
    }

    /**
     * Register a DataSubject implementation
     *
     * @param  {} dataSubject
     * @param  {} dataSubjectImpl
     */
    registerDataSubject(dataSubject, dataSubjectImpl) {
        if (!dataSubject || !dataSubjectImpl) {
            return;
        }
        this.dataSubjects[dataSubject] = dataSubjectImpl;
    }

    /*
     * PRIVATE METHODS
     */

    /**
     * Returns Data Subjects that are not associated with the given Legal Ground
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {Object} cds.Request - Request Object.
     * @returns {Array} - List of Data Subjects, if found.
     */
    async _getDataSubjectsWithoutGivenLegalGround(req) {
        const dataSubjectImpl = this._determineDataSubjectImpl(req);
        const legalGroundImpl = this._determineLegalGroundImpl(req);
        try {
            // Get all the legal grounds that has a data subject
            const legalGroundsWithDataSubject =
                (await legalGroundImpl?.getEntitiesByCondition(
                    req,
                    'dataSubjectId != null or dataSubjectUUID != null',
                    ['id', 'dataSubjectId', 'dataSubjectUUID']
                )) || [];

            // displayIds and guids are sets (to force uniqueness)
            //   that would contain Data Subjects with Legal Grounds
            const displayIds = new Set();
            const guids = new Set();

            // Map legalGroundsWithDataSubject to its Data Subjects
            //    grouping them by guid and displayId
            legalGroundsWithDataSubject.forEach((x) => {
                if (x.dataSubjectId !== null) {
                    displayIds.add(x.dataSubjectId);
                } else {
                    guids.add(x.dataSubjectUUID);
                }
            });

            // Setup condition
            let cond = [];
            if (displayIds.size) {
                cond = cond.concat(['displayId not in', [...displayIds]]);
            }
            if (guids.size) {
                const andStr = displayIds.size && guids.size ? 'and ' : '';
                cond = cond.concat([`${andStr}id not in`, [...guids]]);
            }
            if (!displayIds.size && !guids.size) {
                cond = undefined;
            }

            // Get all Data Subjects that are not in displayIds nor in guids
            const orphanDataSubjects =
                (await dataSubjectImpl?.getEntitiesByCondition(req, cond, [
                    'id',
                ])) || [];
            return orphanDataSubjects.map((x) => ({ dataSubjectID: x.id }));
        } catch (error) {
            /* istanbul ignore next */
            logger.error(
                `[DataRetentionManagerService][getDataSubjectsWithoutGivenLegalGround]: ${error}`
            );
            /* istanbul ignore next */
            req.error({
                status: 500,
                message: error.message,
            });
            return {};
        }
    }

    /**
     * Indicates the helper function for retrieving the residence rules of Legal Entities.
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {Object} cds.Request - Request Object.
     * @returns {Array} - List of Legal Entity Residence Rules or error messages, if found.
     */
    static _extractLegalEntitiesResidenceRules(req) {
        const { data } = req;
        const { legalEntitiesResidenceRules } = data;
        const { locale } = req.user;
        const bundle = new TextBundle(i18nPath, locale);

        let errorLegalEntitiesResidenceRuleMessage = '';
        let legalEntitiesResidenceRule = null;

        if (legalEntitiesResidenceRules.length !== 1) {
            errorLegalEntitiesResidenceRuleMessage = `${bundle.getText(
                'errorMsgDRMLegalEntityMaxSize'
            )} ${legalEntitiesResidenceRules.length}`;
        }

        if (legalEntitiesResidenceRules[0].residenceRules) {
            [legalEntitiesResidenceRule] = legalEntitiesResidenceRules;
        } else {
            errorLegalEntitiesResidenceRuleMessage = `${bundle.getText(
                'errorMsgDRMRulesEmpty'
            )} ${legalEntitiesResidenceRules[0].legalEntity}`;
        }

        return {
            legalEntitiesResidenceRule,
            errorLegalEntitiesResidenceRuleMessage,
        };
    }

    /**
     * Indicates the helper function for dynamic creation a where clouse in a query
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {Array} conditionSet - Condition Set.
     * @param {Array} initialQuery - Initial Query.
     * @returns {Array} - where clouse for SELECT query
     */
    static _createQuery(conditionSet, initialQuery) {
        return conditionSet.reduce((j, cond) => {
            const q = j;
            q[cond.conditionFieldName] = cond.conditionFieldValue;
            return q;
        }, initialQuery || {});
    }

    /**
     * Determine LegalGround Implementation
     *
     * @param  {} legalGround
     */
    _determineLegalGroundImpl(req) {
        if (!req.data.legalGround) {
            return null;
        }

        return this.legalGrounds[req.data.legalGround];
    }

    _determineDataSubjectImpl(req) {
        if (!req.data.dataSubjectRole) {
            return null;
        }

        return this.dataSubjects[req.data.dataSubjectRole];
    }

    /**
     * Returns Data Subject which have Expired its Residence
     * Indicates the endpoint for getting all the data subjects which have reached end of purpose
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {string} dataSubjectRole - Data Subject Role.
     * @param {string} legalGround - LegalGround Name.
     * @param {string} startTime - Start Time Type.
     * @param {Array} legalEntitiesResidenceRules - Legal Entities Residence Rules.
     * @returns {Array} - Data Subject which have Expired its Residence
     */
    async _dataSubjectsEndofResidence(req) {
        const { data } = req;
        logger.info(
            `[DataRetentionManagerService][dataSubjectsEndofResidence]`
        );
        logger.debug(
            `[DataRetentionManagerService][dataSubjectsEndofResidence]: ${JSON.stringify(
                data
            )}`
        );

        const legalGroundImpl = this._determineLegalGroundImpl(req);

        const {
            legalEntitiesResidenceRule,
            errorLegalEntitiesResidenceRuleMessage,
        } =
            DataRetentionManagerService._extractLegalEntitiesResidenceRules(
                req
            );

        if (errorLegalEntitiesResidenceRuleMessage) {
            return handleError(
                errorLegalEntitiesResidenceRuleMessage,
                req,
                500,
                '[DataRetentionManagerService][dataSubjectsEndofResidence]',
                data
            );
        }

        try {
            const successBPIds = new Set();
            const entityIDs = new Set();

            // Retrieve data subject which reached end of business
            await Promise.all(
                legalEntitiesResidenceRule.residenceRules.map(
                    async (residenceRule) => {
                        const { residenceDate, conditionSet } = residenceRule;
                        const query = DataRetentionManagerService._createQuery(
                            conditionSet || [],
                            {
                                isBlocked: false,
                                endOfBusinessDate: {
                                    '<': residenceDate,
                                },
                            }
                        );

                        const entries =
                            (await legalGroundImpl?.getEntitiesByCondition(
                                req,
                                query,
                                ['id', 'dataSubjectId', 'dataSubjectUUID']
                            )) || [];

                        entries.forEach((u) => {
                            if (u.dataSubjectUUID || u.dataSubjectId) {
                                successBPIds.add(
                                    u.dataSubjectUUID || u.dataSubjectId
                                );
                            }
                            if (u.id) {
                                entityIDs.add(u.id);
                            }
                        });
                    }
                )
            );

            // Check if data subjects still have open legal ground entities

            const allEntries =
                (await legalGroundImpl?.getEntitiesByDataSubjectIds(
                    req,
                    successBPIds.size ? Array.from(successBPIds) : '',
                    { isBlocked: false },
                    ['id', 'dataSubjectId', 'dataSubjectUUID']
                )) || [];

            const nonConfirmCondition = new Set(
                allEntries
                    .filter((a) => !entityIDs.has(a.id))
                    .map((u) => u.dataSubjectUUID || u.dataSubjectId)
            );
            const success = Array.from(successBPIds).filter(
                (bpId) => !nonConfirmCondition.has(bpId)
            );

            const orphanDataSubjects =
                await this._getDataSubjectsWithoutGivenLegalGround(req); // NOSONAR

            return {
                success: Array.from(success)
                    .map((dataSubjectID) => ({
                        dataSubjectID,
                    }))
                    .concat(orphanDataSubjects),
                nonConfirmCondition: Array.from(nonConfirmCondition).map(
                    (dataSubjectID) => ({ dataSubjectID })
                ),
            };
        } catch (error) {
            /* istanbul ignore next */
            logger.error(
                `[DataRetentionManagerService][dataSubjectsEndofResidence]: ${error}`
            );
            /* istanbul ignore next */
            req.error({
                status: 500,
                message: error.message,
            });
        }
        return {};
    }

    /**
     * Data Subject’s Residence Expired Confirmation
     * Indicates the endpoint for validating whether input data subjects have reached end of purpose or not.
     * If application group contains more than one legal ground with its residence end points, then application needs to define this end point to verify whether data subjects
     * return by a legal grounds is also expired from other legal grounds perspective or not. If only legal ground exist then this end point is ignored.
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {string} dataSubjectRole - Data Subject Role.
     * @param {string} legalGround - LegalGround Name.
     * @param {string} startTime - Start Time Type.
     * @param {Array} legalEntitiesResidenceRules - Optional parameter, provisioning the data protection officer to define legal entities rules at a granular level.
     * @returns {Array} - Data Subject which have Expired its Residence
     */
    async _dataSubjectsEndofResidenceConfirmation(req) {
        const { data } = req;
        logger.info(
            `[DataRetentionManagerService][dataSubjectsEndofResidenceConfirmation]`
        );
        logger.debug(
            `[DataRetentionManagerService][dataSubjectsEndofResidenceConfirmation]: ${JSON.stringify(
                data
            )}`
        );

        const legalGroundImpl = this._determineLegalGroundImpl(req);

        try {
            const {
                legalEntitiesResidenceRule,
                errorLegalEntitiesResidenceRuleMessage,
            } =
                DataRetentionManagerService._extractLegalEntitiesResidenceRules(
                    req
                );

            if (errorLegalEntitiesResidenceRuleMessage) {
                return handleError(
                    errorLegalEntitiesResidenceRuleMessage,
                    req,
                    500,
                    '[DataRetentionManagerService][dataSubjectsEndofResidenceConfirmation]',
                    data
                );
            }
            const { dataSubjects, legalGround } = data;
            const dataSubjectIds = dataSubjects.map((ds) => ds.dataSubjectID);
            let confirmedDS = new Set(dataSubjectIds);

            await Promise.all(
                legalEntitiesResidenceRule.residenceRules.map(
                    async (residenceRule) => {
                        const { residenceDate, conditionSet } = residenceRule;

                        const query = DataRetentionManagerService._createQuery(
                            conditionSet || [],
                            {
                                isBlocked: false,
                                endOfBusinessDate: {
                                    '<': residenceDate,
                                },
                            }
                        );

                        const legalGroundEntities =
                            (await legalGroundImpl?.getEntitiesByDataSubjectIds(
                                req,
                                dataSubjectIds,
                                query,
                                ['dataSubjectId', 'dataSubjectUUID']
                            )) || [];

                        const legalGroundEntityIds = new Set(
                            legalGroundEntities.map(
                                (u) => u.dataSubjectUUID || u.dataSubjectId
                            )
                        );

                        confirmedDS = new Set(
                            [...confirmedDS].filter((x) =>
                                legalGroundEntityIds.has(x)
                            )
                        );

                        // For checking others Legal Grounds whether they have expired also from other legal grounds perspective or not, the logic should be placed here.
                    }
                )
            );

            dataSubjects.forEach((x) => {
                if (
                    legalGround !== 'CustomerOrder' &&
                    x.dataSubjectID.length <= 10
                ) {
                    confirmedDS.add(x.dataSubjectID);
                }
            });

            return Array.from(confirmedDS).map((dataSubjectID) => ({
                dataSubjectID,
            }));
        } catch (error) {
            /* istanbul ignore next */
            logger.error(
                `[DataRetentionManagerService][dataSubjectsEndofResidenceConfirmation]: ${error}`
            );
            /* istanbul ignore next */
            req.error({
                status: 500,
                message: error.message,
            });
        }
        return [];
    }

    /**
     * Data Subject End of Business has Reached.
     * Indicates the endpoint for checking whether a data subject has reached the end of business
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {string} dataSubjectRole - Data Subject Role.
     * @param {string} dataSubjectID - Data Subject ID.
     * @param {string} legalGround - LegalGround Name.
     * @returns {Object} - checks whether Data subject expired (returns true/false) and the reason if not expired.
     */
    async _dataSubjectEndofBusiness(req) {
        const { data } = req;
        const { locale } = req.user;
        const bundle = new TextBundle(i18nPath, locale);

        logger.info(`[DataRetentionManagerService][dataSubjectEndofBusiness]`);
        logger.debug(
            `[DataRetentionManagerService][dataSubjectEndofBusiness]: ${JSON.stringify(
                data
            )}`
        );
        const { dataSubjectID: dataSubjectId, legalGround } = data;

        if (legalGround !== 'CustomerOrder' && dataSubjectId.length <= 10) {
            req.data.legalGround = 'CustomerOrder';
        }

        const legalGroundImpl = this._determineLegalGroundImpl(req);

        try {
            const entries =
                (await legalGroundImpl?.getEntitiesByDataSubjectIds(
                    req,
                    [dataSubjectId],
                    { isBlocked: false },
                    ['endOfBusinessDate']
                )) || [];

            if (!entries || entries.length === 0) {
                req.error({ status: 204 });
                return null;
            }

            if (entries.every((u) => u.endOfBusinessDate !== null)) {
                return {
                    dataSubjectExpired: true,
                    dataSubjectNotExpiredReason: null,
                };
            }

            logger.info(
                `[DataRetentionManagerService][dataSubjectEndofBusiness]: Not all ${legalGround} of dataSubject ${dataSubjectId} have reached end of business`
            );
            return {
                dataSubjectExpired: false,
                dataSubjectNotExpiredReason: `${bundle.getText(
                    'errorMsgDRMEndOfBusiness'
                )}`,
            };
        } catch (error) {
            /* istanbul ignore next */
            logger.error(
                `[DataRetentionManagerService][dataSubjectEndofBusiness]: ${error}`
            );
            /* istanbul ignore next */
            req.error({
                status: 500,
                message: error.message,
            });
        }

        return {};
    }

    /**
     * Legal Entities
     * Indicates the endpoint for getting Legal Entities from the system
     * @param {string} legalGround - LegalGround Name.
     * @param {string} dataSubjectRole - Data Subject Role.
     * @param {string} dataSubjectID - Data Subject ID.
     * @returns {Array} - List of Legal Entities
     */
    // eslint-disable-next-line class-methods-use-this
    async _dataSubjectLegalEntities(req) {
        const { data } = req;
        const { locale } = req.user;
        const bundle = new TextBundle(i18nPath, locale);
        logger.info(`[DataRetentionManagerService][dataSubjectLegalEntities]`);
        logger.debug(
            `[DataRetentionManagerService][dataSubjectLegalEntities]: ${JSON.stringify(
                data
            )}`
        );

        try {
            const db = await cds.connect.to('db');
            const legalEntity = await db
                .transaction(req)
                .run(SELECT.from(`sap.odm.dpp.DataController`));

            if (!legalEntity) {
                req.error(
                    404,
                    `${bundle.getText('errorMsgDRMMissingLegalEntityConfig')}`
                );
                return null;
            }

            const resultLegalEntity =
                legalEntity.length > 1
                    ? legalEntity.find(
                          (entity) => entity.name === config.LEGAL_ENTITY_NAME
                      )
                    : legalEntity[0];

            return [
                {
                    legalEntity: resultLegalEntity.displayId || '',
                },
            ];
        } catch (error) {
            /* istanbul ignore next */
            logger.error(
                `[DataRetentionManagerService][dataSubjectLegalEntities]: ${error}`
            );
            /* istanbul ignore next */
            req.error(error.message);
        }
        return [];
    }

    /**
     * Data Subject Legal Ground Retention Start Date
     * Indicates the endpoint for getting the latest EOB date or dates for a data subject based on the data protection officer,
     * selected reference start time, and retention rule condition, if one exists
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {string} legalGround - LegalGround Name.
     * @param {string} dataSubjectRole - Data Subject Role.
     * @param {string} dataSubjectID - Data Subject ID.
     * @param {string} legalEntity - Legal Entity Name.
     * @param {string} startTime - Start Time Type.
     * @param {Array} rulesConditionSet - Optional parameter, provisioning the data protection officer to define legal ground rules at a granular level.
     * @returns {Array} - latest retention start (reference) date or dates
     */
    async _dataSubjectLastRetentionStartDate(req) {
        const { data } = req;
        const { locale } = req.user;
        const bundle = new TextBundle(i18nPath, locale);
        logger.info(
            `[DataRetentionManagerService][dataSubjectLastRetentionStartDates]`
        );
        logger.debug(
            `[DataRetentionManagerService][dataSubjectLastRetentionStartDates]: ${JSON.stringify(
                data
            )}`
        );

        // Ignoring legalEntity
        const {
            dataSubjectID: dataSubjectId,
            legalGround,
            rulesConditionSet,
        } = data;

        if (legalGround !== 'CustomerOrder' && dataSubjectId.length <= 10) {
            req.data.legalGround = 'CustomerOrder';
        }

        const legalGroundImpl = this._determineLegalGroundImpl(req);

        const currentDate = new Date().toISOString();
        const lastRetentionStartDates = [];

        try {
            if (!dataSubjectId) {
                const errorCode = 400;
                return handleError(
                    `${bundle.getText('errorMsgDRMInvalidBP')}`,
                    req,
                    errorCode,
                    '[DataRetentionManagerService][dataSubjectLastRetentionStartDates]',
                    {
                        dataSubjectId,
                    }
                );
            }

            const entries =
                (await legalGroundImpl?.getEntitiesByDataSubjectIds(
                    req,
                    [dataSubjectId],
                    { isBlocked: false },
                    ['id']
                )) || [];

            if (!entries || entries.length === 0) {
                req.info(204);
                logger.info(
                    `[DataRetentionManagerService][dataSubjectLastRetentionStartDate]: No entries for dataSubject ${dataSubjectId}`
                );
                return {
                    dataSubjectExpired: false,
                    dataSubjectNotExpiredReason: `${bundle.getText(
                        'errorMsgDRMInvalidDataSubject'
                    )}`,
                };
            }

            await Promise.all(
                rulesConditionSet.map(async (ruleCondition) => {
                    const { retentionID, conditionSet } = ruleCondition;

                    const query = DataRetentionManagerService._createQuery(
                        conditionSet || [],
                        {
                            isBlocked: false,
                            endOfBusinessDate: { '<': currentDate },
                        }
                    );

                    const entities =
                        (await legalGroundImpl?.getEntitiesByDataSubjectIds(
                            req,
                            [dataSubjectId],
                            query,
                            [{ endOfBusinessDate: 'max' }]
                        )) || [];

                    if (entities && entities.length) {
                        lastRetentionStartDates.push({
                            retentionID,
                            retentionStartDate: entities[0].max.substring(
                                0,
                                19
                            ),
                        });
                    }
                })
            );

            return lastRetentionStartDates;
        } catch (error) {
            /* istanbul ignore next */
            logger.error(
                `[DataRetentionManagerService][dataSubjectLastRetentionStartDates]: ${error}`
            );
            /* istanbul ignore next */
            req.error({
                status: 500,
                message: error.message,
            });
        }
        return [];
    }

    /**
     * Data Subject Information
     * Indicates the endpoint for getting infromation of a data subject.
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {string} applicationGroupName - Application Group Name.
     * @param {string} dataSubjectRole - Data Subject Role.
     * @param {Array} dataSubjectIds - Data Subject ID.
     */
    async _dataSubjectInformation(req) {
        const { data } = req;
        logger.info(`[DataRetentionManagerService][dataSubjectInformation]`);
        logger.debug(
            `[DataRetentionManagerService][dataSubjectInformation]: ${JSON.stringify(
                data
            )}`
        );

        const dataSubjectImpl = this._determineDataSubjectImpl(req);
        const { dataSubjectIds } = data;

        try {
            logger.debug(
                `[DataRetentionManagerService][dataSubjectInformation]: ${JSON.stringify(
                    dataSubjectIds
                )}`
            );
            return await dataSubjectImpl?.getEntitiesByIds(req, dataSubjectIds);
        } catch (error) {
            /* istanbul ignore next */
            logger.error(
                `[DataRetentionManagerService][dataSubjectInformation]: ${error.message}`
            );
            /* istanbul ignore next */
            req.error({
                status: 500,
                message: error.message,
            });
        }

        return {};
    }

    /**
     * Data Subject Legal Ground Deletion
     * Indicates the endpoint for blocking a data subject legal ground instances once data subject itself can be blocked in the system.
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {string} legalGround - LegalGround Name.
     * @param {string} dataSubjectRole - Data Subject Role.
     * @param {string} dataSubjectID - Data Subject ID.
     * @param {string} legalEntity - Legal Entity Name.
     * @param {string} startTime - Start Time Type.
     * @param {string} maxDeletionDate - Maximum Deletion Date.
     * @param {Array}  retentionRules - Optional parameter, provisioning the data protection officer to define retention rules at a granular level.
     */
    async _dataSubjectLegalGroundDeletion(req) {
        const { data } = req;
        logger.info(
            `[DataRetentionManagerService][dataSubjectLegalGroundDeletion]`
        );
        logger.debug(
            `[DataRetentionManagerService][dataSubjectLegalGroundDeletion]: ${JSON.stringify(
                data
            )}`
        );

        const {
            dataSubjectID: dataSubjectId,
            maxDeletionDate,
            retentionRules,
        } = data;

        const legalGroundImpl = this._determineLegalGroundImpl(req);

        try {
            const entries =
                (await legalGroundImpl?.getEntitiesByDataSubjectIds(
                    req,
                    [dataSubjectId],
                    { isBlocked: false },
                    ['id']
                )) || [];

            if (!entries || entries.length === 0) {
                req.info(204, `No entries for dataSubject ${dataSubjectId}`);
                return true;
            }

            const blockedEntities = [];

            await Promise.all(
                retentionRules.map(async (retentionRule) => {
                    const { conditionSet } = retentionRule;

                    const query = DataRetentionManagerService._createQuery(
                        conditionSet || [],
                        {
                            isBlocked: false,
                            endOfBusinessDate: { '!=': null },
                        }
                    );

                    // ignore legalEntity

                    const entities =
                        (await legalGroundImpl?.getEntitiesByDataSubjectIds(
                            req,
                            [dataSubjectId],
                            query,
                            ['id']
                        )) || [];

                    if (!entities || entities.length === 0) {
                        return;
                    }

                    entities.forEach((entity) => {
                        blockedEntities.push(entity.id);
                        return null || {};
                    });
                })
            );

            if (blockedEntities.length > 0) {
                await Promise.all(
                    blockedEntities.map((id) =>
                        legalGroundImpl?.blockEntity(req, id, maxDeletionDate)
                    )
                );
            }

            logger.debug(
                `[DataRetentionManagerService][dataSubjectLegalGroundDeletion]: Blocked Entities:  ${JSON.stringify(
                    blockedEntities
                )}`
            );

            req.info(200);
            return {};
        } catch (error) {
            /* istanbul ignore next */
            logger.error(
                `[DataRetentionManagerService][dataSubjectLegalGroundDeletion]: ${error}`
            );
            /* istanbul ignore next */
            req.error({
                status: 500,
                message: error.message,
            });
        }

        return {};
    }

    /**
     * Data Subject Legal Ground Destroying
     * Indicates the endpoint for deletion a data subject legal ground instances once data subject itself can be deleted from the system.
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {string} legalGround - LegalGround Name.
     * @param {string} dataSubjectRole - Data Subject Role.
     */
    async _dataSubjectsLegalGroundDestroying(req) {
        const { data } = req;
        logger.info(
            '[DataRetentionManagerService][dataSubjectsLegalGroundDestroying]'
        );
        logger.debug(
            `[DataRetentionManagerService][dataSubjectsLegalGroundDestroying]: ${JSON.stringify(
                data
            )}`
        );

        const legalGroundImpl = this._determineLegalGroundImpl(req);

        try {
            await legalGroundImpl?.deleteBlockedEntities(req);

            req.info(202);
            return {};
        } catch (error) {
            /* istanbul ignore next */
            logger.error(
                `[DataRetentionManagerService][dataSubjectsLegalGroundDestroying]: ${error}`
            );
            /* istanbul ignore next */
            req.error({
                status: 500,
                message: error.message,
            });
        }

        return {};
    }

    /**
     * Data Subject Deletion
     * Indicates the endpoint that needs to be called to trigger the blocking of a data subject instances when it is no longer needed in the system.
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {string} applicationGroupName- Application Group Name.
     * @param {string} dataSubjectRole - Data Subject Role.
     * @param {string} dataSubjectID - Data Subject ID.
     */
    async _dataSubjectDeletion(req) {
        const { data } = req;
        const { dataSubjectID: dataSubjectId, maxDeletionDate } = data;
        logger.info(`[DataRetentionManagerService][dataSubjectDeletion]`);
        logger.debug(
            `[DataRetentionManagerService][dataSubjectDeletion]: ${JSON.stringify(
                data
            )}`
        );

        const dataSubjectImpl = this._determineDataSubjectImpl(req);

        await dataSubjectImpl?.blockEntity(req, dataSubjectId, maxDeletionDate);

        req.info(200);
        return {};
    }

    /**
     * Data Subject Destroying
     * Indicates the endpoint for deletion a data subject instances once data subject itself can be deleted from the system.
     * @namespace sap.c4u.edom.retailer.dpp
     * @param {string} applicationGroupName- Application Group Name.
     * @param {string} dataSubjectRole - Data Subject Role.
     */
    async _dataSubjectsDestroying(req) {
        logger.info(`[DataRetentionManagerService][dataSubjectsDestroying]`);

        // Delete Legal Grounds
        await Promise.all(
            Object.values(this.legalGrounds).map((legalGroundImpl) =>
                legalGroundImpl?.deleteBlockedEntities(req)
            )
        );

        const dataSubjectImpl = this._determineDataSubjectImpl(req);

        await dataSubjectImpl?.deleteBlockedEntities(req);

        return {};
    }
}

module.exports = { DataRetentionManagerService };
