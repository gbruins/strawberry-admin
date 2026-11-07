<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { ConnectionState } from '@/composables/useKitchenTickets';

// Banner when the board isn't receiving live updates, plus a small dot so staff can see at a
// glance that it is.

defineProps<{ state: ConnectionState }>();
const { t } = useI18n();
</script>

<template>
    <div role="status" aria-live="polite">
        <div v-if="state === 'disconnected'" class="rounded-lg bg-destructive/10 text-destructive px-4 py-2 text-sm text-center">
            {{ t('Connection lost — reconnecting…') }}
        </div>

        <div v-else-if="state === 'polling'" class="rounded-lg bg-muted px-4 py-2 text-sm text-center text-muted-foreground">
            {{ t('Live updates unavailable — refreshing automatically') }}
        </div>

        <div v-else-if="state === 'live'" class="flex items-center gap-2 px-1 text-sm text-muted-foreground">
            <span class="size-2.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
            {{ t('Live') }}
        </div>
    </div>
</template>
