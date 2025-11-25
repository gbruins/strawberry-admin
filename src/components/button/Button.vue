<script>
export default {
    name: 'Button'
}
</script>

<script setup>
import { computed, useSlots } from 'vue';
import SvgIcon from '@/components/svgIcon/SvgIcon.vue';
import Spinner from '@/components/spinner/Spinner.vue';
import {
    buttonSizes,
    buttonVariants,
    buttonTypes
} from './constants';

const props = defineProps({
    size: {
        type: String,
        default: buttonSizes.md,
        validator: (value) => Object.keys(buttonSizes).includes(value)
    },

    variant: {
        type: String,
        default: buttonVariants.plain,
        validator: (value) => Object.keys(buttonVariants).includes(value)
    },

    type: {
        type: String,
        default: buttonTypes.button,
        validator: (value) => Object.keys(buttonTypes).includes(value)
    },

    loading: {
        type: Boolean,
        default: false
    },

    block: {
        type: Boolean,
        default: false
    },

    disabled: {
        type: Boolean,
        default: false
    },

    icon: {
        type: String,
        default: null
    },

    iconOnly: {
        type: Boolean,
        default: false
    },

    uppercase: {
        type: Boolean,
        default: true
    }
});

const slots = useSlots();

const isDisabled = computed(() => {
    return props.disabled || props.loading;
});

const classNames = computed(() => {
    return {
        'fig-button': true,
        'fig-button-xs': props.size === buttonSizes.xs,
        'fig-button-sm': props.size === buttonSizes.sm,
        'fig-button-md': props.size === buttonSizes.md,
        'fig-button-danger': props.variant === buttonVariants.danger,
        'fig-button-ghost': props.variant === buttonVariants.ghost,
        'fig-button-plain': props.variant === buttonVariants.plain,
        'fig-button-primary': props.variant === buttonVariants.primary,
        'fig-button-success': props.variant === buttonVariants.success,
        'block w-full': props.block,
        'align-bottom': props.icon,
        'fig-icon-button': props.iconOnly
    }
});

const iconStrokeColor = computed(() => {
    switch(props.variant) {
        case 'danger':
        case 'primary':
        case 'success':
            return '#fff';

        default:
            return '#565656';
    }
});
</script>


<template>
    <button
        :type="props.type"
        class="fig-button"
        :class="classNames"
        tabindex="0"
        :disabled="isDisabled"
        :aria-disabled="isDisabled">
        <div class="flex items-center gap-1">
            <div v-if="props.icon" class="shrink-0">
                <svg-icon
                    :icon="props.icon"
                    :stroke-width="1.5"
                    :stroke="iconStrokeColor"
                    :width="19"
                    :height="19"
                    :class="{'opacity-20': props.loading}" />
            </div>
            <div
                v-if="slots.default && !props.iconOnly"
                :class="{
                    'uppercase': props.uppercase,
                    'opacity-20': props.loading,
                    'flex justify-center w-full font-medium': true
                }"><slot></slot>
            </div>
            <div
                v-if="props.loading"
                class="absolute inset-0 flex items-center justify-center">
                <spinner
                    :color="iconStrokeColor"
                    :stroke-width="3"
                    :width="22" />
            </div>
        </div>
    </button>
</template>

<style>
.fig-button {
    border-radius: var(--radius-sm);
    display: inline-flex;
    align-items: center;
    position: relative;
    border: 1px solid transparent;
    transition: background-color 0.2s ease-in-out;
}
.fig-button:not(.fig-icon-button) {
    gap: 4px
}

.fig-button:hover {
    cursor: pointer;
}

.fig-button svg {
    display: inline-block;
}

/* sizes */
.fig-button-xs {
    font-size: 12px;
    padding: 2px 3px;
}
.fig-button-sm {
    font-size: 12px;
    padding: 4px 6px;
}
.fig-button-md {
    font-size: 12px;
    padding: 7px 8px;
}

/* disabled */
.fig-button:disabled,
.fig-button[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: var(--color-gray-200);
    color: var(--color-gray-500);
}

.fig-button:disabled svg {
    stroke: #a0a0a0;
}

/* variants */
.fig-button-danger {
    background-color: var(--color-red-600);
    color: #fff;
}
.fig-button-danger:not(:disabled):hover {
    background-color: var(--color-red-700);
}

.fig-button-ghost {
    background-color: transparent;
    color: var(--color-gray-800);
}
.fig-button-ghost:not(:disabled):hover {
    background-color: var(--color-gray-200);
}

.fig-button-plain {
    background-color: var(--color-gray-300);
    color: var(--color-gray-800);
}
.fig-button-plain:not(:disabled):hover {
    background-color: var(--color-gray-400);
}

.fig-button-primary {
    background-color: var(--color-blue-500);
    color: #fff;
}
.fig-button-primary:not(:disabled):hover {
    background-color: var(--color-blue-600);
}

.fig-button-success {
    background-color: var(--color-emerald-500);
    color: #fff;
}
.fig-button-success:not(:disabled):hover {
    background-color: var(--color-emerald-600);
}
</style>
