<script setup lang="ts" generic="Row extends { id: string | number }">
import { computed, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Overlay from '@/components/Overlay.vue';
import DataPagination from '@/components/DataPagination.vue';
import { SORT_CONTEXT, type ListPage } from '@/composables/useListPage';

// Markup half of useListPage(): loading overlay, sortable header (via the provided sort
// context — <SortableTableHead sort-key="..."> needs no other props), one row per item keyed by
// id, an empty state, and pagination.

const props = defineProps<{
    list: ListPage<Row>;
    /** Number of columns, for the empty-state cell's colspan. */
    columns: number;
    emptyText?: string;
}>();

defineSlots<{
    head(): unknown;
    row(props: { row: Row, index: number }): unknown;
    empty?(): unknown;
}>();

const { t } = useI18n();

provide(SORT_CONTEXT, {
    sort: computed(() => props.list.sort),
    setSort: (by: string) => props.list.setSort(by)
});
</script>

<template>
    <Overlay :show="list.isLoading">
        <Table>
            <TableHeader>
                <TableRow>
                    <slot name="head" />
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow v-for="(row, index) in list.rows" :key="row.id">
                    <slot name="row" :row="row" :index="index" />
                </TableRow>

                <TableRow v-if="list.isEmpty">
                    <TableCell :colspan="columns" class="py-10 text-center text-muted-foreground">
                        <slot name="empty">{{ emptyText ?? t('No data') }}</slot>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <DataPagination
            v-if="list.paginated"
            :page-size="list.pageSize"
            :page-number="list.pageNumber"
            :total-rows="list.total"
            @update:page-size="list.setPageSize"
            @update:page-number="list.setPage" />
    </Overlay>
</template>
