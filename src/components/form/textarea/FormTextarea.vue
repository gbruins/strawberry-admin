<script>
export default {
    name: 'FormTextarea'
}
</script>

<script setup>

import { computed, ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String
    }
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = ref(props.value);

function emitInput() {
    emit('update:modelValue', selectedValue.value);
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
    <textarea
        v-model="selectedValue"
        @input="emitInput"
        class="form-textarea fig-form-control block w-full"></textarea>
</template>
