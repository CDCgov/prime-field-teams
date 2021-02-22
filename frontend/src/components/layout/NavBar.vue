<template>
    <div id="nav">
        <us-official-header variant="dark"/>

        <us-header variant="light">        
            <us-header-brand image="/usds-logo-2.png">                
                PRIME Field Teams
            </us-header-brand>
            <us-header-nav>
                <us-nav-item v-if="authenticated">{{authenticated}}</us-nav-item>
                <us-nav-item :to="{name:'home'}">Home</us-nav-item>
                <us-nav-item :to="{name:'about'}">About</us-nav-item>
                <us-nav-item :to="{name:'manage-schemas'}">Schema</us-nav-item>
                <us-nav-item :to="{name:'login'}">Login</us-nav-item>
            </us-header-nav>
        </us-header>
    </div>
</template>
<script>
export default {
    name: "NavBar",
    computed: {
        user() {
            return this.$store.state.user;
        },
        authenticated() {
            return this.$store.state.authenticated;
        },
    }
};
</script>
<style scoped lang="scss">
</style>
