const cds = require('@sap/cds');
const { expect, launchServer, req, mockServerConf } = require('../lib/testkit');
const { rest } = require('msw');
const {
    setTestDestination,
    unmockTestDestination,
} = require('@sap-cloud-sdk/test-util');
const { setupServer } = require('msw/node');
const jestExpect = require('expect');
const slpProfilesResponse = require('./payload/C4E_SLPProfiles');

const technicalMasterData =
    '<?xml version="1.0" encoding="UTF-8"?><msg:ResponseMessage xmlns:msg="http://iec.ch/TC57/2011/schema/message" xmlns:m="http://iec.ch/TC57/CIM-c4e#"><msg:Header><msg:Verb>reply</msg:Verb><msg:Noun>OperationSet</msg:Noun><msg:Timestamp>2021-07-20T20:16:37.482Z</msg:Timestamp><msg:MessageID>f6eb70e7-28ea-48a5-9641-f78330ed9193</msg:MessageID></msg:Header><msg:Reply><msg:Result>OK</msg:Result><msg:Error><msg:code>0.0</msg:code><msg:reason>Success</msg:reason></msg:Error></msg:Reply><msg:Payload/></msg:ResponseMessage>';
const TMDErrorResponse =
    '<?xml version="1.0" encoding="UTF-8"?><msg:ResponseMessage xmlns:msg="http://iec.ch/TC57/2011/schema/message" xmlns:m="http://iec.ch/TC57/CIM-c4e#"><msg:Header><msg:Verb>reply</msg:Verb><msg:Timestamp>2021-09-29T05:01:19.35Z</msg:Timestamp><msg:MessageID>f2b246a0-287f-42e5-9140-1ad3c323386c</msg:MessageID></msg:Header><msg:Reply><msg:Result>FAILED</msg:Result><msg:Error><msg:code>2.32</msg:code><msg:reason>Invalid UsagePointLocation</msg:reason><msg:details>Name 654321/MeteringLocation/SAP for an object of type “UsagePointLocation” is already in use.</msg:details></msg:Error></msg:Reply><msg:Payload/></msg:ResponseMessage>';

const mcmInstanceSingleReg = {
    context:
        '$metadata#MCMInstances(meteringLocations(address(country()),meteringTasks()),marketLocations(address(country())),actors(),leadingAddress(country()),changeProcesses(processType(),processData()),measurementModel(),status(errors()))/$entity',
    metadataEtag:
        'W/"3bedc089f3722984de87d0284d56d97a461395cd51d1fe227f3bbd8ff9dad08c"',
    id: '1603d76e-325d-4977-b8e0-30b962dc76ec',
    idText: 'INST-11',
    description: 'Instanz-Neuanlage vom DSO im Rahmen des PoC',
    leadingGrid_code: 'SNE956610053427',
    division_code: 'EL',
    orderer_code: '9903692562385',
    leadingAddress_id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
    measurementModel_id: 'ffffffff-2222-2222-2222-100000000001',
    measurementClass_id: 'a1a00005-5555-5555-5555-100000000005',
    overallStatus_code: 'NEW',
    status_id: '97c71de9-de4b-4b55-bc96-9d67368b62ad',
    modifiedAt: '2021-07-15T22:23:32Z',
    meteringLocations: [
        {
            id: '0e24c3cc-f760-4d35-b20b-cfd857d8e210',
            measurementConceptInstance_id:
                '1603d76e-325d-4977-b8e0-30b962dc76ec',
            idText: 'Z1',
            type_code: 'GRIDMES',
            position: 1,
            modelMeteringLocation_id: 'eea50001-5555-5555-5555-501000000001',
            meteringLocationId: '123456',
            grid_code: null,
            gridLevel_code: 'MV',
            address_id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
            lossTransformer: null,
            lossLine: null,
            lossFactor: null,
            meteringLocationPurpose_code: null,
            disconnectable: false,
            transformerRequired: false,
            address: {
                id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
                measurementConceptInstance_id:
                    '1603d76e-325d-4977-b8e0-30b962dc76ec',
                country_code: 'DE',
                cityID: 'WALLDORF',
                cityName: 'Walldorf',
                postalCode: '69190',
                streetID: 'RINGSTRASSE',
                streetName: 'Ringstrasse',
                houseNumber: '100',
                floorNumber: '5',
                supplement: '5.Stock App 67',
                country: {
                    name: 'Deutschland',
                    descr: 'Bundesrepublik Deutschland',
                    code: 'DE',
                },
            },
            meteringTasks: [
                {
                    id: '38593ba0-8fe6-429e-bd4f-9e25037d317d',
                    meteringLocation_id: '0e24c3cc-f760-4d35-b20b-cfd857d8e210',
                    direction_code: 'OUT',
                    type_code: 'WAAUS',
                    position: null,
                    modelMeteringTasks_id:
                        'bbb50001-5555-5555-5555-501010000001',
                    plannedMeteringProcedure_code: 'SLP',
                    plannedOBIS_code: '1.8.x',
                    plannedRegisterCode: null,
                    OBIS_code: null,
                    registerCode: '1-1:1.8.0',
                },
            ],
        },
    ],
    marketLocations: [
        {
            id: 'ab41671e-6635-4c01-bd35-df56f63fc3f6',
            measurementConceptInstance_id:
                '1603d76e-325d-4977-b8e0-30b962dc76ec',
            idText: 'M VB1',
            type_code: 'SUPPLY',
            direction_code: 'IN',
            position: null,
            modelMarketLocation_id: 'aaaaaaaa-2222-3333-1111-100000000001',
            marketLocationId: null,
            virtualMarketLocation: false,
            address_id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
            billingProcedure_code: 'SLP',
            settlementProcedure_code: 'RLM',
            plannedOBIS_code: '1-1:1.9.0',
            OBIS_code: null,
            calculationRules: [
                {
                    id: 'b985438c-215e-410d-afde-944b98fe2309',
                    marketLocation_id: 'ab41671e-6635-4c01-bd35-df56f63fc3f6',
                    meteringProcedure_code: 'SLP',
                    modelCalculationRule_id:
                        'ffff1111-2222-3333-1111-100000000001',
                    expression: 'Z1B',
                    plannedRegisterCode: '1.8.x',
                    registerCode: '1-1:1.9.0',
                    position: null,
                    steps: [
                        {
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            step: 0,
                            type: 'var',
                            value: 'Z1.OUT',
                            ref1: null,
                            ref2: null,
                            meteringTask_id:
                                '23db1869-3883-4d92-af6d-afeae4c49533',
                        },
                    ],
                    usages: [
                        {
                            id: 'be7f577f-76ab-4b69-b2f6-c56917297c54',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'GRIDUSE',
                            position: 1,
                        },
                        {
                            id: '50c4fe8a-1ad0-458b-a9d8-88aa1699d193',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'SETTLE',
                            position: 3,
                        },
                        {
                            id: 'f889bb31-4998-4e7e-8ec3-cd2cb2d713be',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'OUBILL',
                            position: 4,
                        },
                    ],
                },
            ],
            address: {
                id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
                measurementConceptInstance_id:
                    '1603d76e-325d-4977-b8e0-30b962dc76ec',
                country_code: 'DE',
                cityID: 'WALLDORF',
                cityName: 'Walldorf',
                postalCode: '69190',
                streetID: 'RINGSTRASSE',
                streetName: 'Ringstrasse',
                houseNumber: '100',
                floorNumber: '5',
                supplement: '5.Stock App 67',
                country: {
                    name: 'Deutschland',
                    descr: 'Bundesrepublik Deutschland',
                    code: 'DE',
                },
            },
        },
    ],
    actors: [
        {
            id: '2dce4ba4-c60e-43a6-bdc7-3def77083f7e',
            measurementConceptInstance_id:
                '1603d76e-325d-4977-b8e0-30b962dc76ec',
            idText: 'VB',
            type_code: 'CONSUMER',
            direction_code: 'OUT',
            position: 1,
            modelActor_id: 'aaa50001-5555-5555-5555-502000000001',
            energySource_code: null,
            powerRange_code: 'LESS10KW',
            marketLocation_id: null,
            gridLevel_code: null,
            isOwnConsumption: null,
        },
        {
            id: '63d30a0e-589d-4707-bfa1-05edc6bf22bf',
            measurementConceptInstance_id:
                '1603d76e-325d-4977-b8e0-30b962dc76ec',
            idText: 'N1',
            type_code: 'GRID',
            direction_code: 'OUT',
            position: 2,
            modelActor_id: 'aaa50002-5555-5555-5555-502000000002',
            energySource_code: null,
            powerRange_code: null,
            marketLocation_id: null,
            gridLevel_code: null,
            isOwnConsumption: null,
        },
    ],
    leadingAddress: {
        id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
        measurementConceptInstance_id: '1603d76e-325d-4977-b8e0-30b962dc76ec',
        country_code: 'DE',
        cityID: 'WALLDORF',
        cityName: 'Walldorf',
        postalCode: '69190',
        streetID: 'RINGSTRASSE',
        streetName: 'Ringstrasse',
        houseNumber: '100',
        floorNumber: '5',
        supplement: '5.Stock App 67',
        country: {
            name: 'Deutschland',
            descr: 'Bundesrepublik Deutschland',
            code: 'DE',
        },
    },
    changeProcesses: [
        {
            id: 'a3b5bf2f-37e3-4d1c-81ce-a05795b3224d',
            measurementConceptInstance_id:
                '1603d76e-325d-4977-b8e0-30b962dc76ec',
            externalOrderId: '4711',
            externalProcessId: null,
            processType_code: 'CREATE',
            status_id: null,
            finished: false,
            modifiedAt: '2021-09-29T17:13:35Z',
            processData: {
                id: '9732cbf4-c8a5-4024-af29-514c04f9d589',
                changeProcess_id: 'a3b5bf2f-37e3-4d1c-81ce-a05795b3224d',
                customerRequestDate: '2021-12-24',
                subscriberId: '0815',
                leadingConnectionUser: '0815',
                leadingConnectionOwner: '0815',
                note: 'Place any note for the new instance here',
                initialDataEntryDone: true,
                masterDataReady: true,
                meteringLocationsPD: [
                    {
                        id: '9f8d7204-743f-4b12-bf8c-d0f1e2863ce5',
                        measurementConceptInstancePD_id:
                            '1603d76e-325d-4977-b8e0-30b962dc76ec',
                        meteringLocation_id:
                            'adf30ccb-e645-48f9-89f4-2285f3464299',
                        position: 1,
                        plannedMeteringLocationId: null,
                        deviceLocationSupplement: null,
                        installationDate: '2021-09-29',
                        meterOperator: '9903692607804',
                        note: 'Any note on this metering location',
                        classification: 'ANY',
                        measuringType_code: 'MMU',
                        volumeCorrector: false,
                        nominalCapacity: 42,
                        locationInstalled: true,
                        locationComplete: true,
                        masterDataReady: true,
                        meteringTasksPD: [
                            {
                                id: 'f0751646-c76a-49b0-a8e3-cfe114ba3c8a',
                                meteringLocationPD_id:
                                    '9f8d7204-743f-4b12-bf8c-d0f1e2863ce5',
                                meteringTask_id:
                                    '31a5d5bd-8d6c-4716-87cd-395e25ac9631',
                                position: 1,
                                rate_code: 'ET',
                                periodConsumption: 789,
                            },
                        ],
                    },
                ],
                marketLocationsPD: [
                    {
                        id: '8bc79155-a967-4dab-8c39-939760d1dba4',
                        measurementConceptInstancePD_id:
                            '1603d76e-325d-4977-b8e0-30b962dc76ec',
                        marketLocation_id:
                            'b5cb0482-03e3-40d2-95c8-895373026685',
                        position: null,
                        connectionUser: '0815',
                        connectionOwner: '0815',
                        forecastBasis_code: 'H0',
                        consumptionDistribution: 'some',
                        flatrateType_code: 'CODE',
                        flatrate: 'some',
                        classification: 'ANY',
                        locationInstalled: true,
                        locationComplete: true,
                        masterDataReady: true,
                    },
                ],
                actorsPD: [
                    {
                        id: '7e64648e-559a-4826-aca1-cefcacf24b92',
                        measurementConceptInstancePD_id:
                            '1603d76e-325d-4977-b8e0-30b962dc76ec',
                        actor_id: 'ea6dd325-5cc1-463b-ba67-f7a90a94122a',
                        position: 1,
                        installedPower: null,
                        inverterPower: null,
                    },
                    {
                        id: 'd667cc68-0f67-41f1-bdaa-63cb61b770be',
                        measurementConceptInstancePD_id:
                            '1603d76e-325d-4977-b8e0-30b962dc76ec',
                        actor_id: '29677d4b-ff5a-42cf-bf0a-b92002911ab5',
                        position: 2,
                        installedPower: null,
                        inverterPower: null,
                    },
                ],
            },
        },
    ],
    measurementModel: {
        id: 'ffffffff-2222-2222-2222-100000000001',
        idText: 'B_S_M1',
        name: 'Standard Bezug Strom',
        description: 'Standard Bezug Strom',
        conceptType_code: 'MODEL',
        measurementClass_id: 'a1a00005-5555-5555-5555-100000000005',
        status_code: 'ACTIVE',
        validFrom: '2000-01-01',
        validTo: '9999-12-31',
        division_code: 'EL',
        loadProfilesOut: null,
    },
    status: {
        id: '97c71de9-de4b-4b55-bc96-9d67368b62ad',
        changeProcess_id: 'a3b5bf2f-37e3-4d1c-81ce-a05795b3224d',
        instanceStatus_code: 'NEW',
        processStatus_code: 'START_NEW',
        errors: [],
    },
};

const mcmInstanceDoubleReg = {
    context:
        '$metadata#MCMInstances(meteringLocations(address(country()),meteringTasks()),marketLocations(address(country())),actors(),leadingAddress(country()),changeProcesses(processType(),processData()),measurementModel(),status(errors()))/$entity',
    metadataEtag:
        'W/"3bedc089f3722984de87d0284d56d97a461395cd51d1fe227f3bbd8ff9dad08c"',
    id: '1603d76e-325d-4977-b8e0-30b962dc76df',
    idText: 'INST-11',
    description: 'Instanz-Neuanlage vom DSO im Rahmen des PoC',
    leadingGrid_code: 'SNE956610053427',
    division_code: 'EL',
    orderer_code: '9903692562385',
    leadingAddress_id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
    measurementModel_id: 'ffffffff-2222-2222-2222-100000000001',
    measurementClass_id: 'a1a00005-5555-5555-5555-100000000005',
    overallStatus_code: 'NEW',
    status_id: '97c71de9-de4b-4b55-bc96-9d67368b62ad',
    modifiedAt: '2021-07-15T22:23:32Z',
    meteringLocations: [
        {
            id: '0e24c3cc-f760-4d35-b20b-cfd857d8e210',
            measurementConceptInstance_id:
                '1603d76e-325d-4977-b8e0-30b962dc76df',
            idText: 'Z1',
            type_code: 'GRIDMES',
            position: 1,
            modelMeteringLocation_id: 'eea50001-5555-5555-5555-501000000001',
            meteringLocationId: '123456',
            grid_code: null,
            gridLevel_code: 'MV',
            address_id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
            lossTransformer: null,
            lossLine: null,
            lossFactor: null,
            meteringLocationPurpose_code: null,
            disconnectable: false,
            transformerRequired: false,
            address: {
                id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
                measurementConceptInstance_id:
                    '1603d76e-325d-4977-b8e0-30b962dc76df',
                country_code: 'DE',
                cityID: 'WALLDORF',
                cityName: 'Walldorf',
                postalCode: '69190',
                streetID: 'RINGSTRASSE',
                streetName: 'Ringstrasse',
                houseNumber: '100',
                floorNumber: '5',
                supplement: '5.Stock App 67',
                country: {
                    name: 'Deutschland',
                    descr: 'Bundesrepublik Deutschland',
                    code: 'DE',
                },
            },
            meteringTasks: [
                {
                    id: '38593ba0-8fe6-429e-bd4f-9e25037d317d',
                    meteringLocation_id: '0e24c3cc-f760-4d35-b20b-cfd857d8e210',
                    direction_code: 'OUT',
                    type_code: 'WAAUS',
                    position: null,
                    modelMeteringTasks_id:
                        'bbb50001-5555-5555-5555-501010000001',
                    plannedMeteringProcedure_code: 'SLP',
                    plannedOBIS_code: '1.8.x',
                    plannedRegisterCode: null,
                    OBIS_code: null,
                    registerCode: '1-1:1.8.1',
                },
                {
                    id: '38593ba0-8fe6-429e-bd4f-9e25037d317d',
                    meteringLocation_id: '0e24c3cc-f760-4d35-b20b-cfd857d8e210',
                    direction_code: 'OUT',
                    type_code: 'WAAUS',
                    position: null,
                    modelMeteringTasks_id:
                        'bbb50001-5555-5555-5555-501010000001',
                    plannedMeteringProcedure_code: 'SLP',
                    plannedOBIS_code: '1.8.x',
                    plannedRegisterCode: null,
                    OBIS_code: null,
                    registerCode: '1-1:1.8.2',
                },
            ],
        },
    ],
    marketLocations: [
        {
            id: 'ab41671e-6635-4c01-bd35-df56f63fc3f6',
            measurementConceptInstance_id:
                '1603d76e-325d-4977-b8e0-30b962dc76df',
            idText: 'M VB1',
            type_code: 'SUPPLY',
            direction_code: 'IN',
            position: null,
            modelMarketLocation_id: 'aaaaaaaa-2222-3333-1111-100000000001',
            marketLocationId: null,
            virtualMarketLocation: false,
            address_id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
            billingProcedure_code: 'SLP',
            settlementProcedure_code: 'RLM',
            plannedOBIS_code: '1-1:1.9.0',
            OBIS_code: null,
            calculationRules: [
                {
                    id: 'b985438c-215e-410d-afde-944b98fe2309',
                    marketLocation_id: 'ab41671e-6635-4c01-bd35-df56f63fc3f6',
                    meteringProcedure_code: 'SLP',
                    modelCalculationRule_id:
                        'ffff1111-2222-3333-1111-100000000001',
                    expression: 'Z1B',
                    plannedRegisterCode: '1.8.x',
                    registerCode: '1-1:1.9.1',
                    position: null,
                    steps: [
                        {
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            step: 0,
                            type: 'var',
                            value: 'Z1.OUT',
                            ref1: null,
                            ref2: null,
                            meteringTask_id:
                                '23db1869-3883-4d92-af6d-afeae4c49533',
                        },
                    ],
                    usages: [
                        {
                            id: 'be7f577f-76ab-4b69-b2f6-c56917297c54',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'GRIDUSE',
                            position: 1,
                        },
                        {
                            id: '50c4fe8a-1ad0-458b-a9d8-88aa1699d193',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'SETTLE',
                            position: 3,
                        },
                        {
                            id: 'f889bb31-4998-4e7e-8ec3-cd2cb2d713be',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'OUBILL',
                            position: 4,
                        },
                    ],
                },
                {
                    id: 'b985438c-215e-410d-afde-944b98fe2309',
                    marketLocation_id: 'ab41671e-6635-4c01-bd35-df56f63fc3f6',
                    meteringProcedure_code: 'SLP',
                    modelCalculationRule_id:
                        'ffff1111-2222-3333-1111-100000000001',
                    expression: 'Z1B',
                    plannedRegisterCode: '1.8.x',
                    registerCode: '1-1:1.9.2',
                    position: null,
                    steps: [
                        {
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            step: 0,
                            type: 'var',
                            value: 'Z1.OUT',
                            ref1: null,
                            ref2: null,
                            meteringTask_id:
                                '23db1869-3883-4d92-af6d-afeae4c49533',
                        },
                    ],
                    usages: [
                        {
                            id: 'be7f577f-76ab-4b69-b2f6-c56917297c54',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'GRIDUSE',
                            position: 1,
                        },
                        {
                            id: '50c4fe8a-1ad0-458b-a9d8-88aa1699d193',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'SETTLE',
                            position: 3,
                        },
                        {
                            id: 'f889bb31-4998-4e7e-8ec3-cd2cb2d713be',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'OUBILL',
                            position: 4,
                        },
                    ],
                },
            ],
            address: {
                id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
                measurementConceptInstance_id:
                    '1603d76e-325d-4977-b8e0-30b962dc76df',
                country_code: 'DE',
                cityID: 'WALLDORF',
                cityName: 'Walldorf',
                postalCode: '69190',
                streetID: 'RINGSTRASSE',
                streetName: 'Ringstrasse',
                houseNumber: '100',
                floorNumber: '5',
                supplement: '5.Stock App 67',
                country: {
                    name: 'Deutschland',
                    descr: 'Bundesrepublik Deutschland',
                    code: 'DE',
                },
            },
        },
    ],
    actors: [
        {
            id: '2dce4ba4-c60e-43a6-bdc7-3def77083f7e',
            measurementConceptInstance_id:
                '1603d76e-325d-4977-b8e0-30b962dc76df',
            idText: 'VB',
            type_code: 'CONSUMER',
            direction_code: 'OUT',
            position: 1,
            modelActor_id: 'aaa50001-5555-5555-5555-502000000001',
            energySource_code: null,
            powerRange_code: 'LESS10KW',
            marketLocation_id: null,
            gridLevel_code: null,
            isOwnConsumption: null,
        },
        {
            id: '63d30a0e-589d-4707-bfa1-05edc6bf22bf',
            measurementConceptInstance_id:
                '1603d76e-325d-4977-b8e0-30b962dc76df',
            idText: 'N1',
            type_code: 'GRID',
            direction_code: 'OUT',
            position: 2,
            modelActor_id: 'aaa50002-5555-5555-5555-502000000002',
            energySource_code: null,
            powerRange_code: null,
            marketLocation_id: null,
            gridLevel_code: null,
            isOwnConsumption: null,
        },
    ],
    leadingAddress: {
        id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
        measurementConceptInstance_id: '1603d76e-325d-4977-b8e0-30b962dc76df',
        country_code: 'DE',
        cityID: 'WALLDORF',
        cityName: 'Walldorf',
        postalCode: '69190',
        streetID: 'RINGSTRASSE',
        streetName: 'Ringstrasse',
        houseNumber: '100',
        floorNumber: '5',
        supplement: '5.Stock App 67',
        country: {
            name: 'Deutschland',
            descr: 'Bundesrepublik Deutschland',
            code: 'DE',
        },
    },
    changeProcesses: [
        {
            id: 'a3b5bf2f-37e3-4d1c-81ce-a05795b3224d',
            measurementConceptInstance_id:
                '1603d76e-325d-4977-b8e0-30b962dc76df',
            externalOrderId: '4711',
            externalProcessId: null,
            processType_code: 'CREATE',
            status_id: null,
            finished: false,
            modifiedAt: '2021-09-29T17:13:35Z',
            processData: {
                id: '9732cbf4-c8a5-4024-af29-514c04f9d589',
                changeProcess_id: 'a3b5bf2f-37e3-4d1c-81ce-a05795b3224d',
                customerRequestDate: '2021-12-24',
                subscriberId: '0815',
                leadingConnectionUser: '0815',
                leadingConnectionOwner: '0815',
                note: 'Place any note for the new instance here',
                initialDataEntryDone: true,
                masterDataReady: true,
                meteringLocationsPD: [
                    {
                        id: '9f8d7204-743f-4b12-bf8c-d0f1e2863ce5',
                        measurementConceptInstancePD_id:
                            '1603d76e-325d-4977-b8e0-30b962dc76df',
                        meteringLocation_id:
                            'adf30ccb-e645-48f9-89f4-2285f3464299',
                        position: 1,
                        plannedMeteringLocationId: null,
                        deviceLocationSupplement: null,
                        installationDate: '2021-09-29',
                        meterOperator: '9903692607804',
                        note: 'Any note on this metering location',
                        classification: 'ANY',
                        measuringType_code: 'MMU',
                        volumeCorrector: false,
                        nominalCapacity: 42,
                        locationInstalled: true,
                        locationComplete: true,
                        masterDataReady: true,
                        meteringTasksPD: [
                            {
                                id: 'f0751646-c76a-49b0-a8e3-cfe114ba3c8a',
                                meteringLocationPD_id:
                                    '9f8d7204-743f-4b12-bf8c-d0f1e2863ce5',
                                meteringTask_id:
                                    '31a5d5bd-8d6c-4716-87cd-395e25ac9631',
                                position: 1,
                                rate_code: 'ET',
                                periodConsumption: 789,
                            },
                        ],
                    },
                ],
                marketLocationsPD: [
                    {
                        id: '8bc79155-a967-4dab-8c39-939760d1dba4',
                        measurementConceptInstancePD_id:
                            '1603d76e-325d-4977-b8e0-30b962dc76df',
                        marketLocation_id:
                            'b5cb0482-03e3-40d2-95c8-895373026685',
                        position: null,
                        connectionUser: '0815',
                        connectionOwner: '0815',
                        forecastBasis_code: 'H0OnPeak',
                        consumptionDistribution: 'some',
                        flatrateType_code: 'CODE',
                        flatrate: 'some',
                        classification: 'ANY',
                        locationInstalled: true,
                        locationComplete: true,
                        masterDataReady: true,
                    },
                    {
                        id: '8bc79155-a967-4dab-8c39-939760d1dba4',
                        measurementConceptInstancePD_id:
                            '1603d76e-325d-4977-b8e0-30b962dc76df',
                        marketLocation_id:
                            'b5cb0482-03e3-40d2-95c8-895373026685',
                        position: null,
                        connectionUser: '0815',
                        connectionOwner: '0815',
                        forecastBasis_code: 'H0OffPeak',
                        consumptionDistribution: 'some',
                        flatrateType_code: 'CODE',
                        flatrate: 'some',
                        classification: 'ANY',
                        locationInstalled: true,
                        locationComplete: true,
                        masterDataReady: true,
                    },
                ],
                actorsPD: [
                    {
                        id: '7e64648e-559a-4826-aca1-cefcacf24b92',
                        measurementConceptInstancePD_id:
                            '1603d76e-325d-4977-b8e0-30b962dc76df',
                        actor_id: 'ea6dd325-5cc1-463b-ba67-f7a90a94122a',
                        position: 1,
                        installedPower: null,
                        inverterPower: null,
                    },
                    {
                        id: 'd667cc68-0f67-41f1-bdaa-63cb61b770be',
                        measurementConceptInstancePD_id:
                            '1603d76e-325d-4977-b8e0-30b962dc76df',
                        actor_id: '29677d4b-ff5a-42cf-bf0a-b92002911ab5',
                        position: 2,
                        installedPower: null,
                        inverterPower: null,
                    },
                ],
            },
        },
    ],
    measurementModel: {
        id: 'ffffffff-2222-2222-2222-100000000001',
        idText: 'B_S_M1',
        name: 'Standard Bezug Strom',
        description: 'Standard Bezug Strom',
        conceptType_code: 'MODEL',
        measurementClass_id: 'a1a00005-5555-5555-5555-100000000005',
        status_code: 'ACTIVE',
        validFrom: '2000-01-01',
        validTo: '9999-12-31',
        division_code: 'EL',
        loadProfilesOut: null,
    },
    status: {
        id: '97c71de9-de4b-4b55-bc96-9d67368b62ad',
        changeProcess_id: 'a3b5bf2f-37e3-4d1c-81ce-a05795b3224d',
        instanceStatus_code: 'NEW',
        processStatus_code: 'START_NEW',
        errors: [],
    },
};

const mcmInstanceInvalid = {
    context:
        '$metadata#MCMInstances(meteringLocations(address(country()),meteringTasks()),marketLocations(address(country())),actors(),leadingAddress(country()),changeProcesses(processType(),processData()),measurementModel(),status(errors()))/$entity',
    metadataEtag:
        'W/"3bedc089f3722984de87d0284d56d97a461395cd51d1fe227f3bbd8ff9dad08c"',
    id: '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
    idText: 'INST-11',
    description: 'Instanz-Neuanlage vom DSO im Rahmen des PoC',
    leadingGrid_code: 'SNE956610053427',
    division_code: 'EL',
    orderer_code: '9903692562385',
    leadingAddress_id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
    measurementModel_id: 'ffffffff-2222-2222-2222-100000000001',
    measurementClass_id: 'a1a00005-5555-5555-5555-100000000005',
    overallStatus_code: 'NEW',
    status_id: '97c71de9-de4b-4b55-bc96-9d67368b62ad',
    modifiedAt: '2021-07-15T22:23:32Z',
    meteringLocations: [
        {
            id: '0e24c3cc-f760-4d35-b20b-cfd857d8e210',
            measurementConceptInstance_id:
                '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
            idText: 'Z1',
            type_code: 'GRIDMES',
            position: 1,
            modelMeteringLocation_id: 'eea50001-5555-5555-5555-501000000001',
            meteringLocationId: '654321',
            grid_code: null,
            gridLevel_code: 'MV',
            address_id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
            lossTransformer: null,
            lossLine: null,
            lossFactor: null,
            meteringLocationPurpose_code: null,
            disconnectable: false,
            transformerRequired: false,
            address: {
                id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
                measurementConceptInstance_id:
                    '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
                country_code: 'DE',
                cityID: 'WALLDORF',
                cityName: 'Walldorf',
                postalCode: '69190',
                streetID: 'RINGSTRASSE',
                streetName: 'Ringstrasse',
                houseNumber: '100',
                floorNumber: '5',
                supplement: '5.Stock App 67',
                country: {
                    name: 'Deutschland',
                    descr: 'Bundesrepublik Deutschland',
                    code: 'DE',
                },
            },
            meteringTasks: [
                {
                    id: '38593ba0-8fe6-429e-bd4f-9e25037d317d',
                    meteringLocation_id: '0e24c3cc-f760-4d35-b20b-cfd857d8e210',
                    direction_code: 'OUT',
                    type_code: 'WAAUS',
                    position: null,
                    modelMeteringTasks_id:
                        'bbb50001-5555-5555-5555-501010000001',
                    plannedMeteringProcedure_code: 'SLP',
                    plannedOBIS_code: '1.8.x',
                    plannedRegisterCode: null,
                    OBIS_code: null,
                    registerCode: '1-1:1.8.0',
                },
            ],
        },
    ],
    marketLocations: [
        {
            id: 'ab41671e-6635-4c01-bd35-df56f63fc3f6',
            measurementConceptInstance_id:
                '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
            idText: 'M VB1',
            type_code: 'SUPPLY',
            direction_code: 'IN',
            position: null,
            modelMarketLocation_id: 'aaaaaaaa-2222-3333-1111-100000000001',
            marketLocationId: null,
            virtualMarketLocation: false,
            address_id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
            billingProcedure_code: 'SLP',
            settlementProcedure_code: 'RLM',
            plannedOBIS_code: '1-1:1.9.0',
            OBIS_code: null,
            calculationRules: [
                {
                    id: 'b985438c-215e-410d-afde-944b98fe2309',
                    marketLocation_id: 'ab41671e-6635-4c01-bd35-df56f63fc3f6',
                    meteringProcedure_code: 'SLP',
                    modelCalculationRule_id:
                        'ffff1111-2222-3333-1111-100000000001',
                    expression: 'Z1B',
                    plannedRegisterCode: '1.8.x',
                    registerCode: '1-1:1.9.0',
                    position: null,
                    steps: [
                        {
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            step: 0,
                            type: 'var',
                            value: 'Z1.OUT',
                            ref1: null,
                            ref2: null,
                            meteringTask_id:
                                '23db1869-3883-4d92-af6d-afeae4c49533',
                        },
                    ],
                    usages: [
                        {
                            id: 'be7f577f-76ab-4b69-b2f6-c56917297c54',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'GRIDUSE',
                            position: 1,
                        },
                        {
                            id: '50c4fe8a-1ad0-458b-a9d8-88aa1699d193',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'SETTLE',
                            position: 3,
                        },
                        {
                            id: 'f889bb31-4998-4e7e-8ec3-cd2cb2d713be',
                            calculationRule_id:
                                'b985438c-215e-410d-afde-944b98fe2309',
                            usage_code: 'OUBILL',
                            position: 4,
                        },
                    ],
                },
            ],
            address: {
                id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
                measurementConceptInstance_id:
                    '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
                country_code: 'DE',
                cityID: 'WALLDORF',
                cityName: 'Walldorf',
                postalCode: '69190',
                streetID: 'RINGSTRASSE',
                streetName: 'Ringstrasse',
                houseNumber: '100',
                floorNumber: '5',
                supplement: '5.Stock App 67',
                country: {
                    name: 'Deutschland',
                    descr: 'Bundesrepublik Deutschland',
                    code: 'DE',
                },
            },
        },
    ],
    actors: [
        {
            id: '2dce4ba4-c60e-43a6-bdc7-3def77083f7e',
            measurementConceptInstance_id:
                '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
            idText: 'VB',
            type_code: 'CONSUMER',
            direction_code: 'OUT',
            position: 1,
            modelActor_id: 'aaa50001-5555-5555-5555-502000000001',
            energySource_code: null,
            powerRange_code: 'LESS10KW',
            marketLocation_id: null,
            gridLevel_code: null,
            isOwnConsumption: null,
        },
        {
            id: '63d30a0e-589d-4707-bfa1-05edc6bf22bf',
            measurementConceptInstance_id:
                '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
            idText: 'N1',
            type_code: 'GRID',
            direction_code: 'OUT',
            position: 2,
            modelActor_id: 'aaa50002-5555-5555-5555-502000000002',
            energySource_code: null,
            powerRange_code: null,
            marketLocation_id: null,
            gridLevel_code: null,
            isOwnConsumption: null,
        },
    ],
    leadingAddress: {
        id: '71213f70-4472-4b5a-ad57-b1d7b1bc716e',
        measurementConceptInstance_id: '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
        country_code: 'DE',
        cityID: 'WALLDORF',
        cityName: 'Walldorf',
        postalCode: '69190',
        streetID: 'RINGSTRASSE',
        streetName: 'Ringstrasse',
        houseNumber: '100',
        floorNumber: '5',
        supplement: '5.Stock App 67',
        country: {
            name: 'Deutschland',
            descr: 'Bundesrepublik Deutschland',
            code: 'DE',
        },
    },
    changeProcesses: [
        {
            id: 'a3b5bf2f-37e3-4d1c-81ce-a05795b3224d',
            measurementConceptInstance_id:
                '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
            externalOrderId: '4711',
            externalProcessId: null,
            processType_code: 'CREATE',
            status_id: null,
            finished: false,
            modifiedAt: '2021-09-29T17:13:35Z',
            processData: {
                id: '9732cbf4-c8a5-4024-af29-514c04f9d589',
                changeProcess_id: 'a3b5bf2f-37e3-4d1c-81ce-a05795b3224d',
                customerRequestDate: '2021-12-24',
                subscriberId: '0815',
                leadingConnectionUser: '0815',
                leadingConnectionOwner: '0815',
                note: 'Place any note for the new instance here',
                initialDataEntryDone: true,
                masterDataReady: true,
                meteringLocationsPD: [
                    {
                        id: '9f8d7204-743f-4b12-bf8c-d0f1e2863ce5',
                        measurementConceptInstancePD_id:
                            '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
                        meteringLocation_id:
                            'adf30ccb-e645-48f9-89f4-2285f3464299',
                        position: 1,
                        plannedMeteringLocationId: null,
                        deviceLocationSupplement: null,
                        installationDate: '2021-09-29',
                        meterOperator: '9903692607804',
                        note: 'Any note on this metering location',
                        classification: 'ANY',
                        measuringType_code: 'MMU',
                        volumeCorrector: false,
                        nominalCapacity: 42,
                        locationInstalled: true,
                        locationComplete: true,
                        masterDataReady: true,
                        meteringTasksPD: [
                            {
                                id: 'f0751646-c76a-49b0-a8e3-cfe114ba3c8a',
                                meteringLocationPD_id:
                                    '9f8d7204-743f-4b12-bf8c-d0f1e2863ce5',
                                meteringTask_id:
                                    '31a5d5bd-8d6c-4716-87cd-395e25ac9631',
                                position: 1,
                                rate_code: 'ET',
                                periodConsumption: 789,
                            },
                        ],
                    },
                ],
                marketLocationsPD: [
                    {
                        id: '8bc79155-a967-4dab-8c39-939760d1dba4',
                        measurementConceptInstancePD_id:
                            '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
                        marketLocation_id:
                            'b5cb0482-03e3-40d2-95c8-895373026685',
                        position: null,
                        connectionUser: '0815',
                        connectionOwner: '0815',
                        forecastBasis_code: 'H0',
                        consumptionDistribution: 'some',
                        flatrateType_code: 'CODE',
                        flatrate: 'some',
                        classification: 'ANY',
                        locationInstalled: true,
                        locationComplete: true,
                        masterDataReady: true,
                    },
                ],
                actorsPD: [
                    {
                        id: '7e64648e-559a-4826-aca1-cefcacf24b92',
                        measurementConceptInstancePD_id:
                            '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
                        actor_id: 'ea6dd325-5cc1-463b-ba67-f7a90a94122a',
                        position: 1,
                        installedPower: null,
                        inverterPower: null,
                    },
                    {
                        id: 'd667cc68-0f67-41f1-bdaa-63cb61b770be',
                        measurementConceptInstancePD_id:
                            '29d58d77-78e9-4d66-8f21-45ccbd94f1d4',
                        actor_id: '29677d4b-ff5a-42cf-bf0a-b92002911ab5',
                        position: 2,
                        installedPower: null,
                        inverterPower: null,
                    },
                ],
            },
        },
    ],
    measurementModel: {
        id: 'ffffffff-2222-2222-2222-100000000001',
        idText: 'B_S_M1',
        name: 'Standard Bezug Strom',
        description: 'Standard Bezug Strom',
        conceptType_code: 'MODEL',
        measurementClass_id: 'a1a00005-5555-5555-5555-100000000005',
        status_code: 'ACTIVE',
        validFrom: '2000-01-01',
        validTo: '9999-12-31',
        division_code: 'EL',
        loadProfilesOut: null,
    },
    status: {
        id: '97c71de9-de4b-4b55-bc96-9d67368b62ad',
        changeProcess_id: 'a3b5bf2f-37e3-4d1c-81ce-a05795b3224d',
        instanceStatus_code: 'NEW',
        processStatus_code: 'START_NEW',
        errors: [],
    },
};

const mcmInstanceIdSingleReg = '1603d76e-325d-4977-b8e0-30b962dc76ec';
const mcmInstanceIdDoubleReg = '1603d76e-325d-4977-b8e0-30b962dc76df';
const mcmInstanceIdInvalid = '29d58d77-78e9-4d66-8f21-45ccbd94f1d4';
const mcmInstanceIdInvalid2 = '29d58d77-78e9-4d66-8f21-45ccbd94f1d5';

describe('TechnicalMasterDataService it-test UTILITIESCLOUDSOLUTION-2693', () => {
    const { POST, admin } = launchServer({
        service: {
            paths: ['srv/api/technicalmasterdata', 'srv/api'],
        },
    });

    let entities = [];

    const mockServer = setupServer(
        rest.post(
            `https://eds.cloudforenergy-rc.cfapps.eu20.hana.ondemand.com/api/v1/core`,
            (req, res, ctx) => {
                console.log('Test Search', req.body.search('123456'));
                if (req.body.search('123456') > 1) {
                    return res(ctx.status(200), ctx.json(technicalMasterData));
                } else {
                    return res(ctx.status(200), ctx.json(TMDErrorResponse));
                }
            }
        ),
        rest.get(
            'https://srv-edom-mcm-dev.cfapps.eu10.hana.ondemand.com/*',
            (req, res, ctx) => {
                if (
                    req.url.pathname ===
                    '/odata/v4/api/mcm/v1/MCMInstances(1603d76e-325d-4977-b8e0-30b962dc76ec)'
                ) {
                    return res(ctx.status(200), ctx.json(mcmInstanceSingleReg));
                } else if (
                    req.url.pathname ===
                    '/odata/v4/api/mcm/v1/MCMInstances(1603d76e-325d-4977-b8e0-30b962dc76df)'
                ) {
                    return res(ctx.status(200), ctx.json(mcmInstanceDoubleReg));
                } else if (
                    req.url.pathname ===
                    '/odata/v4/api/mcm/v1/MCMInstances(29d58d77-78e9-4d66-8f21-45ccbd94f1d4)'
                ) {
                    return res(ctx.status(200), ctx.json(mcmInstanceInvalid));
                }
            }
        ),
        rest.get(
            'https://slp.cloudforenergy-rc.cfapps.eu20.hana.ondemand.com/*',
            (_, res, ctx) => {
                return res(ctx.status(200), ctx.json(slpProfilesResponse));
            }
        )
    );

    beforeAll(() => {
        mockServer.listen(mockServerConf);
    });
    afterAll(() => {
        mockServer.close();
    });
    afterEach(() => {
        mockServer.resetHandlers();
        jest.clearAllMocks();
    });

    before(async () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('API_EDOM_RETAILER')
        ).filter(
            (value) => !value['@cds.autoexposed'] && !value.elements['up_']
        );

        Array.from(serviceEntities).forEach((element) => {
            const { name } = element;
            entities.push(name.substring(name.indexOf('.') + 1, name.length));
        });
    });

    setTestDestination({
        name: 'c4e-dest',
        url: 'https://eds.cloudforenergy-rc.cfapps.eu20.hana.ondemand.com',
    });
    setTestDestination({
        name: 'mcm-dest',
        url: 'https://srv-edom-mcm-dev.cfapps.eu10.hana.ondemand.com',
    });
    setTestDestination({
        name: 'c4e-slp-dest',
        url: 'https://slp.cloudforenergy-rc.cfapps.eu20.hana.ondemand.com',
    });
    it('should create a single register technical master data and return 200', async () => {
        let TMDResp = '';
        try {
            TMDResp = await POST(
                '/api/internal/technicalmasterdata/generate',
                {
                    id: mcmInstanceIdSingleReg,
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(TMDResp.status).to.equal(200);
    });

    it('should fail to create Technical Master Data and return error data already used', async () => {
        let TMDResp = '';
        let errorMsg = '';
        try {
            TMDResp = await POST(
                '/api/internal/technicalmasterdata/generate',
                {
                    id: mcmInstanceIdInvalid,
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            errorMsg = error.message;
        }
        expect(errorMsg).not.equal(null);
    });

    it('should fail in get MCM Instance and return error', async () => {
        let TMDResp = '';
        try {
            TMDResp = await POST(
                '/api/internal/technicalmasterdata/generate',
                {
                    id: mcmInstanceIdInvalid2,
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(TMDResp.data.isSuccess).to.equal(false);
    });

    it('should create a double register technical master data and return 200', async () => {
        let TMDResp = '';
        try {
            TMDResp = await POST(
                '/api/internal/technicalmasterdata/generate',
                {
                    id: mcmInstanceIdDoubleReg,
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(TMDResp.status).to.equal(200);
    });

    it('should receive message VIA EM', async () => {
        const technicalMasterDataMessaging = await cds.connect.to(
            'technicalMasterDataMessaging'
        );

        const {
            event,
            data: baseData,
            headers,
            msg,
        } = require('./payload/EM_sap_c4u_mcm_ce_sap_c4u_mcm_mcminstance_created_v1.json');

        const data = JSON.parse(JSON.stringify(baseData));

        msg.req.authInfo.getAppToken = () => {
            return '123456789';
        };
        msg.req.user = {
            id: admin,
            is: () => true,
        };
        msg.req.error = () => {};

        let tx = technicalMasterDataMessaging.transaction(msg);
        const spyTMDMessaging = jest.spyOn(tx, 'emit');
        await tx.emit(event, data, headers);

        jestExpect(spyTMDMessaging).toBeCalledTimes(1);
    });

    it('should return status 401 Unauthorized', async () => {
        let TMDRespNoAuth = '';
        let errorMsg = '';
        try {
            TMDRespNoAuth = await POST(
                '/api/internal/technicalmasterdata/generate',
                {
                    id: mcmInstanceIdSingleReg,
                },
                {
                    auth: '',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            errorMsg = error.message;
        }
        expect(errorMsg).to.contain('401');
    });

    // ****PLEASE READ BELOW CAREFULLY ******
    // NOTE: BELOW TEST CASES CHANGE DESTINATION MOCKING, SO PLEASE ADD YOUR SUCCESSFUL TEST CASES BEFORE THESE CASES

    it('should return error for missing c4e-dest destination', async () => {
        unmockTestDestination('c4e-dest');
        let TMDResp = '';
        try {
            TMDResp = await POST(
                '/api/internal/technicalmasterdata/generate',
                {
                    id: mcmInstanceIdSingleReg,
                },
                {
                    auth: admin,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.dir(error.message);
        }
        expect(TMDResp.data.isSuccess).to.equal(false);
    });
});
