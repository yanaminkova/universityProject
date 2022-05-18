/* eslint-disable no-param-reassign */
const logger = require('cf-nodejs-logging-support');

class businessPartnerKeyMappingService {
    /**
     * Get BP display Id from S4HC
     * @param {} req
     * @returns {}
     */

    static getBPKeyMappingByBpUUIDFilter(
        businessPartnerId,
        alternativePayeeId,
        alternativePayerId,
        alternativeDunningRcpntId,
        alternativeCorrespondenceRcpntId
    ) {
        if (businessPartnerId) {
            const BPIdFilter = `BusinessPartnerId eq guid'${businessPartnerId}'`;
            const PayeeIdFilter = `BusinessPartnerId eq guid'${alternativePayeeId}'`;
            const PayerIdFilter = `BusinessPartnerId eq guid'${alternativePayerId}'`;
            const AlternativeDunningIdFilter = `BusinessPartnerId eq guid'${alternativeDunningRcpntId}'`;
            const AlternativeCorrespondenceIdFilter = `BusinessPartnerId eq guid'${alternativeCorrespondenceRcpntId}'`;

            if (
                alternativePayeeId &&
                alternativePayerId &&
                alternativeDunningRcpntId &&
                alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayeeIdFilter} or ${PayerIdFilter} or ${AlternativeDunningIdFilter} or ${AlternativeCorrespondenceIdFilter})`;
            }

            if (
                alternativePayeeId &&
                alternativePayerId &&
                alternativeDunningRcpntId &&
                !alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayeeIdFilter} or ${PayerIdFilter} or ${AlternativeDunningIdFilter})`;
            }

            if (
                alternativePayeeId &&
                alternativePayerId &&
                !alternativeDunningRcpntId &&
                alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayeeIdFilter} or ${PayerIdFilter} or ${AlternativeCorrespondenceIdFilter})`;
            }

            if (
                alternativePayeeId &&
                !alternativePayerId &&
                alternativeDunningRcpntId &&
                alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayeeIdFilter} or ${AlternativeDunningIdFilter} or ${AlternativeCorrespondenceIdFilter})`;
            }

            if (
                !alternativePayeeId &&
                alternativePayerId &&
                alternativeDunningRcpntId &&
                alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayerIdFilter} or ${AlternativeDunningIdFilter} or ${AlternativeCorrespondenceIdFilter})`;
            }

            if (
                !alternativePayeeId &&
                !alternativePayerId &&
                alternativeDunningRcpntId &&
                alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${AlternativeDunningIdFilter} or ${AlternativeCorrespondenceIdFilter})`;
            }

            if (
                !alternativePayeeId &&
                alternativePayerId &&
                !alternativeDunningRcpntId &&
                alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayerIdFilter} or ${AlternativeCorrespondenceIdFilter})`;
            }

            if (
                !alternativePayeeId &&
                alternativePayerId &&
                alternativeDunningRcpntId &&
                !alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayerIdFilter} or ${AlternativeDunningIdFilter})`;
            }

            if (
                alternativePayeeId &&
                !alternativePayerId &&
                !alternativeDunningRcpntId &&
                alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayeeIdFilter} or ${AlternativeCorrespondenceIdFilter})`;
            }

            if (
                alternativePayeeId &&
                !alternativePayerId &&
                alternativeDunningRcpntId &&
                !alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayeeIdFilter} or ${AlternativeDunningIdFilter})`;
            }

            if (
                alternativePayeeId &&
                alternativePayerId &&
                !alternativeDunningRcpntId &&
                !alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayeeIdFilter} or ${PayerIdFilter})`;
            }

            if (
                !alternativePayeeId &&
                !alternativePayerId &&
                !alternativeDunningRcpntId &&
                alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${AlternativeCorrespondenceIdFilter})`;
            }

            if (
                alternativePayeeId &&
                !alternativePayerId &&
                !alternativeDunningRcpntId &&
                !alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayeeIdFilter})`;
            }

            if (
                !alternativePayeeId &&
                alternativePayerId &&
                !alternativeDunningRcpntId &&
                !alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${PayerIdFilter})`;
            }

            if (
                !alternativePayeeId &&
                !alternativePayerId &&
                alternativeDunningRcpntId &&
                !alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter} or ${AlternativeDunningIdFilter})`;
            }

            if (
                !alternativePayeeId &&
                !alternativePayerId &&
                !alternativeDunningRcpntId &&
                !alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter})`;
            }

            if (
                !alternativePayeeId &&
                !alternativePayerId &&
                !alternativeDunningRcpntId &&
                !alternativeCorrespondenceRcpntId
            ) {
                return `(${BPIdFilter})`;
            }
        }

        if (
            !businessPartnerId &&
            !alternativePayeeId &&
            !alternativePayerId &&
            !alternativeDunningRcpntId &&
            !alternativeCorrespondenceRcpntId
        ) {
            logger.error(
                `[API_BP_KEY_MAPPING] 'No Id provided to fetch key mapping'`
            );
        }

        return false;
    }

    static getBPKeyMappingByGroupIDFilter(
        keyMappingGrpIdForBP,
        keyMappingGrpIdForAlternatePayee,
        keyMappingGrpIdForAlternatePayer,
        keyMappingGrpIdForAlternativeDunning,
        keyMappingGrpIdForAlternativeCorrespondence,
        businessSystem
    ) {
        if (keyMappingGrpIdForBP) {
            const BPGroupIdFilter = `KeymappingGroupID eq guid'${keyMappingGrpIdForBP}'`;
            if (businessSystem) {
                const BSFilter = `to_BusinessSystem/BusinessSystem eq '${businessSystem}'`;
                const PayeeGroupIdFilter = `KeymappingGroupID eq guid'${keyMappingGrpIdForAlternatePayee}'`;
                const PayerGroupIdFilter = `KeymappingGroupID eq guid'${keyMappingGrpIdForAlternatePayer}'`;
                const AltDunningGroupIdFilter = `KeymappingGroupID eq guid'${keyMappingGrpIdForAlternativeDunning}'`;
                const AltCorrespondenceGroupIdFilter = `KeymappingGroupID eq guid'${keyMappingGrpIdForAlternativeCorrespondence}'`;
                if (
                    keyMappingGrpIdForAlternatePayee &&
                    keyMappingGrpIdForAlternatePayer &&
                    keyMappingGrpIdForAlternativeDunning &&
                    keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayeeGroupIdFilter} or ${PayerGroupIdFilter} or ${AltDunningGroupIdFilter} or ${AltCorrespondenceGroupIdFilter})`;
                }

                if (
                    keyMappingGrpIdForAlternatePayee &&
                    keyMappingGrpIdForAlternatePayer &&
                    keyMappingGrpIdForAlternativeDunning &&
                    !keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayeeGroupIdFilter} or ${PayerGroupIdFilter} or ${AltDunningGroupIdFilter})`;
                }

                if (
                    keyMappingGrpIdForAlternatePayee &&
                    keyMappingGrpIdForAlternatePayer &&
                    !keyMappingGrpIdForAlternativeDunning &&
                    keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayeeGroupIdFilter} or ${PayerGroupIdFilter} or ${AltCorrespondenceGroupIdFilter})`;
                }

                if (
                    keyMappingGrpIdForAlternatePayee &&
                    !keyMappingGrpIdForAlternatePayer &&
                    keyMappingGrpIdForAlternativeDunning &&
                    keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayeeGroupIdFilter} or ${AltDunningGroupIdFilter} or ${AltCorrespondenceGroupIdFilter})`;
                }

                if (
                    !keyMappingGrpIdForAlternatePayee &&
                    keyMappingGrpIdForAlternatePayer &&
                    keyMappingGrpIdForAlternativeDunning &&
                    keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayerGroupIdFilter} or ${AltDunningGroupIdFilter} or ${AltCorrespondenceGroupIdFilter})`;
                }

                if (
                    !keyMappingGrpIdForAlternatePayee &&
                    !keyMappingGrpIdForAlternatePayer &&
                    keyMappingGrpIdForAlternativeDunning &&
                    keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${AltDunningGroupIdFilter} or ${AltCorrespondenceGroupIdFilter})`;
                }

                if (
                    !keyMappingGrpIdForAlternatePayee &&
                    keyMappingGrpIdForAlternatePayer &&
                    !keyMappingGrpIdForAlternativeDunning &&
                    keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayerGroupIdFilter} or ${AltCorrespondenceGroupIdFilter})`;
                }

                if (
                    !keyMappingGrpIdForAlternatePayee &&
                    keyMappingGrpIdForAlternatePayer &&
                    keyMappingGrpIdForAlternativeDunning &&
                    !keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayerGroupIdFilter} or ${AltDunningGroupIdFilter})`;
                }

                if (
                    keyMappingGrpIdForAlternatePayee &&
                    !keyMappingGrpIdForAlternatePayer &&
                    !keyMappingGrpIdForAlternativeDunning &&
                    keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayeeGroupIdFilter} or ${AltCorrespondenceGroupIdFilter})`;
                }

                if (
                    keyMappingGrpIdForAlternatePayee &&
                    !keyMappingGrpIdForAlternatePayer &&
                    keyMappingGrpIdForAlternativeDunning &&
                    !keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayeeGroupIdFilter} or ${AltDunningGroupIdFilter})`;
                }

                if (
                    keyMappingGrpIdForAlternatePayee &&
                    keyMappingGrpIdForAlternatePayer &&
                    !keyMappingGrpIdForAlternativeDunning &&
                    !keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayeeGroupIdFilter} or ${PayerGroupIdFilter})`;
                }

                if (
                    !keyMappingGrpIdForAlternatePayee &&
                    !keyMappingGrpIdForAlternatePayer &&
                    !keyMappingGrpIdForAlternativeDunning &&
                    keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${AltCorrespondenceGroupIdFilter})`;
                }

                if (
                    keyMappingGrpIdForAlternatePayee &&
                    !keyMappingGrpIdForAlternatePayer &&
                    !keyMappingGrpIdForAlternativeDunning &&
                    !keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayeeGroupIdFilter})`;
                }

                if (
                    !keyMappingGrpIdForAlternatePayee &&
                    keyMappingGrpIdForAlternatePayer &&
                    !keyMappingGrpIdForAlternativeDunning &&
                    !keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${PayerGroupIdFilter})`;
                }

                if (
                    !keyMappingGrpIdForAlternatePayee &&
                    !keyMappingGrpIdForAlternatePayer &&
                    keyMappingGrpIdForAlternativeDunning &&
                    !keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter} or ${AltDunningGroupIdFilter})`;
                }

                if (
                    !keyMappingGrpIdForAlternatePayee &&
                    !keyMappingGrpIdForAlternatePayer &&
                    !keyMappingGrpIdForAlternativeDunning &&
                    !keyMappingGrpIdForAlternativeCorrespondence
                ) {
                    return `${BSFilter} and (${BPGroupIdFilter})`;
                }
            }

            if (
                !keyMappingGrpIdForAlternatePayee &&
                !keyMappingGrpIdForAlternatePayer &&
                !keyMappingGrpIdForAlternativeDunning &&
                !keyMappingGrpIdForAlternativeCorrespondence &&
                !businessSystem
            ) {
                return `(${BPGroupIdFilter})`;
            }
        }

        if (
            !keyMappingGrpIdForBP &&
            !keyMappingGrpIdForAlternatePayee &&
            !keyMappingGrpIdForAlternatePayer &&
            !keyMappingGrpIdForAlternativeDunning &&
            !keyMappingGrpIdForAlternativeCorrespondence
        ) {
            logger.error(
                `[API_BP_KEY_MAPPING] 'No Key Mapping Group Id provided to fetch key mapping'`
            );
        }

        return false;
    }

    static getBPKeyMappingByBPDisplayIDFilter(
        businessSystem,
        businessPartner,
        alternativePayee,
        alternativePayer,
        alternativeDunningRcpnt,
        alternativeCorrespondenceRcpnt
    ) {
        if (businessSystem) {
            const BSFilter = `to_BusinessSystem/BusinessSystem eq '${businessSystem}'`;
            const BPId = `BusinessPartner eq '${businessPartner}'`;
            const PayeeId = `BusinessPartner eq '${alternativePayee}'`;
            const PayerId = `BusinessPartner eq '${alternativePayer}'`;
            const AltDunningId = `BusinessPartner eq '${alternativeDunningRcpnt}'`;
            const AltCorrespondenceId = `BusinessPartner eq '${alternativeCorrespondenceRcpnt}'`;
            if (
                businessPartner &&
                alternativePayee &&
                alternativePayer &&
                alternativeDunningRcpnt &&
                alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayeeId} or ${PayerId} or ${AltDunningId} or ${AltCorrespondenceId})`;
            }
            if (
                businessPartner &&
                alternativePayee &&
                alternativePayer &&
                alternativeDunningRcpnt &&
                !alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayeeId} or ${PayerId} or ${AltDunningId})`;
            }
            if (
                businessPartner &&
                alternativePayee &&
                alternativePayer &&
                !alternativeDunningRcpnt &&
                alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayeeId} or ${PayerId} or ${AltCorrespondenceId})`;
            }
            if (
                businessPartner &&
                alternativePayee &&
                !alternativePayer &&
                alternativeDunningRcpnt &&
                alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayeeId} or ${AltDunningId} or ${AltCorrespondenceId})`;
            }
            if (
                businessPartner &&
                !alternativePayee &&
                alternativePayer &&
                alternativeDunningRcpnt &&
                alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayerId} or ${AltDunningId} or ${AltCorrespondenceId})`;
            }
            if (
                businessPartner &&
                !alternativePayee &&
                !alternativePayer &&
                !alternativeDunningRcpnt &&
                !alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId})`;
            }
            if (
                businessPartner &&
                !alternativePayee &&
                !alternativePayer &&
                alternativeDunningRcpnt &&
                alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${AltDunningId} or ${AltCorrespondenceId})`;
            }
            if (
                businessPartner &&
                !alternativePayee &&
                alternativePayer &&
                !alternativeDunningRcpnt &&
                alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayerId} or ${AltCorrespondenceId})`;
            }
            if (
                businessPartner &&
                !alternativePayee &&
                alternativePayer &&
                alternativeDunningRcpnt &&
                !alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayerId} or ${AltDunningId})`;
            }
            if (
                businessPartner &&
                alternativePayee &&
                !alternativePayer &&
                !alternativeDunningRcpnt &&
                alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayeeId} or ${AltCorrespondenceId})`;
            }
            if (
                businessPartner &&
                alternativePayee &&
                !alternativePayer &&
                alternativeDunningRcpnt &&
                !alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayeeId} or ${AltDunningId})`;
            }
            if (
                businessPartner &&
                alternativePayee &&
                alternativePayer &&
                !alternativeDunningRcpnt &&
                !alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayeeId} or ${PayerId})`;
            }
            if (
                businessPartner &&
                !alternativePayee &&
                !alternativePayer &&
                !alternativeDunningRcpnt &&
                alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${AltCorrespondenceId})`;
            }
            if (
                businessPartner &&
                alternativePayee &&
                !alternativePayer &&
                !alternativeDunningRcpnt &&
                !alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayeeId})`;
            }
            if (
                businessPartner &&
                !alternativePayee &&
                alternativePayer &&
                !alternativeDunningRcpnt &&
                !alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${PayerId})`;
            }
            if (
                businessPartner &&
                !alternativePayee &&
                !alternativePayer &&
                alternativeDunningRcpnt &&
                !alternativeCorrespondenceRcpnt
            ) {
                return `${BSFilter} and (${BPId} or ${AltDunningId})`;
            }
        }
        if (
            !businessSystem &&
            !businessPartner &&
            !alternativePayee &&
            !alternativePayer &&
            !alternativeDunningRcpnt &&
            !alternativeCorrespondenceRcpnt
        ) {
            logger.error('No Id provided to fetch key mapping ');
            return [];
        }

        return false;
    }

    /* eslint-disable class-methods-use-this */
    async getBPKeyMappingByBpUUID(
        req,
        businessPartnerId,
        businessSystem,
        alternativePayeeId,
        alternativePayerId,
        alternativeDunningRcpntId,
        alternativeCorrespondenceRcpntId
    ) {
        try {
            const bpKeyMappingService = await cds.connect.to(
                'BusinessPartnerKeyMappingService'
            );
            const method = 'GET';
            const entity = '/BusinessPartnerKeyMapping';

            const filter =
                businessPartnerKeyMappingService.getBPKeyMappingByBpUUIDFilter(
                    businessPartnerId,
                    alternativePayeeId,
                    alternativePayerId,
                    alternativeDunningRcpntId,
                    alternativeCorrespondenceRcpntId
                );

            if (!filter) {
                return [];
            }

            const query = `${method} ${entity}?$format=json&$filter=(${filter})`;
            try {
                const response = await bpKeyMappingService.tx(req).run(query);

                if (response.length) {
                    let keyMappingGrpIdForBP;
                    let keyMappingGrpIdForAlternatePayee;
                    let keyMappingGrpIdForAlternatePayer;
                    let keyMappingGrpIdForAlternativeDunning;
                    let keyMappingGrpIdForAlternativeCorrespondence;

                    response.forEach((record) => {
                        if (record.BusinessPartnerId === businessPartnerId) {
                            keyMappingGrpIdForBP = record.KeymappingGroupID;
                        }

                        if (record.BusinessPartnerId === alternativePayeeId) {
                            keyMappingGrpIdForAlternatePayee =
                                record.KeymappingGroupID;
                        }

                        if (record.BusinessPartnerId === alternativePayerId) {
                            keyMappingGrpIdForAlternatePayer =
                                record.KeymappingGroupID;
                        }

                        if (
                            record.BusinessPartnerId ===
                            alternativeDunningRcpntId
                        ) {
                            keyMappingGrpIdForAlternativeDunning =
                                record.KeymappingGroupID;
                        }

                        if (
                            record.BusinessPartnerId ===
                            alternativeCorrespondenceRcpntId
                        ) {
                            keyMappingGrpIdForAlternativeCorrespondence =
                                record.KeymappingGroupID;
                        }
                    });

                    const keyMappingGroupIDFilter =
                        businessPartnerKeyMappingService.getBPKeyMappingByGroupIDFilter(
                            keyMappingGrpIdForBP,
                            keyMappingGrpIdForAlternatePayee,
                            keyMappingGrpIdForAlternatePayer,
                            keyMappingGrpIdForAlternativeDunning,
                            keyMappingGrpIdForAlternativeCorrespondence,
                            businessSystem
                        );

                    if (!keyMappingGroupIDFilter) {
                        return [];
                    }

                    const groupIDquery = `${method} ${entity}?$format=json&$filter=(${keyMappingGroupIDFilter})`;
                    const groupIdResponse = await bpKeyMappingService
                        .tx(req)
                        .run(groupIDquery);

                    if (groupIdResponse.length) {
                        let bps4DisplayId;
                        let alternativePayee;
                        let alternativePayer;
                        let alternativeDunningRcpnt;
                        let alternativeCorrespondenceRcpnt;

                        groupIdResponse.forEach((record) => {
                            if (
                                record.KeymappingGroupID ===
                                keyMappingGrpIdForBP
                            ) {
                                bps4DisplayId = record.BusinessPartner;
                            }

                            if (
                                record.KeymappingGroupID ===
                                keyMappingGrpIdForAlternatePayee
                            ) {
                                alternativePayee = record.BusinessPartner;
                            }

                            if (
                                record.KeymappingGroupID ===
                                keyMappingGrpIdForAlternatePayer
                            ) {
                                alternativePayer = record.BusinessPartner;
                            }

                            if (
                                record.KeymappingGroupID ===
                                keyMappingGrpIdForAlternativeDunning
                            ) {
                                alternativeDunningRcpnt =
                                    record.BusinessPartner;
                            }

                            if (
                                record.KeymappingGroupID ===
                                keyMappingGrpIdForAlternativeCorrespondence
                            ) {
                                alternativeCorrespondenceRcpnt =
                                    record.BusinessPartner;
                            }

                            if (alternativePayeeId === null) {
                                alternativePayee = null;
                            }

                            if (alternativePayerId === null) {
                                alternativePayer = null;
                            }

                            if (alternativeDunningRcpntId === null) {
                                alternativeDunningRcpnt = null;
                            }

                            if (alternativeCorrespondenceRcpntId === null) {
                                alternativeCorrespondenceRcpnt = null;
                            }
                        });

                        return [
                            bps4DisplayId,
                            alternativePayee,
                            alternativePayer,
                            alternativeDunningRcpnt,
                            alternativeCorrespondenceRcpnt,
                        ];
                    }
                }
                logger.error(
                    `[API_BP_KEY_MAPPING] Business partner not available in S4HC; change your entry'`
                );
            } catch (error) {
                logger.error(
                    `[API_BP_KEY_MAPPING] Error fetching key mapping: ${error}`
                );
            }
        } catch (error) {
            logger.error(`[API_BP_KEY_MAPPING] Error fetching BP ID: ${error}`);
        }
        return [];
    }

    async parseInt(id) {
        parseInt(id, 10).toString();
    }

    async getBPKeyMappingByBpDisplayId(
        req,
        businessPartner,
        businessSystem,
        alternativePayee,
        alternativePayer,
        alternativeDunningRcpnt,
        alternativeCorrespondenceRcpnt
    ) {
        try {
            const bpKeyMappingService = await cds.connect.to(
                'BusinessPartnerKeyMappingService'
            );
            const method = 'GET';
            const entity = '/BusinessPartnerKeyMapping';

            const filter =
                businessPartnerKeyMappingService.getBPKeyMappingByBPDisplayIDFilter(
                    businessSystem,
                    businessPartner,
                    alternativePayee,
                    alternativePayer,
                    alternativeDunningRcpnt,
                    alternativeCorrespondenceRcpnt
                );

            if (!filter) {
                return [];
            }

            const query = `${method} ${entity}?$format=json&$filter=(${filter})`;
            try {
                const response = await bpKeyMappingService.tx(req).run(query);
                if (response.length) {
                    let businessPartnerId;
                    let alternativePayeeId;
                    let alternativePayerId;
                    let alternativeDunningRcpntId;
                    let alternativeCorrespondenceRcpntId;
                    const resLength = response.length;

                    if (businessPartner) {
                        businessPartner = parseInt(
                            businessPartner,
                            10
                        ).toString();
                    }
                    if (alternativePayee) {
                        alternativePayee = parseInt(
                            alternativePayee,
                            10
                        ).toString();
                    }
                    if (alternativePayer) {
                        alternativePayer = parseInt(
                            alternativePayer,
                            10
                        ).toString();
                    }
                    if (alternativeDunningRcpnt) {
                        alternativeDunningRcpnt = parseInt(
                            alternativeDunningRcpnt,
                            10
                        ).toString();
                    }
                    if (alternativeCorrespondenceRcpnt) {
                        alternativeCorrespondenceRcpnt = parseInt(
                            alternativeCorrespondenceRcpnt,
                            10
                        ).toString();
                    }

                    /* eslint-disable no-plusplus */
                    for (let i = 0; i < resLength; i++) {
                        if (response[i].BusinessPartner === businessPartner) {
                            businessPartnerId = response[i].BusinessPartnerId;
                        }
                        if (response[i].BusinessPartner === alternativePayee) {
                            alternativePayeeId = response[i].BusinessPartnerId;
                        }
                        if (response[i].BusinessPartner === alternativePayer) {
                            alternativePayerId = response[i].BusinessPartnerId;
                        }
                        if (
                            response[i].BusinessPartner ===
                            alternativeDunningRcpnt
                        ) {
                            alternativeDunningRcpntId =
                                response[i].BusinessPartnerId;
                        }
                        if (
                            response[i].BusinessPartner ===
                            alternativeCorrespondenceRcpnt
                        ) {
                            alternativeCorrespondenceRcpntId =
                                response[i].BusinessPartnerId;
                        }
                        if (alternativePayee === null) {
                            alternativePayeeId = null;
                        }
                        if (alternativePayer === null) {
                            alternativePayerId = null;
                        }
                        if (alternativeDunningRcpnt === null) {
                            alternativeDunningRcpntId = null;
                        }
                        if (alternativeCorrespondenceRcpnt === null) {
                            alternativeCorrespondenceRcpntId = null;
                        }
                    }
                    return [
                        businessPartnerId,
                        alternativePayeeId,
                        alternativePayerId,
                        alternativeDunningRcpntId,
                        alternativeCorrespondenceRcpntId,
                    ];
                }
                // eslint-disable-next-line no-else-return
                else {
                    logger.error(
                        `[API_BP_KEY_MAPPING.js]:Business partner not available; change your entry`
                    );
                    return [];
                }
            } catch (error) {
                logger.error(
                    `[API_BP_KEY_MAPPING.js] Error fetching key mapping:, ${error}`
                );
            }
        } catch (error) {
            logger.error(
                `[API_BP_KEY_MAPPING.js]: Error fetching BP ID: ${error}`
            );
        }
        return [];
    }
}

module.exports = businessPartnerKeyMappingService;
