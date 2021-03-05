'use strict';
const Logger = require('../../utils/Logger');
const AuthError = require('../../errors/AuthError');
const ParamError = require('../../errors/ParamError');
const { PersonToOrganization, Organization } = require('../../models');
const OrganizationMock = require('../../mocks/OrganizationMock');
const _ = require('lodash');

const OrgAPI = {

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Middleware to load a user, for admin user only (use the auth middleware to protect route)
     */
    async load(req, res, next) {


        let orgId = req.params.orgId;

        if (!orgId){
            throw new ParamError(`You must pass a orgId`)
        }
		
		let includes = null;

		// If not a super user, we also verify this user has access to this org
		// Auth gates should really be doings this and also checking access level
		// but done here as a precaution.
		if (!req.sesh.user.level == 'super'){
			includes = [
				{
					model: PersonToOrganization,
					where: {personId: req.sesh.user.id}
				}
			];	
		}


		// Now pull the item info        
        req.org = await Organization.findOne({
			where: {
				id: orgId
			},
			includes: includes		
		});

        if (!req.org){
            Logger.error(`Could not find organization, orgId = ${orgId}`);
			throw new AuthError(`Could not find the specified organization`);
        }
        
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
		
		let info = req.body.org;

        if (!info || _.isEmpty(info)){
            throw new ParamError(`You must pass organization info in the body`)
        }

        // See if we already have this item, and if not create.
		// TODO: for now, lets add in mocked data for testing
		let mock = new OrganizationMock();

        let org = await Organization.findOne({where: {name: info.name}});

		if (!org) {
			org = await Organization.create({
				name: (info.name) ? info.name  : mock.name,
				description: (info.description) ? info.description  : mock.description,
				url: (info.url) ? info.url  : mock.url,
				faxNumber: (info.faxNumber) ? info.faxNumber  : mock.faxNumber,
				phoneNumber: (info.phoneNumber) ? info.phoneNumber  : mock.phoneNumber,
				icon: (info.icon) ? info.icon  : mock.icon
			});
		} 
		
		await org.save();

		// Create mapping from current user to this new org
		await PersonToOrganization.create({
			personId: req.sesh.user.id,
			organizationId: org.id,
			role: 'staff', // <--- assumption!!
			status: 'active'		
		})

		res.json(org);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Perform a soft delete, assumes item has a `status` field
     * @param {array} forboden An array of keys that aren't allowed to be modified
     * @param {object} req Express req object
     * @param {object} res Express res object
     */    
	async destroy(req, res) {
		req.org.status = 'deleted';
        await req.org.save();
        res.json(req.org);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async get(req, res) {
		res.json(req.org);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update an item, 
     * @param {array} forboden An array of keys that aren't allowed to be modified
     * @param {object} req Express req object
     * @param {object} res Express res object
     */
	async update(req, res) {

		Logger.debug('Entering org update', req.body);
		
		// Don't let a user update these fields
		var forboden = ['id', 'status'];

		for (var key in req.body.org) {
			if (_.indexOf(forboden, key) == -1) {
				Logger.debug(`Setting ${key} = `, req.body.org[key]);
				req.org[key] = req.body.org[key];
			}
		}

		let updated = await req.org.save();

		res.json(updated);
	},
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	async search(req, res){
			
		let queryParams = req.query; // or req.body if a post?

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

		let qry = {status:'active'};

		if (queryParams.name) {
			qry.name = {[Op.iLike]: `%${queryParams.name.trim()}%`}
		}
		if (queryParams.description) {
			qry.name =  {[Op.iLike]: `%${queryParams.description.trim()}%`}
		}
		
		// Clamp the results to the orgs the current user has access to
		let includes = null;

		if (!req.sesh.user.level == 'super'){
			includes = [
				{
					model: PersonToOrganization,
					where: {personId: req.sesh.user.id}
				}
			];
		}

		// Fields that we don't want to send back
		let forboden = [];

		let count = await Organization.count({
			where: qry,
			include: includes
		})

		let docs = await Organization.findAll({
            where: qry,
            limit: limit,
            offset: skip,
			order: [orderBy],
			includes: includes,
			attributes: { exclude: forboden },
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

		res.json(data);


	}
};

module.exports = OrgAPI;
