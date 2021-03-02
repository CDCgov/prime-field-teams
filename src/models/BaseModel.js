import axios from 'axios';

class BaseModel {

    constructor(service, data) {

        // Pull the instance member service value from the static member
        this.service = service;

        // If we have data passed in, we can setup fields now
        if (data){
            for (let key in data){
                this[key] = data[key];
            }            
        }

        //if (!process.env[`VUE_APP_${service.toUpperCase()}_SERVICE_URL`]){
        //    throw new Error(`The base url for service ${service} has not been give, you need to set in your .env file as "VUE_APP_${service.toUpperCase()}_SERVICE_URL"`)
        //}        

        //this.baseUrl = process.env[`VUE_APP_${service.toUpperCase()}_SERVICE_URL`];
        this.baseUrl = process.env.VUE_APP_API_URL;

    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    async _send(verb, cmd, data) {

        try {

            let fullUrl = `${this.baseUrl}/${this.service}/${cmd}`;

            console.log(`SENDING = [${verb.toUpperCase()}] ${fullUrl}`, this);
            
            // If there is a lead slash, remove it.
            if (fullUrl.slice(-1) == '/'){
                fullUrl = fullUrl.substring(0, fullUrl.length - 1);
            }

            console.log(`SENDING = [${verb.toUpperCase()}] ${fullUrl}`, this);

            let opts = {
                method: verb,
                url: fullUrl,
                timeout: 1000,
                data: data
            }
        
            if (BaseModel.sessionToken) {
                opts.headers = {
                    Authorization: `Bearer ${BaseModel.sessionToken}`
                };
            }

            let info = await axios(opts);
            
            return this._handleResponse(info);
        } 
        catch (err) {
            // If this is a controller error, we should have a message
            if (err.request.response){
                const errObj = JSON.parse(err.request.response);
                throw new Error(errObj.message);
            }
            else {
                throw new Error(err);
            }
        }
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    _handleResponse(resp) {

        console.log('BaseModel._handleResponse() RESPONSE = ', resp);

        if (resp && resp.data) {
            return resp.data;
        }

        return null;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    async create(){

        const data = await this._send('post', '');
        
        // Assign data to this 
        for (let key in data){
            this[key] = data[key];
        }

    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    async load(id){

        const data = await this._send('get', id);

        // Assign data to this 
        for (let key in data){
            this[key] = data[key];
        }

    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    async save(){
        
        let payload = {};
        payload[this.service] = this;        
        let data = null;

        if (this.id){
            data = await this._send('put', this.id, payload);
        }
        else {
            data = await this._send('post', '', payload);
        }

        // Assign data to this 
        for (let key in data){
            this[key] = data[key];
        }

    }    

    // ///////////////////////////////////////////////////////////////////////////////////////

    async delete(){
        if (this.id){
            await this._send('delete', this.id);
            this.status = 'deleted';
        }
    } 

    // ///////////////////////////////////////////////////////////////////////////////////////

    static async getAll() {
        
        let items = [];
        const data = await this._send('get', '');

        for (let i=0; i<data.length; i+=1){
            
            let tmp = new this();
        
            // Assign data to this 
            for (let key in data[i]){
                tmp[key] = data[i][key];
            }

            items.push(tmp)
        }

        return items;
    }    

}

export default BaseModel;