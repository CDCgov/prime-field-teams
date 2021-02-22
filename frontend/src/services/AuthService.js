import AuthOkta from "./auth-providers/AuthOkta.js";
import AuthLoginGov from "./auth-providers/AuthLoginGov.js";
import Utils from "../utils/Utils";
import _ from "lodash";

const AuthManager = {
    
    accessToken: null,
    idToken: null,
    userInfo: null,
    provider: null,
    isAuthenticated: null,
    $store: null,

    // ///////////////////////////////////////////////////////////////////////////////////////

    login(provider = 'okta'){
        AuthManager.provider = provider;
        if (provider == 'okta'){
            return AuthOkta.login();
        }
        else if (provider == 'login.gov'){
            return AuthLoginGov.login();
        }
    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Respond to auth state changes from providers
     * @param {object} authState Auth state provided by provider implementations, expects; userInfo, idToken, accessToken
     */
    async onStateChanged(authState){

        console.log('AUTH STATE CHANGED: ', authState);

        if (authState){
            AuthManager.userInfo = (authState.userInfo) ? authState.userInfo : null;
            AuthManager.accessToken = (authState.accessToken) ? authState.accessToken : null;
            AuthManager.idToken = (authState.idToken) ? authState.idToken : null;    
            AuthManager.isAuthenticated = (authState.isAuthenticated) ? authState.isAuthenticated : null;    
            AuthManager.provider = (authState.provider) ? authState.provider : null;
        }

        //this.$store.commit('setUser', user);
        //AuthManager.$store.commit('setAuthenticated', authState.isAuthenticated);
        AuthManager.$store.dispatch('onAuthenticated', {
            idToken: AuthManager.idToken,
            accessToken: AuthManager.accessToken,
            userInfo: AuthManager.userInfo,
            isAuthenticated: AuthManager.isAuthenticated,
            provider: AuthManager.provider
        });

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * After a redirect, this method parses the query params and performs 
     * any post redirect processing
     * @param {object} queryParams 
     */
    async onRedirect(queryParams){

        if (!queryParams || !_.isObject(queryParams) || !queryParams.state){
            return false;
        }
        
        //console.log('onRedirect', queryParams);

        // Check strategy is being used by looking at the state
        if (queryParams.state.search('okta-') !== -1){
            AuthManager.provider = 'okta';
            // Okta
            Utils.setPreference('auth-provider', 'okta');
            await AuthOkta.handleRedirect();
            return 'okta';
        }
        else if (queryParams.state.search('logingov-') !== -1){
            AuthManager.provider = 'login.gov';
            // Login.gov
            Utils.setPreference('auth-provider', 'login.gov');
            return 'login.gov';
        }
                    
    }
    
}  

/**
 * Create the install function, this is called when you use `Vue.use(AuthMixin)`
 * and is where we want to do any static (one-off) setup stuff before the mixin
 * is addded to EVERY component.
 * 
 * NOTE: this mixin requires a Vuex store for managing it's state.
 * 
 * @param {object} Vue The main vue instance
 * @param {object} options Pass in a reference to the vuex store and a list of providers you want to use
 */
function install(Vue, options = {}) {

    if (!options.providers){
        options.providers = ['okta'];
    }

    AuthManager.$store = options.store;

    // Setup requested auth providers
    for (let i=0; i<options.providers.length; i+=1){
        setupProvider(options.providers[i]);
    }

    function checkSession(){
        let provider = Utils.getPreference('auth-provider');
        setupProvider(provider);
    }

    function setupProvider(provider){
        console.log('Provider ',  provider);
        switch(provider){
            case 'okta': AuthOkta.setup(AuthManager.onStateChanged); break;
            case 'login.gov': AuthOkta.setup(AuthManager.onStateChanged); break;
        }        
    }

 
    Vue.auth = Vue.prototype.$auth = AuthManager;

    // Tell the store to check session
    //this.$store.commit('setUser', null);
    //this.$store.commit('setUser', null);

    checkSession();

}

export default install;
