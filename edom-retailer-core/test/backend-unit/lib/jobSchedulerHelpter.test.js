const jestExpect = require('expect');
const jsh = require('../../../srv/lib/jobscheduler/jobSchedulerHelper');
const jwt = require('jsonwebtoken');
const ExecuteHTTPRequest = require('../../../srv/lib/cloudSDKHelper/executeHttpRequest');

jest.mock('jsonwebtoken');
jest.mock('../../../srv/lib/cloudSDKHelper/executeHttpRequest');

describe('jobScheduler helper unit test  UTILITIESCLOUDSOLUTION-3014', () => {
    jwt.decode.mockImplementation((name) => ({
        ext_attr: {
            zdn: name,
        },
    }));

    it('should decode Token ', async () => {
        const subdomain = jsh.decodeToken({
            headers: {
                authorization: 'Bearer c4udevaws',
            },
        });
        jestExpect(subdomain).toEqual('c4udevaws');
    });

    it('should return valid Delete payload ', async () => {
        ExecuteHTTPRequest.delete.mockImplementation(
            async (url, reqConfig, options) => {
                return {
                    data: {},
                    status: 204,
                };
            }
        );
        const { status } = await jsh.sendRequest('', { method: 'delete' });
        jestExpect(status).toEqual(204);
    });

    it('should return valid GET payload', async () => {
        ExecuteHTTPRequest.get.mockImplementation(
            async (url, reqConfig, options) => {
                return {
                    data: {},
                    status: 204,
                };
            }
        );
        const { status } = await jsh.sendRequest('', { method: 'get' });
        jestExpect(status).toEqual(204);
    });

    it('should return valid POST payload', async () => {
        ExecuteHTTPRequest.post.mockImplementation(
            async (url, reqConfig, options) => {
                return {
                    data: {},
                    status: 204,
                };
            }
        );
        const { status } = await jsh.sendRequest('', { method: 'post' });
        jestExpect(status).toEqual(204);
    });

    it('should not return invalid payload', async () => {
        let res;
        try {
            res = await jsh.sendRequest('', { method: 'fake' });
        } catch (e) {
            res = e;
        }

        jestExpect(res.message).toEqual('Internal Server Error');
    });
});
