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
    @apply flex items-center justify-center -mr-px border-t border-b bg-gray-200 border-gray-300 px-1 whitespace-nowrap text-gray-600 text-sm leading-normal min-w-min;
}
</style>
