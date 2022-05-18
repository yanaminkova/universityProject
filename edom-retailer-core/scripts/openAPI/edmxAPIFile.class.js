/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const { DOMParser, XMLSerializer } = require('xmldom');
// eslint-disable-next-line import/no-unresolved
const XMLFormatter = require('xml-formatter');

class edmxAPIFile {
    constructor(fPath) {
        this.path = fPath;
        this.file = new DOMParser().parseFromString(
            fs.readFileSync(this.path, 'utf8')
        );

        this.dataServicesNode = this.file
            .getElementsByTagName('edmx:Edmx')
            .item(0)
            .getElementsByTagName('edmx:DataServices')
            .item(0);
    }

    getSchemas() {
        const liveNodeList =
            this.dataServicesNode.getElementsByTagName('Schema');
        const arrayOfSchemas = [];

        for (let i = 0; i < liveNodeList.length; i += 1) {
            arrayOfSchemas.push(liveNodeList.item(i));
        }
        return arrayOfSchemas;
    }

    addSchema(schema2add) {
        const match = this.getSchemas().find(
            (sourceSchema) =>
                sourceSchema.getAttribute('Namespace') ===
                schema2add.getAttribute('Namespace')
        );

        if (match) {
            edmxAPIFile.mergeSchemas(match, schema2add);
        } else {
            this.dataServicesNode.appendChild(schema2add);
        }
    }

    static mergeSchemas(sourceSchema, schema2add) {
        const sourceNodes = [];
        const addNodes = [];

        for (let i = 0; i < sourceSchema.childNodes.length; i += 1) {
            if (sourceSchema.childNodes.item(i).nodeName !== '#text') {
                sourceNodes.push(sourceSchema.childNodes.item(i));
            }
        }

        for (let i = 0; i < schema2add.childNodes.length; i += 1) {
            if (schema2add.childNodes.item(i).nodeName !== '#text') {
                addNodes.push(schema2add.childNodes.item(i));
            }
        }

        addNodes.forEach((addNode) => {
            const match = sourceNodes.find((node) => {
                if (node.nodeName === addNode.nodeName) {
                    switch (node.nodeName) {
                        case 'EntityType':
                            return (
                                node.getAttribute('Name') ===
                                addNode.getAttribute('Name')
                            );
                        case 'ComplexType':
                            return (
                                node.getAttribute('Name') ===
                                addNode.getAttribute('Name')
                            );
                        case 'Annotations':
                            return (
                                node.getAttribute('Target') ===
                                addNode.getAttribute('Target')
                            );
                        default:
                            return false;
                    }
                }
                return false;
            });

            if (!match) {
                sourceSchema.appendChild(addNode);
            } else {
                console.warn(
                    `[edmx merge conflict] ${schema2add.getAttribute(
                        'Namespace'
                    )}`
                );
            }
        });
    }

    mergeWith(edmxFile) {
        console.warn(`\n[merge] ${this.path} with ${edmxFile.path}`);
        const edmxAPIFileDataSchemasNodes = edmxFile.getSchemas();

        edmxAPIFileDataSchemasNodes.forEach((schema) => {
            this.addSchema(schema);
        });

        return this;
    }

    saveFile(saveAs) {
        const XMLAsString = XMLFormatter(
            new XMLSerializer().serializeToString(this.file)
        );
        fs.writeFileSync(saveAs || this.path, XMLAsString, 'utf8');
    }
}

module.exports = edmxAPIFile;
