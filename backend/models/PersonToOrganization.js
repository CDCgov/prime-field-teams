
"use strict";

const Sequelize = require('sequelize');

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html

module.exports = function(sequelize) {

    var Model = sequelize.define('person-to-org', {        
        personId: { type: Sequelize.INTEGER },
        organizationId: { type: Sequelize.INTEGER },
        role: { type: Sequelize.ENUM('staff', 'resident', 'student', 'visitor', 'unknown') },
        status: { type: Sequelize.STRING, defaultValue: 'active' }
    }, {
        createdAt: 'created', 
        updatedAt: 'modified',
        indexes: [
            {using: 'BTREE', fields: ['role']},
            {using: 'BTREE', fields: ['personId']},
            {using: 'BTREE', fields: ['organizationId']},
            {using: 'BTREE', fields: ['status']}
        ]        
    });

    Model.sync({force:false});

    return Model
}
