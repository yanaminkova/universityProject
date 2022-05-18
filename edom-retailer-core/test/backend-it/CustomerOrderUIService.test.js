const axios = require('axios').default;
const expect = require('expect');
const cds = require('@sap/cds');
const path = require('path');

const auth = {
    username: 'admin',
    password: 'admin',
};

/**
 * Test goal: This test checks whether all i18n annotations for customer-order APP have an entry in i18n.properties
 */
describe('CustomerOrderUIService test', () => {
    let devServer, devUrl;

    it('should create valid url link for customer order subsequent document id', async () => {
        const customerOrderId = cds.utils.uuid();
        const itemId = '100001';
        const typeCode = 'TT12';

        const customerOrderItemUtilitiesSubsequentDocumentCodes = {
            code: typeCode,
            name: 'test',
            descr: 'test',
            urlPattern:
                'https://&lt;tenant&gt;.eu10.revenue.cloud.sap/launchpad#Subscriptions-list&/subscriptions/&lt;SUBSEQUENTDOCUMENTID&gt;',
        };

        devServer = await require('@sap/cds/server')({
            port: '0',
            from: ['./srv'],
        });
        devUrl = `http://localhost:${devServer.address().port}`;

        const result1 = await axios.post(
            `${devUrl}/api/v1/CustomerOrderItemUtilitiesSubsequentDocumentCodes`,
            customerOrderItemUtilitiesSubsequentDocumentCodes,
            {
                auth,
            }
        );

        expect(result1.status).toBe(201);

        const customerOrder = {
            id: customerOrderId,
            isBlocked: false,
            items: [
                {
                    id: itemId,
                    utilitiesAspect: {
                        formerServiceProvider: 'formerServiceProvider',
                        subsequentDocument: {
                            type: { code: typeCode },
                            id: '1e5e535a-dd32-11ea-87d0-0242ac130005',
                            displayId: '1001',
                        },
                    },
                },
            ],
        };

        const result2 = await axios.post(
            `${devUrl}/api/v1/CustomerOrder`,
            customerOrder,
            {
                auth,
            }
        );

        expect(result2.status).toBe(201);

        if (devServer?.close) {
            devServer.close();
        }

        devServer = await require('@sap/cds/server')({
            port: '0',
            from: ['./ui-services/srv', './app/customer-order/annotations.cds'],
        });
        devUrl = `http://localhost:${devServer.address().port}`;

        const result = await axios.get(
            `${devUrl}/api/v1/ui/CustomerOrder(${customerOrderId})/items(id='${itemId}')?$expand=utilitiesAspect($expand=subsequentDocument($expand=type))`,
            {
                auth,
            }
        );

        if (devServer?.close) {
            devServer.close();
        }

        expect(result.status).toBe(200);
        expect(result.data.utilitiesAspect.subsequentDocument.type.url).toBe(
            'https://undefined.eu10.revenue.cloud.sap/launchpad#Subscriptions-list&/subscriptions/1E5E535A-DD32-11EA-87D0-0242AC130005'
        );
    });
});
