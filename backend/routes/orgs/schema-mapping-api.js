'use strict';
const Logger = require('../../utils/Logger');
const {SchemaMapping} = require('../../models');
const _ = require('lodash');
const ParamError = require('../../errors/ParamError');

var SchemaMappingAPI = {

	// ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Middleware to load an employer
     */
    async load(req, res, next) {

        if (!req.params.mappingId){
            throw new ParamError(`You must pass a mappingId`)
        }

        req.fieldMapping = await SchemaMapping.findOne({
			where: {id: req.params.mappingId}
		});

		if (!req.fieldMapping) {
			throw new Error(`Could not find schema field ${req.params.mappingId}`);
		}

		return next();

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    async getAll(req, res) {
        
		if (!req.params.schemaId){
            throw new ParamError(`You must pass a schemaId`)
        }

        const schemas = await SchemaMapping.findAll({
            where: {
                schemaId: req.params.schemaId
            }
        })

        res.json(schemas);
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

	async destroy(req, res){
		req.fieldMapping.status = 'deleted';
		await req.fieldMapping.save();
		res.json({result:'ok'});
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async create(req, res) {

		let info = req.body.fieldMapping;

        if (!info || _.isEmpty(info)){
            info = {};
        }

		let schema = null;
        //let schema = await SchemaMapping.findOne({where: {name: name}});

		if (!schema) {
			schema = await SchemaMapping.create({
				schemaId: req.schema.id,
				organizationId: req.org.id
			});
		} 
		
		await schema.save();

		res.json(schema);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async get(req, res) {
		res.json(req.fieldMapping);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	//updates the user themselves
	async update(req, res) {

		// Don't let a user update these fields
		var forboden = ['_id', 'id', 'status', 'organizationId', 'schemaId'];

		Logger.debug(req.body.fieldMapping);

		for (var key in req.body.fieldMapping) {
			if (_.indexOf(forboden, key) == -1) {
				Logger.debug(`Setting ${key} = `, req.body.fieldMapping[key]);
				req.fieldMapping[key] = req.body.fieldMapping[key];
			}
		}

		let updated = await req.fieldMapping.save();

		res.json(updated);
	}

	// ///////////////////////////////////////////////////////////////////////////////////////
};

module.exports = SchemaMappingAPI;
