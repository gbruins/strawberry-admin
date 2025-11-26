<script setup lang="ts">
import  { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import FigTableSimple from '@/components/tableSimple/TableSimple.vue';
import FigTh from '@/components/tableSimple/Th.vue';
import FigTr from '@/components/tableSimple/Tr.vue';
import FigTd from '@/components/tableSimple/Td.vue';
import FigTrNoResults from '@/components/tableSimple/TrNoResults.vue';
import FigButton from '@/components/button/Button.vue';
import FigNumber from '@/components/number/Number.vue';
import Overlay from '@/components/overlay/Overlay.vue';
import BooleanTag from '@/components/booleanTag/BooleanTag.vue';
import PaginationWrapper from '@/components/pagination/paginationWrapper/PaginationWrapper.vue';
import FigFormat8601 from '@/components/format8601/Format8601.vue';
import FigPopConfirm from '@/components/popConfirm/PopConfirm.vue';
import AddressDiscountsUpsertModal from '@/components/addressDiscounts/AddressDiscountsUpsertModal.vue';
import StreetNameDisplay from '@/components/allowedStreets/StreetNameDisplay.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import usePagination from '@/components/pagination/usePagination.js';
import useToast from '@/components/toast/useToast';

const $apiSearch = useApi('addressDiscount.search');
const $apiDelete = useApi('addressDiscount.delete');
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

function deleteAddressDiscount(id: number) {
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

function onTableSort(val: any) {
    onSort(val);
    fetchData();
}

function onPaginationChange(data: any) {
    setData(data);
    fetchData();
}

onMounted(() => {
    fetchData();
});
</script>

<template>
    <page-title>{{ $t('Address discounts') }}</page-title>

    <div class="mb-4 text-right">
        <fig-button
            variant="primary"
            @click="upsertModal.show()">
            {{ $t('Add address discount') }}
        </fig-button>
    </div>

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
                        <fig-th sort="street_number"class="text-left">{{ $t('Street number') }}</fig-th>
                        <fig-th sort="allowed_street_id" class="text-left">{{ $t('Street name') }}</fig-th>
                        <fig-th sort="discount_percent" class="text-right">{{ $t('Discount') }}</fig-th>
                        <fig-th sort="active" class="text-left">{{ $t('Active') }}</fig-th>
                        <fig-th sort="created_at" class="text-left">{{ $t('Created') }}</fig-th>
                        <fig-th class="text-center">{{ $t('Actions') }}</fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="(obj, idx) in tableResults" :key="idx">
                    <!-- street number -->
                    <fig-td>
                        {{ obj.street_number }}
                    </fig-td>

                    <!-- street name -->
                    <fig-td>
                        <street-name-display :id="obj.allowed_street_id" />
                    </fig-td>

                    <!-- Discount -->
                    <fig-td class="text-right">
                        <fig-number
                            :value="obj.discount_percent ? obj.discount_percent / 100 : 0"
                            format="percent"
                            :config="{ maximumFractionDigits: 2 }" />
                    </fig-td>

                    <!-- active -->
                    <fig-td>
                        <boolean-tag :value="obj.active ?? obj.published ?? false" />
                    </fig-td>

                    <!-- created -->
                    <fig-td>
                        <fig-format8601 :date="obj.created_at" />
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
                                @confirm="deleteAddressDiscount(obj.id)">
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
        </pagination-wrapper>
    </overlay>

    <address-discounts-upsert-modal
        ref="upsertModal"
        @success="fetchData" />
</template>

<style>
</style>
