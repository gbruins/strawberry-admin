import { toast, type ExternalToast } from 'vue-sonner';

export interface ToastConfig extends ExternalToast {
    title?: string;
    text?: string;
    /** ms; 0 keeps the toast open until dismissed */
    timeout?: number;
}

type ToastFn = (message: string, data?: ExternalToast) => string | number;

// Maps this app's { title, text, timeout } vocabulary onto vue-sonner's (message, { description, duration }).
function toastWith(show: ToastFn) {
    return ({ title = '', text, timeout, ...rest }: ToastConfig = {}) => show(title, {
        description: text,
        duration: timeout,
        ...rest
    });
}

export default function useToast() {
    return {
        addToast: toastWith(toast),
        successToast: toastWith(toast.success),
        errorToast: toastWith(toast.error),
        warningToast: toastWith(toast.warning),
        infoToast: toastWith(toast.info),
        removeToast: (id?: string | number) => toast.dismiss(id),
        removeAllToasts: () => toast.dismiss()
    };
}
