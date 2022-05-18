namespace sap.odm.orgunit;

using {
   sap.odm.orgunit.CompanyCode
} from '@sap/odm/dist/orgunit';

/**
 * Aligned on 2020-12-15: Only necessary attributes are considered.
 */
@cds.persistence.journal
extend CompanyCode with {
    legacy_name : String(25);
};