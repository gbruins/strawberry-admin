import type { AxiosRequestConfig } from 'axios';
import type { ApiUtils } from './types';

export default (utils: ApiUtils) => {
    return {
        ...utils.makeCruds('carts', 'cart'),

        notes: {
            update: (id: string, notes: unknown[], config?: AxiosRequestConfig) => {
                return utils.$put(
                    'cart/notes',
                    {
                        id,
                        admin_order_notes: notes
                    },
                    config
                );
            }
        }
    }
}
