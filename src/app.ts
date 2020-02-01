import './styles/app.scss';

import Vue, { VueConstructor } from 'vue';
import Ripple from 'vue-ripple-directive';
import VueCompositionApi from '@vue/composition-api';
import VueRouter from 'vue-router';

import App from './App.vue';

Vue.use(VueCompositionApi);
Vue.use(VueRouter);
Vue.directive('ripple', Ripple);

const router = new VueRouter({
  mode: 'history',
  routes: [{ path: '/', component: App as VueConstructor<Vue> }],
});

const app = new Vue({
  router,
});

app.$mount('#app');
