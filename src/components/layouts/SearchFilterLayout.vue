<script setup lang="ts">
import Overlay from '@/components/Overlay.vue';

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
            <Overlay :show="props.loading">
                <slot />
            </Overlay>
        </div>
    </div>
</template>
