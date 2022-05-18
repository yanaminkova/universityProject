const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const baError = require('./BillingAccountErrorMessages');

const i18nPath = '../../_i18n/i18n';

const baBetaExtFeatureFlag = 'ba-extensibility';
const KeymappingRefactorFeatureFlag = 'bpkeymapping_refactor';
const baFeaturesBatch = 'ba-features-batch';
const baSepaFeatureFlag = 'sepa-mandate';

const {
    getBundle,
    getEnabledFeatures,
    getEnabledFeaturesSet,
} = require('../helper');
const billingAccountPayloads = require('./billingAccountPayloads');

const BusinessPartnerKeyMappingService = require('../../external/API_BP_KEY_MAPPING');
const BusinessPartnerKeyMappingServiceBeta = require('../../external/API_BP_KEY_MAPPINGBeta');

const { constructBPForUpdateSubEntityOld } =
    require('../businesspartner/businessPartnerHelper')();

const baAddress = 'sap.odm.utilities.billingaccount.BillingAccount';
const baTemplates = 'sap.odm.utilities.billingaccount.BillingAccountTemplates';

/** Check BillingAccount fields for BA creation */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */

/** Functions for OnDemandRead Service for Billing Account */
const requestPayload = (baDisplayId, bpId) => ({
    MessageHeader: {
        CreationDateTime: new Date().toISOString(),
    },
    Header: {
        MessageHeader: {
            CreationDateTime: new Date().toISOString(),
        },
    },
    ContractAccountSelectionByIdentifyingElements: {
        ContractAccount: {
            InternalID: baDisplayId,
        },
        BusinessPartner: {
            InternalID: bpId,
        },
    },
});

/** Get details of each Contract Account  */
const getAccountDetails = (billingAccObjects) => {
    const accounts = billingAccObjects[0].ContractAccount;

    return accounts;
};

/**
 * Get Contract Account display ID from S4HC
 */

const baOnDemandReadValidation = async (
    wsdl,
    S4HDestination,
    req,
    SoapClient,
    contractAccountS4
) => {
    const enabledFeatures = getEnabledFeatures(req);
    const bundle = getBundle(req, i18nPath);
    const error = baError(enabledFeatures)(bundle);

    let businessPartnerId;
    let baDisplayId;

    const soapClient = new SoapClient();
    await soapClient.init(wsdl, S4HDestination, req);
    if (contractAccountS4) {
        baDisplayId = contractAccountS4;
    }

    const args = requestPayload(baDisplayId, businessPartnerId);
    const { billingAccObjects, status } = await soapClient.upsertBillingAccount(
        args,
        req
    );
    /**
     * If Contract Account(Billingaccount) doesn't exists in S4HC, throw error
     */
    if (status == null) {
        logger.error(
            `[BillingAccountService][noBPinS4HC]: ${bundle.getText(
                'errorMsgBillingAccountSRVNoBPError'
            )}`
        ); // NOSONAR
        req.error(
            error.BillingAccountSRVNoBPError.code,
            error.BillingAccountSRVNoBPError.message
        );
        return undefined;
    } else if (status !== '3') {
        logger.error(
            `[BillingAccountService][invalidBAID]: ${bundle.getText(
                'errorMsgBillingAccountSRVInvalidBAIdError'
            )}` // NOSONAR
        );
        req.error(
            error.BillingAccountSRVInvalidBAIdError.code,
            error.BillingAccountSRVInvalidBAIdError.message
        );
        return undefined;
    }
    // eslint-disable-next-line consistent-return
    return billingAccObjects;
};

const baOnDemandRead = async (
    req,
    next,
    SoapClient,
    S4HDestination,
    wsdl,
    contractAccountS4
    // eslint-disable-next-line consistent-return
) => {
    const billingAccountService = await cds.connect.to('BillingAccountService');
    const baTx = billingAccountService.tx(req);

    const { BillingAccount } = billingAccountService.entities;

    try {
        const billingAccObjects = await baOnDemandReadValidation(
            wsdl,
            S4HDestination,
            req,
            SoapClient,
            contractAccountS4
        );

        if (billingAccObjects === undefined) {
            return undefined;
        }
        /** Query C4Uf for BA displayId , if it already exists in C4Uf,
         * Update billingAcc else Create billingAcc with information retrieved from S4HC
         */
        try {
            const allBillingAccounts = billingAccObjects.map(
                (ba) => ba.displayId
            );

            // Find accounts that exist in C4Uf
            const getLocalBillingAccountQuery = SELECT.from(baAddress).where({
                displayId: allBillingAccounts,
            });

            const existingBillingAccounts = await baTx.run(
                getLocalBillingAccountQuery
            );
            const baToUpdate = existingBillingAccounts.map(
                (ba) => ba.displayId
            );

            const baIds = existingBillingAccounts.map((baId) => baId);

            const results = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const billingAccount of billingAccObjects) {
                let billingAccountUpsertQuery;
                if (baToUpdate.includes(billingAccount.displayId)) {
                    /**
                     * Billing Acc exists in C4Uf, Update or overwrite the billingAcc with latest information from S4HC
                     */
                    if (
                        req.event ===
                        '+/+/+/ce/sap/s4/beh/contractaccount/v1/ContractAccount/Created/v1'
                    ) {
                        return undefined; // received event is for Contract Account creation in S4 and a corresponding billing account already exists in C4Uf
                    }
                    const filterBaId = baIds.filter(
                        (baId) => baId.displayId === billingAccount.displayId
                    );
                    billingAccount.id = filterBaId[0].id;
                    billingAccountUpsertQuery = UPDATE(BillingAccount)
                        .set(billingAccount)
                        .where({ displayId: billingAccount.displayId });
                } else {
                    /**
                     * Billing Acc does not exist in C4Uf, Create it with latest information from S4HC
                     */
                    billingAccountUpsertQuery = INSERT.into(
                        BillingAccount,
                        billingAccount
                    );
                }

                results.push(
                    baTx.run(billingAccountUpsertQuery, {
                        fromOnDemandGet: true,
                    })
                );
            }
            await Promise.all(results);
        } catch (error) {
            /** Issue in creation or update of Billing Account(s) */
            logger.error(
                `[BillingAccountService][BACreateUpdateFailed]: ${error}` // NOSONAR
            );
        }
        /**
         * Run the query to get the billingAccount
         */
        // eslint-disable-next-line consistent-return
        return await next(req);
    } catch (error) {
        logger.error(
            `[BillingAccountService][CreateUpdateFailedViaEM]: ${error.message}` // NOSONAR
        );
    }
    return undefined;
};
async function baAccountManagementData(req, template) {
    // , baFeatureFlag) {
    req.data.partner.accountManagementData =
        req.data.partner.accountManagementData || {};

    req.data.partner.accountManagementData.billingAccountRelationship_code =
        req.data.partner.accountManagementData
            .billingAccountRelationship_code ||
        template[0].billingAccountRelationship_code;

    req.data.partner.accountManagementData.toleranceGroup_code =
        req.data.partner.accountManagementData.toleranceGroup_code ||
        template[0].toleranceGroup_code;

    req.data.partner.accountManagementData.clearingCategory_code =
        req.data.partner.accountManagementData.clearingCategory_code ||
        template[0].clearingCategory_code;

    req.data.partner.accountManagementData.paymentCondition_code =
        req.data.partner.accountManagementData.paymentCondition_code ||
        template[0].paymentCondition_code;

    req.data.partner.accountManagementData.accountDeterminationCode_code =
        req.data.partner.accountManagementData.accountDeterminationCode_code ||
        template[0].accountDeterminationCode_code;

    req.data.partner.accountManagementData.interestKey_code =
        req.data.partner.accountManagementData.interestKey_code ||
        template[0].interestKey_code;
}

async function baPaymentControl(req, template) {
    req.data.partner.paymentControl = req.data.partner.paymentControl || {};

    req.data.partner.paymentControl.companyCodeGroup =
        req.data.partner.paymentControl.companyCodeGroup ||
        template[0].companyCodeGroup;

    req.data.partner.paymentControl.standardCompanyCode =
        req.data.partner.paymentControl.standardCompanyCode ||
        template[0].standardCompanyCode;

    req.data.partner.paymentControl.incomingPayment =
        req.data.partner.paymentControl.incomingPayment || {};

    req.data.partner.paymentControl.incomingPayment.paymentMethod =
        req.data.partner.paymentControl.incomingPayment.paymentMethod ||
        template[0].incomingPaymentMethod;

    req.data.partner.paymentControl.outgoingPayment =
        req.data.partner.paymentControl.outgoingPayment || {};

    req.data.partner.paymentControl.outgoingPayment.paymentMethod =
        req.data.partner.paymentControl.outgoingPayment.paymentMethod ||
        template[0].outgoingPaymentMethod;
}

async function baTaxControl(req, template) {
    req.data.partner.taxControl = req.data.partner.taxControl || {};

    req.data.partner.taxControl.supplyingCountry_code =
        req.data.partner.taxControl.supplyingCountry_code ||
        template[0].supplyingCountry_code;
}

async function baDunningControl(req, template) {
    req.data.partner.dunningControl = req.data.partner.dunningControl || {};

    req.data.partner.dunningControl.dunningProcedure_code =
        req.data.partner.dunningControl.dunningProcedure_code ||
        template[0].dunningProcedure_code;
}

async function baUpdatedOnTemplate(req, template) {
    req.data.category_code =
        req.data.category_code || template[0].category_code;

    baAccountManagementData(req, template);
    baPaymentControl(req, template);
    baTaxControl(req, template);
    baDunningControl(req, template);
}

const setAlternativePayeeId = (req) => {
    let alternativePayeeId;
    if (
        req.data.partner &&
        req.data.partner.paymentControl &&
        req.data.partner.paymentControl.outgoingPayment
    ) {
        alternativePayeeId =
            req.data.partner.paymentControl.outgoingPayment.alternativePayee_id;
    }
    return alternativePayeeId;
};

const setAlternativePayerId = (req) => {
    let alternativePayerId;
    if (
        req.data.partner &&
        req.data.partner.paymentControl &&
        req.data.partner.paymentControl.incomingPayment
    ) {
        alternativePayerId =
            req.data.partner.paymentControl.incomingPayment.alternativePayer_id;
    }
    return alternativePayerId;
};

const setAlternativeDunningRecipientBeta = (req) => {
    let alternativeDunningRcpntId;
    if (req.data.partner && req.data.partner.dunningControl) {
        alternativeDunningRcpntId =
            req.data.partner.dunningControl.alternativeDunningRecipient_id;
    }
    return alternativeDunningRcpntId;
};

const setAlternativeCorrespondenceRecipientBeta = (req) => {
    let alternativeCorrespondenceRcpntId;
    if (req.data.partner && req.data.partner.correspondence) {
        alternativeCorrespondenceRcpntId =
            req.data.partner.correspondence
                .alternativeCorrespondenceRecipient_id;
    }
    return alternativeCorrespondenceRcpntId;
};

const mapIds = async (
    bpUUID,
    alternativePayeeId,
    alternativePayerId,
    alternativeDunningRcpntId,
    alternativeCorrespondenceRcpntId,
    bpID,
    bpDisplayID
) => {
    let bps4DisplayId;
    let alternativePayee;
    let alternativePayer;
    let alternativeDunningRcpnt;
    let alternativeCorrespondenceRcpnt;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < bpID.length; i++) {
        if (bpUUID === bpID[i]) {
            bps4DisplayId = bpDisplayID[i];
        }
        if (alternativePayeeId === bpID[i]) {
            alternativePayee = bpDisplayID[i];
        }
        if (alternativePayerId === bpID[i]) {
            alternativePayer = bpDisplayID[i];
        }
        if (alternativeDunningRcpntId === bpID[i]) {
            alternativeDunningRcpnt = bpDisplayID[i];
        }
        if (alternativeCorrespondenceRcpntId === bpID[i]) {
            alternativeCorrespondenceRcpnt = bpDisplayID[i];
        }
    }
    return [
        bps4DisplayId,
        alternativePayee,
        alternativePayer,
        alternativeDunningRcpnt,
        alternativeCorrespondenceRcpnt,
    ];
};

const retrieveBPbyKeyMapping = async (
    req,
    businessSystem,
    bpRefactorFeatureFlag,
    bpIdArr,
    bundle
) => {
    const enabledFeatures = getEnabledFeatures(req);
    const error = baError(enabledFeatures)(bundle);
    let bps4DisplayId;
    let alternativePayer;
    let alternativePayee;
    let alternativeDunningRcpnt;
    let alternativeCorrespondenceRcpnt;
    const businessPartnerId = bpIdArr[0];
    const alternativePayeeId = bpIdArr[1];
    const alternativePayerId = bpIdArr[2];
    const alternativeDunningRcpntId = bpIdArr[3];
    const alternativeCorrespondenceRcpntId = bpIdArr[4];

    if (bpRefactorFeatureFlag) {
        const arrValues = [
            businessPartnerId,
            alternativePayeeId,
            alternativePayerId,
            alternativeDunningRcpntId,
            alternativeCorrespondenceRcpntId,
        ];
        let resultArrValues;

        if (businessSystem) {
            [resultArrValues] =
                await new BusinessPartnerKeyMappingServiceBeta().getBPKeyMappingByBpUUID(
                    req,
                    arrValues,
                    businessSystem
                );
            if (resultArrValues) {
                const bpID = resultArrValues[0];
                const bpDisplayID = resultArrValues[1];

                [
                    bps4DisplayId,
                    alternativePayee,
                    alternativePayer,
                    alternativeDunningRcpnt,
                    alternativeCorrespondenceRcpnt,
                ] = await mapIds(
                    businessPartnerId,
                    alternativePayeeId,
                    alternativePayerId,
                    alternativeDunningRcpntId,
                    alternativeCorrespondenceRcpntId,
                    bpID,
                    bpDisplayID
                );
            } else {
                logger.error(
                    `[BillingAccountService][bpKeyMappingRetrievalFailed]: ${bundle.getText(
                        'errorMsgBpKeymappingSRVFailError'
                    )}` // NOSONAR
                );
                req.error(
                    error.BPKeymappingSRVFailError.code,
                    error.BPKeymappingSRVFailError.message
                );
            }
            logger.info(
                `KeyMappingResponse, ${bps4DisplayId}, ${alternativePayee} , ${alternativePayer}, 
            ${alternativeDunningRcpnt}, ${alternativeCorrespondenceRcpnt}`
            );
        }
    } else {
        [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await new BusinessPartnerKeyMappingService().getBPKeyMappingByBpUUID(
            req,
            businessPartnerId,
            businessSystem,
            alternativePayeeId,
            alternativePayerId,
            alternativeDunningRcpntId,
            alternativeCorrespondenceRcpntId
        );
        logger.info(
            `KeyMappingResponse, ${bps4DisplayId}, ${alternativePayee} , ${alternativePayer}, 
                ${alternativeDunningRcpnt}, ${alternativeCorrespondenceRcpnt}`
        );
    }
    return [
        bps4DisplayId,
        alternativePayee,
        alternativePayer,
        alternativeDunningRcpnt,
        alternativeCorrespondenceRcpnt,
    ];
};

const retrieveFeatureFlag = async (req) => {
    const enableBatchFeature = await getEnabledFeatures(req, [baFeaturesBatch]);
    const baBatchFeature = enableBatchFeature.includes(baFeaturesBatch);
    let enabledFeature;
    let bpRefactorFeatureFlag;
    let keyMappingFeatureFlag;
    let baExtFeatureFlag;
    let extEnabledFeature;
    let baSepaExtFeatureFlag;
    let baSepaEnabledFeature;

    if (baBatchFeature) {
        enabledFeature = await getEnabledFeaturesSet(req, [
            baBetaExtFeatureFlag,
            KeymappingRefactorFeatureFlag,
            baSepaFeatureFlag,
        ]);
        bpRefactorFeatureFlag = enabledFeature.includes(
            KeymappingRefactorFeatureFlag
        );
        baExtFeatureFlag = enabledFeature.includes(baBetaExtFeatureFlag);
        baSepaExtFeatureFlag = enabledFeature.includes(baSepaFeatureFlag);
    } else {
        keyMappingFeatureFlag = await getEnabledFeatures(req, [
            KeymappingRefactorFeatureFlag,
        ]);
        extEnabledFeature = await getEnabledFeatures(req, [
            baBetaExtFeatureFlag,
        ]);
        baSepaEnabledFeature = await getEnabledFeatures(req, [
            baSepaFeatureFlag,
        ]);
        bpRefactorFeatureFlag = keyMappingFeatureFlag.includes(
            KeymappingRefactorFeatureFlag
        );
        baExtFeatureFlag = extEnabledFeature.includes(baBetaExtFeatureFlag);
        baSepaExtFeatureFlag = baSepaEnabledFeature.includes(baSepaFeatureFlag);
    }
    return [bpRefactorFeatureFlag, baExtFeatureFlag, baSepaExtFeatureFlag];
};

const baCreate = async (req, SoapClient, S4HDestination, wsdl) => {
    const enabledFeatures = getEnabledFeatures(req);
    const bundle = getBundle(req, i18nPath);
    const error = baError(enabledFeatures)(bundle);

    const [bpRefactorFeatureFlag, baExtFeatureFlag, baSepaExtFeatureFlag] =
        await retrieveFeatureFlag(req);

    const billingAccountService = await cds.connect.to('BillingAccountService');

    if (req.headers.templateid) {
        /** Get field-value pairs for required template */
        const template = await billingAccountService.transaction(req).run(
            SELECT.from(baTemplates).where({
                templateId: req.headers.templateid,
            })
        );

        /** Fill in value pairs from template into BillingAccount */
        if (template.length > 0) {
            await baUpdatedOnTemplate(req, template);
        } else {
            /** TemplateId received in Request does not exist */
            logger.error(
                `[BillingAccountService][InvalidTemplateError]: ${bundle.getText(
                    'errorMsgBillingAccountSRVInvalidTemplateIdError'
                )}` // NOSONAR
            );
            req.error(
                error.BillingAccountSRVInvalidTemplateIdError.code,
                error.BillingAccountSRVInvalidTemplateIdError.message
            );
            return;
        }
    }
    try {
        const soapClient = new SoapClient();
        const businessSystem = await soapClient.init(wsdl, S4HDestination, req);
        const alternativePayeeId = setAlternativePayeeId(req);
        const alternativePayerId = setAlternativePayerId(req);
        const alternativeDunningRcpntId =
            setAlternativeDunningRecipientBeta(req);
        const alternativeCorrespondenceRcpntId =
            setAlternativeCorrespondenceRecipientBeta(req);

        const bpIdArr = [
            req.data.partner.businessPartner_id,
            alternativePayeeId,
            alternativePayerId,
            alternativeDunningRcpntId,
            alternativeCorrespondenceRcpntId,
        ];
        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await retrieveBPbyKeyMapping(
            req,
            businessSystem,
            bpRefactorFeatureFlag,
            bpIdArr,
            bundle
        );

        // While removing feature flag :
        // 1. Remove existing 'createRequestPayload' from else block where it gets triggered
        // 2. Remove 'Beta' Suffix from 'createRequestPayloadExtBeta' from defination and implementation
        let args;

        const featureFlagArr = [baSepaExtFeatureFlag];
        if (baExtFeatureFlag) {
            args = billingAccountPayloads.createRequestPayloadExtBeta(
                req,
                bps4DisplayId,
                alternativePayer,
                alternativePayee,
                alternativeDunningRcpnt,
                alternativeCorrespondenceRcpnt,
                featureFlagArr
            ); // Function call to get the mapped SOAP payload

            const yy1Fields = Object.keys(
                args.ContractAccount.PartnerRelationship
            ).filter((field) => field.startsWith('n99:YY1_'));

            if (yy1Fields.length > 0) {
                soapClient.soapClient.wsdl.xmlnsInEnvelope = `${soapClient.soapClient.wsdl.xmlnsInEnvelope} xmlns:n99="http://SAPCustomFields.com/YY1_"`;
            }
        } else {
            /**
             * If the feature flag for billing-acocunts is off, corresponding BP related fields will be sent blank
             */
            args = billingAccountPayloads.createRequestPayload(
                req,
                bps4DisplayId,
                alternativePayer,
                alternativePayee,
                alternativeDunningRcpnt,
                alternativeCorrespondenceRcpnt,
                featureFlagArr
            ); // Function call to get the mapped SOAP payload
        }

        const { billingAccount, status } =
            await soapClient.upsertBillingAccount(args, req);
        if (status === undefined) {
            /* eslint no-throw-literal: "error" */
            throw new Error('Status undefined');
        }
        if (status !== '3') {
            req.error(
                error.BillingAccountSRVCreateFailS4.code,
                error.BillingAccountSRVCreateFailS4.message
            );
        } else {
            req.data.displayId =
                billingAccount[0].ContractAccount.Header.Identification.InternalID;
        }
    } catch (err) {
        logger.error(`[BillingAccountService][SoapClient]: ${err.message}`); // NOSONAR
        req.error({
            code: 500,
            message: err.message,
        });
    }
};

const localBillingAccountQuery = async (req, billingAccountId) => {
    // eslint-disable-next-line no-unused-vars
    const tx = cds.tx(req);
    const query = SELECT.from(baAddress)
        .columns((ba) => {
            ba`.*`;
            ba.partner((a) => {
                a`.*`;
                a.accountManagementData((b) => b`.*`);
                a.paymentControl((b) => {
                    b`.*`;
                    b.incomingPayment((c) => c`.*`);
                    b.outgoingPayment((c) => c`.*`);
                });
                a.taxControl((b) => b`.*`);
                a.dunningControl((b) => b`.*`);
                a.correspondence((b) => b`.*`);
            });
        })
        .where({
            id: billingAccountId,
        });
    let res;
    try {
        res = await tx.run(query);
        await tx.commit();
    } catch (err) {
        await tx.rollback();
    }
    return res;
};

const checkBillingAccountExistence = (
    req,
    localBillingAccount,
    error,
    bundle
) => {
    if (!localBillingAccount[0].displayId) {
        logger.error(
            `[BillingAccountService][baUpdateFailed]: ${bundle.getText(
                'errorMsgBillingAccountSRVUpdateFailError'
            )}` // NOSONAR
        );
        req.error(
            error.BillingAccountSRVUpdateFailError.code,
            error.BillingAccountSRVUpdateFailError.message
        );
    }
};
const checkDisplayIdUpdate = (req, localBillingAccount, error, bundle) => {
    if (
        req.data.displayId === '' ||
        req.data.displayId === null ||
        (req.data.displayId &&
            req.data.displayId !== undefined &&
            localBillingAccount[0].displayId !== req.data.displayId)
    ) {
        logger.error(
            `[BillingAccountService][displayIdUpdateFailed]: ${bundle.getText(
                'errorMsgBillingAccountSRVBAdisplayIdUpdateError'
            )}` // NOSONAR
        );
        req.error(
            error.BillingAccountSRVBAdisplayIdUpdateError.code,
            error.BillingAccountSRVBAdisplayIdUpdateError.message
        );
    }
};
const checkBusinessPartnerUpdate = (req, localBillingAccount, error) => {
    if (
        localBillingAccount[0].partner.businessPartner_id &&
        req.data.partner?.businessPartner_id !== undefined &&
        localBillingAccount[0].partner.businessPartner_id !==
            req.data.partner?.businessPartner_id
    ) {
        req.error(
            error.BillingAccountSRVBpidUpdateFailS4.code,
            error.BillingAccountSRVBpidUpdateFailS4.message
        );
    }
};
const baUpdate = async (req, SoapClient, S4HDestination, wsdl) => {
    const enabledFeatures = getEnabledFeatures(req);
    const bundle = getBundle(req, i18nPath);
    const error = baError(enabledFeatures)(bundle);
    const [bpRefactorFeatureFlag, baExtFeatureFlag] = await retrieveFeatureFlag(
        req
    );
    try {
        const billingAccountId = req.data.id;
        const localBillingAccount = await localBillingAccountQuery(
            req,
            billingAccountId
        );

        checkBillingAccountExistence(req, localBillingAccount, error, bundle);
        checkDisplayIdUpdate(req, localBillingAccount, error, bundle);
        checkBusinessPartnerUpdate(req, localBillingAccount, error);

        if (req.errors) {
            return;
        }
        const soapClient = new SoapClient();
        const businessSystem = await soapClient.init(wsdl, S4HDestination, req);
        const alternativePayeeId = setAlternativePayeeId(req);
        const alternativePayerId = setAlternativePayerId(req);
        const alternativeDunningRcpntId =
            setAlternativeDunningRecipientBeta(req);
        const alternativeCorrespondenceRcpntId =
            setAlternativeCorrespondenceRecipientBeta(req);

        const bpIdArr = [
            localBillingAccount[0].partner.businessPartner_id,
            alternativePayeeId,
            alternativePayerId,
            alternativeDunningRcpntId,
            alternativeCorrespondenceRcpntId,
        ];

        const [
            bps4DisplayId,
            alternativePayee,
            alternativePayer,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt,
        ] = await retrieveBPbyKeyMapping(
            req,
            businessSystem,
            bpRefactorFeatureFlag,
            bpIdArr,
            bundle
        );

        // While removing feature flag :
        // 1. Remove existing 'updateRequestPayload' from else block where it gets triggered
        // 2. Remove 'Beta' Suffix from 'updateRequestPayloadExtBeta' from defination and implementation
        let args;

        if (baExtFeatureFlag) {
            args = await billingAccountPayloads.updateRequestPayloadExtBeta(
                req,
                bps4DisplayId,
                alternativePayer,
                alternativePayee,
                localBillingAccount,
                alternativeDunningRcpnt,
                alternativeCorrespondenceRcpnt
            ); // Function call to get the mapped SOAP payload

            const yy1Fields = Object.keys(
                args.ContractAccountUpdateRequest.PartnerRelationship
            ).filter((field) => field.startsWith('n99:YY1_'));

            if (yy1Fields.length > 0) {
                soapClient.soapClient.wsdl.xmlnsInEnvelope = `${soapClient.soapClient.wsdl.xmlnsInEnvelope} xmlns:n99="http://SAPCustomFields.com/YY1_"`;
            }
        } else {
            args = await billingAccountPayloads.updateRequestPayload(
                req,
                bps4DisplayId,
                alternativePayer,
                alternativePayee,
                localBillingAccount,
                alternativeDunningRcpnt,
                alternativeCorrespondenceRcpnt
            );
        }

        const { resStatus } = await soapClient.upsertBillingAccount(args, req);
        if (resStatus !== '3') {
            req.error(
                error.BillingAccountSRVUpdateFailS4.code,
                error.BillingAccountSRVUpdateFailS4.message
            );
        }
    } catch (err) {
        logger.error(
            `[BillingAccountService][baUpdateFailedinC4UF]: ${err.message}` // NOSONAR
        );
        req.error({
            code: 500,
            message: err.message,
        });
    }
};

const soapCallUpdate = async (s4billingAccount) => {
    const s4status = Array.isArray(s4billingAccount)
        ? s4billingAccount[0].Log.BusinessDocumentProcessingResultCode
        : null;
    if (s4status !== '3') {
        logger.error(
            `[SoapClient]: ${JSON.stringify(s4billingAccount[0].Log.Item)}` // NOSONAR
        );
    }
    return {
        billingAccount: s4billingAccount,
        resStatus: s4status,
    };
};

module.exports = {
    requestPayload,
    getAccountDetails,
    baOnDemandRead,
    baUpdate,
    baCreate,
    soapCallUpdate,
    baUpdatedOnTemplate,
    baAccountManagementData,
    baPaymentControl,
    baTaxControl,
    baDunningControl,
    localBillingAccountQuery,
    checkBillingAccountExistence,
    checkDisplayIdUpdate,
    // Please update function below. Check for updated constructBPForUpdateSubentity
    constructBAForUpdateSubEntity: constructBPForUpdateSubEntityOld,
};
