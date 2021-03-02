'use strict';

const Sequelize = require('sequelize');

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html

/**
 * Catalog of available metrics
 */
module.exports = function(sequelize) {
	var Model = sequelize.define('login-stats',
		{
			emailHash: { type: Sequelize.STRING },
			loginDate: { type: Sequelize.DATE },
			ip: { type: Sequelize.STRING },
		},
		{
			timestamps: false,
			indexes: [
				{using: 'BTREE', fields: ['loginDate']},
				{using: 'BTREE', fields: ['emailHash']}
			]
		}
	);

	Model.sync({ force: false });

	return Model;
};
