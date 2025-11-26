<script>
export default {
    name: 'FigFormInputToggle',
    inheritAttrs: false,
}
</script>

<script setup>
// This component was heavily inspired by:  https://thomlom.dev/how-to-build-reusable-and-accessible-switch-vue/

import { computed, ref, watch } from 'vue';
import { toggleInputSizes, toggleInputVariants } from './constants.js';

const props = defineProps({
    modelValue: {
        type: Boolean
    },

    trueValue: {
        type: null,
        default: true
    },

    falseValue: {
        type: null,
        default: false
    },

    disabled: {
        type: Boolean,
        default: false
    },

    size: {
        type: String,
        default: toggleInputSizes.md,
        validator: (value) => {
            return Object.values(toggleInputSizes).includes(value);
        }
    },

    variant: {
        type: String,
        default: toggleInputVariants.primary,
        validator: (value) => {
            return Object.values(toggleInputVariants).includes(value);
        }
    },

    inverse: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    'update:modelValue',
    'change',
    'click',
    'focus',
    'blur'
]);

const input = ref(null);
const focused = ref(false);

const checked = computed(() => {
    return props.modelValue === props.trueValue;
});

const containerClass = computed(() => {
    return {
        'fig-toggle': true,
        [`fig-toggle-${props.size}`]: true,
        [`fig-toggle-${props.variant}`]: true,
        'fig-toggle-disabled': props.disabled,
        'fig-toggle-focused': focused.value,
        'fig-toggle-checked': checked.value
    }
});

function onClick(e) {
    if (props.disabled) {
        return;
    }

    emit('click', e);
    emit('change', e);
    emit('update:modelValue', checked.value ? props.falseValue : props.trueValue);

    input.value.focus();
    e.preventDefault();
}

function onFocus(e) {
    if (props.disabled) {
        return;
    }

    focused.value = true;
    emit('focus', e);
}

function onBlur(e) {
    if (props.disabled) {
        return;
    }

    focused.value = false;
    emit('blur', e);
}
</script>


<template>
    <div :class="containerClass" @click="onClick($event)">
        <input
            ref="input"
            type="checkbox"
            role="switch"
            class="sr-only"
            :disabled="props.disabled"
            :checked="checked"
            :aria-checked="checked"
            @focus="onFocus"
            @blur="onBlur"
            v-bind="$attrs">
        <span class="fig-toggle-switch"></span>
        <span
            v-if="$slots.default"
            class="ml-2 overflow-hidden truncate"><slot></slot></span>
    </div>
</template>


<style>
.fig-toggle {
    @apply relative inline-block box-border;
    width: 2.8rem;
    height: 1.6rem;
}

.fig-toggle-sm.fig-toggle {
    width: 2rem;
    height: 1.15rem;
}

.fig-toggle-switch {
    @apply absolute cursor-pointer inset-0 bg-gray-300 border border-transparent;
    transition: background-color 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.25s;
    border-radius: 9999px;
}

.fig-toggle-disabled .fig-toggle-switch {
    @apply bg-gray-200 cursor-not-allowed;
}

/* The inner circle */
.fig-toggle-switch:before {
    @apply absolute top-1/2 bg-white;
    content: "";
    border-radius: 50%;
    transition-duration: 0.25s;
    width: 1.1rem;
    height: 1.1rem;
    left: 0.2rem;
    margin-top: -0.55rem;
}
.fig-toggle-sm.fig-toggle-switch:before {
    width: 0.75rem;
    height: 0.75rem;
    left: 0.16rem;
    margin-top: -0.4rem;
}

.fig-toggle-checked .fig-toggle-switch:before {
    transform: translateX(1.25rem);
}
.fig-toggle-sm.fig-toggle-checked .fig-toggle-switch:before {
    transform: translateX(0.825rem);
}

.fig-toggle-focus .fig-toggle-switch {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: 0 0 0 0.2rem rgba(96, 165, 250, 0.5);
}

.fig-toggle-primary {
    --switch-checked-color: #2563eb;
    --switch-unchecked-color: #d1d5db;
    --switch-disabled-color: #d1d5db;
}
.fig-toggle-success {
    --switch-checked-color: #48bb78;
    --switch-unchecked-color: #d1d5db;
    --switch-disabled-color: #d1d5db;
}
.fig-toggle-error {
    --switch-checked-color: #f87171;
    --switch-unchecked-color: #d1d5db;
    --switch-disabled-color: #d1d5db;
}

.fig-toggle-checked .fig-toggle-switch {
    background-color: var(--switch-checked-color);
}
.fig-toggle-checked .fig-toggle-switch:before {
    @apply bg-white;
}
</style>
