const logger = require('cf-nodejs-logging-support');

const baSepaFeatureFlag = 'sepa-mandate';
const { getEnabledFeaturesSet } = require('../helper');

function addExtData(obj, fromC4Uf = false, extFields = {}) {
    if (fromC4Uf === true) {
        const tempObj = obj;
        Object.keys(tempObj).forEach((key) => {
            try {
                if (key.startsWith('ext__')) {
                    const fieldname = key.split('ext__').pop();
                    // eslint-disable-next-line no-param-reassign
                    extFields[`n99:YY1_${fieldname}`] = tempObj[key];
                } else if (tempObj[key] instanceof Object) {
                    addExtData(tempObj[key], true, extFields);
                }
            } catch (err) {
                logger.error(
                    `[BillingAccountService][BAExtensionFailed]: ${err}`
                );
            }
        });
    }
    return extFields;
}

const featureFlagStatus = async (req) => {
    const enabledFeature = await getEnabledFeaturesSet(req, [
        baSepaFeatureFlag,
    ]);
    return enabledFeature;
};

const setBAFieldsForUpdate = (req, fields, localBillingAccount) => {
    if (req.data[fields] || req.data[fields] === null) {
        return req.data[fields];
    }
    return localBillingAccount[0][fields]
        ? localBillingAccount[0][fields]
        : null;
};

/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */
const setAccountManagementDataFieldsForCreate = (req, fields) => {
    if (req.data.partner?.accountManagementData) {
        return req.data.partner.accountManagementData[fields]
            ? req.data.partner.accountManagementData[fields]
            : undefined;
    } else {
        return undefined;
    }
};

const setPaymentControlFields = (req, fields) => {
    if (req.data.partner?.paymentControl) {
        return req.data.partner.paymentControl[fields]
            ? req.data.partner.paymentControl[fields]
            : undefined;
    } else {
        return undefined;
    }
};

const setIncomingPaymentControlFields = (req, fields) => {
    if (
        req.data.partner?.paymentControl &&
        req.data.partner?.paymentControl?.incomingPayment
    ) {
        if (
            req.data.partner.paymentControl.incomingPayment[fields] ||
            req.data.partner.paymentControl.incomingPayment[fields] === null ||
            req.data.partner.paymentControl.incomingPayment[fields] === ''
        ) {
            return req.data.partner.paymentControl.incomingPayment[fields];
        }
    }
    return undefined;
};

const setOutgoingPaymentControlFields = (req, fields) => {
    if (
        req.data.partner?.paymentControl &&
        req.data.partner?.paymentControl?.outgoingPayment
    ) {
        if (
            req.data.partner.paymentControl.outgoingPayment[fields] ||
            req.data.partner.paymentControl.outgoingPayment[fields] === null ||
            req.data.partner.paymentControl.outgoingPayment[fields] === ''
        ) {
            return req.data.partner.paymentControl.outgoingPayment[fields];
        }
    }
    return undefined;
};

const checkTaxControlFields = (req, fields) => {
    if (req.data.partner?.taxControl) {
        return req.data.partner.taxControl[fields]
            ? req.data.partner.taxControl[fields]
            : undefined;
    } else {
        return undefined;
    }
};
const checkDunningControlFields = (req, fields) => {
    if (req.data.partner?.dunningControl) {
        return req.data.partner.dunningControl[fields]
            ? req.data.partner.dunningControl[fields]
            : undefined;
    } else {
        return undefined;
    }
};

const checkBARelationshipCodeForUpdate = (req, fields, localBillingAccount) => {
    if (req.data.partner?.accountManagementData) {
        if (
            req.data.partner.accountManagementData[fields] ||
            req.data.partner.accountManagementData[fields] === null
        ) {
            return req.data.partner.accountManagementData[fields];
        }
    }
    return localBillingAccount[0].partner.accountManagementData[fields]
        ? localBillingAccount[0].partner.accountManagementData[fields]
        : null;
};

const getDisplayId = (billingAccount) =>
    billingAccount.Header.Identification.InternalID;

/**
 * Function to handle undefined XML parameters
 * S4HC doesn't return empty parameter tags if there is no value found for a particular parameter
 * Handled the same with this function
 */
/** Get Contract Account Partner relationship fields from S4HC */
const getPartnerRelationshipFields = (billingAccount, fields) => {
    const partnerRel = billingAccount.PartnerRelationship[0];
    return partnerRel[fields] ? partnerRel[fields] : null;
};

/** Get Contract Account Header fields from S4HC */
const getAccHeaderField = (billingAccount, fields) => {
    const accHeaderField = billingAccount.Header;
    return accHeaderField[fields] ? accHeaderField[fields] : null;
};

const createRequestPayload = (
    req,
    bps4DisplayId,
    alternativePayer,
    alternativePayee,
    alternativeDunningRcpnt,
    alternativeCorrespondenceRcpnt,
    featureFlagArr
) => {
    // const enabledFeature = await featureFlagStatus(req);
    const baSepaExtFeatureFlag = featureFlagArr[0];
    const createPayload = {
        Header: {
            MessageHeader: {
                CreationDateTime: new Date().toISOString(),
            },
        },
        MessageHeader: {
            CreationDateTime: new Date().toISOString(),
        },
        ContractAccount: {
            Header: {
                Identification: null,
                ContractAccountCategory: req.data.category_code,
                ContractAccountName: setAccountManagementDataFieldsForCreate(
                    req,
                    'name'
                ),
            },
            PartnerRelationship: {
                BusinessPartner: {
                    InternalID: bps4DisplayId,
                },
                CARelationshipOfBPToContrAcct:
                    setAccountManagementDataFieldsForCreate(
                        req,
                        'billingAccountRelationship_code'
                    ),
                PaymentCondition: setAccountManagementDataFieldsForCreate(
                    req,
                    'paymentCondition_code'
                ),
                CAToleranceGroup: setAccountManagementDataFieldsForCreate(
                    req,
                    'toleranceGroup_code'
                ),
                CAClearingCategory: setAccountManagementDataFieldsForCreate(
                    req,
                    'clearingCategory_code'
                ),
                CAAccountDeterminationCode:
                    setAccountManagementDataFieldsForCreate(
                        req,
                        'accountDeterminationCode_code'
                    ),

                CACompanyCodeGroup: setPaymentControlFields(
                    req,
                    'companyCodeGroup'
                ),
                CAStandardCompanyCode: setPaymentControlFields(
                    req,
                    'standardCompanyCode'
                ),

                CAPaymentMethodForIncgPayment: setIncomingPaymentControlFields(
                    req,
                    'paymentMethod'
                ),

                CAPaymentMethodForOutgPayment: setOutgoingPaymentControlFields(
                    req,
                    'paymentMethod'
                ),

                CABankIDForIncomingPayments: setIncomingPaymentControlFields(
                    req,
                    'bankAccount'
                ),

                CABankIDForOutgoingPayments: setOutgoingPaymentControlFields(
                    req,
                    'bankAccount'
                ),

                CAPaymentCardIDForIncomingPayt: setIncomingPaymentControlFields(
                    req,
                    'paymentCard'
                ),

                CAPaymentCardIDForOutgoingPayt: setOutgoingPaymentControlFields(
                    req,
                    'paymentCard'
                ),

                CAReceivingCountry: checkTaxControlFields(
                    req,
                    'supplyingCountry_code'
                ),

                AddressNumber: {
                    InternalID: null,
                },
                CAAlternativePayee: {
                    InternalID: alternativePayee,
                },
                CAAlternativePayer: {
                    InternalID: alternativePayer,
                },
                CADunningProcedure: checkDunningControlFields(
                    req,
                    'dunningProcedure_code'
                ),
                CAAlternativeDunningRecipient: {
                    InternalID: alternativeDunningRcpnt,
                },

                CAAlternativeCorrespncRcpnt: {
                    InternalID: alternativeCorrespondenceRcpnt,
                },
            },
        },
    };
    if (baSepaExtFeatureFlag) {
        createPayload.ContractAccount.PartnerRelationship.SEPAMandate =
            setIncomingPaymentControlFields(req, 'mandateId');
    }
    createPayload.ContractAccount.PartnerRelationship.CAInterestCode =
        setAccountManagementDataFieldsForCreate(req, 'interestKey_code');
    return createPayload;
};

const createRequestPayloadExtBeta = (
    req,
    bps4DisplayId,
    alternativePayer,
    alternativePayee,
    alternativeDunningRcpnt,
    alternativeCorrespondenceRcpnt,
    featureFlagArr
) => {
    // Get Extension data
    const extensionFields = addExtData(req.data, true);

    // Get Payload data other than Extension data
    const { Header, MessageHeader, ContractAccount } = createRequestPayload(
        req,
        bps4DisplayId,
        alternativePayer,
        alternativePayee,
        alternativeDunningRcpnt,
        alternativeCorrespondenceRcpnt,
        featureFlagArr
    );

    return {
        Header,
        MessageHeader,
        ContractAccount: {
            Header: ContractAccount.Header,
            PartnerRelationship: {
                ...ContractAccount.PartnerRelationship,
                ...extensionFields,
            },
        },
    };
};

const updateRequestPayload = async (
    req,
    bps4DisplayId,
    alternativePayer,
    alternativePayee,
    localBillingAccount,
    alternativeDunningRcpnt,
    alternativeCorrespondenceRcpnt
) => {
    const enabledFeature = await featureFlagStatus(req);

    const updatePayload = {
        Header: {
            MessageHeader: {
                CreationDateTime: new Date().toISOString(),
            },
        },
        MessageHeader: {
            CreationDateTime: new Date().toISOString(),
        },
        ContractAccountUpdateRequest: {
            Header: {
                Identification: {
                    InternalID: setBAFieldsForUpdate(
                        req,
                        'displayId',
                        localBillingAccount
                    ),
                },
                ContractAccountCategory: setBAFieldsForUpdate(
                    req,
                    'category_code',
                    localBillingAccount
                ),
                ContractAccountName:
                    req.data?.partner?.accountManagementData?.name,
            },
            PartnerRelationship: {
                BusinessPartner: {
                    InternalID: bps4DisplayId,
                },
                CARelationshipOfBPToContrAcct: checkBARelationshipCodeForUpdate(
                    req,
                    'billingAccountRelationship_code',
                    localBillingAccount
                ),
                PaymentCondition:
                    req.data?.partner?.accountManagementData
                        ?.paymentCondition_code,
                CAToleranceGroup:
                    req.data?.partner?.accountManagementData
                        ?.toleranceGroup_code,
                CAClearingCategory:
                    req.data?.partner?.accountManagementData
                        ?.clearingCategory_code,
                CAAccountDeterminationCode:
                    req.data?.partner?.accountManagementData
                        ?.accountDeterminationCode_code,
                CACompanyCodeGroup:
                    req.data?.partner?.paymentControl?.companyCodeGroup,
                CAStandardCompanyCode:
                    req.data?.partner?.paymentControl?.standardCompanyCode,
                CAPaymentMethodForIncgPayment: setIncomingPaymentControlFields(
                    req,
                    'paymentMethod'
                ),

                CAPaymentMethodForOutgPayment: setOutgoingPaymentControlFields(
                    req,
                    'paymentMethod'
                ),

                CABankIDForIncomingPayments: setIncomingPaymentControlFields(
                    req,
                    'bankAccount'
                ),

                CABankIDForOutgoingPayments: setOutgoingPaymentControlFields(
                    req,
                    'bankAccount'
                ),

                CAPaymentCardIDForIncomingPayt: setIncomingPaymentControlFields(
                    req,
                    'paymentCard'
                ),

                CAPaymentCardIDForOutgoingPayt: setOutgoingPaymentControlFields(
                    req,
                    'paymentCard'
                ),

                CAReceivingCountry:
                    req.data?.partner?.taxControl?.supplyingCountry_code,
                CAAlternativePayee: {
                    InternalID: alternativePayee,
                },
                CAAlternativePayer: {
                    InternalID: alternativePayer,
                },
                CADunningProcedure:
                    req.data?.partner?.dunningControl?.dunningProcedure_code,
                CAAlternativeDunningRecipient: {
                    InternalID: alternativeDunningRcpnt,
                },
                CAAlternativeCorrespncRcpnt: {
                    InternalID: alternativeCorrespondenceRcpnt,
                },
            },
        },
    };
    const baSepaEnabledFeature = enabledFeature.includes(baSepaFeatureFlag);
    if (baSepaEnabledFeature) {
        updatePayload.ContractAccountUpdateRequest.PartnerRelationship.SEPAMandate =
            setIncomingPaymentControlFields(req, 'mandateId');
    }
    updatePayload.ContractAccountUpdateRequest.PartnerRelationship.CAInterestCode =
        req.data?.partner?.accountManagementData?.interestKey_code;
    return updatePayload;
};

const updateRequestPayloadExtBeta = async (
    req,
    bps4DisplayId,
    alternativePayer,
    alternativePayee,
    localBillingAccount,
    alternativeDunningRcpnt,
    alternativeCorrespondenceRcpnt
) => {
    // Get Extension data
    const extensionFields = addExtData(req.data, true);

    // Get Payload data other than Extension data
    const { Header, MessageHeader, ContractAccountUpdateRequest } =
        await updateRequestPayload(
            req,
            bps4DisplayId,
            alternativePayer,
            alternativePayee,
            localBillingAccount,
            alternativeDunningRcpnt,
            alternativeCorrespondenceRcpnt
        );

    return {
        Header,
        MessageHeader,
        ContractAccountUpdateRequest: {
            Header: ContractAccountUpdateRequest.Header,
            PartnerRelationship: {
                ...ContractAccountUpdateRequest.PartnerRelationship,
                ...extensionFields,
            },
        },
    };
};

const mapContractAccToBillingAcc = async (
    billingAccount,
    businessPartnerId,
    alternativePayeeId,
    alternativePayerId,
    alternativeDunningRcpntId,
    alternativeCorrespondenceRcpntId,
    featureFlagArr
) => {
    const baSepaExtFeatureFlag = featureFlagArr[0];
    const mappedBillingAccount = {
        displayId: getDisplayId(billingAccount),
        category: {
            code: getAccHeaderField(billingAccount, 'ContractAccountCategory'),
        },
        partner: {
            businessPartner_id: businessPartnerId,
            accountManagementData: {
                name: getAccHeaderField(billingAccount, 'ContractAccountName'),
                billingAccountRelationship: {
                    code: getPartnerRelationshipFields(
                        billingAccount,
                        'CARelationshipOfBPToContrAcct'
                    ),
                },
                toleranceGroup: {
                    code: getPartnerRelationshipFields(
                        billingAccount,
                        'CAToleranceGroup'
                    ),
                },
                clearingCategory: getPartnerRelationshipFields(
                    billingAccount,
                    'CAClearingCategory'
                ),
                paymentCondition: {
                    code: getPartnerRelationshipFields(
                        billingAccount,
                        'PaymentCondition'
                    ),
                },
                accountDeterminationCode: {
                    code: getPartnerRelationshipFields(
                        billingAccount,
                        'CAAccountDeterminationCode'
                    ),
                },
            },
            paymentControl: {
                companyCodeGroup: getPartnerRelationshipFields(
                    billingAccount,
                    'CACompanyCodeGroup'
                ),
                standardCompanyCode: getPartnerRelationshipFields(
                    billingAccount,
                    'CAStandardCompanyCode'
                ),
                incomingPayment: {
                    paymentMethod: getPartnerRelationshipFields(
                        billingAccount,
                        'CAPaymentMethodForIncgPaymen'
                    ),
                    alternativePayer_id:
                        // eslint-disable-next-line no-unneeded-ternary
                        alternativePayerId ? alternativePayerId : null,

                    bankAccount: getPartnerRelationshipFields(
                        billingAccount,
                        'CABankIDForIncomingPayments'
                    ),
                    paymentCard: getPartnerRelationshipFields(
                        billingAccount,
                        'CAPaymentCardIDForIncomingPayt'
                    ),
                },
                outgoingPayment: {
                    paymentMethod: getPartnerRelationshipFields(
                        billingAccount,
                        'CAPaymentMethodForOutgPayment'
                    ),
                    alternativePayee_id:
                        // eslint-disable-next-line no-unneeded-ternary
                        alternativePayeeId ? alternativePayeeId : null,
                    bankAccount: getPartnerRelationshipFields(
                        billingAccount,
                        'CABankIDForOutgoingPayments'
                    ),
                    paymentCard: getPartnerRelationshipFields(
                        billingAccount,
                        'CAPaymentCardIDForOutgoingPayt'
                    ),
                },
            },
            taxControl: {
                supplyingCountry: {
                    code: getPartnerRelationshipFields(
                        billingAccount,
                        'CAReceivingCountry'
                    ),
                },
            },
            correspondence: {
                alternativeCorrespondenceRecipient_id:
                    // eslint-disable-next-line no-unneeded-ternary
                    alternativeCorrespondenceRcpntId
                        ? alternativeCorrespondenceRcpntId
                        : null,
            },
            dunningControl: {
                dunningProcedure: {
                    code: getPartnerRelationshipFields(
                        billingAccount,
                        'CADunningProcedure'
                    ),
                },
                // eslint-disable-next-line no-unneeded-ternary
                alternativeDunningRecipient_id: alternativeDunningRcpntId
                    ? alternativeDunningRcpntId
                    : null,
            },
        },
    };

    if (baSepaExtFeatureFlag) {
        mappedBillingAccount.partner.paymentControl.incomingPayment.mandateId =
            getPartnerRelationshipFields(billingAccount, 'SEPAMandate');
    }
    mappedBillingAccount.partner.accountManagementData.interestKey_code =
        getPartnerRelationshipFields(billingAccount, 'CAInterestCode');
    return mappedBillingAccount;
};

module.exports = {
    createRequestPayload,
    createRequestPayloadExtBeta,
    updateRequestPayload,
    updateRequestPayloadExtBeta,
    mapContractAccToBillingAcc,
    setOutgoingPaymentControlFields,
    setIncomingPaymentControlFields,
    addExtData,
};
