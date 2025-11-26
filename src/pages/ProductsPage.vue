<script setup lang="ts">
import  { ref, onMounted } from 'vue';
import PageTitle from '@/components/layouts/PageTitle.vue';
import FigTableSimple from '@/components/tableSimple/TableSimple.vue';
import FigTh from '@/components/tableSimple/Th.vue';
import FigTr from '@/components/tableSimple/Tr.vue';
import FigTd from '@/components/tableSimple/Td.vue';
import FigTrNoResults from '@/components/tableSimple/TrNoResults.vue';
import Overlay from '@/components/overlay/Overlay.vue';
import Money from '@/components/money/Money.vue';
import BooleanTag from '@/components/booleanTag/BooleanTag.vue';
import PaginationWrapper from '@/components/pagination/paginationWrapper/PaginationWrapper.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import usePagination from '@/components/pagination/usePagination.js';

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

function getProducts() {
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

// function getProduct() {
//     return $apiRead.tryCatch(
//         async () => {
//             const response = await $apiRead.run('28a97dc5-134f-4524-88cf-3b7d2ee6094a');
//         }
//     );
// }

// function createProduct() {
//     return $apiCreate.tryCatch(
//         async () => {
//             const response = await $apiCreate.run({
//                 title: 'New Product',
//                 description: 'A brand new product',
//                 product_type: 1,
//                 base_price: 1999,
//                 published: true
//             });
//             createdProductId.value = response.data.id
//             console.log('Product created successfully', response.data);
//         }
//     );
// }

// function updateProduct() {
//     return $apiUpdate.tryCatch(
//         async () => {
//             const response = await $apiUpdate.run(createdProductId.value, {
//                 title: 'Updated Product Title'
//             });
//             console.log('Product updated successfully', response.data);
//         }
//     );
// }

// function deleteProduct() {
//     return $apiDelete.tryCatch(
//         async () => {
//             const response = await $apiDelete.run(createdProductId.value);
//             console.log('Product deleted successfully', response.data);
//         }
//     );
// }

function onTableSort(val) {
    onSort(val);
    getProducts();
}

function onPaginationChange(data) {
    setData(data);
    getProducts();
}

onMounted(() => {
    getProducts();
});
</script>

<template>
    <page-title>{{ $t('Products') }}</page-title>

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
                        <money :cents="obj.base_price" />
                    </fig-td>

                    <!-- published -->
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
