<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/vue';
import { useKitchenStationStore } from '@/stores/kitchenStation';
import { getKitchenRealtimeClient } from '@/plugins/kitchenRealtime';
import useApi from '@/composables/useApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Polling fallback cadence when Realtime isn't available (no realtime_jwt yet — e.g.
// SUPABASE_JWT_SECRET not configured — or the socket dropped). Good enough for a single
// kitchen's order volume; see strawberry-server/CLAUDE.md for why this degrades rather than
// failing outright.
const POLL_INTERVAL_MS = 5000;
// realtime_jwt is signed for ~1h (realtimeToken.js) — refreshed well before expiry.
const REALTIME_TOKEN_REFRESH_MS = 45 * 60 * 1000;

const KITCHEN_STATUS_ORDER = ['queued', 'in_progress', 'completed'];

const COLUMNS = [
    { status: 'queued', label: 'Queued' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'completed', label: 'Completed' }
];

// Light tints, not solid fills — these sit behind dense ticket text (pickup code, item list,
// customer note) on a tablet in a bright kitchen, so the text needs to stay the primary signal.
const COLUMN_CARD_CLASS = {
    queued: 'bg-gray-500/10 dark:bg-gray-400/10',
    in_progress: 'bg-orange-500/10 dark:bg-orange-500/15',
    completed: 'bg-emerald-600/10 dark:bg-emerald-600/15'
};

const { t } = useI18n();
const kitchenStore = useKitchenStationStore();
const $apiTickets = useApi('kitchen.tickets');
const $apiUpdateStatus = useApi('kitchen.updateStatus');
const $apiRefresh = useApi('kitchen.refresh');

const tickets = ref([]);
// 'connecting' | 'live' | 'polling' | 'disconnected'
const connectionState = ref('connecting');
// The ticket pending completion confirmation, or null — completion is the one board action
// that's hard to undo (it emails the customer), so it gets a deliberate centered confirm dialog
// rather than the small anchored PopConfirm used elsewhere in the admin app: a kiosk tablet
// getting bumped by busy hands needs a bigger, more separated "are you sure" than a desk UI does.
const confirmTicket = ref(null);

let pollTimer = null;
let refreshTimer = null;
let channel = null;
let isUnmounting = false;

const ticketsByStatus = computed(() => {
    const grouped = { queued: [], in_progress: [], completed: [] };

    tickets.value.forEach((ticket) => {
        if (grouped[ticket.kitchen_status]) {
            grouped[ticket.kitchen_status].push(ticket);
        }
    });

    return grouped;
});

async function fetchTickets() {
    return $apiTickets.tryCatch(async () => {
        const response = await $apiTickets.run();
        tickets.value = response.data || [];
    });
}

function adjacentStatus(current, offset) {
    const idx = KITCHEN_STATUS_ORDER.indexOf(current);
    const target = idx + offset;
    return idx >= 0 && target >= 0 && target < KITCHEN_STATUS_ORDER.length ? KITCHEN_STATUS_ORDER[target] : null;
}

// Explicit forward/back buttons rather than tap-anywhere-on-the-card — a shared tablet in a busy
// kitchen gets bumped and brushed constantly, and a card-sized target advanced real orders on
// every stray touch. Forward and back use the same adjacent-move endpoint/validation either way.
function moveTicket(ticket, offset) {
    const target = adjacentStatus(ticket.kitchen_status, offset);

    if (!target) {
        return;
    }

    return $apiUpdateStatus.tryCatch(async () => {
        await $apiUpdateStatus.run({ id: ticket.id, kitchen_status: target });
        // Optimistic — Realtime (or the next poll) reconciles the authoritative state shortly
        // after regardless, so this is just for immediate tap feedback.
        ticket.kitchen_status = target;
    });
}

function onForwardTap(ticket) {
    if (adjacentStatus(ticket.kitchen_status, 1) === 'completed') {
        confirmTicket.value = ticket;
        return;
    }

    moveTicket(ticket, 1);
}

function confirmComplete() {
    const ticket = confirmTicket.value;
    confirmTicket.value = null;

    if (ticket) {
        moveTicket(ticket, 1);
    }
}

function startPolling() {
    stopPolling();
    connectionState.value = 'polling';
    pollTimer = setInterval(fetchTickets, POLL_INTERVAL_MS);
}

function stopPolling() {
    if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
    }
}

function applyRealtimeChange(payload) {
    const row = payload.eventType === 'DELETE' ? payload.old : payload.new;

    if (!row?.id) {
        return;
    }

    if (payload.eventType === 'DELETE' || !row.kitchen_status) {
        tickets.value = tickets.value.filter((ticket) => ticket.id !== row.id);
        return;
    }

    const idx = tickets.value.findIndex((ticket) => ticket.id === row.id);

    if (idx >= 0) {
        tickets.value[idx] = {
            ...tickets.value[idx],
            kitchen_status: row.kitchen_status,
            kitchen_status_updated_at: row.kitchen_status_updated_at,
            pickup_code: row.pickup_code,
            customer_note: row.customer_note
        };
    }
    else {
        // A new ticket's items aren't in the Realtime payload (it's raw `carts` columns only,
        // no joined cart_items) — a full refetch picks up items for it correctly.
        fetchTickets();
    }
}

function startRealtime() {
    if (!kitchenStore.realtimeJwt) {
        startPolling();
        return;
    }

    stopPolling();

    const client = getKitchenRealtimeClient();
    client.realtime.setAuth(kitchenStore.realtimeJwt);

    channel = client
        .channel(`kitchen-tickets-${kitchenStore.tenantId}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'carts', filter: `tenant_id=eq.${kitchenStore.tenantId}` },
            applyRealtimeChange
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                connectionState.value = 'live';
            }
            else if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                // removeChannel() in onBeforeUnmount triggers this same callback with 'CLOSED'
                // — an intentional teardown (navigating away, logging out), not a dropped
                // connection, so it must not re-fetch with a token that may already be gone.
                if (isUnmounting) {
                    return;
                }

                connectionState.value = 'disconnected';
                // Don't trust a resumed socket to have delivered everything missed while
                // disconnected — re-fetch rather than relying on the stream alone, and fall
                // back to polling while the socket is down.
                fetchTickets();
                startPolling();
            }
        });
}

async function refreshRealtimeToken() {
    await $apiRefresh.tryCatch(async () => {
        const response = await $apiRefresh.run();
        kitchenStore.setRealtimeJwt(response.data?.realtime_jwt || null);

        if (kitchenStore.realtimeJwt && channel) {
            getKitchenRealtimeClient().realtime.setAuth(kitchenStore.realtimeJwt);
        }
        else if (kitchenStore.realtimeJwt && !channel) {
            startRealtime();
        }
    });
}

onMounted(async () => {
    await fetchTickets();
    // realtimeJwt is intentionally in-memory only (never persisted), so it's always gone after
    // a reload even though stationSessionToken survives one — startRealtime() alone would just
    // fall back to polling and stay there until the 45-minute refresh timer below first fires.
    // Falling back immediately keeps the board usable, but also fetch a fresh token right away
    // so a reload upgrades back to Realtime in seconds, not up to 45 minutes later.
    startRealtime();
    await refreshRealtimeToken();
    refreshTimer = setInterval(refreshRealtimeToken, REALTIME_TOKEN_REFRESH_MS);
});

onBeforeUnmount(() => {
    isUnmounting = true;
    stopPolling();

    if (refreshTimer) {
        clearInterval(refreshTimer);
    }

    if (channel) {
        getKitchenRealtimeClient().removeChannel(channel);
    }
});
</script>

<template>
    <div class="flex flex-col h-full gap-4">
        <div v-if="connectionState === 'disconnected'" class="rounded-lg bg-destructive/10 text-destructive px-4 py-2 text-sm text-center shrink-0">
            {{ t('Connection lost — reconnecting…') }}
        </div>
        <div v-else-if="connectionState === 'polling'" class="rounded-lg bg-muted px-4 py-2 text-sm text-center text-muted-foreground shrink-0">
            {{ t('Live updates unavailable — refreshing automatically') }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
            <div v-for="column in COLUMNS" :key="column.status" class="flex flex-col h-full min-h-0">
                <div class="text-lg font-semibold mb-2 px-1">
                    {{ t(column.label) }} ({{ ticketsByStatus[column.status].length }})
                </div>

                <div class="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                    <div
                        v-for="ticket in ticketsByStatus[column.status]"
                        :key="ticket.id"
                        class="rounded-xl border p-4 shadow-sm"
                        :class="COLUMN_CARD_CLASS[column.status]">
                        <div class="text-2xl font-bold">#{{ ticket.pickup_code }}</div>

                        <ul class="mt-2 space-y-1 text-base">
                            <li v-for="(item, idx) in ticket.items" :key="idx">{{ item.quantity }}× {{ item.name }}</li>
                        </ul>

                        <div v-if="ticket.customer_note" class="mt-2 text-sm text-muted-foreground italic">
                            {{ ticket.customer_note }}
                        </div>

                        <div class="mt-3 flex items-center gap-2">
                            <button
                                v-if="adjacentStatus(ticket.kitchen_status, -1)"
                                type="button"
                                :aria-label="t('Move back to previous stage')"
                                class="flex-1 h-14 rounded-lg bg-background/70 border active:scale-[0.97] transition-transform flex items-center justify-center"
                                @click="moveTicket(ticket, -1)">
                                <ArrowLeftIcon class="size-6" />
                            </button>

                            <button
                                v-if="adjacentStatus(ticket.kitchen_status, 1)"
                                type="button"
                                :aria-label="t('Move forward to next stage')"
                                class="flex-1 h-14 rounded-lg bg-background/70 border active:scale-[0.97] transition-transform flex items-center justify-center"
                                @click="onForwardTap(ticket)">
                                <ArrowRightIcon class="size-6" />
                            </button>
                        </div>
                    </div>

                    <div v-if="!ticketsByStatus[column.status].length" class="text-sm text-muted-foreground text-center py-8">
                        {{ t('No tickets') }}
                    </div>
                </div>
            </div>
        </div>

        <Dialog :open="!!confirmTicket" @update:open="(isOpen) => { if (!isOpen) confirmTicket = null }">
            <DialogContent class="sm:max-w-md" :show-close-button="false">
                <DialogHeader>
                    <DialogTitle class="text-xl">{{ t('Complete order #{code}?', { code: confirmTicket?.pickup_code }) }}</DialogTitle>
                    <DialogDescription class="text-base">
                        {{ t('This will send an email to the customer that the order is ready for pickup.') }}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter class="sm:flex-col gap-2">
                    <Button size="lg" class="h-16 text-lg w-full" @click="confirmComplete">{{ t('Complete') }}</Button>
                    <Button size="lg" variant="ghost" class="h-16 text-lg w-full" @click="confirmTicket = null">{{ t('Cancel') }}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
