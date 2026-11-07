<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { CookieIcon } from '@lucide/vue';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import SectionCard from '@/components/SectionCard.vue';
import Money from '@/components/Money.vue';
import NumberDisplay from '@/components/NumberDisplay.vue';
import type { Cart } from '@/types/cart';

defineProps<{ cart: Cart | null }>();
const { t } = useI18n();
</script>

<template>
    <SectionCard :title="t('Cart items')" :icon="CookieIcon">
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
                <TableRow v-for="(item, idx) in cart?.cart_items" :key="idx">
                    <TableCell>
                        <div>{{ item.product.title }}</div>
                        <div v-if="item.product.description" class="pl-4 text-xs text-muted-foreground">{{ item.product.description }}</div>
                    </TableCell>
                    <TableCell class="text-right">
                        <NumberDisplay :value="item.qty" />
                    </TableCell>
                    <TableCell class="text-right">
                        <Money :cents="item.product.base_price" />
                    </TableCell>
                    <TableCell class="text-right">
                        <Money :cents="item.price_subtotal" />
                    </TableCell>
                </TableRow>

                <TableRow v-if="!cart?.cart_items?.length">
                    <TableCell :colspan="4" class="text-center text-muted-foreground">{{ t('No data') }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <div class="flex justify-end w-full mt-2">
            <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <div class="text-muted-foreground">{{ t('Subtotal') }}:</div>
                <div class="font-mono text-right"><Money :cents="cart?.price_subtotal" /></div>

                <div class="text-muted-foreground">{{ t('Tax') }}:</div>
                <div class="font-mono text-right"><Money :cents="cart?.sales_tax" /></div>

                <div class="text-muted-foreground">{{ t('Grand total') }}:</div>
                <div class="font-mono text-right"><Money :cents="cart?.grand_total" /></div>
            </div>
        </div>
    </SectionCard>
</template>
