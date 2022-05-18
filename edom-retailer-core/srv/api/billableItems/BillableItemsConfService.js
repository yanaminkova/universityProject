const logger = require('cf-nodejs-logging-support');
const SubscriptionBillingAPI = require('../../external/SubscriptionBillingAPI');

const loggerScope = `[BillableItemsCreateConfirmService]`;
const { getEnabledFeatures, getBundle } = require('../../lib/helper');

const i18nPath = '../../_i18n/i18n';

/**
 * Implment BITs Confirmation iflow
 * @param {Object} args parsed SOAP envelope
 * @param {String} jwt
 * @returns void
 */
async function checkStatus(args, jwt, bundle) {
    const nullInvoice = '000000000000';
    const {
        CABllbleItmSourceTransId,
        CABllbleItmStatus,
        CABillgDocument,
        CAInvcgDocument,
    } = args.BillableItemsCreateResult[0];
    const { SenderBusinessSystemID } = args.MessageHeader;
    const { Item } = args.Log;
    const billID = parseInt(CABllbleItmSourceTransId, 10);
    const billingDocText = bundle.getText(
        'displayMsgBillableItemsConfirmSRVBillingDocumentType'
    );
    const invoiceDocText = bundle.getText(
        'displayMsgBillableItemsConfirmSRVInvoiceDocumentType'
    );
    let response;

    if (CABllbleItmStatus !== 'E' && CABllbleItmStatus !== '') {
        // BillDoc Body
        const body = {
            success: true,
            successorDocumentSystem: SenderBusinessSystemID,
            successorDocumentId: CABillgDocument,
            successorDocumentType: billingDocText,
            messages: [],
        };

        // Update BillDoc
        response = await SubscriptionBillingAPI.postSuccessorDocuments(
            billID,
            body,
            jwt,
            false,
            bundle,
            loggerScope
        );

        // Check if Invoiced
        if (CAInvcgDocument !== nullInvoice && CAInvcgDocument !== '') {
            // Invoice Body
            const invoiceBody = {
                success: true,
                successorDocumentSystem: SenderBusinessSystemID,
                successorDocumentId: CAInvcgDocument,
                successorDocumentType: invoiceDocText,
                messages: [],
            };

            // Update Invoice
            response = await SubscriptionBillingAPI.postSuccessorDocuments(
                billID,
                invoiceBody,
                jwt,
                false,
                bundle,
                loggerScope
            );
        }
    } else {
        const errorMessages = Item.reduce((messages, i) => {
            if (i.SeverityCode === '3') {
                messages.push(i.Note);
            }

            return messages;
        }, []);

        // Failure Body
        const errorBody = {
            successorDocumentSystem: SenderBusinessSystemID,
            successorDocumentType: billingDocText,
            messages: errorMessages,
        };

        // Post Failed Attempts
        response = await SubscriptionBillingAPI.postSuccessorDocuments(
            billID,
            errorBody,
            jwt,
            true,
            bundle,
            loggerScope
        );
    }
    return response;
}

class BillableItemsConfService {
    static async BitsCreateConfirm(parsedPayload, callback, headers, req) {
        const bundle = getBundle(req, i18nPath);
        const bitsConfirmationService = 'billable-items-confirmation-service';
        const bitsConfirmationFeature = await getEnabledFeatures(req, [
            bitsConfirmationService,
        ]);
        // Checks feature flag
        if (bitsConfirmationFeature.includes(bitsConfirmationService)) {
            // Handler starts
            const jwt =
                req.authInfo?.getAppToken() ||
                req.headers?.authorization?.substring(7);

            try {
                // Check bill and invoice bill status and post updates to SB
                const resp = await checkStatus(parsedPayload, jwt, bundle);
                if (resp?.status && resp?.data) {
                    logger.debug(
                        `${loggerScope} ${bundle.getText(
                            'successMsgBillableItemsConfirmSRVCompletedBitsConfirmation'
                        )} ${resp.status} - ${resp.data}`
                    );
                } else {
                    logger.debug(
                        `${loggerScope} ${bundle.getText(
                            'successMsgBillableItemsConfirmSRVBitsConfirmComplete'
                        )}`
                    );
                }

                return {
                    status: 'SUCCESS',
                    CABllbleItmSourceTransId:
                        parsedPayload.BillableItemsCreateResult[0]
                            .CABllbleItmSourceTransId,
                };
            } catch (e) {
                let err = {};

                // Catch API execution errors
                if (e && e.response) {
                    const { status, statusText } = e.response;

                    err = `${bundle.getText(
                        'errorMsgBillableItemsConfirmSRVProcessingError'
                    )} ${status} ${statusText}`;
                }
                // Catch Destination connection errors
                else {
                    const message = e.cause?.message || e.message;

                    err = `${bundle.getText(
                        'errorMsgBillableItemsConfirmSRV500ProcessingError'
                    )} ${message}`;
                }

                logger.error(
                    `${loggerScope} ${bundle.getText(
                        'errorMsgBillableItemsConfirmSRVCreationConfirmationError'
                    )} ${JSON.stringify(err)}`
                );

                throw new Error(err);
            }
        }

        /* istanbul ignore next */
        logger.warn(
            `${loggerScope} ${bundle.getText(
                'errorMsgBillableItemsConfirmSRVServiceUnavailable'
            )}`
        );

        throw new Error(
            `${bundle.getText(
                'errorMsgBillableItemsConfirmSRV503ServiceUnavailable'
            )}`
        );
    }

    static getInstance() {
        return {
            BitsCreateConfService: {
                BillableItemsCreateConfirmation_OutPort: {
                    BillableItemsCreateConfirmation_Out:
                        BillableItemsConfService.BitsCreateConfirm,
                },
            },
        };
    }
}

module.exports = BillableItemsConfService;
