
"use strict";

const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

module.exports = function(sequelize) {

    var Model = sequelize.define('organization', {
        uuid: { type: Sequelize.STRING, defaultValue: uuidv4}, 
        name: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING },
        url: { type: Sequelize.STRING },
        faxNumber: { type: Sequelize.STRING },
        phoneNumber: { type: Sequelize.STRING },
        icon: { type: Sequelize.STRING },
        status: { type: Sequelize.STRING, defaultValue: 'active' }
    }, {
        createdAt: 'created', 
        updatedAt: 'modified',
        indexes: [
            {using: 'BTREE', fields: ['uuid'], unique: true},
            {using: 'BTREE', fields: ['status']}
        ]          
    });

    return Model
}