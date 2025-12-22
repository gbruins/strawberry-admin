<script>
export default {
    name: 'CartDetailBillingCard'
}
</script>

<script setup>
import FigAddress from '@/components/figleaf/address/Address.vue';
import FigIcon from '@/components/figleaf/icon/FigIcon.vue';
import FigIconLabel from '@/components/figleaf/iconLabel/IconLabel.vue';
import FigTextCard from '@/components/figleaf/textCard/TextCard.vue';

const props = defineProps({
    cart: {
        type: Object,
        default: () => ({})
    }
});
</script>

<template>
    <fig-text-card variant="white">
        <template v-slot:header_left>
            <fig-icon-label>
                <template v-slot:left>
                    <fig-icon
                        icon="file-invoice"
                        width="26"
                        height="26"
                        :stroke-width="1" />
                </template>
                <div class="text-lg font-bold">{{ $t('Billing') }}</div>
            </fig-icon-label>
        </template>

        <fig-address
            :first-name="cart?.billing_firstName"
            :last-name="cart?.billing_lastName"
            :company="cart?.billing_company"
            :street-address="cart?.billing_streetAddress"
            :extended-address="cart?.billing_extendedAddress"
            :city="cart?.billing_city"
            :state="cart?.billing_state"
            :zip="cart?.billing_postalCode"
            :country-code="cart?.billing_countryCodeAlpha2" />
    </fig-text-card>
</template>
