export default (utils) => {
    return {
        ...utils.makeCruds('allowed_streets', 'allowed_street')
    }
}
