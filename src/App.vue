<script setup lang="ts">
import { watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import Toaster from '@/components/toast/Toaster.vue';
import SvgSprite from '@/components/svgIcon/SvgSprite.vue';
import useToast from '@/components/toast/useToast';

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
    <svg-sprite />
    <toaster :max-toasts="10" />

    <component :is="$route.meta.layout || DefaultLayout">
        <template #default>
            <router-view />
        </template>
    </component>
</template>
