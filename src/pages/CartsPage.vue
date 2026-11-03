<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import SearchFilterLayout from '@/components/layouts/SearchFilterLayout.vue';
import FilterGrid from '@/components/layouts/FilterGrid.vue';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import SortableTableHead from '@/components/SortableTableHead.vue';
import DataPagination from '@/components/DataPagination.vue';
import PopConfirm from '@/components/PopConfirm.vue';
import SearchableSelect from '@/components/SearchableSelect.vue';
import Format8601 from '@/components/Format8601.vue';
import Money from '@/components/Money.vue';
import NumberDisplay from '@/components/NumberDisplay.vue';
import AddressDisplay from '@/components/AddressDisplay.vue';
import { Trash2Icon } from '@lucide/vue';
import useApi from '@/composables/useApi';
import useTable from '@/composables/useTable';
import useToast from '@/composables/useToast';

const $apiSearch = useApi('cart.search');
const $apiDelete = useApi('cart.delete');
const { t } = useI18n();
const { successToast } = useToast();
const {
    onSort,
    getSortApiParams,
    setTableResults,
    setTableTotalResultsCount,
    tableResults,
    tableTotalResultsCount,
    tableHasNoResults
} = useTable();

const pageSize = ref(100);
const pageNumber = ref(1);
const defaultSort = { by: 'created_at', isDesc: true };
const activeSort = ref({ ...defaultSort });

const filters = reactive({
    isClosed: true
});

function fetchData() {
    return $apiSearch.tryCatch(
        async () => {
            const params: Record<string, any> = {
                ...getSortApiParams(),
                _page: pageNumber.value,
                _pageSize: pageSize.value
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
    activeSort.value = val;
    onSort(val);
    fetchData();
}

watch([pageSize, pageNumber], fetchData);

onMounted(() => {
    onSort(defaultSort);
    fetchData();
});
</script>

<template>
    <PageTitle>{{ t('Carts') }}</PageTitle>

    <SearchFilterLayout :loading="$apiSearch.isLoading.value || $apiDelete.isLoading.value">
        <template #filters>
            <FilterGrid>
                <!-- is closed -->
                <div class="grid gap-1.5">
                    <Label>{{ t('Cart status') }}</Label>

                    <SearchableSelect
                        v-model="filters.isClosed"
                        :options="[
                            { label: t('Closed'), value: true },
                            { label: t('Open'), value: false }
                        ]" />
                </div>
            </FilterGrid>

            <div class="mt-5">
                <Button @click="fetchData">
                    {{ t('Apply filters') }}
                </Button>
            </div>
        </template>

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{{ t('Pickup code') }}</TableHead>
                    <SortableTableHead
                        sort-key="created_at"
                        :active-sort-key="activeSort.by"
                        :sort-desc="activeSort.isDesc"
                        @sort="onTableSort">{{ t('Created') }}</SortableTableHead>
                    <TableHead>{{ t('Status') }}</TableHead>
                    <TableHead>{{ t('Grand total') }}</TableHead>
                    <TableHead>{{ t('Subtotal') }}</TableHead>
                    <TableHead>{{ t('Tax') }}</TableHead>
                    <TableHead>{{ t('# items') }}</TableHead>
                    <TableHead>{{ t('Billing address') }}</TableHead>
                    <TableHead class="w-30"></TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow v-for="(obj, idx) in tableResults" :key="idx">
                    <!-- Pickup code -->
                    <TableCell>
                        <RouterLink :to="{ name: 'cart', params: { id: obj.id }}">
                            {{ obj.pickup_code ?? '—' }}
                        </RouterLink>
                    </TableCell>

                    <!-- Created -->
                    <TableCell>
                        <Format8601 :date="obj.created_at" />
                    </TableCell>

                    <!-- Status -->
                    <TableCell>
                        <Tooltip v-if="obj.closed_at">
                            <TooltipTrigger as-child>
                                <Badge variant="success">{{ t('Closed') }}</Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <Format8601 :date="obj.closed_at" />
                            </TooltipContent>
                        </Tooltip>

                        <Badge v-else variant="destructive">{{ t('Open') }}</Badge>
                    </TableCell>

                    <!-- grand total -->
                    <TableCell class="text-right">
                        <Money :cents="obj.grand_total" />
                    </TableCell>

                    <!-- subtotal -->
                    <TableCell class="text-right">
                        <Money :cents="obj.price_subtotal" />
                    </TableCell>

                    <!-- tax -->
                    <TableCell class="text-right">
                        <Money :cents="obj.price_tax" />
                    </TableCell>

                    <!-- number of items -->
                    <TableCell class="text-right">
                        <NumberDisplay :value="obj.num_items" />
                    </TableCell>

                    <!-- billing address -->
                    <TableCell>
                        <AddressDisplay
                            :first-name="obj.billing_firstName"
                            :last-name="obj.billing_lastName"
                            :company="obj.billing_company"
                            :street-address="obj.billing_streetAddress"
                            :extended-address="obj.billing_extendedAddress"
                            :city="obj.billing_city"
                            :state="obj.billing_state"
                            :zip="obj.billing_postalCode"
                            :country-code="obj.billing_countryCodeAlpha2" />
                    </TableCell>

                    <!-- actions -->
                    <TableCell>
                        <div class="flex items-center justify-center w-full gap-2">
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
                    <TableCell colspan="9" class="text-center text-muted-foreground">{{ t('No data') }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <DataPagination
            v-model:page-size="pageSize"
            v-model:page-number="pageNumber"
            :total-rows="tableTotalResultsCount" />
    </SearchFilterLayout>
</template>
