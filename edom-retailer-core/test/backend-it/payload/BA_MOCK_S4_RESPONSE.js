const s4BACreateResponse = [
    {
        MessageHeader: { CreationDateTime: '2021-05-05T19:07:05Z' },
        ContractAccount: {
            Header: {
                Identification: { InternalID: '000000000001' },
                ContractAccountCategory: 'Y1',
                CreationDate: '2021-05-05',
                CreatedByUser: 'CC0000000004',
            },
            PartnerRelationship: [
                {
                    BusinessPartnerID: { InternalID: '0010100029' },
                    CARelationshipOfBPToContrAcct: 'Y1',
                    PaymentCondition: 'YN01',
                    CAInterestCode: '01',
                    CAAccountDeterminationCode: 'Y1',
                    CACompanyCodeGroup: '1010',
                    CAStandardCompanyCode: '1010',
                    CAToleranceGroup: 'Y001',
                    CAAlternativePayer: { InternalID: '0010100024' },
                    CAAlternativePayee: { InternalID: '0010100029' },
                    SEPAMandate: 'L10013DE59R10E1R98VC00D2DX',
                    CAAlternativeDunningRecipient: { InternalID: '0010100024' },
                    CAAlternativeCorrespncRcpnt: { InternalID: '0010100029' },
                    CAReceivingCountry: 'DE',
                    CADunningProcedure: '01',
                    CreationDate: '2021-05-05',
                    CreatedByUser: 'CC0000000004',
                },
            ],
        },
        Log: {
            BusinessDocumentProcessingResultCode: '3',
            MaximumLogItemSeverityCode: '1',
            Item: [
                {
                    TypeID: '027(>3)',
                    SeverityCode: '1',
                    Note: 'Contract account 000000002818 created',
                },
            ],
        },
    },
    '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header/><soap-env:Body><n0:ContractAccountCreateConfirmation_sync xmlns:n0="http://sap.com/xi/SAPGlobal20/Global" xmlns:prx="urn:sap.com:proxy:CCF:/1SAI/TASCD5F89BF6BF455AA8F11:785"><MessageHeader><CreationDateTime>2021-05-05T19:07:05Z</CreationDateTime></MessageHeader><ContractAccount><Header><Identification><InternalID>000000002818</InternalID></Identification><ContractAccountCategory>Y1</ContractAccountCategory><CreationDate>2021-05-05</CreationDate><CreatedByUser>CC0000000004</CreatedByUser></Header><PartnerRelationship><BusinessPartnerID><InternalID>0010100029</InternalID></BusinessPartnerID><CARelationshipOfBPToContrAcct>Y1</CARelationshipOfBPToContrAcct><PaymentCondition>YN01</PaymentCondition><CAAccountDeterminationCode>Y1</CAAccountDeterminationCode><CACompanyCodeGroup>1010</CACompanyCodeGroup><CAStandardCompanyCode>1010</CAStandardCompanyCode><CAToleranceGroup>Y001</CAToleranceGroup><CAAlternativePayer><InternalID>0010100029</InternalID></CAAlternativePayer><CAAlternativePayee><InternalID>0010100024</InternalID></CAAlternativePayee><CAReceivingCountry>DE</CAReceivingCountry><CADunningProcedure>01</CADunningProcedure><CreationDate>2021-05-05</CreationDate><CreatedByUser>CC0000000004</CreatedByUser></PartnerRelationship></ContractAccount><Log><BusinessDocumentProcessingResultCode>3</BusinessDocumentProcessingResultCode><MaximumLogItemSeverityCode>1</MaximumLogItemSeverityCode><Item><TypeID>027(&gt;3)</TypeID><SeverityCode>1</SeverityCode><Note>Contract account 000000002818 created</Note></Item></Log></n0:ContractAccountCreateConfirmation_sync></soap-env:Body></soap-env:Envelope>',
];

const s4BAUpdateResponse = [
    {
        MessageHeader: { CreationDateTime: '2021-05-05T19:39:26Z' },
        ContractAccount: {
            ReferenceObjectNodeSenderTechnicalID: '/',
            Header: {
                Identification: { InternalID: '000000000001' },
                ContractAccountCategory: 'Y1',
                CreationDate: '2021-04-30',
                CreatedByUser: 'CC0000000004',
            },
            PartnerRelationship: [
                {
                    BusinessPartnerID: { InternalID: '0010100029' },
                    CARelationshipOfBPToContrAcct: 'Y1',
                    PaymentCondition: 'YN01',
                    CAInterestCode: '01',
                    CAAccountDeterminationCode: 'Y1',
                    CACompanyCodeGroup: '1010',
                    CAStandardCompanyCode: '1010',
                    CAToleranceGroup: 'Y001',
                    CAAlternativePayer: { InternalID: '0010100024' },
                    CAAlternativePayee: { InternalID: '0010100029' },
                    SEPAMandate: 'L10013DE59R10E1R98VC00D2DX',
                    CAAlternativeDunningRecipient: { InternalID: '0010100024' },
                    CAAlternativeCorrespncRcpnt: { InternalID: '0010100029' },
                    CAReceivingCountry: 'DE',
                    CreationDate: '2021-04-30',
                    CreatedByUser: 'CC0000000004',
                    LastChangeDate: '2021-05-05',
                    LastChangedByUser: 'CC0000000004',
                },
            ],
        },
        Log: {
            BusinessDocumentProcessingResultCode: '3',
            MaximumLogItemSeverityCode: '1',
            Item: [
                {
                    TypeID: '013(>3)',
                    SeverityCode: '1',
                    Note: 'Contract account 000000002042 changed',
                    WebURI: 'http://ldciccf.wdf.sap.corp:50000/sap/xi/docu_apperror?ID=NA&OBJECT=%3e3013&LANGUAGE=E&MSGV1=000000002042',
                },
            ],
        },
    },
    '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header/><soap-env:Body><n0:ContractAccountUpdateConfirmation_sync xmlns:n0="http://sap.com/xi/SAPGlobal20/Global" xmlns:prx="urn:sap.com:proxy:CCF:/1SAI/TAE1625F659F5DFF51AB272:785"><MessageHeader><CreationDateTime>2021-05-05T19:39:26Z</CreationDateTime></MessageHeader><ContractAccount><ReferenceObjectNodeSenderTechnicalID>/</ReferenceObjectNodeSenderTechnicalID><Header><Identification><InternalID>000000002042</InternalID></Identification><ContractAccountCategory>Y1</ContractAccountCategory><CreationDate>2021-04-30</CreationDate><CreatedByUser>CC0000000004</CreatedByUser></Header><PartnerRelationship><BusinessPartnerID><InternalID>0010100029</InternalID></BusinessPartnerID><CARelationshipOfBPToContrAcct>Y1</CARelationshipOfBPToContrAcct><PaymentCondition>YN01</PaymentCondition><CAAccountDeterminationCode>Y1</CAAccountDeterminationCode><CACompanyCodeGroup>1010</CACompanyCodeGroup><CAStandardCompanyCode>1010</CAStandardCompanyCode><CAToleranceGroup>Y001</CAToleranceGroup><CAAlternativePayer><InternalID>0010100029</InternalID></CAAlternativePayer><CAAlternativePayee><InternalID>0010100024</InternalID></CAAlternativePayee><CAReceivingCountry>DE</CAReceivingCountry><CreationDate>2021-04-30</CreationDate><CreatedByUser>CC0000000004</CreatedByUser><LastChangeDate>2021-05-05</LastChangeDate><LastChangedByUser>CC0000000004</LastChangedByUser></PartnerRelationship></ContractAccount><Log><BusinessDocumentProcessingResultCode>3</BusinessDocumentProcessingResultCode><MaximumLogItemSeverityCode>1</MaximumLogItemSeverityCode><Item><TypeID>013(&gt;3)</TypeID><SeverityCode>1</SeverityCode><Note>Contract account 000000002042 changed</Note><WebURI>http://ldciccf.wdf.sap.corp:50000/sap/xi/docu_apperror?ID=NA&amp;OBJECT=%3e3013&amp;LANGUAGE=E&amp;MSGV1=000000002042</WebURI></Item></Log></n0:ContractAccountUpdateConfirmation_sync></soap-env:Body></soap-env:Envelope>',
];

const s4BAReadResponse = [
    {
        MessageHeader: { CreationDateTime: '2021-05-05T19:07:05Z' },
        ContractAccount: {
            Header: {
                Identification: { InternalID: '000000000001' },
                ContractAccountCategory: 'Y1',
                CreationDate: '2021-05-05',
                CreatedByUser: 'CC0000000004',
            },
            PartnerRelationship: [
                {
                    BusinessPartnerID: { InternalID: '0010100029' },
                    CARelationshipOfBPToContrAcct: 'Y1',
                    PaymentCondition: 'YN01',
                    CAInterestCode: '01',
                    CAAccountDeterminationCode: 'Y1',
                    CACompanyCodeGroup: '1010',
                    CAStandardCompanyCode: '1010',
                    CAToleranceGroup: 'Y001',
                    CAAlternativePayer: { InternalID: '0010100024' },
                    CAAlternativePayee: { InternalID: '0010100029' },
                    SEPAMandate: 'L10013DE59R10E1R98VC00D2DX',
                    CAAlternativeDunningRecipient: { InternalID: '0010100024' },
                    CAAlternativeCorrespncRcpnt: { InternalID: '0010100029' },
                    CAReceivingCountry: 'DE',
                    CADunningProcedure: '01',
                    CreationDate: '2021-05-05',
                    CreatedByUser: 'CC0000000004',
                },
            ],
        },
        Log: {
            BusinessDocumentProcessingResultCode: '3',
        },
    },
    '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header/><soap-env:Body><n0:ContractAccountByIdentifyingElementsResponse_sync xmlns:n0="http://sap.com/xi/SAPGlobal20/Global" xmlns:prx="urn:sap.com:proxy:CCF:/1SAI/TASCD5F89BF6BF455AA8F11:785"><MessageHeader><CreationDateTime>2021-05-05T19:07:05Z</CreationDateTime></MessageHeader><ContractAccount><Header><Identification><InternalID>000000002818</InternalID></Identification><ContractAccountCategory>Y1</ContractAccountCategory><CreationDate>2021-05-05</CreationDate><CreatedByUser>CC0000000004</CreatedByUser></Header><PartnerRelationship><BusinessPartnerID><InternalID>0010100029</InternalID></BusinessPartnerID><CARelationshipOfBPToContrAcct>Y1</CARelationshipOfBPToContrAcct><PaymentCondition>YN01</PaymentCondition><CAAccountDeterminationCode>Y1</CAAccountDeterminationCode><CACompanyCodeGroup>1010</CACompanyCodeGroup><CAStandardCompanyCode>1010</CAStandardCompanyCode><CAToleranceGroup>Y001</CAToleranceGroup><CAAlternativePayer><InternalID>0010100029</InternalID></CAAlternativePayer><CAAlternativePayee><InternalID>0010100024</InternalID></CAAlternativePayee><CAReceivingCountry>DE</CAReceivingCountry><CADunningProcedure>01</CADunningProcedure><CreationDate>2021-05-05</CreationDate><CreatedByUser>CC0000000004</CreatedByUser></PartnerRelationship></ContractAccount><Log><BusinessDocumentProcessingResultCode>3</BusinessDocumentProcessingResultCode></Note></Item></Log></n0:ContractAccountByIdentifyingElementsResponse_sync></soap-env:Body></soap-env:Envelope>',
];

const s4BAReadFailedResponse = [
    {
        MessageHeader: { CreationDateTime: '2021-05-05T19:07:05Z' },
        ContractAccount: {
            Header: {
                Identification: { InternalID: '000000000001' },
                ContractAccountCategory: 'Y1',
                CreationDate: '2021-05-05',
                CreatedByUser: 'CC0000000004',
            },
            PartnerRelationship: [
                {
                    BusinessPartnerID: { InternalID: '0010100029' },
                    CARelationshipOfBPToContrAcct: 'Y1',
                    PaymentCondition: 'YN01',
                    CAInterestCode: '01',
                    CAAccountDeterminationCode: 'Y1',
                    CACompanyCodeGroup: '1010',
                    CAStandardCompanyCode: '1010',
                    CAToleranceGroup: 'Y001',
                    CAAlternativePayer: { InternalID: '0010100024' },
                    CAAlternativePayee: { InternalID: '0010100029' },
                    SEPAMandate: 'L10013DE59R10E1R98VC00D2DX',
                    CAAlternativeDunningRecipient: { InternalID: '0010100024' },
                    CAAlternativeCorrespncRcpnt: { InternalID: '0010100029' },
                    CAReceivingCountry: 'DE',
                    CADunningProcedure: '01',
                    CreationDate: '2021-05-05',
                    CreatedByUser: 'CC0000000004',
                },
            ],
        },
        Log: {
            BusinessDocumentProcessingResultCode: '5',
        },
    },
    '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header/><soap-env:Body><n0:ContractAccountByIdentifyingElementsResponse_sync xmlns:n0="http://sap.com/xi/SAPGlobal20/Global" xmlns:prx="urn:sap.com:proxy:CCF:/1SAI/TASCD5F89BF6BF455AA8F11:785"><MessageHeader><CreationDateTime>2021-05-05T19:07:05Z</CreationDateTime></MessageHeader><ContractAccount><Header><Identification><InternalID>000000002818</InternalID></Identification><ContractAccountCategory>Y1</ContractAccountCategory><CreationDate>2021-05-05</CreationDate><CreatedByUser>CC0000000004</CreatedByUser></Header><PartnerRelationship><BusinessPartnerID><InternalID>0010100029</InternalID></BusinessPartnerID><CARelationshipOfBPToContrAcct>Y1</CARelationshipOfBPToContrAcct><PaymentCondition>YN01</PaymentCondition><CAAccountDeterminationCode>Y1</CAAccountDeterminationCode><CACompanyCodeGroup>1010</CACompanyCodeGroup><CAStandardCompanyCode>1010</CAStandardCompanyCode><CAToleranceGroup>Y001</CAToleranceGroup><CAAlternativePayer><InternalID>0010100029</InternalID></CAAlternativePayer><CAAlternativePayee><InternalID>0010100024</InternalID></CAAlternativePayee><CAReceivingCountry>DE</CAReceivingCountry><CADunningProcedure>01</CADunningProcedure><CreationDate>2021-05-05</CreationDate><CreatedByUser>CC0000000004</CreatedByUser></PartnerRelationship></ContractAccount><Log><BusinessDocumentProcessingResultCode>5</BusinessDocumentProcessingResultCode></Note></Item></Log></n0:ContractAccountByIdentifyingElementsResponse_sync></soap-env:Body></soap-env:Envelope>',
];

const s4BAFailedResponse = [
    {
        MessageHeader: { CreationDateTime: '2021-05-12T23:04:55Z' },
        Log: {
            BusinessDocumentProcessingResultCode: '5',
            MaximumLogItemSeverityCode: '3',
            Item: [
                {
                    TypeID: '047(>3)',
                    SeverityCode: '3',
                    Note: 'Specify bank details for incoming payment method 4',
                    WebURI: 'http://ldai3ccf.wdf.sap.corp:50000/sap/xi/docu_apperror?ID=NA&OBJECT=%3e3047&LANGUAGE=E&MSGV1=4',
                },
                {
                    TypeID: '016(FKK_SEPA)',
                    SeverityCode: '2',
                    Note: 'There are no active mandates for business partner 0010100029',
                    WebURI: 'http://ldai3ccf.wdf.sap.corp:50000/sap/xi/docu_apperror?ID=NA&OBJECT=FKK_SEPA016&LANGUAGE=E&MSGV1=0010100029',
                },
            ],
        },
    },
    '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header/><soap-env:Body><n0:ContractAccountCreateConfirmation_sync xmlns:n0="http://sap.com/xi/SAPGlobal20/Global" xmlns:prx="urn:sap.com:proxy:CCF:/1SAI/TASCD5F89BF6BF455AA8F11:785"><MessageHeader><CreationDateTime>2021-05-12T23:04:55Z</CreationDateTime></MessageHeader><Log><BusinessDocumentProcessingResultCode>5</BusinessDocumentProcessingResultCode><MaximumLogItemSeverityCode>3</MaximumLogItemSeverityCode><Item><TypeID>047(&gt;3)</TypeID><SeverityCode>3</SeverityCode><Note>Specify bank details for incoming payment method 4</Note><WebURI>http://ldai3ccf.wdf.sap.corp:50000/sap/xi/docu_apperror?ID=NA&amp;OBJECT=%3e3047&amp;LANGUAGE=E&amp;MSGV1=4</WebURI></Item><Item><TypeID>016(FKK_SEPA)</TypeID><SeverityCode>2</SeverityCode><Note>There are no active mandates for business partner 0010100029</Note><WebURI>http://ldai3ccf.wdf.sap.corp:50000/sap/xi/docu_apperror?ID=NA&amp;OBJECT=FKK_SEPA016&amp;LANGUAGE=E&amp;MSGV1=0010100029</WebURI></Item></Log></n0:ContractAccountCreateConfirmation_sync></soap-env:Body></soap-env:Envelope>',
];

const s4GenericFailedResponse =
    '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header/><soap-env:Body><soap-env:Fault><faultcode>soap-env:Server</faultcode><faultstring xml:lang="en">Web service processing error; more details in the web service error log on provider side (UTC timestamp 20210719154314; Transaction ID 8983FE51F96F0070E0060F4D726A6BCC) The error log can be accessed by service provider from SAP backend</faultstring><detail/></soap-env:Fault></soap-env:Body></soap-env:Envelope>';

const s4Response = [
    {
        displayId: '000000000001',
        category: {
            code: 'Y1',
        },
        partner: {
            businessPartner: {
                id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
            },
            accountManagementData: {
                name: 'Contract Account Test',
                billingAccountRelationship: {
                    code: 'Y1',
                },
                interestKey: {
                    code: '01',
                },
                toleranceGroup: {
                    code: 'Y001',
                },
                clearingCategory: null,
                paymentCondition: {
                    code: 'YN01',
                },
                accountDeterminationCode: {
                    code: 'Y1',
                },
            },
            paymentControl: {
                companyCodeGroup: '1010',
                standardCompanyCode: '1010',
                incomingPayment: {
                    paymentMethod: 'E',
                    alternativePayer: null,
                    bankAccount: '0001',
                    paymentCard: null,
                    mandateId: 'L10013DE59R10E1R98VC00D2DX',
                },
                outgoingPayment: {
                    paymentMethod: null,
                    alternativePayee: null,
                    bankAccount: null,
                    paymentCard: null,
                },
            },
            taxControl: {
                supplyingCountry: {
                    code: 'CA',
                },
            },
            dunningControl: {
                dunningProcedure: {
                    code: '01',
                },
                alternativeDunningRecipient: null,
            },
            correspondence: {
                alternativeCorrespondenceRecipient: null,
            },
        },
    },
    {
        displayId: '000000000002',
        category: {
            code: 'Y1',
        },
        partner: {
            businessPartner: {
                id: 'f321d997-ae93-4316-acfa-c29f3bbe4bb7',
            },
            accountManagementData: {
                name: 'Contract Account Test 2',
                billingAccountRelationship: {
                    code: 'Y1',
                },
                toleranceGroup: {
                    code: 'Y001',
                },
                interestKey: {
                    code: '01',
                },
                clearingCategory: null,
                paymentCondition: {
                    code: 'YN01',
                },
                accountDeterminationCode: {
                    code: 'Y1',
                },
            },
            paymentControl: {
                companyCodeGroup: '1010',
                standardCompanyCode: '1010',
                incomingPayment: {
                    paymentMethod: 'E',
                    alternativePayer: null,
                    bankAccount: '0001',
                    paymentCard: null,
                    mandateId: 'L10013DE59R10E1R98VC00D2DX',
                },
                outgoingPayment: {
                    paymentMethod: null,
                    alternativePayee: null,
                    bankAccount: null,
                    paymentCard: null,
                },
            },
            taxControl: {
                supplyingCountry: {
                    code: 'CA',
                },
            },
            dunningControl: {
                dunningProcedure: {
                    code: '01',
                },
                alternativeDunningRecipient: null,
            },
            correspondence: {
                alternativeCorrespondenceRecipient: null,
            },
        },
    },
];

const destinationAuth = {
    headers: {
        authorization: 'Basic utehdehjjdlojduihufejkjjihfruhf',
    },
};

module.exports = {
    destinationAuth,
    s4BACreateResponse,
    s4BAUpdateResponse,
    s4BAFailedResponse,
    s4GenericFailedResponse,
    s4Response,
    s4BAReadResponse,
    s4BAReadFailedResponse,
};
