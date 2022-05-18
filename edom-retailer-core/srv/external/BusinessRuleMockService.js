const cds = require('@sap/cds');

class BusinessRuleMockService extends cds.Service {
    static get forEachRuleRegEx() {
        return /FOREACH\(statuses\)\sEXISTSIN\s\['([0-9]{1,2})'\]\sTHEN\soverallStatus\s==\s'([0-9]{1,2})'/g;
    }

    static get ruleset() {
        return {
            statusMappingService: {
                expressions: [
                    "FOREACH(statuses) EXISTSIN ['08'] THEN overallStatus == '08'",
                    "FOREACH(statuses) EXISTSIN ['07'] THEN overallStatus == '07'",
                    "FOREACH(statuses) EXISTSIN ['06'] THEN overallStatus == '06'",
                    "FOREACH(statuses) EXISTSIN ['02'] THEN overallStatus == '02'",
                    "FOREACH(statuses) EXISTSIN ['01'] THEN overallStatus == '01'",
                    "FOREACH(statuses) EXISTSIN ['09'] THEN overallStatus == '09'",
                    "FOREACH(statuses) EXISTSIN ['00'] THEN overallStatus == '00'",
                    "FOREACH(statuses) EXISTSIN ['03'] THEN overallStatus == '03'",
                    "FOREACH(statuses) EXISTSIN ['10'] THEN overallStatus == '10'",
                    "FOREACH(statuses) EXISTSIN ['04'] THEN overallStatus == '04'",
                    "FOREACH(statuses) EXISTSIN ['05'] THEN overallStatus == '05'",
                ],
            },
        };
    }

    static recalculateOverallStatus(vocabulary) {
        const rules =
            BusinessRuleMockService.ruleset.statusMappingService.expressions;
        let overallStatus;

        rules.forEach((rule) => {
            if (!overallStatus) {
                const [, needleStatus, overallMatch] =
                    BusinessRuleMockService.forEachRuleRegEx.exec(rule);
                overallStatus =
                    overallMatch && vocabulary.statuses.includes(needleStatus)
                        ? overallMatch
                        : overallStatus;
            }
        });

        return overallStatus;
    }

    /**
     * @description similar to the https://api.sap.com/api/SAP_CF_BusinessRules_Runtime_V2/resource
     * @param {*} ruleServiceId @example 'statusMappingService'
     * @param {*} ruleServiceRevision @example '1'
     * @param {*} vocabulary @example
     * [
            {
                "statuses": [
                    "00",
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10"
                ],
            }
        ]
     * @returns
     */

    // eslint-disable-next-line class-methods-use-this
    async invoke(_ruleServiceId, _ruleServiceRevision, vocabulary) {
        const processingStatusCode =
            BusinessRuleMockService.recalculateOverallStatus(vocabulary);
        return {
            Result: [
                {
                    OverallStatus: {
                        processingStatus_code: processingStatusCode,
                    },
                },
            ],
        };
    }
}

module.exports = BusinessRuleMockService;
