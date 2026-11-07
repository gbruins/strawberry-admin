import { reactive, watch, onMounted, type Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { tiks } from '@rexa-developer/tiks';
import type { KitchenTicket } from '@/utils/kitchenTickets';

// How long the just-arrived flash ring stays on a new ticket's card.
const FLASH_DURATION_MS = 5000;

/**
 * Chime + flash when a ticket that hasn't been seen before shows up as queued. The first ticket
 * list seeds the "seen" set — a tablet reloading mid-shift must not re-alert on every ticket
 * already on the board. The mute setting persists per device.
 */
export default function useNewTicketAlert(tickets: Ref<KitchenTicket[]>) {
    const soundEnabled = useStorage('kitchen_board_sound_enabled', true);
    // Ticket ids currently showing the flash ring (reactive — the template reads it).
    const flashingIds = reactive(new Set<string>());
    // Pure bookkeeping, never rendered. Only grows; "new" means "not in here yet".
    const seenIds = new Set<string>();
    let seeded = false;

    function flash(id: string) {
        flashingIds.add(id);
        setTimeout(() => flashingIds.delete(id), FLASH_DURATION_MS);
    }

    // Fires on every fetch (each replaces the array). In-place Realtime updates to existing
    // tickets don't trigger it, and don't need to — a brand-new ticket always arrives via a refetch.
    watch(tickets, (list) => {
        const fresh = seeded ? list.filter((t) => t.kitchen_status === 'queued' && !seenIds.has(t.id)) : [];

        list.forEach((t) => seenIds.add(t.id));
        seeded = true;

        if (fresh.length) {
            tiks.notify();
            fresh.forEach((t) => flash(t.id));
        }
    });

    function toggleSound() {
        soundEnabled.value = !soundEnabled.value;

        // tiks owns the actual (global) mute state; soundEnabled mirrors it for the icon and
        // persistence, since tiks itself doesn't persist anything.
        if (soundEnabled.value) {
            tiks.unmute();
        }
        else {
            tiks.mute();
        }
    }

    onMounted(() => {
        // Safe anytime per tiks' docs — the AudioContext is created lazily on the first real user
        // gesture, so this never trips the browser's autoplay-policy warning.
        tiks.init({ muted: !soundEnabled.value });
    });

    return {
        soundEnabled,
        flashingIds,
        toggleSound
    };
}
