window.suite = function () {
    'use strict';

    const oSuite = new parent.jsUnitTestSuite(),
        contextPath = location.pathname.substring(
            0,
            location.pathname.lastIndexOf('/') + 1
        );

    const testPages = ['../customer-order/webapp/test/Opa5.html'];

    testPages.forEach((testPage) => oSuite.addTestPage(contextPath + testPage));

    return oSuite;
};
