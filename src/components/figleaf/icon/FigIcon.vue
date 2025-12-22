<script>
export default {
    name: 'FIcon'
}
</script>

<script setup>
import { computed } from 'vue';
import {
    figIconVariants,
    figIconStrokeColors
 } from './constants.js';

const props = defineProps({
    icon: {
        type: String,
        required: true
    },

    variant: {
        type: String,
        default: null,
        validator: (value) => Object.keys(figIconVariants).includes(value)
    },

    spin: {
        type: Boolean,
        default: false
    },

    strokeWidth: {
        type: [String, Number],
        default: '1.5'
    },

    strokeLinecap: {
        type: String,
        default: null
    },

    strokeLinejoin: {
        type: String,
        default: null
    },

    stroke: {
        type: String,
        default: null
    },

    width: {
        type: [String, Number],
        default: 20
    },

    height: {
        type: [String, Number],
        default: 20
    }
});

const classes = computed(() => {
    return {
        'icon-spin': props.spin
    };
});

const strokeColor = computed(() => {
    if(props.stroke) {
        return props.stroke;
    }

    if(props.variant) {
        return figIconStrokeColors[props.variant];
    }

    return figIconStrokeColors.default;
});
</script>


<template>
    <svg
        :class="classes"
        :width="props.width"
        :height="props.height"
        :stroke-linecap="props.strokeLinecap"
        :stroke-linejoin="props.strokeLinejoin"
        :stroke-width="props.strokeWidth"
        :stroke="strokeColor"
        fill="none"
        aria-hidden="true"
        role="presentation"
        focusable="false">
        <use :xlink:href="`#${props.icon}`"></use>
    </svg>
</template>


<style scoped>
.icon-spin {
    animation: spin 1s linear infinite;
}
</style>
