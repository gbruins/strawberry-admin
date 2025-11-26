import { ref } from 'vue';
import { defineStore } from 'pinia';
import { axiosInstance } from '@/plugins/api';

export const useAppStore = defineStore('appStore', () => {
    const allowedStreets = ref([]);
    const productTypes = ref([]);

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
        allowedStreets,
        productTypes,
        updateAllowedStreetsState,
        updateProductTypesState
    }
})
