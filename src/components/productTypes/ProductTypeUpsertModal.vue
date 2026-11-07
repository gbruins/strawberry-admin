<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { required } from '@vuelidate/validators';
import slugify from 'slugify';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FormDialog from '@/components/FormDialog.vue';
import FormField from '@/components/FormField.vue';
import useUpsertForm from '@/composables/useUpsertForm';

defineOptions({ name: 'ProductTypeUpsertModal' });

const emit = defineEmits<{ success: [] }>();
const { t } = useI18n();

const upsert = useUpsertForm({
    resource: 'productType',
    defaults: () => ({
        name: '',
        description: '',
        ordinal: 1,
        published: true,
        // Generated from the name on create, then kept: renaming a type must not change its slug.
        // (Previously `slug` wasn't part of the form, so every save regenerated it.)
        slug: ''
    }),
    rules: () => ({ name: { required } }),
    toPayload: (form) => ({ ...form, slug: form.slug || slugify(form.name, { lower: true, strict: true }) }),
    successMessage: () => t('Product type saved successfully'),
    onSaved: () => emit('success')
});

defineExpose({ show: upsert.show });
</script>

<template>
    <FormDialog
        v-model:open="upsert.open"
        :title="upsert.isEdit ? t('Update product type') : t('Create product type')"
        :busy="upsert.isBusy"
        @submit="upsert.submit">
        <FormField :label="t('Name')" for="product-type-name" :field="upsert.v$.name">
            <Input id="product-type-name" v-model="upsert.form.name" />
        </FormField>

        <FormField :label="t('Description')" for="product-type-description">
            <Input id="product-type-description" v-model="upsert.form.description" />
        </FormField>

        <div class="flex items-center gap-2">
            <Checkbox id="product-type-published" v-model="upsert.form.published" />
            <Label for="product-type-published">{{ t('Published') }}</Label>
        </div>
    </FormDialog>
</template>
