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
import Format8601 from '@/components/Format8601.vue';
import MenuUpsertModal from '@/components/menus/MenuUpsertModal.vue';
import MenuProductsModal from '@/components/menus/MenuProductsModal.vue';
import useListPage from '@/composables/useListPage';
import { useMenus } from '@/composables/useLookups';

interface Menu {
    id: string;
    title: string;
    published: boolean;
    product_count: number;
    services: { id: string, start_at: string }[];
}

const { t } = useI18n();
const upsertModal = useTemplateRef('upsertModal');
const productsModal = useTemplateRef('productsModal');
const menus = useMenus();

const list = useListPage<Menu>({
    search: 'serviceMenu.search',
    remove: 'serviceMenu.delete',
    defaultSort: { by: 'title' }
});

function onSaved() {
    menus.refresh();
    list.fetch();
}
</script>

<template>
    <PageTitle>{{ t('Menus') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal?.show()">{{ t('Add menu') }}</Button>
    </div>

    <ListTable :list="list" :columns="5">
        <template #head>
            <SortableTableHead sort-key="title">{{ t('Title') }}</SortableTableHead>
            <SortableTableHead sort-key="published">{{ t('Published') }}</SortableTableHead>
            <TableHead class="text-right">{{ t('Products') }}</TableHead>
            <TableHead>{{ t('Used by services') }}</TableHead>
            <TableHead class="text-right">{{ t('Actions') }}</TableHead>
        </template>

        <template #row="{ row }">
            <TableCell>{{ row.title }}</TableCell>
            <TableCell>
                <BooleanBadge :value="row.published" />
            </TableCell>
            <TableCell class="text-right">{{ row.product_count }}</TableCell>
            <TableCell>
                <div v-for="svc in row.services" :key="svc.id">
                    <Format8601 :date="svc.start_at" />
                </div>
            </TableCell>
            <TableCell>
                <RowActions
                    @edit="upsertModal?.show(row.id)"
                    @delete="list.remove(row.id, { onRemoved: menus.refresh })">
                    <Button variant="outline" size="sm" data-test="products" @click="productsModal?.show(row)">
                        {{ t('Products') }}
                    </Button>

                    <template #delete-confirm>
                        <div v-if="row.services?.length" data-test="delete-warning">
                            {{ t('These services use this menu and will show no menu:') }}
                            <ul class="list-disc ml-5">
                                <li v-for="svc in row.services" :key="svc.id">
                                    <Format8601 :date="svc.start_at" />
                                </li>
                            </ul>
                        </div>
                        {{ t('Delete this item?') }}
                    </template>
                </RowActions>
            </TableCell>
        </template>
    </ListTable>

    <MenuUpsertModal ref="upsertModal" @success="onSaved" />
    <MenuProductsModal ref="productsModal" @success="onSaved" />
</template>
