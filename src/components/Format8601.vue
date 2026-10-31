<script setup>
import { computed } from 'vue';
import useDate from '@/composables/useDate.js';
import { useAppStore } from '@/stores/app';

const props = defineProps({
    date: {
        type: String,
    },

    format: {
        type: String
    },

    // Defaults to the logged-in admin's own tenant (specs/004-multi-tenant-supabase T033) —
    // only pass this explicitly to show a time in some OTHER zone.
    timezone: {
        type: String
    }
});

const { format8601 } = useDate();
const appStore = useAppStore();

const formattedDate = computed(() => {
    return format8601(
        props.date,
        props.format,
        props.timezone || appStore.timezone || 'UTC'
    );
});
</script>

<template>
    <template v-if="formattedDate">{{ formattedDate }}</template>
</template>
