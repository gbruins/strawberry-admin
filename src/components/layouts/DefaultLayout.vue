<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { LogOutIcon, ChevronsUpDownIcon, PizzaIcon } from '@lucide/vue';
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
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
import { useAppStore } from '@/stores/app';
import { NAV_GROUPS } from '@/config/navigation';
import { getLogoutChannel, type LogoutMessage } from '@/utils/broadcast';

const { t } = useI18n();
const appStore = useAppStore();
const router = useRouter();
const route = useRoute();

async function logout() {
    await appStore.logout();
    router.push({ name: 'login' });
}

// Another tab (or this tab's own 401 handler, see plugins/api.js) logged out. Closed on unmount
// — an open BroadcastChannel keeps its handler alive after the component is gone, so a transient
// mount would otherwise leave a listener firing for the rest of the tab's life.
let logoutChannel: BroadcastChannel | null = null;

onMounted(() => {
    logoutChannel = getLogoutChannel();

    logoutChannel.onmessage = (event: MessageEvent<LogoutMessage>) => {
        if (event.data?.type === 'logout') {
            appStore.clearSession();
            router.push({ name: 'login' });
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
                            <RouterLink :to="{ name: 'dashboard' }" class="no-underline">
                                <PizzaIcon class="size-5" />
                                <span class="font-semibold truncate">{{ appStore.tenantName || t('Admin') }}</span>
                            </RouterLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup v-for="(group, idx) in NAV_GROUPS" :key="group.label ?? idx">
                    <SidebarGroupLabel v-if="group.label">{{ t(group.label) }}</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem v-for="item in group.items" :key="item.name">
                                <SidebarMenuButton
                                    as-child
                                    :is-active="route.name === item.name"
                                    :tooltip="t(item.label)">
                                    <RouterLink :to="{ name: item.name }" class="no-underline">
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
