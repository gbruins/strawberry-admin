<script setup lang="ts">
import  { ref, onMounted } from 'vue';
import PageTitle from '@/components/layouts/PageTitle.vue';
import FigTableSimple from '@/components/tableSimple/TableSimple.vue';
import FigTh from '@/components/tableSimple/Th.vue';
import FigTr from '@/components/tableSimple/Tr.vue';
import FigTd from '@/components/tableSimple/Td.vue';
import FigTrNoResults from '@/components/tableSimple/TrNoResults.vue';
import Overlay from '@/components/overlay/Overlay.vue';
import BooleanTag from '@/components/booleanTag/BooleanTag.vue';
import PaginationWrapper from '@/components/pagination/paginationWrapper/PaginationWrapper.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import usePagination from '@/components/pagination/usePagination.js';

// API - assume allowedStreet.search endpoint
const $apiSearch = useApi('allowedStreet.search');
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

function getAllowedStreets() {
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

function onTableSort(val) {
    onSort(val);
    getAllowedStreets();
}

function onPaginationChange(data) {
    setData(data);
    getAllowedStreets();
}

onMounted(() => {
    getAllowedStreets();
});
</script>

<template>
    <page-title>{{ $t('Allowed streets') }}</page-title>

    <overlay :show="$apiSearch.isLoading.value">
        <pagination-wrapper
            bottom
            :total-rows="tableTotalResultsCount"
            @pageSize="onPaginationChange"
            @pageNumber="onPaginationChange">
            <fig-table-simple
                striped
                hover
                @sort="onTableSort">
                <template #head>
                    <fig-tr>
                        <fig-th sort="street" class="text-left">{{ $t('Street name') }}</fig-th>
                        <fig-th sort="active" class="text-left">{{ $t('Active') }}</fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="(obj, idx) in tableResults" :key="idx">
                    <fig-td>
                        {{ obj.street_name }}
                    </fig-td>

                    <fig-td>
                        <boolean-tag :value="obj.active" />
                    </fig-td>
                </fig-tr>

                <fig-tr-no-results v-if="tableHasNoResults" :colspan="8" />
            </fig-table-simple>
        </pagination-wrapper>
    </overlay>
</template>

<style>
</style>
