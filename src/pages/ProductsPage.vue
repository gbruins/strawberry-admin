<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ListTable from '@/components/ListTable.vue';
import SortableTableHead from '@/components/SortableTableHead.vue';
import RowActions from '@/components/RowActions.vue';
import Money from '@/components/Money.vue';
import BooleanBadge from '@/components/BooleanBadge.vue';
import ProductUpsertModal from '@/components/products/ProductUpsertModal.vue';
import ProductTypeDisplay from '@/components/productTypes/ProductTypeDisplay.vue';
import useListPage from '@/composables/useListPage';
import { useProducts } from '@/composables/useLookups';

interface Product {
    id: string;
    title: string;
    description: string | null;
    product_type: number | null;
    base_price: number;
    published: boolean;
}

const { t } = useI18n();
const upsertModal = useTemplateRef('upsertModal');
const products = useProducts();

const list = useListPage<Product>({
    search: 'product.search',
    remove: 'product.delete',
    defaultSort: { by: 'title' }
});

function onDelete(id: string) {
    return list.remove(id, { onRemoved: products.refresh });
}
</script>

<template>
    <PageTitle>{{ t('Products') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal?.show()">{{ t('Add product') }}</Button>
    </div>

    <ListTable :list="list" :columns="6">
        <template #head>
            <SortableTableHead sort-key="title">{{ t('Title') }}</SortableTableHead>
            <SortableTableHead sort-key="description">{{ t('Description') }}</SortableTableHead>
            <TableHead>{{ t('Type') }}</TableHead>
            <SortableTableHead sort-key="base_price" class="text-right">{{ t('Price') }}</SortableTableHead>
            <SortableTableHead sort-key="published">{{ t('Published') }}</SortableTableHead>
            <TableHead class="text-right">{{ t('Actions') }}</TableHead>
        </template>

        <template #row="{ row }">
            <TableCell>{{ row.title }}</TableCell>
            <TableCell>{{ row.description }}</TableCell>
            <TableCell>
                <ProductTypeDisplay :value="row.product_type" />
            </TableCell>
            <TableCell class="text-right">
                <Money :cents="row.base_price" />
            </TableCell>
            <TableCell>
                <BooleanBadge :value="row.published" />
            </TableCell>
            <TableCell>
                <RowActions @edit="upsertModal?.show(row.id)" @delete="onDelete(row.id)" />
            </TableCell>
        </template>
    </ListTable>

    <ProductUpsertModal ref="upsertModal" @success="list.fetch" />
</template>
