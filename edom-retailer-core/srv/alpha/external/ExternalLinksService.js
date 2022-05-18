const { TextBundle } = require('@sap/textbundle');

module.exports = async (srv) => {
    srv.before('*', async (req) => {
        const { tenant } = req.user;
        const featureFlag = await cds.connect.to('featureFlags');
        const result = await featureFlag.evaluate('external-links', tenant);
        const { locale } = req.user;
        const bundle = new TextBundle('../../_i18n/i18n', locale);

        if (result === false) {
            req.reject({
                status: 503,
                message: `${bundle.getText(
                    'errorMsgExternalLinksSRVServiceUnavailable'
                )}`,
            });
        }
    });
};
