
"use strict";

const Chance = require('chance');
const adjective = require('./adjectives');
const _ = require('lodash');
const slugify = require('slugify');

class SchemaMock {

    constructor(orgId, schemaId){

        let chance = new Chance();
            
        this.organizationId = orgId;
        this.schemaId = schemaId;
        this.key = slugify(_.sample(adjective) + ' ' + chance.animal());
        this.category = _.sample(['Staffed Bed Capacity', 'Ventilators', 'ED/Overflow']);
        this.type = _.sample(['integer', 'float', 'percent', 'distribution', 'enum'])
        this.values = "'Yes','No'";
        this.min = 1;
        this.max = 1000;
        this.description = chance.sentence();
        this.notes = chance.sentence();
        this.status = 'active';


    }
}


module.exports = SchemaMock;