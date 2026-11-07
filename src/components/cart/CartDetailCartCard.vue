<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ShoppingCartIcon } from '@lucide/vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SectionCard from '@/components/SectionCard.vue';
import JsonTree from '@/components/JsonTree.vue';
import type { Cart } from '@/types/cart';

defineProps<{ cart: Cart | null }>();
const { t } = useI18n();
const open = ref(false);
</script>

<template>
    <SectionCard :title="t('Cart')" :icon="ShoppingCartIcon">
        <Button variant="outline" size="sm" @click="open = true">{{ t('view raw data') }}</Button>

        <Dialog v-model:open="open">
            <DialogContent class="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{{ t('Cart') }}</DialogTitle>
                    <DialogDescription class="sr-only">{{ t('view raw data') }}</DialogDescription>
                </DialogHeader>
                <JsonTree :data="cart" :level="1" />
            </DialogContent>
        </Dialog>
    </SectionCard>
</template>
