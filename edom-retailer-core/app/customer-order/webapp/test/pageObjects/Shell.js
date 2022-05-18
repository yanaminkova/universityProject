sap.ui.define(
    ['sap/fe/test/Shell', 'sap/ui/test/Opa5', 'sap/fe/test/Utils'],
    function (Shell, Opa5, Utils) {
        'use strict';

        // OPTIONAL
        var AdditionalCustomShellDefinition = {
            actions: {
                iClickAppTile: function (appName) {
                    return this.waitFor({
                        controlType: 'sap.m.GenericTile',
                        matchers: function (control) {
                            return control.getHeader() === appName;
                        },
                        actions: function (control) {
                            control.firePress();
                        },
                        success: function () {
                            Opa5.assert.ok(
                                true,
                                Utils.formatMessage(
                                    "Clicking on tile with name '{0}'",
                                    appName
                                )
                            );
                        },
                        errorMessage: 'Could not find the tile',
                    });
                },
            },
            assertions: {},
        };

        return new Shell(AdditionalCustomShellDefinition);
    }
);
