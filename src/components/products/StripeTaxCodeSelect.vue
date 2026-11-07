<script setup lang="ts">
import { computed } from 'vue';
import SearchableSelect from '@/components/SearchableSelect.vue';
import { STRIPE_TAX_CODES, getStripeTaxCodeDescription } from '@/constants/stripeTaxCodes';

// Pure v-model control. (It used to force the first code into the model on mount, which could
// clobber a product's saved code depending on load timing — the default now lives in the form's
// defaults instead.)

const modelValue = defineModel<string | null>();

const options = STRIPE_TAX_CODES.map((code) => ({ label: code.name, value: code.id }));
const description = computed(() => getStripeTaxCodeDescription(modelValue.value));
</script>

<template>
    <div>
        <SearchableSelect v-model="modelValue" :options="options" />
        <div v-if="description" class="text-sm text-muted-foreground px-2 mt-1">{{ description }}</div>
    </div>
</template>
