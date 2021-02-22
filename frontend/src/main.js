import Vue from 'vue'
import App from './App.vue'
//import uswds from 'uswds/dist/js/uswds.min.js';
//window.uswds = uswds;
//import { UswdsVue } from 'uswds-vue';
import { UswdsVue } from '../../../../uswds-vue/src/main.js';
import Logger from './utils/Logger';
import router from './router.js';
import store from './store.js';
import AuthService from './services/AuthService.js';

Vue.config.productionTip = false

Vue.use(Logger);
Vue.use(store);
Vue.use(UswdsVue);
Vue.use(AuthService, {providers: ['okta', 'login.gov'], store: store});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
