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
import Money from '@/components/Money.vue';
import BooleanBadge from '@/components/BooleanBadge.vue';
import { PencilIcon, Trash2Icon } from '@lucide/vue';
import ProductUpsertModal from '@/components/products/ProductUpsertModal.vue';
import ProductTypeDisplay from '@/components/productTypes/ProductTypeDisplay.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import useToast from '@/composables/useToast';

const $apiSearch = useApi('product.search');
const $apiDelete = useApi('product.delete');
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

            successToast({
                title: t('Item deleted successfully')
            });

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
    <PageTitle>{{ t('Products') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal.show()">
            {{ t('Add product') }}
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
                        sort-key="description"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Description') }}</SortableTableHead>
                    <TableHead>{{ t('Type') }}</TableHead>
                    <SortableTableHead
                        sort-key="base_price"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        class="text-right"
                        @sort="onTableSort">{{ t('Price') }}</SortableTableHead>
                    <SortableTableHead
                        sort-key="published"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Published') }}</SortableTableHead>
                    <TableHead class="text-center">{{ t('Actions') }}</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow v-for="(obj, idx) in tableResults" :key="idx">
                    <!-- title -->
                    <TableCell>{{ obj.title }}</TableCell>

                    <!-- description -->
                    <TableCell>{{ obj.description }}</TableCell>

                    <!-- type -->
                    <TableCell>
                        <ProductTypeDisplay :value="obj.product_type" />
                    </TableCell>

                    <!-- price -->
                    <TableCell class="text-right">
                        <Money :cents="obj.base_price" />
                    </TableCell>

                    <!-- published -->
                    <TableCell>
                        <BooleanBadge :value="obj.published" />
                    </TableCell>

                    <!-- actions -->
                    <TableCell>
                        <div class="flex items-center justify-center w-full gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                @click="upsertModal.show(obj.id)">
                                <PencilIcon />
                            </Button>

                            <PopConfirm @confirm="onDeleteItem(obj.id)">
                                <template v-slot:reference>
                                    <Button variant="destructive" size="icon">
                                        <Trash2Icon />
                                    </Button>
                                </template>
                                {{ t('Delete this item?') }}
                            </PopConfirm>
                        </div>
                    </TableCell>
                </TableRow>

                <TableRow v-if="tableHasNoResults">
                    <TableCell colspan="6" class="text-center text-muted-foreground">{{ t('No data') }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <DataPagination
            v-model:page-size="pageSize"
            v-model:page-number="pageNumber"
            :total-rows="tableTotalResultsCount" />
    </Overlay>

    <ProductUpsertModal
        ref="upsertModal"
        @success="fetchData" />
</template>
