import { createClient } from '@supabase/supabase-js';

// Used for login/signup/password-reset directly against Supabase Auth, and to read the current
// session's access token for the Authorization header in src/plugins/api.js (contracts/admin-auth.md).
export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);
