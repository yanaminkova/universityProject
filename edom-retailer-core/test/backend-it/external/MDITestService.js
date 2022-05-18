const cds = require('@sap/cds');
const { BPODMVERSION } = require('../../../srv/lib/config');

class MDITestService {
    constructor(enabledFeatures = []) {
        this.logResponse1 = {
            value: [],
            '@odata.deltaLink': `${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/events?$deltatoken=D3uA5u2.1.0u3u136u30u31u62u35u44u38u37u30u33u30u31u26u33u49u37u25`,
        };
        this.logResponse2 = {
            value: [],
            '@odata.deltaLink': `${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/events?$deltatoken=D3uA5u2.1.0u3u136u30u31u62u35u44u38u37u30u33u30u31u26u33u49u37u26`,
        };
        this.logResponse3 = {
            value: [],
            '@odata.deltaLink': `${BPODMVERSION}/sap.odm.businesspartner.BusinessPartner/events?$deltatoken=D3uA5u2.1.0u3u136u30u31u62u35u44u38u37u30u33u30u31u26u33u49u37u27`,
        };

        this.logResponseProduct1 = {
            value: [],
            '@odata.deltaLink':
                '/v0/odm/2.3.0/log/sap.odm.product.Product/events?$deltatoken=D3uA5u2.1.0u3u136u30u31u62u35u44u38u37u30u33u30u31u26u33u49u37u27',
        };
        this.enabledFeatures = enabledFeatures;
    }

    insert(
        behavior,
        { instance, changeToken, previousVersionId },
        logResponse
    ) {
        MDITestService.removeNulls(instance);
        MDITestService.removePatchDeltaFields(instance);

        const c4ufRequest = (event) => {
            const createObj = {
                instance,
                event,
                versionId: cds.utils.uuid(),
                changeToken,
            };

            if (
                event === 'created' &&
                this.enabledFeatures.includes('c4uf-localids')
            )
                createObj.localIds = [
                    {
                        context: {
                            application: 's4',
                            tenant: 'test-c4uf-system',
                            type: 'test-type',
                            additionalContext: 'sap.oitc.889',
                        },
                        status: 'active',
                        localId: instance.id,
                    },
                ];

            return createObj;
        };
        const s4Request = (event) => {
            const localIdObj = {
                context: {
                    application: 'test-application',
                    tenant: 'test-s4-system',
                    type: 'test-type',
                    additionalContext: 'sap.oitc.889',
                },
                status: 'active',
                localId: instance.id,
            };

            const localDisplayIdObj = {
                context: {
                    application: 'test-application',
                    tenant: 'test-s4-system',
                    type: 'test-type',
                    additionalContext: 'sap.oitc.888',
                },
                status: 'active',
                localId: '123456789',
            };

            return {
                instance,
                event,
                versionId: cds.utils.uuid(),
                localIds: [localIdObj, localDisplayIdObj],
            };
        };

        const viaC4Request = (event) => {
            const localIdObj = {
                context: {
                    application: 'test-application',
                    tenant: 'test-c4uf-system',
                    type: 'test-type',
                    additionalContext: 'sap.oitc.889',
                },
                status: 'active',
                localId: instance.id,
            };

            const localDisplayIdObj = {
                context: {
                    application: 'test-application',
                    tenant: 'test-c4uf-system',
                    type: 'test-type',
                    additionalContext: 'sap.oitc.888',
                },
                status: 'active',
                localId: '123456789',
            };

            return {
                instance,
                event,
                versionId: cds.utils.uuid(),
                changeToken,
                localIds: [
                    ...logResponse.value[0].localIds,
                    localIdObj,
                    localDisplayIdObj,
                ],
            };
        };
        switch (behavior) {
            case 'createFromC4Uf': {
                logResponse.value.push(c4ufRequest('created'));
                logResponse.value.push(s4Request('updated'));
                break;
            }
            // need to update test due to change in behavior in S4
            // 'updateFromC4Uf' should be change to the behavior of 'updateViaC4UFv2'
            case 'updateFromC4Uf': {
                logResponse.value.push(c4ufRequest('updated'));
                logResponse.value.push(s4Request('updated'));
                break;
            }
            case 'updateFromC4Ufv2': {
                logResponse.value.push(c4ufRequest('updated'));
                break;
            }
            case 'createFromS4': {
                logResponse.value.push(s4Request('created'));
                break;
            }
            case 'updateFromS4': {
                logResponse.value.push(s4Request('updated'));
                break;
            }
            case 'updateViaC4UF': {
                logResponse.value.push(viaC4Request('updated'));
                break;
            }
            case 'invalidPrevVerId': {
                logResponse.value.push({
                    changeToken,
                    event: 'rejected',
                    reason: {
                        error: {
                            code: 'InvalidPreviousVersionId',
                            message: `Invalid previous version ID: ${previousVersionId}`,
                            details: [
                                {
                                    code: 'versionId',
                                    message: `${previousVersionId}`,
                                },
                            ],
                        },
                    },
                });
            }
        }
    }

    static removeNulls(obj) {
        Object.keys(obj).forEach((key) => {
            if (obj[key] === null) {
                delete obj[key];
            }
            if (obj[key] && obj[key] instanceof Object) {
                MDITestService.removeNulls(obj[key]);
            }
        });
    }

    static removePatchDeltaFields(obj) {
        Object.keys(obj).forEach((key) => {
            if (key === '_operation') {
                delete obj[key];
            } else if (obj[key] instanceof Object) {
                if (Array.isArray(obj[key]) && key.includes('_delta')) {
                    const arrayHolder = obj[key].filter(
                        (arrayObj) => arrayObj._operation !== 'forceDelete'
                    );
                    arrayHolder.forEach((arrayObj) => {
                        MDITestService.removePatchDeltaFields(arrayObj);
                    });
                    obj[key.split('_')[0]] = arrayHolder;
                    delete obj[key];
                } else if (!Array.isArray(obj[key])) {
                    MDITestService.removePatchDeltaFields(obj[key]);
                }
            }
        });
    }
}

module.exports = MDITestService;
