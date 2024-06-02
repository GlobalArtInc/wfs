import Vue from 'vue'
import App from './App.vue'
//import LoggedApp from './LoggedApp.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import './permission'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import i18n from './utils/setup-i18n';
import 'js-plugin-circliful/dist/main.css';

Vue.config.productionTip = false

var VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);
Vue.use(Toast, {
    transition: "Vue-Toastification__bounce",
    position: "bottom-right",
    maxToasts: 20,
    newestOnTop: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    timeout: 2000
});

//let searchParams = new URLSearchParams(window.location.search)

//if (searchParams.get('state') === 'logged') {
//    new Vue({
//        vuetify,
//        router,
//        store,
//        i18n,
//        created() {
//            this.$i18n.locale = 'ru'
//        },
//        render: h => h(LoggedApp)
//    }).$mount('#app')
//} else {
    new Vue({
        vuetify,
        router,
        store,
        i18n,
        created() {
            this.$i18n.locale = 'ru'
        },
        render: h => h(App)
    }).$mount('#app')
//}