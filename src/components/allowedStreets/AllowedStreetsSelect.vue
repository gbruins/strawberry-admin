<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app.js';
import SearchableSelect from '@/components/SearchableSelect.vue';

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
    <SearchableSelect
        v-bind="$attrs"
        v-model="modelValue"
        :options="allowedStreetsOptions" />
</template>
