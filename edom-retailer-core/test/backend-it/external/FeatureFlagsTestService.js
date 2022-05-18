class FeatureFlagService extends cds.Service {
    constructor() {
        super();
        this.flags = {};
    }
    // eslint-disable-next-line class-methods-use-this
    set(flagName, flag) {
        this.flags[flagName] = flag;
    }

    async evaluate(flagName) {
        return this.flags[flagName];
    }
}

module.exports = FeatureFlagService;
