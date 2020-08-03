import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './assets/css/hamburgers.css'
import Simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueLoading from 'vue-component-loading'
import './components/firebaseInit'
import firebase from 'firebase/app';
import 'firebase/auth';

Vue.config.productionTip = false

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

let loadConfig = {
  progressBar:{
    color: '#0080D5',
    failedColor: '#874b4b',
    thickness: '3px',
    transition: {
      speed: '0.2s',
      opacity: '1',
      termination: 300
    },
  }
}

Vue.use(VueLoading, loadConfig);

let app;
firebase.auth().onAuthStateChanged(function() {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      Simplebar,
      render: h => h(App)
    }).$mount('#app')
  }
});