'use strict';
const Logger = require('../../utils/Logger');
const { PublicKey } = require('../../models');
const AuthError = require('../../errors/AuthError');
const ParamError = require('../../errors/ParamError');
const Chance = require('chance');
const _ = require('lodash');
const slugify = require('slugify');
const adjective = require('../../mocks/adjectives');

const KeyAPI = {

	async getAll(req, res) {
		
		let keys = await PublicKey.findAll({
			where: {
				organizationId: req.org.id
			}
		});

		res.json(keys);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async create(req, res) {
		
		let info = req.body.key;

		Logger.debug('CREATING KEY', req.body.key)

        if (!info || _.isEmpty(info)){
            info = {};
        }

		let chance = new Chance();
		let name = (info.name) ? info.name : _.sample(adjective) + ' ' + chance.animal();

		if (_.isArray(info.scopes)){
			info.scopes = info.scopes.join(', ');
		}

		let key = await PublicKey.create({
			organizationId: req.org.id,
			slug: slugify(`${req.org.name} ${name}`, {lower:true, strict:true}),
			createdByPersonId: req.sesh.personId,
			scopes: (info.scopes) ? info.scopes : 'prime.schema.read, prime.org.read, prime.users.read',
			name: name,
			url: (info.url) ? info.url : null,
			contents: (info.contents) ? info.contents : null,
		});
		

		res.json(key);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////
  
	async destroy(req, res) {
        
		let keyId = req.params.keyId;

        if (!keyId){
            throw new ParamError(`You must pass a keyId`)
        }	

		await PublicKey.destroy({where: {id: keyId}});
		return res.json({result:'ok'});
	}



};

module.exports = KeyAPI;
