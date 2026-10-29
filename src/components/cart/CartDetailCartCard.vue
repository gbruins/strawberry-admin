<script>
export default {
    name: 'CartDetailCartCard'
}
</script>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ShoppingCartIcon } from '@lucide/vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import JsonTree from '@/components/JsonTree.vue';

const props = defineProps({
    cart: {
        type: Object
    }
});

const { t } = useI18n();
const open = ref(false);
</script>

<template>
    <Card>
        <CardHeader class="border-b">
            <CardTitle class="flex items-center gap-2 text-lg font-bold">
                <ShoppingCartIcon class="size-6" />
                {{ t('Cart') }}
            </CardTitle>
        </CardHeader>

        <CardContent>
            <Button variant="outline" size="sm" @click="open = true">{{ t('view raw data') }}</Button>

            <!-- raw data modal -->
            <Dialog v-model:open="open">
                <DialogContent class="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{{ t('Cart') }}</DialogTitle>
                    </DialogHeader>

                    <JsonTree :data="cart" :level="1" />
                </DialogContent>
            </Dialog>
        </CardContent>
    </Card>
</template>
