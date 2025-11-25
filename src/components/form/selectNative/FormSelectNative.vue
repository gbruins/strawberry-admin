<script>
export default {
    name: 'FormSelectNative'
}
</script>

<script setup>
import { computed, watch, ref } from 'vue';
import useFormInput, { formInputProps } from '../useFormInput.js';

const props = defineProps({
    ...formInputProps,
    
    modelValue: {},

    options: {
        type: Array
    }
});

const emit = defineEmits([
    'update:modelValue'
]);

const selectedValue = ref(null);

const classes = computed(() => {
    const { classNames } = useFormInput(props);

    return {
        'fig-form-select-native': true,
        'form-select': true,
        ...classNames.value
    }
});

watch(
    () => props.modelValue,
    (newVal) => {
        selectedValue.value = newVal;
    },
    { immediate: true }
);

const onChange = () => {
    emit('update:modelValue', selectedValue.value);
};
</script>


<template>
    <select
        v-model="selectedValue"
        @change="onChange"
        :class="classes"
        :aria-disabled="$attrs.disabled">
        <slot name="options">
            <option
                v-for="(option, idx) in options"
                :key="idx"
                :value="option.value"
                :disabled="option.disabled">{{ option.label }}</option>
        </slot>
    </select>
</template>


<style scoped>
.fig-form-select-native {
    padding-right: 30px;
}
</style>

