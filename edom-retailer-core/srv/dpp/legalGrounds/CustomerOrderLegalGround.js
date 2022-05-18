/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
const { recursivePopulateProperties } = require('../../lib/helper');

class CustomerOrderLegalGround {
    /*
     * PUBLIC METHODS
     */

    /**
     *
     * Get entities by a lost of data subject ids. Expects that resulting entity includes fields
     * - id
     * - dataSubjectId
     * - endOfBusinessDate
     * - maxDeletionDate
     * - isBlocked
     * Therefore a view providing those fields should be used.
     *
     * @param  {cds.Request} req
     * @param  {string[]} dataSubjectIds
     * @param  {filterExpression} condition
     * @param  {Array.<projectionExpression>} projection: e.g. ['id', 'dataSubjectId', endOfBusinessDate',
     * 'maxDeletionDate', 'isBlocked']. Make sure returned entities include these fields.
     * @returns {Array.<{ id: string, dataSubjectId: string, endOfBusinessDate: string, maxDeletionDate: string, isBlocked: boolean>}
     */
    async getEntitiesByDataSubjectIds(
        req,
        dataSubjectIds,
        condition,
        projection
    ) {
        const db = await cds.connect.to('db');

        return db.transaction(req).run(
            SELECT.from(
                `sap.odm.utilities.sales.CustomerOrderUtilitiesDRM`,
                projection
            )
                .where({
                    dataSubjectUUID: dataSubjectIds,
                    or: { dataSubjectId: dataSubjectIds },
                })
                .where(condition)
        );
    }

    /**
     *
     * Get entities by providing a query condition. Expects that resulting entity includes fields
     * - id
     * - dataSubjectId
     * Therefore a view providing those fields should be used.
    /**
     * @param  {cds.Request} req
     * @param  {filterExpression} condition
     * @param  {Array.<projectionExpression>} projection: e.g. ['id', 'dataSubjectId']. Make sure returned entities include these fields.
     * @returns {Array.<{ id: string, dataSubjectId: string }>}
     */
    async getEntitiesByCondition(req, condition, projection) {
        const db = await cds.connect.to('db');

        return db
            .transaction(req)
            .run(
                SELECT.from(
                    `sap.odm.utilities.sales.CustomerOrderUtilitiesDRM`,
                    projection
                ).where(condition)
            );
    }

    /**
     * Block legal ground entity with id.
     *
     * @param  {cds.Request} req
     * @param  {string} legalGroundId
     * @param  {string} maxDeletionDate
     * @returns {Void}
     */
    async blockEntity(req, legalGroundId, maxDeletionDate) {
        const db = await cds.connect.to('db');

        const customerOrder = await db.transaction(req).run(
            SELECT.from(`sap.odm.sales.CustomerOrder`, legalGroundId, (cos) => {
                cos('id');
                cos('isBlocked');
                cos('maxDeletionDate');
                cos.items((item) => {
                    item.up__id; // NOSONAR
                    item.id; // NOSONAR
                    item.isBlocked; // NOSONAR
                    item.partners(['up__up__id', 'up__id', 'id', 'isBlocked']);
                    item.notes(['up__up__id', 'up__id', 'id', 'isBlocked']);
                    item.priceComponents([
                        'up__up__id',
                        'up__id',
                        'id',
                        'isBlocked',
                    ]);
                    item.salesAspect((sales) => {
                        sales.up__up__id; // NOSONAR
                        sales.up__id; // NOSONAR
                        sales.isBlocked; // NOSONAR
                        sales.scheduleLines([
                            'up__up__up__id',
                            'up__up__id',
                            'isBlocked',
                        ]);
                    });
                    item.serviceAspect((service) => {
                        service.up__up__id; // NOSONAR
                        service.up__id; // NOSONAR
                        service.isBlocked; // NOSONAR
                        service.referenceObjects([
                            'up__up__up__id',
                            'up__up__id',
                            'equipment',
                            'isBlocked',
                        ]);
                    });
                    item.utilitiesAspect((utilities) => {
                        utilities.up__up__id; // NOSONAR
                        utilities.up__id; // NOSONAR
                        utilities.isBlocked; // NOSONAR
                        utilities.referenceObject([
                            'up__up__up__id',
                            'up__up__id',
                            'meter',
                            'isBlocked',
                        ]);
                        utilities.subsequentDocument([
                            'up__up__up__id',
                            'up__up__id',
                            'id',
                            'displayId',
                            'isBlocked',
                        ]);
                    });
                    item.subscriptionAspect((subscription) => {
                        subscription.up__up__id; // NOSONAR
                        subscription.up__id; // NOSONAR
                        subscription.isBlocked; // NOSONAR
                        subscription.technicalResources([
                            'up__up__up__id',
                            'up__up__id',
                            'id',
                            'isBlocked',
                        ]);
                        subscription.headerCustomReferences([
                            'up__up__up__id',
                            'up__up__id',
                            'id',
                            'isBlocked',
                        ]);
                        subscription.itemCustomReferences([
                            'up__up__up__id',
                            'up__up__id',
                            'id',
                            'isBlocked',
                        ]);
                        subscription.itemSubscriptionParameters([
                            'up__up__up__id',
                            'up__up__id',
                            'id',
                            'isBlocked',
                        ]);
                    });
                });
                cos.partners([
                    'up__id',
                    'businessPartnerId',
                    'contractAccountId',
                    'isBlocked',
                ]);
                cos.notes(['up__id', 'id', 'isBlocked']);
                cos.priceComponents(['up__id', 'id', 'isBlocked']);
                cos.salesAspect(['up__id', 'isBlocked']);
                cos.serviceAspect(['up__id', 'isBlocked']);
            }).where({
                endOfBusinessDate: { '!=': null },
            })
        );

        if (!customerOrder) {
            return;
        }

        recursivePopulateProperties(customerOrder, {
            isBlocked: true,
            maxDeletionDate,
        });

        await db
            .transaction(req)
            .run(
                UPDATE(`sap.odm.sales.CustomerOrder`, customerOrder.id).set(
                    customerOrder
                )
            );
    }

    /**
     *
     * Delete legal ground entities that has been blocked and reached max deletion date
     *
     * @param  {cds.Request} req
     * @returns {Void}
     */
    async deleteBlockedEntities(req) {
        const db = await cds.connect.to('db');
        const currentDate = new Date().toISOString();

        await db.transaction(req).run(
            DELETE.from(`sap.odm.sales.CustomerOrder`).where({
                isBlocked: true,
                maxDeletionDate: { '<': currentDate },
            })
        );
    }
}

module.exports = new CustomerOrderLegalGround();
