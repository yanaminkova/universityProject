const TMDXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<msg:RequestMessage xmlns:msg="http://iec.ch/TC57/2011/schema/message">\n  <msg:Header>\n    <msg:Verb>execute</msg:Verb>\n    <msg:Noun>OperationSet</msg:Noun>\n  </msg:Header>\n  <msg:Payload>\n    <msg:OperationSet>\n      <msg:enforceTransactionalIntegrity>true</msg:enforceTransactionalIntegrity>\n      <msg:Operation>\n        <msg:operationId>1</msg:operationId>\n        <msg:noun>UsagePointLocationConfig</msg:noun>\n        <msg:verb>create</msg:verb>\n        <msg:elementOperation>false</msg:elementOperation>\n        <msg:timesliceOperation>false</msg:timesliceOperation>\n        <m:UsagePointLocationConfig xmlns:m="http://iec.ch/TC57/CIM-c4e#">\n          <m:UsagePointLocation>\n            <m:Names>\n              <m:name>61821413031</m:name>\n              <m:NameType>\n                <m:name>MeteringLocation</m:name>\n                <m:NameTypeAuthority>\n                  <m:name>SAP</m:name>\n                </m:NameTypeAuthority>\n              </m:NameType>\n            </m:Names>\n            <m:ConfigurationEvents>\n              <m:effectiveDateTime>2021-08-02T18:13:03.832Z</m:effectiveDateTime>\n            </m:ConfigurationEvents>\n            <m:mainAddress>\n              <m:streetDetail>\n                <m:name>Bergstraße</m:name>\n                <m:number>12</m:number>\n              </m:streetDetail>\n              <m:townDetail>\n                <m:code>12345</m:code>\n                <m:country>Deutschland</m:country>\n                <m:name>Heidelberg</m:name>\n              </m:townDetail>\n            </m:mainAddress>\n          </m:UsagePointLocation>\n        </m:UsagePointLocationConfig>\n      </msg:Operation>\n      <msg:Operation>\n        <msg:operationId>2</msg:operationId>\n        <msg:noun>UsagePointConfig</msg:noun>\n        <msg:verb>create</msg:verb>\n        <msg:elementOperation>false</msg:elementOperation>\n        <msg:timesliceOperation>false</msg:timesliceOperation>\n        <m:UsagePointConfig xmlns:m="http://iec.ch/TC57/CIM-c4e#">\n          <m:UsagePoint>\n            <m:Names>\n              <m:name>61821413031</m:name>\n              <m:NameType>\n                <m:name>MeteringLocation</m:name>\n                <m:NameTypeAuthority>\n                  <m:name>SAP</m:name>\n                </m:NameTypeAuthority>\n              </m:NameType>\n            </m:Names>\n            <m:amiBillingReady>AmiBillingReady</m:amiBillingReady>\n            <m:checkBilling>false</m:checkBilling>\n            <m:isSdp>false</m:isSdp>\n            <m:isVirtual>false</m:isVirtual>\n            <m:minimalUsageExpected>false</m:minimalUsageExpected>\n            <m:readCycle>ReadCycle</m:readCycle>\n            <m:readRoute>ReadRoute</m:readRoute>\n            <m:ConfigurationEvents>\n              <m:effectiveDateTime>2021-08-02T18:13:03.832Z</m:effectiveDateTime>\n            </m:ConfigurationEvents>\n            <m:UsagePointLocation>\n              <m:Names>\n                <m:name>61821413031</m:name>\n                <m:NameType>\n                  <m:name>MeteringLocation</m:name>\n                  <m:NameTypeAuthority>\n                    <m:name>SAP</m:name>\n                  </m:NameTypeAuthority>\n                </m:NameType>\n              </m:Names>\n            </m:UsagePointLocation>\n          </m:UsagePoint>\n        </m:UsagePointConfig>\n      </msg:Operation>\n      <msg:Operation>\n        <msg:operationId>3</msg:operationId>\n        <msg:noun>MeterConfig</msg:noun>\n        <msg:verb>create</msg:verb>\n        <msg:elementOperation>false</msg:elementOperation>\n        <msg:timesliceOperation>false</msg:timesliceOperation>\n        <m:MeterConfig xmlns:m="http://iec.ch/TC57/CIM-c4e#">\n          <m:Meter>\n            <m:Names>\n              <m:name>6182141303</m:name>\n              <m:NameType>\n                <m:name>MeteringLocation</m:name>\n                <m:NameTypeAuthority>\n                  <m:name>SAP</m:name>\n                </m:NameTypeAuthority>\n              </m:NameType>\n            </m:Names>\n            <m:amrSystem>METER_AMR_SYSTEM</m:amrSystem>\n            <m:isVirtual>false</m:isVirtual>\n            <m:serialNumber>9236912</m:serialNumber>\n            <m:timeZone>Europe/Berlin</m:timeZone>\n            <m:timeZoneOffset>120</m:timeZoneOffset>\n            <m:ConfigurationEvents>\n              <m:effectiveDateTime>2021-08-02T18:13:03.832Z</m:effectiveDateTime>\n            </m:ConfigurationEvents>\n            <m:SimpleEndDeviceFunction ref="6e0433f0-c27e-40be-86ac-7904eca1b86c"/>\n            <m:EndDeviceInfo>\n              <m:AssetModel>\n                <m:modelNumber>model</m:modelNumber>\n                <m:Manufacturer>\n                  <m:name>device manufacturer</m:name>\n                </m:Manufacturer>\n              </m:AssetModel>\n            </m:EndDeviceInfo>\n            <m:lifecycle>\n              <m:installationDate>2020-01-01</m:installationDate>\n            </m:lifecycle>\n          </m:Meter>\n          <m:ReadingType>\n            <m:Names>\n              <m:name>0.26.0.1.1.1.12.0.0.0.0.1.0.1.224.3.72.0</m:name>\n              <m:NameType>\n                <m:name>MeteringTask</m:name>\n                <m:NameTypeAuthority>\n                  <m:name>SAP</m:name>\n                </m:NameTypeAuthority>\n              </m:NameType>\n            </m:Names>\n          </m:ReadingType>\n          <m:ReadingType>\n            <m:Names>\n              <m:name>0.26.0.1.1.1.12.0.0.0.0.2.0.1.224.3.72.0</m:name>\n              <m:NameType>\n                <m:name>MeteringTask</m:name>\n                <m:NameTypeAuthority>\n                  <m:name>SAP</m:name>\n                </m:NameTypeAuthority>\n              </m:NameType>\n            </m:Names>\n          </m:ReadingType>\n          <m:SimpleEndDeviceFunction>\n            <m:mRID>6e0433f0-c27e-40be-86ac-7904eca1b86c</m:mRID>\n            <m:enabled>true</m:enabled>\n            <m:Registers>\n              <m:isVirtual>true</m:isVirtual>\n              <m:leftDigitCount>9</m:leftDigitCount>\n              <m:rightDigitCount>3</m:rightDigitCount>\n              <m:Channels>\n                <m:identificationSystemCode>1-1:1.8.1</m:identificationSystemCode>\n                <m:measurementTask>measurementTask</m:measurementTask>\n                <m:slpProfileID>6e0433f0-c27e-40be-86ac-7904eca1b86c</m:slpProfileID>\n                <m:veeCode>veeCode</m:veeCode>\n                <m:ReadingType ref="0.26.0.1.1.1.12.0.0.0.0.1.0.1.224.3.72.0"/>\n              </m:Channels>\n              <m:Channels>\n                <m:identificationSystemCode>1-1:1.8.2</m:identificationSystemCode>\n                <m:measurementTask>measurementTask</m:measurementTask>\n                <m:slpProfileID>d2c6d968-2037-46d5-9c80-10c2fa319511</m:slpProfileID>\n                <m:veeCode>veeCode</m:veeCode>\n                <m:ReadingType ref="0.26.0.1.1.1.12.0.0.0.0.2.0.1.224.3.72.0"/>\n              </m:Channels>\n              <m:RegisterMultiplier>\n                <m:kind>kR</m:kind>\n                <m:value>1</m:value>\n              </m:RegisterMultiplier>\n            </m:Registers>\n          </m:SimpleEndDeviceFunction>\n        </m:MeterConfig>\n      </msg:Operation>\n      <msg:Operation>\n        <msg:operationId>4</msg:operationId>\n        <msg:noun>MasterDataLinkageConfig</msg:noun>\n        <msg:verb>create</msg:verb>\n        <msg:elementOperation>false</msg:elementOperation>\n        <msg:timesliceOperation>false</msg:timesliceOperation>\n        <m:MasterDataLinkageConfig xmlns:m="http://iec.ch/TC57/CIM-c4e#">\n          <m:ConfigurationEvent>\n            <m:effectiveDateTime>2021-08-02T18:13:03.832Z</m:effectiveDateTime>\n          </m:ConfigurationEvent>\n          <m:Meter>\n            <m:Names>\n              <m:name>6182141303</m:name>\n              <m:NameType>\n                <m:name>MeteringLocation</m:name>\n                <m:NameTypeAuthority>\n                  <m:name>SAP</m:name>\n                </m:NameTypeAuthority>\n              </m:NameType>\n            </m:Names>\n          </m:Meter>\n          <m:UsagePoint>\n            <m:Names>\n              <m:name>61821413031</m:name>\n              <m:NameType>\n                <m:name>MeteringLocation</m:name>\n                <m:NameTypeAuthority>\n                  <m:name>SAP</m:name>\n                </m:NameTypeAuthority>\n              </m:NameType>\n            </m:Names>\n          </m:UsagePoint>\n        </m:MasterDataLinkageConfig>\n      </msg:Operation>\n    </msg:OperationSet>\n  </msg:Payload>\n</msg:RequestMessage>';

const TMDObj = {
    Header: {
        Verb: 'execute',
        Noun: 'OperationSet',
    },
    Payload: {
        OperationSet: {
            enforceTransactionalIntegrity: 'true',
            Operation: [
                {
                    operationId: '1',
                    noun: 'UsagePointLocationConfig',
                    verb: 'create',
                    elementOperation: 'false',
                    timesliceOperation: 'false',
                    UsagePointLocationConfig: {
                        UsagePointLocation: {
                            Names: {
                                name: '61821413031',
                                NameType: {
                                    name: 'MeteringLocation',
                                    NameTypeAuthority: {
                                        name: 'SAP',
                                    },
                                },
                            },
                            ConfigurationEvents: {
                                effectiveDateTime: '2021-08-02T18:13:03.832Z',
                            },
                            mainAddress: {
                                streetDetail: {
                                    name: 'Bergstraße',
                                    number: '12',
                                },
                                townDetail: {
                                    code: '12345',
                                    country: 'Deutschland',
                                    name: 'Heidelberg',
                                },
                            },
                        },
                    },
                },
                {
                    operationId: '2',
                    noun: 'UsagePointConfig',
                    verb: 'create',
                    elementOperation: 'false',
                    timesliceOperation: 'false',
                    UsagePointConfig: {
                        UsagePoint: {
                            Names: {
                                name: '61821413031',
                                NameType: {
                                    name: 'MeteringLocation',
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
                                effectiveDateTime: '2021-08-02T18:13:03.832Z',
                            },
                            UsagePointLocation: {
                                Names: {
                                    name: '61821413031',
                                    NameType: {
                                        name: 'MeteringLocation',
                                        NameTypeAuthority: {
                                            name: 'SAP',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    operationId: '3',
                    noun: 'MeterConfig',
                    verb: 'create',
                    elementOperation: 'false',
                    timesliceOperation: 'false',
                    MeterConfig: {
                        Meter: {
                            Names: {
                                name: '6182141303',
                                NameType: {
                                    name: 'MeteringLocation',
                                    NameTypeAuthority: {
                                        name: 'SAP',
                                    },
                                },
                            },
                            amrSystem: 'METER_AMR_SYSTEM',
                            isVirtual: 'false',
                            serialNumber: '9236912',
                            timeZone: 'Europe/Berlin',
                            timeZoneOffset: '120',
                            ConfigurationEvents: {
                                effectiveDateTime: '2021-08-02T18:13:03.832Z',
                            },
                            SimpleEndDeviceFunction:
                                '6e0433f0-c27e-40be-86ac-7904eca1b86c',
                            EndDeviceInfo: {
                                AssetModel: {
                                    modelNumber: 'model',
                                    Manufacturer: {
                                        name: 'device manufacturer',
                                    },
                                },
                            },
                            lifecycle: {
                                installationDate: '2020-01-01',
                            },
                        },
                        ReadingType: [
                            {
                                Names: {
                                    name: '0.26.0.1.1.1.12.0.0.0.0.1.0.1.224.3.72.0',
                                    NameType: {
                                        name: 'MeteringTask',
                                        NameTypeAuthority: {
                                            name: 'SAP',
                                        },
                                    },
                                },
                            },
                            {
                                Names: {
                                    name: '0.26.0.1.1.1.12.0.0.0.0.2.0.1.224.3.72.0',
                                    NameType: {
                                        name: 'MeteringTask',
                                        NameTypeAuthority: {
                                            name: 'SAP',
                                        },
                                    },
                                },
                            },
                        ],
                        SimpleEndDeviceFunction: {
                            mRID: '6e0433f0-c27e-40be-86ac-7904eca1b86c',
                            enabled: 'true',
                            Registers: {
                                isVirtual: 'true',
                                leftDigitCount: '9',
                                rightDigitCount: '3',
                                Channels: [
                                    {
                                        identificationSystemCode: '1-1:1.8.1',
                                        measurementTask: 'measurementTask',
                                        slpProfileID:
                                            '6e0433f0-c27e-40be-86ac-7904eca1b86c',
                                        veeCode: 'veeCode',
                                        ReadingType:
                                            '0.26.0.1.1.1.12.0.0.0.0.1.0.1.224.3.72.0',
                                    },
                                    {
                                        identificationSystemCode: '1-1:1.8.2',
                                        measurementTask: 'measurementTask',
                                        slpProfileID:
                                            'd2c6d968-2037-46d5-9c80-10c2fa319511',
                                        veeCode: 'veeCode',
                                        ReadingType:
                                            '0.26.0.1.1.1.12.0.0.0.0.2.0.1.224.3.72.0',
                                    },
                                ],
                                RegisterMultiplier: {
                                    kind: 'kR',
                                    value: '1',
                                },
                            },
                        },
                    },
                },
                {
                    operationId: '4',
                    noun: 'MasterDataLinkageConfig',
                    verb: 'create',
                    elementOperation: 'false',
                    timesliceOperation: 'false',
                    MasterDataLinkageConfig: {
                        ConfigurationEvent: {
                            effectiveDateTime: '2021-08-02T18:13:03.832Z',
                        },
                        Meter: {
                            Names: {
                                name: '6182141303',
                                NameType: {
                                    name: 'MeteringLocation',
                                    NameTypeAuthority: {
                                        name: 'SAP',
                                    },
                                },
                            },
                        },
                        UsagePoint: {
                            Names: {
                                name: '61821413031',
                                NameType: {
                                    name: 'MeteringLocation',
                                    NameTypeAuthority: {
                                        name: 'SAP',
                                    },
                                },
                            },
                        },
                    },
                },
            ],
        },
    },
};

module.exports = { TMDXml, TMDObj };
