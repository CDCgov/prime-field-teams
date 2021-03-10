<template>
	<us-container>

         <us-row class="mt-3">
            <us-col md="3">
                <us-form-group class="mb-4" v-if="orgs">
                    <us-form-combobox name="Select Org" :options="orgs" v-model="org" label-field="name"/>
                </us-form-group>
             </us-col>
        </us-row>

        <us-row class="mt-1">

            <us-col md="3">
                
                <us-side-nav class="pr-2">
                    <us-side-nav-item :class="{'active': link == 'info'}" @click="link = 'info'">Basic Info</us-side-nav-item>
                    <us-side-nav-item :class="{'active': link == 'users'}" @click="link = 'users'">Manage Users</us-side-nav-item>
                    <us-side-nav-item :class="{'active': link == 'keys'}" @click="link = 'keys'">API Keys</us-side-nav-item>
                    <us-side-nav-item :class="{'active': link == 'key-gen'}" @click="link = 'key-gen'">Key Tool</us-side-nav-item>
                </us-side-nav>       

                <us-button variant="link" class="mt-3" @click="createOrg()">
                    <i class="fas fa-plus-circle"></i> Create
                </us-button>

                <us-button variant="link" class="ml-2 mt-3" @click="getOrganizations()">
                    <i class="fas fa-sync"></i> Refresh
                </us-button>
                


            </us-col>

            <us-col>
                <org-info v-if="link == 'info'" :org="org"></org-info>
                <org-keys v-if="link == 'keys'" :org="org"></org-keys>
                <org-users v-if="link == 'users'" :org="org"/>
                <key-generator v-if="link == 'key-gen'"/>
            </us-col>

        </us-row>

        
	</us-container>
</template>
<script>
import Organization from '../../../models/Organization';
import OrgUsers from './OrgUsers';
import OrgKeys from './OrgKeys';
import OrgInfo from './OrgInfo';
import KeyGenerator from './KeyGenerator';

export default {
    name: "organization",
    components: {OrgKeys, OrgInfo, KeyGenerator, OrgUsers},
    data(){
        return {
            link: 'info'
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        org: {
            get(){
                return this.$store.state.org;
            },
            set(val){
                this.$store.commit('setOrg', val);
            }
        },
        orgs: {
            get(){
                return this.$store.state.orgs;
            },
            set(val){
                this.$store.commit('setOrgs', val);
            }
        }           
    },   
    watch: {
        user(newVal){
            if (newVal){
                this.getOrganizations();
            }
        }             
    }, 
    mounted(){
        this.getOrganizations();
    },
    methods: {

        onSelectOrg(org){
            this.org = new Organization(org);
        },

        async createOrg(){
             let org = new Organization();
             org.name = "New org";
             await org.save();
             if (!this.orgs){
                 this.orgs = [];
             }
             // Refresh
             await this.getOrganizations();
             // Select this org
             for (let i=0; i<this.orgs.length; i+=1){
                 if (this.orgs[i].id == this.org.id){
                     this.$store.commit('setOrg', this.orgs[i]);
                     return;
                 }
             }
        },

        async getOrganizations(){

            if (!this.user){
                return;
            }

            let org = new Organization();
            let res = await org.getOrganizations();
                        
            this.$store.commit('setOrgs', res.results);
            if (this.orgs && this.orgs.length){
                this.$store.commit('setOrg', this.orgs[0]);
            }

            //await org.load(this.user.organizationId);
        }
    }
};
</script>
<style lang="scss">
</style>
