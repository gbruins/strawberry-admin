<script setup>
import { DeleteIcon } from '@lucide/vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    maxLength: { type: Number, default: 6 }
});

const emit = defineEmits(['update:modelValue', 'submit']);

function tap(digit) {
    if (props.modelValue.length >= props.maxLength) {
        return;
    }

    emit('update:modelValue', props.modelValue + digit);
}

function backspace() {
    emit('update:modelValue', props.modelValue.slice(0, -1));
}
</script>

<template>
    <div class="grid grid-cols-3 gap-3 w-full max-w-xs">
        <button
            v-for="digit in ['1', '2', '3', '4', '5', '6', '7', '8', '9']"
            :key="digit"
            type="button"
            class="h-20 rounded-lg bg-muted text-3xl font-semibold select-none active:bg-muted-foreground/20"
            @click="tap(digit)">{{ digit }}</button>

        <button
            type="button"
            class="h-20 rounded-lg bg-primary text-primary-foreground text-lg font-semibold select-none active:opacity-80"
            @click="emit('submit')">
            <slot name="enter"><span>Enter</span></slot>
        </button>

        <button
            type="button"
            class="h-20 rounded-lg bg-muted text-3xl font-semibold select-none active:bg-muted-foreground/20"
            @click="tap('0')">0</button>

        <button
            type="button"
            class="h-20 rounded-lg bg-muted flex items-center justify-center select-none active:bg-muted-foreground/20"
            @click="backspace">
            <DeleteIcon class="size-7" />
        </button>
    </div>
</template>
