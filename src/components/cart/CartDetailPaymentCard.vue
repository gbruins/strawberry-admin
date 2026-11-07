<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { CreditCardIcon, ExternalLinkIcon } from '@lucide/vue';
import SectionCard from '@/components/SectionCard.vue';
import type { Cart } from '@/types/cart';

// The server only stores the Stripe PaymentIntent id (not card brand/last4), so this links out
// to Stripe for payment details. (It used to render a card-brand row from a `payment` prop that
// nothing ever passed.)

defineProps<{ cart: Cart | null }>();
const { t } = useI18n();
</script>

<template>
    <SectionCard :title="t('Payment')" :icon="CreditCardIcon">
        <a
            v-if="cart?.stripe_payment_intent_id"
            :href="`https://dashboard.stripe.com/payments/${cart.stripe_payment_intent_id}`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline">
            {{ t('View in Stripe') }}
            <ExternalLinkIcon class="size-3.5" />
        </a>

        <p v-else class="text-sm text-muted-foreground">{{ t('No payment recorded') }}</p>
    </SectionCard>
</template>
