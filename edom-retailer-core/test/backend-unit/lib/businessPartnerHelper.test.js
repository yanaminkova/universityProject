const expect = require('expect');

const bpHelper = require('../../../srv/lib/businesspartner/businessPartnerHelper.js');

// Legend:
// [BETA] = need to update line/s below when moving (from beta) to release

// [BETA] - enable (beta) error messages
const { isGuid, getEntityAndId, splitUrlIntoEntities } = bpHelper();

describe('lib.businessPartnerHelper.test', () => {
    const guid1 = '0bc2378a-109a-48da-a2eb-a43c72198821';
    const guid2 = 'ec09bc0d-cf80-4db7-a7ff-ef09d83e58d1';
    const guid3 = 'fd04bb75-1e83-49ad-ba8b-ad059ada2307';
    const notGuid1 = '0bc2378a-109a-48da-a2eb-a43c721988210';
    const notGuid2 = '0bc2378a-109a-48da-a2eb-a43c72198821-';
    const notGuid3 = '12345678901';
    const notGuid4 = '1234567890';
    const notGuid5 = '0';
    const notGuid6 = 'PRPR';

    it('should return true when isGuid is called with true guid parameter', () => {
        expect(isGuid(guid1)).toBeTruthy;
        expect(isGuid(guid2)).toBeTruthy;
        expect(isGuid(guid3)).toBeTruthy;
    });

    it('should return false when isGuid is called with a parameter that is not a guid', () => {
        expect(isGuid(notGuid1)).toBeFalsy;
        expect(isGuid(notGuid2)).toBeFalsy;
        expect(isGuid(notGuid3)).toBeFalsy;
        expect(isGuid(notGuid4)).toBeFalsy;
        expect(isGuid(notGuid5)).toBeFalsy;
        expect(isGuid(notGuid6)).toBeFalsy;
    });

    it('should return the first id and entity when getEntityAndId is called given a url with an entity and a guid', () => {
        const url1 = `/BusinessPartner(${guid1})/addressData/${guid2}/emailAddresses/${guid3}`;
        const { id: id1, entity: entity1 } = getEntityAndId(url1, true);
        expect(id1).toBe(guid1);
        expect(entity1).toBe('BusinessPartner');

        const url2 = `BusinessPartner/${guid1}/addressData/${guid2}/emailAddresses/${guid3}`;
        const { id: id2, entity: entity2 } = getEntityAndId(url2);
        expect(id2).toBe(guid1);
        expect(entity2).toBe('BusinessPartner');

        const url3 = `/BusinessPartner/${guid1}`;
        const { id: id3, entity: entity3 } = getEntityAndId(url3);
        expect(id3).toBe(guid1);
        expect(entity3).toBe('BusinessPartner');

        const url4 = `BusinessPartner(${guid1})`;
        const { id: id4, entity: entity4 } = getEntityAndId(url4);
        expect(id4).toBe(guid1);
        expect(entity4).toBe('BusinessPartner');

        const url5 = `/addressData(${guid2})/emailAddresses/${guid3}`;
        const { id: id5, entity: entity5 } = getEntityAndId(url5);
        expect(id5).toBe(guid2);
        expect(entity5).toBe('addressData');

        const url6 = `addressData/${guid2}/emailAddresses/${guid3}`;
        const { id: id6, entity: entity6 } = getEntityAndId(url6);
        expect(id6).toBe(guid2);
        expect(entity6).toBe('addressData');

        const url7 = `/addressData/${guid2}`;
        const { id: id7, entity: entity7 } = getEntityAndId(url7);
        expect(id7).toBe(guid2);
        expect(entity7).toBe('addressData');

        const url8 = `addressData(${guid2})`;
        const { id: id8, entity: entity8 } = getEntityAndId(url8);
        expect(id8).toBe(guid2);
        expect(entity8).toBe('addressData');

        // this is currently not a valid scenario but testing it to
        //   make sure getEntityAndId behaves as expected
        const url9 = `/addressData/emailAddresses(${guid3})`;
        const { id: id9, entity: entity9 } = getEntityAndId(url9);
        expect(id9).toBe(guid3);
        expect(entity9).toBe('addressData');
    });

    it('should return an undefined id and an entity when getEntityAndId is called given a url with an entity but no guid', () => {
        const url10 = `/person/nameDetails`;
        const { id: id10, entity: entity10 } = getEntityAndId(url10);
        expect(id10).toBeUndefined;
        expect(entity10).toBe('person');

        const url11 = `person/nameDetails`;
        const { id: id11, entity: entity11 } = getEntityAndId(url11);
        expect(id11).toBeUndefined;
        expect(entity11).toBe('person');

        const url12 = `organization/nameDetails/`;
        const { id: id12, entity: entity12 } = getEntityAndId(url12);
        expect(id12).toBeUndefined;
        expect(entity12).toBe('organization');

        const url13 = `/person`;
        const { id: id13, entity: entity13 } = getEntityAndId(url13);
        expect(id13).toBeUndefined;
        expect(entity13).toBe('person');

        const url14 = `organization`;
        const { id: id14, entity: entity14 } = getEntityAndId(url14);
        expect(id14).toBeUndefined;
        expect(entity14).toBe('organization');

        const url15 = `person/`;
        const { id: id15, entity: entity15 } = getEntityAndId(url15);
        expect(id15).toBeUndefined;
        expect(entity15).toBe('person');

        // this is currently not a valid scenario but testing it to
        //   make sure getEntityAndId behaves as expected
        const url16 = `organization/nameDetails(${notGuid1})`;
        const { id: id16, entity: entity16 } = getEntityAndId(url16);
        expect(id16).toBeUndefined;
        expect(entity16).toBe('organization');
    });

    it('should return a list of entityUrls when splitUrlIntoEntities is called', () => {
        const url17 = `/BusinessPartner(${guid1})/addressData/${guid2}/emailAddresses(${guid3})`;
        const entityUrls1 = splitUrlIntoEntities(url17);
        expect(entityUrls1).toEqual(
            expect.arrayContaining([
                `/BusinessPartner(${guid1})`,
                `/addressData/${guid2}`,
                `/emailAddresses(${guid3})`,
            ])
        );

        const url18 = `/BusinessPartner/${guid1})/addressData(${guid2})/emailAddresses/${guid3}`;
        const entityUrls2 = splitUrlIntoEntities(url18);
        expect(entityUrls2).toEqual(
            expect.arrayContaining([
                `/BusinessPartner/${guid1}`,
                `/addressData(${guid2})`,
                `/emailAddresses/${guid3}`,
            ])
        );

        const url19 = `/BusinessPartner(${guid1})/person/nameDetails`;
        const entityUrls3 = splitUrlIntoEntities(url19);
        expect(entityUrls3).toEqual(
            expect.arrayContaining([
                `/BusinessPartner(${guid1})`,
                `/person`,
                `/nameDetails`,
            ])
        );

        const url20 = `/BusinessPartner/${guid1}//person/nameDetails`;
        const entityUrls4 = splitUrlIntoEntities(url20);
        expect(entityUrls4).toEqual(
            expect.arrayContaining([
                `/BusinessPartner/${guid1}`,
                `/person`,
                `/nameDetails`,
            ])
        );

        const url21 = `/BusinessPartner`;
        const entityUrls5 = splitUrlIntoEntities(url21);
        expect(entityUrls5).toEqual(
            expect.arrayContaining([`/BusinessPartner`])
        );
    });
});
