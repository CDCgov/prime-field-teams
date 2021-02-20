<template>
	<us-container fluid="lg" id="LoginPage">

        <div style="margin-top:150px" align="center" v-if="mode == 'login'">
            <us-button @click="loginGov()" class="login-button mr-2" variant="info">
                <h4 class="m-0 p-0 mb-1">Login with</h4>
                <img src="@/assets/login-gov-logo.svg"/>
            </us-button>
            <us-button @click="loginOkta()" class="login-button ml-2" variant="info">
                <h4 class="m-0 p-0 mb-1">Login with</h4>
                <img src="@/assets/okta-logo.svg"/>
            </us-button>
        </div>

        <div v-if="mode == 'redirect-from-okta'">
            Authenticated with OKTA
        </div>

        <div v-if="mode == 'redirect-from-login'">
            Authenticated with LOGIN.GOV
        </div>

	</us-container>
</template>
<script>

import { OktaAuth } from '@okta/okta-auth-js';

const OKTA_CLIENT_ID = '0oa7q1wj6U9EvwFq45d6';
const LOGIN_CLIENT_ID = 'urn:gov:gsa:openidconnect.profiles:sp:sso:usds:calendar';
const REDIRECT_URI = 'http://localhost:8080/login';

function dec2hex(dec) {
    return dec < 10 ? '0' + String(dec) : dec.toString(16)
}

/**
 * Generate a random string for the nonce
 * Thanks to https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 */        
function generateId(len) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

export default {
    name: "login",
    props: {
        msg: String,
    },
    data(){
        return {
            mode: 'login'
        }
    },
    mounted(){
        // Check if we have data in the url
        // code=MisQcMQn5-ilHoqh0tCoAJPUUnCReei9NS4FbpnYwxQ&state=ib7uOt9GAL6Wt5JjsNju9tD025synjuSMltsMGaKkygfhWCrfqYaXFeIhLY0sxl8
        if (this.$route.query.code && this.$route.query.state){
            // Check strategy is being used by looking at the state
            if (this.$route.query.state.search('okta-') !== -1){
                // Okta
                this.mode = 'redirect-from-okta';
            }
            else if (this.$route.query.state.search('logingov-') !== -1){
                // Login,gove
                this.mode = 'redirect-from-login';
            }

        }
    },
    methods: {

        /**
         * Initiate authentication using Okta
         * @see https://github.com/okta/okta-auth-js
         * @see https://developer.okta.com/docs/guides/implement-auth-code-pkce
         */
        loginOkta(){

            let config = {
                issuer: 'https://dev-46102578.okta.com/oauth2/default',
                // Required for login flow using getWithRedirect()
                clientId: OKTA_CLIENT_ID,
                redirectUri: REDIRECT_URI,                     
                // Use authorization_code flow
                //responseType: 'code',
                //pkce: false                           
            };

            // parseFromUrl

            const authClient = new OktaAuth(config);
            authClient.signInWithRedirect({state: `okta-${generateId(36)}`});

            authClient.authStateManager.subscribe((authState) => {
            // handle the latest evaluated authState, like integrate with client framework's state management store
                if (authState){
                    let user = authState.getUser();
                    this.$log(user);
                }
            });

            // authState.isAuthenticated

        },

        /**
         * Redirect user to the login.gov login page, which then redirects back
         * to the authentication page.
         * @see https://developers.login.gov/oidc/
         */
        loginGov() {

            // A unique value at least 32 characters in length used for maintaining state between the request and the callback.
            // This value will be returned to the client on a successful authorization.
            var state = `logingov-${generateId(36)}`;

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
    }    
};
</script>
<style lang="scss">
#LoginPage {

    .login-button {
        img {
            height: 40px;            
        }
        width: 250px;
    }
}
</style>
