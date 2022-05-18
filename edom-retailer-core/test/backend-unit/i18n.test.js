const expect = require('expect');

describe('i18n files unit-test', () => {
    const fs = require('fs');
    const i18nDirs = ['_i18n', 'db', 'srv', 'app'].map(
        (i18nDir) => `${__dirname}/../../${i18nDir}/`
    );
    const i18nFileOrig = 'i18n.properties';

    function recursiveCollectFilesNames(dirs) {
        let results = [];
        dirs.forEach((dir) => {
            const list = fs.readdirSync(dir);
            list.forEach((file) => {
                const fName = `${dir}/${file}`;
                const stat = fs.statSync(fName);
                if (stat && stat.isDirectory()) {
                    /* Recurse into a subdirectory */
                    results = results.concat(
                        recursiveCollectFilesNames([fName])
                    );
                } else {
                    /* Is a file */
                    results.push(fName);
                }
            });
        });
        return results;
    }

    const i18nFilesNames = recursiveCollectFilesNames(i18nDirs).filter(
        (fName) => {
            return fName.endsWith(i18nFileOrig);
        }
    );

    it('should check duplicate keys in i18n files', () => {
        const i18nHashMap = new Map();
        let duplicateKeyCount = 0;
        i18nFilesNames.forEach((fName) => {
            const fileRows = fs
                .readFileSync(fName, 'utf8')
                .split('\n')
                .filter((row) => {
                    if (row && !row.startsWith('#') && row.includes('=')) {
                        return row;
                    }
                });

            fileRows.forEach((row) => {
                const [key, value] = row.split('=');

                if (i18nHashMap.has(key)) {
                    console.error(
                        `Duplicate i18nKey "${key}" in file ${fName}.`
                    );
                    duplicateKeyCount++;
                } else {
                    i18nHashMap.set(key, value);
                }
            });
        });
        console.warn(`Checked ${i18nHashMap.size} i18n keys.`);
        expect(duplicateKeyCount).toBe(0);
    });
});
