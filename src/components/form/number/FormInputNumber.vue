<script>
export default {
    name: 'FormInputNumber'
}
</script>

<script setup>
import { watch, ref } from 'vue';
import FormText from '../text/FormText.vue';

const props = defineProps({
    ...FormText.props,

    modelValue: {
        type: Number
    },

    max: {
        type: Number,
        default: null
    },

    min: {
        type: Number,
        default: null
    },

    step: {
        type: Number,
        default: 1
    },

    center: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    'update:modelValue'
]);

const selectedValue = ref(null);

function emitInput() {
    if(selectedValue.value !== props.modelValue) {
        emit('update:modelValue', selectedValue.value);
    }
}

function setValue(newVal) {
    if(isNaN(parseInt(newVal, 10))) {
        selectedValue.value = props.min !== null ? props.min : null;
        return;
    }

    const val = isNaN(parseInt(newVal, 10)) ? props.min : newVal;

    if(props.max !== null && (val > props.max)) {
        selectedValue.value = props.max;
    }
    else if(props.min !== null && (val < props.min)) {
        selectedValue.value = props.min;
    }
    else {
        selectedValue.value = val;
    }
}

watch(
    () => props.modelValue,
    (newVal) => {
        if(newVal != null) {
            setValue(newVal);
            emitInput();
        }
    },
    {
        immediate: true
    }
)
</script>


<template>
    <form-text
        v-model="selectedValue"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        :size="size"
        :disabled="disabled"
        :readonly="readonly"
        v-bind="$attrs"
        @update:modelValue="emitInput" />
</template>


<style scoped>
.fig-input-number {
    position: relative;
    width: 100%;
    min-width: 80px;
}
.fig-input-number-sm {
    line-height: 1.75rem; /* 28px, leading-7 */
    min-width: 66px;
}
.fig-input-number-md {
    line-height: 2rem; /* 32px, leading-8 */
}
.fig-input-number-lg {
    line-height: 2.25rem; /* 36px, leading-9 */
}
</style>
