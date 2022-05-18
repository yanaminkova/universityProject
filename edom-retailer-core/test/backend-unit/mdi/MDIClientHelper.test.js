const expect = require('expect');
const {
    isField,
    storeIfKey,
    translateLog,
    translateProductLog,
    getNextLink,
} = require('../../../srv/mdiclient/MDIClientHelper');

describe('MDIClientHelper.test unit-test', () => {
    it('should return true if element is a composition and has relationship defined - UTILITIESCLOUDSOLUTION-3079', () => {
        const element = {
            type: 'cds.Composition',
            is2one: true,
        };
        const result = isField(element, 'Composition', 'is2one');
        expect(result).toBeTruthy();
    });

    it('should store to array if key is passed to function - UTILITIESCLOUDSOLUTION-3079', () => {
        const actualKeys = [];

        storeIfKey(
            true,
            {},
            'ca3aac87-bd9b-4cce-adb1-8443dbd2b61d',
            'id',
            actualKeys
        );
        storeIfKey(
            true,
            {},
            'ca3aac87-bd9b-4cce-adb1-8443dbd2b61d',
            'up__id',
            actualKeys
        );

        expect(actualKeys).toHaveLength(1);
        expect(actualKeys[0]).toBe('id');
    });

    it('should return "confirm" action for BP log - UTILITIESCLOUDSOLUTION-3079', () => {
        const event = 'created';
        const createInstanceIds = {};

        const action = translateLog(event, true, 'test', createInstanceIds);

        expect(action).toBe('confirm');
    });

    it('should return "create" action on "created" event for BP log - UTILITIESCLOUDSOLUTION-3079', () => {
        const event = 'created';
        const createInstanceIds = {};

        const action = translateLog(
            event,
            undefined,
            'test',
            createInstanceIds
        );

        expect(action).toBe('create');
    });

    it('should return "create" action on "updated" event for BP log - UTILITIESCLOUDSOLUTION-3079', () => {
        const event = 'updated';
        const createInstanceIds = { test: true };

        const action = translateLog(
            event,
            undefined,
            'test',
            createInstanceIds
        );

        expect(action).toBe('create');
    });

    it('should return "update" action for BP log - UTILITIESCLOUDSOLUTION-3079', () => {
        const event = 'updated';
        const createInstanceIds = {};

        const action = translateLog(
            event,
            undefined,
            'test',
            createInstanceIds
        );

        expect(action).toBe('update');
    });

    it('should return "reject" action for BP log - UTILITIESCLOUDSOLUTION-3079', () => {
        const event = 'rejected';
        const createInstanceIds = {};

        const action = translateLog(event, true, 'test', createInstanceIds);

        expect(action).toBe('reject');
    });

    it('should return "create" action on "created" event for Product log - UTILITIESCLOUDSOLUTION-3079', () => {
        const event = 'created';
        const createInstanceIds = {};

        const action = translateProductLog(event, undefined, createInstanceIds);

        expect(action).toBe('create');
    });

    it('should return "create" action on "updated" event with createInstanceIds for Product log - UTILITIESCLOUDSOLUTION-3079', () => {
        const event = 'updated';
        const createInstanceIds = { test: true };

        const action = translateProductLog(event, 'test', createInstanceIds);

        expect(action).toBe('create');
    });

    it('should return "update" action on "updated" event for Product log - UTILITIESCLOUDSOLUTION-3079', () => {
        const event = 'updated';
        const createInstanceIds = {};

        const action = translateProductLog(event, 'test', createInstanceIds);

        expect(action).toBe('update');
    });

    it('should return next link and final token - UTILITIESCLOUDSOLUTION-3079', () => {
        const response = {
            '@odata.deltaLink':
                '/v1/odm/2.3.0/sap.odm.product.Product/events?$deltatoken=test1',
            '@odata.nextLink':
                '/v1/odm/2.3.0/sap.odm.product.Product/events?$deltatoken=F3uCu5u2.3.0u48u8u272u341u331u11u7u140u7u299u315u5u11u4u345u12u6u55u18u709u1043u705u38u9u640u11u496u1683u11u20u7u1058u23u11u68u1394u709u1043u705u1145u933u815u986u496u1683u914u847u685u1058u750u832u3u282u1u0u0',
        };

        const { nextLink, finalToken } = getNextLink(response);

        expect(nextLink).toBe(
            'F3uCu5u2.3.0u48u8u272u341u331u11u7u140u7u299u315u5u11u4u345u12u6u55u18u709u1043u705u38u9u640u11u496u1683u11u20u7u1058u23u11u68u1394u709u1043u705u1145u933u815u986u496u1683u914u847u685u1058u750u832u3u282u1u0u0'
        );
        expect(finalToken).toBe(
            'F3uCu5u2.3.0u48u8u272u341u331u11u7u140u7u299u315u5u11u4u345u12u6u55u18u709u1043u705u38u9u640u11u496u1683u11u20u7u1058u23u11u68u1394u709u1043u705u1145u933u815u986u496u1683u914u847u685u1058u750u832u3u282u1u0u0'
        );
    });

    it('should return final token - UTILITIESCLOUDSOLUTION-3079', () => {
        const response = {
            '@odata.deltaLink':
                '/v1/odm/2.3.0/sap.odm.product.Product/events?$deltatoken=test1',
        };

        const { nextLink, finalToken } = getNextLink(response);

        expect(nextLink).toBeUndefined();
        expect(finalToken).toBe('test1');
    });
});
