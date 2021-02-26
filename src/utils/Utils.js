
import _ from 'lodash';

export default {

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Generate a v4 UUID
     */
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
        return Array.from(arr, this.dec2hex).join('')
    },

    // ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Convert from decimanl to a hex string
     * @param {number} dec 
     */
    dec2hex(dec) {
        return dec < 10 ? '0' + String(dec) : dec.toString(16)
    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Load a preference from local storage
     * @param {*} name 
     */
    getPreference(name) {

        try {
            // Check if it's an object or flat string
            let type = localStorage.getItem(`prime-pref-${name}-type`);
            let val = localStorage.getItem(`prime-pref-${name}`);
            
            if (!type){
                return null;
            }
            else if (type == 'object'){
                val = JSON.parse(val);                
            }

            //console.log(`GETTING ${name} (${type}) FROM LOCALSTORE`, val);

            if (val == 'null'){
                return null;
            }

            return val;    

        }
        catch(err){
            console.error('Error getting value from localstorage; ', err);
            return null;
        }

    },

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Store a preference from local storage
     * @param {*} name 
     */    
    setPreference(name, val) {
        
        //console.log(`Storing object to prime-pref-${name}`, _.isObject(val), val);

        if (_.isObject(val)){
            localStorage.setItem(`prime-pref-${name}`, JSON.stringify(val));
            localStorage.setItem(`prime-pref-${name}-type`, 'object');
        }
        else {
            localStorage.setItem(`prime-pref-${name}`, val);
            localStorage.setItem(`prime-pref-${name}-type`, 'string');
        }
    }
    
}