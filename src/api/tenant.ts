import type { ApiUtils, Params } from './types';

export default (utils: ApiUtils) => {
    return {
        get: () => utils.$get('/tenant'),
        updateAddress: (data: Params) => utils.$put('/tenant/address', data)
    };
};
