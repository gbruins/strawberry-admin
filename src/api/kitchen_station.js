// Not utils.makeCruds() — there's no generic update/read-by-id on the server (server/plugins/
// kitchen/index.js), just create/search/rotate-pin/revoke (owner-facing).
export default (utils) => {
    return {
        search: (params, config) => utils.$get('/kitchen/stations', params, config),
        create: (data) => utils.$post('/kitchen/stations', data),
        rotatePin: (data) => utils.$put('/kitchen/stations/rotate-pin', data),
        revoke: (id) => utils.$delete('/kitchen/stations', { id })
    };
};
