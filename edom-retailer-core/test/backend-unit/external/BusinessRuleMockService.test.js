const expect = require('expect');
const BusinessRuleMockService = require('../../../srv/external/BusinessRuleMockService');

describe('external BusinessRuleMockService UTILITIESCLOUDSOLUTION-2574', () => {
    const vocabulary1 = { statuses: ['00', '01', '02', '03', '04', '05'] };
    const vocabulary2 = { statuses: ['00', '01', '03', '04', '05'] };
    const vocabulary3 = { statuses: ['00', '03', '04', '05'] };
    const vocabulary4 = { statuses: ['03', '04', '05'] };
    const vocabulary5 = { statuses: ['04', '05'] };
    const vocabulary6 = {
        statuses: ['00', '01', '02', '03', '04', '05', '06', '07', '08'],
    };
    const vocabulary7 = {
        statuses: ['00', '03', '04', '05', '09', '10'],
    };
    const vocabulary8 = { statuses: ['04', '05', '10'] };

    it('should recalculate overallStatus as 02', () => {
        const result =
            BusinessRuleMockService.recalculateOverallStatus(vocabulary1);
        expect(result).toBe('02');
    });

    it('should recalculate overallStatus as 01', () => {
        const result =
            BusinessRuleMockService.recalculateOverallStatus(vocabulary2);
        expect(result).toBe('01');
    });

    it('should recalculate overallStatus as 00', () => {
        const result =
            BusinessRuleMockService.recalculateOverallStatus(vocabulary3);
        expect(result).toBe('00');
    });

    it('should recalculate overallStatus as 03', () => {
        const result =
            BusinessRuleMockService.recalculateOverallStatus(vocabulary4);
        expect(result).toBe('03');
    });

    it('should recalculate overallStatus as 04', () => {
        const result =
            BusinessRuleMockService.recalculateOverallStatus(vocabulary5);
        expect(result).toBe('04');
    });

    it('should recalculate overallStatus as 08', () => {
        const result =
            BusinessRuleMockService.recalculateOverallStatus(vocabulary6);
        expect(result).toBe('08');
    });

    it('should recalculate overallStatus as 09', () => {
        const result =
            BusinessRuleMockService.recalculateOverallStatus(vocabulary7);
        expect(result).toBe('09');
    });

    it('should recalculate overallStatus as 10', () => {
        const result =
            BusinessRuleMockService.recalculateOverallStatus(vocabulary8);
        expect(result).toBe('10');
    });
});
