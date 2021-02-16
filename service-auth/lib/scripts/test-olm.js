"use strict";

const OLMReader = require('../utils/OLMReader');
const path = require('path');
const {User, Appointment} = require('../models');
const Promise = require('bluebird');
const Logger = require('../utils/Logger');

setTimeout(async ()=>{

    const filename = path.resolve(__dirname, '../../data/mike.olm');

    Logger.debug(`Reading OLM file ${filename}`);
    let evts = await OLMReader.parse(filename);

    let user = await User.findOne({where: {uuid: '7297b126-ac7a-4a05-a60a-268acf316cbe'}})
    Logger.debug(user);

    Logger.debug(`Found ${evts.length}`);

    await Promise.map(evts, async (evt) => {

        try {
            let apt = await Appointment.findOne({where: {uuid: evt.uuid}});
    
            if (!apt){
                Logger.debug(`Saving ${evt.uuid}, ${evt.title}`);
                apt = await new Appointment(evt);
                apt.personId = user.id;
                await apt.save();
            }
        }
        catch(err){
            Logger.error(err);
            Logger.error(evt);
            process.exit(1)
        }

    }, {concurrency: 1});

}, 200);
