<script setup lang="ts">
import { computed } from 'vue';

// Formats an integer number of cents as currency. Negative amounts (discounts, refunds) are
// shown as negative — they used to be clamped to $0.00.

const props = defineProps<{
    cents?: string | number | null;
}>();

const dollars = computed(() => {
    const value = typeof props.cents === 'number' ? props.cents : parseInt(props.cents ?? '', 10);
    return Number.isFinite(value) ? value / 100 : 0;
});
</script>

<template>
    <span>{{ $n(dollars, 'currency') }}</span>
</template>
