const logger = require('cf-nodejs-logging-support');
const AuditLogService = require('../dpp/AuditLogService');
const CloudEventMessageBuilder = require('../event/CloudEventMessageBuilder');
const {
    setEndOfBusinessDate,
    recalculateCustomerOrderStatus,
    updateCustomerOrderStatusCode,
} = require('../lib/customerOrder/customerOrderHelper');

module.exports = async (srv) => {
    const db = await cds.connect.to('db');

    /*
     * Handler
     */

    /**
     * CLOSE
     * Indicates the endpoint for closing Customer Order
     * @param {Object} cds.Request - Request Object.
     */
    srv.on('close', 'CustomerOrder', async (req) => {
        const endOfBusinessDate = new Date().toISOString();

        try {
            const affectedRows = await db.transaction(req).run(
                UPDATE('sap.odm.sales.CustomerOrder')
                    .set({
                        endOfBusinessDate,
                    })
                    .where({
                        id: req.params[0].id,
                    })
            );

            logger.info(
                `[API_EDOM_RETAILER][Number of items closed]: ${affectedRows}`
            );
        } catch (error) {
            logger.error(`[API_EDOM_RETAILER][Close action]: ${error}`);
            req.error({
                status: 500,
                message: error.message,
            });
        }
        return null;
    });

    /**
     *
     * Set default processingStatus to Customer Order and Customer Order Item
     */
    srv.before(
        'CREATE',
        ['CustomerOrder', 'CustomerOrderItems'],
        async (req) => {
            const defaultStatusCode = await db
                .transaction(req)
                .run(
                    SELECT.one('code')
                        .from('sap.odm.sales.SalesProcessingStatusCodes')
                        .where({ isDefault: true })
                );

            if (defaultStatusCode?.code) {
                if (!req.data.processingStatus_code) {
                    req.data.processingStatus_code = defaultStatusCode.code;
                }

                if (req.data?.items) {
                    req.data.items.forEach((element) => {
                        const item = element;
                        if (!item.processingStatus_code) {
                            item.processingStatus_code = defaultStatusCode.code;
                        }
                    });
                }
            }
        }
    );

    /**
     *
     * Supports single TRUE value for isDefault property
     */
    srv.before(
        ['UPDATE', 'CREATE'],
        'SalesProcessingStatusCodes',
        async (req) => {
            if (req.data.isDefault) {
                // Set for all records isDefault false and continue with standart
                await db
                    .transaction(req)
                    .run(
                        UPDATE('sap.odm.sales.SalesProcessingStatusCodes')
                            .set({ isDefault: false })
                            .where({ isDefault: true })
                    );
            }
        }
    );

    /**
     * Event Mesh
     *
     * Emit message to EM when CustomerOrder Created or Updated
     */
    const emTypeHashMap = {
        POST: 'sap.c4u.retail.CustomerOrder.Created.v1',
        PATCH: 'sap.c4u.retail.CustomerOrder.Updated.v1',
        PUT: 'sap.c4u.retail.CustomerOrder.Updated.v1',
    };

    const emTopicHashMap = {
        POST: 'CustomerOrder/Created/v1',
        PATCH: 'CustomerOrder/Updated/v1',
        PUT: 'CustomerOrder/Updated/v1',
    };

    const messaging = await cds.connect.to('messaging');

    srv.after(
        ['CREATE', 'UPDATE'],
        'CustomerOrder',
        async (customerOrder, req) => {
            await setEndOfBusinessDate(req, customerOrder);

            const type = emTypeHashMap[req.method];
            const cloudEventMessage = new CloudEventMessageBuilder()
                .setSource(messaging)
                .setType(type)
                .setSubject(customerOrder.id)
                .build();

            await messaging.tx(req).emit(
                `topic:${messaging.queueName || ''}/${
                    emTopicHashMap[req.method]
                }`,
                {
                    id: customerOrder.id,
                },
                JSON.parse(cloudEventMessage.body)
            );

            if (
                customerOrder?.items?.filter((i) => i.processingStatus_code)
                    .length > 0
            ) {
                try {
                    const processingStatusCode =
                        await recalculateCustomerOrderStatus(
                            req,
                            customerOrder.id
                        );

                    if (processingStatusCode) {
                        logger.debug(
                            `[API_EDOM_RETAILER][Update CustomerOrder processing status to]: ${processingStatusCode}`
                        );

                        await updateCustomerOrderStatusCode(
                            srv,
                            req,
                            customerOrder.id,
                            processingStatusCode
                        );
                    }
                } catch (error) {
                    logger.error(
                        `[API_EDOM_RETAILER][Update CustomerOrder processing status]: ${error}`
                    );

                    req.error({
                        status: 500,
                        message: error.message,
                    });
                }
            }
        }
    );

    /**
     * Overall Status Recalculation
     *
     * Update processing status of CustomerOrder when CustomerOrderItem is Created or Updated
     */
    srv.after(
        ['CREATE', 'UPDATE'],
        'CustomerOrderItems',
        async (customerOrderItem, req) => {
            if (customerOrderItem.processingStatus_code) {
                try {
                    const processingStatusCode =
                        await recalculateCustomerOrderStatus(
                            req,
                            customerOrderItem.up__id
                        );

                    if (processingStatusCode) {
                        logger.debug(
                            `[API_EDOM_RETAILER][Update CustomerOrder processing status to]: ${processingStatusCode}`
                        );

                        await updateCustomerOrderStatusCode(
                            srv,
                            req,
                            customerOrderItem.up__id,
                            processingStatusCode
                        );
                    }
                } catch (error) {
                    logger.error(
                        `[API_EDOM_RETAILER][Update CustomerOrder processing status]: ${error}`
                    );

                    req.error({
                        status: 500,
                        message: error.message,
                    });
                }
            }
        }
    );

    srv.after('CREATE', 'CustomerOrder', async (customerOrder, req) => {
        try {
            const processingStatusCode = await recalculateCustomerOrderStatus(
                req,
                customerOrder.id
            );

            if (processingStatusCode) {
                await updateCustomerOrderStatusCode(
                    srv,
                    req,
                    customerOrder.id,
                    processingStatusCode
                );
            }
        } catch (error) {
            logger.error(
                `[API_EDOM_RETAILER][Update CustomerOrder processing status]: ${error}`
            );

            req.error({
                status: 500,
                message: error.message,
            });
        }
    });

    /**
     * ODM migration
     *
     * Company Code needs to handle name as string
     */
    srv.on(['CREATE', 'UPDATE'], 'CompanyCode', async (req) => {
        const { techApiEdomRetailerCompanyCodeOrig } = cds.model.definitions;

        req.data.name = {
            name: req.data.name,
        };

        const response = await srv
            .transaction(req)
            .run(INSERT.into(techApiEdomRetailerCompanyCodeOrig, req.data));

        if (response) {
            response.name = response.name.name;
        }

        return response;
    });

    srv.reject(`DELETE`, [
        'CustomerOrder',
        'CustomerOrderItems',
        'CustomerOrderPartners',
        'CustomerOrderNotes',
        'CustomerOrderPriceComponents',
        'CustomerOrderSalesAspect',
        'CustomerOrderServiceAspect',
        'ServiceOrderReferenceObject',
        'CustomerOrderItemPartners',
        'CustomerOrderItemNotes',
        'CustomerOrderItemPriceComponents',
        'CustomerOrderItemSalesAspect',
        'SalesOrderScheduleLine',
        'CustomerOrderItemServiceAspect',
        'ServiceOrderItemReferenceObject',
        'CustomerOrderItemUtilitiesAspect',
        'CustomerOrderItemUtilitiesReferenceObject',
        'CustomerOrderItemUtilitiesSubsequentDocument',
        'CustomerOrderItemSubscriptionAspect',
    ]);

    AuditLogService.registerHandler(srv);
};
