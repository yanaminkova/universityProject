# EDoM Retailer Service Broker

For more information on Service Broker Framework refer [link](https://github.wdf.sap.corp/xs2/node-sbf).
The service broker enables access to EDoM Retailer APIs. Currently it provides two services with a default plan for each:

- EDoM Retailer BETA ODATA v4 API Access
- EDoM Dev BETA ODATA v4 API Access

## Prerequisite

Audit logging: ``cf create-service auditlog standard c4u-cn-edom-retailer-auditlog``

## Setup

1. ``mbt build -p=cf``
2. ``cf deploy .\mta_archives\c4u-cn-edom-retailer-broker_1.0.0.mtar``

## Setup routes to services

```
cf map-route c4u-cn-edom-retailer-srv-dev cfapps.sap.hana.ondemand.com -n edom-retailer-dev-service
```

> NOTE: For the other BETA service we cannot setup a custom route as it might point to a blue or green service.