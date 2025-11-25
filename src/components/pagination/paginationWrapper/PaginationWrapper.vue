<script>
import usePaginationBar from '../paginationBar/usePaginationBar.js';
export const {
    paginationBarProps,
    paginationBarEmits
} = usePaginationBar();

export default {
    name: 'FigPaginationWrapper'
}
</script>

<script setup>
import { computed, watch } from 'vue';
import PaginationBar from '../paginationBar/PaginationBar.vue';
import usePagination from '../usePagination.js';

const props = defineProps({
    ...paginationBarProps,

    top: {
        type: Boolean,
        default: true
    },

    bottom: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(paginationBarEmits);

defineExpose({
    getPaginationData,
    setPageNumber,
    setPageSize
});

const Pagination = usePagination();

function getPaginationData() {
    return { ...Pagination.data };
}

function setPageNumber(val) {
    Pagination.setPageNumber(val);
}

function setPageSize(val) {
    Pagination.setPageSize(val);
}

function emitChange(data) {
    Pagination.setData(data);
    emit('change', getPaginationData());
}

function onPageSize(data) {
    emitChange(data);
    emit('pageSize', data);
}

function onPageNumber(data) {
    emitChange(data);
    emit('pageNumber', data);
}

/**
 * need to remove the event handlers because the same props/event handlers
 * are given to both pagination bars, otherwise the event will be emitted twice.
 */
const barProps = computed(() => {
    const cleanProps = {};

    for (const prop in paginationBarProps) {
        if (!['pageSize', 'pageNumber'].includes(prop)) {
            cleanProps[prop] = props[prop];
        }
    }

    return cleanProps;
});

watch(
    () => props.pageSize,
    (val) => {
        Pagination.setPageSize(val);
    }
);

watch(
    () => props.pageNumber,
    (val) => {
        Pagination.setPageNumber(val);
    }
);
</script>

<template>
    <div>
        <pagination-bar
            v-if="top"
            v-bind="barProps"
            :page-size="Pagination.data.pageSize"
            :page-number="Pagination.data.pageNo"
            @pageSize="onPageSize"
            @pageNumber="onPageNumber" />

        <div>
            <slot></slot>
        </div>

        <pagination-bar
            v-if="bottom"
            v-bind="barProps"
            :page-size="Pagination.data.pageSize"
            :page-number="Pagination.data.pageNo"
            @pageSize="onPageSize"
            @pageNumber="onPageNumber" />
    </div>
</template>
