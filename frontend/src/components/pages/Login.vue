<template>
	<us-container fluid="lg" id="LoginPage">

        <h1>LOGIN {{authenticated}}</h1>
        {{mode}}
        <pre>{{user}}</pre>

        <div style="margin-top:150px" align="center" v-if="mode == 'login'">
            <us-button @click="loginGov()" class="login-button mr-2" variant="info">
                <h4 class="m-0 p-0 mb-1">Login with</h4>
                <img src="@/assets/login-gov-logo.svg"/>
            </us-button>
            <us-button @click="loginOkta()" class="login-button ml-2" variant="info">
                <h4 class="m-0 p-0 mb-1">Login with</h4>
                <img src="@/assets/okta-logo.svg"/>
            </us-button>
        </div>

        <div v-if="mode == 'redirect-from-okta'">
            {{authenticated}}
            {{user}}
            Authenticated with OKTA
        </div>

        <div v-if="mode == 'redirect-from-login.gov'">
            Authenticated with LOGIN.GOV
        </div>

	</us-container>
</template>
<script>

//import AuthMixin from "../../mixins/AuthMixin";

export default {
    name: "login",
    //mixins:[AuthMixin],
    props: {
        msg: String,
    },
    data(){
        return {
            mode: 'login'
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
        authenticated(){
            this.onAuthenticated();
        }
    },
    async mounted(){
        

        // Check if we have data in the url
        // code=MisQcMQn5-ilHoqh0tCoAJPUUnCReei9NS4FbpnYwxQ&state=ib7uOt9GAL6Wt5JjsNju9tD025synjuSMltsMGaKkygfhWCrfqYaXFeIhLY0sxl8
        let provider = await this.$auth.onRedirect(this.$route.query);

        if (provider){
            this.mode = 'redirect-from-' + provider;
        }

        this.onAuthenticated();
    },
    methods: {

        async onAuthenticated(){
            
            //

            /*
            //console.log('AUTH CHANGED!')
            // First, check if we're authenticated already. If so, go back
            if (this.authenticated){
                alert(window.history.length);
                if (window.history.length > 2){
                    this.$router.go(-1);
                }
                else {
                    this.$router.go({to:'home'});
                }
            }    
            */
        },

        loginOkta(){
            this.$auth.login('okta');
        },

        loginGov(){
            this.$auth.login('login.gov');
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
