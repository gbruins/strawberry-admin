import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', () => {
    const allowedStreets = ref([])

    return {
        allowedStreets
    }
})
