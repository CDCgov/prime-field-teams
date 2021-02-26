import Vue from 'vue';
import Vuex from 'vuex';
import Auth from './models/Auth';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: null,
        sessionToken: null,
        authenticated: false,
        authProvider: null
    },
    mutations: {    
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
        },
        setAuthProvider(state, provider) {
            state.authProvider = provider;
        },
        setAuthenticated(state, isAuth) {
            state.authenticated = isAuth;
        }        
    },
    getters: {
        getUser(){
            return state.user; // eslint-disable-line
        },
        getToken(){
            return state.token; // eslint-disable-line
        },
        getAuthProvider() {
            return state.authProvider;  // eslint-disable-line
        },        
        getAuthenticated() {
            return state.authenticated; // eslint-disable-line
        }
    },
    actions: {
                
        onLogout({commit}){
            commit('setAuthenticated', null);
            commit('setUser', null);    
        },

        async onAuthenticated({commit, dispatch}, info){

            console.log('Entering store.onAuthenticated()', info);

            if (!info){
                return
            }

            try {
                let auth = new Auth();
                let res = await auth.register(info.provider, info.idToken, info.state);

                console.log('RES = ', res);
                
                if (res && res.token){                   
                    commit('setUser', res.user);
                    commit('setAuthenticated', true);
                }
            }
            catch(err){
                dispatch('onLogout');
                throw new Error(err.toString());
            }
        }
    }
});

export default store;