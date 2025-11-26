<script>
export default {
    name: 'FigTd'
}
</script>

<script setup>
import { inject, computed } from 'vue';

const tableState = inject('tableState');

const classNames = computed(() => {
    return {
        [`p-${tableState.cellPadding}`]: true
    }
});
</script>

<template>
    <td
        class="fig-td transition-colors"
        :class="classNames"><slot></slot></td>
</template>

<style>
.fig-td {
    transition: background-color 0.2s ease;
}
</style>

