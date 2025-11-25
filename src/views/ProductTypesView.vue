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

const $apiSearch = useApi('productType.search');
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

function getProductTypes() {
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
    getProductTypes();
}

function onPaginationChange(data) {
    setData(data);
    getProductTypes();
}

onMounted(() => {
    getProductTypes();
});
</script>

<template>
    <page-title>{{ $t('Product types') }}</page-title>

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
                        <fig-th sort="title" class="text-left">{{ $t('Name') }}</fig-th>
                        <fig-th sort="title" class="text-left">{{ $t('Description') }}</fig-th>
                        <!-- <fig-th class="text-left">{{ $t('Slug') }}</fig-th> -->
                         <fig-th sort="published" class="text-left">{{ $t('Published') }}</fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="(obj, idx) in tableResults" :key="idx">
                    <fig-td>
                        {{ obj.name }}
                    </fig-td>

                    <fig-td>
                        {{ obj.description }}
                    </fig-td>

                    <!-- <fig-td>
                        {{ obj.slug }}
                    </fig-td> -->

                    <fig-td>
                        <boolean-tag :value="obj.published" />
                    </fig-td>
                </fig-tr>

                <fig-tr-no-results v-if="tableHasNoResults" :colspan="8" />
            </fig-table-simple>
        </pagination-wrapper>
    </overlay>
</template>

<style>
</style>
