export default (utils) => {
    return {
        ...utils.makeCruds('carts', 'cart'),

        notes: {
            update: (id, notes, config) => {
                return utils.$put(
                    'cart/notes',
                    {
                        id,
                        admin_order_notes: notes
                    },
                    config
                );
            }
        }
    }
}
