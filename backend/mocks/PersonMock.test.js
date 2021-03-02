
"use strict";

const Logger = require('../utils/Logger');
const PersonMock = require('./PersonMock');

const mock = {

}

describe('Mocks:PersonMock', () => {

    test('constructor()', (done) => {

        let peep = new PersonMock();

        expect(typeof peep.uuid).toBe('string');
        expect(typeof peep.firstName).toBe('string');
        expect(typeof peep.lastName).toBe('string');
        expect(typeof peep.email).toBe('string');
        expect(typeof peep.address1).toBe('string');
        expect(typeof peep.address2).toBe('string');
        expect(typeof peep.city).toBe('string');
        expect(typeof peep.county).toBe('string');
        expect(typeof peep.state).toBe('string');
        expect(typeof peep.zip).toBe('string');
        expect(typeof peep.phoneNumber).toBe('string');
        expect(typeof peep.birthDate).toBe('object');
        expect(typeof peep.organizationId).toBe('number');
        expect(PersonMock.roles).toContain(peep.role);
        expect(PersonMock.ethnicities).toContain(peep.ethnicity);
        expect(typeof peep.gender).toBe('string');

        done();
            
    });


    
})




