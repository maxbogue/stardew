import './styles/app.scss';

import { createApp } from 'vue';
import Ripple from 'vue-ripple-directive';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: App }],
});

app.use(router);
app.directive('ripple', Ripple);

app.mount('#app');
