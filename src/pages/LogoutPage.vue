<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const router = useRouter();

onMounted(async () => {
    await appStore.logout();
    router.push({ name: 'login' });
});
</script>

<template>
    <span class="sr-only">Signing out…</span>
</template>
