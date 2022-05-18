const cds = require('@sap/cds');
const { expect, launchServer } = require('../lib/testkit');
const jestExpect = require('expect');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
const { or } = require('@sap-cloud-sdk/core');

jest.mock('../../srv/external/SoapClient');
jest.mock('../../srv/external/API_BP_KEY_MAPPING');

describe('BillingAccountServiceInternal it-test UTILITIESCLOUDSOLUTION-3070', () => {
    // enabling mock feature flags
    cds.env.requires.featureFlags = {
        impl: 'test/backend-it/external/FeatureFlagsTestService',
    };
    const { GET, POST, PATCH, PUT, DELETE, admin, user, viewer } = launchServer(
        {
            service: {
                paths: ['srv/api/billingaccount'],
            },
        }
    );

    it('should receive message VIA EM', async () => {
        const contractAccountMessaging = await cds.connect.to(
            'contractAccountMessaging'
        );

        const {
            event,
            data: baseData,
            headers,
            msg,
        } = require('./payload/EM_sap_c4u_ce_sap_retail_billing_account_changed.json');

        const data = JSON.parse(JSON.stringify(baseData));
        data.ContractAccount = '9121';

        msg.req.authInfo.getAppToken = () => {
            return '123456789';
        };
        msg.req.user = {
            id: admin,
            is: () => true,
        };
        msg.req.error = () => {};

        let tx = contractAccountMessaging.transaction(msg);
        const spycontractAccMessaging = jest.spyOn(tx, 'emit');

        await tx.emit(event, data, headers);

        jestExpect(spycontractAccMessaging).toBeCalledTimes(1);
    });

    it('should receive message VIA EM - ContractAccount Display Id is undefined from S4HC', async () => {
        const contractAccountMessaging = await cds.connect.to(
            'contractAccountMessaging'
        );

        const {
            event,
            data: baseData,
            headers,
            msg,
        } = require('./payload/EM_sap_c4u_ce_sap_retail_billing_account_changed.json');

        const data = JSON.parse(JSON.stringify(baseData));
        data.ContractAccount = undefined;

        msg.req.authInfo.getAppToken = () => {
            return '123456789';
        };
        msg.req.user = {
            id: admin,
            is: () => true,
        };
        msg.req.error = () => {};

        let tx = contractAccountMessaging.transaction(msg);
        const spycontractAccMessaging = jest.spyOn(tx, 'emit');

        await tx.emit(event, data, headers);

        jestExpect(spycontractAccMessaging).toBeCalledTimes(2);
    });

    it('should receive message VIA EM - ContractAccount Id is not correctly fetched from S4', async () => {
        const contractAccountMessaging = await cds.connect.to(
            'contractAccountMessaging'
        );

        const {
            event,
            data: baseData,
            headers,
            msg,
        } = require('./payload/EM_sap_c4u_ce_sap_retail_billing_account_changed.json');

        const data = JSON.parse(JSON.stringify(baseData));
        data.ContractAccount = 'abc';

        msg.req.authInfo.getAppToken = () => {
            return '123456789';
        };
        msg.req.user = {
            id: admin,
            is: () => true,
        };
        msg.req.error = () => {};

        let tx = contractAccountMessaging.transaction(msg);
        const spycontractAccMessaging = jest.spyOn(tx, 'emit');

        await tx.emit(event, data, headers);

        jestExpect(spycontractAccMessaging).toBeCalledTimes(3);
    });
});
