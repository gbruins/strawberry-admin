<script>
export default {
    name: 'LabelValue'
}
</script>

<script setup>
const props = defineProps({
    valueClasses: {
        type: Array,
        default: () => {
            return [];
        }
    },

    required: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <div class="fig-lv">
        <span v-if="$slots.label" class="fig-lv-label"><slot name="label" /><span v-if="required" class="text-red-700">*</span></span>
        <span class="fig-lv-value">
            <div><slot /></div>
            <div v-if="$slots.error" class="text-red-600 text-sm"><slot name="error" /></div>
        </span>
    </div>
</template>

<style>
.fig-lv-value,
.fig-lv-label {
    vertical-align: top;
}

/* as block */
.fig-lvg-block .fig-lv {
    display: block;
}
.fig-lvg-block.fig-lvg-density-sm .fig-lv {
    margin-bottom: 0;
}
.fig-lvg-block.fig-lvg-density-md .fig-lv {
    margin-bottom: 0.5rem;
}
.fig-lvg-block.fig-lvg-density-lg .fig-lv {
    margin-bottom: 1rem;
}
.fig-lvg-block.fig-lvg-density-xl .fig-lv {
    margin-bottom: 1.5rem;
}
.fig-lvg-block .fig-lv-value,
.fig-lvg-block .fig-lv-label {
    display: block;
}

/* as table */
.fig-lvg-table .fig-lv {
    display: table-row;
}
.fig-lvg-table .fig-lv-label {
    padding-right: 0.5rem;
}
.fig-lvg-table.fig-lvg-density-sm .fig-lv-label,
.fig-lvg-table.fig-lvg-density-sm .fig-lv-value {
    padding-bottom: 0;
}
.fig-lvg-table.fig-lvg-density-md .fig-lv-label,
.fig-lvg-table.fig-lvg-density-md .fig-lv-value {
    padding-bottom: 0.5rem;
}
.fig-lvg-table.fig-lvg-density-lg .fig-lv-label,
.fig-lvg-table.fig-lvg-density-lg .fig-lv-value {
    padding-bottom: 1rem;
}
.fig-lvg-table.fig-lvg-density-xl .fig-lv-label,
.fig-lvg-table.fig-lvg-density-xl .fig-lv-value {
    padding-bottom: 1.5rem;
}
/* Responsive breakpoints using media queries */
.fig-lvg-table.fig-lvg-breakpoint-sm .fig-lv-label,
.fig-lvg-table.fig-lvg-breakpoint-sm .fig-lv-value {
    display: block;
}

@media (min-width: 640px) {
  .fig-lvg-table.fig-lvg-breakpoint-sm .fig-lv-label,
  .fig-lvg-table.fig-lvg-breakpoint-sm .fig-lv-value {
    display: table-cell;
  }
}

.fig-lvg-table.fig-lvg-breakpoint-md .fig-lv-label,
.fig-lvg-table.fig-lvg-breakpoint-md .fig-lv-value {
    display: block;
}

@media (min-width: 768px) {
  .fig-lvg-table.fig-lvg-breakpoint-md .fig-lv-label,
  .fig-lvg-table.fig-lvg-breakpoint-md .fig-lv-value {
    display: table-cell;
  }
}

.fig-lvg-table.fig-lvg-breakpoint-lg .fig-lv-label,
.fig-lvg-table.fig-lvg-breakpoint-lg .fig-lv-value {
    display: block;
}

@media (min-width: 1024px) {
  .fig-lvg-table.fig-lvg-breakpoint-lg .fig-lv-label,
  .fig-lvg-table.fig-lvg-breakpoint-lg .fig-lv-value {
    display: table-cell;
  }
}

.fig-lvg-table.fig-lvg-breakpoint-xl .fig-lv-label,
.fig-lvg-table.fig-lvg-breakpoint-xl .fig-lv-value {
    display: block;
}

@media (min-width: 1280px) {
  .fig-lvg-table.fig-lvg-breakpoint-xl .fig-lv-label,
  .fig-lvg-table.fig-lvg-breakpoint-xl .fig-lv-value {
    display: table-cell;
  }
}

/* as row */
.fig-lvg-row .fig-lv {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex-wrap: nowrap;
    border-right: 1px solid var(--tw-border-opacity, 1) #d1d5db; /* border-gray-300 */
}
.fig-lvg-row .fig-lv:last-child {
    border-right: 0;
}
.fig-lvg-row .fig-lv-label {
    color: var(--tw-text-opacity, 1) #6b7280; /* text-gray-500 */
}
.fig-lvg-row .fig-lv-value {
    margin-top: 0.25rem;
    color: var(--tw-text-opacity, 1) #000;
}
.fig-lvg-row.fig-lvg-density-sm .fig-lv {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
.fig-lvg-row.fig-lvg-density-md .fig-lv {
    padding-left: 1rem;
    padding-right: 1rem;
}
.fig-lvg-row.fig-lvg-density-lg .fig-lv {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
}
.fig-lvg-row.fig-lvg-density-xl .fig-lv {
    padding-left: 2rem;
    padding-right: 2rem;
}
</style>
