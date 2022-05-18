/* eslint-disable no-underscore-dangle */

/*
 * Collects health check reports from different health checks
 */
class HealthCheckVisitor {
    /**
     * Constructor
     */
    constructor() {
        this._healthCheckResults = [];
    }

    /**
     * Getter for retrieving visited health checks reports
     */
    get healthCheckResults() {
        return this._healthCheckResults;
    }

    static async pause(ms) {
        await new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    /**
     * Callback of health checks for reporting reports
     *
     * @param  {} healthCheck
     */
    async reportHealthCheck(healthCheck) {
        let status;

        await Promise.all(
            HealthCheckVisitor.RETRY_TIMES.map(async (tryNum) => {
                await HealthCheckVisitor.pause(1000 * tryNum);
                if (status !== HealthCheckVisitor.STATUS_UP) {
                    status = (await healthCheck.isReachable())
                        ? HealthCheckVisitor.STATUS_UP
                        : HealthCheckVisitor.STATUS_DOWN;
                }
            })
        );

        this._healthCheckResults.push({
            name: healthCheck.name,
            cycletime: 0.0,
            status,
        });
    }

    static get RETRY_TIMES() {
        return [1, 2, 3];
    }

    static get STATUS_UP() {
        return 'UP';
    }

    static get STATUS_DOWN() {
        return 'DOWN';
    }
}

module.exports = HealthCheckVisitor;
