'use strict';

const express = require('express');
const router = express.Router();
const userApi = require('./user-api.js');
//const appointmentApi = require('./appointment-api.js');
const auth = require('../middleware/auth');
require('express-async-errors');

/*
router.get('/', auth.hasSession, userApi.get);
router.post('/', userApi.register);
router.put('/', auth.hasSession, userApi.update);
*/

router.get('/', auth.isUser, userApi.get);
router.get('/auth', userApi.register);
router.put('/', auth.isUser, userApi.update);

//router.post('/appointments/upload', auth.isUser, appointmentApi.upload);
//router.get('/appointments', auth.isUser, appointmentApi.getAll);

module.exports = router;






