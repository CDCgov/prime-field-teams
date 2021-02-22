import Utils from "../../utils/Utils";

const AuthLoginGov = {

    clientId: process.env.VUE_APP_LOGIN_GOV_CLIENT_ID,
    redirectUri: process.env.VUE_APP_REDIRECT_URI,

    // ///////////////////////////////////////////////////////////////////////////////////////

    setup(){

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    destroy(){
    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Redirect user to the login.gov login page, which then redirects back
     * to the authentication page.
     * @see https://developers.login.gov/oidc/
     */
    login() {

        // A unique value at least 32 characters in length used for maintaining state between the request and the callback.
        // This value will be returned to the client on a successful authorization.
        var state = `lg-${Utils.randomString(16)}`;

        // A unique value at least 32 characters in length used to verify the integrity of the id_token and mitigate
        // replay attacks. This value should include per-session state and be unguessable by attackers. This value
        // will be present in the id_token of the token endpoint response, where clients will verify that the nonce
        // claim value is equal to the value of the nonce parameter sent in the authentication request. Read more
        // about nonce implementation in the spec.
        var nonce = Utils.randomString(36);

        let opts = {
            acr_values: 'http://idmanagement.gov/ns/assurance/loa/1',
            client_id: this.clientId,
            nonce: nonce,
            response_type: 'code',
            redirect_uri: this.redirectUri,
            scope: 'openid email profile:name',
            state: state
        };

        let qs = new URLSearchParams(opts).toString();

        let url = `https://idp.int.identitysandbox.gov/openid_connect/authorize?${qs}`;

        window.location = url;
    },  

    // ///////////////////////////////////////////////////////////////////////////////////////

    logout(){
        
    }    
}

export default AuthLoginGov;