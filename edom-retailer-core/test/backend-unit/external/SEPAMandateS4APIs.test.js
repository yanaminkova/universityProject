const cds = require('@sap/cds');
const expect = require('expect');
const logger = require('cf-nodejs-logging-support');
const { setTestDestination } = require('@sap-cloud-sdk/test-util');

const cloudSDK = require('@sap-cloud-sdk/core');

const { TextBundle } = require('@sap/textbundle');

const sepaError = require('../../../srv/beta/lib/SEPAMandateErrorMessages');
const i18nPath = '../../../_i18n/i18n';

const {
    sepaCreatePayload,
    createPayload,
    jwt,
    destinationAuth,
    destination,
    responseS4,
} = require('../../backend-it/payload/SEPAMandateMockResponse');

const SEPAMandateS4APIs = require('../../../srv/beta/external/SEPAMandateS4APIs');

jest.mock('../../../srv/lib/cloudSDKHelper/executeHttpRequest');

const ExecuteHTTPRequest = require('../../../srv/lib/cloudSDKHelper/executeHttpRequest');
const { text } = require('express');

jest.mock('@sap-cloud-sdk/core');

const { executeHttpRequest } = require('@sap-cloud-sdk/core');

const swiftCode = 'HYVEDEMM237';
const receivingCountryInput = 'DE';
const responseC4Uf = sepaCreatePayload;
const bankCountry = 'DE';
const bankInternalId = '23030000';
const companyCode = '1010';
const filter = "(Creditor='DE51ZZZ12345678901',SEPAMandate='000000000111')";
const readSEPAS4 = { SEPAMandate: '000000000011' };

const req = {
    user: 'test',
    headers: {
        authorization:
            'Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYzR1Y29uc3VtZXJkZXZhd3MuYXV0aGVudGljYXRpb24uZXUxMC5oYW5hLm9uZGVtYW5kLmNvbS90b2tlbl9rZXlzIiwia2lkIjoiZGVmYXVsdC1qd3Qta2V5LS0xMjIyODY3NDM4IiwidHlwIjoiSldUIn0.eyJqdGkiOiJhNTJkOWFjZTU0OTM0MTE3OTYyNjliNzljN2FmZmVhZiIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI3ZGQ3ZWViZi0wNGZlLTQ4ODYtYmJiMC1iOGI1YzIyNzZmMWIiLCJ6ZG4iOiJjNHVjb25zdW1lcmRldmF3cyIsInNlcnZpY2VpbnN0YW5jZWlkIjoiZDc0NjljNjMtYWQ0YS00YzIyLTlhYjAtMTU1NDYxZjU0YTViIn0sInN1YiI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImF1dGhvcml0aWVzIjpbImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQVBJLlJlYWQiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLm10ZGVwbG95bWVudCIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQWRtaW4iLCJ1YWEucmVzb3VyY2UiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLmpvYmNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5lbWNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5NYXN0ZXJEYXRhLlN5bmMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5EZWxldGUiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5Xcml0ZSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuRGF0YVJldGVudGlvbk1hbmFnZXJVc2VyIl0sInNjb3BlIjpbImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQVBJLlJlYWQiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLm10ZGVwbG95bWVudCIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQWRtaW4iLCJ1YWEucmVzb3VyY2UiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLmpvYmNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5lbWNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5NYXN0ZXJEYXRhLlN5bmMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5EZWxldGUiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5Xcml0ZSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuRGF0YVJldGVudGlvbk1hbmFnZXJVc2VyIl0sImNsaWVudF9pZCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImNpZCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImF6cCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiZWQ1MzJmZDgiLCJpYXQiOjE2NDYwMDg2MTcsImV4cCI6MTY0NjA1MTgxNywiaXNzIjoiaHR0cHM6Ly9jNHVjb25zdW1lcmRldmF3cy5hdXRoZW50aWNhdGlvbi5ldTEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiN2RkN2VlYmYtMDRmZS00ODg2LWJiYjAtYjhiNWMyMjc2ZjFiIiwiYXVkIjpbInNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuTWFzdGVyRGF0YSIsInVhYSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSSJdfQ.HEfe7_WdqFNwW2yNLS008VSUIUYuLuIUKTI9poVqJaILBRkzTAZvJTSN7l_pxq_-VN3NLBQ6cCvyXMLTeXxfhMIL2diEyR1f961Rweuh-sCrzdbIR-UfsZBVJy9lio9117qWQAghyhqWSuVeLB6DxdXdRTk7ZSbu0daN1J8xJYDqty7UftF1c92jGR8CzGwgLnyL75p8NnnOjZBwmfBXeo1gpanRQgMllW3Tb68XS_URhQJi0MSdhr5pdZP9hL08wpS-59f4xHGnGvVh48gkgPmezOUIC4S6a4VRkMpyb6ddGO4Ww5y7oljMhrM1UjfL3XS1MELZvvaMr6P3g_j3gg',
    },
    data: sepaCreatePayload,
    error: () => {
        return '';
    },
    params: [
        { sepaMandate: { mandateId: '000000000011', companyCode: '1010' } },
    ],
};

const spyLoggerError = jest.spyOn(logger, 'error');
const dummyError = 'dummy error';

describe('external SEPAMandateS4APIs unit test UTILITIESCLOUDSOLUTION-3047', () => {
    beforeEach(() => {
        spyLoggerError.mockReset();
    });
    setTestDestination({
        name: 'S4HC_SEPA_MANDATE',
        url: 'https://test.com/sap/opu/odata/sap/SEPA',
        username: 'testuser',
        password: 'test',
    });
    it('should retrieve bankSwiftCode from S4 bank account API - UTILITIESCLOUDSOLUTION-3047', async () => {
        const mockTxRunBank = jest
            .fn()
            .mockResolvedValue({ SWIFTCode: 'HYVEDEMM237' });
        const mockTxBank = jest.fn().mockReturnValue({
            run: mockTxRunBank,
        });
        const mockCdsConnectTo = jest
            .fn()
            .mockResolvedValue({ tx: mockTxBank });
        cds.connect.to = mockCdsConnectTo;
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const bankSwiftCode = await new SEPAMandateS4APIs().getbankInformation(
            req,
            bankCountry,
            bankInternalId
        );
        expect(bankSwiftCode).toBe(swiftCode);
    });

    it('should retrieve receiver country from S4 company Code API - UTILITIESCLOUDSOLUTION-3047', async () => {
        const mockTxRunCompanyCode = jest
            .fn()
            .mockResolvedValue({ Country: 'DE' });
        const mockTxCompanyCode = jest.fn().mockReturnValue({
            run: mockTxRunCompanyCode,
        });
        const mockCdsConnectToCompanyCode = jest
            .fn()
            .mockResolvedValue({ tx: mockTxCompanyCode });
        cds.connect.to = mockCdsConnectToCompanyCode;
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const recieverCountry =
            await new SEPAMandateS4APIs().readCompanyCodeAPI(req, companyCode);
        expect(recieverCountry).toBe(receivingCountryInput);
    });

    it('should create SEPA Mandate using  S4 SEPA Mandate API - UTILITIESCLOUDSOLUTION-3047', async () => {
        const mockTxRunSepaMandate = jest
            .fn()
            .mockResolvedValue(sepaCreatePayload);
        const mockTxSepaMandate = jest.fn().mockReturnValue({
            run: mockTxRunSepaMandate,
        });
        const mockCdsConnectToSepaMandate = jest.fn().mockResolvedValue({
            tx: mockTxSepaMandate,
            destination: 'S4HC_SEPA_MANDATE',
            jwt: 'eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYzR1Y29uc3VtZXJkZXZhd3MuYXV0aGVudGljYXRpb24uZXUxMC5oYW5hLm9uZGVtYW5kLmNvbS90b2tlbl9rZXlzIiwia2lkIjoiZGVmYXVsdC1qd3Qta2V5LS0xMjIyODY3NDM4IiwidHlwIjoiSldUIn0.eyJqdGkiOiJhNTJkOWFjZTU0OTM0MTE3OTYyNjliNzljN2FmZmVhZiIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI3ZGQ3ZWViZi0wNGZlLTQ4ODYtYmJiMC1iOGI1YzIyNzZmMWIiLCJ6ZG4iOiJjNHVjb25zdW1lcmRldmF3cyIsInNlcnZpY2VpbnN0YW5jZWlkIjoiZDc0NjljNjMtYWQ0YS00YzIyLTlhYjAtMTU1NDYxZjU0YTViIn0sInN1YiI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImF1dGhvcml0aWVzIjpbImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQVBJLlJlYWQiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLm10ZGVwbG95bWVudCIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQWRtaW4iLCJ1YWEucmVzb3VyY2UiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLmpvYmNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5lbWNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5NYXN0ZXJEYXRhLlN5bmMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5EZWxldGUiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5Xcml0ZSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuRGF0YVJldGVudGlvbk1hbmFnZXJVc2VyIl0sInNjb3BlIjpbImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQVBJLlJlYWQiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLm10ZGVwbG95bWVudCIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQWRtaW4iLCJ1YWEucmVzb3VyY2UiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLmpvYmNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5lbWNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5NYXN0ZXJEYXRhLlN5bmMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5EZWxldGUiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5Xcml0ZSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuRGF0YVJldGVudGlvbk1hbmFnZXJVc2VyIl0sImNsaWVudF9pZCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImNpZCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImF6cCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiZWQ1MzJmZDgiLCJpYXQiOjE2NDYwMDg2MTcsImV4cCI6MTY0NjA1MTgxNywiaXNzIjoiaHR0cHM6Ly9jNHVjb25zdW1lcmRldmF3cy5hdXRoZW50aWNhdGlvbi5ldTEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiN2RkN2VlYmYtMDRmZS00ODg2LWJiYjAtYjhiNWMyMjc2ZjFiIiwiYXVkIjpbInNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuTWFzdGVyRGF0YSIsInVhYSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSSJdfQ.HEfe7_WdqFNwW2yNLS008VSUIUYuLuIUKTI9poVqJaILBRkzTAZvJTSN7l_pxq_-VN3NLBQ6cCvyXMLTeXxfhMIL2diEyR1f961Rweuh-sCrzdbIR-UfsZBVJy9lio9117qWQAghyhqWSuVeLB6DxdXdRTk7ZSbu0daN1J8xJYDqty7UftF1c92jGR8CzGwgLnyL75p8NnnOjZBwmfBXeo1gpanRQgMllW3Tb68XS_URhQJi0MSdhr5pdZP9hL08wpS-59f4xHGnGvVh48gkgPmezOUIC4S6a4VRkMpyb6ddGO4Ww5y7oljMhrM1UjfL3XS1MELZvvaMr6P3g_j3gg',
        });
        cds.connect.to = mockCdsConnectToSepaMandate;
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        ExecuteHTTPRequest.post.mockImplementation(
            async (url, reqConfig, options) => {
                return {
                    data: { d: { SEPAMandate: '000000000011' } },
                };
            }
        );
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const expectedResponseC4Uf =
            await new SEPAMandateS4APIs().createSEPAMandateInS4(
                req,
                createPayload,
                destination
            );
        expect(expectedResponseC4Uf).toBe(responseC4Uf);
    });

    it('should read SEPA Mandate using  S4 SEPA Mandate API - UTILITIESCLOUDSOLUTION-3047', async () => {
        const mockTxRunSepaMandate = jest
            .fn()
            .mockResolvedValue(sepaCreatePayload);
        const mockTxSepaMandate = jest.fn().mockReturnValue({
            run: mockTxRunSepaMandate,
        });
        const mockCdsConnectToSepaMandate = jest.fn().mockResolvedValue({
            tx: mockTxSepaMandate,
            destination: 'S4HC_SEPA_MANDATE',
            jwt: 'eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYzR1Y29uc3VtZXJkZXZhd3MuYXV0aGVudGljYXRpb24uZXUxMC5oYW5hLm9uZGVtYW5kLmNvbS90b2tlbl9rZXlzIiwia2lkIjoiZGVmYXVsdC1qd3Qta2V5LS0xMjIyODY3NDM4IiwidHlwIjoiSldUIn0.eyJqdGkiOiJhNTJkOWFjZTU0OTM0MTE3OTYyNjliNzljN2FmZmVhZiIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI3ZGQ3ZWViZi0wNGZlLTQ4ODYtYmJiMC1iOGI1YzIyNzZmMWIiLCJ6ZG4iOiJjNHVjb25zdW1lcmRldmF3cyIsInNlcnZpY2VpbnN0YW5jZWlkIjoiZDc0NjljNjMtYWQ0YS00YzIyLTlhYjAtMTU1NDYxZjU0YTViIn0sInN1YiI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImF1dGhvcml0aWVzIjpbImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQVBJLlJlYWQiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLm10ZGVwbG95bWVudCIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQWRtaW4iLCJ1YWEucmVzb3VyY2UiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLmpvYmNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5lbWNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5NYXN0ZXJEYXRhLlN5bmMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5EZWxldGUiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5Xcml0ZSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuRGF0YVJldGVudGlvbk1hbmFnZXJVc2VyIl0sInNjb3BlIjpbImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQVBJLlJlYWQiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLm10ZGVwbG95bWVudCIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQWRtaW4iLCJ1YWEucmVzb3VyY2UiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLmpvYmNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5lbWNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5NYXN0ZXJEYXRhLlN5bmMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5EZWxldGUiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5Xcml0ZSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuRGF0YVJldGVudGlvbk1hbmFnZXJVc2VyIl0sImNsaWVudF9pZCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImNpZCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImF6cCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiZWQ1MzJmZDgiLCJpYXQiOjE2NDYwMDg2MTcsImV4cCI6MTY0NjA1MTgxNywiaXNzIjoiaHR0cHM6Ly9jNHVjb25zdW1lcmRldmF3cy5hdXRoZW50aWNhdGlvbi5ldTEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiN2RkN2VlYmYtMDRmZS00ODg2LWJiYjAtYjhiNWMyMjc2ZjFiIiwiYXVkIjpbInNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuTWFzdGVyRGF0YSIsInVhYSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSSJdfQ.HEfe7_WdqFNwW2yNLS008VSUIUYuLuIUKTI9poVqJaILBRkzTAZvJTSN7l_pxq_-VN3NLBQ6cCvyXMLTeXxfhMIL2diEyR1f961Rweuh-sCrzdbIR-UfsZBVJy9lio9117qWQAghyhqWSuVeLB6DxdXdRTk7ZSbu0daN1J8xJYDqty7UftF1c92jGR8CzGwgLnyL75p8NnnOjZBwmfBXeo1gpanRQgMllW3Tb68XS_URhQJi0MSdhr5pdZP9hL08wpS-59f4xHGnGvVh48gkgPmezOUIC4S6a4VRkMpyb6ddGO4Ww5y7oljMhrM1UjfL3XS1MELZvvaMr6P3g_j3gg',
        });
        cds.connect.to = mockCdsConnectToSepaMandate;
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        ExecuteHTTPRequest.get.mockImplementation(
            async (url, reqConfig, options) => {
                return {
                    data: { d: { SEPAMandate: '000000000011' } },
                };
            }
        );
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        const expectedResponse =
            await new SEPAMandateS4APIs().readSEPAMandateS4(
                req,
                filter,
                destination
            );
        expect(expectedResponse).toStrictEqual(readSEPAS4);
    });

    it('should capture error while reading SEPA Mandate using  S4 SEPA Mandate API - UTILITIESCLOUDSOLUTION-3047', async () => {
        try {
            const mockTxRunSepaMandate = jest
                .fn()
                .mockResolvedValue(sepaCreatePayload);
            const mockTxSepaMandate = jest.fn().mockReturnValue({
                run: mockTxRunSepaMandate,
            });
            const mockCdsConnectToSepaMandate = jest.fn().mockResolvedValue({
                tx: mockTxSepaMandate,
                destination: 'S4HC_SEPA_MANDATE',
            });
            cds.connect.to = mockCdsConnectToSepaMandate;
            const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
                return true;
            });
            ExecuteHTTPRequest.get.mockImplementation(
                async (url, reqConfig, options) => {
                    return { status: '400', data: { error: '' } };
                }
            );
            const featureFlag = await cds.connect.to('featureFlags');
            featureFlag.evaluate = mockFeatureFlagEvaluate;
            const expectedResponse =
                await new SEPAMandateS4APIs().readSEPAMandateS4(
                    req,
                    filter,
                    destination
                );
        } catch (error) {
            expect(error.message).toBeUndefined();
        }
    });

    it('should return error if failed to get bankSwiftCode from S4 bank account API - UTILITIESCLOUDSOLUTION-3047', async () => {
        try {
            const mockCdsConnectTo = jest
                .fn()
                .mockRejectedValueOnce(dummyError);
            cds.connect.to = mockCdsConnectTo;
            const bankSwiftCode =
                await new SEPAMandateS4APIs().getbankInformation();
            expect(bankSwiftCode).toBeFalsy();

            expect(spyLoggerError).toBeCalledTimes(1);
            expect(spyLoggerError).toBeCalledWith(
                `[API_BANKDETAIL_SRV] Error fetching bank information: ${dummyError}'`
            );
        } catch (error) {
            expect(error.message).toContain(
                'Error fetching bank information: dummy error'
            );
        }
    });

    it('should return error if failed to get receiver country from S4 company Code API - UTILITIESCLOUDSOLUTION-3047', async () => {
        try {
            const mockCdsConnectToCompanyCode = jest
                .fn()
                .mockRejectedValueOnce(dummyError);
            cds.connect.to = mockCdsConnectToCompanyCode;
            const recieverCountry =
                await new SEPAMandateS4APIs().readCompanyCodeAPI(
                    req,
                    companyCode
                );
            expect(recieverCountry).toBeFalsy();

            expect(spyLoggerError).toBeCalledTimes(1);
            expect(spyLoggerError).toBeCalledWith(
                `[SEPAMandateService] Error fetching receiver country from companyCode: ${dummyError}'`
            );
        } catch (error) {
            expect(error.message).toContain(
                'Error fetching receiver country from companyCode: dummy error'
            );
        }
    });

    it('should retrieve destination for SEPA Mandate- UTILITIESCLOUDSOLUTION-3047', async () => {
        const bundle = new TextBundle(i18nPath, ' ');
        const errorSepa = sepaError()(bundle);
        try {
            const mockTxRunDestination = jest
                .fn()
                .mockResolvedValue({ destination: destination });
            const mockTxDestination = jest.fn().mockReturnValue({
                run: mockTxRunDestination,
            });
            const mockCdsConnectToDestination = jest.fn().mockResolvedValue({
                tx: mockTxDestination,
                destination: 'S4HC_SEPA_MANDATE',
                jwt: 'eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYzR1Y29uc3VtZXJkZXZhd3MuYXV0aGVudGljYXRpb24uZXUxMC5oYW5hLm9uZGVtYW5kLmNvbS90b2tlbl9rZXlzIiwia2lkIjoiZGVmYXVsdC1qd3Qta2V5LS0xMjIyODY3NDM4IiwidHlwIjoiSldUIn0.eyJqdGkiOiJhNTJkOWFjZTU0OTM0MTE3OTYyNjliNzljN2FmZmVhZiIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI3ZGQ3ZWViZi0wNGZlLTQ4ODYtYmJiMC1iOGI1YzIyNzZmMWIiLCJ6ZG4iOiJjNHVjb25zdW1lcmRldmF3cyIsInNlcnZpY2VpbnN0YW5jZWlkIjoiZDc0NjljNjMtYWQ0YS00YzIyLTlhYjAtMTU1NDYxZjU0YTViIn0sInN1YiI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImF1dGhvcml0aWVzIjpbImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQVBJLlJlYWQiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLm10ZGVwbG95bWVudCIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQWRtaW4iLCJ1YWEucmVzb3VyY2UiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLmpvYmNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5lbWNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5NYXN0ZXJEYXRhLlN5bmMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5EZWxldGUiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5Xcml0ZSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuRGF0YVJldGVudGlvbk1hbmFnZXJVc2VyIl0sInNjb3BlIjpbImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQVBJLlJlYWQiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLm10ZGVwbG95bWVudCIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQWRtaW4iLCJ1YWEucmVzb3VyY2UiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLmpvYmNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5lbWNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5NYXN0ZXJEYXRhLlN5bmMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5EZWxldGUiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5Xcml0ZSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuRGF0YVJldGVudGlvbk1hbmFnZXJVc2VyIl0sImNsaWVudF9pZCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImNpZCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImF6cCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiZWQ1MzJmZDgiLCJpYXQiOjE2NDYwMDg2MTcsImV4cCI6MTY0NjA1MTgxNywiaXNzIjoiaHR0cHM6Ly9jNHVjb25zdW1lcmRldmF3cy5hdXRoZW50aWNhdGlvbi5ldTEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiN2RkN2VlYmYtMDRmZS00ODg2LWJiYjAtYjhiNWMyMjc2ZjFiIiwiYXVkIjpbInNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuTWFzdGVyRGF0YSIsInVhYSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSSJdfQ.HEfe7_WdqFNwW2yNLS008VSUIUYuLuIUKTI9poVqJaILBRkzTAZvJTSN7l_pxq_-VN3NLBQ6cCvyXMLTeXxfhMIL2diEyR1f961Rweuh-sCrzdbIR-UfsZBVJy9lio9117qWQAghyhqWSuVeLB6DxdXdRTk7ZSbu0daN1J8xJYDqty7UftF1c92jGR8CzGwgLnyL75p8NnnOjZBwmfBXeo1gpanRQgMllW3Tb68XS_URhQJi0MSdhr5pdZP9hL08wpS-59f4xHGnGvVh48gkgPmezOUIC4S6a4VRkMpyb6ddGO4Ww5y7oljMhrM1UjfL3XS1MELZvvaMr6P3g_j3gg',
                error: errorSepa,
            });
            cds.connect.to = mockCdsConnectToDestination;
            const dest = await new SEPAMandateS4APIs().getdestination(
                req,
                errorSepa
            );
        } catch (error) {
            expect(error.toString()).toContain(
                `Error: ${errorSepa.SEPAMandateSRVBusinessSystemNotFound.code} - ${errorSepa.SEPAMandateSRVBusinessSystemNotFound.message}`
            );
        }
    });

    it('should update SEPA Mandate using  S4 SEPA Mandate API - UTILITIESCLOUDSOLUTION-3047', async () => {
        const mockTxRunSepaMandate = jest
            .fn()
            .mockResolvedValue(sepaCreatePayload);
        const mockTxSepaMandate = jest.fn().mockReturnValue({
            run: mockTxRunSepaMandate,
        });
        const mockCdsConnectToSepaMandate = jest.fn().mockResolvedValue({
            tx: mockTxSepaMandate,
            destination: 'S4HC_SEPA_MANDATE',
            jwt: 'eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYzR1Y29uc3VtZXJkZXZhd3MuYXV0aGVudGljYXRpb24uZXUxMC5oYW5hLm9uZGVtYW5kLmNvbS90b2tlbl9rZXlzIiwia2lkIjoiZGVmYXVsdC1qd3Qta2V5LS0xMjIyODY3NDM4IiwidHlwIjoiSldUIn0.eyJqdGkiOiJhNTJkOWFjZTU0OTM0MTE3OTYyNjliNzljN2FmZmVhZiIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI3ZGQ3ZWViZi0wNGZlLTQ4ODYtYmJiMC1iOGI1YzIyNzZmMWIiLCJ6ZG4iOiJjNHVjb25zdW1lcmRldmF3cyIsInNlcnZpY2VpbnN0YW5jZWlkIjoiZDc0NjljNjMtYWQ0YS00YzIyLTlhYjAtMTU1NDYxZjU0YTViIn0sInN1YiI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImF1dGhvcml0aWVzIjpbImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQVBJLlJlYWQiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLm10ZGVwbG95bWVudCIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQWRtaW4iLCJ1YWEucmVzb3VyY2UiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLmpvYmNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5lbWNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5NYXN0ZXJEYXRhLlN5bmMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5EZWxldGUiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5Xcml0ZSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuRGF0YVJldGVudGlvbk1hbmFnZXJVc2VyIl0sInNjb3BlIjpbImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQVBJLlJlYWQiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLm10ZGVwbG95bWVudCIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuQWRtaW4iLCJ1YWEucmVzb3VyY2UiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLmpvYmNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5lbWNhbGxiYWNrIiwiYzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5My5NYXN0ZXJEYXRhLlN5bmMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5EZWxldGUiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSS5Xcml0ZSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuRGF0YVJldGVudGlvbk1hbmFnZXJVc2VyIl0sImNsaWVudF9pZCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImNpZCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImF6cCI6InNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiZWQ1MzJmZDgiLCJpYXQiOjE2NDYwMDg2MTcsImV4cCI6MTY0NjA1MTgxNywiaXNzIjoiaHR0cHM6Ly9jNHVjb25zdW1lcmRldmF3cy5hdXRoZW50aWNhdGlvbi5ldTEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiN2RkN2VlYmYtMDRmZS00ODg2LWJiYjAtYjhiNWMyMjc2ZjFiIiwiYXVkIjpbInNiLWM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiODUyODF8YzR1LWZvdW5kYXRpb24tcmV0YWlsZXItZGV2IWI1NzA5MyIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMuTWFzdGVyRGF0YSIsInVhYSIsImM0dS1mb3VuZGF0aW9uLXJldGFpbGVyLWRldiFiNTcwOTMiLCJjNHUtZm91bmRhdGlvbi1yZXRhaWxlci1kZXYhYjU3MDkzLkFQSSJdfQ.HEfe7_WdqFNwW2yNLS008VSUIUYuLuIUKTI9poVqJaILBRkzTAZvJTSN7l_pxq_-VN3NLBQ6cCvyXMLTeXxfhMIL2diEyR1f961Rweuh-sCrzdbIR-UfsZBVJy9lio9117qWQAghyhqWSuVeLB6DxdXdRTk7ZSbu0daN1J8xJYDqty7UftF1c92jGR8CzGwgLnyL75p8NnnOjZBwmfBXeo1gpanRQgMllW3Tb68XS_URhQJi0MSdhr5pdZP9hL08wpS-59f4xHGnGvVh48gkgPmezOUIC4S6a4VRkMpyb6ddGO4Ww5y7oljMhrM1UjfL3XS1MELZvvaMr6P3g_j3gg',
        });
        cds.connect.to = mockCdsConnectToSepaMandate;
        const mockFeatureFlagEvaluate = jest.fn().mockImplementation(() => {
            return true;
        });
        const featureFlag = await cds.connect.to('featureFlags');
        featureFlag.evaluate = mockFeatureFlagEvaluate;
        executeHttpRequest.mockImplementation(
            async (url, reqConfig, options) => {
                return undefined;
            }
        );
        const expectedResponse =
            await new SEPAMandateS4APIs().updateSEPAMandateS4(
                req,
                filter,
                destination
            );
        expect(expectedResponse).toBeUndefined();
    });
});
