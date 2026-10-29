<script setup>
import { Loader2Icon } from '@lucide/vue';

defineProps({
    show: {
        type: Boolean,
        default: false
    }
});
</script>


<template>
    <div :class="{ relative: show }">
        <slot />

        <div
            v-if="show"
            class="absolute inset-0 flex items-center justify-center bg-muted/75 backdrop-blur-[2px]">
            <Loader2Icon class="size-8 animate-spin text-primary" />
        </div>
    </div>
</template>
