import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { toastVariants } from './constants';

// Global reactive array for all active toasts
const toasts = ref([]);

export default function useToast() {
    const defaultTimeout = 4000;

    function addToast(config) {
        const cfg = Object.assign(
            {},
            {
                timeout: defaultTimeout,
                icon: true,
                variant: toastVariants.info,
                closable: true,
                title: '',
                text: '',
                dangerousText: ''
            },
            config,
            {
                id: uuidv4()
            }
        );

        // add the toast to the beginning of the array
        toasts.value.unshift(cfg);

        if (cfg.timeout > 0) {
            setTimeout(() => {
                removeToast(cfg.id);
            }, cfg.timeout || defaultTimeout);
        }
    }

    function removeToast(id) {
        toasts.value = toasts.value.filter(toast => toast.id !== id);
    }

    function removeAllToasts() {
        toasts.value = [];
    }

    function successToast(cfg) {
        addToast(Object.assign({}, cfg, { variant: toastVariants.success }));
    }

    function errorToast(cfg) {
        addToast(Object.assign({}, cfg, { variant: toastVariants.error }));
    }

    function warningToast(cfg) {
        addToast(Object.assign({}, cfg, { variant: toastVariants.warning }));
    }

    function infoToast(cfg) {
        addToast(Object.assign({}, cfg, { variant: toastVariants.info }));
    }

    return {
        toasts,
        addToast,
        removeToast,
        removeAllToasts,
        successToast,
        errorToast,
        warningToast,
        infoToast
    };
}
