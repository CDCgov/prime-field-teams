'use strict';

const express = require('express');
const Logger = require('./lib/utils/Logger');
const app = express();
const userApi = require('./lib/routes/user-api');
const authApi = require('./lib/routes/auth-api');
const middleware = require('./lib/routes/middleware');
require('express-async-errors');
const PORT = process.env.PORT ? process.env.PORT : 7564;

// Add in the middleware
middleware.set(app);

app.get('/user', authApi.isUser, userApi.get);
app.post('/user/auth', userApi.register);
app.put('/user', authApi.isUser, userApi.update);

// Check a session token is valid
app.get('/user/sesh', authApi.get);

// Serve up examples
app.use(express.static('public'))

// API catch all and redirect to 404 page
app.route('*', function(req, res) {
    res.status(404).send({ error: 'Undefined command:' + req.originalUrl });
});

// Start App
middleware.setFinal(app);

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


