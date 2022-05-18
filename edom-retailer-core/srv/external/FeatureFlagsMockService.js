const cds = require('@sap/cds');

class FeatureFlagService extends cds.Service {
    // eslint-disable-next-line class-methods-use-this
    async evaluate() {
        return true;
    }

    // eslint-disable-next-line class-methods-use-this
    async evaluateSet(featureFlagNamesSet = []) {
        const flagSet = featureFlagNamesSet.map((i) => [i, true]);
        return flagSet;
    }
}

module.exports = FeatureFlagService;
