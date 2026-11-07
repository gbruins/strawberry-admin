<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { KeyRoundIcon } from '@lucide/vue';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ListTable from '@/components/ListTable.vue';
import RowActions from '@/components/RowActions.vue';
import KitchenStationUpsertModal from '@/components/kitchenStations/KitchenStationUpsertModal.vue';
import KitchenStationRotatePinModal from '@/components/kitchenStations/KitchenStationRotatePinModal.vue';
import useListPage from '@/composables/useListPage';

interface KitchenStation {
    id: string;
    name: string;
    station_code: string;
    revoked_at: string | null;
}

const { t } = useI18n();
const upsertModal = useTemplateRef('upsertModal');
const rotatePinModal = useTemplateRef('rotatePinModal');

// The stations endpoint returns the whole (small) collection — no pagination or sorting.
const list = useListPage<KitchenStation>({
    search: 'kitchenStation.search',
    remove: 'kitchenStation.revoke',
    paginated: false
});
</script>

<template>
    <PageTitle>{{ t('Kitchen Stations') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal?.show()">{{ t('Add kitchen station') }}</Button>
    </div>

    <ListTable :list="list" :columns="4">
        <template #head>
            <TableHead>{{ t('Name') }}</TableHead>
            <TableHead>{{ t('Station code') }}</TableHead>
            <TableHead>{{ t('Status') }}</TableHead>
            <TableHead class="text-right">{{ t('Actions') }}</TableHead>
        </template>

        <template #row="{ row }">
            <TableCell>{{ row.name }}</TableCell>
            <TableCell class="font-mono">{{ row.station_code }}</TableCell>
            <TableCell>
                <Badge :variant="row.revoked_at ? 'destructive' : 'success'">
                    {{ row.revoked_at ? t('Revoked') : t('Active') }}
                </Badge>
            </TableCell>
            <TableCell>
                <RowActions
                    :deletable="!row.revoked_at"
                    :delete-label="t('Revoke station')"
                    :delete-confirm="t('Revoke this station? Any logged-in tablet will be signed out immediately.')"
                    @delete="list.remove(row.id, { successMessage: t('Station revoked') })">
                    <Button
                        variant="ghost"
                        size="icon"
                        :aria-label="t('Rotate station PIN')"
                        :title="t('Rotate station PIN')"
                        :disabled="!!row.revoked_at"
                        @click="rotatePinModal?.show(row.id)">
                        <KeyRoundIcon />
                    </Button>
                </RowActions>
            </TableCell>
        </template>
    </ListTable>

    <KitchenStationUpsertModal ref="upsertModal" @success="list.fetch" />
    <KitchenStationRotatePinModal ref="rotatePinModal" @success="list.fetch" />
</template>
