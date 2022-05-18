// Revised error messages

/* eslint-disable no-unused-vars */
module.exports = (enabledFeatures = []) => {
    const i18nError = (bundle) => {
        const features = {
            BillingAccountSRVDeleteNotAllowed: {
                code: 405,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVDeleteNotAllowed'
                )}`,
            },
            BillingAccountSRVNoBPError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVNoBPError'
                )}`,
            },
            BillingAccountSRVInvalidBAIdError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVInvalidBAIdError'
                )}`,
            },
            BillingAccountSRVInvalidTemplateIdError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVInvalidTemplateIdError'
                )}`,
            },
            BillingAccountSRVUpdateFailError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVUpdateFailError'
                )}`,
            },
            BillingAccountSRVCreateFailS4: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVCreateFailS4'
                )}`,
            },
            BillingAccountSRVBpidUpdateFailS4: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVBpidUpdateFailS4'
                )}`,
            },
            BillingAccountSRVUpdateFailS4: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVUpdateFailS4'
                )}`,
            },

            BillingAccountSRVIncomingPayMethodError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVIncomingPayMethodError'
                )}`,
            },
            BillingAccountSRVOutgoingPayMethodError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVOutgoingPayMethodError'
                )}`,
            },
            BillingAccountSRVMsgPaymentMethod: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVMsgPaymentMethod'
                )}`,
            },
            BillingAccountSRVOutgoingPaymentMethodError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVOutgoingPaymentMethodError'
                )}`,
            },
            BillingAccountSRVNoIncomingBankIdError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVNoIncomingBankIdError'
                )}`,
            },
            BillingAccountSRVNoOutgoingBankIdError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVNoOutgoingBankIdError'
                )}`,
            },
            BillingAccountSRVInvalidOutgoingBankIdError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVInvalidOutgoingBankIdError'
                )}`,
            },
            BillingAccountSRVBAdisplayIdUpdateError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBillingAccountSRVBAdisplayIdUpdateError'
                )}`,
            },
            BPKeymappingSRVFailError: {
                code: 406,
                message: `${bundle.getText(
                    'errorMsgBpKeymappingSRVFailError'
                )}`,
            },
        };

        // beta features
        const betaFeatures = {};

        return {
            ...features,
            ...betaFeatures,
        };
    };
    return i18nError;
};
