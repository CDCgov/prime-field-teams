<template>
    <div id="nav">
        <us-official-header variant="dark"/>

        <us-header variant="light">        
            <us-header-brand image="/usds-logo-2.png">                
                PRIME Field Teams
            </us-header-brand>
            <us-header-nav>
                <us-nav-item :to="{name:'home'}">Home</us-nav-item>
                <us-nav-item :to="{name:'about'}">About</us-nav-item>
                <us-nav-item :to="{name:'manage-schemas'}">Schema</us-nav-item>
                <us-nav-item @click="login()">Login</us-nav-item>
            </us-header-nav>
        </us-header>
    </div>
</template>
<script>

const CLIENT_ID = 'urn:gov:gsa:openidconnect.profiles:sp:sso:usds:calendar';
const REDIRECT_URI = 'http://localhost:8080';

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
    name: "NavBar",
    props: {
        msg: String,
    },
    methods: {
        /**
         * Redirect user to the login.gov login page, which then redirects back
         * to the authentication page.
         * @see https://developers.login.gov/oidc/
         */
        login() {

            // A unique value at least 32 characters in length used for maintaining state between the request and the callback.
            // This value will be returned to the client on a successful authorization.
            var state = generateId(32);

            // A unique value at least 32 characters in length used to verify the integrity of the id_token and mitigate
            // replay attacks. This value should include per-session state and be unguessable by attackers. This value
            // will be present in the id_token of the token endpoint response, where clients will verify that the nonce
            // claim value is equal to the value of the nonce parameter sent in the authentication request. Read more
            // about nonce implementation in the spec.
            var nonce = generateId(36);

            let opts = {
                acr_values: 'http://idmanagement.gov/ns/assurance/loa/1',
                client_id: CLIENT_ID,
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
<style scoped lang="scss">
</style>
