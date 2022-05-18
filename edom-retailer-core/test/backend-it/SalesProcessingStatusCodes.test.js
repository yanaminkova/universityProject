const cds = require('@sap/cds');
const axios = require('axios');
const { launchServer } = require('../lib/testkit');
// const functions = require('../lib/functions');

const expect = require('expect');

describe('SalesProcessingSatusCodes.test UTILITIESCLOUDSOLUTION-2574', () => {
    const { GET, POST, PATCH, admin } = launchServer({
        service: {
            paths: ['srv/api'],
        },
    });

    beforeAll(async () => {
        //Dafualt value for testing
        await createSalesProcessingStatus('00', 'Initial', true);

        await createSalesProcessingStatus('01', 'Open', false);
        await createSalesProcessingStatus('02', 'In process', false);
        await createSalesProcessingStatus('03', 'Completed', false);
        await createSalesProcessingStatus('04', 'Canceled', false);
        await createSalesProcessingStatus('05', 'Rejected', false);
    });

    async function createSalesProcessingStatus(code, name, isDefault) {
        try {
            await POST(
                `/api/v1/SalesProcessingStatusCodes`,
                {
                    code,
                    name,

                    isDefault,
                },
                { auth: admin }
            );
        } catch (error) {
            return error.message;
        }
    }

    it('should contain single TRUE value for isDefault of SalesProcessingStatusCodes', async () => {
        await PATCH(
            `/api/v1/SalesProcessingStatusCodes('01')`,
            { isDefault: true },
            { auth: admin }
        );

        const { data } = await GET(
            `/api/v1/SalesProcessingStatusCodes?$filter=isDefault eq true`,
            { auth: admin }
        );

        expect(data).toBeTruthy();

        expect(data.value).toBeTruthy();

        expect(data.value.length).toBe(1);

        expect(data.value[0].code).toBe('01');
    });
});
