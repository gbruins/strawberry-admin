<script setup lang="ts">
import { computed } from 'vue';
import { useAllowedStreets } from '@/composables/useLookups';

const props = defineProps<{
    id?: string | null;
}>();

const { byId } = useAllowedStreets();
const streetName = computed(() => byId.value.get(props.id)?.street_name ?? '');
</script>

<template>
    <span>{{ streetName }}</span>
</template>
