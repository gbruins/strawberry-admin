<script>
export default {
    name: 'CartDetailBillingCard'
}
</script>

<script setup>
import { useI18n } from 'vue-i18n';
import { ReceiptIcon } from '@lucide/vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AddressDisplay from '@/components/AddressDisplay.vue';

const props = defineProps({
    cart: {
        type: Object,
        default: () => ({})
    }
});

const { t } = useI18n();
</script>

<template>
    <Card>
        <CardHeader class="border-b">
            <CardTitle class="flex items-center gap-2 text-lg font-bold">
                <ReceiptIcon class="size-6" />
                {{ t('Billing') }}
            </CardTitle>
        </CardHeader>

        <CardContent>
            <AddressDisplay
                :first-name="cart?.billing_firstName"
                :last-name="cart?.billing_lastName"
                :company="cart?.billing_company"
                :street-address="cart?.billing_streetAddress"
                :extended-address="cart?.billing_extendedAddress"
                :city="cart?.billing_city"
                :state="cart?.billing_state"
                :zip="cart?.billing_postalCode"
                :country-code="cart?.billing_countryCodeAlpha2" />
        </CardContent>
    </Card>
</template>
