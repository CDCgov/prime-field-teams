'use strict';
const Logger = require('../../utils/Logger');
const { PublicKey } = require('../../models');
const AuthError = require('../../errors/AuthError');
const ParamError = require('../../errors/ParamError');

const KeyAPI = {

	async getAll(req, res) {
		
		let keys = await PublicKey.findAll({
			where: {
				organizationId: this.sesh.user.organizationId
			}
		});

		res.json(keys);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async create(req, res) {
		
		let info = req.body.key;

        if (!info || _.isEmpty(info)){
            throw new ParamError(`You must pass key info in the body`)
        }

		let key = await PublicKey.create(info);

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
