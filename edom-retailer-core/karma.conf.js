function karmaConfig(config) {
    config.set({
        basePath: '.',
        frameworks: ['ui5'],
        ui5: {
            type: 'application',
            configPath: 'app/ui5-cap.yaml',
            paths: {
                webapp: 'app',
            },
        },
        singleRun: false,
        browsers: ['Chrome_without_security'],
        browserNoActivityTimeout: 1800000,
        failOnFailingTestSuite: false,
        failOnEmptyTestSuite: false,
        retryLimit: 2,
        customLaunchers: {
            Chrome_without_security: {
                base: 'Chrome',
                flags: ['--disable-web-security'],
            },
        },
    });
}

module.exports = karmaConfig;
