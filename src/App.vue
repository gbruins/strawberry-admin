<script setup lang="ts">
import { watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import FigToaster from '@/components/figleaf/toast/Toaster.vue';
import FigSvgSprite from '@/components/figleaf/svgIcon/SvgSprite.vue';
import useToast from '@/components/figleaf/toast/useToast';

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
    <fig-svg-sprite />
    <fig-toaster :max-toasts="10" />

    <component :is="$route.meta.layout || DefaultLayout">
        <template #default>
            <router-view />
        </template>
    </component>
</template>
