const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const cloudSDK = require('@sap-cloud-sdk/core');
const { getBundle } = require('../../lib/helper');
// const BusinessPartnerKeyMappingService = require('../../external/API_BP_KEY_MAPPING');
const BusinessPartnerKeyMappingServiceBeta = require('../../external/API_BP_KEY_MAPPINGBeta');
const MeasurementConceptAPI = require('../../external/MeasurementConceptAPI');

const i18nPath = '../../_i18n/i18n';
const loggerScope = `[distributionService]`;
logger.info(`${loggerScope}`);

/**
 * Order Fulfillment Helper
 */
class DistributionFunctions {
    /**
     * Get getOrderDetails
     * @param {*} req
     * @returns
     */
    // eslint-disable-next-line no-unused-vars
    static async getOrderDetails(req, featureFlagUtilities) {
        const { data } = req;
        const bundle = getBundle(req, i18nPath);
        logger.debug(`${loggerScope} ${JSON.stringify(data)}`);
        let orderDetails;
        let businessScenarios;
        try {
            const db = await cds.connect.to('db');
            // Fetch order Details from database corresponding to Customer Order UUID
            /* eslint-disable no-unused-expressions */
            orderDetails = await db.transaction(req).run(
                SELECT.from('sap.odm.sales.CustomerOrder', req.data.id, (o) => {
                    o('id');
                    o('displayId');
                    o('orderDate');
                    o('orderReason_code');
                    o('pricingDate');
                    o('requestedFulfillmentDate');
                    o('cancellationStatus_code');
                    o('isExternallyPriced');
                    o('netAmount');
                    o('isBlocked');
                    o.partners((partner) => {
                        partner.up__id; // NOSONAR
                        partner.id; // NOSONAR
                        partner.contractAccountId; // NOSONAR
                        partner.businessPartnerId; // NOSONAR
                        partner.role_code; // NOSONAR
                        partner.businessPartner(['up__id', 'id']); // NOSONAR
                    });
                    o.items((item) => {
                        item.id; // NOSONAR
                        item.product_id; // NOSONAR
                        item.quantity; // NOSONAR
                        item.quantityUnit_code; // NOSONAR
                        item.type_code; // NOSONAR
                        item.netAmount; // NOSONAR
                        item.cancellationReason_code; // NOSONAR
                        item.alternativeId; // NOSONAR
                        item.configurationId; // NOSONAR
                        item.customerReferenceId; // NOSONAR
                        item.parentItemId; // NOSONAR
                        item.processingStatus_code; // NOSONAR
                        item.partners(['up__up__id', 'up__id', 'id']); // NOSONAR
                        item.utilitiesAspect((utilities) => {
                            utilities.up__up__id; // NOSONAR
                            utilities.up__id; // NOSONAR
                            utilities.distributionChannel_code; // NOSONAR
                            utilities.division_code; // NOSONAR
                            utilities.salesOrganization_id; // NOSONAR
                            utilities.podId; // NOSONAR
                            utilities.supplyAddress_up__id; // NOSONAR
                            utilities.supplyAddress_id; // NOSONAR
                            utilities.gridPricing; // NOSONAR
                            utilities.deviceTypePricing_code; // NOSONAR
                            utilities.geographicalCode; // NOSONAR
                            utilities.budgetBillingType_code; // NOSONAR
                            utilities.referenceBillDate; // NOSONAR
                            utilities.referenceObject([
                                'up__up__up__id',
                                'up__up__id',
                                'installation',
                            ]);
                        });
                        item.subscriptionAspect((subscription) => {
                            subscription.up__up__id; // NOSONAR
                            subscription.up__id; // NOSONAR
                            subscription.contractTerm_period; // NOSONAR
                            subscription.contractTerm_periodicity; // NOSONAR
                            subscription.validFrom; // NOSONAR
                            subscription.validTo; // NOSONAR
                            subscription.subscriptionReference; // NOSONAR
                            subscription.technicalResources([
                                'up__up__up__id',
                                'up__up__id',
                                'resourceId',
                                'resourceName',
                            ]);
                            subscription.headerCustomReferences([
                                'up__up__up__id',
                                'up__up__id',
                                'id',
                                'customReferenceId',
                                'typeCode',
                            ]);
                            subscription.itemCustomReferences([
                                'up__up__up__id',
                                'up__up__id',
                                'id',
                                'customReferenceId',
                                'typeCode',
                            ]);
                            subscription.itemSubscriptionParameters([
                                'up__up__up__id',
                                'up__up__id',
                                'id',
                                'code',
                                'value',
                            ]);
                        });
                        item.notes([
                            'up__up__id',
                            'up__id',
                            'id',
                            'textType_code',
                            'text',
                            'language_code',
                        ]);
                        item.priceComponents([
                            'up__up__id',
                            'up__id',
                            'conditionType_code',
                            'value',
                        ]);
                    });
                    o('paymentReferences');
                    o.salesAspect([
                        'up__id',
                        'incotermsClassification_code',
                        'shippingCondition_code',
                        'paymentTerms_code',
                    ]);
                    o.priceComponents([
                        'up__id',
                        'currency_code',
                        'conditionType_code',
                        'value',
                    ]);
                    o.serviceAspect([
                        'up__id',
                        'priority_code',
                        'requestedServiceStartAt',
                        'requestedServiceEndAt',
                    ]);
                    o.notes((note) => {
                        note.textType_code; // NOSONAR
                        note.text; // NOSONAR
                        note.language_code; // NOSONAR
                    });
                })
            );

            if (!orderDetails) {
                logger.error(
                    `${bundle.getText(
                        'errorMsgDistributionSRVCustomerOrderNotFound'
                    )} ${req.data.id}`
                );
                req.error({
                    status: 406,
                    message: `${bundle.getText(
                        'errorMsgDistributionSRVCustomerOrderNotFound'
                    )} ${req.data.id}`,
                });
            }

            businessScenarios = await db
                .transaction(req)
                .run(
                    SELECT.from(
                        `sap.c4u.foundation.retailer.configuration.UtilitiesBusinessScenarios`
                    )
                );

            /* istanbul ignore if */
            if (!businessScenarios) {
                /* istanbul ignore next */ logger.error(
                    `${bundle.getText(
                        'errorMsgDistributionSRVBusinessScenatioConfigNotFound'
                    )}`
                );
                req.error({
                    status: 406,
                    message: `${bundle.getText(
                        'errorMsgDistributionSRVBusinessScenatioConfigNotFound'
                    )}`,
                });
            }
        } catch (error) {
            logger.error(
                `[distributionService][getOrderDetails]: ${error.message}`
            );
            req.reject({
                status: 406,
                message: error.message,
            });
        }
        return {
            orderDetails,
            businessScenarios,
        };
    }

    /**
     * Get getDisplayIds
     * @param {*} req
     * @param {*} productIds
     * @param {*} SalesOrg
     * @returns
     */
    static async getDisplayIds(
        req,
        productIds,
        SalesOrg,
        deviceTypePricingCode
    ) {
        let prodIds;
        let sOrgDisplayIds;
        let deviceTypeName;
        const { data } = req;
        logger.debug(`${loggerScope} ${JSON.stringify(data)}`);
        try {
            const db = await cds.connect.to('db');
            // Read Product display ID for list of product UUID from customer order
            prodIds = await db.transaction(req).run(
                SELECT.from(`sap.odm.product.Product`)
                    .columns('id', 'displayId')
                    .where({ id: { in: productIds } })
            );

            // Fetch Sales org Display Id for list of Sales org UUID  from customer order
            /* istanbul ignore else */
            if (SalesOrg) {
                sOrgDisplayIds = await db.transaction(req).run(
                    SELECT.from(`sap.odm.sales.orgunit.SalesOrganization`)
                        .columns('id', 'displayId')
                        .where({ id: { in: SalesOrg } })
                );
            }

            if (deviceTypePricingCode) {
                deviceTypeName = await db.transaction(req).run(
                    SELECT.from(
                        `sap.odm.utilities.sales.CustomerOrderItemUtilitiesDeviceTypeCodes`
                    )
                        .columns('code', 'name')
                        .where({ code: { in: deviceTypePricingCode } })
                );
            }
        } catch (error) /* istanbul ignore next */ {
            logger.error(
                `[distributionService][getDisplayIds]: ${error.message}`
            );
            req.reject({
                status: 406,
                message: error.message,
            });
        }
        return {
            prodIds,
            sOrgDisplayIds,
            deviceTypeName,
        };
    }

    /**
     *
     *  Check if order item already has subsequent document created
     *
     * @param  {} req
     * @param  {} item
     * @param  {}  response
     */
    static async checkErrorItems(req, item, response) {
        let sourceStatus;
        let subsequentId;
        const bundle = getBundle(req, i18nPath);
        try {
            const db = await cds.connect.to('db');
            const customerOrderItemStatuses = await db.transaction(req).run(
                SELECT.one('processingStatus_code')
                    .from(`sap.odm.sales.CustomerOrder.items`)
                    .where({
                        up__id: req.data.id,
                        id: item.id,
                    })
            );
            // Check if we have Subsequent Id available for order item if status is
            // other than error, process error out items again
            /* istanbul ignore else */
            if (customerOrderItemStatuses.processingStatus_code !== '08') {
                subsequentId = await db.transaction(req).run(
                    SELECT.one('displayId')
                        .from(
                            `sap.odm.sales.CustomerOrder.items.utilitiesAspect.subsequentDocument`
                        )
                        .where({
                            up__up__up__id: req.data.id,
                            up__up__id: item.id,
                            type_code: item.type_code,
                        })
                );
            }

            if (!subsequentId) {
                sourceStatus = 'In Distribution';
                await this.updateDistributionStatus(
                    req,
                    item.id,
                    sourceStatus,
                    response
                );
            } /* istanbul ignore next */ else {
                response.createdDocumentNumber = subsequentId.displayId;
                response.isSuccess = true;
            }
        } catch (error) /* istanbul ignore next */ {
            logger.error(
                `[distributionService][checkErrorItems]: ${error.message}`
            );
            response.messages = [
                `${bundle.getText(
                    'errorMsgDistributionSRVOrderStatusNotFound'
                )} ${item.id}`,
            ];
            response.isSuccess = false;
            // Update Status from SB in Order item
            sourceStatus = 'In Error';
            await this.updateDistributionStatus(
                req,
                item.id,
                sourceStatus,
                response
            );
        }
    }

    /**
     *
     * Update Order Item processing  Status
     *
     * @param  {} req
     * @param  {} item
     * @param  {} source
     * @param  {} sourceStatus
     * @param  {} messages
     */
    static async updateDistributionStatus(req, item, sourceStatus, response) {
        const bundle = getBundle(req, i18nPath);
        try {
            const db = await cds.connect.to('db');
            const { API_EDOM_RETAILER } = cds.services;
            const { CustomerOrderItems } = API_EDOM_RETAILER.entities;

            // Get Item status from sales processing status codes
            const itemStatus = await db
                .transaction(req)
                .run(
                    SELECT.one(['code'])
                        .from(`sap.odm.sales.SalesProcessingStatusCodes`)
                        .where({ name: sourceStatus })
                );

            /* istanbul ignore if */
            if (!itemStatus) {
                /* istanbul ignore next */ response.messages.push(
                    `${bundle.getText(
                        'errorMsgDistributionSRVStatusNotConfigured'
                    )} ${sourceStatus}`
                );
                response.isSuccess = false;
            } else {
                // Update API EDOM retailer with In Process processing status

                const entry = {
                    processingStatus_code: itemStatus.code,
                };

                await API_EDOM_RETAILER.transaction(req).run(
                    UPDATE(CustomerOrderItems).set(entry).where({
                        id: item,
                        up__id: req.data.id,
                    })
                );
            }
        } catch (err) /* istanbul ignore next */ {
            logger.error(
                `[distributionService][updateDistributionStatus]: ${err.message}`
            );
            response.messages.push(
                `${bundle.getText(
                    'errorMsgDistributionSRVStatusNotUpdated'
                )} ${item}`
            );
            response.isSuccess = false;
        }
    }

    /**
     *
     * Update Order Item processing  Status
     *
     * @param  {} req
     * @param  {} item
     * @param  {} source
     * @param  {} sourceStatus
     * @param  {} messages
     */
    static async updateItemStatus(req, item, source, sourceStatus, response) {
        const bundle = getBundle(req, i18nPath);
        try {
            const db = await cds.connect.to('db');
            const { API_EDOM_RETAILER } = cds.services;
            const { CustomerOrderItems } = API_EDOM_RETAILER.entities;
            const sourceSystem = await db.transaction(req).run(
                SELECT.one(['sourceSystemId'])
                    .from(
                        `sap.c4u.foundation.retailer.configuration.CustomerOrderUtilitiesStatusSourceSystems`
                    )
                    .where({
                        destination: source,
                    })
            );
            /* istanbul ignore if */
            if (!sourceSystem?.sourceSystemId) {
                /* istanbul ignore next */ response.messages.push(
                    `${bundle.getText(
                        'errorMsgDistributionSRVSourceSystemNotFound'
                    )} ${source}`
                );
            } else {
                let processingStatusCode;
                const statusMappedRecord = await db.transaction(req).run(
                    SELECT.one(['processingStatus_code'])
                        .from(
                            `sap.c4u.foundation.retailer.configuration.CustomerOrderUtilitiesStatusMapping`
                        )
                        .where({
                            'sourceSystem.sourceSystemId':
                                sourceSystem.sourceSystemId,
                            sourceSystemStatus: sourceStatus,
                        })
                );
                /* istanbul ignore else */
                if (statusMappedRecord.processingStatus_code) {
                    processingStatusCode =
                        statusMappedRecord.processingStatus_code;
                    // Update API EDOM retailer with In Process processing status

                    const entry = {
                        processingStatus_code: processingStatusCode,
                    };

                    await API_EDOM_RETAILER.transaction(req).run(
                        UPDATE(CustomerOrderItems).set(entry).where({
                            id: item,
                            up__id: req.data.id,
                        })
                    );
                } /* istanbul ignore next */ else {
                    response.messages.push(
                        `${bundle.getText(
                            'errorMsgDistributionSRVStatusMappingNotFound'
                        )} ${sourceSystem.sourceSystemId}`
                    );
                }
            }
        } catch (err) /* istanbul ignore next */ {
            logger.error(
                `[distributionService][updateItemStatus]: ${err.message}`
            );
            response.messages.push(
                `${bundle.getText(
                    'errorMsgDistributionSRVStatusNotUpdated'
                )} ${item}`
            );
        }
    }

    /**
     * Read Market and Product Id for SB order Item
     * @param  {} prodIds
     * @param  {} sOrgDisplayIds
     * @param  {} markets
     * @param  {} item
     * @param  {} messages
     * @param  {} req
     */
    static async getSbItemData(
        prodIds,
        sOrgDisplayIds,
        markets,
        item,
        messages,
        req
    ) {
        const bundle = getBundle(req, i18nPath);

        const newMessages = messages;

        // Fetch Product Display ID from product UUID for current item
        const prodId = prodIds.find(
            (product) => product.id === item.product_id
        );

        /* istanbul ignore if */
        if (!prodId) {
            /* istanbul ignore next */ newMessages.push(
                `${bundle.getText(
                    'errorMsgDistributionSRVProductDisplayIdNotFound'
                )} ${item.id}`
            );
        }

        // Fetch Sales Org Id from Sales org UUID for current item
        const salesOrg = sOrgDisplayIds.find(
            (sOrg) => sOrg.id === item.utilitiesAspect?.salesOrganization_id
        );
        let orgDisplayId;
        orgDisplayId = '';
        if (salesOrg) {
            orgDisplayId = salesOrg.displayId;
        }

        // find market as per sales area on customer Order items
        const market = markets.filter(
            (m) =>
                m.salesArea?.distributionChannel ===
                    item.utilitiesAspect?.distributionChannel_code &&
                m.salesArea?.division === item.utilitiesAspect?.division_code &&
                m.salesArea?.salesOrganization === orgDisplayId
        );
        /* istanbul ignore if */
        if (!market) {
            /* istanbul ignore next */ newMessages.push(
                `${bundle.getText('errorMsgDistributionSRVMarketsNotFound')} ${
                    item.id
                }`
            );
        }
        return { prodId, market, newMessages };
    }

    /**
     * Fetch destination from cloud tenant
     * @param {*} req
     * @param {*} destinationName
     * @returns {}
     */
    static async fetchDestination(req, destinationName) {
        try {
            const dest = await cds.connect.to(destinationName);
            const jwt = req.headers.authorization.substr(
                7,
                req.headers.authorization.length
            );

            return await cloudSDK.useOrFetchDestination({
                destinationName: dest.destination,
                jwt,
            });
        } catch (e) /* istanbul ignore next */ {
            logger.error(
                `[distributionService][fetchDestination]: ${e.message}`
            );
            return {};
        }
    }

    /**
     * Get the External Customer number from the C4UF partner number
     * @param {*} req
     * @param {*} itemBP
     * @param {*} messages
     * @returns
     */
    static async getExternalSystemBPNumber(
        req,
        partner,
        messages,
        destinationName,
        destAdditionalProperty
    ) {
        let bpUUID;
        const bundle = getBundle(req, i18nPath);
        const bpGUID = [];
        const itemBP = partner.businessPartnerId;
        let externalSystemBPNumber = [];
        const db = await cds.connect.to('db');
        let bpLookup;
        const destAdditionalProp = destAdditionalProperty;

        try {
            const destination = await this.fetchDestination(
                req,
                destinationName
            );

            /* istanbul ignore if */
            if (!destination) {
                /* istanbul ignore next */ messages.push(
                    `${bundle.getText(
                        'errorMsgDistributionSRVErrorFetchingDestination'
                    )}`
                );
            } else if (
                /* istanbul ignore next */ !destination.originalProperties
                    .destinationConfiguration[destAdditionalProp]
            ) {
                messages.push(
                    `${bundle.getText(
                        'errorMsgDistributionSRVBusinessSystemNotFound'
                    )}`
                );
            } else {
                const SbBusinesssystem =
                    destination.originalProperties.destinationConfiguration[
                        destAdditionalProperty
                    ];
                if (partner?.businessPartner?.id) {
                    bpGUID.id = partner.businessPartner.id;
                } else {
                    bpUUID = await this.getPartnerUUIDFromDisplayID(
                        db,
                        req,
                        itemBP
                    );
                    bpGUID.id = bpUUID[0]?.id;
                }

                /* istanbul ignore else */
                if (bpGUID?.id) {
                    const arrBpUUID = [bpGUID.id];
                    [externalSystemBPNumber] =
                        await new BusinessPartnerKeyMappingServiceBeta().getBPKeyMappingByBpUUID(
                            req,
                            // bpGUID.id,
                            arrBpUUID,
                            SbBusinesssystem
                        );

                    if (externalSystemBPNumber[1]) {
                        // eslint-disable-next-line prefer-destructuring
                        bpLookup = externalSystemBPNumber[1]?.[0];
                    } else {
                        messages.push(
                            `${bundle.getText(
                                'errorMsgDistributionSRVSubscriptionCustomerNotFound'
                            )}`
                        );
                    }
                } /* istanbul ignore next */ else {
                    messages.push(
                        `${bundle.getText(
                            'errorMsgDistributionSRVSubscriptionCustomerNotFound'
                        )}`
                    );
                }
                return bpLookup;
            }
        } catch (error) /* istanbul ignore next */ {
            logger.error(
                `[distributionService][getExternalSystemBPNumber]: ${error.message}`
            );
            messages.push(
                `${bundle.getText(
                    'errorMsgDistributionSRVSubscriptionCustomerNotFound'
                )} ${error.message}`
            );
        }
        return {};
    }

    static async getPartnerUUIDFromDisplayID(db, req, displayId) {
        const PartnerNumber = displayId;
        try /* istanbul ignore next */ {
            return await db
                .transaction(req)
                .run(
                    SELECT.from(`sap.odm.businesspartner.BusinessPartner`)
                        .columns('id', 'displayId')
                        .where({ displayId: PartnerNumber })
                );
        } catch (e) {
            logger.error(
                `[distributionService][getPartnerUUIDFromDisplayID]: ${e.message}`
            );
            return {};
        }
    }

    /**
     * Update Subsequent doc for Non Commodity Subscription Item
     * @param  {} req
     * @param  {} item
     * @param  {} responseSb
     * @param  {} messages
     */
    static async updateSubsequentSub(req, item, responseSb, messages) {
        const bundle = getBundle(req, i18nPath);
        try {
            const { API_EDOM_RETAILER } = cds.services;
            const { CustomerOrderItemUtilitiesSubsequentDocument } =
                API_EDOM_RETAILER.entities;
            const subsequentDocument = {
                up__up__up__id: req.data.id,
                up__up__id: item.id,
                id: responseSb.subscriptionId,
                displayId: responseSb.subscriptionDocumentId,
                type_code: item.type_code,
                isBlocked: false,
            };

            // INSERT  Subsequent Doc details to  API EDOM retailer
            await API_EDOM_RETAILER.transaction(req).run(
                INSERT.into(
                    CustomerOrderItemUtilitiesSubsequentDocument
                ).entries(subsequentDocument)
            );
        } catch (error) /* istanbul ignore next */ {
            logger.error(
                `[distributionService][updateSubsequentSub]: ${error.message}`
            );
            messages.push(
                `${bundle.getText(
                    'errorMsgDistributionSRVErrorUpdatingSubsequentId'
                )} ${item.id}`
            );
        }
    }

    /**
     * fetch BP ID by metercode and DSOcode.
     * @param  {} req
     * @param  {} MarketFunctioncode
     * @param  {} bpId
     * @param  {} messages
     */
    static async getBPbyMartketFunctionCode(req, MarketFunctioncode) {
        const MarketFuncCode = MarketFunctioncode;
        const db = await cds.connect.to('db');
        let spDisplayId;
        let bpUUID;
        try {
            const res1 = await db.tx(req).run(
                SELECT.from(
                    'sap.odm.businesspartner.BusinessPartner.serviceProviderInformation'
                ).where({
                    marketFunctionCodeNumber1: MarketFuncCode,
                })
            );
            bpUUID = res1[0]?.up__id;
            if (bpUUID) {
                const res2 = await db.tx(req).run(
                    SELECT.from(
                        'sap.odm.businesspartner.BusinessPartner'
                    ).where({
                        id: bpUUID,
                    })
                );
                spDisplayId = res2[0]?.displayId;
            }
        } catch (e) {
            logger.error(
                `[distributionService][getBPbyMartketFunctionCode]: ${e.message}`
            );
        }
        return spDisplayId;
    }

    /**
     * fetch BP ID by metercode and DSOcode.
     * @param  {} req
     * @param  {} mcmInstance
     * @param  {} BpIdResponse
     * @param  {} messages
     */
    static async getBPbyMeterOperatorNDSOCode(req, mcmInstance) {
        try {
            const moMktFunCode =
                mcmInstance?.value[0]?.measurementConceptInstance
                    ?.changeProcesses[0]?.processData?.meteringLocationsPD[0]
                    ?.meterOperator;
            const dsoMktFunCode =
                mcmInstance?.value[0]?.measurementConceptInstance?.orderer_code;
            const utilitiesCode = [];
            let mktFunCodeNum1Dsocode;
            let mktFunCodeNum1MeterOprCode;
            let gridCode;
            let gridId;

            if (
                mcmInstance?.value[0]?.measurementConceptInstance
                    ?.meteringLocations[0]?.grid_code
            ) {
                gridId =
                    mcmInstance?.value[0]?.measurementConceptInstance
                        ?.meteringLocations[0]?.grid_code;
            } else if (
                mcmInstance?.value[0]?.measurementConceptInstance
                    ?.leadingGrid_code
            ) {
                gridId =
                    mcmInstance?.value[0]?.measurementConceptInstance
                        ?.leadingGrid_code;
            }
            if (gridId) {
                gridCode = {
                    gridId,
                    gridCode: 'grid Code',
                };
                utilitiesCode.push(gridCode);
            }

            // Fetching BP by meter operator code
            if (dsoMktFunCode) {
                const spDisplayID = await this.getBPbyMartketFunctionCode(
                    req,
                    dsoMktFunCode
                );
                if (spDisplayID) {
                    mktFunCodeNum1Dsocode = {
                        dsoSpDisplayId: spDisplayID,
                        codeNum1: dsoMktFunCode,
                    };
                }
            }

            // fetching BP by DSO Code
            if (moMktFunCode) {
                const spDisplayID = await this.getBPbyMartketFunctionCode(
                    req,
                    moMktFunCode
                );
                if (spDisplayID) {
                    mktFunCodeNum1MeterOprCode = {
                        moSpDisplayId: spDisplayID,
                        codeNum1: moMktFunCode,
                    };
                }
            }
            utilitiesCode.push(mktFunCodeNum1Dsocode);
            utilitiesCode.push(mktFunCodeNum1MeterOprCode);
            return utilitiesCode;
        } catch (e) {
            logger.error(
                `[distributionService][getBPbyMeterOperatorNDSOCode]: ${e.message}`
            );
            return null;
        }
    }

    /**
     *
     * @param {*} req
     * @param {*} item
     */
    static async getUtilitiesExtensioFields(req, meteringLocID) {
        let utilityCodes = '';
        const mcmInstance =
            await MeasurementConceptAPI.getMeasurementConceptInstance(
                req,
                meteringLocID
            );
        if (mcmInstance?.value) {
            utilityCodes =
                await DistributionFunctions.getBPbyMeterOperatorNDSOCode(
                    req,
                    mcmInstance
                );
        }
        return utilityCodes;
    }

    static async raiseErrorResponse(
        req,
        orderPerItemType,
        errorKey,
        errorMessage,
        response
    ) {
        const bundle = getBundle(req, i18nPath);
        let bundleText = '';

        await Promise.all(
            orderPerItemType.items.map(async (item, index) => {
                // Update Status from SB in Order item
                if (errorKey === 'errorMsgDistributionItemNotSupported') {
                    bundleText = `${bundle.getText(errorKey)}${item.id}`;
                } else {
                    bundleText = `${bundle.getText(errorKey)} ${errorMessage}`;
                }
                response.push({
                    orderItemId: item.id,
                    createdDocumentNumber: '',
                    isSuccess: false,
                    messages: [bundleText],
                });

                const sourceStatus = 'In Error';
                await DistributionFunctions.updateDistributionStatus(
                    req,
                    item.id,
                    sourceStatus,
                    response[index]
                );
            })
        );
    }
}
module.exports = DistributionFunctions;
