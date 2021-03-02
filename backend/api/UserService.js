'use strict';
const Settings = require('../Settings');
const Logger = require('../utils/Logger.js');
const BaseService = require('./BaseService');

class UserService extends BaseService {

    constructor(){
        super('user');
    }

    /**
     * Register with the auth service using varioius providers/strategies
     * @param {*} token 
     */
    async register(token){
        return await this.send('post', 'auth', {code: token, provider: ''});
    }

    async getSesh(){
        return await this.send('get', 'auth');
    }


}


if (require.main === module) {

    const auth = new UserService();
    const token = '8a9a67a3933d54969bf3e52f9cb48272d618841deaa1e8eb20cd33e67cf4266515043f27d5c96aa2673888203dfdfaee4912cc669cdc1f05b8bc54afb9ae0669';

    UserService.setSesssionToken(token);

    setTimeout(async function(){

        await auth.getSesh();

    }, 500)
}
else {
    module.exports = new UserService();
}
