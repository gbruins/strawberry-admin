<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from '@/stores/app.js';
import { useRouter } from 'vue-router';
import useApi from '@/composables/useApi';

const $apiLogout = useApi('auth.logout');
const appStore = useAppStore();
const router = useRouter();

function logout() {
    return $apiLogout.tryCatch(
        async () => {
            const response = await $apiLogout.run();
            appStore.loggedInUser = null;
        }
    );
}

onMounted(() => {
    logout();
});
</script>

<template>
</template>
