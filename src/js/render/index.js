import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'

Vue.use(VueRouter);
Vue.use(Vuelidate);

import connectscreen from './components/ConnectScreen'
import controlscreen from './components/ControlScreen'

const routes = [
  { path: "/", component: connectscreen},
  { path: "/control", component: controlscreen}
];

const router = new VueRouter({
  routes
});

const app = new Vue({
  router
}).$mount("#power-control");
