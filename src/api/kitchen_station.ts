import type { AxiosRequestConfig } from 'axios';
import type { ApiUtils, Params } from './types';

// Not utils.makeCruds() — there's no generic update/read-by-id on the server (server/plugins/
// kitchen/index.js), just create/search/rotate-pin/revoke (owner-facing).
export default (utils: ApiUtils) => {
    return {
        search: (params?: Params, config?: AxiosRequestConfig) => utils.$get('/kitchen/stations', params, config),
        create: (data: Params) => utils.$post('/kitchen/stations', data),
        rotatePin: (data: Params) => utils.$put('/kitchen/stations/rotate-pin', data),
        revoke: (id: string) => utils.$delete('/kitchen/stations', { id })
    };
};
