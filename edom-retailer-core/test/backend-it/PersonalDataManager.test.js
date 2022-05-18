const { expect, launchServer } = require('../lib/testkit');
const functions = require('../lib/functions');

global.cds.env.features.assert_integrity = false;

describe('DPP_PersonalDataManager.test UTILITIESCLOUDSOLUTION-2259', () => {
    const { GET, pdmUser } = launchServer({
        service: {
            paths: ['srv/dpp'],
        },
    });

    it('should serve `/api/v1/dpp/pdm/$metadata`', async () => {
        const { headers, status, data } = await GET(
            `/api/v1/dpp/pdm/$metadata`,
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
            '<EntitySet Name="CustomerOrder" EntityType="PersonalDataManagerService.CustomerOrder"/>'
        );
        expect(data).to.contain(
            '<EntitySet Name="CustomerOrderItems" EntityType="PersonalDataManagerService.CustomerOrderItems"/>'
        );
        expect(data).to.contain(
            '<Annotations Target="PersonalDataManagerService.EntityContainer/BusinessPartner">'
        );
    });

    it('should serve `/api/v1/dpp/pdm/BusinessPartner` for pdmUser', async () => {
        const type_code = '1020';
        const customerOrder = await functions.createCustomerOrderDB(type_code);
        expect(customerOrder).to.exist;
        const customerOrderPartner =
            await functions.createCustomerOrderPartnerDB(
                'SEHO',
                customerOrder.id
            );
        expect(customerOrderPartner).to.exist;

        const { status, data } = await GET(
            `/api/v1/dpp/pdm/BusinessPartner?$filter=businessPartnerId eq 'SEHO'`,
            {
                auth: pdmUser,
            }
        );
        expect(status).to.equal(200);
        expect(data.value[0].businessPartnerId).to.eql('SEHO');
    });
});
