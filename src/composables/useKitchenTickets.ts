import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useKitchenStationStore } from '@/stores/kitchenStation';
import { getKitchenRealtimeClient, setKitchenRealtimeToken } from '@/plugins/kitchenRealtime';
import useApi from '@/composables/useApi';
import { adjacentStatus, groupTicketsByStatus, type KitchenTicket } from '@/utils/kitchenTickets';

// Polling fallback cadence when Realtime isn't available (no realtime_jwt yet — e.g.
// SUPABASE_JWT_SECRET not configured — or the socket dropped). Good enough for a single
// kitchen's order volume; see strawberry-server/CLAUDE.md for why this degrades rather than
// failing outright.
const POLL_INTERVAL_MS = 5000;
// realtime_jwt is signed for ~1h (realtimeToken.js) — refreshed well before expiry.
const REALTIME_TOKEN_REFRESH_MS = 45 * 60 * 1000;

export type ConnectionState = 'connecting' | 'live' | 'polling' | 'disconnected';

type CartRow = Partial<KitchenTicket> & { id?: string };

/**
 * The kitchen station's live ticket list: initial fetch, Supabase Realtime subscription with a
 * polling fallback, Realtime token refresh, and stage moves. Starts on mount, tears down on
 * unmount — call it from the board page's setup.
 */
export default function useKitchenTickets() {
    const kitchenStore = useKitchenStationStore();
    const $apiTickets = useApi('kitchen.tickets');
    const $apiUpdateStatus = useApi('kitchen.updateStatus');
    const $apiRefresh = useApi('kitchen.refresh');

    const tickets = ref<KitchenTicket[]>([]);
    const connectionState = ref<ConnectionState>('connecting');
    // Tickets with a stage move in flight — their buttons are disabled so a double tap can't
    // send two moves.
    const pendingIds = reactive(new Set<string>());

    const ticketsByStatus = computed(() => groupTicketsByStatus(tickets.value));

    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let refreshTimer: ReturnType<typeof setInterval> | null = null;
    let channel: RealtimeChannel | null = null;
    let isUnmounting = false;

    async function fetchTickets() {
        await $apiTickets.tryCatch(async () => {
            const response = await $apiTickets.run();
            tickets.value = response?.data || [];
        });
    }

    function stopPolling() {
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
    }

    function startPolling() {
        stopPolling();
        connectionState.value = 'polling';
        pollTimer = setInterval(fetchTickets, POLL_INTERVAL_MS);
    }

    function applyRealtimeChange(payload: RealtimePostgresChangesPayload<CartRow>) {
        const row = (payload.eventType === 'DELETE' ? payload.old : payload.new) as CartRow;

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
                ...tickets.value[idx]!,
                kitchen_status: row.kitchen_status,
                kitchen_status_updated_at: row.kitchen_status_updated_at ?? null,
                pickup_code: row.pickup_code ?? null,
                customer_note: row.customer_note ?? null
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
        setKitchenRealtimeToken(kitchenStore.realtimeJwt);

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
                    // removeChannel() on unmount triggers this same callback with 'CLOSED' — an
                    // intentional teardown (navigating away, logging out), not a dropped
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
            kitchenStore.setRealtimeJwt(response?.data?.realtime_jwt || null);

            if (kitchenStore.realtimeJwt && channel) {
                setKitchenRealtimeToken(kitchenStore.realtimeJwt);
            }
            else if (kitchenStore.realtimeJwt && !channel) {
                startRealtime();
            }
        });
    }

    /** Move a ticket one stage forward (+1) or back (-1). */
    async function moveTicket(ticket: KitchenTicket, offset: 1 | -1) {
        const target = adjacentStatus(ticket.kitchen_status, offset);

        if (!target || pendingIds.has(ticket.id)) {
            return;
        }

        pendingIds.add(ticket.id);

        await $apiUpdateStatus.tryCatch(
            async () => {
                await $apiUpdateStatus.run({ id: ticket.id, kitchen_status: target });
                // Applied on success for immediate feedback; Realtime (or the next poll)
                // reconciles the authoritative state shortly after regardless.
                ticket.kitchen_status = target;
                ticket.kitchen_status_updated_at = new Date().toISOString();
            },
            undefined,
            () => pendingIds.delete(ticket.id)
        );
    }

    onMounted(async () => {
        await fetchTickets();
        // realtimeJwt is intentionally in-memory only (never persisted), so it's always gone after
        // a reload even though stationSessionToken survives one — startRealtime() alone would just
        // fall back to polling and stay there until the 45-minute refresh timer first fires.
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

    return {
        tickets,
        ticketsByStatus,
        connectionState,
        pendingIds,
        moveTicket
    };
}
