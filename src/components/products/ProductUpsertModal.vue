<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { required } from '@vuelidate/validators';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FormDialog from '@/components/FormDialog.vue';
import FormField from '@/components/FormField.vue';
import MoneyInput from '@/components/MoneyInput.vue';
import ProductTypeSelect from '@/components/productTypes/ProductTypeSelect.vue';
import StripeTaxCodeSelect from '@/components/products/StripeTaxCodeSelect.vue';
import useUpsertForm from '@/composables/useUpsertForm';
import { useProducts, useProductTypes } from '@/composables/useLookups';
import { DEFAULT_STRIPE_TAX_CODE } from '@/constants/stripeTaxCodes';

const emit = defineEmits<{ success: [] }>();
const { t } = useI18n();
const products = useProducts();
const productTypes = useProductTypes();

// New products default to the built-in Pizza type
const defaultProductType = () => productTypes.items.value.find((type) => type.built_in)?.value ?? null;

const upsert = useUpsertForm({
    resource: 'product',
    defaults: () => ({
        title: '',
        description: '',
        product_type: defaultProductType() as number | null,
        base_price: 0,
        stripe_tax_code: DEFAULT_STRIPE_TAX_CODE as string | null,
        published: true
    }),
    rules: () => ({ title: { required }, product_type: { required } }),
    successMessage: () => t('Product saved successfully'),
    onSaved: () => {
        products.refresh();
        emit('success');
    }
});

// The types may still be loading when the dialog opens
watch(() => productTypes.items.value, () => {
    if (!upsert.isEdit && upsert.form.product_type === null) {
        upsert.form.product_type = defaultProductType();
    }
});

defineExpose({ show: upsert.show });
</script>

<template>
    <FormDialog
        v-model:open="upsert.open"
        :title="upsert.isEdit ? t('Update product') : t('Create product')"
        :busy="upsert.isBusy"
        content-class="sm:max-w-2xl"
        @submit="upsert.submit">
        <div class="flex items-center gap-2">
            <Checkbox id="product-published" v-model="upsert.form.published" />
            <Label for="product-published">{{ t('Published') }}</Label>
        </div>

        <FormField :label="t('Title')" for="product-title" :field="upsert.v$.title">
            <Input id="product-title" v-model="upsert.form.title" />
        </FormField>

        <FormField :label="t('Description')" for="product-description">
            <Input id="product-description" v-model="upsert.form.description" />
        </FormField>

        <FormField :label="t('Product type')" :field="upsert.v$.product_type">
            <ProductTypeSelect v-model="upsert.form.product_type" />
        </FormField>

        <FormField :label="t('Price')">
            <MoneyInput v-model="upsert.form.base_price" />
        </FormField>

        <FormField :label="t('Stripe Tax Code')">
            <StripeTaxCodeSelect v-model="upsert.form.stripe_tax_code" />
        </FormField>

        <!-- Stripe ids are server-managed: shown for reference, never sent back -->
        <template v-if="upsert.isEdit">
            <FormField :label="t('Stripe Price ID')">
                <div class="text-sm text-muted-foreground">{{ upsert.record?.stripe_price_id }}</div>
            </FormField>

            <FormField :label="t('Stripe Product ID')">
                <div class="text-sm text-muted-foreground">{{ upsert.record?.stripe_product_id }}</div>
            </FormField>
        </template>
    </FormDialog>
</template>
