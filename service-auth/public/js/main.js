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

/**
 * Promisfyd ajax request, thnks https://stackoverflow.com/questions/48969495/in-javascript-how-do-i-should-i-use-async-await-with-xmlhttprequest
 * @param {*} method 
 * @param {*} url 
 */
function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}


const CLIENT_ID = 'urn:gov:gsa:openidconnect.profiles:sp:sso:usds:calendar';
const API_URL = 'https://api.actiontracker.org';
const REDIRECT_URI = 'https://api.actiontracker.org';

const User = {
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

        let url = `https://idp.int.identitysandbox.gov/openid_connect/authorize?${$.param(opts)}`;

        window.location = url;
    },

    /**
     * Take a code given by the login.gov authentication page and exchange for a access token
     * which is used for hits to our API
     * @param {*} code
     */
    async register(opts) {
        
        try {
            let results = await makeRequest("GET", `${API_URL}/user/auth?code=${opts.code}&state=${opts.state}`);

            console.log(results);
    
            if (!results || !results.token) {
                return;
            }
    
            const token = results.token;
            const user = results.user;
            const expires = results.expires;
    
            alert(`Got Token: ${token}`);
    
            return results;
    
        }
        catch(err){
            alert(`Error: ${err.toString()}`)
        }
    }

}    

document.getElementById("SignInButton").addEventListener("click", function() {
    User.login();
});

// Check if we have a code, if so then we've come back from login.gov. So now go get the session token!
const search = location.search.substring(1);
let params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

if (params.code){
    User.register(params);
}