import type { Component } from 'vue';
import {
    LayoutDashboardIcon,
    ShoppingCartIcon,
    ClockIcon,
    BookOpenIcon,
    PizzaIcon,
    TagIcon,
    MailIcon,
    StoreIcon,
    ChefHatIcon
} from '@lucide/vue';

export interface NavItem {
    /** Route name */
    name: string;
    /** i18n key */
    label: string;
    icon: Component;
}

export interface NavGroup {
    /** i18n key; omit for an unlabeled group */
    label?: string;
    items: NavItem[];
}

/** The owner sidebar (DefaultLayout), grouped by what the owner is doing. */
export const NAV_GROUPS: NavGroup[] = [
    {
        items: [
            { name: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon }
        ]
    },
    {
        label: 'Operations',
        items: [
            { name: 'carts', label: 'Carts', icon: ShoppingCartIcon },
            { name: 'services', label: 'Service', icon: ClockIcon }
        ]
    },
    {
        label: 'Catalog',
        items: [
            { name: 'menus', label: 'Menus', icon: BookOpenIcon },
            { name: 'products', label: 'Products', icon: PizzaIcon },
            { name: 'product_types', label: 'Product types', icon: TagIcon }
        ]
    },
    {
        label: 'Customers',
        items: [
            { name: 'subscribers', label: 'Subscribers', icon: MailIcon }
        ]
    },
    {
        label: 'Settings',
        items: [
            { name: 'tenant_address', label: 'Store address', icon: StoreIcon },
            { name: 'kitchen_stations', label: 'Kitchen stations', icon: ChefHatIcon }
        ]
    }
];
