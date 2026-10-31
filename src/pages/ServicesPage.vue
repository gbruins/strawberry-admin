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
import { PencilIcon, Trash2Icon, MailIcon } from '@lucide/vue';
import Format8601 from '@/components/Format8601.vue';
import ServiceUpsertModal from '@/components/services/ServiceUpsertModal.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import useToast from '@/composables/useToast';

const $apiSearch = useApi('service.search');
const $apiMenus = useApi('serviceMenu.search');
const menus = ref<Record<string, { title: string, published: boolean }>>({});
const { t } = useI18n();

// A service whose menu is missing (deleted) or unpublished shows no menu to visitors
function menuProblem(id: string | null) {
    if(!id) {
        return null;
    }

    const menu = menus.value[id];
    return !menu ? t('Menu deleted') : (!menu.published ? t('Menu not published') : null);
}

// Hide the notify button once the window it'd be advertising has already ended, so staff
// can't email subscribers about an opening that's no longer actually available.
function serviceHasEnded(endAt: string) {
    return new Date(endAt).getTime() < Date.now();
}
const $apiDelete = useApi('service.delete');
const $apiNotify = useApi('notification.send');
const { successToast, addToast } = useToast();
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
const defaultSort = { by: 'start_at', isDesc: true };
const activeSort = ref({ ...defaultSort });

function fetchMenus() {
    return $apiMenus.tryCatch(
        async () => {
            const response = await $apiMenus.run({ _pageSize: 500 });
            menus.value = Object.fromEntries((response.data || []).map((m) => [m.id, { title: m.title, published: m.published }]));
        }
    );
}

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

function onNotify(id: string) {
    return $apiNotify.tryCatch(
        async () => {
            const response = await $apiNotify.run(id);

            if (response.data.recipientCount === 0) {
                addToast({ title: t('No subscribers to notify yet') });
                return;
            }

            successToast({
                title: t('Notification sent'),
                text: t('Sent to {count} subscriber(s)', { count: response.data.recipientCount })
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
    fetchMenus();
    fetchData();
});
</script>

<template>
    <PageTitle>{{ t('Service') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal.show()">
            {{ t('Add service') }}
        </Button>
    </div>

    <Overlay :show="$apiSearch.isLoading.value">
        <Table>
            <TableHeader>
                <TableRow>
                    <SortableTableHead
                        sort-key="start_at"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Start at') }}</SortableTableHead>
                    <SortableTableHead
                        sort-key="end_at"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('End at') }}</SortableTableHead>
                    <TableHead>{{ t('Notes') }}</TableHead>
                    <TableHead>{{ t('Menu') }}</TableHead>
                    <TableHead class="text-right">{{ t('Max per order') }}</TableHead>
                    <SortableTableHead
                        sort-key="inventory_count"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        class="text-right"
                        @sort="onTableSort">{{ t('Dough count') }}</SortableTableHead>
                    <TableHead>{{ t('Actions') }}</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow v-for="(obj, idx) in tableResults" :key="idx">
                    <!-- start_at -->
                    <TableCell>
                        <Format8601 :date="obj.start_at" />
                    </TableCell>

                    <!-- end_at -->
                    <TableCell>
                        <Format8601 :date="obj.end_at" />
                    </TableCell>

                    <!-- notes -->
                    <TableCell>
                        {{ obj.notes }}
                        <div v-if="obj.last_notified_at" class="text-sm text-muted-foreground" data-test="last-notified">
                            {{ t('Notified') }} <Format8601 :date="obj.last_notified_at" />
                        </div>
                    </TableCell>

                    <!-- menu -->
                    <TableCell>
                        {{ menus[obj.service_menu_id]?.title || '' }}
                        <div v-if="menuProblem(obj.service_menu_id)" class="text-sm text-amber-700" data-test="menu-problem">
                            {{ menuProblem(obj.service_menu_id) }}
                        </div>
                    </TableCell>

                    <!-- max_per_order -->
                    <TableCell class="text-right">{{ obj.max_per_order }}</TableCell>

                    <!-- dough_count -->
                    <TableCell class="text-right">{{ obj.inventory_count }}</TableCell>

                    <!-- actions -->
                    <TableCell>
                        <div class="flex items-center justify-center w-full gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                @click="upsertModal.show(obj.id)">
                                <PencilIcon />
                            </Button>

                            <PopConfirm v-if="!serviceHasEnded(obj.end_at)" @confirm="onNotify(obj.id)">
                                <template v-slot:reference>
                                    <!-- Disabled while a send is in flight (found by QA review:
                                    unlike Delete, a duplicate notify isn't idempotent — it
                                    really does double-email every subscriber). -->
                                    <Button variant="ghost" size="icon" data-test="notify-subscribers" :disabled="$apiNotify.isLoading.value">
                                        <MailIcon />
                                    </Button>
                                </template>
                                {{ obj.last_notified_at ? t('Notify subscribers again about this opening?') : t('Notify subscribers about this opening?') }}
                            </PopConfirm>

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
                    <TableCell colspan="7" class="text-center text-muted-foreground">{{ t('No data') }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <DataPagination
            v-model:page-size="pageSize"
            v-model:page-number="pageNumber"
            :total-rows="tableTotalResultsCount" />
    </Overlay>

    <ServiceUpsertModal
        ref="upsertModal"
        @success="fetchData" />
</template>
