sap.ui.define(['sap/ui/test/opaQunit'], function (opaTest) {
    'use strict';

    var Journey = function () {
        opaTest('Read Customer Order - #1540', function (Given, When, Then) {
            Given.iStartMyAppInAFrame({
                source: '/fiori.html',
                height: 1080,
                width: 1920,
            });
            When.onTheShell.iClickAppTile('Display Customer Orders');

            Then.onListPage.iSeeThisPage();
            When.onListPage.onFilterBar().iExecuteSearch();
            Then.onListPage.onTable().iCheckRows(1);
            When.onListPage.onTable().iPressRow({ displayId: 'UI_DEMO' });

            Then.onObjectPage.iSeeThisPage();
            Then.onObjectPage.onTable('Customer Order Items').iCheckRows(9);
            When.onObjectPage
                .iGoToSection('Items')
                .and.onTable('Customer Order Items')
                .iPressRow({ id: '100000' });

            Then.onCustomerOrderItemsObjectPage.iSeeThisPage();
            When.iNavigateBack();
            Then.onObjectPage.iSeeThisPage();
            When.iNavigateBack();
            Then.onListPage.iSeeThisPage();
        });

        opaTest(
            'Check if Customer Order Item Subsequent Document Type Name is visible in UI - #3005',
            function (Given, When, Then) {
                When.onTheShell.iNavigateHome();
                When.onTheShell.iClickAppTile('Display Customer Orders');

                Then.onListPage.iSeeThisPage();
                When.onListPage.onFilterBar().iExecuteSearch();
                When.onListPage.onTable().iPressRow({ displayId: 'UI_DEMO' });

                Then.onObjectPage.iSeeThisPage();
                When.onObjectPage
                    .iGoToSection('Items')
                    .and.onTable('Customer Order Items')
                    .iPressRow({ id: '200000' });

                Then.onCustomerOrderItemsObjectPage.iSeeThisPage();
                Then.onCustomerOrderItemsObjectPage
                    .onForm('Subsequent Document')
                    .iCheckField(
                        {
                            property:
                                'utilitiesAspect/subsequentDocument/type/name',
                        },
                        'Physical'
                    );
            }
        );

        opaTest(
            'Check if aggregation column width equals table width - #2587',
            function (Given, When, Then) {
                When.onTheShell.iNavigateHome();
                When.onTheShell.iClickAppTile('Display Customer Orders');

                Then.onListPage.iSeeThisPage();
                When.onListPage.onFilterBar().iExecuteSearch();
                Then.onListPage.onTable().iCheckRows(1);
                Then.onListPage.iCheckAggregationColumnWidth('Customer Orders');
                When.onListPage.onTable().iPressRow({ displayId: 'UI_DEMO' });

                Then.onObjectPage.iSeeThisPage();
                Then.onObjectPage.onTable('Customer Order Items').iCheckRows(9);
                Then.onObjectPage.iCheckAggregationColumnWidth(
                    'Customer Order Items'
                );
                When.onObjectPage
                    .iGoToSection('Items')
                    .and.onTable('Customer Order Items')
                    .iPressRow({ id: '100001' });

                Then.onCustomerOrderItemsObjectPage.iSeeThisPage();
                Then.onCustomerOrderItemsObjectPage.iCheckAggregationColumnWidth(
                    ''
                );
            }
        );

        opaTest(
            'Check if Customer Order Item Subsequent Document Id is visible and displayed as URL link in UI - #3334',
            function (Given, When, Then) {
                When.onTheShell.iNavigateHome();
                When.onTheShell.iClickAppTile('Display Customer Orders');

                Then.onListPage.iSeeThisPage();
                When.onListPage.onFilterBar().iExecuteSearch();
                When.onListPage.onTable().iPressRow({ displayId: 'UI_DEMO' });

                Then.onObjectPage.iSeeThisPage();
                When.onObjectPage
                    .iGoToSection('Items')
                    .and.onTable('Customer Order Items')
                    .iPressRow({ id: '200000' });

                Then.onCustomerOrderItemsObjectPage.iSeeThisPage();
                Then.onCustomerOrderItemsObjectPage
                    .onForm('Subsequent Document')
                    .iCheckLink('Document ID', '1001', {
                        href: 'https://<tenant>.eu10.revenue.cloud.sap/launchpad#Subscriptions-list&/subscriptions/<SUBSEQUENTDOCUMENTID>',
                    });
            }
        );
    };

    return Journey;
});
