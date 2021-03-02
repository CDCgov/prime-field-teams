'use strict';

const express = require('express');
const Logger = require('./lib/utils/Logger');
const app = express();
//const person2OrgApi = require('./lib/routes/person-to-org-api');
const orgApi = require('./lib/routes/org-api');
const keyApi = require('./lib/routes/key-api');
const auth = require('./lib/middleware/auth');
const middleware = require('./lib/middleware');
require('express-async-errors');
const PORT = process.env.PORT ? process.env.PORT : 7564;

// Add in the middleware
middleware.set(app);

// Organization CRUD methods
app.get('/org/search', auth.hasSession, orgApi.search); // Search within the orgs this person has access to
app.get('/org/:orgId', auth.isOrgUser, orgApi.load, orgApi.get);
app.put('/org/:orgId', auth.isOrgAdmin, orgApi.load, orgApi.update);
app.delete('/org/:orgId', auth.isSuper, orgApi.load, orgApi.destroy);
app.post('/org', auth.isSuper, orgApi.create);

// Managing org users 
//app.post('/org/:orgId/person/:personId', auth.isOrgAdmin, person2OrgApi.addPerson);
//app.put('/org/:orgId/person/:personId', auth.isOrgAdmin, person2OrgApi.update);
//app.delete('/org/:orgId/person/:personId', auth.isOrgAdmin, person2OrgApi.removePerson);

// Managing org public keys
app.post('/org/:orgId/key', auth.isOrgAdmin, keyApi.create);
app.delete('/org/:orgId/key/:keyId', auth.isOrgAdmin, keyApi.destroy);


// API catch all and redirect to 404 page
app.route('*', function(req, res) {
    res.status(404).send({ error: 'Undefined command:' + req.originalUrl });
});

// Lastly, set error handler
app.use(middleware.errorHandler);

// Listen for shut down so we can handle it gracefully
process.on('SIGTERM', function() {
    Logger.info('Closing');
    app.close();
});

var server = app.listen(PORT, function() {
    Logger.info(`Listening on port ${PORT}`);
});

// Export server (handy for running tests against the API)
module.exports = app;


