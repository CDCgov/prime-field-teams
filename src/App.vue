<template>
  <div id="app">
    <nav-bar/>
    <router-view/>
  </div>
</template>
<script>

import NavBar from "./components/layout/NavBar";
import AuthFactory from "./services/AuthFactory";


export default {
    name: "App",
    components: {NavBar},
    async mounted(){
      
        try {
           // Check to see if we have a session already
           let auth = await AuthFactory.create();

            if (auth){
                let info = await auth.checkSession(this.$route.query);
                await this.$store.dispatch('onAuthenticated', info);
            }
        }
        catch(err){
            console.error('Error checking session', err);
        }


    },    
};
</script>
<style lang="scss">
@import "./styles/global.scss";
</style>
