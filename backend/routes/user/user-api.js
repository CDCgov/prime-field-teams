'use strict';
const Logger = require('../../utils/Logger');
const { Person } = require('../../models');
const Cipher = require('../../utils/Cipher');

const UserAPI = {

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * If we're performing a crud operation on ourselves, then we just copy the session user to the req.person object
     */
    async loadSelf(req, res, next) {
        req.person = this.sesh.person;
        next();
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Middleware to load a user, for admin user only (use the auth middleware to protect route)
     */
    async load(req, res, next) {

        let personId = req.params.personId;

        if (!personId){
            throw new ParamError(`You must pass a personId`)
        }

		// Now pull the item info        
        let item = await Person.findOne({where: {id: personId}});

        if (!item){
            Logger.error(`Could not find person, personId = ${personId}`);
			throw new AuthError(`Could not find the specified person`);
        }

        req.person = item;

		return next();

    },

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new item
     * @param {function} qryGenerator A function that generates the query used to determine if we already have this item
     * @param {object} req Express req object
     * @param {object} res Express res object
     */
	async create(req, res) {
		
		let info = req.body.person;

        if (!info || _.isEmpty(info)){
            throw new ParamError(`You must pass person info in the body`)
        }

        // See if we already have this item
        let item = await Person.findOne({where: {name: req.body.person}});

		if (!item) {
			item = await Person.create(info);
		} 

		await item.save();

		res.json(item);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Perform a soft delete, assumes item has a `status` field
     * @param {array} forboden An array of keys that aren't allowed to be modified
     * @param {object} req Express req object
     * @param {object} res Express res object
     */    
	async destroy(req, res) {
		req.person.status = 'deleted';
        await req.person.save();
        res.json(req.person);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async get(req, res) {
		res.json(req.person);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update an item, 
     * @param {array} forboden An array of keys that aren't allowed to be modified
     * @param {object} req Express req object
     * @param {object} res Express res object
     */
	async update(req, res) {

		// Don't let a user update these fields
		var forboden = ['id', 'uuid', 'emailHash', 'level', 'created', 'modified'];

		for (var key in req.body.person) {
			if (_.indexOf(forboden, key) == -1) {
				Logger.debug(`Setting ${key} = `, req.body.person[key]);
				req.person[key] = req.body.person[key];
			}
		}

		let updated = await req.person.save();

		res.json(updated);
	},


	// ///////////////////////////////////////////////////////////////////////////////////////

	async search(req, res){
	
		let queryParams = req.query; // or req.body if a post?
        let includes = null;

		// Paging support
        let limit = _.isNumber(queryParams.limit) ? parseInt(queryParams.limit) : 50;
        let skip = _.isNumber(queryParams.skip) ? parseInt(queryParams.skip) : 0;

		// Allow setting the sort key
        let orderBy = ['created', 'DESC'];

        if (queryParams.sortKey && queryParams.sortDirection == -1) {
            orderBy = [queryParams.sortKey, 'DESC'];
        } 
        else if (queryParams.sortKey) {
            orderBy = [queryParams.sortKey, 'ASC'];
        }

		let qry = {};

		if (queryParams.name) {
            // The name is encrpyted, so searching requires us to hash the name first
            let nameHash = Cipher.encode(queryParams.name);
			qry.fullName = {[Op.like]: `%${nameHash}%`}
		}

        if (queryParams.personId){
            includes = [{
                model: PersonToPerson,
                where: {personId: queryParams.personId},
                as: 'personToPerson'
            }]
        }

		// Fields that we don't want to send back
		let forboden = [];

		let count = await Person.count({
			where: qry,
			//include: includes
		})

		let docs = await Person.findAll({
            where: qry,
            limit: limit,
            offset: skip,
			order: [orderBy],
			attributes: { exclude: forboden },
			include: includes,
			raw: true, 
			nest: true
		});

        var data = {
            results: docs,
            meta: {
                pageNumber: Math.ceil(skip / limit),
                limit: limit,
                skip: skip,
                numberPages: Math.ceil(count / limit),
                totalResults: count
            }
		};

		return data;


	}
};

module.exports = UserAPI;
