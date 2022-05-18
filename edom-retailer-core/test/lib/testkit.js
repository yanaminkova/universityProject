const path = require('path');
const cds = require('@sap/cds');
const { sanitizerHandler } = require('../../srv/lib/xssSanitizer');

global.before = (msg, fn) => {
    global.beforeAll(fn || msg);
};

class RetailerEDOMTestKit {
    /** Lazily loads and returns an instance of chai */
    get chai() {
        const chai = require('chai');
        chai.use(require('chai-as-promised'));
        chai.use(require('chai-subset'));
        chai.use(require('./chai-cds'));
        chai.should();
        return chai;
    }

    get expect() {
        return this.chai.expect;
    }

    get assert() {
        return this.chai.assert;
    }

    get req() {
        return {
            error: () => {},
            user: { id: 'admin', is: () => true },
            authInfo: () => {},
        };
    }

    async pause(ms = 1000) {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }

    get mockServerConf() {
        return {
            onUnhandledRequest: (req) => {
                console.info(`Unhandled request: ${req.url.href}`);
            },
        };
    }

    /**
     * Launching server for test suites in optimized way
     * @param {Object} config - Server launch configurations.
     * @param {Object} config.service - services launch configurations.
     *
     * @param {Array<String|Array<String>>} config.service.paths - order of launching services.
     * @example  ['db', ['srv/dpp'], ['srv/api']]
     *
     * @param {Object} config.VCAP_SERVICES - VCAP services configuration replacement (optional).
     *
     * @returns {Object} - raised server and misc. methods to work with it
     */
    launchServer(config) {
        const express = require('express');
        const axios = require('axios').default;

        function _error(e) {
            if (!e.response) throw e;
            if (!e.response.data) throw e;
            if (!e.response.data.error) throw e;
            const { code, message, details } = e.response.data.error;

            let output =
                code && code !== 'null' ? `${code} - ${message}` : message;

            if (details) {
                details.forEach((d) => {
                    output =
                        output +
                        '\n' +
                        (d.code && d.code !== 'null'
                            ? `${d.code} - ${d.message}`
                            : d.message);
                });
            }

            throw new Error(output);
        }

        const test = {
            GET: (path, ...etc) =>
                axios.get(test.url + path, ...etc).catch(_error),
            PUT: (path, ...etc) =>
                axios.put(test.url + path, ...etc).catch(_error),
            POST: (path, ...etc) =>
                axios.post(test.url + path, ...etc).catch(_error),
            PATCH: (path, ...etc) =>
                axios.patch(test.url + path, ...etc).catch(_error),
            DELETE: (path, ...etc) =>
                axios.delete(test.url + path, ...etc).catch(_error),

            get: (path, ...etc) =>
                axios.get(test.url + path, ...etc).catch(_error),
            put: (path, ...etc) =>
                axios.put(test.url + path, ...etc).catch(_error),
            post: (path, ...etc) =>
                axios.post(test.url + path, ...etc).catch(_error),
            patch: (path, ...etc) =>
                axios.patch(test.url + path, ...etc).catch(_error),
            delete: (path, ...etc) =>
                axios.delete(test.url + path, ...etc).catch(_error),
            url: () => test.url,
            admin: {
                username: 'admin',
                password: 'admin',
            },
            user: {
                username: 'user',
                password: 'user',
            },
            viewer: {
                username: 'viewer',
                password: 'viewer',
            },
            drmUser: {
                username: 'drm',
                password: 'drm',
            },
            pdmUser: {
                username: 'pdm',
                password: 'pdm',
            },
        };

        before('Launching cds server...', async () => {
            const app = express();
            cds.app = app;

            cds.on('serving', sanitizerHandler);
            cds.on('connect', sanitizerHandler);

            // Prepare CDS environment
            if (config && config.VCAP_SERVICES) {
                process.env.VCAP_SERVICES = JSON.stringify(
                    config.VCAP_SERVICES
                );
            } else if (process.env.VCAP_SERVICES) {
                delete process.env.VCAP_SERVICES;
            }

            const defaultPaths = [
                path.join(__dirname, '../../srv/api'),
                path.join(__dirname, '../../srv/alpha/*'),
                path.join(__dirname, '../../srv/beta/*'),
            ];

            const paths2serve =
                config && config.service && config.service.paths
                    ? config.service.paths
                    : defaultPaths;

            const paths2load =
                config && config.service && config.service.paths
                    ? paths2serve.reduce((accumulator, srvPath) => {
                          const paths2add =
                              Array.isArray(srvPath) && srvPath.length
                                  ? srvPath
                                  : [srvPath];
                          paths2add.forEach((onePath) =>
                              accumulator.push(onePath)
                          );

                          return accumulator;
                      }, [])
                    : defaultPaths;

            const csn = await cds.load(paths2load);
            cds.model = cds.linked(cds.compile.for.odata(csn));

            const dbOptions = {
                in_memory: true,
                credentials: { database: ':memory:' },
            };
            cds.db = await cds.connect.to('db', dbOptions);
            await cds.deploy(csn).to(cds.db, dbOptions);

            console.time('Raising services');
            const message = paths2load.reduce(
                (messagePart, path) => messagePart + path + '\r\n',
                'Services to be raised:\r\n'
            );
            console.log(message);

            for (let path of paths2serve) {
                await cds.serve({ from: path }).in(app);
            }

            console.timeEnd('Raising services');

            const server = await app.listen();
            const url = `http://localhost:${server.address().port}`;

            test.server = server;
            test.url = url;
        });

        afterAll(async () => {
            if (test.server) {
                await test.server.close();
            }
            process.emit('shutdown');
        });

        return test;
    }
}

module.exports = new RetailerEDOMTestKit();
