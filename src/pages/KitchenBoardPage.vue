<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowLeftIcon, ArrowRightIcon, Volume2Icon, VolumeXIcon, EyeIcon, EyeOffIcon } from '@lucide/vue';
import { tiks } from '@rexa-developer/tiks';
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
// Resolution for the wait-time badges — minutes-granularity display, no need for anything tighter.
const NOW_TICK_MS = 30000;
// How long a ticket sits in its current stage before the wait badge escalates to the urgent
// style. Only applies to queued/in_progress — see isUrgent().
const WAIT_WARNING_MS = 10 * 60 * 1000;
// How long the just-arrived flash ring stays on a new ticket's card.
const FLASH_DURATION_MS = 5000;
const SOUND_ENABLED_STORAGE_KEY = 'kitchen_board_sound_enabled';
const SHOW_COMPLETED_STORAGE_KEY = 'kitchen_board_show_completed';

const KITCHEN_STATUS_ORDER = ['queued', 'in_progress', 'completed'];

const ALL_COLUMNS = [
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
// Ticked every NOW_TICK_MS so the wait-time badges stay current without needing new server
// data — formatWaitTime()/isUrgent() read this instead of calling Date.now() directly so
// they're reactive to the tick.
const now = ref(Date.now());
// Ticket ids currently showing the just-arrived flash ring. A reactive Set — Vue 3 tracks
// add()/delete()/has() on a ref-wrapped Set, so the template reacts without extra plumbing.
const flashingIds = ref(new Set());
const soundEnabled = ref(readSoundEnabled());
// Hidden by default — most of the time a completed ticket is no longer actionable, and a
// 2-column layout gives the two stages that still need attention more room. Completed tickets
// are always fetched regardless (ticketsByStatus.completed is unaffected) — this only hides
// the column.
const showCompleted = ref(readShowCompleted());

let pollTimer = null;
let refreshTimer = null;
let nowTimer = null;
let channel = null;
let isUnmounting = false;
// Pure bookkeeping for the new-ticket alert, never read by the template — a plain Set, not
// reactive. Only ever grows; "new" means "not in here yet when a fetch resolves."
let seenTicketIds = new Set();
// The very first fetchTickets() call (onMounted, before startRealtime()) seeds seenTicketIds
// from whatever's already on the board — a tablet reloading mid-shift must not re-alert on
// every ticket already visible. Only fetches after that one can trigger an alert.
let hasLoadedOnce = false;

const ticketsByStatus = computed(() => {
    const grouped = { queued: [], in_progress: [], completed: [] };

    tickets.value.forEach((ticket) => {
        if (grouped[ticket.kitchen_status]) {
            grouped[ticket.kitchen_status].push(ticket);
        }
    });

    return grouped;
});

const visibleColumns = computed(() => {
    return showCompleted.value ? ALL_COLUMNS : ALL_COLUMNS.filter((column) => column.status !== 'completed');
});

function formatWaitTime(iso) {
    if (!iso) {
        return '';
    }

    const mins = Math.floor(Math.max(0, now.value - new Date(iso).getTime()) / 60000);

    if (mins < 1) {
        return '<1m';
    }

    if (mins < 60) {
        return `${mins}m`;
    }

    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

// Completed is terminal — every finished ticket would eventually cross any wait threshold and
// sit flagged urgent forever for no reason, so it never escalates (see WAIT_WARNING_MS).
function isUrgent(ticket) {
    if (ticket.kitchen_status === 'completed' || !ticket.kitchen_status_updated_at) {
        return false;
    }

    return now.value - new Date(ticket.kitchen_status_updated_at).getTime() >= WAIT_WARNING_MS;
}

function readSoundEnabled() {
    try {
        return localStorage.getItem(SOUND_ENABLED_STORAGE_KEY) !== 'false';
    }
    catch (error) {
        return true;
    }
}

// tiks owns the actual mute state (tiks.mute()/unmute(), shared globally per its own docs) —
// soundEnabled here just mirrors it for the icon and for localStorage persistence across a
// reload, since tiks itself doesn't persist anything.
function toggleSound() {
    soundEnabled.value = !soundEnabled.value;

    if (soundEnabled.value) {
        tiks.unmute();
    }
    else {
        tiks.mute();
    }

    try {
        localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, String(soundEnabled.value));
    }
    catch (error) {
        // Private browsing / blocked storage — the toggle still works for this page load,
        // it just won't be remembered next time.
    }
}

function readShowCompleted() {
    try {
        return localStorage.getItem(SHOW_COMPLETED_STORAGE_KEY) === 'true';
    }
    catch (error) {
        return false;
    }
}

function toggleShowCompleted() {
    showCompleted.value = !showCompleted.value;

    try {
        localStorage.setItem(SHOW_COMPLETED_STORAGE_KEY, String(showCompleted.value));
    }
    catch (error) {
        // Private browsing / blocked storage — the toggle still works for this page load,
        // it just won't be remembered next time.
    }
}

function onNewTickets(newlyQueuedTickets) {
    tiks.notify();

    newlyQueuedTickets.forEach((ticket) => {
        flashingIds.value.add(ticket.id);

        setTimeout(() => {
            flashingIds.value.delete(ticket.id);
        }, FLASH_DURATION_MS);
    });
}

async function fetchTickets() {
    return $apiTickets.tryCatch(async () => {
        const response = await $apiTickets.run();
        const freshTickets = response.data || [];

        if (hasLoadedOnce) {
            const newlyQueuedTickets = freshTickets.filter(
                (ticket) => ticket.kitchen_status === 'queued' && !seenTicketIds.has(ticket.id)
            );

            if (newlyQueuedTickets.length) {
                onNewTickets(newlyQueuedTickets);
            }
        }

        freshTickets.forEach((ticket) => seenTicketIds.add(ticket.id));
        hasLoadedOnce = true;

        tickets.value = freshTickets;
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
    // Safe to call anytime per tiks' own docs — the AudioContext itself is created lazily on
    // the first real user gesture, so this never trips the browser's autoplay-policy warning.
    tiks.init({ muted: !soundEnabled.value });

    await fetchTickets();
    // realtimeJwt is intentionally in-memory only (never persisted), so it's always gone after
    // a reload even though stationSessionToken survives one — startRealtime() alone would just
    // fall back to polling and stay there until the 45-minute refresh timer below first fires.
    // Falling back immediately keeps the board usable, but also fetch a fresh token right away
    // so a reload upgrades back to Realtime in seconds, not up to 45 minutes later.
    startRealtime();
    await refreshRealtimeToken();
    refreshTimer = setInterval(refreshRealtimeToken, REALTIME_TOKEN_REFRESH_MS);
    nowTimer = setInterval(() => {
        now.value = Date.now();
    }, NOW_TICK_MS);
});

onBeforeUnmount(() => {
    isUnmounting = true;
    stopPolling();

    if (refreshTimer) {
        clearInterval(refreshTimer);
    }

    if (nowTimer) {
        clearInterval(nowTimer);
    }

    if (channel) {
        getKitchenRealtimeClient().removeChannel(channel);
    }
});
</script>

<template>
    <div class="flex flex-col h-full gap-4">
        <div class="flex items-center justify-between gap-2 shrink-0">
            <div class="flex-1">
                <div v-if="connectionState === 'disconnected'" class="rounded-lg bg-destructive/10 text-destructive px-4 py-2 text-sm text-center">
                    {{ t('Connection lost — reconnecting…') }}
                </div>
                <div v-else-if="connectionState === 'polling'" class="rounded-lg bg-muted px-4 py-2 text-sm text-center text-muted-foreground">
                    {{ t('Live updates unavailable — refreshing automatically') }}
                </div>
            </div>

            <button
                type="button"
                class="h-10 shrink-0 px-3 rounded-lg bg-muted flex items-center gap-2 text-sm font-medium active:bg-muted-foreground/20"
                @click="toggleShowCompleted">
                <EyeIcon v-if="!showCompleted" class="size-5" />
                <EyeOffIcon v-else class="size-5" />
                {{ showCompleted ? t('Hide completed') : t('Show completed') }}
            </button>

            <button
                type="button"
                :aria-label="soundEnabled ? t('Mute new ticket alerts') : t('Unmute new ticket alerts')"
                class="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center active:bg-muted-foreground/20"
                @click="toggleSound">
                <Volume2Icon v-if="soundEnabled" class="size-5" />
                <VolumeXIcon v-else class="size-5" />
            </button>
        </div>

        <div class="grid grid-cols-1 gap-4 flex-1 min-h-0" :class="showCompleted ? 'md:grid-cols-3' : 'md:grid-cols-2'">
            <div v-for="column in visibleColumns" :key="column.status" class="flex flex-col h-full min-h-0">
                <div class="text-lg font-semibold mb-2 px-1">
                    {{ t(column.label) }} ({{ ticketsByStatus[column.status].length }})
                </div>

                <div class="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                    <div
                        v-for="ticket in ticketsByStatus[column.status]"
                        :key="ticket.id"
                        class="rounded-xl border p-4 shadow-sm transition-shadow"
                        :class="[COLUMN_CARD_CLASS[column.status], flashingIds.has(ticket.id) ? 'ring-4 ring-primary animate-pulse' : '']">
                        <div class="flex items-start justify-between gap-2">
                            <div class="text-2xl font-bold">#{{ ticket.pickup_code }}</div>

                            <div
                                class="text-xs font-semibold px-2 py-1 rounded-full shrink-0"
                                :class="isUrgent(ticket) ? 'bg-destructive text-white' : 'bg-background/70 text-muted-foreground'">
                                {{ formatWaitTime(ticket.kitchen_status_updated_at) }}
                            </div>
                        </div>

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
