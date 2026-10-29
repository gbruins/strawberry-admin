<script setup>
import { computed } from 'vue';
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from '@lucide/vue';
import { TableHead } from '@/components/ui/table';

const props = defineProps({
    sortKey: {
        type: String,
        default: null
    },

    activeSortKey: {
        type: String,
        default: null
    },

    sortDesc: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['sort']);

const isActive = computed(() => Boolean(props.sortKey) && props.activeSortKey === props.sortKey);

const icon = computed(() => {
    if (!isActive.value) {
        return ChevronsUpDownIcon;
    }
    return props.sortDesc ? ChevronDownIcon : ChevronUpIcon;
});

function onClick() {
    if (!props.sortKey) {
        return;
    }

    emit('sort', {
        by: props.sortKey,
        isDesc: isActive.value ? !props.sortDesc : false
    });
}
</script>

<template>
    <TableHead
        :class="[sortKey ? 'cursor-pointer select-none' : '', isActive ? 'text-foreground' : '']"
        @click="onClick">
        <span class="inline-flex items-center gap-1">
            <slot />
            <component :is="icon" v-if="sortKey" class="size-3.5 text-muted-foreground" />
        </span>
    </TableHead>
</template>
