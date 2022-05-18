const cds = require('@sap/cds');
const { launchServer } = require('../lib/testkit');
const jestExpect = require('expect');
const logger = require('cf-nodejs-logging-support');
const jobMock = require('../../srv/lib/jobscheduler/jobSchedulerHelper');
const jsError = require('../../srv/lib/jobscheduler/JobSchedulerErrorMessages');

const { TextBundle } = require('@sap/textbundle');
const bundle = new TextBundle('../../_i18n/i18n', ' ');

// Legend:
// [BETA] = need to update line/s below when moving (from beta) to release

// [BETA] - enable (beta) error messages
const error = jsError()(bundle);

let {
    JobSchedulerServiceDoesntExist,
    JobSchedulerMethodNotSupported,
    JobSchedulerInternalServerError,
} = error;

const { code: codeServDNE, message: msgServDNE } =
    JobSchedulerServiceDoesntExist;
const { code: codeIntServ, message: msgIntServ } =
    JobSchedulerInternalServerError;
jest.mock('../../srv/lib/jobscheduler/jobSchedulerHelper');

describe('jobSchedulerBeta it-test UTILITIESCLOUDSOLUTION-3014', () => {
    cds.env.requires.featureFlags = {
        impl: 'test/backend-it/external/FeatureFlagsTestService',
    };
    jobMock.decodeToken.mockImplementation((req) => 'consumer');
    jobMock.sendRequest.mockImplementation(async (url, reqConfig) => {
        if (reqConfig.method === 'get') {
            return {
                data: {
                    total: 2,
                    results: [
                        {
                            jobId: 681163,
                            name: 'transfer Billable Items ',
                            description: 'posting billable items',
                            action: 'https://edom-retailer-dev-srv.cfapps.eu10.hana.ondemand.com/api/alpha/internal/BillableItems/transfer',
                            active: true,
                            httpMethod: 'POST',
                        },
                    ],
                },
                status: 200,
            };
        } else if (reqConfig.method === 'get' && reqConfig.params) {
            return {
                data: {
                    _id: 681163,
                    name: 'transfer Billable Items ',
                    description: 'posting billable items',
                    action: 'https://edom-retailer-dev-srv.cfapps.eu10.hana.ondemand.com/api/alpha/internal/BillableItems/transfer',
                    active: true,
                    httpMethod: 'POST',
                    schedules: [
                        {
                            cron: 'cron',
                            description: 'description',
                            active: true,
                            startTime: 'date',
                            data: '',
                            nextRunAt: 'nextRunAt',
                            type: 'type',
                        },
                    ],
                },
                status: 200,
            };
        } else if (reqConfig.method === 'post') {
            return {
                data: {
                    _id: 757489,
                },
                status: 200,
            };
        } else {
            return {
                data: {},
                status: 204,
            };
        }
    });

    const { GET, DELETE, POST, PUT, PATCH, admin } = launchServer({
        VCAP_SERVICES: {
            jobscheduler: [
                {
                    name: 'c4u-foundation-retailer-job',
                    instance_name: 'c4u-foundation-retailer-job',
                    label: 'jobscheduler',
                    tags: ['jobscheduler'],
                    credentials: {
                        url: 'https://jobscheduler-rest.cfapps.eu10.hana.ondemand.com',
                        uaa: {
                            client_id: 'clientId',
                            clientsecret: 'clientsecret',
                        },
                    },
                },
            ],
        },
        service: {
            paths: ['srv/jobscheduler'],
        },
    });

    beforeAll(async () => {
        // [BETA] - manually change feature flag return value
        const featureFlags = await cds.connect.to('featureFlags');
        featureFlags.set('job-scheduler', true);
    });

    it('should delete job ', async () => {
        let res;
        try {
            res = await DELETE(`/api/jobscheduler/v1/Job(35666)`, {
                auth: admin,
            });
        } catch (error) {
            jestExpect(error.message).toBeUndefined();
            logger.error(`[JobSchedulerTest] ${error.message}`);
        }
        jestExpect(res).toBeDefined();
        jestExpect(res.status).toBe(204);
    });

    it('should create JOB and not persist it UTILITIESCLOUDSOLUTION-3014', async () => {
        try {
            const response = await POST(
                `/api/jobscheduler/v1/Job`,
                {
                    name: 'GET MDIClient new',
                    description: 'cron job that calls GET MDIClient',
                    action: '/api/beta/mdiclient/MDIClient',
                    active: true,
                    httpMethod: 'GET',
                    schedules: [
                        {
                            cron: '* * * * * */10 0',
                            description: 'this schedule runs every 10 minutes',
                            active: true,
                            startTime: {
                                date: '2021-10-13 04:30 +0000',
                                format: 'YYYY-MM-DD HH:mm Z',
                            },
                            endTime: {
                                date: '2021-11-13 04:30 +0000',
                                format: 'YYYY-MM-DD HH:mm Z',
                            },
                        },
                    ],
                },
                { auth: admin }
            );
            jestExpect(response.status).toBe(201);
            jestExpect(response.data.jobId).toEqual(757489);
            const result = await cds.run(
                SELECT.one.from(`sap.c4u.jobscheduler.Job`).where({
                    jobId: response.data.jobId,
                })
            );
            jestExpect(result).toBeNull();
        } catch (error) {
            jestExpect(error.message).toBeUndefined();
            logger.error(`[JobScheduleTest] ${error.message}`);
        }
    });

    it('should not create JOB due to lack of authorization UTILITIESCLOUDSOLUTION-3014', async () => {
        try {
            const response = await POST(
                `/api/jobscheduler/v1/Job`,
                {
                    name: 'GET MDIClient new',
                    description: 'cron job that calls GET MDIClient',
                    action: '/api/beta/mdiclient/MDIClient',
                    active: true,
                    httpMethod: 'GET',
                    schedules: [
                        {
                            cron: '* * * * * */10 0',
                            description: 'this schedule runs every 10 minutes',
                            data: '',
                            active: true,
                            startTime: {
                                date: '2021-10-13 04:30 +0000',
                                format: 'YYYY-MM-DD HH:mm Z',
                            },
                        },
                    ],
                },
                {}
            );
            jestExpect(response.data).toBeUndefined();
        } catch (error) {
            jestExpect(error.message).toEqual('401 - Unauthorized');
            logger.error(`[JobScheduleTest] ${error.message}`);
        }
    });

    it('should not UPDATE JOB with PUT JOUTILITIESCLOUDSOLUTION-3014', async () => {
        try {
            const response = await PUT(
                `/api/jobscheduler/v1/Job(1234)`,
                {
                    name: 'GET MDIClient new',
                    description: 'cron job that calls GET MDIClient',
                    action: '/api/beta/mdiclient/MDIClient',
                    active: true,
                    httpMethod: 'GET',
                    schedules: [
                        {
                            cron: '* * * * * */10 0',
                            description: 'this schedule runs every 10 minutes',
                            active: true,
                            startTime: {
                                date: '2021-10-13 04:30 +0000',
                                format: 'YYYY-MM-DD HH:mm Z',
                            },
                        },
                    ],
                },
                { auth: admin }
            );
            jestExpect(response.status).toBe(405);
        } catch (error) {
            jestExpect(error.message).toEqual('405 - PUT is forbidden');
            logger.error(`[JobScheduleTest] ${error.message}`);
        }
    });

    it('should not UPDATE JOB with PATCH JOUTILITIESCLOUDSOLUTION-3014', async () => {
        try {
            const response = await PATCH(
                `/api/jobscheduler/v1/Job(1234)`,
                {
                    name: 'GET MDIClient new',
                    description: 'cron job that calls GET MDIClient',
                    action: '/api/beta/mdiclient/MDIClient',
                    active: true,
                    httpMethod: 'GET',
                    schedules: [
                        {
                            cron: '* * * * * */10 0',
                            description: 'this schedule runs every 10 minutes',
                            active: true,
                            startTime: {
                                date: '2021-10-13 04:30 +0000',
                                format: 'YYYY-MM-DD HH:mm Z',
                            },
                        },
                    ],
                },
                { auth: admin }
            );
            jestExpect(response.status).toBe(405);
        } catch (error) {
            jestExpect(error.message).toEqual('405 - PATCH is forbidden');
            logger.error(`[JobScheduleTest] ${error.message}`);
        }
    });

    it('should get Jobs UTILITIESCLOUDSOLUTION-3014', async () => {
        try {
            const response = await GET(`/api/jobscheduler/v1/Job`, {
                auth: admin,
            });
            jestExpect(response.status).toBe(200);
            jestExpect(response.data.data.results[0].jobId).toEqual(681163);
            jestExpect(response.data.data.results[0].name).toEqual(
                'transfer Billable Items '
            );
        } catch (error) {
            logger.error(`[JobScheduleTest] ${error.message}`);
        }
    });

    it('should getJobSchedule UTILITIESCLOUDSOLUTION-3014', async () => {
        try {
            const response = await GET(`/api/jobscheduler/v1/Job/681163`, {
                auth: admin,
            });
            jestExpect(response.status).toBe(200);
            jestExpect(response.data.data.results[0].jobId).toEqual(681163);
            jestExpect(response.data.data.results[0].name).toEqual(
                'transfer Billable Items '
            );
            jestExpect(response.data.data.job.schedules[0].cron).toEqual(
                'cron'
            );
        } catch (error) {
            logger.error(`[JobScheduleTest] ${error.message}`);
        }
    });

    it('should throw error status 500 no response UTILITIESCLOUDSOLUTION-3014', async () => {
        jobMock.sendRequest.mockImplementation(async (url, reqConfig) => {
            if (url.split('token').length > 1)
                return {
                    data: {
                        access_token: 757489,
                    },
                    status: 200,
                };

            if (reqConfig.method === 'get')
                throw new Error('Internal Server Error');
            if (reqConfig.method === 'post') throw new Error('mistake on post');
            if (reqConfig.method === 'delete')
                throw new Error('mistake on delete');

            throw new Error('mistake');
        });
        try {
            await GET(`/api/jobscheduler/v1/Job`, { auth: admin });
        } catch (error) {
            jestExpect(error.message).toEqual(`${codeIntServ} - ${msgIntServ}`);
        }

        try {
            await GET(`/api/jobscheduler/v1/Job/681163`, { auth: admin });
        } catch (error) {
            jestExpect(error.message).toEqual('500 - Internal Server Error');
        }

        try {
            await POST(
                `/api/jobscheduler/v1/Job`,
                {
                    name: 'GET MDIClient new',
                    description: 'cron job that calls GET MDIClient',
                    action: '/api/beta/mdiclient/MDIClient',
                    active: true,
                    httpMethod: 'GET',
                    schedules: [
                        {
                            cron: '* * * * * */10 0',
                            description: 'this schedule runs every 10 minutes',
                            active: true,
                            startTime: {
                                date: '2021-10-13 04:30 +0000',
                                format: 'YYYY-MM-DD HH:mm Z',
                            },
                        },
                    ],
                },
                { auth: admin }
            );
        } catch (error) {
            jestExpect(error.message).toEqual('500 - mistake on post');
        }
        try {
            await DELETE(`/api/jobscheduler/v1/Job(751284)`, { auth: admin });
        } catch (error) {
            jestExpect(error.message).toEqual('500 - mistake on delete');
        }
    });

    it('should throw error status x0y with response UTILITIESCLOUDSOLUTION-3014', async () => {
        jobMock.sendRequest.mockImplementation(async (url, reqConfig) => {
            if (url.split('token').length > 1)
                return {
                    data: {
                        access_token: 757489,
                    },
                    status: 200,
                };

            throw {
                response: {
                    status: 400,
                    data: {
                        detailedError: 'Error with the payload',
                    },
                },
            };
        });
        try {
            await GET(`/api/jobscheduler/v1/Job`, { auth: admin });
        } catch (error) {
            jestExpect(error.message).toEqual('400 - Error with the payload');
        }

        try {
            await GET(`/api/jobscheduler/v1/Job(21211)`, { auth: admin });
        } catch (error) {
            jestExpect(error.message).toEqual('400 - Error with the payload');
        }

        try {
            await POST(
                `/api/jobscheduler/v1/Job`,
                {
                    name: 'GET MDIClient new',
                    description: 'cron job that calls GET MDIClient',
                    action: '/api/beta/mdiclient/MDIClient',
                    active: true,
                    httpMethod: 'GET',
                    schedules: [
                        {
                            cron: '* * * * * */10 0',
                            description: 'this schedule runs every 10 minutes',
                            data: '',
                            active: true,
                            startTime: {
                                date: '2021-10-13 04:30 +0000',
                                format: 'YYYY-MM-DD HH:mm Z',
                            },
                        },
                    ],
                },
                { auth: admin }
            );
        } catch (error) {
            jestExpect(error.message).toEqual('400 - Error with the payload');
        }
        try {
            await DELETE(`/api/jobscheduler/v1/Job(751284)`, { auth: admin });
        } catch (error) {
            jestExpect(error.message).toEqual('400 - Error with the payload');
        }
    });

    it('should filter response UTILITIESCLOUDSOLUTION-3014', async () => {
        jobMock.sendRequest.mockImplementation(async (url, reqConfig) => {
            if (url.split('token').length > 1)
                return {
                    data: {
                        access_token: 757489,
                    },
                    status: 200,
                };

            //otherwise

            return {
                data: {
                    total: 2,
                    results: [
                        {
                            jobId: 681163,
                            name: 'transfer Billable Items ',
                            description: 'posting billable items',
                            action: 'https://edom-retailer-dev-srv.cfapps.eu10.hana.ondemand.com/api/alpha/internal/BillableItems/transfer',
                            active: true,
                            httpMethod: 'POST',
                        },
                        {
                            jobId: 681169,
                            name: 'transfer Billable Items 99 ',
                            description: 'posting billable items 21',
                            action: 'https://edom-retailer-dev-srv.cfapps.eu10.hana.ondemand.com/api/alpha/internal/BillableItems/transfer',
                            active: false,
                            httpMethod: 'POST',
                        },
                    ],
                },
                status: 200,
            };
        });
        try {
            const { data } = await GET(
                `/api/jobscheduler/v1/Job?$filter=active eq true`,
                { auth: admin }
            );
            jestExpect(data.value[0].active).toEqual(true);
            jestExpect(data.value.length).toEqual(1);
        } catch (error) {
            jestExpect(error.toBeUndefined());
        }
    });

    it('should raise error upon feature flag not being there UTILITIESCLOUDSOLUTION-3014', async () => {
        const featureFlags = await cds.connect.to('featureFlags');
        featureFlags.set('job-scheduler', false);
        jobMock.sendRequest.mockImplementation(async (url, reqConfig) => {
            if (url.split('token').length > 1)
                return {
                    data: {
                        access_token: 757489,
                    },
                    status: 200,
                };

            //otherwise

            return {
                data: {
                    total: 2,
                    results: [
                        {
                            jobId: 681163,
                            name: 'transfer Billable Items ',
                            description: 'posting billable items',
                            action: 'https://edom-retailer-dev-srv.cfapps.eu10.hana.ondemand.com/api/alpha/internal/BillableItems/transfer',
                            active: true,
                            httpMethod: 'POST',
                        },
                        {
                            jobId: 681169,
                            name: 'transfer Billable Items 99 ',
                            description: 'posting billable items 21',
                            action: 'https://edom-retailer-dev-srv.cfapps.eu10.hana.ondemand.com/api/alpha/internal/BillableItems/transfer',
                            active: false,
                            httpMethod: 'POST',
                        },
                    ],
                },
                status: 200,
            };
        });
        let message;
        try {
            const { data } = await GET(
                `/api/jobscheduler/v1/Job?$filter=active eq true`,
                { auth: admin }
            );
            jestExpect(data.value[0].active).toEqual(true);
            jestExpect(data.value.length).toEqual(1);
        } catch (error) {
            message = error.message;
        }
        jestExpect(message).toEqual(`${codeServDNE} - ${msgServDNE}`);
        featureFlags.set('job-scheduler', true);
    });

    it('should filter with no response UTILITIESCLOUDSOLUTION-3014', async () => {
        jobMock.sendRequest.mockImplementation(async (url, reqConfig) => {
            if (url.split('token').length > 1)
                return {
                    data: {
                        access_token: 757489,
                    },
                    status: 200,
                };

            //otherwise

            return {
                data: {
                    total: 0,
                    results: [],
                },
                status: 200,
            };
        });
        try {
            const { data } = await GET(
                `/api/jobscheduler/v1/Job?$filter=active eq true`,
                { auth: admin }
            );
            jestExpect(data.value.length).toEqual(0);
        } catch (error) {
            jestExpect(error).toBeUndefined();
        }
    });

    it('should ignore filter response UTILITIESCLOUDSOLUTION-3014', async () => {
        jobMock.sendRequest.mockImplementation(async (url, reqConfig) => {
            if (url.split('token').length > 1)
                return {
                    data: {
                        access_token: 757489,
                    },
                    status: 200,
                };

            //otherwise

            return {
                data: {
                    total: 2,
                    results: [
                        {
                            jobId: 681163,
                            name: 'transfer Billable Items ',
                            description: 'posting billable items',
                            action: 'https://edom-retailer-dev-srv.cfapps.eu10.hana.ondemand.com/api/alpha/internal/BillableItems/transfer',
                            active: true,
                            httpMethod: 'POST',
                            ACTIVECOUNT: 3,
                        },
                        {
                            jobId: 681169,
                            name: 'transfer Billable Items 99 ',
                            description: 'posting billable items 21',
                            action: 'https://edom-retailer-dev-srv.cfapps.eu10.hana.ondemand.com/api/alpha/internal/BillableItems/transfer',
                            active: false,
                            httpMethod: 'POST',
                            ACTIVECOUNT: 0,
                        },
                    ],
                },
                status: 200,
            };
        });
        try {
            const { data } = await GET(
                `/api/jobscheduler/v1/Job?$filter=ACTIVECOUNT gt 2`,
                { auth: admin }
            );
            jestExpect(data.value.length).toEqual(2);
        } catch (error) {
            jestExpect(error).toBeUndefined();
        }
    });

    it('should default cron to 5 minutes response UTILITIESCLOUDSOLUTION-3014', async () => {
        jobMock.sendRequest.mockImplementation(async (url, reqConfig) => {
            if (url.split('token').length > 1)
                return {
                    data: {
                        access_token: 757489,
                    },
                    status: 200,
                };

            jestExpect(reqConfig.data.schedules[0].cron).toEqual(
                '* * * * * */5 0'
            );

            return {
                data: {
                    _id: 323232,
                },
            };
        });
        try {
            await POST(
                `/api/jobscheduler/v1/Job`,
                {
                    name: 'GET MDIClient new',
                    description: 'cron job that calls GET MDIClient',
                    action: '/api/beta/mdiclient/MDIClient',
                    active: true,
                    httpMethod: 'GET',
                    schedules: [
                        {
                            description: 'this schedule runs every 10 minutes',
                            data: '',
                            active: true,
                            startTime: {
                                date: '2021-10-13 04:30 +0000',
                                format: 'YYYY-MM-DD HH:mm Z',
                            },
                        },
                    ],
                },
                { auth: admin }
            );
        } catch (error) {
            jestExpect(error).toBeUndefined();
        }
    });

    it('should getJobSchedule for a specific test UTILITIESCLOUDSOLUTION-3014', async () => {
        try {
            jobMock.sendRequest.mockImplementation(async (url, reqConfig) => {
                if (url.split('token').length > 1)
                    throw new Error('mistake on token');

                return {
                    data: {
                        _id: 681163,
                        name: 'transfer Billable Items ',
                        description: 'posting billable items',
                        action: 'https://edom-retailer-dev-srv.cfapps.eu10.hana.ondemand.com/api/alpha/internal/BillableItems/transfer',
                        active: true,
                        httpMethod: 'POST',
                        schedules: [
                            {
                                cron: 'cron',
                                description: 'description',
                                active: true,
                                startTime: 'date',
                                data: '',
                                nextRunAt: 'nextRunAt',
                                type: 'type',
                            },
                        ],
                    },
                    status: 200,
                };
            });

            const response = await GET(`/api/jobscheduler/v1/Job/681163`, {
                auth: admin,
            });
        } catch (error) {
            logger.error(`[JobScheduleTest] ${error.message}`);
            jestExpect(error.message).toEqual('500 - mistake on token');
        }
    });

    it('should default retructure time from Object to String 5 response UTILITIESCLOUDSOLUTION-3014', async () => {
        jobMock.sendRequest.mockImplementation(async (url, reqConfig) => {
            if (url.split('token').length > 1)
                return {
                    data: {
                        access_token: 757489,
                    },
                    status: 200,
                };

            jestExpect(reqConfig.data.schedules[0].time).toEqual('now');

            return {
                data: {
                    _id: 323232,
                },
            };
        });
        try {
            await POST(
                `/api/jobscheduler/v1/Job`,
                {
                    name: 'GET MDIClient new',
                    description: 'cron job that calls GET MDIClient',
                    action: '/api/beta/mdiclient/MDIClient',
                    active: true,
                    httpMethod: 'GET',
                    schedules: [
                        {
                            description: 'this schedule runs every 10 minutes',
                            data: '',
                            active: true,
                            time: {
                                date: 'now',
                            },
                        },
                    ],
                },
                { auth: admin }
            );
        } catch (error) {
            jestExpect(error).toBeUndefined();
        }
    });
});
