import Base from './Base';

class User extends Base {
    
    constructor() {
        super();
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    async register(provider, idToken){

        const data = await this._send('post', 'auth', {idToken: idToken, provider: provider});

        /*
        try {

            let opts = {
                method: verb,
                url: `${Base.rootUrl}/${User.service}/auth`,
                timeout: 1000,
                data: data
            }
        
            if (store.state.token) {
                opts.headers = {
                    Authorization: `Bearer ${store.state.token}`,
                    'x-prime-auth-provider': store.state.authProvider
                };
            }

            console.log(opts);

            //let info = await axios.post(`${Base.rootUrl}/graphql/query`, { query: payload }, opts);

            let info = await axios(opts);
            
            return this._handleResponse(info);
        } 
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
*/

        // Assign data to this 
        //for (let key in data){
        //    this[key] = data[key];
        //}

        return data;

    }    
}

User.service = 'user';

export default User;