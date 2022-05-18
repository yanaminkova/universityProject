/* eslint-disable no-underscore-dangle */
const logger = require('cf-nodejs-logging-support');
const cloudSdk = require('@sap-cloud-sdk/core');
const hdb = require('hdb');
const xsenv = require('@sap/xsenv');
const axios = require('axios');
const moment = require('moment');
const { handleError } = require('../../lib/error');

/* eslint-disable class-methods-use-this */
/*
 * HANA DB Health check
 */
class HanaHealthCheck {
    /**
     * Constructor
     */
    constructor() {
        const serviceManagerCredentials =
            xsenv.filterServices({ label: 'service-manager' }).length > 0
                ? xsenv.serviceCredentials({ label: 'service-manager' })
                : null;

        this.serviceManagerCredentials = serviceManagerCredentials;
        this.tokenCache = cloudSdk.clientCredentialsTokenCache;
        this.instanceCredentialsCache = new cloudSdk.Cache(
            moment({ minute: 15 })
        );
    }

    /*
     * PUBLIC METHODS
     */

    /**
     * Returns health check name
     */
    get name() {
        return 'hana';
    }

    /**
     * Accept visitor
     *
     * @param  {} visitor
     */
    async accept(visitor) {
        return visitor.reportHealthCheck(this);
    }

    /**
     * Checks if HANA is reachable
     */
    async isReachable() {
        if (!this.serviceManagerCredentials) {
            return false;
        }

        let credentials = this.instanceCredentialsCache.get('hana');
        if (!credentials) {
            const accessToken = await this._retrieveAccessToken();
            if (!accessToken) {
                return false;
            }

            const config = await this._retrieveInstanceConfig(accessToken);
            if (!config) {
                return false;
            }

            this.instanceCredentialsCache.set('hana', config.credentials);
            credentials = config.credentials;
        }
        return new Promise((resolve) => {
            const client = hdb.createClient({
                host: credentials.host,
                port: credentials.port,
                user: credentials.user,
                password: credentials.password,
                cert: credentials.certificate,
            });
            client.connect((error) => {
                if (error) {
                    let message = error.message || error;
                    message =
                        typeof message === 'object'
                            ? JSON.stringify(message)
                            : message;

                    logger.error(
                        `'[HanaHealthCheck][isReachable]': ${message}`
                    );
                    resolve(false);
                } else {
                    client.disconnect(() => {
                        resolve(true);
                    });
                }
            });
        });
    }

    /*
     * PRIVATE METHODS
     */

    /**
     * @returns {string} service manager access token
     */
    async _retrieveAccessToken() {
        let token = this.tokenCache.getGrantTokenFromCache(
            this.serviceManagerCredentials.url,
            {}
        );
        if (!token) {
            token = await cloudSdk
                .getOAuth2ClientCredentialsToken({
                    clientId: this.serviceManagerCredentials.clientid,
                    clientSecret: this.serviceManagerCredentials.clientsecret,
                    tokenServiceUrl: `${this.serviceManagerCredentials.url}/oauth/token`,
                    url: this.serviceManagerCredentials.sm_url,
                })
                .catch((error) =>
                    handleError(
                        error,
                        null,
                        0,
                        '[HanaHealthCheck][_retrieveAccessToken]'
                    )
                );
        }

        if (token) {
            this.tokenCache.cacheRetrievedToken(
                this.serviceManagerCredentials.url,
                {},
                token
            );
        }

        return Promise.resolve(token?.access_token || null);
    }

    /**
     * @param {string} accessToken service manager http request access toke
     * @returns {Object} service manager instance configuration
     */
    async _retrieveInstanceConfig(accessToken) {
        const response = await axios
            .get(
                `${this.serviceManagerCredentials.sm_url}/v1/service_bindings`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    xsrfCookieName: 'XSRF-TOKEN',
                    xsrfHeaderName: 'X-XSRF-TOKEN',
                    proxy: false,
                }
            )
            .catch((error) =>
                handleError(
                    error,
                    null,
                    0,
                    '[HanaHealthCheck][_retrieveInstanceConfig]'
                )
            );

        return Promise.resolve(response?.data?.items?.[0] || null);
    }
}

module.exports = HanaHealthCheck;
