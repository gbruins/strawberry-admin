<script>
export default {
    name: 'CartDetailPaymentCard'
}
</script>

<script setup>
import FigCardLastFour from '@/components/figleaf/cardLastFour/CardLastFour.vue';
import FigTextCard from '@/components/figleaf/textCard/TextCard.vue';
import FigFormat8601 from '@/components/figleaf/format8601/Format8601.vue';
import FigLabelValueGroup from '@/components/figleaf/labelValueGroup/LabelValueGroup.vue';
import FigLabelValue from '@/components/figleaf/labelValueGroup/LabelValue.vue';
import FigIcon from '@/components/figleaf/icon/FigIcon.vue';
import FigIconLabel from '@/components/figleaf/iconLabel/IconLabel.vue';

const props = defineProps({
    cart: {
        type: Object
    },

    payment: {
        type: Object
    }
});
</script>

<template>
    <fig-text-card variant="white">
        <template v-slot:header_left>
            <fig-icon-label>
                <template v-slot:left>
                    <fig-icon
                        icon="credit-card"
                        width="26"
                        height="26"
                        :stroke-width="1" />
                </template>
                <div class="text-lg font-bold">{{ $t('Payment') }}</div>
            </fig-icon-label>
        </template>

        <fig-label-value-group density="md" display="table" class="text-sm">
            <!-- payment method -->
            <fig-label-value>
                <template v-slot:label>{{ $t('Payment method') }}:</template>
                <fig-card-last-four
                    :type="payment?.payment_method_details?.card?.brand"
                    :last-four="payment?.payment_method_details?.card?.last4" />
            </fig-label-value>

            <fig-label-value>
                <template v-slot:label>
                    {{ $t('Stripe details') }}:
                </template>
                <a :href="`https://dashboard.stripe.com/payments/${cart?.stripe_payment_intent_id}`"
                    target="_blank">{{ $t('View') }}</a>
            </fig-label-value>
        </fig-label-value-group>
    </fig-text-card>
</template>
