const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const SubscriptionBillingAPI = require('../../external/SubscriptionBillingAPI');
const SalesOrderAPI = require('../../external/SalesOrderAPI');
const DistributionFunctions = require('./DistributionFunctions');
const { getBundle } = require('../../lib/helper');
const TerminateSubscriptionOrderHelper = require('./TerminateSubscriptionOrderHelper');
const bpValidHelper = require('../../lib/businesspartner/businessPartnerValidationHelper');
const bpHelper = require('../../lib/businesspartner/businessPartnerHelper');
const { getEnabledFeatures } = require('../../lib/helper');

const bpBetaFeatureFlag = 'business-partner-enhancements';
const c4ufLocalIdsFeatureFlag = 'c4uf-localids';
const i18nPath = '../../_i18n/i18n';
const loggerScope = `[distributionService]`;
logger.info(`${loggerScope}`);

/**
 * Order Fulfillment Helper
 */
class OrderFulfillmentHelper {
    /**
     * Create Commodity subscription
     * @param {*} req
     * @param {*} businessScenario
     * @param {*} orderPerItemType
     * @param {*} prodIds
     * @param {*} sOrgDisplayIds
     * @returns
     */
    static createCommoditySubscription(
        req,
        businessScenario, // to be used later
        orderPerItemType,
        prodIds,
        sOrgDisplayIds,
        deviceTypeName,
        featureFlagUtilities
    ) {
        const subProfile = businessScenario.subscriptionProfile;
        const isCommodity = 'true';

        const obj = {
            req,
            orderPerItemType,
            prodIds,
            subProfile,
            sOrgDisplayIds,
            deviceTypeName,
            featureFlagUtilities,
            isCommodity,
        };

        return this.createSubscriptionHelper(obj);
    }

    /**
     * Create non commodity subscription
     * @param {*} req
     * @param {*} businessScenario
     * @param {*} orderPerItemType
     * @param {*} prodIds
     * @param {*} sOrgDisplayIds
     * @returns
     */
    static createNonCommoditySubscription(
        req,
        businessScenario,
        orderPerItemType,
        prodIds,
        sOrgDisplayIds
    ) {
        const subProfile = businessScenario.subscriptionProfile;
        const isCommodity = '';
        const obj = {
            req,
            orderPerItemType,
            prodIds,
            subProfile,
            sOrgDisplayIds,
            isCommodity,
        };
        return this.createSubscriptionHelper(obj);
    }

    /**
     * Method will be called from the Business Scenario config
     * "terminate" + "NonCommoditySubscription"
     * @param {*} req
     * @param {*} businessScenario
     * @param {*} orderPerItemType
     * @returns
     */
    static terminateNonCommoditySubscription(
        req,
        businessScenario,
        orderPerItemType
    ) {
        return TerminateSubscriptionOrderHelper.terminateNonCommoditySubscription(
            req,
            orderPerItemType
        );
    }

    /**
     *  Map Technical resources with type/installationID
     * @param {*} techRes
     * @param {*} installationID
     * @returns {}
     */
    static async mapCommoditySBTechnicalResources(
        req,
        isCommodity,
        item,
        prodId,
        messages
    ) {
        const bundle = getBundle(req, i18nPath);
        const technicalResources = [];
        if (isCommodity && messages.length === 0) {
            if (item.utilitiesAspect.referenceObject) {
                const installationID =
                    item.utilitiesAspect.referenceObject?.installation;
                const technicalRes =
                    await SubscriptionBillingAPI.getTechnicalResources(
                        req,
                        prodId
                    );

                if (!Array.isArray(technicalRes)) {
                    messages.push(
                        `${bundle.getText(
                            'errorMsgDistributionSRVTechnicalResourcesNotFound'
                        )} ${prodId}, ${bundle.getText(
                            'errorMsgDistributionSRVError'
                        )} ${technicalRes.message}`
                    );
                } else {
                    technicalRes.forEach((obj) => {
                        technicalResources.push({
                            id: installationID,
                            type: obj.type,
                        });
                    });
                }
            } else {
                messages.push(
                    `${bundle.getText(
                        'errorMsgDistributionSRVReferenceObjectNotFound'
                    )} ${item.id}`
                );
            }
        } else if (!isCommodity && messages.length === 0) {
            if (item.subscriptionAspect.technicalResources) {
                const technicalRes = item.subscriptionAspect.technicalResources;

                technicalRes.forEach((obj) => {
                    const { resourceId, resourceName } = obj;

                    technicalResources.push({
                        id: resourceId,
                        type: resourceName,
                    });
                });
            }
        }
        return { technicalResources };
    }

    /**
     *  Map utilities Extension for commodity
     * @param {*} techRes
     * @param {*} installationID
     * @returns {}
     */
    static async mapUtilitiesExtension(
        req,
        item,
        messages,
        featureFlagUtilities,
        deviceTypeName
    ) {
        let utilitiesExtension;
        let utilityCodes;
        const bundle = getBundle(req, i18nPath);
        let gridId;
        const enabledFeatures = await getEnabledFeatures(req, [
            bpBetaFeatureFlag,
            c4ufLocalIdsFeatureFlag,
        ]);
        const helper = {
            ...bpValidHelper(enabledFeatures),
            ...bpHelper(enabledFeatures),
        };
        if (featureFlagUtilities) {
            if (
                item.utilitiesAspect?.supplyAddress_id &&
                messages.length === 0
            ) {
                const bpId = item.utilitiesAspect.supplyAddress_up__id;
                const bpWithAddress = await helper.getExpandedBP(
                    bpId,
                    helper.getExpandedBpAddressDataQuery
                );
                const BpAddressdetails = bpWithAddress.addressData.filter(
                    (add) => add.id === item.utilitiesAspect.supplyAddress_id
                );
                // Get Utilities Extension fields from Measurement Concept Instance
                const meteringLocID =
                    item.utilitiesAspect?.referenceObject?.installation;
                if (meteringLocID) {
                    utilityCodes =
                        await DistributionFunctions.getUtilitiesExtensioFields(
                            req,
                            meteringLocID
                        );
                    if (!utilityCodes) {
                        messages.push(
                            bundle.getText(
                                `errorMsgDistributionSRVMarketFunctionReadErrorBP`
                            )
                        );
                        return {};
                    }
                }

                // Fetch Product Display ID from product UUID for current item
                const deviceName = deviceTypeName.find(
                    (name) =>
                        name.code ===
                        item.utilitiesAspect?.deviceTypePricing_code
                );
                // logic tofetch gridId
                if (item.utilitiesAspect?.gridPricing) {
                    gridId = item.utilitiesAspect?.gridPricing;
                } else if (utilityCodes[0]?.gridId) {
                    gridId = utilityCodes[0]?.gridId;
                }

                utilitiesExtension = {
                    supplyAddress: {
                        postalCode:
                            BpAddressdetails[0]?.personPostalAddress?.postCode,
                        id: item.utilitiesAspect?.supplyAddress_id, // Read postal Code from C4U BP and pass GUid here from customer order
                    },
                    meterOperator: {
                        id: utilityCodes[2]?.moSpDisplayId,
                        code: utilityCodes[2]?.codeNum1,
                    },
                    distributionSystemOperator: {
                        id: utilityCodes[1]?.dsoSpDisplayId,
                        code: utilityCodes[1]?.codeNum1,
                    },
                    location: item.utilitiesAspect?.podId,
                    grid: gridId,
                    deviceType: deviceName.name,
                    geographicalCode: item.utilitiesAspect?.geographicalCode,
                };
            }
        }

        return { utilitiesExtension };
    }

    /**
     * Get Custom references from subscription aspect and pass to header and item of SB API
     * @param {*} orderItem
     * @param {*} isCommodity
     * @returns {*} header ,item and Subscription custom reference
     */

    static async getCustomReferences(
        orderItem,
        isCommodity,
        sbExtensionEnabled
    ) {
        const headerCustomReferences = [];
        const subscriptionParameters = [];
        const itemCustomReferences = [];
        let extensionParams = {};

        // only for commodity subscription
        if (isCommodity && sbExtensionEnabled) {
            // get Header Custom Reference
            if (orderItem.subscriptionAspect.headerCustomReferences) {
                const customReferences =
                    orderItem.subscriptionAspect.headerCustomReferences;
                customReferences.forEach((obj) => {
                    const id = obj.customReferenceId;
                    const { typeCode } = obj;

                    headerCustomReferences.push({
                        id,
                        typeCode,
                    });
                });
            }
            // get Item Custom Reference
            if (orderItem.subscriptionAspect.itemCustomReferences) {
                const customReferences =
                    orderItem.subscriptionAspect.itemCustomReferences;
                customReferences.forEach((obj) => {
                    const id = obj.customReferenceId;
                    const { typeCode } = obj;

                    itemCustomReferences.push({
                        id,
                        typeCode,
                    });
                });
            }

            // item Subscription Reference
            if (orderItem.subscriptionAspect.itemSubscriptionParameters) {
                const subscriptionReferences =
                    orderItem.subscriptionAspect.itemSubscriptionParameters;
                subscriptionReferences.forEach((obj) => {
                    const { code, value } = obj;

                    subscriptionParameters.push({
                        code,
                        value,
                    });
                });
            }
            extensionParams = {
                headerCustomReferences,
                itemCustomReferences,
                subscriptionParameters,
            };
        }
        return extensionParams;
    }

    /**
     * Checks feature flag.
     * @param {*} req
     * @returns {Promise<Object>}
     */
    static async checkFeatureFlag(req) {
        // Check feature flag
        let sbExtensionEnabled = Boolean(false);
        const sbExtensionFlagName = 'customerorder-sbextension';
        // get feature flag
        const sbExtensionFeature = await getEnabledFeatures(req, [
            sbExtensionFlagName,
        ]);

        if (sbExtensionFeature.includes(sbExtensionFlagName)) {
            sbExtensionEnabled = Boolean(true);
        }
        return Promise.resolve(sbExtensionEnabled);
    }

    /**
     * Subscription creation helper
     * @param {*} req
     * @param {*} orderPerItemType
     * @returns {Object}
     */
    static async createSubscriptionHelper(subscription) {
        const {
            req,
            orderPerItemType,
            prodIds,
            subProfile,
            sOrgDisplayIds,
            deviceTypeName,
            featureFlagUtilities,
            isCommodity,
        } = subscription;

        const response = [];
        let errorKey;
        let errorMessage;
        if (isCommodity && !featureFlagUtilities) {
            errorKey = 'errorMsgDistributionItemNotSupported';
            await DistributionFunctions.raiseErrorResponse(
                req,
                orderPerItemType,
                errorKey,
                errorMessage,
                response
            );
            return Promise.resolve(response);
        }

        // Get Markets from Subscription Billing
        const SBResponse = await SubscriptionBillingAPI.getMarkets(req);
        // Object for technical resources
        let mappedTechnicalResources = {};
        // Feature flag
        let utilitiesExtension = {};
        // Validate if SB response above returns markets
        if (!SBResponse.businessConfigResponse) {
            errorKey = 'errorMsgDistributionSRVErrorFetchingMarkets';
            errorMessage = SBResponse.message;

            await DistributionFunctions.raiseErrorResponse(
                req,
                orderPerItemType,
                errorKey,
                errorMessage,
                response
            );
            return Promise.resolve(response);
        }

        const { markets } = SBResponse.businessConfigResponse.value;
        let map;
        try {
            await Promise.all(
                orderPerItemType.items.map(async (item, index) => {
                    let sourceStatus;
                    let messages = [];
                    response.push({
                        orderItemId: item.id,
                        createdDocumentNumber: '',
                        isSuccess: '',
                        messages: [],
                    });

                    // Check if subsequent Id already exists for order item
                    await DistributionFunctions.checkErrorItems(
                        req,
                        item,
                        response[index]
                    );

                    if (response[index].isSuccess === '') {
                        map = index;
                        // Read Market,Product Display Id's
                        const { prodId, market, newMessages } =
                            await DistributionFunctions.getSbItemData(
                                prodIds,
                                sOrgDisplayIds,
                                markets,
                                item,
                                messages,
                                req
                            );

                        messages = newMessages;
                        // Map TR for commodity product
                        mappedTechnicalResources =
                            await this.mapCommoditySBTechnicalResources(
                                req,
                                isCommodity,
                                item,
                                prodId.displayId,
                                messages
                            );
                        // Map utilities Extension for Commodity
                        utilitiesExtension = await this.mapUtilitiesExtension(
                            req,
                            item,
                            messages,
                            featureFlagUtilities,
                            deviceTypeName
                        );

                        const sbExtensionEnabled = await this.checkFeatureFlag(
                            req
                        );
                        const customReferences = await this.getCustomReferences(
                            item,
                            isCommodity,
                            sbExtensionEnabled
                        );

                        // prepare payload to be passed to subscription billing API
                        // if any field is null error will be caught outside the method call
                        const sbObject = {
                            item,
                            orderPerItemType,
                            market,
                            prodId,
                            subProfile,
                            messages,
                            mappedTechnicalResources,
                            customReferences,
                            utilitiesExtension,
                        };
                        const { subItems } = await this.prepareSbPayload(
                            req,
                            sbObject,
                            featureFlagUtilities,
                            sbExtensionEnabled
                        );
                        if (messages.length === 0) {
                            const subscriptionPayload = JSON.parse(
                                JSON.stringify(subItems[0])
                            );

                            const subscriptionPayloadNoNull =
                                this.removeNullFromPayload(subscriptionPayload);

                            // Send request to Subscription Billing API to fulfill order item
                            const responseSb =
                                await SubscriptionBillingAPI.postSubscription(
                                    subscriptionPayloadNoNull,
                                    req
                                );
                            await this.sbResponse(
                                req,
                                responseSb,
                                item,
                                messages,
                                SBResponse,
                                response[index]
                            );
                        }
                        if (
                            messages.length !== 0 &&
                            response[index].isSuccess !== true
                        ) {
                            response[index].messages = messages;
                            response[index].isSuccess = false;
                            // Update Status from SB in Order item
                            sourceStatus = 'In Error';
                            await DistributionFunctions.updateDistributionStatus(
                                req,
                                item.id,
                                sourceStatus,
                                response[index]
                            );
                        }
                    }
                })
            );
        } catch (error) {
            response[map].messages = [error.message];
            response[map].isSuccess = false;
        }

        return Promise.resolve(response);
    }

    static removeNullFromPayload(payloadWithNull) {
        // remove null chars by changing them with undefined
        return JSON.parse(
            JSON.stringify(payloadWithNull, (key, value) => {
                if (value == null) {
                    return undefined;
                }
                return value;
            })
        );
    }

    /**
     * Get SD Item
     * @param {*} filteredCustomerOrder
     * @param {*} prodIds
     * @returns
     */
    static async sbResponse(
        req,
        responseSb,
        item,
        messages,
        SBResponse,
        response
    ) {
        const bundle = getBundle(req, i18nPath);
        if (responseSb.subscriptionDocumentId) {
            // Update Subsequent Document Id
            await DistributionFunctions.updateSubsequentSub(
                req,
                item,
                responseSb,
                messages
            );
            response.createdDocumentNumber = responseSb.subscriptionDocumentId;
            response.isSuccess = true;
            response.messages = messages;
            // Update Status from SB in Order item
            const sourceStatus = responseSb.status;
            const source = SBResponse.SBDest.destination;
            await DistributionFunctions.updateItemStatus(
                req,
                item.id,
                source,
                sourceStatus,
                response
            );
        } else {
            messages.push([
                `${bundle.getText(
                    'errorMsgDistributionSRVErrorSubscriptionCreation'
                )} ${
                    responseSb.innererror?.response?.body?.message ||
                    responseSb.message
                }`,
            ]);
        }
    }

    /**
     * Prepare payload for Subscription Billing API
     * @param  {} req
     * @param  {} item
     * @param  {} source
     */
    static async prepareSbPayload(
        req,
        sbObject,
        featureFlagUtilities,
        sbExtensionEnabled
    ) {
        const bundle = getBundle(req, i18nPath);
        const {
            item,
            orderPerItemType,
            market,
            prodId,
            subProfile,
            messages,
            mappedTechnicalResources,
            utilitiesExtension,
            customReferences,
        } = sbObject;
        // Do not prepare payload and post to SB Api if any errors encountered
        if (messages.length === 0) {
            const subscriptionBP =
                await DistributionFunctions.getExternalSystemBPNumber(
                    req,
                    orderPerItemType.partners[0],
                    messages,
                    'SBDestination',
                    'SBBusinessSystem'
                );

            if (!subscriptionBP) {
                messages.push(
                    `${bundle.getText(
                        'errorMsgDistributionSRVSubscriptionCustomerNotFound'
                    )}`
                );
                return {};
            }

            let subItem;
            const subItems = [];
            try {
                subItem = {
                    validFrom: item.subscriptionAspect?.validFrom,
                    validUntil: item.subscriptionAspect?.validTo,
                    billingCycle:
                        item.subscriptionAspect?.contractTerm.periodicity,
                    subscriptionProfile: {
                        id: subProfile,
                    },
                    customer: {
                        id: subscriptionBP,
                    },
                    market: {
                        id: market[0].id,
                    },
                    ...(featureFlagUtilities && {
                        billingCycleReferenceDate:
                            item?.utilitiesAspect?.referenceBillDate,
                    }),
                    billSplitElement: orderPerItemType?.displayId?.concat(
                        item.id
                    ),
                    contractTerm: {
                        startDate: item.subscriptionAspect?.validFrom,
                        period: item.subscriptionAspect?.contractTerm.period,
                        endDate: item.subscriptionAspect?.validTo,
                    },
                    externalObjectReferences: [
                        {
                            externalIdTypeCode:
                                'sap.edom.retailer-customer-order.displayId',
                            externalId: orderPerItemType?.displayId,
                            externalSystemId: 'anyCommerce',
                        },
                    ],
                    ...(featureFlagUtilities && {
                        utilitiesExtension: {
                            budgetBillingType:
                                item.utilitiesAspect?.budgetBillingType_code,
                        },
                    }),
                    ...(sbExtensionEnabled && {
                        customReferences:
                            customReferences.headerCustomReferences,
                    }),
                    // payment: {
                    //       paymentMethod: 'Payment Card',
                    //     //   paymentCardToken: orderPerItemType.paymentReferences[0].token,
                    //  },
                    snapshots: [
                        {
                            effectiveDate: item.subscriptionAspect?.validFrom,
                            items: [
                                {
                                    itemId: item.id,
                                    subscriptionType: null,
                                    lineNumber: item.id,
                                    contractAccount:
                                        orderPerItemType?.partners[0]
                                            ?.contractAccountId,
                                    externalObjectReferences: [
                                        {
                                            externalIdTypeCode:
                                                'sap.edom.retailer-customer-order.itemId',
                                            externalId: item.id,
                                            externalSystemId: 'anyCommerce',
                                        },
                                    ],
                                    ...(Object.keys(utilitiesExtension)
                                        .length !== 0 && utilitiesExtension),
                                    ...(sbExtensionEnabled && {
                                        customReferences:
                                            customReferences.itemCustomReferences,
                                        subscriptionParameters:
                                            customReferences.subscriptionParameters,
                                    }),
                                    product: {
                                        code: prodId.displayId,
                                    },
                                    ...(Object.keys(mappedTechnicalResources)
                                        .length !== 0 &&
                                        mappedTechnicalResources),
                                },
                            ],
                        },
                    ],
                };

                subItems.push(subItem);
                return { subItems };
            } catch (error) {
                messages.push(
                    `${bundle.getText(
                        'errorMsgDistributionSRVErrorCreatingSBPayload'
                    )} ${item.id}`
                );
            }
        }
        return {};
    }

    /**
     * Call mapping function for Subscription items in Customer Order
     * and returns payloads to call SB API
     * @param {*} payload - Subscription Items from Customer Order
     * @returns {} - object of Subscription Items & Product UUIDs list
     */
    static async createSalesOrder(
        req,
        businessScenario, // to be used later
        orderItemPerSalesArea,
        prodIds,
        sOrgDisplayIds
    ) {
        const bundle = getBundle(req, i18nPath);
        const { response } = await this.checkSdItems(
            req,
            orderItemPerSalesArea
        );
        let findResp;
        // Check if any item has response structure filled
        orderItemPerSalesArea.items.find((item) => {
            findResp = response.find(
                (resp) =>
                    resp.isSuccess === true && resp.orderItemId === item.id
            );
            return findResp;
        });

        if (!findResp) {
            const messages = [];
            let findError;
            // Construct Sales Distribution OData object
            const salesDist = this.setSalesDist(
                orderItemPerSalesArea,
                sOrgDisplayIds,
                messages,
                req
            );

            if (messages.length === 0) {
                // Get SD Item
                const sdItems = this.getSDItem(
                    orderItemPerSalesArea,
                    prodIds,
                    response,
                    req
                );
                // Check if any item resulted in Error for Sales area
                orderItemPerSalesArea.items.forEach((item) => {
                    findError = response.find(
                        (resp) =>
                            resp.isSuccess === false &&
                            resp.orderItemId === item.id
                    );
                });

                if (!findError) {
                    salesDist.to_Item.push(...sdItems);
                    const SDPayload = JSON.parse(JSON.stringify(salesDist));
                    const responseSd = await new SalesOrderAPI().postSDOrder(
                        req,
                        SDPayload,
                        orderItemPerSalesArea.partners[0]
                    );
                    if (responseSd.documentNumber) {
                        // Update Subsequent Document Id
                        await this.updateSubsequentSd(
                            req,
                            orderItemPerSalesArea,
                            responseSd,
                            response,
                            prodIds
                        );
                    } else if (responseSd.msg) {
                        messages.push(
                            `${bundle.getText(
                                'errorMsgDistributionSRVErrorCreatingSD'
                            )} ${responseSd.msg} `
                        );
                    } else if (responseSd.error?.response.data.error.message) {
                        messages.push(
                            `${bundle.getText(
                                'errorMsgDistributionSRVErrorCreatingSD'
                            )} ${
                                responseSd.error?.response.data.error.message
                            } `
                        );
                    } else {
                        messages.push(
                            `${bundle.getText(
                                'errorMsgDistributionSRVErrorCreatingSD'
                            )} ${responseSd.message} `
                        );
                    }
                }
                // Update error in order item if any error messages exist
                await this.updateSdErrorStatus(
                    req,
                    orderItemPerSalesArea,
                    response,
                    findError,
                    messages
                );
            }
        }
        return Promise.resolve(response);
    }

    /**
     * Update Subsequent doc for Physical Item
     * @param  {} req
     * @param  {} orderItemPerSalesArea
     * @param  {} responseSd
     * @param  {} response
     */
    static async updateSubsequentSd(
        req,
        orderItemPerSalesArea,
        responseSd,
        response,
        prodIds
    ) {
        const bundle = getBundle(req, i18nPath);
        let subsequentDocument = [];
        let itemIndex;
        let sourceStatus;
        // Set the subsequent Document number in the customer order Object
        await Promise.all(
            orderItemPerSalesArea.items.map(async (item) => {
                let itemDet;
                let dispId;
                try {
                    const prodId = prodIds.find(
                        (element) => element.id === item.product_id
                    );
                    if (prodId) {
                        itemDet = responseSd.sdOrderItemDetails.find(
                            (e) => e.Material === prodId.displayId
                        );
                        itemIndex = responseSd.sdOrderItemDetails.findIndex(
                            (x) => x.SalesOrderItem === itemDet.SalesOrderItem
                        );
                        dispId = `${itemDet.SalesOrder}-${itemDet.SalesOrderItem}`;
                        responseSd.sdOrderItemDetails.splice(itemIndex, 1);
                    }

                    const { API_EDOM_RETAILER } = cds.services;

                    const { CustomerOrderItemUtilitiesSubsequentDocument } =
                        API_EDOM_RETAILER.entities;
                    subsequentDocument = {
                        up__up__up__id: req.data.id,
                        up__up__id: item.id,
                        id: cds.utils.uuid(),
                        displayId: dispId,
                        type_code: item.type_code,
                        isBlocked: false,
                    };

                    const respIndex = response.findIndex(
                        (respItem) => respItem.orderItemId === item.id
                    );
                    response[respIndex].isSuccess = true;
                    response[respIndex].createdDocumentNumber =
                        subsequentDocument.displayId;

                    // INSERT  Subsequent Doc details to  API EDOM retailer
                    await API_EDOM_RETAILER.transaction(req).run(
                        INSERT.into(
                            CustomerOrderItemUtilitiesSubsequentDocument
                        ).entries(subsequentDocument)
                    );

                    // Update Status from SD in Order item
                    sourceStatus = itemDet.SDProcessStatus;
                    const source = responseSd.destName;
                    await DistributionFunctions.updateItemStatus(
                        req,
                        item.id,
                        source,
                        sourceStatus,
                        response[respIndex]
                    );
                } catch (error) {
                    const respIndex = response.findIndex(
                        (respItem) => respItem.orderItemId === item.id
                    );
                    response[respIndex].messages = [
                        `${bundle.getText(
                            'errorMsgDistributionSRVErrorUpdatingSubsequentId'
                        )} ${item.id}`,
                    ];
                }
            })
        );
    }

    /**
     * Update Subsequent doc for Physical Item
     * @param  {} req
     * @param  {} item
     * @param  {} responseSd
     * @param  {} messages
     */
    static async checkSdItems(req, orderPerItem) {
        const response = [];
        await Promise.all(
            orderPerItem.items.map(async (item, index) => {
                response.push({
                    orderItemId: item.id,
                    createdDocumentNumber: '',
                    isSuccess: '',
                    messages: [],
                });
                // Check if subsequent Id already exists for order item
                await DistributionFunctions.checkErrorItems(
                    req,
                    item,
                    response[index]
                );
            })
        );
        return { response };
    }

    /**
     * Update Subsequent doc for Physical Item
     * @param  {} req
     * @param  {} item
     * @param  {} responseSd
     * @param  {} messages
     */
    static async updateSdErrorStatus(
        req,
        orderItemPerSalesArea,
        response,
        findError,
        messages
    ) {
        let itemRes;
        let sourceStatus;
        if (findError || messages.length !== 0) {
            await Promise.all(
                orderItemPerSalesArea.items.map(async (item) => {
                    const respIndex = response.findIndex(
                        (respItem) => respItem.orderItemId === item.id
                    );
                    response[respIndex].isSuccess = false;
                    // Update Status  in Order item
                    sourceStatus = 'In Error';
                    itemRes = response[respIndex].orderItemId;
                    if (!findError) {
                        response[respIndex].messages = messages;
                    }
                    await DistributionFunctions.updateDistributionStatus(
                        req,
                        itemRes,
                        sourceStatus,
                        response[respIndex]
                    );
                })
            );
        }
    }

    /**
     *
     * @param {*} orderItemPerSalesArea
     * @param {*} sOrgDisplayIds
     * @param {*} messages
     * @param {*} req
     * @returns
     */
    static setSalesDist(orderItemPerSalesArea, sOrgDisplayIds, messages, req) {
        const bundle = getBundle(req, i18nPath);
        try {
            const salesDistObj = {
                SalesOrderType:
                    orderItemPerSalesArea.items[0].busScenario
                        .externalDocumentHeaderType,
                SalesOrganization: sOrgDisplayIds.find(
                    (o) =>
                        o.id ===
                        orderItemPerSalesArea.items[0].utilitiesAspect
                            ?.salesOrganization_id
                ).displayId,

                DistributionChannel:
                    orderItemPerSalesArea.items[0].utilitiesAspect
                        ?.distributionChannel_code,

                OrganizationDivision:
                    orderItemPerSalesArea.items[0].utilitiesAspect
                        ?.division_code,

                SDDocumentReason: orderItemPerSalesArea?.orderReason_code,

                ShippingCondition:
                    orderItemPerSalesArea?.salesAspect?.shippingCondition_code,

                SoldToParty:
                    orderItemPerSalesArea.partners[0].businessPartnerId,
                ContractAccount:
                    orderItemPerSalesArea?.partners[0]?.contractAccountId,
                CustomerPaymentTerms:
                    orderItemPerSalesArea?.salesAspect?.paymentTerms_code,

                PurchaseOrderByCustomer: orderItemPerSalesArea.displayId,
            };

            salesDistObj.to_PricingElement = [];

            orderItemPerSalesArea?.priceComponents.forEach((oItem) => {
                const priceElement = {
                    ConditionType: oItem ? oItem.conditionType_code : null,
                    ConditionRateValue:
                        oItem && oItem.value ? oItem.value.toString() : null,
                };
                salesDistObj.to_PricingElement.push(priceElement);
            });

            salesDistObj.to_Item = [];
            return salesDistObj;
        } catch (error) {
            messages.push(
                `${bundle.getText(
                    'errorMsgDistributionSRVErrorCreatingSDHeaderPayload'
                )} ${error.message}`
            );
            return {};
        }
    }

    /**
     *
     * @param {*} orderItemPerSalesArea
     * @param {*} prodIds
     * @param {*} response
     * @param {*} req
     * @returns
     */
    static getSDItem(orderItemPerSalesArea, prodIds, response, req) {
        const bundle = getBundle(req, i18nPath);
        const sdItems = [];
        orderItemPerSalesArea.items.forEach((oItem) => {
            try {
                const NetAmount =
                    oItem && oItem.netAmount
                        ? oItem.netAmount.toString()
                        : null;

                const RequestedQuantity =
                    oItem && oItem.quantity ? oItem.quantity.toString() : null;
                const SDItem = {
                    //  Value doesn't show up on S4 system yet
                    NetAmount,
                    SalesOrderItemCategory:
                        oItem.busScenario.externalDocumentItemType,
                    /*eslint-disable */
                    Material: prodIds.find((o) => o.id === oItem.product_id)
                        .displayId,
                    RequestedQuantity,
                    RequestedQuantityUnit: oItem?.quantityUnit_code,
                    PurchaseOrderByShipToParty:
                        orderItemPerSalesArea.displayId.concat('-', oItem.id),
                };

                if (!SDItem.Material) {
                    const respIndex = response.findIndex(
                        (respItem) => respItem.orderItemId === oItem.id
                    );
                    response[respIndex].messages.push(
                        `${bundle.getText(
                            'errorMsgDistributionSRVMaterialDisplayIdNotFound'
                        )} ${oItem.product_id}`
                    );
                    response[respIndex].isSuccess = false;
                }

                SDItem.to_PricingElement = [];
                this.getPricingElement(oItem, SDItem);
                sdItems.push(SDItem);
            } catch (error) {
                const respIndex = response.findIndex(
                    (respItem) => respItem.orderItemId === oItem.id
                );
                response[respIndex].messages.push(
                    `${bundle.getText(
                        'errorMsgDistributionSRVErrorCreatingSDItemPayload'
                    )} ${error.message}`
                );
                response[respIndex].isSuccess = false;
            }
        });
        return sdItems;
    }

    /**
     * Get SD Item
     * @param {*} filteredCustomerOrder
     * @param {*} prodIds
     * @returns
     */
    static getPricingElement(filteredCustomerOrder, SDItem) {
        filteredCustomerOrder?.priceComponents.forEach((priceComponent) => {
            const priceElement = {
                ConditionType: priceComponent
                    ? priceComponent.conditionType_code
                    : null,
                ConditionRateValue:
                    priceComponent && priceComponent.value
                        ? priceComponent.value.toString()
                        : null,
            };
            SDItem.to_PricingElement.push(priceElement);
        });
    }
}
module.exports = OrderFulfillmentHelper;
