<script setup>
import { ref, watch } from 'vue';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

const props = defineProps({
    modelValue: {
        type: [Number, String],
        default: 0
    }
});

const emit = defineEmits(['update:modelValue']);

function toDollars(cents) {
    return cents ? (parseInt(cents, 10) / 100).toFixed(2) : '0.00';
}

const displayValue = ref(toDollars(props.modelValue));

watch(
    () => props.modelValue,
    (newVal) => {
        const dollars = toDollars(newVal);
        if (parseFloat(displayValue.value) !== parseFloat(dollars)) {
            displayValue.value = dollars;
        }
    }
);

function onInput() {
    const cents = Math.round((parseFloat(displayValue.value) || 0) * 100);
    emit('update:modelValue', cents);
}
</script>

<template>
    <InputGroup>
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupInput
            v-model="displayValue"
            type="number"
            min="0"
            step="0.01"
            @input="onInput" />
    </InputGroup>
</template>
