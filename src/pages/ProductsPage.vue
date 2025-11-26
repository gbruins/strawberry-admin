<script setup lang="ts">
import  { ref, onMounted } from 'vue';
import PageTitle from '@/components/layouts/PageTitle.vue';
import FigTableSimple from '@/components/figleaf/tableSimple/TableSimple.vue';
import FigTh from '@/components/figleaf/tableSimple/Th.vue';
import FigTr from '@/components/figleaf/tableSimple/Tr.vue';
import FigTd from '@/components/figleaf/tableSimple/Td.vue';
import FigTrNoResults from '@/components/figleaf/tableSimple/TrNoResults.vue';
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';
import FigMoney from '@/components/figleaf/money/Money.vue';
import FigBooleanTag from '@/components/figleaf/booleanTag/BooleanTag.vue';
import FigPaginationWrapper from '@/components/figleaf/pagination/paginationWrapper/PaginationWrapper.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import usePagination from '@/components/figleaf/pagination/usePagination.js';

const $apiSearch = useApi('product.search');
const $apiRead = useApi('product.read');
const $apiCreate = useApi('product.create');
const $apiUpdate = useApi('product.update');
const $apiDelete = useApi('product.delete');
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


const createdProductId = ref<string | null>(null);

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

function onTableSort(val) {
    onSort(val);
    fetchData();
}

function onPaginationChange(data) {
    setData(data);
    fetchData();
}

onMounted(() => {
    fetchData();
});
</script>

<template>
    <page-title>{{ $t('Products') }}</page-title>

    <fig-overlay :show="$apiSearch.isLoading.value">
        <fig-pagination-wrapper
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
                        <fig-th sort="title" class="text-left">{{ $t('Title') }}</fig-th>
                        <fig-th class="text-left">{{ $t('Type') }}</fig-th>
                        <fig-th sort="base_price" class="text-right">{{ $t('Price') }}</fig-th>
                        <fig-th sort="published" class="text-left">{{ $t('Published') }}</fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="(obj, idx) in tableResults" :key="idx">
                    <!-- image -->
                    <fig-td>
                        {{ obj.title }}
                    </fig-td>

                    <!-- title -->
                    <fig-td>
                        {{ obj.product_type }}
                    </fig-td>

                    <!-- price -->
                    <fig-td class="text-right">
                        <fig-money :cents="obj.base_price" />
                    </fig-td>

                    <!-- published -->
                    <fig-td>
                        <fig-boolean-tag :value="obj.published" />
                    </fig-td>
                </fig-tr>

                <fig-tr-no-results v-if="tableHasNoResults" :colspan="8" />
            </fig-table-simple>
        </fig-pagination-wrapper>
    </fig-overlay>
</template>
