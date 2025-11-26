<script>
export default {
    name: 'FormSelectBitwise'
}
</script>

<script setup>
import { watch, ref } from 'vue';
import FigFormMultiselect from '../multiselect/FormMultiSelect.vue';
import { formSelectSizes } from '../multiselect/constants.js';

const props = defineProps({
    modelValue: {},

    options: {
        type: Array
    },

    clearable: {
        type: Boolean,
        default: true
    },

    size: {
        type: String,
        default: formSelectSizes.md,
        validator: (value) => {
            return Object.values(formSelectSizes).includes(value);
        }
    }
});

const emit = defineEmits([
    'update:modelValue'
]);

const selectedValue = ref(null);

function setSelectedValue() {
    selectedValue.value = props.options.filter((obj) => obj.value & props.modelValue);

    selectedValue.value = !props.multiple
        ? props.options.find((obj) => obj.value === props.modelValue)
        : props.options.filter((obj) => obj.value & props.modelValue);
}


function selectValueChanged(valueArray) {
    let total = 0;

    if(!Array.isArray(valueArray)) {
        valueArray = [valueArray];
    }

    valueArray.forEach(function(val) {
        total += val;
    });

    emit('update:modelValue', total);
}

watch(
    () => props.modelValue,
    (newVal) => {
        setSelectedValue();
    },
    { immediate: true }
);

watch(
    () => props.options,
    (newVal) => {
        setSelectedValue();
    },
    { immediate: true }
);
</script>

<template>
    <fig-form-multiselect
        v-model="selectedValue"
        :options="options"
        :clearable="clearable"
        :size="size"
        :mode='$attrs.mode || "tags"'
        @update:modelValue="selectValueChanged"
        class="fig-form-select-bitwise" />
</template>

<style scoped>
.fig-form-select-bitwise {
    @apply w-full;
}
</style>
