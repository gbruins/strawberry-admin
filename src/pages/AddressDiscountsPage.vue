<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ListTable from '@/components/ListTable.vue';
import SortableTableHead from '@/components/SortableTableHead.vue';
import RowActions from '@/components/RowActions.vue';
import NumberDisplay from '@/components/NumberDisplay.vue';
import BooleanBadge from '@/components/BooleanBadge.vue';
import Format8601 from '@/components/Format8601.vue';
import AddressDiscountsUpsertModal from '@/components/addressDiscounts/AddressDiscountsUpsertModal.vue';
import StreetNameDisplay from '@/components/allowedStreets/StreetNameDisplay.vue';
import useListPage from '@/composables/useListPage';

interface AddressDiscount {
    id: string;
    street_number: string;
    allowed_street_id: string;
    /** whole percent, e.g. 10 = 10% */
    discount_percent: number | null;
    active?: boolean;
    published?: boolean;
    created_at: string;
}

const { t } = useI18n();
const upsertModal = useTemplateRef('upsertModal');

const list = useListPage<AddressDiscount>({
    search: 'addressDiscount.search',
    remove: 'addressDiscount.delete',
    defaultSort: { by: 'discount_percent', desc: true }
});
</script>

<template>
    <PageTitle>{{ t('Address discounts') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal?.show()">{{ t('Add address discount') }}</Button>
    </div>

    <ListTable :list="list" :columns="6">
        <template #head>
            <SortableTableHead sort-key="street_number">{{ t('Street number') }}</SortableTableHead>
            <SortableTableHead sort-key="allowed_street_id">{{ t('Street name') }}</SortableTableHead>
            <SortableTableHead sort-key="discount_percent" class="text-right">{{ t('Discount') }}</SortableTableHead>
            <SortableTableHead sort-key="active">{{ t('Active') }}</SortableTableHead>
            <SortableTableHead sort-key="created_at">{{ t('Created') }}</SortableTableHead>
            <TableHead class="text-right">{{ t('Actions') }}</TableHead>
        </template>

        <template #row="{ row }">
            <TableCell>{{ row.street_number }}</TableCell>
            <TableCell>
                <StreetNameDisplay :id="row.allowed_street_id" />
            </TableCell>
            <TableCell class="text-right">
                <NumberDisplay
                    :value="row.discount_percent ? row.discount_percent / 100 : 0"
                    format="percent"
                    :config="{ maximumFractionDigits: 2 }" />
            </TableCell>
            <TableCell>
                <BooleanBadge :value="row.active ?? row.published ?? false" />
            </TableCell>
            <TableCell>
                <Format8601 :date="row.created_at" />
            </TableCell>
            <TableCell>
                <RowActions @edit="upsertModal?.show(row.id)" @delete="list.remove(row.id)" />
            </TableCell>
        </template>
    </ListTable>

    <AddressDiscountsUpsertModal ref="upsertModal" @success="list.fetch" />
</template>
