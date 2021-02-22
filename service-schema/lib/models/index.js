
'use strict';
const Settings = require('../Settings');
const { Op, Sequelize } = require("sequelize");

// Bring in models and pass db connection object
const Session = require('./Session')(Settings.sequelize);
const Schema = require('./Schema')(Settings.sequelize);

// Sync all models at once
Settings.sequelize.sync({ force: false, alter: false });

// Now export
module.exports = {
    Session: Session,
    Schema: Schema
}   
 