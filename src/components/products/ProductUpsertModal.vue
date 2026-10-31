<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Overlay from '@/components/Overlay.vue';
import MoneyInput from '@/components/MoneyInput.vue';
import ProductTypeSelect from '@/components/productTypes/ProductTypeSelect.vue';
import StripeTaxCodeSelect from '@/components/products/StripeTaxCodeSelect.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

const emit = defineEmits([
    'success'
]);

const { t } = useI18n();
const $apiCreate = useApi('product.create');
const $apiUpdate = useApi('product.update');
const $apiRead = useApi('product.read');
const { successToast } = useToast();

const open = ref(false);
const updateId: Ref<string | null> = ref(null);

const form = reactive({
    title: '',
    description: '',
    product_type: null,
    base_price: 0,
    stripe_price_id: null,
    stripe_product_id: null,
    stripe_tax_code: null,
    published: true
});

function getById(id: string) {
    return $apiRead.tryCatch(
        async () => {
            const response = await $apiRead.run(id);

            form.title = response.data?.title || '';
            form.description = response.data?.description || '';
            form.product_type = response.data?.product_type || null;
            form.base_price = response.data?.base_price || 0;
            form.stripe_price_id = response.data?.stripe_price_id || null;
            form.stripe_product_id = response.data?.stripe_product_id || null;
            form.stripe_tax_code = response.data?.stripe_tax_code || null;
            form.published = response.data?.published !== undefined ? response.data.published : true;

            updateId.value = id;
        }
    );
}

function onSubmit() {
    const api = updateId.value ? $apiUpdate : $apiCreate;
    const formData = updateId.value ? { id: updateId.value, ...form } : { ...form };

    return api.tryCatch(
        async () => {
            const data = { ...formData };
            delete data.stripe_price_id;
            delete data.stripe_product_id;

            await api.run(data);

            successToast({
                title: t('Product saved successfully')
            });

            hide();
            emit('success');
        }
    );
}

function hide() {
    open.value = false;
}

function resetData() {
    updateId.value = null;

    form.title = '';
    form.description = '';
    form.product_type = null;
    form.base_price = 0;
    form.stripe_price_id = null;
    form.stripe_product_id = null;
    form.stripe_tax_code = null;
    form.published = true;
}

function show(id) {
    resetData();

    if(id) {
        getById(id);
    }

    open.value = true;
}

defineExpose({
    show
});
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent class="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{{ updateId ? t('Update product') : t('Create product') }}</DialogTitle>
                <DialogDescription class="sr-only">{{ updateId ? t('Update product') : t('Create product') }}</DialogDescription>
            </DialogHeader>

            <Overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
                <div class="grid grid-cols-1 gap-4">
                    <!-- published -->
                    <div class="flex items-center gap-2">
                        <Checkbox id="product-published" v-model="form.published" />
                        <Label for="product-published">{{ t('Published') }}</Label>
                    </div>

                    <!-- title -->
                    <div class="grid gap-1.5">
                        <Label for="product-title">{{ t('Title') }}</Label>
                        <Input id="product-title" v-model="form.title" />
                    </div>

                    <!-- description -->
                    <div class="grid gap-1.5">
                        <Label for="product-description">{{ t('Description') }}</Label>
                        <Input id="product-description" v-model="form.description" />
                    </div>

                    <!-- product type -->
                    <div class="grid gap-1.5">
                        <Label>{{ t('Product type') }}</Label>
                        <ProductTypeSelect v-model="form.product_type" clearable />
                    </div>

                    <!-- base price -->
                    <div class="grid gap-1.5">
                        <Label>{{ t('Price') }}</Label>
                        <MoneyInput v-model="form.base_price" />
                    </div>

                    <!-- stripe tax code -->
                    <div class="grid gap-1.5">
                        <Label>{{ t('Stripe Tax Code') }}</Label>
                        <StripeTaxCodeSelect v-model="form.stripe_tax_code" />
                    </div>

                    <template v-if="updateId">
                        <!-- stripe price id -->
                        <div class="grid gap-1.5">
                            <Label>{{ t('Stripe Price ID') }}</Label>
                            <div class="text-sm text-muted-foreground">{{ form.stripe_price_id }}</div>
                        </div>

                        <!-- stripe product id -->
                        <div class="grid gap-1.5">
                            <Label>{{ t('Stripe Product ID') }}</Label>
                            <div class="text-sm text-muted-foreground">{{ form.stripe_product_id }}</div>
                        </div>
                    </template>
                </div>
            </Overlay>

            <DialogFooter class="sm:justify-center">
                <Button @click="onSubmit">{{ t('Submit') }}</Button>
                <Button variant="ghost" @click="hide">{{ t('Cancel') }}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
