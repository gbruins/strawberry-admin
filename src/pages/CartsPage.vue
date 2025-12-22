<script setup lang="ts">
import  { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import SearchFilterLayout from '@/components/layouts/SearchFilterLayout.vue';
import FigTableSimple from '@/components/figleaf/tableSimple/TableSimple.vue';
import FigTh from '@/components/figleaf/tableSimple/Th.vue';
import FigTr from '@/components/figleaf/tableSimple/Tr.vue';
import FigTd from '@/components/figleaf/tableSimple/Td.vue';
import FigTrNoResults from '@/components/figleaf/tableSimple/TrNoResults.vue';
import FilterGrid from '@/components/layouts/FilterGrid.vue';
import FigButton from '@/components/figleaf/button/Button.vue';
import FigFormGroup from '@/components/figleaf/form/group/FormGroup.vue';
import FigFormMultiSelect from '@/components/figleaf/form/multiselect/FormMultiSelect.vue';
import FigPaginationWrapper from '@/components/figleaf/pagination/paginationWrapper/PaginationWrapper.vue';
import FigPopConfirm from '@/components/figleaf/popConfirm/PopConfirm.vue';
import FigFormat8601 from '@/components/figleaf/format8601/Format8601.vue';
import FigMoney from '@/components/figleaf/money/Money.vue';
import FigNumber from '@/components/figleaf/number/Number.vue';
import FigAddress from '@/components/figleaf/address/Address.vue';
import FigTag from '@/components/figleaf/tag/Tag.vue';
import FigTooltip from '@/components/figleaf/tooltip/Tooltip.vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import usePagination from '@/components/figleaf/pagination/usePagination.js';
import useToast from '@/components/figleaf/toast/useToast';

const $apiSearch = useApi('cart.search');
const $apiDelete = useApi('cart.delete');
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

const defaultSort = { by: 'created_at', isDesc: true };

const filters = reactive({
    isClosed: true
});

function fetchData() {
    return $apiSearch.tryCatch(
        async () => {
            const params = {
                ...getSortApiParams(),
                ...getPaginationApiParams(),
            };

            if (filters.isClosed === true || filters.isClosed === false) {
                params.closed_at = JSON.stringify({ is_null: filters.isClosed ? false : true });
            }

            const response = await $apiSearch.run(params);

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
    fetchData();
});
</script>

<template>
    <page-title>{{ $t('Carts') }}</page-title>

    <search-filter-layout
        :loading="$apiSearch.isLoading.value || $apiDelete.isLoading.value">
        <template #filters>
            <filter-grid>
                <!-- is closed -->
                <fig-form-group>
                    <template #label>{{ $t('Cart status') }}</template>

                    <fig-form-multi-select
                        v-model="filters.isClosed"
                        :options="[
                            { label: t('Closed'), value: true },
                            { label: t('Open'), value: false }
                        ]"
                        size="sm" />
                </fig-form-group>
            </filter-grid>

            <div class="mt-5">
                <fig-button
                    variant="primary"
                    @click="fetchData">
                    {{ $t('Apply filters') }}
                </fig-button>
            </div>
        </template>

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
                        <fig-th sort="created_at">{{ $t('Created') }}</fig-th>
                        <fig-th>{{ $t('Status') }}</fig-th>
                        <fig-th>{{ $t('Grand total') }}</fig-th>
                        <fig-th>{{ $t('Subtotal') }}</fig-th>
                        <fig-th>{{ $t('Tax') }}</fig-th>
                        <fig-th>{{ $t('# items') }}</fig-th>
                        <fig-th>{{ $t('Billing address') }}</fig-th>
                        <fig-th class="w-30"></fig-th>
                    </fig-tr>
                </template>

                <fig-tr v-for="(obj, idx) in tableResults" :key="idx">
                    <!-- Created -->
                    <fig-td>
                        <router-link
                            :to="{ name: 'cart', params: { id: obj.id }}"
                            tag="a">
                            <fig-format8601 :date="obj.created_at " />
                        </router-link>
                    </fig-td>

                    <!-- Status -->
                    <fig-td>
                        <fig-tooltip v-if="obj.closed_at">
                            <template v-slot:toggler>
                                <fig-tag variant="success">{{ $t('Closed') }}</fig-tag>
                            </template>
                            <fig-format8601 :date="obj.closed_at" />
                        </fig-tooltip>

                        <fig-tag v-else variant="error">{{ $t('Open') }}</fig-tag>
                    </fig-td>

                    <!-- grand total -->
                    <fig-td class="text-right">
                        <fig-money :cents="obj.grand_total" />
                    </fig-td>

                    <!-- subtotal -->
                    <fig-td class="text-right">
                        <fig-money :cents="obj.price_subtotal" />
                    </fig-td>

                    <!-- tax -->
                    <fig-td class="text-right">
                        <fig-money :cents="obj.price_tax" />
                    </fig-td>

                    <!-- number of items -->
                    <fig-td class="text-right">
                        <fig-number :value="obj.num_items" />
                    </fig-td>

                    <!-- billing address -->
                    <fig-td>
                        <fig-address
                            :first-name="obj.billing_firstName"
                            :last-name="obj.billing_lastName"
                            :company="obj.billing_company"
                            :street-address="obj.billing_streetAddress"
                            :extended-address="obj.billing_extendedAddress"
                            :city="obj.billing_city"
                            :state="obj.billing_state"
                            :zip="obj.billing_postalCode"
                            :country-code="obj.billing_countryCodeAlpha2" />
                    </fig-td>

                    <!-- actions -->
                    <fig-td>
                        <div class="flex items-center justify-center w-full gap-4">
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
    </search-filter-layout>
</template>
