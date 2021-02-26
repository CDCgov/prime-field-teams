<template>
	<us-container fluid="lg" id="LoginPage">

        <us-alert v-if="error" variant="error" title="Error" class="mt-4">
            {{error}}
        </us-alert>

        <div style="margin-top:150px" align="center">

            <div v-if="mode == 'login'">
                <us-button @click="loginGov()" class="login-button mr-2" variant="info">
                    <h4 class="m-0 p-0 mb-1">Login with</h4>
                    <img src="@/assets/login-gov-logo.svg"/>
                </us-button>
                <us-button @click="loginOkta()" class="login-button ml-2" variant="info">
                    <h4 class="m-0 p-0 mb-1">Login with</h4>
                    <img src="@/assets/okta-logo.svg"/>
                </us-button>
            </div>

            <div v-else>
                <i class="text-muted fas fa-spinner fa-spin fa-4x"></i>
            </div>

        </div>



	</us-container>
</template>
<script>

import AuthFactory from "../../services/AuthFactory";

export default {
    name: "login",
    //mixins:[AuthMixin],
    props: {
        msg: String,
    },
    data(){
        return {
            mode: 'login',
            error: null
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        authenticated() {
            return this.$store.state.authenticated;
        },
    },    
    watch: {
        authenticated(newVal){
            // If authenticated changes to true, it means we've got a valid session 
            // so send the person to the home page
            if (newVal){
                this.$router.push({name:'home'});
            }
        }
    },
    async mounted(){
        
        try {
            if (this.$route.query && this.$route.query.code && this.$route.query.state){
                this.mode = 'redirect';
                let info = await AuthFactory.handleRedirect(this.$route.query);
                await this.$store.dispatch('onAuthenticated', info);
            }
        }
        catch(err){
            this.mode = 'login';
            this.error = err.toString().replace('Error: ', '');
        }


    },
    methods: {

        async loginOkta(){
            this.mode = 'loading';
            let auth = await AuthFactory.create('okta');
            auth.login('okta');
        },

        async loginGov(){
            this.mode = 'loading';
            let auth = await AuthFactory.create('login.gov');
            auth.login('login.gov');
        }

    }    
};
</script>
<style lang="scss">
#LoginPage {

    .login-button {
        img {
            height: 40px;            
        }
        width: 250px;
    }
}
</style>
