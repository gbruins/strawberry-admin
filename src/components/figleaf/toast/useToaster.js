import { inject } from 'vue';

export default function useToaster() {
    const addToast = inject('figAddToast');
    const clearToasts = inject('figClearToasts');

    function showSuccessToast(toastConfig) {
        return addToast({
            ...toastConfig,
            variant: 'success'
        });
    }

    function showErrorToast(toastConfig) {
        return addToast({
            timeout: 0,
            ...toastConfig,
            variant: 'error'
        });
    }

    return {
        showToast: addToast,  
        showSuccessToast,
        showErrorToast,
        clearToasts
    }
}