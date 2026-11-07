<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { round } from '@/utils/number';

const props = withDefaults(defineProps<{
    value?: number | string | null;
    /** A numberFormats key from plugins/i18n (decimal, currency, percent). */
    format?: string;
    /** Intl.NumberFormat overrides. */
    config?: Intl.NumberFormatOptions;
    /** Round to this many decimals before formatting. */
    decimals?: number;
    emptyDisplay?: string;
}>(), {
    format: 'decimal',
    config: () => ({}),
    emptyDisplay: ''
});

const { n } = useI18n();

const numericValue = computed(() => {
    const parsed = typeof props.value === 'number' ? props.value : parseFloat(props.value ?? '');
    return Number.isFinite(parsed) ? parsed : null;
});

const label = computed(() => {
    if (numericValue.value === null) {
        return props.emptyDisplay;
    }

    const value = props.decimals === undefined ? numericValue.value : round(numericValue.value, props.decimals);
    return n(value, { key: props.format, ...props.config });
});
</script>

<template>
    <span :class="{ 'text-muted-foreground': !numericValue }">{{ label }}</span>
</template>
