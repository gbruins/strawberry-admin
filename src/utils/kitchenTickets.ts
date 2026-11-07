// Pure rules for kitchen display tickets — the board's stage order, wait-time display and
// urgency threshold. `now` is always passed in so callers control reactivity and tests control time.

export const KITCHEN_STATUSES = ['queued', 'in_progress', 'completed'] as const;

export type KitchenStatus = typeof KITCHEN_STATUSES[number];

export interface KitchenTicketItem {
    quantity: number;
    name: string;
}

export interface KitchenTicket {
    id: string;
    pickup_code: string | null;
    kitchen_status: KitchenStatus;
    kitchen_status_updated_at: string | null;
    customer_note: string | null;
    items?: KitchenTicketItem[];
}

/** How long a ticket can sit in queued/in_progress before its wait badge turns urgent. */
export const WAIT_WARNING_MS = 10 * 60 * 1000;

/** The stage `offset` steps from `current` (+1 forward, -1 back), or null past either end. */
export function adjacentStatus(current: KitchenStatus, offset: number): KitchenStatus | null {
    const idx = KITCHEN_STATUSES.indexOf(current);
    const target = idx + offset;

    return idx >= 0 && target >= 0 && target < KITCHEN_STATUSES.length ? KITCHEN_STATUSES[target]! : null;
}

/** "<1m", "12m", "1h 5m" — time since `iso`. */
export function formatWaitTime(iso: string | null | undefined, now: number): string {
    if (!iso) {
        return '';
    }

    const mins = Math.floor(Math.max(0, now - new Date(iso).getTime()) / 60000);

    if (mins < 1) {
        return '<1m';
    }

    if (mins < 60) {
        return `${mins}m`;
    }

    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

/**
 * Completed is terminal — every finished ticket would eventually cross any threshold and sit
 * flagged urgent forever for no reason — so only queued/in_progress escalate.
 */
export function isUrgent(ticket: Pick<KitchenTicket, 'kitchen_status' | 'kitchen_status_updated_at'>, now: number): boolean {
    if (ticket.kitchen_status === 'completed' || !ticket.kitchen_status_updated_at) {
        return false;
    }

    return now - new Date(ticket.kitchen_status_updated_at).getTime() >= WAIT_WARNING_MS;
}

/**
 * Tickets per column, each column oldest-in-stage first, so the ticket that has waited longest
 * is always on top regardless of the order the server or Realtime delivered them in.
 */
export function groupTicketsByStatus(tickets: KitchenTicket[]): Record<KitchenStatus, KitchenTicket[]> {
    const grouped: Record<KitchenStatus, KitchenTicket[]> = { queued: [], in_progress: [], completed: [] };

    tickets.forEach((ticket) => grouped[ticket.kitchen_status]?.push(ticket));

    const since = (t: KitchenTicket) => (t.kitchen_status_updated_at ? new Date(t.kitchen_status_updated_at).getTime() : Infinity);

    for (const status of KITCHEN_STATUSES) {
        grouped[status].sort((a, b) => since(a) - since(b));
    }

    return grouped;
}
