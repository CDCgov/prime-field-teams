import Utils from "../../utils/Utils";

class AuthLoginGov {

    constructor(){

    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    async checkSession(){
        
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Handle the redirect, for login that means we hit the backend to convert code/state to a session token
     */
    async handleRedirect(queryParams){

        console.log('>>>> AuthLoginGov.handleRedirect()', queryParams);

        // Check for errors
        if (queryParams.error_description){
            throw new Error(queryParams.error_description);            
        }
        else if (queryParams.error){
            throw new Error(queryParams.error);            
        }
                
        Utils.setPreference('auth-token', queryParams.code);

        // Fire the update auth state callback
        return {
            idToken: queryParams.code,
            state: queryParams.state,
            provider: 'login.gov',
            user: {}
        };
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Redirect user to the login.gov login page, which then redirects back
     * to the authentication page.
     * @see https://developers.login.gov/oidc/
     */
    login() {

        // Reset the provider, and we'll set it using the state when we redirect back in.
        // that way, the checksession logic won't think we have a valid session
        Utils.setPreference('auth-token', null);
        Utils.setPreference('auth-provider', null);

        // A unique value at least 32 characters in length used for maintaining state between the request and the callback.
        // This value will be returned to the client on a successful authorization.
        var state = `lg-${Utils.randomString(32)}`;

        // A unique value at least 32 characters in length used to verify the integrity of the id_token and mitigate
        // replay attacks. This value should include per-session state and be unguessable by attackers. This value
        // will be present in the id_token of the token endpoint response, where clients will verify that the nonce
        // claim value is equal to the value of the nonce parameter sent in the authentication request. Read more
        // about nonce implementation in the spec.
        var nonce = Utils.randomString(36);

        let opts = {
            acr_values: 'http://idmanagement.gov/ns/assurance/loa/1',
            client_id: process.env.VUE_APP_LOGIN_GOV_CLIENT_ID,
            nonce: nonce,
            response_type: 'code',
            redirect_uri: process.env.VUE_APP_REDIRECT_URI,
            scope: 'openid email profile:name',
            state: state
        };

        let qs = new URLSearchParams(opts).toString();

        let url = `https://idp.int.identitysandbox.gov/openid_connect/authorize?${qs}`;

        window.location = url;
    } 

    // ///////////////////////////////////////////////////////////////////////////////////////

    logout(){
        Utils.setPreference('auth-token', null);
        Utils.setPreference('auth-provider', null);        
    }    
}

export default AuthLoginGov;