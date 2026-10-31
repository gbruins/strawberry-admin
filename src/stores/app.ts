import { ref } from 'vue';
import { defineStore } from 'pinia';
import { axiosInstance } from '@/plugins/api';
import { supabase } from '@/plugins/supabase';

export const useAppStore = defineStore('appStore', () => {
    const loggedInUser = ref(null);
    const tenantId = ref(null);
    const tenantName = ref(null);
    const timezone = ref(null);
    const role = ref(null);
    const isPlatformStaff = ref(false);
    const allowedStreets = ref([]);
    const productTypes = ref([]);
    const stripeTaxCodes = ref([]);

    // In-memory state is lost on refresh, but Supabase's own client persists the session in
    // localStorage — so on app start / a hard refresh, restore it from there rather than
    // forcing a fresh login every time. Idempotent: safe to call from both main.js and the
    // router guard without double-fetching once a restore is in flight or done.
    let restorePromise = null;

    async function loadMe() {
        const response = await axiosInstance.get('/admin/me');
        tenantId.value = response.data?.data?.tenant_id ?? null;
        tenantName.value = response.data?.data?.tenant_name ?? null;
        timezone.value = response.data?.data?.timezone ?? null;
        role.value = response.data?.data?.role ?? null;
        isPlatformStaff.value = response.data?.data?.is_platform_staff ?? false;
    }

    function restoreSession() {
        if (!restorePromise) {
            restorePromise = (async () => {
                const { data } = await supabase.auth.getSession();

                if (!data?.session) {
                    return;
                }

                loggedInUser.value = data.session.user.email;

                try {
                    await loadMe();
                }
                catch (error) {
                    console.error('Failed to load tenant context for restored session', error);
                    loggedInUser.value = null;
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
    }

    async function updateAllowedStreetsState() {
        try {
            const response = await axiosInstance.get('/allowed_streets');
            allowedStreets.value = response.data?.data || [];
        }
        catch (error) {
            console.error('Failed to update allowed streets state', error);
        }
    }

    async function updateProductTypesState() {
        try {
            const response = await axiosInstance.get('/product_types');
            productTypes.value = response.data?.data || [];
        }
        catch (error) {
            console.error('Failed to update product types state', error);
        }
    }

    return {
        loggedInUser,
        tenantId,
        tenantName,
        timezone,
        role,
        isPlatformStaff,
        allowedStreets,
        productTypes,
        stripeTaxCodes,
        loadMe,
        restoreSession,
        clearSession,
        updateAllowedStreetsState,
        updateProductTypesState
    }
})
