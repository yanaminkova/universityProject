const cds = require('@sap/cds');
const expect = require('expect');
const { launchServer } = require('../../lib/testkit');

describe('upgradeTenantsPostProcessing.test UTILITIESCLOUDSOLUTION-3079', () => {
    const { GET, admin } = launchServer({
        service: {
            paths: ['srv/api/API_EDOM_RETAILER'],
        },
    });

    beforeAll(async () => {
        const iCompanyCodes = 5;
        let myCompanyId = 'myCompanyId';
        let myCompanyName = 'myCompanyName';
        let oPayload = [];

        for (let i = 0; i < iCompanyCodes; i++) {
            oPayload.push({
                id: myCompanyId + i,
                legacy_name: myCompanyName + i,
            });
        }

        await cds.db.run(
            INSERT.into('sap.odm.orgunit.CompanyCode').entries(oPayload)
        );
    });

    it('should map "legacy_name" of CompanyCode to attribute "name" - UTILITIESCLOUDSOLUTION-3079', async () => {
        db = await cds.connect.to('db');
        const hook = require('../../../srv/hooks/upgradeTenantsPostProcessing');

        await hook(db, [undefined]);

        const newName = 'New Company Name';

        const tenant = undefined;
        const user = new cds.User.Privileged({ tenant });
        const req = {
            user,
            tenant,
        };
        const tx = db.transaction(req);
        await tx.run(
            UPDATE('sap.odm.orgunit.CompanyCode.name')
                .set({ name: newName })
                .where({ up__id: 'myCompanyId0' })
        );
        await tx.commit();

        // repeat twice to make sure that the hook can be run repeatedly and not overwrite the data
        await hook(db, [undefined]);

        const { data: resultSelectFromService } = await GET(
            `/api/v1/CompanyCode`,
            { auth: admin }
        );

        expect(resultSelectFromService.value[0].name).toBe(newName);
        resultSelectFromService.value.forEach((row) => {
            expect(row.name).toBeTruthy();
        });

        const resultSelectCompanyCodeName = await db.run(
            SELECT.from('sap.odm.orgunit.CompanyCode.name')
        );
        resultSelectCompanyCodeName.forEach((row) => {
            expect(row.name).toBeTruthy();
        });

        const resultSelectCompanyCode = await db.run(
            SELECT.from('sap.odm.orgunit.CompanyCode')
        );
        resultSelectCompanyCode.forEach((row) => {
            expect(row.legacy_name).toBeFalsy();
        });
    });
});
