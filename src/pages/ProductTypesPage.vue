<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ListTable from '@/components/ListTable.vue';
import SortableTableHead from '@/components/SortableTableHead.vue';
import RowActions from '@/components/RowActions.vue';
import BooleanBadge from '@/components/BooleanBadge.vue';
import { Badge } from '@/components/ui/badge';
import ProductTypeUpsertModal from '@/components/productTypes/ProductTypeUpsertModal.vue';
import useListPage from '@/composables/useListPage';
import { useProductTypes } from '@/composables/useLookups';

interface ProductType {
    id: string;
    name: string;
    description: string | null;
    published: boolean;
    built_in?: boolean;
}

const { t } = useI18n();
const upsertModal = useTemplateRef('upsertModal');
const productTypes = useProductTypes();

const list = useListPage<ProductType>({
    search: 'productType.search',
    remove: 'productType.delete',
    defaultSort: { by: 'name' }
});

function onSaved() {
    productTypes.refresh();
    list.fetch();
}
</script>

<template>
    <PageTitle>{{ t('Product types') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal?.show()">{{ t('Add product type') }}</Button>
    </div>

    <ListTable :list="list" :columns="4">
        <template #head>
            <SortableTableHead sort-key="name">{{ t('Name') }}</SortableTableHead>
            <SortableTableHead sort-key="description">{{ t('Description') }}</SortableTableHead>
            <SortableTableHead sort-key="published">{{ t('Published') }}</SortableTableHead>
            <TableHead class="text-right">{{ t('Actions') }}</TableHead>
        </template>

        <template #row="{ row }">
            <TableCell>
                {{ row.name }}
                <Badge v-if="row.built_in" variant="secondary" class="ml-2">{{ t('Built-in') }}</Badge>
            </TableCell>
            <TableCell>{{ row.description }}</TableCell>
            <TableCell>
                <BooleanBadge :value="row.published" />
            </TableCell>
            <TableCell>
                <!-- Built-in types (Pizza) can't be deleted: the per-order cap and inventory depend on them -->
                <RowActions
                    :deletable="!row.built_in"
                    @edit="upsertModal?.show(row.id)"
                    @delete="list.remove(row.id, { onRemoved: productTypes.refresh })" />
            </TableCell>
        </template>
    </ListTable>

    <ProductTypeUpsertModal ref="upsertModal" @success="onSaved" />
</template>
