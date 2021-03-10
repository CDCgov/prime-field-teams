'use strict';
const Logger = require('../../utils/Logger');
const { PersonToOrganization, Person } = require('../../models');
const ParamError = require('../../errors/ParamError');
const AuthError = require('../../errors/AuthError');
const Cipher = require('../../utils/Cipher');

const PersonToOrgAPI = {

	// ///////////////////////////////////////////////////////////////////////////////////////

	async __load(req){
		if (!req.params.personId){
            throw new ParamError('You must pass a personId');
        }
		if (!req.params.orgId){
            throw new ParamError('You must pass a orgId');
        }

		let qry = {
			organizationId: req.params.orgId,
			personId: req.params.personId,
		};

		return await PersonToOrganization.findOne({where: qry});			
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async getAll(req, res){
		
		let peeps = await Person.findAll({
			where: {},
			includes: {
                model: PersonToOrganization,
                where: {organizationId: req.org.id},
			},
			attributes: ['uuid', 'fullName', 'fullName_encrypted', 'id', 'lastLogin', 'level', 'status'],
			raw: true,
			nest: true
		});

		// Decrypt the full names
		for (let i=0; i<peeps.length; i+=1){
			peeps[i].fullName = Cipher.decode(peeps[i].fullName_encrypted);
		}
	
		res.json(peeps);

	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async addPerson(req, res){
		
		let person2org = PersonToOrgAPI.__load(req);
		
		if (!person2org){
			person2org = new PersonToOrganization.create({
				organizationId: req.params.orgId,
				personId: req.params.personId,
				level: 'user'		
			});
		}		
	
		res.json(person2org);

	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async removePerson(req, res){
		await PersonToOrganization.destroy({
			organizationId: req.params.orgId,
			personId: req.params.personId
		});
		res.json({result:'ok', personId: req.params.personId, organizationId: req.params.orgId});
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async update(req, res){

		let person2org = PersonToOrgAPI.__load(req);

		if (!person2org){
			throw new AuthError('Could not find this person for this organization');
		}

		// Only super users or org admin's can change the person's access level for this org
		// TODO: for now, only super users can do this. Need to extend or org admin's
		if (req.sesh.person.level == 'super'){
			person2org.level = req.body.level;
		}

		await person2org.save();

		res.json(person2org)
	}	
};

module.exports = PersonToOrgAPI;
