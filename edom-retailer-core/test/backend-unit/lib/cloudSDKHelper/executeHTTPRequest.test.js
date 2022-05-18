const expect = require('expect');
const ExecuteHTTPRequest = require('../../../../srv/lib/cloudSDKHelper/executeHttpRequest');

const fakeResponse = { status: 204, body: 'Test response' };
const mockExecuteHttpRequest = jest.fn().mockResolvedValue(fakeResponse);

const fakeDestination = { destinationName: 'myDestName', jwt: 'myJwt' };
const fakeRequestConfig = {
    headers: {
        accept: '*/*',
        'content-type': 'application/xml',
        client_id: 'myClientId',
        client_secret: 'myClientSecret',
    },
    timeout: 60000,
    url: `myUrl/api/v1/core`,
    data: { my: 'my', payload: 'payload' },
};

jest.mock('@sap-cloud-sdk/core', () => ({
    executeHttpRequest: async (...params) => {
        const result = await mockExecuteHttpRequest(...params);
        return result;
    },
}));

describe('lib.cloudSDKHelper.executeHttpRequest.test', () => {
    beforeEach(() => {
        mockExecuteHttpRequest.mockClear();
    });
    it('should execute cloudSDK get executeHTTPRequest', async () => {
        const expectedRequestConfig = Object.assign({}, fakeRequestConfig, {
            method: 'GET',
        });
        const result = await ExecuteHTTPRequest.get(
            fakeDestination,
            fakeRequestConfig
        );
        expect(mockExecuteHttpRequest).toBeCalledWith(
            expect.objectContaining(fakeDestination),
            expect.objectContaining(expectedRequestConfig),
            undefined
        );
        expect(result).toBe(fakeResponse);
    });

    it('should execute cloudSDK post executeHTTPRequest', async () => {
        const expectedRequestConfig = Object.assign({}, fakeRequestConfig, {
            method: 'POST',
        });
        const result = await ExecuteHTTPRequest.post(
            fakeDestination,
            fakeRequestConfig
        );
        expect(mockExecuteHttpRequest).toBeCalledWith(
            expect.objectContaining(fakeDestination),
            expect.objectContaining(expectedRequestConfig),
            undefined
        );
        expect(result).toBe(fakeResponse);
    });

    it('should execute cloudSDK delete executeHTTPRequest', async () => {
        const expectedRequestConfig = Object.assign({}, fakeRequestConfig, {
            method: 'DELETE',
        });
        const result = await ExecuteHTTPRequest.delete(
            fakeDestination,
            fakeRequestConfig
        );
        expect(mockExecuteHttpRequest).toBeCalledWith(
            expect.objectContaining(fakeDestination),
            expect.objectContaining(expectedRequestConfig),
            undefined
        );
        expect(result).toBe(fakeResponse);
    });
});
