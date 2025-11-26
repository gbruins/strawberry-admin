import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/router';
import { i18n } from '@/plugins/i18n';
import apiPlugin from '@/plugins/api';
import configPlugin from '@/plugins/config';

const app = createApp(App)

app.use(createPinia());
app.use(router);
app.use(i18n());
app.use(apiPlugin);
app.use(configPlugin);

app.mount('#app');
