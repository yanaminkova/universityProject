const { expect, launchServer } = require('../lib/testkit');
const functions = require('../lib/functions');
const cds = require('@sap/cds');

global.cds.env.features.assert_integrity = false;

describe('BillingAccountPDMService it-test', () => {
    const { GET, pdmUser } = launchServer({
        service: {
            paths: ['srv/dpp'],
        },
    });

    let baId;
    let bpId;

    before(async () => {
        const billAcct = await functions.createBillingAccountDB();
        expect(billAcct).to.exist;
        const db = await cds.connect.to('db');

        const billingAccount = await db.run(
            SELECT.one
                .from(`sap.odm.utilities.billingaccount.BillingAccount.partner`)
                .where({
                    up__id: billAcct.id,
                })
        );

        bpId = billingAccount.businessPartner_id;
        baId = billAcct.id;
    });

    it('should serve `/api/billingAccount/v1/pdm/metadata`', async () => {
        const { headers, status, data } = await GET(
            `/api/billingAccount/v1/pdm/$metadata`,
            {
                auth: pdmUser,
            }
        );

        expect(status).to.equal(200);
        expect(headers).to.contain({
            'content-type': 'application/xml',
            'odata-version': '4.0',
        });
        expect(data).to.contain(
            '<EntitySet Name="BillingAccount" EntityType="BillingAccountPDMService.BillingAccount"/>'
        );
        expect(data).to.contain(
            '<Annotations Target="BillingAccountPDMService.EntityContainer/BusinessPartner">'
        );
    });

    it('should serve `/api/billingAccount/v1/pdm/BusinessPartner with Business Partner ID` for pdmUser', async () => {
        const { status, data } = await GET(
            `/api/billingAccount/v1/pdm/BusinessPartner?$filter=id eq ${bpId}`,
            {
                auth: pdmUser,
            }
        );
        expect(status).to.equal(200);
        expect(data.value[0].id).to.eql(bpId);
    });

    it('should serve `/api/billingAccount/v1/pdm/BillingAccount with Billing Account ID` for pdmUser', async () => {
        const { status, data } = await GET(
            `/api/billingAccount/v1/pdm/BillingAccount/${baId}`,
            {
                auth: pdmUser,
            }
        );
        expect(status).to.equal(200);
        expect(data.businessPartner_id).to.eql(bpId);
    });

    it('should serve `/api/billingAccount/v1/pdm/BillingAccount with Business Partner ID` for pdmUser', async () => {
        const { status, data } = await GET(
            `/api/billingAccount/v1/pdm/BillingAccount?$filter=businessPartner_id eq ${bpId}`,
            {
                auth: pdmUser,
            }
        );
        expect(status).to.equal(200);
        expect(data.value[0].businessPartner_id).to.eql(bpId);
    });
});
