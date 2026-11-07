import type { ApiUtils, Params } from './types';

// Not utils.makeCruds() — these aren't CRUD operations on one resource, they're the kitchen
// station's own session/ticket actions (server/plugins/kitchen/index.js on strawberry-server).
export default (utils: ApiUtils) => {
    return {
        login: (data: Params) => utils.$post('/kitchen/session', data),
        verifyPin: (data: Params) => utils.$post('/kitchen/session/verify-pin', data),
        refresh: () => utils.$post('/kitchen/session/refresh'),
        tickets: () => utils.$get('/kitchen/tickets'),
        updateStatus: (data: Params) => utils.$put('/cart/kitchen-status', data)
    };
};
