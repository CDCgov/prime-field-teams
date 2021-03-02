<template>

    <div v-if="org && mode=='view'">

        <us-card :title="org.name" :img-src="org.icon" img-pos="left">
            <us-card-header>
                <us-button class="float-right" variant="link" @click="mode='edit'"><i class="fas fa-edit"></i></us-button>        
                {{org.name}}
            </us-card-header>
            <us-card-body>                        
                <p>{{org.description}}</p>
                <div class="text-primary" v-if="org.phoneNumber"><i class="fas fa-phone"></i> {{org.phoneNumber}}</div>
                <div class="text-primary" v-if="org.faxNumber"><i class="fas fa-fax"></i> {{org.faxNumber}}</div>
            </us-card-body>
            <us-card-footer>
                <us-button v-if="org.url" variant="primary" block :to="org.url">Website</us-button>
            </us-card-footer>
        </us-card>    

    </div>

    <us-card v-else-if="org && mode=='edit'"  title="Edit Organization Info" >
        <us-form @submit="onSubmit()" :validate="true">

            <us-row>
                <us-col>
                    <us-form-group label="Name">
                        <us-form-input v-model="org.name" :required="true"/>
                    </us-form-group>

                    <us-form-group label="Description">
                        <us-form-input v-model="org.description" />
                    </us-form-group>

                    <us-form-group label="Website">
                        <us-form-input v-model="org.url" type='url'/>
                    </us-form-group>
                </us-col>
                <us-col>
                    <us-form-group label="Fax Number">
                        <us-form-input v-model="org.faxNumber" type='tel'/>
                    </us-form-group>

                    <us-form-group label="Phone Number">
                        <us-form-input v-model="org.phoneNumber" type='tel'/>
                    </us-form-group>                        

                    <us-form-group label="Icon URL">
                        <us-form-input v-model="org.icon" type='url'/>
                    </us-form-group>                      
                </us-col>
            </us-row>       

            <div align="right">
                <us-button variant="light" type="button" @click="mode='view'"><i class="far fa-times-circle"></i> Cancel</us-button>
                <us-button type="submit"><i class="far fa-save"></i> Save</us-button>
            </div>

        </us-form>

    </us-card>


    <!-- 
    <pre>{{org}}</pre>
    -->
</template>
<script>
export default {
    name: "org-info",
    data(){
        return {
            key: null,
            mode: 'view'
        }
    },   
    props: ['org'],
    methods: {
        async onSubmit(){
            await this.org.save();
            this.mode = 'view';
        },
        createKey(){

        },
        generateKeys(){

        }        
    } 
};
</script>
<style lang="scss">
</style>
