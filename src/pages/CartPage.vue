<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import Overlay from '@/components/Overlay.vue';
import Format8601 from '@/components/Format8601.vue';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import CartDetailPaymentCard from '@/components/cart/CartDetailPaymentCard.vue';
import CartDetailBillingCard from '@/components/cart/CartDetailBillingCard.vue';
import CartDetailCartCard from '@/components/cart/CartDetailCartCard.vue';
import CartDetailNotesCard from '@/components/cart/CartDetailNotesCard.vue';
import CartDetailItemsCard from '@/components/cart/CartDetailItemsCard.vue';

import useApi from '@/composables/useApi';

const $apiRead = useApi('cart.read');
const { t } = useI18n();
const route = useRoute();

const cartId = route.params.id;
const cartData = ref(null);

function fetchData() {
    return $apiRead.tryCatch(
        async () => {
            const response = await $apiRead.run(cartId);
            cartData.value = response.data;
        }
    );
}

onMounted(() => {
    fetchData();
});
</script>

<template>
    <PageTitle>{{ t('Cart') }}</PageTitle>

    <Overlay :show="$apiRead.isLoading.value">
        <div class="grid grid-cols-1 gap-10">
            <div class="grid grid-cols-4 gap-10">
                <!-- cart status -->
                <div class="grid gap-1.5">
                    <Label class="font-semibold">{{ t('Status') }}:</Label>

                    <div v-if="cartData?.closed_at" class="flex items-center gap-2">
                        <Badge variant="success">{{ t('Closed') }}</Badge>
                        <Format8601 :date="cartData?.closed_at" />
                    </div>
                    <Badge v-else variant="destructive">{{ t('Open') }}</Badge>
                </div>

                <!-- cart created at -->
                <div class="grid gap-1.5">
                    <Label class="font-semibold">{{ t('Created') }}:</Label>
                    <Format8601 :date="cartData?.created_at" />
                </div>

                <!-- pickup code -->
                <div class="grid gap-1.5">
                    <Label class="font-semibold">{{ t('Pickup code') }}:</Label>
                    <div>{{ cartData?.pickup_code ?? '—' }}</div>
                </div>
            </div>

            <CartDetailItemsCard :cart="cartData" />

            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                <CartDetailCartCard :cart="cartData" />
                <CartDetailBillingCard :cart="cartData" />
                <CartDetailPaymentCard :cart="cartData" />
            </div>

            <CartDetailNotesCard :cart="cartData" />
        </div>
    </Overlay>
</template>
