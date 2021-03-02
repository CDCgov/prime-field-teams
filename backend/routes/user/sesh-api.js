'use strict';
const Logger = require('../../utils/Logger');
const OktaService = require('../../services/OktaService');
const LoginGovService = require('../../services/LoginGovService');
const {Session, LoginStats, Person} = require('../../models');
const { Op } = require("sequelize");
const moment = require('moment');
const _ = require('lodash');
const AuthError = require('../../errors/AuthError');
const ParamError = require('../../errors/AuthError');
const requestIp = require('request-ip');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Cipher = require('../../utils/Cipher');

// Scopes and roles-to-scopes mapping
// TODO: These are here to serve as an example.
const SCOPES = {
	SUPER: 'prime.admin',
	SCHEMA_WRITE: 'prime.schema.write',
	SCHEMA_READ: 'prime.schema.read',
	USERS_WRITE: 'prime.users.write',
	USERS_READ: 'prime.users.read',
	ORG_WRITE: 'prime.org.write',
	ORG_READ: 'prime.org.read'
};

const ROLES = {
	'super': [SCOPES.SUPER], 
	'staff': [SCOPES.ORG_WRITE, SCOPES.USERS_WRITE, SCOPES.SCHEMA_WRITE], 
	'resident': [SCOPES.ORG_WRITE, SCOPES.USERS_READ, SCOPES.SCHEMA_WRITE], 
	'student': [SCOPES.ORG_READ, SCOPES.USERS_READ, SCOPES.SCHEMA_READ], 
	'visitor': [SCOPES.ORG_READ, SCOPES.USERS_READ, SCOPES.SCHEMA_READ], 
	'unknown': [], 
};


/**
 * SessonAPI
 * 
 * Notes on implmementatuion
 * 
 * When you register in a web app, using something like okta, you pass the id token given from okta
 * to the register end point, which will then return a sessio token (a access token for the PRIM API)
 * 
 * A log of all auth requests and the IP is stored in LoginStats.
 * 
 * This is currently also creating a record in the Person table, that maybe unnecessary.
 */
var SeshAPI = {

	// ///////////////////////////////////////////////////////////////////////////////////////

    /*
     * Just gate based on whether a user has a valid session
     */
    async hasSession(req, res, next) {        
        await SeshAPI.load(req);
        return next();
    },

	// ///////////////////////////////////////////////////////////////////////////////////////
        
    /*
     * Validate if its a super user or admin
     */
    async isSuper(req, res, next) {

        await SeshAPI.load(req);

        // Check if this is a global super user
        if (req.sesh.person.level == 'super') {
            return next();
        }

        throw new AuthError('You are not authorized to perform this action');        
    },

	// ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Middleware to load a session
     */
    async load(req, res, next) {

		// Support tokens passed as bearer tokens (Auth header) or in the query 
		let token = req.query.token ? req.query.token : req.token;

        if (!token){
			Logger.error('No token found ', req.headers);
            throw new ParamError(`You must pass a bearer token (Authorization header)`)
        }

        // Get session, and make sure it's still valid
		let sesh = await Session.findOne({ 
            where: {
                token: token,
                expires: {[Op.gte]: Date.now()}
            }
        });

		if (!sesh) {
            Logger.error(`Could not find valid session for token ${token}`);
			throw new AuthError('You are not logged in');
        }

        req.sesh = sesh;

		return next();

    },

	// ///////////////////////////////////////////////////////////////////////////////////////

	async __getUserFromToken(req){

		let userInfo = null;
		const provider = req.body.provider;
		const code = req.body.code;
		const state = req.body.state;

		if (!provider) {
			Logger.error(req.body);
			throw new ParamError('Missing provider');
		}

		if (!code) {
			Logger.error(req.body);
			throw new ParamError('Missing code (id token)');
		}

		if (provider == 'okta'){			
			
			// If we're using okta, check to see if we have a access token and if so,
			// check if it's legit
			let meta = await OktaService.verifyToken(code);
			if (!meta || !meta.claims){
				throw new AuthError(`Error verifying okta id token`);
			}
			//Logger.debug(`Authenticating using okta`, meta);
			userInfo = meta.claims;
		}
		else if (provider == 'login.gov'){
	
			// Convert code/state to a access token
			let tokenInfo = await LoginGovService.getTokenFromCode(code);

			if (!tokenInfo || !tokenInfo.access_token) {
				throw new AuthError(`Error getting access token`);
			}
	
			userInfo = await LoginGovService.getUserInfo(tokenInfo.access_token);
		}

		userInfo.provider = provider;
		return userInfo;

	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Register or login a user - when using login.gov, we always come back to this form an
	 * authentication request.
	 * @param {*} req
	 * @param {*} res
	 */
	async register(req, res) {
		
		Logger.debug('Entering session register..');

		let userInfo = await SeshAPI.__getUserFromToken(req);

		const cleanEmail = userInfo.email.toLowerCase().trim();
		const emailHash = Cipher.hash(cleanEmail);
		const uuid = userInfo.sub;
		const ipAddress = requestIp.getClientIp(req);

		// Housekeeping, clear old sessions (ideally the DB would have TTL capability to expire them)
		await Session.destroy({ where: { expires: { $lte: new Date() } } });

		// Look up user, and create if needed
		let user = await Person.findOne({
			where: {
				emailHash: emailHash
			}
		});

		if (!user){
			user = await Person.create({
				emailHash: emailHash,
				uuid: uuid,
				fullName: userInfo.name
			})
		}

		user.ipAddress = ipAddress;
		user.lastLogin = Date.now();
		await user.save();

		// Look up allowes scopes from the user's role
		let allowedScopes = [];
		if (user.level == 'super'){
			allowedScopes = ROLES['super'];
		}
		else if (user.role in ROLES){
			allowedScopes = ROLES[user.role];
		}

		//Logger.debug(`User has the ${user.role} role`, allowedScopes, ROLES);

		// Create session
		const sesh = await Session.create({
			personId: user.id,
			scopes: allowedScopes,
			emailHash: emailHash,
			expires: moment().add(process.env.TOKEN_DURATION, 'minutes'),
			token: crypto.randomBytes(64).toString('hex'),
			ip: ipAddress
		});

		/*
		TODO: For keeping track of user behavior, we can store each login... but for now, omitting
		NOTE: Okta/login.gov should also be doing this, but we may have our own reasons
		try {
			// Store in login stats table to detect any funny business
			let stat = new LoginStats({
				emailHash: emailHash,
				loginDate: new Date(),
				ip: ipAddress
			});

			await stat.save();
		} 
		catch (err) {
			Logger.error(`Error saving stats`, err);
		}
		*/
		
		res.json({ 
			access_token: sesh.token, 
			expires: sesh.expires, 
			user: user, 
			token_type: 'bearer' , 
			expires_in: process.env.TOKEN_DURATION*60,
			scopes: allowedScopes
		});

		Logger.debug('Leaving session register..');

	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	// http://hl7.org/fhir/uv/bulkdata/authorization/index.html
	async login(req, res){
				
		/*
		let opts = {
            grant_type: 'client_credentials',
            scope: [],
			client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
			client_assertion: signedClaims,
			exp: claims.exp
		};
		*/

		// See https://github.com/auth0/node-jsonwebtoken

        if (!req.body.client_assertion){
            throw new ParamError('You must pass a the client_assertion, the signed claims using RS384');
        }

		if (!req.body.grant_type || req.body.grant_type != 'client_credentials'){
            throw new ParamError('You must pass a the correct grant_type');
		}

		// TODO: fetch public key
		const secretOrPublicKey = '';

		// Verify token with share public key
		jwt.verify(req.body.client_assertion, secretOrPublicKey, {
			algorithms: ['RS384'],
		})

		/*
		// verify a token asymmetric
		var cert = fs.readFileSync('public.pem');  // get public key
		jwt.verify(token, cert, function(err, decoded) {
			console.log(decoded.foo) // bar
		});

		// verify audience
		var cert = fs.readFileSync('public.pem');  // get public key
		jwt.verify(token, cert, { audience: 'urn:foo' }, function(err, decoded) {
			// if audience mismatch, err == invalid audience
		});

		// verify issuer
		var cert = fs.readFileSync('public.pem');  // get public key
		jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer' }, function(err, decoded) {
			// if issuer mismatch, err == invalid issuer
		});

		// verify jwt id
		var cert = fs.readFileSync('public.pem');  // get public key
		jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer', jwtid: 'jwtid' }, function(err, decoded) {
			// if jwt id mismatch, err == invalid jwt id
		});

		// verify subject
		var cert = fs.readFileSync('public.pem');  // get public key
		jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer', jwtid: 'jwtid', subject: 'subject' }, function(err, decoded) {
			// if subject mismatch, err == invalid subject
		});

		// alg mismatch
		var cert = fs.readFileSync('public.pem'); // get public key
		jwt.verify(token, cert, { algorithms: ['RS256'] }, function (err, payload) {
			// if token alg != RS256,  err == invalid signature
		});

		*/
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async get(req, res) {
		
		let user = await Person.findOne({
			where: {
				id: req.sesh.personId
			},
			attributes: ['organizationId', 'fullName', 'id', 'uuid', 'preferences', 'level', 'status'],
			raw: true
		})

		res.json({
			access_token: req.sesh.token, 
			expires: req.sesh.expires, 
			user: user, 
			token_type: 'bearer' , 
			expires_in: process.env.TOKEN_DURATION*60,
			scopes: req.sesh.scopes
		});
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	async destroy(req, res){
		await req.sesh.destroy();
		res.json({result:'ok'});
	},

	// ///////////////////////////////////////////////////////////////////////////////////////

	generateKeys(req, res){
				
		const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
			modulusLength: 4096, // the length of your key in bits
			publicKeyEncoding: {
				type: 'spki', // recommended to be 'spki' by the Node.js docs
				format: 'pem'
			},
			privateKeyEncoding: {
				type: 'pkcs8', // recommended to be 'pkcs8' by the Node.js docs
				format: 'pem',
				//cipher: 'aes-256-cbc', // *optional*
				//passphrase: 'top secret' // *optional*
			}
		});

		res.json({public: publicKey, private: privateKey});

	}
};

module.exports = SeshAPI;
