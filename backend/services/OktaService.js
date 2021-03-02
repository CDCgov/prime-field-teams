



 "use strict";
const Logger = require('../utils/Logger');
const AuthError = require('../errors/AuthError');
// Used for managing users 
const okta = require('@okta/okta-sdk-nodejs');
// Used to verify jwt tokens
const OktaJwtVerifier = require('@okta/jwt-verifier');

var OktaService = {

    /**
     * @see https://www.npmjs.com/package/@okta/okta-sdk-nodejs
     */
    __getClient(){
        const client = new okta.Client({
            orgUrl: process.env.OKTA_ORG_URL,
            //authorizationMode: 'PrivateKey',
            clientId: process.env.OKTA_CLIENT_ID,
            //scopes: ['okta.users.manage'],
            token: process.env.OKTA_SECRET
        });        
    },

	// ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Check if a idToken given by Okta is valid, and returns the decoded JWT if so
     * @param {string} idToken 
     */
    async verifyToken(idToken){

        const oktaJwtVerifier = new OktaJwtVerifier({
            issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`
        });
          
        const jwt = await oktaJwtVerifier.verifyAccessToken(idToken, process.env.OKTA_CLIENT_ID);

        return jwt;

    },


	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Exchange OpenID code for a token
	 * @see https://developers.login.gov/oidc/
	 * @param {*} req
	 * @param {*} res
	 * @param {*} next
	 */
	async getTokenFromCode(code) {

        return false;
	}   

}

module.exports = OktaService;
