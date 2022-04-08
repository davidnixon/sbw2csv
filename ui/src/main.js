import Vue from 'vue';
import App from './App.vue';
import router from './router';
import CarbonComponentsVue from '@carbon/vue';
Vue.use(CarbonComponentsVue);

Vue.config.productionTip = false;

const store = {
  state: {
    debug: false, // show user debug information

    setDebugAction(newValue) {
      this.debug = newValue;
    },
    toggleDebugAction() {
      this.debug = !this.debug;
    },
  },
};

new Vue({
  router,
  data: store,
  render: (h) => h(App),
}).$mount('#app');
