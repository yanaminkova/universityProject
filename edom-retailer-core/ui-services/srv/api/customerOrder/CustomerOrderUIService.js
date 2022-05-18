const jwt = require('jsonwebtoken');

module.exports = async (srv) => {
    function decodeToken(req) {
        return jwt.decode(req.headers.authorization.split('Bearer ')[1])
            ?.ext_attr.zdn;
    }

    const { CustomerOrderItemUtilitiesSubsequentDocumentCodes } = srv.entities;
    srv.after('READ', 'CustomerOrder/items', async (reqData, reqInfo) => {
        const subsequentDocId =
            reqData?.utilitiesAspect?.subsequentDocument?.id;
        const code = reqData?.utilitiesAspect?.subsequentDocument?.type?.code;

        if (subsequentDocId && code) {
            const type = await srv.run(
                SELECT.one
                    .from(CustomerOrderItemUtilitiesSubsequentDocumentCodes)
                    .where({ code })
            );
            if (type.urlPattern) {
                const tenant = decodeToken(reqInfo);
                // eslint-disable-next-line no-param-reassign
                reqData.utilitiesAspect.subsequentDocument.type.url =
                    type.urlPattern
                        .replace('&lt;tenant&gt;', tenant)
                        .replace(
                            '&lt;subsequentDocumentId&gt;',
                            subsequentDocId
                        )
                        .replace(
                            '&lt;SUBSEQUENTDOCUMENTID&gt;',
                            subsequentDocId?.toUpperCase()
                        );
            }
        }
    });
};
