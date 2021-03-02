
"use strict";

const Sequelize = require('sequelize');

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html

/**
 * Catalog of available metrics
 */
module.exports = function(sequelize) {

    var Model = sequelize.define('session', {        
        personId: { type: Sequelize.BIGINT},
        scopes: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
        emailHash: { type: Sequelize.STRING},
        token: { type: Sequelize.STRING, unique: true, index: true},
        ip: { type: Sequelize.STRING},
        expires: { type: Sequelize.DATE}
    }, {
        createdAt: 'created', 
        updatedAt: 'modified',
        indexes: [
            {using: 'BTREE', fields: ['emailHash']},
            {using: 'BTREE', fields: ['token']}

        ]          
    });
    
    return Model
}