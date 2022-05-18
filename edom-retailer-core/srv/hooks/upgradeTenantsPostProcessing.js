/* eslint-disable no-await-in-loop */
const logger = require('cf-nodejs-logging-support');

module.exports = async (db, allTenantIDs) => {
    for (
        let tenantIndex = 0;
        tenantIndex < allTenantIDs.length;
        tenantIndex += 1
    ) {
        try {
            const tenant = allTenantIDs[tenantIndex];

            logger.debug(
                `[upgradeTenantsPostProcessing][begin][${allTenantIDs[tenantIndex]}]`
            );

            const user = new cds.User.Privileged({ tenant });
            const req = {
                user,
                tenant,
            };

            const tx = db.transaction(req);
            const legacyRows = await tx.run(
                SELECT(['id', 'legacy_name'])
                    .from('sap.odm.orgunit.CompanyCode')
                    .where('legacy_name IS NOT NULL')
            );
            await tx.commit();
            const rows2insert = legacyRows.map((x) => ({
                up__id: x.id,
                name: x.legacy_name,
            }));

            if (rows2insert) {
                for (
                    let rowIndex = 0;
                    rowIndex < rows2insert.length;
                    rowIndex += 1
                ) {
                    const row = rows2insert[rowIndex];
                    const txP = db.transaction(req);
                    try {
                        await txP.run(
                            INSERT.into('sap.odm.orgunit.CompanyCode.name', row)
                        );
                        await txP.run(
                            UPDATE('sap.odm.orgunit.CompanyCode')
                                .set({ legacy_name: null })
                                .where({
                                    id: row.up__id,
                                })
                        );

                        await txP.commit();
                    } catch (e) {
                        /* istanbul ignore next */
                        await txP.rollback();

                        const msgPreffix = `[upgradeTenantsPostProcessing][persistanceTransaction][${allTenantIDs[tenantIndex]}] `;
                        logger.error(`${msgPreffix} ${JSON.stringify(e)}`);
                        logger.debug(`${msgPreffix} ${JSON.stringify(row)}`);
                    }
                }
            }
        } catch (e) /* istanbul ignore next */ {
            /* istanbul ignore next */
            logger.error(
                `[upgradeTenantsPostProcessing][general][${
                    allTenantIDs[tenantIndex]
                }] ${JSON.stringify(e)}`
            );
        }
    }
};
