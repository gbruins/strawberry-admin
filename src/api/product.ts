import type { ApiUtils } from './types';

export default (utils: ApiUtils) => {
    return {
        ...utils.makeCruds('products', 'product')
    }
}
