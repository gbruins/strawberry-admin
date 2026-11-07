<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ListTable from '@/components/ListTable.vue';
import SortableTableHead from '@/components/SortableTableHead.vue';
import RowActions from '@/components/RowActions.vue';
import BooleanBadge from '@/components/BooleanBadge.vue';
import AllowedStreetsUpsertModal from '@/components/allowedStreets/AllowedStreetsUpsertModal.vue';
import useApi from '@/composables/useApi';
import useListPage from '@/composables/useListPage';
import useToast from '@/composables/useToast';
import { useAllowedStreets } from '@/composables/useLookups';

interface AllowedStreet {
    id: string;
    street_name: string;
    active: boolean;
}

const { t } = useI18n();
const { successToast } = useToast();
const $apiUpdate = useApi('allowedStreet.update');
const upsertModal = useTemplateRef('upsertModal');
const streets = useAllowedStreets();

// Streets are deactivated rather than deleted (address discounts reference them).
const list = useListPage<AllowedStreet>({
    search: 'allowedStreet.search',
    defaultSort: { by: 'street_name' }
});

function onSaved() {
    streets.refresh();
    list.fetch();
}

function toggleActive(street: AllowedStreet) {
    return $apiUpdate.tryCatch(async () => {
        await $apiUpdate.run({ id: street.id, active: !street.active });

        successToast({
            title: t(street.active ? 'Deactivated: {name}' : 'Activated: {name}', { name: street.street_name })
        });

        onSaved();
    });
}
</script>

<template>
    <PageTitle>{{ t('Allowed streets') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal?.show()">{{ t('Add allowed street') }}</Button>
    </div>

    <ListTable :list="list" :columns="3">
        <template #head>
            <SortableTableHead sort-key="street_name">{{ t('Street name') }}</SortableTableHead>
            <SortableTableHead sort-key="active">{{ t('Active') }}</SortableTableHead>
            <TableHead class="text-right">{{ t('Actions') }}</TableHead>
        </template>

        <template #row="{ row }">
            <TableCell>{{ row.street_name }}</TableCell>
            <TableCell>
                <BooleanBadge :value="row.active" />
            </TableCell>
            <TableCell>
                <RowActions @edit="upsertModal?.show(row.id)">
                    <Button
                        size="sm"
                        :variant="row.active ? 'destructive' : 'outline'"
                        :disabled="$apiUpdate.isLoading.value"
                        @click="toggleActive(row)">{{ t(row.active ? 'Deactivate' : 'Activate') }}</Button>
                </RowActions>
            </TableCell>
        </template>
    </ListTable>

    <AllowedStreetsUpsertModal ref="upsertModal" @success="onSaved" />
</template>
