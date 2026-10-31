<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from '@/stores/app.js';
import { useRouter } from 'vue-router';
import { supabase } from '@/plugins/supabase';

const appStore = useAppStore();
const router = useRouter();

async function logout() {
    try {
        await supabase.auth.signOut();
    }
    catch (error) {
        console.error('Failed to sign out of Supabase', error);
    }
    finally {
        appStore.clearSession();
        router.push({ name: 'login' });
    }
}

onMounted(() => {
    logout();
});
</script>

<template>
</template>
