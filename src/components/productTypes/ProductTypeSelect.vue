<script setup lang="ts">
import { computed } from 'vue';
import SearchableSelect from '@/components/SearchableSelect.vue';
import { useProductTypes } from '@/composables/useLookups';

const modelValue = defineModel<number | null>();
const { items } = useProductTypes();

const options = computed(() => items.value.map((type) => ({ label: type.name, value: type.value })));
</script>

<template>
    <SearchableSelect v-bind="$attrs" v-model="modelValue" :options="options" />
</template>
