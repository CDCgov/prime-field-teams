'use strict';
const Logger = require('../../utils/Logger');
const {SchemaField} = require('../../models');
const _ = require('lodash');
const SchemaFieldMock = require('../../mocks/SchemaFieldMock');
const AuthError = require('../../errors/AuthError');
const ParamError = require('../../errors/ParamError');

var SchemaFieldAPI = {

	// ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Middleware to load an employer
     */
    async load(req, res, next) {

        if (!req.params.fieldId){
            throw new ParamError(`You must pass a fieldId`)
        }

        req.schemaField = await SchemaField.findOne({
			where: {id: req.params.fieldId}
		});

		if (!req.schemaField) {
			throw new Error(`Could not find schema field ${req.params.fieldId}`);
		}

		return next();

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    async getAll(req, res) {
        
		if (!req.params.schemaId){
            throw new ParamError(`You must pass a schemaId`)
        }

        const schemas = await SchemaField.findAll({
            where: {
                schemaId: req.params.schemaId
            }
        })

        res.json(schemas);
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

	async destroy(req, res){
		req.schemaField.status = 'deleted';
		await req.schemaField.save();
		res.json({result:'ok'});
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async create(req, res) {

		let info = req.body.schemaField;

        if (!info || _.isEmpty(info)){
			info = {};
            //throw new ParamError(`You must pass schemaField in the body`)
        }

        // See if we already have this item, and if not create.
		// TODO: for now, lets add in mocked data for testing
		//const mock = new SchemaFieldMock();
		//const name = (info.name) ? info.name : mock.name;
        //let schema = await SchemaField.findOne({where: {name: name}});
		let schema = null;

		if (!schema) {
			schema = await SchemaField.create({
				schemaId: req.schema.id,
				organizationId: req.org.id
			});
		} 
		
		await schema.save();

		res.json(schema);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async get(req, res) {
		res.json(req.schemaField);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	//updates the user themselves
	async update(req, res) {

		// Don't let a user update these fields
		var forboden = ['_id', 'id', 'status', 'organizationId', 'schemaId'];

		Logger.debug(req.body.schemaField);

		for (var key in req.body.schemaField) {
			if (_.indexOf(forboden, key) == -1) {
				Logger.debug(`Setting ${key} = `, req.body.schemaField[key]);
				req.schemaField[key] = req.body.schemaField[key];
			}
		}

		let updated = await req.schemaField.save();

		res.json(updated);
	}

	// ///////////////////////////////////////////////////////////////////////////////////////
};

module.exports = SchemaFieldAPI;
