type bitsTransferStatus {
    billsTotal: Integer;
    billsSentForTransfer: Integer;
    billsNotSentForTransfer: Integer;
}

type bitsTransferErrorItems {
    billNumber : String(10);
    errorMessage : String(500);
}

type bitsTransferResponse {
    status : bitsTransferStatus;
    billsTransferErrors : many bitsTransferErrorItems;
}

type contrAcctgProviderContractData {
    BusinessPartner: String;
    CAProviderContract: String;
    CAProviderContractExtReference: String;
    CAProviderContractSender: String;
    CAProviderContractStatus: String;
}

type contrAcctgProviderContract {
  specversion: String;
  type: String;
  source: String;
  subject: String;
  id: String;
  time: String;
  datacontenttype: String;
  data: contrAcctgProviderContractData; 
}

service BillableItemsService @(
    path: '/api/billing/v1/billableItems',
    protocol : 'odata',
    requires : 'authenticated-user',
    version: 'v1'
) {
     @(restrict : [
        {
            grant : ['WRITE'],
            to    : ['API.Write','Admin','jobcallback']
        },
        {
            grant : ['READ'],
            to    : ['API.Read','Admin','jobcallback']
        }
    ])
    action transfer() returns bitsTransferResponse;

    @(restrict : [
        {
            grant : ['WRITE'],
            to    : ['API.Write','Admin','jobcallback']
        },
        {
            grant : ['READ'],
            to    : ['API.Read','Admin','jobcallback']
        }
    ])
    action forecastsTransfer(CAProviderContract : String);
};