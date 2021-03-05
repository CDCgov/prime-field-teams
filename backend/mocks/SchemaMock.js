
"use strict";

const Chance = require('chance');
const adjective = require('./adjectives');
const _ = require('lodash');

class SchemaMock {

    constructor(){

        let chance = new Chance();
            
        this.organizationId = 1;
        this.description = chance.sentence();
        this.name = _.sample(adjective) + ' ' + chance.animal();
        this.status = 'active';
        

    }
}


module.exports = SchemaMock;