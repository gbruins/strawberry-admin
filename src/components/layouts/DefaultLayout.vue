<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
    LayoutDashboardIcon,
    ShoppingCartIcon,
    ClockIcon,
    BookOpenIcon,
    PizzaIcon,
    TagIcon,
    MapPinIcon,
    BadgePercentIcon,
    MailIcon,
    LogOutIcon,
    ChevronsUpDownIcon,
    StoreIcon,
    ChefHatIcon
} from '@lucide/vue';
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarInset,
    SidebarTrigger,
    SidebarRail
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app.js';
import { supabase } from '@/plugins/supabase';
import useBroadcastChannels from '@/composables/useBroadcastChannels';

const { t } = useI18n();
const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const { getLogoutChannel } = useBroadcastChannels();

const navItems = [
    { name: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
    { name: 'carts', label: 'Carts', icon: ShoppingCartIcon },
    { name: 'services', label: 'Service', icon: ClockIcon },
    { name: 'menus', label: 'Menus', icon: BookOpenIcon },
    { name: 'products', label: 'Products', icon: PizzaIcon },
    { name: 'product_types', label: 'Product types', icon: TagIcon },
    { name: 'allowed_streets', label: 'Allowed streets', icon: MapPinIcon },
    { name: 'address_discounts', label: 'Address discounts', icon: BadgePercentIcon },
    { name: 'subscribers', label: 'Subscribers', icon: MailIcon },
    { name: 'kitchen_stations', label: 'Kitchen stations', icon: ChefHatIcon },
    { name: 'tenant_address', label: 'Store address', icon: StoreIcon }
];

function onLogout() {
    appStore.clearSession();
    router.push({ name: 'login' });
}

async function logout() {
    try {
        await supabase.auth.signOut();
    }
    catch (error) {
        console.error('Failed to sign out of Supabase', error);
    }
    finally {
        onLogout();
    }
}

// Closed on unmount — an open BroadcastChannel keeps its onmessage handler alive even after
// this component unmounts, so without this a transient mount (e.g. the brief pre-navigation
// paint before the router's initial route resolves) would leave a listener that fires forever
// for the rest of the tab's life, including on routes that never mount this layout again.
let logoutChannel = null;

onMounted(() => {
    logoutChannel = getLogoutChannel();

    logoutChannel.onmessage = (event) => {
        if (event.data?.type === 'logout') {
            onLogout();
        }
    };
});

onUnmounted(() => {
    logoutChannel?.close();
    logoutChannel = null;
});
</script>

<template>
    <SidebarProvider>
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" as-child>
                            <RouterLink :to="{ name: 'products' }">
                                <PizzaIcon class="size-5" />
                                <span class="font-semibold">Strawberry Pizza</span>
                            </RouterLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem v-for="item in navItems" :key="item.name">
                                <SidebarMenuButton
                                    as-child
                                    :is-active="route.name === item.name"
                                    :tooltip="t(item.label)">
                                    <RouterLink :to="{ name: item.name }">
                                        <component :is="item.icon" />
                                        <span>{{ t(item.label) }}</span>
                                    </RouterLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarRail />
        </Sidebar>

        <SidebarInset>
            <header class="flex items-center justify-between gap-2 border-b px-4 py-3">
                <div class="flex items-center gap-2">
                    <SidebarTrigger />
                    <div id="layout-header-title"></div>
                </div>

                <DropdownMenu v-if="appStore.loggedInUser">
                    <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="sm">
                            {{ appStore.loggedInUser }}
                            <ChevronsUpDownIcon class="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="logout">
                            <LogOutIcon />
                            {{ t('Logout') }}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <div class="p-4 md:p-6">
                <slot />
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>

<style>
.group\/menu-item a {
    text-decoration: none;
    color: var(--color-gray-600)
}
</style>
