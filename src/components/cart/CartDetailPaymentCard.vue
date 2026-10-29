<script>
export default {
    name: 'CartDetailPaymentCard'
}
</script>

<script setup>
import { useI18n } from 'vue-i18n';
import { CreditCardIcon } from '@lucide/vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CardLastFour from '@/components/CardLastFour.vue';

const props = defineProps({
    cart: {
        type: Object
    },

    payment: {
        type: Object
    }
});

const { t } = useI18n();
</script>

<template>
    <Card>
        <CardHeader class="border-b">
            <CardTitle class="flex items-center gap-2 text-lg font-bold">
                <CreditCardIcon class="size-6" />
                {{ t('Payment') }}
            </CardTitle>
        </CardHeader>

        <CardContent>
            <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm items-center">
                <!-- payment method -->
                <div class="text-muted-foreground">{{ t('Payment method') }}:</div>
                <CardLastFour
                    :type="payment?.payment_method_details?.card?.brand"
                    :last-four="payment?.payment_method_details?.card?.last4" />

                <div class="text-muted-foreground">{{ t('Stripe details') }}:</div>
                <a :href="`https://dashboard.stripe.com/payments/${cart?.stripe_payment_intent_id}`"
                    target="_blank"
                    class="text-primary underline-offset-4 hover:underline">{{ t('View') }}</a>
            </div>
        </CardContent>
    </Card>
</template>
