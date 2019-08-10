import 'vue-material/dist/theme/default.css';
import 'vue-material/dist/vue-material.min.css';
import Vue from 'vue';
import VueMaterial from 'vue-material';

import App from './App.vue';

Vue.use(VueMaterial);

const app = new Vue({
  render: h => h(App),
});

app.$mount('#app');
