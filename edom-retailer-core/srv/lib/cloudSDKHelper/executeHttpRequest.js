/* eslint-disable no-underscore-dangle */
const { executeHttpRequest } = require('@sap-cloud-sdk/core');

/*
 * The class is designed to concentrate false positive Fortify messages related to external requests at one place.
 * Should there be a need for an additional HTTP method, it shall be added in a similar fashion to existing public methods.
 */
class ExecuteHttpRequest {
    /*
     * PUBLIC METHODS
     */

    static get(destination, requestConfig, options) {
        return ExecuteHttpRequest._abstractRequest(
            'GET',
            destination,
            requestConfig,
            options
        );
    }

    static post(destination, requestConfig, options) {
        return ExecuteHttpRequest._abstractRequest(
            'POST',
            destination,
            requestConfig,
            options
        );
    }

    static delete(destination, requestConfig, options) {
        return ExecuteHttpRequest._abstractRequest(
            'DELETE',
            destination,
            requestConfig,
            options
        );
    }

    /*
     * PRIVATE METHODS
     */

    static async _abstractRequest(
        httpMethod,
        destination,
        requestConfig,
        options
    ) {
        /* eslint-disable-next-line no-param-reassign */
        requestConfig.method = httpMethod;
        /* eslint-disable-next-line no-param-reassign */
        requestConfig.proxy = false;
        return executeHttpRequest(destination, requestConfig, options);
    }
}

module.exports = ExecuteHttpRequest;
