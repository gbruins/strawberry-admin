import type { ApiUtils } from './types';

export default (utils: ApiUtils) => {
    return {
        ...utils.makeCruds('subscribers', 'subscriber'),

        count: () => utils.$get('subscribers/count')
    }
}
