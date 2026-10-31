import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores/app';
import BlankLayout from '@/components/layouts/BlankLayout.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/pages/DashboardPage.vue'),
        },

        {
            path: '/allowed-streets',
            name: 'allowed_streets',
            component: () => import('@/pages/AllowedStreetsPage.vue'),
        },

        {
            path: '/address-discounts',
            name: 'address_discounts',
            component: () => import('@/pages/AddressDiscountsPage.vue'),
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
    ]
})


// Global navigation guard for authentication
router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();

    // List of routes that don't require auth
    const publicPages = ['login', 'forgot_password', 'reset_password'];
    const authRequired = !publicPages.includes(to.name);

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
