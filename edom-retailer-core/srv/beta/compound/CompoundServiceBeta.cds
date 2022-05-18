using {sap.c4u.compound as compound} from '../../../db';

/**
 * Service definition
 */
service CompoundServiceBeta @(
    path     : '/api/beta/SalesCompound/v1',
    requires : 'authenticated-user',
    version  : 'beta'
) {

    @(
        restrict     : [
            {
                grant : ['WRITE'],
                to    : 'API.Write'
            },
            {
                grant : ['READ'],
                to    : 'API.Read'
            }
        ],
        Capabilities : {DeleteRestrictions.Deletable : false},
    )
    @cds.persistence.skip
    entity SalesCompound as projection on compound.SalesCompound;
}
