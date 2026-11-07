import type { ApiUtils } from './types';

export default (utils: ApiUtils) => {
    return {
        ...utils.makeCruds('product_types', 'product_type')
    }
}
