<script>
export default {
    name: 'FigNumber'
}
</script>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useNumeric from '@/composables/useNumeric.js';

const props = defineProps({
    value: {
        type: [Number, String],
    },

    localize: {
        type: Boolean,
        default: true
    },

    as: {
        type: String,
        default: 'span'
    },

    emptyDisplay: {
        type: String,
        default: ''
    },

    round: {
        type: Number,
    },

    /*
     The formats as defined in the i18n module.
     This is the second argument of the $n() function (ex: currency, decimal, percent, etc.)
     https://vue-i18n.intlify.dev/guide/essentials/number.html#basic-usage
    */
    format: {
        type: String,
        default: 'decimal'
    },

    config: {
        type: Object,
        default: () => {
            return {};
        }
    },

    removeAnchorIfZero: {
        type: Boolean,
        default: true
    }
});

const { n } = useI18n();
const { round } = useNumeric();

const cleanValue = computed(() => {
    const clean = parseFloat(props.value);
    return isNaN(clean) ? null : clean;
});

const elementType = computed(() => {
    if (props.as === 'a' && props.removeAnchorIfZero && cleanValue.value === 0) {
        return 'span';
    }
    return props.as;
});

const cleanAttrs = computed(() => {
    const attrs = { ...props.$attrs };

    if (elementType.value === 'span') {
        delete attrs.href;
    }

    return attrs;
});

const label = computed(() => {
    if (cleanValue.value === null) {
        return props.emptyDisplay;
    }

    let displayedValue = cleanValue.value;

    if (props.round) {
        displayedValue = round(displayedValue, props.round);
    }

    if (props.localize) {
        return n(displayedValue, props.format, props.config);
    }

    return displayedValue;
});
</script>

<template>
    <component
        :is="elementType"
        v-bind="cleanAttrs"
        :class="{'text-gray-400': !cleanValue}">
        {{ label }}
    </component>
</template>


