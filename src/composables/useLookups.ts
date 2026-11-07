import { ref, computed, type Ref, type ComputedRef } from 'vue';
import useApi from '@/composables/useApi';

/**
 * Small reference collections (menus, products, product types) that several
 * screens need for selects and id→label display. Each is fetched once, shared app-wide, and
 * refreshed explicitly after a create/update/delete of that resource.
 */

interface Lookup<T> {
    items: Ref<T[]>;
    byId: ComputedRef<Map<unknown, T>>;
    isLoaded: Ref<boolean>;
    /** Refetch now (call after mutating the resource). */
    refresh: () => Promise<void>;
}

const resetters: Array<() => void> = [];

function defineLookup<T extends Record<string, unknown>>(endpoint: string, params: Record<string, unknown>, idKey: keyof T = 'id') {
    // Module-level, so every caller shares the same data. Cleared by resetLookups() on logout.
    const items = ref([]) as Ref<T[]>;
    const isLoaded = ref(false);
    const byId = computed(() => new Map(items.value.map((item) => [item[idKey], item])));
    let inFlight: Promise<void> | null = null;

    resetters.push(() => {
        items.value = [];
        isLoaded.value = false;
        inFlight = null;
    });

    return function useLookup(): Lookup<T> {
        const api = useApi(endpoint);

        function refresh() {
            inFlight = api.tryCatch(async () => {
                const response = await api.run(params);
                items.value = response?.data ?? [];
                isLoaded.value = true;
            }).then(() => undefined);

            return inFlight;
        }

        if (!inFlight) {
            refresh();
        }

        return { items, byId, isLoaded, refresh };
    };
}

/** Forget all cached lookups — called when the owner session ends (a new login may be another tenant). */
export function resetLookups() {
    resetters.forEach((reset) => reset());
}

export interface MenuLookup extends Record<string, unknown> { id: string, title: string, published: boolean }
export interface ProductLookup extends Record<string, unknown> { id: string, title: string, published: boolean }
// `built_in`: the Pizza type, which the per-order cap and inventory apply to. It can't be deleted.
export interface ProductTypeLookup extends Record<string, unknown> { id: string, name: string, value: number, built_in?: boolean }

export const useMenus = defineLookup<MenuLookup>('serviceMenu.search', { _pageSize: 500, _sort: 'title:asc' });
export const useProducts = defineLookup<ProductLookup>('product.search', { _pageSize: 500, _sort: 'title:asc' });
// Products reference their type by the numeric `value`, not the row id.
export const useProductTypes = defineLookup<ProductTypeLookup>('productType.search', { _pageSize: 500, _sort: 'name:asc' }, 'value');
