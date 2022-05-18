/**
 *  Libraries Required
 */
const cds = require('@sap/cds');
const path = require('path');
const SoapClient = require('../../external/SoapClient');
const billingAccountHelper = require('../../lib/billingaccount/billingAccountHelper');
const billingAccountValidations = require('../../lib/billingaccount/billingAccountValidations');
const AuditLogService = require('../../dpp/AuditLogService');
const CloudEventMessageBuilder = require('../../event/CloudEventMessageBuilder');
const { getEnabledFeatures, getBundle } = require('../../lib/helper');
const baError = require('../../lib/billingaccount/BillingAccountErrorMessages');

const i18nPath = '../../_i18n/i18n';

/**
 * Const declaration for literals
 */
const wsdlPath = 'lib/billingaccount/wsdlCA.wsdl';
const wsdl = path.join(__dirname, '../../', wsdlPath);
const S4HDestination = 'S4H_SOAP_ContractAccount';
const billingAccountPath = 'BillingAccountService.BillingAccount';
const billingAccountPathBeta = 'BillingAccountServiceBeta.BillingAccount';

module.exports = async (srv) => {
    /**
     * Event Mesh
     *
     * Emit message to Event Mesh (EM) when BillingAccount Created or Updated
     */
    const emTypeHashMap = {
        POST: 'sap.c4u.retail.BillingAccount.Created.v1',
        PATCH: 'sap.c4u.retail.BillingAccount.Updated.v1',
        PUT: 'sap.c4u.retail.BillingAccount.Updated.v1',
    };

    const emTopicHashMap = {
        POST: 'Created/v1',
        PATCH: 'Updated/v1',
        PUT: 'Updated/v1',
    };

    const messaging = await cds.connect.to('billingAccountMessaging');

    const emitEvent = async (data, req) => {
        const type = emTypeHashMap[req.method];
        const cloudEventMessage = new CloudEventMessageBuilder()
            .setSource(messaging)
            .setType(type)
            .setSubject(data.id)
            .build();

        await messaging.tx(req).emit(
            `topic:${messaging.queueName || ''}/${emTopicHashMap[req.method]}`,
            {
                id: data.id,
            },
            JSON.parse(cloudEventMessage.body)
        );
    };

    srv.after(['CREATE', 'UPDATE'], '*', async (data, req) => {
        let billingAccountUpdate;
        if (
            req.event === 'UPDATE' &&
            (req.path === billingAccountPath ||
                req.path.startsWith(`${billingAccountPath}/`) ||
                req.path === billingAccountPathBeta ||
                req.path.startsWith(`${billingAccountPathBeta}/`))
        ) {
            billingAccountUpdate = true;
        }
        /** Validations for BillingAccount before UPDATE */
        if (billingAccountUpdate) {
            const isFromSubEntity = req.path.split('/')[1];
            const originalData = req.data;
            const originalEntity = req.entity;
            const originalMethod = req.method;
            let constructedBA;

            if (isFromSubEntity) {
                /** For validation, calls on BillingAccount subentities are converted
                     * to a PATCH call on the root BillingAccount by making a
                     * constructedBA that contains only the subentity in it.
                     * The req object will temporarily be changed and will be reverted
                       right before handler function ends  */
                constructedBA =
                    billingAccountHelper.constructBAForUpdateSubEntity(req);
                req.data = constructedBA;
                req.method = 'PATCH';
            }

            /** Emit event for Billing Account update */
            await emitEvent(req.data, req);

            if (isFromSubEntity) {
                req.data = originalData;
                req.entity = originalEntity;
                req.method = originalMethod;
            }
        } else {
            /** Emit event for Billing Account creation */
            await emitEvent(data, req);
        }
    });

    srv.before('DELETE', '*', async (req) => {
        const enabledFeatures = await getEnabledFeatures(req, []);
        const bundle = getBundle(req, i18nPath);
        const error = baError(enabledFeatures)(bundle);

        if (req.path.startsWith(`${billingAccountPath}/`)) {
            req.reject({
                status: error.BillingAccountSRVDeleteNotAllowed.code,
                message: `${error.BillingAccountSRVDeleteNotAllowed.message} ${
                    req.entity.split('.')[1]
                }`,
            });
        }
    });
    /**
     * Creation of Billing Account would happen in S4HC first and then in C4Uf
     */
    srv.before('CREATE', `BillingAccount`, async (req) => {
        if (req.data.partner) {
            /** Validations for BillingAccount before CREATE */
            const incomingValidationError =
                await billingAccountValidations.validateIncomingPaymentMethodOnCreate(
                    req
                );
            const outgoingValidationError =
                await billingAccountValidations.validateOutgoingPaymentMethodOnCreate(
                    req
                );
            if (incomingValidationError || outgoingValidationError) {
                return;
            }
        }
        const fromOnDemandGet = req._.data.fromOnDemandGet !== undefined;
        if (!fromOnDemandGet) {
            await billingAccountHelper.baCreate(
                req,
                SoapClient,
                S4HDestination,
                wsdl
            );
        }
    });
    /**
     * Updation of Billing Account would happen in S4HC first and then in C4Uf
     */
    srv.before('UPDATE', '*', async (req) => {
        let billingAccountUpdate;
        if (
            req.path === billingAccountPath ||
            req.path.startsWith(`${billingAccountPath}/`) ||
            req.path === billingAccountPathBeta ||
            req.path.startsWith(`${billingAccountPathBeta}/`)
        ) {
            billingAccountUpdate = true;
        }
        /** Validations for BillingAccount before UPDATE */
        if (billingAccountUpdate) {
            const isFromSubEntity = req.path.split('/')[1];
            const originalData = req.data;
            const originalEntity = req.entity;
            const originalMethod = req.method;
            let constructedBA;

            if (isFromSubEntity) {
                /** For validation, calls on BillingAccount subentities are converted
                 * to a PATCH call on the root BillingAccount by making a
                 * constructedBA that contains only the subentity in it.
                 * The req object will temporarily be changed and will be reverted
                   right before handler function ends  */
                constructedBA =
                    billingAccountHelper.constructBAForUpdateSubEntity(req);
                req.data = constructedBA;
                req.entity = billingAccountPath;
                req.method = 'PATCH';
            }

            if (req.data.partner) {
                const incomingValidationError =
                    await billingAccountValidations.validateIncomingPaymentMethodOnUpdate(
                        req
                    );
                const outgoingValidationError =
                    await billingAccountValidations.validateOutgoingPaymentMethodOnUpdate(
                        req
                    );

                if (
                    incomingValidationError === true ||
                    outgoingValidationError === true
                ) {
                    return;
                }
            }
            const fromOnDemandGet = req._.data.fromOnDemandGet !== undefined;
            if (!fromOnDemandGet) {
                await billingAccountHelper.baUpdate(
                    req,
                    SoapClient,
                    S4HDestination,
                    wsdl
                );
            }
            if (isFromSubEntity) {
                req.data = originalData;
                req.entity = originalEntity;
                req.method = originalMethod;
            }
        }
    });

    AuditLogService.registerHandler(srv);
};
