const { expect } = require('../../lib/testkit');
const {
    destinationProperties,
    billingForecasts,
    bill,
    meterConfig,
} = require('../../backend-it/payload/ForecastBITSPayload.js');
const ForecastBITSHelper = require('../../../srv/api/utils/ForecastBITSHelper');

const billDetail = {
    billItems: [
        {
            subscription: { subscriptionDocumentId: 'test' },
        },
    ],
};

describe('ForecastBITSHelper UT-test UTILITIESCLOUDSOLUTION-2979, UTILITIESCLOUDSOLUTION-3066', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return undefined if getSubscription failed.', async () => {
        const SubscriptionBillingAPI = require('../../../srv/external/SubscriptionBillingAPI.js');
        const req = {};
        req.user = {
            locale: 'test',
        };
        // subscription is an empty array
        jest.spyOn(
            SubscriptionBillingAPI,
            'getSubscription'
        ).mockImplementation(() => {
            return [];
        });
        expect(
            await ForecastBITSHelper.getPeriodicBillingForecasts(
                req,
                null,
                billDetail
            )
        ).to.eql(undefined);
        // subscription contains an error message
        jest.spyOn(
            SubscriptionBillingAPI,
            'getSubscription'
        ).mockImplementation(() => {
            return { message: 'error' };
        });
        expect(
            await ForecastBITSHelper.getPeriodicBillingForecasts(
                req,
                null,
                billDetail
            )
        ).to.eql(undefined);
    });

    it('should return undefined if Business Relevant checks fail.', async () => {
        const SubscriptionBillingAPI = require('../../../srv/external/SubscriptionBillingAPI.js');
        const req = {};
        req.user = {
            locale: 'test',
        };
        jest.spyOn(
            SubscriptionBillingAPI,
            'getSubscription'
        ).mockImplementation(() => {
            return [
                {
                    subscriptionProfile: {
                        activateUtilitiesExtension: false,
                    },
                },
            ];
        });
        expect(
            await ForecastBITSHelper.getPeriodicBillingForecasts(
                req,
                null,
                billDetail
            )
        ).to.eql(undefined);
    });

    it('should return undefined if getBillingForecasts failed.', async () => {
        const SubscriptionBillingAPI = require('../../../srv/external/SubscriptionBillingAPI.js');
        const req = {};
        req.user = {
            locale: 'test',
        };
        // billingForecast is not found
        jest.spyOn(
            SubscriptionBillingAPI,
            'getSubscription'
        ).mockImplementation(() => {
            return [
                {
                    subscriptionProfile: {
                        activateUtilitiesExtension: true,
                    },
                },
            ];
        });
        jest.spyOn(
            ForecastBITSHelper,
            'checkBudgetBillingType'
        ).mockImplementation(() => {
            return true;
        });
        jest.spyOn(
            ForecastBITSHelper,
            'checkSubscriptionExpiration'
        ).mockImplementation(() => {
            return false;
        });
        jest.spyOn(
            SubscriptionBillingAPI,
            'getBillingForecasts'
        ).mockImplementation(() => {
            return undefined;
        });
        expect(
            await ForecastBITSHelper.getPeriodicBillingForecasts(
                req,
                null,
                billDetail
            )
        ).to.eql(undefined);
        // billingForecast contains an error message
        jest.spyOn(
            SubscriptionBillingAPI,
            'getBillingForecasts'
        ).mockImplementation(() => {
            return { message: 'error' };
        });
        expect(
            await ForecastBITSHelper.getPeriodicBillingForecasts(
                req,
                null,
                billDetail
            )
        ).to.eql(undefined);
    });

    it('should return undefined if billing forecasts are invalid.', async () => {
        const SubscriptionBillingAPI = require('../../../srv/external/SubscriptionBillingAPI.js');
        const req = {};
        req.user = {
            locale: 'test',
        };
        jest.spyOn(
            SubscriptionBillingAPI,
            'getSubscription'
        ).mockImplementation(() => {
            return [
                {
                    subscriptionProfile: {
                        activateUtilitiesExtension: true,
                    },
                },
            ];
        });
        jest.spyOn(
            ForecastBITSHelper,
            'checkBudgetBillingType'
        ).mockImplementation(() => {
            return true;
        });
        jest.spyOn(
            ForecastBITSHelper,
            'checkSubscriptionExpiration'
        ).mockImplementation(() => {
            return false;
        });
        jest.spyOn(
            SubscriptionBillingAPI,
            'getBillingForecasts'
        ).mockImplementation(() => {
            return {};
        });
        jest.spyOn(
            ForecastBITSHelper,
            'checkBillingForecasts'
        ).mockImplementation(() => {
            return false;
        });
        expect(
            await ForecastBITSHelper.getPeriodicBillingForecasts(
                req,
                null,
                billDetail
            )
        ).to.eql(undefined);
    });

    it('should return correct converted date time.', () => {
        const {
            convertDateTime,
        } = require('../../../srv/api/utils/BITSHelper');
        const timeZone = 'Europe/Berlin';
        let time = '2022-02-28T23:00:00.000Z';
        expect(convertDateTime(timeZone, time).date).to.equal('2022-03-01');
        expect(convertDateTime(timeZone, time, true).time).to.equal('23:59:59');
        time = '2022-02-28T00:00:00.000Z';
        expect(convertDateTime(timeZone, time).date).to.equal('2022-02-28');
        expect(convertDateTime(timeZone, time, true).time).to.equal('00:59:59');
    });

    it('should return the correct condition type.', () => {
        const pricingElement = [
            {
                conditionType: 'SU003',
            },
            {
                conditionType: 'SU01',
            },
            {
                conditionType: 'PMP2-SU02',
            },
            {
                conditionType: 'PMPX-Y00X',
            },
        ];
        // condition type type SU003 is mapped to SU03
        expect(
            ForecastBITSHelper.getConditionType(
                pricingElement[0],
                destinationProperties
            )
        ).to.equal('SU03');
        // condition type type PMP1-SU01 is mapped to SU01
        expect(
            ForecastBITSHelper.getConditionType(
                pricingElement[1],
                destinationProperties
            )
        ).to.equal('SU01');
        // condition type type PMP2-SU02 is mapped to SU02
        expect(
            ForecastBITSHelper.getConditionType(
                pricingElement[2],
                destinationProperties
            )
        ).to.equal('SU02');
        // condition type type not found is mapped to PMPX-Y00X
        expect(
            ForecastBITSHelper.getConditionType(
                pricingElement[3],
                destinationProperties
            )
        ).to.equal('PMPX-Y00X');
    });

    it('should return the correct basic create payload with the given input.', () => {
        const {
            billableItemsBasicCreate,
            billableItemsBasicCreateWithBill,
        } = require('../../backend-it/payload/ForecastBITSPayload.js');
        // without Bill
        expect(
            ForecastBITSHelper.prepareForecastBillableItemsBasicCreate(
                destinationProperties,
                billingForecasts,
                null
            )
        ).to.eql(billableItemsBasicCreate);
        // with Bill
        expect(
            ForecastBITSHelper.prepareForecastBillableItemsBasicCreate(
                destinationProperties,
                billingForecasts,
                bill
            )
        ).to.eql(billableItemsBasicCreateWithBill);
        // statistical
        const billingForecastsAltered = JSON.parse(
            JSON.stringify(billingForecasts)
        );
        billingForecastsAltered.forecasts[0].items[0].pricingElements[0] = {
            step: 110,
            priceElementSpecificationCode: 'RecurringPriceRef',
            name: 'Recurring Price Reference',
            statistical: true,
            conditionType: 'SU15',
            conditionValue: {
                amount: 132.6,
                currency: 'EUR',
            },
        };
        const billableItemsBasicCreateAltered = JSON.parse(
            JSON.stringify(billableItemsBasicCreate)
        );
        billableItemsBasicCreateAltered[0].CAInvcgIsItemPostingRelevant =
            'false';
        expect(
            ForecastBITSHelper.prepareForecastBillableItemsBasicCreate(
                destinationProperties,
                billingForecastsAltered,
                null
            )
        ).to.eql(billableItemsBasicCreateAltered);
    });

    it('should return correct posting create payload with the given input.', () => {
        const {
            billableItemPostingCreate,
            billableItemPostingCreateWithBill,
        } = require('../../backend-it/payload/ForecastBITSPayload.js');
        // without Bill
        expect(
            ForecastBITSHelper.prepareForecastBillableItemsPostingCreate(
                billingForecasts,
                null
            )
        ).to.eql(billableItemPostingCreate);
        // with Bill
        expect(
            ForecastBITSHelper.prepareForecastBillableItemsPostingCreate(
                billingForecasts,
                bill
            )
        ).to.eql(billableItemPostingCreateWithBill);
    });

    it('should return correct text create object with the given input.', () => {
        const {
            billableItemsTextCreate,
        } = require('../../backend-it/payload/ForecastBITSPayload.js');
        expect(
            ForecastBITSHelper.prepareForecastBillableItemsTextCreate(
                billingForecasts
            )
        ).to.eql(billableItemsTextCreate);
    });

    it('should return the correct text payload for the given input.', () => {
        const pricingElement = { step: '100' };
        const sourceTransId = 'sID_TEST';
        const counter = 1;
        const textCreateUTPR = {
            CABllbleItmSourceTransType: 'REVCL',
            CABllbleItmSourceTransId: 'sID_TEST',
            CABllbleItmSourceTransItmID: '000001-100',
            CABllbleItmGroupingTextData: 1,
            TechnicalExtension: {
                CABllbleItmExtnType: 'UTPR',
                CABllbleItmExtnID: 'sID_TEST-000001-100',
            },
        };
        const textCreateUTMR = {
            CABllbleItmSourceTransType: 'REVCL',
            CABllbleItmSourceTransId: 'sID_TEST',
            CABllbleItmSourceTransItmID: '000001-100',
            CABllbleItmGroupingTextData: 1,
            TechnicalExtension: {
                CABllbleItmExtnType: 'UTMR',
                CABllbleItmExtnID: 'sID_TEST-000001-100',
                CABllbleItmExtnItmID: 1,
            },
        };
        // Price
        expect(
            ForecastBITSHelper.prepareForecastBillableItemsTextPayload(
                sourceTransId,
                pricingElement,
                counter,
                'UTPR'
            )
        ).to.eql(textCreateUTPR);
        // Meter Reading Info
        expect(
            ForecastBITSHelper.prepareForecastBillableItemsTextPayload(
                sourceTransId,
                pricingElement,
                counter,
                'UTMR'
            )
        ).to.eql(textCreateUTMR);
    });

    it('should return the correct meter info object for the given input.', () => {
        const {
            billableItemsMeterInfoCreate,
        } = require('../../backend-it/payload/ForecastBITSPayload.js');
        expect(
            ForecastBITSHelper.prepareForecastBillableItemsMeterInfoCreate(
                billingForecasts,
                meterConfig
            )
        ).to.eql(billableItemsMeterInfoCreate);
    });

    it('should return the correct price object for the given input.', () => {
        const {
            billableItemsPriceCreate,
        } = require('../../backend-it/payload/ForecastBITSPayload.js');
        expect(
            ForecastBITSHelper.prepareForecastBillableItemsPriceCreate(
                billingForecasts
            )
        ).to.eql(billableItemsPriceCreate);
    });

    it('should create a full payload given all inputs.', () => {
        const {
            billableItemsPayload,
        } = require('../../backend-it/payload/ForecastBITSPayload.js');
        expect(
            ForecastBITSHelper.prepareForecastBillableItemsCreateRequestPayload(
                destinationProperties,
                billingForecasts,
                meterConfig
            )
        ).to.eql(billableItemsPayload);
    });

    it('should return true with a validUntil in future.', () => {
        let date = new Date();
        let subscription = {
            validUntil: date.setHours(date.getHours() + 1),
        };
        expect(
            ForecastBITSHelper.checkSubscriptionValidUntil(subscription)
        ).to.equal(true);
    });

    it('should return true with an expired subscription status.', () => {
        let subscription = {
            status: 'Expired',
        };
        expect(
            ForecastBITSHelper.checkSubscriptionExpiration(subscription)
        ).to.equal(true);
    });

    it('should return true if budget billing type has a value.', () => {
        let subscription = {};
        subscription.utilitiesExtension = {
            budgetBillingType: 'value',
        };
        expect(
            ForecastBITSHelper.checkBudgetBillingType(subscription)
        ).to.equal(true);
    });

    it('should return true if billing forecasts contains items, false if forecasts or items are empty.', () => {
        let billingForecasts = {};
        let forecast = {};
        forecast.items = new Array('i1', 'i2');
        billingForecasts.forecasts = new Array(forecast);
        // with items
        expect(
            ForecastBITSHelper.checkBillingForecasts(billingForecasts)
        ).to.equal(true);
        // without items
        forecast.items = new Array();
        expect(
            ForecastBITSHelper.checkBillingForecasts(billingForecasts)
        ).to.equal(false);
        // no forecasts
        billingForecasts.forecasts = new Array();
        expect(
            ForecastBITSHelper.checkBillingForecasts(billingForecasts)
        ).to.equal(false);
    });
});
