'use strict';
const Logger = require('../utils/Logger');
const {Schema} = require('../models');
const _ = require('lodash');

var SchemaAPI = {

	// ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Middleware to load an employer
     */
    async load(req, res, next) {

        if (!req.params.schemaId){
            throw new ParamError(`You must pass a schema id`)
        }

        req.schema = await Meeting.findOne({where: {id: req.params.schemaId}});

		if (!req.schema) {
			throw new Error(`Could not find meeting ${req.params.schemaId}`);
		}

		return next();

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    async getAll(req, res) {
        
		if (!req.params.organizationId){
            throw new ParamError(`You must pass a organizationId`)
        }

        const schemas = await Schema.findAll({
            where: {
                organizationId: req.params.organizationId
            }
        })
        res.json(schemas);
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

	async delete(req, res){

	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async create(req, res) {
		res.json(req.schema);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async get(req, res) {
		res.json(req.schema);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	//updates the user themselves
	async update(req, res) {

		// Don't let a user update these fields
		var forboden = ['_id', 'id', 'status', 'level', 'email'];

		Logger.debug(req.body.schema);

		for (var key in req.body.schema) {
			if (_.indexOf(forboden, key) == -1) {
				Logger.debug(`Setting ${key} = `, req.body.schema[key]);
				req.schema[key] = req.body.schema[key];
			}
		}

		let updated = await req.schema.save();

		res.json(updated);
	}

	// ///////////////////////////////////////////////////////////////////////////////////////
};

module.exports = SchemaAPI;
