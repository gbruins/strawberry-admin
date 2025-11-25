export default (utils) => {
    return {
        ...utils.makeCruds('product_types', 'product_type')
    }
}
