const SubscriptionBillingAPI = require('../../external/SubscriptionBillingAPI');
const { getBundle } = require('../../lib/helper');
const DistributionFunctions = require('./DistributionFunctions');

const i18nPath = '../../_i18n/i18n';

class TerminateSubscriptionOrderHelper {
    /**
     * Terminate Subscription for each item
     *
     * @param {*} req
     * @param {*} orderPerItemType
     * @returns
     */
    static async terminateNonCommoditySubscription(req, orderPerItemType) {
        const response = [];
        const destSb = await SubscriptionBillingAPI.getSBDest();

        await Promise.all(
            orderPerItemType.items.map(async (item, index) => {
                response.push({
                    orderItemId: item.id,
                    createdDocumentNumber: '',
                    isSuccess: '',
                    messages: [],
                });
                const messages = [];

                const subscriptionId =
                    item.subscriptionAspect?.subscriptionReference?.objectId;
                const validTo = item.subscriptionAspect?.validTo;

                // Call the Get subscription to get the version and verify that the
                // status is already not cancelled
                const responseGetSb =
                    await SubscriptionBillingAPI.getSubscription(
                        destSb,
                        subscriptionId,
                        req
                    );
                // Update response object based on get subscription response
                this.updateTerminationResponseObj(
                    req,
                    response[index],
                    messages,
                    1,
                    responseGetSb
                );

                if (response[index].isSuccess !== '' && messages.length !== 0) {
                    response[index].messages = messages;
                } else {
                    // If there's no errors, prepare cancellation payload
                    const cancellationPayload =
                        await this.prepareSbCancellationPayload(
                            validTo,
                            responseGetSb,
                            item.cancellationReason_code,
                            req
                        );

                    const responseCancelSb =
                        await SubscriptionBillingAPI.postSubscriptionCancellation(
                            destSb,
                            cancellationPayload,
                            subscriptionId,
                            req
                        );

                    // Check if subscription was correctly cancelled
                    // then update the status to "In termination"
                    await this.sbTerminationResponse(
                        req,
                        responseCancelSb,
                        item,
                        messages,
                        response[index]
                    );

                    this.updateTerminationResponseObj(
                        req,
                        response[index],
                        messages,
                        2
                    );
                }
            })
        );
        return Promise.resolve(response);
    }

    /**
     * Update response object
     * @param {*} response
     * @param {Array} messages
     * @returns
     */
    static updateTerminationResponseObj(
        req,
        response,
        messages,
        updateScenario,
        responseGetSb
    ) {
        const bundle = getBundle(req, i18nPath);
        if (updateScenario === 1) {
            if (
                responseGetSb &&
                Array.isArray(responseGetSb) &&
                responseGetSb[0].status === 'Canceled'
            ) {
                response.isSuccess = false;
                messages.push(
                    `${bundle.getText(
                        'errorMsgDistributionSRVSubscriptionAlreadyCancelled'
                    )}`
                );
            } else if (responseGetSb && responseGetSb.stack) {
                response.isSuccess = false;
                messages.push(responseGetSb.message);
            }
        } else if (updateScenario === 2) {
            if (response.isSuccess !== false && messages.length === 0) {
                response.isSuccess = true;
            } else if (response.isSuccess === '') {
                response.isSuccess = false;
                response.messages = messages;
            } else {
                response.messages = messages;
            }
        }
    }

    /**
     * Prepare cancellation payload for Subscription Billing API
     * @param  {} req
     * @param  {} validTo
     * @param  {} subscriptionData
     */
    static async prepareSbCancellationPayload(
        validTo,
        subscriptionData,
        cancelCode,
        req
    ) {
        const subsVersion = subscriptionData[0].metaData?.version;
        let cancelDescription;
        let overwriteFlag;
        const db = await cds.connect.to('db');

        const cancellationReason = await db
            .transaction(req)
            .run(SELECT.from(`sap.odm.sales.SalesCancellationReasonCodes`));

        // Cancel API is able to accept a blank value
        const cancelReasonValue =
            cancellationReason.find((entity) => entity.code === cancelCode) ??
            '';

        if (!cancelReasonValue) {
            cancelDescription = '';
        } else {
            cancelDescription = cancelReasonValue.descr;
        }

        // Cancellation Reason codes 90-99 are special cancellation reasons
        // allowing the user to overwrite the subscription terms and end the subscription
        // on any date
        if (
            [
                '90',
                '91',
                '92',
                '93',
                '94',
                '95',
                '96',
                '97',
                '98',
                '99',
            ].indexOf(cancelReasonValue.code) >= 0
        ) {
            overwriteFlag = true;
        } else {
            overwriteFlag = false;
        }

        return {
            metaData: {
                version: subsVersion,
            },
            overruleTerms: overwriteFlag,
            requestedCancellationDate: validTo,
            cancellationReason: cancelDescription,
        };
    }

    /**
     *
     * @param {*} req
     * @param {*} responseSb
     * @param {*} item
     * @param {*} messages
     * @param {*} SBResponse
     * @param {*} response
     */
    static async sbTerminationResponse(
        req,
        responseSb,
        item,
        messages,
        response
    ) {
        const bundle = getBundle(req, i18nPath);
        if (responseSb.status === 'Canceled') {
            // Update Subsequent ID when termination is successful
            // KV remove for now
            await DistributionFunctions.updateSubsequentSub(
                req,
                item,
                responseSb,
                messages
            );

            // Update Status from SB in Order item
            const sourceStatus = 'In Termination';

            await DistributionFunctions.updateDistributionStatus(
                req,
                item.id,
                sourceStatus,
                response
            );
        } else {
            messages.push([
                `${bundle.getText(
                    'errorMsgDistributionSRVErrorSubscriptionTermination'
                )} ${responseSb}`,
            ]);
        }
    }
}

module.exports = TerminateSubscriptionOrderHelper;
