export default (utils) => {
    return {
        get: () => utils.$get('/tenant'),
        updateAddress: (data) => utils.$put('/tenant/address', data)
    };
};
