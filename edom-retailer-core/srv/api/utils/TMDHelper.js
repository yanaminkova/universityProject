const xml2js = require('xml2js');
const crypto = require('crypto');
const logger = require('cf-nodejs-logging-support');
const { TMD_NAMESPACE, TMD_OPERATION_NAMESPACE } = require('./Operations');
const EnergyDataServiceAPI = require('../../external/EnergyDataServiceAPI');
const { getBundle } = require('../../lib/helper');

const i18nPath = '../../_i18n/i18n';
const loggerScope = `[TechnicalMasterDataService]`;
logger.info(`${loggerScope}`);

class TMDHelper {
    /**
     * Set Json TMD Payload with valid keys
     * The payload should include all the namespaces
     * @param {*} payload
     */
    static updateTMDObjectKeys(payload) {
        // Get operations
        const operations = payload.Payload.OperationSet.Operation;

        // Operation 1: UsagePointLocationConfig
        const updatedUsagePointLocationConfig = this.getUpdatedFields(
            operations,
            TMD_OPERATION_NAMESPACE,
            'noun',
            'UsagePointLocationConfig'
        );

        // Operation 2: UsagePointConfig
        const updatedUsagePointConfig = this.getUpdatedFields(
            operations,
            TMD_OPERATION_NAMESPACE,
            'noun',
            'UsagePointConfig'
        );

        // Operation 3: MeterConfig
        // -- set MeterConfigKeys with its nameSpace
        const metConfIndex = this.getOperationIndex(
            operations,
            'noun',
            'MeterConfig'
        );
        const meterConfig = operations[metConfIndex].MeterConfig;
        const updatedMeterConfig = this.setMeterConfigKeys(meterConfig);

        // -- remove MeterConfig
        delete operations[metConfIndex].MeterConfig;

        // Operation 4: MasterDataLinkageConfig
        const updatedMasterConfig = this.getUpdatedFields(
            operations,
            TMD_OPERATION_NAMESPACE,
            'noun',
            'MasterDataLinkageConfig'
        );

        // ---
        const tmdPayload = this.setTMDJsonKeys(
            payload,
            TMD_NAMESPACE.prefix,
            TMD_NAMESPACE.nameSpace
        );

        const requestMessage = 'msg:RequestMessage';
        const msgOperation = 'msg:Operation';

        // Add UsagePointLocationConfig to payload --Operation 1
        this.addOperationToUpdatedPayload(
            tmdPayload[requestMessage],
            msgOperation,
            `${TMD_OPERATION_NAMESPACE.prefix}:UsagePointLocationConfig`,
            updatedUsagePointLocationConfig.field,
            'UsagePointLocationConfig',
            updatedUsagePointLocationConfig.index
        );

        // Add UsagePointConfig to payload --Operation 2
        this.addOperationToUpdatedPayload(
            tmdPayload[requestMessage],
            msgOperation,
            `${TMD_OPERATION_NAMESPACE.prefix}:UsagePointConfig`,
            updatedUsagePointConfig.field,
            'UsagePointConfig',
            updatedUsagePointConfig.index
        );

        // Add MeterConfig to payload --Operation 3
        this.addOperationToUpdatedPayload(
            tmdPayload[requestMessage],
            msgOperation,
            `${TMD_OPERATION_NAMESPACE.prefix}:MeterConfig`,
            updatedMeterConfig,
            'MeterConfig',
            metConfIndex
        );

        // Add MasterDataLinkageConfig to payload --Operation 4
        this.addOperationToUpdatedPayload(
            tmdPayload[requestMessage],
            msgOperation,
            `${TMD_OPERATION_NAMESPACE.prefix}:MasterDataLinkageConfig`,
            updatedMasterConfig.field,
            'MasterDataLinkageConfig',
            updatedMasterConfig.index
        );

        return tmdPayload;
    }

    /**
     * Update TMD field with namespace/key
     * @param {*} operations
     * @param {*} operationDetails
     * @param {*} key
     * @param {*} operation
     * @returns
     */
    static getUpdatedFields(operations, operationDetails, key, operation) {
        const index = this.getOperationIndex(operations, key, operation);

        const field = this.setOperationKeys(
            operations[index][operation],
            operationDetails.prefix,
            operationDetails.nameSpace
        );
        // -- remove UsagePointLocationConfig
        // eslint-disable-next-line no-param-reassign
        delete operations[index][operation];

        return { field, index };
    }

    /**
     * Set MeterConfig keys
     * @param {*} meterConfig
     * @returns
     */
    static setMeterConfigKeys(meterConfig) {
        const { prefix, nameSpace } = TMD_OPERATION_NAMESPACE;
        const SimpleEndDeviceFunction = 'm:SimpleEndDeviceFunction';

        this.setJsonWithPrefixedKeysHelper(meterConfig, prefix);

        // Set SimpleEndDeviceFunction
        // eslint-disable-next-line no-param-reassign
        meterConfig['m:Meter'][SimpleEndDeviceFunction] = {
            $: {
                ref: meterConfig['m:Meter'][SimpleEndDeviceFunction],
            },
        };

        // Set all ReadingType
        const channels =
            meterConfig[SimpleEndDeviceFunction]['m:Registers']['m:Channels'];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < channels.length; i++) {
            channels[`m:${i}`]['m:ReadingType'] = {
                $: { ref: channels[`m:${i}`]['m:ReadingType'] },
            };
        }

        // add namespace the main UsagePointLocationConfig
        return {
            $: {
                [`xmlns:${prefix}`]: `${nameSpace}`,
            },
            ...meterConfig,
        };
    }

    /**
     * Add UsageLocationConfig to TMD payload
     * @param {*} obj
     * @param {*} operationKey
     * @param {*} field
     * @returns
     */
    static addOperationToUpdatedPayload(
        obj,
        operationKey,
        usageLocCongKey,
        usageLocConfObj,
        operationName,
        msgObjIndex
    ) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key] of Object.entries(obj)) {
            if (key === operationKey) {
                const operation = obj[key][`msg:${msgObjIndex}`];
                if (operation['msg:noun'] === operationName) {
                    // eslint-disable-next-line no-param-reassign
                    obj[key][`msg:${msgObjIndex}`] = {
                        ...operation,
                        [usageLocCongKey]: usageLocConfObj,
                    };
                    return;
                }
            }

            const element = obj[key];
            if (element && typeof element === 'object') {
                this.addOperationToUpdatedPayload(
                    obj[key],
                    operationKey,
                    usageLocCongKey,
                    usageLocConfObj,
                    operationName,
                    msgObjIndex
                );
            }
        }
    }

    /**
     * Find & return an operation by a key
     * @param {*} operations
     * @param {*} key
     * @param {*} operationName
     * @returns
     */
    static getOperationIndex(operations, key, operationName) {
        return operations.findIndex((o) => o[key] === operationName);
    }

    /**
     * Helper function
     * @param {*} payload
     * @param {*} prefix
     * @param {*} nameSpace
     */
    static setTMDJsonKeys(payload, prefix, nameSpace) {
        this.setJsonWithPrefixedKeysHelper(payload, prefix, nameSpace);

        // add namespace to the root
        return {
            'msg:RequestMessage': {
                $: {
                    'xmlns:msg': 'http://iec.ch/TC57/2011/schema/message',
                },
                ...payload,
            },
        };
    }

    /**
     *  Set Operation Keys
     * @param {*} tmdPayload
     */
    static setOperationKeys(payload, prefix, nameSpace) {
        // add prefix to all nested Operation Key fields
        this.setJsonWithPrefixedKeysHelper(payload, prefix);

        // add namespace to the main Operation Key
        // eslint-disable-next-line no-param-reassign
        payload = {
            $: {
                [`xmlns:${prefix}`]: `${nameSpace}`,
            },
            ...payload,
        };

        return payload;
    }

    /**
     * Helper function used to update all Object keys
     * @param {*} obj
     */
    static setJsonWithPrefixedKeysHelper(obj, prefix) {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                // update nested key
                this.setJsonObjectKey(obj, key, `${prefix}:${key}`);
                this.setJsonWithPrefixedKeysHelper(
                    obj[`${prefix}:${key}`],
                    prefix
                );
            } else {
                this.setJsonObjectKey(obj, key, `${prefix}:${key}`);
            }
        }
    }

    /**
     * Set key object
     * @param {*} obj
     * @param {*} key
     * @param {*} newKey
     */
    static setJsonObjectKey(obj, key, newKey) {
        delete Object.assign(obj, {
            [newKey]: obj[key],
        })[key];
    }

    /**
     * check if the key is already prefixed
     * @param {*} key
     * @returns
     */
    static isKeyPrefixed(key) {
        return key.includes(':');
    }

    static convertJsonToXML(jsonPyalod) {
        return new xml2js.Builder().buildObject(jsonPyalod);
    }

    static getMeterName() {
        const date = new Date();
        return `${crypto.randomInt(10, 99)}${
            date.getMonth() + 1
        }${date.getDate()}${date.getHours()}${date.getMinutes()}${date
            .getSeconds()
            .toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;
    }

    /**
     * Validate TMD response & check if it contains errors or not
     * @param {*} resp
     * @returns
     */
    static isValidTMDResponse(resp) {
        let obj = {};
        const msgErrorKey = 'msg:Error';
        const faultMessageKey = 'msg:FaultMessage';
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            xml2js.parseString(resp.data, (err, result) => {
                if (result) {
                    if (this.hasProprety(result, faultMessageKey)) {
                        const messages = result[faultMessageKey]?.['msg:Reply'];
                        obj = {
                            errors: messages.length !== 0,
                            message:
                                messages?.[0]?.[msgErrorKey]?.[0]?.[
                                    'msg:reason'
                                ]?.[0],
                        };
                    } else {
                        const errorMsg =
                            result?.['msg:ResponseMessage']?.[
                                'msg:Reply'
                            ]?.[0]?.[msgErrorKey]?.[0];

                        const errorCode = errorMsg?.['msg:code']?.[0];

                        if (errorCode && errorCode !== '0.0') {
                            obj = {
                                errors: true,
                                message: `${errorMsg?.['msg:reason']?.[0]} ${errorMsg?.['msg:details']}`,
                            };
                        }
                    }
                }
                resolve(obj);
            });
        });
    }

    /**
     * Check if object has a specific proprety
     * @param {*} object
     * @param {*} key
     * @returns
     */
    static hasProprety(object, key) {
        return object ? hasOwnProperty.call(object, key) : false;
    }

    /**
     *
     * @param {*} slpProfiles
     * @param {*} maloPD
     * @returns
     */

    static async setSlpUUID(slpProfiles, maloPD) {
        let slpProfileIdMain;
        let slpProfileIdOffPeak;

        // >> Start of Mapping for SLP Profile ID
        if (slpProfiles?.data?.value) {
            if (maloPD.length === 1) {
                // Single register profile ID
                const singleProfile = slpProfiles.data.value.filter(
                    (profile) =>
                        profile.profileName === maloPD[0]?.forecastBasis_code // 'H0'
                );
                slpProfileIdMain = singleProfile[0].profileId;
            } else {
                // Double register profile IDs
                const onPeakProfile = slpProfiles.data.value.filter(
                    (profile) =>
                        profile.profileName === maloPD[0]?.forecastBasis_code // 'H0OnPeak'
                );
                slpProfileIdMain = onPeakProfile[0].profileId;

                const offPeakProfile = slpProfiles.data.value.filter(
                    (profile) =>
                        profile.profileName === maloPD[1]?.forecastBasis_code // 'H0OffPeak'
                );
                slpProfileIdOffPeak = offPeakProfile[0].profileId;
            }
        }
        // << End of Mapping for SLP Profile ID

        return {
            slpProfileIdMain,
            slpProfileIdOffPeak,
        };
    }

    /**
     *
     * @param {*} mtrTasks
     */
    static async setReadingTypeAndChannels(mciDetails, req) {
        const readingType = [];
        const channels = [];
        const mtrTasks = mciDetails?.meteringLocations[0]?.meteringTasks;
        const calcRules = mciDetails?.marketLocations[0]?.calculationRules;
        const maloPD =
            mciDetails?.changeProcesses[0]?.processData.marketLocationsPD;

        const slpProfiles = await EnergyDataServiceAPI.getSlpProfiles(req);

        const { slpProfileIdMain, slpProfileIdOffPeak } = await this.setSlpUUID(
            slpProfiles,
            maloPD
        );

        // >> Start of Mapping for OBIS_Code
        if (mtrTasks && calcRules) {
            if (mtrTasks.length > 1) {
                let i = 1;
                mtrTasks.forEach((mTask) => {
                    channels.push({
                        identificationSystemCode: mTask?.registerCode,
                        measurementTask: 'MeasurementTask',
                        slpProfileID:
                            i === 1 ? slpProfileIdMain : slpProfileIdOffPeak,
                        veeCode: 'veeCode',
                        ReadingType: `0.26.0.1.1.1.12.0.0.0.0.${i}.0.1.224.3.72.0`,
                    });

                    readingType.push({
                        Names: {
                            name: `0.26.0.1.1.1.12.0.0.0.0.${i}.0.1.224.3.72.0`,
                            NameType: {
                                name: 'ReadingTypeName',
                                NameTypeAuthority: {
                                    name: 'SAP',
                                },
                            },
                        },
                    });

                    i += 1;
                });

                i = 1;

                calcRules.forEach((calcRule) => {
                    channels.push({
                        identificationSystemCode: calcRule?.registerCode,
                        measurementTask: 'MeasurementTask',
                        slpProfileID:
                            i === 1 ? slpProfileIdMain : slpProfileIdOffPeak,
                        veeCode: 'veeCode',
                        ReadingType: `32.0.0.9.1.1.12.0.0.0.0.${i}.0.1.0.3.72.0`,
                    });

                    readingType.push({
                        Names: {
                            name: `32.0.0.9.1.1.12.0.0.0.0.${i}.0.1.0.3.72.0`,
                            NameType: {
                                name: 'ReadingTypeName',
                                NameTypeAuthority: {
                                    name: 'SAP',
                                },
                            },
                        },
                    });

                    i += 1;
                });
            } else {
                channels.push({
                    identificationSystemCode: mtrTasks[0]?.registerCode,
                    measurementTask: 'MeasurementTask',
                    slpProfileID: slpProfileIdMain,
                    veeCode: 'veeCode',
                    ReadingType: '0.26.0.1.1.1.12.0.0.0.0.0.0.0.224.3.72.0',
                });

                channels.push({
                    identificationSystemCode: calcRules[0]?.registerCode,
                    measurementTask: 'MeasurementTask',
                    slpProfileID: slpProfileIdMain,
                    veeCode: 'veeCode',
                    ReadingType: '32.0.0.9.1.1.12.0.0.0.0.0.0.0.0.3.72.0',
                });

                readingType.push({
                    Names: {
                        name: '0.26.0.1.1.1.12.0.0.0.0.0.0.0.224.3.72.0',
                        NameType: {
                            name: 'ReadingTypeName',
                            NameTypeAuthority: {
                                name: 'SAP',
                            },
                        },
                    },
                });

                readingType.push({
                    Names: {
                        name: '32.0.0.9.1.1.12.0.0.0.0.0.0.0.0.3.72.0',
                        NameType: {
                            name: 'ReadingTypeName',
                            NameTypeAuthority: {
                                name: 'SAP',
                            },
                        },
                    },
                });
            }
        }

        // << End of Mapping for OBIS_Code

        return {
            readingType,
            channels,
        };
    }

    /**
     *
     * @param {*} mciDetails
     * @param {*} timeStampUTC
     */
    static setUsagePointLocationObj(mciDetails, timeStampUTC) {
        return {
            Names: {
                name: mciDetails.meteringLocations[0]?.meteringLocationId,
                NameType: {
                    name: 'UsagePointLocationName',
                    NameTypeAuthority: {
                        name: 'SAP',
                    },
                },
            },
            // siteAccessProblem: 'dog bark',
            ConfigurationEvents: {
                effectiveDateTime: timeStampUTC,
            },
            mainAddress: {
                streetDetail: {
                    name: mciDetails.meteringLocations[0]?.address?.streetName,
                    number: mciDetails.meteringLocations[0]?.address
                        ?.houseNumber,
                },
                townDetail: {
                    code: mciDetails.meteringLocations[0]?.address?.postalCode,
                    country:
                        mciDetails.meteringLocations[0]?.address?.country?.name,
                    name: mciDetails.meteringLocations[0]?.address?.cityName,
                },
            },
        };
    }

    /**
     *
     * @param {*} mciDetails
     * @param {*} timeStampUTC
     */
    static setUsagePointObj(mciDetails, timeStampUTC) {
        return {
            Names: {
                name: mciDetails.meteringLocations[0]?.meteringLocationId,
                NameType: {
                    name: 'UtilitiesPointOfDeliveryPartyID',
                    NameTypeAuthority: {
                        name: 'SAP',
                    },
                },
            },
            amiBillingReady: 'AmiBillingReady',
            checkBilling: 'false',
            isSdp: 'false',
            isVirtual: 'false',
            minimalUsageExpected: 'false',
            readCycle: 'ReadCycle',
            readRoute: 'ReadRoute',
            ConfigurationEvents: {
                effectiveDateTime: timeStampUTC,
            },
            UsagePointLocation: {
                Names: {
                    name: mciDetails.meteringLocations[0]?.meteringLocationId,
                    NameType: {
                        name: 'UsagePointLocationName',
                        NameTypeAuthority: {
                            name: 'SAP',
                        },
                    },
                },
            },
        };
    }

    /**
     *
     * @param {*} mciDetails
     * @param {*} meterName
     * @param {*} timeStampUTC
     * @param {*} meterUUID
     */
    static async setMeterObj(
        mciDetails,
        meterName,
        timeStampUTC,
        meterUUID,
        req
    ) {
        const { readingType, channels } = await this.setReadingTypeAndChannels(
            mciDetails,
            req
        );

        return {
            Meter: {
                Names: {
                    name: `${meterName}`,
                    NameType: {
                        name: 'MeterName',
                        NameTypeAuthority: {
                            name: 'SAP',
                        },
                    },
                },
                amrSystem: 'METER_AMR_SYSTEM',
                isVirtual: 'false',
                serialNumber:
                    mciDetails.meteringLocations[0]?.meteringLocationId,
                timeZone: 'Europe/Berlin',
                timeZoneOffset: '120',
                ConfigurationEvents: {
                    effectiveDateTime: timeStampUTC,
                },
                SimpleEndDeviceFunction: `${meterUUID}`,
                EndDeviceInfo: {
                    AssetModel: {
                        modelNumber: 'model',
                        Manufacturer: {
                            name: 'device manufacturer',
                        },
                    },
                },
                lifecycle: {
                    installationDate:
                        mciDetails?.changeProcesses[0]?.processData
                            ?.meteringLocationsPD[0]?.installationDate,
                },
            },
            ReadingType: readingType,
            SimpleEndDeviceFunction: {
                mRID: `${meterUUID}`,
                enabled: 'true',
                Registers: {
                    isVirtual: 'true',
                    leftDigitCount: '9',
                    rightDigitCount: '3',
                    Channels: channels,
                    RegisterMultiplier: {
                        kind: 'kR',
                        value: '1',
                    },
                },
            },
        };
    }

    /**
     *
     * @param {*} mciDetails
     * @param {*} timeStampUTC
     * @param {*} meterName
     */
    static setMasterDataLinkageConfigObj(mciDetails, timeStampUTC, meterName) {
        return {
            ConfigurationEvent: {
                effectiveDateTime: timeStampUTC,
            },
            Meter: {
                Names: {
                    name: `${meterName}`,
                    NameType: {
                        name: 'MeterName',
                        NameTypeAuthority: {
                            name: 'SAP',
                        },
                    },
                },
            },
            UsagePoint: {
                Names: {
                    name: mciDetails.meteringLocations[0]?.meteringLocationId,
                    NameType: {
                        name: 'UtilitiesPointOfDeliveryPartyID',
                        NameTypeAuthority: {
                            name: 'SAP',
                        },
                    },
                },
            },
        };
    }

    /**
     *
     * @param {*} mciDetails
     */
    static async setTimeStamp(mciDetails) {
        try {
            // Time zone offset is defaulted to +01:00 as per Europe/Berlin Time zone
            const installationDate = `${mciDetails?.changeProcesses[0]?.processData?.meteringLocationsPD[0]?.installationDate}T00:00:00.000+01:00`;
            const timeStampUTC = new Date(installationDate).toISOString();
            return timeStampUTC;
        } catch (error) {
            return null;
        }
    }

    /**
     *
     * @param {*} mciDetails
     */
    static async prepareTMDPayload(mciDetails, req) {
        const bundle = getBundle(req, i18nPath);
        const meterName = this.getMeterName();
        const meterUUID = cds.utils.uuid();
        const operationSetList = [];
        let usagePointLocationObj = {};
        let usagePointObj = {};
        let masterDataLinkageConfigObj = {};
        let meterObj = {};

        try {
            // Set Timestamp for Berlin
            const timeStampUTC = await this.setTimeStamp(mciDetails);

            // Map UsagePointLocation values from meteringLocations of MCM response payload

            usagePointLocationObj = this.setUsagePointLocationObj(
                mciDetails,
                timeStampUTC
            );

            usagePointObj = this.setUsagePointObj(mciDetails, timeStampUTC);

            meterObj = await this.setMeterObj(
                mciDetails,
                meterName,
                timeStampUTC,
                meterUUID,
                req
            );

            masterDataLinkageConfigObj = this.setMasterDataLinkageConfigObj(
                mciDetails,
                timeStampUTC,
                meterName
            );

            // Push mapped UsagePointLocation to OperationSet
            operationSetList.push({
                operationId: '1',
                noun: 'UsagePointLocationConfig',
                verb: 'create',
                elementOperation: 'false',
                timesliceOperation: 'false',
                UsagePointLocationConfig: {
                    UsagePointLocation: usagePointLocationObj,
                },
            });

            // Push mapped UsagePoint to OperationSet
            operationSetList.push({
                operationId: '2',
                noun: 'UsagePointConfig',
                verb: 'create',
                elementOperation: 'false',
                timesliceOperation: 'false',
                UsagePointConfig: {
                    UsagePoint: usagePointObj,
                },
            });

            operationSetList.push({
                operationId: '3',
                noun: 'MeterConfig',
                verb: 'create',
                elementOperation: 'false',
                timesliceOperation: 'false',
                MeterConfig: meterObj,
            });

            // Push mapped MasterDataLinkageConfig to OperationSet
            operationSetList.push({
                operationId: '4',
                noun: 'MasterDataLinkageConfig',
                verb: 'create',
                elementOperation: 'false',
                timesliceOperation: 'false',
                MasterDataLinkageConfig: masterDataLinkageConfigObj,
            });

            // Create final TMD payload
            return {
                Header: {
                    Verb: 'execute',
                    Noun: 'OperationSet',
                },
                Payload: {
                    OperationSet: {
                        enforceTransactionalIntegrity: 'true',
                        Operation: operationSetList,
                    },
                },
            };
        } catch (error) {
            logger.error(
                `${bundle.getText(
                    'errorMsgTechnicalMasterDataSRVErrorPreparingC4EPayload'
                )}`,
                error
            );
        }
        return null;
    }

    static setMeterReadJsonKeys(
        header,
        request,
        prefix,
        nameSpace,
        prefix1,
        namespace1
    ) {
        this.setJsonWithPrefixedKeysHelper(header, prefix, nameSpace);

        const requestTag = 'msg:Request';
        const headerTag = 'msg:Header';

        // add namespace to the root
        return {
            'msg:RequestMessage': {
                $: {
                    [`xmlns:${prefix1}`]: `${namespace1}`,
                    [`xmlns:${prefix}`]: `${nameSpace}`,
                },
                [headerTag]: header,
                [requestTag]: request,
            },
        };
    }

    static convertXMLToJson(xmlPayload) {
        let json;
        // Converting response from XML to JSON
        const payload = xmlPayload.replace(/msg:/g, '').replace(/m:/g, '');

        xml2js.parseString(payload, (err, result) => {
            if (err) {
                throw err;
            }
            json = result;
        });

        return json;
    }

    static prepareMeterReadPayload(technical) {
        const header = { Verb: 'get', Noun: 'MeterConfig' };
        const request = {
            GetMeterConfig: {
                Meter: {
                    serialNumber: technical.id,
                },
            },
        };

        TMDHelper.setJsonWithPrefixedKeysHelper(
            request,
            TMD_OPERATION_NAMESPACE.prefix
        );

        return TMDHelper.setMeterReadJsonKeys(
            header,
            request,
            TMD_NAMESPACE.prefix,
            TMD_NAMESPACE.nameSpace,
            TMD_OPERATION_NAMESPACE.prefix,
            TMD_OPERATION_NAMESPACE.nameSpace
        );
    }

    static async readMeterDetails(req, technicalResource) {
        let meterReadResponse;

        const meterReadPayload =
            this.prepareMeterReadPayload(technicalResource);
        // Convert JSON payload to XML payload
        const xmlMeterRead = this.convertJsonToXML(meterReadPayload);
        try {
            meterReadResponse = await EnergyDataServiceAPI.getMeterConfig(
                req,
                xmlMeterRead
            );
        } catch (error) {
            return error;
        }

        return meterReadResponse;
    }
}

module.exports = TMDHelper;
