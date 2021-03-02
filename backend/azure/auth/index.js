const Settings = require('../lib/Settings');
const Logger = require('../lib/utils/Logger');
const userApi = require('../lib/routes/user-api');
//const authApi = require('./lib/routes/auth-api');
const {errorHandler} = require('../lib/middleware');
const extendContext = require('../lib/azure/utils/extend-context');

// https://docs.microsoft.com/en-us/azure/azure-functions/shift-expressjs?tabs=javascript


module.exports = async function (context, req) {

    // Direct console logging to azure logging, but as this will use the Logger class we
    // can control using that.
    console = {
        log: context.log,
        error: context.error,
        warn: context.warn,
        info: context.info,
        debug: context.log
    }
    
    // Extend azure context with express mocks (res.json etc.)
    extendContext(context);

    try {
        //app.get('/auth', authApi.isUser, userApi.get);
        //app.post('/auth', userApi.register);
        //app.put('/auth', authApi.isUser, userApi.update);
        await userApi.register(req, context.res);
    } 
    catch (err) {
        errorHandler(err, req, context.res);
    }

}