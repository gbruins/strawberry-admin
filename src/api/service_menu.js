export default (utils) => {
    return {
        ...utils.makeCruds('service_menus', 'service_menu'),

        getProducts: (id, config) => {
            return utils.$get('service_menu/products', { id }, config);
        },

        setProducts: (id, productIds, config) => {
            return utils.$put('service_menu/products', { product_ids: productIds }, { ...config, params: { id } });
        },

        usage: (id, config) => {
            return utils.$get('service_menu/usage', { id }, config);
        }
    }
}
