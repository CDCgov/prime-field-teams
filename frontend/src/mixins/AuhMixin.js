import { OktaAuth } from '@okta/okta-auth-js';

const OKTA_CLIENT_ID = '0oa7q1wj6U9EvwFq45d6';
const LOGIN_CLIENT_ID = 'urn:gov:gsa:openidconnect.profiles:sp:sso:usds:calendar';
const REDIRECT_URI = 'http://localhost:8080/login';

export default {
    data() {
        return {
            isAuthenticated: false,
            user: null,
            oktaClient: null
        };
    },
    mounted() {

        this.__setupOkta();
        
        // Check for stored token, and if found check to see if it's still valid
        let token = this.getPreference('token');
        if (token){

        }
    },    
    beforeDestroy () {
        //_oktaAuth.authStateManager.unsubscribe(this.$_oktaVue_handleAuthStateUpdate)
    },    
    methods: {

        // ///////////////////////////////////////////////////////////////////////////////////////
        
        login(provider = 'okta'){
            if (provider == 'okta'){
                return this.__loginOkta();
            }
            else {
                return this.__loginGov();
            }
        },

        // ///////////////////////////////////////////////////////////////////////////////////////

        __setupOkta(){

            let config = {
                issuer: 'https://dev-46102578.okta.com/oauth2/default',
                // Required for login flow using getWithRedirect()
                clientId: OKTA_CLIENT_ID,
                redirectUri: REDIRECT_URI,                     
                // Use authorization_code flow
                //responseType: 'code',
                //pkce: false                           
            };

            this.oktaClient = new OktaAuth(config);

            this.oktaClient.authStateManager.getAuthState();

            this.oktaClient.authStateManager.subscribe((authState) => {
                // handle the latest evaluated authState, like integrate with client framework's state management store
                if (authState){
                    let user = authState.getUser();
                    this.$log(user);
                }
            });

        },

        // ///////////////////////////////////////////////////////////////////////////////////////

        /**
         * Initiate authentication using Okta
         * @see https://github.com/okta/okta-auth-js
         * @see https://developer.okta.com/docs/guides/implement-auth-code-pkce
         */
        __loginOkta(){

            this.oktaClient.signInWithRedirect({state: `ok-${generateId(36)}`});



            // authState.isAuthenticated

        },

        // ///////////////////////////////////////////////////////////////////////////////////////

        /**
         * Redirect user to the login.gov login page, which then redirects back
         * to the authentication page.
         * @see https://developers.login.gov/oidc/
         */
        __loginGov() {

            // A unique value at least 32 characters in length used for maintaining state between the request and the callback.
            // This value will be returned to the client on a successful authorization.
            var state = `lg-${generateId(36)}`;

            // A unique value at least 32 characters in length used to verify the integrity of the id_token and mitigate
            // replay attacks. This value should include per-session state and be unguessable by attackers. This value
            // will be present in the id_token of the token endpoint response, where clients will verify that the nonce
            // claim value is equal to the value of the nonce parameter sent in the authentication request. Read more
            // about nonce implementation in the spec.
            var nonce = generateId(36);

            let opts = {
                acr_values: 'http://idmanagement.gov/ns/assurance/loa/1',
                client_id: LOGIN_CLIENT_ID,
                nonce: nonce,
                response_type: 'code',
                redirect_uri: REDIRECT_URI,
                scope: 'openid email profile:name',
                state: state
            };

            let qs = new URLSearchParams(opts).toString();

            let url = `https://idp.int.identitysandbox.gov/openid_connect/authorize?${qs}`;

            window.location = url;
        },  
        
        // ///////////////////////////////////////////////////////////////////////////////////////

        uuid() {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
        },

        // ///////////////////////////////////////////////////////////////////////////////////////

        /**
         * Generate a random string for the nonce
         * Thanks to https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
         */        
        randomString(len) {
            var arr = new Uint8Array((len || 40) / 2)
            window.crypto.getRandomValues(arr)
            return Array.from(arr, dec2hex).join('')
        },

        // ///////////////////////////////////////////////////////////////////////////////////////
        
        dec2hex(dec) {
            return dec < 10 ? '0' + String(dec) : dec.toString(16)
        },
                
        // ///////////////////////////////////////////////////////////////////////////////////////

        getPreference(name) {
            let val = localStorage.getItem(`prime-pref-${name}`);
            if (val == 'null'){
                return null;
            }
            return val;
        },
    
        // ///////////////////////////////////////////////////////////////////////////////////////
    
        setPreference(name, value) {
            localStorage.setItem(`prime-pref-${name}`, value);
        }
    }
};
