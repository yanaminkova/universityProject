/* eslint-disable no-console */
const fs = require('fs');

const langArg = process.argv.find((arg) => arg.startsWith('--lang'));
const lang = langArg ? langArg.split('=')[1] : '';
const i18nDirs = ['_i18n', 'db', 'srv'].map(
    (i18nDir) => `${__dirname}/../../${i18nDir}/`
);
const fileLangSuffix = lang ? `_${lang}.properties` : `.properties`;

function recursiveCollectFilesNames(dirs) {
    let results = [];
    dirs.forEach((dir) => {
        const list = fs.readdirSync(dir);
        list.forEach((file) => {
            const fName = `${dir}/${file}`;
            const stat = fs.statSync(fName);
            if (stat && stat.isDirectory()) {
                /* Recurse into a subdirectory */
                results = results.concat(recursiveCollectFilesNames([fName]));
            } else {
                /* Is a file */
                results.push(fName);
            }
        });
    });
    return results;
}

const i18nFilesNames = recursiveCollectFilesNames(i18nDirs).filter((fName) =>
    fName.endsWith(fileLangSuffix)
);

const i18nHashMap = new Map();

i18nFilesNames.forEach((fName) => {
    const fileRows = fs
        .readFileSync(fName, 'utf8')
        .split('\r\n')
        .filter((row) => row && !row.startsWith('#') && row.includes('='));

    fileRows.forEach((row) => {
        const [key, value] = row.split('=');
        if (i18nHashMap.has(key)) {
            console.warn(
                `[i18n2docs] Duplicate i18nKey "${key}" in file ${fName}.`
            );
        } else {
            i18nHashMap.set(key, value);
        }
    });
});

const apiPaths = [
    `${__dirname}/../../docs/api/openapi/`,
    `${__dirname}/../../docs/api/edmx/`,
];

apiPaths.forEach((apiPath) => {
    const openApiFiles = fs
        .readdirSync(apiPath)
        .filter((file) => file.endsWith('.json') || file.endsWith('.edmx'));

    openApiFiles.forEach((file) => {
        const fileContent = fs.readFileSync(`${apiPath}${file}`, 'utf8');
        // eslint-disable-next-line arrow-body-style
        const missingI18nKeys = new Set();
        const newFileContent = fileContent.replace(
            /\{i18n>[a-zA-Z0-9_-]+\}/g,
            (match) => {
                const hashMapKey = match.split('>')[1].split('}')[0];
                if (!i18nHashMap.get(hashMapKey)) {
                    missingI18nKeys.add(hashMapKey);
                }
                return i18nHashMap.get(hashMapKey) || match;
            }
        );

        if (missingI18nKeys.size) {
            // eslint-disable-next-line no-console
            console.warn(
                `Next i18n keys are missing for the file ${file}:\r\n${[
                    ...missingI18nKeys,
                ].join('\r\n')}\r\n`
            );
        }
        fs.writeFileSync(`${apiPath}${file}`, newFileContent, 'utf8');
    });
});
