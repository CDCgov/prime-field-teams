
"use strict";

const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

module.exports = function(sequelize) {

    var Model = sequelize.define('public-key', {
        organizationId: { type: Sequelize.INTEGER },
        createdByPersonId: { type: Sequelize.BIGINT },
        scopes: { type: Sequelize.STRING, defaultValue: 'prime.schema.read, prime.org.read, prime.users.read'},
        name: { type: Sequelize.STRING },
        url: { type: Sequelize.STRING },
        contents: { type: Sequelize.TEXT }
    }, {
        createdAt: 'created', 
        updatedAt: 'modified',
        indexes: [
            {using: 'BTREE', fields: ['organizationId']}
        ]          
    });

    return Model
}