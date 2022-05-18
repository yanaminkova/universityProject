class DataPrivacyAndProtectionConstants {
    static get AUDIT_LOG_DEFAULT() {
        return '-';
    }

    static get POTENTIALLY_SENSITIVE() {
        return '@PersonalData.IsPotentiallySensitive';
    }

    static get POTENTIALLY_PERSONAL() {
        return '@PersonalData.IsPotentiallyPersonal';
    }

    static get FIELD_SEMANTICS() {
        return '@PersonalData.FieldSemantics';
    }
}

module.exports = DataPrivacyAndProtectionConstants;
