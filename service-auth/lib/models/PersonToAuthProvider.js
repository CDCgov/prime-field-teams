
"use strict";

const Sequelize = require('sequelize');
const _ = require('lodash');
const Cipher = require('../utils/Cipher');
const { v4: uuidv4 } = require('uuid');

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html


module.exports = function(sequelize) {

    var Model = sequelize.define('person-to-auth', {        
        uuid: { type: Sequelize.STRING, defaultValue: uuidv4}, 
        provider: { type: Sequelize.STRING}, 
        personId: Sequelize.BIGINT
    }, {
        createdAt: 'created', 
        updatedAt: 'modified',
        indexes: [
            {using: 'BTREE', fields: ['uuid'], unique: true},
            {using: 'BTREE', fields: ['provider']},
            {using: 'BTREE', fields: ['personId']}
        ]          
    });

    return Model
}