<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

const props = defineProps({
    totalRows: {
        type: Number,
        default: 0
    },

    perPageOptions: {
        type: Array,
        default: () => [25, 50, 100, 200]
    }
});

const pageSize = defineModel('pageSize', { default: 100 });
const pageNumber = defineModel('pageNumber', { default: 1 });

const { t } = useI18n();

const displayingText = computed(() => {
    const start = (pageNumber.value - 1) * pageSize.value + 1;
    let end = pageNumber.value * pageSize.value;

    if (props.totalRows < end) {
        end = props.totalRows;
    }

    return t('Displaying {start} - {end}', { start, end });
});

const totalText = computed(() => {
    const total = props.totalRows || 0;
    return t('{num} result | {num} results', { num: total }, total);
});

function onPageSizeChange(val) {
    pageSize.value = parseInt(val, 10);
    pageNumber.value = 1;
}
</script>

<template>
    <div v-if="totalRows" class="flex items-center justify-between gap-4 flex-wrap my-3 text-sm">
        <div class="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
            <span>{{ totalText }}</span>
            <span>&middot;</span>
            <span>{{ displayingText }}</span>
            <span>&middot;</span>

            <Select :model-value="String(pageSize)" @update:model-value="onPageSizeChange">
                <SelectTrigger size="sm" class="w-28">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="val in perPageOptions" :key="val" :value="String(val)">
                        {{ t('{num} / page', { num: val }) }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>

        <Pagination
            :total="totalRows"
            :items-per-page="pageSize"
            :page="pageNumber"
            :sibling-count="1"
            show-edges
            @update:page="pageNumber = $event">
            <PaginationContent v-slot="{ items }">
                <PaginationFirst />
                <PaginationPrevious />

                <template v-for="(item, index) in items" :key="index">
                    <PaginationItem
                        v-if="item.type === 'page'"
                        :value="item.value"
                        :is-active="item.value === pageNumber">
                        {{ item.value }}
                    </PaginationItem>
                    <PaginationEllipsis v-else />
                </template>

                <PaginationNext />
                <PaginationLast />
            </PaginationContent>
        </Pagination>
    </div>
</template>
