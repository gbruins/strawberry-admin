import { useAppStore } from '@/stores/app';
import { axiosInstance } from '@/plugins/api';

export default {
    install: async (app) => {
        async function fetchConfig() {
            const appStore = useAppStore();

            try {
                const response = await axiosInstance.get('/allowed_streets');
                appStore.allowedStreets = response.data?.data || [];
            }
            catch (error) {
                console.error('Failed to fetch config:', error);
            }
        }

        await fetchConfig();
    }
}
