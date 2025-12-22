<script>
export default {
    name: 'TextCard'
}
</script>

<script setup>
import { computed, useSlots } from 'vue';
import { textCardVariants } from './constants';

const props = defineProps({
    variant: {
        type: String,
        default: textCardVariants.light,
        validator: (value) => Object.keys(textCardVariants).includes(value)
    },

    shadow: {
        type: Boolean
    },

    showBody: {
        type: Boolean,
        default: true
    },

    border: {
        type: Boolean,
        default: false
    }
});

const slots = useSlots();

const sectionClasses = computed(() => {
    return {
        'fig-text-card': true,
        'shadow': props.shadow,
        'border border-gray-200': props.border,
        [`fig-text-card-${props.variant}`]: true
    }
});
</script>


<template>
    <section :class="sectionClasses">
        <header
            v-if="slots['header_left'] || slots['header_right']"
            class="fig-text-card-header">
            <div v-if="slots['header_left']" class="flex items-center grow"><slot name="header_left" /></div>
            <div v-if="slots['header_right']" class="flex items-center"><slot name="header_right" /></div>
        </header>
        <div v-if="showBody" class="p-3 bg-white"><slot /></div>
    </section>
</template>


<style scoped>
.fig-text-card {
    padding: 0;
    border-radius: 0.125rem;
}

.fig-text-card-header {
    display: flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
}

.fig-text-card-dark .fig-text-card-header {
    background-color: var(--color-gray-700);
    color: var(--color-white);
}
.fig-text-card-light .fig-text-card-header {
    background-color: var(--color-gray-200);
    color: var(--color-gray-800)
}
.fig-text-card-white .fig-text-card-header {
    background-color: var(--color-white);
    color: var(--color-gray-800);
    border-bottom: 1px solid var(--color-gray-200);
}
</style>
