<script>
export default {
    name: 'FigTableSimple',
    inheritAttrs: false,
}
</script>

<script setup>
import { computed, reactive, provide, watch } from 'vue';
import { tableSimplePaddingOptions } from './constants.js';

const props = defineProps({
    striped: {
        type: Boolean,
        default: true
    },

    outlined: {
        type: Boolean,
        default: true
    },

    full: {
        type: Boolean,
        default: true
    },

    hover: {
        type: Boolean,
        default: true
    },

    cellPadding: {
        type: Number,
        default: 2,
        validator: (value) => {
            return tableSimplePaddingOptions.includes(value);
        }
    },

    defaultSortBy: {
        type: String
    },

    defaultSortAsc: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    'sort'
]);

const sharedState = reactive({
    sort: {
        by: props.defaultSortBy || '',
        isAsc: props.defaultSortAsc
    },
    ...props
});

provide('tableState', {...sharedState});

const tableClasses = computed(() => {
    return {
        'fig-table': true,
        'fig-table-striped': props.striped,
        'fig-table-hover': props.hover,
        'fig-table-outlined': props.outlined,
        'w-full': props.full
    }
});

function emitSort() {
    emit('sort', {
        by: sharedState.sort.by,
        isAsc: sharedState.sort.isAsc
    })
}

watch(
    () => sharedState.sort,
    emitSort,
    { deep: true }
);
</script>


<template>
    <div class="inline-block" :class="{'w-full': props.full}">
        <div v-if="$slots.tools" class="mb-2 px-2">
            <slot name="tools"></slot>
        </div>

        <table :class="tableClasses" v-bind="$attrs">
            <thead class="bg-gray-100">
                <slot name="head"></slot>
            </thead>

            <tbody>
                <slot></slot>
            </tbody>

            <!-- tables can have multiple tbody elements, and other elements like tfoot
            so this slot allows for those options -->
            <slot name="belowTbody"></slot>
        </table>
    </div>
</template>


<style>
.fig-table {
    color: var(--color-gray-900);
    border-collapse: collapse;
    border-spacing: 0;
    background-color: #fff;
}

.fig-table:not(.fig-table-striped) .fig-td {
    border-bottom: 1px solid var(--color-gray-200);
}

.fig-table-outlined {
    border: 1px solid var(--color-gray-300);
}
.fig-table-outlined > thead > tr > th {
    border-top: none !important;
}
.fig-table-outlined > thead > tr > th:first-child {
    border-left: none !important;
}
.fig-table-outlined > thead > tr > th:last-child {
    border-right: none !important;
}

.fig-table > thead > tr > th:not(:first-child) {
    border-left: none !important;
}

.fig-table-striped > tbody > tr:nth-of-type(even) {
    background-color: #f5f5f7;
}

.fig-table-hover > tbody > tr:hover {
    background-color: var(--color-blue-100);
}
</style>
