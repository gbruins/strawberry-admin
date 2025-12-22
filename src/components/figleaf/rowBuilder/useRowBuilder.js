import { computed, ref, watch } from 'vue';

export const rowBuilderDensity = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
}

export const RowBuilderProps = {
    modelValue: {
        type: Array,
        default: function() {
            return [];
        }
    },

    sortable: {
        type: Boolean,
        default: true
    },

    addable: {
        type: Boolean,
        default: true
    },

    removable: {
        type: Boolean,
        default: true
    },

    removeConfirm: {
        type: Boolean,
        default: true
    },

    maxRows: {
        type: Number
    },

    density: {
        type: String,
        default: rowBuilderDensity.sm,
        validator: (value) => Object.keys(rowBuilderDensity).includes(value)
    },

    addNewOnEmpty: {
        type: Boolean,
        default: false
    }
};


export default function useRowBuilder(props, emit) {
    const rows = ref(Array.isArray(props.modelValue) ? props.modelValue : []);

    const canSortRows = computed(() => {
        return props.sortable && rows.value.length > 1;
    });

    const densityClass = computed(() => {
        return `fig-row-builder-row-${props.density}`;
    });

    const canAddRow = computed(() => {
        if(!props.addable) {
            return false;
        }
        const maxRows = parseInt(props.maxRows);
        return isNaN(maxRows) || (maxRows > 0 && rows.value.length < maxRows);
    });

    function addRow() {
        emit('add');
    }

    function removeRow(index) {
        emit('remove', index);
    }

    function onSort() {
        emit('update:modelValue', rows.value)
    }

    function onPopoverToggleClick(index) {
        if(!props.removeConfirm) {
            removeRow(index);
        }
    }

    watch(
        () => props.modelValue,
        (newVal) => {
            rows.value = Array.isArray(newVal) ? newVal : [];

            if(props.addNewOnEmpty && !rows.value.length) {
                addRow();
            }
        },
        { immediate: true }
    );

    return {
        rows,
        canSortRows,
        densityClass,
        canAddRow,
        onPopoverToggleClick,
        addRow,
        removeRow,
        onSort
    };
}
