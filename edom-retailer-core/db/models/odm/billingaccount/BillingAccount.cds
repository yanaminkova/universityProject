namespace sap.odm.utilities.billingaccount;

using { sap.odm.common.cuid, 
        sap.odm.common.managed,
        sap.odm.common.CountryCode, 
} from '../../../../common-model/odm/common';

using { sap.odm.businesspartner.BusinessPartner } from '@sap/odm/dist/businesspartner/BusinessPartner';

/** reference to codeLists in index.cds */
using { 
        sap.odm.utilities.billingaccount.CategoryCode,
        sap.odm.utilities.billingaccount.BillingAccountRelationshipCode,
        sap.odm.utilities.billingaccount.ToleranceGroupCode, 
        sap.odm.utilities.billingaccount.ClearingCategoryCode,
        sap.odm.utilities.billingaccount.AccountDeterminationIdCode,
        sap.odm.utilities.billingaccount.DunningProcedureCode,
        sap.odm.utilities.billingaccount.PaymentConditionCode,
        sap.odm.utilities.billingaccount.InterestKeyCode
        }
        from '.';

/* 
 * Utilities Cloud Only dedicated ACCOUNT which is connected to
 * an organization (BP: company, subsidiary) or person in which
 * your company has a business interest.
 */
entity BillingAccount : cuid { /** TrackPurpose - dpp aspect requires BP reference

        /** Human-readable identifier for Contract Account in S4H */
        displayId                     : String(12);

        /**
        * Grouping attribute for accounts which have the same control
        * features.
        */
        category                      : CategoryCode not null;

        /**
        * Business partner specific billing account data.
        */
        partner                       : Composition of one BillingAccountPartner not null;
}

aspect BillingAccountPartner {        
        /**
        * Business partner that is assigned to the contract account.
        */
        businessPartner     : Association to one BusinessPartner not null;

        /**
        * Address of an assigned business partner.
        */
        address : UUID;
        /**
        * Account Management Information.
        */
        accountManagementData : Composition of one AccountManagementData;

        /**
        * Payment data for the contract account.
        */
        paymentControl  : Composition of one PaymentControl;
        /**
        * Tax-relevant information.
        */
        taxControl      : Composition of one TaxControl;
        /**
        * Dunning control for the contract account.
        */
        dunningControl  : Composition of one DunningControl;
        /**
         * Correspondence related attributes of the account
         */
        correspondence : Composition of one CorrespondenceToOtherPartners;
};

/**
 * Contract account management data.
 */
aspect AccountManagementData {
        /**
        * Name of a Contract Account.
        */
        name                                 : String(35);
        /**
        * The relationship of a business partner to a contract account
        * defines the role that a business partner plays for a
        * contract account.
        */
        billingAccountRelationship : BillingAccountRelationshipCode not null;
        /**
        * The Contract Accounting Tolerance Group is a key under which
        * agreements are made for the tolerance values for payment
        * differences.
        */
        toleranceGroup                       : ToleranceGroupCode;
        /**
        * The contract accounting clearing category is a key that
        * references the contract account reference in automatic
        * clearing postings. In combination with the clearing type it
        * forms the key under which clearing rules are defined.
        */
        clearingCategory                     : ClearingCategoryCode;
        /**
        * The Payment Condition defines the rules for determining the
        * due dates for incoming and outgoing payments.
        */
        paymentCondition                     : PaymentConditionCode not null;
        /**
        * The Contract Accounting Account Determination Code is used
        * with company code, division, main transaction and (if
        * required) sub transaction to determine a G/L account.
        */
        accountDeterminationCode             : AccountDeterminationIdCode not null;
        /**
         * Key for determining the factors that influence interest
         * calculation and posting
         */
        interestKey : InterestKeyCode;
}

/**
 * Payment data for the contract account.
 */
aspect PaymentControl {
        /**
        * Company code group for the contract account.
        */
        companyCodeGroup          : String(4) not null;
        /**
        * Standard company code for the contract account.
        */
        standardCompanyCode       : String(4) not null;
        /**
        * Incoming payment information for the contract account.
        */
        incomingPayment           : Composition of one IncomingPayment;
        /**
        * Outgoing payment information for the contract account.
        */
        outgoingPayment           : Composition of one OutgoingPayment;
};

/**
 * Incoming payment information for the contract account.
 */
aspect IncomingPayment {
        /**
        * Incoming payment method for the contract account.
        */
        paymentMethod    : String(1);
        /**
        * Alternative payer for the contract account.
        */
        alternativePayer : Association to one BusinessPartner;
        /**
        * Bank account for incoming payment
        */
        bankAccount: String(4);

        /**
        * Payment card for incoming payment.
        */
        paymentCard      : String(6);

        /**
        * Mandate Reference
        */
        mandateId       :  String(35);
};

/**
 * Outgoing payment information for the contract account.
 */
aspect OutgoingPayment {
        /**
        * Outgoing payment method for the contract account.
        */
        paymentMethod    : String(5);
        /**
        * Alternative payee for the contract account.
        */
        alternativePayee : Association to one BusinessPartner;
        /**
        * Bank account for outgoing payment
        */
        bankAccount      : String(4);

        /**
        * Payment card for outgoing payment.
        */
        paymentCard      : String(6);
};

/**
 * Tax-relevant attributes.
 */
aspect TaxControl {
        /**
        * Destination country for tax reports. The value specified
        * here is used as the default value for the specification in
        * the associated line items. In the contract account, you only
        * have to enter a value if it differs from the country key in
        * the standard address for the business partner.
        */
        supplyingCountry : CountryCode;
}

/**
 * Dunning control for the contract account.
 */
aspect DunningControl {
        /**
        * A Dunning Procedure describes which dunning levels and
        * dunning activities will be executed during the dunning
        * process.
        */
        dunningProcedure            : DunningProcedureCode;
        /**
         * Business partner who receives the dunning notice for overdue
         * receivables instead of the contract partner.
         */
        alternativeDunningRecipient : Association to one BusinessPartner;
};

/**
 * Deatils of Correspondence To Other Partners
 */
aspect CorrespondenceToOtherPartners {
    /**
     * Key for a business partner that replaces the original
     * business partner for the purpose of recipient determination.
     * This business partner is then the standard correspondence
     * recipient.
     */
    alternativeCorrespondenceRecipient : Association to one BusinessPartner;
}