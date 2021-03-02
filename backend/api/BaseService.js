'use strict';
const Logger = require('../utils/Logger.js');
const axios = require('axios');

class BaseService {

    constructor(service){
        // Store service name, this is the base url for the service e.g. /auth
        this.service = service;
        // Grab the base url from the .env
        this.baseUrl = process.env[`${service.toUpperCase()}_SERVICE_URL`];
    }

    // ///////////////////////////////////////////////////////////////////////////////////////
    
    setSesssionToken(token){
        BaseService.token = token;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    async send(verb, path='', params=null){

        try {

            let headers = {}

            if (BaseService.token){
                headers.Authorization = `Bearer ${BaseService.token}`;
            }

            //Logger.debug(`[${verb}] ${this.baseUrl}${path}`);

            let result = await axios({
                method: verb,
                url: `${this.baseUrl}${path}`,
                data: params,
                timeout: 1000,
                headers: headers
            });    
            
            return result.data;
            
        }
        catch(err){

            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                //Logger.error(err.response.data);
                Logger.error(`[/${path}] ${err.response.data.message}`);
                //Logger.error(err.response.status);
                //Logger.error(err.response.headers);
            } 
            else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                Logger.error(`Is the ${this.service} service running? No response from ${this.baseUrl}`);
            } 
            else {
                // Something happened in setting up the request that triggered an Error
                Logger.error('Error', err.message);
            }

            return null;
        }


    }
    

}

module.exports = BaseService;
