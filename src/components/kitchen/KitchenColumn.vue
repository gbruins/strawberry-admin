<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
    title: string;
    count: number;
}>();

const { t } = useI18n();
</script>

<template>
    <section class="flex flex-col h-full min-h-0" :aria-label="title">
        <h2 class="text-lg font-semibold mb-2 px-1">{{ title }} ({{ count }})</h2>

        <div class="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            <slot />

            <div v-if="!count" class="text-sm text-muted-foreground text-center py-8">
                {{ t('No tickets') }}
            </div>
        </div>
    </section>
</template>
