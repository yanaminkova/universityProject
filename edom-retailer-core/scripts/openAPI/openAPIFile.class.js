const fs = require('fs');

class openAPIFile {
    constructor(fPath, customProperties = {}, customComponents = {}) {
        this.fPath = fPath;
        // eslint-disable-next-line import/no-dynamic-require
        this.file = require(this.fPath);
        Object.assign(this.file, customProperties);
        Object.assign(this.file.components, customComponents);
        this.codesTagName = 'Customizing and Configuration';
    }

    // all merges must be done as a first step
    mergeWith(openApiFile) {
        // add missing tags
        openApiFile.file.tags.forEach((openApiFileTag) => {
            if (
                !this.file.tags.find((tag) => tag.name === openApiFileTag.name)
            ) {
                this.file.tags.push(openApiFileTag);
            }
        });

        const openApiFilePaths = Object.keys(openApiFile.file.paths);
        const thisFilePaths = Object.keys(this.file.paths);

        // add missing paths
        openApiFilePaths.forEach((path) => {
            if (!thisFilePaths.includes(path)) {
                this.file.paths[path] = openApiFile.file.paths[path];
            } else {
                // eslint-disable-next-line no-console
                console.warn(
                    `Path ${path} already exists in ${this.file.servers[0].url}`
                );
            }
        });

        const openApiFileSchemas = Object.keys(
            openApiFile.file.components.schemas
        );
        const thisFileSchemas = Object.keys(this.file.components.schemas);

        // add missing schemas
        openApiFileSchemas.forEach((schema) => {
            if (!thisFileSchemas.includes(schema)) {
                this.file.components.schemas[schema] =
                    openApiFile.file.components.schemas[schema];
            }
        });

        return this;
    }

    // after all necessary OpenAPI files are merged we can prepare dummies for data conversion
    prepareInitialProperties() {
        this.allTags = this.file.tags.map((tag) => tag.name);

        if (!this.file.tags.find((x) => x.name === this.codesTagName)) {
            this.file.tags.push({
                name: this.codesTagName,
            });
        }

        this.tags = this.file.tags;
        this.paths = this.file.paths;
        this.groupsByTags = [];
        this.keyHashMap = {};
        this.convertedPaths = {};

        return this;
    }

    // we need groups of paths by tags to be able to sort tags
    createGroupsByTags() {
        this.groupsByTags = this.allTags.map(
            (tag) => ({
                name: tag,
                widthLevel: 0,
                depthLevel: 1,
                paths: [],
                usedIn: new Set(),
            }),
            {}
        );

        return this;
    }

    // just a map between string key of group and its position in the list
    createKeyHashMap() {
        this.keyHashMap = this.groupsByTags.reduce((hashMap, group, index) => {
            // eslint-disable-next-line no-param-reassign
            hashMap[group.name] = index;
            return hashMap;
        }, {});

        return this;
    }

    // convert all tags names from "camelCase" by adding space before each capital letter
    renameAllTags() {
        this.file.tags.forEach((tag) => {
            // eslint-disable-next-line no-param-reassign
            tag.name = openAPIFile.splitStringByWords(tag.name);
        });

        Object.keys(this.file.paths).forEach((path) => {
            const methods = Object.keys(this.file.paths[path]);
            methods.forEach((method) => {
                if (this.file.paths[path][method].tags) {
                    this.file.paths[path][method].tags.forEach((tag, index) => {
                        // eslint-disable-next-line
                        this.file.paths[path][method].tags[index] =
                            openAPIFile.splitStringByWords(tag);
                    });
                }
            });
        });

        return this;
    }

    // converts "MyWordInCamelCase" to "My Word In Camel Case"
    static splitStringByWords(str) {
        return str
            .split(/(?=[A-Z])/)
            .map((word) => word.trim())
            .join(' ');
    }

    // returns keys of path with tags
    getPropsWithTags(path) {
        return Object.keys(this.paths[path]).filter(
            (key) => this.paths[path][key].tags
        );
    }

    // get a tag to put the path under
    getTargetTag(props, path) {
        return props.length
            ? this.paths[path][props[0]].tags[0]
            : this.allTags.find(
                  (tag) => path === `/${tag}` || path.startsWith(`/${tag}(`)
              );
    }

    /**
     * the methos has few different goals
     * 1. each path must stay with only 1 tag so there's a logic to pick a one
     * 2. the *Codes and *Code tags must be deleted
     *  */
    cleanUnneededTags() {
        Object.keys(this.paths).forEach((path) => {
            const propsWithTags = this.getPropsWithTags(path);
            propsWithTags.forEach((prop) => {
                for (
                    let i = 0;
                    i < this.paths[path][prop].tags.length;
                    i += 1
                ) {
                    if (
                        this.paths[path][prop].tags[i].endsWith('Codes') ||
                        this.paths[path][prop].tags[i].endsWith('Code')
                    ) {
                        const tagName = this.paths[path][prop].tags[i];
                        this.paths[path][prop].tags.splice(i, 1);
                        i -= 1;
                        if (!this.paths[path][prop].tags[0]) {
                            this.paths[path][prop].tags.push(this.codesTagName);
                        }
                        const allTagsIndex = this.allTags.findIndex(
                            (tag) => tag === tagName
                        );
                        if (allTagsIndex >= 0) {
                            this.allTags.splice(allTagsIndex, 1);
                        }

                        const tagsIndex = this.tags.findIndex(
                            (tag) => tag.name === tagName
                        );
                        if (tagsIndex >= 0) {
                            this.tags.splice(tagsIndex, 1);
                        }
                    }
                }

                if (this.paths[path][prop].tags.length > 1) {
                    this.paths[path][prop].tags = this.paths[path][
                        prop
                    ].tags.slice(0, 1);
                }
            });
        });

        return this;
    }

    /**
     * the method cleans locale paths
     */
    cleanUnneededPaths() {
        Object.keys(this.file.paths).forEach((path) => {
            if (
                path.endsWith('/texts') ||
                path.endsWith('/localized') ||
                path.endsWith("/texts('{locale_1}')") ||
                path.includes('/up_') ||
                path.includes('/BusinessPartnerAddressData') ||
                path.includes('/BusinessPartner')
            ) {
                delete this.file.paths[path];
            }
        });

        return this;
    }

    fixObjectObjectPaths() {
        const regex = /\[object Object\]='\{([a-zA-Z0-9_-]+)\}'/;
        Object.keys(this.file.paths).forEach((path) => {
            const result = regex.exec(path);
            if (result) {
                const newPath = path.replace('[object Object]', result[1]);
                this.file.paths[newPath] = this.file.paths[path];
                delete this.file.paths[path];
            }
        });

        return this;
    }

    /**
     * the methos has a few different goals
     * 1. add as much criteria for further sortation of tags groups if possible
     * 2. add missing tags with {prio: 'low'} e.g Batch Requests
     */
    calculateSortationCriteria() {
        Object.keys(this.paths).forEach((path) => {
            const propsWithTags = this.getPropsWithTags(path);
            const targetTag = this.getTargetTag(propsWithTags, path);

            const depthLevel = path.split('/').length - (path.endsWith('/'), 1);

            if (!this.groupsByTags[this.keyHashMap[targetTag]]) {
                this.groupsByTags.push({
                    name: targetTag,
                    widthLevel: 0,
                    depthLevel: 1,
                    paths: [],
                    prio: 'low',
                });
                this.keyHashMap[targetTag] = this.groupsByTags.length - 1;
            }

            const group = this.groupsByTags[this.keyHashMap[targetTag]];

            group.paths.push(path);

            group.widthLevel += 1;
            group.depthLevel =
                group.depthLevel < depthLevel ? depthLevel : group.depthLevel;
        });

        return this;
    }

    // sorting tags groups - later tags will follow this order
    sortGroups() {
        this.groupsByTags.sort((a, b) => {
            // 'prio: low' - very last tags in the list
            if (a.prio === 'low' && a.prio !== b.prio) return 1;
            if (b.prio === 'low' && a.prio !== b.prio) return -1;

            // any configuration paths like *Codes, *Code and *Mapping are next last ones
            if (
                (a.name.endsWith('Codes') || a.name.endsWith('Code')) &&
                !(b.name.endsWith('Codes') || b.name.endsWith('Code'))
            )
                return 1;
            if (
                (b.name.endsWith('Codes') || b.name.endsWith('Code')) &&
                !(a.name.endsWith('Codes') || a.name.endsWith('Code'))
            )
                return -1;

            if (a.name.endsWith('Mapping') && !b.name.endsWith('Mapping'))
                return 1;
            if (b.name.endsWith('Mapping') && !a.name.endsWith('Mapping'))
                return -1;

            // items with bigger depth level should be more important then with a lower one
            if (a.depthLevel < b.depthLevel) return 1;
            if (a.depthLevel > b.depthLevel) return -1;

            // questionable but if depth level is the same - more width level (more paths in the same group) has more priority
            if (a.widthLevel < b.widthLevel) return 1;
            if (a.widthLevel > b.widthLevel) return -1;

            // if no other criteria - just sort by name
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;

            // this should never happen as there're no same paths, still holding the row for function consistency
            // it it happens - 2 paths will just follow each other as by initial order
            return 0;
        });

        return this;
    }

    // creating completely new (ordered) set of paths, replacing the initial one
    extractGroups() {
        this.groupsByTags.forEach((group) => {
            group.paths.forEach((path) => {
                this.convertedPaths[path] = this.paths[path];
            });
        });

        this.file.paths = this.convertedPaths;

        return this;
    }

    // apply tags sortation, easier to do by new paths list rather then to use groupsOfTags
    sortTags() {
        this.allTags = [];
        Object.keys(this.file.paths).forEach((path) => {
            Object.keys(this.file.paths[path]).forEach((method) => {
                const tag = this.file.paths[path][method].tags?.[0];
                if (tag && !this.allTags.includes(tag)) {
                    this.allTags.push(tag);
                }
            });
        });
        this.file.tags = this.allTags.map((tag) => ({ name: tag }));
    }

    saveFile(newFPath) {
        fs.writeFileSync(
            newFPath || this.fPath,
            JSON.stringify(this.file, null, 4),
            'utf8'
        );
        return this;
    }
}

module.exports = openAPIFile;
