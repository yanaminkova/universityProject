const soap = require('soap');
const cloudSDK = require('@sap-cloud-sdk/core');
/* eslint-disable no-param-reassign */
const logger = require('cf-nodejs-logging-support');
const path = require('path');
const billingAccountHelper = require('../lib/billingaccount/billingAccountHelper');
const billingAccountPayloads = require('../lib/billingaccount/billingAccountPayloads');
const BusinessPartnerKeyMappingService = require('./API_BP_KEY_MAPPING');
const BusinessPartnerKeyMappingServiceBeta = require('./API_BP_KEY_MAPPINGBeta');

const wsdlPath = 'lib/billingaccount/wsdlCA.wsdl';
const wsdlCA = path.join(__dirname, '../', wsdlPath);
const S4HDestination = 'S4H_SOAP_ContractAccount';
const i18nPath = '../../_i18n/i18n';
const baError = require('../lib/billingaccount/BillingAccountErrorMessages');

const KeymappingRefactorFeatureFlag = 'bpkeymapping_refactor';
const baSepaFeatureFlag = 'sepa-mandate';
const baFeaturesBatch = 'ba-features-batch';
// eslint-disable-next-line no-unused-vars
const {
    getBundle,
    getEnabledFeatures,
    getEnabledFeaturesSet,
} = require('../lib/helper');

/*
Constant declarations for error messages
*/
const destError =
    'Failed to fetch destination S4H_SOAP_ContractAccount for S4HC Contract Accounts service';
const businessSystemError =
    'S4H Business System could not be determined. Please maintain it as property `BusinessSystem` for the destination S4H_SOAP_ContractAccount';

class SoapClient {
    // eslint-disable-next-line consistent-return
    async init(wsdl, destName, req) {
        let jwt;
        try {
            const authToken =
                req.headers.authorization || req.context.headers.authorization;

            if (authToken && !authToken.includes('Basic')) {
                jwt = req.headers.authorization.substr(
                    7,
                    req.headers.authorization.length
                );
                this.dest = await cloudSDK.useOrFetchDestination({
                    destinationName: destName,
                    jwt,
                });
            } else {
                this.dest = await cloudSDK.getDestination(destName);
            }

            if (this.dest == null) {
                req.error({
                    code: 406,
                    message: destError,
                });
                logger.error(
                    `[BillingAccountService][S4DestinationNotRetrieved]: ${destError}` // NOSONAR
                );
            } else if (!this.dest.originalProperties.BusinessSystem) {
                req.error({
                    code: 406,
                    message: businessSystemError,
                });
                logger.error(
                    `[BillingAccountService][S4BusinessSystemNotRetrieved]: ${businessSystemError}` // NOSONAR
                );
            } else {
                const businessSystem =
                    this.dest.originalProperties.BusinessSystem;
                this.soapClient = await soap.createClientAsync(wsdl);
                this.soapClient.setSecurity(
                    new soap.BasicAuthSecurity(
                        this.dest.originalProperties.User,
                        this.dest.originalProperties.Password
                    )
                );
                this.soapClient.setEndpoint(this.dest.url);
                return businessSystem;
            }
            return null;
        } catch (error) {
            logger.error(`[SoapClient]: ${error.message}`);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async soapCallOnDemandRead(billingAccObjects, req) {
        const enabledFeatures = getEnabledFeatures(req);
        const bundle = getBundle(req, i18nPath);
        const error = baError(enabledFeatures)(bundle);
        let s4Status = Array.isArray(billingAccObjects)
            ? billingAccObjects[0].Log.BusinessDocumentProcessingResultCode
            : null;
        if (s4Status !== '3') {
            logger.error(
                `[SoapClient]: ${JSON.stringify(billingAccObjects[0].Log.Item)}` // NOSONAR
            );
            return {
                // eslint-disable-next-line object-shorthand
                billingAccObjects: billingAccObjects,
                status: s4Status,
            };
        }
        /** Get details of all the accounts */
        const accounts =
            billingAccountHelper.getAccountDetails(billingAccObjects);

        const mappedBillingAccObjects = [];
        await Promise.all(
            // eslint-disable-next-line consistent-return
            accounts.map(async (account) => {
                const enableBatchFeature = await getEnabledFeatures(req, [
                    baFeaturesBatch,
                ]);
                const baBatchFeature =
                    enableBatchFeature.includes(baFeaturesBatch);
                let enabledFeature;
                let keyMappingFeatureFlag;
                let bpRefactorFeatureFlag;
                let baSepaExtFeatureFlag;
                let baSepaEnabledFeature;
                if (baBatchFeature) {
                    enabledFeature = await getEnabledFeaturesSet(req, [
                        KeymappingRefactorFeatureFlag,
                        baSepaFeatureFlag,
                    ]);
                    bpRefactorFeatureFlag = enabledFeature.includes(
                        KeymappingRefactorFeatureFlag
                    );
                    baSepaExtFeatureFlag =
                        enabledFeature.includes(baSepaFeatureFlag);
                } else {
                    keyMappingFeatureFlag = await getEnabledFeatures(req, [
                        KeymappingRefactorFeatureFlag,
                    ]);
                    baSepaEnabledFeature = await getEnabledFeatures(req, [
                        baSepaFeatureFlag,
                    ]);

                    bpRefactorFeatureFlag = keyMappingFeatureFlag.includes(
                        KeymappingRefactorFeatureFlag
                    );
                    baSepaExtFeatureFlag =
                        baSepaEnabledFeature.includes(baSepaFeatureFlag);
                }
                const featureFlagArr = [baSepaExtFeatureFlag];
                const soapClient = new SoapClient();
                const businessSystem = await soapClient.init(
                    wsdlCA,
                    S4HDestination,
                    req
                );
                let businessPartner;
                let alternativePayee;
                let alternativePayer;
                let alternativeDunningRcpnt;
                let alternativeCorrespondenceRcpnt;
                let businessPartnerId;
                let alternativePayeeId;
                let alternativePayerId;
                let alternativeDunningRcpntId;
                let alternativeCorrespondenceRcpntId;
                if (account.PartnerRelationship[0].BusinessPartnerID) {
                    businessPartner =
                        account.PartnerRelationship[0].BusinessPartnerID
                            .InternalID;
                }
                if (account.PartnerRelationship[0].CAAlternativePayee) {
                    alternativePayee =
                        account.PartnerRelationship[0].CAAlternativePayee
                            .InternalID;
                }
                if (account.PartnerRelationship[0].CAAlternativePayer) {
                    alternativePayer =
                        account.PartnerRelationship[0].CAAlternativePayer
                            .InternalID;
                }
                if (
                    account.PartnerRelationship[0].CAAlternativeDunningRecipient
                ) {
                    alternativeDunningRcpnt =
                        account.PartnerRelationship[0]
                            .CAAlternativeDunningRecipient.InternalID;
                }
                if (
                    account.PartnerRelationship[0].CAAlternativeCorrespncRcpnt
                ) {
                    alternativeCorrespondenceRcpnt =
                        account.PartnerRelationship[0]
                            .CAAlternativeCorrespncRcpnt.InternalID;
                }

                if (bpRefactorFeatureFlag) {
                    businessPartner = parseInt(businessPartner, 10).toString();
                    alternativePayee = parseInt(
                        alternativePayee,
                        10
                    ).toString();
                    alternativePayer = parseInt(
                        alternativePayer,
                        10
                    ).toString();
                    alternativeDunningRcpnt = parseInt(
                        alternativeDunningRcpnt,
                        10
                    ).toString();
                    alternativeCorrespondenceRcpnt = parseInt(
                        alternativeCorrespondenceRcpnt,
                        10
                    ).toString();
                    const arrValues = [
                        businessPartner,
                        alternativePayee,
                        alternativePayer,
                        alternativeDunningRcpnt,
                        alternativeCorrespondenceRcpnt,
                    ];
                    let resultArrValues;

                    if (businessSystem) {
                        [resultArrValues] =
                            await new BusinessPartnerKeyMappingServiceBeta().getBPKeyMappingByBpDisplayId(
                                req,
                                arrValues,
                                businessSystem
                            );
                        if (resultArrValues) {
                            const bpDisplayID = resultArrValues[0];
                            const bpID = resultArrValues[1];

                            // eslint-disable-next-line no-plusplus
                            for (let i = 0; i < bpDisplayID.length; i++) {
                                if (businessPartner === bpDisplayID[i]) {
                                    businessPartnerId = bpID[i];
                                }
                                if (alternativePayee === bpDisplayID[i]) {
                                    alternativePayeeId = bpID[i];
                                }
                                if (alternativePayer === bpDisplayID[i]) {
                                    alternativePayerId = bpID[i];
                                }
                                if (
                                    alternativeDunningRcpnt === bpDisplayID[i]
                                ) {
                                    alternativeDunningRcpntId = bpID[i];
                                }
                                if (
                                    alternativeCorrespondenceRcpnt ===
                                    bpDisplayID[i]
                                ) {
                                    alternativeCorrespondenceRcpntId = bpID[i];
                                }
                            }
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
                            `KeyMappingResponse, ${businessPartnerId}, ${alternativePayeeId} , ${alternativePayerId}, 
                        ${alternativeDunningRcpntId}, ${alternativeCorrespondenceRcpntId}`
                        );
                    }
                } else {
                    [
                        businessPartnerId,
                        alternativePayeeId,
                        alternativePayerId,
                        alternativeDunningRcpntId,
                        alternativeCorrespondenceRcpntId,
                    ] = await new BusinessPartnerKeyMappingService().getBPKeyMappingByBpDisplayId(
                        req,
                        businessPartner,
                        businessSystem,
                        alternativePayee,
                        alternativePayer,
                        alternativeDunningRcpnt,
                        alternativeCorrespondenceRcpnt
                    );
                    logger.info(
                        `KeyMappingResponse, ${businessPartnerId}, ${alternativePayeeId} , ${alternativePayerId}, 
                        ${alternativeDunningRcpntId}, ${alternativeCorrespondenceRcpntId}`
                    );
                }

                if (!businessPartnerId) {
                    s4Status = null;
                    return;
                }
                const billingAccountObject =
                    await billingAccountPayloads.mapContractAccToBillingAcc(
                        account,
                        businessPartnerId,
                        alternativePayeeId,
                        alternativePayerId,
                        alternativeDunningRcpntId,
                        alternativeCorrespondenceRcpntId,
                        featureFlagArr
                    );
                mappedBillingAccObjects.push(billingAccountObject);
            })
        );
        return {
            billingAccObjects:
                s4Status === '3' ? mappedBillingAccObjects : undefined,
            status: s4Status,
        };
    }

    async upsertBillingAccount(args, req) {
        let s4billingAccount;
        /** Update of a Billing Account */
        if ('ContractAccountUpdateRequest' in args) {
            s4billingAccount = await this.soapClient.ContractAccountUpdateAsync(
                args
            );
            const { billingAccount, resStatus } =
                await billingAccountHelper.soapCallUpdate(
                    s4billingAccount,
                    req
                );
            return { billingAccount, resStatus };
        }
        /** On-demand Read of Billing Account from S4HC */
        if ('ContractAccountSelectionByIdentifyingElements' in args) {
            const billingAccountObjects =
                await this.soapClient.ContractAccountRetrieveAsync(args);
            const { billingAccObjects, status } =
                await this.soapCallOnDemandRead(billingAccountObjects, req);
            return { billingAccObjects, status };
        }

        /** Creation of a Billing Account */
        s4billingAccount = await this.soapClient.ContractAccountCreateAsync(
            args
        );
        const s4status = Array.isArray(s4billingAccount)
            ? s4billingAccount[0].Log.BusinessDocumentProcessingResultCode
            : null;
        if (s4status !== '3') {
            logger.error(
                `[SoapClient]: ${JSON.stringify(s4billingAccount[0].Log.Item)}`
            );
        }

        return {
            billingAccount: s4billingAccount,
            status: s4status,
        };
    }
}

module.exports = SoapClient;
