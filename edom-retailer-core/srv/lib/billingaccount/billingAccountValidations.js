const cds = require('@sap/cds');
const logger = require('cf-nodejs-logging-support');
const billingAccountHelper = require('./billingAccountHelper');
const billingAccountPayloads = require('./billingAccountPayloads');
const baError = require('./BillingAccountErrorMessages');

const { getBundle, getEnabledFeatures } = require('../helper');

const i18nPath = '../../_i18n/i18n';

async function getBPBankAccount(bpId, bankAccountId, req, outgoing = false) {
    const enabledFeatures = getEnabledFeatures(req);
    const bundle = getBundle(req, i18nPath);
    const error = baError(enabledFeatures)(bundle);

    const db = await cds.connect.to('db');
    const paymentBankAccount = await db.run(
        SELECT.one
            .from(`sap.odm.businesspartner.BusinessPartner.bankAccounts`)
            .where({
                up__id: bpId,
                id: bankAccountId,
            })
    );
    if (!paymentBankAccount) {
        logger.error(
            `[BillingAccountService]:'Bank account ID does not exists for this business partner. Enter a valid bank account ID'` // NOSONAR
        );
        if (outgoing) {
            req.error(
                error.BillingAccountSRVOutgoingPaymentMethodError.code,
                error.BillingAccountSRVOutgoingPaymentMethodError.message
            );
        } else {
            req.error(
                error.BillingAccountSRVMsgPaymentMethod.code,
                error.BillingAccountSRVMsgPaymentMethod.message
            );
        }
        return true;
    }
    return false;
}
async function getPaymentMethodCode(paymentMethod, req, outgoing = false) {
    const enabledFeatures = getEnabledFeatures(req);
    const bundle = getBundle(req, i18nPath);
    const error = baError(enabledFeatures)(bundle);

    const db = await cds.connect.to('db');
    const paymentMethodCode = await db.run(
        SELECT.one
            .from(`sap.odm.utilities.billingaccount.PaymentMethodCodes`, [
                'isBankTransfer',
                'isCardPayment',
            ])
            .where({ code: paymentMethod })
    );
    if (!paymentMethodCode) {
        logger.error(
            `[BillingAccountService]:'Payment method does not exist. Maintain configuration in PaymentMethodCodes'` // NOSONAR
        );
        if (outgoing) {
            req.error(
                error.BillingAccountSRVOutgoingPayMethodError.code,
                error.BillingAccountSRVOutgoingPayMethodError.message
            );
        } else {
            req.error(
                error.BillingAccountSRVIncomingPayMethodError.code,
                error.BillingAccountSRVIncomingPayMethodError.message
            );
        }
        return true;
    }
    return paymentMethodCode;
}

async function convertIncomingPaymentDetailsToUppercase(req) {
    if (req.data.partner.paymentControl.incomingPayment.paymentMethod) {
        req.data.partner.paymentControl.incomingPayment.paymentMethod = String(
            req.data.partner.paymentControl.incomingPayment.paymentMethod
        ).toUpperCase();
    }
    if (req.data.partner.paymentControl.incomingPayment.bankAccount) {
        req.data.partner.paymentControl.incomingPayment.bankAccount = String(
            req.data.partner.paymentControl.incomingPayment.bankAccount
        ).toUpperCase();
    }
    return req;
}
async function convertOutgoingPaymentDetailsToUppercase(req) {
    if (req.data.partner.paymentControl.outgoingPayment.paymentMethod) {
        req.data.partner.paymentControl.outgoingPayment.paymentMethod = String(
            req.data.partner.paymentControl.outgoingPayment.paymentMethod
        ).toUpperCase();
    }
    if (req.data.partner.paymentControl.outgoingPayment.bankAccount) {
        req.data.partner.paymentControl.outgoingPayment.bankAccount = String(
            req.data.partner.paymentControl.outgoingPayment.bankAccount
        ).toUpperCase();
    }
    return req;
}

const validatePaymentNulls = (payment) =>
    payment.paymentMethod ||
    payment.bankAccount ||
    payment.alternativePayer_id ||
    payment.alternativePayer_id;
const validateIncomingPaymentMethodOnCreate = async (req) => {
    const enabledFeatures = getEnabledFeatures(req);
    const bundle = getBundle(req, i18nPath);
    const error = baError(enabledFeatures)(bundle);

    if (
        req.data.partner.paymentControl &&
        req.data.partner.paymentControl.incomingPayment &&
        validatePaymentNulls(req.data.partner.paymentControl.incomingPayment)
    ) {
        await convertIncomingPaymentDetailsToUppercase(req);
        const paymentMethod = await getPaymentMethodCode(
            req.data.partner.paymentControl.incomingPayment.paymentMethod,
            req
        );
        if (paymentMethod !== true) {
            if (
                paymentMethod?.isBankTransfer === true &&
                req.data.partner.paymentControl.incomingPayment
                    .alternativePayer_id &&
                req.data.partner.paymentControl.incomingPayment.bankAccount
            ) {
                return getBPBankAccount(
                    req.data.partner.paymentControl.incomingPayment
                        .alternativePayer_id,
                    req.data.partner.paymentControl.incomingPayment.bankAccount,
                    req
                );
                // eslint-disable-next-line no-else-return
            } else if (
                req.data.partner.paymentControl.incomingPayment.bankAccount
            ) {
                return getBPBankAccount(
                    req.data.partner.businessPartner_id,
                    req.data.partner.paymentControl.incomingPayment.bankAccount,
                    req
                );
            } else {
                logger.error(
                    `[BillingAccountService][noIncomingBankId]: ${bundle.getText(
                        'errorMsgBillingAccountSRVNoIncomingBankIdError'
                    )}` // NOSONAR
                );
                req.error(
                    error.BillingAccountSRVNoIncomingBankIdError.code,
                    error.BillingAccountSRVNoIncomingBankIdError.message
                );
                return true;
            }
        }
        return true;
    }
    return false;
};

const validateOutgoingPaymentMethodOnCreate = async (req) => {
    const enabledFeatures = getEnabledFeatures(req);
    const bundle = getBundle(req, i18nPath);
    const error = baError(enabledFeatures)(bundle);

    if (
        req.data.partner.paymentControl &&
        req.data.partner.paymentControl.outgoingPayment &&
        validatePaymentNulls(req.data.partner.paymentControl.outgoingPayment)
    ) {
        await convertOutgoingPaymentDetailsToUppercase(req);
        const paymentMethod = await getPaymentMethodCode(
            req.data.partner.paymentControl.outgoingPayment.paymentMethod,
            req,
            true
        );
        if (paymentMethod !== true) {
            if (
                paymentMethod?.isBankTransfer === true &&
                req.data.partner.paymentControl.outgoingPayment
                    .alternativePayee_id &&
                req.data.partner.paymentControl.outgoingPayment.bankAccount
            ) {
                return getBPBankAccount(
                    req.data.partner.paymentControl.outgoingPayment
                        .alternativePayee_id,
                    req.data.partner.paymentControl.outgoingPayment.bankAccount,
                    req,
                    true
                );
                // eslint-disable-next-line no-else-return
            } else if (
                req.data.partner.paymentControl.outgoingPayment.bankAccount
            ) {
                return getBPBankAccount(
                    req.data.partner.businessPartner_id,
                    req.data.partner.paymentControl.outgoingPayment.bankAccount,
                    req,
                    true
                );
            } else {
                logger.error(
                    `[BillingAccountService][noOutgoingBankId]: ${bundle.getText(
                        'errorMsgBillingAccountSRVNoOutgoingBankIdError'
                    )}` // NOSONAR
                );
                req.error(
                    error.BillingAccountSRVNoOutgoingBankIdError.code,
                    error.BillingAccountSRVNoOutgoingBankIdError.message
                );
                return true;
            }
        }
        return true;
    }
    return false;
};
function returnFirstTrue(one, two) {
    return one === undefined ? two : one;
}

async function requestedIncomingPaymentDetails(req) {
    let paymentMethod = billingAccountPayloads.setIncomingPaymentControlFields(
        req,
        'paymentMethod'
    );
    if (!paymentMethod) {
        const billingAccountId = req.data.id;
        const localBA = await billingAccountHelper.localBillingAccountQuery(
            req,
            billingAccountId
        );
        paymentMethod =
            localBA[0]?.partner.paymentControl.incomingPayment.paymentMethod;
    }
    const bankAccount = billingAccountPayloads.setIncomingPaymentControlFields(
        req,
        'bankAccount'
    );
    const alternativePayerId =
        billingAccountPayloads.setIncomingPaymentControlFields(
            req,
            'alternativePayer_id'
        );
    return { paymentMethod, bankAccount, alternativePayerId };
}
async function requestedOutgoingPaymentDetails(req) {
    let paymentMethod = billingAccountPayloads.setOutgoingPaymentControlFields(
        req,
        'paymentMethod'
    );
    if (!paymentMethod) {
        const billingAccountId = req.data.id;
        const localBA = await billingAccountHelper.localBillingAccountQuery(
            req,
            billingAccountId
        );
        paymentMethod =
            localBA[0]?.partner.paymentControl.outgoingPayment.paymentMethod;
    }
    const bankAccount = billingAccountPayloads.setOutgoingPaymentControlFields(
        req,
        'bankAccount'
    );
    const alternativePayeeId =
        billingAccountPayloads.setOutgoingPaymentControlFields(
            req,
            'alternativePayee_id'
        );
    return { paymentMethod, bankAccount, alternativePayeeId };
}
async function checkIncomingPaymentBankAccountId(
    incomingPaymentMethod,
    incomingPaymentBankAccountId,
    bpId,
    req
) {
    const enabledFeatures = getEnabledFeatures(req);
    const bundle = getBundle(req, i18nPath);
    const error = baError(enabledFeatures)(bundle);

    if (incomingPaymentMethod?.isBankTransfer === true) {
        if (!incomingPaymentBankAccountId) {
            req.error(
                error.BillingAccountSRVMsgPaymentMethod.code,
                error.BillingAccountSRVMsgPaymentMethod.message
            );

            return true;
        }
        return getBPBankAccount(bpId, incomingPaymentBankAccountId, req);
    }
    return { req };
}

const setIncomingPaymentDetailsOnUpdate = (
    bankAccount,
    alternativePayerId,
    localBillingAccount
) => {
    let bpId;

    const incomingPaymentBankAccountId = returnFirstTrue(
        bankAccount,
        localBillingAccount[0].partner.paymentControl.incomingPayment
            ? localBillingAccount[0].partner.paymentControl.incomingPayment
                  .bankAccount
            : undefined
    );

    if (
        alternativePayerId ||
        (localBillingAccount[0].partner.paymentControl.incomingPayment &&
            localBillingAccount[0].partner.paymentControl.incomingPayment
                .alternativePayer_id &&
            alternativePayerId === undefined)
    ) {
        bpId = returnFirstTrue(
            alternativePayerId,
            localBillingAccount[0].partner.paymentControl.incomingPayment
                ? localBillingAccount[0].partner.paymentControl.incomingPayment
                      .alternativePayer_id
                : undefined
        );
    } else {
        bpId = localBillingAccount[0].partner.businessPartner_id;
    }
    return { incomingPaymentBankAccountId, bpId };
};
const validateIncomingPaymentMethodOnUpdate = async (req) => {
    if (
        req.data.partner.paymentControl &&
        req.data.partner.paymentControl.incomingPayment &&
        validatePaymentNulls(req.data.partner.paymentControl.incomingPayment)
    ) {
        await convertIncomingPaymentDetailsToUppercase(req);
        const { paymentMethod, bankAccount, alternativePayerId } =
            await requestedIncomingPaymentDetails(req);
        const payMethod = await getPaymentMethodCode(paymentMethod, req);
        if (payMethod !== true) {
            if (
                payMethod?.isBankTransfer === true ||
                bankAccount !== undefined ||
                alternativePayerId !== undefined
            ) {
                const billingAccountId = req.data.id;
                const localBillingAccount =
                    await billingAccountHelper.localBillingAccountQuery(
                        req,
                        billingAccountId
                    );
                const { incomingPaymentBankAccountId, bpId } =
                    setIncomingPaymentDetailsOnUpdate(
                        bankAccount,
                        alternativePayerId,
                        localBillingAccount
                    );

                return checkIncomingPaymentBankAccountId(
                    payMethod,
                    incomingPaymentBankAccountId,
                    bpId,
                    req
                );
            }
        }
        return true;
    }
    return false;
};

async function checkOutgoingPaymentBankAccountId(
    outgoingPaymentMethod,
    outgoingPaymentBankAccountId,
    bpId,
    req
) {
    const enabledFeatures = getEnabledFeatures(req);
    const bundle = getBundle(req, i18nPath);
    const error = baError(enabledFeatures)(bundle);

    if (outgoingPaymentMethod.isBankTransfer === true) {
        if (!outgoingPaymentBankAccountId) {
            logger.error(
                `[BillingAccountService][invalidOutgoingbankId]: ${bundle.getText(
                    'errorMsgBillingAccountSRVInvalidOutgoingBankIdError'
                )}` // NOSONAR
            );
            req.error(
                error.BillingAccountSRVInvalidOutgoingBankIdError.code,
                error.BillingAccountSRVInvalidOutgoingBankIdError.message
            );
            return true;
        }
        return getBPBankAccount(bpId, outgoingPaymentBankAccountId, req, true);
    }
    return { req };
}

const setOutgoingPaymentDetailsOnUpdate = (
    bankAccount,
    alternativePayeeId,
    localBillingAccount
) => {
    let bpId;
    const outgoingPaymentBankAccountId = returnFirstTrue(
        bankAccount,
        localBillingAccount[0].partner.paymentControl.outgoingPayment
            ? localBillingAccount[0].partner.paymentControl.outgoingPayment
                  .bankAccount
            : undefined
    );

    if (
        alternativePayeeId ||
        (localBillingAccount[0].partner.paymentControl.outgoingPayment &&
            localBillingAccount[0].partner.paymentControl.outgoingPayment
                .alternativePayee_id &&
            alternativePayeeId === undefined)
    ) {
        bpId = returnFirstTrue(
            alternativePayeeId,
            localBillingAccount[0].partner.paymentControl.outgoingPayment
                ? localBillingAccount[0].partner.paymentControl.outgoingPayment
                      .alternativePayee_id
                : undefined
        );
    } else {
        bpId = localBillingAccount[0].partner.businessPartner_id;
    }
    return { outgoingPaymentBankAccountId, bpId };
};

const validateOutgoingPaymentMethodOnUpdate = async (req) => {
    if (
        req.data.partner.paymentControl &&
        req.data.partner.paymentControl.outgoingPayment &&
        validatePaymentNulls(req.data.partner.paymentControl.outgoingPayment)
    ) {
        await convertOutgoingPaymentDetailsToUppercase(req);
        const { paymentMethod, bankAccount, alternativePayeeId } =
            await requestedOutgoingPaymentDetails(req);
        const payMethod = await getPaymentMethodCode(paymentMethod, req, true);
        if (payMethod !== true) {
            if (
                payMethod?.isBankTransfer === true ||
                bankAccount !== undefined ||
                alternativePayeeId !== undefined
            ) {
                const billingAccountId = req.data.id;
                const localBillingAccount =
                    await billingAccountHelper.localBillingAccountQuery(
                        req,
                        billingAccountId
                    );
                const { outgoingPaymentBankAccountId, bpId } =
                    setOutgoingPaymentDetailsOnUpdate(
                        bankAccount,
                        alternativePayeeId,
                        localBillingAccount
                    );

                return checkOutgoingPaymentBankAccountId(
                    payMethod,
                    outgoingPaymentBankAccountId,
                    bpId,
                    req
                );
            }
        }
        return true;
    }
    return false;
};

module.exports = {
    validateIncomingPaymentMethodOnCreate,
    validateOutgoingPaymentMethodOnCreate,
    validateIncomingPaymentMethodOnUpdate,
    validateOutgoingPaymentMethodOnUpdate,
};
