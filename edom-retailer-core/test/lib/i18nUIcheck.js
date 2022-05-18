/* eslint-disable no-console */
const fs = require('fs');

function checkPathExistance(sFilePath) {
    if (!fs.existsSync(sFilePath)) {
        throw new Error(`Scan directory ${sFilePath} does not exist`);
    }
}

function getKeysFromAnnotationsFile(sFilePath) {
    const i18nLabelMap = new Map();
    const i18nKeys = new Set();
    const fileContent = fs.readFileSync(sFilePath, 'utf8');
    const regex = /\'(.*)?\{i18n>([^\s]+)\}(.*)?\'/g;

    let match;

    while ((match = regex.exec(fileContent))) {
        const [, preffix, i18nKey, suffix] = match;
        i18nKeys.add(i18nKey);
        if (!i18nLabelMap.has(i18nKey)) {
            i18nLabelMap.set(i18nKey, {
                preffix: preffix || '',
                suffix: suffix || '',
            });
        }
    }

    return i18nLabelMap;
}

function getStringsFromMetadata(metadata) {
    const aStrings = [];
    const rows = metadata
        .split('\n')
        .filter((row) => row && row.includes('String='));

    rows.forEach((row) => {
        const key = row.match(/(?<=String=").+?(?=")/g)[0];
        aStrings.push(key);
    });
    return aStrings;
}

function doesFileMissAnyProperties(metadata, labelMap) {
    const metadataStrings = getStringsFromMetadata(metadata);
    let missingKeys = [];

    for (i18nKey of labelMap.keys()) {
        const { preffix, suffix } = labelMap.get(i18nKey);
        if (metadataStrings.includes(`${preffix}${i18nKey}${suffix}`)) {
            missingKeys.push(i18nKey);
        }
    }

    return missingKeys;
}

function checkForMissingKeys(sAnnotationFilePath, metadata) {
    checkPathExistance(sAnnotationFilePath);
    const aCurrentProperties = getKeysFromAnnotationsFile(sAnnotationFilePath);

    return doesFileMissAnyProperties(metadata, aCurrentProperties);
}

module.exports = {
    checkPathExistance,
    getKeysFromAnnotationsFile,
    getStringsFromMetadata,
    doesFileMissAnyProperties,
    checkForMissingKeys,
};
