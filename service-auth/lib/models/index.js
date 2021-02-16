
'use strict';
const Settings = require('../Settings');
const { Op, Sequelize } = require("sequelize");

// Bring in models and pass db connection object
const Session = require('./Session')(Settings.sequelize);
const Person = require('./Person')(Settings.sequelize);
const LoginStats = require('./LoginStats')(Settings.sequelize);
const Organization = require('./Organizaation')(Settings.sequelize);
const PersonToOrganization = require('./PersonToOrganization')(Settings.sequelize);

// Sync all models at once
Settings.sequelize.sync({ force: false, alter: false });

// Setup associations
Person.hasMany(Session, {foreignKey : 'personId'});
Session.belongsTo(Person);

Person.hasMany(PersonToOrganization, {foreignKey : 'personId'});
PersonToOrganization.belongsTo(Person);

Person.hasMany(Organization, {foreignKey : 'personId'});
Organization.belongsTo(Person);

Person.hasMany(LoginStats, {foreignKey : 'personId'});
LoginStats.belongsTo(Person);

// Now export
module.exports = {
    Session: Session,
    Person: Person,
    LoginStats: LoginStats,
    Organization: Organization,
    PersonToOrganization: PersonToOrganization
}   
 