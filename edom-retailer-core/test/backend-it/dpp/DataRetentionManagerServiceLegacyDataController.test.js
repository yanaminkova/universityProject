const cds = require('@sap/cds');
const { expect, launchServer } = require('../../lib/testkit');
const path = require('path');

describe('DataRetentionManagerService.CustomerOrder', () => {
    const { GET, POST, drmUser } = launchServer({
        service: {
            paths: [
                ['srv/dpp', 'srv/beta/dpp'],
                ['srv/api', 'srv/beta/api'],
            ],
        },
    });

    before(async () => {
        const csn = await cds.load(path.join(__dirname, '../../../db'));

        const dbOptions = {
            in_memory: true,
            credentials: { database: ':memory:' },
        };
        cds.db = await cds.connect.to('db', dbOptions);
        await cds.deploy(csn).to(cds.db, dbOptions);

        cds.db.run(
            INSERT.into('sap.odm.dpp.DataController').entries([
                {
                    id: 'a05b4483-77d3-42fd-abf8-a9277f7cf433',
                    name: 'Legal Entity',
                    displayId: 'SAP SE',
                },
                {
                    id: 'a05b4483-77d3-42fd-abf8-a9277f7cf453',
                    name: 'Legal Entity Description',
                    displayId: 'Leading Cloud ERP company',
                },
            ])
        );
    });

    it('should return the dataSubjectLegalEntities if there exist multiple entries for data controller in order to ensure compatibility with legacy configuration #1772', async () => {
        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectLegalEntities`,
            {
                legalGround: 'CustomerOrder',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: '',
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        expect(data[0].legalEntity).to.equal('SAP SE');
    });

    it('should serve /api/v1/dpp/legalEntities/BusinessPartner if there exist multiple entries for data controller in order to ensure compatibility with legacy configuration #1772', async () => {
        const { data } = await GET(
            `/api/v1/dpp/legalEntities/BusinessPartner()`,
            {
                auth: drmUser,
            }
        );

        expect(data[0].value).to.eql('SAP SE');
        expect(data[0].valueDesc).to.eql('Leading Cloud ERP company');
    });
});
