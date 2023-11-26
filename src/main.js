/* eslint-disable */

import 'bootstrap/dist/css/bootstrap.css'
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue3-cookies'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import Popper from "vue3-popper";
import "@/plugins/chart"

import store from "./store";

const app = createApp(App)

const auth = localStorage.getItem('AUTH');
if (auth) {
    store.replaceState(JSON.parse(auth));
}

app.use(router).mount('#app')
app.use(store)
app.use(VueCookies, {
    expireTimes: '7d', // Default expiration time for cookies

    path: '/', // Default path for cookies
    domain: '', // Default domain for cookies
    secure: false // Default secure setting for cookies
})

app.component("Popper", Popper);
app.use(Toast,
    {
        position: "top-right",
        timeout: 2036,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: true,
        hideProgressBar: true,
        closeButton: "button",
        icon: true,
        rtl: false,
        transition: "Vue-Toastification__fade",
        maxToasts: 20,
        newestOnTop: false,
        filterBeforeCreate: (toast, toasts) => {
            if (toasts.filter(
                t => t.type === toast.type
            ).length !== 0) {
                // Returning false discards the toast
                return false;
            }
            // You can modify the toast if you want
            return toast;
        }
    }
)
import 'bootstrap/dist/js/bootstrap.js'