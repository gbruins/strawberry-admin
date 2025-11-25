<script>
export default {
    name: 'FormGroup'
}
</script>

<script setup>
import { computed, useSlots } from 'vue';

const props = defineProps({
    stacked: {
        type: Boolean,
        default: true
    },

    isButton: {
        type: Boolean,
        default: false
    }
});

const slots = useSlots();

const containerClasses = computed(() => {
    return [
        'fig-form-group',
        props.stacked ? 'flex-col' : 'flex-row'
    ];
});

const canShowLabel = computed(() => {
    return slots.label || props.isButton;
});

const labelClasses = computed(() => {
    const classes = ['fig-form-group-label'];

    if(!props.stacked) {
        classes.push('pr-2');
    }

    return classes;
});
</script>


<template>
    <div
        role="group"
        class="flex"
        :class="containerClasses">
        <label
            v-if="canShowLabel"
            :class="labelClasses">
            <slot name="label">&nbsp;</slot>
        </label>

        <template v-if="!isButton">
            <slot></slot>

            <div
                v-if="$slots.error"
                class="text-red-600 pt-1 text-sm"
                tabindex="-1"
                role="alert"
                aria-live="assertive"><slot name="error" /></div>

            <div
                v-if="$slots.description"
                class="text-gray-500 pt-1 text-sm"
                tabindex="-1"><slot name="description" /></div>
        </template>
    </div>
</template>


<style scoped>
.fig-form-group {
    @apply relative;
}

.fig-form-group-label {
    @apply text-left block relative;
}
</style>
