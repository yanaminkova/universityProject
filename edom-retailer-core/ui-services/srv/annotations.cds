using { CustomerOrderUIService } from './api/customerOrder';

annotate CustomerOrderUIService.CustomerOrder with @cds.persistence.exists;
annotate CustomerOrderUIService.CustomerOrderItems with @cds.persistence.exists;
annotate CustomerOrderUIService.CustomerOrderItemNotes with @cds.persistence.exists;
annotate CustomerOrderUIService.CustomerOrderItemUtilitiesAspect with @cds.persistence.exists;
annotate CustomerOrderUIService.Product with @cds.persistence.exists;
annotate CustomerOrderUIService.CustomerOrderTypeCodes with @cds.persistence.exists;
annotate CustomerOrderUIService.CustomerOrderItemTypeCodes with @cds.persistence.exists;
annotate CustomerOrderUIService.SalesProcessingStatusCodes with @cds.persistence.exists;
annotate CustomerOrderUIService.SalesOrganization with @cds.persistence.exists;
annotate CustomerOrderUIService.DivisionCodes with @cds.persistence.exists;
annotate CustomerOrderUIService.DistributionChannelCodes with @cds.persistence.exists;
annotate CustomerOrderUIService.SalesCancellationReasonCodes with @cds.persistence.exists;
annotate CustomerOrderUIService.UnitOfMeasureCodes with @cds.persistence.exists;
annotate SalesCancellationStatusCodes with @cds.persistence.exists;
annotate SalesTextTypeCodes with @cds.persistence.exists;

// Additional
annotate CustomerOrderUIService.CustomerOrder.items.utilitiesAspect.referenceObject with @cds.persistence.exists;
annotate CustomerOrderUIService.CustomerOrder.items.utilitiesAspect.subsequentDocument with @cds.persistence.exists;