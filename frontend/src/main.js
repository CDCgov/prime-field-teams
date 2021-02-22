import Vue from 'vue'
import App from './App.vue'
//import uswds from 'uswds/dist/js/uswds.min.js';
//window.uswds = uswds;
//import { UswdsVue } from 'uswds-vue';
import { UswdsVue } from '../../../../uswds-vue/src/main.js';
import Logger from './utils/Logger';
import router from './router.js';

Vue.use(Logger);
Vue.use(UswdsVue);
Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
