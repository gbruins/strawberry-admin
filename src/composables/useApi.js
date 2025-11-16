import { ref, inject } from 'vue';
import _get from 'lodash.get';
import useExceptionToast from '@/composables/useExceptionToast';

export default (endpoint) => {
    const $api = inject('$api');
    const method = _get($api, endpoint);
    const isLoading = ref(false);
    const { showExceptionToast } = useExceptionToast();
    let cache = null;

    function run() {
        return method.apply(null, arguments);
    }

    function setCache(data) {
        cache = data;
    }

    function getCache() {
        return cache;
    }

    function clearCache() {
        cache = null;
    }

    async function tryCatch(fn, catchCallback, finallyCallback) {
        return new Promise(async (resolve, reject) => {
            try {
                isLoading.value = true;
                await fn();
                resolve();
            }
            catch (error) {
                console.error(error);
                showExceptionToast(error);
                catchCallback?.(error);
                reject(error);
            }
            finally {
                isLoading.value = false;
                finallyCallback?.();
            }
        });
    }


    return {
        isLoading,
        run,
        tryCatch,
        setCache,
        getCache,
        clearCache
    }
};
