<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { required } from '@vuelidate/validators';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FormDialog from '@/components/FormDialog.vue';
import FormField from '@/components/FormField.vue';
import useUpsertForm from '@/composables/useUpsertForm';

defineOptions({ name: 'AllowedStreetsUpsertModal' });

const emit = defineEmits<{ success: [] }>();
const { t } = useI18n();

const upsert = useUpsertForm({
    resource: 'allowedStreet',
    defaults: () => ({
        street_name: '',
        active: true
    }),
    rules: () => ({ street_name: { required } }),
    successMessage: () => t('Allowed street saved successfully'),
    onSaved: () => emit('success')
});

defineExpose({ show: upsert.show });
</script>

<template>
    <FormDialog
        v-model:open="upsert.open"
        :title="upsert.isEdit ? t('Update allowed street') : t('Create allowed street')"
        :busy="upsert.isBusy"
        @submit="upsert.submit">
        <FormField :label="t('Street name')" for="allowed-street-name" :field="upsert.v$.street_name">
            <Input id="allowed-street-name" v-model="upsert.form.street_name" />
        </FormField>

        <div class="flex items-center gap-2">
            <Checkbox id="allowed-street-active" v-model="upsert.form.active" />
            <Label for="allowed-street-active">{{ t('Active') }}</Label>
        </div>
    </FormDialog>
</template>
