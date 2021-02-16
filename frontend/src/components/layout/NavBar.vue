<template>
    <div id="nav">
        <us-official-header variant="light"/>

        <us-header variant="dark">        
            <us-header-brand image="/usds-logo-2.png">                
                PRIME Field Teams
            </us-header-brand>
            <us-header-nav>
                <us-nav-item :to="{name:'home'}">Home</us-nav-item>
                <us-nav-item :to="{name:'builder'}">Builder</us-nav-item>
                <us-nav-item :to="{name:'config'}">Config</us-nav-item>
            </us-header-nav>
        </us-header>

        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
    </div>
</template>
<script>
export default {
    name: "NavBar",
    props: {
        msg: String,
    },
};
</script>
<style scoped lang="scss">
</style>
