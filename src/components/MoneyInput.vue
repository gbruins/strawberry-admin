<script setup lang="ts">
import { ref, watch } from 'vue';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

// Edits a cents value as dollars.

const cents = defineModel<number | string | null>({ default: 0 });

function toDollars(value: number | string | null | undefined) {
    const parsed = typeof value === 'number' ? value : parseInt(value ?? '', 10);
    return Number.isFinite(parsed) ? (parsed / 100).toFixed(2) : '0.00';
}

const displayValue = ref(toDollars(cents.value));

watch(cents, (newVal) => {
    // Don't reformat what the user is typing (e.g. "4.5") when it already equals the model.
    if (parseFloat(displayValue.value) !== parseFloat(toDollars(newVal))) {
        displayValue.value = toDollars(newVal);
    }
});

function onInput() {
    cents.value = Math.round((parseFloat(displayValue.value) || 0) * 100);
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
