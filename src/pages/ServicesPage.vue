<script setup lang="ts">
import  { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import FigTableSimple from '@/components/figleaf/tableSimple/TableSimple.vue';
import FigTh from '@/components/figleaf/tableSimple/Th.vue';
import FigTr from '@/components/figleaf/tableSimple/Tr.vue';
import FigTd from '@/components/figleaf/tableSimple/Td.vue';
import FigTrNoResults from '@/components/figleaf/tableSimple/TrNoResults.vue';
import FigButton from '@/components/figleaf/button/Button.vue';
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';
import FigPaginationWrapper from '@/components/figleaf/pagination/paginationWrapper/PaginationWrapper.vue';
import FigPopConfirm from '@/components/figleaf/popConfirm/PopConfirm.vue';
import FigFormat8601 from '@/components/figleaf/format8601/Format8601.vue';
import ServiceUpsertModal from '@/components/services/ServiceUpsertModal.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import usePagination from '@/components/figleaf/pagination/usePagination.js';
import useToast from '@/components/figleaf/toast/useToast';

const $apiSearch = useApi('service.search');
const $apiMenus = useApi('serviceMenu.search');
const menuTitles = ref<Record<string, string>>({});
const $apiDelete = useApi('service.delete');
const { t } = useI18n();
const { successToast } = useToast();
const { setData, getPaginationApiParams } = usePagination();
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
const defaultSort = { by: 'start_at', isDesc: true };

function fetchMenus() {
    return $apiMenus.tryCatch(
        async () => {
            const response = await $apiMenus.run({ _pageSize: 500 });
            menuTitles.value = Object.fromEntries((response.data || []).map((m) => [m.id, m.title]));
        }
    );
}

function fetchData() {
    return $apiSearch.tryCatch(
        async () => {
            const response = await $apiSearch.run({
                ...getSortApiParams(),
                ...getPaginationApiParams(),
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
    onSort(val);
    fetchData();
}

function onPaginationChange(data) {
    setData(data);
    fetchData();
}

onMounted(() => {
    onSort(defaultSort);
    fetchMenus();
    fetchData();
});
</script>

<template>
    <page-title>{{ $t('Service') }}</page-title>

    <div class="mb-4 text-right">
        <fig-button
            variant="primary"
            @click="upsertModal.show()">
            {{ $t('Add service') }}
        </fig-button>
    </div>

    <fig-overlay :show="$apiSearch.isLoading.value">
        <fig-pagination-wrapper
            bottom
            :total-rows="tableTotalResultsCount"
            @pageSize="onPaginationChange"
            @pageNumber="onPaginationChange">
            <fig-table-simple
                striped
                hover
                @sort="onTableSort"
                :default-sort-by="defaultSort.by"
                :default-sort-desc="defaultSort.isDesc">
                <template #head>
                    <fig-tr>
                        <fig-th sort="start_at" class="text-left">{{ $t('Start at') }}</fig-th>
                        <fig-th sort="end_at" class="text-left">{{ $t('End at') }}</fig-th>
                        <fig-th class="text-left">{{ $t('Notes') }}</fig-th>
                        <fig-th class="text-left">{{ $t('Menu') }}</fig-th>
                        <fig-th class="text-right">{{ $t('Max per order') }}</fig-th>
                        <fig-th sort="inventory_count" class="text-right">{{ $t('Dough count') }}</fig-th>
                        <fig-th>{{ $t('Actions') }}</fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="(obj, idx) in tableResults" :key="idx">
                    <!-- start_at -->
                    <fig-td>
                        <fig-format8601 :date="obj.start_at" />
                    </fig-td>

                    <!-- end_at -->
                    <fig-td>
                        <fig-format8601 :date="obj.end_at" />
                    </fig-td>

                    <!-- notes -->
                    <fig-td>
                        {{ obj.notes }}
                    </fig-td>

                    <!-- menu -->
                    <fig-td>
                        {{ menuTitles[obj.service_menu_id] || '' }}
                    </fig-td>

                    <!-- max_per_order -->
                    <fig-td class="text-right">
                        {{ obj.max_per_order }}
                    </fig-td>

                    <!-- dough_count -->
                    <fig-td class="text-right">
                        {{ obj.inventory_count }}
                    </fig-td>

                    <!-- actions -->
                    <fig-td>
                        <div class="flex items-center justify-center w-full gap-4">
                            <fig-button
                                variant="plain"
                                iconOnly
                                icon="edit"
                                @click="upsertModal.show(obj.id)" />

                            <fig-pop-confirm
                                @confirm="onDeleteItem(obj.id)">
                                <template v-slot:reference>
                                    <fig-button
                                        variant="danger"
                                        iconOnly
                                        icon="trash" />
                                </template>
                                {{ $t('Delete this item?') }}
                            </fig-pop-confirm>
                        </div>
                    </fig-td>
                </fig-tr>

                <fig-tr-no-results v-if="tableHasNoResults" :colspan="8" />
            </fig-table-simple>
        </fig-pagination-wrapper>
    </fig-overlay>

    <service-upsert-modal
        ref="upsertModal"
        @success="fetchData" />
</template>
