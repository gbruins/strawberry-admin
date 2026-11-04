export default (utils) => {
    return {
        ...utils.makeCruds('subscribers', 'subscriber'),

        count: () => utils.$get('subscribers/count')
    }
}
