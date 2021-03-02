
'use strict';
const Settings = require('../Settings');

// Bring in models and pass db connection object
const Person = require('./Person')(Settings.sequelize);
const Organization = require('./Organization')(Settings.sequelize);
const PersonToOrganization = require('./PersonToOrganization')(Settings.sequelize);
const PublicKey = require('./PublicKey')(Settings.sequelize);
const Session = require('./Session')(Settings.sequelize);
const LoginStats = require('./LoginStats')(Settings.sequelize);

// Sync all models at once
Settings.sequelize.sync({ force: false, alter: false });

// Setup associations

Organization.hasMany(Person, {foreignKey : 'organizationId'});
Person.belongsTo(Organization);

Organization.hasMany(PublicKey, {foreignKey : 'organizationId'});
PublicKey.belongsTo(Organization);

// Now export
module.exports = {
    Session: Session,
    LoginStats: LoginStats,
    Person: Person,
    PublicKey: PublicKey,
    Organization: Organization,
    PersonToOrganization: PersonToOrganization
}   
 