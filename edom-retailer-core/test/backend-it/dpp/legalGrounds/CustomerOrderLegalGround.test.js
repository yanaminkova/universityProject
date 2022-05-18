const expect = require('expect');
const path = require('path');
const cds = require('@sap/cds');
const CustomerOrderLegalGround = require('../../../../srv/dpp/legalGrounds/CustomerOrderLegalGround');

global.cds.env.features.assert_integrity = false;

describe('CustomerOrderLegalGround.test', () => {
    const req = {};

    beforeAll(async () => {
        const csn = await cds.load(
            path.join(
                __dirname,
                '../../../../db/models/extensions/dpp/CustomerOrderUtilitiesDRMExtensions'
            )
        );

        const dbOptions = {
            in_memory: true,
            credentials: { database: ':memory:' },
        };
        cds.db = await cds.connect.to('db', dbOptions);
        await cds.deploy(csn).to(cds.db, dbOptions);

        cds.db.run(
            INSERT.into('sap.odm.sales.CustomerOrder').entries({
                id: '15626d67-0938-4701-a821-2014f5321a4c',
                isBlocked: true,
                partners: [
                    {
                        id: '48e61efc-8d01-4aa3-aec2-390cb602e840',
                        businessPartnerId: 'User1',
                    },
                ],
                endOfBusinessDate: '2021-05-25T00:00:00Z',
                maxDeletionDate: '2021-06-25T00:00:00Z',
            })
        );

        cds.db.run(
            INSERT.into('sap.odm.sales.CustomerOrder').entries({
                id: 'd61424f1-fd6c-49fb-a598-057492ec1d08',
                isBlocked: false,
                partners: [
                    {
                        id: 'b60c76ba-a9a1-41bc-b44e-774b8da49792',
                        businessPartnerId: 'User2',
                    },
                ],
                endOfBusinessDate: new Date().toISOString(),
            })
        );

        cds.db.run(
            INSERT.into('sap.odm.sales.CustomerOrder').entries({
                id: '8662e9ef-c89c-4731-9023-72f6d60575ca',
                isBlocked: false,
                partners: [
                    {
                        id: '208b3262-2f21-41f8-b172-7a334f68cf37',
                        businessPartner: {
                            id: '1b85a71c-1b26-47c9-a379-bec911dab762',
                        },
                    },
                ],
                endOfBusinessDate: '2021-05-25T00:00:00Z',
                maxDeletionDate: '2021-06-25T00:00:00Z',
            })
        );

        cds.db.run(
            INSERT.into('sap.odm.sales.CustomerOrder').entries({
                id: 'aea6d8dd-fd3b-4020-b590-b582c8536ea1',
                isBlocked: false,
                partners: [
                    {
                        id: '7ad54774-eacc-473a-9e66-842de5a538f3',
                        businessPartnerId: 'User3',
                    },
                ],
                endOfBusinessDate: '2021-05-25T00:00:00Z',
                maxDeletionDate: '2021-06-25T00:00:00Z',
            })
        );

        cds.db.run(
            INSERT.into('sap.odm.sales.CustomerOrder').entries({
                id: '992a3e52-f8be-42ae-9fbe-b048bad4fbe0',
                isBlocked: false,
                endOfBusinessDate: '2021-05-25T00:00:00Z',
                maxDeletionDate: '2021-06-25T00:00:00Z',
            })
        );
    });

    it('should getEntitiesByDataSubjectIds with data subject ids User1 and User2 [#1094]', async () => {
        const entities =
            await CustomerOrderLegalGround.getEntitiesByDataSubjectIds(
                req,
                ['User1', 'User2'],
                {},
                ['id']
            );

        expect(entities.length).toBe(2);
    });

    it('should  getEntitiesByDataSubjectIds with data subject id User 1 and projection isBlocked, dataSubjectId [#1094]', async () => {
        const entities =
            await CustomerOrderLegalGround.getEntitiesByDataSubjectIds(
                req,
                ['User1'],
                {},
                ['isBlocked', 'dataSubjectId']
            );

        expect(entities.length).toBe(1);
        expect(entities[0].isBlocked).toBe(true);
        expect(entities[0].dataSubjectId).toBe('User1');
        expect(entities[0].id).toBeUndefined(); // Not specified in projection
    });

    it('should getEntitiesByDataSubjectIds with data subject ids User1 and User2 and condition isBlocked=false [#1094]', async () => {
        const entities =
            await CustomerOrderLegalGround.getEntitiesByDataSubjectIds(
                req,
                ['User1', 'User2'],
                { isBlocked: false },
                ['dataSubjectId']
            );

        expect(entities.length).toBe(1);
        expect(entities[0].dataSubjectId).toBe('User2');
    });

    it('should getEntitiesByCondition with condition isBlocked=true [#1094]', async () => {
        const entities = await CustomerOrderLegalGround.getEntitiesByCondition(
            req,
            { isBlocked: true },
            ['dataSubjectId']
        );

        expect(entities.length).toBe(1);
        expect(entities[0].dataSubjectId).toBe('User1');
    });

    it('should getEntitiesByCondition with condition isBlocked=true and projection isBlocked, dataSubjectId [#1094]', async () => {
        const entities = await CustomerOrderLegalGround.getEntitiesByCondition(
            req,
            { isBlocked: true },
            ['isBlocked', 'dataSubjectId']
        );

        expect(entities.length).toBe(1);
        expect(entities[0].isBlocked).toBe(true);
        expect(entities[0].dataSubjectId).toBe('User1');
        expect(entities[0].id).toBeUndefined(); // Not specified in projection
    });

    it('should blockEntity [#1094]', async () => {
        const maxDeletionDate = '2021-06-25T00:00:00Z';

        await CustomerOrderLegalGround.blockEntity(
            req,
            'd61424f1-fd6c-49fb-a598-057492ec1d08',
            maxDeletionDate
        );

        const entities = await CustomerOrderLegalGround.getEntitiesByCondition(
            req,
            { id: 'd61424f1-fd6c-49fb-a598-057492ec1d08' },
            ['isBlocked', 'maxDeletionDate']
        );

        expect(entities.length).toBe(1);
        expect(entities[0].isBlocked).toBe(true);
        expect(entities[0].maxDeletionDate).toBe(maxDeletionDate);
    });

    it('should deleteBlockedEntities [#1094]', async () => {
        await CustomerOrderLegalGround.deleteBlockedEntities(req);

        const entities =
            await CustomerOrderLegalGround.getEntitiesByDataSubjectIds(
                req,
                ['User1'],
                {},
                ['id']
            );
        expect(entities.length).toBe(0);
    });

    it('should getEntitiesByCondition with condition it has a data subject (business partner)', async () => {
        const entities = await CustomerOrderLegalGround.getEntitiesByCondition(
            req,
            'dataSubjectId != null or dataSubjectUUID != null',
            ['id', 'dataSubjectId', 'dataSubjectUUID']
        );

        const displayIds = entities.map((x) => x.dataSubjectId);
        const guids = entities.map((x) => x.dataSubjectUUID);
        const ids = entities.map((x) => x.id);

        expect(displayIds).toContain('User3');
        expect(guids).toContain('1b85a71c-1b26-47c9-a379-bec911dab762');
        expect(ids).toContain('aea6d8dd-fd3b-4020-b590-b582c8536ea1');
        expect(ids).toContain('8662e9ef-c89c-4731-9023-72f6d60575ca');
        expect(ids).not.toContain('992a3e52-f8be-42ae-9fbe-b048bad4fbe0');
    });
});
