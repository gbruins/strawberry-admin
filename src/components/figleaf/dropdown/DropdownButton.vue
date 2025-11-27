<script>
export default {
    name: 'DropdownButton',
    inheritAttrs: false
}
</script>

<script setup>
const props = defineProps({
    centered: {
        type: Boolean,
        default: false
    }
});
</script>


<template>
    <div class="hover:bg-gray-100">
        <button
            type="button"
            class="fig-dropdown-button focus:outline-none"
            :class="{'text-center': centered, 'text-left': !centered}"
            role="menuitem"
            v-bind="$attrs">
            <slot></slot>
        </button>
    </div>
</template>


<style scoped>
.fig-dropdown-button {
    border: 0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 0.875rem;
    font-weight: 400;
    display: block;
    width: 100%;
    white-space: nowrap;
    background: transparent;
    color: var(--color-gray-600);
}

div:hover {
    background-color: var(--color-gray-100);
}
</style>
