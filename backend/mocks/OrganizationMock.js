
"use strict";

"use strict";
const Chance = require('chance');
const _ = require('lodash')
const faker = require('faker');

class OrganizationMock {

    constructor(){

        let chance = new Chance();
            
        // Set locality to US for US-based faked data
        faker.locale = "en_US";

        this.uuid = chance.guid({version: 4});
        this.name = faker.company.companyName();
        this.description = faker.company.catchPhrase();
        this.url = faker.internet.url();
        this.faxNumber = faker.phone.phoneNumber();
        this.phoneNumber = faker.phone.phoneNumber();
        this.icon = faker.image.imageUrl();
        this.status = 'active';


    }
}

module.exports = OrganizationMock;