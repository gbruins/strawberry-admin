<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStorage, useTimestamp } from '@vueuse/core';
import { Volume2Icon, VolumeXIcon, EyeIcon, EyeOffIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import KitchenColumn from '@/components/kitchen/KitchenColumn.vue';
import KitchenTicketCard from '@/components/kitchen/KitchenTicketCard.vue';
import KitchenConnectionStatus from '@/components/kitchen/KitchenConnectionStatus.vue';
import KitchenCompleteDialog from '@/components/kitchen/KitchenCompleteDialog.vue';
import useKitchenTickets from '@/composables/useKitchenTickets';
import useNewTicketAlert from '@/composables/useNewTicketAlert';
import { adjacentStatus, KITCHEN_STATUSES, type KitchenTicket } from '@/utils/kitchenTickets';

// Wiring only: data/realtime lives in useKitchenTickets, the new-ticket chime/flash in
// useNewTicketAlert, ticket rules in utils/kitchenTickets, and each piece of UI in
// components/kitchen/*.

const COLUMN_LABELS = {
    queued: 'Queued',
    in_progress: 'In Progress',
    completed: 'Completed'
} as const;

const { t } = useI18n();
const { tickets, ticketsByStatus, connectionState, pendingIds, moveTicket } = useKitchenTickets();
const { soundEnabled, flashingIds, toggleSound } = useNewTicketAlert(tickets);

// Minute-granularity wait badges — no need to tick faster than this.
const now = useTimestamp({ interval: 30_000 });

// Hidden by default — a completed ticket is rarely actionable, and two columns give the stages
// that still need attention more room. Completed tickets are still fetched; this only hides the column.
const showCompleted = useStorage('kitchen_board_show_completed', false);

const visibleStatuses = computed(() => showCompleted.value ? KITCHEN_STATUSES : KITCHEN_STATUSES.filter((s) => s !== 'completed'));

const confirmTicket = ref<KitchenTicket | null>(null);

function onForward(ticket: KitchenTicket) {
    if (adjacentStatus(ticket.kitchen_status, 1) === 'completed') {
        confirmTicket.value = ticket; // emails the customer — confirm first
        return;
    }

    moveTicket(ticket, 1);
}

function onConfirmComplete(ticket: KitchenTicket) {
    confirmTicket.value = null;
    moveTicket(ticket, 1);
}
</script>

<template>
    <div class="flex flex-col h-full gap-4">
        <div class="flex items-center justify-between gap-2 shrink-0">
            <div class="flex-1">
                <KitchenConnectionStatus :state="connectionState" />
            </div>

            <Button variant="secondary" size="touch" @click="showCompleted = !showCompleted">
                <EyeOffIcon v-if="showCompleted" />
                <EyeIcon v-else />
                {{ showCompleted ? t('Hide completed') : t('Show completed') }}
            </Button>

            <Button
                variant="secondary"
                size="icon-touch"
                :aria-label="soundEnabled ? t('Mute new ticket alerts') : t('Unmute new ticket alerts')"
                @click="toggleSound">
                <Volume2Icon v-if="soundEnabled" />
                <VolumeXIcon v-else />
            </Button>
        </div>

        <div class="grid grid-cols-1 gap-4 flex-1 min-h-0" :class="showCompleted ? 'md:grid-cols-3' : 'md:grid-cols-2'">
            <KitchenColumn
                v-for="status in visibleStatuses"
                :key="status"
                :title="t(COLUMN_LABELS[status])"
                :count="ticketsByStatus[status].length">
                <KitchenTicketCard
                    v-for="ticket in ticketsByStatus[status]"
                    :key="ticket.id"
                    :ticket="ticket"
                    :now="now"
                    :flashing="flashingIds.has(ticket.id)"
                    :pending="pendingIds.has(ticket.id)"
                    @back="moveTicket(ticket, -1)"
                    @forward="onForward(ticket)" />
            </KitchenColumn>
        </div>

        <KitchenCompleteDialog :ticket="confirmTicket" @confirm="onConfirmComplete" @cancel="confirmTicket = null" />
    </div>
</template>
