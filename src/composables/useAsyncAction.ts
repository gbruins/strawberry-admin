import { ref } from 'vue';
import useExceptionToast from '@/composables/useExceptionToast';

/**
 * Wraps an async action with a loading flag, double-run protection and the standard error
 * toast. run() never rejects; it resolves to the action's result, or undefined on failure.
 */
export default function useAsyncAction<Args extends unknown[], Result>(
    action: (...args: Args) => Promise<Result>,
    options: { onError?: (error: unknown) => void } = {}
) {
    const isLoading = ref(false);
    const { showExceptionToast } = useExceptionToast();

    async function run(...args: Args): Promise<Result | undefined> {
        if (isLoading.value) {
            return undefined;
        }

        isLoading.value = true;

        try {
            return await action(...args);
        }
        catch (error) {
            console.error(error);
            showExceptionToast(error);
            options.onError?.(error);
            return undefined;
        }
        finally {
            isLoading.value = false;
        }
    }

    return { run, isLoading };
}
