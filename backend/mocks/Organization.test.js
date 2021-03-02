
"use strict";

const Logger = require('../utils/Logger');
const OrganizationMock = require('./OrganizationMock');

describe('Mocks:OrganizationMock', () => {

    test('constructor()', (done) => {

        let org = new OrganizationMock();

        Logger.debug(org);
        
        expect(typeof org.uuid).toBe('string');
        expect(typeof org.description).toBe('string');
        expect(typeof org.url).toBe('string');
        expect(typeof org.faxNumber).toBe('string');
        expect(typeof org.phoneNumber).toBe('string');
        expect(typeof org.icon).toBe('string');
        expect(typeof org.status).toBe('string');

        done();
            
    });


    
})




