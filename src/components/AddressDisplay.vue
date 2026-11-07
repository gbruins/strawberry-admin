<script setup lang="ts">
import { computed } from 'vue';
import type { Address } from '@/utils/address';

const props = withDefaults(defineProps<{
    address: Address;
    /** Put the country code on the city/state/zip line instead of its own line. */
    countryCodeInline?: boolean;
}>(), {
    countryCodeInline: false
});

const clean = (value?: string | number | null) => (value ?? '').toString().trim();

const name = computed(() => [clean(props.address.firstName), clean(props.address.lastName)].filter(Boolean).join(' '));
const company = computed(() => clean(props.address.company).toUpperCase());

const cityStateZip = computed(() => {
    const stateZip = [clean(props.address.state), clean(props.address.zip)].filter(Boolean).join(' ');
    const parts = [clean(props.address.city), stateZip];

    if (props.countryCodeInline) {
        parts.push(clean(props.address.countryCode));
    }

    return parts.filter(Boolean).join(', ');
});
</script>

<template>
    <div class="space-y-0.5">
        <div v-if="name">{{ name }}</div>
        <div v-if="company">{{ company }}</div>
        <div v-if="address.streetAddress">{{ address.streetAddress }}</div>
        <div v-if="address.extendedAddress">{{ address.extendedAddress }}</div>
        <div v-if="cityStateZip">{{ cityStateZip }}</div>
        <div v-if="address.countryCode && !countryCodeInline">{{ address.countryCode }}</div>
        <div v-if="address.email">{{ address.email }}</div>
        <div v-if="address.phone">{{ address.phone }}</div>
    </div>
</template>
