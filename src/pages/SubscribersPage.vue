<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import SortableTableHead from '@/components/SortableTableHead.vue';
import Overlay from '@/components/Overlay.vue';
import DataPagination from '@/components/DataPagination.vue';
import BooleanBadge from '@/components/BooleanBadge.vue';
import Format8601 from '@/components/Format8601.vue';
import PopConfirm from '@/components/PopConfirm.vue';
import { Trash2Icon } from '@lucide/vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import useToast from '@/composables/useToast';

const $apiSearch = useApi('emailSubscriber.search');
const $apiDelete = useApi('emailSubscriber.delete');
const $apiCount = useApi('emailSubscriber.count');
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

const activeCount = ref(0);
const pageSize = ref(100);
const pageNumber = ref(1);
const defaultSort = { by: 'subscribed_at', isDesc: true };
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

async function fetchCount() {
    const response = await $apiCount.run();
    activeCount.value = response.data.activeCount;
}

function onRemoveItem(id: string) {
    return $apiDelete.tryCatch(
        async () => {
            await $apiDelete.run(id);

            successToast({
                title: t('Subscriber removed')
            });

            fetchData();
            fetchCount();
        }
    );
}

function onTableSort(val: any) {
    activeSort.value = val;
    onSort(val);
    fetchData();
}

onMounted(() => {
    onSort(defaultSort);
    fetchData();
    fetchCount();
});
</script>

<template>
    <PageTitle>{{ t('Subscribers') }}</PageTitle>

    <p class="mb-4 text-sm text-muted-foreground" data-test="active-count">
        {{ t('Active subscribers') }}: {{ activeCount }}
    </p>

    <Overlay :show="$apiSearch.isLoading.value">
        <Table>
            <TableHeader>
                <TableRow>
                    <SortableTableHead
                        sort-key="email"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Email') }}</SortableTableHead>
                    <SortableTableHead
                        sort-key="status"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Status') }}</SortableTableHead>
                    <SortableTableHead
                        sort-key="subscribed_at"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Subscribed') }}</SortableTableHead>
                    <TableHead class="text-center">{{ t('Actions') }}</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow v-for="(obj, idx) in tableResults" :key="idx">
                    <TableCell>{{ obj.email }}</TableCell>

                    <TableCell>
                        <BooleanBadge
                            :value="obj.status === 'subscribed'"
                            :true-label="t('Subscribed')"
                            :false-label="t('Unsubscribed')" />
                    </TableCell>

                    <TableCell>
                        <Format8601 :date="obj.subscribed_at" />
                    </TableCell>

                    <TableCell>
                        <div class="flex items-center justify-center w-full">
                            <PopConfirm
                                v-if="obj.status === 'subscribed'"
                                @confirm="onRemoveItem(obj.id)">
                                <template v-slot:reference>
                                    <Button variant="destructive" size="icon" data-test="remove-subscriber">
                                        <Trash2Icon />
                                    </Button>
                                </template>
                                {{ t('Remove this subscriber?') }}
                            </PopConfirm>
                        </div>
                    </TableCell>
                </TableRow>

                <TableRow v-if="tableHasNoResults">
                    <TableCell colspan="4" class="text-center text-muted-foreground">{{ t('No data') }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <DataPagination
            v-model:page-size="pageSize"
            v-model:page-number="pageNumber"
            :total-rows="tableTotalResultsCount" />
    </Overlay>
</template>
