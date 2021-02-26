import AuthOkta from "./auth-providers/AuthOkta.js";
import AuthLoginGov from "./auth-providers/AuthLoginGov.js";
import Utils from '../utils/Utils';

const AuthFactory = {
    
    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create an instance of a authentication provider. If the provider is not specified
     * it will attempt to load from local storage.
     * @param {string} provider The authentication vendor, 'okta' or 'login.gov'
     */
    async create(provider){
        
        let auth = null;

        if (!provider){
            provider = Utils.getPreference('auth-provider');
        }
        else {
            Utils.setPreference('auth-provider', provider);
        }

        
        switch(provider){
            case 'okta': auth = new AuthOkta(); break;
            case 'login.gov': auth = new AuthLoginGov(); break;
        }
        
        if (auth){
            await auth.checkSession();
        }

        return auth;
    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Single step to handle a redirect, this will look for a code and state in the query params
     * and then create the appropriate auth provider. Then it will call the handle redirect logic
     * for that provider.
     * @param {object} queryParams Query param object, expects a state and code field
     */
    async handleRedirect(queryParams){

        console.log('Entering AuthFactory.handleRedirect', queryParams);

        if (!queryParams.state){
            return null;
        }

        let provider = null;
        let providerFlag = queryParams.state.substring(0,2);

        if (providerFlag == 'ok'){
            provider = 'okta';
        }
        else if (providerFlag == 'lg'){
            provider = 'login.gov';
        }
        else {
            throw new Error('Did not recognize provider in value of query param state');
        }

        let auth = await AuthFactory.create(provider);

        if (auth){
            return auth.handleRedirect(queryParams);
        }
    }

}  

export default AuthFactory;
