import { ref, computed, inject } from 'vue';
import useExceptionToast from '@/composables/useExceptionToast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiMethod = (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiTree = Record<string, any>;

function resolveEndpoint(api: ApiTree | undefined, endpoint: string): ApiMethod {
    const method = endpoint.split('.').reduce<unknown>((node, key) => (node as ApiTree | undefined)?.[key], api);

    if (typeof method !== 'function') {
        throw new Error(`Unknown API endpoint "${endpoint}"`);
    }

    return method as ApiMethod;
}

/**
 * Binds one endpoint of the injected `$api` tree (e.g. 'product.search') and tracks its loading
 * state. Resolved lazily on first run() so a component that never calls it doesn't need `$api`.
 */
export default function useApi(endpoint: string) {
    const $api = inject<ApiTree>('$api');
    const { showExceptionToast } = useExceptionToast();
    // A counter rather than a boolean so overlapping calls don't clear the flag early.
    const pending = ref(0);
    const isLoading = computed(() => pending.value > 0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function run(...args: any[]) {
        return resolveEndpoint($api, endpoint)(...args);
    }

    /**
     * Runs `fn` with isLoading set and shows an error toast if it throws. Never rejects — it
     * resolves to fn's result, or to undefined on failure — so fire-and-forget callers don't
     * produce unhandled promise rejections. Use `onError` to react to a failure.
     */
    async function tryCatch<T>(
        fn: () => Promise<T>,
        onError?: (error: unknown) => void,
        onFinally?: () => void
    ): Promise<T | undefined> {
        pending.value++;

        try {
            return await fn();
        }
        catch (error) {
            console.error(error);
            showExceptionToast(error);
            onError?.(error);
            return undefined;
        }
        finally {
            pending.value--;
            onFinally?.();
        }
    }

    return {
        isLoading,
        run,
        tryCatch
    };
}
