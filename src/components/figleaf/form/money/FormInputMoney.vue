<script>
export default {
    name: 'FormInputMoney'
}
</script>

<script setup>
import { ref, watch } from 'vue';
import FormInputNumber from '../number/FormInputNumber.vue';
import FormInputEndcapper from '../endcapper/FormInputEndcapper.vue';
import useFormInput from '../useFormInput.js';
import round from 'lodash-es/round.js';

const props = defineProps({
    modelValue: {
        type: [Number, String],
        default: 0
    },

    ...useFormInput.formInputProps
});

const emit = defineEmits(['update:modelValue']);

const selectedPrice = ref(null);
const { classNames } = useFormInput();

/**
 * Value is emitted as a number (cents)
 * @param val String
 */
function emitInput() {
    let clean = 0;

    if(selectedPrice.value) {
        clean = round(parseFloat(selectedPrice.value) * 100, 0);
    }

    emit('update:modelValue', clean);
};

watch(
    () => props.modelValue,
    (newVal) => {
        /**
         * Value is sent as a number (in cents) that needs
         * to be converted to 'dollars' (divide by 100)
         */
        selectedPrice.value = newVal ? parseInt(newVal, 10)/100 : 0;
        emitInput();
    },
    { immediate: true }
);
</script>


<template>
    <form-input-endcapper>
        <template v-slot:prefix>$</template>
        <form-input-number
            v-model="selectedPrice"
            @update:modelValue="emitInput"
            :size="size"
            :min="0"
            :step=".01"
            :disabled="disabled"
            :readonly="readonly"
            v-bind="$attrs"
            input-classes="fig-input-money" />
    </form-input-endcapper>
</template>


<style>
.fig-input-money {
    min-width: 65px;
}
</style>
