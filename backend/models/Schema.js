'use strict';

const Sequelize = require('sequelize');

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html

/**
 * Catalog of available metrics
 */
module.exports = function(sequelize) {
	var Model = sequelize.define('schema',
		{
			organizationId: { type: Sequelize.BIGINT },
			name: { type: Sequelize.STRING },
			description: { type: Sequelize.TEXT },
			status: { type: Sequelize.STRING, defaultValue: 'active' }
		},
		{
			timestamps: false,
			indexes: [
				{using: 'BTREE', fields: ['organizationId']}
			]
		}
	);

	Model.sync({ force: false });

	return Model;
};
