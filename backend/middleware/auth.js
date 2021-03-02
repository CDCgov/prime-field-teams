'use strict';

const Logger = require('../utils/Logger');
const _ = require('lodash');
const { PersonToOrganization, Person, Session } = require('../models');
const AuthError = require('../errors/AuthError');

/**
 * Authentication middleware
 */
const AuthAPI = {
 
    scopes: {
        SUPER: 'prime.admin',
        SCHEMA_WRITE: 'prime.schema.write',
        SCHEMA_READ: 'prime.schema.read',
        USERS_WRITE: 'prime.users.write',
        USERS_READ: 'prime.users.read',
        ORG_WRITE: 'prime.org.write',
        ORG_READ: 'prime.org.read'
    },

    /**
     * Load a session
     * @param {*} req 
     */
    async _loadAndCheckSession(req) {

        let token = req.query.token ? req.query.token : req.token;

		if (!token){
			throw new AuthError('You must pass a token!');
		}        

        // Get session
        //UserService.setSesssionToken(token);        
        //req.sesh = await UserService.getSesh();
        req.sesh = await Session.findOne({
            where: {
                token: token
            },
            raw: true
        })

		if (!req.sesh) {
            //Logger.error(`Could not find valid session for token ${req.token}`);
			throw new AuthError('You are not logged in');
        }

        Logger.debug(req.sesh);

        // Look up the user, and create if we need to (we have a valid session at this point)
        let personId = req.sesh.personId;

        // Load the user ourself, we may not need to do this if we trust the user info in the session
        req.sesh.user = await Person.findOne({
            where: {
                id: personId
            },
            attributes: ['id', 'level', 'uuid', 'status'],
            raw: true
        });

        if (!req.sesh.user || !personId){
            throw new AuthError(`Could not find user from session, personId = ${personId}`);
        }

    },

    async get(req, res){
        await AuthAPI._loadAndCheckSession(req);
        res.json(req.sesh);
    },

    /**
     * The allowes scopes for this user is in the session, so we need to compare what they 
     * are allowed .v. what they are requesting
     * @param {array} requiredScopes Can match to any of the provider scopes (and also super user)
     * @param {*} req 
     * @param {*} next 
     */
    async __checkOrgAccess(requiredScopes, req, next){

        // Get the session, if it exists
        await AuthAPI._loadAndCheckSession(req);

        if (!_.isEmpty(req.sesh.scopes)){

            if (req.sesh.user.level = 'super') {
            //if (req.sesh.scopes.contains(AuthAPI.scopes.SUPER)){
                // Super user, let through
                return next();
            }
            
            else if (_.xor(req.sesh.scopes, requiredScopes).length){
                // User has the right scope, but we still need to check they have access to this organization
                let person2org = await PersonToOrganization.findOne({where: {
                    personId: req.person.id,
                    organizationId: req.params.orgId
                }})
                if (person2org){
                    return next();
                }
            }
    
        }

        //Logger.error(`User level ${req.sesh.user.level}, scopes = ${req.sesh.scopes.join(', ')}`);
        throw new AuthError('You are not authorized to perform this action');        
    },

    async isOrgUser(req, res, next) {    
        return await AuthAPI.__checkOrgAccess([AuthAPI.scopes.ORG_WRITE, AuthAPI.scopes.ORG_READ], req, next);
    },
        
    async isOrgAdmin(req, res, next) {
        return await AuthAPI.__checkOrgAccess([AuthAPI.scopes.ORG_WRITE], req, next);
    },

    /*
     * Just gate based on whether a user has a valid session
     */
    async hasSession(req, res, next) {        
        await AuthAPI._loadAndCheckSession(req);
        return next();
    },

        
    /*
     * Validate if its a super user or admin
     */
    async isSuper(req, res, next) {

        await AuthAPI._loadAndCheckSession(req);

        Logger.debug(req.sesh.user);

        // Check if this is a global super user
        if (req.sesh.user.level = 'super') {
            return next();
        }

        throw new AuthError('You are not authorized to perform this action');        
    }
};

module.exports = AuthAPI;
