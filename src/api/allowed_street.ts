import type { ApiUtils } from './types';

export default (utils: ApiUtils) => {
    return {
        ...utils.makeCruds('allowed_streets', 'allowed_street')
    }
}
