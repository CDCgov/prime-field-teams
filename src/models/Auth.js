import Base from './Base';

class Auth extends Base {
    
    constructor() {
        super();
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Register a user by passing a id token obtained by auth vendor and the provider used
     * @param {string} provider The vendor, 'okta' or 'login.gov'
     * @param {string} code Either the code (to swap for a id token server side), or a idToken (for Okta)
     * @param {string} state 
     */
    async register(provider, code, state){

        const data = await this._send('post', '', {code: code, state: state, provider: provider});

        if (data && data.user){
            // Assign user data to this 
            for (let key in data.user){
                this[key] = data.user[key];
            }
        }

        return data;

    }    
}

Auth.service = 'auth';

export default Auth;