// Revised error messages

/* eslint-disable no-unused-vars */
module.exports =
    (enabledFeatures = []) =>
    (bundle) => {
        // main/released features
        const features = {
            JobSchedulerServiceDoesntExist: {
                code: 404,
                message: `${bundle.getText(
                    'errorMsgJobSchedulerServiceDoesntExist'
                )}`,
            },
            JobSchedulerInternalServerError: {
                code: 500,
                message: `${bundle.getText(
                    'errorMsgJobSchedulerInternalServerError'
                )}`,
            },
        };
        const betaFeatures = {};

        return {
            ...features,
            ...betaFeatures,
        };
    };
