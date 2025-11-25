<script>
export default {
    name: 'FigTh'
}
</script>

<script setup>
import { inject, computed } from 'vue';
import SvgIcon from '@/components/svgIcon/SvgIcon.vue';
import debounce from 'lodash.debounce';

const props = defineProps({
    sort: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['sort']);
const tableState = inject('tableState');

function emitSort() {
    emit('sort', {
        by: tableState.sort.by,
        isAsc: tableState.sort.isAsc
    });
}

const isSelected = computed(() => {
    return props.sort && tableState.sort.by === props.sort;
});

const classNames = computed(() => {
    return {
        'fig-table-th-sortable': props.sort,
        'fig-table-th-sort-active': props.sort && isSelected.value,
        'fig-table-th-sort-asc': props.sort && isSelected.value && tableState.sort.isAsc,
        'fig-table-th-sort-desc': props.sort && isSelected.value && !tableState.sort.isAsc
    }
});

const contentClasses = computed(() => {
    return {
        'px-1': tableState.cellPadding === 1,
        'px-2': tableState.cellPadding === 2,
        'px-3': tableState.cellPadding === 3,
        'px-4': tableState.cellPadding === 4,
        'px-5': tableState.cellPadding === 5,
        'py-1': tableState.cellPadding === 1,
        'py-2': tableState.cellPadding === 2,
        'py-3': tableState.cellPadding === 3,
        'py-4': tableState.cellPadding === 4,
        'py-5': tableState.cellPadding === 5,
        'flex': true,
        'items-center': true
    }
});

const arrowIcon = computed(() => {
    if (props.sort) {
        return isSelected.value ? 'chevron-up' : 'chevron-down'
    }
    return null;
});

const arrowClasses = computed(() => {
    const selected = props.sort && isSelected.value;

    return {
        'transition-transform duration-500': selected,
        'fig-table-th-arrow-down': selected && !tableState.sort.isAsc
    }
});

const onClick = debounce(
    () => {
        if(props.sort) {
            tableState.sort.isAsc = isSelected.value ? !tableState.sort.isAsc : tableState.defaultSortAsc;
            tableState.sort.by = props.sort;
            emitSort()
        }
    },
    500,
    {
        leading: true,
        trailing: false
    }
);
</script>


<template>
    <th
        class="fig-table-th"
        :class="classNames"
        @click="onClick">
        <div :class="contentClasses">
            <div class="flex-grow"><slot></slot></div>
            <div v-if="arrowIcon" class="ml-1">
                <svg-icon
                    :class="arrowClasses"
                    :icon="arrowIcon"
                    :stroke-width="1.5"
                    stroke-color="#000"
                    :width="18"
                    :height="18" />
            </div>
        </div>
    </th>
</template>


<style scoped>
.fig-table-th {
    transition: background-color .5s ease;
    border-width: 1px;
    border-color: var(--color-gray-300);
    color: var(--color-gray-800);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
}

.fig-table-th-sortable {
    cursor: pointer;
}
.fig-table-th-sortable:hover {
    background-color: var(--color-gray-200);
}

.fig-table-th-arrow-down {
    transform: rotateZ(180deg);
}

.fig-table-th-sort-active {
    color: var(--color-blue-700);
    background-color: var(--color-blue-100);
    transition: background-color .5s ease;
}
.fig-table-th-sort-active:hover {
    background-color: var(--color-blue-200);
}

.fig-table-th-sort-asc {
    border-top-color: var(--color-blue-600) !important;
    border-top-width: 1px !important;
    border-top-style: solid !important;
}
.fig-table-th-sort-desc {
    border-bottom-color: var(--color-blue-600) !important;
    border-bottom-width: 1px !important;
    border-bottom-style: solid !important;
}
</style>
