'use strict';
const Logger = require('../../utils/Logger');
const {User, Session, LoginStats} = require('../../models');
const moment = require('moment');
const _ = require('lodash');
const AuthError = require('../../errors/AuthError');
const requestIp = require('request-ip');
const Cipher = require('../../utils/Cipher');

var UserAPI = {

	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Register or login a user - when using login.gov, we always come back to this form an
	 * authentication request.
	 * @param {*} req
	 * @param {*} res
	 */
	async register(req, res) {

		let code = (req.query.code) ? req.query.code : req.params.code;
		let state = (req.query.state) ? req.query.state : req.params.state;

		if (!code) {
			throw new Error('Missing code');
		}

		Logger.debug('Code = ', code);

		let tokenInfo = await UserAPI._getTokenFromCode(code);

		Logger.debug('tokenInfo = ', tokenInfo);

		if (!tokenInfo || !tokenInfo.access_token) {
			throw new AuthError(`Error getting access token`);
		}

		const userInfo = await UserAPI._getUserInfo(tokenInfo.access_token);
		const emailHash = Cipher.encode(userInfo.email.toLowerCase());
		const uuid = userInfo.sub;

		Logger.debug('Login.gov User = ', userInfo);

		// Now look up user on our side
		var user = await User.findOne({ 
			where: { 
				uuid: uuid 
			} 
		});

		if (!user) {
			user = await User.create({
				emailEncoded: emailHash,
				uuid: uuid,
				name: null,
				level: 'admin',
				status: 'active',
				preferences: {}
			});
		} 
		else if (user && !user.uuid) {
			user.uuid = userInfo.sub;
			user.level = user.level ? user.level : 'user';
		}

		user.ip = requestIp.getClientIp(req);
		user.lastLogin = new Date();

		let savedUser = await user.save();

		let stat = new LoginStats({
			personId: savedUser.id,
			loginDate: new Date(),
			ip: savedUser.ip
		});

		try {
			await stat.save();
		} catch (err) {
			Logger.error(`Error saving stats`, stat.dataValues);
		}
		// Housekeeping, clear old sessions (won't need to once we switch to redis)
		await Session.destroy({ where: { expires: { $lte: new Date() } } });

		// Create session
		let sesh = new Session({
			personId: user.id,
			expires: moment().add(process.env.TOKEN_DURATION, 'minutes'),
			token: randomString(64),
			loginToken: tokenInfo,
			loginGovTokenInfo: tokenInfo,
			ip: requestIp.getClientIp(req)
		});

		await sesh.save();

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
