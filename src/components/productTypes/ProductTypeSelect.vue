<script>
export default {
    name: 'ProductTypesSelect'
}
</script>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app.js';
import FigFormMultiSelect from '@/components/figleaf/form/multiSelect/FormMultiSelect.vue';

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
    <fig-form-multi-select
        v-bind="$attrs"
        v-model="modelValue"
        :options="productTypeOptions" />
</template>
