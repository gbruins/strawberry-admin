<script>
export default {
    name: 'FormMultiSelect'
}
</script>

<script setup>
import { computed, ref, watch } from 'vue';
import MultiSelect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
import { formSelectSizes } from './constants.js';

// https://github.com/vueform/multiselect#advanced-props
const props = defineProps({
    modelValue: {},

    size: {
        type: String,
        default: formSelectSizes.md,
        validator: (value) => {
            return Object.values(formSelectSizes).includes(value);
        }
    }
});

const emit = defineEmits([
    'update:modelValue'
]);

const selectedValue = ref(props.modelValue);

const tailwindClasses = computed(() => {
    let sizeClass = '';
    switch(props.size) {
        case formSelectSizes.sm:
            sizeClass = 'fig-form-multiselect--sm';
            break;

        case formSelectSizes.md:
            sizeClass = 'fig-form-multiselect--md';
            break;

        case formSelectSizes.lg:
            sizeClass = 'fig-form-multiselect--lg';
            break;
    }

    return {
        container: `fig-form-control fig-form-multiselect ${sizeClass}`,
        containerActive: 'fig-form-focus-ring',
        tag: 'fig-form-multiselect-tag',
        optionSelected: 'text-white bg-blue-500',
        optionSelectedPointed: 'text-white bg-blue-500 opacity-90',
        optionSelectedDisabled: 'text-blue-100 bg-blue-500 bg-opacity-50 cursor-not-allowed',
    }
});

function onClose(e) {
    e.blur();
}

function onChange() {
    emit('update:modelValue', selectedValue.value);
}

watch(
    () => props.modelValue,
    (value) => {
        selectedValue.value = value;
    },
    { immediate: true }
)
</script>


<template>
    <MultiSelect
        v-model="selectedValue"
        @update:modelValue="onChange"
        :noResultsText="$t('No results')"
        :classes="tailwindClasses"
        :canDeselect="false"
        :searchable="true"
        v-bind="$props"
        @close="onClose">
        <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
    </MultiSelect>
</template>


<style>
.fig-form-multiselect {
    @apply relative mx-auto flex items-center justify-end box-border cursor-pointer text-base;
}
.fig-form-multiselect .multiselect-option {
    @apply text-sm;
}
.fig-form-multiselect .multiselect-tags-search,
.fig-form-multiselect .multiselect-tags-search-wrapper {
    @apply focus:outline-none outline-none focus:ring ring-transparent;
}
/* .fig-form-multiselect .multiselect-tags-search:focus {
    outline: none !important;
} */


.fig-form-multiselect-tag {
    @apply bg-gray-300 text-gray-900 rounded-sm mr-1 flex items-center whitespace-nowrap;
}

.fig-form-multiselect--sm .multiselect-caret {
    height: 26px;
}
.fig-form-multiselect--md .multiselect-caret {
    height: 32px;
}
.fig-form-multiselect--lg .multiselect-caret {
    height: 40px;
}

/* small */
/* .fig-form-multiselect--sm,
.fig-form-multiselect--md {
    font-size: 12px;
} */

.fig-form-multiselect--sm .multiselect-tags {
    margin-top: 0;
    padding-left: 4px;
}
.fig-form-multiselect--sm .multiselect-tags-search-wrapper {
    margin-bottom: 0;
}
.fig-form-multiselect--sm .fig-form-multiselect-tag {
    margin-bottom: 1px;
    margin-top: 1px;
    padding: 3px 4px;
    font-size: 12px;
    line-height: 12px;
}
.fig-form-multiselect--sm .multiselect-tag-remove {
    padding: 0;
    margin-left: 3px;
}

/* medium */
.fig-form-multiselect--md .multiselect-tags,
.fig-form-multiselect--lg .multiselect-tags {
    margin-top: 1px;
    padding-left: 4px;
}
.fig-form-multiselect--md .multiselect-tags-search-wrapper,
.fig-form-multiselect--lg .multiselect-tags-search-wrapper {
    margin-bottom: 2px;
}
.fig-form-multiselect--md .fig-form-multiselect-tag {
    margin-bottom: 2px;
    margin-top: 1px;
    padding: 2px 4px;
    font-size: 12px;
    line-height: 12px;
}

/* large */
.fig-form-multiselect--lg {
    font-size: 14px;
}
.fig-form-multiselect--lg .fig-form-multiselect-tag {
    margin-bottom: 2px;
    margin-top: 2px;
    padding: 4px 6px;
    font-size: 14px;
    line-height: 14px;
}
</style>
