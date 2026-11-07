import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { useKitchenStationStore } from '@/stores/kitchenStation';
import BlankLayout from '@/components/layouts/BlankLayout.vue';
import KitchenLayout from '@/components/layouts/KitchenLayout.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/pages/DashboardPage.vue'),
        },

        {
            path: '/subscribers',
            name: 'subscribers',
            component: () => import('@/pages/SubscribersPage.vue'),
        },

        {
            path: '/login',
            name: 'login',
            meta: { layout: BlankLayout },
            component: () => import('@/pages/LoginPage.vue'),
        },

        {
            path: '/logout',
            name: 'logout',
            meta: { layout: BlankLayout },
            component: () => import('@/pages/LogoutPage.vue'),
        },

        {
            path: '/forgot-password',
            name: 'forgot_password',
            meta: { layout: BlankLayout },
            component: () => import('@/pages/ForgotPasswordPage.vue'),
        },

        {
            path: '/reset-password',
            name: 'reset_password',
            meta: { layout: BlankLayout },
            component: () => import('@/pages/ResetPasswordPage.vue'),
        },

        {
            path: '/carts',
            name: 'carts',
            component: () => import('@/pages/CartsPage.vue'),
        },

        {
            path: '/cart/:id',
            name: 'cart',
            component: () => import('@/pages/CartPage.vue'),
        },

        {
            path: '/products',
            name: 'products',
            component: () => import('@/pages/ProductsPage.vue'),
        },

        {
            path: '/product-types',
            name: 'product_types',
            component: () => import('@/pages/ProductTypesPage.vue'),
        },

        {
            path: '/menus',
            name: 'menus',
            component: () => import('@/pages/MenusPage.vue'),
        },

        {
            path: '/services',
            name: 'services',
            component: () => import('@/pages/ServicesPage.vue'),
        },

        {
            path: '/settings/store-address',
            name: 'tenant_address',
            component: () => import('@/pages/TenantAddressPage.vue'),
        },

        {
            path: '/settings/kitchen-stations',
            name: 'kitchen_stations',
            component: () => import('@/pages/KitchenStationsPage.vue'),
        },

        // Kitchen Display System — a completely separate, non-Supabase auth domain (shared
        // station PIN login), always using KitchenLayout (full-screen, no sidebar) instead of
        // DefaultLayout. See the early branch in beforeEach below.
        {
            path: '/kitchen/login',
            name: 'kitchen_login',
            meta: { layout: KitchenLayout },
            component: () => import('@/pages/KitchenLoginPage.vue'),
        },

        {
            path: '/kitchen/board',
            name: 'kitchen_board',
            meta: { layout: KitchenLayout },
            component: () => import('@/pages/KitchenBoardPage.vue'),
        },
    ]
})


// Global navigation guard for authentication
router.beforeEach(async (to, from, next) => {
    // Kitchen station auth is a completely separate domain from the owner's Supabase session
    // below (strawberry-admin/CLAUDE.md) — it must never fall through to appStore/Supabase
    // logic, and a missing/expired station session must redirect to kitchen_login, never the
    // owner's /login.
    if (to.path.startsWith('/kitchen')) {
        if (to.name === 'kitchen_login') {
            return next();
        }

        const kitchenStore = useKitchenStationStore();

        if (!kitchenStore.stationSessionToken) {
            return next({ name: 'kitchen_login' });
        }

        return next();
    }

    const appStore = useAppStore();

    // List of routes that don't require auth
    const publicPages = ['login', 'forgot_password', 'reset_password'];
    const authRequired = !publicPages.includes(String(to.name));

    if (!authRequired) {
        return next();
    }

    // In-memory Pinia state is lost on a hard refresh; Supabase's own client persists the
    // session in localStorage, so restore from there before deciding (idempotent — see
    // stores/app.js's restoreSession, safe to call on every navigation).
    if (!appStore.loggedInUser) {
        await appStore.restoreSession();
    }

    if (!appStore.loggedInUser) {
        return next({ name: 'login' });
    }

    next();
});

export default router
