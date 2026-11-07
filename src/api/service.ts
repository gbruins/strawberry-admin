import type { AxiosRequestConfig } from 'axios';
import type { ApiUtils } from './types';

export default (utils: ApiUtils) => {
    return {
        ...utils.makeCruds('services', 'service'),

        // The service's menu products and whether each is in stock for that service
        getAvailability: (id: string, config?: AxiosRequestConfig) => {
            return utils.$get('service/availability', { id }, config);
        },

        setAvailability: (id: string, unavailableProductIds: string[], config?: AxiosRequestConfig) => {
            return utils.$put('service/availability', { id, unavailable_product_ids: unavailableProductIds }, config);
        }
    }
}
