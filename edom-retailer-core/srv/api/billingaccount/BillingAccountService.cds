
using {sap.odm.utilities.billingaccount as ba} from '../../../db';
using {sap.odm.utilities.billingaccount as bac} from '../../../db/models/configuration/billingaccount';

/**
 * Service definition
 */
service BillingAccountService @(path: '/api/billingAccount/v1', requires: 'authenticated-user') {
    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }],
    Capabilities: { DeleteRestrictions.Deletable: false })
    entity BillingAccount as projection on ba.BillingAccount {
        id, 
        displayId,  
        category,
        partner,
        // drm
        @readonly
        isBlocked,
    }

    @(restrict: [ 
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }],
    Capabilities: { DeleteRestrictions.Deletable: false })
    entity BillingAccountPartner as projection on ba.BillingAccount.partner {
        up_,
        businessPartner,
        accountManagementData,
        paymentControl,
        taxControl,
        dunningControl,
        correspondence,
        // drm
        @readonly
        isBlocked,
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' }],
    Capabilities: { DeleteRestrictions.Deletable: false })
    entity AccountManagementData as projection on ba.BillingAccount.partner.accountManagementData {
        up_,
        name,
        billingAccountRelationship,
        toleranceGroup,
        clearingCategory,
        paymentCondition,
        accountDeterminationCode,
        interestKey,
        // drm
        @readonly
        isBlocked,
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' } ],
    Capabilities: { DeleteRestrictions.Deletable: false })
    entity PaymentControl as projection on ba.BillingAccount.partner.paymentControl {
        up_,
        companyCodeGroup,
        standardCompanyCode,
        incomingPayment,       // aspect composition (IncomingPayment)
        outgoingPayment,       // aspect composition (OutgoingPayment)
        // drm
        @readonly
        isBlocked,
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' } ],
    Capabilities: { DeleteRestrictions.Deletable: false })
    entity TaxControl as projection on ba.BillingAccount.partner.taxControl {
        up_,
        supplyingCountry,
        // drm
        @readonly
        isBlocked,
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' } ],
    Capabilities: { DeleteRestrictions.Deletable: false })
    entity DunningControl as projection on ba.BillingAccount.partner.dunningControl {
        up_,
        dunningProcedure,
        alternativeDunningRecipient,
        // drm
        @readonly
        isBlocked,
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' } ],
    Capabilities: { DeleteRestrictions.Deletable: false })
    entity IncomingPayment as projection on ba.BillingAccount.partner.paymentControl.incomingPayment {
        up_,
        paymentMethod,
        alternativePayer,
        bankAccount,
        paymentCard,
        mandateId,
        // drm
        @readonly
        isBlocked,
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' } ],
    Capabilities: { DeleteRestrictions.Deletable: false })
    entity OutgoingPayment as projection on ba.BillingAccount.partner.paymentControl.outgoingPayment {
        up_,
        paymentMethod,
        alternativePayee,
        bankAccount,
        paymentCard,
        // drm
        @readonly
        isBlocked,
    }

    @(restrict: [
        { grant: ['WRITE'], to: 'API.Write', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'API.Read', where: 'isBlocked = false' },
        { grant: ['READ'], to: 'DPPBlocked.Read' } ],
    Capabilities: { DeleteRestrictions.Deletable: false })
    entity CorrespondenceToOtherPartners as projection on ba.BillingAccount.partner.correspondence {
        up_,
        alternativeCorrespondenceRecipient,
        // drm
        @readonly
        isBlocked,
    }
}
