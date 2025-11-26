<script>
export default {
    name: 'AllowedStreetsSelect'
}
</script>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app.js';
import FigFormMultiSelect from '@/components/figleaf/form/multiSelect/FormMultiSelect.vue';

const modelValue = defineModel();

const appStore = useAppStore();

const allowedStreetsOptions = computed(() => {
    return appStore.allowedStreets.map(street => ({
        label: street.street_name,
        value: street.id
    }));
});
</script>

<template>
    <fig-form-multi-select
        v-bind="$attrs"
        v-model="modelValue"
        :options="allowedStreetsOptions" />
</template>
