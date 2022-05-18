/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
/* eslint-disable no-param-reassign */
const xsenv = require('@sap/xsenv');
const logger = require('cf-nodejs-logging-support');
const qs = require('qs');

const jsError = require('../lib/jobscheduler/JobSchedulerErrorMessages');
const {
    decodeToken,
    sendRequest,
} = require('../lib/jobscheduler/jobSchedulerHelper');
const { getEnabledFeatures, getBundle } = require('../lib/helper');

const i18nPath = '../../_i18n/i18n';
const jsBetaFeatureFlag = 'job-scheduler';
const contentType = 'application/json';
const jsCredentials =
    xsenv.filterServices({ tag: 'jobscheduler' }).length > 0
        ? xsenv.serviceCredentials({ tag: 'jobscheduler' })
        : null;

function error(loggerMsg, err, req) {
    const bundle = getBundle(req, i18nPath);
    const jsErr = jsError()(bundle);

    const status = err.response ? err.response.status : 500;
    const message = err.response
        ? err.response.data.detailedError
        : err.message;

    if (message === 'Internal Server Error') {
        req.error({
            status: jsErr.JobSchedulerInternalServerError.code,
            message: jsErr.JobSchedulerInternalServerError.message,
        });
        return req;
    }

    logger.error(`[JobSchedulerService] ${loggerMsg} `, message);
    req.error({
        status: status || error.JobSchedulerInternalServerError.code,
        message: message || error.JobSchedulerInternalServerError.message,
    });
    return req;
}

function mapSingleRead(attr) {
    return {
        jobId: attr._id,
        name: attr.name,
        description: attr.description,
        action: attr.action,
        active: attr.active,
        httpMethod: attr.httpMethod,
        jobType: attr.jobType,
        tenantId: attr.tenantId,
        subDomain: attr.subDomain,
        createdAt: attr.createdAt,
        schedules: attr.schedules.map((sc) => {
            const schedule = {
                description: sc.description,
                active: sc.active,
                data: sc.data,
                nextRunAt: sc.nextRunAt,
                type: sc.type,
            };
            if (sc.cron) {
                schedule.cron = sc.cron;
            }
            if (sc.startTime) {
                schedule.startTime = {
                    date: sc.startTime,
                };
            }
            if (sc.endTime) {
                schedule.endTime = {
                    date: sc.endTime,
                };
            }

            if (sc.time) {
                schedule.time = {
                    date: sc.time,
                };
            }

            return schedule;
        }),
    };
}

function addDefault(req) {
    try {
        const schedules = req.data.schedules.map((schedule) => {
            if (!schedule.cron && !schedule.time?.date) {
                schedule.cron = '* * * * * */5 0';
            } else if (
                schedule.time &&
                schedule.time.date &&
                !schedule.time.format
            ) {
                schedule.time = schedule.time.date;
            }
            return schedule;
        });
        req.data.schedules = schedules;
    } catch (err) {
        error('addDefault error');
    }
    return req.data;
}

function validateIdParam(params) {
    let index = -1;
    if (params.length > 0) {
        index = params.findIndex((param) => param.jobId !== undefined);
    }
    return index;
}

function filterPayload(req, res) {
    try {
        if (req.query.SELECT.where && res.length > 0) {
            const index = req.query.SELECT.where.findIndex(
                (param) => param === '='
            );
            if (index > 0) {
                const filtAttr = req.query.SELECT.where[index - 1].ref[0];
                const filtVal = req.query.SELECT.where[index + 1].val;
                return res.filter((payload) => payload[filtAttr] === filtVal);
            }
        }
    } catch (err) {
        logger.info(`[JobSchedulerService.js][filterPayload]: ${err.message}`);
    }
    return res;
}
module.exports = async (srv) => {
    async function getToken(req) {
        let authStr;
        try {
            const subdomain = decodeToken(req);
            logger.info(
                `[JobSchedulerService.js][getToken]: subdomain: ${subdomain}`
            );
            const url = `https://${subdomain}.authentication.eu10.hana.ondemand.com/oauth/token`;

            const tokenData = qs.stringify({
                response_type: 'token',
                grant_type: 'client_credentials',
                client_id: jsCredentials.uaa.clientid,
                client_secret: jsCredentials.uaa.clientsecret,
                scope: '',
            });

            const reqConfig = {
                url,
                method: 'post',
                headers: {
                    Accept: contentType,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: tokenData,
            };

            const { data } = await sendRequest(url, reqConfig);

            authStr = 'Bearer '.concat(data.access_token);
        } catch (err) {
            error('Error while fetching token:', err, req);
        }
        return authStr;
    }

    srv.before('*', async (req) => {
        const enabledFeatures = await getEnabledFeatures(req, [
            jsBetaFeatureFlag,
        ]);
        const bundle = getBundle(req, i18nPath);
        const jsErr = jsError(enabledFeatures)(bundle);

        if (!enabledFeatures.includes(jsBetaFeatureFlag) || !jsCredentials) {
            req.reject({
                status: jsErr.JobSchedulerServiceDoesntExist.code,
                message: jsErr.JobSchedulerServiceDoesntExist.message,
            });
        }
    });

    srv.before('UPDATE', 'Job', async (req) => {
        req.reject({
            status: 405,
            message: `${req.method} is forbidden`,
        });
        return req;
    });

    srv.on('DELETE', 'Job', async (req) => {
        try {
            const url = `${jsCredentials.url}/scheduler/jobs/${req.params[0].jobId}`;
            const token = await getToken(req);
            const reqConfig = {
                url,
                method: 'delete',
                headers: {
                    Authorization: token,
                },
            };

            logger.info(
                `[JobSchedulerService.js][deleteJob]: Deleting Job with JobId: ${req.data.jobId}`
            );
            const { status } = await sendRequest(url, reqConfig);

            logger.info(
                `[JobSchedulerService.js][deleteJob]: Job Scheduler returned with with status : ${status}`
            );
        } catch (err) {
            error('Error while deleting job:', err, req);
        }
        return req;
    });

    srv.on('READ', 'Job', async (req) => {
        let res;
        const index = validateIdParam(req.params);
        if (index < 0) {
            const url = `${jsCredentials.url}/scheduler/jobs`;
            const token = await getToken(req);
            const reqConfig = {
                url,
                method: 'get',
                headers: {
                    Authorization: token,
                    'Content-Type': contentType,
                },
            };

            try {
                const { data } = await sendRequest(url, reqConfig);

                res = filterPayload(
                    req,
                    data.results.map((attr) => {
                        return {
                            jobId: attr.jobId,
                            name: attr.name,
                            description: attr.description,
                            action: attr.action,
                            active: attr.active,
                            httpMethod: attr.httpMethod,
                            jobType: attr.jobType,
                            tenantId: attr.tenantId,
                            subDomain: attr.subDomain,
                            createdAt: attr.createdAt,
                            ACTIVECOUNT: attr.ACTIVECOUNT,
                            INACTIVECOUNT: attr.INACTIVECOUNT,
                        };
                    })
                );
            } catch (err) {
                error('Error while getting jobs:', err, req);
                return req;
            }
        } else {
            const url = `${jsCredentials.url}/scheduler/jobs/${req.params[index].jobId}`;
            const token = await getToken(req);
            const reqConfig = {
                url,
                method: 'get',
                headers: {
                    Authorization: token,
                    'Content-Type': contentType,
                },
                params: {
                    displaySchedules: true,
                },
            };

            try {
                const { data: attr } = await sendRequest(url, reqConfig);

                res = mapSingleRead(attr);
            } catch (err) {
                error('Error while getting job schedules:', err, req);
                return req;
            }
        }
        return res;
    });

    srv.on('CREATE', 'Job', async (req) => {
        let res;
        const url = `${jsCredentials.url}/scheduler/jobs`;
        const token = await getToken(req);
        const reqConfig = {
            url,
            method: 'post',
            headers: {
                Authorization: token,
                'Content-Type': contentType,
            },
            data: addDefault(req),
        };
        try {
            logger.info(`[JobSchedulerService.js][postJob]: creating job`);
            const { data } = await sendRequest(url, reqConfig);

            logger.info(
                `[JobSchedulerService.js][postJob]: job created with JobId: ${data._id}`
            );

            res = {
                jobId: data._id,
            };
        } catch (err) {
            error('Error while posting job:', err, req);
            return req;
        }
        return res;
    });
};
