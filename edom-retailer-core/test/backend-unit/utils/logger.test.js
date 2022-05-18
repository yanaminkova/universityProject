const cds = require('@sap/cds');
const expect = require('expect');
const { Logger, cfLoggerSinkFunction } = require('../../../srv/utils/logger');
const cfLogger = require('cf-nodejs-logging-support');
const { pause } = require('../../lib/testkit');

cfLogger.setSinkFunction(cfLoggerSinkFunction);

const preparedLoggersHashMap = {};
cds.log.Logger = (module, level, prefix) => {
    if (!preparedLoggersHashMap[module]) {
        const logger = new Logger(module, prefix, level);
        preparedLoggersHashMap[module] = logger;
    }

    return preparedLoggersHashMap[module];
};

const mockEvaluate = jest.fn().mockResolvedValue('trace');
const mockCdsConnectTo = jest
    .fn()
    .mockResolvedValue({ evaluate: mockEvaluate });
cds.connect.to = mockCdsConnectTo;

const spyConsoleError = jest.spyOn(console, 'error');
const spyConsoleWarn = jest.spyOn(console, 'warn');
const spyConsoleTrace = jest.spyOn(console, 'trace');
const spyConsoleLog = jest.spyOn(console, 'log');
const spyConsoleInfo = jest.spyOn(console, 'info');
const spyConsoleDebug = jest.spyOn(console, 'debug');

describe('Logger unit tests', () => {
    beforeEach(() => {
        spyConsoleError.mockReset();
        spyConsoleWarn.mockReset();
        spyConsoleTrace.mockReset();
        spyConsoleLog.mockReset();
        spyConsoleInfo.mockReset();
        spyConsoleDebug.mockReset();
    });

    afterAll(() => {
        spyConsoleError.mockClear();
        spyConsoleWarn.mockClear();
        spyConsoleTrace.mockClear();
    });

    it('should log all messages in a given sequence', async () => {
        const logger = cds.log.Logger(
            'c4u-foundation-retailer-srv',
            'info',
            'prf'
        );

        mockEvaluate.mockResolvedValueOnce('trace');

        const spyWriteLog = jest.spyOn(logger, 'writeLog');

        try {
            logger.log('First');
            logger.error('Second');
            logger.warn('Third');
            logger.info('Fourth');
            logger.debug('Fifth');
            logger.trace('Sixth');

            await pause();

            // check order, number of calls for each spy
            expect(spyWriteLog.mock.calls[0][0]).toBe('info');
            expect(spyWriteLog.mock.calls[0][1]).toBe('First');
            expect(spyWriteLog.mock.calls[1][0]).toBe('error');
            expect(spyWriteLog.mock.calls[1][1]).toBe('Second');
            expect(spyWriteLog.mock.calls[2][0]).toBe('warn');
            expect(spyWriteLog.mock.calls[2][1]).toBe('Third');
            expect(spyWriteLog.mock.calls[3][0]).toBe('info');
            expect(spyWriteLog.mock.calls[3][1]).toBe('Fourth');
            expect(spyWriteLog.mock.calls[4][0]).toBe('debug');
            expect(spyWriteLog.mock.calls[4][1]).toBe('Fifth');
            expect(spyWriteLog.mock.calls[5][0]).toBe('trace');
            expect(spyWriteLog.mock.calls[5][1]).toBe('Sixth');

            expect(spyWriteLog).toBeCalledTimes(6);

            expect(spyConsoleWarn).toBeCalledTimes(1);
            expect(spyConsoleError).toBeCalledTimes(1);
            expect(spyConsoleTrace).toBeCalledTimes(1);
            expect(spyConsoleLog).toBeCalledTimes(0);
            expect(spyConsoleInfo).toBeCalledTimes(2);
            expect(spyConsoleDebug).toBeCalledTimes(1);
        } finally {
            spyWriteLog.mockClear();
        }
    });

    it('should log only error messages', async () => {
        const logger = cds.log.Logger('c4u-foundation-retailer-srv', 'trace');

        const spyWriteLog = jest.spyOn(logger, 'writeLog');

        mockEvaluate
            .mockResolvedValueOnce('error')
            .mockResolvedValueOnce('error')
            .mockResolvedValueOnce('error')
            .mockResolvedValueOnce('error')
            .mockResolvedValueOnce('error')
            .mockResolvedValueOnce('error');

        try {
            logger.log('First');
            logger.error('Second');
            logger.warn('Third');
            logger.info('Fourth');
            logger.debug('Fifth');
            logger.trace('Sixth');

            await pause();

            expect(spyWriteLog).toBeCalledTimes(6);

            expect(spyConsoleError).toBeCalledTimes(1);
            expect(spyConsoleWarn).toBeCalledTimes(0); //triggered by Log severity level.
            expect(spyConsoleTrace).toBeCalledTimes(0);
            expect(spyConsoleLog).toBeCalledTimes(0);
            expect(spyConsoleInfo).toBeCalledTimes(0);
            expect(spyConsoleDebug).toBeCalledTimes(0);
        } finally {
            spyWriteLog.mockClear();
        }
    });

    it('should use fallback value for unsuccessful call of the ff service', async () => {
        const logger = cds.log.Logger('c4u-foundation-retailer-srv', 'warn');

        const spyWriteLog = jest.spyOn(logger, 'writeLog');

        mockEvaluate
            .mockResolvedValueOnce('debug')
            .mockResolvedValueOnce('debug')
            .mockResolvedValueOnce('debug')
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined);

        try {
            process.env.LOG_LEVEL = 'TRACE';

            logger.log('First');
            logger.error('Second');
            logger.warn('Third');
            logger.info('Fourth');
            logger.debug('Fifth');
            logger.trace('Sixth');

            await pause();

            expect(spyWriteLog).toBeCalledTimes(6);

            expect(spyConsoleError).toBeCalledTimes(1);
            expect(spyConsoleWarn).toBeCalledTimes(1); //triggered by Warn, Log, Info, Debug. See cds Logger implementation.
            expect(spyConsoleTrace).toBeCalledTimes(0);

            expect(spyConsoleLog).toBeCalledTimes(0);
            expect(spyConsoleInfo).toBeCalledTimes(2);
            expect(spyConsoleDebug).toBeCalledTimes(0);
        } finally {
            spyWriteLog.mockClear();
        }

        // check number of calls for each

        spyWriteLog.mockClear();
    });
});
