<template>

    <div id="OrgKeysPage">
        
        <us-card title="">

            <us-card-header>
                Your API Keys
            </us-card-header>

            <us-card-body>

                <us-list-group v-if="keys">
                    <us-list-group-item v-for="key in keys" :key="key.id" @click="selectedKey = key" :class="{'active':selectedKey && selectedKey.id == key.id}">
                        <i class="fas fa-key"></i>
                        <us-button class="float-right text-danger" variant="link" @click="onDeleteKey(key)"><i class="fas fa-trash"></i></us-button>        
                        {{key.name}}
                        <us-tag style="font-size:12px" variant="light">{{key.scopes}}</us-tag>
                    </us-list-group-item>
                </us-list-group>                
                
                <div v-if="selectedKey">

                    <h4>Test Key <span class="text-primary">{{selectedKey.name}}</span></h4>

                    <div><us-tag style="font-size:12px" variant="light">{{selectedKey.slug}}</us-tag></div>
                    <div><us-tag style="font-size:12px" variant="light">{{selectedKey.scopes}}</us-tag></div>

                    <us-form @submit="onTestKey()" :validate="true" >

                        <us-form-group label="Private key" help-text="Paste in your private key here to test the selected api key. We will not store it!">
                            <us-form-textarea v-model="testPrivateKey" :rules="{required:true}"></us-form-textarea>
                        </us-form-group>                                          

                        <div align="right">
                            <us-button type="submit"><i class="fas fa-vial"></i> Test</us-button>
                        </div>

                        <us-alert variant="error" v-if="error" class="mt-2 mx-1">
                            {{error}}
                        </us-alert>

                        <us-alert variant="info" v-if="testSesh" class="mt-2 mx-1">
                            <div style="overflow:auto">
                                <h4>Success!</h4>
                                <pre>{{testSesh}}</pre>
                            </div>
                        </us-alert>


                    </us-form>       
                </div>         

            </us-card-body>

        </us-card>


        <us-card>

            <us-card-header>
                Create Key
                <us-button v-if="!showCreateKey" class="float-right" variant="link" @click="showCreateKey = true"><i class="fas fa-chevron-down"></i></us-button>    
                <us-button v-else class="float-right" variant="link" @click="showCreateKey = false"><i class="fas fa-chevron-up"></i></us-button>    
            </us-card-header>

            <us-card-body v-if="showCreateKey">

                <us-form @submit="onCreateNewKey()" :validate="true">

                    <us-form-group label="Name" help-text="Add a name to describe what this key is for">
                        <us-form-input v-model="newKey.name" />
                    </us-form-group>
                    <us-form-group label="Scopes" help-text="Select what systems and access level this key will have access to" >
                        <!--
                        <us-form-input v-model="newKey.scopes" help-text="Select what systems and access level this key will have access to"/>
                        -->
                        <multiselect 
                            :options="scopes" 
                            placeholder="Select scopes..."
                            :multiple="true"
                            v-model="newKey.scopes">
                        </multiselect>                        
                    </us-form-group>
                    <us-form-group label="Public key URL" help-text="Specify the url of the public key"> 
                        <us-form-input v-model="newKey.url" type='url'/>
                    </us-form-group>
                    <us-form-group label="Public key contents" help-text="Alternatively, paste in the actual public key here to register it. Do not use your private key!">
                        <us-form-textarea v-model="newKey.contents"></us-form-textarea>
                    </us-form-group>                                          

                    <div align="right">
                        <us-button type="submit"><i class="far fa-save"></i> Save</us-button>
                    </div>

                </us-form>
                
            </us-card-body>
        </us-card>
    
    </div>

</template>
<script>
import Key from '../../../models/Key';
import User from '../../../models/User';
import Multiselect from 'vue-multiselect';
import jwt from 'jsonwebtoken';

export default {
    name: "org-keys",
    components: {Multiselect},
    data(){
        return {
            keys: null,
            selectedKey: null,
            showCreateKey: false,
            showTestKey: false,
            testPrivateKey: null,
            newKey: {},
            error: null,
            testSesh: null,
            scopes: ['prime.*.write', 'prime.schema.write', 'prime.schema.read', 'prime.users.write', 'prime.users.read', 'prime.org.write', 'prime.org.read']
        }
    },   
    props: ['org'],
    watch: {
        org(){
            this.getKeys();
        }
    },
    mounted(){
        this.getKeys();
    },
    methods: {
        
        onStartCreateKey(){
            this.newKey = {
                name: 'new key',
                url: '',
                contents: '',
                scopes: [],
            };
        },

        async getKeys(){
            let key = new Key(this.org.id);
            this.keys = await key.getAll();
        },

        async onCreateNewKey(){
            let key = new Key(this.org.id, this.newKey);
            await key.save(this.key);
            this.newKey = {};
            await this.getKeys();
        },

        async onDeleteKey(key){
            if (confirm(`Are you sure you want to delete key ${key.name}?`)){
                await key.delete();
                await this.getKeys();
            }
        },

        async onTestKey(){

            let user = new User();
            this.error = null;
            this.testSesh = null;

            function randomString(length) {
                // Thanks to https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
                return [...Array(length)].map(() => Math.random().toString(length)[2]).join('')
            }

            let apiRoot = user.getBaseUrl();

            // http://localhost:7071

            // Create a test RSA JWT token using RS384

            // A JWT signed with the client’s private key and containing the following claims:
            // iss (string) — The issuer, which must be the client_id.
            // sub (string) — The subject, which must also be the client_id.
            // aud (string) — The audience, which should be the URL of the token endpoint, for
            //                example: https://idp.int.identitysandbox.gov/api/openid_connect/token
            // jti (string) — The JWT ID, a unique identifier for the token which can be used to prevent
            //                reuse of the token. Should be an un-guessable, random string generated by the client.
            // exp (number) — The expiration time for this token. Should be an integer timestamp (number of seconds since
            //                the Unix Epoch) and be a short period of time in the future (such as 5 minutes from now).
            let claims = {
                iss: this.org.name,
                sub: this.org.name,
                aud: `${apiRoot}/user/auth/token`,
                exp: Math.round(Date.now()/1000) + parseInt(300),
                jti: randomString(32)
            };

            // https://github.com/auth0/node-jsonwebtoken

            try {

                const signedClaims = jwt.sign(claims, this.testPrivateKey, {
                    algorithm: 'RS384'
                });
                
                const jwtToken = {
                    key_id: this.selectedKey.slug,
                    grant_type: 'client_credentials',
                    scope: [],
                    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                    client_assertion: signedClaims,
                    exp: claims.exp
                };

                this.testSesh = await user._send('post', 'auth/token', jwtToken);

            }
            catch(err){
                this.error = err.toString();
            }

        }
     
    } 
};
</script>
<style lang="scss">
@import "~vue-multiselect/dist/vue-multiselect.min.css";

#OrgKeysPage {
    .multiselect__tags {
        border-color: #565c65;
        border-radius: 0;
        margin-top: 0.5rem;
    }
}
</style>
