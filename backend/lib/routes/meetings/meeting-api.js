'use strict';
const Logger = require('../../utils/Logger');
const _ = require('lodash');
const {Meeting, Vote, MeetingSlot} = require('../../models');
const ParamError = require('../../errors/ParamError');
const Chance = require('chance');

/**
 * These routes allow a super/admin user administer other users
 */
var MeetingAPI = {

	// ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Middleware to load an employer
     */
    async load(req, res, next) {

        if (!req.params.meetingId){
            throw new ParamError(`You must pass a meeting id`)
        }

        req.meeting = await Meeting.findOne({where: {id: req.params.meetingId}});

		if (!req.meeting) {
			throw new Error(`Could not find meeting ${req.params.meetingId}`);
		}

		return next();

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    async getAll(req, res) {
        const meetings = await Meeting.findAll({
            where: {
                personId: req.user.id
            }
        })
        res.json(meetings);
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

    async get(req, res) {
        res.json(req.meeting)
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

    async delete(req, res) {        
        await Vote.destroy({where: {meetingId: req.meeting.id}})
        await MeetingSlot.destroy({where: {meetingId: req.meeting.id}})
        await req.meeting.destroy();
        res.json({ result: 'ok', id: req.meeting.id });
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

    async update(req, res) {

        // Don't let a caller update these fields
        var forboden = ['id', 'personId', 'created', 'modified'];

        let oldStatus = req.meeting.status;

        for (var key in req.body.meeting) {
            if (_.indexOf(forboden, key) == -1) {
                req.meeting[key] = req.body.meeting[key];
            }
        }

        if (oldStatus != req.meeting.status && req.meeting.status == 'pending'){
            req.meeting.retries = 0;
        }

        let updated = await req.meeting.save();

        res.json(updated);
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

	async create(req, res) {
        const chance = new Chance();
        let meeting = await Meeting.create({
            personId: req.user.id,
            title: `${chance.province({full: true})} ${chance.animal()}`
        })
        res.json(meeting);
    }
    
};

module.exports = MeetingAPI;
