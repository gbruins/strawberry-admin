import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// A second, independent Supabase client used ONLY for Realtime subscriptions on the kitchen
// board — never for Auth. A kitchen station has no Supabase session at all (shared-PIN login,
// not GoTrue — see strawberry-server/CLAUDE.md), so this must never share the owner's client
// (src/plugins/supabase.js) or its localStorage-persisted session.
//
// Auth is the server-signed token from POST /kitchen/session (or /kitchen/session/refresh),
// supplied through supabase-js's `accessToken` option — NOT a bare `realtime.setAuth(jwt)`.
// Without the option, supabase-js wires Realtime to its own callback, which returns the GoTrue
// session token or, with no session, the anon key; realtime-js re-reads that callback on every
// heartbeat (~25s), overriding a manual `setAuth(jwt)`. The channel stays joined (so the board
// shows "live") but RLS then runs as `anon`, `kitchen_realtime_select` matches nothing, and no
// change events ever arrive. (With `accessToken` set this client has no `auth` namespace —
// accessing it throws — which is fine since it's Realtime-only.)
let _client: SupabaseClient | null = null;
let _token: string | null = null;

export function getKitchenRealtimeClient() {
    if (!_client) {
        _client = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY,
            { accessToken: async () => _token ?? import.meta.env.VITE_SUPABASE_ANON_KEY }
        );
    }

    return _client;
}

/** Sets the Realtime JWT and pushes it to any already-joined channels. */
export function setKitchenRealtimeToken(token: string | null) {
    _token = token;
    // No-arg setAuth() re-reads the accessToken callback above and sends the new token.
    return getKitchenRealtimeClient().realtime.setAuth();
}
