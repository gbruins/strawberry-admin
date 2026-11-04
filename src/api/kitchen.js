// Not utils.makeCruds() — these aren't CRUD operations on one resource, they're the kitchen
// station's own session/ticket actions (server/plugins/kitchen/index.js on strawberry-server).
export default (utils) => {
    return {
        login: (data) => utils.$post('/kitchen/session', data),
        verifyPin: (data) => utils.$post('/kitchen/session/verify-pin', data),
        refresh: () => utils.$post('/kitchen/session/refresh'),
        tickets: () => utils.$get('/kitchen/tickets'),
        updateStatus: (data) => utils.$put('/cart/kitchen-status', data)
    };
};
