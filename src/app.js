import './styles/app.scss';

import Vue from 'vue';
import Ripple from 'vue-ripple-directive';

import App from './App.vue';

Vue.directive('ripple', Ripple);

const app = new Vue({
  render: h => h(App),
});

app.$mount('#app');
