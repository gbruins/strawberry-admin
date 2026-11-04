<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import SortableTableHead from '@/components/SortableTableHead.vue';
import Overlay from '@/components/Overlay.vue';
import DataPagination from '@/components/DataPagination.vue';
import PopConfirm from '@/components/PopConfirm.vue';
import BooleanBadge from '@/components/BooleanBadge.vue';
import Format8601 from '@/components/Format8601.vue';
import { PencilIcon, Trash2Icon } from '@lucide/vue';
import MenuUpsertModal from '@/components/menus/MenuUpsertModal.vue';
import MenuProductsModal from '@/components/menus/MenuProductsModal.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import useToast from '@/composables/useToast';

const $apiSearch = useApi('serviceMenu.search');
const $apiDelete = useApi('serviceMenu.delete');
const { t } = useI18n();
const { successToast } = useToast();
const {
    onSort,
    getSortApiParams,
    setTableResults,
    setTableTotalResultsCount,
    tableResults,
    tableTotalResultsCount,
    tableHasNoResults
} = useTable();

const upsertModal = ref(null);
const productsModal = ref(null);
const pageSize = ref(100);
const pageNumber = ref(1);
const defaultSort = { by: 'title', isDesc: false };
const activeSort = ref({ ...defaultSort });

function fetchData() {
    return $apiSearch.tryCatch(
        async () => {
            const response = await $apiSearch.run({
                ...getSortApiParams(),
                _page: pageNumber.value,
                _pageSize: pageSize.value
            });

            setTableResults(response.data);
            setTableTotalResultsCount(response.pagination.total);
        }
    );
}

function onDeleteItem(id: string) {
    return $apiDelete.tryCatch(
        async () => {
            await $apiDelete.run(id);

            successToast({ title: t('Item deleted successfully') });

            fetchData();
        }
    );
}

function onTableSort(val) {
    activeSort.value = val;
    onSort(val);
    fetchData();
}

watch([pageSize, pageNumber], fetchData);

onMounted(() => {
    onSort(defaultSort);
    fetchData();
});
</script>

<template>
    <PageTitle>{{ t('Menus') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal.show()">
            {{ t('Add menu') }}
        </Button>
    </div>

    <Overlay :show="$apiSearch.isLoading.value">
        <Table>
            <TableHeader>
                <TableRow>
                    <SortableTableHead
                        sort-key="title"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Title') }}</SortableTableHead>
                    <SortableTableHead
                        sort-key="published"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Published') }}</SortableTableHead>
                    <TableHead class="text-right">{{ t('Products') }}</TableHead>
                    <TableHead>{{ t('Used by services') }}</TableHead>
                    <TableHead>{{ t('Actions') }}</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow v-for="obj in tableResults" :key="obj.id" data-test="menu-row">
                    <TableCell>{{ obj.title }}</TableCell>

                    <TableCell>
                        <BooleanBadge :value="obj.published" />
                    </TableCell>

                    <TableCell class="text-right">{{ obj.product_count }}</TableCell>

                    <TableCell>
                        <div v-for="svc in obj.services" :key="svc.id">
                            <Format8601 :date="svc.start_at" />
                        </div>
                    </TableCell>

                    <TableCell>
                        <div class="flex items-center justify-center w-full gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                data-test="edit"
                                @click="upsertModal.show(obj.id)">
                                <PencilIcon />
                            </Button>

                            <Button
                                variant="outline"
                                data-test="products"
                                @click="productsModal.show(obj)">
                                {{ t('Products') }}
                            </Button>

                            <PopConfirm @confirm="onDeleteItem(obj.id)">
                                <template v-slot:reference>
                                    <Button variant="destructive" size="icon" data-test="delete">
                                        <Trash2Icon />
                                    </Button>
                                </template>
                                <div v-if="obj.services?.length" data-test="delete-warning">
                                    {{ t('These services use this menu and will show no menu:') }}
                                    <ul class="list-disc ml-5">
                                        <li v-for="svc in obj.services" :key="svc.id">
                                            <Format8601 :date="svc.start_at" />
                                        </li>
                                    </ul>
                                </div>
                                {{ t('Delete this item?') }}
                            </PopConfirm>
                        </div>
                    </TableCell>
                </TableRow>

                <TableRow v-if="tableHasNoResults">
                    <TableCell colspan="5" class="text-center text-muted-foreground">{{ t('No data') }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <DataPagination
            v-model:page-size="pageSize"
            v-model:page-number="pageNumber"
            :total-rows="tableTotalResultsCount" />
    </Overlay>

    <MenuUpsertModal ref="upsertModal" @success="fetchData" />
    <MenuProductsModal ref="productsModal" @success="fetchData" />
</template>
