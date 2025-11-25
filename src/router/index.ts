import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
        {
            path: '/allowed-streets',
            name: 'allowed_streets',
            component: () => import('../views/AllowedStreetsView.vue'),
        },

        {
            path: '/address-discounts',
            name: 'address_discounts',
            component: () => import('../views/AddressDiscountsView.vue'),
        },

        {
            path: '/products',
            name: 'products',
            component: () => import('../views/ProductsView.vue'),
        },
        {
            path: '/product-types',
            name: 'product_types',
            component: () => import('../views/ProductTypesView.vue'),
        },
  ],
})

export default router
