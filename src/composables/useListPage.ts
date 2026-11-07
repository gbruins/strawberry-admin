import { ref, reactive, computed, watch, onMounted, type InjectionKey, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

export interface SortState {
    by: string | null;
    desc: boolean;
}

/** Provided by <ListTable> so <SortableTableHead> can read/set the sort without prop drilling. */
export interface SortContext {
    sort: Ref<SortState>;
    setSort: (by: string) => void;
}

export const SORT_CONTEXT: InjectionKey<SortContext> = Symbol('list-sort');

export interface ListPageOptions {
    /** $api endpoint path used to load rows, e.g. 'product.search' */
    search: string;
    /** $api endpoint path used by remove(id), e.g. 'product.delete' */
    remove?: string;
    defaultSort?: { by: string, desc?: boolean };
    pageSize?: number;
    /** false for endpoints that return the whole collection (no _page/_pageSize params) */
    paginated?: boolean;
    /** Extra query params (usually filters), read fresh on every fetch. */
    params?: () => Record<string, unknown>;
    /** Fetch on mount (default true). */
    immediate?: boolean;
}

export interface RemoveOptions {
    successMessage?: string;
    onRemoved?: () => void;
}

export interface ListPage<Row> {
    readonly rows: Row[];
    readonly total: number;
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly sort: SortState;
    readonly isLoading: boolean;
    /** true only once a fetch has completed with no rows — avoids a "No data" flash before the first load */
    readonly isEmpty: boolean;
    readonly paginated: boolean;
    fetch: () => Promise<void>;
    setSort: (by: string) => void;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    /** Jump back to page 1 and refetch — call after filters change. */
    applyFilters: () => void;
    remove: (id: string, options?: RemoveOptions) => Promise<void>;
}

/**
 * State + behaviour for a sortable, paginated admin list backed by one search endpoint.
 * Returned as a reactive object (use `list.rows`, not `list.rows.value`); don't destructure it.
 * Pair with <ListTable :list="list"> for the markup.
 */
export default function useListPage<Row = Record<string, unknown>>(options: ListPageOptions): ListPage<Row> {
    const { t } = useI18n();
    const { successToast } = useToast();
    const searchApi = useApi(options.search);
    const removeApi = options.remove ? useApi(options.remove) : null;
    const paginated = options.paginated !== false;

    const rows = ref([]) as Ref<Row[]>;
    const total = ref(0);
    const hasLoaded = ref(false);
    const pageNumber = ref(1);
    const pageSize = ref(options.pageSize ?? 100);
    const sort = ref<SortState>({
        by: options.defaultSort?.by ?? null,
        desc: options.defaultSort?.desc ?? false
    });

    const isLoading = computed(() => searchApi.isLoading.value || !!removeApi?.isLoading.value);

    // Only the most recent request may write results — a slow response to an earlier sort or
    // page click must not overwrite a newer one.
    let latestRequestId = 0;

    function buildParams() {
        const params: Record<string, unknown> = { ...options.params?.() };

        if (paginated) {
            params._page = pageNumber.value;
            params._pageSize = pageSize.value;
        }

        if (sort.value.by) {
            params._sort = `${sort.value.by}:${sort.value.desc ? 'desc' : 'asc'}`;
        }

        return params;
    }

    async function fetch() {
        const requestId = ++latestRequestId;

        await searchApi.tryCatch(async () => {
            const response = await searchApi.run(buildParams());

            if (requestId !== latestRequestId) {
                return;
            }

            rows.value = response?.data ?? [];
            total.value = Number(response?.pagination?.total ?? response?.total ?? rows.value.length) || 0;
            hasLoaded.value = true;

            // Deleting the last row of the last page leaves an empty page — step back to one that has rows.
            if (paginated && !rows.value.length && pageNumber.value > 1 && total.value > 0) {
                pageNumber.value = Math.ceil(total.value / pageSize.value);
            }
        });
    }

    function setSort(by: string) {
        sort.value = {
            by,
            desc: sort.value.by === by ? !sort.value.desc : false
        };
        fetch();
    }

    function setPage(page: number) {
        pageNumber.value = page;
    }

    function setPageSize(size: number) {
        pageSize.value = size;
        pageNumber.value = 1;
    }

    function applyFilters() {
        if (pageNumber.value !== 1) {
            pageNumber.value = 1; // the watcher below refetches
            return;
        }

        fetch();
    }

    async function remove(id: string, removeOptions: RemoveOptions = {}) {
        if (!removeApi) {
            throw new Error(`useListPage(${options.search}): no "remove" endpoint configured`);
        }

        await removeApi.tryCatch(async () => {
            await removeApi.run(id);
            successToast({ title: removeOptions.successMessage ?? t('Item deleted successfully') });
            removeOptions.onRemoved?.();
            await fetch();
        });
    }

    watch([pageNumber, pageSize], fetch);

    if (options.immediate !== false) {
        onMounted(fetch);
    }

    return reactive({
        rows,
        total,
        pageNumber,
        pageSize,
        sort,
        isLoading,
        isEmpty: computed(() => hasLoaded.value && rows.value.length === 0),
        paginated,
        fetch,
        setSort,
        setPage,
        setPageSize,
        applyFilters,
        remove
    }) as ListPage<Row>;
}
