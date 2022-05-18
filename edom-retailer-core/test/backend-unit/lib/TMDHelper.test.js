const { expect } = require('../../lib/testkit');
const { TMDXml, TMDObj } = require('../../backend-it/payload/TMD_Payloads');
const TMDHelper = require('../../../srv/api/utils/TMDHelper');

let tmd;

describe('TMDHelper UT-test UTILITIESCLOUDSOLUTION-2693', () => {
    beforeAll(() => {
        tmd = TMDHelper.updateTMDObjectKeys(TMDObj);
    });

    it('All operations keys have been updated', async () => {
        expect(
            tmd['msg:RequestMessage']['msg:Payload']['msg:OperationSet'][
                'msg:Operation'
            ].length
        ).to.equal(4);

        expect(
            tmd['msg:RequestMessage']['msg:Payload']['msg:OperationSet'][
                'msg:Operation'
            ]['msg:0']['msg:noun']
        ).to.equal('UsagePointLocationConfig');

        expect(
            tmd['msg:RequestMessage']['msg:Payload']['msg:OperationSet'][
                'msg:Operation'
            ]['msg:1']['msg:noun']
        ).to.equal('UsagePointConfig');

        expect(
            tmd['msg:RequestMessage']['msg:Payload']['msg:OperationSet'][
                'msg:Operation'
            ]['msg:2']['msg:noun']
        ).to.equal('MeterConfig');

        expect(
            tmd['msg:RequestMessage']['msg:Payload']['msg:OperationSet'][
                'msg:Operation'
            ]['msg:3']['msg:noun']
        ).to.equal('MasterDataLinkageConfig');
    });

    it('TMDXml payload is valid', async () => {
        const xml = TMDHelper.convertJsonToXML(tmd);
        expect(xml).to.equal(TMDXml);
    });
});
