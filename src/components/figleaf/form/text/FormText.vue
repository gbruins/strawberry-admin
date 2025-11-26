<script>
export default {
    name: 'FormText'
}
</script>

<script setup>
import { useSlots, watch, ref, computed } from 'vue';
import useFormInput, { formInputProps } from '../useFormInput.js';

const props = defineProps({
    ...formInputProps,

    modelValue: {},

    type: {
        type: String,
        default: 'text'
    },

    placeholder: {
        type: String
    },

    requird: {
        type: Boolean,
        default: false
    },

    inputClasses: {
        type: String
    },

    squareLeft: {
        type: Boolean,
        default: false
    },

    squareRight: {
        type: Boolean,
        default: false
    }
});

const slots = useSlots();
const emit = defineEmits([
    'update:modelValue'
]);

const selectedValue = ref(null);
const { classNames } = useFormInput(props);

const classes = computed(() => {
    return {
        'w-full': true,
        'rounded-sm': true,
        ...classNames.value,
        'rounded-l-none': props.squareLeft,
        'rounded-l-sm': !props.squareLeft,
        'rounded-r-none': props.squareRight,
        'rounded-r-sm': !props.squareRight,
        [props.inputClasses]: props.inputClasses
    };
});

const canShowLabel = computed(() => {
    return slots.label && !selectedValue.value;
});

const computedPlaceholder = computed(() => {
    return canShowLabel.value ? null : props.placeholder;
});

function emitInput() {
    emit('update:modelValue', selectedValue.value);
}

watch(
    () => props.modelValue,
    (newVal) => {
        selectedValue.value = newVal;
    },
    {
        immediate: true
    }
);
</script>


<template>
    <div class="relative w-full">
        <input
            :type="type"
            v-model="selectedValue"
            @input="emitInput"
            :class="classes"
            :placeholder="computedPlaceholder"
            v-bind="$attrs">
        <div v-if="canShowLabel" class="form-input-label"><slot name="label"></slot></div>
    </div>
</template>


<style scoped>
.form-input-label {
    position: absolute;
    color: var(--color-gray-400);
    left: 1em;
    pointer-events: none;
}
.fig-form-control-sm + .form-input-label {
    top: 0.05em;
}
.fig-form-control-md + .form-input-label {
    top: 0.25em;
}
.fig-form-control-lg + .form-input-label {
    top: 0.55em;
}

.fig-form-control:focus + .form-input-label {
    display: inline-block;
    background-color: #fff;
    color: var(--color-gray-800);
    top: -0.8em;
    left: 1em;
    padding: 0px 0.5em;
    z-index: 2;
    font-size: 11px;
}
</style>

