<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import Format8601 from '@/components/Format8601.vue';

// Closed (checked out) vs. Open (not yet checked out). An open cart is a normal, unfinished
// state — shown neutral rather than as an error.

defineProps<{
    closedAt?: string | null;
    /** Show the closed-at time next to the badge instead of in a tooltip. */
    withDate?: boolean;
}>();

const { t } = useI18n();
</script>

<template>
    <Badge v-if="!closedAt" variant="secondary">{{ t('Open') }}</Badge>

    <div v-else-if="withDate" class="flex items-center gap-2">
        <Badge variant="success">{{ t('Closed') }}</Badge>
        <Format8601 :date="closedAt" />
    </div>

    <Tooltip v-else>
        <TooltipTrigger as-child>
            <Badge variant="success">{{ t('Closed') }}</Badge>
        </TooltipTrigger>
        <TooltipContent>
            <Format8601 :date="closedAt" />
        </TooltipContent>
    </Tooltip>
</template>
