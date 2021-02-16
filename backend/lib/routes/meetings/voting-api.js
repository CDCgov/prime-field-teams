'use strict';
const Logger = require('../../utils/Logger');
const _ = require('lodash');
const {Vote, MeetingSlot} = require('../../models');
const ParamError = require('../../errors/ParamError');

/**
 * These routes allow a super/admin user administer other users
 */
var VotingApi = {

	// ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Middleware to load an employer
     */
    async load(req, res, next) {

        if (!req.params.voteId){
            throw new ParamError(`You must pass a vote id`)
        }

        req.vote = await Vote.findOne({where: {id: req.params.voteId}});

		if (!req.vote) {
			throw new Error(`Could not find meeting slot ${req.params.voteId}`);
		}

		return next();

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    async getAll(req, res) {
        
        const votes = await Vote.findAll({
            where: {
                meetingId: req.meeting.id
            }
        });

        let counts = {};

        for (let i=0; i<votes.length; i+=1){
            let vote = votes[i];
            if (!counts[vote.slotId]) {
                counts[vote.slotId] = {
                    slotId: vote.slotId,
                    meetingId: vote.meetingId,
                    count: 1
                };
            }
            else {
                counts[vote.slotId].count +=1;
            }
        }

        // Flatten and return
        let finalCounts = [];
        for(let vid in counts){
            finalCounts.push(counts[vid]);
        }

        res.json(finalCounts);
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

    async get(req, res) {
        res.json(req.vote)
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

    async delete(req, res) {        

        await Vote.destroy({
            where:{
                personId: req.user.id,
                meetingId: req.meeting.id,
                slotId: req.slot.id,
            }
        });

        res.json({ result: 'ok', id: req.vote.id });
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

	async create(req, res) {
        
        const opts = {
            personId: req.user.id,
            meetingId: req.meeting.id,
            slotId: req.slot.id,
        };

        let vote = await Vote.findOne({where:opts});

        if (!vote){
            vote = await Vote.create(opts);
        }

        res.json(vote);
    }
    
};

module.exports = VotingApi;
