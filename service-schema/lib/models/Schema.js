'use strict';

const Sequelize = require('sequelize');

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html

/**
 * Catalog of available metrics
 */
module.exports = function(sequelize) {
	var Model = sequelize.define('login-stats',
		{
			personId: { type: Sequelize.BIGINT },
			loginDate: { type: Sequelize.DATE },
			ip: { type: Sequelize.STRING },
		},
		{
			timestamps: false,
			indexes: [
				{using: 'BTREE', fields: ['loginDate']},
				{using: 'BTREE', fields: ['personId']}
			]
		}
	);

	Model.sync({ force: false });

	return Model;
};
