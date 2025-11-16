export default (utils) => {
    return {
        ...utils.makeCruds('products', 'product')
    }
}
