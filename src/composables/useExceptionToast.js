import { useI18n } from 'vue-i18n';
// import { useToast } from 'primevue/usetoast';
import useToast from '@/components/toast/useToast.js';

export default () => {
    // const toast = useToast();

    const { errorToast } = useToast();
    const { t } = useI18n();

    function showExceptionToast(error, toastConfig = {}) {
        const message = error?.response?.data?.message || error.message || t('An unexpected error occurred.');
        // toast.add({
        //     severity: 'error',
        //     summary: 'Error',
        //     detail: message,
        //     // life: 5000
        // });

        return errorToast(
            Object.assign(
                {},
                {
                    title: t('Error'),
                    text: message,
                    timeout: 0
                },
                toastConfig,
            )
        );
    }

    return {
        showExceptionToast
    };
}
