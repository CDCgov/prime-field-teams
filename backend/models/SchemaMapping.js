'use strict';

const Sequelize = require('sequelize');

// http://docs.sequelizejs.com/manual/tutorial/models-definition.html

/**
 * Catalog of available metrics
 */
module.exports = function(sequelize) {
	var Model = sequelize.define('schema-mapping',
		{
			organizationId: { type: Sequelize.BIGINT },
			schemaId: { type: Sequelize.BIGINT },
            schemaFieldId: { type: Sequelize.BIGINT },
			toSchemaId: { type: Sequelize.BIGINT, defaultValue: 1 },
            toSchemaFieldId: { type: Sequelize.BIGINT },
			fromKey: { type: Sequelize.STRING },
			toKey: { type: Sequelize.STRING },
			notes: { type: Sequelize.TEXT },
			conversion: { type: Sequelize.JSONB }
		},
		{
			timestamps: false,
			indexes: [
				{using: 'BTREE', fields: ['schemaId']},
				{using: 'BTREE', fields: ['toSchemaId']},
				{using: 'BTREE', fields: ['fromKey']},
				{using: 'BTREE', fields: ['toKey']},
				{using: 'BTREE', fields: ['organizationId']}
			]
		}
	);

	Model.sync({ force: false });

	return Model;
};
