class MDIClientHelper {
    static isField(element, type, relationship) {
        return element?.type === `cds.${type}` && element[relationship];
    }

    static storeIfKey(isKey, newObjKeys, objTempValue, key, actualKeysHolder) {
        const newObjKeysTemp = newObjKeys;
        if (isKey && !key.startsWith('up__')) {
            newObjKeysTemp[key] = objTempValue;
            actualKeysHolder.push(key);
        }
    }

    static translateLog(event, changeToken, instance, createInstanceIds) {
        let action;
        const isCreateInstanceId = createInstanceIds[instance] !== undefined;
        const isChangeToken = changeToken !== undefined;

        if (event !== 'rejected' && isChangeToken) {
            action = 'confirm';
        } else if (
            event === 'created' ||
            (event === 'updated' && isCreateInstanceId)
        ) {
            action = 'create';
        } else if (event === 'updated' && !isCreateInstanceId) {
            action = 'update';
        } else if (event === 'rejected' && isChangeToken) {
            action = 'reject';
        }
        return action;
    }

    static translateProductLog(event, instance, createInstanceIds) {
        let action;
        const isCreateInstanceId = createInstanceIds[instance] !== undefined;
        if (
            event === 'created' ||
            (event === 'updated' && isCreateInstanceId)
        ) {
            action = 'create';
        } else if (event === 'updated' && !isCreateInstanceId) {
            action = 'update';
        }

        return action;
    }

    static getNextLink(response) {
        const deltaLink =
            response['@odata.deltaLink'] &&
            response['@odata.deltaLink'].split('deltatoken=')[1];
        const nextLink =
            response['@odata.nextLink'] &&
            response['@odata.nextLink'].split('deltatoken=')[1];

        const finalToken = nextLink || deltaLink;

        return { nextLink, finalToken };
    }
}

module.exports = MDIClientHelper;
