<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { DeleteIcon } from '@lucide/vue';

// Large on-screen keypad for kiosk PIN entry.

const props = withDefaults(defineProps<{ maxLength?: number }>(), { maxLength: 6 });
const pin = defineModel<string>({ default: '' });
const emit = defineEmits<{ submit: [] }>();
const { t } = useI18n();

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const KEY_CLASS = 'h-20 rounded-lg bg-muted text-3xl font-semibold select-none active:bg-muted-foreground/20';

function tap(digit: string) {
    if (pin.value.length < props.maxLength) {
        pin.value += digit;
    }
}

function backspace() {
    pin.value = pin.value.slice(0, -1);
}
</script>

<template>
    <div class="grid grid-cols-3 gap-3 w-full max-w-xs">
        <button v-for="digit in DIGITS" :key="digit" type="button" :class="KEY_CLASS" @click="tap(digit)">{{ digit }}</button>

        <button
            type="button"
            class="h-20 rounded-lg bg-primary text-primary-foreground text-lg font-semibold select-none active:opacity-80"
            @click="emit('submit')">
            <slot name="enter"><span>{{ t('Enter') }}</span></slot>
        </button>

        <button type="button" :class="KEY_CLASS" @click="tap('0')">0</button>

        <button
            type="button"
            :class="[KEY_CLASS, 'flex items-center justify-center']"
            :aria-label="t('Delete last digit')"
            @click="backspace">
            <DeleteIcon class="size-7" />
        </button>
    </div>
</template>
