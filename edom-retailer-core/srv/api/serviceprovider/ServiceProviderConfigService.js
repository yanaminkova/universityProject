module.exports = async (srv) => {
    const { MarketFunctionConfiguration } = srv.entities;

    srv.before('CREATE', 'MarketFunctionConfiguration', async (req) => {
        const { data } = req;
        const res = await cds.tx(req).run(
            SELECT.from(MarketFunctionConfiguration).where({
                marketService_code: data.marketService_code,
                division_code: data.division_code,
            })
        );

        if (res.length > 0) {
            req.reject({
                status: 400,
                message:
                    'Market Service can only be allocated to one Market Function for this particular division',
            });
        }
    });
};
