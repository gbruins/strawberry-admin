<script>
export default {
    name: 'Format8601'
}
</script>

<script setup>
import { computed } from 'vue';
import useDate from '@/composables/useDate.js';

const props = defineProps({
    date: {
        type: String,
    },

    format: {
        type: String
    },

    timezone: {
        type: String
    }
});

const { format8601 } = useDate();

const formattedDate = computed(() => {
    return format8601(
        props.date,
        props.format,
        props.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    );
});
</script>

<template>
    <template v-if="formattedDate">{{ formattedDate }}</template>
</template>
