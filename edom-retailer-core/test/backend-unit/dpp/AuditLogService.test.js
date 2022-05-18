const cds = require('@sap/cds');
const path = require('path');
const expect = require('expect');

describe('AuditLogService', () => {
    beforeAll(async () => {
        process.env.VCAP_SERVICES = JSON.stringify({
            auditlog: [
                {
                    label: 'auditlog',
                    name: 'edom-retailer-audit',
                    tags: ['auditlog'],
                    instance_name: 'edom-retailer-audit',
                    credentials: {
                        logToConsole: true,
                    },
                },
            ],
        });
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    function checkSrvEntities(srv, entitiesPreffix) {
        const beforeHandlers = srv._handlers.before.filter(
            (x) =>
                x.handler.name === 'beforeHandler' ||
                x.handler.name === 'beforeDeleteHandler'
        );
        const afterHandlers = srv._handlers.after.filter(
            (x) => x.handler.name === 'afterHandler'
        );

        const entities = Object.entries(cds.model.definitions).filter(
            (entry) =>
                entry[0].split('.')[0] === entitiesPreffix &&
                entry[1].kind === 'entity'
        );

        const entitiesWithAuditLogInsert = entities.filter(
            (entry) => entry[1]['@AuditLog.Operation.Insert']
        );

        const entitiesWithAuditLogUpdate = entities.filter(
            (entry) => entry[1]['@AuditLog.Operation.Update']
        );

        const entitiesWithAuditLogDelete = entities.filter(
            (entry) => entry[1]['@AuditLog.Operation.Delete']
        );

        entitiesWithAuditLogInsert.forEach((entity) => {
            expect(
                beforeHandlers.find((handler) =>
                    handler.for({
                        event: 'CREATE',
                        entity: entity[0],
                    })
                )
            ).toBeTruthy();
        });

        entitiesWithAuditLogInsert.forEach((entity) => {
            expect(
                afterHandlers.find((handler) =>
                    handler.for({
                        event: 'CREATE',
                        entity: entity[0],
                    })
                )
            ).toBeTruthy();
        });

        entitiesWithAuditLogUpdate.forEach((entity) => {
            expect(
                beforeHandlers.find((handler) =>
                    handler.for({
                        event: 'UPDATE',
                        entity: entity[0],
                    })
                )
            ).toBeTruthy();
        });

        entitiesWithAuditLogUpdate.forEach((entity) => {
            expect(
                afterHandlers.find((handler) =>
                    handler.for({
                        event: 'UPDATE',
                        entity: entity[0],
                    })
                )
            ).toBeTruthy();
        });

        entitiesWithAuditLogDelete.forEach((entity) => {
            expect(
                beforeHandlers.find((handler) =>
                    handler.for({
                        event: 'DELETE',
                        entity: entity[0],
                    })
                )
            ).toBeTruthy();
        });

        const afterDeleteHandlers = srv._handlers.after.filter(
            (x) => x.handler.name === 'afterDeleteHandler'
        );

        entitiesWithAuditLogDelete.forEach((entity) => {
            expect(
                afterDeleteHandlers.find((handler) =>
                    handler.for({
                        event: 'DELETE',
                        entity: entity[0],
                    })
                )
            ).toBeTruthy();
        });

        const onErrorHandlers = srv._handlers._error.filter(
            (x) => x.handler.name === 'afterFailedRequestHandler'
        );

        expect(onErrorHandlers).toBeTruthy();
    }

    it('should registerHandler for API_EDOM_RETAILER service', async () => {
        const serviceName = 'API_EDOM_RETAILER';

        const srv = await cds
            .serve(serviceName)
            .from(path.join(__dirname, '../../../srv'));

        checkSrvEntities(srv, serviceName);
    });

    it('should registerHandler for BusinessPartnerServiceInternal', async () => {
        const serviceName = 'BusinessPartnerServiceInternal';

        const srv = await cds
            .serve(serviceName)
            .from(path.join(__dirname, '../../../srv'));

        checkSrvEntities(srv, serviceName);
    });

    it('should registerHandler for BusinessPartnerService', async () => {
        const serviceName = 'BusinessPartnerService';

        const srv = await cds
            .serve(serviceName)
            .from(path.join(__dirname, '../../../srv'));

        checkSrvEntities(srv, serviceName);
    });

    it('should registerHandler for BillingAccountService', async () => {
        const serviceName = 'BillingAccountService';
        const srv = await cds
            .serve(serviceName)
            .from(path.join(__dirname, '../../../srv'));

        checkSrvEntities(srv, serviceName);
    });
});
