import { OktaAuth } from '@okta/okta-auth-js';
import Utils from "../../utils/Utils";

/**
 * Singleton class for working with Okta 
 * @see https://github.com/okta/okta-auth-js
 */
const AuthOkta = {

    clientId: process.env.VUE_APP_OKTA_CLIENT_ID,
    redirectUri: process.env.VUE_APP_REDIRECT_URI,
    client: null,

    // ///////////////////////////////////////////////////////////////////////////////////////

    async setup(onStateChanged){

        if (this.client){
            console.warn('Okta client already setup')
            return;
        }

        const storageProvider = {
            getItem(key) {
                return Utils.getPreference(key);
            },
            setItem(key, val) {
                Utils.setPreference(key, val);
            },
            removeItem(key) {
                Utils.setPreference(key, null);
            }
        }


        const config = {
            issuer: 'https://dev-46102578.okta.com/oauth2/default',
            // Required for login flow using getWithRedirect()
            clientId: this.clientId,   
            redirectUri: this.redirectUri,         
            tokenManager: {storage: storageProvider}                    
            // Use authorization_code flow
            //responseType: 'code',
            //pkce: false                   
        };

        this.client = new OktaAuth(config);
        
        const processAuthState = async (authState) => {

            console.log('OKTA AUTH STATE UPDATE:', authState.isAuthenticated, authState);

            if (authState && authState.isAuthenticated) {
                
                const user = await this.client.token.getUserInfo();
                //const isExpired = await await this.client.token.isAccessTokenExpired();
                //console.log(isExpired)

                onStateChanged({
                    isAuthenticated: authState.isAuthenticated,
                    accessToken: authState.accessToken.value,
                    idToken: authState.idToken.value,
                    userInfo: user,
                    provider: 'okta'
                });
            }
        }

        console.info('Okta subscribed.....')

        // Start listening for auth state updates        
        this.client.authStateManager.subscribe((authState) => {
            // handle the latest evaluated authState, like integrate with client framework's state management store
                // trigger an initial change event to make sure authState is latest
                //this.client.authStateManager.updateAuthState();
                processAuthState(authState);
        });

        // Grab auth state now
        //let authState = this.client.authStateManager.getAuthState();
        if (await this.client.isAuthenticated()){
            console.log('>>>>> AUTH', await this.client.isAuthenticated())
        }
        //processAuthState(authState);

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    async handleRedirect(){

        if (!this.client){
            this.setup();
        }    


        /*    
        const config = {
            restoreOriginalUri: async (oktaAuth, originalUri) => {
                router.replace({
                    path: toRelativeUrl(originalUri, baseUrl)
                });
            }
        };
        */       

        // The URL contains a code, `parseFromUrl` will exchange the code for tokens
        const res = await this.client.token.parseFromUrl();
        console.log('TOKENS: ', res.tokens)

        // Store tokens. This will update the auth state and we will re-render
        this.client.tokenManager.setTokens(res.tokens);

        await this.client.authStateManager.updateAuthState();
        
    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    destroy(){
        //_oktaAuth.authStateManager.unsubscribe(this.$_oktaVue_handleAuthStateUpdate)
    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Initiate authentication using Okta
     * @see https://github.com/okta/okta-auth-js
     * @see https://developer.okta.com/docs/guides/implement-auth-code-pkce
     */
    login(){
        if (!this.client){
            this.setup();
        }
        this.client.signInWithRedirect({state: `okta-${Utils.randomString(16)}`});
    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    logout(){
        
    }

}


export default AuthOkta;