'use strict';
const Logger = require('../../utils/Logger');
const _ = require('lodash');
const {Meeting, MeetingSlot} = require('../../models');
const ParamError = require('../../errors/ParamError');

/**
 * These routes allow a super/admin user administer other users
 */
var MeetingSlotsAPI = {

	// ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Middleware to load an employer
     */
    async load(req, res, next) {

        if (!req.params.slotId){
            throw new ParamError(`You must pass a meeting slot id`)
        }

        req.slot = await MeetingSlot.findOne({where: {id: req.params.slotId}});

		if (!req.slot) {
			throw new Error(`Could not find meeting slot ${req.params.slotId}`);
		}

		return next();

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    async getAll(req, res) {
        const slots = await MeetingSlot.findAll({
            where: {
                meetingId: req.meeting.id
            }
        })
        res.json(slots);
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

    async get(req, res) {
        res.json(req.slot)
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

    async delete(req, res) {        
        req.slot.status = 'deleted';
        await req.slot.save();
        res.json({ result: 'ok', id: req.slot.id });
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

    async update(req, res) {

        // Don't let a caller update these fields
        var forboden = ['id', 'personId', 'submitted', 'created', 'modified'];

        let oldStatus = req.slot.status;

        for (var key in req.body.meeting) {
            if (_.indexOf(forboden, key) == -1) {
                req.slot[key] = req.body.meeting[key];
            }
        }

        if (oldStatus != req.slot.status && req.slot.status == 'pending'){
            req.slot.retries = 0;
        }

        let updated = await req.slot.save();

        res.json(updated);
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

	async create(req, res) {
        let slot = await MeetingSlot.create({
            personId: req.user.id,
            meetingId: req.meeting.id,
            date: new Date(req.body.slot.start),
            start: new Date(req.body.slot.start),
            end: new Date(req.body.slot.end),
        })
        res.json(slot);
    }
    
};

module.exports = MeetingSlotsAPI;
