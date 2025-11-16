import { useToast } from 'primevue/usetoast';

export default () => {
    const toast = useToast();

    function showExceptionToast(error) {
        const message = error?.response?.data?.message || error.message || 'An unexpected error occurred.';
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            // life: 5000
        });
    }

    return {
        showExceptionToast
    };
}
