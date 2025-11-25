<script>
export default {
    name: 'Money'
}
</script>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    cents: {
        type: [String, Number],
        default: 0
    }
});

const dinero = computed(() => {
    const val = parseInt(props.cents, 10);
    if(!isNaN(val) && val > 0) {
        return val/100;
    }
    return 0;
});
</script>

<template>
    <span>{{ $n(dinero, 'currency') }}</span>
</template>
