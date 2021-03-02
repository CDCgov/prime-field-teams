<template>
	<us-container>

         <us-row class="mt-3">
            <us-col md="3">
                <us-form-group class="mb-4" v-if="orgs">
                    <us-form-combobox name="Select Org" :options="orgs" v-model="selectedOrg" label-field="name"/>
                </us-form-group>
             </us-col>
        </us-row>

        <us-row class="mt-1">

            <us-col md="3">
                
                <us-side-nav class="pr-2">
                    <us-side-nav-item :class="{'active': link == 'info'}" @click="link = 'info'">Basic Info</us-side-nav-item>
                    <us-side-nav-item :class="{'active': link == 'keys'}" @click="link = 'keys'">API Keys</us-side-nav-item>
                    <us-side-nav-item :class="{'active': link == 'users'}" @click="link = 'users'">Manage Users</us-side-nav-item>
                </us-side-nav>       

                <us-button variant="link" class="mt-3" @click="createOrg()">
                    <i class="fas fa-plus-circle"></i> Create
                </us-button>

                <us-button variant="link" class="ml-2 mt-3" @click="getOrganizations()">
                    <i class="fas fa-sync"></i> Refresh
                </us-button>
                


            </us-col>

            <us-col>
                <org-info v-if="link == 'info'" :org="selectedOrg"></org-info>
                <org-keys v-if="link == 'keys'" :org="selectedOrg"></org-keys>
                <div v-if="link == 'users'">TBD</div>
            </us-col>

        </us-row>

        
	</us-container>
</template>
<script>
import Organization from '../../../models/Organization';
import OrgKeys from './OrgKeys';
import OrgInfo from './OrgInfo';

export default {
    name: "organization",
    components: {OrgKeys, OrgInfo},
    data(){
        return {
            link: 'info',
            selectedOrg: null,
            orgs: null
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
                this.getOrganizations();
            }
        }
    }, 
    mounted(){
        this.getOrganizations();
    },
    methods: {

        onSelectOrg(org){
            this.selectedOrg = new Organization(org);
        },

        async createOrg(){
             let org = new Organization();
             org.name = "New org";
             await org.save();
             if (!this.orgs){
                 this.orgs = [];
             }
             this.orgs.push(org);
             this.selectOrg(org);
        },

        async getOrganizations(){

            if (!this.user){
                return;
            }

            let org = new Organization();
            let res = await org.getOrganizations();
            
            this.orgs = res.results;
            
            if (this.orgs && this.orgs.length){
                this.onSelectOrg(this.orgs[0]);
            }

            //await org.load(this.user.organizationId);
        }
    }
};
</script>
<style lang="scss">
</style>
