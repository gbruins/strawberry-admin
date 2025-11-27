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
            path: '/products',
            name: 'products',
            component: () => import('@/pages/ProductsPage.vue'),
        },

        {
            path: '/product-types',
            name: 'product_types',
            component: () => import('@/pages/ProductTypesPage.vue'),
        },
    ]
})


// Global navigation guard for authentication
router.beforeEach((to, from, next) => {
    const appStore = useAppStore();

    // List of routes that don't require auth
    const publicPages = ['login'];
    const authRequired = !publicPages.includes(to.name);

    if (!authRequired) {
        return next();
    }

    // If not logged in, redirect to login
    // if (!appStore.loggedInUser) {
    //     return next({ name: 'login' });
    // }

    next();
});

export default router
