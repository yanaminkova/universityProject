# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version [x.xx.x] - (yyyy.mm.dd)
### Added:
- [#2878](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2878) AuditLog logic to handle errors and log security messages for authentication/authorization failures
- [#27](https://github.wdf.sap.corp/c4u/orchs/issues/27) Added Utilities Sales Contract distribution.
### Changed:
- [#448](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/423) Analyze performance for db based referential integrity for BP and BA
- [#413](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/413) Update Job Scheduler postman collection
- [#2878](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2878) Implemented monitoring health check via express
- [#456](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/456) Used axios to call MDI Log for Business Partner
- [#442](https://github.wdf.sap.corp/c4u/edom-Canada/issues/442) Error handling for SEPA mandate and IBAN masking
### Fixed:
- [#554](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/554) Fix commodity conditionType logic
### Removed:

## Version [1.51.1] - Hotfix(2022.03.18)
- [#597](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/597) Correction to Monthly Commodity collection
- [#598](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/598) Skip Commodity Yearly Collection

## Version [1.51.0] - (2022.03.18)
### Added:
- [#511](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/511) Automated Commodity Yearly Collection
- [#561](https://github.wdf.sap.corp/c4u/orchs/issues/561) Added correction for BITs transfer consumption.
- [#17](https://github.wdf.sap.corp/c4u/orchs/issues/17) Added periodical forecast BITs creation.
- [#529](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/529) Adding new service BPKeyMappingBeta and updating the input and output parameters.
- [#3334](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3334) Added subsequent document link in customer order ui
- [#423](https://github.wdf.sap.corp/c4u/edom-Canada/issues/423) Compound API with BA nad SEPA model

### Changed:
- [#574](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/574) Update billing process field mapping in BITS transfer
- [#422](https://github.wdf.sap.corp/c4u/edom-Canada/issues/422) Add DPP for model changes for Billing Account
- [#380](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/380) IT test to check CAP fix on create BP salesArrangement functions 
- [#492](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/492) Generic Destination in BTP for all S4 Communication
- [#3496](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3496) Fiori Guidlines fixes: changed Net Amount ((€) to (EUR) and Processing statuses to capitalized
### Fixed:
- [#3201](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3201) Add Postman environment file for production
- [#423](https://github.wdf.sap.corp/c4u/edom-Canada/issues/423) Compound API SonarQube issues
### Removed:

## Version [1.50.1] - (2022.03.15)
### Added:
- Connectivity service binding
- [#454](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/454) Added getEnabledFeatureFlagSet to fetch featureFlags in batch for BP requests
- [#477](https://github.wdf.sap.corp/c4u/edom-Canada/issues/477) Billing Account: Review and Remove obsolete Feature-Flags for 1.6 Release
- [#395](https://github.wdf.sap.corp/c4u/edom-Canada/issues/395) Extended Billing Account Model with SEPA mandate ID
### Changed:
- [#431](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/431) BP EventMesh emit 'updated' in POST/DELETE subentities 
- [#543](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/543) Updated logic to subtract 1 second for end date in BITS transfer; Also fixed a bug in usage meter reads mapping
- [#379](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/379) IT test to check CAP fix on read/update BP salesArrangement & functions
- [562](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/562) Changed Feature Flag error message for commodity subscription.
- [#3201](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3201) Add Newman tests to release repo and update them with every autoPR on Promote stage
- [#420](https://github.wdf.sap.corp/c4u/edom-Canada/issues/420) SEPA mandate signature date logic added 

### Fixed:
### Removed:
- [#395](https://github.wdf.sap.corp/c4u/edom-Canada/issues/395) Added mapping logic and IT after BA model extension with SEPA Mandate Id

## Version [1.50.0] - (2022.03.10)
### Added:
- [#510](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/510) Added postman collection for monthly pcs commodity subscription
- [#3321](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3321) Added backend-unit test to avoid duplicate keys in i18n files
- [#420](https://github.wdf.sap.corp/c4u/edom-Canada/issues/420) SEPA Mandate Service changes for PATCH and PUT operation and backend UT tests
### Changed:
- [#531](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/531) Changed billingSubProcess value mapping for commodity bill tranfer when bill subscription is expired
- [#HotfixOnPR](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/3428) Reversed changes done on BITSCommodityHelper.js from PR #3428
- [#420](https://github.wdf.sap.corp/c4u/edom-Canada/issues/420) SEPA Mandate model -added structured key and fixed critical sonarqube issue
- [#420](https://github.wdf.sap.corp/c4u/edom-Canada/issues/420) SEPA Mandate model Critical sonarqube issue fixed
- [#33][#33](https://github.wdf.sap.corp/c4u/orchs/issues/33) 
- [#3352](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3352) Changed weight of processing status 'In termination'

## Version [1.49.5] - Hotfix (2022.03.09)
- [#545](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/545) Resolved issue for BITs Transfer service hangs in STAGE. 

## Version [1.49.4] - Hotfix (2022.03.08)
- [#3396](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3442) Update @sap/approuter version for fixing Whitesource issues

## Version [1.49.3] - Hotfix (2022.03.03)
- [#547](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/547) Add destination entries in Package.json to test commodity extension fields.
- [#33](https://github.wdf.sap.corp/c4u/orchs/issues/33) Add Feature Flag for Customer Order to Subscription Billing Extension Fields. 

## Version [1.49.2] - (2022.03.02)
### Fixed:
- [#3396](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3396) Fixed Provider Contract Messaging being created in staging.

## Version [1.49.1] - (2022.03.01)
### Added:
- [#530](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/530) Add error handling for getCommodityData function in BITSCommodityHelper
- [#514](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/514) Add Featureflag for commodity BITS Transfer Process
### Changed:
- [#3372](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/3372) Set SAPUI5 version to 1.98.0
- [#11](https://github.wdf.sap.corp/c4u/orchs/issues/11) Updated error messages.

## Version [1.49.0] - (2022.03.01)
### Added:
- [#362](https://github.wdf.sap.corp/c4u/edom-Canada/issues/362) OnDemandRead for SEPA Mandate
- [#513](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/3356) Adding feature flag for Commodity Subscription
### Changed:
- [#536](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/536) Product Change and removal of extra collections 
- [#535](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/535) Update missing TEW texts
- [#443](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/440) Move 1.5 features from beta to v1
- [#440](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/440) Generalize destination for BP & Products
- [#439](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/439) Business Partner deletion messages
- [#497](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/497) Use imported convertDateTime function to fix code smell
- [#443](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/443) Move custom annotations to v1
### Fixed:
- [#362](https://github.wdf.sap.corp/c4u/edom-Canada/issues/362) OnDemandRead for SEPA Mandate- Sonarqube fix
- [#514](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/514) Fixed Integration Test for BITS
- [#3170](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3170) Add the release version to autoPR title and fixes stash in pipeline

## Version [1.48.8] - Hotfix (2022.02.25)
- [#534](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/534) Skip Distribution collection in Main #534

## Version [1.48.7] - Hotfix (2022.02.24)
- [#3170](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3170) Fix release autoPR configuration failing due to an error in closeAllOpenedPRs function

## Version [1.48.6] - (2022.02.24)
### Added:
- [#515](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/515) Changing the BITs Confirmation Featureflag to Dynamic
### Changed:
- [#3291](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3291) Adopted sap.odm.product model from @sap/odm package, cleaned up further imports.
- [#497](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/497) code smell fix for BillableItemTime
### Fixed:
- [#3291](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3291) linkage between the MDI product replication tests and the corresponding Jira issue
- [#3170](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3170) Adjust release autoPR configuration to automatically close Pull Requests

## Version [1.48.5] - (2022.02.22)
### Fixed:
- [#3106](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3106) - Customer Order header status is not being recalculated according to Subscription Product Items
- [#493](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/493) Fix Subscription helper & TMD error handling characters

## Version [1.48.4] - (2022.02.21)
### Added:
- [#434](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/434) isDefault field in emailAddress and phoneNumbers of Business Partner
- [#2884](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2884) Added i18n translations to MDI product replication error messages.
- [#381](https://github.wdf.sap.corp/c4u/edom-Canada/issues/381) Added feature flag for batch FF's
- [#405](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/405) test scenario in BP scenario postman collection for blocked BP
### Changed:
- [#438](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/438) _getDataSubjectsWithoutGivenLegalGround to use unique arrays in querying BP displayId and guid
### Fixed:
- [#2884](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2884) The length of displayId of MDIErrorTable has been increased to 40 characters
- [#507](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/507) BP Address data with Person Postal Code
- [#508](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/508) BITS Monthly Transfer Fix
- [#3253](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3253) CO overall status recalculation not triggered and status not updated

## Version [1.48.3] - (2022.02.19)
### Changed:
- [#407](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/407) Integration Test for external API
- [#2884](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2884) Changed the text of the error message generated by MDI product replication.
### Fixed:
- [#443](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/443) Test Commodity BITS with PCS integration

## Version [1.48.2] - (2012.02.18)
### Added:
- [#2884](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/2884) Added i18n translations to MDI product replication error messages.
- [#501](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/501) Change Url for BITs Transfer, Update supplier address with Org postal code, Rename Postman Collection so as to be picked by pipeline and include Commodity Collection into pipeline.
- [#449](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/449) TEW translation update for Distribution and BITs service .
### Changed:
- [#494](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/494) Added more details and failure reasons to BillableItemsService response, as well as calling Manage Failed Attempts API in SB for failing transfer bills to update with failed reasons.
- [#361](https://github.wdf.sap.corp/c4u/edom-Canada/issues/361) Sonar Qube issue fixed for SEPA Mandate Wrapper
- [#3170](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3170) Adjust release autoPR configuration to remove git force pushing and keep the history of commits

## Version [1.48.1] - (2022.02.16)
### Changed:
- [#442](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/442) Read the Supplier Address Postal Code details
- [#495](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/495) Utilities Extension: changes to fetch Grid
- [#500](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/500) DSO and MO Bp DisplayID mapping
- [#3154](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3154) Reworked UI testsuite with sap.fe.Test library
- [#381](https://github.wdf.sap.corp/c4u/edom-Canada/issues/381) Reduced calls to Feature Flag function in BA - BA performance improvement
### Fixed:
- [#3103](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3103) Fixed UI mockserver configuration
- [#3238](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3238) Fixed JSON.stringify() typo in ConfigurationService.js

## Version [1.48.0] - (2022.02.15)
### Added:
- [#10](https://github.wdf.sap.corp/c4u/orchs/issues/10) Forecast Bit Creation
- [#432](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/432) Business Partner delete restriction error messages in i18n properties file
### Changed:
- [#409](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/409) Business Partner get expanded BP function to support other queries
- [#432](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/432) Business Partner delete restriction error messages
- [#361](https://github.wdf.sap.corp/c4u/edom-Canada/issues/363) Added logic to skip persistence of data
- [#2884](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2884) Added details to response about errors occurred after execution of MDI product replication request.
- [#2705](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2705) Migration script for CompanyCode entity and service handlers to ensure mapping of "name"
- [#386](https://github.wdf.sap.corp/c4u/edom-Canada/issues/386) Business Partner KeyMapping refactor 
- [#2917](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2917) Tagged Postman collections to run in a separate pipeline
- [#2705](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2705) Updated @sap/odm to ODM 3.0.0 version and aligned models
- [#2519](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2519) Release Commodity Subscription Fields
### Fixed:
- [#2705](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2705) Failing create requests for CompanyCode configuration data

## Version [1.47.2] - Hotfix (2022.02.10)
### Fixed:
- [#490](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/490) - Passing time vaue in CAbillableItemTime in BIT transfer.
- [#475](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/475) - Passing MarketFunctionCodeNumber1 for Meter operator and DSO Code.  
- [#484](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/484) - Updated fix for TMD postman collection.

## Version [1.47.1] - Hotfix (2022.02.09)
### Changed:
- Disabled karma tests on pipeline

## Version [1.47.0] - (2022.02.08)
### Added:
- [#422](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/422) - Method to get BP ID by Market Function code
- [#3005](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3005) Exposed CustomerOrderItemUtilitiesSubsequentDocument and CustomerOrderItemUtilitiesSubsequentDocumentCodes entities in the UI service
- [#3005](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3005) UI tests for Subsequent Document Type Text
- [#415](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/415) - Added Utilities Extension fields
- [#459](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/459) - Changes in TMD service to adapt new mcm creation process release 1.4
- [#438](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/438) - Modify Technical Master Data service to accept custom service start date
- [#301](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/301) Audit log for deletion of BP sub entities
### Changed:
- [#410](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/410) Removed unsafe local variables in BP service and removed manual commits/rollbacks on managed transactions
### Fixed:
- [#416](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/416) Removed building of new request for sending pending BPs
- [#3005](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3005) Fixed UI test teardown mechanism
- [#410](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/410) Error thrown by improper deconstruction of a BP helper function
- [#2960](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2960) Memory leak / transactions issue of MDI Product replication
- [#363](https://github.wdf.sap.corp/c4u/edom-Canada/issues/363) SEPA mandate model modfied
- [#3106](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3106) Customer Order header status is not being recalculated according to Subscription Product Items
### Removed:
- [#3005](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3005) Unused sample UI test
- [#45](https://github.wdf.sap.corp/c4u/edom-retailer-extension-sample/issues/45) Skipped MDIClientInbound/MDIClientInboundBeta tests 

## Version [1.46.0] - (2022.02.04)
### Added:
- [6](https://github.wdf.sap.corp/c4u/orchs/issues/6) Mapping of additional fields to Subscription Billing API
- [#454](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/454) - change env variables and wait time
- [#481](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/481) - Skip SD Collection
- [#363](https://github.wdf.sap.corp/c4u/edom-Canada/issues/363) - New Model and Service definition for SEPA Mandate 
### Changed:
- [#3042](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3042) remove deployment to staging for main pipeline
- [4](https://github.wdf.sap.corp/c4u/orchs/issues/4) Mapping of additional fields to Subscription Billing API

## Version [1.45.1] - Hotfix (2022.01.27)
### Fixed:
- [#406](https://github.wdf.sap.corp/c4u/edom-Canada/issues/406) fix in BP keymapping and corresponding calls to BP keymapping from SB
- [#2960](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2960) Memory leak / transactions issue of MDI Product replication

## Version [1.45.0] - (2022.01.27)
### Added:
- [#424](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/424) - Mark valid from and valid to of a customer order in c4uf as personal data
- [#400](https://github.wdf.sap.corp/c4u/edom-Canada/issues/400) Bug in Business Partner Key mapping Service
- [#2981](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2981) Added check for SB notification tags to ConfigurationService
- [#3088](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3088) Few more logs and checks for upgradeTenants
### Changed:
- [#462](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/462) Moved BillableItemsCreateConfirmationService from beta to v1; Also updated BillableItemsService api path
- [#439](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/439) Moved BillableItemsService from beta to v1 api for general release
- [#406](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/406) remove static feature flag and add dynamic as well as internationalize errors for Job Scheduler Service
- [#265](https://github.wdf.sap.corp/c4u/edom-Canada/issues/265) Extensibility of Billing Account: CREATE custom field from C4Uf to S4, Add 'Ext' in the method name
- [#3072](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/3072) use node:14.18.1-stretch docker image for PR Voting stage
- [#367](https://github.wdf.sap.corp/c4u/edom-Canada/issues/367) - Changes for release 1.4 for BA - beta to v1
### Fixed:
- [#463](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/463) bug fix for sales order API
- [#414](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/414) bug fix for sendPendingBps function
- [#2960](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2960) Fixed MDI Destination implementation of products replication
- [#2981](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2981) Expiration notification tag takes precedence over SB status

## Version [1.44.4] - Hotfix (2022.01.26)
- [#415](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/415) PendingBP Bug fix

## Version [1.44.3] - (2022.01.21)
### Changed:
- [#406](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/406) remove static feature flag and add dynamic as well as internationalize errors for Job Scheduler Service
### Fixed:
- [#431](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/431) - Fix for Distribute Physical Order which takes indefinite amount of time due to deadlock
- [#399](https://github.wdf.sap.corp/c4u/edom-Canada/issues/399) - readonly annotation removed from BA displayId, updated aspect name from 'CorrespondenceAspect' to 'CorrespondenceToOtherPartners' in BA model
- [#3038](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2923) Fixed failing UI services postman collection by adjusting pool
- [377](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/377) Sonarqube fix for event mesh development
- [#405](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/405) the where clause logic for null displayIds in blockEntity of BusinessPartnerDataSubject.js
- [#2981](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2981) Ajusted ConfigurationService logic for Subscription Billing event 'expirationNotification' without SB status
- [#372](https://github.wdf.sap.corp/c4u/edom-Canada/issues/372)Avoid triggering extraneous Update event from withing OnDemandRead if the BA Creation originated from C4Uf

## Version [1.44.2] - (2022.01.19)
### Fixed:
- [#2986](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2986) Whitesource alert resolution

## Version [1.44.1] - (2022.01.18)
### Added:
- [#445](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/445) - Fix for Physical Order Service  Model
- [#450](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/436) - Changes to get MCM Instance using POD ID
- [#450](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/450) - fix for Postman collection Non Commodity Recurring & Usage
- [#423](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/423) - Postman collection for Non Commodity Recurring & Usage
- [#377](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/377) Publishing Business Partner events to SAP Event Mesh from C4Uf
- [#372](https://github.wdf.sap.corp/c4u/edom-Canada/issues/372) - New service BillingAccountServiceInternal to consume Contract Account events from S/4HC
### Changed:
- [#407](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/407) Test effect of assert_integrity : app for BP performance
- [#335](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/335) Mapping utilities extension fields from customer order to Subscription
- [#372](https://github.wdf.sap.corp/c4u/edom-Canada/issues/372) - Contract Account events from S/4HC will not be consumed within existing BillingAccountService
### Fixed:
- [#2960](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2960) Improved handling of high load MDI products
- [#2960](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2960) Fixed manual transaction implementation in MDI products implementation
- [#2923](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2923) Fixed MDI log processing for Product delta load
- [#392](https://github.wdf.sap.corp/c4u/edom-Canada/issues/392) Fixed BP Key Mapping issue

## Version [1.44.0] - (2022.01.13)
### Added: 
- [#441](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/441) adapt_utilities_extension_fields_4demo
- [#414](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/414) Skip postman for Distribution
- [#335](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/335) Mapping utilities extension fields from customer order to Subscriptionattribute
### Fixed:
- [#2961](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2961) MDIDestination definition inside of [production] profile

## Version [1.43.9] - (2022.01.08)
### Added:
- [#330](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/330) Integration Test for SalesOrderAPI to increase test coverage.
- [#347](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/347) Sending localIds by querying DB
- [#359](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/359) Adding Job Scheduler postman collection
- [313](https://github.wdf.sap.corp/c4u/edom-Canada/issues/313) Event Mesh issue while triggering events from S4 to C4Uf
### Changed:
- [#404](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/404) Add CLoudSDK wrapper for jobScheduler
- [#392](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/392) Bug Fix for job scheduler
- [#382](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/382) getDataSubjectsWithoutGivenLegalGround to handle empty guids and displayIds
### Fixed:
- [#2924](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2924) MDI product text unique constraint
### Removed:

## Version [1.43.8] - Hotfix (2022.01.07)
### Fixed:
- [#2943](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2943) Whitesourse glob parent issue

## Version [1.43.7] - Hotfix (2022.01.06)
### Fixed:
- [#2908](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2908) Not able to execute the C4Uf_Distribution collection in Test

## Version [1.43.6] - (2022.01.04)
### Added:
- [#406](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/406) Additional Integration test for SB external API
- [#358](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/358) added isBlocked to SalesArrangements and TaxClassifications in BP Beta
- [#373](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/373) POST localIds after BP creation from inbound MDI call
- [#368](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/368) Job Scheduler Enhancements
- [#373](https://github.wdf.sap.corp/c4u/edom-Canada/issues/373) - Service Logic Implementation as per new BA model(addition of 3 new fields)
- [#372](https://github.wdf.sap.corp/c4u/edom-Canada/issues/372) - Publish Billing Account events to SAP Event Mesh from C4Uf
### Changed:
- [#432](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/432) Few changes in Commodity BITs creation Payload
- [#421](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/421) Refactoring of OrderFulfillmentHelper class
- [#2831](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2831) Refactoring of executeHTTPRequest class
- [#277](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/277) Business Partner's and Billing Account's field extension limits to 10
- [#378](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/378) Updated getting last MDI delta token to support both BP and PR tokens
- [#277](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/277) Business Partner's and Billing Account's field extension
- [#376](https://github.wdf.sap.corp/c4u/edom-Canada/issues/376) DPP aspects of BA model changes to support Alternate Dunning Recipient, Alternate Correspondence Recipient
- [#2885](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/2885) customer order api sb fields enhancement
### Fixed:
- [#2919](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2919) ProductTypeCode SBPD request URI in postman now matches the body
- [#2922](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2922) MDI Product replication Bad Request
### Removed:

## Version [1.43.5] - Hotfix (2021.12.23)
### Changed:
- [#2899](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2899) Update package-lock.json and node-version to 14.18.1 in .xmake.cfg

## Version [1.43.4] - (2021.12.22)
### Changed:
- [#2866](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2866) Move outdated branches check to the Jenkinsfile to abort the build before Init step
### Fixed:
- [#426](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/426) - Adjust distribution logic to handle null values
- [#427](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/427) Fixed BITS confirmation service throwing nodejs error with failure confirmation message received issue

## Version [1.43.3] - (2021.12.21)
### Added:
- [#423](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/423) - Skip distribution postman collection
- [#306](https://github.wdf.sap.corp/c4u/edom-Canada/issues/306) - Update Package.json with the extensibility configuration for Business Partner and Billing, add Billing Account prefix : 'YY1_'
- [#2536](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2536) - Delta Load of Physical Products from MDI
### Changed:
- [#2809](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2809) Create and check sample Customer Orders during data loss prevention steps
### Fixed:
- [#410](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/410) Fixed BITS service hanging issue when BDS destination is not maintained; Optimiased logging messages in BITS service too.
- [#2830](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2830) - Fixed issue: removed product type in the payloads of Customer Orders creation requests

## Version [1.43.2] - (2021.12.16)
### Added:
- [#350](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/350) Added basic text node mapping for commodity BITS
- [#306](https://github.wdf.sap.corp/c4u/edom-Canada/issues/306) - Update Package.json with the extensibility configuration for Business Partner and Billing Account
### Changed:
- [#2831](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2831)  @sap-cloud-sdk/core executeHttpRequest method is now called via srv\lib\cloudSDKHelper\executeHTTPRequest.js wrapper to prevent multiple falsy fortify messages

## Version [1.43.1] - (2021.12.15)
### Added:
- [#306](https://github.wdf.sap.corp/c4u/edom-Canada/issues/306) - Update Package.json with the extensibility configuration for Business Partner and Billing Account
### Changed:
- [#2830](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2830) - Temporarily skipped failing SB Event tests

## Version [1.43.0] - (2021.12.14)
### Added:
- [#393](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/393) - Added TEW text translation for Billable Items (BITs)
- [#394](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/394) Termination of non commodity subscription using overwrite subscription terms flag
- [#349](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/349-Meter-Read-Mapping) Added meter read mapping for commodity BITS
- [#2535](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2535) Initial Load of Physical Products from MDI
- [#346](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/346) Send BP UUID in localIds section when POSTing BP from C4UF
- [#348](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/348) - Commodity BITS Creation: Logic for bits creation & mapping of basicCreate & price nodes in commodity payload
### Changed:
- [#359](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/359) Jobscheduler redesign with http methods and improvements
### Fixed:
- [#412](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/412) Fixed BITS transfer destionation not maintained under AWS TEST lanscape and changed BITS confirmation static FF to true in AWS TEST
- [#2593](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2593) - Test linkage to original JIRA task
- [#2415](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2415) Use separate postman collection for data loss prevention step

## Version [1.42.1] - Hotfix (2021.12.08)
### Fixed:
- [#362](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/362) Fix the MDI Error Messages 

## Version [1.42.0] - (2021.12.09)
### Added:
- [#353](https://github.wdf.sap.corp/c4u/edom-Canada/issues/353) Billing Account model and Template changes to support Interest key
- [#357](https://github.wdf.sap.corp/c4u/edom-Canada/issues/357) Alternate Dunning Recipient, Alternate Correspondence Recipient added in Billing Account Model
- [#2415](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2415) Added new pipeline steps to run tests before and after app deployment 

## Version [1.41.4] - Hotfix (2021.12.16)
### Added:
### Changed:
### Fixed:
- [#362](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/362) Fix the MDI Error Messages
### Removed:

## Version [1.41.3] - (2021.12.08)
### Added:
- [#323](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/323) BP Deletion restrictions
- [#2715](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2715) Set End of Business Date when Customer Order processing status is terminated and rejected
### Fixed:
- [#328](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/328) Added random base number for market function code to fix newman tests
- [#2543](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2543) Added script for pull-request voting stage to only build PR if it's up to date with develop

## Version [1.41.2] - (2021.12.06)
### Changed:
- [#350](https://github.wdf.sap.corp/c4u/edom-Canada/issues/350) - Fixed issues and improved coverage in Key Mapping Unit Test 
- [239](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/239) Pass technical resources to non commodity subscriptions
- [#2723](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/2723) Update BITS error handling and BITS confirmation successful logging
### Fixed:
- [#2716](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2716) Load local UI env same way as on cloud

## Version [1.41.1] - (2021.12.03)
### Added:
- [#333](https://github.wdf.sap.corp/c4u/edom-Canada/issues/333) - TEW changes for default language blank instead of EN, So local IT Test will refer to i18n.properties file
### Changed:
- [#2527](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2527) element-prefix for mtx now allows only ext__
- Updated urls in openAPI script
### Fixed:
- [#399](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/399) Code smell fix in Distribution service
- [#2756](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2756) FlexibleColumnLayout splitter is at the top of viewport
### Removed:
- [#353](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/353) remove jobscheduler from release into beta

## Version [1.41.0] - (2021.12.02)
### Added:
- [#2613](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2613) Added integration test to check for missing i18n entries in UI's annotations
- [#350](https://github.wdf.sap.corp/c4u/edom-Canada/issues/350) - Enhanced business partner key mapping external service to make it work with new MDO
- [#348](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/348) - Commodity BITS Creation: Mapping for Price nodding in Commodity
### Changed:
- [#2672](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2672) Release technical resource fields
- [#395](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/395) Refactor messages in TEW i18n file
- [#352](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/352) Change Default displayIdStatus
- [#2540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2540) Removed Multitenancy Administrator role collection from dev.mtaext & added mtdeployment scope
- Added package rule to renovate.json
### Fixed:
- [#2702](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2702) Added whitesourceExecuteScan to Security stage 

## Version [1.40.3] - (2021.11.30)
### Added:
- [#381](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/381) Text Classification for Distribution and TMD Service using TEW (Translation)
- [#299](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/299) isBlocked = false filters for Business Partner and Billing Account
- [#338](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/338) Non PCS based commodity BITS :Do not transfer BITS that do not have condition type postman collection
- [#2593](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2593) - Implement additional status for termination 
- [#350](https://github.wdf.sap.corp/c4u/edom-Canada/issues/350) - Enhanced business partner key mapping external service to make it work with new MDO
### Changed:
- [#385](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/385) Updated operation in WSDl of BITS confirmation to match S4
- [#2587](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2587) UI test runner configuration - Karma now runs on same port as mockserver
### Fixed:
- [#330](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/330) disable updating displayid from MDI read
- [#2587](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2587) UI aggregation column width spans entire table

## Version [1.40.2] - Hotfix (2021.11.29)
### Fixed: 
- [#392](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/392) Fix for TMD beta to V1 and change action name to Generate

## Version [1.40.1] - Hotfix (2021.11.26)
### Fixed: 
- [#354](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/386) Fix for TMD beta to V1

## Version [1.40.0] - (2021.11.26)
### Added:
- [#2614](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2614) Remove devDependencies in Whitesource report
- [#367](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/367) - TMD beta to V1
- [#316](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/316) - push Request to MDI for BP subentity deletion
- [#2639](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2639) Added useGoStep as false for cloud foundry deployment 
- [#354](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/354) Moving BillableItems Service to beta from alpha
- [#333](https://github.wdf.sap.corp/c4u/edom-Canada/issues/333) - TEW changes for BP and BA, message updated
- [#2593](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2593) - Implement additional status for termination 
### Changed:
- [#286](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/286) - Mapping for confirmation from xml payload and SB successor url calls and skipping the distribution collection from Develop
- [#353](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/353) Updated error logging for BITS creation to indicate failed Bill IDs
- [#336](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/336) Updated approuter setting for BITS confirmation service to disable csrf protection
- [#317](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/317) Business Partner - replaced request URL parsing to usage of request query object
- [#318](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/318) Skipped test to be commented instead of skipped and updated jira traceability for bp beta postman collection
- [#327](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/327) Remove feature Flag for Web Development
- [#2663](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2663) Added role template specific to development to dev.mtaext
### Fixed:
- [#378](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/378) - Pipeline fix for BP key-mapping issue
- [#332](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/332) Construction of BP object on subentity requests for validations
- [#2663](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2663) Added scope reference to dev.mtaext
### Removed:
- [#325](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/325) Feature flag on Business Partner and MDIClient enhancements
- [#2625](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2554) Removed non-translatable i18n from translation_v2.json
- [#2540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2540) Removed Multitenancy Administrator role collection & added to dev environment only
- [#2593](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2593) Fixed Postman SB collection after successful cancellation of subscription, set ProcessingStatus of CustomerOrder to 09

## Version [1.39.3] - (2021.11.17)
### Added:
- [#342](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/342) Changes for Filtering out Commodity Bill if charge has Usage and no meter read,Add CustomerId to Params for BITS service
- [#347](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/347) Adapt test Environment file for MCM and C4E
### Fixed:
- [#2554](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2554) - BITS Confirmation Service bug

## Version [1.39.2] - (2021.11.16)
### Fixed:
- [#363](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/363) Updated Env variables in the payload
- [#363](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/363) Hotfix for Distribution postman collection, changes for BP & BA

## Version [1.39.1] - (2021.11.15)
### Removed:
- [#2540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2540) Removed mtcallback scope present under authorities in mta.yaml

## Version [1.39.0] - (2021.11.15)
### Changed:
- [#2438](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2438) - Rename new non-commodity fields
### Fixed:
- [#337](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/337) Potential fix for BITS confirmation hanging issue upon requests
- [#335](https://github.wdf.sap.corp/c4u/edom-Canada/issues/335) New code list 'PaymentMethodCodes' and logic for BA to substitute hardcoded value validation for bankAccountId based on incoming/outgoing paymentMethod
### Removed:
- [#2540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2540) Removedtcallback scope present under authorities in mta.yaml

## Version [1.38.1] - (2021.11.10)
### Added:
- [#286](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/286) Added successor documents calls for BITS Creation Confirmation
- [#320](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/320) Terminate Non-Commodity subscription: added cancellation codes
- [#294](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/294) Pipeline fix for SonarQube code smell
- [#294](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/294) Mapping changes for obis code and SLP name
- [#312](https://github.wdf.sap.corp/c4u/edom-Canada/issues/312) Unit Test for Soap Client External Service

## Version [1.38.0] - (2021.11.09)
### Added:
- [#287](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/287) Added Job Scheduler test collection
- [#2286](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2286) Evaluate CDS DB Constraints Feature
- [#334](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/334) Add Static Feature Flag restriction for BITS confiramtion
- [#2438](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2438) Non-commodity subscription field to indicate resource type/id
- [#2425](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2425) Recalculation of processing status on Customer Order creation
- [#304](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/304) Storing of S4 Local ID as C4Uf BP displayId
### Changed:
- [#337](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/337) Updated app.listen function logic to use soap service as call back for BITS confirmation service
- [#337](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/337) Restored approuter config for BITS confirmation service to investigate its issue
- [#337](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/337) Removed approuter config for BITS confirmation service to investigate its issue
- [#283](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/283) Update BP validation logic to align with CAP behavior
- [#291](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/291) Updated approuter config for BITS confirmation service
- [#638](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/638) Added tags for i18n labels, divided i18n into separate files, TEW integration
### Fixed:
- [#311](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/311) BP SonarQube issues
- [#2541](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2541) Remove custom arguments from cf bg-deploy command for dev pipeline fix
- [#2438](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2438) Postman tests checking non-commodity subscription fields that indicate resource type/id
## Version [1.37.6] - (2021.11.01)
 - Add technicalMasterDataMessaging to edom-retailer-test in package.json
 
## Version [1.37.5] - (2021.11.01)
### Added:
- [#291](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/291) Added jwt authentication for BITS comfirnmation service
- [#219](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/219) Logic to get Commodity data for commodity BITS creation
- [#323](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/323) Terminate Non-Commodity subscription: update subsequent document ID after successful termination
- [#308](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/308) Price for PCS Commodity BITs creation
### Changed:
- [#219](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/219) Allow deletion at SubEntity Level for BP. Fixed sonarqube issues.
- [#245](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/245) Annotate BP type to be a mandatory field. Restrict the updating of BP type. Sonarqube Fix
- [#278](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/278) changed logs for job schedule and changed request format
- Increase timeout in postman tests for subscription billing due to failing tests on pipeline
### Fixed:
- [#311](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/311) BP SonarQube issues 
### Removed:
- [#312](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/312) DummyBusinessPartnerDataSubject and BusinessPartnerDataSubject under beta flag

## Version [1.37.4] - Hotfix (2021.11.01)
- Memory Increase for upgrade tenants

## Version [1.37.3] - (2021.10.29)
### Fixed:
- [#2381](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2381) Fixed the linkage between automated tests and Jira issue UTILITIESCLOUDSOLUTION-2995

## Version [1.37.2] - Hotfix: Modified MDIClient connection to BP beta service (2021.10.27)
### Fixed:
- [#309](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/309) Modified handling of BP beta service connection on MDIClient 

## Version [1.37.1] - Hotfix (2021.10.27)
Token retrieval path fixed in Postman collection of distribution tests

## Version [1.37.0] - (2021.10.27)
### Added:

- [#318](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/318)  Refactor Integration Test for Distribution Service
- [#327](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/327) Moving TMD service from Alpha to Beta
- [#75](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/75) Dynamic feature flag for BP enhancements
- [#278](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/278) Created Job Scheduler Wrapper + added logs
- [#2381](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2381) Setting of end of business date when close/termination event is received
### Changed:
- [#75](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/75) Granular BP validation
- [#1540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1540) Updated file pattern for UI tests to ensure upload to Cumulus
- [#300](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/300) Annotate displayId as readonly
- Cache for feature flags is now working for the unavailable services
- [#2234](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2234) Enable Auto Scaler
### Fixed:
- [#2381](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2381) Data Retention Manager postman tests
- [#307](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/307) SP Postman collection
- [#308](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/309) BP Failing Cumulus tests

## Version [1.36.0] - (2021.10.25)
### Added:
- [#324](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/324) Traceability &EM fix for TMD
- [#319](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/319) Traceability for Distribution,TMD & BITs
- [#324](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/324) Pipeline fix for BP replication failure
- [#268](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/268) Added BITS confirmation SOAP service
- [#321](https://github.wdf.sap.corp/c4u/edom-Canada/issues/321) Logic changes to handle sub entity updates in audit log for Billing Account
- [#297](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/297) Logic changes to handle sub entity updates in audit log
- [#284](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/284) Business Partner v2 beta files
- [#306](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/306) Accept UUID in BP Key Mapping
- [#311](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/311) Stabilize Distribution postman collection by adding retry mechanism and conditional chaining changes
- [#1540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1540) Added karma-junit-reporter and configured karma-ci.conf.js to create a test report
- [#2234](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2234) Enable Auto Scaler
### Changed:
- [#1540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1540) Updated karma pipeline stage and changed karma-ci.conf.js to use WebDriver
### Fixed:
- [#274](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/274) getDataSubjectsWithoutGivenLegalGround's dataSubjectId check
- [#2378](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2378) Add sapCumulusUpload step into extension for Acceptance stage

## Version [1.35.2] - (2021.10.18)
### Added:
- [#301](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/301) Added subscription termination flow
- [#2278](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2278) Integrated karma and configured start script
- [#2278](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2278) Integrated fe-mockserver and configured start script
- [#2278](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2278) Added metadata and mockdata for fe-mockserver
- [#2278](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2278) Added initial UI tests with gherkin
- [#1540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1540) Added script for executing UI tests on pipeline and updated pipeline stage
- [244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) BA Postman collection modified to include BP read request from s4hc and handle pipeline failures due to s4 dependencies
- [#315](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/315-Traceability-integration-for-BA) Traceability integration for BillingAccount and Business Partner automated tests - Postman
- [#315](https://github.wdf.sap.corp/c4u/edom-Canada/issues/315) Additional traceability integration for BusinessPartnerDataSubject.test.js
### Changed:
- [#274](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/274) dataSubjectsEndofResidence to support orphan BPs
- [#2278](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2278) Renamed launchpad from index.html to fiori.html
- [#2329](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2329) Changed all country labels to country/region to comply to GLOB-192
### Fixed:
- [#274](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/274) getDataSubjectsWithoutGivenLegalGround return array format
- [#260](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/260) dataSubjectEndofBusiness response for status 204
- [244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) BA Postman collection fixed for  BP read request from s4hc 
- [244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) BA Postman collection fixed for  BP read request from s4hc - redoing as changes were overwritten

## Version [1.35.1] - (2021.10.13)
### Added:
- [#2152](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2152) Added mtcallback configuration to mta.yaml file
- [#2306](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/308-API_BP_KEY_MAPPING-tests) Backend unit test for API_BP_KEY_MAPPING external service call's
### Changed:
- [#2133](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2133) API Business Hub documentation by modifying the descriptions of customer order business partner attributes
- [#2318](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2318) Subscription Billing postman collection updated to avoid pipeline failures when default subscription profile is changed 

## Version [1.35.0] - (2021.10.08)
### Changed:
- [#2133](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2133) Definition of businessPartner of CustomerOrder to Association to BusinessPartner entity
- [#244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) BA & Distribution postman collection updated to add delay of 50 secs between BP and BA requests to avoid pipeline failures due to BP replication delay in S4HC

## Version [1.38.1] - (2021.11.10)
### Added:
- [#320](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/320) Terminate Non-Commodity subscription: added cancellation codes
- [#294](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/294) Pipeline fix for SonarQube code smell
- [#294](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/294) Mapping changes for obis code and SLP name

## Version [1.38.0] - (2021.11.09)
### Added:
- [#287](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/287) Added Job Scheduler test collection
- [#2286](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2286) Evaluate CDS DB Constraints Feature
- [#334](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/334) Add Static Feature Flag restriction for BITS confiramtion
- [#2438](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2438) Non-commodity subscription field to indicate resource type/id
- [#2425](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2425) Recalculation of processing status on Customer Order creation
### Changed:
- [#337](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/337) Updated app.listen function logic to use soap service as call back for BITS confirmation service
- [#337](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/337) Restored approuter config for BITS confirmation service to investigate its issue
- [#337](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/337) Removed approuter config for BITS confirmation service to investigate its issue
- [#283](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/283) Update BP validation logic to align with CAP behavior
- [#291](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/291) Updated approuter config for BITS confirmation service
- [#638](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/638) Added tags for i18n labels, divided i18n into separate files, TEW integration
### Fixed:
- [#311](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/311) BP SonarQube issues
- [#2541](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2541) Remove custom arguments from cf bg-deploy command for dev pipeline fix
- [#2438](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2438) Postman tests checking non-commodity subscription fields that indicate resource type/id

## Version [1.37.6] - (2021.11.01)
 - Add technicalMasterDataMessaging to edom-retailer-test in package.json
 
## Version [1.37.5] - (2021.11.01)
### Added:
- [#291](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/291) Added jwt authentication for BITS comfirnmation service
- [#219](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/219) Logic to get Commodity data for commodity BITS creation
- [#323](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/323) Terminate Non-Commodity subscription: update subsequent document ID after successful termination
- [#308](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/308) Price for PCS Commodity BITs creation
### Changed:
- [#219](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/219) Allow deletion at SubEntity Level for BP. Fixed sonarqube issues.
- [#245](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/245) Annotate BP type to be a mandatory field. Restrict the updating of BP type. Sonarqube Fix
- [#278](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/278) changed logs for job schedule and changed request format
- Increase timeout in postman tests for subscription billing due to failing tests on pipeline
### Fixed:
- [#311](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/311) BP SonarQube issues 
### Removed:
- [#312](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/312) DummyBusinessPartnerDataSubject and BusinessPartnerDataSubject under beta flag

## Version [1.37.4] - Hotfix (2021.11.01)
- Memory Increase for upgrade tenants

## Version [1.37.3] - (2021.10.29)
### Fixed:
- [#2381](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2381) Fixed the linkage between automated tests and Jira issue UTILITIESCLOUDSOLUTION-2995

## Version [1.37.2] - Hotfix: Modified MDIClient connection to BP beta service (2021.10.27)
### Fixed:
- [#309](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/309) Modified handling of BP beta service connection on MDIClient 

## Version [1.37.1] - Hotfix (2021.10.27)
Token retrieval path fixed in Postman collection of distribution tests

## Version [1.37.0] - (2021.10.27)
### Added:

- [#318](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/318)  Refactor Integration Test for Distribution Service
- [#327](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/327) Moving TMD service from Alpha to Beta
- [#75](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/75) Dynamic feature flag for BP enhancements
- [#278](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/278) Created Job Scheduler Wrapper + added logs
- [#2381](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2381) Setting of end of business date when close/termination event is received
### Changed:
- [#75](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/75) Granular BP validation
- [#1540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1540) Updated file pattern for UI tests to ensure upload to Cumulus
- [#300](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/300) Annotate displayId as readonly
- Cache for feature flags is now working for the unavailable services
- [#2234](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2234) Enable Auto Scaler
### Fixed:
- [#2381](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2381) Data Retention Manager postman tests
- [#307](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/307) SP Postman collection
- [#308](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/309) BP Failing Cumulus tests

## Version [1.36.0] - (2021.10.25)
### Added:
- [#324](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/324) Traceability &EM fix for TMD
- [#319](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/319) Traceability for Distribution,TMD & BITs
- [#324](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/324) Pipeline fix for BP replication failure
- [#268](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/268) Added BITS confirmation SOAP service
- [#321](https://github.wdf.sap.corp/c4u/edom-Canada/issues/321) Logic changes to handle sub entity updates in audit log for Billing Account
- [#297](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/297) Logic changes to handle sub entity updates in audit log
- [#284](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/284) Business Partner v2 beta files
- [#306](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/306) Accept UUID in BP Key Mapping
- [#311](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/311) Stabilize Distribution postman collection by adding retry mechanism and conditional chaining changes
- [#1540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1540) Added karma-junit-reporter and configured karma-ci.conf.js to create a test report
- [#2234](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2234) Enable Auto Scaler
### Changed:
- [#1540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1540) Updated karma pipeline stage and changed karma-ci.conf.js to use WebDriver
### Fixed:
- [#274](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/274) getDataSubjectsWithoutGivenLegalGround's dataSubjectId check
- [#2378](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2378) Add sapCumulusUpload step into extension for Acceptance stage

## Version [1.35.2] - (2021.10.18)
### Added:
- [#301](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/301) Added subscription termination flow
- [#2278](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2278) Integrated karma and configured start script
- [#2278](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2278) Integrated fe-mockserver and configured start script
- [#2278](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2278) Added metadata and mockdata for fe-mockserver
- [#2278](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2278) Added initial UI tests with gherkin
- [#1540](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1540) Added script for executing UI tests on pipeline and updated pipeline stage
- [244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) BA Postman collection modified to include BP read request from s4hc and handle pipeline failures due to s4 dependencies
- [#315](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/315-Traceability-integration-for-BA) Traceability integration for BillingAccount and Business Partner automated tests - Postman
- [#315](https://github.wdf.sap.corp/c4u/edom-Canada/issues/315) Additional traceability integration for BusinessPartnerDataSubject.test.js
### Changed:
- [#274](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/274) dataSubjectsEndofResidence to support orphan BPs
- [#2278](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2278) Renamed launchpad from index.html to fiori.html
- [#2329](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2329) Changed all country labels to country/region to comply to GLOB-192
### Fixed:
- [#274](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/274) getDataSubjectsWithoutGivenLegalGround return array format
- [#260](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/260) dataSubjectEndofBusiness response for status 204
- [244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) BA Postman collection fixed for  BP read request from s4hc 
- [244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) BA Postman collection fixed for  BP read request from s4hc - redoing as changes were overwritten

## Version [1.35.1] - (2021.10.13)
### Added:
- [#2152](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2152) Added mtcallback configuration to mta.yaml file
- [#2306](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/308-API_BP_KEY_MAPPING-tests) Backend unit test for API_BP_KEY_MAPPING external service call's
### Changed:
- [#2133](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2133) API Business Hub documentation by modifying the descriptions of customer order business partner attributes
- [#2318](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2318) Subscription Billing postman collection updated to avoid pipeline failures when default subscription profile is changed 

## Version [1.35.0] - (2021.10.08)
### Changed:
- [#2133](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2133) Definition of businessPartner of CustomerOrder to Association to BusinessPartner entity
- [#244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) BA & Distribution postman collection updated to add delay of 50 secs between BP and BA requests to avoid pipeline failures due to BP replication delay in S4HC

## Version [1.34.2] - (2021.10.06)
### Added:
- [#2152](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2152) Added configuration to xs-app.json file
### Changed:
- [#1234](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1234) Don't Expose ClientId/Secrets in Postman for localhost environment
### Fixed:
- [#2217](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2217) Update config.yml with detect.policy.check to prevent main pipeline failing during BlackDuck scans

## Version [1.34.1] - (2021.10.01)
### Added:
- [#2273](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/303) BP Correction in postman collection
### Changed:
- [#2246](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2246) Updated cds-mtx to latest version 2.3.1 
- [#1167](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1167) Log level now ignores process.env.LOG_LEVEL, default fallback value is 'INFO'
### Fixed:
- [#302](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/302) Fix For the Postman Distribution Service Double Register
### Removed:
- [#1167](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1167) process.env.LOG_LEVEL variable

## Version [1.34.0] - (2021.09.30)
### Added:
- [#218](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/218) Get usage record for each bill during BITS creation
- [#277](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/277) MCM Postman Changes and Error Handling
- [#1234](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1234) Don't Expose ClientId/Secrets in Newman Environment
- [#1537](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1537) Add additional commodity subscription fields (beta)
- [#2153](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2153) Added ExtendCDSdelete scope
- [#1045](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1045) APIs input xss prevention
### Changed:
- [#1637](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1637) Updated i18n file with error messages and added i18n variables to services with custom error messages
- [1446](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1446) Updated Application Logging Service plan to standard
- [1446](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1446) Updated application logging service-name to c4u-foundation-retailer-app-logs
### Fixed:
- [#277](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/277) Error Fix for TMD Action
- [#1637](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1637) Fixed critical Sonarqube code smell for DRM
- [286](https://github.wdf.sap.corp/c4u/edom-Canada/issues/286) Fix added to accept deep PATCH for billing account

## Version [1.33.3] - (2021.09.27)
### Added:
- [#1167](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1167) kibana_formatter static feature flag
- [#1045 ](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1045) sanitizer of queries
- [#252](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/252) Added CountrySubDivisionCode request in BA postman collection
- [#253](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/253) Add BP and BA PDM Configurations in mta.yaml
### Changed:
- [#255](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/255) validation for unique market function code to unique market function code numbers
- server.js in regarding with the recent changes of the standard server.js
### Fixed:
- [#251](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/251) Error on request to remote service when sending pending BPs
- [#2174](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1806) Fixed CustomerOrderUI showing blocked orders
- [#286](https://github.wdf.sap.corp/c4u/edom-Canada/issues/286) Enabled setting initial/null values for Billing Account 
- [2153](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2153) ExtendCDSDelete Scope should be ExtendCDSdelete
- [244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) prefixes added in the BA logger messages for detailed logs
- [#2200]((https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2200) Fixed Data Retention Manager, in case of non-confirmed conditions of data subjects
- [244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) Bp keymapping service definition modified and logger info messages add for BA
- [244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) Removed BP Keymapping service definition from service.cds 
- [244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) Added logger.info to check the cds version running in pipeline
- [244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) Update package.json to accept cds version 5.4.6
### Removed:
- [#252](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/252) Remove CSV file for CountrySubdivisionCodes
- [#260](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/260) response body for status 204 of dataSubjectEndofBusiness

## Version [1.33.2] - (2021.09.21)
### Added:
- [#2085](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2085) Added linkage to Jira tickets for automated and Postman tests
### Changed:
- [#282](https://github.wdf.sap.corp/c4u/edom-Canada/issues/282) Bug fixes for Billing Account
### Fixed:
- [#1806](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1806) Fix DRM logic that handles displayId and GUID as data subject
- [#247](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/247) Update on BP with addressData coming from S4, fails in C4Uf

## Version [1.33.1] - hotfix (2021.09.17)
- [#282](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/hotfix/contractAccountMessaging) Added missing contractAccountMessaging for production

## Version [1.33.0] - (2021.09.17)
### Added:
- [#273](https://zenhub.wdf.sap.corp/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/273) 
Add chaining checks for Physical Order Items in Distribution service
- [#259](https://zenhub.wdf.sap.corp/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/259) Update Distribution CDS with restriction to Business scenario Update/PUT and delete
- [#129](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/129) Restrict Market function code to be assigned to more than 1 BP with SP
- [#1772](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1772) Added custom logic to limit creation of DataController
- [#167](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/167) unit tests for BP subentity helpers
- [#258](https://github.wdf.sap.corp/c4u/edom-Canada/issues/258) Move out from Beta to v1 for BillingAccount
- [#226](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/226) Move Business Partner from beta to v1
- [#132](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/132) copied all node module csv files
- [#283](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/238-expose-partner-aspect-in-BA) Expose BillingAccountPartner aspect in BA service
- [#258](https://github.wdf.sap.corp/c4u/edom-Canada/issues/258) Removed PDM annotation for some fields for BillingAccount
- [#243](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2131) Sonar cube issue
### Changed:
- [#224](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/224) BusinessPartnerDataSubject block entity method to block associated billing accounts
- [#229](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/229) version of CDS to 5.4.5 and integration tests to support upgrade
- [#246](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/275) Update package.json for distribution service
- [#246](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/246) Use status code "Alert" for failed and rejected events
- [#271](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/271) Fix Sonar Qube issues for BillableItemService
- [#237](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/237) type of MDI bookkeeping fields in db to enum and set character limits to String-typed BP/SP extended field
- [#139](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/139) MDIClient error messages to have more information
- [#1806](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1806) Data Retention Manager adjustments to handle both data subjects in guid and displayId formats
- [#262](https://github.wdf.sap.corp/c4u/edom-Canada/issues/262) Remove BP PDM Service from Beta
- [#273](https://github.wdf.sap.corp/c4u/edom-Canada/issues/273) Increased test coverage for Billing Account
### Fixed:
- [#239](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/239) MDIClient not properly sending pending BPs
- [#2131](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2131) Fixed Sonarqube major code smell
### Removed:
- [#229](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/229) BP customerInformation workaround
- [#227](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/227) Remove feature flags from BP and SP

## Version [1.32.2] - (2021.09.13)
### Added:
- [#244](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/244) GA changes and  manual test case changes for postman
- [#2085](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2085) Linking automated tests to Jira issues to improve traceability
- [#182](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/182-market-service-code) Updated market service code list 
### Changed:
- [#2095](https://github.wdf.sap.corp/c4u/edom-Canada/issues/279) Removed hardcoded BP.id from BillingAccount Postman collection for BA create tests
- [#277](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/277-axios-update) update axios library in 'gen/srv/package.json' as per Blackduck security scan

## Version [1.32.1] - (2021.09.10)
### Added:
- [#163](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/163) Postman changes, AC changes and business scenario changes
- [#1167](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1167) Log level on demand
- [#277](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/277-axios-update) update axios library as per Blackduck security scan
### Changed:
- [#233](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/233) Merge customer info call results to BITS creation end to end flow
- [#2053](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2053) Reduce number of builds kept by Jenkins
- Added `sonar.qualitygate.wait=true` to `sonar-project.properties`
### Fixed:
- [#245](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/245) Fix Sonar issues
- [#272](https://github.wdf.sap.corp/c4u/edom-Canada/issues/272) fix earlier BA LegalGround issue by adding BP as DataSubject of CustomerOrder LegalGround

## Version [1.32.0] - (2021.09.08)
### Added:
- [#2052](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/2052) Realign PDM and Auditlog with BillingAccount Remodeling
### Changed:
- [#202](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/202) MDI Client code cleanup
### Fixed:
- [#1806](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1806) Use GUID instead of displayID for DRM handling of CustomerOrder
- [#167](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/167) validation for POST operation on BP subentities
### Removed:
- [#2081](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/2081) Remove LegalGround Implementation for BA
- [#220](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/220) all references endOfBusinessDate of Business Partner in services. It remains in the db model.
- [#2067](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/2067) Removed PDM service for BA from MTAEX to check whether error is coming from there

## Version [1.31.0] - (2021.09.07)
### Added:
- [#204](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/204) Restructuring the API for Business Partner
- [#210](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/210) BP postman collection - Replicable to MDI BP Update, subentities update
- [#231](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/231) Update the Destination Property name
- [#222](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/222) get customer Market info for BITS
- [#192](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/192) Added Batch Request to MCM postman
- [#1981](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1981) Added a new Postman Collection with Complete Customer Order Samples (for API Business Hub and UI)Collection
### Changed:
- [#226](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/226) Merge BITS creation mapping with soap call
- [#210](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/210) script to store additional _keys field for BP stored keys
### Fixed:
- [#187](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/187) Creation of technical master data in C4E (MCM)
- [#2053](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/2053) reduce size of inode in Jenkins
- Refactored Select ONE queries

## Version [1.30.0] - (2021.09.02)
### Added:
- [#206](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/206) Added new role for MDI Client
- [#82](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/82) Added subscription system business partner lookup
- [#163](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/163) Added mapping for CA to sales order
- [#165](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/165) Added ability to retrieve fixed/default values from destination configuration properties for BillableItemsService
- [#259](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/261_BAModel_OnDemandRead) Service level changes due to BA model adn Template functionality restructure
- [#259](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/259-BA-newman-tests) Contains updated Postman collection and newman test as per BA model sync with CA-ODM
- [#167](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/167) validations for POST and PUT operations on BP subentities
- [#201](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/201) Trigger outbound operation when any operation occurs on sub-entities
### Changed:
- [#228](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/228) Change MeasurementTask name for TMD creation
- [#193](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/193) MCM Instance Event Issue-changed content type of webhook
- [#1967](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1967) Moved APP folder to Root Level
- [#1967](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1967) Moved CustomerOrderUIService.cds to ui-services folder
### Fixed:
- [#191](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/191) fixed the distribution Collection and added TMD action
- [#163](https://
- [#269](https://github.wdf.sap.corp/c4u/edom-Canada/issues/269) SonarQube major and critical issues fixed for BillingAccount Service and BillingAccountInternalService removed
- [#187](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/187) Error handling for TMD service to check if C4E is successfully created

## Version [1.29.3] - (2021.08.27)
### Changed:
- [#244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) BA postman collection update with hardcoded BP for pipeline fix
- [#244](https://github.wdf.sap.corp/c4u/edom-Canada/issues/244) Skipping BA newman tests as S4 is not stable which is leading to time out in BA creation
### Fixed:
- [#1954](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1954) NetAmount annotations on CustomerOrderItems page

## Version [1.29.2] - (2021.08.26)
### Added:
- [#196](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/196) Added SLP profile id mappings to TMD creation
### Removed:
- [#1954](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1954) Removed icon from portalsite config

## Version [1.29.1] - (2021.08.25)
### Added:
- [#1954](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1954) Added icon to app tile with custom bootstrap
- [#1954](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1954) Added currency next to Net Amount
- [#1966](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/1966) Finalized script which generates CustomerOrderServiceAPI documentation

### Changed:

## Version [1.29.0] - (2021.08.25)
### Added:
- [#151](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/151) Added Integration Tests for non-commodity BITS creation
- [#101](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/101) Added mapping for non-commodity BITS creation
### Changed:
- [#210](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/210) storage of keys in InstanceBookKeeping as string, script to use stored BP keys on outbound
- [#216](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/216)Remove sonar code smells
- [#156](hhttps://github.wdf.sap.corp/c4u/foundation-orchestration/issues/156) New Grouping logic to distribute Physical order items
- [#157](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/157) added new column Subscription Profile in Utilities Business Scenario View
- [#1565](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1565) API Business Hub sandbox defined, annotations adjusted
- [#239](https://github.wdf.sap.corp/c4u/edom-Canada/issues/239) BillingAccountService modifications  Phase 1 to align with latest BA model
### Fixed:
- [#1980](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1980) Fixed DRM configuration
- [#209](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/209) SonarQube critical issues
### Removed:

## Version [1.28.3] - (2021.08.23)
### Added:
- [#186](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/186) businessPartnerKeys in InstanceBookKeeping, script to store BP keys on inbound, script to use stored BP keys on outbound
### Changed:
- [#1951](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1951) parentItemId removed from the UI service and fix for FCL context added
### Fixed:
- [#186](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/186) HDI deployment error - businessPartnerKeys.customerInformation
- [#200](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/200) fix for Postman with MCM changes

## Version [1.28.2] - (2021.08.20)
### Fixed:  
- [#247](https://github.wdf.sap.corp/c4u/edom-Canada/issues/247) Uncomment postman script for Template creation

## Version [1.28.1] - (2021.08.20)
### Added:
- [#1846](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1846) Added Helmet for ui-services
- [#99](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/99)  Fetch S4BP for BITS
- [#1516](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1516) Added script to process openAPI files
### Changed:
- [#1951](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1951) Design Gate Requirement: Flexible Layout
### Fixed:
- [#193](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/193) MCM Instance Event Issue

## Version [1.28.0] - (2021.08.18)
### Added:
- [#191](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/191) MDIClient Error Handling
- [#247](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/247) Restructuring the API for BA, BP and SP
### Changed:
- [#248](https://github.wdf.sap.corp/c4u/edom-Canada/issues/248) added new aspect 'taxes' in Billing Account for GA release
- [#199](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/199) postBPToMDI tx parameter to 'req' so it goes to the right consumer subaccount
- [#246](https://github.wdf.sap.corp/c4u/edom-Canada/issues/246) ODM CodeList POC(avoid overwriting of delivered ODM codelist) testing
- [#122](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/122) added new restrictions for Job Scheduler for Billable Items service
- [#1539](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1539) Customer Order UI enhacements
### Fixed:
- [#194](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/194) MDIClient SonarQube issues
### Removed:
- [#1846](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/846) Removed obsolete packages

## Version [1.27.4] - (2021.08.17)
### Changed:
- [1539](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1539) Added job scheduler and portal as SaaS Dependency to staging and prod

## Version [1.27.3] - (2021.08.16)
### Added:
- [1539](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1539) UI annotations: ValueList for processing status filter

## Version [1.27.2] - (2021.08.13)
### Added:
- [#98](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/98) Add BillableItems ability to get transferable bill details as per non-commodity BITS creation epic
- [#1675](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1675) Add annotations for ConfigurationService, CustomerOrder and DRM
### Fixed:	
- [1539](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1539) Currency UI annotation - Scale	

## Version [1.27.1] - (2021.08.12)	
### Changed:	
- [1539](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1539) Changed portalsite deployment; UI annotations	
- [#205](https://github.wdf.sap.corp/c4u/edom-Canada/issues/205) Added config to automatically create webhook when application is deployed	
### Fixed:	
- [252](https://github.wdf.sap.corp/c4u/edom-Canada/issues/252) Resolved SonarQube critical and major issues for BillingAccount service	

## Version [1.27.0] - (2021.08.12)	
### Added:
- [108](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/108) Added BP Batch create request to collection
- [1539](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1539) Customer Order UI Implementation; Add app deployer; Added HTML5 app host service; Configured app router; Configured portalsite
- [#188](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/188) Fixed MCM Instance Collection for Single and Double Register Cases
- [#174](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/174) Add user roles for restricting DELETE access
- [#187](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/187) DummyBusinessPartner back to address DRM issue by separating CO and BA
- [170](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1539) Customer Order UI Implementation; Add app deployer; Added HTML5 app host service; Configured app router
- [1539](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1539) Customer Order UI Implementation; Add app deployer; Added HTML5 app host service; Configured app router
- [#245] (https://github.wdf.sap.corp/c4u/edom-Canada/issues/245) BA - Sonarqube Fix
- [#1582](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1582) Postman tests added
- [#1867](https://github.wdf.sap.corp/c4u/edom-Canada/issues/205) Added config in package.json to automatically create webhook when application is deployed
### Changed:
- [#192](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/192) MDIRequest to support PATCH method 
### Fixed:
- [#1364](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1364) Resolved SonarQube critical issue in AuditLogging

## Version [1.26.1] - (2021.08.09)

### Added:
- [#178](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/178) Read MCM Instance and mapped MCM fields to C4E payload for single and double register cases
- [#179](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/179) postman changes for status code changes and feature flag
- [#174](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/174) isValidFormat in legal ground implementations
- Add possibility to cache dynamic feature flags (for 5 minutes by default)
### Changed:
- [#1840](https://github.wdf.sap.corp/c4u/edom-Canada/issues/205) Updated em.json in provisioning to include wild card instead of specific namespace filters as per suggestions from experts
### Removed:
- [#174](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/174) Hard coupling of CustomerOrder or BillingAccount in DataRetentionManagerService

## Version [1.26.0] - (2021.08.06)

### Added:
- [#1539](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1539) Added UI annotations to app / customerOrder / webapp so a simple UI app is available on localhost
- [#1539](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1539) Configured the XS Advanced Application Router for the customerOrder UI
- [#1539](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1539) Created i18n translations for UI annotations labels and titles
- [#1582](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1582) Added @cds.persistence.exists annotation for all entities exposed in ui-services service and model and addest test for checking annotations
- [#1842](https://github.wdf.sap.corp/c4u/edom-Canada/issues/205) Consume contract account create/change events from s4 hana cloud 
### Changed:
- [#148](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/148) Read MDIClient listener
### Fixed:
- [#174](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/174) a typo in _dataSubjectsEndofResidenceConfirmation
- [#1795](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1795) 4U Foundation Retailer Production Outages
- [#1813](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1813) added sonarqube fixes for BA
- [#1831](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1831/files) added fix for last sonarqube merge
- [#1364](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1364) Resolved some SonarQube critical issues and updated packages to latest revisions
- [#1833](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1833) removed code smells
- [#151](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/151) Restrict inbound operation to only take exposed fields 

## Version [1.25.1] - (2021.08.03)

### Added: 
- [#228](https://github.wdf.sap.corp/c4u/edom-Canada/issues/228) Hotfix to turn off alpha/beta features in production

## Version [1.25.0] - (2021.08.03)
### Added:
- [#93](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/93) Creation of technical master data in C4E (MCM): Integration/Unit tests for TMD service
- [#174] (https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/174) Delete restriction for Business Scenarios Table
- [#245] (https://github.wdf.sap.corp/c4u/edom-Canada/issues/245) BA - Sonarqube Critical Issues
- [#163](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/163) Implement and test BP validations using PATCH operation
- [#245](https://github.wdf.sap.corp/c4u/edom-Canada/issues/245) BA - Sonarqube Critical Issues
- [#1792](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1792) Added LegalGround Implementation for Billing Account
- [#180](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/180) Moves Distribution from alpha to beta
- [#147](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/147) Pending flag in BP Bookkeeping
- [#1691](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1691) New Customer Order statuses and status mappings added
- [#1582](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1582) Defined a shared model and node package to be used by core API service and UI service
- [#1582](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1582) Defined a UI service model that gets deployed by core application
### Changed:
- [#165](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/165) Create BP with organization exposing communicationPreferences
- [#180](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/180) Update beta annotation and paths for distribution
- [#174](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/174) DRM implementation for BP to handle displayId and id
- [#1582](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1582) Restored relative import paths
### Fixed:
- [#164](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/164) Sequential Transactions
- [#174](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/174) BP DataSubject getEntitiesByIds
- [#174](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/174) dataSubjectsEndofResidenceConfirmation to handle displayId and guid
- [#174](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/174) dataSubjectsEndofResidence error when query is empty
- [#174](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/174) IT with deletion of nested fields
- [#1795](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1795) Removed logic that throws runtime errors in health check monitoring that prevent the retry mechanism from starting.

## Version [1.24.2] - (2021.07.28)

### Fixed:
- [#175](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/175) Fix for main branch regarding unsecure Math function, replased Math function with Crypto

## Version [1.24.1] - (2021.07.27)

### Fixed:
- [#1641](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1641) Re-introduced static feature flag configuration to prevent toggability in production as configuration are not production-ready yet.
- [#174](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/174) SonarQube issues regarding the DRM implementation for BP

## Version [1.24.0] - (2021.07.26)

### Added:
- [#152](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/152) Mapping operation Set for TMD creation
- [#159](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/159) SD order Distribution using BP Key Mapping
- [#130](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/130) IT for Distribution emit service
- [#1640](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1650) added legalGround implementation
- [#123](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/124) DRM implementation for BP
- [#1590](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1590) Implementation of Initial Status for Customer Order
- [#228](https://github.wdf.sap.corp/c4u/edom-Canada/issues/228) Improvements based on manual testing(Removed clearing category code hardcoding, changed the name and level of Contract account name and added validation for updating template)

## Version [1.23.2] - (2021.07.23) 

### Changed:
- [#145](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/145) Preparation of MDI patch payload for Business Partner
### Fixed:
- [#1641](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1641) Re-introduced static feature flag configuration to prevent toggability in production as configuration are not production-ready yet.

## Version [1.24.0] - (2021.07.26)

### Added:
- [#152](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/152) Mapping operation Set for TMD creation
- [#159](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/159) SD order Distribution using BP Key Mapping
- [#130](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/130) IT for Distribution emit service
- [#1640](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1650) added legalGround implementation
- [#124](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/124) DRM implementation for BP
- [#1590](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1590) Implementation of Initial Status for Customer Order

## Version [1.23.2] - (2021.07.23) 

### Added:
- [#1659](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1659) retry mechanism for health check

## Version [1.23.1] - (2021.07.22)

### Added:
- [#1756](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/146) Post C4E Operations for TMD Creation
### Changed:
- [#127]https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/127 error handling and status update for physical order
- [#149](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/149) Switch v0 to v1 for MDI
- [#140](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/140) fields exposed on BusinessPartner service
- [#1736](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1736) remove postman test for SD Sell from stock
- [#161](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/161) Removed skip from Business partner internal Audit Log Test
### Fixed:
- [#140](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/140) auth issue with the fields exposed on BusinessPartner service PR
- [#140](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/140) missing CountryCode for the BP postman collection
### Removed:

## Version [1.23.0] - (2021.07.19)

### Added:
- [#1639](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1639) sapCumulusUpload, pipelineOptimization, manualConfirmation run only on the main pipeline
- [#122](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/122) MDI BP Rejected Events
- [#121](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/121) BP Mock payloads
### Changed:
- [#121](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/121) BP Update to POST to MDI Change API
- [#1396](https://github.wdf.sap.corp/cap/issues/issues/1396) restored skipped automated tests
- [#1641](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1641) The static feature flag configuration replaced with a configuration that gets feature flags from an external feature flag service.
- [#160](https://github.wdf.sap.corp/c4u/edom-Canada/issues/160) Add array implementation in BA Template

### Fixed:
- [#166](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/166) Fix Service name in FF and add package.json entries for edom-retailer-test
## Version [1.22.7] - (2021.07.16)

### Added:
- [#1658](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/1658) emitPerHTTP flag for messaging
- [#1700](https://github.wdf.sap.corp/c4u/edom-Canada/issues/219) BA model alignment in line with the CA - phase 2: BA entity two attributes type change to Code Lists. 
- [#1670](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/BA_splitReadRequests) split normal read vs On Demand Get for BillingAccount, to be able to fetch BillingAccount locally from C4Uf without connecting to S/4HANA Cloud 
- [#160](https://github.wdf.sap.corp/c4u/edom-Canada/issues/160) Add array implementation in BA Template
### Changed: 
- @sap/cds version is raised to 5.3.2
### Removed:
- [CAP #8948](https://github.wdf.sap.corp/cap/issues/issues/8948) 1 test removed from edom_retailer_test due to a cap issue (should be added back afterwards)
- test\postman\C4Uf_subscription_billing_test.postman_collection.json is disabled until further resolution (file is renamed)

## Version [1.22.6] - (2021.07.07)

### Added:
- [#135](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/135) Error handling for SD  
- [#70](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/70) Update Status of Subscription)
- [#149](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/149) Test postman collection for Distribution with AWS Dev subaccount
- [#83](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/83) Creation of Commodity Subscription (Order Distribution)
- Template for outages/incidents observed for Production
- [#214](https://github.wdf.sap.corp/c4u/edom-Canada/issues/214) Creation of new endpoint for Billing Account entity to read it locally in C4Uf
### Changed:
- [#1658](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1658) postman collection to skip checks & remove resources from service descriptor
- [#1658](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1658) increased the event mesh connection from 10 to 50
- [#1396](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1396) Added automated tests, unsubscribed from created event and changed ConfigurationService test payload
- [#135](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/135) DPP annotations update and related changes in PDM and testing
### Fixed: 
- [#1658](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1658) Added "topic:" as a prefix to the event name in distribution service and technical master data service

## Version [1.22.5] - (2021.07.01)

### Added:
- [#148](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/148) Update Subsequent Display id with SD Order and SD OrderItem
- [#1083](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1083) Cumulus integration
- [#1523](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1523) New aliases of package.json to be able to run every postman collection 
-[#216](https://github.wdf.sap.corp/c4u/edom-Canada/issues/216) Added logger messages for billing account - s4HANA cloud backend logs and BP Key mapping logs
### Changed:
- [#1523](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1523) Scripts for grabbing feature flag in the postman collection
- [#1523](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1523) Postman environments
### Fixed:
- [#1627](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1627) Fixed Data Retention Manager endpoints for recognizing deletable data subjects
### Changed: 
- [1094](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1094) Changed DRM data model with aspect in ap.c4u.foundation.retailer.dpp.DataRetentionManagerAspect and changed data subject identifier to dataSubjectId
- [#204](https://github.wdf.sap.corp/c4u/edom-Canada/issues/204) BA model adjustment as per follow-up for CA ODM delivered model
### Removed:
- [#1626](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1626) Removed mdiBookkeeping test in BP collection

## Version [1.22.4] - (2021.06.29) 

### Added:
- [#1596](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1596) Configured Vault integration
- [#121](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/121) Design response structure of distribution service and remove technical debts
- [#1621](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1621) Initial Implementation of Technical Master Data Service
### Removed:
- [#1396](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1396) - Removed unstable automated tests

## Version [1.22.3] - (2021.06.28) 

### Fixed:
- Removed code comments in pipeline config file

## Version [1.22.2] - Hotfix: Disable Vault configuration (2021.06.25)

### Fixed:
- Hotfix: Disabled Vault configuration due to failing pipeline

## Version [1.22.1] - (2021.06.25)

### Added:
- [#1396](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1396) Improved info logging for subscription billing events
- [#1396](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1396) Added timeout to READ CustomerOrder with updated ProcessingStatus
- [#1596](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1596) Configured Vault integration
### Changed: 
- [1094](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1094) Improvements for DRM Extensibility 
### Fixed:
- [#1596](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1596) Updated parameters for artifactPrepareVersion step

## Version [1.22.0] - (2021.06.23)

### Added:
- [#207](https://github.wdf.sap.corp/c4u/edom-Canada/issues/207) Removed hardcoding for Logical Business System of S4HC

## Version [1.22.0] - (2021.06.22)

### Added:
- [#126](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1587) exposed error msg to external BP service
- [#125](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1580) Added logging to bp validation error events
- [#84](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/84) Polling Updated events from MDI
- [#43](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/43) BP Update status validation and event emitter
- [#43](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/43) MDIClient BPUpdated event handler
- [#10](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1532) Business Partner ODM dependencies removed
- [#192](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1588) BP ODATA KeyMapping consumed in billing account On demand get call
### Changed: 
- [1094](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1094) Implemented strategy design pattern for data subject legal ground deletion (DRM)
### Fixed:
- [#62](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/62) Destination caching for MDI Inbound
- [#43](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/43) BP Postman Collection for UPDATE BP (expect 403 for both Put and Patch)
- [#181](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1558) Billing Account Payment Method Validation return statement
- [#1396](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1396) Create all statuses and mappings within the postman collection
[#192](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1591) BA Postman Collection Updated 
### Removed:
- Removed MDM-BP configuration and mock tests 

## Version [1.21.0] - (2021.06.15)

### Added:
[#97](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/97) Non-Commodity BITS Creation: Service definition for BITS Creation/Billing service
- [#73](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/73) Postman Collection for Physical Order
- [#1146](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1146) Feature that identifies a data subject in Audit Logs
- [#181](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1528) Billing Account Payment Method Validation
- [#1503](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1503) Missing labels for attributes in PDM
- [#78](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/78) SonarQube fix for EM Distribution
### Changed:
- [#118](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/118) Place holder for Bank Account details removed from PDM app as it is sensitive data
- [#1566](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1566) changed Auditlog IT test with full Payload
- [#1428](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1428) Changed localhost postman environment
- [#116](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/116) Migrate MDI destinations to production instead of Canary

## Version [1.20.0] - (2021.06.10)

### Added:
- [#27](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/27) Implementation of orchestrating SD item of customer orders.
- [#99](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/99) Alpha/Beta features - add on with index.cds
- [#85](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/85) Handle (full payload) failure scenario for created events from MDI
- [#99](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/99) Alpha/Beta features
- [#107](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/107) Expose BP Internal Service
- [#985](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/985) Feature Flag service binding to mta.yaml
- [#985](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/985) FeatureFlagService.js and unit tests
- [#61](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/61) Job Scheduling service and additional scope for MDIClient
- [#78](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1469) Configure Enterprise Messaging for Distribution Service
- [#79](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/79) Fix alpha features based on guideline
- [#56](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/56) Full Payload for created events from MDI
- [#91](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/91) Audit Log integration testing for BP Internal
- [#30](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/30) BP Internal that has all the entities and fields exposed from ODM
- [#1441](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/187) BA validation - Address shall exist on the BP
- [#198](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/198) Alpha/Beta structure adjustment for BA
- [#1428](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1428) Created new Postman environment for consumer dev/test hosted on AWS
- [#1396](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1396) Postman collection for Subscription Billing
- [#190](https://github.wdf.sap.corp/c4u/edom-Canada/issues/190) Consumed BP Key Mapping ODATA service in SOAP Wrapper Create and Update functionality for BA
### Fixed:
- [#129](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/129)Subsequent UUID fix
- [#86](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/86) Sonarqube issues fix
- [#100](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/100) BP postman search via market function with CAP version update
- [#1464](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/1464) Server Crash at Order Status Management   
- [#89](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/89) Fixed view in PDM app by adding common.label to codelist fields for BP
- [#152](https://github.wdf.sap.corp/c4u/edom-Canada/issues/152) Audit Log creation fixed for functionality to create/update multiple Billing Accounts for a Business Partner in C4Uf based on S4HC
- [#1496](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1496) Fixed spelling on the landing page
### Changed:
- [#104](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/104) BP validation for creating Service Provider
- [#105](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/105) BP marketFunctionCodeNumber to type string
- [#106](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/106) CustomerInformation model by adding back salesArrangements
- [#98](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/98) BP service - BP addressData exposed fields
- [#195](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/195) Moved BA postman collection to separate folder
- [#1286](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1286) Updated to @sap/cds 5.2.0
- [#1473](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1473) Updated SOAP API destination fetching logic to accommodate Multitenancy scenario
- [#1435](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1435) Updated Node.js to 14.16.1
- [#190] (https://github.wdf.sap.corp/c4u/edom-Canada/issues/190) Updated Postman Collection for Billing Account
- [#210](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/210-BillingAccount-Service-renaming) Renaming of BillintAccounts and API_BILLING_ACCOUNTS model/service to single 'BillingAccount/API_BILLING_ACCOUNT' as per ODM guidlines

## Version [1.19.0] - (2021.05.28)

### Added:
- [#72](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/72) Postman collection tests for Subscription creation 
- [#1404](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1404) Release Order Status Management (Epic #687) and Customer Order Lifecycle Events (Epic #1055)
- [#1248](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1248) Reject handler on DELETE for CustomerOrder related entities
- [#68](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/68) BP postman search via market function
- [#90](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/90) SP postman test script on PUT/PATCH
- [#1449](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1449) Uncommented Newman tests for Billing Account SOAP   Wrapper functionality
- [#152](https://github.wdf.sap.corp/c4u/edom-Canada/issues/152) Functionality to create/update multiple Billing Accounts for a Business Partner in C4Uf based on S4HC

### Fixed:
- [#76](https://zenhub.wdf.sap.corp/app/workspaces/c4u-foundation-orchestration-connectify-605c84315d12fc0c3bff4b43/issues/c4u/foundation-orchestration/76) Bug Fixes on Orchestration PR 
- [#1448](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/151) Update BA display ID back in C4Uf once created in S4HC will with destination switch to CC8 w/o newman
### Changed:
- [#89](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/89) Changed entity semantics to other and added key where required.
- [#90](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/90) SP integration test - PUT/PATCH
### Removed:
-[#93](https://zenhub.wdf.sap.corp/app/workspaces/edominator-zenhub-6064c8fb5d12fc0c3bff52a8/issues/c4u/edominator_zenhub/93)

## Version [1.18.1] - CAP 5.1.4 (2021.05.25)

### Added:
- [#1400](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1400) BP validations for organization, person and service provider
### Fixed:
- [#1286](https://github.wdf.sap.corp/c4u/edom-retailer-core/pull/1286) 502 Bad Gateway when PATCH or PUT Customer Order
### Changed:
- CAP version is updated to 5.1.5
- xmake Nodejs version is updated to 12.22.1

## Version [1.18.0] - (2021.05.21)

### Added:
- [#13](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/13) Market Function Configuration validation (with IT test)
- [#13](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/13) SP postman collection
- [#1039](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1039) Configured pipeline optimization and detectExecuteScan
- [#1416](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/152): Billing Account On Demand Get service to handle 1:n scenario( 1BP with multiple billing accounts)
### Fixed:
- a bug with postman collection
### Changed:
- [#13](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/13) Market Function Configuration db model and service

## Version [1.17.0] - BP Search (2021.05.20)

### Added:
- [#68](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/68) BP search via sp
- [#41](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/41) BP Search entity, unit tests, postman tests
- [#1350](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1350) Added tests for provisioning service
- [#1079](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1079) Configured wildcard routes for dev/test. Cleaned up *.mtaext
### Fixed:
- [#1387](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1387) Issue with receiviing message from subscription billing 
### Changed:
- [#81](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/81) Sap/odm version upgrade to 2.1.1
- [#89](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/89) BP PDM changes
- [#1385](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/130): Updated read requests for billing Account
- [#1350](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1350) Changed scope for SAAS provisioning callback. Removed cds-mtx annotations
- [#1392](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/130): Updated Postman Collection with Billing Account read requests, modified wsdl file and removed ssl disable logic
- [#1394](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/130): Updated Billing Account relationship code in Postman collection
### Removed:
- [#1335](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1335) Attribute 'cacheControl: no-cache' for PDM endpoint configuration
- [#1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121) Removed event mesh grant-as-authority-to-apps and redefine on service level

## Version [1.16.0] - EM receiver for subscription billing (2021.05.17)

### Added:
- [#21](https://github.wdf.sap.corp/c4u/foundation-orchestration/issues/21) Distribution service definition and implementation orchestrating subscription item 
- [#79](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/79) BP postman collection
- [#1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121) EM receiver for subscription billing
### Changed:
- [#79](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/79) removed BP postman tests from edom-retailer-test postman collection

## Version [1.15.0] - R-2105 Sprint 4 (2021.05.13)

### Added:
- [#1349](https://zenhub.wdf.sap.corp/app/workspaces/edominator-zenhub-6064c8fb5d12fc0c3bff52a8/issues/c4u/edominator_zenhub/4) added BusinessPartnerPersonalDataManager service in server.js
- [#145](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/145) Added Alternative CA attribute as association while creating BA
- [#1044](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1044) Attribute 'no-store, no-cache' for Cache-Control header
### Fixed:
- [#1268](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1268) Host url in sonar-project.properties
- [#1221](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1221) Bug with receiving message
- [#1334](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1334) Personal Data Manager annotations from 'DataSubjectDetails' to 'Other'
### Changed:
- [#49](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/49) Business Partner service with reduced exposed fields
- [#1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121) Customer order event format aligned to specification
- [#1235](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1235) Updated packages
- [#78](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/78) MTAex config PDM order 
- [#1189](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1189) Revert changes back that Business Partner and Contract Account are not mandatory fields for Customer Order creation
- [#1340](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1340) Disabled features for test environment

## Version [1.14.6] - App route fix (2021.05.12)

- [#1079](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1079) Fixed app route of staging

## Version [1.14.5] - Revert changes for Business Partner and Contract Account fields (2021.05.12)

### Fixed:
- [#1189](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1189): revert changes that Business Partner and Contract Account fields are not mandatory fields anymore for creating Customer Order

## Version [1.14.4] - Service url fix (2021.05.11)

### Fixed:
- [#1079](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1079) Fixed service url configuration

## Version [1.14.3] - Healthcheck fix (2021.05.11)

### Fixed:
- Hotfix: Healthcheck endpoint for staging environment

## Version [1.14.2] - Memory entitlement, Dynatrace (2021.05.10)

### Added: 
- [#1079](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1079) Entitled more memory to staging, added Dynatrace configuration

## Version [1.14.1] - Audit log entitlement (2021.05.10)

### Added: 
- [#1079](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1079) Entitled audit log to staging

## Version [1.14.0] - Route changes (2021.05.10)

### Added:
- [#25](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/25) BP After create event handler & MDI client 'BP created' event handler 
- [#1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121) Added uaa configuration
- [#1078](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1078) Missing DPP annotations for CustomerOrder model
- [#1078](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1078) Exposed missing attributes in PersonalDataManagerService.cds
### Fixed:
- [#1285](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1285) PDM not reading metadata from PersonalDataManagerService
- [#1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121) Removed connection to BusinessPartnerService from dataSubjectInformation endpoint of Data Retention Manager
- [#1300](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1300) DRM custom logic for blocking CustomerOrder data
### Changed:
- [#1079](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1079) Changed routes.
- [#25](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/25) MDI Client on read handler with MDIRequest builder
- [#1078](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1078) Updated entity-level DPP annotations for CustomerOrder model
- [#1078](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1078) Updated entity linkage to data subject in PersonalDataManagerService
- [#1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121) EM upgrade hook event
### Removed:
- [#77](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/77) AddressData from BP postman tests (collection)

## Version [1.13.1] - (2021.05.07)

### Fixed:
- [#76](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/76) Fix fortify errors that were caught due to axios

## Version [1.13.0] - Overall Status Recalculation and EM (2021.05.06)

### Added:
- [#4](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/4) Business Partner PDM Service + Unit Tests
- [#45](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/45) Market Function Configuration postman tests
- [#1119](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1119) BusinessRulesMockService.js for calculating overall processing status
- [#1205](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1205): Added mtaext for staging environment CIS Registration
- [#1119](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1119) CREATE/UPDATE after handler for CustomerOrderItems in API_EDOM_RETAILER.js to calculate overall status
- [#1119](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1119) Unit tests for BusinessRuleMockService.js
- [#1189](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1189) Business Partner and Contract Account are mandatory fields for Customer Order creation
- [#1193](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1193) Application Landing Page
- [#1119](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1119) Calculation of OverallStatus postman tests
### Fixed:
- [#1119](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1119) Use transaction to emit messaging
- [#123] (https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/123) AuditLog implementation for Billing Account
- [#1119](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1119) Execute message emit outside req.on('succeeded')
- [#754](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/754) Data Blocking process of Data Retention Manager
- [#72](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/72): Business Partner Postman update for failing newman tests
### Changed:
- [#1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121) Receive item status from Subscription Billing (SB) - correction in service / HTTP mode - structured
- [#1193](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1193) Landing Page title changed to SAP Cloud for Utilities Foundation Retailer 
- [#1193](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1193) Application Landing Page text changed
### Removed:
- [#1124](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1124) Automatic registration of EM queue for Customer Order outgoing messages

## Version [1.12.1] - CIS fixes (yyyy.mm.dd)

### Fixed:
- [#1205](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1205): Fixed appName configuration for saas-registry, fixed postman environment credentials

## Version [1.12.0] - CIS registration/BP Feature flag (2021.04.29)

### Added:
- [#27](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/27) Enhanced on demand call from MDI (for updated events) for BP that already exists in S4HC, so that C4Uf Business Partners are synced with MDI.
- [#5](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/5) Provide on demand call from MDI (for created events only) for BP that already exists in S4HC, so that C4Uf Business Partners are synced with MDI.
- [#33](https://github.wdf.sap.corp/c4u/edominator_zenhub/issues/33) Business Partner feature flag (edom-retailer-dev/test) & Business Partner postman collection
- [#119](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/119) Use predefined values from template for creation of Billing account in C4Uf
- [#1150](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1150): Added error logging for failing health monitors
- [#1079](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1079): Changed custom domain for production app router.
- [#1144](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1144): ExternalLinks entity
- [#1144](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1144): Exposed ExternalLinksService
- [#1205](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1205): Added service broker catalog.json for CIS Registration
- [#140] (https://github.wdf.sap.corp/c4u/edom-Canada/issues/140) : Updated the implementation of Billing Account Create/Update by replacing axios with SOAP library

### Fixed:
- [#1205](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1205): Configured mtaext for pipeline failure
- [#1205](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1205): Fixed appName configuration for saas-registry

### Changed:
- [#1113](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1113): Removed entities and files which are defined in @sap/odm@2.1.0
- [#1205](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1205): Changed appName for saas-registry
- [#116](https://github.wdf.sap.corp/c4u/edom-Canada/issues/116) Billing Account and BP joint reference
- [#119](https://github.wdf.sap.corp/c4u/edom-Canada/issues/119) Updated integration tests for BA Templates
- [#1205](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1205): Changed instance name of saas registry
- [#1205](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1205): Changed xsappname of xsuaa
- [#1205](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1205): Refactored mtaext and mta.yaml for dev/test/stage environment
- [#130](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/130):On Demand Read service for billing Account, 
Updated Postman Collection for Billing Account create and BP creation for billing Account and updated destination for S4HC in C4U development Subaccount
## Version [1.11.0] - draft EM receiver for subscription billing (2021.04.16)

### Added:
- [#1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121): Update EM queues and subscription after deployment
- [#1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121): Subscription Billing EM queue 
- [#28](https://zenhub.wdf.sap.corp/app/workspaces/edominator-zenhub-6064c8fb5d12fc0c3bff52a8/issues/c4u/edominator_zenhub/28) Business Partner postman collection
- [#1150](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1150) Added error logging for failing health monitors
- [#120] (https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/120) PDM implementation for Billing Account

## Version [1.10.1] - Fortify: Empty Password  (2021.04.16)

### Fixed:
- [#1150](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1150): Fixed Fortify: Empty Password Finding


## Version [1.10.0] - R-2105 Sprint 2 (2021.04.16)

### Added:
- [#1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121): Event Mesh configuration for CAP
- [#119](https://zenhub.wdf.sap.corp/app/workspaces/freedom-5fdb6d367009da713a3ce8e8/issues/c4u/edom-canada/119) Use predefined values from template for creation of Billing account in C4Uf
- [1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121) Receive item status from Subscription Billing - Mapping table
### Fixed:
- [#1160](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1160): AuditLog not logging all personal attributes on DELETE
- [#28](https://zenhub.wdf.sap.corp/app/workspaces/edominator-zenhub-6064c8fb5d12fc0c3bff52a8/issues/c4u/edominator_zenhub/28) Applied changes on Business Partner service to support @sap/cds 5.0.4 
### Changed:
- [#1150](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1150) Refactored monitoring health check logic

## Version [1.9.1] - R-2105 Sprint 2 (2021.04.xx)

### Added:
- [1121](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1121)  Receive item status from Subscription Billing - Mapping table

## Version [1.9.0] - R-2105 Sprint 2 (2021.04.13)

### Added:
- [#1099](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1099) DRM blocking logic and exposed entities in API_EDOM_RETAILER.cds
### Fixed:
- [#1108](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1108): Fixed axios error handling
### Changed:
- [#1099](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1099) Updated to @sap/cds 5.0.4
- [#1099](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1099) Cleaned up and refactored server.js to use multiTenancy flag for mtx bootstrap
### Removed:
- [#1099](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1099) Extensions to ModelService

## Version [1.8.2] - R-2105 Sprint 2 (2021.04.12)
### Added:
- [#1116](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1116) Exposed property 'processingStatus'
- [#1016](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1016) Registers a TG27 compliant EM namespace
### Changed:
- [#1016](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1016) name of enterprise messaging service in mta configurations

## Version [1.8.1] - R-2105 Sprint 2 (2021.04.09) 
### Fixed:
- Hotfix: Checkmark SAP_Default_SAPUI5_NodeJS

## Version [1.8.0] - R-2105 Sprint 2 (2021.04.09)

### Added:
- [#1115](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1115) Enable Static Feature Flags
- [#139](https://github.wdf.sap.corp/c4u/edom-Canada/issues/139) First check-in for Billing Account persistence and services in C4Uf: Added Entities related to Billing Account(BA), Service definition, Integration and Unit tests. ⚠️ This functionality is available as an beta version, therefore it will be available only under test agreement in the test subscrption.


## Version [1.7.1] - R-2105 Sprint 2 (2021.04.07)

### Added:
- [#19](https://github.wdf.sap.corp/c4u/edom-retailer-core/tree/feat/19-ServiceProvider) First check-in for Service Provider persistence and services in C4Uf: Added Entities related to Service Provider (SP), Service definition, Integration and Unit tests. ⚠️ This functionality is available as an `alpha` version, therefore it will be available only under test agreement in the test subscription.
- msw package to dev dependencies
- First test (of monitoring service) which is using url mocks (by msw) and function mocks (by jest)
### Fixed:
- Monitoring endpoint is now calling the other endpoints once instead of twice
- [#1108](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1108) Production Down Issue
### Changed:
### Removed:
- [#882](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/882) API_BP_KEY_MAPPING

## Version [1.7.0] - R-2105 Sprint 1 (2021.03.29)

### Added:
- [#882](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/882) Enables CDS OData flavor 'x4'
### Changed:
- [#882](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/882) PDM service projections from 'as projection on' to 'as select from'
### Removed:
- [#882](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/882) Custom implemention of blocking nested entities of customer order 
- [#882](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/882) Exposure of nested entities of customer order (e.g. CustomerOrderItems) in API_EDOM_RETAILER
- [#882](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/882) PDM annotations for unexposed ID's
- [#882](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/882) direct reference to customer order nested entity in mtx entity-whitelist configurations

## Version [1.6.9] - Audit Log Service broker issue(2021.03.25)

### Fixed:
- [#1084](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1084) Audit log service broker issue fixed

## Version [1.6.8] - Memory Optimization (2021.03.24)

### Added:
- [#1084](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1084) Configured OPTIMIZE_MEMORY

## Version [1.6.7] - Clean up resources (2021.03.16)

### Fixed:
- [#1069](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1069) Fixed newman command in pipeline
### Changed:
- [#1004](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1004) npm script "run-prod" is renamed to "start-prod"
### Removed:
- [#1004](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1004) Mocha, mocha-junit-reporter and @sap/cds-odata-v2-adapter-proxy dependencies
- [#1004](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1004) package.json + other configuration files for mdmbp
- [#1004](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1004) Unused npm scripts "run", "run-bp", "coverage", "prettier-check"


## Version [1.6.6] - Pipeline Hotfix (2021.03.16)

### Fixed:
- [#969](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/969) Set testServerUrl for staging environment in main pipeline

## Version [1.6.5] - Hotfixes (2021.03.16)

### Changed:
- [#904](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/904) Set service broker plan name

## Version [1.6.4] - Hotfixes (2021.03.16)

### Added:
- [#1013](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1013) Performance evaluation configuration
### Changed:
- [#969](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/969) index.html is no more accessible in production 
- [#904](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/904) Changed SaaS registry title
- [#1058](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1058) Updated DataController query logic for LegalEntityService.js to match with DataRetentionManagerService.js
### Removed:
- [#1004](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1004) Removed get-port and rewire package

## Version [1.6.3] - Hotfix (2021.03.11)

- [#904](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/904) Fixed service broker catalog

## Version [1.6.2] - Hotfix (2021.03.11)

- [#904](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/904) Fixed deployment descriptor of production

## Version [1.6.1] - GA Sprint 8 (2021.03.11)

### Added:
- [#923](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/923) Deployment to production enabled in main pipeline via release stage extension
- [#904](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/904) Rebranded configuration to C4U foundation retailer in mta.yaml and .mtaext
- [#904](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/904) Configured service broker
### Changed:
- [#979](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/979) LegalEntity configuration logic in LegalEntities and DRM services

## Version [1.6.0] - GA Sprint 8 (2021.03.10)

### Added:
- [#904](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/904) Configured saas-registry
- [#964](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/964) DPPBlocked.Read scope and assigned it to "admin" user
### Fixed:
- [#964](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/964) Makes Data Retention Manager attribute - isBlocked - read only in edom retailer APIs / grants access to DPPBlocked.Read scope to read blocked and unblocked data
- [#999](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/999) Fixed checkmarx finding in upgradeTenant
### Changed:
- [#908](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/908) Renames utilitiesAspect attribute from utilitiesSubsequentDocument to subsequentDocument / renames attributes of CustomerOrderItemUtilitiesSubsequentDocument from subsequentDocumentUUID, subsequentDocumentId,subsequentDocumentType to id, displayId, type accordingly

## Version [1.5.8] - GA Sprint 7 (2021.03.08)

### Fixed:
 - [#1000](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/1000) Updated packages
 - [#922](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/922) Fixed pipeline issues for security checking


## Version [1.5.3] - GA Sprint 7 (2021.04.03)

### Fixed:
 - [#922](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/922) Fixes visibility of test results in Jenkins
 - [#837](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/837) Fixes code coverage display in SonarQube
 - [#972](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/922) Fixes Whitesource Scan execution in Jenkins
### Changed:
 - Jenkins pipeline configuration: `main` pipeline configuration moved to core repository
### Removed:
- [#979](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/979) DataController.csv file 

## Version [1.5.2] - GA Sprint 7 (2021.03.03)

### Added:
- [#866](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/866) DataController.csv file
- [#924](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/924) Production Environment .mtaext
### Fixed:
- [#768](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/768) Improves CustomerOrder API
- [#924](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/924) Defined resource names in mta.yaml
- [#909](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/909) Removes absolete attributes from the CustomerOrder service
### Changed:
- [#866](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/866) Exposed DataController entity in DataRetentionManagerService
- [#657](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/657) Health endpoint definition is removed from server.js. Instead there's a new cds srv\monitoring\Service.cds. Path to the api has not been changed.
### Removed:
- [#768](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/909) .csv files with configuration data
- [#866](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/866) GenericConfigurations entity and .csv file
- [#909](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/909) Absolete attributes (pricePlan, relatedTo, salesGroup, salesOffice, macoDocumentId) from the CustomerOrder service

## Version [1.5.1] - GA Sprint 7 (2021.02.26)

### Fixed:
- blockCustomerOrder DPP async logic which leaded to 2 failed tests
- "dataSubjectLegalGroundDeletion: should hide blocked CustomerOrder" test
### Removed:
- [#943](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/943) Remote tests checking Business Partner Key Mapping service

## Version [1.5.0] - GA Sprint 7 (2021.02.25)

### Added:
- [#719](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/719) Provided `/api/v1/bp/keymapping` endpoint to connect to MDI BP Key Mapping via Destination Service.
- [#715](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/715) Integration tests for validating Audit Logging functionality
- [#845](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/845) Adds HANA Pool sizing parameter `max 1400` and `min 100`
- [#586](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/586) Adds `/monitoring/health` endpoint
- [#879](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/879) Creates local backend integration test to check data blocking feature.

### Fixed:
- [#719](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/719) cds-runtime version is not fixed anymore

### Changed:
- server.js can now work with option {port: 0} - creates a server on a free port (important for some tests)

### Removed:
- [#715](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/715) OData flag "protectMetadata": false
- obsolete libraties securityHelper, em, keymapping, events
- obsolete tests: health, securityHelper

## Version [1.4.2] - GA Test Sprint 5 (2021.02.19)

### Added:
- [#715](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/715) PDM istance configuration in mta.yaml for manual data deletion
- [#715](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/715) Created audit logging handling for CustomerOrder.

### Fixed:
- [#867](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/867) PDM application not showing all annotated attributes
- [#863](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/863) Exclusion path added for SonarQube scan
- [#879](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/879) Blocking of CustomerOrder data.

## Version [1.4.1] - GA Test Sprint 5 (2021.02.12)

### Changed:
- [#867](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/867) Exposure of complex types (SalesDocumentAddress, PersonAddressDetails) in PDM service from associations to a flat structure
- [#867](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/867) Renamed CustomerOrderItem "ID" to "id"

### Fixed:
- [#874](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/874) data destruction endpoint of Data Retention Manager service.
- [#793](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/793) missing of country code under partners[].address
- [#874](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/874) data destruction endpoint of Data Retention Manager service.

### Removed:
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) UCCO Service related objects
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) Deleted i18n.properties, set the correct endpoint

## Version [1.4.0] - GA Test Sprint 5 (2021.02.09)

### Added
- [#793](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/793) UtilitiesCardType to CustomerOrderPaymentReference
- Remote tests for checking the creation of customer order with sales organization
- Remote tests for checking CRUD operations for Customer Order Item Utilities Aspect

### Fixed:
- [#801](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/801) POST for CustomerOrderItemUtilitiesSubsequentDocument gives 500 Error after successful
- [#791](https://zenhub.wdf.sap.corp/app/workspaces/c4u-edom-retailer-core-5f185289d149430efda211f6/issues/c4u/edom-retailer-core/791) Cannot create customerOrder with Sales Organization displayId

### Removed
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) UCCO service
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) UCCO db model, submitTuaOrder, MaCo functionality;
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) UCCO UIs
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) generic_configurations folder
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) Cleaned corresponding things of mta.yaml

## Version [1.3.1] - GA Test Sprint 5 (2021.02.04)

### Fixed
- small conflict in the app versioning

## Version [1.3.0] - GA Test Sprint 5 (2021.02.04)

### Added
- [#459](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/459) Security restrictions to protect CDS-MTX APIs
- [#459](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/459) Security restrictions to EDoM Retailer v1 APIs to make items blocked or marked for deletion unreadable.
- [#715](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/715) Created Data Retention Service Manager handling for CustomerOrder
- [#715](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/715) Annotated Customer Order models with CAP based PDM annotations
- [#715](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/715) Added PersonalDataManagerService, manual tests and exposed annotated entities & attributes
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) .hdbtabledata file for GenericConfigurations
- [#792](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/792) IncotermsClassification exposure on CustomerOrder
- [#798](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/798) Upgrade schema via upgradeTenants hook
- BusinessPartnerService implementation

### Changed
- Order of API's being exposed in server.js

### Fixed
- [#804](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/804) Country fields are exposed as part of address
- [#799](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/799) Adds missing attribute `installation` to `referenceObject`
- [#816](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/816) Data type for meter to String

### Removed
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) Data Retention Manager Service handling for UCCO, Contracts, ContractAccounts
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) Upgrade schema via query of the postman collection
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) MDM-Prod service binding
- [#785](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/785) Data Retention Manager Service handling for UCCO, Contracts, ContractAccounts

## Version [1.2.2] - Hotfixing tenant upgrade issue #775 (2021.01.22)

### Added

- [#798](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/798) .hdbtabledata files to describe which fields are allowed to be overwritten after schema migrations

## Version [1.2.1] - Hotfixing tenant upgrade issue #775 (2021.01.21)

### Added
- Command to execute all integration tests in scripts section of package.json

### Changed
- Schema of tenants is now updating by synchronously during E2E test execution

### Removed
- db/data/sap.odm.sales-CustomerOrder.csv file deleted
- db/data/sap.odm.sales-CustomerOrderItems.csv file deleted

## Version [1.2.0] - GA Dev Sprint 4 (2021.01.20)

### Added
- [#104](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/104) Enabled Dynatrace integration
- [#152](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/152) Enabled Swagger UI API Specification
- [#693](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/693) Enabled Staging environment
- [#755](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/755) Exposed displayId field to CustomerOrder
- [#755](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/755) Exposed partners field to CustomerOrderItems
- [#755](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/755) Specified CustomerOrderItemPartners with address field exposed

### Changed
- Changed EDoM Retailer API path to /api/v1
- [#703](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/703) Deployment to the Staging now requires manual confirmation

### Fixed
- [#775](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/775) Bug with subscribing to the Staging version

## Version [1.1.1] - Deployment to Stage (2021.01.15)
### Added
 - MTA Descriptor file for [stage] subaccount.

## Version [1.1.0] - GA Dev Sprint 2 + 3  (2021.01.12)
### Added
- [#709](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/709) Redirect Pipeline configuration to edom-retailer-piper-lib
- [#713](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/713) CDS tests: checking customer order cds model
- [#713](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/713) CSV files: data for customer order entities
- [#713](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/713) Customer Order models exposed & API is secured by granting privileges to authenticated users

### Changed
- [#702](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/702) Migrated Cloud SDK pipeline to Piper GPP pipeline 
- [#713](https://github.wdf.sap.corp/c4u/edom-retailer-core/issues/713) Postman collection: added CRUD requests for customer order

## Version [1.0.0] - Steel Tower (2021.12.18)
### Added
- First version of Customer Order API (/api/v1/customerorder)
- Exposed first set of Customer Order entities
- Swagger UI application (/docs)
