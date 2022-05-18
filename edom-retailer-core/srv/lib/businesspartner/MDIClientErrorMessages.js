/* eslint-disable no-unused-vars */
module.exports =
    (enabledFeatures = []) =>
    (bundle) => {
        const features = {
            BusinessPartnerMDISelectDeltaTokenBookKeeping: {
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerMDISelectDeltaTokenBookKeeping'
                )}`,
            },
            BusinessPartnerMDIGetDestination: {
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerMDIGetDestination'
                )}`,
            },
            BusinessPartnerMDIBuildMDIRequest: {
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerMDIBuildMDIRequest'
                )}`,
            },
            BusinessPartnerMDIRunMDIRequest: {
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerMDIRunMDIRequest'
                )}`,
            },
            BusinessPartnerMDIProcessBpInstances: {
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerMDIProcessBpInstances'
                )}`,
            },
            BusinessPartnerMDIInsertDeltaTokenBookKeeping: {
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerMDIInsertDeltaTokenBookKeeping'
                )}`,
            },
            BusinessPartnerMDIMdiNext: {
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerMDIMdiNext'
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
