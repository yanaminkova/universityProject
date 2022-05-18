/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
const logger = require('cf-nodejs-logging-support');
const { recursivePopulateProperties } = require('../../lib/helper');

const bpNamespace = `sap.odm.businesspartner.BusinessPartner`;
const baNamespace = `sap.odm.utilities.billingaccount.BillingAccount`;

class BusinessPartnerDataSubject {
    /*
     * PUBLIC METHODS
     */

    /**
     *
     * Return all data subjects by dataSubjectIds
     *
     * @param  {cds.Request} req
     * @param  {string[]} ids
     * @returns {Array.<{ dataSubjectId: string, name: string, emailId: string }}
     *
     * Example:
     *
     * [{
     * "dataSubjectId": "Test_DS_13",
     * "name": "LN_Test_13_1, FN_3593420a",
     *  "emailId": "Test_13_1@sap.com"
     * }]
    }
     */
    async getEntitiesByIds(req, dataSubjectIds) {
        const db = await cds.connect.to('db');
        const tx = db.transaction(req);
        let displayIds = [];
        let guids = [];
        dataSubjectIds.forEach((x) => {
            (x.length <= 10 ? displayIds : guids).push(x);
        });
        if (!displayIds.length) {
            displayIds = '';
        }
        if (!guids.length) {
            guids = '';
        }

        const businessPartners = await tx.run(
            SELECT.from(bpNamespace, (bp) => {
                bp('displayId');
                bp('id');
                bp.addressData((a) => {
                    a.emailAddresses((c) => {
                        c.address; // NOSONAR
                    });
                });
            }).where({
                displayId: displayIds,
                or: { id: guids },
            })
        );

        // Regex is used to find the first matching address field
        const businessPartnersDRM = businessPartners.map((bp) => {
            const emailRegex = /"address":".*?"/;
            const emailHeaderLength = '"address":"'.length;
            const emailMatch = JSON.stringify(bp).match(emailRegex);
            const email = emailMatch
                ? emailMatch[0].substring(
                      emailHeaderLength,
                      emailMatch[0].length - 1
                  )
                : null;
            return {
                dataSubjectId: bp.id,
                name: bp.displayId,
                emailId: email,
            };
        });

        await tx.commit();
        return businessPartnersDRM;
    }

    /**
     * Get entities by providing a query condition. Expects that resulting
     *   entity includes fields in projection
    /**
     * @param  {cds.Request} req
     * @param  {filterExpression} condition
     * @param  {Array.<projectionExpression>} projection: e.g. ['id', 'displayId']. Make sure returned entities include these fields.
     * @returns {Array.<{ id: string, displayId: string }>}
     */
    async getEntitiesByCondition(req, condition, projection) {
        const db = await cds.connect.to('db');
        const tx = db.transaction(req);

        let query;
        if (typeof condition === 'undefined') {
            query = SELECT.from(bpNamespace, projection);
        } else if (condition?.length) {
            query = SELECT.from(bpNamespace, projection).where(...condition);
        } else {
            query = SELECT.from(bpNamespace, projection).where(condition);
        }

        const entities = await tx.run(query);
        await tx.commit();
        return entities;
    }

    /**
     * Block data subject entity with id
     * Billing Account is treated as an extension of Business Partner
     *   and is also blocked
     *
     * @param  {cds.Request} req
     * @param  {string} dataSubjectId
     * @param  {string} maxDeletionDate
     * @returns {Void}
     *
     */
    async blockEntity(req, dataSubjectId, maxDeletionDate) {
        const db = await cds.connect.to('db');

        const displayId = dataSubjectId.length <= 10 ? dataSubjectId : '';
        const guid = dataSubjectId.length <= 10 ? '' : dataSubjectId;

        const whereClause = guid ? { id: guid } : { displayId };

        const tx = db.transaction(req);
        const businessPartner = await tx.run(
            SELECT.one(bpNamespace, (bp) => {
                bp('id');
                bp('isBlocked');
                bp('maxDeletionDate');
                bp.person((p) => {
                    p.up__id; // NOSONAR
                    p.isBlocked; // NOSONAR
                    p.nameDetails(['up__up__id', 'isBlocked']);
                });
                bp.organization((org) => {
                    org.up__id; // NOSONAR
                    org.isBlocked; // NOSONAR
                    org.nameDetails(['up__up__id', 'isBlocked']);
                });
                bp.bankAccounts(['up__id', 'id', 'isBlocked']);
                bp.addressData((address) => {
                    address.up__id; // NOSONAR
                    address.id; // NOSONAR
                    address.isBlocked; // NOSONAR
                    address.usages(['up__up__id', 'isBlocked']);
                });
                bp.roles(['up__id', 'isBlocked']);
            }).where(whereClause)
        );

        // stop blocking if business partner doesn't exist
        if (!businessPartner) {
            await tx.commit();
            return;
        }

        logger.info(
            `[BusinessPartnerDatasubject.js]: Preparing to block business partner with id ${businessPartner.id}`
        );

        try {
            recursivePopulateProperties(businessPartner, {
                isBlocked: true,
                maxDeletionDate,
            });

            await tx.run(
                UPDATE(bpNamespace)
                    .set(businessPartner)
                    .where({ id: businessPartner.id })
            );
            await tx.commit();

            logger.info(
                `[BusinessPartnerDatasubject.js]: Successfully blocked business partner with id ${businessPartner.id}`
            );
        } catch (e) {
            await tx.rollback();
            logger.error(
                `[BusinessPartnerDatasubject.js] Failed to block business partner with id ${businessPartner.id}: ${e.message}`
            );
        }

        const tx2 = db.transaction(req);
        const billingAccountPartners = await tx2.run(
            SELECT.from(`${baNamespace}.partner`).where({
                businessPartner_id: businessPartner.id,
            })
        );

        // stop blocking of billing accounts if there are no billing accounts associated to the business partner
        if (!billingAccountPartners.length) {
            await tx2.commit();
            return;
        }

        const billingAccountIds = billingAccountPartners.map((ba) => ba.up__id);

        const billingAccounts = await tx2.run(
            SELECT.from(baNamespace, (ba) => {
                ba('id');
                ba('isBlocked');
                ba.partner((p) => {
                    p.up__id; // NOSONAR
                    p.isBlocked; // NOSONAR
                    p.businessPartner_id; // NOSONAR

                    p.paymentControl((pc) => {
                        pc.up__up__id; // NOSONAR
                        pc.isBlocked; // NOSONAR

                        pc.incomingPayment(['up__up__up__id', 'isBlocked']);
                        pc.outgoingPayment(['up__up__up__id', 'isBlocked']);
                    });

                    p.accountManagementData((am) => {
                        am.up__up__id; // NOSONAR
                        am.isBlocked; // NOSONAR
                    });

                    p.taxControl((tc) => {
                        tc.up__up__id; // NOSONAR
                        tc.isBlocked; // NOSONAR
                    });
                    p.dunningControl(['up__up__id', 'isBlocked']);
                });
            }).where({ id: billingAccountIds })
        );

        logger.info(
            `[BusinessPartnerDatasubject.js] Preparing to block billingAccount with ids ${billingAccountIds.join(
                ', '
            )}`
        );

        try {
            await Promise.all(
                billingAccounts.map(async (billingAccount) => {
                    recursivePopulateProperties(billingAccount, {
                        isBlocked: true,
                    });

                    await tx2.run(
                        UPDATE(baNamespace)
                            .set(billingAccount)
                            .where({ id: billingAccount.id })
                    );
                })
            );
            await tx2.commit();

            logger.info(
                `[BusinessPartnerDatasubject.js]: Successfully blocked the following billing accounts with ids ${billingAccountIds.join(
                    ', '
                )}`
            );
        } catch (e) {
            await tx2.rollback();
            logger.error(
                `[BusinessPartnerDatasubject.js] Failed to block billing accounts associated to business partner: ${e.message}`
            );
        }
    }

    /**
     *
     * Delete data subject entities that has been blocked
     * Billing Account is treated as an extension of Business Partner
     *   and is also deleted
     *
     * @param  {cds.Request} req
     * @returns {Void}
     *
     */
    async deleteBlockedEntities(req) {
        const db = await cds.connect.to('db');
        const currentDate = new Date().toISOString();
        const tx = db.transaction(req);

        const blockedBPsPastMDD = await tx.run(
            SELECT.from(bpNamespace).where({
                isBlocked: true,
                maxDeletionDate: { '<': currentDate },
            })
        );

        // stop deletion of if there is no blocked business partner that is past maxDeletionDate
        if (!blockedBPsPastMDD) {
            await tx.commit();
            return;
        }

        const businessPartnerIdList = blockedBPsPastMDD.map((x) => x.id);

        logger.info(
            `[BusinessPartnerDatasubject.js]: Preparing to destroy the following business partners with ids ${businessPartnerIdList.join(
                ','
            )}`
        );

        const billingAccountPartners = await tx.run(
            SELECT.from(`${baNamespace}.partner`).where({
                businessPartner_id: businessPartnerIdList,
            })
        );

        if (billingAccountPartners.length) {
            const billingAccountIdList1 = billingAccountPartners.map(
                (ba) => ba.up__id
            );

            logger.info(
                `[BusinessPartnerDatasubject.js]: Preparing to destroy the following billing accounts with ids ${billingAccountIdList1.join(
                    ','
                )}`
            );

            try {
                await tx.run(
                    DELETE.from(baNamespace).where({
                        id: billingAccountIdList1,
                    })
                );
                await tx.commit();

                logger.info(
                    `[BusinessPartnerDatasubject.js]: Successfully destroyed the following billing accounts with ids ${billingAccountIdList1.join(
                        ','
                    )}`
                );
            } catch (e) {
                await tx.rollback();
                logger.error(
                    `[BusinessPartnerDatasubject.js] Failed to destroy billing accounts associated to business partners: ${e.message}`
                );
                logger.info(
                    `[BusinessPartnerDatasubject.js] Skipping deletion of business partners`
                );
                // stop deletion of business partner if billing account deletion failed
                return;
            }
        }

        // continue deletion of business partner even if there are no billing accounts associated to the business partner
        try {
            await tx.run(
                DELETE.from(bpNamespace).where({
                    id: businessPartnerIdList,
                })
            );
            await tx.commit();

            logger.info(
                `[BusinessPartnerDatasubject.js]: Successfully destroyed the following business partners with ids ${businessPartnerIdList.join(
                    ','
                )}`
            );
        } catch (e) {
            await tx.rollback();
            logger.error(
                `[BusinessPartnerDatasubject.js] Failed to destroy business partners: ${e.message}`
            );
        }
    }
}

module.exports = new BusinessPartnerDataSubject();
