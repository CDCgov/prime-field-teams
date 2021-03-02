'use strict';

const express = require('express');
const router = express.Router();
const seshApi = require('./sesh-api');
const userApi = require('./user-api');
require('express-async-errors');

// Authentication
router.get('/auth', seshApi.load, seshApi.get); // Check a session access token is valid
router.post('/auth', seshApi.register);  // Register and create session
router.delete('/auth', seshApi.destroy);  // Logout, destroy session
router.get('/auth/token', seshApi.login); 
router.get('/auth/keys', seshApi.generateKeys); 

// User CRUD methods
router.get('', seshApi.hasSession, userApi.loadSelf, userApi.get); // Get yourself
router.put('', seshApi.hasSession, userApi.loadSelf, userApi.update); // Update yourself

//router.get('/search', auth.isUser, userApi.search);
router.get('/:personId', seshApi.isSuper, userApi.load, userApi.get); // Get another person
router.put('/:personId', seshApi.isSuper, userApi.load, userApi.update); // Update another person
router.delete('/:personId', seshApi.isSuper, userApi.load, userApi.destroy);

module.exports = router;