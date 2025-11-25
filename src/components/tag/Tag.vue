<script>
export default {
    name: 'Tag'
}
</script>

<script setup>
import { computed } from 'vue';
import { tagVariants, tagSizes } from './constants';

const props = defineProps({
    tag: {
        type: String,
        default: 'span'
    },

    variant: {
        type: String,
        default: tagVariants.light,
        validator: (value) => Object.keys(tagVariants).includes(value)
    },

    size: {
        type: String,
        default: tagSizes.sm,
        validator: (value) => Object.keys(tagSizes).includes(value)
    }
});

const classNames = computed(() => {
    return {
        'fig-tag': true,
        'fig-tag-success': props.variant === tagVariants.success,
        'fig-tag-info': props.variant === tagVariants.info,
        'fig-tag-error': props.variant === tagVariants.error,
        'fig-tag-warning': props.variant === tagVariants.warning,
        'fig-tag-dark': props.variant === tagVariants.dark,
        'fig-tag-light': props.variant === tagVariants.light,
        'fig-tag-size-sm': props.size === tagSizes.sm,
        'fig-tag-size-lg': props.size === tagSizes.lg
    };
});
</script>

<template>
    <component :is="tag" :class="classNames">
        <slot></slot>
    </component>
</template>


<style scoped>
.fig-tag {
    font-weight: 500;
    border-radius: 0.75rem;
}
.fig-tag-info {
    color: var(--color-blue-900);
    background-color: var(--color-blue-200);
}
.fig-tag-success {
    color: var(--color-emerald-900);
    background-color: var(--color-emerald-200);
}
.fig-tag-error {
    color: var(--color-red-900);
    background-color: var(--color-red-200);
}
.fig-tag-warning {
    color: var(--color-amber-900);
    background-color: var(--color-amber-300);
}
.fig-tag-dark {
    color: var(--color-white);
    background-color: var(--color-gray-900);
}
.fig-tag-light {
    color: var(--color-gray-700);
    background-color: var(--color-gray-200);
}

.fig-tag-size-sm {
    font-size: var(--font-size-xs);
    padding: 2px 8px;
}
.fig-tag-size-lg {
    font-size: var(--font-size-sm);
    padding: 4px 8px;
}
</style>
