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

// Wait for the router's initial navigation to resolve before mounting — otherwise App.vue's
// first paint uses the pre-navigation route (meta.layout still undefined), which briefly mounts
// DefaultLayout even on a kitchen route. DefaultLayout's logout-broadcast listener then outlives
// that one-tick mount and fires on any later unrelated 401, bouncing a kitchen tablet to the
// owner's /login (strawberry-admin/CLAUDE.md: the two auth domains must never cross). configPlugin
// fetches owner-only data, so it's skipped entirely once we know we're on a kitchen route.
router.isReady().then(() => {
    if (!router.currentRoute.value.path.startsWith('/kitchen')) {
        app.use(configPlugin);
    }

    app.mount('#app');
});
