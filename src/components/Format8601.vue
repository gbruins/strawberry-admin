<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatInTimeZone } from 'date-fns-tz';
import { useAppStore } from '@/stores/app';

// Formats an ISO-8601 timestamp in the tenant's timezone. `format` uses date-fns tokens
// (https://date-fns.org/docs/format); defaults to the locale's 'date.format.mdy_hm'.

const props = defineProps<{
    date?: string | null;
    format?: string;
    /** Defaults to the logged-in admin's tenant timezone; only pass to show some OTHER zone. */
    timezone?: string;
}>();

const { t } = useI18n();
const appStore = useAppStore();

const formatted = computed(() => {
    if (!props.date) {
        return null;
    }

    const date = new Date(props.date);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return formatInTimeZone(date, props.timezone || appStore.timezone || 'UTC', props.format || t('date.format.mdy_hm'));
});
</script>

<template>
    <template v-if="formatted">{{ formatted }}</template>
</template>
