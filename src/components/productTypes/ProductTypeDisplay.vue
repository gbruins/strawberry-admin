<script>
export default {
    name: 'ProductTypeDisplay'
}
</script>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app.js';

const appStore = useAppStore();

const props = defineProps({
    value: {
        type: Number,
        required: true
    }
});

const productTypeName = computed(() => {
    const productType = appStore.productTypes.find(pt => pt.value === props.value);
    return productType ? productType.name : '';
});
</script>

<template>
    <span>{{ productTypeName }}</span>
</template>
