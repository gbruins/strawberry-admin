<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { adjacentStatus, formatWaitTime, isUrgent, type KitchenTicket, type KitchenStatus } from '@/utils/kitchenTickets';

// Light tints, not solid fills — these sit behind dense ticket text (pickup code, item list,
// customer note) on a tablet in a bright kitchen, so the text needs to stay the primary signal.
const STAGE_CLASS: Record<KitchenStatus, string> = {
    queued: 'bg-gray-500/10 dark:bg-gray-400/10',
    in_progress: 'bg-orange-500/10 dark:bg-orange-500/15',
    completed: 'bg-emerald-600/10 dark:bg-emerald-600/15'
};

const props = defineProps<{
    ticket: KitchenTicket;
    /** Reactive clock (ms) for the wait badge. */
    now: number;
    flashing?: boolean;
    /** A move for this ticket is in flight — buttons disabled. */
    pending?: boolean;
}>();

// Explicit back/forward buttons rather than tap-anywhere-on-the-card — a shared tablet in a busy
// kitchen gets bumped and brushed constantly, and a card-sized target advanced real orders on
// every stray touch.
const emit = defineEmits<{ back: [], forward: [] }>();

const { t } = useI18n();

const canGoBack = computed(() => !!adjacentStatus(props.ticket.kitchen_status, -1));
const canGoForward = computed(() => !!adjacentStatus(props.ticket.kitchen_status, 1));
const waitTime = computed(() => formatWaitTime(props.ticket.kitchen_status_updated_at, props.now));
const urgent = computed(() => isUrgent(props.ticket, props.now));
</script>

<template>
    <div
        class="rounded-xl border p-4 shadow-sm transition-shadow"
        :class="[STAGE_CLASS[ticket.kitchen_status], flashing ? 'ring-4 ring-primary animate-pulse' : '']">
        <div class="flex items-start justify-between gap-2">
            <div class="text-2xl font-bold">#{{ ticket.pickup_code }}</div>

            <div
                class="text-xs font-semibold px-2 py-1 rounded-full shrink-0"
                :class="urgent ? 'bg-destructive text-white' : 'bg-background/70 text-muted-foreground'">
                {{ waitTime }}
            </div>
        </div>

        <ul class="mt-2 space-y-1 text-base">
            <li v-for="(item, idx) in ticket.items" :key="idx">{{ item.quantity }}× {{ item.name }}</li>
        </ul>

        <div v-if="ticket.customer_note" class="mt-2 text-sm text-muted-foreground italic">
            {{ ticket.customer_note }}
        </div>

        <div class="mt-3 flex items-center gap-2">
            <Button
                v-if="canGoBack"
                variant="outline"
                class="flex-1 h-14 bg-background/70 active:scale-[0.97]"
                :disabled="pending"
                :aria-label="t('Move back to previous stage')"
                @click="emit('back')">
                <ArrowLeftIcon class="size-6" />
            </Button>

            <Button
                v-if="canGoForward"
                variant="outline"
                class="flex-1 h-14 bg-background/70 active:scale-[0.97]"
                :disabled="pending"
                :aria-label="t('Move forward to next stage')"
                @click="emit('forward')">
                <ArrowRightIcon class="size-6" />
            </Button>
        </div>
    </div>
</template>
