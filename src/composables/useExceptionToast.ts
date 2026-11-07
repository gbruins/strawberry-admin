import { useI18n } from 'vue-i18n';
import useToast, { type ToastConfig } from '@/composables/useToast';

function errorMessage(error: unknown): string | undefined {
    const err = error as { response?: { data?: { message?: string } }, message?: string } | null;
    return err?.response?.data?.message || err?.message || undefined;
}

export default function useExceptionToast() {
    const { errorToast } = useToast();
    const { t } = useI18n();

    function showExceptionToast(error: unknown, toastConfig: ToastConfig = {}) {
        return errorToast({
            title: t('Error'),
            text: errorMessage(error) || t('An unexpected error occurred.'),
            timeout: 0,
            ...toastConfig
        });
    }

    return {
        showExceptionToast
    };
}
