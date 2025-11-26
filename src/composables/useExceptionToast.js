import { useI18n } from 'vue-i18n';
import useToast from '@/components/figleaf/toast/useToast.js';

export default () => {
    const { errorToast } = useToast();
    const { t } = useI18n();

    function showExceptionToast(error, toastConfig = {}) {
        const message = error?.response?.data?.message || error.message || t('An unexpected error occurred.');

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
