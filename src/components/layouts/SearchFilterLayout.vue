<script setup lang="ts">
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <div class="grid grid-cols-1 gap-5">
        <div v-if="$slots.filters">
            <slot name="filters" />
        </div>

        <div>
            <fig-overlay :show="props.loading">
                <slot />
            </fig-overlay>
        </div>
    </div>
</template>
