sap.ui.define(
    ['sap/fe/test/ListReport', 'common/CommonTests'],
    function (ListReport, CommonTests) {
        'use strict';

        return new ListReport(
            {
                appId: 'com.sap.c4u.foundation.retailer.customerorder',
                componentId: 'CustomerOrderList',
                entitySet: 'CustomerOrder',
            },
            CommonTests
        );
    }
);
