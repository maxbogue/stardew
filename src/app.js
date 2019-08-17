import Ripple from 'vue-ripple-directive';
import Vue from 'vue';

import './styles/app.scss';
import App from './App.vue';

Vue.directive('ripple', Ripple);

const app = new Vue({
  render: h => h(App),
});

app.$mount('#app');
