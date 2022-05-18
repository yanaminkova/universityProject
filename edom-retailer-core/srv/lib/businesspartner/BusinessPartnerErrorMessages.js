// Revised error messages

/* eslint-disable no-unused-vars */
module.exports =
    (enabledFeatures = []) =>
    (bundle) => {
        // main/released features
        const features = {
            // Copied from CAP error messages for multiple errors
            BusinessPartnerSRVMultipleErrorsOccured: (details = []) => ({
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerSRVMultipleErrorsOccured'
                )}`,
                details,
            }),
            // Need to revise error code & message
            BusinessPartnerSRVValueRequired: (key, path = []) => ({
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerSRVValueRequired'
                )} ${key}`,
                target: path.length ? `${path.join('/')}/${key}` : key,
            }),
            // Need to revise error code and message
            BusinessPartnerSRVBpTypeChangeNotSupported: {
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerSRVBpTypeChangeNotSupported'
                )}`,
            },
            BusinessPartnerSRVBpGroupNotSupported: {
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerSRVBpGroupNotSupported'
                )}`,
            },
            BusinessPartnerSRVSpMustBeTypeOrg: {
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerSRVSpMustBeTypeOrg'
                )}`,
            },
            // Need to revise error code & message
            BusinessPartnerSRVMissingMdiBookkeeping: {
                code: 500,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerSRVMissingMdiBookkeeping'
                )}`,
            },
            BusinessPartnerSRVMarketFunctionCodeNumberInUse: {
                code: 400,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerSRVMarketFunctionCodeNumberInUse'
                )}`,
            },
            BusinessPartnerSRVDeleteNotAllowed: {
                code: 405,
                message: `${bundle.getText(
                    'errorMsgBusinessPartnerSRVDeleteNotAllowed'
                )}`,
            },
        };

        // beta features
        const betaFeatures = {};
        if (enabledFeatures.includes('business-partner-enhancements')) {
            const fullErrorMsg = bundle.getText(
                'errorMsgBusinessPartnerSRVDeleteRestricted2'
            );
            const splitErrorMsg = fullErrorMsg.split(/\{[0-2]\}/);
            betaFeatures.BusinessPartnerSRVDeleteRestricted = (
                key,
                conditions = []
            ) => {
                const errObj = {
                    code: 400,
                    message: `${splitErrorMsg[0]}${key}`,
                };
                conditions.forEach(
                    ({ whereKey, whereValue, containsKey, containsValue }) => {
                        let conditionKey;
                        let conditionValue;
                        if (whereKey && whereValue) {
                            conditionKey = whereKey;
                            conditionValue = whereValue;
                        } else if (containsKey && containsValue) {
                            conditionKey = containsKey;
                            conditionValue = containsValue;
                        }
                        errObj.message += `${splitErrorMsg[1]}${conditionKey}${splitErrorMsg[2]}${conditionValue}`;
                    }
                );
                errObj.message += splitErrorMsg[3];
                errObj.message = errObj.message.trim();
                return errObj;
            };
        }

        return {
            ...features,
            ...betaFeatures,
        };
    };
