using { sap.c4u.foundation.retailer.mdiclient as mdiclient } from '../../db/models/mdiclient/MDIClient';


service MDIClientService @(path: '/api/mdiClient/v1', requires: 'authenticated-user') { 
    @(  restrict: [
        { grant: ['WRITE'], to: ['jobcallback','MasterData.Sync']},
        { grant: ['READ'], to: ['jobcallback','MasterData.Sync']}
    ])
    entity MDIClient as projection on mdiclient.MDIClient {
        deltaLoad
    }

    @(  restrict: [
        { grant: ['WRITE'], to: ['jobcallback','MasterData.Sync']},
        { grant: ['READ'], to: ['jobcallback','MasterData.Sync']}
    ])
    entity DeltaTokenBookKeeping as projection on mdiclient.DeltaTokenBookKeeping {
        id,
        deltaToken,
        status,
        type,
        createdAt
    }

    @(  restrict: [
        { grant: ['WRITE'], to: ['jobcallback','MasterData.Sync']},
        { grant: ['READ'], to: ['jobcallback','MasterData.Sync']}
    ])
    action replicateProducts(maxPageSize: Integer) returns {
        Created: Integer;
        Updated: Integer;
        Failed: Integer;
        Errors: many {
                id: UUID;
                displayId: String;
                errorMessage: String;
                deltaToken: String;
                createdAt: String;
        }       
    };
}