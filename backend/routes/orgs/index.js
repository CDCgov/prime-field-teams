'use strict';

const express = require('express');
const router = express.Router();
const orgApi = require('./org-api');
const keyApi = require('./key-api');
const auth = require('../../middleware/auth');
require('express-async-errors');

// Organization CRUD methods
router.get('/search', auth.isOrgUser, orgApi.search); // Search within the orgs this person has access to
router.get('/:orgId', auth.isOrgUser, orgApi.load, orgApi.get);
router.put('/:orgId', auth.isOrgAdmin, orgApi.load, orgApi.update);
router.delete('/:orgId', auth.isSuper, orgApi.load, orgApi.destroy);
router.post('', auth.isSuper, orgApi.create);

// Managing org users 
//router.post('/:orgId/person/:personId', auth.isOrgAdmin, person2OrgApi.addPerson);
//router.put('/:orgId/person/:personId', auth.isOrgAdmin, person2OrgApi.update);
//router.delete('/:orgId/person/:personId', auth.isOrgAdmin, person2OrgApi.removePerson);

// Managing org public keys
router.post('/:orgId', auth.isOrgAdmin, keyApi.create);
router.delete('/:orgId/key/:keyId', auth.isOrgAdmin, keyApi.destroy);


module.exports = router;