const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const { getBundle } = require('../lib/helper');

const i18nPath = '../../_i18n/i18n';

class MeasurementConceptAPI {
    /**
     * Get MCM Instance
     * @returns [MCM Instance]
     */
    static async getMCIDetails(req) {
        const bundle = getBundle(req, i18nPath);
        let mcmResponse;
        const mcmInstance = req.data.id;
        const query = `GET /odata/v4/api/mcm/v1/MCMInstances(${mcmInstance})?$expand=changeProcesses($expand=processData($expand=meteringLocationsPD($expand=meteringTasksPD),marketLocationsPD,actorsPD),processType),status($expand=errors),leadingAddress($expand=country),meteringLocations($expand=address($expand=country),meteringTasks),actors,measurementModel,marketLocations($expand=address($expand=country),calculationRules($expand=steps,usages)),status($expand=instanceStatus,processStatus)`;
        try {
            const MCMDest = await cds.connect.to('MCMDestination');
            mcmResponse = await MCMDest.tx(req).run(query);
        } catch (error) {
            logger.error(
                `${bundle.getText(
                    'errorMsgTechnicalMasterDataMCMErrorReadingMCI'
                )} ${error?.message}`,
                error
            );
            return error;
        }
        return mcmResponse;
    }

    /**
     * Get Measurement Concept Instance using Metering Location ID
     * @param {*} req
     * @param {*} meteringLocID
     * @returns
     */
    static async getMeasurementConceptInstance(req, meteringLocID) {
        const bundle = getBundle(req, i18nPath);
        let mcmResponse;
        const query = `GET /odata/v4/api/mcm/v1/MeteringLocations?$filter=meteringLocationId eq '${meteringLocID}'&$select=meteringLocationId&$expand=measurementConceptInstance($select=id,idText,orderer_code,leadingGrid_code,meteringLocations;$expand=meteringLocations,changeProcesses($select=id;$expand=processData($select=id;$expand=meteringLocationsPD($select=id,meteringLocation_id,meterOperator))))`;
        try {
            const MCMDest = await cds.connect.to('MCMDestination');
            mcmResponse = await MCMDest.tx(req).run(query);
        } catch (error) {
            logger.error(
                `${bundle.getText(
                    'errorMsgTechnicalMasterDataMCMErrorReadingMCI'
                )} ${error?.message}`,
                error
            );
            return error;
        }
        return mcmResponse;
    }
}
module.exports = MeasurementConceptAPI;
