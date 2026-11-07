export interface AdminOrderNote {
    created_at: string;
    note: string | null;
}

export interface CartItem {
    qty: number;
    price_subtotal: number;
    product: { title: string, description?: string | null, base_price: number };
}

/** A `carts` row as returned by the admin cart endpoints (see strawberry-server CartModel). */
export interface Cart {
    id: string;
    created_at: string;
    closed_at: string | null;
    pickup_code: string | null;
    grand_total: number | null;
    price_subtotal: number | null;
    sales_tax: number | null;
    num_items?: number | null;
    customer_note?: string | null;
    admin_order_notes?: AdminOrderNote[] | null;
    stripe_payment_intent_id?: string | null;
    cart_items?: CartItem[];
    // billing_* columns are read through utils/address billingAddress()
    [key: string]: unknown;
}
