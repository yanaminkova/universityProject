const cds = require('@sap/cds');
const expect = require('expect');
const logger = require('cf-nodejs-logging-support');
const BpKeyMappingService = require('../../../srv/external/API_BP_KEY_MAPPING');
const { getBPKeyMappingByBpUUID } = BpKeyMappingService.prototype;
const { getBPKeyMappingByBpDisplayId } = BpKeyMappingService.prototype;

const businessPartnerId = 'myBp';
const businessSystem = 'myBs';
const alternativePayeeId = 'myPayee';
const alternativePayerId = 'myPayer';
const alternativeDunningRcpntId = 'myDunningRcpnt';
const alternativeCorrespondenceRcpntId = 'myCorrRcpnt';

const req = { user: 'test' };

const businessPartnerDisplayId = '97024800';
const alternativePayeeDisplayId = '97024801';
const alternativePayerDisplayId = '97024802';
const alternativeDunningRcpntDisplayId = '97024803';
const alternativeCorrRcpntDisplayId = '97024804';

const keyMappingGrpIdForBP = 'BP';
const keyMappingGrpIdForAlternatePayee = 'alternative-payee';
const keyMappingGrpIdForAlternatePayer = 'alternative-payer';
const keyMappingGrpIdForDunningRcpnt = 'alternative-dunning';
const keyMappingGrpIdForCorrRcpnt = 'alternative-correspondence';

const spyLoggerError = jest.spyOn(logger, 'error');
const dummyError = 'dummy error';

const mockTxRun = jest.fn().mockResolvedValue([
    {
        BusinessPartnerId: businessPartnerId,
        BusinessPartner: businessPartnerDisplayId,
        KeymappingGroupID: keyMappingGrpIdForBP,
    },
    {
        BusinessPartnerId: alternativePayeeId,
        BusinessPartner: alternativePayeeDisplayId,
        KeymappingGroupID: keyMappingGrpIdForAlternatePayee,
    },
    {
        BusinessPartnerId: alternativePayerId,
        BusinessPartner: alternativePayerDisplayId,
        KeymappingGroupID: keyMappingGrpIdForAlternatePayer,
    },
    {
        BusinessPartnerId: alternativeDunningRcpntId,
        BusinessPartner: alternativeDunningRcpntDisplayId,
        KeymappingGroupID: keyMappingGrpIdForDunningRcpnt,
    },
    {
        BusinessPartnerId: alternativeCorrespondenceRcpntId,
        BusinessPartner: alternativeCorrRcpntDisplayId,
        KeymappingGroupID: keyMappingGrpIdForCorrRcpnt,
    },
]);
const mockTx = jest.fn().mockReturnValue({
    run: mockTxRun,
});
const mockCdsConnectTo = jest.fn().mockResolvedValue({ tx: mockTx });
cds.connect.to = mockCdsConnectTo;

describe('external API_BP_KEY_MAPPING service unit test UTILITIESCLOUDSOLUTION-3046, UTILITIESCLOUDSOLUTION-3055', () => {
    beforeEach(() => {
        spyLoggerError.mockReset();
    });

    it('should get 5 values from getBPKeyMappingByBpUUID(feature flag ON) - UTILITIESCLOUDSOLUTION-3016', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            alternativePayeeId,
            alternativePayerId,
            alternativeDunningRcpntId,
            alternativeCorrespondenceRcpntId
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(alternativePayeeDisplayId);
        expect(alternativePayer).toBe(alternativePayerDisplayId);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntDisplayId);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrRcpntDisplayId
        );
    });

    it('should get null alternativePayer from getBPKeyMappingByBpUUID(feature flag ON) - UTILITIESCLOUDSOLUTION-3016', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            alternativePayeeId,
            null,
            alternativeDunningRcpntId,
            alternativeCorrespondenceRcpntId
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(alternativePayeeDisplayId);
        expect(alternativePayer).toBe(null);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntDisplayId);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrRcpntDisplayId
        );
    });

    it('should get null alternativePayee from getBPKeyMappingByBpUUID(feature flag ON) - UTILITIESCLOUDSOLUTION-3016', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            null,
            alternativePayerId,
            alternativeDunningRcpntId,
            alternativeCorrespondenceRcpntId
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(alternativePayerDisplayId);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntDisplayId);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrRcpntDisplayId
        );
    });

    it('should get null alternativeDunningRecipient from getBPKeyMappingByBpUUID(feature flag ON)', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            alternativePayeeId,
            alternativePayerId,
            null,
            alternativeCorrespondenceRcpntId
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(alternativePayeeDisplayId);
        expect(alternativePayer).toBe(alternativePayerDisplayId);
        expect(alternativeDunningRcpnt).toBe(null);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrRcpntDisplayId
        );
    });

    it('should get null alternativeCorrespondenceRecipient from getBPKeyMappingByBpUUID(feature flag ON)', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            alternativePayeeId,
            alternativePayerId,
            alternativeDunningRcpntId,
            null
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(alternativePayeeDisplayId);
        expect(alternativePayer).toBe(alternativePayerDisplayId);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntDisplayId);
        expect(alternativeCorrespondenceRcpnt).toBe(null);
    });

    it('should get null alternativePayee and alternativePayer from getBPKeyMappingByBpUUID(feature flag ON)', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            null,
            null,
            alternativeDunningRcpntId,
            alternativeCorrespondenceRcpntId
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(null);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntDisplayId);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrRcpntDisplayId
        );
    });

    it('should get null alternativePayee and alternativeDunningRecipient from getBPKeyMappingByBpUUID(feature flag ON)', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            null,
            alternativePayerId,
            null,
            alternativeCorrespondenceRcpntId
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(alternativePayerDisplayId);
        expect(alternativeDunningRcpnt).toBe(null);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrRcpntDisplayId
        );
    });

    it('should get null values for alternativePayee and alternativeCorrespondenceRecipient from getBPKeyMappingByBpUUID(feature flag ON)', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            null,
            alternativePayerId,
            alternativeDunningRcpntId,
            null
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(alternativePayerDisplayId);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntDisplayId);
        expect(alternativeCorrespondenceRcpnt).toBe(null);
    });

    it('should get null values for alternativePayer and DunningRecipient from getBPKeyMappingByBpUUID(feature flag ON)', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            alternativePayeeId,
            null,
            null,
            alternativeCorrespondenceRcpntId
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(alternativePayeeDisplayId);
        expect(alternativePayer).toBe(null);
        expect(alternativeDunningRcpnt).toBe(null);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrRcpntDisplayId
        );
    });

    it('should get null values for alternativePayer and CorrespondenceRecipient from getBPKeyMappingByBpUUID(feature flag ON)', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            alternativePayeeId,
            null,
            alternativeDunningRcpntId,
            null
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(alternativePayeeDisplayId);
        expect(alternativePayer).toBe(null);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntDisplayId);
        expect(alternativeCorrespondenceRcpnt).toBe(null);
    });

    it('should get null values for DunningRecipient and CorrespondenceRecipient from getBPKeyMappingByBpUUID(feature flag ON)', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            alternativePayeeId,
            alternativePayerId,
            null,
            null
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(alternativePayeeDisplayId);
        expect(alternativePayer).toBe(alternativePayerDisplayId);
        expect(alternativeDunningRcpnt).toBe(null);
        expect(alternativeCorrespondenceRcpnt).toBe(null);
    });
    it('should get null values for alternativePayee, alternativePayer and dunningRecipient from getBPKeyMappingByBpUUID(feature flag ON)', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            null,
            null,
            null,
            alternativeCorrespondenceRcpntId
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(null);
        expect(alternativeDunningRcpnt).toBe(null);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrRcpntDisplayId
        );
    });

    it('should get null values for alternativePayer, dunningRecipient and CorrespondenceRecipient from getBPKeyMappingByBpUUID(feature flag ON)', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            alternativePayeeId,
            null,
            null,
            null
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(alternativePayeeDisplayId);
        expect(alternativePayer).toBe(null);
        expect(alternativeDunningRcpnt).toBe(null);
        expect(alternativeCorrespondenceRcpnt).toBe(null);
    });

    it('should get null values for alternativePayee, dunningRecipient and CorrespondenceRecipient from getBPKeyMappingByBpUUID(feature flag ON) - UTILITIESCLOUDSOLUTION-3016', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            null,
            alternativePayerId,
            null,
            null
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(alternativePayerDisplayId);
        expect(alternativeDunningRcpnt).toBe(null);
        expect(alternativeCorrespondenceRcpnt).toBe(null);
    });

    it('should get null values for alternativePayee, alternativePayer and correspondencerecipient from getBPKeyMappingByBpUUID(feature flag ON)', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            null,
            null,
            alternativeDunningRcpntId,
            null
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(null);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntDisplayId);
        expect(alternativeCorrespondenceRcpnt).toBe(null);
    });

    it('should get null values for all 4 UUIDs except BP from getBPKeyMappingByBpUUID(feature flag ON) - UTILITIESCLOUDSOLUTION-3016', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            null,
            null,
            null,
            null
        );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(null);
        expect(alternativeDunningRcpnt).toBe(null);
        expect(alternativeCorrespondenceRcpnt).toBe(null);
    });

    it('should get 3 values from getBPKeyMappingByBpUUID', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return false;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [bps4DisplayId, alternativePayee, alternativePayer] =
            await getBPKeyMappingByBpUUID(
                req,
                businessPartnerId,
                businessSystem,
                alternativePayeeId,
                alternativePayerId
            );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(alternativePayeeDisplayId);
        expect(alternativePayer).toBe(alternativePayerDisplayId);
    });

    it('should get null alternativePayee from getBPKeyMappingByBpUUID', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return false;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [bps4DisplayId, alternativePayee, alternativePayer] =
            await getBPKeyMappingByBpUUID(
                req,
                businessPartnerId,
                businessSystem,
                null,
                alternativePayerId
            );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(alternativePayerDisplayId);
    });

    it('should get null alternativePayer from getBPKeyMappingByBpUUID', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return false;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [bps4DisplayId, alternativePayee, alternativePayer] =
            await getBPKeyMappingByBpUUID(
                req,
                businessPartnerId,
                businessSystem,
                alternativePayeeId,
                null
            );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(alternativePayeeDisplayId);
        expect(alternativePayer).toBe(null);
    });

    it('should get null alternativePayee and null alternativePayer from getBPKeyMappingByBpUUID', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return false;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [bps4DisplayId, alternativePayee, alternativePayer] =
            await getBPKeyMappingByBpUUID(
                req,
                businessPartnerId,
                businessSystem,
                null,
                null
            );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(null);
    });

    it('should get value only by BP Id from getBPKeyMappingByBpUUID', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return false;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [bps4DisplayId, alternativePayee, alternativePayer] =
            await getBPKeyMappingByBpUUID(
                req,
                businessPartnerId,
                null,
                null,
                null
            );
        expect(bps4DisplayId).toBe(businessPartnerDisplayId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(null);
    });

    it('should get empty array by null input from getBPKeyMappingByBpUUID', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return false;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [bps4DisplayId, alternativePayee, alternativePayer] =
            await getBPKeyMappingByBpUUID(
                req,
                null,
                businessSystem,
                null,
                null
            );
        expect(bps4DisplayId).toBeFalsy();
        expect(alternativePayee).toBeFalsy();
        expect(alternativePayer).toBeFalsy();
    });

    it('should get empty array by null query result from getBPKeyMappingByBpUUID', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return false;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        mockTxRun.mockResolvedValueOnce([]);

        const [bps4DisplayId, alternativePayee, alternativePayer] =
            await getBPKeyMappingByBpUUID(
                req,
                businessPartnerId,
                businessSystem,
                alternativePayeeId,
                alternativePayerId
            );
        expect(bps4DisplayId).toBeFalsy();
        expect(alternativePayee).toBeFalsy();
        expect(alternativePayer).toBeFalsy();

        expect(spyLoggerError).toBeCalledTimes(1);
        expect(spyLoggerError).toBeCalledWith(
            `[API_BP_KEY_MAPPING] Business partner not available in S4HC; change your entry'`
        );
    });

    it('should get empty array by connection error from getBPKeyMappingByBpUUID', async () => {
        mockCdsConnectTo.mockRejectedValueOnce(dummyError);
        const [bps4DisplayId, alternativePayee, alternativePayer] =
            await getBPKeyMappingByBpUUID(
                req,
                businessPartnerId,
                businessSystem,
                alternativePayeeId,
                alternativePayerId
            );
        expect(bps4DisplayId).toBeFalsy();
        expect(alternativePayee).toBeFalsy();
        expect(alternativePayer).toBeFalsy();
        expect(spyLoggerError).toBeCalledTimes(1);
        expect(spyLoggerError).toBeCalledWith(
            `[API_BP_KEY_MAPPING] Error fetching BP ID: ${dummyError}`
        );
    });

    it('should get empty array by query error from getBPKeyMappingByBpUUID', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return false;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        mockTxRun.mockRejectedValueOnce(dummyError);
        const [bps4DisplayId, alternativePayee, alternativePayer] =
            await getBPKeyMappingByBpUUID(
                req,
                businessPartnerId,
                businessSystem,
                alternativePayeeId,
                alternativePayerId
            );
        expect(bps4DisplayId).toBeFalsy();
        expect(alternativePayee).toBeFalsy();
        expect(alternativePayer).toBeFalsy();
        expect(spyLoggerError).toBeCalledTimes(1);
        expect(spyLoggerError).toBeCalledWith(
            `[API_BP_KEY_MAPPING] Error fetching key mapping: ${dummyError}`
        );
    });

    it('should get 5 values from getBPKeyMappingByBpDisplayId - featureFlagON', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpDisplayId(
            req,
            businessPartnerDisplayId,
            businessSystem,
            alternativePayeeDisplayId,
            alternativePayerDisplayId,
            alternativeDunningRcpntDisplayId,
            alternativeCorrRcpntDisplayId
        );
        expect(bps4DisplayId).toBe(businessPartnerId);
        expect(alternativePayee).toBe(alternativePayeeId);
        expect(alternativePayer).toBe(alternativePayerId);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntId);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrespondenceRcpntId
        );
    });

    it('should get null values for alternativePayee from getBPKeyMappingByBpDisplayId - featureFlagON', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpDisplayId(
            req,
            businessPartnerDisplayId,
            businessSystem,
            null,
            alternativePayerDisplayId,
            alternativeDunningRcpntDisplayId,
            alternativeCorrRcpntDisplayId
        );
        expect(bps4DisplayId).toBe(businessPartnerId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(alternativePayerId);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntId);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrespondenceRcpntId
        );
    });

    it('should get null values for alternativePayer from getBPKeyMappingByBpDisplayId - featureFlagON', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpDisplayId(
            req,
            businessPartnerDisplayId,
            businessSystem,
            alternativePayeeDisplayId,
            null,
            alternativeDunningRcpntDisplayId,
            alternativeCorrRcpntDisplayId
        );
        expect(bps4DisplayId).toBe(businessPartnerId);
        expect(alternativePayee).toBe(alternativePayeeId);
        expect(alternativePayer).toBe(null);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntId);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrespondenceRcpntId
        );
    });

    it('should get null values dunningRecipient from getBPKeyMappingByBpDisplayId - featureFlagON', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpDisplayId(
            req,
            businessPartnerDisplayId,
            businessSystem,
            alternativePayeeDisplayId,
            alternativePayerDisplayId,
            null,
            alternativeCorrRcpntDisplayId
        );
        expect(bps4DisplayId).toBe(businessPartnerId);
        expect(alternativePayee).toBe(alternativePayeeId);
        expect(alternativePayer).toBe(alternativePayerId);
        expect(alternativeDunningRcpnt).toBe(null);
        expect(alternativeCorrespondenceRcpnt).toBe(
            alternativeCorrespondenceRcpntId
        );
    });

    it('should get null values for correspondenceRecipient from getBPKeyMappingByBpDisplayId - featureFlagON', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpDisplayId(
            req,
            businessPartnerDisplayId,
            businessSystem,
            alternativePayeeDisplayId,
            alternativePayerDisplayId,
            alternativeDunningRcpntDisplayId,
            null
        );
        expect(bps4DisplayId).toBe(businessPartnerId);
        expect(alternativePayee).toBe(alternativePayeeId);
        expect(alternativePayer).toBe(alternativePayerId);
        expect(alternativeDunningRcpnt).toBe(alternativeDunningRcpntId);
        expect(alternativeCorrespondenceRcpnt).toBe(null);
    });

    it('should get all null UUIDs except BP from getBPKeyMappingByBpDisplayId - featureFlagON', async () => {
        const mockFeatureFlagEvaluate = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await getBPKeyMappingByBpDisplayId(
            req,
            businessPartnerDisplayId,
            businessSystem,
            null,
            null,
            null,
            null
        );
        expect(bps4DisplayId).toBe(businessPartnerId);
        expect(alternativePayee).toBe(null);
        expect(alternativePayer).toBe(null);
        expect(alternativeDunningRcpnt).toBe(null);
        expect(alternativeCorrespondenceRcpnt).toBe(null);
    });
});
