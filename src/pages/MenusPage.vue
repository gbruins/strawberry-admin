<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
import FigBooleanTag from '@/components/figleaf/booleanTag/BooleanTag.vue';
import FigFormat8601 from '@/components/figleaf/format8601/Format8601.vue';
import MenuUpsertModal from '@/components/menus/MenuUpsertModal.vue';
import MenuProductsModal from '@/components/menus/MenuProductsModal.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import usePagination from '@/components/figleaf/pagination/usePagination.js';
import useToast from '@/components/figleaf/toast/useToast';

const $apiSearch = useApi('serviceMenu.search');
const $apiDelete = useApi('serviceMenu.delete');
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
const productsModal = ref(null);
const defaultSort = { by: 'title', isDesc: false };

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

            successToast({ title: t('Item deleted successfully') });

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
    fetchData();
});
</script>

<template>
    <page-title>{{ $t('Menus') }}</page-title>

    <div class="mb-4 text-right">
        <fig-button variant="primary" @click="upsertModal.show()">
            {{ $t('Add menu') }}
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
                        <fig-th sort="title" class="text-left">{{ $t('Title') }}</fig-th>
                        <fig-th sort="published" class="text-left">{{ $t('Published') }}</fig-th>
                        <fig-th class="text-right">{{ $t('Products') }}</fig-th>
                        <fig-th class="text-left">{{ $t('Used by services') }}</fig-th>
                        <fig-th>{{ $t('Actions') }}</fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="obj in tableResults" :key="obj.id" data-test="menu-row">
                    <fig-td>{{ obj.title }}</fig-td>

                    <fig-td>
                        <fig-boolean-tag :value="obj.published" />
                    </fig-td>

                    <fig-td class="text-right">{{ obj.product_count }}</fig-td>

                    <fig-td>
                        <div v-for="svc in obj.services" :key="svc.id">
                            <fig-format8601 :date="svc.start_at" />
                        </div>
                    </fig-td>

                    <fig-td>
                        <div class="flex items-center justify-center w-full gap-4">
                            <fig-button
                                variant="plain"
                                iconOnly
                                icon="edit"
                                data-test="edit"
                                @click="upsertModal.show(obj.id)" />

                            <fig-button
                                variant="ghost"
                                data-test="products"
                                @click="productsModal.show(obj)">
                                {{ $t('Products') }}
                            </fig-button>

                            <fig-pop-confirm @confirm="onDeleteItem(obj.id)">
                                <template v-slot:reference>
                                    <fig-button
                                        variant="danger"
                                        iconOnly
                                        icon="trash"
                                        data-test="delete" />
                                </template>
                                <div v-if="obj.services?.length" data-test="delete-warning">
                                    {{ $t('These services use this menu and will show no menu:') }}
                                    <ul class="list-disc ml-5">
                                        <li v-for="svc in obj.services" :key="svc.id">
                                            <fig-format8601 :date="svc.start_at" />
                                        </li>
                                    </ul>
                                </div>
                                {{ $t('Delete this item?') }}
                            </fig-pop-confirm>
                        </div>
                    </fig-td>
                </fig-tr>

                <fig-tr-no-results v-if="tableHasNoResults" :colspan="5" />
            </fig-table-simple>
        </fig-pagination-wrapper>
    </fig-overlay>

    <menu-upsert-modal ref="upsertModal" @success="fetchData" />
    <menu-products-modal ref="productsModal" @success="fetchData" />
</template>
