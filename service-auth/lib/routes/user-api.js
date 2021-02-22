'use strict';
const Logger = require('../utils/Logger');
const OktaService = require('../services/OktaService');
const LoginGovService = require('../services/LoginGovService');
const {Person, Session, LoginStats} = require('../models');
const moment = require('moment');
const _ = require('lodash');
const AuthError = require('../errors/AuthError');
const requestIp = require('request-ip');
const Cipher = require('../utils/Cipher');
const crypto = require('crypto');
var UserAPI = {

	// ///////////////////////////////////////////////////////////////////////////////////////

	async __getUserFromToken(req){

		let userInfo = null;
		let provider = req.body.provider;

		if (provider == 'okta'){			
			const idToken = req.body.idToken;
			// If we're using okta, check to see if we have a access token and if so,
			// check if it's legit
			let meta = await OktaService.verifyToken(idToken);
			if (!meta || !meta.claims){
				throw new AuthError(`Error verifying okta id token`);
			}
			userInfo = meta.claims;
		}
		else if (provider == 'login.gov'){

			// TODO: need to test following
			const code = req.body.code;
			const state = req.body.state;
	
			if (!code) {
				throw new Error('Missing code');
			}

			// Convert code/state to a access token
			let tokenInfo = await LoginGov.getTokenFromCode(code);

			if (!tokenInfo || !tokenInfo.access_token) {
				throw new AuthError(`Error getting access token`);
			}
	
			userInfo = await UserAPI._getUserInfo(tokenInfo.access_token);
		}

		userInfo.provider = provider;
		return userInfo;

	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async __createSession(user, ipAddress){

		// Housekeeping, clear old sessions (won't need to once we switch to redis)
		await Session.destroy({ where: { expires: { $lte: new Date() } } });

		// Create session
		let sesh = new Session({
			personId: user.id,
			expires: moment().add(process.env.TOKEN_DURATION, 'minutes'),
			token: crypto.randomBytes(64).toString('hex'),
			ip: ipAddress
		});

		return await sesh.save();
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Register or login a user - when using login.gov, we always come back to this form an
	 * authentication request.
	 * @param {*} req
	 * @param {*} res
	 */
	async register(req, res) {
		
		let userInfo = await UserAPI.__getUserFromToken(req);

		const cleanEmail = userInfo.email.toLowerCase().trim();
		//const emailHash = Cipher.encode(userInfo.email.toLowerCase());
		const uuid = userInfo.sub;

		var user = await Person.findOne({
			where: { 
				email: cleanEmail
			} 
		});

		if (!user) {
			user = await Person.create({
				email: cleanEmail,
				uuid: uuid,
				preferences: {}
			});
		}  
		else if (user && !user.uuid) {
			user.uuid = userInfo.sub; // this can change if the auth provider changed
		}

		if (userInfo.name){

		}
		user.firstName = userInfo.name.split(' ')[0];
		user.lastName = userInfo.name.split(' ')[1];
		user.lastIp = requestIp.getClientIp(req);
		user.lastLogin = new Date();

		let savedUser = await user.save();

		// Store in login stats table to detect any funny business
		let stat = new LoginStats({
			personId: savedUser.id,
			loginDate: new Date(),
			ip: savedUser.ip
		});

		try {
			await stat.save();
		} 
		catch (err) {
			Logger.error(`Error saving stats`, err);
		}

		Logger.debug('Creating session');

		// Now create and return the session
		const sesh = await UserAPI.__createSession(user, requestIp.getClientIp(req));

		res.json({ token: sesh.token, expires: sesh.expires, user: user });
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async get(req, res) {
		res.json(req.user);
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	//updates the user themselves
	async update(req, res) {
		// Don't let a user update these fields
		var forboden = ['_id', 'id', 'status', 'level', 'email'];

		Logger.debug(req.body.user);

		for (var key in req.body.user) {
			if (_.indexOf(forboden, key) == -1) {
				Logger.debug(`Setting ${key} = `, req.body.user[key]);
				req.user[key] = req.body.user[key];
			}
		}

		let updatedUser = await req.user.save();

		res.json(updatedUser);
	}

	// ///////////////////////////////////////////////////////////////////////////////////////
};

module.exports = UserAPI;
