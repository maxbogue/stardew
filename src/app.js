import Vue from 'vue';

import './styles/app.scss';
import App from './App.vue';

const app = new Vue({
  render: h => h(App),
});

app.$mount('#app');
