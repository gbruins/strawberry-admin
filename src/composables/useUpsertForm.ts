import { ref, reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import useApi from '@/composables/useApi';
import useToast, { type ToastConfig } from '@/composables/useToast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiRecord = Record<string, any>;

export interface UpsertFormOptions<F extends object> {
    /** $api resource; read/create/update default to `${resource}.read` etc. */
    resource?: string;
    /** Override individual endpoints (or provide them when there's no `resource`). */
    endpoints?: { read?: string, create?: string, update?: string };
    /** Fresh default values — used for the initial state and on every reset. */
    defaults: () => F;
    /** Vuelidate rules; a function so rules can reference other fields of the form. */
    rules?: (form: F) => object;
    /** Map the record returned by `read` onto the form. Default: copy each default key that's non-null on the record. */
    fromRecord?: (record: ApiRecord) => Partial<F>;
    /** Build the create/update payload. Default: the form itself. `id` is added automatically on update. */
    toPayload?: (form: F) => Record<string, unknown>;
    /** Title of the success toast. */
    successMessage?: string | (() => string);
    /** Full control of the success toast instead, e.g. to include data from the response. */
    successToast?: (response: ApiRecord | undefined) => ToastConfig;
    onSaved?: (response: ApiRecord | undefined) => void;
}

function copyKnownKeys<F extends object>(defaults: F, record: ApiRecord): Partial<F> {
    const result: Partial<F> = {};

    for (const key of Object.keys(defaults) as (keyof F)[]) {
        const value = record?.[key as string];

        if (value !== undefined && value !== null) {
            result[key] = value;
        }
    }

    return result;
}

/**
 * Open/load/validate/save state for a create-or-edit dialog. Pair with <FormDialog>:
 *
 *   const upsert = useUpsertForm({ resource: 'product', defaults: () => ({ title: '' }), ... });
 *   defineExpose({ show: upsert.show });
 *   <FormDialog v-model:open="upsert.open" :busy="upsert.isBusy" @submit="upsert.submit">
 */
export default function useUpsertForm<F extends object>(options: UpsertFormOptions<F>) {
    const endpoint = (action: 'read' | 'create' | 'update') => {
        const path = options.endpoints?.[action] ?? (options.resource ? `${options.resource}.${action}` : null);
        return path ? useApi(path) : null;
    };

    const readApi = endpoint('read');
    const createApi = endpoint('create');
    const updateApi = endpoint('update');
    const { successToast } = useToast();

    const form = reactive(options.defaults()) as F;
    const open = ref(false);
    const editId = ref<string | null>(null);
    /** The raw record last loaded by show(id) — for dialogs that display extra read-only data. */
    const record = ref<ApiRecord | null>(null);

    const rules = computed(() => options.rules?.(form) ?? {});
    // $autoDirty: a field shows its error as soon as the user has changed it (and every field
    // does once submit() calls $validate()), instead of needing manual $touch() calls.
    const v$ = useVuelidate(rules, form as object, { $autoDirty: true });

    const isEdit = computed(() => editId.value !== null);
    const isBusy = computed(() => !!(readApi?.isLoading.value || createApi?.isLoading.value || updateApi?.isLoading.value));

    function reset() {
        Object.assign(form, options.defaults());
        editId.value = null;
        record.value = null;
        v$.value.$reset();
    }

    async function load(id: string) {
        if (!readApi) {
            return;
        }

        await readApi.tryCatch(
            async () => {
                const response = await readApi.run(id);
                const data = response?.data ?? {};

                record.value = data;
                Object.assign(form, options.fromRecord ? options.fromRecord(data) : copyKnownKeys(options.defaults(), data));
                v$.value.$reset();
            },
            () => hide() // nothing sensible to edit if the record couldn't be loaded
        );
    }

    function show(id?: string | null) {
        reset();
        open.value = true;

        if (id) {
            editId.value = id;
            load(id);
        }
    }

    function hide() {
        open.value = false;
    }

    async function submit() {
        if (isBusy.value) {
            return; // guards double-submit (Enter + click, or a double click)
        }

        if (!(await v$.value.$validate())) {
            return;
        }

        const api = isEdit.value ? updateApi : createApi;

        if (!api) {
            throw new Error(`useUpsertForm: no ${isEdit.value ? 'update' : 'create'} endpoint configured`);
        }

        const payload: Record<string, unknown> = {
            ...(options.toPayload ? options.toPayload(form) : form as Record<string, unknown>)
        };

        if (isEdit.value) {
            payload.id = editId.value;
        }

        await api.tryCatch(async () => {
            const response = await api.run(payload);
            const message = typeof options.successMessage === 'function' ? options.successMessage() : options.successMessage;

            successToast(options.successToast ? options.successToast(response) : { title: message });
            hide();
            options.onSaved?.(response);
        });
    }

    return reactive({
        form,
        v$,
        open,
        editId,
        record,
        isEdit,
        isBusy,
        show,
        hide,
        submit
    });
}
