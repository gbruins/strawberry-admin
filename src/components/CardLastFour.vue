<script setup>
import { computed } from 'vue';
import { CreditCardIcon } from '@lucide/vue';

const props = defineProps({
    type: {
        type: String
    },

    lastFour: {
        type: [String, Number]
    }
});

const brandLabel = computed(() => {
    if (!props.type) {
        return '';
    }

    return props.type.charAt(0).toUpperCase() + props.type.slice(1);
});

const suffix = computed(() => {
    return props.lastFour ? `**** ${props.lastFour}` : '';
});
</script>

<template>
    <div class="flex items-center gap-2">
        <CreditCardIcon class="size-6 text-muted-foreground" />
        <div>{{ brandLabel }} {{ suffix }}</div>
    </div>
</template>
