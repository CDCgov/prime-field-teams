<template>
	<us-container fluid="lg">

        <us-button @click="createKey"><i class="fas fa-key"></i> Register public key</us-button>
        <us-button @click="generateKeys"><i class="fas fa-key"></i> Generate Key</us-button>

        <us-form v-if="key" @submit="onSubmit()" :validate="true">

            <us-row>
                <us-col>
                    <us-form-group label="Name" help-text="Add a name to describe what this key is for">
                        <us-form-input v-model="key.name" />
                    </us-form-group>

                    <us-form-group label="Scopes">
                        <us-form-input v-model="key.scopes"/>
                    </us-form-group>

                </us-col>
                <us-col>
                    <us-form-group label="Public key URL">
                        <us-form-input v-model="key.url" type='url'/>
                    </us-form-group>

                    <us-form-group label="Public key contents">
                        <us-form-textarea v-model="org.contents"></us-form-textarea>
                    </us-form-group>                                          
                </us-col>
            </us-row>       

            <div align="right">
                <us-button type="submit"><i class="far fa-save"></i> Save</us-button>
            </div>

        </us-form>

	</us-container>
</template>
<script>
export default {
    name: "organization-keys",
    data(){
        return {
            key: null
        }
    },   
    methods: {
        createKey(){

        },
        generateKeys(){

        }        
    } 
};
</script>
<style lang="scss">
</style>
