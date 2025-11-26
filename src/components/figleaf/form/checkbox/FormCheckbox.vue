<script>
export default {
    name: 'FormCheckbox'
}
</script>

<script setup>
import { ref, computed, useAttrs } from 'vue';
import ObjectUtils from '@/utils/ObjectUtils.js';
import isEqual from 'lodash.isequal';

const props = defineProps({
    value: null,

    modelValue: null,

    trueValue: {
        type: null,
        default: true
    },

    falseValue: {
        type: null,
        default: false
    },

    binary: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    'click',
    'change',
    'input',
    'update:modelValue'
]);

const attrs = useAttrs();

const focused = ref(false);
const input = ref(null);

const checked = computed(() => {
    if(props.binary) {
        return props.modelValue === props.trueValue;
    }

    return ObjectUtils.contains(props.value, props.modelValue);
});

const classes = computed(() => {
    return {
        'form-checkbox': true,
        'fig-form-control': true,
        'form-checkbox--disabled': attrs.disabled,
        'form-checkbox--readonly': attrs.readonly,
        'form-checkbox--focused': focused.value
    };
});

function onClick(e) {
    if (attrs.disabled || attrs.readonly) {
        return;
    }

    let newModelValue;

    if (props.binary) {
        newModelValue = checked.value ? props.falseValue : props.trueValue;
    }
    else {
        if (checked.value) {
            // the new model value is an array without the value
            newModelValue = props.modelValue.filter((val) => !isEqual(val, props.value));
        }
        else {
            newModelValue = props.modelValue ? [...props.modelValue, props.value] : [props.value];
        }
    }

    emit('click', e);
    emit('change', e);
    emit('update:modelValue', newModelValue);
    emit('input', newModelValue);
    input.value.focus();
}
</script>


<template>
    <div
        class="inline-flex items-center"
        @click="onClick($event)">
        <input
            ref="input"
            type="checkbox"
            :checked="checked"
            :value="value"
            v-bind="$attrs"
            :class="classes">
        <span
            v-if="$slots.default"
            @click="onClick($event)"
            class="ml-2"><slot /></span>
    </div>
</template>


<style scoped>
.form-checkbox--disabled,
.form-checkbox--readonly {
    background-color: var(--color-gray-200);
    cursor: not-allowed;
}
</style>
