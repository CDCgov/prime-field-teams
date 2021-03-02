'use strict';
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const useragent = require('express-useragent');
const Logger = require('../utils/Logger');
const bearerToken = require('express-bearer-token');
const AuthError = require('../errors/AuthError');
require('express-async-errors');

//apicache.options({
//  appendKey: (req, res) => req.method + req.token,
//})

// @see https://expressjs.com/en/advanced/best-practice-security.html
exports.set = app => {
	app.disable('x-powered-by');
	app.use(
		morgan('dev', {
			skip: function(req, res) {
				// Log url's with bad status codes
				return res.statusCode < 400;
			}
		})
	);
	app.use(useragent.express());
	app.use(bodyParser.json({ limit: '50mb'}));
	app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
	app.use(allowCrossDomain);
	app.use(bearerToken()); // Attempt to extract bearer token, if in header, see https://www.npmjs.com/package/express-bearer-token
	app.use(helmet()); // Security
    //app.use(mongoSanitize()); // https://www.npmjs.com/package/express-mongo-sanitize
	//app.use(cacheMiddleware(process.env.CACHE_SLOW || 10));
};

//CORS middleware
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-Forwarded-For, X-Forwarded-Proto, X-Forwarded-Port, X-Requested-With, Content-Type');
	// intercept OPTIONS method and return 200
	if ('OPTIONS' == req.method) {
		res.sendStatus(200);
	} else {
		next();
	}
};

// Handle errors (NOTE: any middleware with 4 arguments is classified as "error handling middleware",
// and will only get called in an error occurs. @see https://expressjs.com/en/guide/error-handling.html
const errorHandler = function(err, req, res, next) {
		
	if (res.headersSent) {
		return next(err)
	}

	//var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	//var path = req.route ? req.route.path : '';
	let path = (req.originalUrl) ? req.originalUrl : req.url;
	let code = 500;

	Logger.error(`[${req.method}] ${path}: ${err.toString()}`);

	res.status(500);
	const msg = err.toString().replace('Error:', '');
	res.json({ result: 'fail', message: msg, error_description: msg });

	return false;
};

// Export if needed
exports.errorHandler = errorHandler;

