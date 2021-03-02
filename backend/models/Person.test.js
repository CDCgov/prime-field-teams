
"use strict";

const Settings = require('../Settings');
const Logger = require('../utils/Logger');
const {Person} = require('./index');
const PersonMock = require('../mocks/PersonMock');

var peep = new PersonMock();

// See https://github.com/jest-community/jest-extended for extended tests

describe('Models:Person', () => {

    beforeAll((done) => {       
        // Wait for database connection        
        setTimeout(done, 250);
    });
    

    test('create()', async () => {

        let person = await Person.create(peep);
        
        expect(person.firstName).toEqual(peep.firstName);
        expect(person.lastName).toEqual(peep.lastName);
        expect(person.email).toEqual(peep.email);
        expect(person.address1).toEqual(peep.address1);
        expect(person.address2).toEqual(peep.address2);
        expect(person.city).toEqual(peep.city);
        expect(person.county).toEqual(peep.county);
        expect(person.state).toEqual(peep.state);
        expect(person.zip).toEqual(peep.zip);
        expect(person.phoneNumber).toEqual(peep.phoneNumber);
        expect(person.organizationId).toEqual(peep.organizationId+'');
        expect(person.role).toEqual(peep.role);
        expect(person.ethnicity).toEqual(peep.ethnicity);
        expect(person.uuid).toEqual(peep.uuid);
        expect(person.gender).toEqual(peep.gender);
        expect(person.birthDate).toBeDefined();

        // Dates are more fidly
        let peepDate = new Date(peep.birthDate);
        let personDate = new Date(person.birthDate);

        expect(personDate).toBeValidDate();
        expect(peepDate.getFullYear()).toEqual(personDate.getFullYear());
        expect(peepDate.getMonth()).toEqual(personDate.getMonth());
            
    });    

    afterAll(async () => {          

        // Delete this person. This is safe to work on a production DB but strongly advized 
        // to run unit tests against staging or dev db instances!!!
        Logger.info(`Tearing down test and clearning up... deleting person ${peep.uuid}}`);
        await Person.destroy({where: {uuid: peep.uuid}});
        
        // Reset the id so we don't keep moving it with unit tests
        //let tableName = Person.getTableName()        
        //let qry = `SELECT setval('${tableName}_id_seq', (SELECT MAX(id) FROM ${tableName})+1);`;
        //Logger.info(qry);
        //await Settings.sequelize.query(qry);

    });    
    
})

