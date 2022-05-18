using {
       sap.odm.utilities.sales.CustomerOrderItemUtilitiesSubsequentDocumentCodes,
} from '../../../../common-model/odm/utilities';

aspect CustomerOrderItemUtilitiesSubsequentDocumentCodesLinkAspect {
    /**
    * A pattern containing a URL link to the corresponding subsequent document
    */
    urlPattern: String(2048);
}

extend CustomerOrderItemUtilitiesSubsequentDocumentCodes with CustomerOrderItemUtilitiesSubsequentDocumentCodesLinkAspect;