import axios from 'axios';
import store from '../store.js';

class Base {

    constructor() {
        // Pull the instance member service value from the static member
        this.service = this.constructor.service;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    async _send(verb, cmd, data) {

        //console.log(`SENDING = [${verb.toUpperCase()}] ${Base.rootUrl}/${cmd}`);

        try {

            let opts = {
                method: verb,
                url: `${Base.rootUrl}/${this.service}/${cmd}`,
                timeout: 1000,
                data: data
            }
        
            if (store.state.token) {
                console.log('Token = ', store.state.token);
                opts.headers = {
                    Authorization: `Bearer ${store.state.token}`,
                    'x-prime-auth-provider': store.state.authProvider
                };
            }

            //let info = await axios.post(`${Base.rootUrl}/graphql/query`, { query: payload }, opts);

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

        console.log('RESPONE = ', resp);

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
        
        let data = null;

        if (this.id){
            data = await this._send('put', this.id, this);
        }
        else {
            data = await this._send('post', '', this);
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

Base.rootUrl = process.env.VUE_APP_API_ROOT_URL ? process.env.VUE_APP_API_ROOT_URL : 'http://localhost:7001';

export default Base;