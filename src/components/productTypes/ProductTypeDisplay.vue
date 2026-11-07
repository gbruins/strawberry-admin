<script setup lang="ts">
import { computed } from 'vue';
import { useProductTypes } from '@/composables/useLookups';

const props = defineProps<{
    /** The product type's numeric `value` (what products store), not its row id. */
    value?: number | null;
}>();

const { byId } = useProductTypes();
const name = computed(() => byId.value.get(props.value)?.name ?? '');
</script>

<template>
    <span>{{ name }}</span>
</template>
