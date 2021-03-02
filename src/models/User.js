import BaseModel from './BaseModel';

class User extends BaseModel {    

    constructor(data) {
        super('user', data);
    }  

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Generate public/private keys, to help users create their api keys. These are not stored anywhere
     */
    async generatePEM(){
        const data = await this._send('get', 'auth/keys');
        return data;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    async getOrganizations(){
        const data = await this._send('get', 'org/search', {limit: 9999, skip:0});
        return data;
    }    

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Register a user by passing a id token obtained by auth vendor and the provider used
     * @param {string} provider The vendor, 'okta' or 'login.gov'
     * @param {string} code Either the code (to swap for a id token server side), or a idToken (for Okta)
     * @param {string} state 
     */
    async register(provider, code, state){

        const data = await this._send('post', 'auth', {code: code, state: state, provider: provider});

        if (data && data.user){
            // Assign user data to this 
            for (let key in data.user){
                this[key] = data.user[key];
            }
        }

        return data;

    }     

    // ///////////////////////////////////////////////////////////////////////////////////////

    async verifySession(){

        const data = await this._send('get', 'auth');

        if (data && data.user){
            // Assign user data to this 
            for (let key in data.user){
                this[key] = data.user[key];
            }
        }

        return data;

    }  

    // ///////////////////////////////////////////////////////////////////////////////////////
    
    async logout(){
        return await this._send('delete', 'auth');
    }
}


export default User;