/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
const logger = require('cf-nodejs-logging-support');

const loggerScope = `[BillableItemsService]`;

const { getBundle } = require('../../lib/helper');

const { convertDateTime } = require('./BITSHelper');

const SubscriptionBillingAPI = require('../../external/SubscriptionBillingAPI');

const i18nPath = '../../_i18n/i18n';

logger.info(`${loggerScope}`);

function getForecastPricePerUnitAmount(item, pricingElement) {
    const duration = Math.abs(
        new Date(item.ratingPeriod.start) - new Date(item.ratingPeriod.end)
    );

    return (
        (item.ratingType.toLowerCase() === 'usage'
            ? pricingElement.conditionValue.amount / item.quantity.value
            : pricingElement.conditionValue.amount /
              Math.ceil(duration / (1000 * 60 * 60 * 24))) || 0
    );
}

function getUnitCode(ratingType, unit) {
    return ratingType.toLowerCase() === 'usage' ? unit.toUpperCase() : 'DAY';
}

function getElementStep(pricingElement) {
    return pricingElement?.step !== undefined ? pricingElement?.step : 0;
}

function getIdentificationSystemCode(meterConfig) {
    const register = meterConfig.SimpleEndDeviceFunction[0].Registers.filter(
        (value) => value.isVirtual[0] === 'false'
    );
    return register.length !== 0
        ? register[0]?.Channels[0]?.identificationSystemCode[0]
        : '';
}

function getIsItemPostingRelevant(pricingElement) {
    let isPostingRelevant = 'true';
    if (pricingElement?.statistical !== undefined) {
        if (pricingElement?.statistical) {
            isPostingRelevant = 'false';
        }
    }
    return isPostingRelevant;
}

function getBillgSubprocess(bill, destinationProperties) {
    return bill && (bill !== undefined || bill !== null)
        ? destinationProperties?.ForecastAdjSubprocess
        : destinationProperties?.ForecastInitSubprocess;
}

function getSourceTransId(billingForecasts, bill) {
    return bill && (bill !== undefined || bill !== null)
        ? bill?.documentNumber
        : billingForecasts.subscriptionDocumentId;
}

function getBillingDate(billingForecasts, bill) {
    return bill && (bill !== undefined || bill !== null)
        ? bill?.billingDate
        : billingForecasts.subscriptionValidFrom;
}

function checkGroupingTextData(bill) {
    return bill && (bill !== undefined || bill !== null);
}

module.exports = {
    getConditionType: (pricingElement, destinationProperties) => {
        let conditionType;

        if (pricingElement.conditionType.startsWith('PMP')) {
            if (
                destinationProperties.CommodityConditionType?.includes(
                    pricingElement.conditionType
                )
            ) {
                conditionType = `SU0${
                    pricingElement.conditionType[
                        pricingElement.conditionType.length - 1
                    ]
                }`;
            } else {
                conditionType = pricingElement.conditionType;
            }
        } else if (pricingElement.conditionType === 'SU003') {
            conditionType = 'SU03';
        } else {
            conditionType = pricingElement.conditionType;
        }

        return conditionType;
    },

    prepareForecastBillableItemsBasicCreate: (
        destinationProperties,
        billingForecasts,
        bill
    ) => {
        const billableItemsBasicCreate = [];

        billingForecasts.forecasts.forEach((forecast) => {
            let counter = 1;

            forecast.items.forEach((item) => {
                const pricingElements = item.pricingElements.filter(
                    (value) => value.conditionType !== ''
                );

                pricingElements.forEach((pricingElement) => {
                    const basicCreate = {
                        CABllbleItmSourceTransType: 'REVCL',
                        CABllbleItmSourceTransId: getSourceTransId(
                            billingForecasts,
                            bill
                        ),
                        CABllbleItmSourceTransItmID: `${String(
                            counter
                        ).padStart(6, '0')}-${getElementStep(pricingElement)}`,
                        CABllbleItmClass:
                            destinationProperties?.BITClass || '0SAP',
                        CABillgSubprocess: getBillgSubprocess(
                            bill,
                            destinationProperties
                        ),
                        CABllbleItmType: module.exports.getConditionType(
                            pricingElement,
                            destinationProperties
                        ),
                        BusinessPartner: {
                            InternalID: billingForecasts.customerId,
                        },
                        ContractAccount: {
                            InternalID: item.contractAccount,
                        },
                        CAContract: billingForecasts.subscriptionDocumentId,
                        CAProviderContractItemNumber:
                            item.providerContractItemId,
                        CASubApplication: 'P',
                        CABllbleItmDate: convertDateTime(
                            billingForecasts.market?.timeZone,
                            item.ratingPeriod.start
                        ).date,
                        CABllbleItmStartDate: convertDateTime(
                            billingForecasts.market?.timeZone,
                            item.ratingPeriod.start
                        ).date,
                        CABllbleItmEndDate: convertDateTime(
                            billingForecasts.market?.timeZone,
                            item.ratingPeriod.end
                        ).date,
                        CABllbleItmTime: convertDateTime(
                            billingForecasts.market?.timeZone,
                            item.ratingPeriod.start,
                            true
                        ).time,
                        CABllbleItmStartTime: convertDateTime(
                            billingForecasts.market?.timeZone,
                            item.ratingPeriod.start,
                            true
                        ).time,
                        CABllbleItmEndTime: convertDateTime(
                            billingForecasts.market?.timeZone,
                            item.ratingPeriod.end,
                            true
                        ).time,
                        CABillgFirstDate: convertDateTime(
                            billingForecasts.market?.timeZone,
                            getBillingDate(billingForecasts, bill)
                        ).date,
                        CABllbleItmAmount: {
                            attributes: {
                                currencyCode:
                                    pricingElement.conditionValue.currency,
                            },
                            $value: pricingElement.conditionValue.amount,
                        },
                        CABllbleItemQty: {
                            attributes: {
                                unit: getUnitCode(
                                    item.ratingType,
                                    item.quantity.unit
                                ),
                            },
                            $value: item.quantity.value,
                        },
                        CAInvcgIsItemPostingRelevant:
                            getIsItemPostingRelevant(pricingElement),
                        CAInvcgIsItemPrintingRelevant: 'true',
                        CABllbleItmControlOfUnit: 6,
                        CABllbleItmSimlnSts: 1,
                    };

                    if (!checkGroupingTextData(bill)) {
                        basicCreate.CABllbleItmGroupingTextData = counter;
                    }

                    billableItemsBasicCreate.push(basicCreate);
                    counter++;
                });
            });
        });
        return billableItemsBasicCreate;
    },

    prepareForecastBillableItemsPostingCreate: (billingForecasts, bill) => {
        const billableItemsPostingCreate = [];

        billingForecasts.forecasts.forEach((forecast) => {
            let counter = 1;

            forecast.items.forEach((item) => {
                const pricingElements = item.pricingElements.filter(
                    (value) => value.conditionType !== ''
                );

                pricingElements.forEach((pricingElement) => {
                    const postingCreate = {
                        CABllbleItmSourceTransType: 'REVCL',
                        CABllbleItmSourceTransId: getSourceTransId(
                            billingForecasts,
                            bill
                        ),
                        CABllbleItmSourceTransItmID: `${String(
                            counter
                        ).padStart(6, '0')}-${getElementStep(pricingElement)}`,
                        Division: billingForecasts.market.salesArea.division,
                    };
                    billableItemsPostingCreate.push(postingCreate);
                    counter++;
                });
            });
        });
        return billableItemsPostingCreate;
    },

    prepareForecastBillableItemsTextCreate: (billingForecasts) => {
        const billableItemsTextCreate = [];

        billingForecasts.forecasts.forEach((forecast) => {
            let counter = 1;

            forecast.items.forEach((item) => {
                const pricingElements = item.pricingElements.filter(
                    (value) => value.conditionType !== ''
                );

                pricingElements.forEach((pricingElement) => {
                    billableItemsTextCreate.push(
                        module.exports.prepareForecastBillableItemsTextPayload(
                            getSourceTransId(billingForecasts),
                            pricingElement,
                            counter,
                            'UTPR'
                        )
                    );
                    if (item.ratingType.toLowerCase() === 'usage') {
                        billableItemsTextCreate.push(
                            module.exports.prepareForecastBillableItemsTextPayload(
                                getSourceTransId(billingForecasts),
                                pricingElement,
                                counter,
                                'UTMR'
                            )
                        );
                    }
                    counter++;
                });
            });
        });
        return billableItemsTextCreate;
    },

    prepareForecastBillableItemsTextPayload: (
        sourceTransId,
        pricingElement,
        counter,
        type
    ) => {
        const textCreate = {
            CABllbleItmSourceTransType: 'REVCL',
            CABllbleItmSourceTransId: sourceTransId,
            CABllbleItmSourceTransItmID: `${String(counter).padStart(
                6,
                '0'
            )}-${getElementStep(pricingElement)}`,
            CABllbleItmGroupingTextData: counter,
            TechnicalExtension: {
                CABllbleItmExtnType: type,
                CABllbleItmExtnID: `${sourceTransId}-${String(counter).padStart(
                    6,
                    '0'
                )}-${getElementStep(pricingElement)}`,
            },
        };

        if (type === 'UTMR') {
            textCreate.TechnicalExtension.CABllbleItmExtnItmID = counter;
        }

        return textCreate;
    },

    prepareForecastBillableItemsMeterInfoCreate: (
        billingForecasts,
        meterConfig
    ) => {
        const billableItemsMeterInfoCreate = [];

        billingForecasts.forecasts.forEach((forecast) => {
            let counter = 1;

            forecast.items.forEach((item) => {
                const pricingElements = item.pricingElements.filter(
                    (value) => value.conditionType !== ''
                );

                pricingElements.forEach((pricingElement) => {
                    if (item.ratingType.toLowerCase() === 'usage') {
                        const meterCreate = {
                            CABllbleItmSourceTransType: 'REVCL',
                            CABllbleItmSourceTransId:
                                getSourceTransId(billingForecasts),
                            CABllbleItmSourceTransItmID: `${String(
                                counter
                            ).padStart(6, '0')}-${getElementStep(
                                pricingElement
                            )}`,
                            ValidFromDate: convertDateTime(
                                billingForecasts.market?.timeZone,
                                item.ratingPeriod.start
                            ).date,
                            ValidToDate: convertDateTime(
                                billingForecasts.market?.timeZone,
                                item.ratingPeriod.end
                            ).date,
                            UtilitiesDeviceID:
                                meterConfig.Meter[0].serialNumber[0],
                            UtilitiesObjectIdnSystemCode:
                                getIdentificationSystemCode(meterConfig),
                            MeterReadingCategoryCode: '03',
                            Quantity: {
                                attributes: {
                                    unitCode: getUnitCode(
                                        item.ratingType,
                                        item.quantity.unit
                                    ),
                                },
                                $value: item.quantity.value,
                            },
                            UtilitiesMeterID: meterConfig.Meter[0].mRID[0],
                            UtilitiesMeteringLocation:
                                meterConfig.Meter[0].serialNumber[0],
                            TechnicalExtension: {
                                CABllbleItmExtnType: 'UTMR',
                                CABllbleItmExtnID: `${getSourceTransId(
                                    billingForecasts
                                )}-${String(counter).padStart(
                                    6,
                                    '0'
                                )}-${getElementStep(pricingElement)}`,
                                CABllbleItmExtnItmID: counter,
                            },
                        };
                        billableItemsMeterInfoCreate.push(meterCreate);
                    }
                    counter++;
                });
            });
        });
        return billableItemsMeterInfoCreate;
    },

    prepareForecastBillableItemsPriceCreate: (billingForecasts) => {
        const billableItemsPriceCreate = [];

        billingForecasts.forecasts.forEach((forecast) => {
            let counter = 1;

            forecast.items.forEach((item) => {
                const pricingElements = item.pricingElements.filter(
                    (value) => value.conditionType !== ''
                );

                pricingElements.forEach((pricingElement) => {
                    const priceCreate = {
                        CABllbleItmSourceTransType: 'REVCL',
                        CABllbleItmSourceTransId:
                            getSourceTransId(billingForecasts),
                        CABllbleItmSourceTransItmID: `${String(
                            counter
                        ).padStart(6, '0')}-${getElementStep(pricingElement)}`,
                        Price: {
                            Amount: {
                                attributes: {
                                    currencyCode:
                                        pricingElement.conditionValue.currency,
                                },
                                $value: getForecastPricePerUnitAmount(
                                    item,
                                    pricingElement
                                ).toFixed(2),
                            },
                            BaseQuantity: {
                                attributes: {
                                    unitCode: getUnitCode(
                                        item.ratingType,
                                        item.quantity.unit
                                    ),
                                },
                                $value: 1,
                            },
                        },
                        TechnicalExtension: {
                            CABllbleItmExtnType: 'UTPR',
                            CABllbleItmExtnID: `${getSourceTransId(
                                billingForecasts
                            )}-${String(counter).padStart(
                                6,
                                '0'
                            )}-${getElementStep(pricingElement)}`,
                        },
                    };
                    billableItemsPriceCreate.push(priceCreate);
                    counter++;
                });
            });
        });
        return billableItemsPriceCreate;
    },

    prepareForecastBillableItemsCreateRequestPayload: (
        destinationProperties,
        billingForecasts,
        meterConfig
        // eslint-disable-next-line arrow-body-style
    ) => {
        return {
            MessageHeader: {
                CreationDateTime: '',
                SenderBusinessSystemID:
                    destinationProperties?.SBBusinessSystem || '',
                RecipientBusinessSystemID:
                    destinationProperties?.S4BusinessSystem || '',
            },
            Parameters: {
                CAIsSimulated: false,
                CAReturnLogIsRequested: true,
            },
            BillableItemsCreate: {
                BillableItemsBasicCreate:
                    module.exports.prepareForecastBillableItemsBasicCreate(
                        destinationProperties,
                        billingForecasts
                    ),
                BillableItemsPostingCreate:
                    module.exports.prepareForecastBillableItemsPostingCreate(
                        billingForecasts
                    ),
                BillableItemsTextCreate:
                    module.exports.prepareForecastBillableItemsTextCreate(
                        billingForecasts
                    ),
                'n1:UtilitiesBillableItemsExtension': {
                    MeterReadingInfo:
                        module.exports.prepareForecastBillableItemsMeterInfoCreate(
                            billingForecasts,
                            meterConfig
                        ),
                    Price: module.exports.prepareForecastBillableItemsPriceCreate(
                        billingForecasts
                    ),
                },
            },
        };
    },

    // eslint-disable-next-line arrow-body-style
    checkSubscriptionValidUntil: (subscription) => {
        return (
            subscription?.validUntil === undefined ||
            new Date(subscription?.validUntil) > new Date()
        );
    },

    // eslint-disable-next-line arrow-body-style
    checkSubscriptionExpiration: (subscription) => {
        return subscription.status.toLowerCase() === 'expired';
    },

    // eslint-disable-next-line arrow-body-style
    checkBudgetBillingType: (subscription) => {
        return subscription.utilitiesExtension?.budgetBillingType !== undefined;
    },

    checkBillingForecasts: (billingForecasts) => {
        if (billingForecasts.forecasts.length !== 0) {
            let counter = 0;
            for (const forecast of billingForecasts.forecasts) {
                if (forecast.items.length === 0) {
                    break;
                } else {
                    counter++;
                }
            }
            return counter === billingForecasts.forecasts.length;
        }
        return false;
    },

    /**
     * Fetch billing forecasts from SAP Subscription Billing
     * @param {*} req
     * @param {*} sbDest
     * @param {*} billDetail
     * @returns {Promise<Object>}
     */
    getPeriodicBillingForecasts: async (req, sbDest, billDetail) => {
        let billingForecasts;
        const bundle = getBundle(req, i18nPath);

        // Fetch subscription details using provider contract
        const subscriptionDetails =
            await SubscriptionBillingAPI.getSubscription(
                sbDest,
                billDetail.billItems[0].subscription.subscriptionDocumentId,
                req
            );

        // Error fetching subscription occurred
        if (subscriptionDetails?.message || subscriptionDetails.length === 0) {
            logger.error(
                `${loggerScope} ${bundle.getText(
                    'errorMsgForecastBillableItemsSubscriptionError'
                )} ${
                    subscriptionDetails?.message !== undefined
                        ? subscriptionDetails?.message
                        : bundle.getText(
                              'errorMsgForecastBillableItemsSubscriptionNotFound'
                          )
                }`
            );
            return undefined;
        }

        // Business relevant checks for subscription and billing forecasts that are not logged
        if (
            !subscriptionDetails[0].subscriptionProfile
                .activateUtilitiesExtension ||
            !module.exports.checkBudgetBillingType(subscriptionDetails[0]) ||
            module.exports.checkSubscriptionExpiration(subscriptionDetails[0])
        ) {
            return undefined;
        }

        // Fetch billing forecasts using subscription id
        billingForecasts = await SubscriptionBillingAPI.getBillingForecasts(
            sbDest,
            subscriptionDetails[0].subscriptionId,
            null,
            null,
            req
        );

        // Error fetching billing forecasts occurred
        if (billingForecasts?.message || !billingForecasts) {
            logger.error(
                `${loggerScope} ${bundle.getText(
                    'errorMsgForecastBillableItemsBillingForecastsError'
                )} [${subscriptionDetails[0].subscriptionId}] ${
                    billingForecasts?.message !== undefined
                        ? billingForecasts?.message
                        : bundle.getText(
                              'errorMsgForecastBillableItemsBillingForecastsNotFound'
                          )
                }`
            );
            return undefined;
        }

        // Business relevant checks for billing forecasts that are logged
        if (!module.exports.checkBillingForecasts(billingForecasts)) {
            logger.error(
                `${loggerScope} ${bundle.getText(
                    'errorMsgForecastBillableItemsBillingForecastsInvalidError'
                )} [${subscriptionDetails[0].subscriptionId}]`
            );
            billingForecasts = undefined;
        }
        return Promise.resolve(billingForecasts);
    },
};
