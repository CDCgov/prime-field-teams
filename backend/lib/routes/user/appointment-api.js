'use strict';
const Logger = require('../../utils/Logger');
const _ = require('lodash');
const {Appointment} = require('../../models');
const ParamError = require('../../errors/ParamError');
const OLMReader = require('../../utils/OLMReader');
const { StringDecoder } = require('string_decoder');
/**
 * These routes allow a super/admin user administer other users
 */
var AppointmentAPI = {

    // ///////////////////////////////////////////////////////////////////////////////////////

    async upload(req, res, next) {

        Logger.debug('Entering upload');
        
        if (!req.body.olmData){
            throw new ParamError(`You must pass olmData in the body`)
        }

        const decoder = new StringDecoder('utf8');
        const data = decoder.write(req.body.olmData);

        // Strip out any line ends which we seem to get from the iOS app
        //data = data.replace(/^data:\w+\/\w+;base64,/, "");
        //data = data.replace(/\r?\n|\r/g,"");
        //imgData = unescape(imgData);
    
        Logger.debug('Parsing....');
        let evts = await OLMReader.parseFromString(data);
        Logger.debug(`Found ${evts.length} events`);

        res.json({result: 'ok', events: evts.length});
    },

	// ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Middleware to load an employer
     */
    async load(req, res, next) {

        if (!req.params.appointmentId){
            throw new ParamError(`You must pass a appointment id`)
        }

        req.appointment = await Appointment.findOne({where: {id: req.params.appointmentId}});

		if (!req.appointment) {
			throw new Error(`Could not find meeting slot ${req.params.appointmentId}`);
		}

		return next();

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    async getAll(req, res) {
        
        const appointments = await Appointment.findAll({
            where: {
                personId: req.user.id
            },
            raw: true
        });

        res.json(appointments);
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

    async get(req, res) {
        res.json(req.appointment)
    },

	// ///////////////////////////////////////////////////////////////////////////////////////

	async create(req, res) {
        
        let opts = req.body.appointment;
        opts.personId = req.user.id;

        let appointment = await Appointment.findOne({
            where: {
                uuid: opts.uuid
            }
        });

        if (!appointment){
            appointment = await Appointment.create(opts);
        }

        res.json(appointment);
    }
    
};

module.exports = AppointmentAPI;
