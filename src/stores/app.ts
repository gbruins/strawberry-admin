import { ref } from 'vue';
import { defineStore } from 'pinia';
import { axiosInstance } from '@/plugins/api';
import { supabase } from '@/plugins/supabase';
import { resetLookups } from '@/composables/useLookups';

/**
 * The owner's session: Supabase Auth plus the tenant context from /admin/me. All owner auth
 * flows go through these actions — pages never call supabase.auth directly.
 */
export const useAppStore = defineStore('appStore', () => {
    const loggedInUser = ref<string | null>(null);
    const tenantId = ref<string | null>(null);
    const tenantName = ref<string | null>(null);
    const timezone = ref<string | null>(null);
    const role = ref<string | null>(null);
    const isPlatformStaff = ref(false);

    // In-memory state is lost on refresh, but Supabase's client persists the session in
    // localStorage — restoreSession() rebuilds from it. Idempotent: the router guard calls it on
    // every navigation until a session exists, and concurrent calls share one in-flight restore.
    let restorePromise: Promise<void> | null = null;

    async function loadMe() {
        const response = await axiosInstance.get('/admin/me');
        const me = response.data?.data ?? {};

        tenantId.value = me.tenant_id ?? null;
        tenantName.value = me.tenant_name ?? null;
        timezone.value = me.timezone ?? null;
        role.value = me.role ?? null;
        isPlatformStaff.value = me.is_platform_staff ?? false;
    }

    function restoreSession() {
        if (!restorePromise) {
            restorePromise = (async () => {
                const { data } = await supabase.auth.getSession();

                if (!data?.session) {
                    return;
                }

                loggedInUser.value = data.session.user.email ?? null;

                try {
                    await loadMe();
                }
                catch (error) {
                    console.error('Failed to load tenant context for restored session', error);
                    // Allow a later navigation to retry instead of caching the failure forever.
                    clearSession();
                }
            })();
        }

        return restorePromise;
    }

    function clearSession() {
        loggedInUser.value = null;
        tenantId.value = null;
        tenantName.value = null;
        timezone.value = null;
        role.value = null;
        isPlatformStaff.value = false;
        restorePromise = null;
        resetLookups();
    }

    /** Throws on bad credentials or if the tenant context can't be loaded (session is cleared either way). */
    async function login(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                throw error;
            }

            loggedInUser.value = data.user?.email ?? email;
            await loadMe();
        }
        catch (error) {
            clearSession();
            throw error;
        }
    }

    /** Signs out of Supabase (best effort) and always clears local state. */
    async function logout() {
        try {
            await supabase.auth.signOut();
        }
        catch (error) {
            console.error('Failed to sign out of Supabase', error);
        }
        finally {
            clearSession();
        }
    }

    async function requestPasswordReset(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });

        if (error) {
            throw error;
        }
    }

    /**
     * Sets a new password for the recovery session Supabase establishes from the reset-link URL
     * (detectSessionInUrl), then clears local state so the owner logs in fresh.
     */
    async function updatePassword(password: string) {
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            throw error;
        }

        clearSession();
    }

    return {
        loggedInUser,
        tenantId,
        tenantName,
        timezone,
        role,
        isPlatformStaff,
        loadMe,
        restoreSession,
        clearSession,
        login,
        logout,
        requestPasswordReset,
        updatePassword
    };
});
