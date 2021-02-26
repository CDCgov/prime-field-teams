<template>
	<us-container fluid="lg">
        <h1>Organization</h1>
        {{user}}
        {{org}}
	</us-container>
</template>
<script>
import Organization from '../../../models/Organization';

export default {
    name: "organization",
    data(){
        return {
            org: null
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },    
    mounted(){
        this.getOrganizations();
    },
    methods: {
        async getOrganizations(){
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
