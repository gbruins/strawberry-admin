export default (utils) => {
    return {
        ...utils.makeCruds('services', 'service')
    }
}
