const axios = require('axios').default;
const expect = require('expect');

const auth = {
    username: 'admin',
    password: 'admin',
};

const i18nCheck = require('../lib/i18nUIcheck.js');

/**
 * Test goal: This test checks whether all i18n annotations for customer-order APP have an entry in i18n.properties
 */
describe('customer-order UI annotations test', () => {
    let devServer, devUrl;

    beforeAll(async () => {
        devServer = await require('@sap/cds/server')({
            port: '0',
            from: ['./ui-services/srv', './app/customer-order/annotations.cds'],
        });
        devUrl = `http://localhost:${devServer.address().port}`;
    });

    afterAll(async () => {
        if (devServer?.close) {
            devServer.close();
        }
    });

    const annotationsFilePath = `${__dirname}/../../app/customer-order/annotations.cds`;

    it('should not return any missing i18n keys', async () => {
        const result = await axios.get(`${devUrl}/api/v1/ui/$metadata`, {
            auth,
        });
        const missingKeys = i18nCheck.checkForMissingKeys(
            annotationsFilePath,
            result.data
        );

        expect(result.status).toBe(200);
        expect(missingKeys).toHaveLength(0);
    });
});
