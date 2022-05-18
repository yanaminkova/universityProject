const path = require('path');
const { expect } = require('../../lib/testkit');
const cds = require('@sap/cds');
/**
 * Test goal: This test verify the exposed entity of API_EDOM_RETAILER according to the specification provided in #713
 */
describe('API_EDOM_RETAILER', () => {
    before('load cds model...', async () => {
        cds.model = await cds.load(path.join(__dirname, '../../../srv'));
    });

    it('should contain all specified entities UTILITIESCLOUDSOLUTION-2259', () => {
        expect('API_EDOM_RETAILER').to.have.entities(['CustomerOrder']);
    });

    it('should contain @description annotation for all attribute UTILITIESCLOUDSOLUTION-2951', async () => {
        const entities = await Object.entries(cds.model.definitions)
            .map((entry) => ({
                name: entry[0],
                ...entry[1],
            }))
            .filter((entity) => entity.name.startsWith('API_EDOM_RETAILER.'));

        const labeled = entities.every((entity) => {
            return Object.entries(entity.elements)
                .map((entry) => ({
                    name: entry[0],
                    ...entry[1],
                }))
                .every((field) => {
                    if (field['@description'] || field.name == 'up_') {
                        return true;
                    } else {
                        throw new Error(
                            `Non-labeled field ${JSON.stringify(
                                field.name
                            )} of entity ${JSON.stringify(entity.name)}`
                        );
                    }
                });
        });
        expect(labeled).to.equal(true);
    });

    it('should contain @restrict annotation for all entities UTILITIESCLOUDSOLUTION-2259', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('API_EDOM_RETAILER')
        ).filter((value) => !value['@cds.autoexposed']);

        Array.from(serviceEntities).forEach((entity) => {
            expect(
                entity['@restrict'],
                `Expected ${entity.name} to have @restrict annotation defined`
            ).to.exist;
        });
    });

    it('should contain @readonly annotation for isBlocked attribute UTILITIESCLOUDSOLUTION-2259', () => {
        const serviceEntities = Object.values(
            cds.reflect(cds.model).entities('API_EDOM_RETAILER')
        ).filter((value) => !value['@cds.autoexposed']);

        Array.from(serviceEntities).forEach((entity) => {
            if (entity.elements.isBlocked) {
                expect(
                    entity.elements.isBlocked['@readonly'],
                    `Expected ${entity.name} to have @readonly annotation for isBlocked attribute defined`
                ).to.exist;
            }
        });
    });

    it('should contain all defined attributes of CustomerOrder UTILITIESCLOUDSOLUTION-2259', () => {
        expect('API_EDOM_RETAILER.CustomerOrder').to.have.attributes([
            'id',
            'cancellationStatus',
            'customerReferenceId',
            'isExternallyPriced',
            'items',
            'netAmount',
            'notes',
            'orderDate',
            'orderReason',
            'partners',
            'paymentReferences',
            'priceComponents',
            'pricingDate',
            'requestedFulfillmentDate',
            'salesAspect',
            'serviceAspect',
            'type',
            // SalesAreaInDocument
            'distributionChannel',
            'division',
            'salesOrganization',
            // SalesDocument
            'displayId', // Bug #755
            'processingStatus',
        ]);
    });

    it('should contain all defined attributes of Product UTILITIESCLOUDSOLUTION-3079', () => {
        expect('API_EDOM_RETAILER.Product').to.have.attributes([
            'id',
            'displayId',
            'name',
            'description',
            'type',
            'salesAspect',
            'texts',
        ]);
    });

    it('should contain all defined attributes of CustomerOrderItemSubscriptionAspect UTILITIESCLOUDSOLUTION-2998', () => {
        expect(
            'API_EDOM_RETAILER.CustomerOrderItemSubscriptionAspect'
        ).to.have.attributes([
            'contractTerm',
            'subscriptionReference',
            'validFrom',
            'validTo',
            'technicalResources',
            'isBlocked',
        ]);
    });

    it('should contain all defined attributes of SubscriptionTechnicalResourceAspect UTILITIESCLOUDSOLUTION-2998', () => {
        expect(
            'API_EDOM_RETAILER.SubscriptionTechnicalResourceAspect'
        ).to.have.attributes(['id', 'resourceId', 'resourceName', 'isBlocked']);
    });

    it('should contain all defined attributes of SubscriptionHeaderCustomReferences UTILITIESCLOUDSOLUTION-3058', () => {
        expect(
            'API_EDOM_RETAILER.SubscriptionHeaderCustomReferences'
        ).to.have.attributes([
            'id',
            'typeCode',
            'customReferenceId',
            'isBlocked',
        ]);
    });

    it('should contain all defined attributes of SubscriptionItemCustomReferences UTILITIESCLOUDSOLUTION-3058', () => {
        expect(
            'API_EDOM_RETAILER.SubscriptionItemCustomReferences'
        ).to.have.attributes([
            'id',
            'typeCode',
            'customReferenceId',
            'isBlocked',
        ]);
    });

    it('should contain all defined attributes of SubscriptionItemSubscriptionParameters UTILITIESCLOUDSOLUTION-3058', () => {
        expect(
            'API_EDOM_RETAILER.SubscriptionItemSubscriptionParameters'
        ).to.have.attributes(['id', 'code', 'value', 'isBlocked']);
    });

    it('should contain all defined attributes of CustomerOrderItemUtilitiesBudgetBillingTypeCodes - UTILITIESCLOUDSOLUTION-2925', () => {
        expect(
            'API_EDOM_RETAILER.CustomerOrderItemUtilitiesBudgetBillingTypeCodes'
        ).to.have.attributes(['name', 'descr', 'code']);
    });

    it('should contain all defined attributes of CustomerOrderItemUtilitiesDeviceTypeCodes - UTILITIESCLOUDSOLUTION-2925', () => {
        expect(
            'API_EDOM_RETAILER.CustomerOrderItemUtilitiesDeviceTypeCodes'
        ).to.have.attributes(['name', 'descr', 'code']);
    });

    it('should contain all defined attributes of CustomerOrderItemUtilitiesAspect - UTILITIESCLOUDSOLUTION-2925', () => {
        expect(
            'API_EDOM_RETAILER.CustomerOrderItemUtilitiesAspect'
        ).to.have.attributes([
            'formerServiceProvider',
            'referenceObject',
            'subsequentDocument',
            'podId',
            'supplyAddress',
            'gridPricing',
            'deviceTypePricing',
            'geographicalCode',
            'budgetBillingType',
            'referenceBillDate',
        ]);
    });

    it('should contain all defined attributes of CustomerOrderItemUtilitiesSubsequentDocumentCodes - UTILITIESCLOUDSOLUTION-2925', () => {
        expect(
            'API_EDOM_RETAILER.CustomerOrderItemUtilitiesSubsequentDocumentCodes'
        ).to.have.attributes(['code', 'name', 'descr', 'urlPattern']);
    });
});
