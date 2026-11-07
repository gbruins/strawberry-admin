<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import Overlay from '@/components/Overlay.vue';
import Format8601 from '@/components/Format8601.vue';
import { Label } from '@/components/ui/label';
import CartStatusBadge from '@/components/cart/CartStatusBadge.vue';
import CartDetailPaymentCard from '@/components/cart/CartDetailPaymentCard.vue';
import CartDetailBillingCard from '@/components/cart/CartDetailBillingCard.vue';
import CartDetailCartCard from '@/components/cart/CartDetailCartCard.vue';
import CartDetailNotesCard from '@/components/cart/CartDetailNotesCard.vue';
import CartDetailItemsCard from '@/components/cart/CartDetailItemsCard.vue';
import useApi from '@/composables/useApi';
import type { Cart } from '@/types/cart';

const $apiRead = useApi('cart.read');
const { t } = useI18n();
const route = useRoute();

const cart = ref<Cart | null>(null);

function fetchData(id: string) {
    return $apiRead.tryCatch(async () => {
        const response = await $apiRead.run(id);
        cart.value = response.data;
    });
}

// Watched, not read once: navigating cart → cart reuses this component instance.
watch(() => route.params.id as string, fetchData, { immediate: true });
</script>

<template>
    <PageTitle>{{ t('Cart') }}</PageTitle>

    <Overlay :show="$apiRead.isLoading.value">
        <div class="grid grid-cols-1 gap-10">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
                <div class="grid gap-1.5">
                    <Label class="font-semibold">{{ t('Status') }}:</Label>
                    <CartStatusBadge :closed-at="cart?.closed_at" with-date />
                </div>

                <div class="grid gap-1.5">
                    <Label class="font-semibold">{{ t('Created') }}:</Label>
                    <Format8601 :date="cart?.created_at" />
                </div>

                <div class="grid gap-1.5">
                    <Label class="font-semibold">{{ t('Pickup code') }}:</Label>
                    <div>{{ cart?.pickup_code ?? '—' }}</div>
                </div>
            </div>

            <CartDetailItemsCard :cart="cart" />

            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                <CartDetailCartCard :cart="cart" />
                <CartDetailBillingCard :cart="cart" />
                <CartDetailPaymentCard :cart="cart" />
            </div>

            <CartDetailNotesCard v-if="cart" :cart="cart" />
        </div>
    </Overlay>
</template>
