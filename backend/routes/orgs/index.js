'use strict';

const express = require('express');
const router = express.Router();
const orgApi = require('./org-api');
const keyApi = require('./key-api');
const schemaApi = require('./schema-api');
const schemaFieldApi = require('./schema-field-api');
const schemaMapApi = require('./schema-mapping-api');
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
router.get('/:orgId/key', auth.isOrgUser, orgApi.load, keyApi.getAll);
router.post('/:orgId/key', auth.isOrgAdmin, orgApi.load, keyApi.create);
router.delete('/:orgId/key/:keyId', auth.isOrgAdmin, keyApi.destroy);

// Schema management
router.get('/:orgId/schema', auth.isOrgUser, schemaApi.getAll);
router.post('/:orgId/schema', auth.isOrgAdmin, orgApi.load, schemaApi.create);
router.get('/:orgId/schema/:schemaId', auth.isOrgUser, orgApi.load, schemaApi.load, schemaApi.get);
router.put('/:orgId/schema/:schemaId', auth.isOrgAdmin, orgApi.load, schemaApi.load, schemaApi.update);
router.delete('/:orgId/schema/:schemaId', auth.isOrgAdmin, orgApi.load, schemaApi.load, schemaApi.destroy);

router.get('/:orgId/schema/:schemaId/field', auth.isOrgUser, schemaFieldApi.getAll);
router.post('/:orgId/schema/:schemaId/field', auth.isOrgAdmin, orgApi.load, schemaApi.load, schemaFieldApi.create);
router.get('/:orgId/schema/:schemaId/field/:fieldId', auth.isOrgUser, schemaApi.load, schemaFieldApi.load, schemaFieldApi.get);
router.put('/:orgId/schema/:schemaId/field/:fieldId', auth.isOrgAdmin, schemaApi.load, schemaFieldApi.load, schemaFieldApi.update);
router.delete('/:orgId/schema/:schemaId/field/:fieldId', auth.isOrgAdmin, schemaApi.load, schemaFieldApi.load, schemaFieldApi.destroy);

router.get('/:orgId/schema/:schemaId', auth.isOrgUser, schemaMapApi.getAll);
router.post('/:orgId/schema/:schemaId', auth.isOrgAdmin, orgApi.load, schemaMapApi.create);
router.get('/:orgId/schema/:schemaId/map/:mappingId', auth.isOrgUser, schemaApi.load, schemaMapApi.load, schemaMapApi.get);
router.put('/:orgId/schema/:schemaId/map/:mappingId', auth.isOrgAdmin, schemaApi.load, schemaMapApi.load, schemaMapApi.update);
router.delete('/:orgId/schema/:schemaId/map/:mappingId', auth.isOrgAdmin, schemaApi.load, schemaMapApi.load, schemaMapApi.destroy);

module.exports = router;