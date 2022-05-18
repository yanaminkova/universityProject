const cds = require('@sap/cds');
const { expect, launchServer, req, mockServerConf } = require('../lib/testkit');
const { rest } = require('msw');
const functions = require('../lib/functions');
const {
    setTestDestination,
    unmockAllTestDestinations,
} = require('@sap-cloud-sdk/test-util');
const { setupServer } = require('msw/node');
const bpValidationMock = require('./payload/BusinessPartnerValidationMockPayloads');
const {
    commonSetupConfigCodes,
    bpSetupConfigCodes,
} = require('./payload/BusinessPartnerSetupRequiredCodes');
const { transformReturnValueForEdmType } = require('@sap-cloud-sdk/core');
const jestExpect = require('expect');
const { or } = require('@sap-cloud-sdk/core');
const DistributionFunctions = require('../../srv/api/distribution/DistributionFunctions');
jest.mock('../../srv/external/API_BP_KEY_MAPPINGBeta');
// API Declaration
const SubscriptionBillingAPI = require('../../srv/external/SubscriptionBillingAPI');
const API_BP_KEY_MAPPINGBeta = require('../../srv/external/API_BP_KEY_MAPPINGBeta');
const OrderFulfillmentHelper = require('../../srv/api/distribution/OrderFulfillmentHelper');
const {
    createConfigurationDataSet,
} = require('./payload/ConfigurationDataHelper');

const commonConfigApi = `/api/config/v1`;
const businessPartnerConfigApi = `/api/businessPartner/v1/config`;
const Item_Type_Codes_API = `/api/v1/CustomerOrderItemTypeCodes`;
const UOM_API = `/api/v1/UnitOfMeasuresCodes`;
const SalesOrg_API = `/api/v1/SalesOrganization`;
const Division_API = `/api/v1/DivisionCodes`;
const PaymentTerms_API = `/api/v1/PaymentTermCodes`;
const DistributionChannel_API = `/api/v1/DistributionChannelCodes`;
const BP_API = `/api/businessPartner/v1/BusinessPartner`;
const ShippingCondition_API = `/api/v1/ShippingConditionCodes`;
const IncoTerms_API = `/api/v1/IncotermsClassificationCodes`;
const Subsequent_Doc_API = `/api/v1/CustomerOrderItemUtilitiesSubsequentDocumentCodes`;
const Product_API = `/api/v1/Product`;
const SalesPartnerRoleCodes_API = `/api/v1/SalesPartnerRoleCodes`;
const ConditionTypeCodes_API = `/api/v1/ConditionTypeCodes`;
const CustomerOrder_API = `/api/v1/CustomerOrder`;
const SalesProcessingStatusCodes_API = `/api/v1/SalesProcessingStatusCodes`;
const CustomerOrder_SourceSystems_API = `/api/v1/config/CustomerOrderUtilitiesStatusSourceSystems`;
const CustomerOrder_MappingTypeCodes_API = `/api/v1/config/CustomerOrderUtilitiesStatusMappingTypeCodes`;
const CustomerOrder_StatusMapping_API = `/api/v1/config/CustomerOrderUtilitiesStatusMapping`;
const CustomerOrderTypeCodes_API = `/api/v1/CustomerOrderTypeCodes`;
const ExternalDocumentTypeCodes_API = `/api/distribution/v1/config/ExternalDocumentTypeCodes`;
const BusinessActionTypeCodes_API = `/api/distribution/v1/config/BusinessActionTypeCodes`;
const UtilitiesBusinessScenarios_API = `/api/distribution/v1/config/UtilitiesBusinessScenarios`;
const UtilitiesBusinessScenarios_USB1_API = `/api/distribution/v1/config/UtilitiesBusinessScenarios/UTIL/USB1`;
const CancellationReasonCodes_API = `/api/v1//SalesCancellationReasonCodes`;
const CustomerOrderItemUtilitiesBudgetBillingTypeCodes_API = `/api/v1/CustomerOrderItemUtilitiesBudgetBillingTypeCodes`;
const CustomerOrderItemUtilitiesDeviceTypeCodes_API = `/api/v1/CustomerOrderItemUtilitiesDeviceTypeCodes`;

//Payloads
const customer_order_payload = require('./payload/Distribution_Service_CustomerOrder');
const techResources = customer_order_payload.technical_resource;
const sdResponse = customer_order_payload.sdResponse;
const sdResponseInvalidSalesArea =
    customer_order_payload.sdResponseInvalidSalesArea;
const salesOrderItems = customer_order_payload.salesOrderItems;
const SBResponse = customer_order_payload.SBResponse;
const InvalidSBResponse = customer_order_payload.InvalidSBResponse;
const MCMInstance = customer_order_payload.MCMInstance;
const MeterOperatorCode = customer_order_payload.MeterOperatorCode;
const DsoCode = customer_order_payload.DsoCode;
const DistributorBP = customer_order_payload.DistributorBP;
const MeterOperatorBP = customer_order_payload.MeterOperatorBP;
const SBCanclResponse = customer_order_payload.SBCanclResponse;
const markets = customer_order_payload.market;
const subscription = customer_order_payload.subscription_response;
const EBike = customer_order_payload.Electric_Bike_Product;
const Type_USB1 = customer_order_payload.type_code_USB1;
const Type_USB2 = customer_order_payload.type_code_USB2;
const Type_USB3 = customer_order_payload.type_code_USB3;
const Type_USB5 = customer_order_payload.type_code_USB5;
const Each_Quantity_Unit = customer_order_payload.Each_Quantity_Unit;
const Piece_Quantity_Unit = customer_order_payload.Piece_Quantity_Unit;
const SalesOrg_U100 = customer_order_payload.SalesOrg_U100;
const SalesOrg_U101 = customer_order_payload.SalesOrg_U101;
const PaymentTermCodes_001 = customer_order_payload.PaymentTermCodes_001;
const Division_01 = customer_order_payload.Division_01;
const DistributionChannel_U1 = customer_order_payload.DistributionChannel_U1;
const DistChannel_30 = customer_order_payload.DistChannel_30;
const DistChannel_10 = customer_order_payload.DistChannel_10;
const ShippingCondition_01 = customer_order_payload.ShippingCondition_01;
const ShippingCondition_02 = customer_order_payload.ShippingCondition_02;
const Division_00 = customer_order_payload.Division_00;
const IncoTerms_SH = customer_order_payload.IncoTerms_SH;
const Subs_Code_USB1 = customer_order_payload.Subs_Code_USB1;
const Subs_Code_USB2 = customer_order_payload.Subs_Code_USB2;
const Subs_Code_USB3 = customer_order_payload.Subs_Code_USB3;
const Subs_Code_UMT1 = customer_order_payload.Subs_Code_UMT1;
const SalesDistribution_UMT1 = customer_order_payload.SalesDistribution_UMT1;
const salesOrg_1010 = customer_order_payload.salesOrg_1010;
const ProductTG11 = customer_order_payload.ProductTG11;
const ProductXYZ = customer_order_payload.ProductXYZ;
const ConditionType_YK07 = customer_order_payload.ConditionType_YK07;
const ConditionType_DRN1 = customer_order_payload.ConditionType_DRN1;
const ConditionType_PPR0 = customer_order_payload.ConditionType_PPR0;
const ConditionType_DRG1 = customer_order_payload.ConditionType_DRG1;
const CancellationReason_01 = customer_order_payload.CancellationReason_01;
const CancellationReason_90 = customer_order_payload.CancellationReason_90;
let respCustomerOrder = {};
let respCustomerOrderSD = {};
let respSbUSB3 = {};
let respCommodityCustOrder = {};
let respCommodityCustOrderUtilExtn = {};
let respCommodityCustOrderInvalidInstallation = {};
let respCommodityCustOrderErr = {};
let respSDSB = {};

const CustomerOrderMock = require('../backend-it/payload/CustomerOrderMock');

const { POST, DELETE, PUT, PATCH, admin } = launchServer({
    service: {
        paths: [
            'srv/api/ConfigurationService',
            'srv/api/businesspartner',
            'srv/api/API_EDOM_RETAILER',
            ['srv/api/distribution', 'srv/api'],
            'srv/mdiclient',
            'srv/external',
        ],
    },
});

global.cds.env.features.assert_integrity = false;

describe('DistributionService it-test UTILITIESCLOUDSOLUTION-2994 UTILITIESCLOUDSOLUTION-3020 UTILITIESCLOUDSOLUTION-2766 UTILITIESCLOUDSOLUTION-2814 UTILITIESCLOUDSOLUTION-2924 UTILITIESCLOUDSOLUTION-3058', () => {
    let entities = [];

    const mockServer = setupServer(
        rest.get(
            `https://c4u-prod.eu10.revenue.cloud.sap/api/business-config/v1/config/Global/Market/v1 `,
            (_, res, ctx) => {
                return res(ctx.status(200), ctx.json(markets));
            }
        ),
        rest.post(
            `https://c4u-prod.eu10.revenue.cloud.sap/api/subscription/v1/subscriptions`,
            (_, res, ctx) => {
                return res(ctx.status(200), ctx.json(subscription));
            }
        ),
        rest.get(
            `https://c4u-prod.eu10.revenue.cloud.sap/api/product-service/v1/products/code/new_electricity_product`,
            (_, res, ctx) => {
                return res(ctx.status(200), ctx.json(techResources));
            }
        ),
        rest.post(
            `https://my300470-api.s4hana.ondemand.com/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder`,
            (req, res, ctx) => {
                if (req.body.DistributionChannel === '30') {
                    return res(
                        ctx.status(200),
                        ctx.json(sdResponseInvalidSalesArea)
                    );
                } else if (req.body.to_Item[0].Material === 'XYZ') {
                    return res(
                        ctx.status(200),
                        ctx.json(sdResponseInvalidMaterial)
                    );
                } else {
                    return res(ctx.status(200), ctx.json(sdResponse));
                }
            }
        ),
        rest.get(
            `https://my300470-api.s4hana.ondemand.com/sap/opu/odata/sap/API_SALES_ORDER_SRV/*`,
            (req, res, ctx) => {
                if (
                    req.url.pathname ===
                    '/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder(%2712345%27)/to_Item'
                ) {
                    return res(ctx.status(200), ctx.json(salesOrderItems));
                }
            }
        ),
        rest.head(
            `https://my300470-api.s4hana.ondemand.com/sap/opu/odata/sap/API_SALES_ORDER_SRV/*`,
            (req, res, ctx) => {
                return res(ctx.status(200), ctx.json({}));
            }
        ),
        rest.get(
            `https://c4u-prod.eu10.revenue.cloud.sap/api/subscription/v1/subscriptions*`,
            (req, res, ctx) => {
                if (req.url.search === '?subscriptionDocumentId=N4033') {
                    return res(ctx.status(200), ctx.json(SBResponse));
                } else if (req.url.search === '?subscriptionDocumentId=N4044') {
                    return res(ctx.status(200), ctx.json(InvalidSBResponse));
                }
            }
        ),
        rest.post(
            `https://c4u-prod.eu10.revenue.cloud.sap/api/subscription/v1/subscriptions/*`,
            (req, res, ctx) => {
                if (
                    req.url.pathname ===
                    '/api/subscription/v1/subscriptions/N4033/cancellation'
                ) {
                    return res(ctx.status(200), ctx.json(SBCanclResponse));
                } else if (
                    req.url.pathname ===
                    '/api/subscription/v1/subscriptions/N4044/cancellation'
                ) {
                    return res(ctx.status(403), ctx.json(SBCanclResponse));
                }
            }
        ),
        rest.get(
            'https://srv-edom-mcm-dev.cfapps.eu10.hana.ondemand.com/odata/v4/api/mcm/v1/MeteringLocations*',
            (req, res, ctx) => {
                if (
                    req.url.search ===
                    '?$filter=meteringLocationId%20eq%20%27DE0021794340100000000000001111212%27&$select=meteringLocationId&$expand=measurementConceptInstance($select=id,idText,orderer_code,leadingGrid_code,meteringLocations;$expand=meteringLocations,changeProcesses($select=id;$expand=processData($select=id;$expand=meteringLocationsPD($select=id,meteringLocation_id,meterOperator))))'
                ) {
                    return res(ctx.status(200), ctx.json(MCMInstance));
                } else
                    req.url.search ===
                        '?$filter=meteringLocationId%20eq%20%272211723480%27&$select=meteringLocationId&$expand=measurementConceptInstance($select=id,idText,orderer;$expand=orderer,changeProcesses($select=id;$expand=processData($select=id;$expand=meteringLocationsPD($select=id,meteringLocation_id,meterOperator))))';
                {
                    return res(ctx.status(403), ctx.json({}));
                }
            }
        )
    );

    afterAll(() => {
        mockServer.close();
    });
    afterEach(() => {
        mockServer.resetHandlers();
        jest.clearAllMocks();
    });

    beforeAll(async () => {
        mockServer.listen(mockServerConf);
        setupOrderFulfillmentMock();

        const serviceEntities = Object.values(
            cds
                .reflect(cds.model)
                .entities('API_EDOM_RETAILER', 'ConfigurationService')
        ).filter(
            (value) => !value['@cds.autoexposed'] && !value.elements['up_']
        );

        // Setup the Customer Order
        const partnerId = customer_order_payload.partnerId;
        const displayCId = customer_order_payload.displayCId;

        await createConfigurationDataSet(admin, POST);

        const respTypeCode1 = await POST(Item_Type_Codes_API, Type_USB1, {
            auth: admin,
        });

        const respTypeCodeUSB2 = await POST(Item_Type_Codes_API, Type_USB2, {
            auth: admin,
        });

        const respTypeCodeUSB3 = await POST(Item_Type_Codes_API, Type_USB3, {
            auth: admin,
        });

        const respTypeCodeUSB5 = await POST(Item_Type_Codes_API, Type_USB5, {
            auth: admin,
        });

        const eachQauntityUnit = await POST(UOM_API, Each_Quantity_Unit, {
            auth: admin,
        });

        const PCQuantityUnit = await POST(UOM_API, Piece_Quantity_Unit, {
            auth: admin,
        });

        const salesOrgResp = await POST(SalesOrg_API, SalesOrg_U100, {
            auth: admin,
        });

        const salesOrgRespNoMarket = await POST(SalesOrg_API, SalesOrg_U101, {
            auth: admin,
        });

        const respPaymentTerm = await POST(
            PaymentTerms_API,
            PaymentTermCodes_001,
            {
                auth: admin,
            }
        );

        const respDivisionCode = await POST(Division_API, Division_01, {
            auth: admin,
        });

        const respDistChannel = await POST(
            DistributionChannel_API,
            DistributionChannel_U1,
            {
                auth: admin,
            }
        );
        const respProductEBike = await POST(Product_API, EBike, {
            auth: admin,
        });
        const businessPartner = BP_API;
        const bpPayload = bpValidationMock.bpPersonValid;

        await commonSetupConfigCodes(POST, commonConfigApi, admin);
        await bpSetupConfigCodes(POST, businessPartnerConfigApi, admin);

        let respBPUUID;
        let { data } = await POST(businessPartner, bpPayload, {
            auth: admin,
        });
        respBPUUID = data;

        const respShippingCondition = await POST(
            ShippingCondition_API,
            ShippingCondition_01,
            { auth: admin }
        );

        const respIncoTermsClassification = await POST(
            IncoTerms_API,
            IncoTerms_SH,
            { auth: admin }
        );

        const subsequentCodeUSB1 = await POST(
            Subsequent_Doc_API,
            Subs_Code_USB1,
            { auth: admin }
        );

        const subsequentCodeUSB2 = await POST(
            Subsequent_Doc_API,
            Subs_Code_USB2,
            { auth: admin }
        );

        const subsequentCodeUSB3 = await POST(
            Subsequent_Doc_API,
            Subs_Code_USB3,
            { auth: admin }
        );

        // SD Order
        // const subsequentCodeUMT1 = await POST(
        //     Subsequent_Doc_API,
        //     Subs_Code_UMT1,
        //     { auth: admin }
        // );
        // const respTypeCodeUMT1 = await POST(
        //     Item_Type_Codes_API,
        //     SalesDistribution_UMT1,
        //     { auth: admin }
        // );

        const respTypeCodeUMT1 = {
            data: {
                name: 'SalesDistribution',
                descr: 'SalesDistribution',
                code: 'UMT1',
            },
        };
        
        const salesOrgResp1010 = await POST(SalesOrg_API, salesOrg_1010, {
            auth: admin,
        });

        const respDivisionCode00 = await POST(Division_API, Division_00, {
            auth: admin,
        });

        const respDistChannel10 = await POST(
            DistributionChannel_API,
            DistChannel_10,
            { auth: admin }
        );
        const respDistChannel30 = await POST(
            DistributionChannel_API,
            DistChannel_30,
            { auth: admin }
        );
        const respProductTG11 = await POST(Product_API, ProductTG11, {
            auth: admin,
        });

        const respProductXYZ = await POST(Product_API, ProductXYZ, {
            auth: admin,
        });

        const respShippingCondition02 = await POST(
            ShippingCondition_API,
            ShippingCondition_02,
            { auth: admin }
        );

        const respSalesPartnerRoleCodesnSH = await POST(
            SalesPartnerRoleCodes_API,
            {
                name: 'SH',
                descr: null,
                code: 'SH',
            },
            { auth: admin }
        );
        const respConditionTypeCodesYK07 = await POST(
            ConditionTypeCodes_API,
            ConditionType_YK07,
            { auth: admin }
        );
        const respConditionTypeCodesDRN1 = await POST(
            ConditionTypeCodes_API,
            ConditionType_DRN1,
            { auth: admin }
        );
        const respConditionTypeCodesDRG1 = await POST(
            ConditionTypeCodes_API,
            ConditionType_DRG1,
            { auth: admin }
        );
        const respConditionTypeCodesPPR0 = await POST(
            ConditionTypeCodes_API,
            ConditionType_PPR0,
            { auth: admin }
        );

        const respCancellationReason01 = await POST(
            CancellationReasonCodes_API,
            CancellationReason_01,
            { auth: admin }
        );

        const respCancellationReason90 = await POST(
            CancellationReasonCodes_API,
            CancellationReason_90,
            { auth: admin }
        );
        const respBudgetBillingType = await POST(
            CustomerOrderItemUtilitiesBudgetBillingTypeCodes_API,
            {
                code: 'SU01',
            },
            { auth: admin }
        );
        const respDeviceType = await POST(
            CustomerOrderItemUtilitiesDeviceTypeCodes_API,
            {
                code: '01',
                name: 'smart_meter',
                descr: 'smart_meter',
            },
            { auth: admin }
        );

        BusCreateUtilitiesUTIL();
        BusCreateSalesOrder();
        BusCreateSubscription();
        BusCreateCommoditySubscriptionB4();
        BusCreateNonCommoditySubscriptionB4();
        BusCreateCommoditySubscriptionUSB2();
        BusCreateCommoditySubscriptionUSB3();
        BusCreateNonCommoditySubscriptionUSB1();
        BusCreatePhysicalUMT2();
        BusCreateOrderBusinessActionTypeCode();
        BusTerminateOrderBusinessActionTypeCode();
        BusCreateCommoditySubscription();
        BusCreateNonCommoditySubscription();
        BusTerminateNonCommoditySubscription();

        const cOrderParams = {
            displayCId,
            respTypeCode1,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            partnerId,
        };
        const cOrder = CustomerOrderMock.getCOrder(cOrderParams);
        const cOrderWithRefObj_Params = {
            displayCId,
            respTypeCodeUSB2,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            respBPUUID,
        };
        const cOrderWithRefObj = CustomerOrderMock.GetCorderwithRef(
            cOrderWithRefObj_Params
        );
        const cOrderWithUtilExtension = CustomerOrderMock.GetCorderwithUtilExtn(
            cOrderWithRefObj_Params
        );

        const cOrderWithRefObjInvalidInstallation =
            CustomerOrderMock.GetCorderwithRefInvalidInstallation(
                cOrderWithRefObj_Params
            );

        const cOrderNoTech_Params = {
            displayCId,
            respTypeCodeUSB2,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        };
        const cOrderNoTech =
            CustomerOrderMock.GetCorderwithNoTech(cOrderNoTech_Params);

        const cOrderWithoutRefObj_Params = {
            displayCId,
            respTypeCodeUSB2,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        };
        const cOrderWithoutRefObj = CustomerOrderMock.GetCorderwithoutRef(
            cOrderWithoutRefObj_Params
        );
        const SbOrderNoContractTerm_Param = {
            displayCId,
            respTypeCode1,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        };
        const SbOrderNoContractTerm =
            CustomerOrderMock.getSbOrderNoContractTerm(
                SbOrderNoContractTerm_Param
            );
        const SbOrder_Type_Usb5_Param = {
            displayCId,
            respTypeCodeUSB5,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        };
        const SbOrderUsb5 = CustomerOrderMock.get_SbOrder_Type_Usb5(
            SbOrder_Type_Usb5_Param
        );
        const sbSdOrder_Param = {
            salesOrgResp1010,
            respProductTG11,
            respProductEBike,
            respBPUUID,
        };
        const sbSdOrder = CustomerOrderMock.getsbSdOrder(sbSdOrder_Param);
        const SbOrder_Type_Usb3_Param = {
            displayCId,
            respTypeCodeUSB3,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            respCancellationReason: respCancellationReason01,
        };

        const SbOrder_Type_Usb3_Overwrite_Param = {
            displayCId,
            respTypeCodeUSB3,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            respCancellationReason: respCancellationReason90,
        };

        const SbOrder_Type_Usb3_InvalidCancelReason = {
            displayCId,
            respTypeCodeUSB3,
            respDistChannel,
            respDivisionCode,
            salesOrgResp,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            respCancellationReason: '',
        };

        const SbOrderUsb3 = CustomerOrderMock.getSbOrder_Type_Usb3(
            SbOrder_Type_Usb3_Param
        );

        const InvalidSbOrderUsb3 =
            CustomerOrderMock.getSbOrder_Type_Usb3_Invalid(
                SbOrder_Type_Usb3_Param
            );

        const Invalid2SbOrderUsb3 =
            CustomerOrderMock.getSbOrder_Type_Usb3_Invalid2(
                SbOrder_Type_Usb3_Param
            );

        const SbOrderUsb3Overwrite = CustomerOrderMock.getSbOrder_Type_Usb3(
            SbOrder_Type_Usb3_Overwrite_Param
        );

        const SbOrderUsb3InvalidCancelReason =
            CustomerOrderMock.getSbOrder_Type_Usb3_NoCancelReason(
                SbOrder_Type_Usb3_InvalidCancelReason
            );

        const SbOrderNoMarket_param = {
            displayCId,
            respTypeCode1,
            respDistChannel,
            respDivisionCode,
            salesOrgRespNoMarket,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        };
        const SbOrderNoMarket = CustomerOrderMock.getSbOrderNoMarket(
            SbOrderNoMarket_param
        );
        const SBOrderNoUtilitiesAspect_param = {
            displayCId,
            respTypeCode1,
            eachQauntityUnit,
            respProductEBike,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
            partnerId,
        };
        const SBOrderNoUtilitiesAspect =
            CustomerOrderMock.getSBOrder_NoUtilitiesAspect(
                SBOrderNoUtilitiesAspect_param
            );

        const SBOrderNoSubscriptionAspect_Param = {
            displayCId,
            respTypeCode1,
            respDistChannel,
            respDivisionCode,
            salesOrgRespNoMarket,
            eachQauntityUnit,
            respProductEBike,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        };
        const SBOrderNoSubscriptionAspect =
            CustomerOrderMock.getSBOrder_NoSubscriptionAspect(
                SBOrderNoSubscriptionAspect_Param
            );

        const cOrderError_Params = {
            displayCId,
            respTypeCode1,
            partnerId,
            respIncoTermsClassification,
            respShippingCondition,
            respPaymentTerm,
        };
        const cOrderError =
            CustomerOrderMock.getCOrder_Error(cOrderError_Params);
        const SDOrderNoMatchSalesAreaError_Params = {
            displayCId,
            respConditionTypeCodesPPR0,
            PCQuantityUnit,
            respConditionTypeCodesYK07,
            respTypeCodeUMT1,
            respDistChannel30,
            respDivisionCode00,
            salesOrgResp1010,
            respProductTG11,
            respIncoTermsClassification,
            respPaymentTerm,
        };
        const SDOrderNoMatchSalesAreaError =
            CustomerOrderMock.getSDOrder_NoMatchSales_Area(
                SDOrderNoMatchSalesAreaError_Params
            );

        // Invalid Material
        const SDOrderNoMatchMaterialError_Params = {
            displayCId,
            respConditionTypeCodesPPR0,
            PCQuantityUnit,
            respConditionTypeCodesYK07,
            respTypeCodeUMT1,
            respDistChannel10,
            respDivisionCode00,
            salesOrgResp1010,
            respProductXYZ,
            respIncoTermsClassification,
            respPaymentTerm,
        };
        const SDOrderNoMatchMaterialError =
            CustomerOrderMock.getSDOrder_NoMatchMaterial(
                SDOrderNoMatchMaterialError_Params
            );

        // SD Order
        const SDOrder_Params = {
            displayCId,
            respConditionTypeCodesPPR0,
            PCQuantityUnit,
            respConditionTypeCodesYK07,
            respTypeCodeUMT1,
            respDistChannel10,
            respDivisionCode00,
            salesOrgResp1010,
            PCQuantityUnit,
            respProductTG11,
            respIncoTermsClassification,
            respPaymentTerm,
        };
        // Meter operator code
        try {
            const operatorCodeRows = await cds.run(
                INSERT.into(
                    `sap.odm.businesspartner.BusinessPartner.serviceProviderInformation`
                ).entries(MeterOperatorCode)
            );
        } catch (error) {
            console.log(error);
        }

        // DSO Code
        try {
            const DsoCodeRows = await cds.run(
                INSERT.into(
                    `sap.odm.businesspartner.BusinessPartner.serviceProviderInformation`
                ).entries(DsoCode)
            );
        } catch (error) {
            console.log(error);
        }

        // DSO BP
        try {
            const DsoBPRows = await cds.run(
                INSERT.into(`sap.odm.businesspartner.BusinessPartner`).entries(
                    DistributorBP
                )
            );
        } catch (error) {
            console.log(error);
        }

        // MO BP
        try {
            const MoBPRows = await cds.run(
                INSERT.into(`sap.odm.businesspartner.BusinessPartner`).entries(
                    MeterOperatorBP
                )
            );
        } catch (error) {
            console.log(error);
        }

        const sDOrder = CustomerOrderMock.getSDOrder(SDOrder_Params);
        // create a Customer Order
        try {
            respCustomerOrder = await POST(`/api/v1/CustomerOrder`, cOrder, {
                headers: {
                    'Content-Type': 'application/json;IEEE754Compatible=true',
                },
                auth: admin,
            });
        } catch (error) {
            console.log(error);
        }

        // create a Customer Order for no subscription passed
        try {
            respCustomerOrderNoSub = await POST(CustomerOrder_API, cOrder, {
                headers: {
                    'Content-Type': 'application/json;IEEE754Compatible=true',
                },
                auth: admin,
            });
        } catch (error) {
            console.log(error);
        }

        // create a Customer Order for unmocked market
        try {
            respCustomerOrderNoMarket = await POST(CustomerOrder_API, cOrder, {
                headers: {
                    'Content-Type': 'application/json;IEEE754Compatible=true',
                },
                auth: admin,
            });
        } catch (error) {
            console.log(error);
        }

        // create SB order with USB5
        try {
            respSbUSB5 = await POST(`/api/v1/CustomerOrder`, SbOrderUsb5, {
                headers: {
                    'Content-Type': 'application/json;IEEE754Compatible=true',
                },
                auth: admin,
            });
        } catch (error) {
            console.log(error);
        }

        // create SB order with USB3
        try {
            respSbUSB3 = await POST(`/api/v1/CustomerOrder`, SbOrderUsb3, {
                headers: {
                    'Content-Type': 'application/json;IEEE754Compatible=true',
                },
                auth: admin,
            });
        } catch (error) {
            console.log(error);
        }

        // create Invalid SB order with USB3
        try {
            respInvalidSbUSB3 = await POST(
                `/api/v1/CustomerOrder`,
                InvalidSbOrderUsb3,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log(error);
        }

        try {
            respInvalid2SbUSB3 = await POST(
                `/api/v1/CustomerOrder`,
                Invalid2SbOrderUsb3,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log(error);
        }

        // create SB order with USB3 and cancellation reason = 90
        try {
            respSbUSB3Overwrite = await POST(
                `/api/v1/CustomerOrder`,
                SbOrderUsb3Overwrite,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log(error);
        }

        // create SB order with USB3 and initial cancellation reason
        try {
            respSbUSB3InvalidCancelReason = await POST(
                `/api/v1/CustomerOrder`,
                SbOrderUsb3InvalidCancelReason,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log(error);
        }

        // create SB order with No Market
        try {
            respSbNoMarket = await POST(CustomerOrder_API, SbOrderNoMarket, {
                headers: {
                    'Content-Type': 'application/json;IEEE754Compatible=true',
                },
                auth: admin,
            });
        } catch (error) {
            console.log(error);
        }

        // create SB Commodity order with No Tech Resources
        try {
            respCustomerOrderNoTech = await POST(
                CustomerOrder_API,
                cOrderNoTech,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log(error);
        }

        // create SB order with No Contract Term
        try {
            respSbNoContractTerm = await POST(
                CustomerOrder_API,
                SbOrderNoContractTerm,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log(error);
        }

        // SBOrderNoUtilitiesAspect
        try {
            respSBNoUtilAspect = await POST(
                CustomerOrder_API,
                SBOrderNoUtilitiesAspect,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log(error);
        }

        // SBOrderNoSubscriptionAspect
        try {
            respSBNoSubAspect = await POST(
                CustomerOrder_API,
                SBOrderNoSubscriptionAspect,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log(error);
        }

        // Error scenario
        try {
            respCustomerOrderError = await POST(
                CustomerOrder_API,
                cOrderError,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log(error);
        }

        // create a Customer Order for SD and SB item
        try {
            respSDSB = await POST(`/api/v1/CustomerOrder`, sbSdOrder, {
                headers: {
                    'Content-Type': 'application/json;IEEE754Compatible=true',
                },
                auth: admin,
            });
        } catch (error) {
            console.log('-- Error: ', error);
        }
        // create a Customer Order for SD item
        try {
            respCustomerOrderSD = await POST(`/api/v1/CustomerOrder`, sDOrder, {
                headers: {
                    'Content-Type': 'application/json;IEEE754Compatible=true',
                },
                auth: admin,
            });
        } catch (error) {
            console.log('-- Error: ', error);
        }

        // SDOrderNoMatchSalesAreaError

        try {
            respSDNoMaterialSalesArea = await POST(
                CustomerOrder_API,
                SDOrderNoMatchSalesAreaError,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log('-- Error: ', error);
        }

        try {
            respSDNoSubUpdate = await POST(
                CustomerOrder_API,
                SDOrderNoMatchSalesAreaError,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log('-- Error: ', error);
        }

        try {
            respSDSubsequentDisplayIDNull = await POST(
                CustomerOrder_API,
                SDOrderNoMatchMaterialError,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log('-- Error: ', error);
        }

        try {
            respCommodityCustOrder = await POST(
                CustomerOrder_API,
                cOrderWithRefObj,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log('-- Error: ', error);
        }

        try {
            respCommodityCustOrderUtilExtn = await POST(
                CustomerOrder_API,
                cOrderWithUtilExtension,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log('-- Error: ', error);
        }

        try {
            respCommodityCustOrderInvalidInstallation = await POST(
                CustomerOrder_API,
                cOrderWithRefObjInvalidInstallation,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log('-- Error: ', error);
        }

        try {
            respCommodityCustOrderErr = await POST(
                CustomerOrder_API,
                cOrderWithoutRefObj,
                {
                    headers: {
                        'Content-Type':
                            'application/json;IEEE754Compatible=true',
                    },
                    auth: admin,
                }
            );
        } catch (error) {
            console.log('-- Error: ', error);
        }

        Array.from(serviceEntities).forEach((element) => {
            const { name } = element;
            entities.push(name.substring(name.indexOf('.') + 1, name.length));
        });

        const SalesProcessingStatusCodes0 = await POST(
            SalesProcessingStatusCodes_API,
            {
                code: '06',
                name: 'Active',
            },
            { auth: admin }
        );

        const SalesProcessingStatusCodes1 = await POST(
            SalesProcessingStatusCodes_API,
            {
                code: '08',
                name: 'In Error',
            },
            { auth: admin }
        );

        const SalesProcessingStatusCodes2 = await POST(
            SalesProcessingStatusCodes_API,
            {
                code: '07',
                name: 'In Distribution',
            },
            { auth: admin }
        );

        const SalesProcessingStatusCodes10 = await POST(
            SalesProcessingStatusCodes_API,
            {
                code: '10',
                name: 'In Termination',
            },
            { auth: admin }
        );

        const CustomerOrderUtilitiesStatusSourceSystems = await POST(
            CustomerOrder_SourceSystems_API,
            {
                sourceSystemId: '/eu10/sap.billing.sb',
                destination: 'SB-DESTINATION',
                path: '/api/status',
                statusPath: 'data/subscription/status',
            },
            { auth: admin }
        );

        const CustomerOrderUtilitiesStatusMappingTypeCodes = await POST(
            CustomerOrder_MappingTypeCodes_API,
            {
                code: '01',
                name: 'EM',
            },
            { auth: admin }
        );
        const { status: CustomerOrderUtilitiesStatusMapping } = await POST(
            CustomerOrder_StatusMapping_API,
            {
                sourceSystem: { sourceSystemId: '/eu10/sap.billing.sb' },
                sourceSystemStatus: 'Active',
                processingStatus: { code: '06' },
                type: { code: '01' },
            },
            { auth: admin }
        );

        API_BP_KEY_MAPPINGBeta.mockImplementation(() => {
            return {
                getBPKeyMappingByBpUUID: async (req, businessSystem) => {
                    const bps4DisplayId = [
                        ['W73-FGUJ47UDFJ0-4UFDJK'],
                        ['9980017151'],
                    ];
                    return [bps4DisplayId];
                },
            };
        });
    });

    async function BusCreateUtilitiesUTIL() {
        try {
            await POST(
                CustomerOrderTypeCodes_API,
                {
                    name: 'Utilities',
                    descr: 'Utilities',
                    code: 'UTIL',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function BusCreateSalesOrder() {
        try {
            await POST(
                ExternalDocumentTypeCodes_API,
                {
                    code: 'SalesOrder',
                    name: 'SalesOrder',
                    descr: 'SalesOrder',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function BusCreateSubscription() {
        try {
            await POST(
                ExternalDocumentTypeCodes_API,
                {
                    code: 'Subscription',
                    name: 'Subscription',
                    descr: 'Subscription',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function BusCreateCommoditySubscriptionB4() {
        try {
            await POST(
                ExternalDocumentTypeCodes_API,
                {
                    code: 'CommoditySubscription',
                    name: 'CommoditySubscription',
                    descr: 'CommoditySubscription',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function BusCreateNonCommoditySubscriptionB4() {
        try {
            await POST(
                ExternalDocumentTypeCodes_API,
                {
                    code: 'NonCommoditySubscription',
                    name: 'NonCommoditySubscription',
                    descr: 'NonCommoditySubscription',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }
    async function BusCreateNonCommoditySubscriptionUSB1() {
        try {
            await POST(
                Item_Type_Codes_API,
                {
                    name: 'NonCommodity Subscription',
                    descr: null,
                    code: 'USB1',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }
    async function BusCreateCommoditySubscriptionUSB2() {
        try {
            await POST(
                Item_Type_Codes_API,
                {
                    name: 'Commodity Subscription',
                    descr: null,
                    code: 'USB2',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function BusCreateCommoditySubscriptionUSB3() {
        try {
            await POST(
                Item_Type_Codes_API,
                {
                    name: 'Non Commodity Subscription',
                    descr: null,
                    code: 'USB3',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function BusCreatePhysicalUMT2() {
        try {
            await POST(
                Item_Type_Codes_API,
                {
                    name: 'Physical Downpayment',
                    descr: null,
                    code: 'UMT2',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function BusCreateOrderBusinessActionTypeCode() {
        try {
            await POST(
                BusinessActionTypeCodes_API,
                {
                    code: 'create',
                    name: 'create',
                    descr: 'createOrder',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function BusTerminateOrderBusinessActionTypeCode() {
        try {
            await POST(
                BusinessActionTypeCodes_API,
                {
                    code: 'terminate',
                    name: 'terminate',
                    descr: 'terminateOrder',
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function BusCreateNonCommoditySubscription() {
        try {
            await POST(
                UtilitiesBusinessScenarios_API,
                {
                    sapProvided: true,
                    subscriptionProfile: 'non_commodity',
                    customerOrderType: {
                        code: 'UTIL',
                    },
                    customerOrderItemType: {
                        code: 'USB1',
                    },
                    externalDocumentType: {
                        code: 'NonCommoditySubscription',
                    },
                    businessAction: {
                        code: 'create',
                    },
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    async function BusTerminateNonCommoditySubscription() {
        try {
            await POST(
                UtilitiesBusinessScenarios_API,
                {
                    sapProvided: true,
                    subscriptionProfile: 'non_commodity',
                    customerOrderType: {
                        code: 'UTIL',
                    },
                    customerOrderItemType: {
                        code: 'USB3',
                    },
                    externalDocumentType: {
                        code: 'NonCommoditySubscription',
                    },
                    businessAction: {
                        code: 'terminate',
                    },
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }
    async function BusCreateCommoditySubscription() {
        try {
            await POST(
                UtilitiesBusinessScenarios_API,
                {
                    sapProvided: true,
                    subscriptionProfile: 'commodity',
                    customerOrderType: {
                        code: 'UTIL',
                    },
                    customerOrderItemType: {
                        code: 'USB2',
                    },
                    externalDocumentType: {
                        code: 'CommoditySubscription',
                    },
                    businessAction: {
                        code: 'create',
                    },
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    setTestDestination({
        name: 'S4-DESTINATION',
        url: 'https://my300470-api.s4hana.ondemand.com/sap/opu/odata/sap/API_SALES_ORDER_SRV',
        username: 'user',
        password: 'password',
        originalProperties: {
            BusinessSystem: '0LOALS1',
            SDOrderAPI:
                'https://my300470-api.s4hana.ondemand.com/sap/opu/odata/sap/API_SALES_ORDER_SRV',
        },
    });

    setTestDestination({
        name: 'mcm-dest',
        url: 'https://srv-edom-mcm-dev.cfapps.eu10.hana.ondemand.com',
    });

    setTestDestination(
        {
            name: 'SB-DESTINATION',
            url: 'https://c4u-prod.eu10.revenue.cloud.sap',
            destinationConfiguration: {
                Name: 'SB-DESTINATION',
                Type: 'HTTP',
                URL: 'https://eu10.revenue.cloud.sap',
                Authentication: 'OAuth2ClientCredentials',
                ProxyType: 'Internet',
                tokenServiceURLType: 'Dedicated',
                clientId:
                    'sb-sap-subscription-billing!b85281|revenue-cloud!b1532',
                Description: 'set token for SB Destination',
                BITClass: '0SAP',
                CACategory: 'Y1',
                BillingProcess: 'Y001',
                tokenServiceURL:
                    'https://c4uconsumerdevaws.authentication.eu10.hana.ondemand.com/oauth/token',
                SubscriptionBillingAPI: '/api/subscription/v1/subscriptions',
                BillingSubProcess: 'Y001',
                SBBusinessSystem: 'C4U-SB',
                MarketBusinessConfigAPI:
                    '/api/business-config/v1/config/Global/Market/v1',
                S4BusinessSystem: '0LOALS1',
                clientSecret: 'ssss',
                ConditionType: 'PMP1-YONE/PMP2-YREC/PMP3-Y001',
            },
        },
        {
            name: 'sb-market',
            url: 'https://c4u-prod.eu10.revenue.cloud.sap',
        }
    );

    const BPUUID = {
        id: 'e2f3783b-14e6-469d-8e3c-57993a7a51f1',
        displayId: '03611900',
    };
    function setupOrderFulfillmentMock() {
        jest.spyOn(
            DistributionFunctions,
            'getPartnerUUIDFromDisplayID'
        ).mockImplementation(() => {
            return [BPUUID];
        });
    }

    it('should create a subscription and return 200 & Is Success true & Document number is filled', async () => {
        let distResp = '';
        try {
            distResp = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCustomerOrder.data.id,
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
        expect(distResp.status).to.equal(200);
        expect(distResp.data.orderItems[0].isSuccess).to.equal(true);
        expect(distResp.data.orderItems[0].createdDocumentNumber).not.to.be
            .null;
    });
    it('should create a subscription and sd order and return 200 & Is Success true & Document number is filled', async () => {
        let distRespSBSD = '';
        try {
            distRespSBSD = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSDSB.data.id,
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
        expect(distRespSBSD.status).to.equal(200);
        expect(distRespSBSD.data.orderItems[0].isSuccess).to.equal(true);
        expect(distRespSBSD.data.orderItems[0].createdDocumentNumber).not.to.be
            .null;
        // expect(distRespSBSD.data.orderItems[1].createdDocumentNumber).not.to.be
            // .null;
    });

    it('should Terminate subscription and return 200', async () => {
        let distRespSbUSB3 = '';
        let Usb3Error = '';

        try {
            console.log('respSbUSB3.data.id ' + respSbUSB3.displayId);
            distRespSbUSB3 = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSbUSB3.data.id,
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
            Usb5Error = error.message;
        }
        expect(distRespSbUSB3.status).to.equal(200);
        expect(distRespSbUSB3.data.orderItems[0].isSuccess).to.equal(true);

        //  expect(distRespSBBlank.data.orderItems[0].isSuccess).to.equal(false);
    });

    it('should fail to Terminate subscription because of Invalid data', async () => {
        let distrespInvalidSbUSB3 = '';
        let Usb3Error = '';

        try {
            console.log(
                'respInvalidSbUSB3.data.id ' + respInvalidSbUSB3.displayId
            );
            distrespInvalidSbUSB3 = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respInvalidSbUSB3.data.id,
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
            Usb3Error = error.message;
        }
        expect(distrespInvalidSbUSB3.data.orderItems[0].isSuccess).to.equal(
            false
        );
    });

    it('should fail to get subscription details because of Invalid subscription ID', async () => {
        let distrespInvalid2SbUSB3 = '';
        let Usb3Error = '';

        try {
            console.log(
                'respInvalid2SbUSB3.data.id ' + respInvalid2SbUSB3.displayId
            );
            distrespInvalid2SbUSB3 = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respInvalid2SbUSB3.data.id,
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
            Usb3Error = error.message;
        }
        expect(distrespInvalid2SbUSB3.data.orderItems[0].isSuccess).to.equal(
            false
        );
    });

    it('should Terminate subscription with cancellation Reason Overwrite and return 200', async () => {
        let distRespSbUSB3Overwrite = '';
        let Usb3Error = '';

        jest.spyOn(
            SubscriptionBillingAPI,
            'getSubscription'
        ).mockImplementation(() => {
            return [
                {
                    metaData: {
                        version: '21',
                    },
                    subscriptionDocumentId: 'N4033',
                },
            ];
        });

        jest.spyOn(
            SubscriptionBillingAPI,
            'postSubscriptionCancellation'
        ).mockImplementation(() => {
            return {
                status: 'Canceled',
                subscriptionDocumentId: 'N4033',
                subscriptionId: '79F6EA48-F958-4792-97BF-56386BCE2187',
            };
        });

        try {
            distRespSbUSB3 = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSbUSB3Overwrite.data.id,
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
            Usb5Error = error.message;
        }
        expect(distRespSbUSB3.status).to.equal(200);
        expect(distRespSbUSB3.data.orderItems[0].isSuccess).to.equal(true);

        //  expect(distRespSBBlank.data.orderItems[0].isSuccess).to.equal(false);
    });

    it('should Terminate subscription even with a non-existent cancellation Reason  and return 200', async () => {
        let distRespSbUSB3InvalidCancelReason = '';
        let Usb3Error = '';

        jest.spyOn(
            SubscriptionBillingAPI,
            'getSubscription'
        ).mockImplementation(() => {
            return [
                {
                    metaData: {
                        version: '21',
                    },
                    subscriptionDocumentId: 'N4033',
                },
            ];
        });

        jest.spyOn(
            SubscriptionBillingAPI,
            'postSubscriptionCancellation'
        ).mockImplementation(() => {
            return {
                status: 'Canceled',
                subscriptionDocumentId: 'N4033',
                subscriptionId: '79F6EA48-F958-4792-97BF-56386BCE2187',
            };
        });

        try {
            istRespSbUSB3InvalidCancelReason = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSbUSB3InvalidCancelReason.data.id,
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
            Usb5Error = error.message;
        }
        expect(istRespSbUSB3InvalidCancelReason.status).to.equal(200);
        expect(
            istRespSbUSB3InvalidCancelReason.data.orderItems[0].isSuccess
        ).to.equal(true);
    });

    it('should return already canceled message for canceled subscription termination', async () => {
        let distRespSbUSB3 = '';
        let Usb3Error = '';

        jest.spyOn(
            SubscriptionBillingAPI,
            'getSubscription'
        ).mockImplementation(() => {
            return [
                {
                    metaData: {
                        version: '21',
                    },
                    subscriptionDocumentId: 'N4033',
                    status: 'Canceled',
                },
            ];
        });

        try {
            console.log('respSbUSB3.data.id ' + respSbUSB3.displayId);
            distRespSbUSB3 = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSbUSB3.data.id,
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
            Usb5Error = error.message;
        }
        expect(distRespSbUSB3.status).to.equal(200);
        expect(distRespSbUSB3.data.orderItems[0].isSuccess).to.equal(false);
        expect(distRespSbUSB3.data.orderItems[0].messages[0]).to.contain(
            'Subscription was already cancelled.'
        );
    });

    it('should return fail response for get subscription error', async () => {
        let distRespSbUSB3 = '';
        let Usb3Error = '';

        jest.spyOn(
            SubscriptionBillingAPI,
            'getSubscription'
        ).mockImplementation(() => {
            return {
                stack: 'Failed to connect to destination',
                message: 'Failed to connect to destination',
            };
        });

        try {
            console.log('respSbUSB3.data.id ' + respSbUSB3.displayId);
            distRespSbUSB3 = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSbUSB3.data.id,
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
            Usb5Error = error.message;
        }
        expect(distRespSbUSB3.status).to.equal(200);
        expect(distRespSbUSB3.data.orderItems[0].isSuccess).to.equal(false);
        expect(distRespSbUSB3.data.orderItems[0].messages[0]).to.contain(
            'Failed to connect to destination'
        );
    });

    it('should Not create a SB Order and return Error', async () => {
        let distRespSBError = '';
        try {
            distRespSBError = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCustomerOrderError.data.id,
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
            noValidItems = error.message;
        }
        expect(noValidItems).to.contain(
            '406 - No valid order items found for distribution.'
        );
        // expect(distRespSBError.data.orderItems[0].isSuccess).to.equal(false);
    });

    it('should Not create a SB Order with No Contract Term and return Error', async () => {
        let distRespSBNoTerm = '';
        try {
            distRespSBNoTerm = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSbNoContractTerm.data.id,
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
        expect(distRespSBNoTerm.status).to.equal(200);
        expect(distRespSBNoTerm.data.orderItems[0].isSuccess).to.equal(false);
    });

    it('should Not create a SB Order with No market found for sales area and return Error', async () => {
        let distRespSBNoMarket = '';
        try {
            distRespSBNoMarket = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSbNoMarket.data.id,
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
        expect(distRespSBNoMarket.status).to.equal(200);
        expect(distRespSBNoMarket.data.orderItems[0].isSuccess).to.equal(false);
    });

    it('should Not create a SB Order when Wrong ID is passed', async () => {
        respCustomerOrder.data.id = `b874ddbe-5c47-497d-878d-8d772b27095d`;
        let distRespSBWrongID = '';
        try {
            distRespSBWrongID = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCustomerOrder.data.id,
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
            WrongIdError = error.message;
        }
        expect(WrongIdError).to.contain(
            'No Customer Order was found with ID: b874ddbe-5c47-497d-878d-8d772b27095d'
        );
    });

    it('should Not create a SB Order with type code USB5', async () => {
        let distRespSbUSB5 = '';
        let Usb5Error = '';
        try {
            distRespSbUSB5 = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSbUSB5.data.id,
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
            Usb5Error = error.message;
        }

        expect(Usb5Error).to.contain(
            '406 - No valid order items found for distribution.'
        );
        //  expect(distRespSBBlank.data.orderItems[0].isSuccess).to.equal(false);
    });

    it('should Not create a SB Order Blank Utilities Aspect passed', async () => {
        let distRespSBNoUtilAspect = '';
        try {
            distRespSBNoUtilAspect = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSBNoUtilAspect.data.id,
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
        expect(distRespSBNoUtilAspect.status).to.equal(200);
        expect(distRespSBNoUtilAspect.data.orderItems[0].isSuccess).to.equal(
            false
        );
    });

    it('should create a SD and return 200 & Is Success true & Document number is filled', async () => {
        let distRespSD = '';
        try {
            distRespSD = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCustomerOrderSD.data.id,
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
        // expect(distRespSD.status).to.equal(200);
        // expect(distRespSD.data.orderItems[0].isSuccess).to.equal(true);
    });

    it('should create a subscription from a commodity object', async () => {
        let commodityObjResp = '';
        try {
            commodityObjResp = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCommodityCustOrder.data.id,
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
        expect(commodityObjResp.status).to.equal(200);
        expect(commodityObjResp.data.orderItems[0].isSuccess).to.equal(true);
    });

    it('should create a subscription from a commodity object with Utilities field', async () => {
        let commodityUtilResp = '';
        try {
            commodityUtilResp = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCommodityCustOrderUtilExtn.data.id,
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
        expect(commodityUtilResp.status).to.equal(200);
        expect(commodityUtilResp.data.orderItems[0].isSuccess).to.equal(true);
    });

    it('should not create a subscription when MCM Instance is not found', async () => {
        let commodityObjResp = '';
        try {
            commodityObjResp = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCommodityCustOrderInvalidInstallation.data.id,
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
        expect(commodityObjResp.status).to.equal(200);
        expect(commodityObjResp.data.orderItems[0].isSuccess).to.equal(false);
    });

    it('should not create a subscription from a commodity object when installation is not passed', async () => {
        let commodityObjRespErr = '';
        try {
            commodityObjRespErr = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCommodityCustOrderErr.data.id,
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
        expect(commodityObjRespErr.status).to.equal(200);
        expect(commodityObjRespErr.data.orderItems[0].isSuccess).to.equal(
            false
        );
    });

    it('should Not create Subscription as it is null', async () => {
        subscription.subscriptionDocumentId = null;
        subscription.subscriptionId = null;
        subscription.status = null;

        let NoSubResp = '';
        try {
            NoSubResp = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCustomerOrderNoSub.data.id,
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

        expect(NoSubResp.data.orderItems[0].isSuccess).to.equal(false);
    });

    it('should create a SD Order and Subsequent DisplyID details should be combination of SDOrder + SDItem ', async () => {
        let RespSDSubsequentUpdate = '';
        try {
            RespSDSubsequentUpdate = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCustomerOrderSD.data.id,
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
        // expect(RespSDSubsequentUpdate.status).to.equal(200);
        // expect(RespSDSubsequentUpdate.data.orderItems[0].isSuccess).to.equal(
        //     true
        // );
        // expect(
        //     RespSDSubsequentUpdate.data.orderItems[0].createdDocumentNumber
        // ).to.equal('12345-10');
        // expect(RespSDSubsequentUpdate.data.orderItems[0].orderItemId).to.equal(
        //     '000001'
        // );
    });

    //Negative scenario for SD
    it('should Not create a SD Order  ', async () => {
        let RespSDSubsequentUpdate = '';
        try {
            RespSDSubsequentUpdate = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSDNoMaterialSalesArea.data.id,
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
        // expect(RespSDSubsequentUpdate.status).to.equal(200);
        // expect(RespSDSubsequentUpdate.data.orderItems[0].isSuccess).to.equal(
        //     false
        // );
    });

    //Negative scenario for SD wrong material
    it('should create a SD Order and subsequentDisplayID should not be created ', async () => {
        let RespSDSubsequentDisplayIDNull = '';
        try {
            RespSDSubsequentDisplayIDNull = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respSDSubsequentDisplayIDNull.data.id,
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
        // expect(RespSDSubsequentDisplayIDNull.status).to.equal(200);
        // expect(
        //     RespSDSubsequentDisplayIDNull.data.orderItems[0].isSuccess
        // ).to.equal(false);
    });

    it('should Not create a subscription as unmock is done', async () => {
        unmockAllTestDestinations(setTestDestination);
        let unmockResp = '';

        try {
            unmockResp = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCustomerOrderNoMarket.data.id,
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
        expect(unmockResp.data.orderItems[0].isSuccess).to.equal(false);
    });

    it('should Not create a commodity subscription as unmock is done', async () => {
        unmockAllTestDestinations(setTestDestination);
        let unmockRespCommodity = '';

        try {
            unmockRespCommodity = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCustomerOrderNoTech.data.id,
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
        expect(unmockRespCommodity.data.orderItems[0].isSuccess).to.equal(
            false
        );
    });

    it('should receive message VIA EM', async () => {
        const distributionMessaging = await cds.connect.to(
            'distributionMessaging'
        );

        const {
            event,
            data: baseData,
            headers,
            msg,
        } = require('./payload/EM_sap_c4u_ce_sap_retail_customer_order_created_v1.json');

        const data = JSON.parse(JSON.stringify(baseData));
        data.id = respCustomerOrder.data.id;

        msg.req.authInfo.getAppToken = () => {
            return '123456789';
        };
        msg.req.user = {
            id: admin,
            is: () => true,
        };
        msg.req.error = () => {};

        let tx = distributionMessaging.transaction(msg);
        const spyDistributionMessaging = jest.spyOn(tx, 'emit');

        await tx.emit(event, data, headers);

        jestExpect(spyDistributionMessaging).toBeCalledTimes(1);
    });

    it('should return status 401 Unauthorized', async () => {
        let DistRespNoAuth = '';
        let errorMsg = '';
        try {
            DistRespNoAuth = await POST(
                '/api/internal/distribution/distributeOrder',
                {
                    id: respCustomerOrderNoTech.data.id,
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

    it('should return status 401 Unauthorized for Delete', async () => {
        const RespBusinessScenario = '';
        let errorMsg = '';
        try {
            RespBusinessScenario = await DELETE(
                UtilitiesBusinessScenarios_USB1_API,
                {},
                {
                    auth: 'admin',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            errorMsg = error.message;
            // console.log('errorMsg', errorMsg, 'Error test', error);
            expect(errorMsg).to.equal('401 - Unauthorized');
        }
    });

    it('should return status 403 - Forbidden for Update', async () => {
        const PatchRespBusinessScenario = '';
        let PatchErrorMsg = '';
        try {
            PatchRespBusinessScenario = await PUT(
                UtilitiesBusinessScenarios_USB1_API,
                {
                    sapProvided: true,
                    subscriptionProfile: 'non_commodity',
                    customerOrderType: {
                        code: 'UTIL',
                    },
                    customerOrderItemType: {
                        code: 'USB1',
                    },
                    externalDocumentType: {
                        code: 'NonCommoditySubscription',
                    },
                    businessAction: {
                        code: 'create',
                    },
                },
                {
                    auth: 'admin',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            PatchErrorMsg = error.message;
            expect(PatchErrorMsg).to.equal('403 - Forbidden');
        }
    });
});
