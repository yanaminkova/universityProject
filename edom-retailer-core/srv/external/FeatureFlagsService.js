const cds = require('@sap/cds');
const xsenv = require('@sap/xsenv');
const logger = require('cf-nodejs-logging-support');
const cloudSDK = require('@sap-cloud-sdk/core');
const ExecuteHttpRequest = require('../lib/cloudSDKHelper/executeHttpRequest');

const cache = new cloudSDK.Cache({ minutes: 5 });

const credentials =
    xsenv.filterServices({ tag: 'feature-flags' }).length > 0
        ? xsenv.serviceCredentials({ tag: 'feature-flags' })
        : null;

/* eslint-disable class-methods-use-this */
class FeatureFlagService extends cds.Service {
    /**
     * Retrieves the status of a feature flag from external Feature Flag service
     * @param {String} featureFlagName - Name of the feature flag.
     * @param {String} tenant - Specifies the application specific tenant, for which the evaluation is performed.
     * @param {Boolean} ignoreCache = Define if cache must be ignored for the request.
     * @param {Date} cacheExpirationTime - Define if cache should be expired at specific date / time instead of default expiration period.
     * @returns {Boolean} - Current variation (status) of the feature flag.
     */
    async evaluate(
        featureFlagName,
        tenant,
        // eslint-disable-next-line default-param-last
        useCache = false,
        cacheExpirationTime
    ) {
        if (!credentials) {
            return false;
        }

        const url = `${credentials.uri}/api/v2/evaluate/${featureFlagName}?identifier=${tenant}`;
        try {
            let flag;
            if (useCache && cache.hasKey(url) && cache.get(url) !== undefined) {
                flag = cache.get(url);
            } else {
                const { data } = await ExecuteHttpRequest.get(
                    {
                        url,
                        username: credentials.username,
                        password: credentials.password,
                    },
                    {}
                );

                const { type, variation } = data;

                flag = type === 'BOOLEAN' ? variation === 'true' : variation;
                cache.set(url, flag, cacheExpirationTime);
            }

            return flag;
        } catch (error) {
            cache.set(url, false, cacheExpirationTime);
            logger.error(`[FeatureFlagService][evaluate]: ${error}`);
            return false;
        }
    }

    /**
     * Retrieves the status of a set of feature flags from external Feature Flag service
     * @param {String} featureFlagNamesSet - Names of the feature flags.
     * @param {String} tenant - Specifies the application specific tenant, for which the evaluation is performed.
     * @param {Boolean} ignoreCache = Define if cache must be ignored for the request.
     * @param {Date} cacheExpirationTime - Define if cache should be expired at specific date / time instead of default expiration period.
     * @returns {Boolean} - Current variation (status) of the feature flag.
     */
    async evaluateSet(
        // eslint-disable-next-line default-param-last
        featureFlagNamesSet = [],
        tenant,
        // eslint-disable-next-line default-param-last
        useCache = false,
        cacheExpirationTime
    ) {
        let flagSet = [];
        if (!credentials) {
            return flagSet;
        }

        let featureFlagSetQuery = '';
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < featureFlagNamesSet.length; i++) {
            if (featureFlagNamesSet[i]) {
                if (i >= 1 && i !== featureFlagNamesSet.length) {
                    featureFlagSetQuery = `${featureFlagSetQuery}&`;
                }
                const featureFlagFilter = `flag=${featureFlagNamesSet[i]}`;
                featureFlagSetQuery = `${featureFlagSetQuery}${featureFlagFilter}`;
            }
        }

        const url = `${credentials.uri}/api/v2/evaluateset?${featureFlagSetQuery}&identifier=${tenant}`;
        try {
            if (useCache && cache.hasKey(url) && cache.get(url) !== undefined) {
                flagSet = cache.get(url);
            } else {
                try {
                    const { data } = await ExecuteHttpRequest.get(
                        {
                            url,
                            username: credentials.username,
                            password: credentials.password,
                        },
                        {}
                    );

                    const identifier = tenant;

                    let flagState;
                    let flagValue;
                    // eslint-disable-next-line no-plusplus
                    for (let i = 0; i < featureFlagNamesSet.length; i++) {
                        if (
                            data[featureFlagNamesSet[i]][identifier].variation
                        ) {
                            // Feature Flag status was retrieved
                            flagState =
                                data[featureFlagNamesSet[i]][identifier]
                                    .variation;
                            flagValue =
                                data[featureFlagNamesSet[i]][identifier]
                                    .type === 'BOOLEAN'
                                    ? flagState === 'true'
                                    : flagState;
                            flagSet.push([featureFlagNamesSet[i], flagValue]);
                        }
                    }
                    cache.set(url, flagSet, cacheExpirationTime);
                } catch (error) {
                    // Error in fetching Feature flags
                    cache.set(url, flagSet, cacheExpirationTime);
                    logger.error(`[FeatureFlagService][evaluate]: ${error}`);
                    return flagSet;
                }
            }

            return flagSet;
        } catch (error) {
            cache.set(url, flagSet, cacheExpirationTime);
            logger.error(`[FeatureFlagService][evaluate]: ${error}`);
            return flagSet;
        }
    }
}

module.exports = FeatureFlagService;
