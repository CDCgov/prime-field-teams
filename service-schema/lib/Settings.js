'use strict';
require('dotenv-safe').config({});
const Logger = require('./utils/Logger.js');

var Settings = {

    sequelize: null,

    init() {

        if (process.env.LOG_LEVEL) {
            Logger.setLevel(process.env.LOG_LEVEL);
        }

        const Sequelize = require('sequelize');
        const parse = require('pg-connection-string').parse;

        // If we don't have a postgress url, then it's not needed
        if (!process.env.POSTGRES_URI) {
            Logger.warn('Service is not using Postgres', process.env.POSTGRES_URI);
            return;
        }

        let urlParts = parse(process.env.POSTGRES_URI);

        let opts = {
            logging: false,
            host: urlParts.host,
            port: urlParts.port,
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                    //ca: [rdsCa]
                }                
             }            
        };

        if (process.env.POSTGRES_URI_REPLICAS && process.env.POSTGRES_URI_REPLICAS != 'null') {

            let reads = process.env.POSTGRES_URI_REPLICAS.split(',').map(item => item.trim());

            opts.replication = {
                write: parse(process.env.POSTGRES_URI),
                read: process.env.POSTGRES_URI_REPLICAS.split(',').map(item => parse(item))
            };
        }

        Logger.info('Connecting to Postgres...');

        Settings.sequelize = new Sequelize(urlParts.database, urlParts.user, urlParts.password, opts);
    }
};

Settings.init();

module.exports = Settings;
