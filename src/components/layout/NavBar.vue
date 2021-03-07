<template>
    <div id="nav">
        <us-official-header variant="dark" fluid="full"/>

        <us-header variant="light" fluid="full">        
            <us-header-brand image="/usds-logo-2.png">                
                PRIME Field Teams
            </us-header-brand>
            <us-header-nav>
                <!--
                <us-nav-item v-if="user && user.firstName">{{user.firstName}}</us-nav-item>
                <us-nav-item v-if="user && user.name">{{user.name}}</us-nav-item>
                -->
                <us-nav-item v-if="authenticated" :to="{name:'home'}">Home</us-nav-item>
                <!-- <us-nav-item v-if="authenticated" :to="{name:'about'}">About</us-nav-item> -->
                <us-nav-item v-if="authenticated" :to="{name:'organization'}">Organization</us-nav-item>
                <us-nav-item v-if="authenticated" :to="{name:'manage-schemas'}">Schema</us-nav-item>
                <us-nav-item v-if="!authenticated" :to="{name:'login'}">Login</us-nav-item>
                <us-nav-item v-if="authenticated" @click="onLogout()">Logout</us-nav-item>
            </us-header-nav>
        </us-header>
    </div>
</template>
<script>
import AuthFactory from "../../services/AuthFactory";

export default {
    name: "NavBar",
    computed: {
        user() {
            return this.$store.state.user;
        },
        authenticated() {
            return this.$store.state.authenticated;
        },
    },
    methods: {
        async onLogout(){

            try {
                // Create a instance of the auth service, but we don't need to specifiy the provider at this point
                let auth = await AuthFactory.create();

                if (auth){
                    auth.logout();
                }
            }
            catch(err){
                console.error('Error checking session', err);
            }

            this.$store.dispatch('onLogout');
            this.$router.replace({name:'login'});
        }
    }

};
</script>
<style scoped lang="scss">
</style>
