export default (utils) => {
    return {
        search: (params, config) => {
            return utils.$get('product_types', params, config);
        },

        get: (id, config) => {
            return utils.$get('product_type', { id }, config);
        },

        create: (data, config) => {
            return utils.$post('product_type', data, config);
        },

        update: (id, data, config) => {
            return utils.$put('product_type', { id, ...data }, config);
        },

        delete: (id, config) => {
            return utils.$delete('product_type', { id }, config);
        }
    }
}
