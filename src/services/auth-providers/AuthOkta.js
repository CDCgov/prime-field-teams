import { OktaAuth } from '@okta/okta-auth-js';
import Utils from "../../utils/Utils";

/**
 * Singleton class for working with Okta 
 * @see https://github.com/okta/okta-auth-js
 */
class AuthOkta {

    // ///////////////////////////////////////////////////////////////////////////////////////

    __getClient(){

        if (this.client){
            return this.client;
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
            clientId: process.env.VUE_APP_OKTA_CLIENT_ID,   
            redirectUri: process.env.VUE_APP_REDIRECT_URI,         
            tokenManager: {storage: storageProvider}                    
            // Use authorization_code flow
            //responseType: 'code',
            //pkce: false                   
        };

        this.client = new OktaAuth(config);

        return this.client;

    }

    // ///////////////////////////////////////////////////////////////////////////////////////
    
    async checkSession(){

        const client = this.__getClient();

        console.log('Checking OKTA session');

        // If we already have a client instance, we can just ask it
        if (await client.isAuthenticated()){
            const authState = await client.authStateManager.getAuthState();
            const user = await client.token.getUserInfo();
            if (authState){
                return {
                    isAuthenticated: authState.isAuthenticated,
                    accessToken: authState.accessToken.value,
                    idToken: authState.idToken.value,
                    userInfo: user,
                    provider: 'okta'
                }                
            }
        }

        return null;
/*

        return new Promise((resolve, reject) => {

            const client = this.__getClient();        

            const onChange = async (authState) => {

                try {
                    console.log('>>>> OKTA ON CHANGE <<<<<', authState);

                    if (authState && authState.isAuthenticated) {
                    
                        const user = await client.token.getUserInfo();
                        //const isExpired = await await client.token.isAccessTokenExpired();
                        //console.log(isExpired)
                                            
                        resolve({
                            isAuthenticated: authState.isAuthenticated,
                            accessToken: authState.accessToken.value,
                            idToken: authState.idToken.value,
                            userInfo: user,
                            provider: 'okta'
                        });
                    }
                    else {
                        reject();    
                    }
    
                }
                catch(err){
                    reject(err);
                }
                finally {
                    // We don't need to keep subscribing, so wrap up
                    client.authStateManager.unsubscribe(onChange);
                }

            }

            // Start listening for auth state updates        
            client.authStateManager.subscribe(onChange);     
    
            // The URL contains a code, `parseFromUrl` will exchange the code for tokens
            client.token.parseFromUrl()
                .then((res)=>{

                    console.info('Parsed tokens ', res)

                    // Store tokens. This will update the auth state and we will re-render
                    client.tokenManager.setTokens(res.tokens);
            
                    // Trigger a auth state update which in turns triggers the onStateChanged callback
                    //client.authStateManager.updateAuthState();

                })
                .catch((err)=>{
                    reject(err);
                });
                

        });
        
        */
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    async handleRedirect(queryParams){

        // Check for errors
        if (queryParams.error_description){
            throw new Error(queryParams.error_description);            
        }
        else if (queryParams.error){
            throw new Error(queryParams.error);            
        }


        return new Promise((resolve, reject) => {

            const client = this.__getClient();        

            const onChange = async (authState) => {

                try {
                    console.log('>>>> OKTA ON CHANGE <<<<<', authState);

                    if (authState && authState.isAuthenticated) {
                    
                        const user = await client.token.getUserInfo();
                        //const isExpired = await await client.token.isAccessTokenExpired();
                        //console.log(isExpired)
                                           
                        Utils.setPreference('auth-token', authState.idToken.value);
                        
                        resolve({
                            isAuthenticated: authState.isAuthenticated,
                            accessToken: authState.accessToken.value,
                            idToken: authState.idToken.value,
                            userInfo: user,
                            provider: 'okta'
                        });
                    }
                    else {
                        reject();    
                    }
    
                }
                catch(err){
                    reject(err);
                }
                finally {
                    // We don't need to keep subscribing, so wrap up
                    client.authStateManager.unsubscribe(onChange);
                }

            }

            // Start listening for auth state updates        
            client.authStateManager.subscribe(onChange);     
    
            // The URL contains a code, `parseFromUrl` will exchange the code for tokens
            client.token.parseFromUrl()
                .then((res)=>{

                    console.info('Parsed tokens ', res)

                    // Store tokens. This will update the auth state and we will re-render
                    client.tokenManager.setTokens(res.tokens);
            
                    // Trigger a auth state update which in turns triggers the onStateChanged callback
                    //client.authStateManager.updateAuthState();

                })
                .catch((err)=>{
                    reject(err);
                });
                

        });
        
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Initiate authentication using Okta
     * @see https://github.com/okta/okta-auth-js
     * @see https://developer.okta.com/docs/guides/implement-auth-code-pkce
     */
    login(){
        const client = this.__getClient();
        // Reset the provider, and we'll set it using the state when we redirect back in.
        // that way, the checksession logic won't think we have a valid session
        Utils.setPreference('auth-token', null);
        Utils.setPreference('auth-provider', null);
        client.signInWithRedirect({state: `ok-${Utils.randomString(18)}`});
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    logout(){
        Utils.setPreference('auth-token', null);
        Utils.setPreference('auth-provider', null);
        const client = this.__getClient();
        client.signOut();
    }

}


export default AuthOkta;