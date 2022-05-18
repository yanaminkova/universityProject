const expect = require('expect');
const path = require('path');
const cds = require('@sap/cds');
const BusinessPartnerDataSubject = require('../../../../srv/dpp/dataSubjects/BusinessPartnerDataSubject');
const {
    createBusinessPartnerDB,
    createBillingAccountDB,
} = require('../../../lib/functions');

global.cds.env.features.assert_integrity = false;

describe('BusinessPartnerDataSubject it-test UTILITIESCLOUDSOLUTION-2916', () => {
    const bpNamespace = `sap.odm.businesspartner.BusinessPartner`;
    const baNamespace = `sap.odm.utilities.billingaccount.BillingAccount`;

    let req;
    let userId1;
    let userId2;
    let userId3;
    let userId4;
    let userId5;
    const addressDataId2 = 'd4d682d2-dc96-466f-a880-a9199e1f4fe8';
    const addressDataId4 = '2b8ab437-a8cc-49dc-b6c5-4adf564a3452';
    const emailId2 = '84485507-0eab-4802-8cc7-e001dc8c6bcc';
    const emailId4 = '2883cf09-69c4-4ebc-9484-34caa9edc9bb';
    const emailAddress2 = 'test2@test.com';
    const emailAddress4 = 'test5@test.com';
    const currDate = new Date();
    const futureDate = new Date(
        currDate.getFullYear(),
        currDate.getMonth() + 1,
        currDate.getDate()
    ).toISOString();
    let billingAccountId1;
    let billingAccountId2;
    let billingAccountId3;
    let billingAccountId4;
    let billingAccountId5;
    let billingAccountId6;

    beforeAll(async () => {
        const csn = await cds.load([
            path.join(__dirname, '../../../../srv'),
            path.join(__dirname, '../../../../db'),
        ]);

        const dbOptions = {
            in_memory: true,
            credentials: { database: ':memory:' },
        };
        cds.db = await cds.connect.to('db', dbOptions);
        await cds.deploy(csn).to(cds.db, dbOptions);

        ({ id: userId0 } = await createBusinessPartnerDB({
            displayId: null,
            isBlocked: false,
        }));
        ({ id: userId1 } = await createBusinessPartnerDB({
            displayId: 'User1',
            isBlocked: true,
            maxDeletionDate: futureDate,
            addressData: [{}],
        }));
        ({ id: userId2 } = await createBusinessPartnerDB({
            displayId: 'User2',
            isBlocked: false,
            addressData: [
                {},
                {
                    id: addressDataId2,
                    emailAddresses: [
                        {
                            id: emailId2,
                            address: emailAddress2,
                        },
                    ],
                },
            ],
        }));
        ({ id: userId3 } = await createBusinessPartnerDB({
            displayId: 'User3',
            isBlocked: false,
        }));
        ({ id: userId4 } = await createBusinessPartnerDB({
            displayId: 'User4',
            isBlocked: false,
            addressData: [
                {
                    id: addressDataId4,
                    emailAddresses: [{ id: emailId4, address: emailAddress4 }],
                },
            ],
        }));
        ({ id: userId5 } = await createBusinessPartnerDB({
            displayId: 'User5',
            isBlocked: false,
        }));
        ({ id: userId6 } = await createBusinessPartnerDB({
            displayId: null,
            isBlocked: false,
        }));
        ({ id: billingAccountId1 } = await createBillingAccountDB(userId3));
        ({ id: billingAccountId2 } = await createBillingAccountDB(userId3));
        ({ id: billingAccountId3 } = await createBillingAccountDB(userId3));
        ({ id: billingAccountId4 } = await createBillingAccountDB(userId4));
        ({ id: billingAccountId5 } = await createBillingAccountDB(userId2));
        ({ id: billingAccountId6 } = await createBillingAccountDB(userId2));
    });

    beforeEach(async () => {
        req = {};
    });

    it('should getEntitiesByCondition with condition isBlocked=true', async () => {
        const entities =
            await BusinessPartnerDataSubject.getEntitiesByCondition(
                req,
                { isBlocked: true },
                ['id', 'displayId']
            );

        expect(entities.length).toBe(1);
        expect(entities[0].displayId).toBe('User1');
    });

    it('should getEntitiesByCondition with condition they are not in provided the list of BPs', async () => {
        let displayIds = ['User2', 'User3'];
        let guids = [userId1, userId3];

        const legalGroundsWithDataSubject =
            await BusinessPartnerDataSubject.getEntitiesByCondition(
                req,
                ['displayId not in', displayIds, 'and id not in', guids],
                ['id', 'displayId']
            );

        displayIds = legalGroundsWithDataSubject.map((x) => x.displayId);
        guids = legalGroundsWithDataSubject.map((x) => x.id);

        expect(displayIds).toContain('User4');
        expect(displayIds).toContain('User5');
        expect(displayIds).not.toContain('User1');
        expect(displayIds).not.toContain('User2');
        expect(displayIds).not.toContain('User3');

        expect(guids).toContain(userId4);
        expect(guids).toContain(userId5);
        expect(guids).not.toContain(userId1);
        expect(guids).not.toContain(userId2);
        expect(guids).not.toContain(userId3);
    });

    it('should blockEntity using displayId (BP with associated BA)', async () => {
        req = {};
        const maxDeletionDate = '2021-06-25T00:00:00Z';
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await BusinessPartnerDataSubject.blockEntity(
            req,
            'User2',
            maxDeletionDate
        );

        const blockedBPs = await cds.db.run(
            SELECT.from(bpNamespace).where({
                id: userId2,
            })
        );

        expect(blockedBPs.length).toBe(1);
        expect(blockedBPs[0].isBlocked).toBe(true);
        expect(blockedBPs[0].id).toBe(userId2);
        expect(blockedBPs[0].maxDeletionDate).toBe(maxDeletionDate);

        const blockedBaPartners = await cds.db.run(
            SELECT.from(`${baNamespace}.partner`).where({
                businessPartner_id: userId2,
            })
        );
        expect(blockedBaPartners.length).toBe(2);

        const blockedBaIds = blockedBaPartners.map((ba) => ba.up__id);
        const blockedBAs = await cds.db.run(
            SELECT.from(baNamespace, (ba) => {
                ba('id');
                ba('isBlocked');
                ba.partner((p) => {
                    p.isBlocked; // NOSONAR
                    p.paymentControl((pc) => {
                        pc.isBlocked; // NOSONAR

                        pc.incomingPayment(['isBlocked']);
                        pc.outgoingPayment(['isBlocked']);
                    });
                    p.accountManagementData((am) => {
                        am.isBlocked; // NOSONAR
                    });
                    p.taxControl((tc) => {
                        tc.isBlocked; // NOSONAR
                    });
                    p.dunningControl(['isBlocked']);
                });
            }).where({
                id: blockedBaIds,
            })
        );

        expect(blockedBAs.length).toBe(2);
        blockedBAs.forEach((blockedBA) => {
            expect(
                blockedBA.isBlocked &&
                    blockedBA.partner.isBlocked &&
                    blockedBA.partner.paymentControl.isBlocked &&
                    blockedBA.partner.paymentControl.incomingPayment
                        .isBlocked &&
                    blockedBA.partner.paymentControl.outgoingPayment
                        .isBlocked &&
                    blockedBA.partner.accountManagementData.isBlocked &&
                    blockedBA.partner.taxControl.isBlocked &&
                    blockedBA.partner.dunningControl.isBlocked
            ).toBeTruthy();
        });
    });

    it('should blockEntity using id (guid) (BP with associated BA)', async () => {
        const maxDeletionDate = '2021-06-25T00:00:00Z';
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await BusinessPartnerDataSubject.blockEntity(
            req,
            userId3,
            maxDeletionDate
        );

        const blockedBPs = await cds.db.run(
            SELECT.from(bpNamespace).where({
                id: userId3,
            })
        );

        expect(blockedBPs.length).toBe(1);
        expect(blockedBPs[0].isBlocked).toBe(true);
        expect(blockedBPs[0].id).toBe(userId3);
        expect(blockedBPs[0].maxDeletionDate).toBeNull;

        const blockedBaPartners = await cds.db.run(
            SELECT.from(`${baNamespace}.partner`).where({
                businessPartner_id: userId3,
            })
        );
        expect(blockedBaPartners.length).toBe(3);

        const blockedBaIds = blockedBaPartners.map((ba) => ba.up__id);
        const blockedBAs = await cds.db.run(
            SELECT.from(baNamespace, (ba) => {
                ba('id');
                ba('isBlocked');
                ba.partner((p) => {
                    p.isBlocked; // NOSONAR
                    p.paymentControl((pc) => {
                        pc.isBlocked; // NOSONAR

                        pc.incomingPayment(['isBlocked']);
                        pc.outgoingPayment(['isBlocked']);
                    });
                    p.accountManagementData((am) => {
                        am.isBlocked; // NOSONAR
                    });
                    p.taxControl((tc) => {
                        tc.isBlocked; // NOSONAR
                    });
                    p.dunningControl(['isBlocked']);
                });
            }).where({
                id: blockedBaIds,
            })
        );

        expect(blockedBAs.length).toBe(3);
        blockedBAs.forEach((blockedBA) => {
            expect(
                blockedBA.isBlocked &&
                    blockedBA.partner.isBlocked &&
                    blockedBA.partner.paymentControl.isBlocked &&
                    blockedBA.partner.paymentControl.incomingPayment
                        .isBlocked &&
                    blockedBA.partner.paymentControl.outgoingPayment
                        .isBlocked &&
                    blockedBA.partner.accountManagementData.isBlocked &&
                    blockedBA.partner.taxControl.isBlocked &&
                    blockedBA.partner.dunningControl.isBlocked
            ).toBeTruthy();
        });
    });

    it('should blockEntity using id (guid) (BP without associated BA)', async () => {
        req = {};
        const maxDeletionDate = '2021-06-25T00:00:00Z';
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await BusinessPartnerDataSubject.blockEntity(
            req,
            userId5,
            maxDeletionDate
        );

        const blockedBPs = await cds.db.run(
            SELECT.from(bpNamespace).where({
                id: userId5,
            })
        );

        expect(blockedBPs.length).toBe(1);
        expect(blockedBPs[0].isBlocked).toBe(true);
        expect(blockedBPs[0].id).toBe(userId5);
        expect(blockedBPs[0].maxDeletionDate).toBe(maxDeletionDate);

        const blockedBaPartners = await cds.db.run(
            SELECT.from(`${baNamespace}.partner`).where({
                businessPartner_id: userId5,
            })
        );
        expect(blockedBaPartners.length).toBe(0);
    });
    it('should deleteBlockedEntities with expired maxDeletionDate', async () => {
        await BusinessPartnerDataSubject.deleteBlockedEntities(req);

        // await new Promise((resolve) => setTimeout(resolve, 1000));
        const blockedBPs = await cds.db.run(
            SELECT.from(bpNamespace).where({
                id: [userId1, userId2, userId3, userId4, userId5],
            })
        );

        expect(blockedBPs.length).toBe(2);

        let user1 = blockedBPs[0];
        let user4 = blockedBPs[1];
        if (user1?.id !== userId1) {
            user1 = blockedBPs[1];
            user4 = blockedBPs[0];
        }

        expect(user1.isBlocked).toBe(true);
        expect(user1.id).toBe(userId1);
        expect(new Date(user1.maxDeletionDate).toISOString()).toBe(futureDate);

        expect(user4.isBlocked).toBe(false);
        expect(user4.id).toBe(userId4);
        expect(user4.maxDeletionDate).toBeNull;

        const blockedBAs = await cds.db.run(
            SELECT.from(baNamespace).where({
                id: [
                    billingAccountId1,
                    billingAccountId2,
                    billingAccountId3,
                    billingAccountId4,
                    billingAccountId5,
                    billingAccountId6,
                ],
            })
        );

        expect(blockedBAs.length).toBe(1);
        expect(blockedBAs[0].isBlocked).toBe(false);
        expect(blockedBAs[0].id).toBe(billingAccountId4);
    });

    it('should getEntitiesByIds of two data subject ids User 1 and User 5', async () => {
        const entities = await BusinessPartnerDataSubject.getEntitiesByIds(
            req,
            ['User1', userId4]
        );

        expect(entities.length).toBe(2);
        expect(entities[0].name).toBe('User1');
        expect(entities[0].dataSubjectId).toBe(userId1);
        expect(entities[0].emailId).toBeNull;

        expect(entities[1].name).toBe('User4');
        expect(entities[1].dataSubjectId).toBe(userId4);
        expect(entities[1].emailId).toBe(emailAddress4);
    });

    it('should getEntitiesByIds of one data subject id User 1 using displayId', async () => {
        const entities = await BusinessPartnerDataSubject.getEntitiesByIds(
            req,
            ['User1']
        );

        expect(entities.length).toBe(1);
        expect(entities[0].name).toBe('User1');
        expect(entities[0].dataSubjectId).toBe(userId1);
        expect(entities[0].emailId).toBeNull;
    });

    it('should getEntitiesByIds of one data subject id User 1 using id', async () => {
        const entities = await BusinessPartnerDataSubject.getEntitiesByIds(
            req,
            [userId1]
        );

        expect(entities.length).toBe(1);
        expect(entities[0].name).toBe('User1');
        expect(entities[0].dataSubjectId).toBe(userId1);
        expect(entities[0].emailId).toBeNull;
    });

    it('should not getEntitiesByIds of data subject id given empty parameter ', async () => {
        const entities = await BusinessPartnerDataSubject.getEntitiesByIds(
            req,
            []
        );

        expect(entities.length).toBe(0);
    });
});
