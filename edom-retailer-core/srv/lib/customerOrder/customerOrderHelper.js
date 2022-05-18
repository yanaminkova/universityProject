const config = require('../config');

/**
 * Data Privacy and Protection requirement
 *
 * Update end of business date of CustomerOrder when processing status code is set to 'Completed'
 * @param  {Object} customerOrder: Customer Order Object
 * @param  {Object} req: Request Object
 */
async function setEndOfBusinessDate(req, customerOrder) {
    if (!customerOrder || !customerOrder.processingStatus_code) {
        return;
    }

    const db = await cds.connect.to('db');
    const todaysDate = new Date().toISOString();
    const endOfBusinessDate =
        customerOrder?.processingStatus_code ===
            config.PROCESSING_STATUS_CODE_TERMINATED ||
        customerOrder?.processingStatus_code ===
            config.PROCESSING_STATUS_CODE_REJECTED ||
        customerOrder?.processingStatus_code ===
            config.PROCESSING_STATUS_CODE_COMPLETED ||
        customerOrder?.processingStatus_code ===
            config.PROCESSING_STATUS_CODE_CANCELED
            ? todaysDate
            : null;

    await db.transaction(req).run(
        UPDATE('sap.odm.sales.CustomerOrder', customerOrder.id).set({
            endOfBusinessDate,
        })
    );
}

async function recalculateCustomerOrderStatus(req, customerOrderId) {
    const db = await cds.connect.to('db');
    const businessRules = await cds.connect.to('businessRules');
    const customerOrderItemStatuses = await db.transaction(req).run(
        SELECT.distinct('processingStatus_code')
            .from(`sap.odm.sales.CustomerOrder.items`)
            .where({
                up__id: customerOrderId,
            })
    );

    if (customerOrderItemStatuses.length > 1) {
        const vocabulary = {
            statuses: customerOrderItemStatuses.map(
                (item) => item.processingStatus_code
            ),
        };

        const processingStatusCodeResult = await businessRules.invoke(
            null,
            null,
            vocabulary
        );

        return processingStatusCodeResult.Result[0].OverallStatus
            .processingStatus_code;
    }

    return customerOrderItemStatuses.length
        ? customerOrderItemStatuses[0].processingStatus_code
        : false;
}

async function updateCustomerOrderStatusCode(
    srv,
    req,
    customerOrderId,
    processingStatusCode
) {
    const { CustomerOrder } = srv.entities;
    const COprocessingStatus = {
        id: customerOrderId,
        processingStatus_code: processingStatusCode,
    };

    await srv
        .transaction(req)
        .run(UPDATE(CustomerOrder, customerOrderId).set(COprocessingStatus));
}

module.exports = {
    setEndOfBusinessDate,
    recalculateCustomerOrderStatus,
    updateCustomerOrderStatusCode,
};
