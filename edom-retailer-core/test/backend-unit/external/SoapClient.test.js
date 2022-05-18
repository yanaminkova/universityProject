const soap = require('soap');
const path = require('path');
const expect = require('expect');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');
const SoapClient = require('../../../srv/external/SoapClient');

const wsdlPath = 'lib/billingaccount/wsdlCA.wsdl';
const wsdl = path.join(__dirname, '../../', wsdlPath);
const destName = 'S4H_SOAP_ContractAccount';
const destNameWithoutBusinessSystem = 'no-business-system';

const {
    destinationAuth,
    s4BACreateResponse,
    s4BAUpdateResponse,
    s4GenericFailedResponse,
} = require('../../backend-it/payload/BA_MOCK_S4_RESPONSE');
const successStatus = '3';
const failedStatus = '5';

const argsUpdate = {
    Header: {
        MessageHeader: {
            CreationDateTime: new Date().toISOString(),
        },
    },
    MessageHeader: {
        CreationDateTime: new Date().toISOString(),
    },
    ContractAccountUpdateRequest: {
        Header: {
            Identification: '0001020309',
        },
    },
};

const argsCreate = {
    Header: {
        MessageHeader: {
            CreationDateTime: new Date().toISOString(),
        },
    },
    MessageHeader: {
        CreationDateTime: new Date().toISOString(),
    },
    ContractAccount: {
        Header: {
            Identification: null,
        },
    },
};

const businessSystemError =
    'S4H Business System could not be determined. Please maintain it as property `BusinessSystem` for the destination S4H_SOAP_ContractAccount';

jest.mock('soap');

describe('BA external SoapClient service unit test UTILITIESCLOUDSOLUTION-3046', () => {
    beforeEach(() => {});

    const mockSoapClientContractAccountUpdateAsync = jest
        .fn()
        .mockResolvedValue(s4BAUpdateResponse);
    const mockSoapClientContractAccountCreateAsync = jest
        .fn()
        .mockResolvedValue(s4BACreateResponse);

    jest.spyOn(soap, 'createClientAsync').mockImplementation(() => {
        return {
            setSecurity: () => {},
            setEndpoint: () => {},
            ContractAccountUpdateAsync:
                mockSoapClientContractAccountUpdateAsync,
            ContractAccountCreateAsync:
                mockSoapClientContractAccountCreateAsync,
        };
    });

    setTestDestination({
        name: 'S4H_SOAP_ContractAccount',
        url: 'https://S4H-soap-contractaccount.com',
        BusinessSystem: '0OLOAS1',
    });

    setTestDestination({
        name: 'no-business-system',
        url: 'https://S4H-soap-contractaccount.com',
        BusinessSystem: '',
    });

    it('Business system is retrieved successfully', async () => {
        const soapClient = new SoapClient();
        const businessSystem = await soapClient.init(
            wsdl,
            destName,
            destinationAuth
        );
        expect(businessSystem).toBe(businessSystem);
    });

    it('Business system could not be retrieved', async () => {
        try {
            const soapClient = new SoapClient();
            const businessSystem = await soapClient.init(
                wsdl,
                destNameWithoutBusinessSystem,
                destinationAuth
            );
        } catch (error) {
            {
                expect(error.toString()).toBe(
                    `[BillingAccountService][S4BusinessSystemNotRetrieved]: ${businessSystemError}`
                );
            }
        }
    });

    it('Should update Billing Account', async () => {
        const soapClient = new SoapClient();
        await soapClient.init(wsdl, destName, destinationAuth);
        const { billingAccount, resStatus } =
            await soapClient.upsertBillingAccount(argsUpdate);
        expect(billingAccount).toBe(s4BAUpdateResponse);
        expect(resStatus).toBe(successStatus);
    });

    it('should create Billing Account', async () => {
        const soapClient = new SoapClient();
        await soapClient.init(wsdl, destName, destinationAuth);
        const { billingAccount, status } =
            await soapClient.upsertBillingAccount(argsCreate);
        expect(billingAccount).toBe(s4BACreateResponse);
        expect(status).toBe(successStatus);
    });
});
