/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
const logger = require('cf-nodejs-logging-support');

const loggerScope = `[BillableItemsService]`;

const xml2js = require('xml2js');
const { getEnabledFeatures, getBundle } = require('../../lib/helper');

const i18nPath = '../../_i18n/i18n';

const { TMD_NAMESPACE, TMD_OPERATION_NAMESPACE } = require('./Operations');
const { convertDateTime } = require('./BITSHelper');

const EnergyDataServiceAPI = require('../../external/EnergyDataServiceAPI');
const SubscriptionBillingAPI = require('../../external/SubscriptionBillingAPI');

const requestMessage = 'msg:RequestMessage';
const msgRequest = 'msg:Request';

const FULFILLED_STATUS = 'fulfilled';
const REJECTED_STATUS = 'rejected';

const ForecastBITSHelper = require('./ForecastBITSHelper');

logger.info(`${loggerScope}`);

/**
 * Get conditionType
 * any conditionType from PMP1 - PMP6 is converted to -> SU01 - SU06
 * otherwise the conditionType keeps it's current value
 * @param {*} priceElement
 * @param {*} sbDestinationProperties
 */
function getConditionType(priceElement, sbDestinationProperties) {
    let conditionType;

    // PMP05 -> SU05
    // SU007 -> SU007 as it is
    // PMP01 -> SU01
    // SU003 -> SU03 // except we need a mapping

    if (
        sbDestinationProperties.CommodityConditionType.includes(
            priceElement.conditionType
        )
    ) {
        const cTypes =
            sbDestinationProperties.CommodityConditionType.split('/');
        const conditions = {};

        for (const type of cTypes) {
            const values = type.split('-');
            // eslint-disable-next-line prefer-destructuring
            conditions[values[0]] = values[1];
        }

        conditionType = conditions[priceElement.conditionType]
            ? conditions[priceElement.conditionType]
            : priceElement.conditionType;
    } else {
        conditionType = priceElement.conditionType;
    }

    return conditionType;
}

/**
 * Get the difference in days between start date and end date
 * @param {*} start
 * @param {*} end
 * @returns
 */
function getDuration(start, end) {
    const duration = Math.abs(new Date(start) - new Date(end));
    return Math.ceil(duration / (1000 * 60 * 60 * 24));
}

/**
 * Get base price amount
 * @param {*} charge
 * @param {*} priceElement
 * @returns
 */
function getBasePriceAmount(charge, priceElement) {
    if (charge.ratingType.toLowerCase() === 'usage') {
        return (
            priceElement.conditionValue.amount / charge.consumedQuantity.value
        );
    }
    return (
        priceElement.conditionValue.amount /
        getDuration(charge.ratingPeriod.start, charge.ratingPeriod.end)
    );
}

/**
 * Internal function that returns an array of basePrices
 * @param {*} charge
 * @param {*} sbDestinationProperties
 * @returns
 */
function getBasePrices(charge, sbDestinationProperties) {
    const basePrices = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const pe of charge.pricingElements) {
        if (pe.conditionType || pe.conditionType !== undefined) {
            // set chargeLineNumber
            const chargeLineNumber = charge.lineNumber;

            // set conditionType according to BTP
            const conditionType = getConditionType(pe, sbDestinationProperties);

            // set transactionItemId
            const transactionItemId = pe.step
                ? `${chargeLineNumber}-${pe.step}`
                : `${chargeLineNumber}-0`;

            // set basePrice
            const basePrice = getBasePriceAmount(charge, pe);

            const unit =
                charge.ratingType.toLowerCase() === 'usage'
                    ? charge.consumedQuantity.unit
                    : 'DAY';

            // add basePrice to basPrices collections
            basePrices.push({
                chargeLineNumber,
                transactionItemId,
                conditionType,
                basePrice,
                unit,
                ratingType: charge.ratingType,
                currency: pe.conditionValue.currency,
                amount: pe.conditionValue.amount,
                chargedConsumedQuantity: charge.consumedQuantity.value,
            });
        }
    }
    return basePrices;
}

/**
 * Check if a bill is commodity
 * @param {Object} req
 * @param {Object} billDetail
 * @param {Array} usagePromises
 * @param {Object} BDSDestinationProperties
 * @returns {boolean} isCommodity
 */
function checkIsCommodity(
    req,
    billDetail,
    usagePromises,
    BDSDestinationProperties
) {
    let isCommodity = false;

    billDetail.billItems[0].charges.forEach((charge) => {
        if (charge.measurementSpecification?.measurementMethodId) {
            isCommodity = true;
            charge?.usageRecords.forEach((usage) => {
                usagePromises.push(
                    module.exports.getMeterReadPerUsage(
                        req,
                        usage,
                        charge,
                        BDSDestinationProperties
                    )
                );
            });
        }
    });
    return isCommodity;
}

/**
 * Get subscription status of the bill from SB
 * @param {Object} req
 * @param {Object} sbDest
 * @param {String} subscriptionDocumentId
 * @param {Object} bundle
 * @returns {Promise} subscriptionStatus
 */
async function getSubscriptionStatus(
    req,
    sbDest,
    subscriptionDocumentId,
    bundle
) {
    const subscriptionDetails = await SubscriptionBillingAPI.getSubscription(
        sbDest,
        subscriptionDocumentId,
        req
    );
    if (
        !subscriptionDetails ||
        subscriptionDetails?.stack ||
        !subscriptionDetails[0]?.status
    ) {
        logger.debug(
            `${loggerScope} ${bundle.getText(
                'errorMsgBillableItemsBITSComSubsNotFound'
            )} ${subscriptionDocumentId}`,
            subscriptionDetails
        );
        return Promise.reject(
            new Error(
                `${bundle.getText(
                    'errorMsgBillableItemsBITSComSubsNotFound'
                )} ${subscriptionDocumentId}`
            )
        );
    }
    return Promise.resolve(subscriptionDetails[0]?.status);
}

/**
 * Check if usage record exists for commodity bill, otherwise reject
 * @param {Object} req
 * @param {Object} sbDest
 * @param {String} subscriptionDocumentId
 * @param {Object} bundle
 * @returns {Promise}
 */
async function checkUsage(
    usagePromises,
    meterReadsInfo,
    documentNumber,
    bundle
) {
    const readResponse = await Promise.allSettled(usagePromises);
    const finalResponse = readResponse.filter(
        (resp) => resp.status === REJECTED_STATUS
    );
    if (finalResponse?.length > 0) {
        return Promise.reject(
            new Error(
                bundle.getText('errorMsgBillableItemsBITSComMeterReadsNotFound')
            )
        );
    }
    readResponse.forEach((resp) => {
        if (resp.status === FULFILLED_STATUS) {
            resp.value.forEach((value) => {
                meterReadsInfo.push(value);
            });
        }
    });

    return null;
}

/**
 * Check if multiple readings exist
 * @param {Object} reading
 * @param {Object} validTo
 * @returns {Object} consumptionReading
 */
function checkConsumptionReading(reading, validTo) {
    let consumptionReading;
    if (Array.isArray(reading)) {
        consumptionReading = reading.find(
            (readingData) => readingData.timeStamp === validTo
        );
    } else if (reading?.timeStamp === validTo) {
        consumptionReading = reading;
    }

    return consumptionReading;
}

module.exports = {
    prepareMeterReadPayload: (billAsyncId) => {
        // Create final Meter Read payload
        const MeterReadRequest = {
            Header: {
                Verb: 'get',
                Noun: 'BillingDeterminants',
            },
            Request: {
                BillingDeterminantAsyncRequestId: {
                    bdAsyncRequestId: billAsyncId,
                    withDetails: 'true',
                },
            },
        };

        const billDeterminant = { ...MeterReadRequest.Request };
        delete MeterReadRequest.Request.BillingDeterminantAsyncRequestId;
        module.exports.setJsonWithPrefixedKeysHelper(
            billDeterminant,
            TMD_OPERATION_NAMESPACE.prefix
        );

        const mrPayload = module.exports.setC4EJsonKeys(
            MeterReadRequest,
            TMD_NAMESPACE.prefix,
            TMD_NAMESPACE.nameSpace,
            TMD_OPERATION_NAMESPACE.nameSpace,
            TMD_OPERATION_NAMESPACE.prefix
        );

        mrPayload[requestMessage][msgRequest] = { ...billDeterminant };
        return module.exports.convertJsonToXML(mrPayload);
    },

    /**
     * Helper function
     * @param {*} payload
     * @param {*} prefix
     * @param {*} nameSpace
     */
    setC4EJsonKeys: (payload, prefix, nameSpace, opNameSpace, opPrefix) => {
        module.exports.setJsonWithPrefixedKeysHelper(payload, prefix);

        // add namespace to the root
        return {
            'msg:RequestMessage': {
                $: {
                    [`xmlns:${prefix}`]: `${nameSpace}`,
                    [`xmlns:${opPrefix}`]: `${opNameSpace}`,
                },
                ...payload,
            },
        };
    },

    /**
     * Helper function used to update all Object keys
     * @param {*} obj
     */
    setJsonWithPrefixedKeysHelper: (obj, prefix) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                // update nested key
                module.exports.setJsonObjectKey(obj, key, `${prefix}:${key}`);
                module.exports.setJsonWithPrefixedKeysHelper(
                    obj[`${prefix}:${key}`],
                    prefix
                );
            } else {
                module.exports.setJsonObjectKey(obj, key, `${prefix}:${key}`);
            }
        }
    },

    /**
     * Set key object
     * @param {*} obj
     * @param {*} key
     * @param {*} newKey
     */
    setJsonObjectKey: (obj, key, newKey) => {
        delete Object.assign(obj, {
            [newKey]: obj[key],
        })[key];
    },

    /**
     * Set key object
     * @param {*} obj
     * @param {*} key
     * @param {*} newKey
     */
    getCommodityData: async (
        req,
        billDetail,
        BDSDestinationProperties,
        markets,
        sbDestinationProperties,
        sbDest
    ) => {
        // Distinguish between usage  and Non usage based Bills
        let isCommodity = false;
        let division;
        let meterReads;
        let subscriptionStatus;
        const meterReadsInfo = [];
        const usagePromises = [];
        const basePrices = [];
        const bundle = getBundle(req, i18nPath);
        let billingForecasts;

        try {
            isCommodity = checkIsCommodity(
                req,
                billDetail,
                usagePromises,
                BDSDestinationProperties
            );

            // query C4E only for Commodity BIll
            if (isCommodity === true) {
                const commodityBillableItems =
                    'billable-items-transfer-commodity';
                // get commodity BITS feature flag
                const commodityBITsFeature = await getEnabledFeatures(req, [
                    commodityBillableItems,
                ]);

                if (!commodityBITsFeature.includes(commodityBillableItems)) {
                    return Promise.reject(
                        new Error(
                            bundle.getText(
                                'errorMsgBillableItemsBITSCommodityServiceUnavailable'
                            )
                        )
                    );
                }
                if (usagePromises.length === 0) {
                    return Promise.reject(
                        new Error(
                            `${bundle.getText(
                                'errorMsgBillableItemsBITSComUsageRecordNotFound'
                            )} ${billDetail.documentNumber}`
                        )
                    );
                }

                // set basePrices
                // eslint-disable-next-line no-restricted-syntax
                for (const c of billDetail.billItems[0].charges) {
                    basePrices.push(getBasePrices(c, sbDestinationProperties));
                }

                await checkUsage(
                    usagePromises,
                    meterReadsInfo,
                    billDetail.documentNumber,
                    bundle
                );

                meterReads = meterReadsInfo.flat();

                const result = markets?.filter(
                    (item) => item?.marketId === billDetail?.market?.id
                );
                if (!result) {
                    return Promise.reject(
                        new Error(
                            `${bundle.getText(
                                'errorMsgBillableItemsBITSComDivisionNotFound'
                            )} ${billDetail.documentNumber}`
                        )
                    );
                }
                division = result[0]?.salesArea?.division;

                // Read subscription status from first bill item
                subscriptionStatus = await getSubscriptionStatus(
                    req,
                    sbDest,
                    billDetail.billItems[0].subscription
                        ?.subscriptionDocumentId,
                    bundle
                );

                const billingForecastFeature = 'forecastbit-periodic-invoicing';
                const enabledFeatures = await getEnabledFeatures(req, [
                    billingForecastFeature,
                ]);
                // Fetch billing forecasts
                if (enabledFeatures.includes(billingForecastFeature)) {
                    billingForecasts =
                        await ForecastBITSHelper.getPeriodicBillingForecasts(
                            req,
                            sbDest,
                            billDetail
                        );
                }
            }
        } catch (e) {
            const errorMsg =
                e.message ||
                `${loggerScope} ${bundle.getText(
                    'errorMsgBillableItemsBITSGetCommDataErr'
                )}`;
            logger.debug(errorMsg, e);
            return Promise.reject(
                new Error(`${errorMsg} ${billDetail.documentNumber}`)
            );
        }
        return {
            isCommodity,
            meterReads,
            division,
            basePrices,
            subscriptionStatus,
            billingForecasts,
        };
    },

    /**
     * Get meter read details for each usage record
     * @param {*}
     * @returns {Object} meterReadsData
     */
    getMeterReadPerUsage: async (
        req,
        usage,
        charge,
        BDSDestinationProperties
    ) => {
        // Read Async ID from Usage Records External ID
        const bundle = getBundle(req, i18nPath);
        const meterReadsData = [];
        const externalId = usage?.externalId?.split(':');

        // Raise error if no externalId found
        if (!externalId) {
            return Promise.reject(
                new Error(
                    bundle.getText(
                        'errorMsgBillableItemsBITSComMeterReadsNotFound'
                    )
                )
            );
        }

        const billAsyncId = externalId[0];
        const itemId = externalId[1].concat(':').concat(externalId[2]);
        // Prepare Meter Read Payload
        const meterReadPayload =
            module.exports.prepareMeterReadPayload(billAsyncId);
        const meterReads = await EnergyDataServiceAPI.getMeterReads(
            req,
            BDSDestinationProperties,
            meterReadPayload
        );

        // Raise error if no Meter Reads found
        if (!meterReads?.data) {
            return Promise.reject(new Error(meterReads));
        }

        // Convert XML response to Json if no error, else raise error
        const meterReadResponse = await module.exports.convertXmlToJson(
            meterReads?.data
        );
        if (meterReadResponse.errors) {
            return Promise.reject(new Error(meterReadResponse.errors));
        }

        let billDeterminantIndex;
        if (Array.isArray(meterReadResponse.result.BillingDeterminant)) {
            billDeterminantIndex =
                meterReadResponse.result.BillingDeterminant.find(
                    (ind) => ind.itemID === itemId
                );
        } else {
            billDeterminantIndex = meterReadResponse.result.BillingDeterminant;
        }

        for (
            let index = 0;
            index <
            billDeterminantIndex.BillingDeterminantReadings.MeterReadings
                .Reading.length -
                1;
            index += 1
        ) {
            // set transactionItemId
            const transactionItemId = charge?.pricingElements[0]?.step
                ? `${charge.lineNumber}-${charge.pricingElements[0].step}`
                : `${charge.lineNumber}-0`;
            const transactionItemSubId = index + 1;

            const chargeLineNumber = charge.lineNumber;
            const UtilitiesDeviceID =
                meterReadResponse.result.MeterDetails.serialNumber;
            const UtilitiesObjectIdnSystemCode =
                billDeterminantIndex.BillingDeterminantReadings.MeterReadings
                    .identificationSystemCode;
            const meterReadCategoryCode =
                billDeterminantIndex.BillingDeterminantReadings.MeterReadings
                    .Reading[index]?.estimationTypeCode === '1' ||
                billDeterminantIndex.BillingDeterminantReadings.MeterReadings
                    .Reading[index]?.estimationTypeCode === '2'
                    ? `03`
                    : `01`;
            const validFrom =
                billDeterminantIndex.BillingDeterminantReadings.MeterReadings
                    .Reading[index].timeStamp;
            const validTo =
                billDeterminantIndex.BillingDeterminantReadings.MeterReadings
                    .Reading[index + 1].timeStamp;
            const prevValue =
                billDeterminantIndex.BillingDeterminantReadings.MeterReadings
                    .Reading[index].value;
            const currentValue =
                billDeterminantIndex.BillingDeterminantReadings.MeterReadings
                    .Reading[index + 1].value;
            const MeasureUnitCode =
                billDeterminantIndex.Result.unitMultiplier.concat(
                    billDeterminantIndex.Result.unit
                );
            const resultAdjustmentFactorValue =
                billDeterminantIndex.BillingDeterminantReadings?.MeterReadings
                    .registerMultiplierValue;
            const consumptionReading = checkConsumptionReading(
                billDeterminantIndex.BillingDeterminantReadings?.ConsumptionData
                    ?.Reading,
                validTo
            );
            const quantity = consumptionReading?.value;
            const mrid = meterReadResponse.result.MeterDetails.mRID;

            // add MeterReads to  collections
            meterReadsData.push({
                chargeLineNumber,
                transactionItemId,
                transactionItemSubId,
                UtilitiesDeviceID,
                UtilitiesObjectIdnSystemCode,
                validFrom,
                validTo,
                prevValue,
                currentValue,
                MeasureUnitCode,
                resultAdjustmentFactorValue,
                quantity,
                mrid,
                meterReadCategoryCode,
            });
        }

        return Promise.resolve(meterReadsData);
    },

    /**
     * Validate  response & parse it to json
     * @param {*} resp
     * @returns
     */
    convertXmlToJson: (resp) => {
        let obj = {};
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            xml2js.parseString(
                resp,
                {
                    tagNameProcessors: [xml2js.processors.stripPrefix],
                    ignoreAttrs: false,
                    explicitArray: false,
                    explicitRoot: false,
                    mergeAttrs: true,
                },
                (err, result) => {
                    if (result) {
                        if (result.Reply.Result === 'OK') {
                            obj = {
                                errors: '',
                                result: result.Payload.BillingDeterminants,
                            };
                        } else {
                            obj = {
                                errors: result.Reply.Error.details,
                                result: '',
                            };
                        }
                    }
                    resolve(obj);
                }
            );
        });
    },

    convertJsonToXML: (jsonPayload) =>
        new xml2js.Builder().buildObject(jsonPayload),

    prepareCommodityBillableItemsCrReqPayload: (
        billDetail,
        customerInfo,
        destinationProperties,
        commodityData,
        req
    ) => {
        let billableItemsCreateRequest = {};
        const { market, contractAccount } = billDetail;
        const { s4bp } = customerInfo;
        const timeZone = market?.timeZone;
        let contractAccountID = '';
        const sbSystemId = destinationProperties?.SBBusinessSystem || '';
        const bpSystemId = destinationProperties?.S4BusinessSystem || '';
        const billingProcess = destinationProperties?.CommodityBillingProcess;
        const bundle = getBundle(req, i18nPath);

        try {
            if (
                commodityData.subscriptionStatus === 'Expired' &&
                !destinationProperties.CommodityBillingSubProcessExpired
            ) {
                return Promise.reject(
                    new Error(
                        `${bundle.getText(
                            'errorMsgBillableItemsSRVErrorFetchingSBDestination'
                        )} ${billDetail.documentNumber}`
                    )
                );
            }
            if (
                commodityData.subscriptionStatus !== 'Expired' &&
                !destinationProperties.CommodityBillingSubProcess
            ) {
                return Promise.reject(
                    new Error(
                        `${bundle.getText(
                            'errorMsgBillableItemsSRVErrorFetchingSBDestination'
                        )} ${billDetail.documentNumber}`
                    )
                );
            }

            // Set contractAccountID
            if (contractAccount && contractAccount.trim().length > 0) {
                contractAccountID = contractAccount;
            }

            // For each sourceItem under each billItem, map CREATE objects
            const listObj = module.exports.prepareCreateObjectList(
                billDetail,
                timeZone,
                s4bp,
                contractAccountID,
                destinationProperties,
                commodityData
            );

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
                    BillableItemsPostingCreate:
                        listObj.billableItemsPostingCreateList,
                    BillableItemsTextCreate: listObj.billableItemTextCreateList,
                    'n1:UtilitiesBillableItemsExtension': {
                        MeterReadingInfo: listObj.meterReadCreate,
                        Price: listObj.priceCreateList,
                    },
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
        return billableItemsCreateRequest;
    },

    convertDecimals: (inputData) => Number(inputData).toFixed(3),

    evaluateMeterReadCreate: (meterReads, timeZone, documentNumber) => {
        const meterReadCreateList = [];
        meterReads.forEach((meterRead) => {
            // Adding date logic meter read validFrom and validTo
            // Setting start date based on timezone
            let startDate = '';
            let endDate = '';

            if (timeZone && meterRead.validFrom) {
                startDate = convertDateTime(timeZone, meterRead.validFrom).date;
            }
            // Setting end date based on timezone
            if (timeZone && meterRead.validTo) {
                endDate = convertDateTime(timeZone, meterRead.validTo).date;
            }

            let meterReadingResultQty;
            let previousMeterReadingResultQty;
            let quantity;
            if (meterRead.currentValue) {
                meterReadingResultQty = module.exports.convertDecimals(
                    meterRead.currentValue
                );
            }

            if (meterRead.prevValue) {
                previousMeterReadingResultQty = module.exports.convertDecimals(
                    meterRead.prevValue
                );
            }

            if (meterRead.quantity) {
                quantity = module.exports.convertDecimals(meterRead.quantity);
            }

            const MeterReadingInfo = {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: documentNumber,
                CABllbleItmSourceTransItmID: meterRead.transactionItemId,
                ValidFromDate: startDate,
                ValidToDate: endDate,
                UtilitiesDeviceID: meterRead.UtilitiesDeviceID,
                UtilitiesObjectIdnSystemCode:
                    meterRead.UtilitiesObjectIdnSystemCode,
                MeterReadingResultQty: {
                    attributes: {
                        unitCode: meterRead.MeasureUnitCode.toUpperCase(),
                    },
                    $value: meterReadingResultQty,
                },
                MeterReadingCategoryCode: meterRead.meterReadCategoryCode,
                PreviousMeterReadingResultQty: {
                    attributes: {
                        unitCode: meterRead.MeasureUnitCode.toUpperCase(),
                    },
                    $value: previousMeterReadingResultQty,
                },
                MeterReadingResultAdjustmentFactorValue:
                    meterRead.resultAdjustmentFactorValue,
                Quantity: {
                    attributes: {
                        unitCode: meterRead.MeasureUnitCode.toUpperCase(),
                    },
                    $value: quantity,
                },
                UtilitiesMeterID: meterRead.mrid,
                // need to put UtilitiesMeteringLocation back
                TechnicalExtension: {
                    CABllbleItmExtnType: 'UTMR',
                    CABllbleItmExtnID: `${documentNumber}-${meterRead.transactionItemId}`,
                    CABllbleItmExtnItmID: meterRead.transactionItemSubId,
                },
            };
            meterReadCreateList.push(MeterReadingInfo);
        });
        return meterReadCreateList;
    },

    evaluateItemTextCreate: (
        documentNumber,
        item,
        ItemGroupingTextDataCnt,
        meterReads,
        billableItemTextCreateList
    ) => {
        const billableItemTextCreateListforIndex = [];

        // charge will always contain a price
        let itemText = {
            CABllbleItmSourceTransType: 'REVCL',
            CABllbleItmSourceTransId: documentNumber,
            CABllbleItmSourceTransItmID: item.transactionItemId,
            CABllbleItmGroupingTextData: ItemGroupingTextDataCnt,

            TechnicalExtension: {
                CABllbleItmExtnType: 'UTPR',

                // For UTPR case - CABllbleItmSourceTransID concatenated with CABllbleItmSourceTransItmID.
                CABllbleItmExtnID: `${documentNumber}-${item.transactionItemId}`,

                // Unique identifier like 1, 2,3 to identify multiple usages for a BIT.
                // fo UTPC can leave it empty
                // CABllbleItmExtnItmID: 1,
            },
        };

        billableItemTextCreateListforIndex.push(itemText);
        const meterReadItem = meterReads.find(
            (meterRead) => meterRead.chargeLineNumber === item.chargeLineNumber
        );
        let meterReadCount = 1;

        // check the meter reads for ones with same charge line number
        // note that we insert a new item basic text node with the corresponding technical Extension type UTMR
        // meterReadItem.forEach((meterRead, meterIndex) => {
        // if (meterRead.chargeLineNumber === item.chargeLineNumber) {
        if (meterReadItem) {
            // Check if multiple Meter Reads Exist for same Transaction Item ID
            const meterReadsItems = billableItemTextCreateList.find(
                (textCreate) =>
                    textCreate.TechnicalExtension.CABllbleItmExtnID.split(
                        '-'
                    )[1]
                        .concat('-')
                        .concat(
                            textCreate.TechnicalExtension.CABllbleItmExtnID.split(
                                '-'
                            )[2]
                        ) === meterReadItem.transactionItemId &&
                    textCreate.TechnicalExtension.CABllbleItmExtnType === 'UTMR'
            );
            if (meterReadsItems) {
                meterReadCount += 1;
            }

            itemText = {
                CABllbleItmSourceTransType: 'REVCL',
                CABllbleItmSourceTransId: documentNumber,
                CABllbleItmSourceTransItmID: item.transactionItemId,
                CABllbleItmGroupingTextData: ItemGroupingTextDataCnt,

                TechnicalExtension: {
                    CABllbleItmExtnType: 'UTMR',
                    CABllbleItmExtnID: `${documentNumber}-${meterReadItem.transactionItemId}`,
                    CABllbleItmExtnItmID: meterReadCount,
                },
            };

            billableItemTextCreateListforIndex.push(itemText);
        }
        // }
        // });

        return billableItemTextCreateListforIndex;
    },

    prepareCreateObjectList: (
        billDetail,
        timeZone,
        s4BpId,
        contractAccountID,
        destinationProperties,
        commodityData
    ) => {
        const { documentNumber, billItems } = billDetail;
        const { basePrices, meterReads, division } = commodityData;
        const billableItemBasicCreateList = [];
        const billableItemsPostingCreateList = [];
        const priceCreateList = [];
        const billableItemTextCreateList = [];
        let startDate = '';
        let endDate = '';
        let startTime = '';
        let endTime = '';
        let dateTime;
        const bitClass = destinationProperties?.BITClass
            ? destinationProperties?.BITClass
            : '0SAP';
        let billingSubProcess;

        // Depending on subscription status, get different billing sub process code
        if (commodityData.subscriptionStatus === 'Expired') {
            billingSubProcess =
                destinationProperties.CommodityBillingSubProcessExpired;
        } else {
            billingSubProcess =
                destinationProperties.CommodityBillingSubProcess;
        }

        // Get basePrices
        const bp = basePrices.flat();
        bp.forEach((charge, i) => {
            if (charge.conditionType) {
                const chargeItem = billItems[0].charges.find(
                    (item) => item.lineNumber === charge.chargeLineNumber
                );

                // Setting start date based on timezone
                if (timeZone && chargeItem.ratingPeriod?.start) {
                    dateTime = convertDateTime(
                        timeZone,
                        chargeItem.ratingPeriod.start
                    );
                    startDate = dateTime.date;
                    startTime = dateTime.time;
                }
                // Setting end date based on timezone
                if (timeZone && chargeItem.ratingPeriod?.end) {
                    dateTime = convertDateTime(
                        timeZone,
                        chargeItem.ratingPeriod.end,
                        true
                    );
                    endDate = dateTime.date;
                    endTime = dateTime.time;
                }
                // converting price value upto 2 decimal
                const priceValue = charge.basePrice?.toFixed(2);
                const basicCreate = {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: documentNumber,
                    CABllbleItmSourceTransItmID: charge.transactionItemId,
                    CABllbleItmClass: bitClass,
                    CABillgSubprocess: billingSubProcess,
                    CABllbleItmType: charge.conditionType,
                    BusinessPartner: {
                        InternalID: s4BpId,
                    },
                    ContractAccount: {
                        InternalID: contractAccountID,
                    },
                    CAContract:
                        billItems[0].subscription.subscriptionDocumentId,
                    CASubApplication: 'P',
                    CAProviderContractItemNumber:
                        chargeItem.externalObjectReferences[0].externalId,
                    CABllbleItmDate: startDate,
                    CABllbleItmStartDate: startDate,
                    CABllbleItmEndDate: endDate,
                    CABllbleItmTime: startTime,
                    CABllbleItmStartTime: startTime,
                    CABllbleItmEndTime: endTime,
                    CABillgFirstDate: billDetail.billingDate?.substring(0, 10),
                    CABllbleItmAmount: {
                        attributes: {
                            currencyCode: charge.currency,
                        },
                        $value: charge.amount,
                    },

                    CABllbleItemQty: {
                        attributes: {
                            unit: charge.unit.toUpperCase(),
                        },
                        $value: charge.chargedConsumedQuantity,
                    },
                    CAInvcgIsItemPostingRelevant: 'true',
                    CAInvcgIsItemPrintingRelevant: 'true',
                    CABllbleItmGroupingTextData: i + 1,
                    CABllbleItmControlOfUnit: '6',
                    Division: division,
                };

                const postingCreate = {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: documentNumber,
                    CABllbleItmSourceTransItmID: charge.transactionItemId,
                    Division: division,
                };

                const Price = {
                    CABllbleItmSourceTransType: 'REVCL',
                    CABllbleItmSourceTransId: documentNumber,
                    CABllbleItmSourceTransItmID: charge.transactionItemId,
                    Price: {
                        Amount: {
                            attributes: {
                                currencyCode: charge.currency,
                            },
                            $value: priceValue,
                        },
                        BaseQuantity: {
                            attributes: {
                                unitCode: charge.unit.toUpperCase(),
                            },
                            $value: 1,
                        },
                    },
                    TechnicalExtension: {
                        CABllbleItmExtnType: 'UTPR',
                        CABllbleItmExtnID: `${documentNumber}-${charge.transactionItemId}`,
                    },
                };

                const textCreate = module.exports.evaluateItemTextCreate(
                    documentNumber,
                    charge,
                    i + 1,
                    meterReads,
                    billableItemTextCreateList
                );

                billableItemBasicCreateList.push(basicCreate);
                billableItemsPostingCreateList.push(postingCreate);
                priceCreateList.push(Price);
                billableItemTextCreateList.push(...textCreate);
                // }
            }
        });

        // Extend billable items create request with forecast billable items
        if (commodityData.billingForecasts !== undefined) {
            billableItemBasicCreateList.push(
                ...ForecastBITSHelper.prepareForecastBillableItemsBasicCreate(
                    destinationProperties,
                    commodityData.billingForecasts,
                    billDetail
                )
            );
            billableItemsPostingCreateList.push(
                ...ForecastBITSHelper.prepareForecastBillableItemsPostingCreate(
                    commodityData.billingForecasts,
                    billDetail
                )
            );
        }

        // Prepare Meter read node
        const meterReadCreate = module.exports.evaluateMeterReadCreate(
            meterReads,
            timeZone,
            documentNumber
        );

        return {
            billableItemBasicCreateList,
            billableItemsPostingCreateList,
            priceCreateList,
            meterReadCreate,
            billableItemTextCreateList,
        };
    },
};
