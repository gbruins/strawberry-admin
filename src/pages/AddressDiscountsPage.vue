<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import SortableTableHead from '@/components/SortableTableHead.vue';
import NumberDisplay from '@/components/NumberDisplay.vue';
import Overlay from '@/components/Overlay.vue';
import DataPagination from '@/components/DataPagination.vue';
import BooleanBadge from '@/components/BooleanBadge.vue';
import Format8601 from '@/components/Format8601.vue';
import PopConfirm from '@/components/PopConfirm.vue';
import { PencilIcon, Trash2Icon } from '@lucide/vue';
import AddressDiscountsUpsertModal from '@/components/addressDiscounts/AddressDiscountsUpsertModal.vue';
import StreetNameDisplay from '@/components/allowedStreets/StreetNameDisplay.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import useToast from '@/composables/useToast';

const $apiSearch = useApi('addressDiscount.search');
const $apiDelete = useApi('addressDiscount.delete');
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
const defaultSort = { by: 'discount_percent', isDesc: true };
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
            setTableTotalResultsCount(response.pagination?.total || response.total);
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

function onTableSort(val: any) {
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
    <PageTitle>{{ t('Address discounts') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal.show()">
            {{ t('Add address discount') }}
        </Button>
    </div>

    <Overlay :show="$apiSearch.isLoading.value">
        <Table>
            <TableHeader>
                <TableRow>
                    <SortableTableHead
                        sort-key="street_number"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Street number') }}</SortableTableHead>
                    <SortableTableHead
                        sort-key="allowed_street_id"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Street name') }}</SortableTableHead>
                    <SortableTableHead
                        sort-key="discount_percent"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        class="text-right"
                        @sort="onTableSort">{{ t('Discount') }}</SortableTableHead>
                    <SortableTableHead
                        sort-key="active"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Active') }}</SortableTableHead>
                    <SortableTableHead
                        sort-key="created_at"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Created') }}</SortableTableHead>
                    <TableHead class="text-center">{{ t('Actions') }}</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow v-for="(obj, idx) in tableResults" :key="idx">
                    <!-- street number -->
                    <TableCell>{{ obj.street_number }}</TableCell>

                    <!-- street name -->
                    <TableCell>
                        <StreetNameDisplay :id="obj.allowed_street_id" />
                    </TableCell>

                    <!-- Discount -->
                    <TableCell class="text-right">
                        <NumberDisplay
                            :value="obj.discount_percent ? obj.discount_percent / 100 : 0"
                            format="percent"
                            :config="{ maximumFractionDigits: 2 }" />
                    </TableCell>

                    <!-- active -->
                    <TableCell>
                        <BooleanBadge :value="obj.active ?? obj.published ?? false" />
                    </TableCell>

                    <!-- created -->
                    <TableCell>
                        <Format8601 :date="obj.created_at" />
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

    <AddressDiscountsUpsertModal
        ref="upsertModal"
        @success="fetchData" />
</template>
