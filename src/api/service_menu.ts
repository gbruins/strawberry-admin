import type { AxiosRequestConfig } from 'axios';
import type { ApiUtils } from './types';

export default (utils: ApiUtils) => {
    return {
        ...utils.makeCruds('service_menus', 'service_menu'),

        getProducts: (id: string, config?: AxiosRequestConfig) => {
            return utils.$get('service_menu/products', { id }, config);
        },

        setProducts: (id: string, productIds: string[], config?: AxiosRequestConfig) => {
            return utils.$put('service_menu/products', { product_ids: productIds }, { ...config, params: { id } });
        },

        usage: (id: string, config?: AxiosRequestConfig) => {
            return utils.$get('service_menu/usage', { id }, config);
        }
    }
}
