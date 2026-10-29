<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app.js';
import SearchableSelect from '@/components/SearchableSelect.vue';

const modelValue = defineModel();

const appStore = useAppStore();

const productTypeOptions = computed(() => {
    return appStore.productTypes.map(type => ({
        label: type.name,
        value: type.value
    }));
});
</script>

<template>
    <SearchableSelect
        v-bind="$attrs"
        v-model="modelValue"
        :options="productTypeOptions" />
</template>
