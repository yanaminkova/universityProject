sap.ui.define(
    ['sap/fe/test/ObjectPage', 'common/CommonTests'],
    function (ObjectPage, CommonTests) {
        'use strict';

        return new ObjectPage(
            {
                appId: 'com.sap.c4u.foundation.retailer.customerorder',
                componentId: 'CustomerOrderItemsObjectPage',
                entitySet: 'CustomerOrderItems',
            },
            CommonTests
        );
    }
);
