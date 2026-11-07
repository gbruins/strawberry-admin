<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ReceiptIcon } from '@lucide/vue';
import SectionCard from '@/components/SectionCard.vue';
import AddressDisplay from '@/components/AddressDisplay.vue';
import { billingAddress } from '@/utils/address';
import type { Cart } from '@/types/cart';

const props = defineProps<{ cart: Cart | null }>();
const { t } = useI18n();

const address = computed(() => billingAddress(props.cart));
</script>

<template>
    <SectionCard :title="t('Billing')" :icon="ReceiptIcon">
        <AddressDisplay :address="address" />
    </SectionCard>
</template>
