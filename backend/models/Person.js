
"use strict";

const Sequelize = require('sequelize');
const _ = require('lodash');
const Cipher = require('../utils/Cipher');
const { v4: uuidv4 } = require('uuid');

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html


module.exports = function(sequelize) {

    var Model = sequelize.define('person', {
        
        uuid: { type: Sequelize.STRING, defaultValue: uuidv4}, 

        organizationId: Sequelize.BIGINT,
        emailHash: Sequelize.STRING,

        suffix: Sequelize.STRING,
        fullName_encrypted: Sequelize.STRING,
        fullName: Cipher.registerField('fullName'),

        //firstName_encrypted: Sequelize.STRING,
        //middleName_encrypted: Sequelize.STRING,
        //lastName_encrypted: Sequelize.STRING,
        //firstName: Cipher.registerField('firstName'),
        //middleName: Cipher.registerField('middleName'),
        //lastName: Cipher.registerField('lastName'),

        birthDate: Sequelize.DATEONLY,
        
        // Address info
        address1_encrypted: Sequelize.STRING,
        address2_encrypted: Sequelize.STRING,
        address1: Cipher.registerField('address1'),
        address2: Cipher.registerField('address2'),        
        city: Sequelize.STRING,
        county: Sequelize.STRING,
        state: Sequelize.STRING,
        zip: Sequelize.STRING,

        phoneNumber_encrypted: Sequelize.STRING,
        phoneNumber: Cipher.registerField('phoneNumber'),

        //role: { type: Sequelize.ENUM('staff', 'resident', 'student', 'visitor', 'unknown') },
        ethnicity: Sequelize.STRING,
        gender: Sequelize.STRING,
        //residentCongregateSetting: {type: Sequelize.BOOLEAN, defaultValue: false},
        employedInHealthcare: {type: Sequelize.BOOLEAN, defaultValue: false},

        lastIp: Sequelize.STRING,
        lastLogin: Sequelize.DATE,

        // Flexible field for user preferences
        preferences: Sequelize.JSONB,

        level: { type: Sequelize.STRING, defaultValue: 'user' },
        status: { type: Sequelize.STRING, defaultValue: 'active' }

    }, {
        createdAt: 'created', 
        updatedAt: 'modified',
        indexes: [
            {using: 'BTREE', fields: ['uuid'], unique: true},
            {using: 'BTREE', fields: ['emailHash']},
            {using: 'BTREE', fields: ['role']},
            {using: 'BTREE', fields: ['organizationId']},

        ]          
    });

    return Model
}