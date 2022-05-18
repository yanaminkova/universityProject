const cds = require('@sap/cds');
const pLimit = require('p-limit');
const {
    getMappedProcessingStatusCode,
    getCustomerOrderItemsWithSubscription,
    getUpdateRequests,
} = require('../lib/helper');
const { handleError } = require('../lib/error');

const logger = cds.log.Logger('c4u-foundation-retailer-srv', 'info');
const limit = pLimit(1);

module.exports = async () => {
    const subscriptionBillingMessaging = await cds.connect.to(
        'subscriptionBillingMessaging'
    );
    const db = await cds.connect.to('db');

    /**
     * @param {Object} msg - Event message.
     * @example
        see test\backend-it\payload\EM_sap_billing_sb_ce_sap_billing_sb_subscription_created_v1.json
     */
    subscriptionBillingMessaging.on(
        [
            'sap/billing/sb/ce/sap/billing/sb/subscription/canceled/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/cancellationReversed/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/extended/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/withdrawn/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/productChanged/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/productOptionsAdded/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/productOptionsRemoved/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/changed/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/deleted/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/changedAsPending/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/createdAsPending/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/deletedAsPending/v1',
            'sap/billing/sb/ce/sap/billing/sb/subscription/expirationNotification/v1',
        ],
        async (msg) => {
            await limit(async () => {
                logger.info(`[ConfigurationService][${msg.event}]`);
                logger.debug(
                    `[ConfigurationService][${msg.event}] ${msg.data}`
                );

                const userProps = msg.tenant
                    ? { tenant: msg.tenant }
                    : undefined;

                const user = new cds.User.Privileged(userProps);
                const dbTx = db.transaction(msg);

                let customerOrderItemsWithSubscription;
                let processingStatusCode;

                try {
                    customerOrderItemsWithSubscription =
                        await getCustomerOrderItemsWithSubscription(msg, dbTx);

                    processingStatusCode = await getMappedProcessingStatusCode(
                        msg,
                        dbTx
                    );
                } catch (error) {
                    handleError(error, null, 500, '[EM]', {
                        headers: msg.headers,
                        data: msg.data,
                    });
                } finally {
                    if (db.kind === 'sqlite') {
                        await dbTx.commit();
                    }
                }

                const { API_EDOM_RETAILER } = cds.services;

                const req = {
                    user,
                    tenant: msg.tenant,
                };
                const srvTx = API_EDOM_RETAILER.transaction(req);

                try {
                    const updateRequests = await getUpdateRequests(
                        srvTx,
                        msg,
                        processingStatusCode,
                        customerOrderItemsWithSubscription
                    );

                    await Promise.all(updateRequests);
                    await srvTx.commit();

                    logger.info(
                        `[ConfigurationService][${msg.event}]: CustomerOrderItems successfully updated for subscriptionId ${msg.data.subscriptionId}`
                    );
                } catch (error) {
                    handleError(error, null, 200, '[EM]', {
                        headers: msg.headers,
                        data: msg.data,
                    });
                    await srvTx.rollback(error);
                }
            });
        }
    );
};
