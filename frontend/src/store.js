import Vue from 'vue';
import Vuex from 'vuex';
import User from './models/User';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: null,
        apiToken: null,
        authenticated: false,
        authProvider: 'okta'
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
        onAuthenticated({commit}, info){
            let user = new User();
            user.register(info.provider, info.idToken);
            commit('setAuthenticated', info.isAuthenticated);
            commit('setUser', info.user);
        }
    }
});

export default store;