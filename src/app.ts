import './styles/app.scss';

import Vue from 'vue';
import Ripple from 'vue-ripple-directive';
import VueRouter from 'vue-router';

import App from './App.vue';

Vue.use(VueRouter);
Vue.directive('ripple', Ripple);

const router = new VueRouter({
  mode: 'history',
  routes: [{ path: '/', component: App }],
});

const app = new Vue({
  router,
});

app.$mount('#app');
