const expect = require('expect');

const {
    recursivePopulateProperties,
    extractPathFromJson,
    hasSubsetFields,
} = require('../../../srv/lib/helper');

const resultString = 'resultString';
const json2extract = {
    a: {
        b: [{ c: resultString }],
    },
};

describe('lib.helper.test', () => {
    it('should recursively assign several properties to deep object', () => {
        const object2populate = {
            booleanProperty: false,
            stringProperty: 'string',
            decimalProperty: 11111.11,
            objectProperty: {
                stringProperty: 'string',
                decimalProperty: 11111.11,
                integerProperty: 10,
            },
            arrayProperty: [
                {
                    booleanProperty: false,
                    stringProperty: 'string',
                    objectProperty: {
                        stringProperty: 'string',
                        decimalProperty: 11111.11,
                    },
                },
            ],
        };

        recursivePopulateProperties(object2populate, {
            booleanProperty: true,
            stringProperty: 'anotherString',
            decimalProperty: 22.222,
            integerProperty: 20,
        });

        expect(object2populate).toEqual({
            booleanProperty: true,
            stringProperty: 'anotherString',
            decimalProperty: 22.222,
            objectProperty: {
                stringProperty: 'anotherString',
                decimalProperty: 22.222,
                integerProperty: 20,
            },
            arrayProperty: [
                {
                    booleanProperty: true,
                    stringProperty: 'anotherString',
                    objectProperty: {
                        stringProperty: 'anotherString',
                        decimalProperty: 22.222,
                    },
                },
            ],
        });
    });

    it('should not change anything when recursively assign fields which are not in the object', () => {
        const object2populate = {
            booleanProperty: false,
            stringProperty: 'string',
            decimalProperty: 11111.11,
            objectProperty: {
                stringProperty: 'string',
                decimalProperty: 11111.11,
            },
            arrayProperty: [
                {
                    booleanProperty: false,
                    stringProperty: 'string',
                    objectProperty: {
                        stringProperty: 'string',
                        decimalProperty: 11111.11,
                    },
                },
            ],
        };

        recursivePopulateProperties(object2populate, {
            wrongBooleanProperty: true,
            wrongStringProperty: 'anotherString',
            wrongIntegerProperty: 20,
        });

        expect(object2populate).toEqual({
            booleanProperty: false,
            stringProperty: 'string',
            decimalProperty: 11111.11,
            objectProperty: {
                stringProperty: 'string',
                decimalProperty: 11111.11,
            },
            arrayProperty: [
                {
                    booleanProperty: false,
                    stringProperty: 'string',
                    objectProperty: {
                        stringProperty: 'string',
                        decimalProperty: 11111.11,
                    },
                },
            ],
        });
    });

    it('should extract path from json', () => {
        const result = extractPathFromJson(json2extract, 'a/b/0/c');
        expect(result).toBe(resultString);
    });

    it('should extract path from json with non-default delimiter', () => {
        const result = extractPathFromJson(json2extract, 'a.b.0.c', '.');
        expect(result).toBe(resultString);
    });

    it('should not extract non-existing path from json', () => {
        const result = extractPathFromJson(json2extract, 'a/b/1/c');
        expect(result).toBeFalsy();
    });

    it('should not extract path from json due to wrong delimiter', () => {
        const result = extractPathFromJson(json2extract, 'a.b.1.c');
        expect(result).toBeFalsy();
    });

    it('should not extract path from json due to wrong path', () => {
        const result = extractPathFromJson(json2extract, 'a/b/1/c');
        expect(result).toBeFalsy();
    });

    it('should return true if A contain all fields of B', () => {
        const B = {
            field1: '1',
            field2: '2',
        };

        const A = {
            field1: '1',
            field2: '2',
            field3: '3',
        };

        expect(hasSubsetFields(A, B)).toBeTruthy();
    });

    it('should return false if A does not contain all fields of B', () => {
        const B = {
            field1: '1',
            field2: '2',
            field3: '3',
        };

        const A1 = {
            field1: '1',
            field3: '3',
        };

        const A2 = {
            field1: '1',
            field2: '2',
            field3: '4',
        };

        expect(hasSubsetFields(A1, B)).toBeFalsy();
        expect(hasSubsetFields(A2, B)).toBeFalsy();
    });

    it('should return true if A contain all fields of B (with nested object)', () => {
        const B = {
            field1: '1',
            field2: '2',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
            },
        };

        const A = {
            field1: '1',
            field2: '2',
            field3: '3',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
                obj1_field3: 'o1_3',
            },
        };

        expect(hasSubsetFields(A, B)).toBeTruthy();
    });

    it('should return false if A does not contain all fields of B (with nested object)', () => {
        const B = {
            field1: '1',
            field2: '2',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
                obj1_field3: 'o1_3',
            },
        };

        const A1 = {
            field1: '1',
            field2: '2',
            field3: '3',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field3: 'o1_3',
            },
        };

        const A2 = {
            field1: '1',
            field2: '2',
            field3: '3',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
                obj1_field3: 'o1_4',
            },
        };

        expect(hasSubsetFields(A1, B)).toBeFalsy();
        expect(hasSubsetFields(A2, B)).toBeFalsy();
    });

    it('should return true if A contain all fields of B (with nested array)', () => {
        const B = {
            field1: '1',
            field2: '2',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
            },
            array1: [
                {
                    arr1_obj_1_field1: 'a1_o1_1',
                    arr1_obj_1_field2: 'a1_o1_2',
                    arr1_obj_1_field3: 'a1_o1_3',
                },
                {
                    arr1_obj_2_field1: 'a1_o2_1',
                    arr1_obj_2_field2: 'a1_o2_2',
                    arr1_obj_2_field3: 'a1_o2_3',
                },
            ],
        };

        const A = {
            field1: '1',
            field2: '2',
            field3: '3',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
                obj1_field3: 'o1_3',
            },
            array1: [
                {
                    arr1_obj_1_field1: 'a1_o1_1',
                    arr1_obj_1_field2: 'a1_o1_2',
                    arr1_obj_1_field3: 'a1_o1_3',
                },
                {
                    arr1_obj_2_field1: 'a1_o2_1',
                    arr1_obj_2_field2: 'a1_o2_2',
                    arr1_obj_2_field3: 'a1_o2_3',
                },
                {
                    arr1_obj_3_field1: 'a1_o3_1',
                    arr1_obj_3_field2: 'a1_o3_2',
                    arr1_obj_3_field3: 'a1_o3_3',
                },
            ],
        };

        expect(hasSubsetFields(A, B)).toBeTruthy();
    });

    it('should return false if A does not contain all fields of B (with nested array)', () => {
        const B = {
            field1: '1',
            field2: '2',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
            },
            array1: [
                {
                    arr1_obj_1_field1: 'a1_o1_1',
                    arr1_obj_1_field2: 'a1_o1_2',
                    arr1_obj_1_field3: 'a1_o1_3',
                },
                {
                    arr1_obj_2_field1: 'a1_o2_1',
                    arr1_obj_2_field2: 'a1_o2_2',
                    arr1_obj_2_field3: 'a1_o2_3',
                },
                {
                    arr1_obj_3_field1: 'a1_o3_1',
                    arr1_obj_3_field2: 'a1_o3_2',
                    arr1_obj_3_field3: 'a1_o3_3',
                },
            ],
        };

        const A1 = {
            field1: '1',
            field2: '2',
            field3: '3',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
                obj1_field3: 'o1_3',
            },
            array1: [
                {
                    arr1_obj_1_field1: 'a1_o1_1',
                    arr1_obj_1_field2: 'a1_o1_2',
                    arr1_obj_1_field3: 'a1_o1_3',
                },
                {
                    arr1_obj_3_field1: 'a1_o3_1',
                    arr1_obj_3_field2: 'a1_o3_2',
                    arr1_obj_3_field3: 'a1_o3_3',
                },
            ],
        };

        const A2 = {
            field1: '1',
            field2: '2',
            field3: '3',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
                obj1_field3: 'o1_3',
            },
            array1: [
                {
                    arr1_obj_1_field1: 'a1_o1_1',
                    arr1_obj_1_field2: 'a1_o1_2',
                    arr1_obj_1_field3: 'a1_o1_3',
                },
                {
                    arr1_obj_3_field1: 'a1_o3_1',
                    arr1_obj_3_field2: 'a1_o3_2',
                    arr1_obj_3_field3: 'a1_o3_4',
                },
            ],
        };

        const A3 = {
            field1: '1',
            field2: '2',
            field3: '3',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
                obj1_field3: 'o1_3',
            },
        };

        expect(hasSubsetFields(A1, B)).toBeFalsy();
        expect(hasSubsetFields(A2, B)).toBeFalsy();
        expect(hasSubsetFields(A3, B)).toBeFalsy();
    });

    it('should return true if A contain all fields of B (with nested object in nested array)', () => {
        const B = {
            field1: '1',
            field2: '2',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
            },
            array1: [
                {
                    arr1_obj_1_field1: 'a1_o1_1',
                    arr1_obj_1_field2: 'a1_o1_2',
                    arr1_obj_1_field3: 'a1_o1_3',
                    arr1_obj_1_object1: {
                        arr1_obj_1_obj1_field1: 'a1_o1_o1_1',
                    },
                },
                {
                    arr1_obj_2_field1: 'a1_o2_1',
                    arr1_obj_2_field2: 'a1_o2_2',
                    arr1_obj_2_field3: 'a1_o2_3',
                    arr1_obj_2_object1: {
                        arr1_obj_2_obj1_field1: 'a1_o2_o1_1',
                        arr1_obj_2_obj1_field2: 'a1_o2_o1_2',
                    },
                },
            ],
        };

        const A = {
            field1: '1',
            field2: '2',
            field3: '3',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
                obj1_field3: 'o1_3',
            },
            array1: [
                {
                    arr1_obj_1_field1: 'a1_o1_1',
                    arr1_obj_1_field2: 'a1_o1_2',
                    arr1_obj_1_field3: 'a1_o1_3',
                    arr1_obj_1_object1: {
                        arr1_obj_1_obj1_field1: 'a1_o1_o1_1',
                        arr1_obj_1_obj1_field2: 'a1_o1_o1_2',
                    },
                },
                {
                    arr1_obj_2_field1: 'a1_o2_1',
                    arr1_obj_2_field2: 'a1_o2_2',
                    arr1_obj_2_field3: 'a1_o2_3',
                    arr1_obj_2_object1: {
                        arr1_obj_2_obj1_field1: 'a1_o2_o1_1',
                        arr1_obj_2_obj1_field2: 'a1_o2_o1_2',
                    },
                },
                {
                    arr1_obj_3_field1: 'a1_o3_1',
                    arr1_obj_3_field2: 'a1_o3_2',
                    arr1_obj_3_field3: 'a1_o3_3',
                    arr1_obj_3_object1: {
                        arr1_obj_3_obj1_field1: 'a1_o3_o1_1',
                        arr1_obj_3_obj1_field2: 'a1_o3_o1_2',
                    },
                },
            ],
        };

        expect(hasSubsetFields(A, B)).toBeTruthy();
    });

    it('should return false if A does not contain all fields of B (with nested object in nested array)', () => {
        const B = {
            field1: '1',
            field2: '2',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
            },
            array1: [
                {
                    arr1_obj_1_field1: 'a1_o1_1',
                    arr1_obj_1_field2: 'a1_o1_2',
                    arr1_obj_1_field3: 'a1_o1_3',
                    arr1_obj_1_object1: {
                        arr1_obj_1_obj1_field1: 'a1_o1_o1_1',
                        arr1_obj_1_obj1_field2: 'a1_o1_o1_2',
                    },
                },
                {
                    arr1_obj_2_field1: 'a1_o2_1',
                    arr1_obj_2_field2: 'a1_o2_2',
                    arr1_obj_2_field3: 'a1_o2_3',
                    arr1_obj_2_object1: {
                        arr1_obj_2_obj1_field1: 'a1_o2_o1_1',
                        arr1_obj_2_obj1_field2: 'a1_o2_o1_2',
                    },
                },
            ],
        };

        const A1 = {
            field1: '1',
            field2: '2',
            field3: '3',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
                obj1_field3: 'o1_3',
            },
            array1: [
                {
                    arr1_obj_1_field1: 'a1_o1_1',
                    arr1_obj_1_field2: 'a1_o1_2',
                    arr1_obj_1_field3: 'a1_o1_3',
                    arr1_obj_1_object1: {
                        arr1_obj_1_obj1_field1: 'a1_o1_o1_1',
                        arr1_obj_1_obj1_field2: 'a1_o1_o1_2',
                    },
                },
                {
                    arr1_obj_3_field1: 'a1_o3_1',
                    arr1_obj_3_field2: 'a1_o3_2',
                    arr1_obj_3_field3: 'a1_o3_3',
                },
            ],
        };

        const A2 = {
            field1: '1',
            field2: '2',
            field3: '3',
            object1: {
                obj1_field1: 'o1_1',
                obj1_field2: 'o1_2',
                obj1_field3: 'o1_3',
            },
            array1: [
                {
                    arr1_obj_1_field1: 'a1_o1_1',
                    arr1_obj_1_field2: 'a1_o1_2',
                    arr1_obj_1_field3: 'a1_o1_3',
                    arr1_obj_1_object1: {
                        arr1_obj_1_obj1_field1: 'a1_o1_o1_1',
                    },
                },
                {
                    arr1_obj_3_field1: 'a1_o3_1',
                    arr1_obj_3_field2: 'a1_o3_2',
                    arr1_obj_3_field3: 'a1_o3_3',
                    arr1_obj_2_object1: {
                        arr1_obj_2_obj1_field1: 'a1_o2_o1_1',
                    },
                },
            ],
        };

        expect(hasSubsetFields(A1, B)).toBeFalsy();
        expect(hasSubsetFields(A2, B)).toBeFalsy();
    });
});
