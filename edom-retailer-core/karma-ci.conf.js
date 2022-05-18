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
        singleRun: true,
        reporters: ['progress', 'junit'],
        junitReporter: {
            outputDir: 'target', // results will be saved as $outputDir/$browserName.xml
            outputFile: 'TEST-UI_results.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: 'testsuite', // suite will become the package name attribute in xml testsuite element
            useBrowserName: true, // add browser name to report and classes names
        },
        browsers: ['RemoteChrome'],
        browserNoActivityTimeout: 120000,
        browserDisconnectTolerance: 3,
        browserDisconnectTimeout: 60000,
        retryLimit: 3,
        customLaunchers: {
            RemoteChrome: {
                base: 'WebDriver',
                'goog:chromeOptions': {
                    args: [
                        '--disable-web-security',
                        '--window-size=1920,1080',
                        '--headless',
                        '--disable-gpu',
                        '--no-sandbox',
                        '--disable-dev-shm-usage',
                    ],
                },
                config: {
                    hostname: 'localhost',
                    port: 4444,
                },
                browserName: 'chrome',
                name: 'Karma',
            },
        },
    });
}

module.exports = karmaConfig;
