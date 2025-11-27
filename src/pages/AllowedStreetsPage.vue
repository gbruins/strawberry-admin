<script setup lang="ts">
import  { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/app.js';
import PageTitle from '@/components/layouts/PageTitle.vue';
import FigTableSimple from '@/components/figleaf/tableSimple/TableSimple.vue';
import FigTh from '@/components/figleaf/tableSimple/Th.vue';
import FigTr from '@/components/figleaf/tableSimple/Tr.vue';
import FigTd from '@/components/figleaf/tableSimple/Td.vue';
import FigTrNoResults from '@/components/figleaf/tableSimple/TrNoResults.vue';
import FigPopConfirm from '@/components/figleaf/popConfirm/PopConfirm.vue';
import FigButton from '@/components/figleaf/button/Button.vue';
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';
import FigBooleanTag from '@/components/figleaf/booleanTag/BooleanTag.vue';
import FigPaginationWrapper from '@/components/figleaf/pagination/paginationWrapper/PaginationWrapper.vue';
import AllowedStreetsUpsertModal from '@/components/allowedStreets/AllowedStreetsUpsertModal.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import usePagination from '@/components/figleaf/pagination/usePagination.js';
import useToast from '@/components/figleaf/toast/useToast';

const $apiSearch = useApi('allowedStreet.search');
const $apiDelete = useApi('allowedStreet.delete');
const { t } = useI18n();
const { successToast } = useToast();
const { setData, getPaginationApiParams } = usePagination();
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
const defaultSort = { by: 'street_name', isDesc: false };

function fetchData() {
    return $apiSearch.tryCatch(
        async () => {
            const response = await $apiSearch.run({
                ...getSortApiParams(),
                ...getPaginationApiParams(),
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
    fetchData();
});
</script>

<template>
    <page-title>{{ $t('Allowed streets') }}</page-title>

    <div class="mb-4 text-right">
        <fig-button
            variant="primary"
            @click="upsertModal.show()">
            {{ $t('Add allowed street') }}
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
                        <fig-th sort="street_name" class="text-left">{{ $t('Street name') }}</fig-th>
                        <fig-th sort="active" class="text-left">{{ $t('Active') }}</fig-th>
                        <fig-th class="text-center">{{ $t('Actions') }}</fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="(obj, idx) in tableResults" :key="idx">
                    <!-- street name -->
                    <fig-td>
                        {{ obj.street_name }}
                    </fig-td>

                    <!-- active -->
                    <fig-td>
                        <fig-boolean-tag :value="obj.active" />
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

    <allowed-streets-upsert-modal
        ref="upsertModal"
        @success="fetchData" />
</template>
