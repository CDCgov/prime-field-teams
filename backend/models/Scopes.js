'use strict';

const Sequelize = require('sequelize');

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html

/**
 * Catalog of available metrics
 */
module.exports = function(sequelize) {
	var Model = sequelize.define('auth-scopes',
		{
			name: { type: Sequelize.STRING },
			description: { type: Sequelize.STRING },
            levelToGrant: { type: Sequelize.STRING, defaultValue: 'super'}
		},
		{
			timestamps: false,
			indexes: [
				{using: 'BTREE', fields: ['name']},
			]
		}
	);

	Model.sync({ force: false });

	return Model;
};
