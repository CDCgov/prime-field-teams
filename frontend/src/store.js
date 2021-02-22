import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash';
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: null,
        token: null,
        authReady: false
    },
    mutations: {    
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
        },
        setAuthReady(state, ready) {
            state.authReady = ready;
        }        
    },
    getters: {
        getUser(){
            return state.user; // eslint-disable-line
        },
        getToken(){
            return state.token; // eslint-disable-line
        },
        getAuthReady() {
            return state.authReady; // eslint-disable-line
        }
    },
    actions: {
     

        // ///////////////////////////////////////////////////////////////////////////////////////

        async checkSession({ commit, dispatch }) {
            
            if (!firebase.auth().currentUser){
                console.log('[store.checkSession] - no user -');
                //commit('setToken', null);
                //commit('setUser', null);
                return null;
            }
                        
            let token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
            let user = await firebase.auth().currentUser.toJSON();
            //let user = data.user.toJSON();
            
            commit('setToken', token);
            commit('setUser', user);

            console.log('[store.checkSession] user = ', user);

            return user;
        },

        // ///////////////////////////////////////////////////////////////////////////////////////

        async login({ commit, dispatch }, info) {
            
            try {
                // https://firebase.google.com/docs/auth/web/password-auth#sign_in_a_user_with_an_email_address_and_password
                await firebase.auth().signInWithEmailAndPassword(info.email, info.password);
                return await dispatch('checkSession');
            }
            catch(err){
                commit('setToken', null);
                commit('setUser', null);
                throw err;
            }
        },

        // ///////////////////////////////////////////////////////////////////////////////////////

        async register({ commit, dispatch }, info) {

            try {
                // https://firebase.google.com/docs/auth/web/password-auth#create_a_password-based_account
                const data = await firebase.auth().createUserWithEmailAndPassword(info.email, info.password);
                
                if (info.name){
                    await data.user.updateProfile({
                        displayName: info.name
                    });    
                }

                await dispatch('checkSession');

            }
            catch(err){
                commit('setToken', null);
                commit('setUser', null);
                throw err;
            }
        },

        // ///////////////////////////////////////////////////////////////////////////////////////

        async logout({ commit }) {
            await firebase.auth().signOut();
            commit('setToken', null);
            commit('setUser', null);
        },

        // ///////////////////////////////////////////////////////////////////////////////////////

        /**
         * Send a reset password email link
         * @see https://firebase.google.com/docs/auth/web/manage-users#send_a_password_reset_email
         */        
        async forgot({state}, email) {
            return await firebase.auth().sendPasswordResetEmail(email);
        }        

        
    }

});

export default store;