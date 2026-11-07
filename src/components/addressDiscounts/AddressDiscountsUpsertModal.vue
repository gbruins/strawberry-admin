<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { required, minValue, maxValue } from '@vuelidate/validators';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FormDialog from '@/components/FormDialog.vue';
import FormField from '@/components/FormField.vue';
import AllowedStreetsSelect from '@/components/allowedStreets/AllowedStreetsSelect.vue';
import useUpsertForm from '@/composables/useUpsertForm';

defineOptions({ name: 'AddressDiscountsUpsertModal' });

const emit = defineEmits<{ success: [] }>();
const { t } = useI18n();

const upsert = useUpsertForm({
    resource: 'addressDiscount',
    defaults: () => ({
        street_number: '',
        allowed_street_id: null as string | null,
        discount_percent: 0,
        active: true
    }),
    rules: () => ({
        street_number: { required },
        allowed_street_id: { required },
        discount_percent: { required, minValue: minValue(0), maxValue: maxValue(100) }
    }),
    successMessage: () => t('Address discount saved successfully'),
    onSaved: () => emit('success')
});

defineExpose({ show: upsert.show });
</script>

<template>
    <FormDialog
        v-model:open="upsert.open"
        :title="upsert.isEdit ? t('Update address discount') : t('Create address discount')"
        :busy="upsert.isBusy"
        @submit="upsert.submit">
        <FormField :label="t('Street number')" for="address-discount-street-number" :field="upsert.v$.street_number">
            <Input id="address-discount-street-number" v-model="upsert.form.street_number" />
        </FormField>

        <FormField :label="t('Street name')" :field="upsert.v$.allowed_street_id">
            <AllowedStreetsSelect v-model="upsert.form.allowed_street_id" />
        </FormField>

        <FormField :label="t('Discount percentage')" for="address-discount-percent" :field="upsert.v$.discount_percent">
            <Input
                id="address-discount-percent"
                v-model.number="upsert.form.discount_percent"
                type="number"
                min="0"
                max="100"
                step="1" />
        </FormField>

        <div class="flex items-center gap-2">
            <Checkbox id="address-discount-active" v-model="upsert.form.active" />
            <Label for="address-discount-active">{{ t('Active') }}</Label>
        </div>
    </FormDialog>
</template>
