<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/app.js';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import SortableTableHead from '@/components/SortableTableHead.vue';
import Overlay from '@/components/Overlay.vue';
import DataPagination from '@/components/DataPagination.vue';
import BooleanBadge from '@/components/BooleanBadge.vue';
import { PencilIcon } from '@lucide/vue';
import AllowedStreetsUpsertModal from '@/components/allowedStreets/AllowedStreetsUpsertModal.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import useToast from '@/composables/useToast';

const $apiSearch = useApi('allowedStreet.search');
const $apiDelete = useApi('allowedStreet.delete');
const $apiUpdate = useApi('allowedStreet.update');
const { t } = useI18n();
const { successToast } = useToast();
const appStore = useAppStore();
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
const defaultSort = { by: 'street_name', isDesc: false };
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
            appStore.updateAllowedStreetsState();
        }
    );
}

function toggleActive(allowedStreet) {
    return $apiUpdate.tryCatch(
        async () => {
            await $apiUpdate.run({
                id: allowedStreet.id,
                active: !allowedStreet.active
            });

            successToast({
                title: t(!allowedStreet.active ? 'Deactivated: {name}' : 'Activated: {name}', { name: allowedStreet.street_name })
            });

            appStore.updateAllowedStreetsState();
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
    <PageTitle>{{ t('Allowed streets') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal.show()">
            {{ t('Add allowed street') }}
        </Button>
    </div>

    <Overlay :show="$apiSearch.isLoading.value">
        <Table>
            <TableHeader>
                <TableRow>
                    <SortableTableHead
                        sort-key="street_name"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Street name') }}</SortableTableHead>
                    <SortableTableHead
                        sort-key="active"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Active') }}</SortableTableHead>
                    <TableHead class="text-center">{{ t('Actions') }}</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow v-for="(obj, idx) in tableResults" :key="idx">
                    <!-- street name -->
                    <TableCell>{{ obj.street_name }}</TableCell>

                    <!-- active -->
                    <TableCell>
                        <BooleanBadge :value="obj.active" />
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

                            <Button
                                :variant="obj.active ? 'destructive' : 'outline'"
                                @click="toggleActive(obj)">{{ t(obj.active ? 'Deactivate' : 'Activate') }}</Button>
                        </div>
                    </TableCell>
                </TableRow>

                <TableRow v-if="tableHasNoResults">
                    <TableCell colspan="3" class="text-center text-muted-foreground">{{ t('No data') }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <DataPagination
            v-model:page-size="pageSize"
            v-model:page-number="pageNumber"
            :total-rows="tableTotalResultsCount" />
    </Overlay>

    <AllowedStreetsUpsertModal
        ref="upsertModal"
        @success="fetchData" />
</template>
