<script>
export default {
    name: 'FigFormSelectStripeTaxCode'
}
</script>

<script setup>
import { computed, watch, ref } from 'vue';
import FigFormMultiSelect from '../multiselect/FormMultiSelect.vue';
import FigButton from '../../button/Button.vue';

const props = defineProps({
    ...FigFormMultiSelect.props,

    taxCodes: {
        type: Array,
        default() {
            return [];
        }
    },

    whiteList: {
        type: Array,
        default() {
            return []
        }
    },

    allowOptionToggle: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits([
    'update:modelValue'
]);

const selected = ref(null);
const allOptions = ref([]);
const whitelistOptions = ref([]);
const currentOptsIsWhiteList = ref(false);

const canToggleWhitelist = computed(() => {
    return props.allowOptionToggle && !!props.whiteList.length;
});

const selectOpts = computed(() => {
    return currentOptsIsWhiteList.value ? whitelistOptions.value : allOptions.value;
});

function emitInput() {
    emit('update:modelValue', selected.value?.id);
}

function toggleWhiteListOpts() {
    currentOptsIsWhiteList.value = !currentOptsIsWhiteList.value;
}

function createOptions() {
    const whiteListOpts = [];

    props.taxCodes.forEach((obj) => {
        if(props.modelValue === obj.id) {
            selected.value = obj;
        }

        if(props.whiteList.includes(obj.id)) {
            whiteListOpts.push(obj);
        }
    });

    allOptions.value = [ ...props.taxCodes ];
    whitelistOptions.value = whiteListOpts;
}


watch(
    () => props.modelValue,
    (newVal) => {
        props.taxCodes?.forEach((obj) => {
            if(newVal === obj.id) {
                selected.value = obj;
            }
        });

        currentOptsIsWhiteList.value = props.whiteList.includes(selected.value?.id);
    },
    { immediate: true }
);

watch(
    () => props.taxCodes,
    () => {
        createOptions();
    },
    { immediate: true }
);
</script>


<template>
    <div>
        <fig-form-multi-select
            v-model="selected"
            @update:modelValue="emitInput"
            value-prop="id"
            label="name"
            v-bind="$attrs"
            object
            mode="single"
            :options="selectOpts" />
        <div class="px-3 text-gray-500">
            <div v-if="selected?.description" class="text-sm">{{ selected.description }}</div>
            <fig-button
                v-if="canToggleWhitelist"
                variant="link"
                size="sm"
                :icon="currentOptsIsWhiteList ? 'filter-off' : 'filter'"
                @click="toggleWhiteListOpts">{{ currentOptsIsWhiteList ? $t('See all tax codes') : $t('See common tax codes') }}</fig-button>
        </div>
    </div>
</template>
