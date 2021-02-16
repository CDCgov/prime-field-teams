'use strict';

const express = require('express');
const router = express.Router();
const meetingApi = require('./meeting-api.js');
const slotApi = require('./slots-api.js');
const votingApi = require('./voting-api.js');
const auth = require('../middleware/auth');
require('express-async-errors');

router.get('/all', auth.isUser, meetingApi.getAll);
router.post('/', auth.isUser, meetingApi.create);
router.get('/:meetingId', auth.isUser, meetingApi.load, meetingApi.get);
router.put('/:meetingId', auth.isUser, meetingApi.load, meetingApi.update);
router.delete('/:meetingId', auth.isUser, meetingApi.load, meetingApi.delete);

router.post('/:meetingId/slot', auth.isUser, meetingApi.load, slotApi.create);
router.get('/:meetingId/slots', auth.isUser, meetingApi.load, slotApi.getAll);
router.put('/:meetingId/slot/:slotId', auth.isUser, meetingApi.load, slotApi.load, slotApi.update);
router.delete('/:meetingId/slot/:slotId', auth.isUser, meetingApi.load, slotApi.load, slotApi.delete);

router.get('/:meetingId/votes', auth.isUser, meetingApi.load, votingApi.getAll);
router.post('/:meetingId/slot/:slotId/vote', auth.isUser, meetingApi.load, slotApi.load, votingApi.create);
router.delete('/:meetingId/slot/:slotId/vote', auth.isUser, meetingApi.load, slotApi.load, votingApi.delete);


/*

GET /meetings/all
GET /meetings/:meetingId
POST /meetings/:meetingId
DELETE /meetings/:meetingId
PUT /meetings/:meetingId

GET /meetings/:meetingId/slots
POST /meetings/:meetingId/slot
DELETE /meetings/:meetingId/slot/:slotId
PUT /meetings/:meetingId/slot/:slotId

GET /meetings/:meetingId/votes
POST /meetings/:meetingId/slot/:slotId/vote
DELETE /meetings/:meetingId/slot/:slotId/vote


*/


module.exports = router;






