<script>
export default {
    name: 'CartItemsCard'
}
</script>

<script setup>
import FigIcon from '@/components/figleaf/icon/FigIcon.vue';
import FigTextCard from '@/components/figleaf/textCard/TextCard.vue';
import FigIconLabel from '@/components/figleaf/iconLabel/IconLabel.vue';
import FigTableSimple from '@/components/figleaf/tableSimple/TableSimple.vue';
import FigTh from '@/components/figleaf/tableSimple/Th.vue';
import FigTr from '@/components/figleaf/tableSimple/Tr.vue';
import FigTd from '@/components/figleaf/tableSimple/Td.vue';
import FigTrNoResults from '@/components/figleaf/tableSimple/TrNoResults.vue';
import FigMoney from '@/components/figleaf/money/Money.vue';
import FigNumber from '@/components/figleaf/number/Number.vue';
import FigLabelValueGroup from '@/components/figleaf/labelValueGroup/LabelValueGroup.vue';
import FigLabelValue from '@/components/figleaf/labelValueGroup/LabelValue.vue';


const props = defineProps({
    cart: {
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
                        icon="cookie"
                        width="26"
                        height="26"
                        :stroke-width="1" />
                </template>
                <div class="text-lg font-bold">{{ $t('Cart items') }}</div>
            </fig-icon-label>
        </template>

        <fig-table-simple
            striped
            hover>
            <template #head>
                <fig-tr>
                    <fig-th>{{ $t('Product') }}</fig-th>
                    <fig-th>{{ $t('Quantity') }}</fig-th>
                    <fig-th>{{ $t('Price') }}</fig-th>
                    <fig-th>{{ $t('Subtotal') }}</fig-th>
                </fig-tr>
            </template>

            <fig-tr v-for="(obj, idx) in props.cart?.cart_items" :key="idx">
                <!-- product -->
                <fig-td>
                    <div>{{ obj.product.title }}</div>
                    <div
                        v-if="obj.product.description"
                        class="pl-4 text-xs text-gray-500">{{ obj.product.description }}</div>
                </fig-td>

                <!-- quantity -->
                <fig-td class="text-right">
                    <fig-number :value="obj.qty" />
                </fig-td>

                <!-- price -->
                <fig-td class="text-right">
                    <fig-money :cents="obj.product.base_price" />
                </fig-td>

                <!-- subtotal -->
                <fig-td class="text-right">
                    <fig-money :cents="obj.price_subtotal" />
                </fig-td>
            </fig-tr>

            <fig-tr-no-results v-if="!props.cart?.cart_items?.length" :colspan="4" />
        </fig-table-simple>


        <div class="flex justify-end w-full mt-2">
            <fig-label-value-group density="md" display="table" class="text-sm">
                <!-- sub total -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Subtotal') }}:</template>
                    <div class="font-mono text-right"><fig-money :cents="cart?.price_subtotal" /></div>
                </fig-label-value>

                <!-- sales tax -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Tax') }}:</template>
                    <div class="font-mono text-right"><fig-money :cents="cart?.sales_tax" /></div>
                </fig-label-value>

                <!-- grand total -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Grand total') }}:</template>
                    <div class="font-mono text-right"><fig-money :cents="cart?.grand_total" /></div>
                </fig-label-value>
            </fig-label-value-group>
        </div>
    </fig-text-card>
</template>
