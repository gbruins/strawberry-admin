<script setup lang="ts">
import { computed, inject } from 'vue';
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from '@lucide/vue';
import { TableHead } from '@/components/ui/table';
import { SORT_CONTEXT } from '@/composables/useListPage';

// Reads and sets the sort through the context <ListTable> provides; outside a ListTable it
// renders as a plain header.

const props = defineProps<{
    sortKey: string;
}>();

const context = inject(SORT_CONTEXT, null);

const isActive = computed(() => context?.sort.value.by === props.sortKey);
const isDesc = computed(() => isActive.value && !!context?.sort.value.desc);

const ariaSort = computed(() => {
    if (!isActive.value) {
        return 'none';
    }

    return isDesc.value ? 'descending' : 'ascending';
});

const icon = computed(() => {
    if (!isActive.value) {
        return ChevronsUpDownIcon;
    }

    return isDesc.value ? ChevronDownIcon : ChevronUpIcon;
});
</script>

<template>
    <TableHead :aria-sort="context ? ariaSort : undefined" :class="{ 'text-foreground': isActive }">
        <button
            v-if="context"
            type="button"
            class="inline-flex items-center gap-1 select-none cursor-pointer hover:text-foreground"
            @click="context.setSort(sortKey)">
            <slot />
            <component :is="icon" class="size-3.5 text-muted-foreground" />
        </button>

        <slot v-else />
    </TableHead>
</template>
