import { createClient } from '@supabase/supabase-js';

// A second, independent Supabase client used ONLY for Realtime subscriptions on the kitchen
// board — never for Auth. A kitchen station has no Supabase session at all (shared-PIN login,
// not GoTrue — see strawberry-server/CLAUDE.md), so this must never share the owner's client
// (src/plugins/supabase.js) or its localStorage-persisted session. `persistSession: false` /
// `autoRefreshToken: false` keep the two completely isolated; auth for this client is set
// per-connection via `realtime.setAuth(jwt)` with the server-signed token from
// POST /kitchen/session (or /kitchen/session/refresh).
let _client = null;

export function getKitchenRealtimeClient() {
    if (!_client) {
        _client = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY,
            { auth: { persistSession: false, autoRefreshToken: false } }
        );
    }

    return _client;
}
