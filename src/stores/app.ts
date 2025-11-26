import { ref } from 'vue';
import { defineStore } from 'pinia';
import { axiosInstance } from '@/plugins/api';

export const useAppStore = defineStore('appStore', () => {
    const allowedStreets = ref([]);

    async function updateAllowedStreetsState() {
        try {
            const response = await axiosInstance.get('/allowed_streets');
            allowedStreets.value = response.data?.data || [];
        }
        catch (error) {
            console.error('Failed to update allowed streets state', error);
        }
    }

    return {
        allowedStreets,
        updateAllowedStreetsState
    }
})
