export interface Address {
    firstName?: string | null;
    lastName?: string | null;
    company?: string | null;
    streetAddress?: string | null;
    extendedAddress?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | number | null;
    countryCode?: string | null;
    email?: string | null;
    phone?: string | null;
}

/** The billing address stored as flat `billing_*` columns on a cart row. */
export function billingAddress(cart: Record<string, unknown> | null | undefined): Address {
    const field = (key: string) => (cart?.[key] ?? null) as string | null;

    return {
        firstName: field('billing_firstName'),
        lastName: field('billing_lastName'),
        company: field('billing_company'),
        streetAddress: field('billing_streetAddress'),
        extendedAddress: field('billing_extendedAddress'),
        city: field('billing_city'),
        state: field('billing_state'),
        zip: field('billing_postalCode'),
        countryCode: field('billing_countryCodeAlpha2')
    };
}
