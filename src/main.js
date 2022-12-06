// Vue
import { createApp } from 'vue';
import App from '@/App.vue';

// State Management
import { createPinia } from 'pinia';

// Router
import router from '@/router';

// Axios
import VueAxios from 'vue-axios';
import axiosInstance from '@/api/axiosInstance';

// Style
import '@/style.css';

// Languages
import i18n from '@/locales/i18n';

// Motion
import { MotionPlugin } from '@vueuse/motion';

// Sweet Alert
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
};

import { VueSignalR } from '@dreamonkey/vue-signalr';
import { HubConnectionBuilder } from '@microsoft/signalr';

const connection = new HubConnectionBuilder()
  .withUrl('https://localhost:7219/Notify')
  .build();

const app = createApp(App);
app.use(MotionPlugin);
app.use(createPinia());
app.use(router);
app.use(VueSignalR, { connection });
app.use(i18n);
app.use(VueAxios, axiosInstance);
app.use(VueSweetalert2, options);
app.provide('axios', app.config.globalProperties.axios);
app.mount('#app');
