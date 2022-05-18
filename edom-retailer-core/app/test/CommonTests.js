sap.ui.define(
    ['sap/ui/test/Opa5', 'sap/ui/test/matchers/Properties'],
    function (Opa5, Properties) {
        'use strict';

        /* Common test functions that are used by multiple page objects
         * should be defined here and this file included in the page object.
         */

        return {
            actions: {},
            assertions: {
                iCheckAggregationColumnWidth: function (tableHeader) {
                    return this.waitFor({
                        controlType: 'sap.ui.mdc.Table',
                        matchers: new Properties({
                            header: tableHeader,
                        }),
                        success: function (oTable) {
                            // eslint-disable-next-line no-param-reassign
                            oTable = oTable[0].getAggregation('_content');

                            const sDummyCellClass = 'sapMListTblDummyCell',
                                iDummyCellCount = $(oTable.$()).find(
                                    `th.${sDummyCellClass}`
                                ).length;

                            Opa5.assert.notOk(
                                !!iDummyCellCount,
                                `Table ${tableHeader} contains ${iDummyCellCount} element(-s) of class ${sDummyCellClass}`
                            );
                        },
                    });
                },
            },
        };
    }
);
