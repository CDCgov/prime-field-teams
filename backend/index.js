'use strict';

const express = require('express');
const Logger = require('./utils/Logger');
const app = express();
const userService = require('./routes/user');
const orgService = require('./routes/orgs');
const middleware = require('./middleware');
require('express-async-errors');
const PORT = process.env.PORT ? process.env.PORT : 7001;

// Add in the middleware
middleware.set(app);

app.use('/user', userService);
app.use('/org', orgService);

// API catch all and redirect to 404 page
app.route('*', function(req, res) {
    res.status(404).send({ error: 'Undefined command:' + req.originalUrl });
});

// Lastly, set error handler
app.use(middleware.errorHandler);

app.listen(PORT, function() {
    Logger.info(`Listening on port ${PORT}`);
});

// Export server (handy for running tests against the API)
module.exports = app;


