<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { TableHead, TableCell } from '@/components/ui/table';
import ListTable from '@/components/ListTable.vue';
import SortableTableHead from '@/components/SortableTableHead.vue';
import RowActions from '@/components/RowActions.vue';
import BooleanBadge from '@/components/BooleanBadge.vue';
import Format8601 from '@/components/Format8601.vue';
import useApi from '@/composables/useApi';
import useListPage from '@/composables/useListPage';

interface Subscriber {
    id: string;
    email: string;
    status: 'subscribed' | 'unsubscribed';
    subscribed_at: string;
}

const { t } = useI18n();
const $apiCount = useApi('emailSubscriber.count');
const activeCount = ref(0);

const list = useListPage<Subscriber>({
    search: 'emailSubscriber.search',
    remove: 'emailSubscriber.delete',
    defaultSort: { by: 'subscribed_at', desc: true }
});

function fetchCount() {
    return $apiCount.tryCatch(async () => {
        const response = await $apiCount.run();
        activeCount.value = response.data.activeCount;
    });
}

function onRemove(id: string) {
    return list.remove(id, { successMessage: t('Subscriber removed'), onRemoved: fetchCount });
}

onMounted(fetchCount);
</script>

<template>
    <PageTitle>{{ t('Subscribers') }}</PageTitle>

    <p class="mb-4 text-sm text-muted-foreground" data-test="active-count">
        {{ t('Active subscribers') }}: {{ activeCount }}
    </p>

    <ListTable :list="list" :columns="4">
        <template #head>
            <SortableTableHead sort-key="email">{{ t('Email') }}</SortableTableHead>
            <SortableTableHead sort-key="status">{{ t('Status') }}</SortableTableHead>
            <SortableTableHead sort-key="subscribed_at">{{ t('Subscribed') }}</SortableTableHead>
            <TableHead class="text-right">{{ t('Actions') }}</TableHead>
        </template>

        <template #row="{ row }">
            <TableCell>{{ row.email }}</TableCell>
            <TableCell>
                <BooleanBadge
                    :value="row.status === 'subscribed'"
                    :true-label="t('Subscribed')"
                    :false-label="t('Unsubscribed')" />
            </TableCell>
            <TableCell>
                <Format8601 :date="row.subscribed_at" />
            </TableCell>
            <TableCell>
                <RowActions
                    :deletable="row.status === 'subscribed'"
                    :delete-label="t('Remove subscriber')"
                    :delete-confirm="t('Remove this subscriber?')"
                    @delete="onRemove(row.id)" />
            </TableCell>
        </template>
    </ListTable>
</template>
