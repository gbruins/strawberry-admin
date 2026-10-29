<script setup>
import { ref, onMounted } from 'vue';
import useStripeTaxCodes from '@/composables/useStripeTaxCodes.js';
import SearchableSelect from '@/components/SearchableSelect.vue';

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
        <SearchableSelect
            v-model="modelValue"
            :options="selectOptions"
            @update:modelValue="setDescription" />

        <div class="text-sm text-muted-foreground px-2 mt-1" v-if="selectedDescription">{{ selectedDescription }}</div>
    </div>
</template>
