<script>
export default {
    name: 'StreetNameDisplay'
}
</script>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app.js';

const appStore = useAppStore();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const streetName = computed(() => {
    const street = appStore.allowedStreets.find(s => s.id === props.id);
    return street ? street.street_name : '';
});
</script>

<template>
    <span>{{ streetName }}</span>
</template>
