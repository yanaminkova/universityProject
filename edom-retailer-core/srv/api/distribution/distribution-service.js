const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const OrderFulfillmentHelper = require('./OrderFulfillmentHelper');
const DistributionFunctions = require('./DistributionFunctions');
const { getEnabledFeatures, getBundle } = require('../../lib/helper');

const i18nPath = '../../_i18n/i18n';
const loggerScope = `[distributionService]`;
logger.info(`${loggerScope}`);

function getUniqueSalesArea(physicalItems, businessScenarios) {
    const setArea = new Set();
    const uniqueSalesArea = [];

    physicalItems.forEach((phyItem) => {
        const busScenario = businessScenarios.find(
            (bus) => bus.customerOrderItemType_code === phyItem.type_code
        );
        const salesArea = {
            distributionChannel_code:
                phyItem.utilitiesAspect?.distributionChannel_code,
            division_code: phyItem.utilitiesAspect?.division_code,
            salesOrganization_id: phyItem.utilitiesAspect?.salesOrganization_id,
            businessAction_code: busScenario.businessAction_code,
            externalDocumentType_code: busScenario.externalDocumentType_code,
            externalDocumentHeaderType: busScenario.externalDocumentHeaderType,
        };

        if (!setArea.has(JSON.stringify(salesArea))) {
            setArea.add(JSON.stringify(salesArea));
            uniqueSalesArea.push(salesArea);
        }
        const itemSD = phyItem;
        itemSD.busScenario = busScenario;
    });
    return {
        uniqueSalesArea,
    };
}

function getValidOrderItems(orderDetails, businessScenarios, req) {
    // Validate if order Item has Business config ,Utilities Aspect defined
    const productIds = [];
    const salesOrg = [];
    const validOrderItems = [];
    const deviceTypePricingCode = [];
    const bundle = getBundle(req, i18nPath);

    orderDetails.items.forEach((item) => {
        const findScenario = businessScenarios.find(
            (scenario) => scenario.customerOrderItemType_code === item.type_code
        );
        if (item.utilitiesAspect === null) {
            logger.error(
                `${bundle.getText(
                    'errorMsgDistributionSRVUtilAspectNotFound'
                )} ${item.id}`
            );
        } else if (!findScenario) {
            logger.error(
                `${bundle.getText(
                    'errorMsgDistributionSRVBusinessScenarioNotFound'
                )} ${item.type_code}`
            );
        } else {
            // order items having Business Scenario and having Utilities and subscription Aspect
            salesOrg.push(item.utilitiesAspect?.salesOrganization_id);
            productIds.push(item.product_id);
            deviceTypePricingCode.push(
                item.utilitiesAspect?.deviceTypePricing_code
            );
            validOrderItems.push(item);
        }
    });
    return {
        salesOrg,
        productIds,
        deviceTypePricingCode,
        validOrderItems,
    };
}

/**
 * Call mapping function for Subscription items in Customer Order
 * and returns payloads to call SB API
 * @param {*} orderPerItem -  Customer Order with one item
 * @param {*} req - Subscription Items from Customer Order
 * @returns {} - object of Subscription Items & Product UUIDs list
 */

module.exports = async (srv) => {
    async function distributeOrder(req) {
        const { data } = req;
        const bundle = getBundle(req, i18nPath);
        logger.debug(`${loggerScope} ${JSON.stringify(data)}`);
        const orderId = req.data.id;
        let featureFlagUtilities;

        const utilitiesExtensionFeature = 'customerorder-sbcommodityextension';
        // get feature flag
        const utilitiesFeatures = await getEnabledFeatures(req, [
            utilitiesExtensionFeature,
        ]);

        if (utilitiesFeatures.includes(utilitiesExtensionFeature)) {
            featureFlagUtilities = Boolean(true);
        }

        const { orderDetails, businessScenarios } =
            await DistributionFunctions.getOrderDetails(
                req,
                featureFlagUtilities
            );

        const { salesOrg, productIds, deviceTypePricingCode, validOrderItems } =
            getValidOrderItems(orderDetails, businessScenarios, req);

        if (validOrderItems.length === 0) {
            logger.error(
                `${bundle.getText(
                    'errorMsgDistributionSRVValidOrderItemNotFound'
                )}`
            );
            req.reject({
                status: 406,
                message: `${bundle.getText(
                    'errorMsgDistributionSRVValidOrderItemNotFound'
                )}`,
            });
        }

        const { prodIds, sOrgDisplayIds, deviceTypeName } =
            await DistributionFunctions.getDisplayIds(
                req,
                productIds,
                salesOrg,
                deviceTypePricingCode
            );

        // For each item on customer order check for business config and call
        // corresponding function to fulfill order
        const sdItems = [];
        const itemPromises = [];
        businessScenarios.forEach((businessScenario) => {
            const payloadItem = validOrderItems.filter(
                (item) =>
                    item.type_code ===
                    businessScenario.customerOrderItemType_code
            );
            if (payloadItem.length > 0) {
                if (
                    businessScenario.externalDocumentType_code !== 'SalesOrder'
                ) {
                    const methodName =
                        businessScenario.businessAction_code.concat(
                            businessScenario.externalDocumentType_code
                        );
                    const oItem = {
                        ...orderDetails,
                    };
                    oItem.items = payloadItem;
                    itemPromises.push(
                        OrderFulfillmentHelper[methodName](
                            req,
                            businessScenario,
                            oItem,
                            prodIds,
                            sOrgDisplayIds,
                            deviceTypeName,
                            featureFlagUtilities
                        )
                    );
                } else {
                    // push SD items to be grouped later as per Sales area
                    sdItems.push(payloadItem);
                }
            }
        });
        const physicalItems = sdItems.flat();

        // Find Unique sales area for Physical items
        const { uniqueSalesArea } = getUniqueSalesArea(
            physicalItems,
            businessScenarios
        );

        // Prepare Payload items for unique sales area as per Business config table
        uniqueSalesArea.forEach((uniqueItem) => {
            const payloadSdItem = physicalItems.filter(
                (x) =>
                    x.utilitiesAspect?.salesOrganization_id ===
                        uniqueItem.salesOrganization_id &&
                    x.utilitiesAspect?.distributionChannel_code ===
                        uniqueItem.distributionChannel_code &&
                    x.utilitiesAspect?.division_code ===
                        uniqueItem.division_code &&
                    x.busScenario?.businessAction_code ===
                        uniqueItem.businessAction_code &&
                    x.busScenario?.externalDocumentHeaderType ===
                        uniqueItem.externalDocumentHeaderType
            );
            const methodName = uniqueItem.businessAction_code.concat(
                uniqueItem.externalDocumentType_code
            );
            const oItem = {
                ...orderDetails,
            };
            oItem.items = payloadSdItem;
            itemPromises.push(
                OrderFulfillmentHelper[methodName](
                    req,
                    '',
                    oItem,
                    prodIds,
                    sOrgDisplayIds
                )
            );
        });

        const response = await Promise.allSettled(itemPromises);
        const oItems = [];
        // Merge all Response arrays to one array
        response.forEach((item) => {
            const fulfilItem = item.value.flat();
            oItems.push(JSON.parse(JSON.stringify(fulfilItem)));
        });

        const orderItems = oItems.flat();

        orderItems.forEach((msg) => {
            const message = msg.messages.flat();
            if (message.length > 0) {
                logger.error(
                    `${loggerScope}: ${bundle.getText(
                        'errorMsgDistributionSRVDistributionErrorDetails'
                    )} ${JSON.stringify(msg.orderItemId)} : ${JSON.parse(
                        JSON.stringify(message)
                    )}`
                );
            }
        });

        return {
            orderId,
            orderItems,
        };
    }

    /**
     * Action distributeOrder
     * Indicates the endpoint for orchestrating Customer Order
     * Return is needed since distributeOrder will be triggered by action
     * @param {Object} req - Request Object.
     */
    srv.on('distributeOrder', async (req) => {
        const bundle = getBundle(req, i18nPath);

        try {
            return await distributeOrder(req);
        } catch (error) {
            logger.error(
                `${bundle.getText('errorMsgDistributionSRVDistributionError')}`,
                error
            );
        }
        return null;
    });

    // feature flag toggling for DistributionService service
    const distributionMessaging = await cds.connect.to('distributionMessaging');
    /**
     * Enterprise Messaging
     * Consume messages from Event Mesh and trigger Distribution Service
     * @param {Object} msg - Event Message.
     */
    distributionMessaging.on(
        'default/sap.c4u.retail/-/ce/sap/c4u/retail/CustomerOrder/Created/v1',
        async (msg) => {
            const bundle = getBundle(msg, i18nPath);
            const message = msg;
            const token = msg.context._.req.authInfo.getAppToken();
            message.headers.authorization = 'Bearer '.concat(token);
            try {
                await distributeOrder(message);
            } catch (error) {
                logger.error(
                    `${bundle.getText(
                        'errorMsgDistributionSRVDistributionError'
                    )}`,
                    error
                );
            }
        }
    );
};
