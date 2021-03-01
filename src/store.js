import Vue from 'vue';
import Vuex from 'vuex';
import BaseModel from './models/BaseModel';
import User from './models/User';
import Utils from './utils/Utils';

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

        async __processSession({commit}, seshResponse){
            if (seshResponse && seshResponse.access_token){                   
                BaseModel.sessionToken = seshResponse.access_token;
                Utils.setPreference('session-token', seshResponse.access_token);
                commit('setUser', seshResponse.user);
                commit('setAuthenticated', true);
            }   
        },

        async checkSession({dispatch}){

            BaseModel.sessionToken = Utils.getPreference('session-token');

            if (BaseModel.sessionToken){

                let user = new User();
                let res = await user.verifySession();
    
                console.log('CHECK SESION = ', res);

                dispatch('__processSession', res);

            }
         
        },

        async onAuthenticated({commit, dispatch}, info){

            //console.log('Entering store.onAuthenticated()', info);

            if (!info){
                return
            }

            try {

                let user = new User();
                let res = await user.register(info.provider, info.idToken, info.state);

                //console.log('RES = ', res);
                
                dispatch('__processSession', res);

            }
            catch(err){
                dispatch('onLogout');
                throw new Error(err.toString());
            }
            
        }
    }
});

export default store;