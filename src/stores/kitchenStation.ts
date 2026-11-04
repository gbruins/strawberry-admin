import { ref } from 'vue';
import { defineStore } from 'pinia';

// Deliberately NOT Supabase's localStorage session (there's no Supabase auth involved for a
// kitchen station at all — see strawberry-server/CLAUDE.md's auth-strategy section) — this is
// its own, separately-persisted session so a kitchen tablet stays logged in across a reload/
// reboot for the length of its 12h shift token.
const STORAGE_KEY = 'kitchen_station_session';

function loadPersisted() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    }
    catch (error) {
        return null;
    }
}

interface PersistedSession {
    stationSessionToken: string;
    tenantId: string;
    tenantName: string;
    stationName: string;
}

function persist(data: PersistedSession | null) {
    try {
        if (data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
        else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }
    catch (error) {
        // Private browsing / blocked storage — the station just has to log in again after a
        // reload rather than this failing the login itself.
        console.error('Failed to persist kitchen station session', error);
    }
}

export const useKitchenStationStore = defineStore('kitchenStationStore', () => {
    const persisted = loadPersisted();

    const stationSessionToken = ref(persisted?.stationSessionToken ?? null);
    const tenantId = ref(persisted?.tenantId ?? null);
    const tenantName = ref(persisted?.tenantName ?? null);
    const stationName = ref(persisted?.stationName ?? null);
    // Short-lived (Realtime JWT, ~1h) and re-issued via refresh — never persisted across reloads.
    const realtimeJwt = ref<string | null>(null);
    const locked = ref(false);

    function setSession({ stationSessionToken: token, tenantId: tid, tenantName: tname, stationName: sname, realtimeJwt: rjwt }: {
        stationSessionToken: string;
        tenantId: string;
        tenantName: string;
        stationName: string;
        realtimeJwt?: string | null;
    }) {
        stationSessionToken.value = token;
        tenantId.value = tid;
        tenantName.value = tname;
        stationName.value = sname;
        realtimeJwt.value = rjwt ?? null;
        locked.value = false;

        persist({ stationSessionToken: token, tenantId: tid, tenantName: tname, stationName: sname });
    }

    function setRealtimeJwt(jwt: string | null) {
        realtimeJwt.value = jwt ?? null;
    }

    function clearSession() {
        stationSessionToken.value = null;
        tenantId.value = null;
        tenantName.value = null;
        stationName.value = null;
        realtimeJwt.value = null;
        locked.value = false;

        persist(null);
    }

    function lock() {
        locked.value = true;
    }

    function unlock() {
        locked.value = false;
    }

    return {
        stationSessionToken,
        tenantId,
        tenantName,
        stationName,
        realtimeJwt,
        locked,
        setSession,
        setRealtimeJwt,
        clearSession,
        lock,
        unlock
    };
});
