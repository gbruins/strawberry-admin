<script>
export default {
    name: 'CartItemsCard'
}
</script>

<script setup>
import { useI18n } from 'vue-i18n';
import { CookieIcon } from '@lucide/vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import Money from '@/components/Money.vue';
import NumberDisplay from '@/components/NumberDisplay.vue';

const props = defineProps({
    cart: {
        type: Object
    }
});

const { t } = useI18n();
</script>

<template>
    <Card>
        <CardHeader class="border-b">
            <CardTitle class="flex items-center gap-2 text-lg font-bold">
                <CookieIcon class="size-6" />
                {{ t('Cart items') }}
            </CardTitle>
        </CardHeader>

        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{{ t('Product') }}</TableHead>
                        <TableHead class="text-right">{{ t('Quantity') }}</TableHead>
                        <TableHead class="text-right">{{ t('Price') }}</TableHead>
                        <TableHead class="text-right">{{ t('Subtotal') }}</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow v-for="(obj, idx) in props.cart?.cart_items" :key="idx">
                        <!-- product -->
                        <TableCell>
                            <div>{{ obj.product.title }}</div>
                            <div
                                v-if="obj.product.description"
                                class="pl-4 text-xs text-muted-foreground">{{ obj.product.description }}</div>
                        </TableCell>

                        <!-- quantity -->
                        <TableCell class="text-right">
                            <NumberDisplay :value="obj.qty" />
                        </TableCell>

                        <!-- price -->
                        <TableCell class="text-right">
                            <Money :cents="obj.product.base_price" />
                        </TableCell>

                        <!-- subtotal -->
                        <TableCell class="text-right">
                            <Money :cents="obj.price_subtotal" />
                        </TableCell>
                    </TableRow>

                    <TableRow v-if="!props.cart?.cart_items?.length">
                        <TableCell colspan="4" class="text-center text-muted-foreground">{{ t('No data') }}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <div class="flex justify-end w-full mt-2">
                <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                    <!-- sub total -->
                    <div class="text-muted-foreground">{{ t('Subtotal') }}:</div>
                    <div class="font-mono text-right"><Money :cents="cart?.price_subtotal" /></div>

                    <!-- sales tax -->
                    <div class="text-muted-foreground">{{ t('Tax') }}:</div>
                    <div class="font-mono text-right"><Money :cents="cart?.sales_tax" /></div>

                    <!-- grand total -->
                    <div class="text-muted-foreground">{{ t('Grand total') }}:</div>
                    <div class="font-mono text-right"><Money :cents="cart?.grand_total" /></div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>
