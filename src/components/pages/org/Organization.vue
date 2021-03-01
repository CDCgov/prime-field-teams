<template>
	<us-container>

        <us-row class="mt-5">

            <us-col md="3">
                <us-side-nav style="margin-top: 30px" class="pr-2">
                    <us-side-nav-item :class="{'active': link == 'info'}" @click="link = 'info'">Basic Info</us-side-nav-item>
                    <us-side-nav-item :class="{'active': link == 'keys'}" @click="link = 'keys'">Keys</us-side-nav-item>
                </us-side-nav>       
            </us-col>

            <us-col>

                <div v-if="link == 'info'">
                    <us-form v-if="org" @submit="onSubmit()" :validate="true">

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
                            <us-button type="submit"><i class="far fa-save"></i> Save</us-button>
                        </div>

                    </us-form>
                    <!-- 
                    <pre>{{org}}</pre>
                    -->
                </div>


                <div v-if="link == 'keys'">
                    <keys></keys>
                </div>

            </us-col>

        </us-row>

        
	</us-container>
</template>
<script>
import Organization from '../../../models/Organization';
import Keys from './Keys';

export default {
    name: "organization",
    components: {Keys},
    data(){
        return {
            link: 'info',
            org: null
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },   
    watch: {
        user(newVal){
            if (newVal){
                this.getOrganization();
            }
        }
    }, 
    mounted(){
        this.getOrganization();
    },
    methods: {
        async getOrganization(){
            if (!this.user){
                return;
            }
            if (!this.user.organizationId){        
                this.$toast.error('You do not belong to any organizations!')      
                return;
            }
            let org = new Organization();
            await org.load(this.user.organizationId);
            this.org = org;
        }
    }
};
</script>
<style lang="scss">
</style>
