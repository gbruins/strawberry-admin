
<script>
export default {
    name: 'ProductTaxCodeSelect'
}
</script>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import useStripeTaxCodes from '@/composables/useStripeTaxCodes.js';
import FigFormMultiSelect from '@/components/figleaf/form/multiselect/FormMultiSelect.vue';
import FigFormSelectStripeTaxCode from '@/components/figleaf/form/selectStripeTaxCode/FormSelectStripeTaxCode.vue';

const props = defineProps({
    clearable: {
        type: Boolean,
        default: true
    }
});

const { getWhiteList, getDescriptionForTaxCode } = useStripeTaxCodes();
const whiteList = getWhiteList();

const modelValue = defineModel();
const selectedDescription = ref(null);

const selectOptions = whiteList.map(item => ({
    label: item.name,
    value: item.id
}));

function setDescription(value) {
    selectedDescription.value = getDescriptionForTaxCode(value);
}

onMounted(() => {
    const first = whiteList[0].id;
    modelValue.value = first;
    setDescription(first);
});
</script>


<template>
    <div>
        <fig-form-multi-select
            v-model="modelValue"
            mode="single"
            :options="selectOptions"
            @update:modelValue="setDescription" />

        <div class="text-sm text-gray-500 px-2" v-if="selectedDescription">{{ selectedDescription }}</div>
    </div>
</template>
