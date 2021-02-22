'use strict';

const Logger = require('../utils/Logger');
const {User, Account, Session} = require('../models');
const _ = require('lodash');
const requestIp = require('request-ip');
const AuthError = require('../errors/AuthError');

var Auth = {
 
    async _loadSession(req) {

        let token = req.query.token ? req.query.token : req.token;

		if (!token){
			throw new AuthError('You must pass a token!');
		}        

        // Get session
		let sesh = await Session.findOne({ where: {token: token }});

		if (!sesh) {
            Logger.error(`Could not find session ${req.token}`);
			throw new AuthError('You are not logged in');
        }
        
        let user = await User.findOne({where: {id:sesh.personId}});

        if (!user){
            Logger.error(`Could not find user from session, user id = ${sesh.personId}`);
			throw new AuthError('Could not find user in session');
        }

        req.user = user;
    },

    /*
     * valdiate if this user is logged in
     */
    async isUser(req, res, next) {
        
        await Auth._loadSession(req);

        //if (req.user.status != 'approved') {
        //    Logger.warn(req.user);
        //    throw new AuthError(`You're account has not been approved`);
        //}

        return next();
    },

    /*
     * Validate if this user is an admin (TODO: for the current account?)
     */
    async isAdmin(req, res, next) {

        await Auth._getUser(req, res);

        // Check if this is a global super user
        if (req.user.level != 'super' && req.user.level != 'admin') {
            throw new AuthError('You are not authorized');
        }

        return next();
    },
        
    /*
     * Validate if its a super user or admin
     */
    async isSuper(req, res, next) {

        await Auth._getUser(req, res);

        // Check if this is a global super user
        if (req.user.level != 'super') {
            throw new AuthError('You are not authorized');
        }

        return next();
    }
};

module.exports = Auth;
