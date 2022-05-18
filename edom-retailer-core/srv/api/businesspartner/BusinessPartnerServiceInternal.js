const AuditLogService = require('../../dpp/AuditLogService');

module.exports = async (srv) => {
    AuditLogService.registerHandler(srv);
};
