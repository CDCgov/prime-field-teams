
'use strict';
const Settings = require('../Settings');

// Bring in models and pass db connection object
const Person = require('./Person')(Settings.sequelize);
const Organization = require('./Organization')(Settings.sequelize);
const PersonToOrganization = require('./PersonToOrganization')(Settings.sequelize);
const PublicKey = require('./PublicKey')(Settings.sequelize);
const Session = require('./Session')(Settings.sequelize);
const LoginStats = require('./LoginStats')(Settings.sequelize);
const SchemaMapping = require('./SchemaMapping')(Settings.sequelize);
const SchemaField = require('./SchemaField')(Settings.sequelize);
const Schema = require('./Schema')(Settings.sequelize);

// Sync all models at once
Settings.sequelize.sync({ force: false, alter: false });

// Setup associations

Organization.hasMany(Person, {foreignKey : 'organizationId'});
Person.belongsTo(Organization);

Organization.hasMany(PublicKey, {foreignKey : 'organizationId'});
PublicKey.belongsTo(Organization);

Schema.hasMany(SchemaField, {foreignKey : 'schemaId'});
SchemaField.belongsTo(Schema);

Schema.hasMany(SchemaMapping, {foreignKey : 'schemaId'});
SchemaMapping.belongsTo(Schema);

// Now export
module.exports = {
    Schema,
    SchemaField,
    SchemaMapping,
    Session,
    LoginStats,
    Person,
    PublicKey,
    Organization,
    PersonToOrganization
}   
 