const cds = require('@sap/cds');
const expect = require('expect');
const { launchServer } = require('../../lib/testkit');
const functions = require('../../lib/functions');
const {
    bpPersonValid,
} = require('../payload/BusinessPartnerValidationMockPayloads.js');

global.cds.env.features.assert_integrity = false;

describe('DataRetentionManagerService.BusinessPartner it-test UTILITIESCLOUDSOLUTION-2916', () => {
    const { GET, POST, drmUser, admin, user } = launchServer({
        service: {
            paths: [
                ['srv/dpp', 'srv/dpp'],
                ['srv/api', 'srv/api'],
            ],
        },
    });

    const currDate = new Date();
    const futureDate = new Date(
        currDate.getFullYear(),
        currDate.getMonth() + 1,
        currDate.getDate()
    ).toISOString();
    const pastDate = new Date(
        currDate.getFullYear(),
        currDate.getMonth() - 1,
        currDate.getDate()
    ).toISOString();

    const bpNamespace = `sap.odm.businesspartner.BusinessPartner`;
    const baNamespace = `sap.odm.utilities.billingaccount.BillingAccount`;
    const emailAddress1 = 'test1@test.com';
    const emailAddress2 = 'test2@test.com';

    before(async () => {
        const drm = await cds.connect.to('DataRetentionManagerService');
        drm.registerLegalGround(
            'CustomerOrder',
            require('../../../srv/dpp/legalGrounds/CustomerOrderLegalGround')
        );
        drm.registerDataSubject(
            'BusinessPartner',
            require('../../../srv/dpp/dataSubjects/BusinessPartnerDataSubject')
        );
        cds.db = await cds.connect.to('db');

        const { status: status_dataController } = await POST(
            `/api/v1/dpp/drm/DataController`,
            {
                id: 'a05b4483-77d3-42fd-abf8-a9277f7cf433',
                name: 'Leading Cloud ERP company',
                displayId: 'SAP SE',
            },
            {
                auth: admin,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        expect(status_dataController).toBe(201);
    });

    it('should serve /api/v1/dpp/legalEntities/BusinessPartner', async () => {
        const { data } = await GET(
            `/api/v1/dpp/legalEntities/BusinessPartner()`,
            {
                auth: drmUser,
            }
        );

        expect(data[0].value).toBe('SAP SE');
        expect(data[0].valueDesc).toBe('Leading Cloud ERP company');
    });

    it('should return DataSubjectInformation', async () => {
        // create two business partners
        const bpId1 = cds.utils.uuid();
        const bp1 = await functions.createBusinessPartnerDB({
            id: bpId1,
            displayId: 'User1',
            isBlocked: false,
            addressData: [
                {
                    emailAddresses: [
                        {
                            address: emailAddress1,
                        },
                    ],
                },
            ],
        });
        const bpId2 = cds.utils.uuid();
        const bp2 = await functions.createBusinessPartnerDB({
            id: bpId2,
            displayId: 'User2',
            isBlocked: false,
            addressData: [
                {
                    emailAddresses: [
                        {
                            address: emailAddress2,
                        },
                    ],
                },
            ],
        });

        const { data } = await POST(
            `/api/v1/dpp/drm/dataSubjectInformation`,
            {
                applicationGroupName: 'EDoM',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectIds: ['User1', 'User2'],
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        expect(data.length).toBe(2);
        expect(data[0].dataSubjectId).toBe(bpId1);
        expect(data[0].name).toBe(bp1.displayId);
        expect(data[0].emailId).toBe(emailAddress1);
        expect(data[1].dataSubjectId).toBe(bpId2);
        expect(data[1].name).toBe(bp2.displayId);
        expect(data[1].emailId).toBe(emailAddress2);
    });

    it('should block BP and associated BAs when dataSubjectDeletion is called', async () => {
        // bpPastEOB should be blocked
        const bpPastEOBId1 = cds.utils.uuid();
        const bpPastEOBData1 = {
            id: bpPastEOBId1,
            displayId: 'willBlock1',
            isBlocked: false,
        };
        const bpPastEOB1 = await functions.createBusinessPartnerDB(
            bpPastEOBData1
        );
        expect(bpPastEOB1).toBeTruthy();

        const ba1 = await functions.createBillingAccountDB(bpPastEOBId1);
        const ba2 = await functions.createBillingAccountDB(bpPastEOBId1);
        const ba3 = await functions.createBillingAccountDB(bpPastEOBId1);
        expect(ba1).toBeTruthy();
        expect(ba2).toBeTruthy();
        expect(ba3).toBeTruthy();

        const bpPastEOBId2 = cds.utils.uuid();
        const bpPastEOBData2 = {
            id: bpPastEOBId2,
            displayId: 'willBlock2',
            isBlocked: false,
        };
        const bpPastEOB2 = await functions.createBusinessPartnerDB(
            bpPastEOBData2
        );
        expect(bpPastEOB2).toBeTruthy();

        // no Billing Accounts associated

        const postResponse1 = await POST(
            `/api/v1/dpp/drm/dataSubjectDeletion`,
            {
                applicationGroupName: 'EDoM',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: 'willBlock1',
                maxDeletionDate: futureDate,
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const blockedBp1 = await cds.db.run(
            SELECT.one.from(bpNamespace).where({ id: bpPastEOBId1 })
        );
        expect(blockedBp1).toBeTruthy();
        expect(blockedBp1.isBlocked).toBe(true);
        expect(new Date(blockedBp1.maxDeletionDate).toISOString()).toBe(
            futureDate
        );

        const blockedBAs = await cds.db.run(
            SELECT.from(baNamespace).where({ id: [ba1.id, ba2.id, ba3.id] })
        );
        blockedBAs.forEach((blockedBA) => {
            expect(blockedBA.isBlocked).toBeTruthy();
        });

        const postResponse2 = await POST(
            `/api/v1/dpp/drm/dataSubjectDeletion`,
            {
                applicationGroupName: 'EDoM',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: 'willBlock2',
                maxDeletionDate: futureDate,
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(postResponse2?.data).toBe('');

        const blockedBp2 = await cds.db.run(
            SELECT.one.from(bpNamespace).where({ id: bpPastEOBId2 })
        );
        expect(blockedBp2).toBeTruthy();
        expect(blockedBp2.isBlocked).toBe(true);
        expect(new Date(blockedBp2.maxDeletionDate).toISOString()).toBe(
            futureDate
        );
    });

    it('should only delete BP if its blocked and its maxDeletionDate has passed when dataSubjectsDestroying is called', async () => {
        // bpNotBlocked should not be deleted
        const bpNotBlockedId = cds.utils.uuid();
        const bpNotBlockedData = {
            id: bpNotBlockedId,
            displayId: 'notBlocked',
            isBlocked: false,
        };
        const bpNotBlocked = await functions.createBusinessPartnerDB(
            bpNotBlockedData
        );
        expect(bpNotBlocked).toBeTruthy();

        const ba1 = await functions.createBillingAccountDB(bpNotBlockedId);
        const ba2 = await functions.createBillingAccountDB(bpNotBlockedId);
        expect(ba1).toBeTruthy();
        expect(ba2).toBeTruthy();

        // bpBlockedFutureMDD should not be deleted
        const bpBlockedFutureMDDId = cds.utils.uuid();
        const bpBlockedFutureMDDData = {
            id: bpBlockedFutureMDDId,
            displayId: 'notDeleted',
            isBlocked: false,
        };
        let bpBlockedFutureMDD = await functions.createBusinessPartnerDB(
            bpBlockedFutureMDDData
        );
        expect(bpBlockedFutureMDD).toBeTruthy();

        const ba3 = await functions.createBillingAccountDB(
            bpBlockedFutureMDDId
        );
        const ba4 = await functions.createBillingAccountDB(
            bpBlockedFutureMDDId
        );
        expect(ba3).toBeTruthy();
        expect(ba4).toBeTruthy();

        const postResponse1 = await POST(
            `/api/v1/dpp/drm/dataSubjectDeletion`,
            {
                applicationGroupName: 'EDoM',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: 'notDeleted',
                maxDeletionDate: futureDate,
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(postResponse1?.data).toBe('');

        // bpBlockedPastMDD should be deleted
        const bpBlockedPastMDDId1 = cds.utils.uuid();
        const bpBlockedPastMDDData1 = {
            id: bpBlockedPastMDDId1,
            displayId: 'isDeleted1',
            isBlocked: false,
        };
        let bpBlockedPastMDD1 = await functions.createBusinessPartnerDB(
            bpBlockedPastMDDData1
        );
        expect(bpBlockedPastMDD1).toBeTruthy();

        const ba5 = await functions.createBillingAccountDB(bpBlockedPastMDDId1);
        const ba6 = await functions.createBillingAccountDB(bpBlockedPastMDDId1);
        expect(ba5).toBeTruthy();
        expect(ba6).toBeTruthy();

        const postResponse2 = await POST(
            `/api/v1/dpp/drm/dataSubjectDeletion`,
            {
                applicationGroupName: 'EDoM',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: 'isDeleted1',
                maxDeletionDate: pastDate,
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(postResponse2?.data).toBe('');

        // bpBlockedPastMDD should be deleted
        const bpBlockedPastMDDId2 = cds.utils.uuid();
        const bpBlockedPastMDDData2 = {
            id: bpBlockedPastMDDId2,
            displayId: 'isDeleted2',
            isBlocked: false,
        };
        let bpBlockedPastMDD2 = await functions.createBusinessPartnerDB(
            bpBlockedPastMDDData2
        );
        expect(bpBlockedPastMDD2).toBeTruthy();

        // no Billing Accounts associated

        const postResponse3 = await POST(
            `/api/v1/dpp/drm/dataSubjectDeletion`,
            {
                applicationGroupName: 'EDoM',
                dataSubjectRole: 'BusinessPartner',
                dataSubjectID: 'isDeleted2',
                maxDeletionDate: pastDate,
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(postResponse3?.data).toBe('');

        const postResponse = await POST(
            `/api/v1/dpp/drm/dataSubjectsDestroying`,
            {
                applicationGroupName: 'EDoM',
                dataSubjectRole: 'BusinessPartner',
            },
            {
                auth: drmUser,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        expect(postResponse?.data).toBe('');

        // expect bpNotBlocked and bpBlockedFutureMDD to exist
        const notBlockedBp = await cds.db.run(
            SELECT.one.from(bpNamespace).where({ id: bpNotBlockedId })
        );
        const blockedBpFutureMDD = await cds.db.run(
            SELECT.one.from(bpNamespace).where({ id: bpBlockedFutureMDDId })
        );
        expect(notBlockedBp).toBeTruthy();
        expect(blockedBpFutureMDD).toBeTruthy();

        // expect ba1, ba2, ba3, ba4 to exist
        const notDeletedBAs = await cds.db.run(
            SELECT.from(baNamespace).where({
                id: [ba1.id, ba2.id, ba3.id, ba4.id, ba5.id, ba6.id],
            })
        );
        expect(notDeletedBAs).toHaveLength(4);

        const notBlockedNotDeletedBAs = await cds.db.run(
            SELECT.from(baNamespace).where({ id: [ba1.id, ba2.id] })
        );
        notBlockedNotDeletedBAs.forEach((blockedBA) => {
            expect(blockedBA.isBlocked).toBeFalsy();
        });
        const blockedNotDeletedBAs = await cds.db.run(
            SELECT.from(baNamespace).where({ id: [ba3.id, ba4.id] })
        );
        blockedNotDeletedBAs.forEach((blockedBA) => {
            expect(blockedBA.isBlocked).toBeTruthy();
        });

        // expect bpBlockedPastMDD1 and bpBlockedPastMDD2 to have been deleted
        const blockedBpPastMDD = await cds.db.run(
            SELECT.from(bpNamespace).where({
                id: [bpBlockedPastMDDId1, bpBlockedPastMDDId2],
            })
        );
        expect(blockedBpPastMDD).toHaveLength(0);

        // expect ba5, ba6 to have been deleted
        const deletedBAs = await cds.db.run(
            SELECT.from(baNamespace).where({ id: [ba5.id, ba6.id] })
        );
        expect(deletedBAs).toHaveLength(0);
    });
});
