const logger = require('cf-nodejs-logging-support');
const { getBundle } = require('../../lib/helper');

const i18nPath = '../../_i18n/i18n';

const loggerScope = `[BillableItemsService]`;

const FULFILLED_STATUS = 'fulfilled';

logger.info(`${loggerScope}`);

module.exports = {
    prepareBillableItemsCreateRequestPayload: (
        billDetail,
        customerInfo,
        destinationProperties,
        req
    ) => {
        let billableItemsCreateRequest = {};
        const {
            documentNumber,
            billingType,
            billItems,
            market,
            payment,
            creditCard,
            contractAccount,
        } = billDetail;
        const { s4bp, markets } = customerInfo;
        const timeZone = market?.timeZone;
        let billableItemPaymentCreate = {};
        let validDate = '';
        let contractAccountID = '';
        const marketId = billDetail.market?.id;
        const sbSystemId = destinationProperties?.SBBusinessSystem || '';
        const bpSystemId = destinationProperties?.S4BusinessSystem || '';
        const billingProcess = destinationProperties?.BillingProcess;
        const bundle = getBundle(req, i18nPath);
        try {
            module.exports.mapToSourceItems(billItems, billingType);

            // Set contractAccountID
            if (contractAccount && contractAccount.trim().length > 0) {
                contractAccountID = contractAccount;
            }

            // Set marketPriceType from customer info
            const marketPriceType = module.exports.setMarketPriceType(
                marketId,
                markets
            );

            // For each sourceItem under each billItem, map CREATE objects
            const listObj = module.exports.prepareCreateObjectList(
                billDetail,
                timeZone,
                s4bp,
                contractAccountID,
                marketPriceType,
                destinationProperties
            );

            if (creditCard?.expirationYear && creditCard?.expirationMonth) {
                validDate = `${creditCard.expirationYear}-${creditCard.expirationMonth}-01`;
            }

            if (payment?.token && payment?.token.trim().length > 0) {
                billableItemPaymentCreate = {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: documentNumber,
                    CABllbleItmSourceTransItmID: '',
                    CABllbleItmGroupingPaymentData: '1',
                    PaymentCardType: creditCard?.dateType,
                    PaymentCardHolderName: {
                        $value: creditCard?.cardHolderName,
                    },
                    PaytCardByPaytServiceProvider: {
                        $value: payment?.token,
                    },
                    CardValidTo: validDate,
                };
            }

            billableItemsCreateRequest = {
                MessageHeader: {
                    CreationDateTime: '',
                    SenderBusinessSystemID: sbSystemId,
                    RecipientBusinessSystemID: bpSystemId,
                },
                Parameters: {
                    CAIsSimulated: false,
                    CAReturnLogIsRequested: true,
                },
                ...(billingProcess
                    ? {
                          AdditionalParameters: {
                              CABillgProcess: billingProcess,
                          },
                      }
                    : {}),
                BillableItemsCreate: {
                    BillableItemsBasicCreate:
                        listObj.billableItemBasicCreateList,
                    BillabelItemsPaymentCreate: billableItemPaymentCreate,
                    BillableItemsTextCreate: listObj.billableItemTextCreateList,
                    BillableItemsAdditionalCreate:
                        listObj.billableItemAdditionalCreateList,
                },
            };
        } catch (e) {
            logger.debug(
                `${loggerScope} ${bundle.getText(
                    'errorMsgBillableItemsBITsHelperMappingError'
                )} ${e}`
            );
            return Promise.reject(
                new Error(
                    `${bundle.getText(
                        'errorMsgBillableItemsBITsHelperMappingError'
                    )} ${billDetail.documentNumber}`
                )
            );
        }
        return Promise.resolve(billableItemsCreateRequest);
    },

    mapToSourceItems: (billItems, billingType) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of billItems) {
            if (billingType === 'CREDIT') {
                item.sourceItems = item.credits;
                // eslint-disable-next-line no-restricted-syntax
                for (const sItem of item.sourceItems) {
                    if (
                        Object.prototype.hasOwnProperty.call(sItem, 'netAmount')
                    ) {
                        sItem.netAmount.amount *= -1;
                    }
                    if (
                        Object.prototype.hasOwnProperty.call(
                            sItem,
                            'grossAmount'
                        )
                    ) {
                        sItem.grossAmount.amount *= -1;
                    }
                    sItem.consumedQuantity.value *= -1;
                }
            } else {
                item.sourceItems = item.charges;
            }
        }
    },

    convertDateTime: (timeZone, inputDate, endDate = false) => {
        const convertedDateString = new Date(inputDate).toLocaleString(
            'en-US',
            {
                timeZone,
            }
        );
        const newDate = new Date(convertedDateString);
        newDate.setDate(newDate.getDate());
        if (endDate) {
            newDate.setSeconds(newDate.getSeconds() - 1);
        }
        return {
            date: newDate.toLocaleDateString('en-CA'),
            time: newDate.toLocaleTimeString('de-DE'),
        };
    },

    prepareCreateObjectList: (
        billDetail,
        timeZone,
        s4BpId,
        contractAccountID,
        marketPriceType,
        destinationProperties
    ) => {
        const { documentNumber, billItems } = billDetail;
        const billableItemBasicCreateList = [];
        const billableItemTextCreateList = [];
        const billableItemAdditionalCreateList = [];
        let startDate = '';
        let endDate = '';
        let startTime = '';
        let endTime = '';
        let dateTime;
        let itemType = 'YONE';
        const bitClass = destinationProperties?.BITClass || '0SAP';
        const billingSubProcess =
            destinationProperties?.BillingSubProcess || 'Y001';
        billItems.forEach((item) => {
            item.sourceItems.forEach((sourceItem) => {
                // Setting start date based on timezone
                if (timeZone && sourceItem.ratingPeriod?.start) {
                    dateTime = module.exports.convertDateTime(
                        timeZone,
                        sourceItem.ratingPeriod.start
                    );
                    startDate = dateTime.date;
                    endDate = dateTime.date;
                    startTime = dateTime.time;
                }
                // Setting end date based on timezone
                if (timeZone && sourceItem.ratingPeriod?.end) {
                    dateTime = module.exports.convertDateTime(
                        timeZone,
                        sourceItem.ratingPeriod.end,
                        true
                    );
                    endDate = dateTime.date;
                    endTime = dateTime.time;
                }

                // Map itemType from pricingElement conditionType and destination property values
                const itemTypeValues =
                    destinationProperties.ConditionType.split('/');
                if (sourceItem.pricingElements) {
                    switch (sourceItem.pricingElements[0]?.conditionType) {
                        case 'PMP1':
                            itemType = itemTypeValues.find((type) =>
                                type.includes('PMP1')
                            );
                            break;
                        case 'PMP2':
                            itemType = itemTypeValues.find((type) =>
                                type.includes('PMP2')
                            );
                            break;
                        case 'PMP3':
                            itemType = itemTypeValues.find((type) =>
                                type.includes('PMP3')
                            );
                            break;
                        default:
                            itemType = 'YONE';
                            break;
                    }
                }
                itemType = itemType.substring(itemType.indexOf('-') + 1);

                // Map basicCreate object
                const basicCreate = {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: documentNumber,
                    CABllbleItmSourceTransItmID: `${item.lineNumber}-${sourceItem.lineNumber}`,
                    CABllbleItmClass: bitClass,
                    CABillgSubprocess: billingSubProcess,
                    CABllbleItmType: itemType,
                    CABllbleItmExternalReference: sourceItem.lineNumber,
                    BusinessPartner: {
                        InternalID: s4BpId,
                    },
                    contractAccount: {
                        InternalID: contractAccountID,
                    },
                    CAContract: item.subscription?.subscriptionDocumentId,
                    CASubApplication: 'P',
                    CAProviderContractItemNumber:
                        module.exports.evaluateConditionalValues(
                            sourceItem.externalObjectReferences[0]
                                ?.externalIdTypeCode,
                            'sap.s4.provider-contract.item.id',
                            sourceItem.externalObjectReferences[0]?.externalId,
                            ''
                        ),
                    CABllbleItmDate: startDate,
                    CABllbleItmStartDate: startDate,
                    CABllbleItmEndDate: endDate,
                    CABllbleItmTime: startTime,
                    CABllbleItmStartTime: startTime,
                    CABllbleItmEndTime: endTime,
                    CABillgFirstDate: billDetail.billingDate?.substring(0, 10),
                    CABllbleItmAmount: {
                        // Is it the correct check condition ?????
                        attributes: {
                            currencyCode:
                                module.exports.evaluateConditionalValues(
                                    marketPriceType,
                                    'Net',
                                    sourceItem.netAmount?.currency,
                                    sourceItem.grossAmount?.currency
                                ),
                        },
                        $value: module.exports.evaluateConditionalValues(
                            marketPriceType,
                            'Net',
                            sourceItem.netAmount?.amount,
                            sourceItem.grossAmount?.amount
                        ),
                    },
                    CABllbleItemQty: {
                        attributes: {
                            unitCode: sourceItem.consumedQuantity?.unit,
                        },
                        $value: module.exports.evaluateConditionalValues(
                            sourceItem.reversal,
                            'true',
                            (sourceItem.consumedQuantity?.value || 0) * -1,
                            sourceItem.consumedQuantity?.value
                        ),
                    },
                    CATaxIsIncluded: module.exports.evaluateConditionalValues(
                        marketPriceType,
                        'Gross',
                        'true',
                        ''
                    ),
                    CAInvcgIsItemPostingRelevant: 'true',
                    CAInvcgIsItemPrintingRelevant: 'true',
                    ...(billDetail.creditCard?.token &&
                    billDetail.creditCard?.token.trim().length > 0
                        ? { CABllbleItmGroupingPaymentData: 1 }
                        : {}),
                };
                const textCreate = {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: documentNumber,
                    CABllbleItmSourceTransItmID: `${item.lineNumber}-${sourceItem.lineNumber}`,
                    CABllbleItmMainText: module.exports.concatValues(
                        item.product?.code,
                        '-',
                        sourceItem.metricId,
                        50,
                        ' ',
                        sourceItem.subMetricId
                    ),
                };
                const additionalCreate = {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: documentNumber,
                    CABllbleItmSourceTransItmID: `${item.lineNumber}-${sourceItem.lineNumber}`,
                    Correction: {
                        CABllbleItmSrceTransIDCrrtd: documentNumber,
                        CABllbleItmSrceTransItmIDCrrtd:
                            module.exports.concatValues(
                                sourceItem.originalBillReference
                                    ?.billItemLineNumber,
                                '-',
                                sourceItem.originalBillReference
                                    ?.chargeLineNumber,
                                10
                            ),
                    },
                };

                billableItemBasicCreateList.push(basicCreate);
                billableItemTextCreateList.push(textCreate);
                billableItemAdditionalCreateList.push(additionalCreate);
            });
        });

        return {
            billableItemBasicCreateList,
            billableItemTextCreateList,
            billableItemAdditionalCreateList,
        };
    },

    evaluateConditionalValues: (
        fieldTobeEvaluated,
        valueToEvaluateAgainst,
        successfulValue,
        falseValue
    ) => {
        if (fieldTobeEvaluated === valueToEvaluateAgainst) {
            return successfulValue;
        }
        return falseValue;
    },

    setMarketPriceType: (marketId, markets) => {
        let marketPriceType = 'Net';
        if (marketId && markets) {
            // eslint-disable-next-line no-restricted-syntax
            for (const marketItem of markets) {
                if (marketItem.marketId === marketId) {
                    marketPriceType = marketItem.priceType;
                    break;
                }
            }
        }
        return marketPriceType;
    },

    concatValues: (
        firstValue,
        firstDelimiter,
        secondValue,
        maxLength,
        secondDelimiter,
        thirdValue
    ) => {
        let finalString = '';

        if (firstValue) {
            finalString = `${firstValue}`;
        }
        if (secondValue) {
            finalString = `${finalString}${firstDelimiter}${secondValue}`;
        }
        if (thirdValue) {
            finalString = `${finalString}${secondDelimiter}${thirdValue}`;
        }
        return finalString.substring(0, maxLength);
    },

    countSuccessBITSCreation: (payloadResp) => {
        let successCount = 0;
        if (payloadResp && payloadResp.length > 0) {
            // eslint-disable-next-line no-restricted-syntax
            for (const resp of payloadResp) {
                if (resp.status === FULFILLED_STATUS) {
                    successCount += 1;
                }
            }
        }
        return successCount;
    },
};
