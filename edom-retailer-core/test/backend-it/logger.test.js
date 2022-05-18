const cds = require('@sap/cds');
const expect = require('expect');
const axios = require('axios').default;
const { Logger, cfLoggerSinkFunction } = require('../../srv/utils/logger');
const cfLogger = require('cf-nodejs-logging-support');
const { pause } = require('../lib/testkit');

const { stdout } = process;

const preparedLoggersHashMap = {};

const mockEvaluate = jest.fn().mockResolvedValue('info');
const mockCdsConnectTo = jest
    .fn()
    .mockResolvedValue({ evaluate: mockEvaluate });

const spyStdOut = jest.spyOn(stdout, 'write');

const spyConsoleError = jest.spyOn(console, 'error');
const spyConsoleLog = jest.spyOn(console, 'log');
const spyConsoleWarn = jest.spyOn(console, 'warn');
const spyConsoleInfo = jest.spyOn(console, 'info');
const spyConsoleDebug = jest.spyOn(console, 'debug');
const spyConsoleTrace = jest.spyOn(console, 'trace');

cds.log.Logger = (module, level, prefix) => {
    if (!preparedLoggersHashMap[module]) {
        const logger = new Logger(module, level, prefix);
        preparedLoggersHashMap[module] = logger;
    }

    return preparedLoggersHashMap[module];
};

cds.on('bootstrap', async (app) => {
    app.use(cfLogger.logNetwork);
    cfLogger.setLoggingLevel('debug');
    cfLogger.setSinkFunction(cfLoggerSinkFunction);
});

describe('Logger integration tests', () => {
    beforeAll(() => {
        spyConsoleLog.mockReset();
        spyConsoleError.mockReset();
        spyConsoleWarn.mockReset();
        spyConsoleInfo.mockReset();
        spyConsoleDebug.mockReset();
        spyConsoleTrace.mockReset();
    });

    afterAll(() => {
        spyConsoleLog.mockClear();
        spyConsoleError.mockClear();
        spyConsoleWarn.mockClear();
        spyConsoleInfo.mockClear();
        spyConsoleDebug.mockClear();
        spyConsoleTrace.mockClear();
    });

    // @todo this test also need to be integration one
    // some fake service needs to be raised
    // with only one method which should throw an error
    // e.g with sql which selects something from non-existing table
    it('cap error should go through the logger', async () => {
        // const spyWriteLog = jest.spyOn(logger, 'writeLog');

        let server;
        try {
            server = await require('@sap/cds/server')({
                port: '0',
                from: `${__dirname}/logger`,
            });
            const url = `http://localhost:${server.address().port}`;

            cds.connect.to = mockCdsConnectTo;

            await axios.get(`${url}/test/WrongSQLQuery()`);
            expect(false).toBeTruthy();
        } catch (e) {
            await pause();
            expect(spyConsoleError).toBeCalledTimes(1);
            expect(spyStdOut).toBeCalledTimes(2);
        } finally {
            mockCdsConnectTo.mockClear();
            if (server && server.close) {
                server.close();
            }
        }
    });
});
