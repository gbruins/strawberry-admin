<script setup lang="ts">
import  { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';
import FigLabelValue from '@/components/figleaf/labelValueGroup/LabelValue.vue';
import FigFormat8601 from '@/components/figleaf/format8601/Format8601.vue';
import FigTag from '@/components/figleaf/tag/Tag.vue';
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
    <page-title>{{ $t('Cart') }}</page-title>

    <fig-overlay :show="$apiRead.isLoading.value">
        <div class="grid grid-cols-1 gap-10">
            <div class="grid grid-cols-4 gap-10">
                <!-- cart status -->
                <fig-label-value>
                    <template v-slot:label>
                        <span class="font-semibold">{{ $t('Status') }}</span>:
                    </template>

                    <div v-if="cartData?.closed_at">
                        <fig-tag variant="success">{{ $t('Closed') }}</fig-tag>
                        <fig-format8601 :date="cartData?.closed_at" />
                    </div>
                    <fig-tag v-else variant="error">{{ $t('Open') }}</fig-tag>
                </fig-label-value>

                <!-- cart created at -->
                <fig-label-value>
                    <template v-slot:label>
                        <span class="font-semibold">{{ $t('Created') }}</span>:
                    </template>
                    <fig-format8601 :date="cartData?.created_at" />
                </fig-label-value>
            </div>

            <cart-detail-items-card :cart="cartData" />

            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                <cart-detail-cart-card :cart="cartData" />
                <cart-detail-billing-card :cart="cartData" />
                <cart-detail-payment-card :cart="cartData" />
            </div>

            <cart-detail-notes-card :cart="cartData" />
        </div>
    </fig-overlay>
</template>
