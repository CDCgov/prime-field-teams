<template>

    <div>
        
        <us-card title="Manage API Keys" >
            
            <us-card-body>

                <div>
                    <us-button @click="onStartCreateKey()">
                        <i class="fas fa-plus-circle"></i> Register new API key
                    </us-button>
                </div>

                <us-form v-if="newKey" @submit="onCreateNewKey()" :validate="true">

                    <us-row>
                        <us-col>
                            <us-form-group label="Name" help2-text="Add a name to describe what this key is for">
                                <us-form-input v-model="newKey.name" />
                            </us-form-group>
                            <us-form-group label="Public key URL">
                                <us-form-input v-model="newKey.url" type='url'/>
                            </us-form-group>
                        </us-col>

                        <us-col>
                            <us-form-group label="Scopes">
                                <us-form-input v-model="newKey.scopes"/>
                            </us-form-group>
                            <us-form-group label="Public key contents">
                                <us-form-textarea v-model="newKey.contents"></us-form-textarea>
                            </us-form-group>                                          
                        </us-col>
                    </us-row>       

                    <div align="right">
                        <us-button type="submit"><i class="far fa-save"></i> Save</us-button>
                    </div>

                </us-form>
                
            </us-card-body>

        </us-card>

        <us-card title="PEM Public/private key">
            <us-card-body>

                <div>
                    <us-button @click="generateKeys()"><i class="fas fa-key"></i> Generate</us-button>
                </div>
                
                <us-form-group label="Public Key" v-if="sampleKeyPair">
                    <us-form-textarea v-model="sampleKeyPair.public"></us-form-textarea>
                </us-form-group>

                <us-form-group label="Private Key" v-if="sampleKeyPair">
                    <us-form-textarea v-model="sampleKeyPair.private"></us-form-textarea>
                </us-form-group>
                
            </us-card-body>
        </us-card>
    
    </div>

</template>
<script>
import User from '../../../models/User';
export default {
    name: "org-keys",
    data(){
        return {
            newKey: null,
            sampleKeyPair: null
        }
    },   
    props: ['org'],
    methods: {
        
        onStartCreateKey(){
            this.newKey = {
                name: 'new key',
                url: '',
                contents: '',
                scopes: []
            };
        },

        onCreateNewKey(){

        },

        async createKey(){
            await this.org.createKey(this.key);
        },

        async generateKeys(){
            let user = new User();
            this.sampleKeyPair = await user.generatePEM();
        }        
    } 
};
</script>
<style lang="scss">
</style>
