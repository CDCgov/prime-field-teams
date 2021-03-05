'use strict';

const Sequelize = require('sequelize');

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html

/**
 * Catalog of available metrics
 */
module.exports = function(sequelize) {
	var Model = sequelize.define('schema-field',
		{
			organizationId: { type: Sequelize.BIGINT },
			schemaId: { type: Sequelize.BIGINT },
			key: { type: Sequelize.STRING },
			category: { type: Sequelize.STRING },
			type: { type: Sequelize.STRING },
			min: { type: Sequelize.INTEGER },
			max: { type: Sequelize.INTEGER },
			values: { type: Sequelize.STRING }, // for enum types
			description: { type: Sequelize.TEXT },
			notes: { type: Sequelize.TEXT },
			status: { type: Sequelize.STRING, defaultValue: 'active' }
		},
		{
			timestamps: false,
			indexes: [
				{using: 'BTREE', fields: ['schemaId']},
				{using: 'BTREE', fields: ['key']},
				{using: 'BTREE', fields: ['organizationId']}
			]
		}
	);

	Model.sync({ force: false });

	return Model;
};
