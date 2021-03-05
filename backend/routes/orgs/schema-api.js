'use strict';
const Logger = require('../../utils/Logger');
const {Schema, SchemaField, SchemaMapping} = require('../../models');
const _ = require('lodash');
const SchemaMock = require('../../mocks/SchemaMock');
const AuthError = require('../../errors/AuthError');
const ParamError = require('../../errors/ParamError');

var SchemaAPI = {

	// ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Middleware to load an employer
     */
    async load(req, res, next) {

        if (!req.params.schemaId){
            throw new ParamError(`You must pass a schema id`)
        }

        req.schema = await Schema.findOne({
			where: {id: req.params.schemaId},
			includes: [SchemaField, SchemaMapping]
		});

		if (!req.schema) {
			throw new Error(`Could not find meeting ${req.params.schemaId}`);
		}

		return next();

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    async getAll(req, res) {
        
		if (!req.params.orgId){
            throw new ParamError(`You must pass a organizationId`)
        }

        const schemas = await Schema.findAll({
            where: {
                organizationId: req.params.orgId
            },
			includes: [SchemaField, SchemaMapping]
        })

        res.json(schemas);
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

	async destroy(req, res){
		req.schema.status = 'deleted';
		await req.schema.save();
		res.json({result:'ok'});
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async create(req, res) {

		const info = req.body.schema;

        if (!info || _.isEmpty(info)){
            throw new ParamError(`You must pass organization info in the body`)
        }

        // See if we already have this item, and if not create.
		// TODO: for now, lets add in mocked data for testing
		const mock = new SchemaMock();

		const name = (info.name) ? info.name : mock.name;
        let schema = await Schema.findOne({where: {name: name}});

		if (!schema) {
			schema = await Schema.create({
				name: name,
				description: (info.description) ? info.description  : mock.description,
				organizationId: req.org.id
			});
		} 
		
		await schema.save();

		res.json(schema);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async get(req, res) {
		res.json(req.schema);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	//updates the user themselves
	async update(req, res) {

		// Don't let a user update these fields
		var forboden = ['_id', 'id', 'status', 'organizationId'];

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
