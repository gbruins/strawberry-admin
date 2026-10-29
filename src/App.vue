<script setup lang="ts">
import { watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import { Toaster } from '@/components/ui/sonner';
import useToast from '@/composables/useToast';

const route = useRoute();
const { removeAllToasts } = useToast();

watch(
    () => route?.path,
    () => {
        removeAllToasts();
    }
);
</script>

<template>
    <Toaster rich-colors />

    <component :is="$route.meta.layout || DefaultLayout">
        <template #default>
            <router-view />
        </template>
    </component>
</template>
