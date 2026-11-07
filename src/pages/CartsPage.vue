<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import SearchFilterLayout from '@/components/layouts/SearchFilterLayout.vue';
import { TableHead, TableCell } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import ListTable from '@/components/ListTable.vue';
import SortableTableHead from '@/components/SortableTableHead.vue';
import RowActions from '@/components/RowActions.vue';
import SearchableSelect from '@/components/SearchableSelect.vue';
import Format8601 from '@/components/Format8601.vue';
import Money from '@/components/Money.vue';
import NumberDisplay from '@/components/NumberDisplay.vue';
import AddressDisplay from '@/components/AddressDisplay.vue';
import CartStatusBadge from '@/components/cart/CartStatusBadge.vue';
import useListPage from '@/composables/useListPage';
import { billingAddress } from '@/utils/address';
import type { Cart } from '@/types/cart';

const { t } = useI18n();

const filters = reactive({
    // true = closed (checked out), false = open, null = both
    isClosed: true as boolean | null
});

const statusOptions = [
    { label: t('Closed'), value: true },
    { label: t('Open'), value: false }
];

const list = useListPage<Cart>({
    search: 'cart.search',
    remove: 'cart.delete',
    defaultSort: { by: 'created_at', desc: true },
    params: () => filters.isClosed === null
        ? {}
        : { closed_at: JSON.stringify({ is_null: !filters.isClosed }) }
});
</script>

<template>
    <PageTitle>{{ t('Carts') }}</PageTitle>

    <SearchFilterLayout @apply="list.applyFilters">
        <template #filters>
            <div class="grid gap-1.5">
                <Label>{{ t('Cart status') }}</Label>
                <SearchableSelect v-model="filters.isClosed" :options="statusOptions" clearable />
            </div>
        </template>

        <ListTable :list="list" :columns="9">
            <template #head>
                <TableHead>{{ t('Pickup code') }}</TableHead>
                <SortableTableHead sort-key="created_at">{{ t('Created') }}</SortableTableHead>
                <TableHead>{{ t('Status') }}</TableHead>
                <TableHead class="text-right">{{ t('Grand total') }}</TableHead>
                <TableHead class="text-right">{{ t('Subtotal') }}</TableHead>
                <TableHead class="text-right">{{ t('Tax') }}</TableHead>
                <TableHead class="text-right">{{ t('# items') }}</TableHead>
                <TableHead>{{ t('Billing address') }}</TableHead>
                <TableHead class="w-16"></TableHead>
            </template>

            <template #row="{ row }">
                <TableCell>
                    <RouterLink :to="{ name: 'cart', params: { id: row.id } }">
                        {{ row.pickup_code ?? '—' }}
                    </RouterLink>
                </TableCell>
                <TableCell>
                    <Format8601 :date="row.created_at" />
                </TableCell>
                <TableCell>
                    <CartStatusBadge :closed-at="row.closed_at" />
                </TableCell>
                <TableCell class="text-right">
                    <Money :cents="row.grand_total" />
                </TableCell>
                <TableCell class="text-right">
                    <Money :cents="row.price_subtotal" />
                </TableCell>
                <TableCell class="text-right">
                    <Money :cents="row.sales_tax" />
                </TableCell>
                <TableCell class="text-right">
                    <NumberDisplay :value="row.num_items" />
                </TableCell>
                <TableCell>
                    <AddressDisplay :address="billingAddress(row)" />
                </TableCell>
                <TableCell>
                    <RowActions @delete="list.remove(row.id)" />
                </TableCell>
            </template>
        </ListTable>
    </SearchFilterLayout>
</template>
