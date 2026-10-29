import { toast } from 'vue-sonner';

export default function useToast() {
    function addToast(cfg = {}) {
        const { title, text, timeout, ...rest } = cfg;

        return toast(title, {
            description: text,
            duration: timeout,
            ...rest
        });
    }

    function removeToast(id) {
        toast.dismiss(id);
    }

    function removeAllToasts() {
        toast.dismiss();
    }

    function successToast(cfg = {}) {
        const { title, text, timeout, ...rest } = cfg;

        return toast.success(title, {
            description: text,
            duration: timeout,
            ...rest
        });
    }

    function errorToast(cfg = {}) {
        const { title, text, timeout, ...rest } = cfg;

        return toast.error(title, {
            description: text,
            duration: timeout,
            ...rest
        });
    }

    function warningToast(cfg = {}) {
        const { title, text, timeout, ...rest } = cfg;

        return toast.warning(title, {
            description: text,
            duration: timeout,
            ...rest
        });
    }

    function infoToast(cfg = {}) {
        const { title, text, timeout, ...rest } = cfg;

        return toast.info(title, {
            description: text,
            duration: timeout,
            ...rest
        });
    }

    return {
        addToast,
        removeToast,
        removeAllToasts,
        successToast,
        errorToast,
        warningToast,
        infoToast
    };
}
