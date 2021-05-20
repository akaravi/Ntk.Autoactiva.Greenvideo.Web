import Vue from 'vue';
import { CoolSelectPlugin } from 'vue-cool-select';
import InputFacade from 'vue-input-facade';
import VueCryptojs from 'vue-cryptojs';
import VueSmoothScroll from 'vue2-smooth-scroll';
import VueJWT from 'vuejs-jwt';
import VueTouch from 'vue-touch';
import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
// import api from './services/api';
import Employe from '@/mixins/auth';
import Ripple from 'vue-material-design-ripple';
import uploader from 'vue-simple-uploader';
import axios from './plugins/axios';
import defStyle from './assets/def.scss';
import dashboardStyle from './assets/dashboard.scss';
import App from './App.vue';
import 'vue-material-design-ripple/dist/vue-material-design-ripple.css';
import './registerServiceWorker';
import router from './router';
import store from './store';
//  import App from './App.vue'
import 'vue-cool-select/dist/themes/material-design.scss';
// you can also import your theme
Vue.use(VuePersianDatetimePicker, {
  name: 'date-picker',
  props: {
    inputFormat: 'YYYY-MM-DDTHH:mm',
    format: 'YYYY-MM-DDTHH:mm',
    editable: false,
    inputClass: 'form-control my-custom-class-name',
    placeholder: 'انتخاب تاریخ...',
    altFormat: 'YYYY-MM-DDTHH:mm',
    color: '#61187A',
    autoSubmit: false,
  },
});
Vue.use(VueCryptojs);
Vue.use(uploader);
Vue.use(CoolSelectPlugin);
Vue.use(InputFacade);
Vue.config.productionTip = false;
Vue.use(VueJWT);
Vue.directive('ripple', Ripple);
Vue.prototype.$authObeject = new Employe();
Vue.use(VueTouch);
VueTouch.config.pan = {
  direction: 'horizontal',
};
VueTouch.config.swipe = {
  direction: 'horizontal',
};
const vm = new Vue({
  router,
  store,
  axios,
  defStyle,
  dashboardStyle,
  render: (h) => h(App),
});
vm.$mount('#app');
Vue.use(vm, VueSmoothScroll, {
  duration: 400,
  updateHistory: false,
});
