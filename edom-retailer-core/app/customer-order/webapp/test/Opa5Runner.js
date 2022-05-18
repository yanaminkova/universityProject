QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
    'use strict';

    sap.ui.require(
        [
            'sap/fe/test/JourneyRunner',
            'test/OpaJourney',
            // Code coverage will be calculated for all modules loaded after the harness
            'test/pageObjects/Shell',
            'test/pageObjects/ListPage',
            'test/pageObjects/ObjectPage',
            'test/pageObjects/CustomerOrderItemsObjectPage',
        ],
        function (
            JourneyRunner,
            Journey,
            Shell,
            ListPage,
            ObjectPage,
            CustomerOrderItemsObjectPage
        ) {
            var journeyRunner = new JourneyRunner({
                launchUrl: 'http://localhost:8080/fiori.html',
                opaConfig: {
                    timeout: 90,
                },
            });

            journeyRunner.run(
                {
                    pages: {
                        onTheShell: Shell,
                        onListPage: ListPage,
                        onObjectPage: ObjectPage,
                        onCustomerOrderItemsObjectPage:
                            CustomerOrderItemsObjectPage,
                    },
                },
                Journey
            );

            QUnit.start();
        }
    );
});
