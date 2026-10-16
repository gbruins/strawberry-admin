<script>
export default {
    name: 'FormInputEndcapper'
}
</script>

<script setup>
const props = defineProps({
    prefixAs: {
        type: String,
        default: 'span'
    },

    suffixAs: {
        type: String,
        default: 'span'
    }
});

const emit = defineEmits(['prefixClick', 'suffixClick']);

function onPrefixClick() {
    emit('prefixClick');
}

function onSuffixClick() {
    emit('suffixClick');
}
</script>


<template>
    <div class="flex flex-no-wrap items-stretch relative w-full">
        <!-- prefix -->
        <component
            v-if="$slots.prefix"
            :is="prefixAs"
            class="input-group-addon rounded-l-sm rounded-r-none border-l"
            @click="onPrefixClick"><slot name="prefix"></slot></component>

        <!-- input -->
        <slot></slot>

        <!-- suffix -->
        <component
            v-if="$slots.suffix"
            :is="suffixAs"
            class="input-group-addon rounded-r-sm rounded-l-none border-r"
            @click="onSuffixClick"><slot name="suffix"></slot></component>
    </div>
</template>


<style scoped>
.input-group-addon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: -1px;
    border-top: 1px solid var(--color-gray-300);
    border-bottom: 1px solid var(--color-gray-300);
    border-left: 1px solid var(--color-gray-300);
    background-color: var(--color-gray-200);
    color: var(--color-gray-600);
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    white-space: nowrap;
    font-size: 0.875rem;
    line-height: 1.5;
    min-width: min-content;
}
</style>
