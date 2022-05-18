const { handleError } = require('../../../srv/lib/error');
const expect = require('expect');
const cds = require('@sap/cds');

describe('lib.error test', () => {
    it('should test axios response if it contains error.response', () => {
        const message = 'Random Response error message ' + cds.utils.uuid();

        const error = {
            isAxiosError: true,
            response: {
                status: 400,
                data: {
                    message,
                },
            },
        };

        try {
            handleError(error);
            expect(1).toBeUndefined; // error throw is expected
        } catch (e) {
            expect(e.message).toBe(message);
        }
    });

    it('should test axios error.request', () => {
        const message = 'Random Request error message ' + cds.utils.uuid();

        const error = {
            isAxiosError: true,
            request: message,
        };

        try {
            handleError(error);
            expect(1).toBeUndefined; // error throw is expected
        } catch (e) {
            expect(e.message).toBe(message);
        }
    });

    it('should test axios setting up error.message ', () => {
        const message = 'Random error message ' + cds.utils.uuid();

        const error = {
            isAxiosError: true,
            message,
        };

        try {
            handleError(error);
            expect(1).toBeUndefined; // error throw is expected
        } catch (e) {
            expect(e.message).toBe(message);
        }
    });

    it('should test text error', () => {
        const message = 'Random error message ' + cds.utils.uuid();

        const error = message;

        try {
            handleError(error);
            expect(1).toBeUndefined; // error throw is expected
        } catch (e) {
            expect(e.message).toBe(message);
        }
    });

    it('should test object error with no message field', () => {
        const message = 'Random error message ' + cds.utils.uuid();

        const error = {
            code: 1000,
            msg: message,
        };

        try {
            handleError(error);
            expect(1).toBeUndefined; // error throw is expected
        } catch (e) {
            expect(JSON.parse(e.message)).toMatchObject(error);
        }
    });
});
