
"use strict";

"use strict";
const Chance = require('chance');
const _ = require('lodash')
const faker = require('faker');

// As defined by NIH notice NOT-OD-15-089
// @see https://grants.nih.gov/grants/guide/notice-files/not-od-15-089.html
const ethnicities = [
    'American Indian or Alaska Native', 
    'Asian',
    'Black or African American',
    'Hispanic or Latino',
    'Native Hawaiian or Other Pacific Islander',
    'White'
];

const roles = ['staff', 'resident', 'student', 'visitor', 'unknown'];


class PersonMock {

    constructor(){

        const currentYear = (new Date()).getFullYear();
        let chance = new Chance();
            
        // Set locality to US for US-based faked data
        faker.locale = "en_US";

        this.uuid = chance.guid({version: 4});
        this.suffix = (chance.d6() < 4) ? null : faker.name.suffix();
        this.firstName = faker.name.firstName();
        this.middleName = (chance.d6() < 2) ? null : faker.name.middleName();
        this.lastName = faker.name.lastName();
        this.email = faker.internet.email();;
        this.address1 = faker.address.streetAddress();
        this.address2 = faker.address.secondaryAddress();
        this.city = faker.address.city();
        this.county = faker.address.county();
        this.state = faker.address.state();
        this.zip =  faker.address.zipCode();
        this.phoneNumber = chance.phone();
        //this.ssn = chance.ssn();
        this.birthDate = chance.date({year: _.random(1940,  currentYear)})
        this.organizationId = 1;
        this.role = _.sample(roles);
        this.ethnicity = _.sample(ethnicities);
        this.gender = faker.name.gender();
        this.preferences = {};
        this.employedInHealthcare = chance.bool({ likelihood: 10 });
        this.lastIp = null;
        this.lastLogin = null;   
        if (chance.d100() < 5){            
            this.lastIp = chance.ip();
            this.lastLogin = chance.date({year: _.random(currentYear-1,  currentYear)})    
        }

    }
}

PersonMock.ethnicities = ethnicities;
PersonMock.roles = roles;

module.exports = PersonMock;