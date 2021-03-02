import BaseModel from './BaseModel';

class Organization extends BaseModel {    

    constructor(data) {
        super('org', data);
    }  

    // ///////////////////////////////////////////////////////////////////////////////////////

    async getOrganizations(){
        const data = await this._send('get', 'search', {limit: 9999, skip:0});
        return data;
    }    

    // ///////////////////////////////////////////////////////////////////////////////////////

    async createKey(keyObj){
        const data = await this._send('post', `${this.id}/key`, {key: keyObj});
        return data;
    }        

}


export default Organization;