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
        :noResultsText="$t('No data')"
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
    position: relative;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 1rem; /* Tailwind text-base = 1rem (16px) */
}
.fig-form-multiselect .multiselect-option {
    font-size: 0.875rem; /* Tailwind text-sm = 0.875rem (14px) */
}
.fig-form-multiselect .multiselect-tags-search,
.fig-form-multiselect .multiselect-tags-search-wrapper {
    outline: none;
    box-shadow: 0 0 0 0 transparent;
}
/* .fig-form-multiselect .multiselect-tags-search:focus {
    outline: none !important;
} */

.fig-form-multiselect-tag {
    background-color: rgb(209, 213, 219); /* Tailwind bg-gray-300 */
    color: rgb(17, 24, 39); /* Tailwind text-gray-900 */
    border-radius: 0.125rem; /* Tailwind rounded-sm = 2px */
    margin-right: 0.25rem; /* Tailwind mr-1 = 4px */
    display: flex;
    align-items: center;
    white-space: nowrap;
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
