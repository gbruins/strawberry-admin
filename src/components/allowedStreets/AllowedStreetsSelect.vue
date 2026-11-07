<script setup lang="ts">
import { computed } from 'vue';
import SearchableSelect from '@/components/SearchableSelect.vue';
import { useAllowedStreets } from '@/composables/useLookups';

const modelValue = defineModel<string | null>();
const { items } = useAllowedStreets();

const options = computed(() => items.value.map((street) => ({ label: street.street_name, value: street.id })));
</script>

<template>
    <SearchableSelect v-bind="$attrs" v-model="modelValue" :options="options" />
</template>
