import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
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

export default router
