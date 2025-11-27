<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import { useAppStore } from '@/stores/app.js';
import FigSvgIcon from '@/components/figleaf/svgIcon/SvgIcon.vue';
import FigDropdown from '@/components/figleaf/dropdown/Dropdown.vue';
import FigDropdownButton from '@/components/figleaf/dropdown/DropdownButton.vue';
import FigButton from '@/components/figleaf/button/Button.vue';
import useApi from '@/composables/useApi';
import useBroadcastChannels from '@/composables/useBroadcastChannels';

const $apiLogout = useApi('auth.logout');
const appStore = useAppStore();
const router = useRouter();
const { getLogoutChannel } = useBroadcastChannels();

const sidebarOpened = ref(true);

function toggleSidebar() {
    sidebarOpened.value = !sidebarOpened.value;
}

function onUserMenuSelected(value) {
    if (value === 'logout') {
        logout();
    }
}

function onLogout() {
    appStore.loggedInUser = null;
    router.push({ name: 'login' });
}

function logout() {
    return $apiLogout.tryCatch(
        async () => {
            await $apiLogout.run();
            onLogout();
        }
    );
}

onMounted(() => {
    const logoutChannel = getLogoutChannel();

    logoutChannel.onmessage = (event) => {
        // console.log('Received message on logout channel:', event.data);
        if (event.data?.type === 'logout') {
            onLogout();
        }
    };
});
</script>

<template>
    <div class="flex min-h-screen relative text-sm">
        <aside
            class="text-gray-700 w-48 inset-y-0 left-0 transform transition duration-200 ease-in-out z-10 relative border-r border-gray-300 shrink-0"
            :class="{'layout-sidenav-opened': sidebarOpened, 'layout-sidenav-closed': !sidebarOpened}"
            style="background: #f3f4f6;">

            <div class="layout-sidenav-toggle" @click="toggleSidebar"></div>

            <div class="layout-sidenav-content">
                <div class="layout-sidenav-header">
                    <!-- logo -->
                    <router-link  :to="{ name: 'products' }">Strawberry Pizza</router-link >
                </div>

                <div class="grow px-2">
                    <router-link
                        class="nav-item-main"
                        active-class="nav-item-main--active"
                        :to="{ name: 'dashboard' }">{{ $t('Dashboard') }}</router-link>

                    <router-link
                        class="nav-item-main"
                        active-class="nav-item-main--active"
                        :to="{ name: 'products' }">{{ $t('Products') }}</router-link>

                    <router-link
                        class="nav-item-main"
                        active-class="nav-item-main--active"
                        :to="{ name: 'product_types' }">{{ $t('Product types') }}</router-link>

                    <router-link
                        class="nav-item-main"
                        active-class="nav-item-main--active"
                        :to="{ name: 'allowed_streets' }">{{ $t('Allowed streets') }}</router-link>

                    <router-link
                        class="nav-item-main"
                        active-class="nav-item-main--active"
                        :to="{ name: 'address_discounts' }">{{ $t('Address discounts') }}</router-link>
                </div>

                <!-- sidenav footer -->
                <div class="flex items-center p-2" :class="{'justify-center': !sidebarOpened, 'justify-end': sidebarOpened}">
                    <button
                        class="layout-sidenav-toggle-button"
                        @click="toggleSidebar">
                        <fig-svg-icon
                            :icon="sidebarOpened ? 'chevrons-left': 'chevrons-right'"
                            :width="30"
                            :height="30"
                            :stroke-width="1.5" />
                    </button>
                </div>
            </div>
        </aside>

        <div
            class="layout-sidenav-overlay"
            v-if="sidebarOpened"
            @click="toggleSidebar"></div>


        <!-- main content -->
        <div class="main-content">
            <!-- header -->
            <header class="layout-header">
                <div id="layout-header-title"></div>
                <div>
                    <fig-dropdown
                        v-if="appStore.loggedInUser"
                        @selected="onUserMenuSelected">
                        <template v-slot:toggler>
                            <fig-button
                                variant="ghost"
                                :uppercase="false"
                                size="sm">{{ appStore.loggedInUser }}</fig-button>
                        </template>
                        <fig-dropdown-button value="logout">{{ $t('Logout') }}</fig-dropdown-button>
                    </fig-dropdown>
                </div>
            </header>

            <div class="w-full">
                <div class="md:p-6 sm:p-4">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout-sidenav-toggle {
    flex-shrink: 0;
    width: 8px;
    position: absolute;
    border-left: 4px solid transparent;
    height: 100%;
    transition: border-color .2s ease 0s;
    cursor: ew-resize;
    right: -8px;
    top: 0;
    z-index: 1;
}
.layout-sidenav-toggle:hover {
    border-color: var(--color-blue-400);
}

.layout-sidenav-toggle-button {
    border-radius: var(--radius-sm);
    padding: 4px;
}
.layout-sidenav-toggle-button:hover {
    background-color: var(--color-gray-200);
}

.layout-sidenav-header {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(243, 244, 246, 0.4);
    margin-bottom: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    height: 48px;
}

.layout-sidenav-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
}

.layout-sidenav-overlay {
    position: fixed;
    inset: 0;
    background-color: var(--color-gray-500);
    opacity: 0.5;  /* background opacity? */
    transition: opacity 0.2s ease-in-out;
}

.layout-sidenav-opened {
    position: absolute;
    transform: translateX(0);
}

@media (min-width: 768px) {
    .layout-sidenav-overlay {
        display: none;
    }

    .layout-sidenav-opened {
        position: relative;
    }
}

.layout-sidenav-closed {
    transform: translateX(-94%);
    position: absolute
}

.layout-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
}

.nav-item-main {
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    text-decoration: none;
    color: var(--color-gray-700);
    display: block;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
}
.nav-item-main:hover {
    background-color: var(--color-gray-200);
}
.nav-item-main--active {
    background-color: var(--color-blue-100);
    color: var(--color-blue-700);
    font-weight: 700 !important;
}

.main-content {
    flex-grow: 1;
    padding-bottom: 80px;
}
</style>
