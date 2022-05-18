const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the exposed entity of MDIClientService
 */
describe('MDIClientService CDS test UTILITIESCLOUDSOLUTION-2916', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should contain all specified entities', () => {
        expect('JobSchedulerService').to.have.entities(['Job']);
    });

    it('should contain all defined attributes of MDIClient', () => {
        expect('JobSchedulerService.Job').to.have.attributes([
            'jobId',
            'name',
            'description',
            'action',
            'active',
            'httpMethod',
            'jobType',
            'tenantId',
            'subDomain',
            'createdAt',
            'ACTIVECOUNT',
            'INACTIVECOUNT',
            'schedules',
        ]);
    });
});
