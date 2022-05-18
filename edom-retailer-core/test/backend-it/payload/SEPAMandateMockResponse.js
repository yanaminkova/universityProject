const sepaCreatePayload = {
    sepaMandate: { mandateId: '000000000013', companyCode: '1010' },

    paymentOccurenceType: {
        code: '1',
    },
    businessPartner: {
        Id: {
            id: '3dcb05ae-6f8f-4f2b-8081-dd9aaf22a7d0',
        },
        displayId: null,
    },
    billingAccountReference: {
        billingAccountId: {
            id: 'a53fb0fd-9777-4d26-ae7b-5f7b26335622',
        },
        displayId: null,
    },
    IBAN: 'DE46230300000001990033',
    signatureDate: '2022-01-04',
    status: {
        code: '1',
    },
};
const createPayload = [
    {
        SEPAMandateApplication: 'T',
        Creditor: 'DE98ZZZ09999999999',
        SEPAPaymentType: '1',
        SenderType: 'BUS1006',
        Sender: '0002299380',
        SenderCountry: 'DE',
        SenderIBAN: 'DE46230300000001990033',
        SenderBankSWIFTCode: 'HYVEDEMM237',
        RecipientType: 'BUS0002',
        Recipient: '1010',
        RecipientCountry: 'DE',
        SEPAMandateReferenceType: 'CA_CONTACC',
        SEPAMandateReference: '000000021638',
        SEPASignatureDate: '2021-11-04T00:00:00',
        SEPAMandateStatus: '1',
    },
];

const auth = {
    jwt: 'eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYzR1Y29uc3VtZXJkZXZhd3MuYXV0aGVudGljYXRpb24uZXUxMC5oYW5hLm9uZGVtYW5kLmNvbS90b2tlbl9rZXlzIiwia2lkIjoiZGVmYXVsdC1qd3Qta2V5LS0xMjIyODY3NDM4IiwidHlwIjoiSldUIn0.eyJqdGkiOiJhODVlMTE4MWRmNGM0NjYwODhlYjQ2NTJjMjU3OWE4ZCIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI3ZGQ3ZWViZi0wNGZlLTQ4ODYtYmJiMC1iOGI1YzIyNzZmMWIiLCJ6ZG4iOiJjNHVjb25zdW1lcmRldmF3cyIsInNlcnZpY2VpbnN0YW5jZWlkIjoiYTYzMmE2MjItNzNjZC00ZTgwLTgxN2ItMWFkZGJiNTdkYTU2In0sInN1YiI6InNiLWE2MzJhNjIyLTczY2QtNGU4MC04MTdiLTFhZGRiYjU3ZGE1NiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImF1dGhvcml0aWVzIjpbImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQVBJLlJlYWQiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLm10ZGVwbG95bWVudCIsInVhYS5yZXNvdXJjZSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuZW1jYWxsYmFjayIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuTWFzdGVyRGF0YS5TeW5jIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5BUEkuRGVsZXRlIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5BUEkuV3JpdGUiXSwic2NvcGUiOlsiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5BUEkuUmVhZCIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMubXRkZXBsb3ltZW50IiwidWFhLnJlc291cmNlIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5lbWNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5NYXN0ZXJEYXRhLlN5bmMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5EZWxldGUiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5Xcml0ZSJdLCJjbGllbnRfaWQiOiJzYi1hNjMyYTYyMi03M2NkLTRlODAtODE3Yi0xYWRkYmI1N2RhNTYhYjg1MjgxfGM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMiLCJjaWQiOiJzYi1hNjMyYTYyMi03M2NkLTRlODAtODE3Yi0xYWRkYmI1N2RhNTYhYjg1MjgxfGM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMiLCJhenAiOiJzYi1hNjMyYTYyMi03M2NkLTRlODAtODE3Yi0xYWRkYmI1N2RhNTYhYjg1MjgxfGM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjhhMzJjMDkyIiwiaWF0IjoxNjQ0OTkwNTA2LCJleHAiOjE2NDUwMzM3MDYsImlzcyI6Imh0dHBzOi8vYzR1Y29uc3VtZXJkZXZhd3MuYXV0aGVudGljYXRpb24uZXUxMC5oYW5hLm9uZGVtYW5kLmNvbS9vYXV0aC90b2tlbiIsInppZCI6IjdkZDdlZWJmLTA0ZmUtNDg4Ni1iYmIwLWI4YjVjMjI3NmYxYiIsImF1ZCI6WyJzYi1hNjMyYTYyMi03M2NkLTRlODAtODE3Yi0xYWRkYmI1N2RhNTYhYjg1MjgxfGM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLk1hc3RlckRhdGEiLCJ1YWEiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5BUEkiXX0.OeHO_op_Eq6aZMQKgu4seLwesSHSUT8EBQBJzpgqy8ZtKo606ELC9RjPaFhFGc2y_3pKM-irPSx1HxG0C50ICQjqQLZshdNdbr_ANKCNoyelmOqH4kTcGl1KMxn4JSdNlZUdvaulQxx9lPWc-goUV7LulowduZtjWgZRFlcgJngzhnnvkvNJ-T_jm2jaI--98Me2fYD6INhH_Q_FPGEcXYETmN4nyLmtjwbJ0Kd5ZfJwOp7WZ-oxZvn6iPzAXmY8yT4FJD43OHFZkxZOwgEOw0SUktiMHK50BA0MQpGFZnwvMjVP8wJEdiiTaK6kKrpbFF5atcL_bWWTdrF-OVo_HQ',
};

const destinationAuth = {
    headers: {
        authorization: 'Basic utehdehjjdlojduihufejkjjihfruhf',
    },
};

const destination = {
    name: 'S4HC_SEPA_MANDATE',
    url: 'https: //test.com/sap/opu/odata/sap/SEPA',
    username: 'testuser',
    password: 'test',
    originalProperties: { s4BusinessSystem: '0LOALS1' },
};

const responseS4 = {
    SEPAMandateApplication: '1',
    Creditor: 'DE98ZZZ09999999999',
    SEPAMandate: '000000000114',
    SEPAPaymentType: '1',
    SenderType: 'BUS1006',
    Sender: '0002299380',
    SenderLastName: '',
    SenderFirstName: '',
    SenderStreetName: '',
    SenderHouseNumber: '',
    SenderPostalCode: '',
    SenderCityName: '',
    SenderCountry: 'DE',
    SenderLanguage: '',
    SenderIBAN: 'DE46230300000001990033',
    SenderBankSWIFTCode: 'HYVEDEMM237',
    AlternativePayerName: '',
    RecipientType: 'BUS0002',
    Recipient: '1010',
    RecipientName1: '',
    RecipientName2: '',
    RecipientStreetName: '',
    RecipientHouseNumber: '',
    RecipientPostalCode: '',
    RecipientCityName: '',
    RecipientCountry: 'DE',
    SEPAMandateReferenceType: 'CA_CONTACC',
    SEPAMandateReference: '000000021638',
    SEPAMandateReferenceDesc: '',
    ValidityStartDate: null,
    ValidityEndDate: null,
    SEPASignatureCityName: '',
    SEPASignatureDate: '/Date(1635984000000)/',
    SEPAMandateStatus: '1',
    AlternativePayer: '',
    AlternativePayeeName: '',
    AlternativePayee: '',
    SEPAMandateIsB2BMandate: false,
    SenderExternalID: '',
    SEPAMandateOrganizationalUnit1: '',
    SEPAMandateOrganizationalUnit2: '',
    SEPAMandateOrganizationalUnit3: '',
    SEPAMandateOrganizationalUnit4: '',
    SEPAMandateFirstUseDate: null,
    SEPAMandateFirstUseObjTypeCode: '',
    SEPAMandateFirstUsePaymentDoc: '',
    SEPAMandateLastUseDate: null,
    SEPAMandateLastUseObjTypeCode: '',
    SEPAMandateLastUsePaymentDoc: '',
    SepaCreditorIdOrigin: '',
    OriginalSEPAMandate: '',
    Version: '0000',
    CreatedByUser: '',
    CreationDate: null,
    CreationTime: 'PT00H00M00S',
};

const responseS4Test = {
    SEPAMandateApplication: '1',
    Creditor: 'DE98ZZZ09999999999',
    SEPAMandate: '000000000114',
    SEPAPaymentType: '1',
    SenderType: 'BUS1006',
    Sender: '0002299380',
    SenderLastName: '',
    SenderFirstName: '',
    SenderStreetName: '',
    SenderHouseNumber: '',
    SenderPostalCode: '',
    SenderCityName: '',
    SenderCountry: 'DE',
    SenderLanguage: '',
    SenderIBAN: 'DE46230300000001990033',
    SenderBankSWIFTCode: 'HYVEDEMM237',
    AlternativePayerName: '',
    RecipientType: 'BUS0002',
    Recipient: '1010',
    RecipientName1: '',
    RecipientName2: '',
    RecipientStreetName: '',
    RecipientHouseNumber: '',
    RecipientPostalCode: '',
    RecipientCityName: '',
    RecipientCountry: 'DE',
    SEPAMandateReferenceType: 'CA_CONTACC',
    SEPAMandateReference: '000000021638',
    SEPAMandateReferenceDesc: '',
    ValidityStartDate: null,
    ValidityEndDate: null,
    SEPASignatureCityName: '',
    SEPASignatureDate: '/Date(1635984000000)/',
    SEPAMandateStatus: '1',
    AlternativePayer: '',
    AlternativePayeeName: '',
    AlternativePayee: '',
    SEPAMandateIsB2BMandate: false,
    SenderExternalID: '',
    SEPAMandateOrganizationalUnit1: '',
    SEPAMandateOrganizationalUnit2: '',
    SEPAMandateOrganizationalUnit3: '',
    SEPAMandateOrganizationalUnit4: '',
    SEPAMandateFirstUseDate: null,
    SEPAMandateFirstUseObjTypeCode: '',
    SEPAMandateFirstUsePaymentDoc: '',
    SEPAMandateLastUseDate: null,
    SEPAMandateLastUseObjTypeCode: '',
    SEPAMandateLastUsePaymentDoc: '',
    SepaCreditorIdOrigin: '',
    OriginalSEPAMandate: '',
    Version: '0000',
    CreatedByUser: '',
    CreationDate: null,
    CreationTime: 'PT00H00M00S',
};

const responseS4Array = [
    {
        SEPAMandateApplication: '1',
        Creditor: 'DE51ZZZ12345678901',
        SEPAMandate: '000000000014',
        SEPAPaymentType: '1',
        SenderType: 'BUS1006',
        Sender: '0002298664',
        SenderLastName: '',
        SenderFirstName: '',
        SenderStreetName: '',
        SenderHouseNumber: '',
        SenderPostalCode: '',
        SenderCityName: '',
        SenderCountry: 'DE',
        SenderLanguage: '',
        SenderIBAN: 'DE46230300000001990033',
        SenderBankSWIFTCode: 'HYVEDEMM237',
        AlternativePayerName: '',
        RecipientType: 'BUS0002',
        Recipient: '1010',
        RecipientName1: '',
        RecipientName2: '',
        RecipientStreetName: '',
        RecipientHouseNumber: '',
        RecipientPostalCode: '',
        RecipientCityName: '',
        RecipientCountry: 'DE',
        SEPAMandateReferenceType: '',
        SEPAMandateReference: '',
        SEPAMandateReferenceDesc: '',
        ValidityStartDate: null,
        ValidityEndDate: null,
        SEPASignatureCityName: '',
        SEPASignatureDate: '/Date(1641254400000)/',
        SEPAMandateStatus: '1',
        AlternativePayer: '',
        AlternativePayeeName: '',
        AlternativePayee: '',
        SEPAMandateIsB2BMandate: false,
        SenderExternalID: '',
        SEPAMandateOrganizationalUnit1: '',
        SEPAMandateOrganizationalUnit2: '',
        SEPAMandateOrganizationalUnit3: '',
        SEPAMandateOrganizationalUnit4: '',
        SEPAMandateFirstUseDate: null,
        SEPAMandateFirstUseObjTypeCode: '',
        SEPAMandateFirstUsePaymentDoc: '',
        SEPAMandateLastUseDate: null,
        SEPAMandateLastUseObjTypeCode: '',
        SEPAMandateLastUsePaymentDoc: '',
        SepaCreditorIdOrigin: 'DE51ZZZ12345678901',
        OriginalSEPAMandate: '000000000014',
        Version: '0000',
        CreatedByUser: 'CC0000001926',
        CreationDate: '/Date(1644451200000)/',
        CreationTime: 'PT05H17M19S',
    },
    {
        SEPAMandateApplication: '1',
        Creditor: 'DE51ZZZ12345678901',
        SEPAMandate: '000000000045',
        SEPAPaymentType: '1',
        SenderType: 'BUS1006',
        Sender: '0002298664',
        SenderLastName: '',
        SenderFirstName: '',
        SenderStreetName: '',
        SenderHouseNumber: '',
        SenderPostalCode: '',
        SenderCityName: '',
        SenderCountry: 'DE',
        SenderLanguage: '',
        SenderIBAN: 'DE46230300000001990033',
        SenderBankSWIFTCode: 'HYVEDEMM237',
        AlternativePayerName: '',
        RecipientType: 'BUS0002',
        Recipient: '1010',
        RecipientName1: '',
        RecipientName2: '',
        RecipientStreetName: '',
        RecipientHouseNumber: '',
        RecipientPostalCode: '',
        RecipientCityName: '',
        RecipientCountry: 'DE',
        SEPAMandateReferenceType: '',
        SEPAMandateReference: '',
        SEPAMandateReferenceDesc: '',
        ValidityStartDate: null,
        ValidityEndDate: null,
        SEPASignatureCityName: '',
        SEPASignatureDate: '/Date(1641254400000)/',
        SEPAMandateStatus: '1',
        AlternativePayer: '',
        AlternativePayeeName: '',
        AlternativePayee: '',
        SEPAMandateIsB2BMandate: false,
        SenderExternalID: '',
        SEPAMandateOrganizationalUnit1: '',
        SEPAMandateOrganizationalUnit2: '',
        SEPAMandateOrganizationalUnit3: '',
        SEPAMandateOrganizationalUnit4: '',
        SEPAMandateFirstUseDate: null,
        SEPAMandateFirstUseObjTypeCode: '',
        SEPAMandateFirstUsePaymentDoc: '',
        SEPAMandateLastUseDate: null,
        SEPAMandateLastUseObjTypeCode: '',
        SEPAMandateLastUsePaymentDoc: '',
        SepaCreditorIdOrigin: 'DE51ZZZ12345678901',
        OriginalSEPAMandate: '000000000045',
        Version: '0000',
        CreatedByUser: 'CC0000001926',
        CreationDate: '/Date(1644710400000)/',
        CreationTime: 'PT02H59M10S',
    },
    {
        SEPAMandateApplication: '1',
        Creditor: 'DE51ZZZ12345678901',
        SEPAMandate: '000000000046',
        SEPAPaymentType: '1',
        SenderType: 'BUS1006',
        Sender: '0002298664',
        SenderLastName: '',
        SenderFirstName: '',
        SenderStreetName: '',
        SenderHouseNumber: '',
        SenderPostalCode: '',
        SenderCityName: '',
        SenderCountry: 'DE',
        SenderLanguage: '',
        SenderIBAN: 'DE46230300000001990033',
        SenderBankSWIFTCode: 'HYVEDEMM237',
        AlternativePayerName: '',
        RecipientType: 'BUS0002',
        Recipient: '1010',
        RecipientName1: '',
        RecipientName2: '',
        RecipientStreetName: '',
        RecipientHouseNumber: '',
        RecipientPostalCode: '',
        RecipientCityName: '',
        RecipientCountry: 'DE',
        SEPAMandateReferenceType: '',
        SEPAMandateReference: '',
        SEPAMandateReferenceDesc: '',
        ValidityStartDate: null,
        ValidityEndDate: null,
        SEPASignatureCityName: '',
        SEPASignatureDate: '/Date(1641254400000)/',
        SEPAMandateStatus: '6',
        AlternativePayer: '',
        AlternativePayeeName: '',
        AlternativePayee: '',
        SEPAMandateIsB2BMandate: false,
        SenderExternalID: '',
        SEPAMandateOrganizationalUnit1: '',
        SEPAMandateOrganizationalUnit2: '',
        SEPAMandateOrganizationalUnit3: '',
        SEPAMandateOrganizationalUnit4: '',
        SEPAMandateFirstUseDate: null,
        SEPAMandateFirstUseObjTypeCode: '',
        SEPAMandateFirstUsePaymentDoc: '',
        SEPAMandateLastUseDate: null,
        SEPAMandateLastUseObjTypeCode: '',
        SEPAMandateLastUsePaymentDoc: '',
        SepaCreditorIdOrigin: 'DE51ZZZ12345678901',
        OriginalSEPAMandate: '000000000045',
        Version: '0000',
        CreatedByUser: 'CC0000001926',
        CreationDate: '/Date(1644710400000)/',
        CreationTime: 'PT02H59M10S',
    },
    {
        SEPAMandateApplication: '1',
        Creditor: 'DE51ZZZ12345678901',
        SEPAMandate: '000000000048',
        SEPAPaymentType: '1',
        SenderType: 'BUS1006',
        Sender: '0002298664',
        SenderLastName: '',
        SenderFirstName: '',
        SenderStreetName: '',
        SenderHouseNumber: '',
        SenderPostalCode: '',
        SenderCityName: '',
        SenderCountry: 'DE',
        SenderLanguage: '',
        SenderIBAN: 'DE46230300000001990033',
        SenderBankSWIFTCode: 'HYVEDEMM237',
        AlternativePayerName: '',
        RecipientType: 'BUS0002',
        Recipient: '1010',
        RecipientName1: '',
        RecipientName2: '',
        RecipientStreetName: '',
        RecipientHouseNumber: '',
        RecipientPostalCode: '',
        RecipientCityName: '',
        RecipientCountry: 'DE',
        SEPAMandateReferenceType: '',
        SEPAMandateReference: '',
        SEPAMandateReferenceDesc: '',
        ValidityStartDate: null,
        ValidityEndDate: null,
        SEPASignatureCityName: '',
        SEPASignatureDate: '/Date(1641254400000)/',
        SEPAMandateStatus: '5',
        AlternativePayer: '',
        AlternativePayeeName: '',
        AlternativePayee: '',
        SEPAMandateIsB2BMandate: false,
        SenderExternalID: '',
        SEPAMandateOrganizationalUnit1: '',
        SEPAMandateOrganizationalUnit2: '',
        SEPAMandateOrganizationalUnit3: '',
        SEPAMandateOrganizationalUnit4: '',
        SEPAMandateFirstUseDate: null,
        SEPAMandateFirstUseObjTypeCode: '',
        SEPAMandateFirstUsePaymentDoc: '',
        SEPAMandateLastUseDate: null,
        SEPAMandateLastUseObjTypeCode: '',
        SEPAMandateLastUsePaymentDoc: '',
        SepaCreditorIdOrigin: 'DE51ZZZ12345678901',
        OriginalSEPAMandate: '000000000045',
        Version: '0000',
        CreatedByUser: 'CC0000001926',
        CreationDate: '/Date(1644710400000)/',
        CreationTime: 'PT02H59M10S',
    },
    {
        SEPAMandateApplication: '1',
        Creditor: 'DE51ZZZ12345678901',
        SEPAMandate: '000000000047',
        SEPAPaymentType: '1',
        SenderType: 'BUS1006',
        Sender: '0002298664',
        SenderLastName: '',
        SenderFirstName: '',
        SenderStreetName: '',
        SenderHouseNumber: '',
        SenderPostalCode: '',
        SenderCityName: '',
        SenderCountry: 'DE',
        SenderLanguage: '',
        SenderIBAN: 'DE46230300000001990033',
        SenderBankSWIFTCode: 'HYVEDEMM237',
        AlternativePayerName: '',
        RecipientType: 'BUS0002',
        Recipient: '1010',
        RecipientName1: '',
        RecipientName2: '',
        RecipientStreetName: '',
        RecipientHouseNumber: '',
        RecipientPostalCode: '',
        RecipientCityName: '',
        RecipientCountry: 'DE',
        SEPAMandateReferenceType: '',
        SEPAMandateReference: '',
        SEPAMandateReferenceDesc: '',
        ValidityStartDate: null,
        ValidityEndDate: null,
        SEPASignatureCityName: '',
        SEPASignatureDate: '/Date(1641254400000)/',
        SEPAMandateStatus: '4',
        AlternativePayer: '',
        AlternativePayeeName: '',
        AlternativePayee: '',
        SEPAMandateIsB2BMandate: false,
        SenderExternalID: '',
        SEPAMandateOrganizationalUnit1: '',
        SEPAMandateOrganizationalUnit2: '',
        SEPAMandateOrganizationalUnit3: '',
        SEPAMandateOrganizationalUnit4: '',
        SEPAMandateFirstUseDate: null,
        SEPAMandateFirstUseObjTypeCode: '',
        SEPAMandateFirstUsePaymentDoc: '',
        SEPAMandateLastUseDate: null,
        SEPAMandateLastUseObjTypeCode: '',
        SEPAMandateLastUsePaymentDoc: '',
        SepaCreditorIdOrigin: 'DE51ZZZ12345678901',
        OriginalSEPAMandate: '000000000045',
        Version: '0000',
        CreatedByUser: 'CC0000001926',
        CreationDate: '/Date(1644710400000)/',
        CreationTime: 'PT02H59M10S',
    },
];

const sepaMandateCreatePayload = {
    sepaMandate: { mandateId: '000000000013', companyCode: '1010' },
    paymentOccurenceType: {
        code: '1',
    },
    businessPartner: {
        Id: {
            id: '73fc6006-bd78-4ab5-99ea-c140a2f55cc0',
        },
        displayId: null,
    },
    billingAccountReference: {
        billingAccountId: {
            id: cds.utils.uuid(),
        },
        displayId: null,
    },
    IBAN: 'DE46230300000001990033',
    signatureDate: '2022-01-04',
    status: {
        code: '1',
    },
};

module.exports = {
    sepaCreatePayload,
    createPayload,
    auth,
    destinationAuth,
    destination,
    responseS4,
    responseS4Array,
    sepaMandateCreatePayload,
    responseS4Test,
};
