<script>
export default {
    name: 'FormRadio'
}
</script>

<script setup>
import { computed, watch, ref } from 'vue';
import useFormInput from '../useFormInput.js';

const props = defineProps({
    ...useFormInput.formInputProps,

    modelValue: {},

    checkedValue: {
        required: true
    }
});

const emit = defineEmits([
    'update:modelValue',
    'change'
]);

const selectedValue = ref(null);

const { classNames } = useFormInput(props);
const radioClasses = computed(() => {
    return {
        'form-radio': true,
        ...classNames.value
    };
});

const labelClasses = computed(() => {
    return [
        'inline-flex',
        'items-center',
        props.disabled ? 'text-gray-500' : 'cursor-pointer'
    ];
});

function onChange(e) {
    emit('update:modelValue', props.checkedValue);
    emit('change', e);
}

watch(
    () => props.modelValue,
    (newVal) => {
        selectedValue.value = newVal;
    },
    { immediate: true }
);
</script>


<template>
    <label :class="labelClasses">
        <input
            type="radio"
            v-bind="$attrs"
            :value="checkedValue"
            v-model="selectedValue"
            @change="onChange"
            :disabled="disabled"
            :aria-disabled="disabled"
            :class="radioClasses">
        <span v-if="$slots.default" class="ml-2"><slot /></span>
    </label>
</template>
